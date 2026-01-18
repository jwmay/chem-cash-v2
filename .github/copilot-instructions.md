# Chem Cash v2 - AI Coding Agent Instructions

## Project Overview

**Chem Cash** is a full-stack React Router 7 web application—a class reward
system for managing student incentives. Architecture: React 19 frontend with
React Router 7 (SPA mode disabled), Supabase for auth/data, TailwindCSS v4 with
daisyUI v5 for styling, Zod for validation, and Conform for form state.

## Tech Stack & Build

- **Build Tool**: Vite + React Router CLI (`npm run dev`, `npm run build`)
- **Framework**: React Router 7 (full-stack capable but configured as SPA with
  `ssr: false`)
- **Styling**: TailwindCSS 4 + daisyUI 5 (CSS-first, no config file needed—see
  `app.css`)
- **Auth & Data**: Supabase (JWT sessions, row-level security)
- **Forms**: Conform + Zod (server-side validation patterns, even in SPA mode)
- **Type Generation**: `react-router typegen` auto-generates route types in
  `app/+types/`

## Architecture

### Route Structure (`app/routes.ts`)

Routes use React Router's declarative config. **Protected routes** wrap via
`routes/protected.tsx` (auth guard). Three role-based layouts:

- **AdminLayout** → `/admin/*`
- **StudentLayout** → `/student/*`
- **TeacherLayout** → `/teacher/*`

All require successful auth check in `protected.tsx` clientLoader or redirect to
`/login`.

### Authentication & Session

- **SessionContext** (`app/context/SessionContext.tsx`): Manages Supabase auth
  state and user profile
  - Subscribes to `supabase.auth.onAuthStateChange()` on mount
  - Caches profile in sessionStorage (5-min TTL for in-memory cache)
  - **Critical**: Always use context via `useContext(SessionContext)` instead of
    direct Supabase calls
- **Protected Route Guard** (`app/routes/protected.tsx`): `clientLoader` checks
  auth, fetches profile, maps `user_role` → layout props
- **Session Lifetime**: Uses Supabase JWT; `clearProfileCache()` available for
  manual invalidation

### Data Flow

1. User logs in → Supabase JWT created
2. App mounts → SessionContext subscribes to auth changes
3. Protected route loads → clientLoader validates session + fetches profile from
   cache/DB
4. Profile context available throughout app via SessionProvider wrapper
5. Layout receives `userRole` as prop → renders role-specific nav (Navbar +
   Dock)

### Component Patterns

#### Forms (Conform + Zod)

Forms use **Conform** for client-side form state with **Zod** validation.
Example structure:

```tsx
import { getFormProps, getInputProps } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'

const schema = z.object({ email: z.string().email() })
const [form, fields] = useForm({
  // optional ID for multi-form pages
  id: 'my-form',
  onValidate({ formData }) {
    return parseWithZod(formData, { schema })
  },
})
// Render: <input {...getInputProps(fields.email, { type: 'email' })} />
```

#### UI Components (daisyUI)

All UI components use **daisyUI 5 classes** + TailwindCSS utilities. Key
patterns:

- **Buttons**: `btn btn-primary` (see `components/ui/button.tsx` for wrapper)
- **Forms**: `input input-bordered`, `select select-bordered`,
  `textarea textarea-bordered`
- **Layout**: `navbar`, `drawer`, `card`, `modal` (no custom CSS needed)
- **Status**: `badge`, `loading`, `progress` for feedback
- Avoid custom CSS; compose daisyUI + utility classes (e.g., `btn px-10`)

#### Layout Components

Layouts (`app/layouts/*`) wrap `<Outlet />` with navigation UI:

- **Navbar** (`components/navbar.tsx`): Top bar with user info
- **Dock** (`components/dock.tsx`): Bottom navigation (role-specific)
- Props: `userRole: 'admin' | 'student' | 'teacher'` (passed from protected.tsx
  loader)

### Error Handling

