# Domain Layer

## Purpose

The Domain layer contains the **core business logic** and **domain models** of the application. This layer is independent of infrastructure concerns and external dependencies.

## Key Responsibilities

- **Domain Entities**: Core business objects with identity
- **Value Objects**: Immutable objects defined by their attributes
- **Domain Services**: Business logic that doesn't naturally fit within entities
- **Domain Events**: Significant occurrences within the domain
- **Domain Interfaces**: Contracts for repositories and external services (implemented in Infrastructure)

## Design Principles

1. **Pure Business Logic**: No framework or infrastructure dependencies
2. **Rich Domain Model**: Entities encapsulate behavior, not just data
3. **Immutability**: Prefer records and init-only properties
4. **Explicit**: Types reveal intent (no primitive obsession)

## Structure

```
Domain/
├── Common/
│   ├── IEntity.cs           # Entity marker interface
│   └── AuditableEntity.cs   # Base for auditable entities
├── Entities/
│   └── (Project-specific domain entities)
├── ValueObjects/
│   └── (Project-specific value objects)
└── Services/
    └── (Project-specific domain services)
```

## Example Usage

```csharp
// Domain entity
public sealed record User : AuditableEntity<Guid>
{
    public required string Email { get; init; }
    public required string HashedPassword { get; init; }
    public UserStatus Status { get; init; } = UserStatus.Active;

    // Business logic encapsulated in entity
    public bool CanLogin() => Status == UserStatus.Active;
}

// Value object
public sealed record Email
{
    private Email(string value) => Value = value;
    public string Value { get; }

    public static Result<Email> Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return Result<Email>.Fail("Email cannot be empty");
        if (!value.Contains('@'))
            return Result<Email>.Fail("Invalid email format");

        return Result<Email>.Ok(new Email(value));
    }
}
```

## See Also

- `Application/README.md` - Orchestration layer that uses domain entities
- `Infrastructure/README.md` - Implements domain interfaces
- `.cursor/rules/domain-modeling.mdc` - Domain modeling guidelines
