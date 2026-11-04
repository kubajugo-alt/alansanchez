# Action sprites for Alan and Vasco: what the game asks for (2026-10-31)

## Where it stands

- Alan and Vasco stand, talk (lip-sync and blinks) and walk. Nothing else: since HANDOFF 32 (the user, 2026-10-29:
  "the characters should only be using their original static sprites") both have `poses: {}` (`js/story/core.js`
  `still()`), so every `S.posed('<pose>', ...)` in the story shows the standing sprite.
- The story already calls **55 poses at 16 names** (below). Each call is where a sprite would go: the code holds the
  pose while the sound and lines play, so a new sprite drops in by adding it to the outfit's `poses` (a single frame,
  or a Ludo run `{ frames, fps, hold }`: in to the hold frame, held, then played out).
- The only actions in the game: the airport kiss (Ludo, `duo_gando_kiss`) and Alan undressing on the beach
  (`S.UNDRESS`).
- **On disk but switched off**: Alan's vest-outfit Ludo actions from HANDOFF 29–30, approved at the time: `alanv_phone`,
  `alanv_drink`, `alanv_write`, `alanv_climb`, `alanv_pull` (plus turns). They are of the current Alan, so they could
  be switched back on for the vest outfit once the user has looked at them again. Vasco's old ones (`vasco_reach`,
  `vasco_kneel`, `vasco_trowel` and Game I's frames) are of the **old** Vasco, before the repaint (`vascor_*`): not
  usable.
- Outfits matter: each sprite is needed per outfit it is used in. Alan: **vest** (`alanv`, most of the game), **blazer**
  (`alanb`: Tuesday evening, Thursday's dinner), underwear (beach only). Vasco: **day** (`vascor`), **dinner/blazer**
  (`vascor_dinner`). Vasco is the player only in his chapter (Saturday) and the cell; everywhere else he is an npc,
  and npcs have no pose hook in the story yet (only `k.pose` on the kiss), so his actions on Wednesday night, Friday,
  Sunday and Monday need the npc side wired too.
- Scenes in the Sea's water (the cell, the vault, Cave 6's chamber): `js/story/water.js` masks each figure by its
  sprite frame, so action sprites work there without extra art.

## Alan: the poses the game already calls (all vest unless marked)

| Pose | Times | Where (file:line) and what he does | Have it? |
|---|---|---|---|
| **pickup** | 10 | Wed 404: unlacing Vasco's boots (wed.js:508). Wed belfry: taking the founders' letter from the drawer (wed.js:344). Sat 404: touching the wet footprint, the salt (sat.js:142). Sun 404: packing his shirts (sun.js:30). Sun vault: the five discs from the crates (sun.js:441). Mon: the fuse from Yeray (mon.js:95); each disc into its socket, in the water (mon.js:189, every disc); the crescent from Baute's hand above (mon.js:263); the cold water (mon.js:292); Carmen's keys, caught (mon.js:472) | No. Needs a crouch-and-take, and a **reach up** variant for the crescent; ideally a **set into the floor** in water for the discs |
| **reach** | 9 | Wed belfry: his hand on the bronze, it hums (wed.js:322). Thu Baute's office: up to the map on its pins (thu.js:267). Sun 404: Vasco's watch from the bedside (sun.js:32). Sun Gando: his ticket back out of the clerk's hand (sun.js:98). Sun Carmen's flat: a hand on Carmen (sun.js:192). Sun vault: forehead to Vasco's, holding him (sun.js:430). Sun rock: the watch held out / holding on (sun.js:472, 483). Mon: Lorenzo's trowel (mon.js:432) | No. At least two: **reach forward** (hand out, take/give) and **reach up** (map, bell). The vault and rock ones are really an **embrace** (see two-person) |
| **pull** | 4 | Wed belfry: winding the clock drum, twenty minutes (wed.js:305, 307). Sun vault: heaving the grille with Yeray (sun.js:409), then with Carmen on the handle (sun.js:420) | `alanv_pull` exists (off). The grille wants a **heave on a bar**, two-handed, low |
| **read** | 3 | Wed Santa Ana square: the letter, sitting by the bronze dogs (wed.js:184, he "sits down": a **sit and read**). Wed museum: the crate labels (wed.js:454). Thu Baute's office: the Montesdeoca file in the drawer (thu.js:263) | No. Standing read; a seated one for the letter |
| **write** | 2 | Wed belfry: the pencil rubbing of the inscription (wed.js:329, really a **rub against the bell**). Sun 404: the note for Vasco's pigeonhole (sun.js:35) | `alanv_write` exists (off) |
| **phone** | 2 | Every call from the phone box, Tuesday to Saturday (core.js:300, the most seen action in the game). Sun: the hotel phone, put down on Nieves (sun.js:241) | `alanv_phone` exists (off); a blazer version for Tuesday evening's call |
| **drink** | 3 | Wed 404: the terrible coffee (wed.js:86). Fri Rafa's bar: the rum, and each "another" (fri.js:265, 284) | `alanv_drink` exists (off); the bar one ideally **seated at the bar** |
| **stretch** | 1 | Wed 404: getting up in the morning (wed.js:85) | No |

