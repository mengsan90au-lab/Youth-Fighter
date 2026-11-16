# v0.8.0 — display-independent browser movement

- Added fixed 60 Hz solo simulation, bounded pause handling and interpolated actor presentation.
- Kept server authority at 20 Hz, with fixed host steps, buffered snapshot presentation, latency echo and measured simulation ticks.
- Added rate-independent camera follow, visual heading damping, nearby NPC-facing during services, 45 ms pose blends and safe transition resets.
- Added Graphics [G]: 30/60/120/Auto, reduced effects, camera smoothing and an optional measured performance overlay. Preferences are separate from character saves.
- Cached terrain and pre-scaled sprites with bounded memory, culled offscreen objects, and avoided redundant opaque-canvas clearing. Original fallback rendering remains.
- Preserved all existing map navigation, optional map testing, physical gateways, quests, inventory, equipment, crime, government and character save rules.
- Added timing-sensitive automated checks, graphics handler integration checks, real server latency/rejoin checks and an optional native Canvas benchmark.
- Updated standalone embedding, server routes, launch instructions, source documentation and release validation. Original v0.7.0 ZIP is preserved.

80 automated tests passed. Native Canvas checks are separate from live browser FPS; sustained 60/120 FPS was not measured on a physical display. Hero remains a directional sprite implementation; no new run-cycle art, true 3D rig or native Unity performance implementation is included.
