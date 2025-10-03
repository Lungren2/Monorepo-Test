/* =============================================================================
 * CONTEXT: endpoints/health
 * PATTERN: fastendpoints-handler
 * DEPENDS_ON: FastEndpoints
 * USED_BY: Load balancers, monitoring systems, IIS health checks
 * -----------------------------------------------------------------------------
 * Health check endpoint. Returns 200 OK with status and timestamp. Anonymous
 * access for monitoring. Demonstrates full FastEndpoints pattern.
 * =============================================================================
 */

using FastEndpoints;

namespace api.Endpoints.Health;

/// <summary>
/// Health check endpoint for monitoring.
/// </summary>
public sealed class HealthEndpoint : EndpointWithoutRequest<HealthResponse>
{
    public override void Configure()
    {
        Get("/health");
        AllowAnonymous();
        Options(x => x.WithTags("Health"));
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        await Send.OkAsync(new HealthResponse
        {
            Status = "healthy",
            Timestamp = DateTime.UtcNow
        });
    }
}

/// <summary>
/// Response model for health check.
/// </summary>
public sealed record HealthResponse
{
    public required string Status { get; init; }
    public required DateTime Timestamp { get; init; }
}


