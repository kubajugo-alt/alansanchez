# Game II: how believable the room movement is (review, 2026-10-30)

How it was checked: a clean `git archive HEAD:sequel` export served locally. Each room was entered with
`Game.goRoom(..., {instant, noEnter, noSave})` at a chapter where it is used, with Alan and the NPCs hidden and
`window.CALM = true` (this stops the parallax camera drift, so only the room's own movement is left). 59 lossless
canvas frames were taken at about 10 fps (about 6 s) for 30 room states. From those I computed the per-pixel spread
over time (heatmaps `env_movement/heat_*.jpg`) and the frame differences, and looked at the crops myself. In the
`env_movement/*.jpg` crops: left = frame, middle = difference between the two most different frames ×6,
right = per-pixel spread.

Two more checks:
- **The overlay alone.** Each room's `animBack` was rendered over the raw painting offscreen, without the grade or
  vignette (`02*_overlay_delta_*.jpg`: grey = unchanged, brighter or darker = what the overlay changes, ×8).
- **The seven sea loops.** The `art/video/*.mp4` files were analysed frame by frame (`05_sea_loops_stall_and_jump.jpg`).

No game file was changed.

## Verdict

The idea and the amount of movement are right. Most rooms read as "a still painting with a little life", which is
the Monkey Island / Broken Sword register, and the story rules hold: Santa Ana's clock and the bells don't move and
the courtyard fountain is dry. Candles, the vault torch, motes in light shafts, steam, the answering-machine blink,
the moths and the Isleta sky are good.

What lets it down is technique, not taste. Four mechanical faults repeat across rooms and are what a player would
notice first:

1. **The sea loops pause and then jump every 5 s.** In all seven loops the water slows to a near-stop at the end of
   the clip (Isleta and the hotel room freeze for about 0.4 s), then pops back to frame 1. The jump is 3 to 12 times
   a normal frame step. It is the most visible rhythm in the game's best-looking rooms.
2. **Row-shift helpers (`FX.sway`, `ripple`, `billow`, `breathe`) work on rectangles of the raw painting.**
   - Whatever falls inside the rectangle moves too: window frames, a pillar, a sign, rock, the road behind the rosary.
   - Each rectangle's free edge tears against the static painting next to it.
   - They redraw the original painting over clouds that were already drawn, which leaves rectangular holes in the
     moving cloud layer (Santa Ana, Canteras, beach).
3. **The cloud overlays (`drift`) brighten the sky and are clipped with hard rectangles or polygons.** The clip
   shape shows as a tonal step (Canteras, hotel room, beach top-left). In the camp they slide in front of the table,
   the radio and the poles.
4. **The prologue car (`elena_car`) has a pale hard-edged quad over the dashboard.** A cloud texture also slides
   across the steering wheel and dashboard. It is the first room of the game.

Rhythm is second-order but real. Every sway is a single sine at `1.6·speed` rad/s, so plants pulse like
metronomes. Several electric fittings flicker like flames, and the camp's storm lantern pulses ±37%. Two exterior
rooms (`colon_out`, `museum_out`) have no movement at all.

## Fixes that touch many rooms

**G1. Sea loops: remove the stall and the jump** (`scripts/sea_clips.py`). Measured per-frame change inside the mask:

| loop | normal step | last 6 frames | jump back to frame 1 |
|---|---|---|---|
| beach | 0.99 | 0.74 | 3.9 |
| beach_sun | 1.95 | 1.39 | 5.1 |
| canteras | 0.54 | 0.39 | 2.6 |
| hotel_lobby_day | 0.52 | 0.26 | 3.8 |
| hotel_restaurant | 1.20 | 0.55 | 4.4 |
| hotel_room | 0.27 | 0.04 | 3.4 |
| isleta | 0.56 | 0.00 (10 frozen frames) | 2.2 |

Kling eases into the start and end image, so a start = end loop always "breathes" at its seam. To fix it:

1. Drop the leading and trailing frames whose step is below 0.4× the median.
2. Make the loop seamless with a crossfade. Take the last N≈12–18 frames and blend frame `L−N+i` into frame `i`
   with weight i/N; the output is frames N..L−N followed by the blended run. This is the standard video-loop trick.
   The waves still keep moving because both parts move.
3. For hotel_room and isleta, where the motion is tiny, also consider a 10 s generation and loop its middle.

No new generation is needed for the other five. Effort: about 2 h in the script, plus re-export and a check.

**G2. Draw order: row-shift effects first, overlays after.** In every `animBack`, call `FX.sway`, `billow`,
`ripple` and `breathe` before `drift`, `panza`, `birds` and the glows. That alone removes the cloud holes in
Santa Ana, Canteras and the beach. It is the cheapest high-value change (≈30 min).

**G3. A masked, edge-feathered sway.** Add `FX.swayM(g, im, rect, t, amp, phase, up, mask)`:
- per row, `dx` as now, but drawn through a feathered mask of only the foliage or cloth;
- amplitude multiplied by `smoothstep` over 6–10 px at all four rectangle edges.

The mask can be a small hand-painted PNG per element in `art/fx/` (the paintings themselves stay untouched), or a
hue-based flood fill like `skyMask` (greens for palms). Then the window frames, pillars, signs, stones and the
facade behind each plant stop moving, and no rectangle edge tears. Effort: helper ≈2 h, masks ≈10 min each.

**G4. Natural rhythm for sway.** Inside `FX.sway` and `billow`, replace `Math.sin(t*1.6 + phase + f*1.2)` with a
slow gust envelope times two incommensurate sines:

```js
const gust = 0.55 + 0.45 * Math.sin(t * 0.21 + phase * 2.3) * Math.sin(t * 0.13 + phase);
dx = (0.7 * Math.sin(t * 1.6 + phase + f * 1.2) + 0.3 * Math.sin(t * 2.7 + phase * 1.7 + f * 2)) * amp * f * f * gust;
```

This applies everywhere at once and keeps "there's no wind": it stays tiny and is still most of the time.
Effort: 20 min plus a look at each room.

**G5. Clouds: a feathered sky mask everywhere, and no net brightening.**
- Use Wednesday's `skyMask(flood fill + blur)` (move it into a shared helper) for gando, canteras, beach,
  hotel_room, restaurant and courtyard instead of hand rectangles and polygons.
- Draw clouds as Wednesday's two-tone `panza` (a dark bank plus a pale one, average close to zero) instead of
  `drift`'s pale-only bank at `a: 0.35–0.4`. That bank lifts the sky by up to about 15 levels and makes any clip
  edge visible.
- If `drift` is kept, use `a: 0.2` and `rgb` sampled from the painted sky.

Effort: ≈2 h.

**G6. Electric lights don't flicker.** In tue.js, `lamp(..., live=true)` uses `FX.flicker` (sines at 11, 27 and
53 rad/s, so every lantern pulses in the same pattern). Use `live=false` for anything electric. For real flames,
prefer the engine's `lights` kinds (`candle`, `flame`, `gas`), which add noise. Effort: 15 min.

