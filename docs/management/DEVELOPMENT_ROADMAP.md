# Development Roadmap

Status: Proposed roadmap for the next engineering phases.

## Phase 0 — Audit and baseline
Goal: understand the project and confirm what is actually working.
Deliverables:
- repo audit
- build validation
- dependency review
- risk assessment
- documented blockers

## Phase 1 — Project governance
Goal: formalize engineering process.
Deliverables:
- issue templates
- contribution rules
- architecture docs
- traceability model
- repository structure conventions

## Phase 2 — Architecture stabilization
Goal: define system boundaries and content ownership.
Deliverables:
- system registry
- contracts and schemas
- save versioning rules
- client/server boundaries

## Phase 3 — Safe modularization
Goal: refactor risky modules with test protection.
Deliverables:
- regression harness
- safer world content contracts
- reduced UI/gameplay coupling
- validation of travel and collision rules

## Phase 4 — Vertical slice
Goal: produce one polished, reproducible gameplay loop.
Deliverables:
- walkable area
- NPC interaction
- combat loop
- rewards
- save continuity

## Phase 5 — Native 3D development
Goal: validate a Unity-based slice after the repo contains a real Unity project.
Deliverables:
- real Unity setup
- 3D movement/camera validation
- asset pipeline
- gameplay parity test plan

## Phase 6 — Content expansion
Goal: add more regions, quests, economy, professions, and world content.
Deliverables:
- new districts
- world registry expansion
- content validation
- balancing and pacing testing

## Phase 7 — Multiplayer evolution
Goal: move toward durable production-grade systems.
Deliverables:
- secure networking
- stronger validation
- load testing
- persistence architecture

## Exit criteria for each phase
- systems are documented
- tests cover changed behavior
- no unvalidated migration steps
- gameplay remains functional
- readiness gate is recorded in project evidence
