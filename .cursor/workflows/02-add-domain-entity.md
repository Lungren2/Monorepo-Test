# Workflow: Add Domain Entity (Full Stack)

## Context

- **When**: Adding a new business concept/entity to the system
- **Duration**: 30-60 minutes
- **Complexity**: Medium

## Prerequisites

- [ ] Entity concept identified and named (singular, PascalCase)
- [ ] Database table design completed (columns, types, constraints)
- [ ] Understanding of entity relationships and dependencies

## Steps

### 1. Create Domain Entity

**Action**: Define entity in Domain layer
**Files**: `apps/api/Domain/Entities/{Entity}.cs`
**Pattern**: Inherit from `AuditableEntity<TId>` if audit fields needed

```csharp
/* =============================================================================
 * CONTEXT: domain/entities
 * PATTERN: domain-entity
 * DEPENDS_ON: Domain.Common.AuditableEntity
 * USED_BY: Infrastructure.Repositories.{Entity}Repository, Application.Services
 * -----------------------------------------------------------------------------
 * {Entity} domain model. Encapsulates business rules and invariants.
 * =============================================================================
 */

using api.Domain.Common;

namespace api.Domain.Entities;

public sealed record {Entity} : AuditableEntity<Guid>
{
    public required string Name { get; init; }
    public required string Email { get; init; }
    public {Entity}Status Status { get; init; } = {Entity}Status.Active;

    // Business logic methods
    public bool CanPerformAction() => Status == {Entity}Status.Active;
}

public enum {Entity}Status
{
    Active,
    Inactive,
    Deleted
}
```

### 2. Create Database Migration

**Action**: Add migration for entity table
**Files**: `database/sql/V{N}__{entity_table}.sql`
**Pattern**: Follow migration naming conventions

```sql
/* =============================================================================
 * Migration: V{N}__create_{entity}_table
 * Database  : PostgreSQL (primary), SQL Server (commented)
 * -----------------------------------------------------------------------------
 * Creates {entity} table with audit columns and indexes
 * =============================================================================
 */

CREATE TABLE {entities} (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(320) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_{entities}_email ON {entities}(email);
CREATE INDEX idx_{entities}_status ON {entities}(status);

-- Apply audit trigger
CREATE TRIGGER update_{entities}_updated_at
    BEFORE UPDATE ON {entities}
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 3. Create Repository Interface (Domain)

**Action**: Define repository contract in Domain
**Files**: `apps/api/Domain/Repositories/I{Entity}Repository.cs`

```csharp
using api.Domain.Entities;

namespace api.Domain.Repositories;

public interface I{Entity}Repository
{
    Task<{Entity}?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<{Entity}?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task<IReadOnlyList<{Entity}>> ListAsync(CancellationToken ct = default);
    Task<{Entity}> AddAsync({Entity} entity, CancellationToken ct = default);
    Task UpdateAsync({Entity} entity, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
```

### 4. Create Repository Implementation (Infrastructure)

**Action**: Implement repository using Dapper + Npgsql
**Files**: `apps/api/Infrastructure/Repositories/{Entity}Repository.cs`
**Pattern**: Inherit from `BaseRepository<TEntity, TId>`

```csharp
/* =============================================================================
 * CONTEXT: infrastructure/repositories
 * PATTERN: repository-implementation
 * DEPENDS_ON: Infrastructure.Data.BaseRepository, Domain.Entities.{Entity}
 * USED_BY: Application.Services.{Entity}Service
 * -----------------------------------------------------------------------------
 * Repository for {Entity}. Dapper + Npgsql, parameterized queries, connection pooling.
 * =============================================================================
 */

using System.Data;
using Dapper;
using api.Domain.Entities;
using api.Domain.Repositories;
using api.Infrastructure.Data;

namespace api.Infrastructure.Repositories;

public sealed class {Entity}Repository : BaseRepository<{Entity}, Guid>, I{Entity}Repository
{
    public {Entity}Repository(IConfiguration configuration) : base(configuration) { }

    protected override string TableName => "{entities}";

    public async Task<{Entity}?> GetByEmailAsync(string email, CancellationToken ct = default)
    {
        const string sql = @"
            SELECT id, name, email, status, created_at, updated_at
            FROM {entities}
            WHERE email = @Email AND deleted_at IS NULL";

        await using var conn = CreateConnection();
        return await conn.QuerySingleOrDefaultAsync<{Entity}>(
            new CommandDefinition(sql, new { Email = email }, cancellationToken: ct)
        );
    }

    public override async Task<{Entity}> AddAsync({Entity} entity, CancellationToken ct = default)
    {
        const string sql = @"
            INSERT INTO {entities} (id, name, email, status, created_at, updated_at)
            VALUES (@Id, @Name, @Email, @Status, @CreatedAt, @UpdatedAt)
            RETURNING *";

        await using var conn = CreateConnection();
        return await conn.QuerySingleAsync<{Entity}>(
            new CommandDefinition(sql, entity, cancellationToken: ct)
        );
    }

    // Implement UpdateAsync similar pattern...
}
```

### 5. Create Application DTOs

**Action**: Define API contracts
**Files**: `apps/api/Application/DTOs/{Entity}Dto.cs`

```csharp
namespace api.Application.DTOs;

public sealed record {Entity}Dto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required string Email { get; init; }
    public required string Status { get; init; }
    public required DateTime CreatedAt { get; init; }
}

public sealed record Create{Entity}Request
{
    public required string Name { get; init; }
    public required string Email { get; init; }
}
```

### 6. Create Application Service (if needed)

**Action**: Implement business logic orchestration
**Files**: `apps/api/Application/Services/{Entity}Service.cs`
**Pattern**: Use Result<T> pattern

```csharp
public interface I{Entity}Service
{
    Task<Result<{Entity}Dto>> CreateAsync(Create{Entity}Request request, CancellationToken ct);
    Task<Result<{Entity}Dto>> GetByIdAsync(Guid id, CancellationToken ct);
}

public sealed class {Entity}Service : I{Entity}Service
{
    private readonly I{Entity}Repository _repository;

