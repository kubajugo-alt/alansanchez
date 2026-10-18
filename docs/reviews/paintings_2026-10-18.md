# The Drowned Bell: review of the full-screen paintings

Read-only review of `art/stills/*` and `art/closeups/*` against the backgrounds (`art/bg/*`), the character sprites and `art/style_refs/*`, the code that shows each painting, `js/lines.js` and `docs/STORY.md`. No repo files were changed and no paid API was called.

## Contact sheets and data (in this folder)

| File | Contents |
|---|---|
| `sheet_01_coldopen_intro.jpg` | Opening: Madragoa, the five Maria paintings, the legend, the intro, the city paintings |
| `sheet_02_transitions.jpg` | Chapter transitions tr1–tr5 (15) |
| `sheet_03_fado.jpg` | Fado slideshow (8) |
| `sheet_04_story_flashbacks.jpg` | 1755, 1955 a/b/c, se_reserve, lisbon_bells (unused) |
| `sheet_05_epilogue.jpg` | Epilogue vignettes and post-credits (10) |
| `sheet_06_romance.jpg` | Romance stills, including 4 unused ones |
| `sheet_07_closeups.jpg` | Close-ups (7) |
| `sheet_08_bg_reference.jpg` | 12 backgrounds as the style reference |
| `cast_1.jpg`, `cast_2.jpg` | Sprite line-up: Alan, Inês, Vasco, Zé, Rui / Tomás, Amália, Lacerda, Celeste, Abílio, Teixeira, Duarte, Maria |
| `sheet_09_pixel_crops.jpg` | 2x pixel crops showing upscaled/mushy stills next to crisp ones |
| `sheet_10_location_consistency.jpg` | Tower, Ferreira tide clock and Lacerda shelf: background against still against close-up |
| `views/*_gamma.jpg` | Gamma-lifted copies of the darkest stills (shelf, tr4_shop, tr4_machine, tr5_cistern) |
| `metrics.txt` / `metrics.json` | Per image: size, mean brightness, saturation, warmth (R−B), contrast, Laplacian variance (sharpness), 8-px block ratio (JPEG/upscale), flat-area share, dark-border run |
| `upscale_check.txt` | PSNR after a 2x/3x down-up resample. A high value means little real detail, so the image was probably upscaled. |
| `metrics.py`, `sheets.py`, `spr.py` | Scripts used to make the sheets and numbers |

**Format:** every still is 1280×720 (16:9). The close-ups are 1200×675, 1280×720, 1200×896, 1200×1200 (×2) and 895×1200, matching their `land`/`wide`/`square` CSS classes. None of them has real letterboxing. The non-zero "dark border" values in `metrics.txt` all come from dark painted edges such as night scenes and vignettes.

## How the set breaks down by style

The game has two reference looks. The backgrounds are soft, painterly and fairly dark, with no outlines. The sprites are inked: dark outlines, hatching and warmer, more saturated colour. The paintings fall into five groups:

| Group | Paintings | Fit |
|---|---|---|
| A. Painterly, like the backgrounds | Maria/Madragoa set, bell_legend, newspaper, alfama_sign, tideclock_hand, all 15 transitions, all 8 fado, shelf, close-ups | Good match to the backgrounds. Many are upscaled from about 640 px wide and are soft or JPEG-mushy (Laplacian variance 7–40 against 100–600 for the backgrounds). |
| B. Inked, like the sprites | Epilogue: city_morning, drawer, shop_after, amalia_box, tavern_full, quay_sweater, jacket, abilio_ring, phone; ze_kiss, ze_bunk; (lisbon_bells, unused) | Best match for faces and costumes. Sharp, with the highest Laplacian variance (300–1200). |
| C. Warm oil "romance" paintings | cop_shelf, cop_bed, guitar_bed, cigarettes (+ unused cop_cuffed, cop_smoke, se_pit, se_kiss) | Consistent within the group. Warmest and most saturated in the game (sat 190–218, R−B 40–60). |
| D. Etching/graphic-novel flashbacks | 1755, 1955_a/b/c | A deliberate style break. The engine adds sepia and grain, and all four read as one series. Fine. |
| E. Soft anime / matte look | still_intro, tr5_dawn (and partly city_morning) | The outliers. still_intro is the first image the player sees. |