## Room by room

Chapter used for capture in brackets. "OK" means I have nothing to change.

### elena_car (prologue, phase 0) — HIGH
- **What moves:** stars twinkle; the moon glow; "moonlight on the cloud tops" (`FX.water` strip); the radio dial;
  headlights; the cloud.
- **Works:** stars, radio dial.
- **Wrong 1: a pale quad over the dashboard.** The "cloud outside" fill
  `moveTo(130,70)…lineTo(1230,515)…lineTo(50,515)` at alpha 0.25 is a pale trapezoid with straight edges. It covers
  the windscreen and half the dashboard (`01_elena_car_*.jpg`). It reads as a rendering bug.
  - Fix: clip it to the windscreen glass, using the glass polygon from the painting (≈ 60,35 → 1215,35 → 1180,370 →
    90,370) or a mask, before the fill.
- **Wrong 2: clouds slide across the car interior.** `FX.drawClouds(g, S.nightClouds, t, 30, 360, 0.3)` is drawn
  at y = 360–720, over the steering wheel and dashboard, at 30 px/s.
  - Fix: clip it to the same glass, draw it at y ≈ 200 (the sea of cloud is at y 190–370) and slow it to `speed 6`.
- **Wrong 3: the moonlit strip is too busy.** `FX.water(g, t*0.5, 820,196,240,16, …)` puts 70 strokes in a
  240×16 px band, which reads as a glitter scanline (`crops elena_water`).
  - Fix: use `glints` from wed.js instead, e.g. `glints(g, t, [820,192,240,20], 8, '200,212,240', 0.12)` (move
    `glints` into FX), or `FX.water` with a lower `n`.

