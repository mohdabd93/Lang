using System.Text.Json.Nodes;

namespace LangApp;

// Canned responses used when no API key is configured, so the app can be tried end to end.
internal static class DemoData
{
    public static JsonObject Get(string task, JsonObject req)
    {
        var lang = (string)req["lang"]!;
        return task switch
        {
            "placement" => Pick(lang == "el" ? GreekPlacement : EnglishPlacement),
            "story" => lang == "el" ? GreekStory() : EnglishStory(),
            "civics" => Civics((int)req["count"]!),
            "check" => new JsonObject
            {
                ["corrected"] = (string)req["text"]!,
                ["score"] = 80,
                ["mistakes"] = new JsonArray(),
                ["tip_ar"] = "هذا رد تجريبي. أضف مفتاح Claude API ليصحح لك الذكاء الاصطناعي كتابتك فعليًا.",
            },
            _ => new JsonObject
            {
                ["lemma"] = (string)req["word"]!,
                ["pos"] = "",
                ["meaning_ar"] = "شرح تجريبي (أضف مفتاح Claude API للشرح الحقيقي)",
                ["note_ar"] = "",
                ["example"] = "",
                ["example_ar"] = "",
            },
        };
    }

    private static JsonObject Pick(JsonObject[] pool) => (JsonObject)pool[Random.Shared.Next(pool.Length)].DeepClone();

    private static JsonObject Q(string question, string[] options, int answer, string? explanation = null)
    {
        var o = new JsonObject
        {
            ["question"] = question,
            ["options"] = new JsonArray(options.Select(s => (JsonNode)s).ToArray()),
            ["answerIndex"] = answer,
        };
        if (explanation != null) o["explanation_ar"] = explanation;
        return o;
    }

    private static readonly JsonObject[] GreekPlacement =
    [
        Q("Συμπλήρωσε: Εγώ ___ Μαρία.", ["είμαι", "είσαι", "είναι", "είμαστε"], 0, "مع «εγώ» نستخدم «είμαι»."),
        Q("Πώς λες «thank you» στα ελληνικά;", ["Ευχαριστώ", "Καλημέρα", "Παρακαλώ", "Συγγνώμη"], 0, "«Ευχαριστώ» تعني شكرًا."),
        Q("Ποια λέξη είναι ουσιαστικό;", ["σπίτι", "γρήγορα", "τρέχω", "μικρός"], 0, "«σπίτι» اسم (بيت)."),
    ];

    private static readonly JsonObject[] EnglishPlacement =
    [
        Q("She ___ to school every day.", ["goes", "go", "going", "gone"], 0, "مع she نضيف s للفعل."),
        Q("I have lived here ___ 2020.", ["since", "for", "from", "at"], 0, "since مع نقطة زمنية محددة."),
        Q("If I ___ rich, I would travel the world.", ["were", "am", "will be", "have been"], 0, "الشرط غير الواقعي يستخدم were."),
    ];

    private static JsonObject Story(string title, string text, string translation, (string, string)[] vocab, JsonObject[] questions) => new()
    {
        ["title"] = title,
        ["text"] = text,
        ["translation_ar"] = translation,
        ["vocab"] = new JsonArray(vocab.Select(v => (JsonNode)new JsonObject { ["word"] = v.Item1, ["meaning_ar"] = v.Item2 }).ToArray()),
        ["questions"] = new JsonArray(questions.Select(q => (JsonNode)q.DeepClone()).ToArray()),
    };

    private static JsonObject GreekStory() => Story(
        "Στο σούπερ μάρκετ",
        "Η Μαρία πηγαίνει στο σούπερ μάρκετ. Αγοράζει ψωμί, γάλα και μήλα. Το ψωμί κοστίζει ένα ευρώ. Η Μαρία πληρώνει και γυρίζει σπίτι.",
        "ماريا تذهب إلى السوبرماركت. تشتري خبزًا وحليبًا وتفاحًا. الخبز يكلف يورو واحدًا. ماريا تدفع وتعود إلى البيت.",
        [("ψωμί", "خبز"), ("γάλα", "حليب"), ("μήλα", "تفاح"), ("πληρώνει", "تدفع"), ("σπίτι", "بيت")],
        [
            Q("Πού πηγαίνει η Μαρία;", ["Στο σούπερ μάρκετ", "Στο σχολείο", "Στην παραλία", "Στο νοσοκομείο"], 0),
            Q("Τι αγοράζει η Μαρία;", ["Ψωμί, γάλα και μήλα", "Μόνο ψάρι", "Βιβλία", "Παπούτσια"], 0),
            Q("Πόσο κοστίζει το ψωμί;", ["Ένα ευρώ", "Δύο ευρώ", "Πέντε ευρώ", "Δεν κοστίζει"], 0),
            Q("Πού γυρίζει η Μαρία;", ["Σπίτι", "Στη δουλειά", "Στο πάρκο", "Στο σινεμά"], 0),
        ]);

    private static JsonObject EnglishStory() => Story(
        "A Day at the Market",
        "Sam goes to the market every Saturday. He buys fresh vegetables and a little cheese. The market is busy and noisy, but he enjoys talking to the sellers. After shopping, he drinks a coffee and walks home.",
        "يذهب سام إلى السوق كل يوم سبت. يشتري خضارًا طازجة وقليلًا من الجبن. السوق مزدحم وصاخب لكنه يستمتع بالحديث مع البائعين. بعد التسوق يشرب قهوة ويمشي إلى البيت.",
        [("fresh", "طازج"), ("busy", "مزدحم"), ("noisy", "صاخب"), ("enjoys", "يستمتع"), ("sellers", "بائعون")],
        [
            Q("When does Sam go to the market?", ["Every Saturday", "Every Monday", "Every morning", "Once a year"], 0),
            Q("What does he buy?", ["Vegetables and cheese", "Clothes", "Fish and rice", "Books"], 0),
            Q("What is the market like?", ["Busy and noisy", "Quiet and empty", "Cold and dark", "Small and clean"], 0),
            Q("What does he do after shopping?", ["Drinks a coffee", "Goes to work", "Watches TV", "Cooks dinner"], 0),
        ]);

    private static JsonObject Civics(int count)
    {
        JsonObject[] all =
        [
            Q("Ποια είναι η πρωτεύουσα της Ελλάδας;", ["Η Αθήνα", "Η Θεσσαλονίκη", "Η Πάτρα", "Το Ηράκλειο"], 0, "عاصمة اليونان هي أثينا."),
            Q("Ποιο είναι το ψηλότερο βουνό της Ελλάδας;", ["Ο Όλυμπος", "Ο Παρνασσός", "Ο Υμηττός", "Το Πήλιο"], 0, "أعلى جبل في اليونان هو أوليمبوس."),
            Q("Τι γιορτάζουμε στις 28 Οκτωβρίου;", ["Την ημέρα του «Όχι»", "την Πρωτοχρονιά", "το Πάσχα", "τα Χριστούγεννα"], 0, "يوم «لا» (Ohi) ذكرى رفض الإنذار الإيطالي عام 1940."),
        ];
        var arr = new JsonArray();
        for (var i = 0; i < count; i++) arr.Add(all[i % all.Length].DeepClone());
        return new JsonObject { ["questions"] = arr };
    }
}
