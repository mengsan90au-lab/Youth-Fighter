# v0.10.0 — Three exploration movement styles

- Added separate slow-walk and athletic-running twelve-pose sets in eight directions; retained the separate normal walk. Preserved originals and lossless runtime assets.
- Added shared metre/world calibration, exact path arrival, exponential acceleration, normalized diagonals, swept collision and displacement-driven authoritative gait phase.
- Added Shift/Alt modifiers and a mouse-friendly Move selector. Mode changes preserve mouse routes; input is suppressed while typing or browsing dialogs.
- Added style/idle/direction blending and common running ground pivots. Updated compact mini-map each rendered frame using the hero's interpolated position.
- Interpolated gait with LAN position snapshots. Retained the 20 Hz host and existing combat speed, validation, damage and legal rules; the HUD explains temporary Combat footwork.
- Added an isolated coordinate lab, three-style comparison, eight-direction references, five-position journeys, twelve environment clips and movement data in the optional performance monitor.
- Added movement, UI, asset and real multiplayer regressions; kept character save format and the original v0.9.0 project/ZIP unchanged.
- Updated standalone embedding, host asset routes, Windows instructions and reproducible capture/verification tools.

Limits: sprites are generated rather than rig-authored; precise foot locking, consistent fine details and dedicated braking clips still need refinement. Native Unity is unchanged. Native Canvas evidence is not browser FPS certification. See MOVEMENT-STYLES.md and TEST-RESULTS.md.
