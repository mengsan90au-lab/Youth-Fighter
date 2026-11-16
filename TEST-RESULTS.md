# v0.10.0 verification — 15 November 2026

The release checks distinguish game simulation from rendering and real networking. A 120 FPS selector is not proof of achieved 120 FPS.

## Automated checks

- Full Node regression suite: **97 tests passed, zero failures/skips**. Includes old mechanics plus all three styles, exact destinations, diagonal normalization, swept collision, blocked gait, phase continuity, combat/wanted speed protection, progress retention, map travel and interpolation.
- UI handler tests at 1280×720, 1440×900 and 1920×1080 use explicit DOM/Canvas doubles. They exercise Shift/Alt priority and release, typing suppression, preserved mouse paths, selector controls, real isolated lab arrival, per-render mini-map refresh and existing nested maps/services. They are not real browser/layout tests.
- Real loopback WebSocket tests cover host authority, three-style command validation, rejection of client speed/phase fields, state broadcasts, combat, ten-client cap, disconnect/rejoin, cross-map membership, district NPC quests, purchases and inventory. Character reconnection remains a new host-session character, matching existing behavior.
- Standalone embedding and HTTP loading include all 25 motion textures, new review assets and existing game/maps. Asset checks verify original hashes, lossless runtime pixels/alpha, twelve different cropped poses per sheet and twelve three-second environment timelines.
- Native Unity configuration consistency passed. Unity compilation/Play Mode and native movement functionality were not tested or changed.

## Distance measurements

The game convention is 2 world units/metre. The requested metre route (0,0)→(9,5) is world (0,0)→(18,10), distance 10.295630140987 metres. All modes arrived exactly at the same destination.

| Style | Arrival (s), including acceleration | Synthetic rendering schedules |
|---|---:|---|
| Slow Model Walk | 18.833333 | Identical at 30/60/120 FPS |
| Normal Walk | 8.283333 | Identical at 30/60/120 FPS |
| Run | 3.283333 | Identical at 30/60/120 FPS |

Literal world (0,0)→(9,5) is separately tested at half that metric distance. Actual collision-resolved distance determines gait phase. Mini-map transforms round-trip correctly and share the rendered hero position. Physical exits reset presentation histories while retaining ordinary progression.

## Native Canvas evidence and measured cost

Twelve clips cover three styles in Residential Ward, Market Ward, Temple Ward and Bamboo Grove. The real game command/update/render path and actual compact mini-map are captured with scripted input. Bamboo tests use an existing open area outside monster aggro, with normal entities retained. These are native CPU Canvas captures, not actual browser recordings.

Eight-direction views, 12-frame source sheets, five-position journeys and a three-style GIF were visually inspected for facing, posture, foot/arm pose changes and airborne running. Fine detail drift, occasional edge crowding, limb crossfade ghosting and imperfect ground contact remain visible. This is not proof of stationary planted feet or biomechanically accurate knees.

Hardware: Intel(R) Core(TM) i5-14400F; 16 logical processors; Windows 10.0.26300; x64; Node v24.22.1. @napi-rs/canvas CPU raster at 1440×900, DPR1. Eighteen combinations: two city wards × three styles × synthetic 30/60/120 callbacks, one warm-up second plus two sampled seconds each. Mean callback cost ranged **3.89–6.70 ms**; per-run p95 **4.37–8.88 ms**. Full results and samples are in art/movement-styles/review/native-canvas-benchmark.json and capture-report.json. These costs do not measure GPU/browser FPS or display refresh.

## Delivery checks and limits

Standalone build, configuration check, byte-for-byte ZIP/source verification and Windows launcher dispatch are checked separately during packaging. Launcher exit success only confirms dispatch, not visual browser correctness. The previous v0.9.0 source/ZIP is preserved.

No real browser control was available in this environment, so manual Windows browser input/layout, smoothness on the user's hardware and achieved 60/120 display FPS remain unverified. No authored 3D rig, exact same-model identity, IK foot locking, physical cloth or dedicated braking animation is delivered. Current sprite integration works in the shared simulation/renderer tests; these production-art and device-validation limits remain for further refinement.
