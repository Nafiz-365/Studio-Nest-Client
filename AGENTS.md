<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Stack

Next.js 16.4.3 (App Router) · React 19.3 · TypeScript strict · Tailwind v4 (CSS-first — no config file) · shadcn style `base-nova` (Base UI, not Radix) · better-auth + MongoDB · framer-motion / swiper / jspdf

## Commands

- `npm run dev` — dev server (Turbopack)
- `npx tsc --noEmit` — fastest verification signal; run this first
- `npm run lint` — ESLint (flat config, passes clean)
- `npm run build` — passes
- No test suite, no CI, no formatter config

## Architecture

- `src/app/**/page.tsx` are thin wrappers; real UI lives in `src/views/*` — **every view is `"use client"`**, the app is effectively a SPA.
- `src/lib/AppContext.tsx` is the single state store (`useApp()`):
  - Auth comes from better-auth: `authClient.useSession()` → `user`, `isAuthPending`
  - Studios/bookings/wishlist/theme persist to localStorage under `studionest.*` keys, hydrate-gated via `isHydrated`
- `src/app/providers.tsx` = AppProvider + Header/Footer/Toaster shell (global on every page).
- Auth wiring — all three pieces are load-bearing:
  - `src/lib/auth.ts` (server: betterAuth + mongo adapter + jwt plugin)
  - `src/app/api/auth/[...all]/route.ts` (Next route handler — don't delete or move)
  - `src/lib/auth-client.ts` (browser client)
- **Two fetch failure modes**: `src/lib/server-api.ts` (server helpers) **throws** on failure; `AppContext` client fetches use `.catch(() => {})` and fall back to localStorage/seed data. Match the semantics of the layer you're in.
- Protected pages: wrap in `<ProtectedRoute>` inside `<Suspense>` (see `app/dashboard/page.tsx`) — `useSearchParams` requires Suspense.

## Env vars (no `.env*` files are committed — they're gitignored)

| Variable | Required? | Notes |
|---|---|---|
| `MONGODB_URI` | **Yes** | better-auth crashes at startup without it (`as string` cast, no validation) |
| `NEXT_PUBLIC_APP_URL` | No | auth client origin, defaults to `http://localhost:3000` |
| `NEXT_PUBLIC_API_BASE_URL` | No | Express backend at `:8000`; **optional** — app falls back to seed/localStorage when unreachable |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | No | enables Google sign-in |
| `NEXT_PUBLIC_IMGBB_API_KEY` | No | image uploads in `StudioForm` |

## Gotchas

- Path alias: `@/*` → `src/*` (tsconfig.json).
- Custom tokens: `globals.css` maps `--color-bg/-surface/-text/-line` to standard shadcn vars, and defines `.container-shell`, `.nav-link`, `.nav-link-active`, `.section-space`, `.icon-button`. Use them; don't redefine.
- shadcn components here are Base UI-based — no Radix `asChild` prop; use Base UI's `render` prop instead.
- The agent-rules block at the top is rewritten by `next dev` — commit it with your changes instead of stripping it.
