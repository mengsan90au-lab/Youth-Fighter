# v0.6 update note

Residential Ward now uses the original illustrated sprite kit in residential-data.js / residential-render.js. See RESIDENTIAL-UPGRADE.md and TEST-RESULTS.md for current implementation and evidence; the earlier architecture below remains context. The browser-only native boundary is unchanged. Existing v4 saves and normal/test save slots remain. Other wards retain their previous graphics.

# v0.5 scope: browser city / preserved native prototype

The five playable Sovann City wards and new NPC services in this release belong to the browser game. Launch PLAY-YOUTH-FIGHTER.cmd for them. The Unity project below retains its earlier old-city/grove implementation and has not been expanded with those five wards. This delivery does not claim a native city build or Play-mode acceptance.

# Meng San — start the Unity version here

This is the native 3D project for Youth Fighter. You can keep playing the browser version while setting it up.

## 1. Unity Hub is ready

Your screenshot shows Unity Hub installed and Unity 6.6 (6000.6.8f1) downloading. Let that installation finish. You do not need to install Unity 6.0 for this updated project. The editor has not been run or verified by this delivery.

**Keep your current Hub and editor download. You do not need to download Hub again.** If sign-in or licence setup is still pending, complete that in Hub yourself. This project does not purchase or activate a licence.

## 2. Install the matching editor

If the download shown in your screenshot is still running, simply let it finish. The steps below are only for finding the editor if you need them; do not start a duplicate download.

The supplied project targets **Unity 6.6 (6000.6.8f1)** from your screenshot and declares **URP 17.6.0**. Unity 6.6 distributes URP as an editor-matched core package. Let the editor resolve its bundled package; do not force an older URP version.

1. In Hub, select **Installs** in the left sidebar.
2. Select **Install Editor** and look for Unity **6.6 / 6000.6**.
3. If it is not listed, open Unity's official archive at https://unity.com/releases/editor/archive . Find a **6000.6** editor and choose its Hub installation link.
4. In module selection, include **Windows Build Support (IL2CPP)** if you want to build that backend. The editor can run the project before you make a Windows build. Visual Studio with Unity tools is useful for future C# debugging.
5. Leave Android, iOS and other large modules for later.
6. Wait for the editor and selected modules to finish installing. This is a large download.

The project version file matches **6000.6.8f1**. If you install a different 6000.6 patch, choose that installed patch in Hub and keep your previous ZIP as backup.

## 3. Add Youth Fighter

1. Extract **Youth-Fighter-v0.4.0.zip** completely into a folder you can keep, such as `Documents\YouthFighter`.
2. Open **Unity Hub → Projects**.
3. Select **Add → Add project from disk** (the wording may be **Add project**).
4. Select the extracted **UnityProject** folder. Select the folder containing **Assets**, **Packages** and **ProjectSettings**, not the outer ZIP folder.
5. Open the project with your installed 6000.6 editor.
6. Allow the initial asset import and package downloads to finish. The first import needs internet access for Unity packages.

The supplied **OPEN-UNITY.cmd** launcher can find an editor in its normal 6000.6 installation folder and open this project. If the editor is installed elsewhere, add the project through Hub using the steps above.

## 4. Open the game

The editor helper is written to create and assign the URP renderer, create Naga Fist/Spear skill assets, and generate a scene on first import. These operations still need verification in the installed editor.

1. Wait until Unity finishes compiling.
2. If no scene appears, choose **Youth Fighter → Create prototype scene** from Unity's top menu.
3. If Unity asks whether to save another scene, save or discard your own changes as appropriate.
4. Look for **Assets → Scenes → GoldenNaga** and double-click it if needed.
5. Choose the **Game** tab.
6. Click the triangular **Play** button at the top centre.
7. Click inside the Game view so it receives keyboard input.
8. Before testing Play mode, you can choose **Youth Fighter > Check project setup**. It writes `UnityProject/Logs/YouthFighterSetupCheck.json` and reports whether the editor version, render pipeline, scene, material and input settings are present. A passing setup check is not a gameplay or rendering test.

## 5. Try these controls

