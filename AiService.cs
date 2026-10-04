using System.Text;
using System.Text.RegularExpressions;
using System.Text.Json.Nodes;

namespace LangApp;

public sealed partial class AiService
{
    public static readonly string[] Tasks = ["placement", "story", "check", "explain", "civics"];

    private static readonly string[] CivicsTopics = ["history", "geography", "government", "culture", "traditions", "mixed"];

    private readonly IHttpClientFactory _http;
    private readonly ILogger<AiService> _log;
    private readonly string? _key;
    private readonly string _model;

    // No API key configured -> canned content so the UI can still be tried.
    public bool Demo => string.IsNullOrWhiteSpace(_key);

    public AiService(IHttpClientFactory http, IConfiguration cfg, ILogger<AiService> log)
    {
        _http = http;
        _log = log;
        _key = cfg["ANTHROPIC_API_KEY"] ?? cfg["Anthropic:ApiKey"];
        _model = cfg["Anthropic:Model"] ?? "claude-haiku-4-5-20251001";
    }

    public async Task<JsonObject> RunAsync(string task, JsonObject req, CancellationToken ct)
    {
        var input = ValidateRequest(task, req);

        if (Demo)
        {
            var canned = DemoData.Get(task, input);
            Finish(task, canned);
            return canned;
        }

        var prompt = BuildPrompt(task, input);
        var maxTokens = task is "story" or "civics" ? 2500 : 900;

        for (var attempt = 0; ; attempt++)
        {
            try
            {
                var text = await CallAsync(prompt, maxTokens, ct);
                var obj = ParseJson(text);
                Finish(task, obj);
                return obj;
            }
            catch (InvalidDataException e) when (attempt == 0)
            {
                _log.LogWarning("AI output rejected for {Task}: {Reason}; retrying", task, e.Message);
            }
        }
    }

    // ---------- request validation ----------

    private static JsonObject ValidateRequest(string task, JsonObject req)
    {
        var o = new JsonObject { ["lang"] = task == "civics" ? "el" : Lang(req) };
        if (task is "placement" or "story" or "check")
            o["level"] = Level(req);

        switch (task)
        {
            case "placement":
                o["asked"] = StrList(req, "asked", 12, 200);
                break;
            case "story":
                o["topic"] = Str(req, "topic", 60, required: false);
                o["words"] = StrList(req, "words", 15, 40);
                break;
            case "check":
                o["text"] = Str(req, "text", 1200, required: true);
                o["prompt"] = Str(req, "prompt", 300, required: false);
                break;
            case "explain":
                o["word"] = Str(req, "word", 60, required: true);
                o["context"] = Str(req, "context", 400, required: false);
                break;
            case "civics":
                var topic = Str(req, "topic", 20, required: false);
                o["topic"] = Array.IndexOf(CivicsTopics, topic) >= 0 ? topic : "mixed";
                o["count"] = Math.Clamp((int?)req["count"] ?? 5, 1, 8);
                break;
        }
        return o;
    }

    private static string Lang(JsonObject r)
    {
        var l = (string?)r["lang"];
        return l is "el" or "en" ? l : throw new ArgumentException("bad_lang");
    }

    private static string Level(JsonObject r)
    {
        var l = (string?)r["level"] ?? "";
        return LevelRx().IsMatch(l) ? l : throw new ArgumentException("bad_level");
    }

    private static string Str(JsonObject r, string key, int max, bool required)
    {
        var s = ((string?)r[key] ?? "").Trim();
        if (required && s.Length == 0) throw new ArgumentException($"missing_{key}");
        return s.Length > max ? s[..max] : s;
    }

    private static JsonArray StrList(JsonObject r, string key, int maxItems, int maxLen)
    {
        var arr = new JsonArray();
        if (r[key] is JsonArray src)
            foreach (var n in src.Take(maxItems))
            {
                var s = ((string?)n ?? "").Trim();
                if (s.Length > 0) arr.Add(s.Length > maxLen ? s[..maxLen] : s);
            }
        return arr;
    }

    [GeneratedRegex(@"^(A1|A2|B1|B2)\+?$")]
    private static partial Regex LevelRx();

