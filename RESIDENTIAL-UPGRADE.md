# Residential Ward: art, gameplay preservation and limits

## Artwork and scene integration

The latest supplied style reference was inspected. An original six-cell sprite kit was generated for curved orange terracotta roofs, carved timber, sandstone plinths/steps, pots/flowers and restrained Khmer-inspired ornament. The source cells contain an elder’s house, clinic with a leaf motif, family home, goods shop, open food stall and canopy well. Both existing family homes reuse the house module. The neighbourhood shrine has a more detailed original procedural roof fallback rather than an oversized house sprite.

The full-resolution lossless WebP is a reusable source/runtime asset. Each object is drawn from its own 512px cell with a four-pixel crop gutter. Sprite footprints/anchors derive from the actual building records and camera transform. Draw order uses the residential front-face centre, and projected player occlusion fades nearby foreground buildings. Signs are rendered separately; no reference UI, characters or labels are baked into the kit. A detailed procedural fallback remains if artwork fails to load.

Banana leaves, flower clusters, slender hanging lanterns, banners, porch/courtyard paving and a bench are separate layered decorations. Existing house footprints contain the art’s attached fencing; soft greenery does not block the walking lanes. The solid well rim/bench and two new small service buildings have collision and appear in the map representation. Decorative eaves/canopies do not create impassable road walls. This is footprint collision, not per-pixel sprite collision or enterable interiors.

## Preserved and added

Preserved: Residential Ward ID, the original five building rectangles, both road centre-lines, Market/Temple gateway IDs and coordinates, original NPC positions, parcel mission and rewards, movement/combat/law, save v4 and the map hierarchy. Elder Mony remains at his established square position, not moved into a new interior. The elder’s building is clearly signed separately.

Added: Local Goods Shop at X4/Y14 (6×3), Food Stall at X13/Y23 (4×2.5), and reachable NPCs for goods, clinic care and well rest. Clinic and well use bounded existing rest mechanics; shops use existing authoritative stock/prices. No client-controlled money or quest rewards were introduced. Core roads remain clear; all POIs and exits have validated paths from the square.

The **Walk to Residential Ward** guide computes real exit routes, follows them across map changes, and cancels on manual movement. Click-to-walk now avoids unrelated gateway trigger rings so it cannot accidentally bounce through Old Sovann Square while aiming for another exit. Manual walking onto any valid gate still works normally. Inspection is still read-only.

## Remaining production work

- Other districts and character/NPC art retain their prior procedural style. This release focuses on Residential Ward buildings and surroundings.
- The fixed layout is preserved and therefore does not reproduce the reference’s compact street arrangement exactly. The reference’s UI, water garden/bridge and character designs were not copied. No unnecessary residential water crossing was added.
- Houses are exterior collision objects. Interiors, doors opening into rooms and fully animated domestic activities are not implemented.
- Full browser UI/pointer/focus acceptance and measured frame-rate/memory tests still need human testing. Native Canvas scene renders prove actual renderer/asset composition, not a browser session or CSS/HUD layout.
- Unity has not received this kit or new ward scenes. It remains the preserved native prototype.
- Existing standalone-origin save constraints and session-only LAN persistence remain.
