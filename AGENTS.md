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

### Domain layer (`lib/`)
| File | Role |
|------|------|
| `trajetoria.ts` | Single source of truth for trajectory steps, categories, totals, and `computeTrajectoryInsights` |
| `constants.ts` | Schema name, table names, `MEMBER_FORM_FIELDS`, `CELULA_FORM_FIELDS`, access type constants |
| `types.ts` | Domain types, form state contracts (`CelulaOption`, `UnidadeOption`, `MemberListItem`, `TrajectoryInsights`, etc.) |
| `routes.ts` | URL builder helpers (no hardcoded paths elsewhere) |
| `formatting.ts` | Shared phone/date formatters |
| `form-helpers.ts` | Shared form data helpers (`readTrimmedString`, `normalizeAccessCode`) |
| `celulas/` | Cell queries, validation, and persistence (split by concern: `queries.ts`, `validation.ts`, `mutations.ts`) |
| `membros/` | Member queries, validation, and persistence (split by concern: `queries.ts`, `validation.ts`, `mutations.ts`) |
| `unidades/` | Unit (setor/rede/sede) queries and access code resolution (split: `queries.ts`, `index.ts`) |
| `rotas.ts` | Route-level access resolution with `React.cache` (leader and unidade) |

### UI (`components/`)
Client Components organized by domain. They only import from client-safe `lib/` modules (`trajetoria`, `constants`, `types`, `routes`, `formatting`).

| Folder | Domain | Components |
|--------|--------|------------|
| `components/ui/` | Generic primitives | `back-button`, `submit-button`, `icons` |
| `components/access/` | Access code gate | `access-code-gate` |
| `components/celulas/` | Cell domain | `celula-context`, `celula-selector`, `celula-list`, `celula-form` |
| `components/setores/` | Sector domain | `setor-context` |
| `components/membros/` | Member domain | `member-form`, `member-personal-fields`, `member-trajectory-fields`, `member-trajectory-sheet`, `member-list`, `member-self-register-share` |
| `components/trajetoria/` | Trajectory sections | `trajetoria-section` |
| `components/insights/` | Analytics panel | `insights-panel` |
| `components/behavior/` | Infrastructure / lifecycle | `leader-page-refresh` |

### Supabase (`lib/supabase/server.ts`)
Server-only client. All DB access flows through `lib/*`.

## Data Model
- Schema: `mapeamento`
- `tipos_unidade`: `id`, `nome` (e.g., `SETOR`, `REDE`, `SEDE`)
- `unidades`: `id`, `nome`, `descricao`, `lideres`, `tipo_id` (FK → `tipos_unidade`), `parent_id` (FK → `unidades`, nullable), `codigo_acesso`, `created_at`
- `celulas`: `id`, `nome`, `unidade_id` (FK → `unidades`), `lideres`, `dia_semana`, `horario`, `foto_url`, `codigo_acesso`
- `membros`: `id`, `celula_id`, `nome`, `estado_civil`, `telefone`, `data_nascimento`, `discipulador_nome`, `ministerios`, `passos_concluidos`, `created_at`
- `passos_concluidos` is `TEXT[]` aligned with `PassoTrajetoria` enum values in `lib/trajetoria.ts`.
- `codigo_acesso` on `celulas` holds the normalized cell access code (e.g., `CEL1001`).
- `codigo_acesso` on `unidades` holds the normalized unit access code (e.g., `SET1001`, `REDE001`).
- `celulas.unidade_id` links cells to units. Unit type name comes from `unidades(nome, tipos_unidade(nome))` join.
- Legacy tables `setores` and `celulas.setor_id` are deprecated; all queries use `unidades` and `celulas.unidade_id`.

## Key Invariants
- `app/` stays thin: data access and validation live in `lib/*`.
- Domain types live in `lib/`, never in `app/` or `components/`.
- Use `MEMBER_FORM_FIELDS` for member form `name` attributes and `CELULA_FORM_FIELDS` for cell form `name` attributes — never hardcode field names.
- Derive trajectory counts and labels from `lib/trajetoria.ts` — never hardcode `19`, `4`, or step strings.
- Use `computeTrajectoryInsights` from `trajetoria.ts` for all trajectory analytics — never compute percentages ad-hoc.
- Use `lib/formatting.ts` — never define local formatters.
- Use `lib/routes.ts` for URL building — never assemble paths manually.
- Supabase queries use `MAPEAMENTO_SCHEMA` and `MAPEAMENTO_TABLES` from `constants.ts`.
- Files marked `import "server-only"` (`celulas/`, `membros/`, `unidades/`, `rotas.ts`, `form-helpers.ts`, `lib/supabase/server.ts`) must never be imported from `"use client"` components.

## When Updating This App
- **Trajectory changes** → update `lib/trajetoria.ts` first; UI, validation, and insights derive from it.
- **Member form field changes** → update `MEMBER_FORM_FIELDS` in `constants.ts`, `types.ts`, and validation in `membros/validation.ts` together.
- **Cell form field changes** → update `CELULA_FORM_FIELDS` in `constants.ts`, `types.ts`, and validation in `celulas/validation.ts` together.
- **Schema changes** → add a migration in `migrations/`, then update types, column selects, validation, and mappers in `lib/*`.
- **Access code changes** → update `celulas.codigo_acesso` or `unidades.codigo_acesso` via migration or admin tool.
- **New setor/unidade route** → use `routes.ts` builder; resolve access with `resolveUnidadeRouteAccess` from `rotas.ts`.
- **New lider route** → use `routes.ts` builder; resolve access with `resolveLeaderRouteAccess` from `rotas.ts`.
- **Insights changes** → update `computeTrajectoryInsights` in `trajetoria.ts`; `InsightsPanel` derives from its output.

## Dev & CI
- **Package manager:** npm (`package-lock.json`).
- **Dev server:** `npm run dev` (port 3000).
- **Lint:** `npm run lint` (ESLint, currently clean).
- **Build:** `npm run build`.
- **Tests:** none configured.
- **Env vars:** `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (set as Cursor secrets).
- **Migrations required:** Run `migrations/` files sequentially in Supabase. Latest: `2-unidades.sql`.

## Contextual Rules
File-specific rules for the Cursor editor live in `.cursor/rules/*.mdc`. They are auto-injected when matching files are open.