## Vasco: the poses the game already calls (his chapter, as the player; day outfit)

| Pose | Times | Where and what he does | Have it? |
|---|---|---|---|
| **kneel** | 7 | The camp radio: kneels, opens the case, the fuse gone (vasco.js:141); the foil into it (vasco.js:155). Cave 6 chamber: the sun disc lifted one socket along and back (vasco.js:487, 494); Elena's sheet spread on the floor, working her numbers (vasco.js:509). The cell: Lorenzo's trowel, scratching the mark by the grille (vasco.js:706); praying in the dark (vasco.js:743) | No (old Vasco only). A **kneel and work low**; a **kneel, hands folded** for the prayer |
| **hand** | 3 | Cave 6: chalking the signs on the wall (vasco.js:442, 445); the torch held flat to the wall (vasco.js:457) | No. **Hand on the wall, chalk / torch** |
| **sit** | 3 | The rock with Baute: the coffee (vasco.js:539); the drug taking hold (vasco.js:569); hurt, slumped (vasco.js:577) | No. **Sitting on the rock**, and a **slumped** variant |
| **trowel** | 1 | The cell: digging out the anchors at the grille's foot (vasco.js:726), clicked repeatedly | No. **Kneel and dig** |
| **coffee / sip** | 2 | The camp: Yeray's coffee (vasco.js:94); with Baute (vasco.js:541) | No |
| **find** | 1 | The finds table: Elena's charts (vasco.js:120) | No |
| **laugh** | 1 | Cave 6: he gets Elena's numbers and laughs (vasco.js:512) | No |
| **worried** | 2 | The camp radio (vasco.js:142); thinking of Alan (vasco.js:520) | No (an expression, could be a face state instead of a sprite) |

## Actions the story has with no pose call (needed for the scene to read)

**Two-person** (Ludo from both standing sprites, as the airport kiss):
- Tue museum party: Vasco takes Alan's hand and walks him across the room to Baute (tue.js:734): **walking hand in hand**.
- Tue night 404: Vasco on the bed in a towel; Alan comes to him (the love scene is a still, but the approach isn't).
- Fri morning: the fight; Vasco turns round on the bed (fri.js:35, 51, a facing flip only), **dresses for the field**
  and goes (fri.js:62).
- Fri night: Rafa takes Alan's hand to the stairs (fri.js:318; Rafa's, but Alan is in it).
- Sun vault: Alan pulls Vasco out under the grille (sun.js:417); **forehead to forehead** (sun.js:430).
- Sun rock: Vasco puts the watch on with cold fingers (sun.js:474), holds on (sun.js:483): **an embrace**.
- Mon: the chain of hands is a still (`still_chain`); the confession at the cave mouth: no gesture.

**Alan alone:**
- Mon: **down the rope ladder** into the chamber (mon.js:107, a fade covers it now): `alanv_climb` exists (off).
- Mon: **in the water**: each disc set into its socket, crouched (mon.js:189); aiming (`S.aim`, the column moves, he
  holds still); **reaching up** for the crescent (mon.js:263); a surge hitting him (the water rises, he doesn't react);
  drowning (mon.js:228: the water goes over a standing sprite).
- Tue beach: lying on the towel (covered by `still_nap`); dressing again "very carefully" with the burn (tue.js:391,
  a sound only): a **wincing** sprite would carry the joke.
- Sun 404: sits down with Elena's notebook (sun.js:251): **sit and read**.
- Sat 404: at the window, thinking (sat.js:19): a **lean on the sill** or from behind.
- Thu dinner: Alan and Vasco seated at the table (the blazer outfits): check whether they stand through it.

**Vasco as an npc** (needs the npc pose hook as well as art):
- Wed night: falls across the bed in his boots (wed.js:505): **lying on the bed, dusty**.
- Mon: at the rim of the floor opening, **kneeling, leaning over** with the torch, reading down to Alan (mon.js:128;
  he's there for the whole finale), and reaching down to Alan's wrist for the chain.
- Sun vault: behind the bars in the rising water (standing now): **hands on the bars**.

## Suggested order (most seen first)

1. Alan **phone** (every day), **pickup**, **reach forward**, **reach up**: vest. Three of these exist as Ludo runs
   (phone; pull/write/drink/climb too): look at them again before making anything new.
2. Vasco **kneel**, **hand on the wall**, **sit on the rock**, **dig**: day outfit; his chapter is all action.
3. Monday in the water: Alan **set a disc**, **reach up**, **climb down**; Vasco **kneeling at the rim** (npc).
4. Two-person: **hand in hand** (Tuesday), **the embrace** (Sunday's rock and the vault).
5. The rest: read, seated read, drink at the bar, stretch, the wince, Vasco on the bed, dressing.

Blazer versions only where the scene is in the blazer: Tuesday evening (phone, hand in hand), Thursday's dinner and
break-in (read, reach up for the map, pickup).
