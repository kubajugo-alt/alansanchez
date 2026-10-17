# Music

The score is 26 recorded tracks plus two recorded songs: Amália's fado "O Sino Afogado" (`audio/music/o_sino_afogado.mp3`) and Duarte's "Meu Lindo Guarda-Livros". The player is in `js/audio.js`. The rooms and story scenes choose what plays.

## Files

Each track exists in two copies with the same loudness:

| File | Codec | Bitrate |
|---|---|---|
| `audio/music/<id>.opus.m4a` | Opus in MP4 (from the Opus originals) | 112 kb/s VBR |
| `audio/music/<id>.aac.m4a` | AAC-LC in MP4 | 144 kb/s |

At runtime the game uses Opus when `canPlayType('audio/mp4; codecs="opus"')` answers, and AAC otherwise (for example older Safari).

Both copies come from the same gain-adjusted 48 kHz master. Each track gets a single linear gain that sets its integrated loudness to **-23 LUFS** (EBU R128), with no compression or limiting. True peaks land between -8.5 and -11.9 dBTP. After encoding, every file measures -23.0 ±0.1 LUFS.

Voice lines are about -21 LUFS and play at unity. The music bus runs at 0.5 × the player's volume², into the 0.8 master, so the music bed sits about 12 dB under the voices before ducking.

`audio/music/tracks.json` holds, for each track:

| Field | Meaning |
|---|---|
| `dur` | Length of the track |
| `inp` | First audible moment |
| `out` | Loop point, about 2 s into the fade-out tail |
| `loop` | Where a repeat re-enters, past a quiet intro (only some tracks have one) |
| `v` | Cache-busting hash |