### gando [1] — LOW
- **What moves:** clouds through the panes, two gulls, the belt slats and two sheen bands, the strip-light glow,
  the palm at the taxi door.
- **Works:** the belt idea; birds at size 4 read as distant gulls.
- **Wrong 1: the strip light breathes.** It is a fluorescent tube using
  `lamp(...0.94+0.06·sin(0.9t))`, a slow pulse that tubes don't do.
  - Fix: make it a `lights` entry `{x:390,y:46,kind:'tube',glow:130,ga:0.07,rgb:'255,240,200'}` (steady, with a
    rare stutter), or simply steady.
- **Wrong 2: the belt slats are flat.** They are vertical lines at a constant 26 px across a belt seen in
  perspective, with the fan-shaped end slats painted.
  - Fix: space them by perspective (closer towards x 858) and lower the alpha to 0.035.

### hotel_lobby, by day [2] and by night [1, reception done] — MEDIUM
- **What moves:** palms through the street windows; the sea loop by day (canvas ripple at night); the wall
  lantern; the desk lamp; the promenade lamp at night.
- **Wrong 1: the window frame moves.** The palm rectangle `[100,82,110,66]` includes the window's top rail and
  transom, which wobble with the palm (`09_lobby_window_frame_sways.jpg`). The left rectangle `[0,62,74,64]` cuts
  the fronds at its edges.
  - Fix: G3 with a frond mask, or shrink the rectangle to the glass (`[104,92,104,54]` and `[0,70,64,52]`), plus G2.
- **Wrong 2: the wall lantern flickers like a flame.** It is an electric lantern and its glow swings 8% from frame
  to frame (`lamp(g,t,398,162,46,…,0.22,3,true)`).
  - Fix: `live=false`, or a `gas` light at most (G6).
- **Wrong 3: the night lobby is almost dead** (2.3k moving pixels).
  - Fix: keep it calm, but add a slow passing headlight sweep on the street windows,
    `FX.sweep(g, t, [0,40,240,380], 17, '255,240,210', 0.06)`, plus the promenade lamp's glow on the wet pavement.
    Low priority.
- **Sea loop:** see G1 (it freezes for its last 2 frames, then jumps 3.8).

### hotel_room [1] — MEDIUM
- **What moves:** clouds in the doorway, the sea loop, the curtains (billow), the ceiling fan, the lamp.
- **Works:** the curtains breathing, which is believable with the balcony open; the fan.
- **Wrong 1: the cloud clip shows as a line.** `drift(..., [[860,112,140,165]])` starts at y = 112, but the sky in
  the doorway starts at about y = 75. That leaves a horizontal edge across the sky at y = 112 (`12_*.jpg`; the
  overlay delta shows a bright block with a sharp top).
  - Fix: G5 mask, or the rectangle `[858,72,146,210]` with `a: 0.2`.
