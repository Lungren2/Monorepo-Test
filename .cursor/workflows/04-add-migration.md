# Workflow: Add Database Migration

## Context

- **When**: Making schema changes (tables, columns, indexes, constraints)
- **Duration**: 10-20 minutes
- **Complexity**: Low

## Prerequisites

- [ ] Database design completed and reviewed
- [ ] Flyway configured (`database/flyway.conf` exists)
- [ ] Previous migrations applied successfully

## Steps

### 1. Determine Migration Type

**Versioned Migration (V prefix)** - One-time schema changes:

- Creating/altering/dropping tables
- Adding/modifying columns
- Creating indexes
- Adding constraints
- Data backfills

**Repeatable Migration (R prefix)** - Idempotent objects:

- Stored procedures
- Views
- Functions
- Triggers (if used)

### 2. Create Migration File

**Action**: Create SQL file in migrations directory
**Files**: `database/sql/V{N}__{description}.sql` or `database/sql/R__{name}.sql`

**Naming conventions:**

- Versioned: `V3__add_users_table.sql` (increment from last V number)
- Repeatable: `R__sp_users_create.sql` (descriptive name)
- Use underscores in description
- Keep descriptions short and clear

### 3. Write Migration SQL

**PostgreSQL Template:**

```sql
/* =============================================================================
 * Migration: V{N}__{description}
 * Database  : PostgreSQL (primary), SQL Server (commented alternatives)
 * -----------------------------------------------------------------------------
 * {Purpose of this migration}
 * =============================================================================
 */

-- Schema change
CREATE TABLE {table_name} (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_{table}_{column} ON {table}({column});

-- Audit trigger (if needed)
CREATE TRIGGER update_{table}_updated_at
    BEFORE UPDATE ON {table}
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

/* SQL Server Alternative (commented):
CREATE TABLE {table_name} (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
*/
```

**Key Practices:**

- Always specify NULL/NOT NULL explicitly
- Use appropriate data types (UUID, VARCHAR, TIMESTAMP)
- Add indexes for foreign keys and frequently queried columns
- Include SQL Server alternatives in comments
- Make migrations idempotent where possible (`CREATE TABLE IF NOT EXISTS`)

### 4. Validate Migration

**Action**: Check migration syntax and order
**Commands**:

```bash
# Validate migrations
flyway -configFiles=database/flyway.conf validate

# See migration status
flyway -configFiles=database/flyway.conf info
```

### 5. Apply Migration

**Action**: Run migration against database
**Commands**:

```bash
# Apply all pending migrations
flyway -configFiles=database/flyway.conf migrate

# Verify applied
flyway -configFiles=database/flyway.conf info
```

### 6. Update Repository (if new table)

**Action**: Create repository for new entity
**See**: `02-add-domain-entity.md` for full entity workflow

### 7. Document Breaking Changes

**Action**: If migration is breaking, document in migration file
**Pattern**:

```sql
-- BREAKING CHANGE: This migration renames column X to Y
-- ROLLBACK: Run V{N+1}__rollback_rename.sql to revert
-- AFFECTED: Applications must update queries referencing old column name
```

## Verification

- [ ] Migration file follows naming convention (V{N}\_\_description.sql)
- [ ] SQL syntax is valid for target database(s)
- [ ] `flyway validate` passes
- [ ] `flyway migrate` executes without errors
- [ ] `flyway info` shows migration as applied
- [ ] Data visible in database (test with psql/sqlcmd)
- [ ] Application can connect and query new/modified tables
- [ ] No data loss (if altering existing tables)
- [ ] Rollback plan documented (for breaking changes)

## Common Patterns

**Add Column (Safe):**

```sql
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
```

**Add Column with NOT NULL (Requires default or backfill):**

```sql
-- Step 1: Add column as nullable
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- Step 2: Backfill existing rows
UPDATE users SET phone = '' WHERE phone IS NULL;

-- Step 3: Add NOT NULL constraint
ALTER TABLE users ALTER COLUMN phone SET NOT NULL;
```

**Create Index:**

```sql
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
-- CONCURRENTLY prevents table locks (PostgreSQL)
```

**Soft Delete Migration:**

```sql
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP NULL;

-- Partial unique index (PostgreSQL) - only active rows
CREATE UNIQUE INDEX idx_users_email_active
ON users(email)
WHERE deleted_at IS NULL;
```

## Related

- **Rules**:
  - `.cursor/rules/database/migrations.mdc`
  - `.cursor/rules/database/database.mdc`
  - `.cursor/rules/dependencies/npgsql-best-practices.mdc`
- **Documentation**:
  - `database/README.md`
  - `database/COMMANDS.md`
- **Examples**:
  - `database/sql/V1__initial_schema.sql`
  - `database/sql/V2__audit_function.sql`
