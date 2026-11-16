# v0.6 update note

Residential Ward now uses the original illustrated sprite kit in residential-data.js / residential-render.js. See RESIDENTIAL-UPGRADE.md and TEST-RESULTS.md for current implementation and evidence; the earlier architecture below remains context. The browser-only native boundary is unchanged. Existing v4 saves and normal/test save slots remain. Other wards retain their previous graphics.

# Sovann City implementation and remaining production work

## Implemented browser city

| District | Environment and services |
| --- | --- |
| Market Ward | Ten individual business buildings, six produce/cloth/pottery/herb/fittings stalls, square and side lanes, customers, guild representative, quartermaster, shops, bank, blacksmith and inn |
| Temple Ward | Main temple, library, sect meeting hall, martial hall, pavilion, shrine, attendants, garden, trainer, practice dummy, meditation and two missions |
| Canal Ward | Blocked canal, three passable bridges, warehouse, waterfront houses/shop, docks and decorative boats, fisher, dockmaster, cargo delivery and trade |
| Residential Ward | Timber/sandstone houses, courtyards, gardens, well, shrine, elder, protected parcel, travellers, local food and a return-delivery mission |
| South Gate Ward | Fortified gatehouses, barracks, checkpoint, stable, inn, cart and banners, captain, government notice, caravan preparation and a real wilderness entrance |

Every ward has named NPCs, two guards, residents, matching local geometry, live actor/player markers, direction and coordinates. Merchants remain stationary; residents wander short safe distances, and guards patrol and path around obstacles when pursuing crime. NPCs are created once in the shared world, use their map ID for visibility/combat, and respawn under the existing rules rather than being duplicated at every entrance.

## Working services and progression

Stock includes fist wraps, a practice spear, padded vest, lotus charm, healing herbs, food, a krama costume and ordinary supplies. Trade buys/sells one item at server-defined prices, validates range/living NPC/map membership/currency/capacity, and blocks selling equipped items. Inventory and storage hold up to 80 items each. The bank deposits/withdraws silver and transfers owned items. The original tonic vendor and quest currency are unchanged.

Equipped compatible weapons add +2 damage. Blacksmith weapon-training upgrades cap at +3 more damage; strikes wear weapon durability and repairs cost four silver. This is one character weapon-training tier, not independent per-copy enhancement. Armour and charm give small defence bonuses. Clothing changes the local hero’s palette. Food/herbs restore bounded health/energy. Rest costs five silver at an inn; meditation is free with a ten-second service cooldown. No new martial skills are invented.

Eight non-repeatable missions cover workshop delivery, guild introduction, three real dummy strikes, a ceremonial message, canal cargo, a missing parcel, checkpoint briefing and caravan clearance. Completion requires an accepted mission, an actual validated interaction/hit, and returning to the giver. Rewards, state and reputation are server-owned. Reconnect/reload does not make a saved completed quest claimable again. Original prowler and Sok missions remain in Old Sovann Square.

All wards use the existing wanted/guard/arrest system. Wanted status survives travel. Consensual same-district sparring requires a nearby player invitation and acceptance, expires, and stops at one HP without ordinary city crime/death penalties. An attacker who gains ordinary wanted severity can be fought under the existing wanted-target self-defence rule. Sparring is not matchmaking or a ranked arena.

## Reference and geography

The supplied Sovann City concept was inspected as a visual reference and is preserved under art/city-reference. Its sandstone city, water crossings, tropical planting and southern approach inform the new layouts. The game objects are original procedural geometry, with their own collision. No painted background is being passed off as a walkable scene. Temple north / canal east / homes west / gate south is an intentional schematic arrangement; individual streets are not an exact traced match to that painting or the regional image.

## Remaining or intentionally unavailable

- Final hand-painted environment sprites, detailed character/NPC art, polished lighting/audio, interiors and interior navigation.
- Functional fishing, moving boats, horse rental and a moving caravan escort. Their NPCs explicitly describe these as future services. The caravan mission only prepares clearance.
- Additional sect ranks, new disciplines, learned-skill progression, guild membership and a larger economy. Existing Fist/Spear paths remain.
- New Unity ward scenes, native services or native acceptance. The preserved Unity project still has its earlier two playable maps.
- Persistent server accounts, saved LAN worlds, public MMO hosting, matchmaking and interest-management scaling.
- Real-browser visual/accessibility/pointer/focus acceptance and measured frame-rate/memory performance. Automated Canvas calls at three resolutions do not prove pixel quality or FPS.
- Exact world/country/city geographic zoom registration; see GEOGRAPHIC-CONSISTENCY.md.

The server sends the room world using the existing prototype protocol; it is limited to ten fighters and is not a production MMO backend. NPC/prop counts are modest, inactive ward wandering is skipped, and guard routes are refreshed at intervals, but this release has not been benchmarked on target hardware.
