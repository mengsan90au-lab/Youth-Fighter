# Combat validation ledger — 16 November 2026

## Foundation, branch combat/authoritative-foundation

Implemented: source audit, immutable six-skill registry and legacy adapter, shared runtime intent gate, authoritative startup/active/recovery and hit ordinals, frozen commitment movement, impact range/map/alive/permission/obstruction checks, travel/arrest/defeat/load cancellation, compatible path equipment, read-only action poses, fresh standalone generation and copied launchers. Parent #10, foundation #11; reuses #4/#8 and #3/#7.

Actual commands: `npm test` was attempted but npm is absent from PATH. Ran the exact package scripts with `C:\Program Files\nodejs\node.exe` instead: `--test tests/*.test.js` **23/23 pass**; `tools/check-unity-config.js` **exit 0 with warnings** for missing Unity ProjectSettings and Packages/manifest.json; `tools/build-offline.js` **exit 0**, regenerated standalone and copied offline package. These results do not prove Unity compilation or GUI launcher behavior.

Observed runtime (automated): native Node WebSocket clients connected to a spawned real server, received startup before damage, verified guard HP 250 → 208 for the original third skill, ignored fabricated damage/save/resource fields and malformed/spammed messages, and received a fresh player on reconnect. Loopback only; separate physical LAN, latency tuning and ten-client load are unverified.

Browser check blocked: computer-use inventory reported browser access host unavailable. Native Chrome selection then stopped because current browser URL could not be determined confidently enough to enforce policy. No gameplay interaction or browser screenshot succeeded. Manual launch/path selection/combat/travel/reload and measured render performance remain unverified. Do not substitute the Node tests for this evidence.

Playable foundation guide: launch public/index.html directly or regenerated Youth-Fighter.html for solo; start server.js for LAN. Select a path with I while lawful/rested; use Tab and 1/2/3 near enemies or the Temple dummy. Observe startup before damage and held movement during commitment; move away before enemy impacts in later stages. Third skills remain ordinary energy attacks. Travel and reload should discard actions but preserve solo progression. Verify packaged public/index.html and packaged standalone separately. Native Unity is blocked.

Remaining after foundation: combo routes/branch/input buffer, guard/dodge/counter/stagger, mentor discovery/unlocks, Focus/ultimates, enemy telegraphs and expanded visual feedback are deferred to dependent stages. Full combat release is **partial**, not complete.

## Combo and defense stage, branch combat/combos-defense

Implemented: finite hit-confirm routes and both branches for both paths, 150ms one-slot buffer, directional guard, collision-aware dodge with protection interval, bounded counter eligibility, stagger resistance, prowler/bandit anticipation and recovery, locked spear cones and compact HUD/telegraphs. Counter-named Fist route remains deferred; Basin Current is the implemented hit-confirm route. Authored defense animation/audio remain placeholders.

Actual results: installed Node ran the exact test/check/build scripts: 32/32 tests pass, check exits 0 with the same two Unity metadata warnings, build regenerates both offline artifacts successfully. Tests cover 20/60Hz route branches, resets, queue first-wins/revalidation/expiry, front/back guard, dodge cost/collision and timing, stagger resistance, AI range escape, spear facing and read-only reduced-effects anticipation. The earlier browser policy block persists; manual gameplay, visual layout, physical LAN feel and measured render performance remain unverified.

Guide: Q guards toward selected target; Space dodges along movement input or backward. Wait out recovery. Confirm 1, link 2 within the displayed window, then choose 1 quick or 3 heavy. Let the window expire, deliberately whiff or change targets to check reset. An orange enemy wedge anticipates a .4-second windup. Reduced effects should preserve this wedge.

## Discovery stage, branch combat/discoverable-techniques

Implemented: both named hidden responses, mentor clue/challenge, confirmed dummy-route proof, visible nonlethal practice defense, persistent known unlocks and separate cooldowns, save v5 accepting v2/v3/v4/v5. Locked/path/counter/resource/cooldown enforcement is in shared simulation. UI explains discovery and activation. Existing ordinary skills stay independent of hidden unlocks.

Actual results: 37/37 Node tests pass, including full real-command mentor/route/drill/defense discovery for both paths at 20/60Hz, wrong/late/missed/remote requests, locked/expired activation and actual snapshot/restore sanitation. Exact check/build scripts exit 0; Unity check still warns about missing metadata. Browser layout/playthrough and physical LAN remain unverified for the previously recorded policy blocker.

Guide: enter Temple Ward and approach Master Dara; choose Dara: study. Approach/select the dummy and finish 1 ? 2 ? 1 or 3. Choose Practice pulse. Wait roughly half a second, then Q toward the dummy (or time Space). Discovery names the technique; 4 activates it after later real timed defense. Fist can then use a quick 1 follow-up. Reload should retain the unlock and remove challenge/counter proofs.
