# Golden Naga body movement — v0.9.0

Date: 15 November 2026.

## What is implemented

The active Canvas 2D game now draws eight independent generated walking views, twelve poses each, plus eight idle views. This is not a rig-derived 3D animation asset. Every original generated PNG is preserved with provenance. The unusable opaque 24-pose draft is excluded. Runtime files are lossless WebP with alpha-zero backgrounds, measured source bounds, pelvis centring and the lowest visible boot as a floor anchor. The original attack adapter remains in use during combat; actual skill rules are unchanged.

Gait phase advances from observed world displacement, not held input or a wall-clock treadmill. At the current tuning, one loop corresponds to 2.8 world units; twelve source poses are sampled and blended continuously. A stopped/blocked actor's gait distance stops, and its appearance blends toward idle. Heading damping, short directional blends and a bounded scratch bitmap keep transitions smooth and normalize overlapping pose opacity. Sprite/terrain caches and fixed simulation/interpolation from v0.8 remain. No new sprint multiplier or physical movement inertia was introduced.

Map changes, death-state changes, time resets and corrections larger than two world units reset the visual tracker instead of inventing a long walk. Tracks and review actors are separate from character progression. The original authoritative world, city rules, collision/navigation, data, save serializer and every Unity file are byte-identical to v0.8.0; `art/hero-motion/protected-gameplay.json` records the hashes.

## References and perspective

The approved hero concept informed the turnaround and individual movement sheets. Distinct sheets are supplied for E, SE, S, SW, W, NW, N and NE; the walking renderer does not mirror these views. Clothing/face motifs match the Golden Naga design direction, but fine anatomy, embroidery, sash and belt details can drift between independently generated views and the original attack art. Those inconsistencies are explicitly not accepted as final production identity lock.

The existing world renderer projects `(x-y)*24` horizontally and `(x+y)*12` vertically. This is a 2:1 dimetric presentation, approximately 26.565° down and 45° world azimuth. It is preserved rather than changing the whole environment to the prompt's initial 35° reference. Generated views target this camera, but exact optical alignment cannot be guaranteed without a shared 3D camera/rig.

The coordinate review uses a fixed orthographic diagnostic plane and the actual projection: (0,0), (2.25,1.25), (4.5,2.5), (6.75,3.75), (9,5). Distance is `sqrt(106)`, approximately 10.2956 units. The travel heading projects to SE; start/finish are idle and the intermediate checkpoints use different gait poses. Character scale stays constant. Moving farther across an orthographic map does not itself shrink a character. The diagnostic origin is not registered as a physical travel destination.

## Motion Studio and captures

L opens a read-only full-body viewer using the actual runtime adapter. Direction, preview speed, pause and pose stepping do not move or re-equip the player. The source artwork, PNG journey and clips are included in the project; standalone HTML embeds them. The live viewer follows the selected render target and can show all eight directions at normal speed or slower for inspection.

Environment clips use the actual game scripts, collision/pathfinding, art and camera on native CPU Canvas. Scripted walking pauses at two seconds, then begins another route at 2.5 seconds. Residential, Market, Temple and Bamboo Grove each have four seconds sampled at 12 FPS; the studio GIF averages 24 FPS over two seconds. Encoding may merge identical pause frames while retaining their duration. These are visual review exports, not real browser recordings or performance evidence. Reproduction source: `tools/capture-motion.cjs`; it creates its own isolated worlds, never an existing character save.

## Executed checks

86 automated tests pass, with zero failures/skips. Added coverage verifies 96 registered walking frames and eight non-mirrored view assets, distance-driven phase equivalence at 30/60/120 callbacks, stopped/blocked gait, reset handling, actual projection/direction mapping, different checkpoint poses and stable scale, read-only drawing, original combat/path restrictions, standalone embedding, studio keyboard/control behavior and HTTP asset bytes/MIME. Real loopback LAN tests verify the existing authoritative gameplay, transitions and reconnect behavior. UI smoke tests explicitly use DOM/Canvas doubles at 1280×720, 1440×900 and 1920×1080; they are not browser tests.

`tools/verify-hero-motion.py` checks original hashes, lossless visible pixel equality/alpha, distinct cropped frames, pivots and four-second clip timing. Native output was visually reviewed for body readability, orientation and environment scale. This inspection is not a proof of anatomically correct foot planting or exact model identity.

## Native CPU Canvas measurements

The optional benchmark loads the real scripts and decoded art, warms up for one synthetic second, and samples two synthetic seconds per callback schedule. It measures host callback execution cost, not achieved display FPS. Viewport: 1440×900, DPR 1. Hardware: Intel(R) Core(TM) i5-14400F; Windows 10.0.26300; Node v24.22.1. Renderer: @napi-rs/canvas CPU raster; no browser/GPU/compositor timing.

| Ward | Synthetic callbacks/s | Mean callback ms | p95 callback ms |
| --- | ---: | ---: | ---: |
| Market Ward | 30 | 4.29 | 5.62 |
| Market Ward | 60 | 4.52 | 5.32 |
| Market Ward | 120 | 4.03 | 4.63 |
| Residential Ward | 30 | 5.81 | 6.90 |
| Residential Ward | 60 | 5.68 | 6.50 |
| Residential Ward | 120 | 5.80 | 6.57 |

Raw results are in `art/hero-motion/native-canvas-performance.json`. Actual browser/display 60/120 FPS, perceived stutter and sustained GPU behavior remain unverified. Use G and the measured overlay on the target computer. The selected FPS target does not change authoritative movement or combat timing.

## Remaining production work and acceptance limits

| Requirement | Current status |
| --- | --- |
| Animated playable hero and directional pose changes | Implemented compatible sprite pass |
| Constant orthographic scale and separate real travel | Implemented; automated checks pass |
| Eight genuine directional sheets and twelve pose slots each | Supplied; independently generated rather than one-rig exports |
| Exact same face, topology, clothing detail and material in every pose | Not guaranteed; shared-model production pass remains |
| Natural arm/leg alternation, weight shift and loop quality | Generated candidates and previews supplied; animator cleanup remains |
| Precise heel/toe planting, zero visible sliding and terrain foot IK | Not implemented; floor pivots/distance timing do not provide skeletal foot locking |
| Physical cloth, hair simulation and continuous skeletal turns | Not implemented; pre-rendered pose changes and blends only |
| True 3D source mesh, UV/PBR materials, rig and native Animator | Not supplied; native Unity remains unchanged |
| Real 60/120 Hz browser capture and hardware acceptance | Not available in this environment |

The next production step is one authored humanoid with locked character identity, a cleaned walk cycle and foot contacts, then exporting all directions from the same camera/rig. Replace the sprite sheets through the existing metadata interface; retain the read-only adapter and unchanged authoritative rules. See 3D-HERO-MIGRATION.md for the earlier 3D pipeline contract. This release completes the compatible integration and review tooling, not every final visual acceptance criterion.
