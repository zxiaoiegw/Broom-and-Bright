# Cleaning & Spa Business Sites

A pnpm monorepo containing two conversion-focused service business websites — **Broom & Bright** (residential/commercial cleaning) and **Serenity Spa** (massage & wellness) — plus a shared Express API server backed by PostgreSQL.

## Run & Operate

- `pnpm --filter @workspace/broom-and-bright run dev` — Broom & Bright frontend (preview at `/broom-and-bright/`)
- `pnpm --filter @workspace/serenity-spa run dev` — Serenity Spa frontend (preview at `/`)
- `pnpm --filter @workspace/api-server run dev` — API server (requires `DATABASE_URL`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Required environment variables

- `DATABASE_URL` — Postgres connection string (needed for the API server; frontends run without it)

## Stack

- pnpm workspaces, Node.js 20, TypeScript 5.9
- Frontends: React + Vite + Tailwind CSS + shadcn/ui, routing via wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Scheduling/payments: Cal.com embed (placeholders — wire in your real Cal.com username)

## Where things live

- `artifacts/broom-and-bright/` — Broom & Bright cleaning service site
- `artifacts/serenity-spa/` — Serenity Massage & Spa site
- `artifacts/api-server/` — Express API server
- `lib/db/` — Drizzle ORM schema and client
- `lib/api-spec/` — OpenAPI spec (source of truth for API contracts)
- `lib/api-client-react/` — generated React Query hooks (from `pnpm codegen`)
- `lib/api-zod/` — generated Zod schemas

## Cal.com placeholders

Both sites embed Cal.com booking widgets. Before going live, replace placeholder slugs like `{{CALCOM_USERNAME}}/standard-clean` with your real Cal.com username and event type slugs.

## Architecture decisions

- Two separate frontend artifacts share one API server and database — allows independent branding and deployment while reusing backend logic.
- Cal.com owns scheduling + payment (Stripe integration built into Cal.com) — no custom checkout code needed.
- API types are generated from the OpenAPI spec in `lib/api-spec/` — always run codegen after changing the spec.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Frontends run without `DATABASE_URL`; the API server will crash on startup without it.
- Always run `pnpm --filter @workspace/api-spec run codegen` after editing the OpenAPI spec, or the React hooks and Zod schemas will be out of date.

pnpm --filter @workspace/broom-and-bright dev:local
