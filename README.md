# Robot APVSYS Template

## Overview

A **production-ready fullstack template** combining Next.js 15 and .NET 9, designed for self-hosted IIS deployments with PostgreSQL. This template provides a cohesive baseline for building scalable, maintainable applications.

## Key Features

✅ **Server-First Architecture** - React Server Components by default  
✅ **Layered API** - Clean separation (Domain → Application → Infrastructure → Endpoints)  
✅ **Type Safety** - Strict TypeScript + C# nullability  
✅ **Modern Patterns** - Result<T>, Repository pattern, Query/Command separation  
✅ **Production Ready** - Structured logging, health checks, security headers  
✅ **IIS Optimized** - ARR reverse proxy, HTTP/3, streaming support  
✅ **Encrypted Secrets** - MCP envx for environment variable management

## Technology Stack

### Frontend

- **Next.js 15** - App Router with RSC
- **React 19** - Latest with Suspense streaming
- **Tailwind CSS v4** - Utility-first styling
- **TanStack Query v5** - Server state management
- **Zod** - Runtime validation
- **Motion** - Accessible animations

### Backend

- **.NET 9** - Minimal API with FastEndpoints
- **Dapper + Npgsql** - Efficient data access
- **Serilog** - Structured logging
- **FastEndpoints** - Clean endpoint organization

### Database

- **PostgreSQL 14+** (primary)
- **SQL Server 2019+** (on-prem integration)
- **Flyway** - Versioned migrations

### Infrastructure

- **IIS + Node.js** - Self-hosted deployment
- **MCP envx** - Encrypted environment management
- **pnpm** - Fast, efficient package management

## Project Structure

```
Robot-APVSYS/
├── apps/
│   ├── api/                  # .NET 9 Minimal API
│   │   ├── Domain/           # Pure business logic
│   │   ├── Application/      # Use cases & DTOs
│   │   ├── Infrastructure/   # Data access & external services
│   │   ├── Endpoints/        # FastEndpoints (HTTP layer)
│   │   └── Program.cs
│   │
│   └── web/                  # Next.js 15 App Router
│       ├── app/              # Routes & layouts
│       ├── components/       # React components
│       ├── lib/              # Utilities & providers
│       └── next.config.ts
│
├── database/                 # Migrations & seeds
│   ├── sql/                  # Flyway migrations
│   ├── seed/                 # Environment-specific seeds
│   └── flyway.conf.template
│
├── scripts/                  # Development utilities
│   └── (workspace management scripts)
│
├── TODO/                     # Task management
│   ├── TBD/                  # Pending tasks
│   ├── Doing/                # Active task (one at a time)
│   ├── Done/                 # Completed tasks
│   └── Reviewed/             # Code-reviewed tasks
│
└── .cursor/                  # Cursor IDE configuration
    ├── rules/                # Development rules & guidelines
    └── context/              # Project context
```

## Quick Start

### Prerequisites

- **Node.js 18+** and **pnpm 10+**
- **.NET 9 SDK**
- **PostgreSQL 14+** (or SQL Server 2019+)
- **MCP envx** for environment management

### Installation

```bash
# 1. Install dependencies
pnpm install

# 2. Initialize environment variables
envx.init
envx.set password=<your-password>

# 3. Set up database
cp database/flyway.conf.template database/flyway.conf
# Edit flyway.conf with your database credentials
flyway -configFiles=database/flyway.conf migrate

# 4. Configure environment variables
envx.set data='{
  "NEXT_PUBLIC_API_URL": "http://localhost:5000",
  "API_URL": "http://localhost:5000",
  "ConnectionStrings__DefaultConnection": "Host=localhost;Database=robot_template;Username=postgres;Password="
}'

# 5. Run development servers
pnpm dev
```

Access:

- **Web**: http://localhost:3000
- **API**: http://localhost:5000
- **API Docs**: http://localhost:5000/ (Scalar UI)

## Architecture Principles

### Database as Data Store