| Input | Action |
| --- | --- |
| WASD / arrows | Walk |
| Tab | Select nearest prowler or outlaw |
| Click a fighter or monster | Select it |
| 1 / 2 / 3 | Use the current path's skills |
| R | Drink a tonic |
| F | Arrest a low-health, living Sok with an active warrant |
| Mouse wheel | Zoom the fixed-angle camera |
| M | Open World Map / close the atlas |
| Escape | Back one atlas level; close at World (unfocus search first) |

Accept a contract from the left panel while near the gold noticeboard. Walk through the gold east gateway at X 17 / Y 12 to enter Bamboo Grove. Its west gateway at X 19.5 / Y 12 returns to the city. Press M, select Golden Naga Basin, then Sovann City or Bamboo Grove to inspect their local maps. This does not teleport your fighter. Defeat 3 prowlers, return and collect the reward. To capture Sok, accept the warrant first, leave him with **1–35 HP**, then press **F** nearby.

The left panel has **Naga Fist** and **Naga Spear** buttons. Change inside the city while lawful and after all skill cooldowns finish. A tonic costs 12 silver at the noticeboard. The native project is single-player and does not connect to the browser server.

## 6. If something goes wrong

| What you see | What to do |
| --- | --- |
| A red compiler error | Open **Window → General → Console**, select the first red error and send its text or a screenshot. Do not delete project files to hide it. |
| Package download error | Check internet access, confirm the editor is 6000.6, then open **Window → Package Manager** and allow Universal RP to resolve. |
| Pink surfaces | Choose **Youth Fighter → Configure URP**. Then **Edit → Project Settings → Graphics** should show the generated `YouthFighterURP` asset. |
| Input-system error | Open **Edit → Project Settings → Player → Other Settings**, set **Active Input Handling** to **Input Manager (Old)** or **Both**, and restart the editor if prompted. |
| Empty Game view | Open `Assets/Scenes/GoldenNaga.unity`, then press Play. Most scene content is generated when Play begins. |
| Keys do nothing | Click in the Game view. Make sure Play is active. |
| Character blocks or simple models | Expected: the art is an original procedural placeholder rig, not finished production art. |
| Build error | Confirm the Windows build modules are installed. Read the Console error before changing settings. |

## 7. Optional Windows development build

After the scene runs successfully in Play mode, choose **Youth Fighter → Build Windows development player**. The helper attempts a 64-bit Windows development build in **UnityProject/Builds/Windows**. Build support must be installed first. The helper reports the real result in the Console; no Windows executable has been built in this delivery.

## What has and has not been checked

The project files, JSON configuration and source structure were checked outside the editor. **Unity import, C# compilation, rendering, camera/rig behaviour, and Windows/mobile builds have not been tested**, because a runnable Unity editor is not available to this execution environment. These steps are the next verification milestone.

Official guidance:
- Hub installation: https://docs.unity.com/en-us/hub/install-hub-win-mac
- Editor archive: https://unity.com/releases/editor/archive
- URP setup: https://docs.unity.com/en-us/engine/6000.6/manual/render-pipelines/universal-render-pipeline/introduction/installing-and-configuring-urp/creating-a-urp-project/install-urpinto-aproject

All eight regional atlases are included. Sovann City and Bamboo Grove are separate logical gameplay maps with their own geometry and actors; their groups load within the generated GoldenNaga boot scene. Seven other realms and future Golden Naga locations remain locked. Native solo saves now retain the current map, coordinates and progress in PlayerPrefs. See MAP-SYSTEM.md and TEST-RESULTS.md for architecture, the manual checklist and verification limits.

## v0.4 approved artwork

Press M for the world, select a country and then a city to read details. Available locations offer Open Local Mini-Map. Escape returns one level; search inputs first lose focus. Native atlas resources contain all nine approved images. Choose **Youth Fighter > Check approved artwork** after import; its report belongs in Logs/ArtworkVerification.json. Runtime and the new editor-check C# source compiled against the installed editor assemblies, but the attempted batch import produced no artwork validation report. Play mode, renderer setup and native builds remain unverified.
