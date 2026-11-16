# Youth Fighter v0.2 — audit and changes

## Audit of v0.1

The saved v0.1 archive was 51,671 bytes. Its local archive listing includes the HTML, browser source, tests, Unity source and instructions. **It omits `server.js`**, although the working source folder contains it and the launcher expects it. That was a release-packaging error. The v0.2 packaging script explicitly includes the server and checks that the archive contains byte-for-byte copies of every required source file.

The v0.1 Unity manifest contains built-in physics, IMGUI and legacy input modules. It contains **no URP dependency or assigned URP asset**. The runtime's fallback shader lookup alone did not configure a render pipeline. The native scene was only a procedural starter and had never been compiled in Unity.

| Area | Existing state | v0.2 result |
| --- | --- | --- |
| Browser solo game | Original fixed-angle Canvas prototype | Preserved and extended |
| Combat and creatures | Three fist skills, HP, energy, cooldowns, aggro, respawn | Preserved; spear kit, attack poses and clearer martial silhouette added |
| Movement | Direct click-to-walk could stop at buildings | Shared A* routing around buildings; keyboard cancels route |
| Missions and laws | Prowler quest, Sok warrant, city crime, guards, detention | Preserved; guided next-step panel and travel shortcuts |
| Supplies | Three starting tonics | Buy more near noticeboard; server validates price, location, capacity and law status |
| Progress | Lost on refresh | Solo progression saved locally; network client never sends saved rewards or currency |
| Map | Compact minimap only | Larger map, coordinates, destination search, route display and danger warning |
| Windows launch | Default HTML association could open VS Code | Dedicated Edge/Chrome play launcher |
| Browser LAN | Host exists in working source, missing from released ZIP | Host explicitly packaged; new modules served; transport tests retained |
| Native rendering | Built-in starter with unconfigured URP lookup | URP 17.0.3 declared; editor code creates and assigns renderer/pipeline assets on import |
| Native characters | Spheres and capsules | Original articulated placeholder rigs; code-driven walking/attack animation and spear |
| Native camera | Snapped to player every frame | Separate smoothed follow/zoom component |
| Native progression | Monolithic starter skill constants | Separate designer-editable martial-path data and equipment switching |
| Native map | No minimap | Separate runtime minimap component with expanded mode and coordinates |
| Unity setup | No installed editor | Project prepared, official setup guide and launch helper included; user installation/sign-in still required |

## Important limits

This remains a prototype. It is not a finished MMORPG, and the browser renderer is 2.5D Canvas, not a Unity export. The Unity project is a separate native implementation with the same gameplay direction.

- Live multiplayer sockets cannot be verified in this environment: loopback connections are denied with EACCES. The real-socket test reports a skip for that specific restriction.
- Browser visual inspection was previously blocked by browser access restrictions. DOM/Canvas doubles test presentation initialization and interactions, not actual pixel layout or real input on devices.
- No Unity editor or C# SDK is installed. The native project has not been imported, compiled, rendered or built. The supplied automatic setup is implementation awaiting that verification, not evidence that import has succeeded.
- Solo saves depend on the browser permitting local storage. They are per browser/origin and can be lost if browser data is cleared. Moving the HTML or switching browsers can change access to file-URL storage. Keep using the same extracted file and browser. These saves are not an online account or a tamper-proof database.
- Native Unity progression is still session-only. Native networking, click navigation and persistent storage are future work.
- The LAN server has no internet service, production authentication, database or mature anti-cheat. Arrest rewards still need anti-farming rules before public release.
- Approved duels, self-defence tracking, dynamic player warrants, sect counters, trading, crafting and seven more realms remain unimplemented.

## Practical next milestones

1. Install Hub, sign in, add the supplied UnityProject with a 6000.0 editor and verify compilation/Play mode.
2. Fix any editor-specific errors from the first real import, then verify URP, the rig, camera, targeting and map.
3. Build and test a Windows development player. Tune the first map and animations.
4. Add native navigation, interactions and persistence; then evaluate a maintained Unity multiplayer stack and move authority into a dedicated simulation.
5. Test 2–10 clients and strengthen law/bounty anti-exploit rules before public hosting.

The original v0.1 ZIP is preserved. A separate source backup was created before editing; v0.2 is delivered as a separate archive.