- **Wrong 2: the loop is the weakest one.** Its motion is tiny (0.27/frame), and in the last 0.4 s it is frozen
  before a jump 12× the normal step.
  - Fix: G1. If it is still too still after the crossfade, regenerate it (10 s, "small waves breaking on the beach
    below").
- **Minor:** the two curtains are on near-identical periods (8 s and 9 s). Make them 8 s and 11.5 s.

### canteras [1] — HIGH
- **What moves:** clouds, gulls, the sea loop, the palms by the hotel, the newspapers on the kiosk.
- **Works:** the sea loop itself, the gulls, the newspapers stirring.
- **Wrong 1: the cloud clip edges show** (`04_canteras_sky_clip_edges.jpg`). The clouds lift the sky by up to about
  15 levels, inside hard rectangles `[300,0,620,345]` and `[0,0,300,160]`, so there is a visible step at y = 160
  over the kiosk and at x = 300 and x = 920.
  - Fix: G5 (skyMask plus two-tone `panza`).
- **Wrong 2: holes in the clouds behind the palms.** The palm sway rectangles redraw the raw painting over the
  clouds, leaving rectangles with no cloud.
  - Fix: G2.
- **Wrong 3: the hotel sign wobbles.** The rectangle `[920,40,250,240]` contains the "HOTEL CRISTINA" sign and the
  pillar of the portico, which wobble (the overlay delta shows the sign's outline).
  - Fix: G3, or split it into a crown-only rectangle `[920,40,170,110]`.
- **Sea loop:** G1.

### museum_out [1] — MEDIUM (missing)
- **What moves:** nothing.
- **Fix:** it is an exterior under an overcast sky; every other street moves. Add the shared sky with
  `panza(g,t,skyMask('museum_out',TOP,200),0.45)` and one bird,
  `FX.birds(g,t,{y0:30,y1:110,n:1,period:27,size:4,color:'rgba(44,44,50,0.55)'})`. At night (if it is seen at
  night), the street lamps as `gas` lights.

### museum_hall [1] — MEDIUM
- **What moves:** five lantern glows; the courtyard plants through the door; Carmen's smoke (before the reception).
- **Works:** the smoke drifting in at the door is a nice story touch.
- **Wrong 1: electric lanterns flicker like flames, together.** These are electric lantern fittings in a museum,
  and `lamp(...,true)` flickers each by 6–7%.
  - Fix: `live=false` (G6).
- **Wrong 2: the stone column sways with the plants.** The plant rectangles `[1102,330,40,140]` and
  `[1150,395,40,70]` include the left column's edge and the arch (`14_museum_hall_pillar_sways.jpg`).
  - Fix: G3 mask, or move the rectangles onto the plants only (`[1112,350,30,120]`).

### beach [1] and beach_sun [1, sun_out] — HIGH
- **What moves:** clouds (grey day), gulls, the sea loop, the umbrella "skirt", two palms.
- **Works:** the sea loops look good mid-cycle; the gulls; the clip that follows the roofline (from entry 28).
- **Wrong 1: the cloud bank whitens the whole sky** (+15 levels, `drift a:0.4`). The polygon edge
  `[58,40]→[70,110]` near the top-left palm makes a straight cut in the cloud.
  - Fix: G5 (two-tone `panza` at 0.45 with skyMask seeded from the top).
- **Wrong 2: palm rectangles.** `[168,160,80,95]` and `[330,225,60,70]` move the facades behind them and cut holes
  in the clouds (`02_overlay_delta`).
  - Fix: G2 + G3.
- **Wrong 3: the umbrella shears.** `FX.sway(g, im(), [62,334,240,84], t*0.9, 0.8, 0)` shears the whole canopy and
  the promenade wall and steps behind it. A beach umbrella is rigid; only its valance would flutter.
  - Fix: limit it to the valance band, `[66,392,232,22]`, with amp 0.6; or drop it.
- **Sea loops:** G1. beach_sun has the strongest jump (5.1).

### mercado [1] — MEDIUM
- **What moves:** two globe lamps (a slight breathe), motes under the glass roof, the right-hand stall's plants.
- **Works:** motes in the light.
- **Wrong: rigid things sway indoors.** The rectangle `[1000,280,280,200]` sways the "SÁBILA – ALOE VERA" sign and
  its post, and the aloes, which are stiff succulents, inside a covered market with no draught
  (`10_mercado_sign_and_aloe_sway.jpg`).
  - Fix: remove it.
  - Instead, for life: a slow ceiling-fan shadow, or a pigeon crossing under the roof with
    `FX.birds(g,t,{x0:300,x1:1000,y0:60,y1:140,n:1,period:31,size:4})` clipped to the glass.

### hotel_restaurant [1] — LOW
- **What moves:** clouds in the arches, the sea loop in the left window, two fans, steam over four chafing dishes,
  sconces.
- **Works:** fans, steam, sconces.
- **Wrong 1: clouds barely show.** The cloud rectangles don't cover the arches' sky (only a thin strip shows).
  - Fix: G5, or the rectangles `[0,60,158,170]` and `[298,40,102,180]`.
- **Wrong 2: the sea moves in only one window.** The middle arch also shows the beach and the bay edge, and it is
  static.
  - Fix: optional; it is far, so a soft `glints(g,t,[300,236,60,10],4,…,0.1)` would be enough.
- **Sea loop:** G1.

### museum_courtyard [1] — MEDIUM
- **What moves:** clouds, one bird, the dragon tree's crown, the bamboo, three wall lanterns. The fountain stays
  dry (correct).
- **Works:** the clouds follow the roofline well; the bird.
- **Wrong 1: the bamboo rectangle tears.** The top edge of `[295,160,140,300]` (up = true, so it moves most at the
  top edge) tears against the wall. The balcony post and rail inside it sway too (`11_*.jpg`).
  - Fix: G3, with the rectangle's top in sky or wall and a mask.
- **Wrong 2: the dragon tree sways.** A dragon tree's crown is stiff, so a swaying crown is unconvincing.
  - Fix: drop `FX.sway(... [945,135,300,155] ...)`, or set amp 0.3.
- **Wrong 3: the wall lanterns flicker.** They are electric, so G6.

### isleta [2] — LOW
- **What moves:** the two-tone panza through a flood-fill mask, the far palm, the sea loop, gulls, the gas lamp.
- **Works:** this is the best sky in the game; the gulls at size 8 read as gulls.
- **Wrong 1: frozen gulls.** The painting has two gulls painted in mid-air (≈315,120 and ≈1100,130). They hang
  frozen next to the moving ones.
  - Fix (optional): cut one as a sprite, paint it out with an overlay patch sampled from the sky, and fly it.
    Otherwise accept it.
- **Wrong 2: the loop's freeze.** The 0.4 s end freeze is the worst of all seven, so G1.
- **Gull flight:** constant flapping (see Birds below).

### santa_ana [2] — HIGH
- **What moves:** the panza; three palm rectangles; birds. The clock and the bells are still (correct).
- **Wrong 1: rectangular holes in the clouds.** Two of the palm rectangles cover sky: `[880,0,370,110]` and
  `[0,0,240,150]`. They are drawn after `panza` from the raw painting, so the clouds stop dead at x = 880 and in the
  top-left corner. That is a straight vertical edge in a moving sky (`02_overlay_delta`, top-left panel).
  - Fix: G2.
- **Wrong 2: a seam inside the lower crown.** `[860,130,180,120]` has its top edge (maximum shift) inside the
  palm's fronds at y = 130, so there is a 1 px horizontal seam through the crown, and its left edge cuts fronds
  (`03_*.jpg`).
  - Fix: G3, or start that rectangle in the sky at y = 108 and merge it with the upper one.
- **Wrong 3: the flood fill is patchy.** The fill stops at the towers, so some sky patches get no cloud.
  - Fix: add seeds between the towers (e.g. `[600,60]`, `[860,40]`) and use `tol: 18`.

### santa_ana_inside [2] — OK
- **What moves:** candle flames, the light shaft, motes.
- **Verdict:** good. The flames are well placed and small, and the motes stay in the shaft.

### belfry [2] — LOW
- **What moves:** the panza in the arch, the palm, glints, a bird, the clapper's rope, the long rope, motes.
- **Works:** the window view and the motes.
- **Wrong: the ropes move with no draught.** The clapper's rope swaying (`[606,445,50,160]`, amp 1.2) suggests the
  clapper is loose, and the story keeps the bell still. The long rope "held at both ends" breathing (`billow`) has
  nothing to drive it.
  - Fix: remove the clapper-rope sway. Keep the long rope at amp 0.4 with G4's gust, or remove it.

### archive [2] — OK
- **What moves:** a shaft, motes, a moth round the lamp.
- **Verdict:** good. The moth's orbit is a Lissajous figure; if it reads as mechanical in play, add a dart now and
  then. Low.

### colon_out [3] — MEDIUM (missing)
- **What moves:** nothing.
- **Fix:** sky and bird as for museum_out, plus the potted shrub by the door (≈790–860, 330–540) with
  `FX.swayM` at amp 0.6.

### colon [3] — LOW
- **What moves:** the palm through the window (two rectangles), the parrot breathing, a moth round the lantern.
- **Works:** the parrot's breath is a lovely touch, and the moth.
- **Wrong 1: the parrot's background breathes too.** `FX.breathe(g, im, [320,215,70,82], …)` scales the frame of
  the picture behind the parrot as well.
  - Fix: tighten it to the bird's body, `[332,222,50,70]`, or mask it.
- **Wrong 2: the palm rectangles cut fronds at their edges.**
  - Fix: G3.

### baute_office [3] — OK
- **What moves:** faint glints in the window panes, a moth at the desk lamp.
- **Verdict:** fine, and very quiet. The window glints barely register (max alpha 0.1). OK as is.

### rafa_bar [4] — OK
- **What moves:** tobacco haze drifting under the ceiling, a moth.
- **Verdict:** good. The haze is subtle and the masking is soft.

### rafa_studio [5] — LOW
- **What moves:** the palm beyond the window, motes in the light, steam from the moka pot and two cups, the stair
  lamp.
- **Works:** steam and motes.
- **Wrong 1: the palm is fast for "no wind".** At `t*0.7` it is fast compared with the rest (5.6 s cycle).
  - Fix: `t*0.45`, amp 0.8, plus G4.
- **Wrong 2: the stair lamp breathes.** It is an electric bulb, so make it steady (drop the `sin(t*0.8)` term).

### carmen_flat [6] — OK / LOW
- **What moves:** the lantern, the ivy, the far sea, the far windows, the message light.
- **Works:** the blinking message light (correct rhythm for an answering machine); the far-window twinkle.
- **Wrong: the ivy rectangle catches the shelf edge.** `FX.sway(g, im, [535,88,40,58], …)` includes part of the
  shelf.
  - Fix: G3, or start the rectangle 4 px lower.

### landrover [6] — HIGH
- **What moves:** stars, the cloud-sea ripple, the rosary, the headlight glow, dash lamps, the cigarette and its
  smoke, the mist.
- **Works:** the cigarette ember breathing and the smoke, the dash lamps.
- **Wrong 1: the rosary is sheared, not swung.** `FX.sway(g, im, [668,150,62,166], t*1.4, 2.2+bump, 0.3)`
  row-shears a 62×166 block by up to about 3.7 px, so the wall, road and sky seen through the windscreen behind the
  rosary visibly warp in a rectangle (`06_*.jpg`). The rosary itself shears like jelly instead of swinging.
  - Fix: cut the rosary as a sprite (a hand mask PNG over `[668,150,62,166]`) and draw it rotated about its
    attachment point (≈699,152): `angle = 0.05*sin(t*2.1) + 0.03*bump`. Cover the painted rosary with the
    unshifted background, or accept the small doubled area, since it is dark.
- **Wrong 2: the headlights pulse.** The glow's alpha pulses (`0.05+0.025*(1+sin5.1t·sin1.7t)`), which reads as
  failing electrics.
  - Fix: keep the alpha constant and jolt the glow's y by `bump*2`.

### camp [5], camp_night [6], camp_sunrise [7] — MEDIUM
- **What moves:** sea-of-cloud blobs, the awning billow, the "broom", the path grass, ravens, and at night the
  stars and the storm lantern.
- **Works:** the ravens, the stars, and the idea of the cloud sea rolling.
- **Wrong 1: cloud blobs in front of things.** The clip polygon includes `(380..795, 220..330)`, where the table,
  the radio and the awning poles stand, so the white blobs slide over the radio and table (`07_*.jpg`). The blobs
  are also cut by the polygon's straight edges.
  - Fix: a mask of the cloud sea (flood fill from `[200,200]`, `[600,250]`), and draw the blobs before the awning
    billow (G2).
- **Wrong 2: the awning billow moves rigid poles.** `FX.billow(g, im, [336,176,290,42], t, 1.3, 4.2)` moves the
  poles and guy-lines with the cloth, sideways. A taut awning ripples up and down, not left and right, and a 4.2 s
  period is brisk.
  - Fix: a column-wise vertical billow (shift columns by `dy = amp*sin(...)*sin(π·u)`) masked to the cloth, amp 1,
    period 6.
- **Wrong 3: the path stones sway with the grass.** `FX.sway(g, im, [1050,400,120,70], t, 1.4, 1.7, true)` (full
  speed, 3.9 s cycle) moves the stones and the wall top with the grass.
  - Fix: G3 mask, `t*0.6`, amp 0.8.
- **Wrong 4: the storm lantern pulses ±37% at night.** `FX.glow(g,158,278,48,'255,190,110',0.75*FX.flicker(t,4))`
  is a flat ball whose brightness pumps (std 7 levels per frame).
  - Fix: `0.45*(0.92+0.08*FX.flicker(t,4))`. Better, a `lights` entry `{kind:'gas'}`, so it also lights Vasco.

### cave6 [5/7] — MEDIUM
- **What moves:** the cloud below the arch (ripple), a salt seep, motes, the sun beam (puzzle), the sockets.
- **Works:** the beam, the motes, the seep.
- **Wrong: the rock rim wobbles.** `FX.ripple(G.bgImage(), [48,340,140,160], t*0.3, 1.4, 0.04)` includes the
  arch's rock rim on the right (x ≈ 140–188), which wobbles. The rectangle's edges also show (`08_*.jpg`). A cloud
  sea doesn't ripple in rows; it drifts.
  - Fix: a skyMask-style mask of the opening (seed `[80,400]`), then a slow `drawClouds` texture at speed 3 and
    alpha 0.3 through it, with no ripple.

### vault [5/7] — LOW
- **What moves:** two flames with glows, embers, motes on the stair, two drips.
- **Works:** the flames line up with the painted torch and lantern; the embers.
- **Wrong: ripples on a dry floor.** The drip rings spread on a dry earth floor with no puddle painted
  (`13_*.jpg`), which reads false.
  - Fix: either draw a small dark wet sheen under each spot (`FX.glow` in multiply, or a 30×8 ellipse with
    `rgba(0,0,0,0.25)` plus a faint highlight) so the rings have water to land in, or drop the rings and keep only
    the falling drop with a 2-frame splash.

## Birds (all rooms)
The size and speed are fine; size 3.5–5 is right for distance. Two things read as generic "clip-art M birds":
- Every bird flaps continuously at 1.75 Hz (`flap = sin(t*11+i*2)`).
- They move in a straight line at constant speed.

Gulls and ravens glide most of the time. In `FX.birds`:
- `const glide = 0.5+0.5*Math.sin(t*0.9+i*1.3) > 0.6;`
- `flap = glide ? 0.15 : Math.sin(t*(8+i)+i*2)`
- add a gentle climb or sink, `y += 10*Math.sin(q*Math.PI*1.3+i)`

Effort: 20 min, and it applies everywhere.

## Top 10 fixes, ranked

| # | Fix | Rooms | Priority | Effort |
|---|---|---|---|---|
| 1 | G1: trim the eased ends and crossfade-loop the seven sea videos (no pause, no jump) | 7 sea rooms | High | ~2 h + re-export |
| 2 | elena_car: clip the pale quad and the night clouds to the windscreen, lift the clouds to the cloud sea, replace the `FX.water` strip | prologue | High | 30 min |
| 3 | G2: draw-order swap (row-shift effects before clouds and birds), which removes the cloud holes | santa_ana, canteras, beach, camp, lobby | High | 30 min |
| 4 | G5: skyMask + two-tone panza for every sky (no brightening, no clip edges); fix the hotel room's y = 112 edge and canteras's rectangles | canteras, beach, hotel_room, gando, restaurant, courtyard | High | 2 h |
| 5 | G3: masked, edge-feathered `swayM`; apply it to palms and plants so frames, pillars, signs and facades stop moving | santa_ana, lobby, canteras, beach, hall, courtyard, colon, camp | High | 2 h + 10 min per element |
| 6 | Landrover rosary as a rotated sprite (not a shear); a steady headlight alpha that jolts in position | landrover | High | 1 h |
| 7 | Remove what shouldn't move: the mercado sign and aloes, the umbrella canopy (keep only its valance), the dragon tree, the clapper rope | mercado, beach, courtyard, belfry | Medium | 20 min |
| 8 | Camp: cloud blobs masked to the cloud sea (not over the radio and table), a vertical cloth billow without the poles, a calm storm lantern; cave6 cloud drift instead of a ripple over the rock | camp ×3, cave6 | Medium | 1.5 h |
| 9 | G4 + G6 + birds: gust envelope for sway, steady electric lights, gliding birds | all | Medium | 1 h |
| 10 | Give the two still exteriors a sky and a bird (and a shrub); a wet sheen under the vault drips | colon_out, museum_out, vault | Medium/low | 45 min |

Total: about 1.5–2 days, including a review clip per room for the user's approval.