None of the paintings looks photographic or 3D-rendered, and none has a watermark. The over-smooth "AI sheen" shows most in tr1_se_fog, fado_fog, fado_wave, tr4_machine and maria_dawn, which are the upscaled, low-detail ones.

## Every painting

Verdicts: **OK**, **minor** (small fix or acceptable as is), **redo** (repaint or inpaint before shipping).

### Opening (main.js `opening`, coldopen.js `S.mariaPaintings`, `S.introLegend`, `S.introCity`)

| File | Used where | Verdict | Reason |
|---|---|---|---|
| still_intro | First painting, narr_intro_1 (main.js:148). Fallback for narr_intro_2. | minor | Style outlier: soft anime/Ghibli cel look, nearly greyscale (sat 18 against 40–200), unlike the madragoa and legend paintings that follow it |
| still_bell_legend | narr_intro_legend | OK | Bell under the city, moody. Slightly smeary, which is fine at this darkness. |
| still_madragoa | narr_maria_1 | OK | Night, fog, one lit window, the Estrela dome (right for Madragoa) |
| still_maria_sleep | narr_maria_2 | OK | Apron on the chair, lantern. Matches Maria's sprite (grey hair, black dress). |
| still_maria_tile | narr_maria_3 | OK | Wet blue-and-white tile on the pillow, Maria waking |
| still_maria_list | narr_maria_4 | minor | Low effective resolution (upscaled). The paper is unreadable, which is acceptable here because the narration names the people. |
| still_maria_water | narr_cold_open | **redo** | Maria is lying peacefully asleep again although she has just woken and read the list. The tile floats on the water instead of lying on the pillow or the boards. |
| still_maria_dawn | narr_maria_6 | minor | The empty bed contradicts narr_intro_tiles ("each of them found in a dry bed"). Very dark (brightness 21), and the push-in reaches 1.35×, which exposes the upscale. |
| still_newspaper | narr_intro_2 + narr_intro_tiles | OK | Portuguese is correct ("TERCEIRA AFOGADA NA CAMA", "Nevoeiro no nono dia", 50$00) and the 1995 details are right. The body text is lorem-style, which is fine at this size. |
| still_tideclock_hand | narr_intro_clock (Lacerda) | minor | Dark suit sleeve, while tr3_case shows Lacerda's cream suit as in his sprite. Upscaled. |
| still_alfama_sign | narr_intro_alfama_2 | OK | "LIVRARIA SANCHES" spelled correctly. Matches street.jpg (tiles, stairs, lamp). |

### Chapter transitions (transitions.js `S.TRANSITIONS`)

| File | Line | Verdict | Reason |
|---|---|---|---|
| still_tr1_maria | narr_tr1_1 | minor | A different room from the opening Maria series: window on the other wall, a crucifix, white bedding |
| still_tr1_list | narr_tr1_2 | **redo** | The "four names" are garbled pseudo-script ("Smmmd…"), and the pan and zoom push right onto them. They should read Ferreira, Bastos, Coutinho, Sanches. The tile is beige, not blue-and-white. |
| still_tr1_se_fog | narr_tr1_3 | minor | Lowest effective resolution in the set (resample PSNR 51, Laplacian variance 7). Purple dusk sky, but Ch. I ends at 13:30. |
| still_tr2_lavadouro | narr_tr2_1 | OK | Matches lavadouro.jpg |
| still_tr2_tideclock | narr_tr2_2 | minor | Night city through the window at 15:30. Its tide clock (carved wood, Roman numerals, wave in the dial) differs from close_tideclock (brass, Arabic numerals, wave sub-dial). |
| still_tr2_ines | narr_tr2_3 | minor | Inês matches her sprite (curls, sunglasses on her head, hoops, bangles, black blazer). The window shows night at 15:30, and the image is upscaled. |
| still_tr3_bells | narr_tr3_1 | OK | Matches se_tower.jpg exactly (sheet 10) |
| still_tr3_tomas | narr_tr3_2 | OK | Tomás matches (white hair, cassock, rosary). Carmo at night like convent_night.jpg. |
| still_tr3_case | narr_tr3_3 | OK | Cream sleeve (Lacerda), tongue in the case, good |
| still_tr4_boat | narr_tr4_1 | OK | Dusk, fog, boat |
| still_tr4_shop | narr_tr4_2 | **redo** | The cat on the counter is a grey/brown tabby with glowing green eyes. Pessoa is a fat orange tabby (sprite and still_shop_after). Matches shop.jpg otherwise. |
| still_tr4_machine | narr_tr4_3 | minor | Brightness 11.5/255 makes it nearly black under the engine vignette. Upscaled with block artefacts. The 1990s cassette machine is fine. |
| still_tr5_cistern | narr_tr5_1 | OK | Matches cistern.jpg |
| still_tr5_dawn | narr_tr5_2 | OK | Deliberately bright warm dawn (the fog lifts). Smoother, anime-like finish, but it works as the release. |
| still_tr5_receiver | narr_tr5_3 | OK | Alan's brown leather sleeve and hand are fine, rotary phone. Nitpick: a sunny square outside instead of the alley. |

