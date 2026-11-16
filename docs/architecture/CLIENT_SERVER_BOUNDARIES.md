# Client / Server Boundaries

Status: Proposed boundary model for deterministic gameplay.

## Current reality
The project currently has a browser prototype and a Node host. The browser can run in solo mode, while the server also runs the same authoritative world model.

## Rule set
- Server-owned state is authoritative for world simulation.
- Client input is only advisory until validated by server rules.
- Presentation must not mutate authoritative state.
- Client-side save is allowed only for local offline progress and must be treated as versioned state.

## Boundaries

### Client responsibilities
- input capture
- UI rendering
- local prediction and smoothing
- camera and animation
- local-only persistence

### Server responsibilities
- receiving commands
- validating commands
- mutating world state
- resolving combat and movement rules
- broadcasting authoritative state

### Shared responsibilities
- map IDs
- coordinate conventions
- movement style schema
- world data definitions
- save schema versions

## Safety requirements
- no client-side reward grants
- no client-side direct edits to server-owned stats
- no implicit trust of raw browser coordinates
- no bypass of world boundaries or collision validation

## Migration objective
The long-term architecture should keep this boundary explicit even as the project expands into Unity and multiplayer services.
