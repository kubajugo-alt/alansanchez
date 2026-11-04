// PREVIEW ONLY (?emo=1): Game II's emotions on Game I's Alan, waiting for the user's approval. Loaded by js/story/main.js
// only with ?emo=1 in the address; without it nothing here runs and the game is as it was.
// The patches were carried over from Game II's painted emotions by scripts/face_emotions_g2.py (local image work: an
// affine fit of Game II's head on each Game I frame, only what the emotion changes taken, in Game I's own colours and
// ink line). They live in art/review/emotions_g2/faces/, not art/faces/: nothing is installed in js/faces.js.
// The shared engine (js/engine/faces.js) draws FACES[frame].emo while a line in Engine.LINE_EMO is spoken and for a
// moment after; never while Alan walks (the engine drops it).
(function () {
  const E = window.Engine;
  // ---------------------------------------------------------------- the candidate emotion sets (art/review/emotions_g2/emo.json)
  const ALL8 = ['fear', 'anger', 'sadness', 'concern', 'surprise', 'joy', 'embarrassed', 'mischievous'];
  const EMO = {
    alan_side: { box: [70, 30, 80, 90], set: ALL8, lid: false },
    alan_idle2: { box: [75, 30, 80, 90], set: ALL8, lid: false },
    alan_talk: { box: [67, 26, 80, 93], set: ALL8, lid: false },
    alan_talk2: { box: [79, 28, 80, 93], set: ALL8, lid: false },
    alan_front: { box: [92, 38, 61, 80], set: ALL8, lid: false },
    // the lantern (Chapter V): its head is turned a little towards us, so Game II's profile lips don't sit on it; the five
    // below keep the frame's own closed mouth with the new brows and eyes; embarrassed is left out
    alan_lantern: { box: [121, 46, 44, 67], set: ['fear', 'anger', 'sadness', 'concern', 'surprise', 'joy', 'mischievous'], lid: false },
  };
  for (const [f, emo] of Object.entries(EMO)) if (window.FACES && FACES[f]) FACES[f].emo = emo;

  // the engine asks for art/faces/<frame>_emo_<e>[_up].webp: serve these frames' patches from the review folder instead
  const RE = new RegExp('^(?:.*/)?art/faces/((?:' + Object.keys(EMO).join('|') + ')_emo_[a-z]+(?:_up)?\\.webp)$');
  const d = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
  Object.defineProperty(HTMLImageElement.prototype, 'src', {
    configurable: true, enumerable: d.enumerable, get: d.get,
    set(v) { const m = typeof v === 'string' && v.match(RE); d.set.call(this, m ? 'art/review/emotions_g2/faces/' + m[1] : v); },
  });
  // warm the cache, so the first tagged line doesn't wait for its patches
  for (const [f, { set }] of Object.entries(EMO)) for (const e of set) for (const s of ['', '_up']) new Image().src = `art/faces/${f}_emo_${e}${s}.webp`;

  // ---------------------------------------------------------------- the proposed tags (36 of Alan's 563 lines)
  // Alan mostly jokes with a straight face, and his regular face should carry most lines (Game II's rule: "don't overuse
  // them"). These are the lines whose stage direction or story beat asks for a face (docs/STORY.md).
  const TAGS = {
    fear: [
      'alan_list_hand',    // [quietly] his dead grandfather's writing on a list made before any of the deaths
      'alan_ringout',      // the shop phone rings out: Inês always answers (Ch. IV, she has been taken)
      'alan_ines_gone',    // [quietly] "Inês?": the empty shop
      'alan_msg3_tongue',  // Lacerda's message: "He heard it. The whole river heard it."
    ],
    concern: [
      'alan_danger',       // "You're in danger." to Zé, minutes before the turning
      'alan_call_rui',     // "Lacerda has Inês." the call to Rui
      'alan_ch5_hint_grate', // [quiet] "She hates waiting, and I've kept her long enough."
      'alan_withhold_2',   // [flustered, then honest] "I'm not lying to you. I just can't tell you yet."
    ],
    surprise: [
      'alan_salted',       // "It isn't swollen. It's salted shut." the drawer's secret
      'alan_deduce',       // [slowly] "They die when the river turns." the chapter's deduction
      'alan_photo',        // "That's... Grandfather. Young." Amália's photograph
      'alan_jc_click',     // "J.C. José Coutinho." the fourth clock's name
      'alan_recognise',    // "I've seen this before." the music box in Amália's photograph
    ],
    sadness: [
      'alan_mother_1',     // [pause] "She rings. I don't answer." his mother
      'alan_page3',        // [quietly] "He ran." his grandfather's confession
      'alan_kettle_rang',  // [quietly] "She was frightened, and I was below decks."
      'alan_after_tape',   // [long pause] Bastos's last words were for him
      'alan_bench_2',      // [quietly, to himself] "So that's what they say about me."
      'alan_duarte_ines_2', // [pause, quietly stung] "He's charming to everyone."
      'alan_read_last',    // Afonso's last words for his son: "She wanted me to know he had a father."
      'alan_let_go',       // [quietly] "Let it go, Vicente." (the lantern, in the cistern)
    ],
    anger: [
      'alan_fin_angry',    // [angry, quiet] "You killed him." (the lantern, in the cistern)
      'alan_father',       // "Mine's gone too, Vicente... I'm not ringing it your way."
      'alan_proof',        // the music box: Lacerda was in Grandfather's flat after he died. Or before.
    ],
    joy: [
      'alan_dawn',         // "The tenth morning." the fog lifts
      'alan_end',          // "Let's go and see what the city looks like."
      'alan_clock_wound',  // the tide clock turns: "First thing in this city that's turned on for me in years."
    ],
    embarrassed: [
      'gag_alan_ines_1',   // [flustered, too fast] "I look at lots of women. My mother. The bank manager."
      'gag_alan_lino',     // [flustered] "For Dona Amália. A lady."
      'gag_alan_ines_2',   // [flustered] "It's a very fishy city."
      'alan_deny_celeste_1', // [scarlet] "I'm a very... restless sleeper."
      'alan_laundry_thanks', // [embarrassed, quietly] "Thank you, Celeste."
      'alan_duarte_ines_1', // [a little too loudly] "Coffee! Two coffees."
    ],
    mischievous: [
      'alan_flirt_cop_1',  // "Do they issue those shoulders with the uniform?"
      'alan_flirt_guitar_2', // "Do you give lessons? Private ones?"
      'alan_vasco_flirt',  // "Do you dig here often?"
      'alan_slip',         // [whispering] "I've just slipped an antiques dealer the tongue."
      'alan_shirt_ask',    // "Doctor... you've buttoned your shirt wrong." (the start of the key lift)
    ],
  };
  E.LINE_EMO = E.LINE_EMO || {};
  for (const [e, ids] of Object.entries(TAGS)) for (const id of ids) if (window.LINES && LINES[id]) E.LINE_EMO[id] = e;
  window.EMO_PREVIEW = { frames: EMO, tags: TAGS };
})();
