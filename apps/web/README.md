# Web Application

## Overview

Next.js 15 App Router application with **server-first architecture**, React Server Components (RSC), and modern UI patterns.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **React**: 19.x
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**:
  - Server State: TanStack Query v5
  - Client State: Zustand (when needed)
- **Validation**: Zod
- **Animations**: Motion (Framer Motion successor)
- **TypeScript**: Strict mode enabled

## Architecture Principles

### Server-First

- Default to Server Components
- Add `"use client"` only for interactivity, hooks, or browser APIs
- Keep client bundles minimal (<200KB first load per route group)

### State Management Strategy

- **Server State**: TanStack Query for API data, background refetch, optimistic updates
- **URL State**: searchParams for filters, pagination, tabs
- **Client State**: Zustand for truly client-side state (theme, UI preferences)

### Data Fetching

- **Static**: `fetch` with `cache: 'force-cache'` + `revalidate: N` for ISR
- **Dynamic**: Server Components with `cache: 'no-store'`
- **Client**: TanStack Query for interactive data that needs real-time updates

## Project Structure

```
app/
├── layout.tsx           # Root layout with providers
├── page.tsx             # Home page
├── globals.css          # Tailwind imports + custom CSS
└── (features)/          # Feature-based routing groups

components/
├── ui/                  # shadcn/ui components
├── navigation/          # Navigation system
└── tutorial/            # Tutorial system

lib/
├── providers.tsx        # Client providers (QueryClient, Toaster)
├── query-client.ts      # TanStack Query configuration
└── (utilities)/         # Shared utilities
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10+
- MCP envx configured for environment variables

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables via envx
envx.init
envx.set password=<your-password> data='{"NEXT_PUBLIC_API_URL":"http://localhost:5000"}'

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Environment Variables

Environment variables are managed via **EnvManager-MCP** (not `.env` files).
See `env.example` for required variables and `.cursor/rules/security/secrets-management.mdc` for usage.

Required variables:

- `NEXT_PUBLIC_API_URL`: API endpoint (browser-visible)
- `API_URL`: API endpoint (server-side)

## Development

### Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Adding New Features

1. Create feature folder: `app/(feature-name)/`
2. Add `page.tsx` (Server Component by default)
3. Extract client-only parts to separate components with `"use client"`
4. Add data fetching in Server Components or via TanStack Query

## Performance

### Optimization Strategies

- **RSC**: Server-render by default, reduce client JS
- **Streaming**: Use `<Suspense>` for slow data fetching
- **Static**: Pre-render pages with ISR where possible
- **Images**: Use `next/image` with proper `sizes` attribute
- **Fonts**: Self-hosted via `next/font` to avoid external requests

### Monitoring

- Core Web Vitals tracked in production
- React Query DevTools enabled in development
- Bundle size monitored in CI

## IIS Deployment

This application is designed for **IIS + Node.js** deployment:

- Next.js runs as a Node service (PM2/NSSM)
- IIS reverse proxies to Next.js via ARR
- Static assets served directly by IIS
- See `AuthResearch.md` for detailed IIS configuration

### Deployment Patterns

- **Same-Origin** (default): Next.js + API on same IIS site
- **Split-Origin**: Separate IIS sites for web and API
- **Hybrid**: Both patterns for trusted web + public API

See `.cursor/rules/security/authentication-patterns.mdc` for decision framework.

## See Also

- **API**: `../api/README.md` - .NET 9 Minimal API
- **Database**: `../../database/README.md` - PostgreSQL with Flyway
- **Rules**: `.cursor/rules/dependencies/next/server-first.mdc` - Architecture guidelines
- **Auth**: `.cursor/rules/security/authentication-patterns.mdc` - Authentication patterns
