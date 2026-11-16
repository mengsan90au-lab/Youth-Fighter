# Test Strategy

Status: Proposed quality gate.

## Test categories
- unit tests
- integration tests
- regression tests
- map and collision tests
- save/load compatibility tests
- multiplayer protocol tests
- startup smoke tests
- browser interaction tests
- Unity validation when a real Unity project exists

## Baseline commands
The repo already documents:
- `npm test`
- `npm run check`
- `npm run build`

## Required pass/fail semantics
- PASS — behavior verified under the current repo state
- FAIL — actual breakage found during validation
- BLOCKED — required dependency or runtime not available
- SKIPPED — intentionally not run because not applicable

## Priority areas
1. startup/build integrity
2. world traversal and collision
3. movement-style behavior
4. combat/gameplay logic
5. saving and loading
6. server authoritative validation
7. performance sanity checks

## Rules
- Synthetic frame measurements must not replace real display testing.
- Game logic must be tested with stable assertions, not visual assumptions alone.
- Every verified gameplay fix should add or update regression coverage where technically feasible.
