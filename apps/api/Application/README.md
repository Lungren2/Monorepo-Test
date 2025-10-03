# Application Layer

## Purpose

The Application layer orchestrates **use cases** and **workflows**, coordinating between the domain layer and infrastructure. This layer defines what the application does, without knowing how it's done.

## Key Responsibilities

- **Use Case Orchestration**: Coordinate domain entities and services
- **DTOs (Data Transfer Objects)**: Define API contracts
- **Input Validation**: Guard boundaries with validation logic
- **Transaction Management**: Define transactional boundaries
- **Application Services**: High-level business workflows

## Design Principles

1. **Thin Layer**: Delegate business logic to Domain, infrastructure to Infrastructure
2. **Clear Boundaries**: DTOs for external contracts, domain models for internal logic
3. **Result Pattern**: Return explicit success/failure results instead of exceptions for expected errors
4. **Validation First**: Validate inputs at application boundary

## Structure

```
Application/
├── Common/
│   └── Result.cs            # Result<T> pattern for error handling
├── DTOs/
│   └── (Project-specific request/response DTOs)
├── Services/
│   └── (Project-specific application services)
└── UseCases/
    └── (Project-specific use case handlers)
```

## Example Usage

```csharp
// Application service
public sealed class UserService
{
    private readonly IUserRepository _repository;

    public UserService(IUserRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<UserDto>> GetUserAsync(Guid id, CancellationToken ct = default)
    {
        var user = await _repository.GetByIdAsync(id, ct);
        if (user is null)
            return Result<UserDto>.Fail("User not found");

        return Result<UserDto>.Ok(new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            CreatedAt = user.CreatedAt
        });
    }
}

// DTO
public sealed record UserDto
{
    public required Guid Id { get; init; }
    public required string Email { get; init; }
    public required DateTime CreatedAt { get; init; }
}
```

## Result Pattern

Use `Result<T>` to represent operations that can fail:

```csharp
var result = await userService.GetUserAsync(userId);
if (!result.Success)
{
    // Handle error
    return Results.NotFound(new { Error = result.Error });
}

return Results.Ok(result.Data);
```

## See Also

- `Domain/README.md` - Pure business logic and domain models
- `Infrastructure/README.md` - External concerns and repository implementations
- `Endpoints/README.md` - FastEndpoints presentation layer
- `.cursor/rules/dependencies/dotnet-best-practices.mdc` - Architecture guidelines
