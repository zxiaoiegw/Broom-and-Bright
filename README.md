# Cleaning & Spa Business Sites

A pnpm monorepo containing two conversion-focused service business websites — **TrueClean KC** (residential/commercial cleaning) and **Serenity Spa** (massage & wellness) — plus a shared Express API server backed by PostgreSQL.

## Run & Operate

- `pnpm --filter @workspace/broom-and-bright run dev` — TrueClean KC frontend (preview at `/broom-and-bright/`)
- `pnpm --filter @workspace/serenity-spa run dev` — Serenity Spa frontend (preview at `/`)
- `pnpm --filter @workspace/api-server run dev` — API server (requires `DATABASE_URL`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Required environment variables

- `DATABASE_URL` — Postgres connection string (needed for the API server; frontends run without it)
- `CORS_ORIGIN` — comma-separated list of allowed frontend origins for credentialed (cookie) requests. Optional locally (defaults to reflecting the request origin); set this in production.
- `SEED_OWNER_NAME` / `SEED_OWNER_EMAIL` / `SEED_OWNER_PASSWORD` — only needed once, to run `pnpm --filter @workspace/api-server run seed-owner` and create the first staff login (see Staff scheduling below).

## Stack

- pnpm workspaces, Node.js 20, TypeScript 5.9
- Frontends: React + Vite + Tailwind CSS + shadcn/ui, routing via wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Scheduling: TrueClean KC uses a from-scratch staff-managed calendar (see below) — no third-party booking widget. Payment is not collected online yet (v1); see Staff scheduling.

## Where things live

- `artifacts/broom-and-bright/` — TrueClean KC cleaning service site
- `artifacts/serenity-spa/` — Serenity Massage & Spa site
- `artifacts/api-server/` — Express API server
- `lib/db/` — Drizzle ORM schema and client
- `lib/api-spec/` — OpenAPI spec (source of truth for API contracts)
- `lib/api-client-react/` — generated React Query hooks (from `pnpm codegen`)
- `lib/api-zod/` — generated Zod schemas

## Staff scheduling (custom calendar)

TrueClean KC has fully replaced Cal.com and Square Appointments with a self-hosted calendar —
neither is embedded anywhere in the site anymore. Schema: `staff`, `availability_rules`,
`availability_overrides`, and `bookings` tables in `lib/db/src/schema/`.

- **Staff login**: session cookie (httpOnly, scrypt-hashed passwords) — see `artifacts/api-server/src/lib/auth.ts`. No public signup; the first "owner" account is created once via `pnpm --filter @workspace/api-server run seed-owner` (needs `SEED_OWNER_*` env vars, see above), and owners add further staff from the dashboard's Team tab.
- **Staff dashboard**: `/staff/login` + `/staff/dashboard` in `artifacts/broom-and-bright/src/pages/staff/` — bookings list (edit/reschedule/cancel), weekly-hours + day-off editor, a Sync tab (see below), and (owners only) a Team tab to add staff.
- **Booking creation is auto-assign**: `POST /api/bookings` (public) picks whichever staff member's weekly rules/overrides/existing bookings leave them free for the requested slot — see `artifacts/api-server/src/lib/slots.ts`. Business hours are interpreted in `America/Chicago` (DST-correct via `Intl`, no date library needed). Job duration is size-aware (bedrooms/baths/sqft/add-ons), not a flat per-service number — see `artifacts/broom-and-bright/src/pages/free-quote/DURATION_ESTIMATES.md`.
- **Customer-facing booking**: the `/free-quote` flow's Schedule step (`ScheduleStep.tsx`) *is* the self-serve calendar — a real calendar showing only dates/times with actual open slots (`GET /api/slots`, `GET /api/available-dates`), submitting straight to `POST /api/bookings`. Every "Schedule Now" / "Book Now" CTA on the site points at `/free-quote`.
- **Calendar sync (one-way)**: each staff member can generate a personal `.ics` subscription link (Sync tab → `GET /api/calendar-feed/:token`) to add their TrueClean jobs to Google Calendar ("Add calendar → From URL") or Apple Calendar ("New Calendar Subscription"). Read-only — nothing flows back from their personal calendar. See `artifacts/api-server/src/routes/calendar-feed.ts` / `src/lib/ics.ts`.

## Architecture decisions

- Two separate frontend artifacts share one API server and database — allows independent branding and deployment while reusing backend logic.
- TrueClean KC's scheduling is fully custom (no Cal.com/Square) — see Staff scheduling above. It does **not** collect payment online yet (by design, v1) — that's handled outside the booking flow for now.
- API types are generated from the OpenAPI spec in `lib/api-spec/` — always run codegen after changing the spec. (The staff/booking/availability routes are hand-written Express + inline Zod validation instead, matching the existing `quote-requests`/`contact-requests` routes — they were never added to the OpenAPI spec either.)

## User preferences

- Replaced Cal.com and Square Appointments entirely with a custom staff-managed calendar (disliked their UI/limits) — both are fully removed from the codebase, not just unused. Decisions made: multiple staff each get their own login (not solo); auto-assign whichever staff member is free rather than customer-picks-cleaner; no online payment collection in v1 — add later once the calendar itself works; staff accounts are added by an owner (temp password), not self-service signup or invite links.

## Gotchas

- Frontends run without `DATABASE_URL`; the API server will crash on startup without it.
- Always run `pnpm --filter @workspace/api-spec run codegen` after editing the OpenAPI spec, or the React hooks and Zod schemas will be out of date.
- New DB feature setup order: provision Postgres → set `DATABASE_URL` → `pnpm --filter @workspace/db run push` (creates the tables) → set `SEED_OWNER_*` and run `pnpm --filter @workspace/api-server run seed-owner` once → log in at `/staff/login`.
- Staff dashboard auth uses a cross-origin cookie (frontend and API are different domains) — `credentials: 'include'` is required on every staff fetch (already handled in `pages/staff/staffApi.ts`), and `CORS_ORIGIN` must list the real frontend origin in production or the cookie won't be accepted.


