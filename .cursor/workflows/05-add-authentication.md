# Workflow: Add Authentication

## Context

- **When**: Implementing authentication for a new project based on this template
- **Duration**: 2-4 hours
- **Complexity**: High

## Prerequisites

- [ ] Read `.cursor/rules/security/authentication-patterns.mdc`
- [ ] Deployment pattern chosen (Same-Origin, Split-Origin, or Hybrid)
- [ ] IIS configuration reviewed (`AuthResearch.md`)
- [ ] Database ready for user/session tables (if using session auth)

## Steps

### 1. Choose Authentication Pattern

**Action**: Use decision tree from authentication-patterns.mdc

**Decision Tree:**

```
Q1: External API consumers?
├─ YES → Pattern B or C
└─ NO  → Pattern A

Q2: Independent scaling needed?
├─ YES → Pattern B
└─ NO  → Continue

Q3: Different security policies needed?
├─ YES → Pattern C
└─ NO  → Pattern A
```

**Result**: Document chosen pattern in project-overview.md

### 2A. Implement Pattern A (Same-Origin + Session Cookies)

#### 2A.1 Create User Entity & Repository

**See**: `02-add-domain-entity.md` for full entity workflow

```csharp
// Domain/Entities/User.cs
public sealed record User : AuditableEntity<Guid>
{
    public required string Email { get; init; }
    public required string HashedPassword { get; init; }
    public UserStatus Status { get; init; } = UserStatus.Active;

    public bool CanLogin() => Status == UserStatus.Active;
}
```

#### 2A.2 Create Session Store

**Action**: Choose session storage strategy
**Options**:

- In-memory (development only)
- PostgreSQL table
- Redis (production)

#### 2A.3 Add Authentication Middleware

**Files**: `apps/api/Middleware/AuthenticationMiddleware.cs`

```csharp
public class AuthenticationMiddleware
{
    public async Task InvokeAsync(HttpContext context)
    {
        // Validate session cookie
        // Set context.User
    }
}
```

#### 2A.4 Create Login/Logout Endpoints

**Files**: `apps/api/Endpoints/Auth/LoginEndpoint.cs`

```csharp
public sealed class LoginEndpoint : Endpoint<LoginRequest, LoginResponse>
{
    public override void Configure()
    {
        Post("/api/auth/login");
        AllowAnonymous();
    }

    public override async Task HandleAsync(LoginRequest req, CancellationToken ct)
    {
        // Validate credentials
        // Create session
        // Set cookie
        await Send.OkAsync(new LoginResponse { Success = true });
    }
}
```

#### 2A.5 Configure CORS (Same-Origin)

**Files**: `apps/api/Program.cs`

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://yourapp.com")
              .AllowCredentials()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

#### 2A.6 Configure IIS

**Files**: Create `apps/web/web.config` for IIS deployment
**Pattern**: See `AuthResearch.md` for complete configuration

### 2B. Implement Pattern B (Split-Origin + JWT)

#### 2B.1 Install JWT Library

```bash
pnpm add:nuget Microsoft.AspNetCore.Authentication.JwtBearer api
```

#### 2B.2 Generate JWT Keys

**Using envx:**

```bash
envx.rotateKeys password=<your-password>
# Stores RSA-4096 keypair in ~/.envvault/{projectId}/jwt/
```

#### 2B.3 Configure JWT Authentication

**Files**: `apps/api/Program.cs`

```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new RsaSecurityKey(/* load from envx */)
        };
    });
```

#### 2B.4 Create Token Service

**Files**: `apps/api/Application/Services/TokenService.cs`

```csharp
public interface ITokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
}
```

#### 2B.5 Configure CORS (Split-Origin)

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("https://www.yourapp.com")
              .AllowCredentials()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

### 2C. Implement Pattern C (Hybrid)

**See**: Combine 2A + 2B, then:

#### 2C.1 Configure Two IIS Sites

**Action**: Deploy same artifact to two IIS sites
**Pattern**: See `AuthResearch.md` for dual-site configuration

#### 2C.2 Conditional Authentication

**Files**: `apps/api/Program.cs`

```csharp
// Support both cookie and JWT
builder.Services.AddAuthentication()
    .AddCookie("Cookies")
    .AddJwtBearer("Bearer", options => { /* ... */ });
```

#### 2C.3 Per-Endpoint Auth Scheme

```csharp
// Endpoint for web (cookie)
public override void Configure()
{
    Get("/api/users");
    AuthSchemes("Cookies");
}

// Endpoint for public API (JWT)
public override void Configure()
{
    Get("/api/public/data");
    AuthSchemes("Bearer");
}
```

### 3. Frontend Integration

#### 3.1 Create Auth Context (if using cookies)

**Files**: `apps/web/lib/auth/auth-context.tsx`

```typescript
'use client';

import { createContext, useContext, useState } from 'react';

interface AuthContext {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  async function login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      const user = await res.json();
      setUser(user);
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

#### 3.2 Add to Providers

**Files**: `apps/web/lib/providers.tsx`

```typescript
import { AuthProvider } from './auth/auth-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
      <Toaster />
    </QueryClientProvider>
  );
}
```

### 4. Add Protected Routes

**Files**: `apps/web/app/(protected)/layout.tsx`

```typescript
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode
}) {
  const sessionCookie = cookies().get('session');

  if (!sessionCookie) {
    redirect('/login');
  }

  return <>{children}</>;
}
```

## Verification

### Backend

- [ ] Authentication middleware configured
- [ ] Login endpoint returns token/cookie
- [ ] Logout endpoint clears session/token
- [ ] Protected endpoints return 401 when unauthenticated
- [ ] CORS configured with explicit origins (no wildcards)
- [ ] Secrets managed via envx (not committed)

### Frontend

- [ ] Login form submits to correct endpoint
- [ ] Credentials included in requests (`credentials: 'include'`)
- [ ] Protected routes redirect unauthenticated users
- [ ] Auth state persists across page reloads
- [ ] Logout clears auth state

### Security

- [ ] Passwords hashed (BCrypt, Argon2, or PBKDF2)
- [ ] HTTPS enforced in production
- [ ] Session cookies have HttpOnly flag
- [ ] Session cookies have Secure flag (production)
- [ ] JWT tokens have short expiration (≤30 min)
- [ ] Refresh token rotation implemented (if using)
- [ ] Rate limiting on auth endpoints
- [ ] Failed login attempts logged

## Common Patterns

**Session-Based Auth Flow:**

1. POST /api/auth/login → Set-Cookie: session={token}
2. Subsequent requests → Cookie: session={token}
3. Backend validates session, sets context.User
4. POST /api/auth/logout → Clear session cookie

**JWT Auth Flow:**

1. POST /api/auth/login → { accessToken, refreshToken }
2. Client stores tokens (memory + httpOnly cookie for refresh)
3. API requests → Authorization: Bearer {accessToken}
4. Token refresh → POST /api/auth/refresh with refresh token

## Related

- **Rules**:
  - `.cursor/rules/security/authentication-patterns.mdc` ⭐ PRIMARY
  - `.cursor/rules/security/authorization.mdc`
  - `.cursor/rules/security/secrets-management.mdc`
  - `.cursor/rules/api-general-guidelines.mdc`
- **Research**:
  - `AuthResearch.md` - IIS deployment patterns
- **Documentation**:
  - `apps/api/README.md`
  - `apps/web/README.md`
