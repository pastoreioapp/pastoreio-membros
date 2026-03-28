<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Context

## Product Goal
- Mobile-first CRUD for mapping members of church cell groups (`celulas`).
- Flows: unified access code gate on `/` (supports both cell and sector codes), leader area on `/lider/[codigo]` (list, create, edit), sector area on `/setor/[codigo]` (cell listing, create cell, insights), and member self-registration on `/membro/[codigo]`.
- Prioritize simplicity, clear visual hierarchy, large touch targets, and accessible contrast.

## Stack
- Next.js 16 App Router, React 19, TypeScript.
- Tailwind CSS v4.
- Supabase (server-side only, no auth layer yet).

## Architecture

### Routes (`app/`)
| Route | Purpose |
|-------|---------|
| `app/page.tsx` | Unified access code gate (celula/setor toggle) → redirects to `/lider/[codigo]` or `/setor/[codigo]` |
| `app/(lider)/lider/[codigo]/layout.tsx` | Shared leader header with back button and cell context card |
| `app/(lider)/lider/[codigo]/page.tsx` | Member list with insights panel |
| `app/(lider)/lider/[codigo]/novo/page.tsx` | Create member |
| `app/(lider)/lider/[codigo]/membro/[id]/page.tsx` | Edit member |
| `app/(setor)/setor/[codigo]/layout.tsx` | Shared sector header with back button and sector context card |
| `app/(setor)/setor/[codigo]/page.tsx` | Cell list with insights panel and per-cell trajectory ranking |
| `app/(setor)/setor/[codigo]/nova-celula/page.tsx` | Create cell for sector |
| `app/membro/[codigo]/page.tsx` | Self-registration (shared via link) |
| `app/actions/membros.ts` | Server actions for members (orchestration only) |
| `app/actions/celulas.ts` | Server actions for cells (orchestration only) |

### Domain layer (`lib/mapeamento/`)
| File | Role |
|------|------|
| `trajetoria.ts` | Single source of truth for trajectory steps, categories, totals, and `computeTrajectoryInsights` |
| `constants.ts` | Schema name, table names, `MEMBER_FORM_FIELDS`, `CELULA_FORM_FIELDS`, access type constants |
| `types.ts` | Domain types, form state contracts (`CelulaOption`, `SetorOption`, `MemberListItem`, `TrajectoryInsights`, etc.) |
| `routes.ts` | URL builder helpers (no hardcoded paths elsewhere) |
| `formatting.ts` | Shared phone/date formatters |
| `celulas.ts` | Cell loading, access code resolution, validation, persistence, setor-filtered queries |
| `membros.ts` | Member validation, persistence, queries (by cell and by sector) |
| `setores.ts` | Sector loading, access code resolution via DB |
| `rotas.ts` | Route-level access resolution with `React.cache` (leader and sector) |

### UI (`components/membros/`)
Form, list, selectors, trajectory sections, insights panel, back button, context cards. Client Components only import from client-safe modules (`trajetoria`, `constants`, `types`, `routes`, `formatting`).

### Supabase (`lib/supabase/server.ts`)
Server-only client. All DB access flows through `lib/mapeamento/*`.

## Data Model
- Schema: `mapeamento`
- `setores`: `id`, `nome`, `descricao`, `lideres`, `codigo_acesso`, `created_at`
- `celulas`: `id`, `nome`, `setor_id` (FK → `setores`), `lideres`, `dia_semana`, `horario`, `foto_url`, `codigo_acesso`, `setor` (deprecated — use `setores.nome` via join)
- `membros`: `id`, `celula_id`, `nome`, `estado_civil`, `telefone`, `data_nascimento`, `discipulador_nome`, `ministerios`, `passos_concluidos`, `created_at`
- `passos_concluidos` is `TEXT[]` aligned with `PassoTrajetoria` enum values in `lib/mapeamento/trajetoria.ts`.
- `codigo_acesso` on `celulas` holds the normalized cell access code (e.g., `CEL1001`).
- `codigo_acesso` on `setores` holds the normalized sector access code (e.g., `SET1001`).
- `celulas.setor_id` links cells to sectors. The old `celulas.setor` text column is deprecated; sector name comes from `setores(nome)` join.

## Key Invariants
- `app/` stays thin: data access and validation live in `lib/mapeamento/*`.
- Domain types live in `lib/mapeamento/`, never in `app/` or `components/`.
- Use `MEMBER_FORM_FIELDS` for member form `name` attributes and `CELULA_FORM_FIELDS` for cell form `name` attributes — never hardcode field names.
- Derive trajectory counts and labels from `lib/mapeamento/trajetoria.ts` — never hardcode `19`, `4`, or step strings.
- Use `computeTrajectoryInsights` from `trajetoria.ts` for all trajectory analytics — never compute percentages ad-hoc.
- Use `lib/mapeamento/formatting.ts` — never define local formatters.
- Use `lib/mapeamento/routes.ts` for URL building — never assemble paths manually.
- Supabase queries use `MAPEAMENTO_SCHEMA` and `MAPEAMENTO_TABLES` from `constants.ts`.
- Files marked `import "server-only"` (`celulas.ts`, `membros.ts`, `setores.ts`, `rotas.ts`, `lib/supabase/server.ts`) must never be imported from `"use client"` components.

## When Updating This App
- **Trajectory changes** → update `lib/mapeamento/trajetoria.ts` first; UI, validation, and insights derive from it.
- **Member form field changes** → update `MEMBER_FORM_FIELDS` in `constants.ts`, `types.ts`, and validation in `membros.ts` together.
- **Cell form field changes** → update `CELULA_FORM_FIELDS` in `constants.ts`, `types.ts`, and validation in `celulas.ts` together.
- **Schema changes** → add a migration in `migrations/`, then update types, column selects, validation, and mappers in `lib/mapeamento/*`.
- **Access code changes** → update `celulas.codigo_acesso` or `setores.codigo_acesso` via migration or admin tool.
- **New setor route** → use `routes.ts` builder; resolve access with `resolveSetorRouteAccess` from `rotas.ts`.
- **New lider route** → use `routes.ts` builder; resolve access with `resolveLeaderRouteAccess` from `rotas.ts`.
- **Insights changes** → update `computeTrajectoryInsights` in `trajetoria.ts`; `InsightsPanel` derives from its output.

## Dev & CI
- **Package manager:** npm (`package-lock.json`).
- **Dev server:** `npm run dev` (port 3000).
- **Lint:** `npm run lint` (ESLint, currently clean).
- **Build:** `npm run build`.
- **Tests:** none configured.
- **Env vars:** `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (set as Cursor secrets).
- **Migrations required:** Run `migrations/` files sequentially in Supabase. Latest: `fifth_setores.sql`.

## Contextual Rules
File-specific rules for the Cursor editor live in `.cursor/rules/*.mdc`. They are auto-injected when matching files are open.
