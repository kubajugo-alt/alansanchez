# Code map: The Shortest Night (Game II)

`sequel/` is Game II's own web root: everything the game loads is inside it, nothing reaches up into Game I's folders.
Same shape as Game I (plain HTML, CSS and JavaScript, no build step, no modules; every file an IIFE sharing globals on
`window`), so Game I's `docs/CODEMAP.md` describes the engine. This file lists what differs.

## The engine is a fork

`sequel/js/engine/*.js`, `engine.js`, `fx.js`, `audio.js`, `warp.js`, `parallax.js` and `css/style.css` were copied
from Game I at commit `394bcdd0` (27 Oct 2026). Game I is never touched by work on Game II, and Game II never breaks
when Game I's engine changes. A fix wanted in both is made in both, on purpose. What the fork changed:

| File | Change |
|---|---|
| `js/engine/speech.js` | Speaker names and colours come from `window.SPEAKERS`, the names Alan calls people by from `window.CALLED` (both in `js/lines.js`). The player speaks from the player's figure whoever it is (`E.player.speaker`: `'vasco'` in his chapter). |
| `js/engine/input.js`, `inventory.js` | The "that doesn't work" lines are the player's own (`alan_fail_*` or `vasco_fail_*`); per-character item refusals from `window.FAIL_BY_CHAR`. |
| `js/engine/rooms.js` | Door sounds come from the room (`door: 'door'`); a pair can be silent (`quietTo`). |
| `js/engine/base.js`, `engine.js` | The first room is `window.FIRST_ROOM` (Gando), not the shop. |
| `js/engine/saves.js` | Its own keys (`shortest-night-save-v1`, ...), no Game I migrations. |
| `js/engine/tips.js` | Its own key; the "stuck" tip points at the phone box; a tip for Vasco's chapter. |
| `js/audio.js` | Its own volume key. |
| `js/fx.js` | The painted inventory icons are listed by the story (`window.PAINTED_ICONS`); an item with no icon yet shows a luggage tag with its short name (`window.ICON_LABELS`). |

## Load order (index.html)

| File | Owns |
|---|---|
| `js/lines.js` | `window.LINES` (every line: id → [speaker, text]; ids name recordings, never rename one), `SPEAKERS`, `CALLED`. |
| `js/sprites_game1.js` | Frame metadata for the frames borrowed from Game I (Alan, Vasco). **Generated** by `scripts/import_game1.py`. |
| `js/sprites_placeholders.js` | The placeholder figures' metadata, and `window.PLACEHOLDER_ART` (rooms and stills not painted yet). **Generated** by `scripts/placeholders.py`. |
| engine files | As Game I (`fx`, `audio`, `warp`, `parallax`, `engine/*`, `faces.js` data (**generated** by `import_game1.py`: Game I's approved face kits for the borrowed frames), `engine.js`). |
| `js/story/core.js` | `window.S`: the cast (`S.CHARS`; `S.ph(id)` for a placeholder figure), items, the days (`S.day`, `S.DAYS`), the map and its pins, the phone box and Inês's calls and hints (`S.phoneBox`, `S.CALLS`, `S.hint`), Alan's notebook (`S.NOTES`), playing as Vasco (`S.becomeVasco` / `S.becomeAlan`), the Sea's water and the black mist (`S.water`, `S.drawWater`, `S.drawMist`), placeholder hotspot boxes, `S.room()` (a room's defaults). |
| `js/story/docs.js` | Readable close-ups: the paper, the rubbing, the 1751 letter and Inês's fax, Galindo, the disc list, the 1484 inquiry, Doña Pino's list, Baute's desk, Rafa's sketchbook and drawing, Elena's notebook, the Guardia photograph, Elena's charts. |
| `js/story/prologue.js` | 21 Dec 1995: Elena's message (a still), her car (played), the barranco (a still). `S.paint`. |
| `js/story/tue.js` | Tuesday, and the rooms it opens with all their days: Gando (Sunday's bad ending), the hotel lobby and room, Las Canteras (Chano, the phone box, the tide steps, the bonfires, the surfers), the museum hall (Thursday's dinner). |
| `js/story/wed.js` | Wednesday: La Isleta (and Saturday's flood), Santa Ana and the bell chamber, the archive (Carmen, almost daily). `S.morning`. |
| `js/story/thu.js` | Thursday: Carmen's history, Casa de Colón, the dinner, Baute's office, caught. |
| `js/story/fri.js` | Friday: the fight, Carmen's coffee, Rafa's bar. |
| `js/story/sat.js` | Saturday, Alan: Rafa's studio, the fax, the flood. |
| `js/story/vasco.js` | Saturday, Vasco's chapter, and the mountain's rooms with all their days: the camp, Cave 6, the vault. |
| `js/story/sun.js` | Sunday: the choice, the bad ending, Carmen's flat, the Land Rover, the rescue. |
| `js/story/mon.js` | Monday: the finale (`S.ORDER`, the sockets, the surge and the death screen, the mirror, the sixth disc, the seventh's angle), the confession, the ending. |
| `js/story/main.js` | `STILLS`, placeholder wiring (hotspot boxes, default standing spots), the `?scene=` previews (`PREVIEW`), the content setting, `newGame`, `Game.init`. |

## The days

`F().ch` is the day: 0 the prologue, 1 Tuesday 18 June ... 7 Monday 24 June. Every room is defined once, in the file of
the day it first appears, with `when()` conditions for every day it's used; the scenes may live in later files.

## Placeholder art

Until a room is painted, `scripts/placeholders.py` makes a stand-in (a gradient and a few shapes, its name low left) and
the game draws its hotspots as labelled boxes (dashed blue: exits). Stills are text cards saying what the painting must
show: together they are the art list. The new cast are flat figures in the bible's palettes with their names on their
chests. Each placeholder has a `.ph` marker beside it; drop a painting in under the same name, delete the marker and
rerun the script (it never touches a file without a marker). Painted rooms will want a depth map (Game I's
`scripts/depth_map.py`) and `parallax: true`; `S.room()` turns parallax off by default.

## Testing

Serve `sequel/` (`npx -y http-server -p 8099 -c-1 -s sequel`), then:

- `node sequel/scripts/validate.mjs`: every line id used exists, every line is used, speakers named, art on disk.
- `node sequel/scripts/tests/play.mjs http://localhost:8099/`: plays the whole game, prologue to credits, through
  hotspots and dialogue (with the airport's bad ending and one wrong disc on the way). About five minutes.
- `node sequel/scripts/tests/shot.mjs http://localhost:8099/ <scene|title> out.png`: a screenshot and the page errors.
- `?scene=<name>` previews: `prologue tue lobby reception mist wed belfry thu dinner fri bar sat flood vasco cave vault sun carmen rescue finale confession`.
