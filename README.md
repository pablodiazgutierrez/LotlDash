# Lotl Dash

A dig-and-dodge cave game for lotldash.pablart.com, starring the lotls from
[Lotl Quest](https://lotlquest.pablart.com). Dig through mud, dodge falling rocks,
grab enough pearls to open the shell, and swim out before the timer runs down.

The game itself is `index.html`: no build, no dependencies. The only other files are the
title art and icons in `assets/` (generated with Codex image generation), the font, and the
two small files that make it work offline (`sw.js`, `manifest.webmanifest`). Everything you
see during play (tiles, creatures, the lotl) is drawn in code, because it has to move,
squash and flash.

## Play it

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

On a tablet: landscape orientation, add to home screen for fullscreen.

### Offline

After the first visit the game works **without internet**, in the browser or installed:

- **iPad / iPhone:** open lotldash.pablart.com in Safari, Share → *Add to Home Screen*. It
  opens fullscreen like an app and plays offline (open it once while online first).
- **Android / Chrome / Edge:** the browser offers *Install app* (or menu → *Add to Home
  screen*). Same thing.
- **Any browser:** just visiting once is enough; the page reloads offline from its saved copy.

How: `sw.js` is a service worker that saves the page, the title art, the icons and the
font (Baloo 2, hosted in `assets/fonts/` instead of Google Fonts, under the SIL Open Font
License) on the device. The page is network-first: when online you always get the latest
version (it waits 3.5 s, then falls back to the saved copy); the other files are served
from the saved copy and refreshed in the background. `manifest.webmanifest` makes it
installable. Saves (stars, unlocks) were already on the device in `localStorage`.

The service worker isn't registered on `localhost` (so editing isn't fighting a cache)
unless you add `?sw` to the URL to test it.

## Controls

| | Keyboard | Tablet |
|---|---|---|
| Move / dig | arrow keys or W A S D | drag a finger anywhere (a joystick appears under it) |
| Slurp (grab without moving) | hold SPACE or SHIFT + a direction | hold 👅 SLURP + drag |
| Drop a puffer bomb | B (or X / ENTER) | 💥 BOMB |
| Pause | ESC or P | the II button |
| Restart the cave | R | tap ↻ twice (once when boxed in), or pause → RESTART |
| Hint | H | tap 💡 |

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

New in caves 17–32:

| Thing | What it does |
|---|---|
| 🏖 Sand | Falls like a rock but never hurts and never rolls: it just piles up, filling the tunnels behind you. Dig through it like mud. Rocks rest on it. |
| 🫧 Bubble pearl | A pearl in a bubble that floats **up**: dig the mud above one and it rises (rolling off round things) until something stops it. One rising into you is a `CATCH!`. Counts as a pearl. |
| 🌀 Whirlpool | Comes in pairs (cyan `u`/`U`, violet `y`/`Y`). Swim into one and you pop out of its partner, on the side you were heading towards (blocked if that cell is solid). Rocks and critters ignore them; blasts can't break them. |
| 🐚 Clam door | Opens and shuts on a beat (`CLAM_OPEN`/`CLAM_SHUT` steps, or per cave `clam: [open, shut]`; `K` runs half a beat after `k`). Shut, it's solid. It wobbles just before it snaps shut, and it never shuts on anything in the doorway. |
| ⚡ Eel | A rival that zooms in a straight line (sideways `e`, up and down `E`) and turns back at anything in its way, so it never chases you into side tunnels: you time your dash. Touch it: BZZZT. Drop a rock on it (or let algae touch it) and it bursts into pearls. |

## The caves

32 caves in 8 worlds (the cave picker shows 16 per page). Each one introduces one idea
with a hint card at the start, then the last world of each half mixes everything.

| # | World | Cave | Teaches |
|---|---|---|---|
| 1 | Muddy Shallows | First Dig | digging, pearls, the shell |
| 2 | | Look Out Below | rocks fall when you dig under them |
| 3 | | Push & Plop | pushing rocks down holes |
| 4 | | Avalanche Valley | a big scrolling random cave, rolling rocks |
| 5 | Crab Grotto | Crab Shack | dropping rocks on crabs: wait for the crab to walk under the hole |
| 6 | | Jelly Jars | jellies → 9 pearls |
| 7 | | Slurp! | the slurp, next to a crab loop |
| 8 | | Glow Coral | turning rocks into pearls |
| 9 | Kelp Caves | Algae Garden | algae meets jellies |
| 10 | | Catfish Cove | the pearl thief |
| 11 | | Key Shells | keys and gates |
| 12 | | Puffer Power | bombing coral vaults |
| 13 | Crystal Deep | Jelly Jamboree | jellies + algae everywhere |
| 14 | | Crab Catacombs | crab loops + glow coral |
| 15 | | Rock Slide | a rock-heavy race, clock bubbles |
| 16 | | The Deep Vault | everything |
| 17 | Sandy Reef | Sand Slide | sand: it falls but it's soft |
| 18 | | Bubble Up | bubble pearls float up |
| 19 | | Dune Diggers | a big sandy cave |
| 20 | | Sandcastle | a coral castle full of sand and pearls, jellies |
| 21 | Sunken Ship | Whirlpool Hop | whirlpools between sealed rooms |
| 22 | | Clam Doors | clam doors: go while they're open |
| 23 | | Shipwreck | a wreck split in two by bedrock; the whirlpool crosses it |
| 24 | | Captain's Vault | the key is in a cabin only a whirlpool reaches |
| 25 | Eel Trench | Eel Alley | timing dashes past eels, dropping rocks on them |
| 26 | | Up and Down | eels in up-and-down shafts, a clam on the exit |
| 27 | | Electric Garden | algae grows into eel tunnels: pearls |
| 28 | | Trench Run | a rocky race past eels |
| 29 | Midnight Abyss | Abyss Gate | whirlpools, puffers, keys |
| 30 | | Bubble Storm | bubbles + sand + algae + jellies |
| 31 | | Glow Wreck | glow coral, eels and clams |
| 32 | | The Pearl Palace | everything |

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
- Each cave's tip stays up for 14 s (`HINT_TIME`) and is repeated on the pause card.
- **Stars**: ★ clear it, ★ collect 40% more pearls than the quota, ★ finish with 35% of the
  time left. The criteria show on the clear card.
