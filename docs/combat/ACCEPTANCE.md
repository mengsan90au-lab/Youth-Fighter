# Combat preview acceptance — 16 November 2026

Overall status: **partial development preview; full combat release acceptance is not met**. Ordinary skills, linked routes, hidden techniques, defense and ultimates are implemented in shared simulation with automated evidence. Browser playability/visual QA and physical LAN feel remain unverified. All PRs are drafts and main remains at the recoverable baseline.

| Requirement | Status | Evidence / remaining work |
|---|---|---|
| Verified current audit and trace | Implemented | AS-IS-2026-11-16.md; exact baseline 35458fa; real command/save fixtures |
| Six existing ordinary skills / numeric compatibility | Implemented | combat-baseline and combat-foundation tests; stable-ID adapter; original damage/cost/cooldowns preserved |
| Authoritative timing / hit ordinals / obstruction | Implemented | startup/active/recovery, boundary splitting, map/range/permission revalidation and per-ordinal victim limits |
| Hit-confirm route per path and branch | Implemented | Basin Current and Reed Current; quick/heavy branches, resets/expiry and one-slot 150ms buffer tested at 20/60Hz |
| River-Step Counter | Implemented in final integration stage | Real timed dodge → Elbow Surge → limited quick/heavy follow-up; same-attacker continuation tested at 20/60Hz; it was deferred in earlier draft stages |
| Guard/dodge/counter/stagger resistance | Implemented | Direction/cost/protection-boundary/collision/break/recovery tests; actual incoming outcomes create opportunities |
| Teachable hidden technique per path | Implemented | Both full command-driven mentor/dummy/pulse challenges tested; unlock enforcement and v5 persistence |
| Focus eligibility, bounds and resets | Implemented | Once-per-action hostile awards; global/source caps; training/player exclusions; save/join forgery rejected |
| Standard/enhanced ultimate per path | Implemented | 10/20/60Hz scheduled hit tests, per-hit geometry, last-hit-only enhancement, higher costs and nonrefundable commitment |
| Weapon identity / equipment / durability | Implemented with existing art adapters | Fist unarmed/wraps, innate path spear/owned reed-spear bonus, incompatible gear retained; durability tests |
| Existing training / quests / arrest / rewards / saves | Implemented automated regression coverage | Real Temple training claim, exactly-once bounty/kill reward, law and sparring, v2/v3/v4/v5 migration and lifecycle tests; not a manual playthrough of every city service |
| Exactly-once multihit PvP and sparring | Implemented | Returned/defeated/completed sparring victim exclusions, per-target counts, no Focus from PvP; area collateral remains primary plus eligible wolves/bandits, not arbitrary player bystanders |
| Readable impacts, telegraphs and reduced effects | Partial | Original procedural shapes and read-only HUD/pose adapters tested with doubles; real visual timing/layout/readability unverified; authored animation/audio missing |
| Host authority / online consistency | Partial validation | Same shared rules, actual host valid ordinary delayed hit, malformed/spam/fabricated Focus/unlock/save rejection and reconnect tested; full valid advanced-combat two-browser session unverified |
| Render-rate independence | Implemented automated evidence | Simulated 30/60/120 frame schedules produce equivalent resources/cooldowns/damage; this does not measure real rendered FPS |
| Supported launch artifacts | Partial / GUI check blocked | Public/standalone/dist source hashes, inline syntax/order and packaged launchers verified; DOM/Canvas-double bootstrap frame passes; native browser control stopped due URL policy error |
| Physical LAN / buffer tuning | Unverified | Loopback only. No separate machine, latency/loss or ten-client load measurements |
| Unity / native 3D | Blocked | ProjectSettings and Packages/manifest.json missing; warning-only check is not a compilation |
| Production MMO scale / geography / eight schools | Deferred, outside scope | Ten-client LAN prototype retained; future spatial indexing and interest management documented; maps and renderer unchanged |

Validation commands and per-stage results are in VALIDATION.md. The new source/package verifier validates freshness and syntax using canonical LF text hashes, not pixels or browser execution. Test-client native WebSocket coverage requires Node 22+; this run used Node 26.13.1 and skipped no tests. Runtime server compatibility remains Node >=18.

All new combat content has provisional balance. No live JX2 gameplay, hidden rules, frame performance or ultimate system was verified. See ASSET-PROVENANCE.md for asset boundaries and placeholders.

Review draft PRs in dependency order: #12 (audit/foundation) → #14 (combos/defense) → #16 (discovery) → #18 (Focus/ultimates) → final integration draft. Retarget dependent PRs as earlier branches merge only after review and user approval; no automatic merge is authorized. Parent tracker: #10; reused authority/save tickets remain linked rather than duplicated.
