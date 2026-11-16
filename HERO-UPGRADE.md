# Golden Naga hero integration

## Audit and chosen implementation

The latest v0.6 project uses Canvas 2D for active browser gameplay. Players were drawn from flat polygons, ellipses and stroked limbs in game.js. Movement/facing, lastStrike/strike and skill paths come from world.js; owned equipment lives under player.city, and progression.js already persists it in v4. Collision, targeting, NPC interaction and travel use gameplay coordinates rather than character geometry. The separate native Unity visual remains an earlier primitive procedural rig.

No production skinned 3D model/rig or compatible browser 3D character pipeline was supplied. The request allows a compatible animated hero first in this situation, so the browser receives an actual animated directional sprite implementation. This avoids inventing a claim that an image is a UV-mapped/PBR humanoid asset.

## Actual visual behavior

Original generated frame artwork follows the supplied Golden Naga reference: young Southeast Asian-inspired athletic male, high black topknot, natural proportions, dark sleeveless charcoal tunic, indigo/gold decoration, maroon sash, forearm wraps and boots. The transparent atlas has 30 poses: five real viewing angles × idle/two stride poses/punch/elbow/power guard. Mirror mappings provide eight screen directions from the locked isometric world heading.

Each frame has a measured pelvis/foot pivot and complete bun/boot bounds; irregular source-row spacing is registered as metadata instead of blindly cutting a uniform grid. A cached shared image is decoded once. Runtime motion samples real displacement; idle bobs subtly, walking alternates actual stride images, and authoritative lastStrike/strike selects windup/impact/recovery poses. Hit feedback is a brief visual flash/fade. This is discrete frame animation, not skeletal blending or motion capture.

The renderer does not execute damage, teleport, buy equipment, change cooldowns or modify player state. A failed/loading image leaves the original actor fallback available. Appearance controls use a copied preview pose and a separate visual-cache key. Turning/closing that preview never changes the fighter’s position, facing, items or legal state; opening it stops walking like other game panels.

Wraps, vest, charm and krama layers read actual equipped IDs. The same base hero remains for Naga Spear, with a path-specific drawn spear; Naga Fist remains unarmed. These are lightweight 2D equipment indications rather than complete separate armour meshes or a wardrobe reskinning system. Existing source combat/save/city/navigation/native files are unchanged and recorded in art/hero/protected-simulation.json.

## Preserved gameplay

Movement, collision radius/bounds, aiming/target IDs, damage/ranges, energy/cooldowns, Fist/Spear rules, NPC distance checks, shops/bank, quests, arrest/crime, district transitions, mini-maps and v4 saves remain their existing implementations. Only visual selection-centre and overhead-label height account for the taller hero. Multiplayer uses the same public atlas and authoritative state; it does not trust a client to change its stats through appearance.

## Limitations

- No complete 3D mesh, topology, UVs, PBR maps, skinned skeleton, native Animator controller, facial blendshapes or physics cloth/hair is included. The atlas contains baked realistic shading; it is not extracted from a delivered 3D model.
- Eight facing selections use five views plus mirroring. Transitions are frame-based; there are not eight independently authored full animation rigs.
- Facial expression is baked into the poses. Sash/cloth changes come from frames and simple equipment-layer motion, not cloth simulation. The current game immediately returns defeated players to town, so a new full death-animation lifecycle is not added.
- NPCs retain their previous placeholder art. Their scale/detail differs from the upgraded hero. Other project/renderer limitations remain.
- Full browser visual/input acceptance and measured performance remain unverified. Native Canvas rasterization confirms actual scene/pose output, not browser CSS/HUD layout.

See 3D-HERO-MIGRATION.md for the explicit remaining true-3D production path.
