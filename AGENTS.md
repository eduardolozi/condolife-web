# AGENTS.md

## Purpose
This file defines the default agent rules for the entire frontend repository.
Use it as the baseline policy unless a closer `AGENTS.md` exists in a subdirectory.

## Scope & Precedence
- This file applies repo-wide by default.
- If a subdirectory contains another `AGENTS.md`, that file overrides or extends this one for its subtree.
- The closest `AGENTS.md` to the changed files takes precedence.
- Module-level `AGENTS.md` files should include only local rules/exceptions.

## Frontend Stack
- React + Vite
- TanStack Router (file-based routes)
- Feature-first organization (`src/features/*`)
- Validation and request inference: Zod + React Hook Form
- UI components: PrimeReact
- API client: Axios
- Auth provider: Keycloak via `oidc-client-ts`

## Repository Structure
- `src/routes/`: route entrypoints and page orchestration (file-based routing)
- `src/features/`: business-oriented frontend modules
  - `components/`: feature UI components
  - `types/`: DTOs, schemas, and UI/domain typing
  - `services/`: API integration and side-effect calls
- `src/shared/`: reusable UI, hooks, and common utilities
- `src/lib/`: shared low-level setup (for example Axios instance)
- `src/config/`: runtime/integration configuration (auth/API endpoints)

## Architecture & Ownership Rules
- Keep page orchestration in `routes/`; keep reusable business UI in `features/*/components`.
- Keep HTTP calls inside `features/*/services` or shared API abstractions.
- Keep schemas and request/response typing in `features/*/types`.
- Prefer extending existing feature modules over creating new cross-feature abstractions.
- Do not move business logic into route files when it belongs to a feature module.

## Routing Rules (TanStack Router)
- Follow file-based routing conventions already used in `src/routes`.
- Prefer route `loader` for route-critical data needed at render time.
- Use `Link` for declarative navigation; keep `navigate` for imperative flows (submit/callback/conditional navigation).
- Preserve route path consistency with generated router types.

## Forms, Validation & Typing
- Use Zod schemas as source of truth for form validation and request typing.
- Integrate forms using `react-hook-form` + `zodResolver`.
- Avoid duplicating validation logic in components when schema already exists.
- Keep field error handling and API error handling explicit and user-friendly.

## API & Auth Integration
- Use the configured Axios client from shared/lib code.
- Keep auth/session logic centralized in auth services and route guards.
- Do not scatter Keycloak/OIDC state handling across unrelated components.
- Never hardcode secrets, tokens, or realm credentials in tracked files.

## PrimeReact & UI Guidelines
- Reuse existing PrimeReact patterns/components before introducing custom alternatives.
- Keep visual consistency with current spacing, typography, and interaction patterns.
- Prefer minimal UI changes scoped to the requested area.
- Preserve accessibility basics (labels, focus behavior, button semantics, keyboard flow).

## Agent Working Rules
- Prefer minimal, focused changes.
- Do not modify unrelated files.
- Keep behavior changes scoped to the owning feature/route.
- Do not introduce broad refactors unless explicitly requested.
- Do not alter generated files unless the workflow requires regeneration.

## Validation Expectations
- Run `npm run build` before finishing code changes.
- If relevant, run `npm run lint`.
- Validate affected flows manually in local app (`npm run dev`) when UI/navigation behavior changes.

## Development Commands
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`

## Git & Configuration Rules
- Do not perform git workflow actions (commit/rebase/branch/PR) unless explicitly requested.
- Keep environment-specific values outside tracked code when possible.
- Prefer local env configuration for API/auth endpoints across environments.

## When in Doubt
- Choose the smallest change that solves the issue.
- Follow existing patterns first.
- Keep data loading, form handling, and service calls where this architecture expects them.
- Ask: "Is this concern route-level, feature-level, or shared-level?" before changing structure.
