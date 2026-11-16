# v0.6 update note

Residential Ward now uses the original illustrated sprite kit in residential-data.js / residential-render.js. See RESIDENTIAL-UPGRADE.md and TEST-RESULTS.md for current implementation and evidence; the earlier architecture below remains context. The browser-only native boundary is unchanged. Existing v4 saves and normal/test save slots remain. Other wards retain their previous graphics.

# Map and city architecture — v0.5.0

The approved atlas remains separate from gameplay. `map-data.json` / `.js` hold the baseline eight realms and 122 location records; their native baseline JSON remains identical. `city-data.js` is a browser-only extension containing five real district definitions and reusable NPC/item/shop/quest definitions. `map-catalog.js` clones/registers these wards, exposes `districts(cityId)`, and attaches reciprocal old-square and wilderness connections. The browser therefore has 127 records, seven normally playable; the preserved native runtime has two implemented areas.

`city-system.js` validates NPC interactions against living world actors, current map and distance. Purchases, banking and rewards use owned data, never client-supplied prices or completed-objective flags. `world.js` calls the same city service rules offline and under the Node host. It retains existing combat, guards, crime and travel. `city-render.js` uses original isometric building/prop primitives with the same data footprints as collision. `city-ui.js` supplies conversations, service controls, inventory and journal without awarding itself currency.

Each ward carries bounds, buildings, roads, water rectangles, bridge rectangles, NPC/quest/service POIs and exits. Existing A* and movement validation share `map-catalog.blocked`; water is impassable outside bridge footprints. `progression.js` snapshots sanitized city state in v4 and accepts v2/v3 saves. Normal and optional sandbox saves retain distinct slots. LAN world progress is still session-only and cannot be imported from client saves.

## Hierarchy

World → Golden Naga country → Sovann City details → city-district overview → district details → Local Mini-Map. The overview is a schematic rendered from reusable district IDs. Back/Escape unwind local, district, city overview, city details, country and world. Home returns to world; M closes. Typing and modal guards prevent gameplay shortcuts from firing inside conversations or finder inputs.

Inspecting a map does not travel. Only actual exit triggers change maps in ordinary play. Local NPC walking uses live actor coordinates where available. Distant destinations use breadth-first exit routes; unavailable areas remain locked. Optional solo testing adds explicit TEST travel and a connected test circuit, separate from the ordinary geography.

Artwork coordinates stay normalized 0–1 under `artwork-data.js` and `approved-atlas.js`; local gameplay uses X/Y. Unity uses X/Z. Neither image coordinates nor schematic city positions are movement destinations. Country current-location highlighting treats a ward as its parent Sovann City. Compact maps draw real buildings, canal water/bridges, actors, services, quests, gates and facing; expanded maps use actual ward bounds and show moving residents/guards in the live layer.

## Safe extension

Add district definitions and NPC/service/quest records to city-data.js, with unique IDs and valid nonblocked arrival points away from triggers. Validate reciprocal connections and A* access before enabling play. Keep scene renderer, collision records and local-map data together; do not derive playable collision from a decorative PNG. The original seed atlas generators predate city registration; do not regenerate approved records blindly. Existing asset-generation tools need Python/Pillow only for artwork work, not city runtime or play.

Serve added modules through the server allowlist and include them in the standalone builder. Run the full suite/configuration/build and archive checks after changes. Native support requires actual native implementation; a browser record alone must not silently unlock an empty Unity scene.
