# Infrastructure Layer

## Purpose

The Infrastructure layer implements **external concerns** and **technical capabilities** needed by the application. This layer depends on both Domain and Application layers but is isolated from presentation concerns.

## Key Responsibilities

- **Data Access**: Repository implementations using Dapper + Npgsql
- **External Services**: Third-party API clients, email, storage
- **Cross-Cutting Concerns**: Logging, caching, resilience
- **Infrastructure Configuration**: Database connections, external service setup

## Design Principles

1. **Implement Interfaces**: Domain defines contracts, Infrastructure implements them
2. **Connection Per Operation**: Use short-lived connections, rely on connection pooling
3. **Parameterized Queries**: Never concatenate SQL, always use parameters
4. **Explicit Cancellation**: Support CancellationToken for all async operations

## Structure

```
Infrastructure/
├── Data/
│   ├── IRepository.cs       # Generic repository interface
│   └── BaseRepository.cs    # Base Dapper + Npgsql implementation
├── Repositories/
│   └── (Project-specific repository implementations)
└── Services/
    └── (External service implementations)
```

## Example Usage

```csharp
// Repository implementation
public sealed class UserRepository : BaseRepository<User, Guid>, IUserRepository
{
    public UserRepository(IConfiguration configuration) : base(configuration) { }

    protected override string TableName => "users";

    public async Task<User?> GetByEmailAsync(string email, CancellationToken ct = default)
    {
        const string sql = @"
            SELECT id, email, hashed_password, status, created_at, updated_at
            FROM users
            WHERE email = @Email";

        await using var conn = CreateConnection();
        return await conn.QuerySingleOrDefaultAsync<User>(
            new CommandDefinition(sql, new { Email = email }, cancellationToken: ct)
        );
    }
}
```

## Database Connection

- **Connection String**: Read from `IConfiguration["ConnectionStrings:DefaultConnection"]`
- **Connection Management**: Create per operation, dispose after use
- **Pooling**: ADO.NET handles connection pooling automatically

## See Also

- `Domain/README.md` - Interfaces defined in Domain layer
- `Application/README.md` - Services that use repositories
- `.cursor/rules/dependencies/npgsql-best-practices.mdc` - PostgreSQL connection guidelines
- `.cursor/rules/dependencies/dapper-best-practices.mdc` - Dapper usage patterns
