# Five-school foundation and mouse controls

Preview 0.12.0-schools.0, 16 November 2026. Original Youth Fighter proposals; no reference-client code, assets or mechanics were imported. This feature starts from upstream main 60f15d4 after the earlier combat drafts were merged by the repository owner. Work is isolated on feature/schools-and-controls.

## Play the new progression

Choose a starting school before entering a fresh journey. Click open ground to walk to that point; click a target to select it. WASD/arrows no longer move the character. Choose Walk, Slow or Run with the existing Move selector. Skills still hold movement during their commitments; an existing click route resumes afterward. Dodge moves toward the latest ground cursor position, or backward when no cursor position is available.

Open **Schools [I]**, then **Walk to Master Dara**. The guide follows actual map exits to Temple Ward. A new ground click cancels the guide. Near Dara, accept **Discipline at the dummy**, select the nearby dummy, and land three basic attacks. Return to Dara, claim the quest and explicitly learn skill 2. Accept **Protect the grove**, defeat three prowlers/bandits, return, claim and learn skill 3. Arresting the outlaw also counts as a hostile defeat when eligible. No rewards come from button presses or client-supplied counters.

Open **Keys [K]** to rebind individual skills, guard/dodge, map, schools, appearance and other actions. Click a binding and press a letter, number, Space or Tab. Conflicts are rejected with an explanation. Escape cancels capture; Restore defaults resets the layout. Bindings persist separately in this browser, with a session-only fallback when storage is unavailable. Current skill keys and route prompts update in the HUD. Each press sends one intent; there are no automatic combo macros. The keyboard is available for combat and panels rather than walking.

## Schools

| School / stable path | Weapon and identity | Ordinary kit | Linked route |
|---|---|---|---|
| Golden Naga / fist | Bare hands, optional owned wraps; close counters | Naga fist, Elbow surge, Naga awakening | Basin Current; existing River-Step Counter also remains |
| River Reed / spear | One spear, optional owned reed-spear bonus; reach and direction | Spear thrust, Serpent sweep, Naga tempest | Reed Current |
| Stone Banyan / staff | Innate practice staff; broad control with longer commitments | Root tap, Branch turn, Banyan circle | Root and Branch |
| Dawn Heron / blade | One innate practice blade; narrow cuts and a short-range finish | Dawn cut, Heron cross, Sunrise arc | First Light |
| Veiled Lotus / darts | Innate concealed practice darts; range and narrow front geometry | Lotus thread, Double petal, Lotus fan | Lotus Thread |

Each route uses confirmed skill 1 → 2 → 1 quick or 3 heavy. The existing 1.3s outcome windows, one-slot input buffer, interruption rules and exactly-once hit schedules apply. Double petal has two explicit impacts; walls and per-target limits still apply. The new practice weapons are part of each path, not free inventory items or upgrade bonuses. Changing schools while lawful and rested in a city keeps owned gear and each school's learned skills, quests and reputation; incompatible optional weapons unequip. Character level is shared across schools. No school-switch fee is introduced in this foundation.

## Lessons and quests

| Lesson | Requirements |
|---|---|
| Skill 1 | Free on school activation; a basic attack remains available before enrollment |
| Skill 2 | Level 3, 10 school reputation, Discipline completed; learn from Dara |
| Skill 3 | Level 5, 25 school reputation, Protect the grove completed; learn from Dara |

Discipline requires three confirmed Temple-dummy attacks and awards 300 XP + 10 school reputation once per school. Protect the grove requires three hostile defeats and awards 700 XP + 15 reputation once per school. Repeatable School service requires five hostile defeats and awards max(100, current level × 40) XP + 5 reputation. Only one quest per school can be active. Quest progress only advances for the current path. Claiming clears the active quest before awarding, preventing repeat claims. School reputation is separate from existing city reputation.

Maximum character level is **999**. New characters initially have a level ceiling of 10. Advancement requires Protect the grove completed, the tier's required level, hostile defeats, and a confirmed full route on the Temple dummy during the active trial. Using a dummy keeps the combo requirement achievable after the character outgrows early enemies.

| Trial at level | Hostile defeats + one dummy route | New level ceiling |
|---|---|---|
| 10 | 8 | 50 |
| 50 | 12 | 150 |
| 150 | 16 | 400 |
| 400 | 20 | 999 |

Each trial awards 25 school reputation and current level × 100 XP. The highest earned ceiling applies across schools. XP needed for the next level remains current level × 100. At a locked ceiling, stored XP is capped at one level's requirement; additional XP beyond that is not banked. At 999, XP is zero and no reward source can grant level 1000. Existing HP/damage growth formulas remain; this is a progression foundation, not a balanced 999-level campaign or new high-level world content.

## Authority, saves and boundaries

Shared modules: school-data.js defines paths/requirements; school-system.js owns membership, outcomes, lessons and quests; experience.js owns every level-award loop. world.js and city-system.js both use that policy. combat.js rejects unlearned ordinary skills before spending. New school commands pass through command-contract.js on both solo and host. Clients never submit authoritative levels, reputation, learned skills, quest counts or ranks. Existing map/collision/PvP/law/sparring rules remain.

Save v6 stores sanitized school records and accepts versions 2–6. Existing v2–v5 characters retain their level and all six previously available Fist/Spear ordinary skills; v5 discoveries remain. Legacy characters can activate a school through Schools without losing those skills. New schools still require their own lessons. Action, combo and Focus state continue to clear on restore. Local saves never upload to a LAN host; reconnect creates a fresh session character.

Fist/Spear keep their existing hidden techniques and Focus ultimates, with the existing discovery/Focus requirements. Staff/Blade/Darts begin with three ordinary skills and a route; advanced discoveries and ultimates are explicitly deferred and disabled in the UI. New weapon overlays are original procedural placeholders across sprite and fallback rendering, not authored animation sets. Art, high-level balance, additional enemies, school locations and advanced school content remain future work.

## Verification status

Automated coverage exercises actual keyboard/mouse handlers with DOM/Canvas doubles, rebinding persistence/conflicts, all five lesson chains through real command/step outcomes, both route branches at 20/60Hz, max-level boundaries, saves, and host ingress. Real native WebSocket clients earn school lessons from fresh characters, while the existing network journeys now earn prerequisites before hidden skills and ultimates. No debug endpoints or injected online progression are used.

Browser inventory again returned no browser surface and `The browser access host is unavailable`. No native-browser workaround was attempted. Manual visual/layout/playtesting, physical LAN timing and Unity compilation remain unverified. The original partial combat acceptance ledger remains historical; this document records the expanded school scope. Final command results are recorded in VALIDATION.md.
