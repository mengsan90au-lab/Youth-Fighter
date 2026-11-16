# Contributing to Youth Fighter

Status: Working engineering contract.

## Goals
- maintain a playable project while improving architecture
- keep the prototype safe during growth and refactor work
- document system ownership and dependency boundaries
- avoid duplicating rules across browser, server, and future Unity code

## Core working rules
1. Keep the playable game functional.
2. Do not rewrite the game without a justified migration plan.
3. Preserve compatibility when changing save or map content.
4. Keep authority boundaries explicit.
5. Add or update regression tests for gameplay changes where feasible.
6. Record assumptions and blockers when validation is unavailable.

## Architecture rules
- UI must not mutate authoritative game state.
- World data must remain cleanly structured and version-aware.
- Combat and progression rules must be validated centrally.
- Presentation should consume state, not create it.

## Documentation rules
- major features require documentation updates
- architectural decisions must be recorded in the docs set
- release and migration changes need explicit notes

## Local validation
Run the project checks before merging work:
- `npm test`
- `npm run check`
- `npm run build`

If a step is blocked by missing runtime or project dependencies, label it as BLOCKED and record the reason.
