# Seed Data

## Purpose

Environment-specific seed data for development, testing, and reference data. **Seeds are separate from migrations** and can be applied/reset as needed.

## Philosophy

### Migrations vs Seeds

**Migrations (database/sql/):**

- Schema changes only
- Versioned and immutable
- Run once in production
- Part of deployment pipeline

**Seeds (database/seed/):**

- Data insertion/updates
- Environment-specific
- Can be reset/reapplied
- NOT part of production deployment

## Structure

```
seed/
├── local/          # Local development data
├── dev/            # Development environment
├── staging/        # Staging environment
├── uat/            # User acceptance testing
├── prod/           # Production reference data only
└── README.md       # This file
```

## Seed Types

### Local Development

Full dataset for comfortable local development:

- Multiple test users
- Sample products/entities
- Various states and edge cases
- PII-free but realistic

**File:** `seed/local/01_users.sql`

### Development Environment

Shared development environment seeds:

- Small set of known test users
- Basic reference data
- Enough for integration testing
- Coordinated across team

**File:** `seed/dev/01_users.sql`

### Staging

Production-like data (sanitized):

- Anonymized production data
- Realistic volumes
- Covers edge cases
- Safe for demos

**File:** `seed/staging/01_import.sql`

### UAT

User acceptance test scenarios:

- Specific test cases
- Known expected outcomes
- Business validation data
- Matches test plans

**File:** `seed/uat/01_scenarios.sql`

### Production

**Minimal reference data only:**

- Country/region lists
- System configuration
- Required lookup values
- NO user data

**File:** `seed/prod/01_reference.sql`

## Usage

### Manual Application

```sql
-- PostgreSQL
psql -d robot_template -f database/seed/local/01_users.sql

-- SQL Server
sqlcmd -d robot_template -i database\seed\local\01_users.sql
```

### Automated (CI/CD)

```bash
# After migrations, apply environment-specific seeds
flyway migrate
psql -d robot_template -f database/seed/${ENVIRONMENT}/*.sql
```

## Guidelines

1. **Keep seeds idempotent**: Use `INSERT ... ON CONFLICT` or `MERGE`
2. **Document dependencies**: Note if seeds depend on each other
3. **No secrets**: Never commit passwords, API keys, or tokens
4. **Version control**: Seeds are committed, but marked as environment-specific
5. **Reset-friendly**: Design so seeds can be cleared and reapplied

## Example Seed File

```sql
-- database/seed/local/01_users.sql
-- Idempotent user seed for local development

-- Clear existing test users (optional)
DELETE FROM users WHERE email LIKE '%@test.local';

-- Insert test users
INSERT INTO users (id, email, hashed_password, status, created_at, updated_at)
VALUES
    (uuid_generate_v4(), 'admin@test.local', '$2a$10$...', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4(), 'user@test.local', '$2a$10$...', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;
```

## Security Notes

- **Never** commit real user data
- **Never** commit production passwords
- **Always** anonymize staging/UAT data
- Use environment variables for seed configuration if needed
- Mark seed files with their environment clearly

## See Also

- `../README.md` - Database overview
- `../COMMANDS.md` - Migration commands
- `.cursor/rules/database/database.mdc` - SQL development standards
