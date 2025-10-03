# Database

## Purpose

Migration-first database management using **Flyway** with support for both **PostgreSQL** (primary) and **SQL Server** (on-prem integration). The database serves as a **data store**—business logic lives in the API layer, not in database procedures.

## Technology

- **Primary**: PostgreSQL 14+ (cross-platform, open-source)
- **Secondary**: SQL Server 2019+ (on-prem enterprise integration)
- **Migration Tool**: Flyway Community Edition
- **Connection**: Npgsql (PostgreSQL) or Microsoft.Data.SqlClient (SQL Server)

## Philosophy

**Database as Data Store**

- The database stores and retrieves data efficiently
- Business logic enforced in API layer (C# code)
- Stored procedures used for complex data transformations only
- Authentication, authorization, validation happen in application code

**Benefits:**

- Better testability (mock repositories, not database)
- Easier debugging (C# debugger vs SQL debugging)
- Better maintainability (type safety, refactoring tools)
- Clearer separation of concerns

## Structure

```
database/
├── sql/                     # Versioned migrations
│   ├── V1__initial_schema.sql
│   └── V2__audit_function.sql
├── seed/                    # Environment-specific seed data
│   └── README.md
├── flyway.conf.template     # Flyway configuration template
├── COMMANDS.md              # Flyway command reference
└── README.md                # This file
```

## Quick Start

### PostgreSQL Setup

1. Install PostgreSQL 14+ locally
2. Create database: `createdb robot_template`
3. Copy flyway config:
   ```bash
   cp database/flyway.conf.template database/flyway.conf
   ```
4. Edit `database/flyway.conf` with your credentials
5. Run migrations:
   ```bash
   flyway -configFiles=database/flyway.conf migrate
   ```

### SQL Server Setup

1. Uncomment SQL Server section in `flyway.conf`
2. Update connection string with your server details
3. Run migrations same as above

## Creating Migrations

### Versioned Migrations (V prefix)

Schema changes that run once:

```sql
-- database/sql/V3__add_users_table.sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

### Repeatable Migrations (R prefix)

Views or functions that can be recreated:

```sql
-- database/sql/R__user_stats_view.sql
CREATE OR REPLACE VIEW user_stats AS
SELECT
    DATE(created_at) as date,
    COUNT(*) as user_count
FROM users
GROUP BY DATE(created_at);
```

## Migration Naming

- **V{version}\_\_{description}.sql** - Versioned (e.g., `V1__initial_schema.sql`)
- **R\_\_{description}.sql** - Repeatable (e.g., `R__views.sql`)
- Use underscores in description
- Keep descriptions short and clear

## Seed Data

Seed data is **environment-specific** and managed separately from migrations:

- Development: Full dataset for local testing
- Staging: Sanitized production-like data
- UAT: User acceptance test scenarios
- Production: Minimal reference data only

See `database/seed/README.md` for details.

## Connection Management

The API uses **connection-per-operation** pattern:

- Short-lived connections
- Rely on connection pooling (handled by Npgsql/SqlClient)
- Always use `await using` or `using` statements
- Pass `CancellationToken` for all async operations

## Security

- **Never store secrets in migrations**
- Connection strings via environment variables (MCP envx)
- Use parameterized queries only
- Row-level security in application code, not database triggers

## See Also

- `COMMANDS.md` - Flyway command reference
- `seed/README.md` - Seed data guidelines
- `.cursor/rules/database/database.mdc` - SQL development standards
- `.cursor/rules/dependencies/npgsql-best-practices.mdc` - PostgreSQL connection patterns
