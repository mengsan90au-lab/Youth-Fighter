# v0.3.0 — Hierarchical map system

Based on Youth-Fighter-v0.2.1.zip. No production MMORPG services or finished native build are claimed.

- Replaced the old single regional map dialog with World → Regional → Area / Local Mini-Map navigation. M opens World and toggles the atlas closed; Escape and Back unwind views. World/Home and Close are available at every level.
- Added original vector fantasy geography for eight realms, eight different regional atlases and 68 unique named locations. City/monster/dungeon/sect icons, routes, roads, rivers, forests, mountains, boundaries and locked future locations are data-driven.
- Added searchable local NPC/service panels, highlighted destinations, zoom/pan, same-map pathfinding, and connecting-exit guidance for distant destinations. Inspection never changes gameplay coordinates or map ID.
- Separated Sovann City and Bamboo Grove into independent logical gameplay maps with their own terrain, bounds, actors, collision and law status. Their reciprocal east/west gates load the correct map and entrance with a short transition cooldown.
- Added compact live maps and expanded local maps using the same coordinate projections. Markers include player position/direction, NPCs, monsters, quest objectives and exits.
- Preserved existing combat, Fist/Spear equipment, prowler contract, Sok warrant, XP/rewards, supplies, crime, guards and custody. Filtered movement, targeting, damage, arrest, AoE and AI by map ID. Ordinary gateway travel preserves the character record.
- Extended browser solo saves to version 3 with map ID, coordinates, energy and cooldowns. Kept the old storage key and migration for v2 progression; invalid/locked destinations fall back safely. LAN state broadcasts include authoritative map IDs without accepting solo-save uploads.
- Added matching Unity catalogue, native hierarchical atlas, map-aware local HUD, A* walking, reciprocal gateways, actor-group activation and native solo persistence. Added 11 generated atlas textures and their original SVG sources. Native execution remains unverified.
- Added map-specific regression tests and extended client-handler and real socket integration coverage. Hardened host startup when the environment cannot enumerate network interfaces.
- Rebuilt the self-contained offline game and updated Windows launch guidance, architecture documentation and packaging checks.

## Delivery limits

Only Sovann City and Bamboo Grove are playable. Bank, Trade Guild and resource-harvesting services are labelled future services. The existing government/warrant system is preserved; this update does not implement new courts, fines or player governments. No real-browser visual or Unity runtime validation was possible in this environment. The release includes an explicit manual acceptance checklist.
