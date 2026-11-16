# True 3D hero: remaining production path

**Status: design/authoring contract only. No 3D model, importer, humanoid rig or PBR texture set is delivered in v0.7.0.** The playable browser update is the compatible animated 2D stage authorised by the request.

## Required production asset

Create an original complete-body humanoid mesh from the approved design, including hands/feet, clean deforming loops at shoulders/elbows/knees/hips/face and a separate practical layered outfit. Author nonoverlapping UVs where appropriate and skin/fabric/leather/metal materials. A proposed budget is 20–35k visible triangles for desktop with a 10–15k lower-detail variant; validate against target devices rather than treating this as a benchmark result.

Author torso/outfit colour/normal/roughness textures at 1k or 2k as justified by isometric viewing, with smaller shared accessory maps. Skin/fabric are nonmetal; gold clasps/trim use a metallic material. Build and inspect textures from actual geometry/UVs, not by renaming this sprite sheet as a PBR map.

Supply a skinned humanoid skeleton, root/pelvis/spine/chest/neck/head, clavicles, upper/lower arms and hands/fingers, thighs/calves/feet/toes. Provide idle, walk/run, punch, elbow, power action, hit and defeat clips with appropriate contact timing and no unintended root movement. Facial blendshapes and optional cloth/hair bones require separate authoring and performance testing.

## Integration boundaries

| Existing system | Future 3D adapter must preserve |
| --- | --- |
| world.js movement and map IDs | Authoritative X/Y remains the gameplay source; map to 3D X/Z, preserving arrival points/collision |
| facing and lastStrike/strike | Drive animation heading/action; renderer may not award hits or bypass cooldowns |
| city equipment IDs | Bind compatible visual meshes/materials only for owned/equipped slots |
| progression.js v4 | Keep inventory, quests, health, wanted state and saved coordinates compatible |
| map-renderer.js / atlas | Mini-map uses gameplay coordinates, independent of mesh/model pixels |

For a browser renderer migration, implement and test a 3D rendering surface/adapter (or offscreen character render composited with the existing scene) with consistent depth/occlusion and the locked camera. v0.7 does not silently add a WebGL dependency. Replacing hero-render.js alone with a model path is insufficient: loader, animation mixer, asset readiness/failure, lighting, depth and equipment attachments all need implementation.

For Unity, import the actual skinned asset with a verified humanoid avatar and materials matching the installed URP project. Replace the player-specific procedural appearance in YouthFighterVisual while keeping NPC/creature handling intact. Drive a tested Animator from the prototype movement/combat events; retain the existing collider and authoritative gameplay decisions. The current primitive visual and previous import limitations are not a finished native asset pipeline.

## Acceptance before calling it 3D-ready

Inspect topology, UV seams, weight deformation, materials, feet contact and animation transitions. Run actual Unity Play mode and target builds; verify interaction/collision/targeting, appearance slots and Fist/Spear restrictions. Compare saves and gameplay damage/cooldowns before/after; test LAN map isolation and target hardware performance. Check camera/occlusion at common resolutions. Only then describe the native/web 3D hero as implemented.

The machine-readable proposed contract is art/hero/3d-production-contract.json. It is intentionally not a fake .glb/.fbx file or an executable importer.