- **Route Errors**: `root.tsx` ErrorBoundary catches errors; shows 404 for
  `isRouteErrorResponse(error)`
- **Form Errors**: Use `ErrorList` component from `components/forms.tsx`
  (filters nulls, displays as `<ul>`)
- **Validation**: Zod handles schema; Conform displays errors inline per field
- **Console Logs**: Numbered debug logs (`[1]`, `[2]`, etc.) in protected.tsx,
  SessionContext for tracing auth flow

## Development Workflows

### Quick Start

```bash
npm run dev          # Start Vite dev server (HMR enabled, http://localhost:5173)
npm run typecheck    # Run `react-router typegen && tsc` (required before build)
npm run build        # Production build (output: build/client, build/server)
npm run start        # Run production build locally
```

### Common Tasks

1. **Add Route**: Update `app/routes.ts`, run `npm run typecheck`
   (auto-generates types in `+types/`)
2. **Add Protected Page**: Create in `app/pages/{role}/`, wire in routes.ts
   under layout, verify layout receives props
3. **Update Form**: Modify Zod schema in component, Conform re-validates on
   change
4. **Style Component**: Use daisyUI classes + TailwindCSS utils; avoid `app.css`
   for component styles (use inline classes)

### Type Safety

- Routes auto-generate types in `app/+types/` (don't edit manually)
- `Route.LoaderFunctionArgs`, `Route.ComponentProps`, `Route.ErrorBoundaryProps`
  available in routed files
- Always run `npm run typecheck` before committing

## Project-Specific Conventions

### File Organization

```
app/
├── routes/              # Route handlers (login, protected auth guard, home)
├── pages/{role}/        # Role-specific pages (AdminPage, StudentPage, etc.)
├── layouts/             # Role-based layout wrappers (AdminLayout, StudentLayout, etc.)
├── components/          # Shared UI (navbar, dock, forms, icons, loading)
│   └── ui/              # Atomic components (button, fly-away-button)
├── context/             # SessionContext + Providers
├── lib/supabase/        # Supabase client config (client.ts)
└── app.css              # Global TailwindCSS + daisyUI config (do not add component styles here)
```

### Naming Conventions

- **Pages**: PascalCase, suffix with "Page" (e.g., `StudentPage.tsx`)
- **Layouts**: PascalCase, suffix with "Layout" (e.g., `StudentLayout.tsx`)
- **Components**: PascalCase, no suffix (e.g., `Navbar.tsx`, `forms.tsx` for
  utility)
- **Routes**: kebab-case files, match URL pattern (e.g., `routes/protected.tsx`
  → `/protected`)

### Supabase Integration

- **Auth**: Use `supabase.auth.getUser()` in loaders, subscribe in
  SessionContext
- **Data Queries**: Prefer profile fetch → pass via context; avoid creating new
  auth listeners in pages
- **Caching**: In-memory 5-min cache in `protected.tsx` reduces Supabase reads
- **Client Config**: `lib/supabase/client.ts` exports singleton instance; import
  as `import { supabase } from '~/lib/supabase/client'`

### Import Aliases

Vite + tsconfig-paths configured; use `~` for `app/`:

```tsx
import { supabase } from '~/lib/supabase/client'
import Navbar from '~/components/navbar'
```

## Common Pitfalls to Avoid

1. **Don't** create auth listeners in multiple components—use SessionContext
   only
2. **Don't** add custom CSS to `app.css` for components—use daisyUI + inline
   utilities
3. **Don't** skip `npm run typecheck` before build (auto-gen types in `+types/`
   can drift)
4. **Don't** mutate profile cache directly—call `clearProfileCache()` if
   invalidation needed
5. **Don't** query Supabase in page renders without caching—use protected.tsx
   loader or SessionContext

## References

- [React Router 7 Docs](https://reactrouter.com/)
- [daisyUI 5](https://daisyui.com/) (included: `daisyui.instructions.md`)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Conform + Zod Forms](https://conform.guide/)
