# Workflow: Add New API Endpoint

## Context

- **When**: Creating a new FastEndpoints endpoint to expose API functionality
- **Duration**: 15-30 minutes
- **Complexity**: Low

## Prerequisites

- [ ] Feature/domain identified (e.g., Users, Products, Orders)
- [ ] Domain entity exists (if data access needed, see `02-add-domain-entity.md`)
- [ ] Repository exists (if data access needed)
- [ ] Application service created (if complex orchestration needed)

## Steps

### 1. Create Endpoint File

**Action**: Create endpoint class in appropriate feature folder
**Files**: `apps/api/Endpoints/{Feature}/{Action}Endpoint.cs`
**Pattern**: See `apps/api/Endpoints/Health/HealthEndpoint.cs`

```csharp
/* =============================================================================
 * CONTEXT: endpoints/{feature}
 * PATTERN: fastendpoints-handler
 * DEPENDS_ON: Application.Services.{Feature}Service, Application.DTOs.{Feature}Dto
 * USED_BY: API clients via HTTP
 * -----------------------------------------------------------------------------
 * {Feature} endpoint for {action}. Validates input, calls service, returns result.
 * =============================================================================
 */

using FastEndpoints;
using api.Application.DTOs;
using api.Application.Services;

namespace api.Endpoints.{Feature};

public sealed class {Action}{Feature}Endpoint : Endpoint<{Request}Dto, {Response}Dto>
{
    private readonly I{Feature}Service _service;

    public {Action}{Feature}Endpoint(I{Feature}Service service)
    {
        _service = service;
    }

    public override void Configure()
    {
        {HttpMethod}("/api/v1/{feature}/{route}");
        // Auth: AllowAnonymous() or add policy
        Options(x => x.WithTags("{Feature}"));
    }

    public override async Task HandleAsync({Request}Dto req, CancellationToken ct)
    {
        var result = await _service.{Action}Async(req, ct);

        if (!result.Success)
        {
            AddError(result.Error ?? "Operation failed");
            await Send.ErrorsAsync(statusCode: 400);
            return;
        }

        await Send.OkAsync(result.Data!);
    }
}
```

### 2. Create DTOs (if needed)

**Action**: Define request/response contracts
**Files**: `apps/api/Application/DTOs/{Feature}Dto.cs` or inline with endpoint
**Pattern**: Use records for immutability

```csharp
public sealed record {Request}Dto
{
    public required string SomeField { get; init; }
}

public sealed record {Response}Dto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
}
```

### 3. Implement Application Service (if complex logic)

**Action**: Create service in Application layer
**Files**: `apps/api/Application/Services/{Feature}Service.cs`
**Pattern**: Use Result<T> pattern, delegate to repositories

```csharp
public interface I{Feature}Service
{
    Task<Result<{Response}Dto>> {Action}Async({Request}Dto request, CancellationToken ct);
}

public sealed class {Feature}Service : I{Feature}Service
{
    private readonly I{Feature}Repository _repository;

    public {Feature}Service(I{Feature}Repository repository)
    {
        _repository = repository;
    }

    public async Task<Result<{Response}Dto>> {Action}Async({Request}Dto request, CancellationToken ct)
    {
        // Business logic here
        var entity = await _repository.GetByIdAsync(id, ct);
        if (entity is null)
            return Result<{Response}Dto>.Fail("Not found");

        return Result<{Response}Dto>.Ok(new {Response}Dto { /* map entity */ });
    }
}
```

### 4. Register Dependencies

**Action**: Add DI registrations in Program.cs
**Files**: `apps/api/Program.cs`
**Location**: Before `var app = builder.Build();`

```csharp
// Register services
builder.Services.AddScoped<I{Feature}Repository, {Feature}Repository>();
builder.Services.AddScoped<I{Feature}Service, {Feature}Service>();
```

### 5. Test in Scalar UI

**Action**: Start API and navigate to Scalar documentation
**URL**: `http://localhost:5000/`
**Steps**:

1. Run `pnpm dev --api` or `dotnet run` from `apps/api/`
2. Open Scalar UI
3. Find your endpoint under the appropriate tag
4. Test with sample data

## Verification

- [ ] Endpoint appears in Scalar UI under correct tag
- [ ] Returns expected HTTP status code (200, 400, 404, etc.)
- [ ] Response shape matches DTO definition
- [ ] No linter errors in endpoint file
- [ ] Authentication/authorization works as expected (if not AllowAnonymous)
- [ ] Proper error handling (returns Problem Details on errors)

## Common Patterns

**Endpoint without request body** (GET):

```csharp
public sealed class GetHealthEndpoint : EndpointWithoutRequest<HealthResponse>
```

**Endpoint with validation**:

```csharp
public override void Configure()
{
    Post("/api/v1/users");
    Validator<UserValidator>();  // Add FastEndpoints validator
}
```

**Endpoint with authorization**:

```csharp
public override void Configure()
{
    Get("/api/v1/users/{id}");
    Policies("AdminOnly");  // or Roles("Admin")
}
```

## Related

- **Rules**:
  - `.cursor/rules/dependencies/fastendpoints-best-practices.mdc`
  - `.cursor/rules/api-general-guidelines.mdc`
  - `.cursor/rules/dependencies/dotnet-best-practices.mdc`
- **Examples**:
  - `apps/api/Endpoints/Health/HealthEndpoint.cs`
- **Documentation**:
  - `apps/api/Endpoints/README.md`
  - `apps/api/Application/README.md`