### Fado slideshow (transitions.js `S.FADO_SLIDES`, lyrics in ch1.js `S.SINO_LYRICS`)

| File | Lyric | Verdict | Reason |
|---|---|---|---|
| still_fado_harbour | "Nine days the fog lies over the river…" | minor | The big ship flies a stars-and-stripes flag (anachronistic in 1755). Sunny and clear under a fog lyric. Brightest and most classical of the set. |
| still_fado_widow | "nine nights the bronze sleeps…" | OK | |
| still_fado_cistern | "The founders… cut out its tongue" | OK | Nitpick: shows mourners praying, not the tongue being cut |
| still_fado_pour | "bound it with the blood…" | **redo** | A giant disembodied arm reaches in from the top-right corner, out of scale with the figures, dripping a chain of blood. The crucible looks like a wicker basket. Upscaled. |
| still_fado_lowering | first chorus | OK | |
| still_fado_fog | "the sea is long, your blood is your fate" | **redo** | The lone modern man reads as Alan but has blond hair, a green jacket and no leather. Heavy upscale mush (Laplacian variance 17, PSNR 48.8). |
| still_fado_wave | "Where the Carmo prays without a roof…" | minor | Very low detail and soft (Laplacian variance 13, block ratio 1.37) |
| still_fado_alfama | "turn the letters seven times…" | OK | Young Joaquim and Amália outside a fado house. A nice echo of close_photo1934. |

### Story stills

| File | Used where | Verdict | Reason |
|---|---|---|---|
| still_1755 | ch3.js:133, narr_1755 (sepia) | OK | Etching style, consistent with the 1955 set |
| still_1955_a | ch5.js:51, tomas_boy | minor | A smudged blob under the bell mouth (inpaint smear). Otherwise strong: Afonso drowning, the tongue in Joaquim's hand. |
| still_1955_b | tomas_ran | OK | Vicente watching from the stairs, good |
| still_1955_c | tomas_count, tomas_1955_water | OK | Dawn in the Carmo fits "the fog lifts on the tenth dawn" |
| still_se_reserve | se.js:474, narr_reserve + Joaquim's card | minor | Inês matches. The open arch shows a bright sunny cloister in the middle of the nine-day fog (Ch. I). Slightly flatter comic rendering than the rest. |

### Epilogue (ch5.js:429–441)

| File | Line | Verdict | Reason |
|---|---|---|---|
| still_city_morning | narr_epilogue | OK | The bright saturated postcard look is deliberate for "the fog lifted". Leans anime. The shop front at left matches street.jpg. |
| still_drawer | narr_epi_drawer | OK | Rui matches his sprite exactly. The room is police.jpg. |
| still_shop_after | narr_epi_shop2 | minor | No bronze tongue on the bookbinding press, though the line is about it. Inês and orange Pessoa match. |
| still_amalia_box | narr_vig_box | OK | Amália matches |
| still_tavern_full | narr_vig_night | minor | Alan is not in the room though "Alan bought the ginjinhas". Red wine instead of ginjinha. The crowd dresses 1930s–50s (flat caps, waistcoats) rather than 1995. Amália and Duarte match. |
| still_quay_sweater | narr_vig_ze | OK | Celeste and Zé match their sprites exactly |
| still_jacket | ze_back | OK | Cream linen jacket = Lacerda's, as STORY.md specifies, at dawn |
| still_abilio_ring | narr_vig_abilio | OK | Abílio matches. The tower matches se_tower.jpg. |
| still_shelf | narr_post | **redo** | Mean brightness 6/255 makes it almost black on screen. The central clock does not show 6:25 (the line: "stopped at twenty-five past six"). Different clocks and shelf from close_clocks. Soft painterly style in the middle of the inked epilogue. |
| still_phone | narr_call | minor | Alan is exactly on-model. The desk phone still has its handset on the cradle while he holds one. |