    // ---------- prompts ----------

    private const string System =
        "You are a friendly, precise language tutor for an adult Arabic speaker (Levantine background). " +
        "Explanations are in simple Modern Standard Arabic. " +
        "Reply with ONE valid JSON object only: no markdown fences, no commentary before or after.";

    private static string LangName(string l) => l == "el" ? "Modern Greek (with correct accents)" : "English";

    private static string WordRange(string level) => level.TrimEnd('+') switch
    {
        "A1" => "40-70",
        "A2" => "70-110",
        "B1" => "110-170",
        _ => "170-230",
    };

    private string BuildPrompt(string task, JsonObject i)
    {
        var lang = (string)i["lang"]!;
        var ln = LangName(lang);
        var level = (string?)i["level"];

        return task switch
        {
            "placement" =>
                $"Write ONE multiple-choice question in {ln} for a placement test at CEFR level {level}. " +
                "Pick the skill at random: vocabulary, grammar, or short reading. The question and options are in the target language only. " +
                "Exactly 4 options, exactly one correct, plausible distractors. " +
                $"Do not repeat or closely resemble these earlier questions: {i["asked"]!.ToJsonString()}. " +
                "JSON: {\"skill\":\"vocab|grammar|reading\",\"question\":\"...\",\"options\":[\"\",\"\",\"\",\"\"],\"answerIndex\":0,\"explanation_ar\":\"one short Arabic sentence\"}",

            "story" =>
                $"Write a short story in {ln} at CEFR level {level}, about {(string.IsNullOrEmpty((string?)i["topic"]) ? "everyday life" : (string)i["topic"]!)}. " +
                $"Length: {WordRange(level!)} words. Use vocabulary and grammar appropriate for exactly that level; no rare words. " +
                (((JsonArray)i["words"]!).Count > 0 ? $"Naturally include these words if they fit: {i["words"]!.ToJsonString()}. " : "") +
                "Then write 4 multiple-choice comprehension questions in the target language (4 options each, one correct), and 6-8 vocabulary items from the story. " +
                "JSON: {\"title\":\"\",\"text\":\"\",\"translation_ar\":\"full Arabic translation\",\"vocab\":[{\"word\":\"as written in the story\",\"meaning_ar\":\"\"}],\"questions\":[{\"question\":\"\",\"options\":[\"\",\"\",\"\",\"\"],\"answerIndex\":0}]}",

            "check" =>
                $"A learner at CEFR {level} wrote the following in {ln}" +
                (string.IsNullOrEmpty((string?)i["prompt"]) ? "" : $" (task: {i["prompt"]})") +
                $":\n\"\"\"\n{i["text"]}\n\"\"\"\n" +
                "Correct it, keeping their meaning and level. List at most 5 of the most important mistakes with a simple Arabic explanation each. Be encouraging. " +
                "JSON: {\"corrected\":\"\",\"score\":0-100,\"mistakes\":[{\"wrong\":\"\",\"right\":\"\",\"explanation_ar\":\"\"}],\"tip_ar\":\"one short Arabic tip\"}",

            "explain" =>
                $"Explain the {ln} word \"{i["word"]}\"" +
                (string.IsNullOrEmpty((string?)i["context"]) ? "" : $" as used in: \"{i["context"]}\"") +
                ". " +
                "JSON: {\"lemma\":\"dictionary form\",\"pos\":\"part of speech\",\"meaning_ar\":\"\",\"note_ar\":\"grammar note in Arabic (e.g. verb tense/person, noun gender/case); empty if none\",\"example\":\"short example sentence in the target language\",\"example_ar\":\"Arabic translation\"}",

            _ => // civics
                $"Create {i["count"]} multiple-choice questions in the style of the Greek naturalization (citizenship) exam, topic: {i["topic"]} " +
                "(Greek history, geography, government and institutions, culture, traditions and holidays). " +
                "Write questions and options in simple Greek (level A2-B1). Only use well-established facts you are certain of; skip anything uncertain. " +
                "4 options, exactly one correct. " +
                "JSON: {\"questions\":[{\"topic\":\"\",\"question\":\"\",\"options\":[\"\",\"\",\"\",\"\"],\"answerIndex\":0,\"explanation_ar\":\"short Arabic explanation\"}]}",
        };
    }