| id | Original title |
|---|---|
| alan_theme | Alan's Theme |
| alfama_day | Alfama street, day |
| alfama_night | Alfama street, night |
| antiques_shop | Antiques shop |
| carmo_day | Carmo by day |
| carmo_night | Carmo at night |
| cistern_deep | Cistern Deep |
| cold_open | Cold Open |
| ferreira_workshop | Ferreira's workshop |
| lacerda_theme | Lacerda's Theme |
| lavadouro | Lavadouro (public washhouse) |
| main_theme | Main Theme |
| map_lisbon | Map of Lisbon |
| meu_lindo_guarda_livros | Meu Lindo Guarda-Livros (Duarte's song) |
| police_station | Police station |
| quay_cais_do_sodre | Quay, Cais do Sodré |
| se_bell_tower | Sé bell tower |
| se_cloister | Sé cloister (the dig) |
| se_exhibition | Sé exhibition (Lisboa e o Mar) |
| shop_day | Shop, day |
| shop_night | Shop, night (empty) |
| tavern_day | Tavern, day (busy) |
| tavern_night | Tavern, night (empty) |
| bell_motif | The Bell motif |
| vasco_theme | Vasco's Theme |
| ze_boat_deck | Zé's boat, deck |

## How it plays

- **Streaming.** Tracks stream through pooled `<audio>` elements wired into Web Audio. Nothing is preloaded, and a track loads only when it is about to play. Decoding a whole track to PCM would take about 75 MB.
- **Unlocking on iOS.** The first tap plays a silent clip through six pooled elements, so iOS lets them play later.
- **Room changes.** A change crossfades over 1.5 s with equal-power curves. If the next room uses the same track, it keeps playing; a change of level or filter glides instead of restarting.
- **Looping.** About 12 s before a track's `out` point, a second copy loads and waits at the track's `loop` point. It starts 3 s before `out`, and the two crossfade, so there is no cut and no seam.
- **Cue options.** A spec is either an id or `{ id, vol: number|'low'(-6 dB)|'quiet'(-9 dB), lowpass: Hz, start, dur, fade, fadeIn, loop }`.
- **Ducking.** Music drops 6 dB under a character's line. It drops 10 dB under the narrator, the answering machine and the phone (the engine plays these voices dry). It drops 3 dB under a sung line. The duck attacks with τ 0.12 s and releases with τ 0.45 s; recovery is about 90% after 1 s. Ambience ducks as before.
- **Recorded songs.** Songs (`Sound.playSong`) fade the score out under them and are never ducked. They follow the music volume, and `Sound.songLevel()` drives the performers.
- **Settings.** The menu keeps the Music on/off toggle and adds a music-volume slider. Both are stored in `localStorage` under `drowned-bell-music-volume` and `drowned-bell-music-volume-off`.

### API

| Call | What it does |
|---|---|
| `Sound.playMusic(spec)` | Sets the room's music; the engine calls it on room entry. It also ends a non-sticky cue. |
| `Sound.cue(spec, { sticky, xf })` | Lays a story cue over the room. `cue(null)` hands back to the room. `cue('silence')` holds silence. A sticky cue survives room changes. A cue with `dur` ends by itself and returns to the room's music. |
| `Sound.refreshMusic()` | Re-derives the room's music after a flag changes. |
| `Sound.transitionMusic(on, n)` | Called by `js/story/transitions.js` for the paintings between chapters. |
| `Sound.musicState()` / `Sound.restoreMusic(st)` | Save and load. The state is `{ v: 1, cue }`; rooms re-derive their own track. A restored cue is not sticky. |
| `Sound.musicLog`, `Sound.nowPlaying`, `Sound.musicCue`, `Sound.meter()` | Tests and tuning. `meter()` returns the RMS of the music bus and of the current voice. |

## Rooms

| Room | Track |
|---|---|
| Title screen (from the first tap) | main_theme |
| Cold open, staged room fallback (`cold_open`) | cold_open |
| Shop, Chapters I–IV | shop_day |
| Shop, Chapter V, and whenever Inês is away (`S.inesGone`) | shop_night |
| Alan's room (`bedroom`), outside the love scenes | alan_theme, quiet |
| Alfama street, day | alfama_day |
| Alfama street, night (after the docks, and Chapter V) | alfama_night |
| Map | map_lisbon |
| Polícia Judiciária | police_station |
| Sé museum | se_exhibition |
| Sé reserve (`se_store`) | se_exhibition; vasco_theme while Vasco is down there with Alan |
| Sé cloister | se_cloister. During the heist: alan_theme from meeting Vasco, then vasco_theme from the shirt buttons. On Thursday: vasco_theme. |
| Taberna, Chapters I–IV | tavern_day |
| Taberna, Chapter V | tavern_night |
| Lavadouro | lavadouro |
| Relojoaria Ferreira | ferreira_workshop; low until the lamp is lit |
| Carmo by day | carmo_day; main_theme at dawn |
| Carmo at midnight | carmo_night |
| Sé bell tower | se_bell_tower |
| Antiguidades Lacerda | antiques_shop |
| Cais do Sodré | quay_cais_do_sodre; low after 18:25 |
| The Maria Fé, deck (the race to 18:25) | ze_boat_deck |
| The cabin, before 18:25 | ze_boat_deck through a 900 Hz low-pass |
| The cabin, after 18:25 (Zé's scene) | none: boat ambience only |
| The cistern | cistern_deep; bell_motif once the lantern lights the bell (the rite) |

## Story cues

| Scene | Where in the code | Track |
|---|---|---|
| Opening painting (the fog), the city waking, the chapter-transition paintings | `main.js` opening; `Sound.transitionMusic` from `transitions.js`; `ch4.js` S.ch4End | main_theme, low |
| The legend painting | `coldopen.js` S.introLegend | bell_motif |
| Maria Coutinho's last night (paintings) | `coldopen.js` S.mariaPaintings | cold_open |
| Chapter cards I–V | `main.js` card I; `core.js` S.chapter | bell_motif, first 12 s, 3 s fade, then the room's music |
| Fado in the taberna (with its painting slideshow) | `ch1.js` S.giveGinja → `fado.js` | O Sino Afogado (recorded song) |
| Teixeira's visit (arrival, upstairs, Inês and the key) | `visits.js` S.visitCop | alan_theme |
| Duarte's visit, accept: the build-up upstairs | `visits.js` S.visitGuitar | alan_theme |
| Duarte's visit, accept: afterwards, he plays to Alan | `visits.js` S.duarteSong | Meu Lindo Guarda-Livros (recorded song, in full) |
| Duarte's visit, decline: his melody on the stool | `visits.js` S.visitGuitar | tavern_night; the song never plays |
| The Sé heist | `se.js` S.cloisterMusic, S.fixShirt | alan_theme, crossfading (4 s) into vasco_theme at the shirt buttons |
| Vasco: the Chapter III cameo, the reserve and the twin, Thursday, the reserve on Thursday | `se.js` | vasco_theme |
| The call to Vasco (Chapter V) | `ch1.js` S.callVasco | vasco_theme |
| Lacerda's message on the machine (Chapter V) | `ch1.js` S.playMachine | lacerda_theme |
| Lacerda in the cistern (Inês tied up, the confrontation) | `ch5.js` cistern enter | lacerda_theme |
| Cipher decoding, with the 1755 flashback | `ch3.js` S.decodeScene | bell_motif |
| The tile shattering, and the 18:25 painting | `ch4.js` S.breakTile | bell_motif, then silence (3 s fade) |
| The rite | `ch5.js` S.giveLantern (bell_lit) | bell_motif |
| Game over (the water rises) | `ch5.js` S.cisternDeath | bell_motif |
| Tomás's confession (1955 paintings) | `ch5.js` (the room's track) | carmo_night |
| The silence (the fog lifting) | `ch5.js` S.silence | 1.2 s fade, 5 s of silence, then main_theme fading in over 6 s |
| Dawn, the epilogue paintings, the call to his mother | `ch5.js` S.dawn, S.epilogue | main_theme |
| Epilogue painting of the taberna full again | `ch5.js` S.epilogue | tavern_day |
| The post-credits pictures (Zé's net, Lacerda's shelf) | `ch5.js` S.epilogue | silence, then the clock-tick effect (`tideclock_tick`) |
| Thursday | `se.js` S.thursday, S.vascoLove | vasco_theme |
| The credits (ending card) | `ch5.js` S.epilogue | main_theme |

## Duarte's song: caption timings

The captions are English only, one line at a time, in the same style as the fado (`G.lyrics`). The times are seconds of the recording. They were read from a faster-whisper transcription of the Portuguese (word timestamps), checked against the cue times embedded in the downloaded file and against vocal-band energy and onsets, then corrected by hand.

| Time (s) | Caption |
|---|---|
| 12.2 | The accountant of Rua do Sol |
| 16.5 | has ledger eyes that never get it wrong; |
| 21.0 | he balances my spending, checks my accounts, |
| 25.2 | and I end up owing him a kiss, interest-free. |
| 29.0 | (blank) |
| 29.8 | Oh, my handsome bookkeeper, close the shop up slowly, |
| 34.4 | for I've brought my passion with no receipt to sign. |
| 38.7 | If the artist tunes his guitar, there's a terrible to-do: |
| 42.8 | he wants to touch his fingers; I want his heart. |
| 48.5 | (blank) |
| 50.4 | The musician, poor thing, has ink on his hand, |
| 54.8 | and swears he's painting a portrait of his love; |
| 59.1 | but when he smiles, he loses his way, |
| 63.2 | and out comes a sonnet that doesn't add up. |
| 67.2 | (blank) |
| 67.9 / 72.8 / 77.0 / 81.2 | the chorus again, all four lines |
| 86.2 | (blank) |
| 87.2 | One asks him for a portrait, another asks for the key; |
| 91.5 | the handsome boy works out who pays the best. |
| 95.6 | I say: "My darling, don't be so serious: |
| 100.0 | some accounts close better in private, my love." |
| 105.8 | (blank: instrumental) |
| 111.8 | Oh, my handsome bookkeeper, leave the account open, |
| 117.1 | for I've a few sums I'd rather settle myself. |
| 121.2 | If the artist knocks at the door, let him wait in the hall: |
| 125.2 | today the book is mine… and I've come to collect love. |
| 129.3 | (blank) |
| 129.9 | Close the shop, my dear, but don't close your smile; |
| 138.0 | there's a balance between us that's paid with good sense… |
| 146.6 | or with no sense at all. |
| 150.0 | (end) |
