
#nullable enable
using FastEndpoints;
using FastEndpoints.Swagger;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Serilog;
using Serilog.Events;
using Scalar.AspNetCore;

namespace api;

public class Program
{
    public static void Main(string[] args)
    {
        // Program.cs
        var builder = WebApplication.CreateBuilder(args);

        // --- Serilog (File + Seq + Console + EventLog) ---
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Debug()
            .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
            .Enrich.FromLogContext()
            // Local JSON rolling file (baseline requirement)
            .WriteTo.File(
                path: @"D:\Logs\Api\log-.json",
                rollingInterval: RollingInterval.Day,
                retainedFileCountLimit: 30,
                fileSizeLimitBytes: 100 * 1024 * 1024, // 100 MB
                rollOnFileSizeLimit: true,
                shared: true,
                formatProvider: null
            )
            // Audit file sink (longer retention)
            .WriteTo.File(
                path: @"D:\Logs\Api\audit-.json",
                rollingInterval: RollingInterval.Day,
                retainedFileCountLimit: 90,
                fileSizeLimitBytes: 100 * 1024 * 1024,
                rollOnFileSizeLimit: true,
                shared: true,
                formatProvider: null,
                restrictedToMinimumLevel: LogEventLevel.Information
            )
            // Seq sink (UI on http://localhost:5341 by default)
            .WriteTo.Seq("http://localhost:5341")
            // Console for dev diagnostics
            .WriteTo.Console()
            .CreateLogger();

        builder.Host.UseSerilog();

        // --- Services ---
        builder.Services
            .AddFastEndpoints()
            .SwaggerDocument(o =>
            {
                o.DocumentSettings = s =>
                {
                    s.DocumentName = "v1";
                    s.Title = "API";
                    s.Version = "v1";
                };
            });

        builder.Services.AddHealthChecks();
        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
        });

        var app = builder.Build();

        app.UseSerilogRequestLogging(options =>
        {
            // Exclude sensitive headers and request bodies
            options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
            options.GetLevel = (httpContext, elapsed, ex) => LogEventLevel.Information;
            
            // Don't log request/response bodies to avoid capturing sensitive data
            options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
            {
                diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value);
                diagnosticContext.Set("RequestScheme", httpContext.Request.Scheme);
                diagnosticContext.Set("UserAgent", httpContext.Request.Headers["User-Agent"].FirstOrDefault());
                diagnosticContext.Set("RemoteIP", httpContext.Connection.RemoteIpAddress?.ToString());
                
                // Log user ID if authenticated (safe to log)
                if (httpContext.User?.Identity?.IsAuthenticated == true)
                {
                    var userId = httpContext.User.FindFirst("user_id")?.Value;
                    if (!string.IsNullOrEmpty(userId))
                    {
                        diagnosticContext.Set("UserId", userId);
                    }
                }
            };
        });

        // --- Middleware ---
        app.UseCors();
        app.UseFastEndpoints(c => {
            c.Endpoints.ShortNames = true;
            c.Versioning.Prefix = "api";
            c.Versioning.PrependToRoute = true;
        }).UseSwaggerGen();

        app.UseStaticFiles();

        // Scalar API reference
        app.MapScalarApiReference(options =>
        {
            options.Theme = ScalarTheme.Mars;
            options.HeadContent = """
              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
              <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
            """;
            options.WithTitle("API Reference")
                   .WithDarkMode(true)
                   .WithOpenApiRoutePattern("/swagger/{documentName}/swagger.json");
        });

        app.Run();

    }
}