- **Lotl collection**: Mochi and Coal are free. Matcha (clear cave 3), Storm (200 pearls),
  Blaze (clear cave 8), Splash (24 stars), Coral (clear cave 20) and Nova (clear cave 32)
  are earned. Colour only, no gameplay difference.

## Checking the caves: the solver

Every cave is **proven solvable by playing it**. A solver (the `SOLVER` section of the
script) runs a copy of the cave with the real game rules (`stepCave` on a clone, with sound,
particles and saving switched off) and plays it like a careful kid would:

1. walk to the nearest pearl / key / puffer / clock (the shell once it's open), simulating
   every step a little ahead so it never walks under a falling rock, into a crab, or into a
   pocket that rocks will close behind it. It keeps two cells away from crabs and jellies
   when it can, and doesn't dig the mud under rocks unless there's no other way;
2. when nothing useful is reachable, it tries the moves that change the cave and keeps the
   one that makes the most pearls reachable: slurp the mud under a rock (trying every moment
   over a full lap of the crab or jelly underneath, so it can drop rocks on critters), push a
   rock (as far as it goes), drop a puffer next to coral and swim clear, or wait (algae).

Critter and algae randomness comes from a per-cave seed, so a copy of a cave plays out
exactly like the original, and the solver's timing is exact.

Open **`/?check`** (e.g. `http://localhost:8000/?check`) and the console prints a table for
every cave and either `ALL 32 CAVES SOLVED` or the caves that need a look. Or run
`LotlDash.validate()` (static checks plus the solver), `LotlDash.solveAll()`, or
`LotlDash.solve(5)` for one cave. **Run it after editing any cave.** A cave the solver
finishes is definitely possible; one it can't finish is either impossible or needs a trick
the solver doesn't know, so look at it by hand.

At the time of writing it solves all 32 caves with 5 out of 5 different critter/algae seeds
(160/160 runs), in a few seconds for the lot. It knows the new things too: it paths
through whirlpools, waits for clams, gives eels a wide berth and drops rocks on them.

### 💡 Hints

The 💡 button in the top bar (or H) runs the same solver from wherever the player is right
now (the cave pauses for the fraction of a second it takes) and shows its next move: a
dashed ring and a bouncing arrow on the cell (an arrow on the screen edge if it's off screen)
plus a one-line card, e.g. *"Wait until the crab is right under this rock, then slurp the mud
below it!"*, *"Drop a puffer here, then swim away fast!"*, *"Push this rock!"*, or, when the way
to the next pearl goes through a whirlpool, *"Swim into this whirlpool!"*. If the
solver can't get a single pearl further from here (the lotl dug itself into a corner), it
says so and points at ↻. After 30 s without a new pearl (`HINT_NUDGE`) the 💡 button
pulses and says *need a hint?*.

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

If you add, rename or remove a file the game loads (new art, a sound file...), add it to
`FILES` in `sw.js` and bump `CACHE` (`lotldash-v2`, ...) so devices pick it up for offline
play. Changes to `index.html` alone need nothing: it's fetched fresh whenever there's a
connection.

### Designing critter caves

Crabs keep a wall on their left, jellies on their right. In open water with nothing to
follow they spin in a tiny 2×2 circle forever, which is why the first Crab Shack's crabs
could never be hit. So critters that you're meant to squash live in **loops around a solid
core** (the jars in caves 5 and 6, the tunnel in cave 7, the `ring` op in the big caves).
Placed with the core on their wall side, they circle it forever, pass under the drop hole
every lap, and never turn into the hole (it's on their other side), so they can't climb out
or blast you while you release the rock. They all start facing left, so put a crab in the
top lane (core below it) and a jelly in the bottom lane (core above it).

## Known rough edges / next ideas

- Every cave is proven solvable by the solver, but the solver isn't a kid: it never panics
  and its timing is perfect. If a cave turns out too hard in real play, lower its `need`
  or change its `seed`, then re-run `/?check`.
- The solver is greedy, so a 💡 hint can occasionally say "try ↻" for a position a very
  clever player could still rescue.
- The music is one gentle loop. Each world could get its own.
- No level editor yet. The ASCII format is simple enough that a kid could draw caves on
  graph paper and have them typed in.
