# Cut-out audit of every sprite

Script: `scripts/cutout_audit.py` (audit / fix / report). Full data: `art/review/cutout/report.json`. Cleaned candidates: `art/review/cutout/sprites/<name>.webp` (lossless WebP, same canvas, same pixel placement: nothing cropped, padded, shifted or scaled; anchors in js/sprites.js stay valid). Before/after sheets: `art/review/cutout/before_after/<name>.png` (checker, mid grey and dark, zoomed on the densest changes, plus the whole sprite). Per-sprite settings used: `fixes.json`; per-sprite change logs: `logs/`. Detector crops of the originals: `crops/` (git-ignored, regenerate with `audit --crops`).

**Nothing in the game has changed.** art/sprites, the review sets and js/ are untouched; these files need the user's approval before anything is promoted.

## Totals

- Sprites checked: **731** (sprite 499, bath_new 61, duarte_new 16, candidate 155): art/sprites (499), the bath_new (61) and duarte_new (16) sets loadApproved() always loads, and the 155 approved review candidates. Plus the 2,198 face patches in art/faces, checked for key colour only: none found.
- Sprites with a visible leftover in the original (by the detector, then checked by eye on contact sheets): **424**. By type (sprites): halo 330, key 14, haze 122, hole 53, speck 85, border 11.
- 'hole' detector hits on the originals were mostly paint (grey hair, white shirts, aprons); the real trapped backdrop found by eye: white/grey pockets between arm and body, inside chair rails, through the menders' nets, between fingers and coat; these were cleared in 14 sprites (hand-checked boxes) and 50 sprites (flat pure-white pockets) and 42 sprites (white corners left at pocket edges).
- Cleaned files written: **716**. Most carry only invisible-to-subtle fixes (trace key hue in near-transparent edge pixels: 422 sprites; faint haze: 633; tiny detached specks: 665); the pale rim was unmixed in 694.
- No change needed (already clean by every test): 15: alan_undress4, npc_phone_door1, npc_phone_door_talk, alan_bn_boxers, alan_bn_climb, alan_bn_pants_on_v1, alan_bn_reach, alan_bn_sit, alan_bn_x_crouch, alan_bn_x_hands_down, alan_bn_x_raise, alan_bn_x_swing, alan_bn_x_tee_toss, alan_bn_y_button, alan_bn_y_jeans_up.
- Total changed pixels across all cleaned files: 1,425,341; of these, deep inside the figure (alpha 255 and 4+ px from any edge, outside hand-set hole boxes): 11,251, all in the white-pocket clears (nets, chair gaps, arm gaps) checked by eye.

## How it cleans (alpha and edge colour only, never repaints)

- Pale rim: edge pixels lighter and greyer than the paint just inside, reachable from transparency without crossing the ink outline, are un-mixed: alpha takes the paint's share, colour takes the paint's colour (anti-aliasing kept). Pale paint (white shirts, grey hair, aprons, wide pale bands) is protected; so are Amália's shawl fringe, Tomás's broom straw and hand-set boxes (knife blades, wine glasses).
- Key colour: green/magenta-tinted pixels take the colour of the paint next to them; alpha unchanged.
- Haze: alpha 1-63 pixels more than 3 px from solid paint cleared (wet frames: only up to 6 px out, so drips, spray and water stay).
- Specks: detached bits under alpha 128 or 12 px cleared; in wet frames only matte dust and dark bits (pale drops stay).
- Trapped backdrop: flat pure-white pockets ringed by paint; hand-checked boxes (`holes` in fixes.json) flood-filled.

## Flagged but left alone

- Cut at the canvas edge (paint on the outermost pixel row/column, the figure was cropped when it was cut out; fixing needs a re-cut, not cleanup): alan_undress4, alan_untie, alan_wash1, alan_wring, celeste_wring1, celeste_wring2, cop_bed3, cop_bed4, pair_guitar_undress2, alan_walk7_s1, alan_walk7_s2.
- Props and effects kept as painted: drops and spray (bath frames, washers, wring), steam, smoke, the menders' net, Pessoa's newspaper, broom straw, the shawl fringe, lantern glass, knife and glass highlights. Detached big pieces ("island": the second figure in a pair, a flung shirt, a dropped basket) are props.
- Remaining detector flags after cleaning (re-audit in `report.json` → `after`): halo 312 findings in 117 sprites, mostly the protected pale paint above (fringe, straw, pale skin); hole 195 (paint: grey hair, shirts); speck 101 (drops in wet frames); haze 29 (water). Notes per sprite in report.json → `note`.
- npc_tourists / npc_tourists_b: a faint pale rim stays along bare legs (pale skin is protected); unsure, worth a look.

## Per-sprite fixes

Columns: what was done (pixel counts), changed pixels, of which deep inside. `halo` = rim pixels un-mixed; `key` = tinted pixels recoloured; `haze`/`speck` = pixels cleared; `hole`/`white_pocket`/`corner` = trapped backdrop cleared.

