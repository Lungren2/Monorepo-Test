# Workflow: Add Client Component

## Context

- **When**: Creating a React component that needs client-side interactivity
- **Duration**: 15-30 minutes
- **Complexity**: Low

## Prerequisites

- [ ] Feature identified and located in `apps/web/`
- [ ] Understanding of when `"use client"` is needed
- [ ] Data fetching strategy determined (Server Component, TanStack Query, or static)

## Steps

### 1. Determine Component Type

**Decision**: Does this component need client-side features?

**Use "use client" when:**

- Using React hooks (useState, useEffect, useRef, etc.)
- Handling browser events (onClick, onChange, onSubmit)
- Using browser APIs (localStorage, window, document)
- Using client-only libraries (TanStack Query hooks, Motion animations)

**Keep as Server Component when:**

- Rendering static content
- Fetching data server-side
- No interactivity needed
- Can use Suspense for loading states

### 2. Create Component File

**Action**: Create component in appropriate location
**Files**: `apps/web/components/{feature}/{ComponentName}.tsx`

**Server Component Pattern:**

```typescript
/* =============================================================================
 * CONTEXT: components/{feature}
 * PATTERN: server-component
 * DEPENDS_ON: None (or server-side data sources)
 * USED_BY: app/{route}/page.tsx
 * -----------------------------------------------------------------------------
 * {Description}. Renders server-side, no client JS bundle impact.
 * =============================================================================
 */

import type { ReactNode } from 'react';

interface {ComponentName}Props {
  readonly title: string;
  readonly children?: ReactNode;
}

export function {ComponentName}({ title, children }: {ComponentName}Props) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

**Client Component Pattern:**

```typescript
/* =============================================================================
 * CONTEXT: components/{feature}
 * PATTERN: client-component
 * DEPENDS_ON: React hooks, browser APIs
 * USED_BY: app/{route}/page.tsx
 * -----------------------------------------------------------------------------
 * {Description}. Client-side interactivity, includes in JS bundle.
 * =============================================================================
 */

'use client';

import { useState } from 'react';

interface {ComponentName}Props {
  readonly initialValue: string;
  readonly onSave: (value: string) => void;
}

export function {ComponentName}({ initialValue, onSave }: {ComponentName}Props) {
  const [value, setValue] = useState(initialValue);

  return (
    <div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={() => onSave(value)}>
        Save
      </button>
    </div>
  );
}
```

### 3. Add Data Fetching (if needed)

**Server Component (Preferred):**

```typescript
export async function {ComponentName}() {
  const data = await fetch('http://localhost:5000/api/data', {
    cache: 'force-cache',
    next: { revalidate: 60, tags: ['data'] }
  });
  const result = await data.json();

  return <div>{result.name}</div>;
}
```

**Client Component with TanStack Query:**

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';

export function {ComponentName}() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['entity', 'list'],
    queryFn: async () => {
      const res = await fetch('/api/entities');
      return res.json();
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return <div>{/* render data */}</div>;
}
```

### 4. Add Styling

**Action**: Use Tailwind v4 with design tokens
**Pattern**: Structure with utilities, visuals via tokens

```typescript
<div className="flex items-center gap-3 bg-wf-card border-wf-border rounded-lg p-4">
  <h2 className="heading-2 text-wf-fg">{title}</h2>
</div>
```

**Avoid:** Default Tailwind colors (`bg-blue-500`, `text-gray-900`)

### 5. Import and Use Component

**Action**: Add to parent page or layout
**Files**: `apps/web/app/{route}/page.tsx`

```typescript
import { {ComponentName} } from '@/components/{feature}/{ComponentName}';

export default function Page() {
  return (
    <main>
      <{ComponentName} title="Hello" />
    </main>
  );
}
```

### 6. Add Animation (if needed)

**Action**: Use Motion for accessible animations
**Pattern**: Client component with Motion

```typescript
'use client';

import { motion, AnimatePresence } from 'motion/react';

export function {ComponentName}({ open }: { open: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          Content
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

## Verification

- [ ] Component renders without errors
- [ ] "use client" only used when necessary
- [ ] Props are properly typed (no `any`)
- [ ] Styling uses Tailwind v4 tokens (no default colors)
- [ ] Data fetching uses appropriate strategy (Server Component or TanStack Query)
- [ ] Animations respect reduced motion preferences
- [ ] Component is accessible (keyboard navigation, ARIA labels)
- [ ] No linter errors or warnings

## Common Patterns

**Suspense Boundary:**

```typescript
// app/page.tsx (Server Component)
import { Suspense } from 'react';
import { DataComponent } from '@/components/DataComponent';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataComponent />
    </Suspense>
  );
}
```

**Form with Server Action:**

```typescript
'use client';

export function FormComponent() {
  async function handleSubmit(formData: FormData) {
    'use server';
    // Server action logic
  }

  return <form action={handleSubmit}>...</form>;
}
```

## Related

- **Rules**:
  - `.cursor/rules/dependencies/next/server-first.mdc`
  - `.cursor/rules/dependencies/typescript-best-practices.mdc`
  - `.cursor/rules/dependencies/tailwind-best-practices.mdc`
  - `.cursor/rules/dependencies/motion-best-practices.mdc`
- **Examples**:
  - `apps/web/lib/providers.tsx` - Client boundary pattern
  - `apps/web/components/navigation/` - Complex component organization
- **Documentation**:
  - `apps/web/README.md`
