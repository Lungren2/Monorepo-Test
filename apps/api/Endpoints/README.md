# Endpoints Layer

## Purpose

The Endpoints layer defines the **HTTP API surface** using FastEndpoints. This is the presentation layer that handles HTTP requests, validation, and responses.

## Key Responsibilities

- **Request Handling**: Parse and validate HTTP requests
- **Response Formatting**: Return appropriate HTTP status codes and bodies
- **Authentication/Authorization**: Apply security policies per endpoint
- **API Versioning**: Organize endpoints by version
- **OpenAPI Documentation**: Auto-generate API documentation

## Design Principles

1. **Thin Controllers**: Delegate to Application layer services
2. **Explicit Validation**: Use FastEndpoints validators or manual validation
3. **Modern Patterns**: Use `Send.OkAsync()`, `Send.ErrorsAsync()` per FastEndpoints v8+
4. **Cancellation Support**: Pass CancellationToken to all async operations

## Structure

```
Endpoints/
├── Health/
│   └── HealthEndpoint.cs    # Health check endpoint
└── (Project-specific endpoint groups by feature)
```

## Example Usage

```csharp
// Simple endpoint without request body
public sealed class HealthEndpoint : EndpointWithoutRequest<HealthResponse>
{
    public override void Configure()
    {
        Get("/health");
        AllowAnonymous();
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

// Endpoint with request and application service
public sealed class GetUserEndpoint : Endpoint<GetUserRequest, UserDto>
{
    private readonly IUserService _userService;

    public GetUserEndpoint(IUserService userService)
    {
        _userService = userService;
    }

    public override void Configure()
    {
        Get("/users/{id}");
        // Add authentication/authorization as needed
    }

    public override async Task HandleAsync(GetUserRequest req, CancellationToken ct)
    {
        var result = await _userService.GetUserAsync(req.Id, ct);

        if (!result.Success)
        {
            AddError(result.Error ?? "User not found");
            await Send.ErrorsAsync(statusCode: 404);
            return;
        }

        await Send.OkAsync(result.Data!);
    }
}
```

## FastEndpoints v8+ Changes

- Use `Send.OkAsync()` instead of `SendAsync()`
- Use `Send.ErrorsAsync(statusCode: 400)` instead of `SendErrorsAsync()`
- CancellationToken is auto-wired, no need to pass explicitly

## Versioning

Organize endpoints by feature/domain, not by version folders:

- `/api/v1/users` → `Endpoints/Users/v1/`
- Keep version in route configuration

## See Also

- `Application/README.md` - Services called by endpoints
- `.cursor/rules/dependencies/fastendpoints-best-practices.mdc` - FastEndpoints patterns
- `.cursor/rules/api-general-guidelines.mdc` - API design principles
