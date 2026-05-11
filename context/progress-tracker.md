# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 1: Foundation

## Current Goal

- Feature 05: Prisma — `Project` and `ProjectCollaborator` models, Prisma client singleton with adapter branching, and initial migration.

## Completed

- Feature 01: Design system — shadcn/ui initialized (v4.7.0, Tailwind v4, base-nova style), all 7 primitive components installed (Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea), lucide-react installed, `lib/utils.ts` with `cn()` helper created, `app/globals.css` updated with full dark theme token set, `dark` class applied to `<html>` element.
- Feature 02: Editor chrome — `components/editor/editor-navbar.tsx` (fixed top bar, sidebar toggle with PanelLeftOpen/PanelLeftClose icons) and `components/editor/project-sidebar.tsx` (floating overlay sidebar, Tabs with My Projects/Shared, New Project button) created.
- Feature 03: Auth — `@clerk/ui` installed; `proxy.ts` at root uses `clerkMiddleware` + `createRouteMatcher` to protect every route except `/sign-in/*` and `/sign-up/*`; `ClerkProvider` wraps the root layout with shared `lib/clerk-appearance.ts` (Clerk `dark` theme + CSS-variable-driven `variables`); `app/(auth)/{sign-in,sign-up}/[[...rest]]/page.tsx` render Clerk `<SignIn />` / `<SignUp />` inside a two-panel `(auth)` layout (left: logo + tagline + text-only feature bullets, right: centered form, collapses to form-only on small screens); `app/page.tsx` redirects authenticated users to `/editor` and unauthenticated users to `/sign-in`; `UserButton` mounted in the editor navbar right section.
- Feature 04: Project dialogs — `/editor` home shows a centered empty-state hero (heading, description, `New Project` button with `Plus` icon). `hooks/use-project-dialogs.ts` owns dialog mode, form name, active project, and loading state. `components/editor/project-dialogs-context.tsx` exposes the hook via context so `EditorShell`, `ProjectSidebar`, and the editor home share state. Create/Rename/Delete dialogs (`components/editor/{create,rename,delete}-project-dialog.tsx`) are mounted once in `EditorShell`. Create dialog has a live slug preview (via `lib/slugify.ts`); Rename dialog prefills the input, auto-focuses, shows current name in description, and submits on Enter; Delete dialog is destructive-only confirmation with no input. Sidebar lists projects from `lib/mock-projects.ts`, with hover-reveal rename/delete actions on owned items only; shared tab has no actions. Mobile gets a backdrop scrim (`md:hidden`) that closes the sidebar on tap.
- Feature 05: Prisma — `prisma/models/project.prisma` defines `Project` (id, ownerId Clerk user, name, optional description, `ProjectStatus` enum DRAFT/ARCHIVED defaulting to DRAFT, optional `canvasJsonPath`, createdAt/updatedAt, indexes on ownerId and createdAt) and `ProjectCollaborator` (project relation with cascade delete, email, createdAt, unique `(projectId, email)`, indexes on email and `(projectId, createdAt)`). `lib/prisma.ts` is a cached singleton that branches on `DATABASE_URL`: `prisma+postgres://` → `new PrismaClient({ accelerateUrl }).$extends(withAccelerate())`; otherwise → `new PrismaClient({ adapter: new PrismaPg({ connectionString }) })`. Client cached on `globalThis.prisma` outside production. Initial migration `20260511144525_init` applied; generated client lives at `app/generated/prisma/` (gitignored). `@prisma/extension-accelerate` added as a dependency.

## In Progress

- None.

## Next Up

- Add the next planned feature unit here.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- shadcn/ui configured with `base-nova` style, CSS variables, RSC enabled, lucide icon library.
- All theme colors defined as CSS custom properties in `globals.css` (`:root` only — no light mode). Mapped to Tailwind utilities via `@theme inline`. Project tokens (`--bg-base`, `--text-primary`, etc.) coexist with shadcn tokens (`--background`, `--foreground`, etc.) — both set to the same dark values.
- `components/ui/*` files are protected — do not modify after installation.
- Auth runs through `proxy.ts` (Next 16 renamed Middleware → Proxy); `clerkMiddleware` is exported as the proxy default. Public routes are derived from `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL`; everything else is `auth.protect()`-gated.
- Clerk appearance is shared via `lib/clerk-appearance.ts` so server (provider) and client surfaces stay consistent. It uses Clerk's `dark` theme as the base and overrides `variables` with `var(--...)` references — no hardcoded colors.
- Auth pages live under a route group `app/(auth)/...` with a shared two-panel layout; Clerk's default user menu and profile flows are kept intact (mounted via `<UserButton />`).
- Project dialog state is owned by a single hook (`useProjectDialogs`) and shared via `ProjectDialogsProvider`. Dialogs are mounted once in `EditorShell`; consumers only call `openCreate` / `openRename` / `openDelete`. No persistence yet — `submit()` is a no-op placeholder that resolves and closes the dialog.
- Prisma 7 multi-file schema: `prisma.config.ts` points `schema` at the `prisma/` directory, so `prisma/schema.prisma` (generator + datasource) and `prisma/models/*.prisma` are merged at generate time. Generator output is `app/generated/prisma/` (gitignored); client is imported from `@/app/generated/prisma/client`.
- Prisma client adapter selection runs at module load — switching `DATABASE_URL` prefix between `postgres://` and `prisma+postgres://` selects the adapter for the next process start, not at runtime.

## Session Notes

- Project uses Tailwind CSS v4 (`@tailwindcss/postcss`) and Next.js 16.2.6.
- Project Tailwind utility names: `bg-base`, `bg-surface`, `bg-elevated`, `bg-subtle`, `text-copy-primary`, `text-copy-secondary`, `text-copy-muted`, `text-copy-faint`, `border-surface-border`, `border-surface-border-subtle`, `text-brand`, `bg-accent-dim`, `text-ai`, `text-ai-text`, `text-error`, `text-success`, `text-warning`.
- Clerk env vars in `.env.local`: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL`, `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`.