    // ---------- model call ----------

    private async Task<string> CallAsync(string prompt, int maxTokens, CancellationToken ct)
    {
        var body = new JsonObject
        {
            ["model"] = _model,
            ["max_tokens"] = maxTokens,
            ["system"] = System,
            ["messages"] = new JsonArray(new JsonObject { ["role"] = "user", ["content"] = prompt }),
        };

        using var msg = new HttpRequestMessage(HttpMethod.Post, "v1/messages") { Content = new StringContent(body.ToJsonString(), Encoding.UTF8, "application/json") };
        msg.Headers.Add("x-api-key", _key);
        msg.Headers.Add("anthropic-version", "2023-06-01");

        using var res = await _http.CreateClient("anthropic").SendAsync(msg, ct);
        var raw = await res.Content.ReadAsStringAsync(ct);
        if (!res.IsSuccessStatusCode)
        {
            _log.LogError("Anthropic API returned {Status}: {Body}", (int)res.StatusCode, raw);
            throw new HttpRequestException($"anthropic_{(int)res.StatusCode}");
        }

        var sb = new StringBuilder();
        if (JsonNode.Parse(raw)?["content"] is JsonArray blocks)
            foreach (var b in blocks)
                if ((string?)b?["type"] == "text") sb.Append((string?)b["text"]);
        return sb.ToString();
    }

    private static JsonObject ParseJson(string text)
    {
        var start = text.IndexOf('{');
        var end = text.LastIndexOf('}');
        if (start < 0 || end <= start) throw new InvalidDataException("no_json");
        try
        {
            return JsonNode.Parse(text[start..(end + 1)]) as JsonObject ?? throw new InvalidDataException("not_object");
        }
        catch (System.Text.Json.JsonException)
        {
            throw new InvalidDataException("bad_json");
        }
    }

    // ---------- output validation + answer shuffling ----------

    private static void Finish(string task, JsonObject o)
    {
        switch (task)
        {
            case "placement":
                Require(o, "question");
                ShuffleQuestion(o);
                break;
            case "story":
                Require(o, "title");
                Require(o, "text");
                if (o["vocab"] is not JsonArray) o["vocab"] = new JsonArray();
                foreach (var q in Questions(o)) ShuffleQuestion(q);
                break;
            case "civics":
                foreach (var q in Questions(o)) ShuffleQuestion(q);
                break;
            case "check":
                Require(o, "corrected");
                if (o["mistakes"] is not JsonArray) o["mistakes"] = new JsonArray();
                break;
            case "explain":
                Require(o, "meaning_ar");
                break;
        }
    }

    private static void Require(JsonObject o, string key)
    {
        if (string.IsNullOrWhiteSpace((string?)o[key])) throw new InvalidDataException($"missing_{key}");
    }

    private static IEnumerable<JsonObject> Questions(JsonObject o)
    {
        if (o["questions"] is not JsonArray arr || arr.Count == 0) throw new InvalidDataException("no_questions");
        return arr.Select(n => n as JsonObject ?? throw new InvalidDataException("bad_question"));
    }

    // Models like to put the right answer first; shuffle so it isn't predictable.
    private static void ShuffleQuestion(JsonObject q)
    {
        Require(q, "question");
        if (q["options"] is not JsonArray opts || opts.Count != 4) throw new InvalidDataException("bad_options");
        var texts = opts.Select(n => (string?)n ?? "").ToArray();
        if (texts.Any(string.IsNullOrWhiteSpace) || texts.Distinct().Count() != 4) throw new InvalidDataException("bad_options");
        var correct = (int?)q["answerIndex"] ?? -1;
        if (correct is < 0 or > 3) throw new InvalidDataException("bad_answer");

        var order = Enumerable.Range(0, 4).ToArray();
        Random.Shared.Shuffle(order);
        q["options"] = new JsonArray(order.Select(i => (JsonNode)texts[i]).ToArray());
        q["answerIndex"] = Array.IndexOf(order, correct);
    }
}
