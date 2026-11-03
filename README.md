# Lotl Dash

A dig-and-dodge cave game for lotldash.pablart.com, starring the lotls from
[Lotl Quest](https://lotlquest.pablart.com). Dig through mud, dodge falling rocks,
grab enough pearls to open the shell, and swim out before the timer runs down.

The game itself is `index.html`: no build, no dependencies. The only other files are the
title art and icons in `assets/` (generated with Codex image generation). Everything you
see during play (tiles, creatures, the lotl) is drawn in code, because it has to move,
squash and flash.

## Play it

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

On a tablet: landscape orientation, add to home screen for fullscreen.

## Controls

| | Keyboard | Tablet |
|---|---|---|
| Move / dig | arrow keys or W A S D | drag a finger anywhere (a joystick appears under it) |
| Slurp (grab without moving) | hold SPACE or SHIFT + a direction | hold 👅 SLURP + drag |
| Drop a puffer bomb | B (or X / ENTER) | 💥 BOMB |
| Pause | ESC or P | the II button |
| Restart the cave | R | tap ↻ twice (once when boxed in), or pause → RESTART |

Menus work with mouse/touch and keyboard: arrows move, ENTER presses, ESC goes back.
On the title screen `◀ ▶` pick a lotl, `C` opens the caves, `H` opens How To Play.

## How it plays

The whole cave steps forward about 7 times a second, scanned top-left to bottom-right
like the old cave diggers. The lotl moves first in every step, so a dodge always counts.

- **Mud** is dug by walking through it. **Coral walls** stop you but break in blasts.
  **Grey bedrock** never breaks.
- **Rocks** fall when there is water under them and roll off rocks, pearls and coral.
  A falling rock that lands on you is a BONK. Push a rock sideways by walking into it
  (it budges on the second step, so you don't push one by accident).
- **Pearls** fall and roll like rocks, but a falling pearl that lands on you is a
  `CATCH!`. Collect the cave's quota and the shell opens (screen flash + fanfare).
- **Slurp**: the lotl's tongue grabs mud, pearls, keys or items next to you without
  stepping into the cell, for when stepping in would be dangerous.

### The creatures and gadgets

| Thing | What it does |
|---|---|
| 🦀 Crab | Walks the tunnels hugging the wall on its left. Touch it and it explodes. Drop something on it and it explodes into nothing. |
| 🪼 Jellyfish | Hugs the wall on its right. Explodes into a 3×3 block of **9 pearls**. |
| 🟢 Algae | Grows into water and mud, slowly at first, then faster. If it gets boxed in it turns into pearls. If it grows too big it turns into rocks. A crab or jelly that touches it explodes. |
| ✨ Glow coral | The first rock that falls into it lights it up for ~20 s. Rocks that fall through come out as pearls (and pearls as rocks). Then it burns out. |
| 🐟 Catfish | The rival. Swims only in open water and hunts down pearls to eat them, so it competes with you for the quota. Squash it and you get back every pearl it ate, plus a 3×3 pearl burst. Harmless to touch. |
| 🔑 Keys & gates | Red / yellow / blue. A key opens every gate of its colour. |
| 🐡 Puffer | Pick one up, then drop it in front of you. It puffs up for ~1.3 s and pops like a crab explosion, which breaks coral. Get two cells away. |
| ⏱ Clock bubble | +15 seconds. |

## The caves

16 caves in 4 worlds. Each one introduces one idea with a hint card at the start,
then the last world mixes everything.

| # | World | Cave | Teaches |
|---|---|---|---|
| 1 | Muddy Shallows | First Dig | digging, pearls, the shell |
| 2 | | Look Out Below | rocks fall when you dig under them |
| 3 | | Push & Plop | pushing rocks down holes |
| 4 | | Avalanche Valley | a big scrolling random cave, rolling rocks |
| 5 | Crab Grotto | Crab Shack | dropping rocks into crab jars |
| 6 | | Jelly Jars | jellies → 9 pearls |
| 7 | | Slurp! | the slurp, next to a crab corridor |
| 8 | | Glow Coral | turning rocks into pearls |
| 9 | Kelp Caves | Algae Garden | algae meets jellies |
| 10 | | Catfish Cove | the pearl thief |
| 11 | | Key Shells | keys and gates |
| 12 | | Puffer Power | bombing coral vaults |
| 13 | Crystal Deep | Jelly Jamboree | jellies + algae everywhere |
| 14 | | Crab Catacombs | crab loops + glow coral |
| 15 | | Rock Slide | a rock-heavy race, clock bubbles |
| 16 | | The Deep Vault | everything |

Caves are data in the `LEVELS` array. Small ones are hand-drawn ASCII maps (legend in
the comment above `LEVELS`). Big ones are seeded random fill plus `put` ops that place
structures, so changing `seed` reshuffles a cave while keeping its set pieces.

### Made for a kid

- **No lives, no game over.** Losing just offers `↻ TRY AGAIN` (ENTER). R restarts instantly.
- **Boxed in?** If the lotl can't move in any direction (no mud, no water, no pushable rock)
  for ~1.5 s, a `Boxed in? ↻ TRY AGAIN` card pops up and the ↻ button in the top bar
  flashes and restarts on one tap. A boxed-in restart counts as a try toward SKIP.
- After **3 failed tries** on a cave, the oops card offers `⏭ SKIP TO THE NEXT CAVE`.
- Generous timers; the last 10 seconds tick and flash.
- **Stars**: ★ clear it, ★ collect 40% more pearls than the quota, ★ finish with 35% of the
  time left. The criteria show on the clear card.
- **Lotl collection**: Mochi and Coal are free. Matcha (clear cave 3), Storm (200 pearls),
  Blaze (clear cave 8) and Splash (24 stars) are earned. Colour only, no gameplay difference.

## Checking the caves

`LotlDash.validate()` in the browser console builds every cave and reports pearls vs quota,
whether the exit is reachable by digging, jelly/crab/fish counts, and whether the lotl
survives 40 idle steps at the start (no rock lands on your head the moment you appear).
Run it after editing a cave. Pearls behind gates show up as `pearls` but not `reachPearls`.

## Tuning hooks

The live state is on `window.LotlDash`:

```js
LotlDash.start(7)          // jump straight into cave 7
LotlDash.givePearls()      // fill the quota and open the shell
LotlDash.C.timeLeft = 999  // more time
LotlDash.unlockAll()       // unlock every cave
LotlDash.G.freeze = true   // hold the frame (for screenshots)
LotlDash.reset()           // wipe the save and reload
```

Feel knobs are constants near the top of the script: `TICK` (step length, 0.15 s),
`PUSH_TICKS`, `BOMB_FUSE`, `MAGIC_TICKS`, `CRITTER_EVERY` (crabs, jellies and the catfish step
once every 2 cave steps, i.e. half the lotl's speed; set it to 1 for classic-speed critters). Algae speed and size are per-cave
(`algaeSlow`, `algaeMax`).

The save lives in `localStorage['lotldash.save.v1']`.

## Deploying

GitHub Pages, same as Lotl Quest: repo `pablodiazgutierrez/LotlDash`, branch `main`, root
folder, with a `CNAME` file for `lotldash.pablart.com`. DNS is a Route53 CNAME
`lotldash.pablart.com → pablodiazgutierrez.github.io`. Push to `main` to deploy.

## Known rough edges / next ideas

- The random caves (4, 9, 13–16) were checked by the validator and spot-played, not
  fully played through by a kid yet. If one is too hard, lower its `need` or change its `seed`.
- The music is one gentle loop. Each world could get its own.
- No level editor yet. The ASCII format is simple enough that a kid could draw caves on
  graph paper and have them typed in.
