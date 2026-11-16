# Youth Fighter v0.2.1 — Unity 6.6 preparation

This separate release targets the editor shown in Meng San's screenshot: **Unity 6.6, 6000.6.8f1**. The previous v0.2 ZIP remains unchanged.

## Use this download when installation finishes

1. Extract **Youth-Fighter-v0.2.1.zip** into a new folder.
2. Open Unity Hub and wait until **6000.6.8f1** is installed.
3. Choose **Projects > Add > Add project from disk**.
4. Select this download's **UnityProject** folder.
5. Open it with **6000.6.8f1** and let import/compilation finish.
6. Choose **Youth Fighter > Check project setup**.
7. Open **Assets/Scenes/GoldenNaga** if necessary, select the **Game** tab, and press **Play**.

If an editor restart is requested after keyboard input configuration, complete the restart before playing. If a red error appears, send the first Console error or a screenshot; do not keep changing package versions at random.

## Changes

- Editor version marker changed from 6000.0.0f1 to 6000.6.8f1.
- URP declaration updated from 17.0.3 to 17.6.0. Unity 6.6 supplies core packages with the editor and resolves the supported matching version.
- Unity launcher now looks for installed **6000.6** editors.
- First-import setup waits for package/asset updates to settle before creating assets.
- Asset folders are created through Unity's AssetDatabase, and existing renderer assets are reused on a setup retry.
- Legacy keyboard input is configured even when the scene already exists.
- Added **Youth Fighter > Check project setup**, which reports editor family, scene, URP assignment, material and legacy input configuration. It writes a JSON report under **UnityProject/Logs**. This check can only run after the project compiles in Unity.
- Build menu checks for Windows build support before attempting a player build.
- Beginner guides updated for your current download; no second Unity 6.0 download is requested.
- Browser gameplay and its existing solo saves are preserved in source. Use the same browser/file location to retain access to existing browser-local saves; a new extracted HTML path may use different file-URL storage.

## Verification limits

The source/API review uses Unity's official 6.6 and URP 17.6 documentation. JavaScript regression tests and archive/source checks are run when packaging. Neither that review nor those tests compile C#.

**Unity import, native compilation, rendering, Play mode, Windows builds and mobile builds have not been verified in this environment.** The editor paths available here do not contain a runnable 6000.6.8f1 installation. Your screenshot showed a download in progress, not a completed native project test.

No new CoreCLR runtime selection or build backend is forced. The project uses the editor's normal defaults. A future runtime migration is separate from making this beginner prototype open in the installed editor.

If you use the old v0.2 folder, close Unity and keep it as a backup. Open the **UnityProject inside this new v0.2.1 download** to use the updated configuration.

## Official sources checked

- Exact editor release: https://unity.com/releases/editor/whats-new/6000.6.8f1
- URP as an editor-matched core package: https://docs.unity.com/en-us/engine/6000.6/manual/packages-list/packages-all/pack-core/com-unity-render-pipelines-universal
- Core package behaviour: https://docs.unity.com/en-us/engine/6000.6/manual/packages-list/packages-all/pack-core
- URP 17.6 setup API: https://docs.unity3d.com/Packages/com.unity.render-pipelines.universal@17.6/api/UnityEngine.Rendering.Universal.UniversalRenderPipelineAsset.html
- Legacy input remains available: https://docs.unity.com/en-us/engine/6000.6/manual/input/legacy
