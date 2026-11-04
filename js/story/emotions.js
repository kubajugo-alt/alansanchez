// Which of Alan's lines show an emotion on his face (Engine.LINE_EMO[lineId] = 'joy' ...), drawn by the shared
// js/engine/faces.js from each face set's emo in js/faces.js (approved by the user 2026-11-04: Game II's eight emotions
// blended onto six of Game I's Alan frames, scripts/face_emotions_g2.py; the frames alan_side, alan_idle2, alan_talk,
// alan_talk2, alan_front, alan_lantern). A tagged line shows a face only when he is on one of those frames; never while
// he walks (the engine drops it). As Game II's js/story/emotions.js.
(function () {
  const E = window.Engine;
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
})();