| sprite | fixes | changed px | deep |
|---|---|---|---|
| abilio | white_pocket 156, key 4, halo 3741, haze 56, speck 862 | 4481 | 228 |
| abilio_idle2 | halo 2472, haze 11, speck 792 | 3130 | 0 |
| abilio_point | white_pocket 194, key 2, halo 2910, haze 7, speck 994 | 3857 | 230 |
| abilio_read | halo 2587, haze 13, speck 893 | 3299 | 0 |
| abilio_shout1 | halo 2807, haze 24, speck 907 | 3489 | 0 |
| abilio_shout2 | white_pocket 257, key 4, halo 3275, haze 10, speck 961 | 4253 | 268 |
| alan_asleep | hole 255, white_pocket 170, key 22, halo 1036, haze 200, speck 41, corner 2 | 1716 | 212 |
| alan_back | key 11, halo 528, haze 107, speck 28 | 674 | 0 |
| alan_back_walk1 | key 3, halo 167, haze 5, speck 7 | 182 | 0 |
| alan_back_walk2 | key 4, halo 149, haze 30, speck 26 | 207 | 0 |
| alan_bn_belt | halo 47 | 47 | 0 |
| alan_bn_cannonball | halo 8 | 8 | 0 |
| alan_bn_dressed | halo 87 | 86 | 0 |
| alan_bn_fling | speck 89 | 89 | 0 |
| alan_bn_hair | halo 2 | 2 | 0 |
| alan_bn_hair_v1 | halo 18 | 18 | 0 |
| alan_bn_jacket_off | halo 141 | 141 | 0 |
| alan_bn_jacket_shrug | halo 42 | 42 | 0 |
| alan_bn_jacket_shrug_v1 | halo 68 | 66 | 0 |
| alan_bn_jeans_half | halo 4 | 4 | 0 |
| alan_bn_jeans_off | halo 8 | 8 | 0 |
| alan_bn_pants | halo 13 | 13 | 0 |
| alan_bn_pants_on | halo 113, haze 17, speck 116 | 246 | 0 |
| alan_bn_pants_on_v2 | halo 30, haze 6 | 36 | 0 |
| alan_bn_pants_up | halo 30 | 30 | 0 |
| alan_bn_pants_up_v1 | halo 41 | 41 | 0 |
| alan_bn_pants_v1 | halo 21 | 21 | 0 |
| alan_bn_relax | halo 20 | 20 | 0 |
| alan_bn_rim | halo 4 | 4 | 0 |
| alan_bn_rim_v1 | halo 39, haze 23, speck 235 | 297 | 0 |
| alan_bn_splash | halo 134, haze 24, speck 111 | 269 | 0 |
| alan_bn_stepdown | halo 13, haze 2, speck 1 | 16 | 0 |
| alan_bn_tee | white_pocket 96, halo 37 | 133 | 64 |
| alan_bn_tee_lift | halo 39 | 39 | 0 |
| alan_bn_tee_v1 | halo 39 | 39 | 0 |
| alan_bn_toss | halo 7, haze 15, speck 245 | 267 | 0 |
| alan_bn_towel | halo 18, haze 2, speck 8 | 28 | 0 |
| alan_bn_walk | halo 27 | 27 | 0 |
| alan_bn_x_climb_down | halo 1, haze 5, speck 1 | 7 | 0 |
| alan_bn_x_haul | halo 4 | 4 | 0 |
| alan_bn_x_jacket_arm | halo 29 | 29 | 0 |
| alan_bn_x_jacket_drop | halo 15 | 15 | 0 |
| alan_bn_x_jeans_knees | halo 1 | 1 | 0 |
| alan_bn_x_jeans_ready | halo 6 | 6 | 0 |
| alan_bn_x_kick | halo 48 | 48 | 0 |
| alan_bn_x_pick_up | halo 18 | 18 | 0 |
| alan_bn_x_scoop | halo 88, haze 16, speck 55 | 159 | 0 |
| alan_bn_x_shorts_knees | halo 16 | 16 | 0 |
| alan_bn_x_surface | halo 2, haze 8, speck 164 | 174 | 0 |
| alan_bn_x_tee_up | halo 31 | 31 | 0 |
| alan_bn_x_tuck | halo 11, haze 4 | 15 | 0 |
| alan_bn_x_turn | halo 13 | 13 | 0 |
| alan_bn_x_unbutton | halo 10 | 10 | 0 |
| alan_bn_x_walk2 | halo 26 | 26 | 0 |
| alan_bn_x_wipe | halo 45, speck 2 | 47 | 0 |
| alan_bn_y_jacket_on | halo 53 | 53 | 0 |
| alan_bn_y_tee_down | halo 98 | 98 | 0 |
| alan_bn_y_tee_ready | halo 9 | 9 | 0 |
| alan_bn_zip | halo 27 | 27 | 0 |
| alan_button | halo 14, haze 1, speck 36 | 51 | 0 |
| alan_climb | haze 6, speck 24 | 30 | 0 |
| alan_coffees | key 1, halo 657, haze 39, speck 8 | 703 | 0 |
| alan_cutpalm | key 3, halo 583, haze 29, speck 58 | 662 | 0 |
| alan_dn_lie | key 15, haze 4, speck 13 | 32 | 0 |
| alan_dress1 | halo 111, haze 7, speck 136 | 254 | 0 |
| alan_dress2 | key 131, halo 5, haze 33, speck 15 | 183 | 0 |
| alan_dress3 | key 1, halo 130, haze 1, speck 44 | 175 | 0 |
| alan_dress4 | key 1, halo 52, haze 1, speck 83 | 137 | 0 |
| alan_dress_boot | key 108, halo 13, haze 12, speck 61 | 191 | 0 |
| alan_dress_final | key 154, halo 31, haze 144, speck 29 | 357 | 0 |
| alan_drink | white_pocket 22, key 4, halo 418, haze 13, speck 31 | 488 | 0 |
| alan_drip | key 117, halo 60, haze 48, speck 39 | 263 | 0 |
| alan_enchanted1 | key 3, halo 538, haze 166, speck 16 | 718 | 0 |
| alan_enchanted2 | key 5, halo 430, haze 107, speck 15 | 554 | 0 |
| alan_fling | halo 18, haze 5, speck 59 | 82 | 0 |
| alan_flirt | key 2, halo 41, haze 3, speck 43 | 89 | 0 |
| alan_fluster | halo 27, haze 9, speck 42 | 76 | 0 |
| alan_front | white_pocket 40, key 10, halo 623, haze 99, speck 19 | 788 | 69 |
| alan_front_walk1 | white_pocket 90, key 7, halo 193, haze 12, speck 35 | 336 | 108 |
| alan_front_walk2 | white_pocket 548, key 8, halo 400, haze 82, speck 5 | 1041 | 712 |
| alan_ib_button__fluster | key 75, halo 17, haze 22, speck 116 | 230 | 0 |
| alan_ib_climb__drip | key 151, halo 15, haze 2814, speck 228 | 3131 | 0 |
| alan_ib_coffee_walk1 | white_pocket 13, key 130, halo 89, haze 54, speck 1 | 287 | 1 |
| alan_ib_coffee_walk2 | key 95, halo 37, haze 7, speck 16 | 155 | 0 |
| alan_ib_cut | key 132, halo 30, haze 3, speck 14 | 179 | 0 |
| alan_ib_dress1__dress2 | key 276, halo 22, haze 192, speck 56 | 545 | 0 |
| alan_ib_dress2__dress3 | key 83, halo 7, haze 3, speck 69 | 162 | 0 |
| alan_ib_dress4__button | key 44, haze 5, speck 81 | 130 | 0 |
| alan_ib_dress_boot__dress3 | key 79, halo 54, haze 79, speck 107 | 319 | 0 |
| alan_ib_dress_final__fluster | key 60, halo 10, haze 5, speck 54 | 129 | 0 |
| alan_ib_drink | key 149, halo 77, haze 41, speck 14 | 277 | 0 |
| alan_ib_jacket__undress4 | key 127, speck 25 | 152 | 0 |
| alan_ib_jacket_wink__jump_crouch | key 79, haze 46, speck 21 | 146 | 0 |
| alan_ib_jump__jump_fall | key 58, haze 45, speck 7 | 110 | 0 |
| alan_ib_jump_crouch__jump_rise | key 257, haze 4, speck 19 | 280 | 0 |
| alan_ib_phone | white_pocket 11, key 132, halo 80, haze 15, speck 13 | 250 | 1 |
| alan_ib_pick2 | key 64, halo 31, speck 1 | 96 | 0 |
| alan_ib_reach | key 107, halo 115, haze 8, speck 1 | 224 | 0 |
| alan_ib_read | white_pocket 11, key 97, halo 28, haze 4, speck 8 | 148 | 0 |
| alan_ib_ring | key 189, halo 159, haze 60, speck 4 | 404 | 0 |
| alan_ib_smoke_in | key 163, halo 573, haze 91, speck 14 | 825 | 0 |
| alan_ib_smoke_out | key 70, halo 8, haze 2, speck 7 | 87 | 0 |
| alan_ib_stretch1 | key 135, halo 144, haze 124, speck 203 | 600 | 0 |
| alan_ib_stretch2 | key 75, halo 21, haze 31, speck 46 | 172 | 0 |
| alan_ib_stretch_down | key 102, halo 402, haze 34, speck 16 | 544 | 0 |
| alan_ib_throw | key 114, halo 67, haze 4, speck 2 | 185 | 0 |
| alan_ib_trunks_snap__dress1 | key 134, haze 9, speck 67 | 210 | 0 |
| alan_ib_turn34 | key 50, halo 16, haze 3, speck 3 | 72 | 0 |
| alan_ib_turn34back | key 246, halo 27, haze 19, speck 5 | 297 | 0 |
| alan_ib_undress1b__undress2a | key 138, haze 42, speck 179 | 358 | 0 |
| alan_ib_undress2b__undress_belt | key 244, halo 21, haze 676, speck 206 | 1126 | 0 |
| alan_ib_undress3__undress4 | key 39, halo 8, haze 14, speck 151 | 212 | 0 |
| alan_ib_undress4__dress1 | key 415, halo 7, haze 106, speck 75 | 597 | 0 |
| alan_ib_undress4__trunks_down | key 343, halo 23, haze 6, speck 52 | 422 | 0 |
| alan_ib_undress_belt__undress_boot | key 65, haze 3, speck 17 | 85 | 0 |
| alan_ib_undress_jeans__undress3 | key 53, haze 138, speck 225 | 416 | 0 |
| alan_ib_walk_start | key 181, halo 101, haze 301, speck 45 | 603 | 0 |
| alan_ib_weight_shift | key 134, halo 104, haze 16, speck 13 | 262 | 0 |
| alan_ib_wobble | key 65, halo 70, speck 24 | 156 | 0 |
| alan_ib_write | key 70, halo 59, speck 6 | 135 | 0 |
| alan_idle2 | white_pocket 21, key 3, halo 723, haze 26, speck 40 | 799 | 3 |
| alan_jacket | speck 343 | 343 | 0 |
| alan_jacket_grin | haze 2, speck 16 | 18 | 0 |
| alan_jacket_wink | speck 25 | 25 | 0 |
| alan_jump | key 9, halo 2, haze 13, speck 12 | 36 | 0 |
| alan_jump_crouch | key 79, haze 2, speck 29 | 108 | 0 |
| alan_jump_fall | haze 2 | 2 | 0 |
| alan_jump_rise | key 24, halo 5, haze 325, speck 14 | 368 | 0 |
| alan_lantern | halo 41, haze 5, speck 46 | 92 | 0 |
| alan_lwalk1 | key 2, halo 111, haze 5, speck 55 | 172 | 0 |
| alan_lwalk2 | halo 66, haze 3, speck 43 | 112 | 0 |
| alan_pass | key 3, halo 937, haze 195, speck 24 | 1132 | 0 |
| alan_phone | key 7, halo 550, haze 72, speck 25 | 652 | 0 |
| alan_pickup | white_pocket 15, key 28, halo 53, haze 1, speck 6 | 103 | 1 |
| alan_pull | key 14, halo 1365, haze 25, speck 5 | 1406 | 3 |
| alan_rapt1 | key 3, halo 931, haze 149, speck 62 | 1131 | 0 |
| alan_rapt2 | halo 1076, haze 921, speck 42 | 2025 | 0 |
| alan_rapt3 | key 5, halo 992, haze 963, speck 63 | 2012 | 0 |
| alan_reach | white_pocket 19, key 8, halo 618, haze 13, speck 14 | 668 | 7 |
| alan_read | white_pocket 22, key 7, halo 589, haze 23, speck 52 | 684 | 0 |
| alan_ring | white_pocket 27, key 4, halo 963, haze 61, speck 59 | 1107 | 40 |
| alan_side | key 1, halo 1172, haze 153, speck 42 | 1345 | 0 |
| alan_smoke_exhale | halo 1737, haze 17, speck 26 | 1753 | 0 |
| alan_smoke_hold | halo 1674, haze 12, speck 28 | 1685 | 0 |
| alan_smoke_inhale | halo 1647, haze 10, speck 10 | 1658 | 0 |
| alan_smoke_light | halo 1744, haze 25, speck 16 | 1768 | 0 |
| alan_stretch | halo 350, haze 50, speck 253 | 653 | 0 |
| alan_swim | key 1, halo 202, haze 30, speck 2 | 235 | 0 |
| alan_swim2 | key 40, halo 1109, haze 644, speck 468 | 2247 | 0 |
| alan_swim_wave | key 382, halo 119, haze 31, speck 3 | 533 | 0 |
| alan_swoon | key 1, halo 13, haze 4, speck 78 | 96 | 0 |
| alan_talk | key 5, halo 1352, haze 96, speck 17 | 1436 | 0 |
| alan_talk2 | white_pocket 23, key 4, halo 671, haze 29, speck 35 | 756 | 2 |
| alan_throw1 | key 2, halo 1148, haze 72, speck 66 | 1267 | 0 |
| alan_throw2 | key 2, halo 1205, haze 109, speck 127 | 1381 | 0 |
| alan_trunks_down | key 73, halo 10, haze 1, speck 23 | 107 | 0 |
| alan_trunks_on | key 97, halo 33, haze 21, speck 73 | 220 | 0 |
| alan_trunks_snap | key 348, halo 4, haze 1, speck 6 | 359 | 0 |
| alan_trunks_step | key 61, halo 2, haze 9, speck 68 | 140 | 0 |
| alan_undress1 | key 3, halo 26, haze 5, speck 38 | 71 | 0 |
| alan_undress1b | key 10, halo 1, speck 13 | 24 | 0 |
| alan_undress2 | halo 8, haze 1, speck 17 | 26 | 0 |
| alan_undress2a | key 27, haze 5, speck 13 | 45 | 0 |
| alan_undress2b | key 126, halo 10, haze 26, speck 26 | 188 | 0 |
| alan_undress3 | halo 31, haze 2, speck 6 | 39 | 0 |
| alan_undress_belt | key 14, halo 26, haze 1, speck 108 | 149 | 0 |
| alan_undress_boot | key 85, speck 62 | 147 | 0 |
| alan_undress_jeans | key 19, haze 1, speck 8 | 28 | 0 |
| alan_undress_unbutton | key 18, haze 1, speck 10 | 29 | 0 |
| alan_untie | white_pocket 20, key 11, halo 499, haze 52, speck 79 | 659 | 0 |
| alan_walk7_s1 | key 22, halo 1000, haze 4, speck 37 | 1060 | 0 |
| alan_walk7_s2 | key 22, halo 1000, haze 7, speck 60 | 1086 | 0 |
| alan_walk7_s3 | key 17, halo 589, speck 71 | 674 | 0 |
| alan_walk7_s4 | key 27, halo 479, haze 7, speck 61 | 572 | 0 |
| alan_walk7_s5 | key 31, halo 414, haze 7, speck 64 | 514 | 0 |
| alan_walkA | key 9, halo 1586, haze 145, speck 32 | 1762 | 0 |
| alan_walkB | key 6, halo 1616, haze 155, speck 50 | 1814 | 0 |
| alan_walkDown | key 4, halo 647, haze 33, speck 25 | 705 | 0 |
| alan_walkUp | key 2, halo 623, haze 35, speck 39 | 693 | 0 |
| alan_wash1 | halo 17, haze 11 | 28 | 0 |
| alan_wash2 | key 1, halo 18, haze 16, speck 105 | 140 | 0 |
| alan_wash3 | key 55, halo 32, haze 1, speck 3 | 91 | 0 |
| alan_wash4 | halo 5, speck 2 | 7 | 0 |
| alan_wash5 | key 1, halo 19, haze 70, speck 196 | 286 | 0 |
| alan_wash6 | halo 5, haze 4, speck 14 | 23 | 0 |
| alan_wash_surface | halo 18, speck 1 | 19 | 0 |
| alan_wink | key 2, halo 43, haze 1, speck 19 | 65 | 0 |
| alan_wobble | white_pocket 21, key 3, halo 547, haze 13, speck 38 | 622 | 1 |
| alan_wring | white_pocket 198, key 4, halo 366, haze 82, speck 71 | 717 | 200 |
| alan_write | halo 207, haze 9, speck 9 | 225 | 0 |
| alan_yawn | halo 630, haze 138, speck 332 | 1097 | 0 |
| amalia | halo 2910, haze 126, speck 232 | 3216 | 0 |
| amalia_idle2 | halo 2288, haze 51, speck 433 | 2656 | 0 |
| amalia_sing1 | halo 2056, haze 32, speck 446 | 2361 | 0 |
| amalia_sing2 | key 1, halo 2377, haze 21, speck 578 | 2866 | 7 |
| amalia_sing3 | halo 3592, haze 94, speck 227 | 3831 | 0 |
| amalia_sing4 | halo 3493, haze 333, speck 192 | 3858 | 0 |
| amalia_sing5 | key 5, halo 3433, haze 376, speck 167 | 3914 | 0 |
| amalia_talk | key 3, halo 2006, haze 38, speck 526 | 2484 | 5 |
| amalia_toast | key 1, halo 2371, haze 36, speck 620 | 2835 | 3 |
| cards_listen | hole 572, key 14, halo 23611, haze 5058, speck 1064, corner 649 | 30406 | 361 |
| cards_listen_b | hole 515, key 15, halo 24224, haze 4651, speck 1394, corner 427 | 30446 | 234 |
| celeste | key 6, halo 3843, haze 100, speck 889 | 4476 | 0 |
| celeste_basket | white_pocket 18, key 1, halo 2817, haze 33, speck 797 | 3510 | 0 |
| celeste_idle2 | key 1, halo 3126, haze 44, speck 803 | 3790 | 0 |
| celeste_shout | white_pocket 221, halo 3266, haze 48, speck 901 | 4102 | 197 |
| celeste_talk | key 1, halo 3683, haze 75, speck 857 | 4248 | 0 |
| celeste_talk2 | white_pocket 27, key 3, halo 3704, haze 96, speck 893 | 4413 | 0 |
| celeste_walk6_p1 | key 41, halo 2190, haze 33, speck 112 | 2367 | 0 |
| celeste_walk6_p11 | key 44, halo 1169, haze 8, speck 80 | 1300 | 0 |
| celeste_walk6_p13 | key 48, halo 1008, haze 4, speck 90 | 1146 | 0 |
| celeste_walk6_p15 | key 53, halo 2052, haze 38, speck 148 | 2281 | 0 |
| celeste_walk6_p3 | key 37, halo 1904, haze 31, speck 107 | 2076 | 0 |
| celeste_walk6_p5 | key 49, halo 1633, haze 23, speck 105 | 1799 | 0 |
| celeste_walk6_p7 | key 53, halo 2052, haze 38, speck 148 | 2281 | 0 |
| celeste_walk6_p9 | key 42, halo 1431, haze 2, speck 96 | 1561 | 0 |
| celeste_walkA | key 1, halo 2806, haze 22, speck 654 | 3346 | 0 |
| celeste_walkB | halo 2600, haze 14, speck 673 | 3183 | 0 |
| celeste_wring1 | white_pocket 44, halo 3396, haze 61, speck 935 | 4088 | 6 |
| celeste_wring2 | key 1, halo 3009, haze 52, speck 913 | 3701 | 0 |
| cop_bed1 | key 6, halo 14, speck 129 | 149 | 0 |
| cop_bed2 | halo 17 | 17 | 0 |
| cop_bed3 | halo 13, haze 1 | 14 | 0 |
| cop_bed4 | halo 14 | 14 | 0 |
| cop_side1 | key 1, halo 183, speck 5 | 189 | 0 |
| cop_side2 | halo 177, speck 23 | 199 | 0 |
| cop_side3 | halo 132, speck 11 | 143 | 0 |
| cop_side4 | key 1, halo 170, haze 2, speck 19 | 189 | 0 |
| cop_visit | halo 1298, haze 10, speck 223 | 1481 | 0 |
| cop_visit_talk | halo 1594, haze 10, speck 521 | 2029 | 0 |
| cop_walk1 | key 1, halo 6032, haze 341, speck 427 | 6487 | 0 |
| cop_walk2 | halo 6561, haze 423, speck 459 | 7007 | 0 |
| cop_walk6_p1 | key 19, halo 1031, haze 3, speck 43 | 1096 | 0 |
| cop_walk6_p11 | key 31, halo 379, haze 6, speck 58 | 474 | 0 |
| cop_walk6_p13 | key 13, halo 361, speck 108 | 482 | 0 |
| cop_walk6_p15 | key 39, halo 371, haze 1, speck 117 | 520 | 0 |
| cop_walk6_p3 | key 20, halo 729, haze 2, speck 91 | 842 | 0 |
| cop_walk6_p5 | key 37, halo 602, haze 3, speck 76 | 709 | 0 |
| cop_walk6_p7 | key 33, halo 687, haze 1, speck 112 | 825 | 0 |
| cop_walk6_p9 | key 28, halo 456, speck 92 | 576 | 0 |
| duarte_dn_kneel | key 9, haze 6, speck 54 | 69 | 0 |
| duarte_dn_stand | key 18, halo 22, haze 1, speck 49 | 90 | 0 |
| duarte_play1 | key 2, halo 8979, haze 732, speck 373, corner 68 | 10181 | 0 |
| duarte_play2 | halo 9286, haze 280, speck 750, corner 88 | 10454 | 9 |
| duarte_play3 | halo 10577, haze 687, speck 643, corner 144 | 11778 | 29 |
| guitar_floor1 | key 3, halo 859, haze 30, speck 25, corner 162 | 1084 | 0 |
| guitar_floor2 | key 4, halo 664, haze 6, speck 32, corner 125 | 829 | 0 |
| guitar_floor3 | key 1, halo 531, speck 55, corner 131 | 720 | 0 |
| guitar_floor4 | halo 703, haze 10, speck 17, corner 128 | 852 | 0 |
| guitar_visit | key 5, halo 1846, haze 26, speck 550 | 2306 | 0 |
| guitar_visit_talk | key 1, halo 2294, haze 64, speck 645 | 2790 | 0 |
| guitar_walk1 | key 1, halo 5337, haze 868, speck 268 | 6289 | 0 |
| guitar_walk2 | key 1, halo 7074, haze 1024, speck 353 | 8176 | 0 |
| guitar_walk6_p1 | key 13, halo 490, haze 1, speck 63 | 567 | 0 |
| guitar_walk6_p11 | key 9, halo 463, speck 172 | 644 | 0 |
| guitar_walk6_p13 | key 10, halo 380, speck 190 | 579 | 0 |
| guitar_walk6_p15 | key 11, halo 338, haze 1, speck 277 | 626 | 0 |
| guitar_walk6_p3 | key 5, halo 579, speck 222 | 806 | 0 |
| guitar_walk6_p5 | key 10, halo 392, haze 1, speck 168 | 571 | 0 |
| guitar_walk6_p7 | key 7, halo 429, speck 171 | 607 | 0 |
| guitar_walk6_p9 | key 6, halo 598, speck 117 | 721 | 0 |
| ines | halo 31, haze 97, speck 341 | 469 | 0 |
| ines_act_dust_a | halo 106, haze 57, speck 314 | 477 | 0 |
| ines_act_dust_b | halo 200, haze 84, speck 286 | 566 | 0 |
| ines_act_kettle_a | halo 95, haze 450, speck 340 | 884 | 0 |
| ines_act_kettle_b | halo 92, haze 397, speck 354 | 843 | 0 |
| ines_act_kettle_put | halo 45, haze 29, speck 344 | 417 | 0 |
| ines_act_ledger_a | halo 23, haze 407, speck 413 | 843 | 0 |
| ines_act_ledger_b | halo 62, haze 449, speck 369 | 879 | 0 |
| ines_act_read_a | halo 94, haze 44, speck 282 | 420 | 0 |
| ines_act_read_b | halo 100, haze 65, speck 308 | 473 | 0 |
| ines_act_shelve_a | halo 161, haze 620, speck 370 | 1142 | 0 |
| ines_act_shelve_b | halo 70, haze 86, speck 382 | 538 | 0 |
| ines_amused | halo 246, haze 401, speck 335 | 979 | 0 |
| ines_annoyed | halo 60, haze 10, speck 329 | 399 | 0 |
| ines_back | halo 255, haze 277, speck 271 | 795 | 0 |
| ines_back_pass1 | halo 148, haze 367, speck 187 | 698 | 0 |
| ines_back_pass2 | halo 170, haze 350, speck 167 | 683 | 0 |
| ines_back_walk1 | halo 141, haze 278, speck 296 | 711 | 0 |
| ines_back_walk2 | halo 137, haze 274, speck 281 | 691 | 0 |
| ines_catch | key 2, halo 3992, haze 285, speck 353 | 4436 | 5 |
| ines_deadpan | halo 32, haze 98, speck 451 | 577 | 0 |
| ines_eyeroll | halo 104, haze 458, speck 410 | 969 | 0 |
| ines_fond | halo 89, haze 360, speck 325 | 773 | 0 |
| ines_free | halo 186, haze 147, speck 631 | 962 | 0 |
| ines_front | halo 80, haze 468, speck 283 | 828 | 0 |
| ines_front_pass1 | halo 154, haze 290, speck 249 | 691 | 0 |
| ines_front_pass2 | halo 158, haze 289, speck 237 | 682 | 0 |
| ines_front_walk1 | halo 107, haze 291, speck 238 | 634 | 0 |
| ines_front_walk2 | halo 131, haze 274, speck 230 | 634 | 0 |
| ines_idle2 | halo 78, haze 454, speck 367 | 898 | 0 |
| ines_idle3 | halo 63, haze 362, speck 326 | 750 | 0 |
| ines_idle4 | halo 88, haze 460, speck 345 | 892 | 0 |
| ines_impressed | halo 225, haze 454, speck 399 | 1069 | 0 |
| ines_lantern | halo 134, haze 415, speck 462 | 1007 | 0 |
| ines_lantern_talk | halo 206, haze 454, speck 325 | 978 | 0 |
| ines_laugh | halo 129, haze 339, speck 349 | 814 | 0 |
| ines_lpass1 | halo 370, haze 343, speck 417 | 1124 | 0 |
| ines_lpass2 | halo 341, haze 477, speck 336 | 1149 | 0 |
| ines_lwalk1 | halo 474, haze 648, speck 393 | 1508 | 0 |
| ines_lwalk2 | halo 462, haze 609, speck 384 | 1446 | 0 |
| ines_pass1 | halo 94, haze 23, speck 291 | 405 | 0 |
| ines_pass2 | halo 94, haze 23, speck 291 | 405 | 0 |
| ines_plaque | halo 130, haze 440, speck 368 | 934 | 0 |
| ines_point | halo 113, haze 447, speck 385 | 940 | 0 |
| ines_scandalised | halo 58, haze 101, speck 373 | 529 | 0 |
| ines_shelve | halo 211, haze 351, speck 281 | 828 | 0 |
| ines_steam | halo 238, haze 111, speck 466 | 810 | 0 |
| ines_surprised | halo 54, haze 79, speck 473 | 605 | 0 |
| ines_sympathetic | halo 92, haze 492, speck 300 | 883 | 0 |
| ines_talk | halo 81, haze 443, speck 339 | 861 | 0 |
| ines_talk2 | halo 97, haze 506, speck 354 | 955 | 0 |
| ines_talk3 | halo 125, haze 8, speck 357 | 484 | 0 |
| ines_talk4 | halo 85, haze 381, speck 321 | 784 | 0 |
| ines_teasing | halo 76, haze 412, speck 330 | 814 | 0 |
| ines_think | halo 44, haze 343, speck 299 | 686 | 0 |
| ines_tied | halo 111, haze 395, speck 307 | 811 | 0 |
| ines_tied_shout | halo 32, haze 410, speck 347 | 789 | 0 |
| ines_tied_struggle | halo 144, haze 428, speck 370 | 942 | 0 |
| ines_walk1 | halo 176, haze 238, speck 451 | 862 | 0 |
| ines_walk2 | halo 146, haze 618, speck 363 | 1127 | 0 |
| ines_walk7_s1 | key 12, halo 1108, haze 3, speck 100 | 1221 | 0 |
| ines_walk7_s2 | key 15, halo 858, haze 5, speck 107 | 985 | 0 |
| ines_walk7_s3 | key 20, halo 941, haze 18, speck 162 | 1133 | 0 |
| ines_walk7_s4 | key 26, halo 936, haze 6, speck 71 | 1036 | 0 |
| ines_walk7_s5 | key 29, halo 713, haze 5, speck 62 | 805 | 0 |
| ines_walk7_s6 | key 31, halo 628, haze 6, speck 112 | 775 | 0 |
| ines_worried | halo 85, haze 379, speck 377 | 839 | 0 |
| ines_wrists | halo 49, haze 94, speck 504 | 644 | 0 |
| ines_write | halo 96, haze 486, speck 351 | 932 | 0 |
| lacerda | key 2, halo 1133, haze 36, speck 115 | 1258 | 0 |
| lacerda_front | halo 590, haze 1457, speck 555 | 2597 | 0 |
| lacerda_idle2 | key 8, halo 886, haze 17, speck 160 | 1016 | 0 |
| lacerda_idle3 | halo 711, haze 1200, speck 429 | 2337 | 0 |
| lacerda_pass1 | halo 837, haze 1057, speck 338 | 2230 | 0 |
| lacerda_pass2 | key 2, halo 970, haze 628, speck 279 | 1874 | 0 |
| lacerda_robe | key 2, halo 6158, haze 210, speck 420 | 6635 | 0 |
| lacerda_talk | halo 1334, haze 40, speck 94 | 1444 | 0 |
| lacerda_talk2 | white_pocket 54, key 2, halo 741, haze 14, speck 160 | 927 | 56 |
| lacerda_talk3 | key 1, halo 792, haze 1372, speck 574 | 2735 | 0 |
| lacerda_talk4 | halo 722, haze 1209, speck 481 | 2407 | 0 |
| lacerda_walk1 | halo 917, haze 1560, speck 658 | 3132 | 0 |
| lacerda_walk2 | key 1, halo 929, haze 1488, speck 492 | 2905 | 0 |
| lacerda_walk6_p1 | key 8, halo 51, haze 1, speck 11 | 71 | 0 |
| lacerda_walk6_p11 | key 1, halo 73, speck 25 | 99 | 0 |
| lacerda_walk6_p13 | key 2, halo 106, haze 5, speck 27 | 140 | 0 |
| lacerda_walk6_p15 | key 3, halo 59, haze 13, speck 8 | 83 | 0 |
| lacerda_walk6_p3 | key 6, halo 159, speck 11 | 176 | 0 |
| lacerda_walk6_p5 | key 10, halo 58, speck 19 | 87 | 0 |
| lacerda_walk6_p7 | key 13, halo 45, haze 4, speck 50 | 112 | 0 |
| lacerda_walk6_p9 | key 7, halo 61, haze 1, speck 12 | 81 | 0 |
| lacerda_walkA | halo 743, haze 20, speck 130 | 850 | 0 |
| lacerda_walkB | white_pocket 123, key 1, halo 775, haze 9, speck 191 | 1037 | 124 |
| lacerda_wind | white_pocket 46, halo 435, haze 8, speck 199 | 662 | 46 |
| lino_bass1 | key 2, halo 6447, haze 238, speck 442 | 6946 | 0 |
| lino_bass2 | key 1, halo 6319, haze 185, speck 722 | 6853 | 0 |
| lino_bass3 | halo 6988, haze 259, speck 485 | 7445 | 0 |
| lino_bass4 | halo 6602, haze 217, speck 437 | 7020 | 0 |
| lino_carry1 | halo 8251, haze 302, speck 513 | 8670 | 0 |
| lino_carry2 | halo 8008, haze 325, speck 618 | 8443 | 2 |
| lino_carrypass1 | key 2, halo 7161, haze 368, speck 481 | 7700 | 0 |
| lino_carrypass2 | key 2, halo 7437, haze 392, speck 399 | 7868 | 0 |
| lino_pass1 | halo 4538, haze 173, speck 344 | 4854 | 0 |
| lino_pass2 | halo 4904, haze 223, speck 413 | 5275 | 0 |
| lino_reach | halo 10189, haze 523, speck 361 | 10706 | 0 |
| lino_reach2 | halo 6344, haze 234, speck 434 | 6787 | 0 |
| lino_walk1 | key 3, halo 7405, haze 249, speck 542 | 7850 | 0 |
| lino_walk2 | key 1, halo 7914, haze 288, speck 469 | 8302 | 0 |
| maria_grip | halo 3029, haze 128, speck 639 | 3444 | 0 |
| maria_sleep | key 1, halo 3400, haze 164, speck 552 | 3780 | 0 |
| maria_wake | halo 1988, haze 47, speck 316 | 2190 | 0 |
| npc_bench | key 13, halo 435, haze 284, speck 54, corner 135 | 918 | 0 |
| npc_bench_awake | key 21, halo 520, haze 265, speck 43, corner 170 | 1003 | 0 |
| npc_bench_b | key 6, halo 114, haze 101, speck 10, corner 213 | 444 | 0 |
| npc_bench_confide | key 23, halo 860, haze 401, speck 42, corner 142 | 1450 | 0 |
| npc_bench_doze2 | key 17, halo 148, haze 118, speck 11, corner 208 | 502 | 0 |
| npc_bench_drowsy | key 27, halo 337, haze 321, speck 41, corner 158 | 878 | 0 |
| npc_bench_talk1 | key 53, halo 330, haze 145, speck 35, corner 162 | 715 | 0 |
| npc_bench_talk2 | key 34, halo 155, haze 99, speck 32, corner 194 | 510 | 0 |
| npc_bench_talk3 | key 39, halo 371, haze 347, speck 34, corner 164 | 946 | 0 |
| npc_bench_wistful | key 10, halo 121, haze 59, speck 36, corner 194 | 416 | 0 |
| npc_cards | key 72, halo 660, haze 399, speck 273 | 1395 | 0 |
| npc_cards_b | key 109, halo 614, haze 563, speck 254 | 1530 | 0 |
| npc_couple | hole 260, white_pocket 992, key 29, halo 14732, haze 705, speck 1790, corner 167 | 17975 | 842 |
| npc_couple_b | white_pocket 621, key 11, halo 15374, haze 569, speck 1327, corner 272 | 18095 | 678 |
| npc_fish | white_pocket 243, key 3, halo 6411, haze 271, speck 1181, corner 162 | 7947 | 238 |
| npc_fish_b | white_pocket 116, key 10, halo 6862, haze 265, speck 1213, corner 154 | 8244 | 141 |
| npc_guard | key 3, halo 8660, haze 663, speck 639, corner 43 | 9753 | 0 |
| npc_guard_b | key 1, halo 8208, haze 612, speck 613, corner 7 | 9144 | 0 |
| npc_guitar | white_pocket 82, key 6, halo 7174, haze 190, speck 1232, corner 64 | 8330 | 108 |
| npc_guitar_b | white_pocket 238, key 6, halo 7556, haze 252, speck 1140, corner 59 | 8864 | 113 |
| npc_guitar_flourish | halo 3121, haze 24, speck 1484, corner 13 | 4282 | 0 |
| npc_guitar_lean | halo 2963, haze 40, speck 414, corner 111 | 3396 | 0 |
| npc_guitar_serenade | key 1, halo 2877, haze 29, speck 384, corner 85 | 3272 | 1 |
| npc_guitar_talk1 | key 1, halo 2592, haze 35, speck 228, corner 174 | 2970 | 0 |
| npc_guitar_talk2 | halo 2249, haze 22, speck 326, corner 177 | 2688 | 0 |
| npc_guitar_talk3 | halo 1851, haze 14, speck 177, corner 230 | 2248 | 0 |
| npc_guitar_wink | halo 1253, haze 5, speck 519 | 1678 | 0 |
| npc_laundry | key 2, halo 3919, haze 80, speck 805 | 4541 | 0 |
| npc_laundry_glance | halo 3807, haze 1090, speck 172 | 5040 | 0 |
| npc_laundry_peg | hole 1106, halo 4588, haze 1313, speck 328 | 7269 | 0 |
| npc_laundry_shake | halo 3578, haze 1083, speck 240 | 4867 | 0 |
| npc_laundry_shock | key 1, halo 932, haze 23, speck 88 | 999 | 0 |
| npc_laundry_talk1 | halo 3739, haze 1124, speck 144 | 4971 | 1 |
| npc_laundry_talk2 | halo 3719, haze 1034, speck 208 | 4924 | 0 |
| npc_laundry_talk3 | halo 4042, haze 988, speck 161 | 5144 | 0 |
| npc_lino | halo 1985, haze 21, speck 592 | 2425 | 0 |
| npc_lino_b | key 2, halo 2501, haze 50, speck 638 | 2950 | 0 |
| npc_lino_talk | white_pocket 15, halo 2084, haze 28, speck 632 | 2532 | 0 |
| npc_mender1 | hole 257, white_pocket 1515, key 6, halo 3447, haze 24, speck 726, corner 142 | 6156 | 1281 |
| npc_mender1_b | hole 309, white_pocket 1312, key 3, halo 4304, haze 30, speck 768, corner 143 | 6828 | 1034 |
| npc_mender1_talk | halo 1045, haze 3, speck 145, corner 256 | 1537 | 0 |
| npc_mender2 | key 2, halo 3124, haze 34, speck 760, corner 44 | 3716 | 0 |
| npc_mender2_b | white_pocket 1279, key 1, halo 5020, haze 31, speck 799, corner 23 | 6846 | 2295 |
| npc_mender2_talk | halo 1193, haze 15, speck 117, corner 160 | 1461 | 0 |
| npc_nun | key 4, halo 2263, haze 28, speck 707 | 2813 | 0 |
| npc_nun_b | halo 2126, haze 6, speck 609 | 2614 | 0 |
| npc_nun_talk | halo 986, haze 2, speck 380 | 1330 | 1 |
| npc_phone | halo 3298, haze 127, speck 993 | 4111 | 0 |
| npc_phone_b | key 1, halo 3248, haze 19, speck 946 | 4011 | 0 |
| npc_phone_b2 | halo 3214, haze 17, speck 952 | 3979 | 0 |
| npc_phone_b3 | halo 3216, haze 16, speck 953 | 3976 | 0 |
| npc_phone_b_talk | halo 3245, haze 19, speck 954 | 4021 | 0 |
| npc_phone_blush | halo 1000, speck 314 | 1263 | 0 |
| npc_phone_door2 | halo 4 | 4 | 0 |
| npc_phone_door3 | halo 6 | 6 | 0 |
| npc_phone_door4 | halo 1 | 1 | 0 |
| npc_phone_door_blush | halo 4 | 4 | 0 |
| npc_phone_door_embarrassed | halo 25 | 25 | 0 |
| npc_phone_door_shock | halo 3 | 3 | 0 |
| npc_phone_proud | halo 1617, haze 2, speck 444 | 1985 | 0 |
| npc_phone_talk | halo 3290, haze 125, speck 1012 | 4116 | 0 |
| npc_tourists | key 7, halo 5175, haze 671, speck 258 | 5990 | 0 |
| npc_tourists_b | key 2, halo 5225, haze 743, speck 220 | 6054 | 0 |
| npc_volunteer | halo 7561, haze 406, speck 520, corner 22 | 8275 | 0 |
| npc_volunteer_b | halo 7244, haze 438, speck 415, corner 6 | 7964 | 0 |
| npc_washer1 | key 3, halo 2671, haze 67, speck 710 | 3240 | 0 |
| npc_washer1_b | key 10, halo 2465, haze 69, speck 761 | 3112 | 0 |
| npc_washer1_giggle | halo 3821, haze 1003, speck 149 | 4945 | 0 |
| npc_washer1_gossip | hole 133, halo 4275, haze 1088, speck 190 | 5651 | 0 |
| npc_washer1_howl | halo 2611, haze 1520, speck 58 | 4161 | 0 |
| npc_washer1_laugh | hole 151, halo 4171, haze 933, speck 105 | 5321 | 0 |
| npc_washer1_lift | halo 3998, haze 1051, speck 164 | 5188 | 0 |
| npc_washer1_peek | halo 4027, haze 717, speck 138 | 4855 | 0 |
| npc_washer1_rest | halo 3718, haze 1142, speck 154 | 4986 | 0 |
| npc_washer1_scrub2 | hole 494, halo 3744, haze 875, speck 117 | 5213 | 0 |
| npc_washer1_shock | halo 2017, haze 9, speck 408 | 2317 | 0 |
| npc_washer1_wring | halo 3151, haze 1707, speck 90 | 4918 | 0 |
| npc_washer2 | white_pocket 24, key 2, halo 2748, haze 49, speck 797 | 3356 | 16 |
| npc_washer2_b | white_pocket 22, key 8, halo 2858, haze 65, speck 811 | 3517 | 0 |
| npc_washer2_beckon | halo 7567, haze 1371, speck 135 | 8889 | 2 |
| npc_washer2_cackle | halo 3795, haze 2305, speck 135 | 6200 | 0 |
| npc_washer2_giggle | halo 4532, haze 835, speck 153 | 5447 | 0 |
| npc_washer2_hips | hole 1354, halo 4881, haze 979, speck 158 | 7332 | 0 |
| npc_washer2_scrub2 | hole 1790, halo 4745, haze 1010, speck 81 | 7594 | 0 |
| npc_washer2_shock | halo 2167, haze 16, speck 332 | 2365 | 0 |
| npc_washer2_slap | hole 1736, halo 4577, haze 908, speck 121 | 7310 | 0 |
| npc_washer2_wheeze | halo 4475, haze 917, speck 144 | 5489 | 0 |
| npc_washer2_wink | hole 788, halo 3738, haze 2060, speck 112 | 6663 | 123 |
| npc_washer2_wring | halo 4707, haze 1066, speck 184 | 5900 | 0 |
| pair_brow | key 2, halo 1260, haze 77, speck 55 | 1380 | 0 |
| pair_cop_arm | halo 185, haze 34, speck 84 | 302 | 0 |
| pair_cop_belt | key 1, halo 468, haze 22, speck 128 | 604 | 0 |
| pair_cop_belt2 | halo 545, haze 12, speck 60 | 612 | 0 |
| pair_cop_buttons | halo 313, haze 13, speck 188 | 510 | 0 |
| pair_cop_chest | halo 231, haze 37, speck 27 | 287 | 0 |
| pair_cop_cuffs | halo 418, haze 13, speck 85 | 507 | 0 |
| pair_cop_jacket | halo 283, speck 54 | 335 | 0 |
| pair_cop_neck | halo 159, haze 12, speck 43 | 212 | 0 |
| pair_cop_shelf | key 1, halo 232, haze 1, speck 80 | 303 | 0 |
| pair_cop_shelf2 | key 1, halo 219, haze 7, speck 45 | 272 | 0 |
| pair_cop_trousers | halo 291, haze 5, speck 14 | 309 | 0 |
| pair_cop_tshirt | key 1, halo 558, haze 13, speck 48 | 612 | 0 |
| pair_duarte_book | key 13, halo 90, haze 17, speck 158 | 277 | 0 |
| pair_duarte_book_ib | key 8, halo 99, haze 11, speck 52 | 170 | 0 |
| pair_duarte_jackets | key 14, halo 16, haze 3, speck 112 | 145 | 0 |
| pair_duarte_kiss | key 1, halo 9, haze 1, speck 93 | 104 | 0 |
| pair_duarte_kiss2 | key 1, halo 62, haze 1, speck 44 | 108 | 0 |
| pair_duarte_kiss_ib | key 1, halo 13, speck 31 | 45 | 0 |
| pair_duarte_lesson | key 23, halo 261, haze 13, speck 73 | 369 | 0 |
| pair_duarte_lesson_ib | key 3, halo 49, speck 109 | 161 | 0 |
| pair_duarte_push | key 39, halo 29, haze 2, speck 18 | 88 | 0 |
| pair_duarte_shirts | key 50, halo 154, haze 9, speck 115 | 328 | 0 |
| pair_duarte_tee | key 22, halo 167, haze 2, speck 117 | 304 | 0 |
| pair_duarte_terms | key 56, halo 330, haze 28, speck 268 | 674 | 0 |
| pair_duarte_terms_ib | key 14, halo 225, haze 16, speck 198 | 453 | 0 |
| pair_guitar_d1 | key 1, halo 523, haze 12, speck 37 | 569 | 0 |
| pair_guitar_d2 | key 2, halo 527, haze 30, speck 51 | 596 | 0 |
| pair_guitar_h1 | key 2, halo 1078, haze 59, speck 162 | 1269 | 0 |
| pair_guitar_h2 | key 3, halo 517, haze 11, speck 95 | 619 | 0 |
| pair_guitar_hop | halo 97, haze 4, speck 53 | 154 | 0 |
| pair_guitar_j0 | key 5, halo 173, haze 4, speck 9 | 189 | 0 |
| pair_guitar_j1 | halo 341, haze 8, speck 21 | 366 | 0 |
| pair_guitar_j2 | key 1, halo 266, haze 3, speck 51 | 319 | 0 |
| pair_guitar_jackets | key 2, halo 231, haze 3, speck 53 | 283 | 0 |
| pair_guitar_l1 | key 1, halo 631, haze 22, speck 49 | 689 | 0 |
| pair_guitar_l2 | halo 456, speck 21 | 468 | 0 |
| pair_guitar_lasso | halo 293, haze 18, speck 88 | 395 | 0 |
| pair_guitar_lesson | halo 535, haze 5, speck 53 | 589 | 0 |
| pair_guitar_p1 | key 1, halo 168, haze 1, speck 43 | 208 | 0 |
| pair_guitar_s1 | key 2, halo 544, haze 20, speck 62 | 616 | 0 |
| pair_guitar_s2 | key 4, halo 824, haze 38, speck 81 | 931 | 0 |
| pair_guitar_shirtfly | halo 544, haze 29, speck 65 | 629 | 0 |
| pair_guitar_u1 | key 1, halo 329, haze 229, speck 143 | 695 | 0 |
| pair_guitar_u2 | key 1, halo 261, speck 21 | 282 | 0 |
| pair_guitar_underwear | halo 110, speck 60 | 169 | 0 |
| pair_guitar_undress2 | key 1, halo 515, haze 26, speck 82 | 617 | 0 |
| pair_ib_cop_arm_in | key 388, halo 21, haze 32, speck 19 | 459 | 0 |
| pair_ib_cop_arm_out | key 350, halo 85, haze 99, speck 76 | 607 | 0 |
| pair_ib_cop_belt2__trousers | key 125, halo 4, haze 16, speck 8 | 153 | 0 |
| pair_ib_cop_belt__belt2 | key 473, halo 24, haze 35, speck 67 | 598 | 0 |
| pair_ib_cop_chest_in | key 306, halo 2, haze 134, speck 126 | 566 | 0 |
| pair_ib_cop_chest_out | key 285, halo 5, haze 6, speck 19 | 314 | 0 |
| pair_ib_cop_jacket__tshirt | key 286, halo 39, haze 31, speck 35 | 391 | 0 |
| pair_ib_cop_neck__shelf | key 228, halo 171, haze 83, speck 217 | 690 | 0 |
| pair_ib_cop_neck_in | key 304, halo 10, haze 15, speck 3 | 332 | 0 |
| pair_ib_cop_shelf2__belt | key 360, halo 21, haze 122, speck 205 | 688 | 0 |
| pair_ib_cop_shelf__jacket | key 222, halo 6, haze 5, speck 19 | 252 | 0 |
| pair_ib_cop_trousers__cuffs | key 472, halo 3, haze 9, speck 26 | 510 | 0 |
| pair_ib_cop_tshirt__buttons | key 442, halo 98, haze 185, speck 326 | 1043 | 0 |
| pair_ib_guitar_d1__d2 | key 334, halo 30, haze 187, speck 119 | 667 | 0 |
| pair_ib_guitar_d2__hop | key 55, halo 27, haze 2, speck 64 | 148 | 0 |
| pair_ib_guitar_h1__h2 | key 587, halo 116, haze 106, speck 24 | 829 | 0 |
| pair_ib_guitar_h2__lasso | key 318, halo 22, haze 39, speck 49 | 428 | 0 |
| pair_ib_guitar_hop__h1 | key 147, halo 137, haze 18, speck 92 | 394 | 0 |
| pair_ib_guitar_j0__jackets | key 206, halo 13, haze 11, speck 48 | 278 | 0 |
| pair_ib_guitar_j0_in | key 185, halo 14, haze 4, speck 29 | 232 | 0 |
| pair_ib_guitar_j1__j2 | key 135, halo 42, haze 81, speck 70 | 325 | 0 |
| pair_ib_guitar_j2__u1 | key 227, halo 136, haze 90, speck 128 | 572 | 0 |
| pair_ib_guitar_jackets__j1 | key 176, halo 18, haze 65, speck 25 | 284 | 0 |
| pair_ib_guitar_l1__l2 | key 526, halo 7, haze 58, speck 28 | 616 | 0 |
| pair_ib_guitar_l2__underwear | key 445, halo 19, haze 7, speck 2 | 473 | 0 |
| pair_ib_guitar_lasso__l1 | key 770, halo 102, haze 142, speck 51 | 1057 | 0 |
| pair_ib_guitar_lesson_in | white_pocket 20, key 390, halo 192, haze 24, speck 26 | 650 | 31 |
| pair_ib_guitar_lesson_out | key 131, halo 17, haze 14, speck 35 | 197 | 0 |
| pair_ib_guitar_s1__s2 | key 420, halo 142, haze 214, speck 83 | 848 | 0 |
| pair_ib_guitar_s2__undress2 | key 518, halo 303, haze 212, speck 129 | 1148 | 0 |
| pair_ib_guitar_shirtfly__s1 | key 413, halo 21, haze 32, speck 69 | 531 | 0 |
| pair_ib_guitar_u1__u2 | key 471, halo 267, haze 235, speck 93 | 1063 | 0 |
| pair_ib_guitar_u2__shirtfly | key 512, halo 87, haze 121, speck 43 | 759 | 0 |
| pair_ib_guitar_underwear__p1 | key 337, halo 10, haze 13, speck 61 | 420 | 0 |
| pair_ib_guitar_undress2__d1 | key 482, halo 110, haze 135, speck 75 | 799 | 0 |
| pair_ib_kiss__brow | key 239, halo 6, haze 39, speck 27 | 309 | 0 |
| pair_ib_unbutton__kiss | key 281, halo 25, haze 38, speck 16 | 355 | 0 |
| pair_ib_unbutton_in | key 246, halo 48, haze 95, speck 23 | 411 | 0 |
| pair_ib_vasco_card_in | key 322, halo 161, haze 71, speck 24 | 570 | 0 |
| pair_ib_vasco_card_out | key 503, halo 122, haze 111, speck 29 | 759 | 0 |
| pair_ib_vasco_catch_out | key 443, halo 22, haze 23, speck 6 | 492 | 0 |
| pair_ib_vasco_clapper_in | key 43, halo 179, haze 11, speck 33 | 264 | 0 |
| pair_ib_vasco_clapper_out | key 227, halo 138, haze 8, speck 39 | 411 | 0 |
| pair_ib_vasco_coffee_in | key 590, halo 40, haze 104, speck 35 | 764 | 0 |
| pair_ib_vasco_coffee_out | key 548, halo 66, haze 104, speck 15 | 730 | 0 |
| pair_ib_vasco_fragment_in | key 508, halo 36, haze 110, speck 31 | 683 | 0 |
| pair_ib_vasco_fragment_out | key 501, halo 44, haze 245, speck 70 | 854 | 0 |
| pair_ib_vasco_kiss_in | key 344, halo 118, haze 91, speck 45 | 591 | 0 |
| pair_ib_vasco_kiss_out | key 457, halo 58, haze 55, speck 5 | 574 | 0 |
| pair_ib_vasco_lanyard_in | key 253, halo 169, haze 84, speck 30 | 528 | 0 |
| pair_ib_vasco_shirtless_in | key 676, halo 46, haze 97, speck 33 | 846 | 0 |
| pair_ib_vasco_shirtless_out | key 631, halo 34, haze 87, speck 23 | 774 | 0 |
| pair_ib_wring_1__2 | key 427, halo 254, haze 455, speck 102 | 1200 | 0 |
| pair_ib_wring_1_in | key 469, halo 353, haze 675, speck 59 | 1489 | 0 |
| pair_ib_wring_1_out | key 474, halo 200, haze 633, speck 61 | 1310 | 0 |
| pair_ib_wring_2__3 | key 348, halo 334, haze 591, speck 100 | 1345 | 0 |
| pair_kiss | key 1, halo 690, haze 39, speck 36 | 750 | 0 |
| pair_unbutton | key 3, halo 2116, haze 206, speck 44 | 2333 | 0 |
| pair_vasco_after | white_pocket 35, key 32, halo 143, haze 2, speck 71 | 280 | 45 |
| pair_vasco_card | halo 2233, haze 119, speck 148 | 2465 | 0 |
| pair_vasco_catch | key 3, halo 2116, haze 114, speck 147 | 2353 | 0 |
| pair_vasco_clapper | key 284, halo 68, haze 117, speck 89 | 552 | 0 |
| pair_vasco_coffee | key 2, halo 3329, haze 243, speck 290 | 3775 | 3 |
| pair_vasco_fragment | key 1, halo 3329, haze 224, speck 260 | 3719 | 0 |
| pair_vasco_kiss | halo 1112, haze 37, speck 49 | 1190 | 0 |
| pair_vasco_kneel | halo 827, haze 23, speck 16 | 855 | 0 |
| pair_vasco_ladder | halo 1299, haze 25, speck 49 | 1365 | 0 |
| pair_vasco_lanyard | halo 2544, haze 130, speck 213 | 2823 | 0 |
| pair_vasco_shirtless | halo 1490, haze 76, speck 173 | 1725 | 0 |
| pair_vasco_thumb | halo 2881, haze 176, speck 266 | 3209 | 0 |
| pair_wring_1 | key 1, halo 2973, haze 1700, speck 1526 | 5810 | 0 |
| pair_wring_2 | key 1, halo 3153, haze 1842, speck 1710 | 6260 | 0 |
| pair_wring_3 | key 6, halo 3208, haze 2170, speck 2061 | 6940 | 0 |
| pessoa_eat | key 7, halo 3711, speck 29 | 3737 | 0 |
| pessoa_jump | halo 5419, speck 25 | 5431 | 0 |
| pessoa_sit | key 10, halo 6026, haze 5, speck 30 | 5974 | 6 |
| pessoa_sleep | key 3, halo 3728 | 3725 | 0 |
| pessoa_sleep2 | halo 5077, haze 2, speck 429 | 5370 | 1 |
| pessoa_walk1 | key 4, halo 6407, speck 35 | 6424 | 0 |
| pessoa_walk2 | key 11, halo 6501, haze 3, speck 32 | 6516 | 0 |
| prop_tram | key 12, halo 13655, haze 331, speck 889 | 14278 | 0 |
| robe_idle | key 3, halo 2157, haze 22, speck 679 | 2652 | 0 |
| robe_idle2 | halo 3256, haze 1390, speck 98 | 4708 | 0 |
| robe_kneel | halo 3216, haze 27, speck 883 | 3851 | 0 |
| robe_lunge | key 2, halo 4121, haze 28, speck 873 | 4730 | 0 |
| robe_read | key 1, halo 2839, haze 22, speck 726 | 3333 | 0 |
| robe_realise | halo 595, haze 3, speck 138 | 724 | 0 |
| robe_talk | key 3, halo 3280, haze 57, speck 885 | 3901 | 0 |
| robe_talk2 | halo 3792, haze 1273, speck 176 | 5187 | 0 |
| robe_talk3 | halo 3708, haze 1510, speck 166 | 5336 | 0 |
| robe_terror | key 3, halo 3876, haze 37, speck 838 | 4442 | 0 |
| rui | halo 5400, haze 143, speck 461 | 5871 | 0 |
| rui_coffees | halo 3313, haze 31, speck 934 | 3945 | 0 |
| rui_front | halo 4892, haze 921, speck 78 | 5869 | 0 |
| rui_idle2 | halo 3767, haze 68, speck 954 | 4405 | 0 |
| rui_idle3 | halo 3738, haze 68, speck 1009 | 4398 | 0 |
| rui_idle4 | halo 4847, haze 845, speck 111 | 5740 | 0 |
| rui_smoke | halo 3194, haze 43, speck 1093 | 3968 | 0 |
| rui_talk | key 1, halo 6013, haze 151, speck 358 | 6408 | 0 |
| rui_talk2 | key 3, halo 3698, haze 52, speck 1069 | 4448 | 0 |
| rui_talk3 | halo 4831, haze 854, speck 137 | 5757 | 0 |
| rui_talk4 | halo 4861, haze 821, speck 109 | 5746 | 0 |
| tomas | white_pocket 56, halo 4100, haze 116, speck 423 | 4557 | 80 |
| tomas_kneel | halo 2149, haze 23, speck 608 | 2585 | 0 |
| tomas_night | white_pocket 382, key 5, halo 3820, haze 82, speck 1065 | 4958 | 428 |
| tomas_night_talk | white_pocket 322, halo 4458, haze 117, speck 955 | 5475 | 274 |
| tomas_sweep | halo 2843, haze 45, speck 770 | 3418 | 1 |
| tomas_sweepL | halo 2940, haze 49, speck 743 | 3494 | 0 |
| tomas_sweepR | white_pocket 85, key 1, halo 3219, haze 71, speck 750 | 3846 | 62 |
| tomas_talk | white_pocket 60, halo 4402, haze 115, speck 411 | 4898 | 87 |
| vasco | key 4, halo 5539, haze 256, speck 824 | 6203 | 0 |
| vasco_act_bag_a | key 168, halo 293, haze 38, speck 10 | 495 | 0 |
| vasco_act_bag_b | key 50, halo 171, haze 103, speck 29 | 347 | 0 |
| vasco_act_brush_a | key 98, halo 312, haze 32, speck 8 | 438 | 0 |
| vasco_act_brush_b | key 57, halo 139, haze 39, speck 38 | 271 | 0 |
| vasco_act_notes_a | key 145, halo 178, haze 17, speck 14 | 352 | 0 |
| vasco_act_notes_b | key 52, halo 89, haze 9, speck 6 | 156 | 0 |
| vasco_act_sherd_a | key 259, halo 348, haze 226, speck 28 | 835 | 0 |
| vasco_act_sherd_b | key 349, halo 179, haze 68, speck 98 | 694 | 0 |
| vasco_act_sieve_a | key 152, halo 298, haze 5, speck 24 | 476 | 0 |
| vasco_act_sieve_b | key 72, halo 306, haze 3, speck 100 | 477 | 1 |
| vasco_act_trowel_a | key 114, halo 224, haze 7, speck 14 | 358 | 0 |
| vasco_act_trowel_b | key 62, halo 102, haze 2, speck 7 | 172 | 0 |
| vasco_amused | key 104, halo 126, haze 13, speck 12 | 255 | 0 |
| vasco_back | halo 4249, haze 157, speck 751 | 4844 | 0 |
| vasco_back_read | key 85, halo 239, haze 26, speck 108 | 441 | 0 |
| vasco_back_unlock | key 478, halo 538, haze 143, speck 15 | 1104 | 0 |
| vasco_callup | key 193, halo 135, haze 22, speck 37 | 385 | 0 |
| vasco_clapper_give | key 131, halo 246, haze 5, speck 20 | 399 | 0 |
| vasco_clapper_hold | key 79, halo 274, haze 44, speck 9 | 403 | 0 |
| vasco_clapper_lift | white_pocket 49, key 109, halo 158, haze 103, speck 42 | 461 | 88 |
| vasco_clapper_talk | key 79, halo 142, haze 7, speck 180 | 406 | 0 |
| vasco_climb | key 2, halo 12883, haze 650, speck 1170 | 14099 | 0 |
| vasco_coffee | key 2, halo 6327, haze 432, speck 1016 | 7356 | 0 |
| vasco_coffee_sip | key 213, halo 252, haze 41, speck 29 | 523 | 0 |
| vasco_coffee_talk | key 182, halo 102, haze 4, speck 81 | 367 | 0 |
| vasco_crouch | key 455, halo 481, haze 111, speck 1 | 1016 | 0 |
| vasco_deflate | halo 1822, haze 439, speck 279 | 2424 | 0 |
| vasco_delight | halo 3940, haze 238, speck 423 | 4316 | 0 |
| vasco_find | halo 3870, haze 184, speck 774 | 4523 | 0 |
| vasco_fluster | halo 3898, haze 159, speck 851 | 4583 | 0 |
| vasco_front | halo 3714, haze 93, speck 837 | 4272 | 0 |
| vasco_give | halo 3352, haze 119, speck 688 | 3891 | 0 |
| vasco_hand_out | key 169, halo 334, haze 33, speck 4 | 520 | 0 |
| vasco_hopeful | key 246, halo 278, haze 77, speck 34 | 621 | 0 |
| vasco_idle2 | halo 3861, haze 169, speck 742 | 4454 | 0 |
| vasco_idle3 | halo 4176, haze 140, speck 947 | 4896 | 0 |
| vasco_keys | key 205, halo 260, haze 36, speck 4 | 498 | 0 |
| vasco_kneel | halo 4315, haze 296, speck 573 | 4837 | 0 |
| vasco_kneel_down | halo 2824, haze 198, speck 234 | 3117 | 0 |
| vasco_kneel_look | key 90, halo 153, haze 2, speck 24 | 269 | 0 |
| vasco_kneel_lookup | key 319, halo 328, haze 75 | 701 | 0 |
| vasco_kneel_talk | halo 1779, haze 25, speck 208 | 1952 | 0 |
| vasco_laugh | halo 3941, haze 152, speck 798 | 4536 | 0 |
| vasco_pass1 | halo 3678, haze 148, speck 592 | 4107 | 0 |
| vasco_pass2 | halo 2823, haze 134, speck 475 | 3202 | 0 |
| vasco_scandalised | key 178, halo 226, haze 51, speck 97 | 541 | 0 |
| vasco_sit | halo 2998, haze 105, speck 664 | 3527 | 0 |
| vasco_stand_up | key 196, halo 267, haze 23, speck 30 | 510 | 0 |
| vasco_stepback | key 244, halo 233, haze 26, speck 4 | 497 | 0 |
| vasco_stern | key 314, halo 210, haze 37, speck 36 | 592 | 0 |
| vasco_talk | key 2, halo 5825, haze 509, speck 722 | 6702 | 0 |
| vasco_talk2 | halo 3880, haze 162, speck 858 | 4513 | 0 |
| vasco_talk3 | halo 4394, haze 198, speck 845 | 5103 | 0 |
| vasco_talk4 | key 181, halo 277, haze 64, speck 90 | 595 | 0 |
| vasco_talk_count | key 233, halo 328, haze 49, speck 13 | 607 | 0 |
| vasco_talk_point | key 202, halo 210, haze 11, speck 5 | 423 | 0 |
| vasco_tender | halo 3818, haze 370, speck 417 | 4350 | 0 |
| vasco_trowel | halo 6116, haze 395, speck 760 | 6832 | 2 |
| vasco_trowel_talk | key 188, halo 273, haze 48, speck 47 | 545 | 0 |
| vasco_walk1 | halo 6426, haze 398, speck 533 | 7084 | 0 |
| vasco_walk2 | key 1, halo 7156, haze 553, speck 400 | 7867 | 0 |
| vasco_walk6_p1 | key 12, halo 3662, haze 304, speck 78 | 4027 | 0 |
| vasco_walk6_p11 | key 21, halo 2960, haze 335, speck 97 | 3394 | 0 |
| vasco_walk6_p13 | key 9, halo 2724, haze 317, speck 125 | 3159 | 0 |
| vasco_walk6_p15 | key 15, halo 3138, haze 345, speck 84 | 3570 | 0 |
| vasco_walk6_p3 | key 12, halo 3150, haze 380, speck 129 | 3656 | 0 |
| vasco_walk6_p5 | key 12, halo 2634, haze 350, speck 76 | 3065 | 0 |
| vasco_walk6_p7 | key 18, halo 2959, haze 316, speck 81 | 3353 | 0 |
| vasco_walk6_p9 | key 13, halo 3062, haze 265, speck 50 | 3366 | 0 |
| vasco_walk_far | key 203, halo 228, haze 29, speck 5 | 452 | 0 |
| vasco_walk_passF | key 134, halo 49, haze 6, speck 203 | 392 | 0 |
| vasco_walk_passN | key 111, halo 48, haze 36, speck 26 | 220 | 0 |
| vasco_walk_preF | key 58, halo 136, haze 11, speck 74 | 279 | 0 |
| vasco_walk_upN | key 173, halo 45, haze 35, speck 109 | 361 | 0 |
| vasco_worried | key 285, halo 196, haze 37, speck 55 | 565 | 0 |
| ze | key 12, halo 3869, haze 129, speck 837 | 4528 | 0 |
| ze_burst | key 1, halo 4059, haze 45, speck 1050 | 4920 | 0 |
| ze_dress | key 5, halo 1497, haze 20, speck 301 | 1750 | 0 |
| ze_give | key 8, halo 3910, haze 207, speck 965 | 4861 | 0 |
| ze_hammer | key 7, halo 3741, haze 189, speck 893 | 4608 | 0 |
| ze_shirtless | key 2, halo 989, haze 10, speck 278 | 1223 | 0 |
| ze_sit | white_pocket 75, key 3, halo 3211, haze 77, speck 858 | 4015 | 3 |
| ze_strip1 | halo 812, haze 9, speck 70 | 876 | 0 |
| ze_strip3 | key 9, halo 2078, haze 19, speck 599 | 2563 | 0 |
| ze_suspenders | key 1, halo 697, haze 5, speck 90 | 769 | 0 |
| ze_talk | white_pocket 53, key 10, halo 4043, haze 61, speck 1142 | 4912 | 31 |
| ze_talk2 | key 10, halo 3958, haze 47, speck 1164 | 4855 | 0 |
| ze_toss | key 4, halo 3801, haze 69, speck 1122 | 4622 | 0 |
| ze_walk6_p1 | key 22, halo 348, haze 1, speck 50 | 421 | 0 |
| ze_walk6_p11 | key 8, halo 170, haze 3, speck 131 | 310 | 0 |
| ze_walk6_p13 | key 20, halo 166, haze 1, speck 90 | 277 | 0 |
| ze_walk6_p15 | key 23, halo 201, haze 2, speck 116 | 341 | 0 |
| ze_walk6_p3 | key 15, halo 233, haze 1, speck 138 | 387 | 0 |
| ze_walk6_p5 | key 25, halo 203, haze 1, speck 100 | 329 | 0 |
| ze_walk6_p7 | key 23, halo 201, haze 2, speck 116 | 341 | 0 |
| ze_walk6_p9 | key 17, halo 248, haze 1, speck 69 | 332 | 0 |
| ze_walkA | key 9, halo 3539, haze 79, speck 841 | 4242 | 0 |
| ze_walkB | key 13, halo 2914, haze 23, speck 772 | 3535 | 0 |
