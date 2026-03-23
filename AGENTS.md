<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Context

## Product Goal
- This app is a mobile-first CRUD for mapping members of church cell groups (`celulas`).
- The current implemented scope is the member registration flow on `/`.
- Prioritize simplicity, clear visual hierarchy, large touch targets, and accessible contrast.

## Current Stack
- Next.js 16 App Router with React 19 and TypeScript.
- Tailwind CSS v4 for styling.
- Supabase JavaScript client for database access.
- No authentication layer yet; current Supabase access is server-side only.

## Current Architecture
- `app/page.tsx`: thin route that loads cell options and renders the registration page.
- `app/actions/membros.ts`: server action orchestration only.
- `components/membros/*`: UI for the member form and trajectory sections.
- `app/types/trajetoria.ts`: single source of truth for trajectory categories, labels, and totals.
- `lib/mapeamento/*`: domain/data layer for constants, shared types, cell loading, member validation, and persistence.
- `lib/supabase/server.ts`: server-only Supabase client/config access.

## Data Model
- Schema: `mapeamento`
- Tables:
  - `celulas`: context selector data
  - `membros`: `nome`, `celula_id`, `passos_concluidos`
- `passos_concluidos` is stored as `TEXT[]` and must stay aligned with the labels in `app/types/trajetoria.ts`.

## Important Conventions
- Keep `app` thin. Prefer putting data access and validation in `lib/mapeamento/*`.
- Do not make route files depend on component-owned types.
- Reuse `MEMBER_FORM_FIELDS` from `lib/mapeamento/constants.ts` instead of hardcoding form field names.
- Reuse totals and category metadata from `app/types/trajetoria.ts` instead of hardcoding counts like `19` or `4`.
- Prefer extending the existing `lib/mapeamento` layer for future list/edit/delete flows instead of querying Supabase directly from routes/components.

## Supabase Notes
- Required env vars: `NEXT_PUBLIC_SUPABASE_URL` and either `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Loading cells currently goes through `loadCelulaOptions()`.
- Member creation currently goes through validation in `validateCreateMemberFormData()` and persistence in `createMember()`.

## When Updating This App
- If the trajectory changes, update `app/types/trajetoria.ts` first and let UI/validation derive from it.
- If form fields change, update `lib/mapeamento/constants.ts` and the server validation flow together.
- If the database schema changes, review `migrations/initial_structure.sql` and `lib/mapeamento/*` in the same task.

## Cursor Cloud specific instructions

- **Package manager:** npm (lockfile is `package-lock.json`).
- **Dev server:** `npm run dev` starts Next.js on port 3000.
- **Lint:** `npm run lint` runs ESLint. Currently passes with only warnings.
- **Build:** `npm run build` produces a production build.
- **No test framework** is configured; there are no automated tests to run.
- **Supabase env vars** (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) must be set as Cursor secrets. The app gracefully shows a config error message if they are missing, but forms won't submit.
- The app is a single-page member registration flow at `/`. The "hello world" task is: select a cell group, enter a name, check trajectory steps, and click "SALVAR MEMBRO".
