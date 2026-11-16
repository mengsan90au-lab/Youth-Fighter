# Three movement styles — Youth Fighter v0.10.0

The playable HTML/JavaScript game has separate slow-walk, normal-walk and running sprite sets, each with twelve poses in eight directions. Movement is simulated by shared authoritative rules; rendering does not move the character. Native Unity is unchanged by this release.

## Play and inspect

Extract the complete ZIP and double-click `PLAY-YOUTH-FIGHTER.cmd`. Enter the basin. Normal Walk is the default. Hold **Shift** to run, hold **Alt** to walk slowly, or use the **Move** selector beside the mini-map for a persistent selection that also applies to mouse paths. Alt takes priority over Shift. Releasing a modifier does not cancel a mouse route. Typing and open game dialogs suppress movement shortcuts; losing focus releases held controls.

Press **L** for Motion Studio. Select a style and direction, pause and step through twelve poses. **Three-style comparison** runs each independent cycle at its calibrated cadence. The selected-style views show all eight directions; selected-style journey shows five positions. Residential, Market, Temple and Bamboo clips change with the Style selector. These clips use actual game scripts on native CPU Canvas with scripted inputs, not browser recordings.

Choose **Coordinate movement lab**, select a style, then **Start (0,0) to (9,5) metre test**. The lab uses a separate test actor and the same movement module; it never teleports your real fighter. Pause works in the lab. Restart after changing style to measure that style's complete route. The preview speed slider only affects the animation studio; it cannot change gameplay speed.

Press **G**, choose 30/60/120/Auto and enable **Show measured performance**. The optional monitor includes actual ground speed, distance-derived step cadence, configured stride, gait phase and travelled metres. Live FPS/frame-time readings measure the current session. A selected 120 FPS target cannot force a 120 Hz display.

## Calibration and coordinate units

The existing sprite game has no metric skeleton. This release provisionally defines **2 existing world units = 1 metre**: the old 2.8-unit walking cycle corresponds to the requested 1.4-metre normal stride. This is a documented game-scale convention, not anatomical measurement from a rig. Existing map bounds, saved positions, exits and collision coordinates retain their original units.

| Style | Step (m) | Stride (m) | Cadence (steps/s) | Speed (m/s) | Speed (world units/s) | Cycle (s) |
|---|---:|---:|---:|---:|---:|---:|
| Slow Model Walk | 0.55 | 1.10 | 1.0 | 0.55 | 1.10 | 2.000 |
| Normal Walk | 0.70 | 1.40 | 1.8 | 1.26 | 2.52 | 1.111 |
| Run | 1.20 | 2.40 | 2.7 | 3.24 | 6.48 | 0.741 |

The metre route (0,0) → (9,5) therefore corresponds to world coordinates (0,0) → (18,10). Distance is 10.295630 metres. With 0.1-second exponential acceleration and arrival rounded to a simulation tick, measured arrival was **18.833333 s slow, 8.283333 s walk, 3.283333 s run**, identical at synthetic rendering schedules of 30, 60 and 120 FPS. The literal original world route (0,0) → (9,5) is 5.147815 metres and is separately tested. Both unit systems must not be confused.

## Simulation and animation

`public/movement-styles.js` owns speeds, calibration, closed-form acceleration, exact waypoint arrival, distance and gait phase. `world.js` resolves collision and physical travel on the authoritative simulation. Axis collision sweeps sample intervals no longer than 0.08 world units, preventing the new running budget from skipping thin obstacles. Diagonal input is normalized. Blocked motion advances neither the odometer nor animation phase. Physical stopping is immediate for responsiveness; the rendered body blends toward idle. This is not a separate rig-authored braking clip.

Unwrapped `gaitCycles` accumulates actual resolved displacement divided by the effective stride. Changing style keeps phase continuous. The tracker blends direction/style changes, consecutive poses and idle transitions. Running uses a common contact ground plane across its frames so airborne boots are not individually pinned to the ground. Generated source poses provide the distinct slow upright posture, natural walk and bent-arm forward-leaning run; the code does not turn one walk cycle into all three modes.

The compact mini-map is drawn on every rendered frame using the **same interpolated world position** as the hero. It does not use footsteps, speed estimates or frame counts. `compactProjection` handles its actual map bounds. Expanded atlas coordinates remain a separate projection. Host snapshots include gait, odometer, speed and effective style alongside position; remote presentation interpolates these fields with position. The existing host remains 20 Hz, solo simulation 60 Hz, snapshots 10 Hz; rendering targets do not change those rates.

## Combat and progress

To avoid introducing sprint advantages or slowing existing combat footwork, combat retains its previous **5 world units/s** regardless of selected exploration style. Styles are temporarily suspended while wanted/in custody, during skill cooldowns, for five seconds after a valid attack, and within the existing seven-unit hostile wolf/bandit aggro range. The HUD displays **Combat footwork**. Combat uses the walking set with displacement-derived cadence; its speed is intentionally different from exploration walking. Existing skill damage, cooldowns, energy, legal penalties, guards, equipment restrictions and server authority remain intact.

Style, velocity and gait fields are transient. Save key/schema and saved world positions are unchanged; inventory, health, quests, level and legal status keep their existing persistence rules. Map changes/respawns reset presentation speed and odometers without discarding progress. LAN characters remain host-session characters; reconnecting creates a new session character, as before. No new cross-session multiplayer persistence is claimed.

## Assets, evidence and remaining limits

Original new sheets are in `art/movement-styles/slow-*.png` and `run-*.png`; normal sheets remain in `art/hero-motion/walk-*.png`. Original hashes and provenance are retained. Runtime lossless WebP files are separate. There are **288 locomotion poses** total plus the existing idle/combat assets. `hero-motion-data.js/json` contains per-cell bounds, pelvis registration, ground pivots and per-style texture records. New game data, UI and art remain separate modules.

`art/movement-styles/review` contains a three-style GIF, eight-direction views, three five-position journeys, route/mini-map/phase samples for twelve environment/style combinations, and measured native Canvas callback costs with hardware details. Runtime clips are in `public/assets/style-review`. Capture tools use actual game rules and renderer with a small DOM shell. They do not validate real browser layout, input dispatch, display refresh, GPU performance or human-perceived smoothness on your computer.

The visible poses are generated sprites, not exports from one authored skeleton. Face/garment details vary slightly; some extended running limbs approach cell edges. Crossfades can ghost limbs. Precise planted-foot stationarity, knee mechanics, same-rig identity, turn-in-place/stopping clips, IK, cloth simulation and universally natural foot contact are **not finished or proven**. A single authored humanoid rig and matched directional exports remain the next quality step; see `3D-HERO-MIGRATION.md`. This release does not claim perfect biomechanics or measured real-browser 120 FPS.

## Reproduce checks

Run `npm test`, `npm run check`, `npm run build`. Optional asset checks require Python with Pillow: `python tools/verify-movement-styles.py` and `python tools/verify-hero-motion.py`. Optional captures/benchmarks require `@napi-rs/canvas` (or `YF_RUNTIME_MODULES` pointing to its parent node_modules): `node tools/capture-styles.cjs . captures` and `node tools/benchmark-canvas.cjs . benchmark.json`. Generated capture folders should stay outside release source. Tests distinguish simulated timing, DOM doubles, real loopback sockets and native Canvas rendering.
