# GitHub Copilot Instructions for School Management System

Whenever generating or refactoring code for this repository, strictly adhere to the project standards outlined in `AGENTS.md`.

## Golden Rules:
1. **Multi-Tenancy Enforcement**: Every query for school-level data must filter by `where: { schoolId }`.
2. **Design Tokens**: In React components, use semantic theme tokens (`bg-surface`, `bg-canvas`, `text-primary`, `accent-blue`, `border-border`, `shadow-card`).
3. **Validation**: All backend endpoints must validate incoming payload using Zod.
4. **Testing**: Add co-located `.spec.ts` or `.spec.tsx` tests using Vitest and ensure `npm test` and `npm run build` pass without errors.