### Romance and visit stills (ch4.js, visits.js)

| File | Used where | Verdict | Reason |
|---|---|---|---|
| still_ze_kiss | ch4.js:386, narr_rom_1 | OK | Alan and Zé on-model, hands fine |
| still_ze_bunk | ch4.js:389 | OK | |
| still_cop_shelf | visits.js:216, narr_room_cop | minor | Night city through the window, but Teixeira's visit is in Ch. II (13:30–15:30), and bedroom.jpg shows foggy day |
| still_cop_bed | visits.js:235 | minor | Same night or dusk window. Alan's hair is lighter brown and his face is older and more lined than his sprite. |
| still_guitar_bed | visits.js:321, narr_room_guitar | OK | Duarte (moustache) and Alan on-model. Nitpick: the instrument reads as a mandolin or lute rather than a guitarra portuguesa. |
| still_cigarettes | visits.js:376, narr_key_later | OK | Alan on-model, outside a tabacaria |

### Close-ups (docs.js, se.js, ch3–5)

| File | Used where | Verdict | Reason |
|---|---|---|---|
| paper_aged | Every document page | OK | |
| close_photo1934 | S.showPhoto | OK | Amália, Joaquim and the music box, as specified |
| close_porthole | S.showPorthole | OK | Dark, but the tile reads |
| close_tideclock | S.showTideClock (hands drawn live) | minor | Arabic numerals and a brass case, while tr2_tideclock shows Roman numerals and a wooden case. Pick one design. |
| close_bronze | S.showBellMark | OK | |
| close_clocks | S.showClocks (tags F. 03:12, B. 15:38, C. 04:01, J.C. 18:25 drawn as HTML) | minor | The painted hands show none of the tagged times (mostly a stock 10:10) |
| close_drawerlock | Drawer combination (wheels drawn live) | OK | |

### Unused painting files

| File | Status |
|---|---|
| still_cop_cuffed | Not in `window.STILLS`, so never preloaded and never shown. Listed on the `?review` screen (review.js:31), but because it is not preloaded its button shows nothing (engine.js:1585 finds no image). |
| still_cop_smoke | Same |
| still_se_pit | Same (review.js:34) |
| still_se_kiss | Same |
| still_lisbon_bells | Referenced nowhere. A bright, sharp inked painting of the Sé and the shop street in sunshine. It would suit the epilogue. |

Referenced in code but missing on disk: `still_store_kiss`, `still_store_after` (se.js:798–805, S.vascoLove). Both have a fallback, but STORY.md lists them as the reserve love-scene paintings. They are also absent from `STILLS`/`EXTRA_STILLS`, so they would not load even once the files exist.

## Problems by severity

### Redo (6)

1. **still_tr1_list:** the list of four names is garbled pseudo-handwriting, and the camera pushes right onto it while the narrator says "Four names". Repaint it with legible "Ferreira / Bastos / Coutinho / Sanches", or blank the paper and overlay the names as the closeups do. Make the tile blue and white.
2. **still_fado_pour:** an oversized disembodied arm enters from the top-right corner, out of scale with the founders. The crucible reads as wicker. Repaint the blood oath with a founder's own hand over the mould.
3. **still_fado_fog:** the modern figure at the miradouro has blond hair, a green jacket and jeans. If he is Alan, he needs dark wavy hair, the brown leather jacket and the white tee. If he is anyone else, he is confusing in a song sung to Alan. The image is also heavily upscaled and mushy.
4. **still_tr4_shop:** the cat is a grey tabby with glowing eyes, but Pessoa is a nine-kilo orange tabby (sprite, still_shop_after). Inpaint the cat.
5. **still_shelf** (post-credits): nearly black (mean 6/255; see `views/still_shelf_gamma.jpg` for what is there). The tagged clock does not show 6:25, and the shelf and clocks don't match close_clocks or antiques.jpg. Brighten it, set the hands to 6:25, and match the close_clocks clocks.
6. **still_maria_water:** Maria is asleep and serene in the painting right after she wakes and reads the list. The tile floats on the water. She should be awake, sitting up, with the water rising, and the tile on the pillow or the boards.

### Fix (should be addressed)