- Business logic in API layer (C# code)
- Database handles data storage and retrieval
- Stored procedures for complex transformations only
- Better testability and maintainability

### Server-First Frontend

- React Server Components by default
- Client components only when needed (interactivity, hooks, browser APIs)
- Streaming with Suspense for progressive loading
- Keep client bundles minimal (<200KB per route)

### Layered API Design

1. **Domain** - Pure business logic, no dependencies
2. **Application** - Use cases, DTOs, orchestration
3. **Infrastructure** - Database, external services
4. **Endpoints** - HTTP API surface (FastEndpoints)

### Security by Design

- Encrypted environment variables (MCP envx)
- Parameterized queries only (no SQL injection)
- Explicit CORS origins (no wildcards)
- Session cookies + CSRF for same-origin
- JWT for public APIs/external consumers

## IIS Deployment Patterns

Three deployment patterns supported:

### 1. Same-Origin (Default)

- Single IIS site: `https://yourapp.com`
- Next.js at root via ARR, API at `/api` sub-application
- Session cookies (no CORS needed)
- **Best for**: Internal apps, single trusted client

### 2. Split-Origin

- Two IIS sites: `www.yourapp.com` (Next.js), `api.yourapp.com` (API)
- JWT authentication, explicit CORS
- **Best for**: Public APIs, mobile apps, external integrations

### 3. Hybrid

- Same origin for trusted web + separate locked-down public API site
- Cookie auth for web, JWT for public endpoints
- **Best for**: Web app + limited partner integrations

See `.cursor/rules/security/authentication-patterns.mdc` for detailed decision framework.

## Development Workflow

### Task Management

This template uses a structured TODO workflow:

1. **TBD** - Tasks to be done
2. **Doing** - Currently active (one task at a time)
3. **Done** - Completed tasks
4. **Reviewed** - Code-reviewed tasks

**Rule**: Commit to git between each task state transition.

### Adding Features

1. Create task in `TODO/TBD/`
2. Move to `TODO/Doing/` when starting
3. Implement following architecture layers
4. Commit and move to `TODO/Done/`
5. Code review, then move to `TODO/Reviewed/`

### Workspace Commands

```bash
# Development
pnpm dev              # Start both API and web
pnpm dev --web        # Web only
pnpm dev --api        # API only

# Building
pnpm build            # Build both
pnpm build --web      # Web only
pnpm build --api      # API only

# Code quality
pnpm format           # Format all code
pnpm lint             # Lint web app
pnpm test             # Run tests

# Package management
pnpm add:package <pkg> web       # Add Node package to web
pnpm add:nuget <pkg> api         # Add NuGet package to API
```

## Documentation

### Application READMEs

- **Web**: `apps/web/README.md` - Next.js architecture, patterns, deployment
- **API**: `apps/api/README.md` - .NET architecture, endpoints, data access
- **Database**: `database/README.md` - Migrations, seeds, connection management
- **Scripts**: `scripts/README.md` - Workspace utilities

### Cursor Rules

Located in `.cursor/rules/`:

- **Dependencies**: Technology-specific guidelines (Next.js, FastEndpoints, Tailwind, etc.)
- **Database**: SQL development standards, migrations
- **Security**: Authentication, authorization, secrets management
- **Domain Modeling**: C# design patterns and DI
- **Pipelines**: CI/CD and repository governance

### Research Documents

- **AuthResearch.md** - IIS deployment patterns and web.config examples
- **NextFasterExample.md** - Performance optimization for IIS + Next.js

## Environment Management

This project uses **EnvManager-MCP** for secure, encrypted environment variable management:

```bash
# Initialize vault
envx.init password=<your-password>

# Set variables
envx.set password=<pw> data='{"KEY":"value"}'

# Get variable
envx.get password=<pw> key=KEY

# List variables
envx.list password=<pw>

# Generate TypeScript types
envx.schema.generate
```

See `.cursor/rules/security/secrets-management.mdc` for details.

## Key Design Decisions

### Why PostgreSQL Primary?

- Cross-platform (Windows, Linux, macOS)
- Rich feature set (JSONB, full-text search, extensions)
- Excellent performance for OLTP workloads
- SQL Server support maintained for on-prem enterprise integration

### Why Dapper over EF Core?

- Explicit SQL control for performance-critical paths
- Minimal overhead (micro-ORM)
- Works well with stored procedures
- EF Core can be added alongside if needed for complex domain models

### Why FastEndpoints?

- Cleaner than Controllers (one class per endpoint)
- Built-in validation and OpenAPI support
- Performance-focused (no reflection overhead)
- Minimal boilerplate

### Why Server-First Frontend?

- Better Core Web Vitals (LCP, CLS, INP)
- Reduced client bundle size
- SEO-friendly by default
- Simplified data fetching (no loading states for static content)

## Contributing

This is a template repository. Fork it and customize for your needs:

1. Update branding (names, logos, metadata)
2. Choose authentication pattern (see authentication-patterns.mdc)
3. Add domain-specific entities and endpoints
4. Customize UI components and styling
5. Update documentation to reflect your project

## License

This template is provided as-is for use in your projects.

## Support

For issues or questions:

- Review documentation in respective README files
- Check Cursor rules in `.cursor/rules/`
- Refer to research documents (AuthResearch.md, NextFasterExample.md)

---

**Template Version**: 1.0.0  
**Last Updated**: 2025-01-03  
**Cohesiveness Score**: 10/10 ✅
