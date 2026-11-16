# Youth Fighter combat development preview

Version 0.12.0-schools.0 is a review build. Automated simulation, real-host two-client journeys and packaging checks pass; real browser visual/playtesting and physical LAN testing remain outstanding. Keep your previous game folder until you confirm your saved character in the same browser.

## Play

Run **PLAY-YOUTH-FIGHTER.cmd** or open **Youth-Fighter.html** in Chrome/Edge for solo. **public/index.html** is the source entry. The regenerated copies under **dist/offline** use the same code. For a LAN room, run **Start-Youth-Fighter.cmd** and open the printed localhost address; friends use the host's address on the same network. This is a session-only LAN prototype with ten clients, not an internet MMO.

Click open ground to move; keyboard movement is disabled. The Move selector chooses Walk, Slow or Run. Tab selects the nearest hostile or dummy. **I** opens five schools and their lessons; **K** customizes skill, combo-step and panel keys. Change schools inside a lawful city while rested and cooldowns have ended. Fist is unarmed with optional wraps; Spear keeps its designated spear, with optional owned reed-spear bonuses. Incompatible owned weapons return to inventory when changing paths.

## Start a school

Choose Golden Naga (Fist), River Reed (Spear), Stone Banyan (Staff), Dawn Heron (Blade) or Veiled Lotus (concealed darts). Open **Schools → Walk to Master Dara**. Complete Discipline at the dummy, claim its reward and learn skill 2 at level 3 / reputation 10. Complete Protect the grove and learn skill 3 at level 5 / reputation 25. Advancement trials raise the level ceiling **10 → 50 → 150 → 400 → 999**. See [the school guide](docs/combat/SCHOOLS-AND-CONTROLS.md) for quest details and migration.

Existing characters retain their old skills. Staff/Blade/Darts start with three ordinary skills and a route; their hidden techniques and ultimates are planned for later updates. All keys below are defaults.

## Practice the ordinary route

Stay within reach and use **1**. Damage lands after startup, followed by recovery. Confirm a hit, use **2**, then choose **1** for a quick finish or **3** for heavier area commitment before the HUD window expires. All five paths have a confirmed route; Fist calls it Basin Current, Spear calls it Reed Current. A miss, different target, defense, interruption or expiry resets the route. One attack can buffer during the last 150ms of recovery; it still needs range, energy and cooldown eligibility.

The existing **3** techniques remain ordinary energy attacks: Naga awakening / Naga tempest, 45 energy and 9s cooldown. They are distinct from the new Focus ultimates.

## Defend and counter

**Q** commits to a guard facing the selected target. It costs 8 energy plus 10 when it blocks a frontal strike, reducing damage to 40%. Back attacks bypass it. Guarding without enough impact energy breaks the guard.

**Space** dodges toward the ground cursor, or backward if no cursor position is available. It costs 18 energy, moves through existing collision rules, and protects only the short active window after startup. Orange enemy wedges anticipate strikes; move out, guard or time a dodge. Wait for recovery before starting another action.

Fist additionally offers **River-Step Counter**: actually evade a strike with the dodge window, use **2** against that attacker, then choose **1** or **3**. Merely pressing dodge creates no counter route. Heavy hits can interrupt actions, but repeated stagger has resistance so it cannot hold a victim indefinitely.

## Discover one technique per path

Travel through normal entrances to **Temple Ward**, approach **Master Dara**, and choose **Dara: study**. Select the nearby training dummy and complete the ordinary route. Then choose **Practice pulse** near the dummy. It telegraphs for .6s; guard near impact or time a dodge. The pulse is nonlethal and can be retried.

Discovery teaches **Basin Echo** for Fist or **Tide-Reversal Spear** for Spear. **4** activates the learned technique after a later timed dodge or early guard. Basin Echo costs 16 energy and opens a brief quick **1** follow-up; Tide-Reversal costs 20 and sweeps its front. Both have an 8s cooldown. The HUD names the technique after discovery. Secrets provide an option; ordinary combat does not require them.

## Earn Mastery Focus

Fight prowlers or the bandit. Confirmed hostile hits, completed routes and timed defenses earn capped Focus, up to 100. Training, practice pulses, civilians, guards and player sparring give none. Repeated hits against one enemy and global gain are rate capped.

**5** uses **Golden Basin Resonance** (Fist) or **River Crown Tempest** (Spear) for **60 Focus + 30 energy**, with a **30s cooldown**. Fist pulses outward twice; Spear makes three narrow thrusts then a wider directional finish. Each has visible anticipation, stationary commitment and opportunities for escape, defense or interruption.

Complete a route on the same hostile, then use **V** within two seconds for **70 Focus + 35 energy**. This enhances only the final strike by 15%. Accepted missed/interrupted actions receive no refund.

## Keep your journey

Solo save v6 accepts v2/v3/v4/v5/v6 and retains known technique discoveries, progression and compatible city equipment. Actions, combo/challenge/counter opportunities and Focus clear on reload. Focus also resets on travel, path change and defeat. LAN joining/rejoining starts host-owned session progress; solo saves never confer online resources.

Existing quests, inventory, city services, wanted status, guards, arrest and nonlethal consensual sparring remain. City attacks still require explicit intent and carry the existing crime consequences. R drinks a tonic; F arrests a living eligible target.

## Review status

This revision fixes combined movement keys and directional dodge being rejected by the command gate. Network tests now start fresh characters, earn hidden techniques and Focus through normal commands, and verify standard/enhanced ultimates for both paths with a second observing client. These are native WebSocket clients on loopback, not browser or physical LAN playtests.

Read [the acceptance ledger](docs/combat/ACCEPTANCE.md) for exact evidence and outstanding checks. Balance, authored martial animation/audio, browser layout/feel and real LAN timing need review. Procedural telegraphs remain enabled under reduced effects. Native Unity is blocked by missing project metadata and has not been compiled or tested.
