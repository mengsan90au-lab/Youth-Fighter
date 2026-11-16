# Architecture Overview

Status: AS-IS verified, TO-BE proposed, MIGRATION in progress.

## Purpose
This document defines the working architecture of the current Youth Fighter prototype and the intended future architecture for a maintainable martial arts MMORPG.

## Current verified architecture (AS-IS)

The repository currently contains a browser game prototype with a Node.js LAN host. The project is functional, but architectural boundaries are intentionally loose.

### Verified runtime composition
- Browser runtime: `Youth-Fighter.html` + `public/game.js`
- Authoritative simulation: `public/world.js`
- World data: `public/map-data.js`, `public/map-catalog.js`, `public/city-data.js`
- Movement rules: `public/movement-styles.js`, `public/hero-locomotion.js`
- Rendering: `public/hero-render.js`, `public/hero-motion-render.js`, `public/map-renderer.js`
- Server authority: `server.js`
- Persistence: save logic embedded in browser state and runtime modules

### Architectural reality
The current codebase behaves like a playable prototype rather than a fully layered engine. Core responsibilities are still mixed together:
- UI + input + rendering live in the browser runtime.
- Game simulation and combat rules coexist in the same authoritative layer.
- World content data is not fully separated from gameplay logic.
- Save compatibility is not yet managed as a formal migration framework.
- Unity is not a real, validated native project in this repository.

## Target architecture (TO-BE)

The long-term target architecture should follow these layers:

### Layer A — Game design and domain rules
Ownership: gameplay/design team
Contents:
- progression
- stats
- martial paths
- skills
- PvP/legal rules
- economy and trade
- quests

### Layer B — World and content data
Ownership: world/content team
Contents:
- world hierarchy
- map registry
- area definitions
- boundaries
- collision
- exits and travel links
- NPC placement
- environment authoring

### Layer C — Gameplay services
Ownership: gameplay engineering
Contents:
- movement and navigation
- combat resolution
- trading and crafting
- quests and NPC interaction
- map services
- save validation

### Layer D — Presentation
Ownership: frontend/rendering team
Contents:
- camera
- animation
- UI/HUD
- minimap
- effects
- platform adapters

### Layer E — Platform and infrastructure
Ownership: platform engineering
Contents:
- browser runtime
- Node host
- Unity runtime (future)
- networking
- persistence
- build and packaging

### Layer F — Engineering infrastructure
Ownership: engineering leadership
Contents:
- testing
- CI
- profiling
- docs
- release management

## Dependency contract
The architecture must enforce one-way ownership:

- Content data informs gameplay; gameplay does not rewrite content schemas directly.
- Presentation consumes gameplay state; it must never mutate authoritative state.
- Network and simulation logic own combat and movement validation.
- Save logic must validate against versioned schemas rather than trust raw browser data.

## Primary risks in the current codebase
1. Mixed gameplay and rendering responsibilities
2. Weak separation of world content from logic
3. Save/versioning not yet formalized
4. Lack of a real Unity project and migration baseline
5. Poorly defined issue-to-implementation traceability

## Migration strategy
The repo should evolve incrementally:
- keep the playable browser prototype working
- establish system registry and documented contracts
- separate world content from logic where feasible
- formalize save schema versioning
- prepare a Unity migration only after a real Unity project and validation flow exist

## Related documents
- [SYSTEM_DEPENDENCIES.md](./SYSTEM_DEPENDENCIES.md)
- [DATA_CONTRACTS.md](./DATA_CONTRACTS.md)
- [CLIENT_SERVER_BOUNDARIES.md](./CLIENT_SERVER_BOUNDARIES.md)
- [../world/WORLD_STRUCTURE.md](../world/WORLD_STRUCTURE.md)
- [../management/DEVELOPMENT_ROADMAP.md](../management/DEVELOPMENT_ROADMAP.md)
