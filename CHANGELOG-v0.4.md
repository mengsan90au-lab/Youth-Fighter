# v0.4.2 — physical map entrances fixed

After entering your character, click **Map entrances [TEST]** beside the compact mini-map. This enables the solo testing maps, opens your current Local Mini-Map and highlights a **Next map** gate. Click **Walk to selected location**, then your character walks into the gold gateway and loads the destination. You can also use WASD to walk onto the gate yourself.

Every map now has **Next map** and **Previous map** entrances linking all 122 locations into a complete test travel circuit. These connections are testing routes, not the final geographic transport network. The two original city/grove gateways remain. Generated maps also retain Return to Sovann City. Arrival points are safe and away from exit triggers. Physical entry initializes test residents/monsters and updates the compact mini-map through the existing current-map system.

This fixes v0.4.1, which provided direct TEST travel and return exits but no complete physical entrance network. The unlock remains browser SOLO only; native Unity and LAN locks are unchanged. Normal save protection and unfinished-content labels remain. Reload to leave the testing session.

Validation: **46 automated tests passed**, including an actual simulation walk through the entire 122-map circuit, safe/valid forward and backward gate coordinates, initialized residents after physical entry, and the real Map entrances button handler under DOM doubles. Offline build, configuration and ZIP/source checks passed. Live browser visuals and Unity Play mode remain unverified.

# v0.4.1 - solo all-map test mode

Added explicit Unlock ALL maps and TEST travel controls, 120 generated testing layouts with local maps and return exits, isolated test saves, original Grove safe-spawn validation, and exhaustive testing. This mode targets the browser solo edition; native Unity and LAN retain production locks. See TEST-MODE-RESULTS.md.

# v0.4.0 — Approved illustrated atlas integration

Based on the supplied Youth Fighter v0.3.0 project. This release integrates the existing approved artwork rather than generating replacements.

- Added the labeled world atlas and all eight final country images, including the corrected **mainland** Golden Naga City Atlas. Kept all nine source PNG files and recorded their hashes. Added same-dimension WebP browser assets and high-quality JPEG Unity resources.
- Added eight world hit areas, 73 painted-settlement registrations and two separate hunting markers. Existing map IDs were retained where a settlement was renamed to match the artwork; prior names remain as aliases. The catalogue now contains 122 location records, with exactly two playable gameplay maps.
- Replaced procedural world/country illustrations with approved backgrounds and separately managed transparent targets, hover/focus outlines and selection highlights. Existing painted labels and markers are not duplicated. No geography or tree scale was changed during this integration.
- Implemented World → Country → Location details → Local Mini-Map. Back/Escape unwind levels, Home returns to World and M toggles the atlas. Compact-map inspection opens the current accurate local view. Search highlights and centers registered locations; unpositioned future areas remain list-only.
- Added shared normalized image transforms for aspect fitting, zoom, pan, wheel anchoring, centering and hit testing. Fixed overlapping click registrations found by tests and adjusted left/right and below-pin label boxes during visual registration review.
- Kept accurate gameplay-based local maps, NPC walking and gateway guidance separate from regional artwork. Browsing never issues teleport commands. The existing Sovann City ↔ Bamboo Grove gateways, saves, combat, crime, missions, gear and multiplayer rules are retained.
- Added matching native artwork data, textures, transparent IMGUI hit areas, country/details navigation, search, zoom and local-map access. Added **Youth Fighter → Check approved artwork** for use after a successful editor import.
- Embedded all nine runtime images in the standalone HTML. Added strict server routes for the new scripts, stylesheet and image files. Offline play does not need a network connection or image server.
- Added artwork and transform regression checks, every-country/every-settlement client-handler navigation tests, real HTTP checks for all nine images, and native source-compilation checks.

## Verification boundaries

All 44 Node tests passed. Runtime C# and the new artwork-check editor script compiled against the installed Unity 6000.6 reference assemblies. This is not a full Unity editor import or Play-mode test. The attempted batch import did not produce the artwork validation report. Controlled live-browser testing was unavailable in this session. See TEST-RESULTS.md and GEOGRAPHIC-CONSISTENCY.md.
