using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Nodes;
using System.Threading.RateLimiting;
using LangApp;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient("anthropic", c =>
{
    c.BaseAddress = new Uri(builder.Configuration["Anthropic:BaseUrl"] ?? "https://api.anthropic.com/");
    c.Timeout = TimeSpan.FromSeconds(90);
});
builder.Services.AddSingleton<AiService>();
builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    // Only the AI endpoints cost money; static files are not limited.
    o.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(ctx =>
        ctx.Request.Path.StartsWithSegments("/api") && !ctx.Request.Path.StartsWithSegments("/api/status")
            ? RateLimitPartition.GetFixedWindowLimiter(
                ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                _ => new FixedWindowRateLimiterOptions { PermitLimit = 60, Window = TimeSpan.FromMinutes(1) })
            : RateLimitPartition.GetNoLimiter("static"));
});

var app = builder.Build();
var ai = app.Services.GetRequiredService<AiService>();
var passcode = app.Configuration["AppPasscode"];

app.UseRateLimiter();

// Optional shared passcode so a public site can't burn the API key.
app.Use(async (ctx, next) =>
{
    var path = ctx.Request.Path;
    if (path.StartsWithSegments("/api"))
    {
        if (ctx.Request.ContentLength > 64 * 1024)
        {
            ctx.Response.StatusCode = StatusCodes.Status413PayloadTooLarge;
            return;
        }
        if (!string.IsNullOrEmpty(passcode) && !path.StartsWithSegments("/api/status"))
        {
            var given = Encoding.UTF8.GetBytes(ctx.Request.Headers["x-passcode"].ToString());
            if (!CryptographicOperations.FixedTimeEquals(given, Encoding.UTF8.GetBytes(passcode)))
            {
                ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await ctx.Response.WriteAsJsonAsync(new { error = "passcode_required" });
                return;
            }
        }
    }
    await next();
});

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/api/status", () => Results.Json(new
{
    demo = ai.Demo,
    needsPasscode = !string.IsNullOrEmpty(passcode),
}));

foreach (var task in AiService.Tasks)
{
    app.MapPost($"/api/{task}", async (JsonObject? body, CancellationToken ct) =>
    {
        try
        {
            var result = await ai.RunAsync(task, body ?? new JsonObject(), ct);
            return Results.Json(result);
        }
        catch (ArgumentException e)
        {
            return Results.Json(new { error = e.Message }, statusCode: 400);
        }
        catch (InvalidDataException)
        {
            return Results.Json(new { error = "ai_bad_format" }, statusCode: 502);
        }
        catch (HttpRequestException)
        {
            return Results.Json(new { error = "ai_unavailable" }, statusCode: 502);
        }
        catch (TaskCanceledException) when (!ct.IsCancellationRequested)
        {
            return Results.Json(new { error = "ai_timeout" }, statusCode: 504);
        }
    });
}

app.Run();
