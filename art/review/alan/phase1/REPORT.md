# Alan animation — Phase 1 report

Review only: nothing in this folder is used by the game, and `js/sprites.js` is unchanged.
Files here: `alan_walk_idle_before_after.gif`, `state_map.png` (+ `.svg`), `alignment.json` (the proposed new values), this report.

## 1. Gemini setup and test
- Model `gemini-nano-banana-2.1` (Google's current recommendation for edits with reference images), SDK `google-genai` 2.31.0.
- `scripts/gen_image.py` applies the seven rules on every call: it starts from an existing image, sends the style refs and the fixed style text, keys the background out, cleans the halo, locks the palette to the reference, frames to the reference's height and feet anchor, saves a side-by-side and logs to `art/review/log.md`.
- Style refs (`art/style_refs/`): alan_side, alan_front, pair_cop_belt.
- Test: alan_side turned to face left. Cost **$0.075**. You approved it. The halo clean-up was added after the test and re-applied to it.

## 2. Alignment (proposal, applied only after your OK)
`scripts/align_alan.py` measures every solo frame and writes `alignment.json`; `--apply` writes it into `js/sprites.js`.
- **Height:** the engine scales a frame by `height / h`. Standing frames were drawn between 702 and 743 px (alan_side = 720), so turning to the front made him 3% taller. After: every standing frame is 720.
- **Walk bob:** the walk frames dipped by up to 5.6% (walkDown 680). After: a natural 2.5% bob (contact 709, down 702, passing 718, up 713).
- **Anchor:** standing frames anchor between the two boots; walk frames anchor at the hips, so the body glides while the feet alternate. Frame-to-frame anchor shifts before alignment were up to 130 sprite px (reach, swoon, coffees).
- **Kept as they are:** 14 frames tied to a prop or partner: asleep (stool), pickup (crouch), jump, swim ×3, wash ×2, pull, untie, wring, ring (bell), throw ×2. Four arms-up frames (stretch, fling, undress2, dress3) get the new anchor, but their scale needs a head-based measure. That's flagged for Phase 2.
- **Vertical:** every frame's feet line already sits on the soles (within 1–4 px). No change needed.
- **Code that depends on anchors, to re-check after `--apply`:** the Ch. V lantern-light offsets for alan_lantern/lwalk1/lwalk2 (`js/story/ch5.js:21`), and scene placements that put Alan next to someone (`p.x = cop.x + 52`, etc.). Smoke and mouth points are in sprite pixels and follow automatically.

## 3. Flagged mismatches (not fixed)
1. **Two colour families.** *Family A* (darker jeans, browner leather): side, idle2, talk, walk cycle, smoke, read, write, reach, drink, phone, cutpalm, pickup, asleep, ring, throw, wobble, wring. *Family B* (jeans ~20% lighter, warmer red leather): front, back, front/back walks, flirt, wink, fluster, swoon, button, coffees, enchanted, rapt, lantern set, yawn, undress1, dress4. Measured on the jeans: Lab L 62–74 vs 86–93; on the leather: a\* 138–141 vs 144–146. It shows every time he turns from side to front, starts a flirt, or the fado begins.
2. **Walk cycle:** walkDown, walkUp and pass have darker jeans (L 57–62) than walkA/B (67). That's a slight flicker every step.
3. **Close-ups** (swim, swim2, swim_wave, wash1, wash2): a bodybuilder physique and smoother airbrushed rendering. In swim2 the face is noticeably different.
4. **Body type:** dress2, undress3 and jump are far more muscular than the clothed frames. The towel set (jacket, grin, wink, fling) sits between the two.
5. **pickup:** the head and hands are painted larger than the rest of him (proportion).
6. **Arms-up frames** (stretch, fling, undress2, dress3): their height can't be read from the outline. Check them by eye after alignment.
7. **Missing frames the code already asks for** (the game skips them): undress1b, undress_boot, undress_belt, hands, run_back, climb, drip, trunks_snap, dress_boot, dress_final, wash3, plus pair_vasco_shelf and pair_vasco_tie.
8. **Unused frames:** asleep, dress1, dress3, untie.

## 4. State map
See `state_map.png`. The neutral hub is IDLE (side). Every big change of pose passes through it or through a transition.
In-between frames needed (solo), about 40 in total:
| transition | in-betweens |
|---|---|
| idle ↔ walk (start / stop step) | 2 |
| side ↔ front / ¾ views (turn) | 1, shared by front, yawn, flirt gag, fado |
| front ↔ back | via ¾ and side |
| idle ↔ smoke (hand to pocket / flick away) | 2 |
| yawn → stretch (arms rising), stretch → idle (arms down) | 3 |
| idle ↔ hold object (read, write, phone, drink, cutpalm) | 1 each = 5 |
| idle ↔ reach | 1 |
| idle ↔ crouch / pick up | 4 |
| idle ↔ sit | 3 + one awake seated frame |
| idle ↔ actions (throw wind-up, ring, pull, wobble) | 1 each = 4 |
| idle ↔ lantern set (take lantern) | 1 |
| carrying coffees | a 4-frame carry walk |
| undress chain | jacket off 1 + one between each step = 4 |
| dress4 → idle (jacket on) | 1 |
Close-ups (swim, wash, jump) are camera cuts and need no in-betweens.

### Shared scenes (sequence, and transitions that need in-betweens)
| scene | frames in order | needs in-betweens |
|---|---|---|
| Police station (Teixeira) | idle → cop_chest / cop_arm → idle | approach-and-touch 1 each way |
| Bedroom visit: Teixeira | shelf → jacket → neck → tshirt → buttons → shelf2 → belt → belt2 → trousers → cuffs | shelf→jacket, neck→tshirt, belt2→trousers: 1 each |
| Tavern (Duarte) | idle → guitar_lesson → idle | sit beside him 1 |
| Bedroom visit: Duarte | j0 → j1 → j2 → jackets → u1 → u2 → shirtfly → s1 → s2 → undress2 → d1 → d2 → h1 → h2 → hop → l1 → l2 → lasso → p1 → underwear | jackets→u1, s2→undress2, h2→hop, l1→l2 (leap): 1 each |
| Sé (Vasco) | coffee, card, fragment, lanyard, thumb, catch, clapper, kiss, kneel, ladder, shirtless | stand↔kneel 2, stand↔ladder sit 2, catch (lunge) 1 |
| Ch. IV (Zé) | unbutton → kiss → brow | approach 1 |
| Laundry (Celeste) | alan_wring + wring_1 → 2 → 3 | none (tug loop) |

## 5. Inventory (118 frames: 68 solo, 50 shared)
Anchor and size are the current values. "Anchor shift" is in sprite pixels.

| file | what it shows | scene | size (px) | anchor ax, fy | height drawn now → after | anchor shift |
|---|---|---|---|---|---|---|
| `alan_asleep` | asleep on the stool, head on arms | not used yet | 327×590 | 212.4, 585.9 | 583 → 583 | kept (tied to prop) |
| `alan_back` | standing, from behind | everywhere (base set) | 249×742 | 125.1, 738.4 | 735 → 720 | -2 px |
| `alan_back_walk1` | walking away, step 1 | everywhere (base set) | 252×742 | 128.7, 738.4 | 735 → 713 | +2 px |
| `alan_back_walk2` | walking away, step 2 | everywhere (base set) | 254×714 | 129.5, 710.3 | 707 → 713 | -29 px |
| `alan_button` | unbuttoning his shirt, ¾ view | Ch. IV, opening, transitions | 246×749 | 104.9, 745.6 | 742 → 720 | +24 px |
| `alan_coffees` | holding two coffees, front | Sé | 246×716 | 122.0, 712.8 | 709 → 720 | -2 px |
| `alan_cutpalm` | knife to his palm | Ch. V | 250×726 | 116.2, 722.0 | 719 → 720 | -12 px |
| `alan_dress1` | in trunks, jeans and jacket in hand | not used yet | 371×738 | 166.3, 734.3 | 731 → 720 | +11 px |
| `alan_dress2` | hopping into his jeans | Ch. II | 298×740 | 146.6, 736.9 | 733 → 720 | +20 px |
| `alan_dress3` | pulling the T-shirt on | not used yet | 306×756 | 211.3, 752.2 | 748 → 748 | -34 px |
| `alan_dress4` | shrugging the jacket on | Ch. II | 296×750 | 206.5, 746.6 | 743 → 720 | -60 px |
| `alan_drink` | raising a glass | Ch. I | 275×728 | 154.3, 724.6 | 721 → 720 | -26 px |
| `alan_enchanted1` | hand on heart, listening | fado | 230×727 | 93.6, 723.6 | 720 → 720 | +26 px |
| `alan_enchanted2` | hand to cheek, listening | fado | 271×727 | 124.6, 723.6 | 720 → 720 | +31 px |
| `alan_fling` | towel round the waist, arm flung up | Ch. II | 320×715 | 169.2, 711.8 | 708 → 708 | +12 px |
| `alan_flirt` | flirting, hand out, ¾ | Ch. I | 389×747 | 179.6, 743.5 | 740 → 720 | -10 px |
| `alan_fluster` | flustered, hand behind head | Ch. I, Ch. II, Sé, bedroom visits | 349×745 | 145.1, 741.5 | 738 → 720 | +28 px |
| `alan_front` | standing, front view | everywhere (base set) | 261×749 | 119.7, 745.1 | 742 → 720 | +22 px |
| `alan_front_walk1` | walking toward camera, step 1 | everywhere (base set) | 258×748 | 122.8, 744.6 | 741 → 713 | +6 px |
| `alan_front_walk2` | walking toward camera, step 2 | everywhere (base set) | 254×750 | 121.0, 746.1 | 743 → 713 | +20 px |
| `alan_idle2` | standing, side, weight shift | everywhere (base set) | 165×732 | 90.1, 728.7 | 725 → 720 | -6 px |
| `alan_jacket` | towel (jacket) round the waist, barefoot | Ch. II, Ch. IV, bedroom visits | 217×717 | 103.9, 713.3 | 710 → 720 | +7 px |
| `alan_jacket_grin` | towel round the waist, grinning | Ch. II | 209×725 | 122.3, 721.5 | 718 → 720 | -16 px |
| `alan_jacket_wink` | towel round the waist, winking | Ch. II | 238×724 | 116.4, 720.5 | 717 → 720 | -3 px |
| `alan_jump` | leaping, towel in hand | Ch. I, Ch. II | 309×573 | 179.9, 569.0 | 566 → 566 | kept (tied to prop) |
| `alan_lantern` | standing with a lantern | Inês scenes, Sé | 256×743 | 114.1, 738.9 | 736 → 720 | -4 px |
| `alan_lwalk1` | walking with a lantern, step 1 | Ch. V (cistern, with the lantern) | 366×715 | 189.1, 711.3 | 708 → 709 | +29 px |
| `alan_lwalk2` | walking with a lantern, step 2 | Ch. V (cistern, with the lantern) | 370×675 | 185.0, 671.4 | 668 → 702 | +28 px |
| `alan_pass` | walk: passing pose | everywhere (base set) | 189×715 | 99.3, 711.3 | 708 → 718 | +5 px |
| `alan_phone` | on the phone | Ch. I, Ch. IV, bedroom visits | 218×735 | 104.4, 731.3 | 728 → 720 | +8 px |
| `alan_pickup` | crouching, picking something up | Ch. I | 359×452 | 279.1, 448.8 | 445 → 445 | kept (tied to prop) |
| `alan_pull` | hauling a rope | Ch. IV | 361×626 | 213.6, 622.8 | 618 → 618 | kept (tied to prop) |
| `alan_rapt1` | enraptured (fado), hand on chest | fado | 216×727 | 112.6, 723.6 | 720 → 720 | -4 px |
| `alan_rapt2` | enraptured, eyes closed | fado | 207×729 | 103.6, 725.6 | 721 → 720 | -5 px |
| `alan_rapt3` | enraptured, hand at collar | fado | 238×729 | 116.7, 725.1 | 721 → 720 | +11 px |
| `alan_reach` | reaching out, leaning forward | Ch. I, Ch. II, Ch. III, Ch. IV, Ch. V, Sé | 349×713 | 182.2, 709.8 | 706 → 720 | -83 px |
| `alan_read` | reading a book | Ch. I, Ch. III, Ch. IV, Ch. V, Inês scenes | 256×734 | 112.1, 730.2 | 727 → 720 | -26 px |
| `alan_ring` | swinging a hammer at the bell | Ch. IV, Ch. V | 395×727 | 193.2, 723.6 | 720 → 720 | kept (tied to prop) |
| `alan_side` | standing, side view (BASE) | everywhere (base set) | 171×727 | 87.5, 723.1 | 720 → 720 | -6 px |
| `alan_smoke_exhale` | smoking: exhale | idle cigarette (any non-church room, after 20 s idle) | 187×723 | 93.2, 719.0 | 716 → 720 | -6 px |
| `alan_smoke_hold` | smoking: holding | idle cigarette (any non-church room, after 20 s idle) | 176×720 | 91.4, 716.4 | 713 → 720 | -7 px |
| `alan_smoke_inhale` | smoking: inhale | idle cigarette (any non-church room, after 20 s idle) | 188×720 | 87.0, 716.4 | 713 → 720 | -7 px |
| `alan_smoke_light` | smoking: lighting up | idle cigarette (any non-church room, after 20 s idle) | 186×724 | 87.1, 720.5 | 717 → 720 | -6 px |
| `alan_stretch` | stretching, arms up | opening | 204×834 | 96.7, 832.5 | 824 → 824 | -8 px |
| `alan_swim` | swimming, close-up | Ch. II | 696×337 | 343.6, 333.6 | 198 → 198 | kept (tied to prop) |
| `alan_swim2` | swimming, cheeks puffed, close-up | Ch. II | 505×303 | 249.2, 299.4 | 178 → 178 | kept (tied to prop) |
| `alan_swim_wave` | waving from the water, close-up | Ch. II | 627×456 | 322.9, 452.4 | 269 → 269 | kept (tied to prop) |
| `alan_swoon` | swooning, hand to brow | Ch. I, bedroom visits | 293×750 | 143.8, 746.6 | 743 → 720 | +19 px |
| `alan_talk` | talking, open hand | everywhere (base set) | 249×728 | 82.1, 724.6 | 721 → 720 | +2 px |
| `alan_talk2` | talking, palm out | everywhere (base set) | 259×730 | 96.2, 726.1 | 723 → 720 | -1 px |
| `alan_throw1` | throwing: wind-up | Sé | 369×724 | 266.9, 720.0 | 717 → 717 | kept (tied to prop) |
| `alan_throw2` | throwing: release | Sé | 338×716 | 143.0, 712.3 | 709 → 709 | kept (tied to prop) |
| `alan_undress1` | jacket sliding off | Ch. II, Ch. IV | 276×741 | 131.5, 737.9 | 733 → 720 | +1 px |
| `alan_undress2` | T-shirt over his head | Ch. II, Ch. IV, bedroom visits | 225×749 | 94.7, 745.6 | 742 → 742 | +14 px |
| `alan_undress3` | jeans off, hopping | Ch. II | 242×714 | 112.3, 710.3 | 702 → 720 | -11 px |
| `alan_undress4` | in trunks, clothes in hand | Ch. II, Ch. IV | 290×713 | 112.8, 709.8 | 701 → 720 | +37 px |
| `alan_untie` | hauling a rope (alt., unused) | not used yet | 493×644 | 245.4, 640.7 | 637 → 637 | kept (tied to prop) |
| `alan_walkA` | walk: contact (right foot) | everywhere (base set) | 357×702 | 172.2, 698.0 | 695 → 709 | +13 px |
| `alan_walkB` | walk: contact (left foot) | everywhere (base set) | 358×711 | 168.6, 707.7 | 704 → 709 | +16 px |
| `alan_walkDown` | walk: down | everywhere (base set) | 356×687 | 194.7, 683.7 | 680 → 702 | -37 px |
| `alan_walkUp` | walk: up | everywhere (base set) | 295×692 | 146.9, 688.3 | 685 → 713 | -21 px |
| `alan_wash1` | washing face, close-up | Ch. II | 211×296 | 107.5, 292.2 | 289 → 289 | kept (tied to prop) |
| `alan_wash2` | drying face, close-up | Ch. II | 201×288 | 88.3, 284.0 | 281 → 281 | kept (tied to prop) |
| `alan_wink` | winking, hand on hip | Ch. I, Ch. II, bedroom visits | 306×744 | 185.0, 740.5 | 737 → 720 | -26 px |
| `alan_wobble` | losing balance | Ch. IV, Sé | 493×721 | 209.8, 716.9 | 714 → 720 | +55 px |
| `alan_wring` | wringing a sheet (with Celeste) | Ch. II | 467×649 | 71.4, 645.8 | 642 → 642 | kept (tied to prop) |
| `alan_write` | writing in the notebook | Ch. I, Ch. II, Ch. III, Inês scenes, bedroom visits | 238×726 | 105.7, 722.6 | 719 → 720 | -26 px |
| `alan_yawn` | yawning, hand to mouth | opening | 243×719 | 131.3, 713.0 | 708 → 720 | -12 px |
| `pair_brow` | Zé wipes Alan’s brow | Ch. IV: Zé | 312×729 | 156.0, 724.2 | 720 (shared, unchanged) | — |
| `pair_cop_arm` | Teixeira on Alan’s arm (station) | Ch. I police station | 390×726 | 180.0, 722.9 | 719 (shared, unchanged) | — |
| `pair_cop_belt` | Alan undoes Teixeira’s belt | Bedroom visit: Teixeira | 465×727 | 211.2, 723.0 | 720 (shared, unchanged) | — |
| `pair_cop_belt2` | Teixeira’s belt off, trousers down | Bedroom visit: Teixeira | 489×727 | 238.2, 723.1 | 720 (shared, unchanged) | — |
| `pair_cop_buttons` | Alan unbuttons Teixeira | Bedroom visit: Teixeira | 398×727 | 194.4, 723.0 | 720 (shared, unchanged) | — |
| `pair_cop_chest` | Alan’s hand on Teixeira’s chest (station) | Ch. I police station | 391×726 | 174.2, 723.0 | 719 (shared, unchanged) | — |
| `pair_cop_cuffs` | both in shorts, the handcuffs | Bedroom visit: Teixeira | 504×727 | 227.8, 723.1 | 719 (shared, unchanged) | — |
| `pair_cop_jacket` | Teixeira’s jacket off, Alan in tee | Bedroom visit: Teixeira | 400×727 | 144.4, 723.0 | 720 (shared, unchanged) | — |
| `pair_cop_neck` | Alan kisses Teixeira’s neck | Bedroom visit: Teixeira | 334×727 | 137.3, 723.0 | 720 (shared, unchanged) | — |
| `pair_cop_shelf` | pressed against the shelf | Bedroom visit: Teixeira | 356×727 | 133.7, 723.0 | 720 (shared, unchanged) | — |
| `pair_cop_shelf2` | shirtless Teixeira against the shelf, Alan shirtless | Bedroom visit: Teixeira | 516×727 | 230.9, 723.1 | 720 (shared, unchanged) | — |
| `pair_cop_trousers` | Teixeira in boxers, Alan stepping out of jeans | Bedroom visit: Teixeira | 468×727 | 221.7, 723.2 | 720 (shared, unchanged) | — |
| `pair_cop_tshirt` | Alan pulls his T-shirt off | Bedroom visit: Teixeira | 564×727 | 237.2, 723.4 | 720 (shared, unchanged) | — |
| `pair_guitar_d1` | Duarte and Alan undoing trousers | Bedroom visit: Duarte | 533×728 | 284.4, 723.6 | 719 (shared, unchanged) | — |
| `pair_guitar_d2` | trousers down, both | Bedroom visit: Duarte | 526×728 | 289.7, 723.6 | 719 (shared, unchanged) | — |
| `pair_guitar_h1` | both hopping out of trousers | Bedroom visit: Duarte | 638×728 | 319.2, 723.9 | 719 (shared, unchanged) | — |
| `pair_guitar_h2` | trunks, clothes on the floor | Bedroom visit: Duarte | 509×727 | 340.5, 723.4 | 718 (shared, unchanged) | — |
| `pair_guitar_hop` | hopping on one leg, both | Bedroom visit: Duarte | 519×727 | 256.4, 723.4 | 719 (shared, unchanged) | — |
| `pair_guitar_j0` | Duarte grabs Alan’s jacket | Bedroom visit: Duarte | 423×727 | 190.8, 723.2 | 720 (shared, unchanged) | — |
| `pair_guitar_j1` | Duarte pulls Alan’s jacket off | Bedroom visit: Duarte | 492×727 | 239.6, 723.2 | 720 (shared, unchanged) | — |
| `pair_guitar_j2` | Duarte tugs Alan’s T-shirt up | Bedroom visit: Duarte | 546×727 | 270.7, 723.2 | 720 (shared, unchanged) | — |
| `pair_guitar_jackets` | jackets coming off together | Bedroom visit: Duarte | 446×727 | 224.7, 723.0 | 720 (shared, unchanged) | — |
| `pair_guitar_l1` | Duarte lunges, Alan dodges | Bedroom visit: Duarte | 589×728 | 520.4, 723.7 | 719 (shared, unchanged) | — |
| `pair_guitar_l2` | Alan jumps on Duarte’s back | Bedroom visit: Duarte | 341×727 | 126.7, 723.3 | 720 (shared, unchanged) | — |
| `pair_guitar_lasso` | Alan lassoes with his jeans | Bedroom visit: Duarte | 483×727 | 295.5, 723.2 | 720 (shared, unchanged) | — |
| `pair_guitar_lesson` | the guitar lesson (tavern) | Ch. I tavern | 377×726 | 205.3, 723.0 | 719 (shared, unchanged) | — |
| `pair_guitar_p1` | piggyback | Bedroom visit: Duarte | 380×726 | 278.9, 722.9 | 719 (shared, unchanged) | — |
| `pair_guitar_s1` | both shirtless, belts in hand | Bedroom visit: Duarte | 558×727 | 255.4, 723.3 | 720 (shared, unchanged) | — |
| `pair_guitar_s2` | Duarte cracks his belt | Bedroom visit: Duarte | 606×728 | 174.4, 723.6 | 719 (shared, unchanged) | — |
| `pair_guitar_shirtfly` | Duarte flings his shirt | Bedroom visit: Duarte | 459×726 | 129.5, 723.0 | 719 (shared, unchanged) | — |
| `pair_guitar_u1` | Duarte’s shirt off | Bedroom visit: Duarte | 499×727 | 290.0, 723.4 | 719 (shared, unchanged) | — |
| `pair_guitar_u2` | Duarte peels his sleeve | Bedroom visit: Duarte | 504×727 | 245.6, 723.2 | 720 (shared, unchanged) | — |
| `pair_guitar_underwear` | piggyback in trunks | Bedroom visit: Duarte | 511×727 | 333.4, 723.0 | 720 (shared, unchanged) | — |
| `pair_guitar_undress2` | belt whip, both shirtless | Bedroom visit: Duarte | 590×727 | 279.4, 723.5 | 718 (shared, unchanged) | — |
| `pair_kiss` | Zé and Alan kiss | Ch. IV: Zé | 340×729 | 170.0, 724.1 | 720 (shared, unchanged) | — |
| `pair_unbutton` | Zé unbuttons Alan’s jacket | Ch. IV: Zé | 332×727 | 186.5, 723.6 | 719 (shared, unchanged) | — |
| `pair_vasco_card` | Vasco hands Alan a card | Sé: museum, store room, cloister | 461×715 | 230.5, 711.8 | 708 (shared, unchanged) | — |
| `pair_vasco_catch` | Alan catches Vasco | Sé: museum, store room, cloister | 442×715 | 221.0, 711.8 | 708 (shared, unchanged) | — |
| `pair_vasco_clapper` | heads together over the clapper | Sé: museum, store room, cloister | 340×728 | 170.0, 724.1 | 716 (shared, unchanged) | — |
| `pair_vasco_coffee` | Alan brings Vasco coffee | Sé: museum, store room, cloister | 535×715 | 267.5, 711.8 | 708 (shared, unchanged) | — |
| `pair_vasco_fragment` | Alan shows Vasco a fragment | Sé: museum, store room, cloister | 489×715 | 244.5, 711.8 | 708 (shared, unchanged) | — |
| `pair_vasco_kiss` | Vasco and Alan kiss | Sé: museum, store room, cloister | 317×716 | 158.5, 712.8 | 709 (shared, unchanged) | — |
| `pair_vasco_kneel` | kneeling together | Sé: museum, store room, cloister | 424×511 | 212.0, 507.6 | 504 (shared, unchanged) | — |
| `pair_vasco_ladder` | sitting together on the ladder | Sé: museum, store room, cloister | 395×582 | 197.5, 578.8 | 575 (shared, unchanged) | — |
| `pair_vasco_lanyard` | Vasco tugs Alan’s lanyard | Sé: museum, store room, cloister | 369×715 | 184.5, 711.8 | 708 (shared, unchanged) | — |
| `pair_vasco_shirtless` | both shirtless | Sé: museum, store room, cloister | 440×716 | 220.0, 712.3 | 709 (shared, unchanged) | — |
| `pair_vasco_thumb` | Vasco’s thumb on Alan’s lip | Sé: museum, store room, cloister | 427×716 | 213.5, 712.3 | 709 (shared, unchanged) | — |
| `pair_wring_1` | wringing the sheet with Celeste | Ch. II laundry: Celeste | 908×728 | 483.0, 724.6 | 720 (shared, unchanged) | — |
| `pair_wring_2` | twisting the sheet | Ch. II laundry: Celeste | 936×727 | 483.5, 723.0 | 719 (shared, unchanged) | — |
| `pair_wring_3` | sheet wrung, dripping | Ch. II laundry: Celeste | 905×705 | 479.0, 701.0 | 697 (shared, unchanged) | — |
