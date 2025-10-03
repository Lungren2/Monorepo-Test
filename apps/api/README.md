# API

## Overview

.NET 9 Minimal API with FastEndpoints, featuring a **layered architecture** (Domain → Application → Infrastructure → Endpoints) for maintainability and testability.

## Technology Stack

- **Framework**: .NET 9 with FastEndpoints 7.0+
- **Data Access**: Dapper + Npgsql (PostgreSQL) / Microsoft.Data.SqlClient (SQL Server)
- **Logging**: Serilog (JSON files + Seq + Console)
- **API Documentation**: FastEndpoints.Swagger + Scalar UI
- **Validation**: FastEndpoints built-in validators
- **Architecture**: Layered (Domain/Application/Infrastructure/Endpoints)

## Architecture

### Layered Structure

```
api/
├── Domain/              # Pure business logic, no dependencies
│   ├── Common/
│   │   ├── IEntity.cs
│   │   └── AuditableEntity.cs
│   ├── Entities/
│   └── ValueObjects/
│
├── Application/         # Use cases, DTOs, orchestration
│   ├── Common/
│   │   └── Result.cs    # Result<T> pattern
│   ├── DTOs/
│   └── Services/
│
├── Infrastructure/      # Data access, external services
│   ├── Data/
│   │   ├── IRepository.cs
│   │   └── BaseRepository.cs
│   └── Repositories/
│
├── Endpoints/           # HTTP API surface (FastEndpoints)
│   ├── Health/
│   │   └── HealthEndpoint.cs
│   └── (feature endpoints)/
│
├── Middleware/          # Custom middleware
├── Validators/          # FastEndpoints validators
├── DTOs/                # Shared DTOs
└── Program.cs           # App startup and configuration
```

### Layer Responsibilities

**Domain** (Core business logic)

- Entity classes with business methods
- Value objects
- Domain services
- Domain interfaces (for repositories)

**Application** (Use cases)

- Orchestrates domain entities
- DTOs for API contracts
- Application services
- Result<T> pattern for error handling

**Infrastructure** (External concerns)

- Repository implementations (Dapper + Npgsql)
- Database connections
- External service clients
- File storage, email, etc.

**Endpoints** (HTTP API)

- FastEndpoints request handlers
- Validation
- Authentication/authorization policies
- Response formatting

## Getting Started

### Prerequisites

- .NET 9 SDK
- PostgreSQL 14+ (or SQL Server 2019+)
- MCP envx configured for environment variables

### Installation

```bash
# Restore NuGet packages
dotnet restore

# Set up environment variables via envx
envx.init
envx.set password=<your-password> data='{"ConnectionStrings__DefaultConnection":"Host=localhost;Database=robot_template;Username=postgres;Password="}'

# Run database migrations (see database/README.md)
flyway -configFiles=database/flyway.conf migrate

# Run the API
dotnet run --project apps/api/api.csproj
```

API runs on `http://localhost:5000` by default.

### Environment Variables

Environment variables are managed via **EnvManager-MCP**.
See `env.example` and `.cursor/rules/security/secrets-management.mdc`.

Required variables:

- `ConnectionStrings__DefaultConnection`: PostgreSQL or SQL Server connection string

## Development

### Adding New Endpoints

1. **Create endpoint class** in `Endpoints/{Feature}/`

   ```csharp
   public sealed class GetUserEndpoint : Endpoint<GetUserRequest, UserDto>
   {
       public override void Configure()
       {
           Get("/api/users/{id}");
           // Add auth/policies as needed
       }

       public override async Task HandleAsync(GetUserRequest req, CancellationToken ct)
       {
           // Implementation
           await Send.OkAsync(userData);
       }
   }
   ```

2. **Create DTOs** in `DTOs/` or in endpoint file
3. **Add application service** if complex orchestration needed
4. **Create repository** if new data access required
5. **Add domain entity** if new business concept

### Database Access Pattern

```csharp
// Repository implementation
public sealed class UserRepository : BaseRepository<User, Guid>
{
    public UserRepository(IConfiguration config) : base(config) { }

    protected override string TableName => "users";

    public async Task<User?> GetByEmailAsync(string email, CancellationToken ct)
    {
        const string sql = "SELECT * FROM users WHERE email = @Email";

        await using var conn = CreateConnection();
        return await conn.QuerySingleOrDefaultAsync<User>(
            new CommandDefinition(sql, new { Email = email }, cancellationToken: ct)
        );
    }
}
```

**Key practices:**

- Connection per operation (short-lived)
- Always use `CommandDefinition` with `CancellationToken`
- Parameterized queries only (never string concatenation)
- Rely on connection pooling (handled automatically)

### FastEndpoints v8+ Patterns

Use the modern Send API:

- `await Send.OkAsync(data)` instead of `SendAsync()`
- `await Send.ErrorsAsync(statusCode: 400)` instead of `SendErrorsAsync()`
- CancellationToken is auto-wired from `HandleAsync`

## API Documentation

### Scalar UI

Browse interactive API docs at `http://localhost:5000/`

- Dark theme by default
- Test endpoints directly
- OpenAPI 3.0 specification

### Health Check

`GET /health` - Returns `200 OK` with status and timestamp

## Configuration

### CORS

CORS is configured in `Program.cs` with **explicit origins** (no wildcards):

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
```

Update origins based on your deployment pattern (see authentication-patterns.mdc).

### Database Connection

Connection string in `appsettings.{Environment}.json` or via envx:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=robot_template;Username=postgres;Password="
  }
}
```

## Testing

```bash
# Run all tests
dotnet test

# Run with coverage
dotnet test /p:CollectCoverage=true
```

## IIS Deployment

### Deployment Models

1. **Same-Origin** (default): API as `/api` sub-application on same IIS site as Next.js
2. **Split-Origin**: Separate IIS site for API at `api.yourapp.com`
3. **Hybrid**: Both patterns - trusted internal + locked-down public endpoint

See `.cursor/rules/security/authentication-patterns.mdc` for decision framework.

### IIS Configuration

API sub-application `web.config`:

```xml
<configuration>
  <location path="." inheritInChildApplications="false">
    <system.webServer>
      <handlers>
        <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" />
      </handlers>
      <aspNetCore processPath="dotnet"
                  arguments="api.dll"
                  hostingModel="inprocess" />
    </system.webServer>
  </location>
</configuration>
```

## Logging

Serilog configured to write:

- **JSON files**: `D:\Logs\Api\log-{Date}.json` (30-day retention)
- **Audit files**: `D:\Logs\Api\audit-{Date}.json` (90-day retention)
- **Seq**: `http://localhost:5341` (local UI for log browsing)
- **Console**: Development diagnostics

Logs include:

- `ts`, `level`, `requestMethod`, `requestPath`, `statusCode`, `elapsed`
- `userId` if authenticated
- Request headers (excluding auth/cookies for security)

## See Also

- **Web**: `../web/README.md` - Next.js frontend
- **Database**: `../../database/README.md` - PostgreSQL with Flyway
- **Rules**:
  - `.cursor/rules/dependencies/fastendpoints-best-practices.mdc` - FastEndpoints patterns
  - `.cursor/rules/dependencies/dotnet-best-practices.mdc` - .NET architecture
  - `.cursor/rules/domain-modeling.mdc` - Domain modeling guidelines
  - `.cursor/rules/security/authentication-patterns.mdc` - Auth patterns
