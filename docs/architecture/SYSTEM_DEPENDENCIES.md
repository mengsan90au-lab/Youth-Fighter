# System Dependencies

Status: Proposed governance model for the project.

## System registry

| System ID | Name | Purpose | Current status | Main code locations |
|---|---|---|---|---|
| WORLD | World / geography | world state and authoritative simulation | Implemented prototype | `public/world.js` |
| MAP | Maps and collision | map definitions, exits, blocked tiles | Implemented prototype | `public/map-data.js`, `public/map-catalog.js`, `public/map-renderer.js` |
| CHAR | Character state | player stats, identity, progression | Implemented prototype | `public/world.js`, `public/progression.js` |
| MOVE | Movement rules | locomotion, styles, acceleration | Implemented prototype | `public/movement-styles.js`, `public/hero-locomotion.js` |
| ANIM | Animation | visual motion, pose rendering | Implemented prototype | `public/hero-motion-render.js`, `public/hero-render.js` |
| COMBAT | Combat | skills, damage, cooldowns | Implemented prototype | `public/world.js` |
| MARTIAL | Martial paths | disciplines and restrictions | Partial / concept-level | `public/world.js`, `public/city-data.js` |
| NPC | NPC behavior | city services, guards, civilians | Implemented prototype | `public/city-system.js`, `public/city-data.js` |
| QUEST | Quest flow | objectives, progression, completion | Partial | `public/world.js`, `public/city-system.js` |
| ITEM | Inventory and gear | equipment and consumables | Partial | `public/city-system.js` |
| ECON | Economy | money and shops | Partial | `public/city-system.js` |
| PVP | Crime / lawful-zone rules | wanted state, jail, arrest | Implemented prototype | `public/world.js` |
| NET | Networking | server authority and protocol | Implemented LAN prototype | `server.js` |
| SAVE | Persistence | save/load validation and migration | Implemented but informal | browser save logic and world state modules |
| UI | HUD and interactions | map UI, minimap, prompts, menus | Implemented prototype | `public/game.js`, `public/city-ui.js`, `public/atlas-ui.js` |
| PERF | Performance | timing and render budget | Implemented prototype | `public/performance.js` |
| PLATFORM | Runtime adapters | browser, Node, Unity future | Partial / blocked | `server.js`, `Youth-Fighter.html`, `UnityProject` |

## Dependency graph

```text
WORLD
├── MAP
│   ├── NAVIGATION
│   └── COLLISION
├── CHAR
│   ├── MOVE
│   ├── COMBAT
│   ├── ITEM
│   └── MARTIAL
├── NPC
│   ├── QUEST
│   ├── ECON
│   └── PVP
├── SAVE
│   └── WORLD
├── NET
│   └── WORLD
├── UI
│   ├── CHAR
│   ├── MAP
│   └── WORLD
└── PERF
    └── PRESENTATION
```

## Dependency rules
- The authoritative simulation owns state, not the UI.
- Map data owns geometry; gameplay consumes it.
- Character state is the source of combat and progression values.
- Net is a transport and validation layer, not a content source.
- Save must validate versioned state against world and character definitions.

## Risks and unsafe couplings
- UI logic reads and mutates gameplay state in the browser prototype.
- Combat, quest, and city rules are tightly coupled in `public/world.js` and `public/city-system.js`.
- The project has no formal contract for cross-system inputs and outputs.
- The repository currently documents the desired architecture but not the enforced boundary rules.

## Planned improvement
- Formalize a data contract layer and event schema.
- Separate world data from gameplay logic into content modules.
- Limit UI to read-only visualization of authoritative state.
- Validate server and client commands against shared rules before mutating state.