- **still_intro:** the first image of the game is in a different, soft anime or matte style and almost greyscale, and the bell_legend and Madragoa paintings that follow it look quite different. Repaint it in the background style (or the bell_legend palette).
- **Upscaled, low-detail stills.** These are visibly soft or blocky at 1280 px, and worse under the 1.06–1.35× Ken Burns zoom: tr1_se_fog, fado_fog, fado_wave, fado_pour, tr4_machine, maria_dawn, maria_list, maria_water, cop_shelf, tr3_case and tideclock_hand (`upscale_check.txt`, `sheet_09_pixel_crops.jpg`). Re-export them from the source at full resolution where a source exists.
- **Time of day against the chapter clock.** Ch. I ends at 13:30, Ch. II runs 13:30–15:30, and Ch. III ends at 17:15, but several of these paintings show night windows or a dusk sky:
  - still_tr1_se_fog (dusk), still_tr2_ines and still_tr2_tideclock (night windows)
  - still_cop_shelf and still_cop_bed (night windows during the afternoon visit)
  - still_se_reserve (bright sun on a nine-day-fog day)
  
  Either repaint the windows as foggy daylight or accept "fog-dark" as a convention.
- **still_fado_harbour:** remove the stars-and-stripes flag (use Portuguese royal colours). Fog to fit the lyric would help.
- **close_clocks / still_shelf:** the hands should show the tagged times (F. 03:12, B. 15:38, C. 04:01, J.C. 18:25), since the story uses "the clock that stopped at 18:25".
- **Tide clock design.** The Ferreira tide clock looks different in each of still_tr2_tideclock, close_tideclock and still_tideclock_hand. Pick one design.
- **Lacerda's sleeve.** still_tideclock_hand shows a dark suit with a white cuff. still_tr3_case and his sprite show a cream suit.
- **still_tr1_maria:** a different bedroom from the opening Maria series. Repaint it from still_maria_sleep's room (window right, iron bed, picture over the bed).
- **still_shop_after:** add the bronze tongue on the bookbinding press, which narr_epi_shop2 describes.
- **The four romance stills in review.js.** cop_cuffed, cop_smoke, se_pit and se_kiss are listed on the review screen but not preloaded, so they show black. Either add them to `EXTRA_STILLS` or drop them from `COMBINED_STILLS`.
- **The reserve love-scene paintings.** still_store_kiss and still_store_after do not exist yet, and they would also need adding to the preload list.

### Nitpick

- still_maria_dawn: the empty bed contradicts "found in a dry bed".
- still_1955_a: a smudge under the bell mouth.
- still_tavern_full:
  - Alan is absent though the line says he bought the round.
  - The glasses hold wine rather than ginjinha.
  - The crowd is dressed for the mid-century, not 1995.
- still_phone: a second handset sits on the cradle.
- still_cop_bed: Alan's hair and face drift off-model.
- still_guitar_bed: the instrument reads as a mandolin or lute rather than a guitarra portuguesa.
- still_fado_cistern: shows mourners rather than the cutting of the tongue.
- still_tr5_receiver: the shop window opens on a sunny square instead of the alley.
- still_tr4_machine and still_tr5_cistern are very dark (brightness 11–18). With the engine's 0.55 vignette they are close to black on dim screens.

## Consistency across the series

- **Opening (Madragoa and Maria).** madragoa, sleep, tile, list and dawn are one series: the same room, lantern and palette. The weak points are maria_water (the story) and still_intro, which sits in front of the series in a different style. still_tr1_maria later shows a different room.
- **Chapter transitions.** These are coherent: dark, warm, painterly and similar to the backgrounds. tr5_dawn is a deliberate bright exception. The softness of the upscaled ones varies a lot from shot to shot.
- **Fado.** This reads as one "old oil painting" series, apart from fado_fog (a modern figure, mush) and fado_harbour (much brighter and sunnier). fado_pour has the anatomy problem.
- **Epilogue.** This is one crisp inked series that matches the sprites, apart from still_shelf, which is dark and painterly. Strong character consistency: Rui, Inês, Pessoa, Amália, Celeste, Zé, Abílio and Alan are all on-model.
- **Flashbacks** (1755, 1955 a–c). Consistent etching style, set apart on purpose by the sepia and grain.
- **Romance.** Consistent warm oil style. Alan is on-model except for a drift in cop_bed.
