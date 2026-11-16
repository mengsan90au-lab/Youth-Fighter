# Youth Fighter v0.10.0 — Three movement styles

The playable HTML/JavaScript hero now has separate **Slow Model Walk, Normal Walk and Run** pose sets, calibrated distance-driven gait, smooth presentation transitions and a compact mini-map driven by the same interpolated position. The release includes full source, original sheets, lossless runtime assets, standalone offline play, local multiplayer, a coordinate lab and visual review clips.

**Start:** extract the entire ZIP and double-click **PLAY-YOUTH-FIGHTER.cmd**, then Enter the basin. WASD/arrows or click ground; Shift runs, Alt walks slowly. The Move selector works with mouse paths. Press L for comparison/lab/views/clips, G for performance settings, M for maps. See **START-HERE.md** for beginner Windows instructions.

The current art pipeline remains 2D sprites. It does not provide an authored 3D humanoid, precise foot IK or perfectly identical details. Native Unity is included unchanged. Combat deliberately keeps its prior 5-world-unit movement pace; **Combat footwork** explains temporary style suspension. Existing save format, quests, equipment, legal rules, NPC services, map exits and host authority remain.

**MOVEMENT-STYLES.md** documents mechanics, provisional 2-world-units/metre scale, coordinate lab, module layout, art provenance, reproduction commands and limitations. **TEST-RESULTS.md** distinguishes actual loopback networking, simulated frame schedules, DOM doubles, native Canvas captures and unavailable browser/display checks. **CHANGELOG-v0.10.md** describes this release; earlier changelogs are historical.

Source: public/movement-styles.js for shared rules; public/world.js for authority/collision; public/hero-locomotion.js and hero-motion-render.js for presentation; public/performance.js for timing/interpolation; public/map-renderer.js for local mini-maps; public/motion-studio.js for isolated review/lab; server.js for LAN hosting. Artwork is under art/ and runtime textures under public/assets/.

Developer commands: npm test; npm run check; npm run build. Optional Python/Pillow verification: python tools/verify-movement-styles.py. Optional native Canvas capture/benchmark instructions are in MOVEMENT-STYLES.md. No npm dependencies are needed for ordinary game/server play; optional capture tools require @napi-rs/canvas.

## Engineering documentation
- [docs/architecture/ARCHITECTURE_OVERVIEW.md](./docs/architecture/ARCHITECTURE_OVERVIEW.md)
- [docs/architecture/SYSTEM_DEPENDENCIES.md](./docs/architecture/SYSTEM_DEPENDENCIES.md)
- [docs/architecture/DATA_CONTRACTS.md](./docs/architecture/DATA_CONTRACTS.md)
- [docs/architecture/CLIENT_SERVER_BOUNDARIES.md](./docs/architecture/CLIENT_SERVER_BOUNDARIES.md)
- [docs/world/WORLD_STRUCTURE.md](./docs/world/WORLD_STRUCTURE.md)
- [docs/management/DEVELOPMENT_ROADMAP.md](./docs/management/DEVELOPMENT_ROADMAP.md)
- [docs/management/GITHUB_WORKFLOW.md](./docs/management/GITHUB_WORKFLOW.md)
- [docs/management/DEFINITION_OF_DONE.md](./docs/management/DEFINITION_OF_DONE.md)
- [docs/testing/TEST_STRATEGY.md](./docs/testing/TEST_STRATEGY.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
