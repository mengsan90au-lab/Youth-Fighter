# Definition of Done

Status: Team standard.

A task is complete only when all of the following are true:

1. The work is linked to a tracked issue or approved plan.
2. The implementation matches the intended system contract.
3. Required tests pass or are explicitly marked blocked.
4. Regresions are checked where relevant.
5. Documentation is updated if the change affects gameplay, architecture, save behavior, or release process.
6. The change does not silently break previous save compatibility without an approved migration plan.
7. The reviewer can trace the work from issue to implementation to validation evidence.

## Quality bar
- no speculative or duplicate code paths
- no hidden global state mutations
- no bypass of the client/server boundary
- no unsupported Unity assumptions
- no unverified performance claims
