# Performance and timing upgrade — v0.8.0

Release date: 15 November 2026. Browser/HTML implementation; native Unity unchanged.

## Timing architecture

`requestAnimationFrame` schedules presentation and supplies its actual timestamp. A bounded accumulator advances solo gameplay in 1/60-second steps, independently of the render limiter. It retains two read-only position snapshots and interpolates their positions/facing at the render phase. This adds up to one simulation tick of presentation delay. It does not alter player speed, collision, damage, equipment or skill restrictions.

The server separately accumulates fixed 1/20-second authoritative steps. Network state is broadcast about ten times per second with world time and a simulation step counter. The browser buffers position snapshots by arrival timestamp for 120 ms and interpolates actors between them. No unlimited extrapolation, client-side movement prediction, damage validation or movement authority was introduced. The buffer includes the local LAN fighter: it improves continuity but adds visual latency; it does not remove real network latency. Large corrections, death-state changes and map changes snap safely instead of blending across unrelated positions. Disconnect behavior remains explicit reload-to-rejoin with session-only characters.

Frame gaps are limited to 100 ms of simulation work and at most six solo updates per callback. Long suspension time is discarded, not replayed as a teleport or catch-up storm. Focus/visibility events clear held movement and reset presentation timing. Ordinary frame-rate choices never change the movement multiplier. Existing immediate gameplay starts/stops remain; visual interpolation, heading damping and 45 ms pose blends soften animation transitions. No new inertia or sprint multiplier changes combat balance.

Camera follow uses exponential damping based on elapsed render time, follows interpolated positions, stays within map-coordinate bounds, and resets at valid map transitions/large corrections. Lock, zoom and rotation remain unchanged. World-to-screen projection and inverse input coordinates share the same current camera.

## Rendering and settings

One terrain bitmap is reused until its map, scale or reduced-detail mode changes. Water ripples remain a separate animated pass. Visible-object checks skip distant scenery and actors; important exits and gameplay markers remain. A bounded image-crop cache avoids repeated expensive source resampling, uses small image identities rather than copying embedded data URLs, and releases old entries under its 8-megapixel/48-entry budget. Resizing clears it. Browsers without OffscreenCanvas retain the original drawing path.

Graphics exposes 30/60/120 FPS limits and Auto/display synchronisation. JavaScript does not force a display to 120 Hz. On refresh rates that are not exact multiples of the selected cap, callback scheduling can yield uneven intervals. All modes retain the fixed simulation rate. Reduced effects removes decorative vignette/particle rings and minor ground decoration; damage text, targets and exits stay visible. Smooth follow can be disabled.

The optional overlay measures rendered FPS, mean rendered-frame interval, interval standard deviation, callback rate, executed solo updates/second, received snapshots/second, observed LAN round-trip latency and server updates/second from received tick counters. Configured targets are labelled separately. The rolling window is about two seconds; short windows and timer jitter affect the values. Browser scheduling can contribute to observed RTT. Preferences use `youth-fighter-graphics-v1`; character saves retain their separate v4 serialization.

## Actual measurements

These are **native CPU Canvas callback timings**, not achieved display FPS or a browser benchmark. The test loads the real game scripts and real image assets in a DOM shell, supplies synthetic 30/60/120 callbacks, and measures callback wall time using the host performance clock. Each case has one second of warm-up and two synthetic seconds sampled. Both versions use the same tool and scripted walking path. Rendering is 1440×900 at DPR 1. Results are workload-dependent microbenchmarks, not a general speedup guarantee.

Hardware: **Intel(R) Core(TM) i5-14400F**, 16 logical processors; Windows 10.0.26300, x64; Node v24.22.1; @napi-rs/canvas CPU raster. No browser, GPU presentation or physical monitor timing was captured.

| Ward | Synthetic callbacks/s | v0.7 mean ms | v0.8 mean ms | v0.8 p95 ms |
| --- | ---: | ---: | ---: | ---: |
| Market Ward | 30 | 8.38 | 3.66 | 4.22 |
| Market Ward | 60 | 8.48 | 3.94 | 4.96 |
| Market Ward | 120 | 20.76 | 3.69 | 4.31 |
| Residential Ward | 30 | 27.57 | 5.15 | 5.69 |
| Residential Ward | 60 | 26.54 | 5.41 | 7.53 |
| Residential Ward | 120 | 25.80 | 5.12 | 6.59 |

Raw results are in `art/performance/native-canvas-release.json` and `native-canvas-baseline.json`. Cached terrain rebuilt once per benchmark case. The measured callback cost can exceed the 8.33 ms budget for 120 FPS in some cases. Therefore this release does **not** claim that 120 FPS was achieved. Real browser/display measurement on the target computer remains necessary.

## Check on your computer

Run the game, select 60 and enable the monitor. Walk around buildings and NPCs in Market Ward and Residential Ward, use E, then visit Bamboo Grove for combat. Repeat at 120 on a display that supports it, and at Auto/30. Watch rendered FPS and interval variation during sustained movement. Rendering at 120 ideally yields about 8.33 ms intervals; 60 about 16.67 ms. A selected 120 target with a measured 60 FPS value is still only 60 FPS. Browser/GPU overload, power management, extensions, background activity and high pixel density can affect results.

## Remaining limitations

- No connected browser session was available for automated live UI, GPU or physical 60/120 Hz checks. No blanket stutter-free claim is made.
- The 30-pose sprite atlas has two authored stride poses and eight mapped headings; short crossfades cannot supply a full skeletal animation cycle or true 3D rotation. No new run animation or sprint mode was authored.
- The LAN interpolation buffer deliberately trades visual latency for continuity; no client prediction was added.
- Unity performance settings, native animation blending and native platform profiling were not changed or tested.
- Existing gameplay rules and saves are preserved, but this is still a LAN/offline prototype, not a production MMO backend.
