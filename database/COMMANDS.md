# Database Commands

## Overview

This project uses **Flyway** for database migrations with support for both **PostgreSQL** (primary) and **SQL Server** (on-prem integration).

### Configuration

Flyway configuration is read from `database/flyway.conf` (gitignored for security).
Copy `database/flyway.conf.template` to `database/flyway.conf` and update with your credentials.

```powershell
nx run db:<target>
```

---

## Prerequisites

### PostgreSQL (Primary)

- PostgreSQL 14+ installed and running
- Database created: `createdb robot_template`
- `database/flyway.conf` configured with PostgreSQL connection

Example `flyway.conf` for PostgreSQL:

```conf
flyway.url=jdbc:postgresql://localhost:5432/robot_template
flyway.user=postgres
flyway.password=your_password
flyway.locations=filesystem:database/sql
flyway.schemas=public
```

### SQL Server (On-prem Integration)

- SQL Server 2019+ accessible
- `database/flyway.conf` configured with SQL Server connection

Example `flyway.conf` for SQL Server:

```conf
flyway.url=jdbc:sqlserver://localhost:1433;databaseName=robot_template;encrypt=true;trustServerCertificate=true
flyway.user=sa
flyway.password=your_password
flyway.locations=filesystem:database/sql
flyway.schemas=dbo
```

---

## Targets

### `prepare`

**Purpose:** Create the migrations folder and prompt for a local config if missing.
**Runs:**

```powershell
nx run db:prepare
```

**What it does:**

- Ensures `database/sql` exists.
- If `database/flyway.db.conf` is missing, prints a message telling you to create it (based on your example).

---

### `info`

**Purpose:** Show database migration status.
**Runs:**

```powershell
nx run db:info
```

**What it does:**

- Connects using `database/flyway.db.conf`.
- Prints pending/applied migrations and the schema history table status.

**Use when:**

- Verifying connectivity and configuration.
- Inspecting current DB version and pending changes.

---

### `validate`

**Purpose:** Confirm that migration checksums on disk match what’s recorded in the database.
**Runs:**

```powershell
nx run db:validate
```

**What it does:**

- Detects altered scripts or naming issues before running `migrate`.

**Use when:**

- Pre-commit / pre-merge checks in CI.
- Anytime you change or rename a migration.

---

### `migrate`

**Purpose:** Apply all pending migrations to the target database.
**Runs:**

```powershell
nx run db:migrate
```

**What it does:**

- Executes versioned (`V__`) and then repeatable (`R__`) migrations.
- Creates the `flyway_schema_history` table on first run.

**Use when:**

- Moving your DB forward to the latest version.

---

### `baseline`

**Purpose:** Adopt an existing database at a specific version without replaying older scripts.
**Runs:**

```powershell
$env:BASELINE_VER = "2024.09"   # or "1", "1000.1", etc.
nx run db:baseline
```

**What it does:**

- Marks the DB as already at `BASELINE_VER`.
- Subsequent `migrate` runs will only apply scripts above that version.

**Use when:**

- You’re introducing Flyway to a live database that already has schema objects.

**Environment variable:**

- `BASELINE_VER` (defaults to `0` if unset)

---

### `repair`

**Purpose:** Fix the schema history table.
**Runs:**

```powershell
nx run db:repair
```

**What it does:**

- Recalculates checksums for modified migrations (intentional renames/refactors).
- Removes failed migration entries after manual fixes.

**Use when:**

- A checksum mismatch is expected after refactoring a migration.
- Cleaning up after a failed migration was corrected out-of-band.

---

### `clean`

**Purpose:** Drop all objects in configured schemas.
**Runs:**

```powershell
nx run db:clean
```

**What it does:**

- Destroys schema contents. Intended for development/test only.

**Protection:**

- `--configuration=prod` variant is hard-blocked.

  ```powershell
  nx run db:clean --configuration=prod   # will error by design
  ```

**Use when:**

- Resetting a local/test database to a blank state.

---

### `set-baseline`

**Purpose:** One-shot pipeline to validate → baseline → info.
**Runs:**

```powershell
$env:BASELINE_VER = "2024.09"
nx run db:set-baseline
```

**What it does:**

1. Validates migrations on disk.
2. Baselines the DB at `BASELINE_VER` (or `0` if not set).
3. Prints status with `info`.

**Use when:**

- First-time adoption of an existing DB, with a single command to sanity-check everything.

---

## Examples

Create first migration:

```powershell
nx run db:prepare
ni db\sql\V1__init_schema.sql -ItemType File
```

Apply it:

```powershell
nx run db:validate
nx run db:migrate
nx run db:info
```

Adopt existing DB at version tag:

```powershell
$env:BASELINE_VER = "2024.09"
nx run db:set-baseline
```

Nuke a dev DB (never in prod):

```powershell
nx run db:clean
```

---

## Troubleshooting

- **`Missing database/flyway.db.conf`**
  Create the file locally; it’s intentionally not in source control.

- **Integrated auth errors**
  Ensure the Microsoft JDBC auth DLL is available (add its directory to `PATH` or set `FLYWAY_JAVA_ARGS=-Djava.library.path=...` in your shell).

- **TCP connection refused / timeout**
  Confirm SQL Server TCP is enabled, fixed port set, service restarted, and firewall inbound rule allows your host.

- **Named instance / non-default port**
  JDBC URL must use a **colon** for the port: `jdbc:sqlserver://host:port;...`