    public {Entity}Service(I{Entity}Repository repository)
    {
        _repository = repository;
    }

    public async Task<Result<{Entity}Dto>> CreateAsync(Create{Entity}Request request, CancellationToken ct)
    {
        // Validation, business logic, etc.
        var entity = new {Entity}
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Email = request.Email
        };

        var created = await _repository.AddAsync(entity, ct);

        return Result<{Entity}Dto>.Ok(new {Entity}Dto
        {
            Id = created.Id,
            Name = created.Name,
            Email = created.Email,
            Status = created.Status.ToString(),
            CreatedAt = created.CreatedAt
        });
    }
}
```

### 7. Create Endpoint

**Action**: Expose via FastEndpoints
**Files**: `apps/api/Endpoints/{Feature}/Create{Entity}Endpoint.cs`
**Pattern**: See step 1 in `01-add-api-endpoint.md`

### 8. Register Dependencies

**Action**: Wire up DI in Program.cs
**Files**: `apps/api/Program.cs`

```csharp
// Add before var app = builder.Build();
builder.Services.AddScoped<I{Entity}Repository, {Entity}Repository>();
builder.Services.AddScoped<I{Entity}Service, {Entity}Service>();
```

### 9. Run Migration

**Action**: Apply database migration
**Commands**:

```bash
flyway -configFiles=database/flyway.conf migrate
```

### 10. Test Full Stack

**Action**: Verify end-to-end functionality
**Steps**:

1. Start API: `pnpm dev --api`
2. Open Scalar UI: `http://localhost:5000/`
3. Test Create endpoint with sample data
4. Test Get endpoint with returned ID
5. Verify data in database

## Verification

- [ ] Domain entity compiles without errors
- [ ] Migration applied successfully (check `flyway info`)
- [ ] Repository interface defined in Domain layer
- [ ] Repository implementation in Infrastructure layer
- [ ] DTOs defined in Application layer
- [ ] Service (if created) uses Result<T> pattern
- [ ] Endpoint appears in Scalar UI
- [ ] Create operation returns 200 with correct shape
- [ ] Get operation retrieves created entity
- [ ] Data visible in database table
- [ ] No linter errors in any layer

## Common Patterns

**Simple entity** (no complex business logic):

- Skip Application Service
- Call Repository directly from Endpoint

**Complex entity** (validations, calculations):

- Create Application Service
- Encapsulate business rules in Domain entity methods
- Service orchestrates and returns Result<T>

## Related

- **Rules**:
  - `.cursor/rules/domain-modeling.mdc`
  - `.cursor/rules/dependencies/dotnet-best-practices.mdc`
  - `.cursor/rules/dependencies/dapper-best-practices.mdc`
  - `.cursor/rules/database/migrations.mdc`
- **Examples**:
  - `apps/api/Domain/Common/AuditableEntity.cs`
  - `apps/api/Infrastructure/Data/BaseRepository.cs`
  - `apps/api/Application/Common/Result.cs`
- **Documentation**:
  - `apps/api/Domain/README.md`
  - `apps/api/Infrastructure/README.md`
  - `database/README.md`
