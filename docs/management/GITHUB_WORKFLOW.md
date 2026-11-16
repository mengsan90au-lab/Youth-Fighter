# GitHub Workflow

Status: Recommended workflow for team development.

## Work hierarchy
Vision → Milestone → Epic → Feature/Bug → Pull Request → Test Evidence → Release

## Recommended labels and types
- EPIC
- FEATURE
- BUG
- REFACTOR
- TECH-DEBT
- TEST
- PERFORMANCE
- DOCUMENTATION
- RESEARCH

## GitHub statuses
- Backlog
- Ready
- In Progress
- In Review
- Testing
- Blocked
- Done

## Branching model
- `feature/issue-<id>-short-name`
- `fix/issue-<id>-short-name`
- `refactor/issue-<id>-short-name`
- `docs/issue-<id>-short-name`

## Pull request rules
- keep PRs focused
- link each PR to an issue
- include test evidence
- require review before merge
- do not merge unvalidated major changes

## Definition of ready
An issue is ready when it includes:
- objective
- affected systems
- current behavior
- expected behavior
- acceptance criteria
- test plan
- dependencies

## Definition of done
A task is done only when:
- code is merged with review
- automated checks pass or are explicitly documented as blocked
- manual verification is recorded when necessary
- related docs are updated
- no incompatible migration remains undocumented
