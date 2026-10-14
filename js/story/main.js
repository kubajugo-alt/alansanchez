// The Drowned Bell v2 — boot: shared effects, chapter hooks, new game, init.
(function () {
  const { G, F, say, ROOMS, joke, posed } = window.S;

  // ---------------------------------------------------------------- shared painted effects
  S.dayClouds = FX.makeClouds(11, '255,250,255', 24);
  S.nightClouds = FX.makeClouds(23, '40,48,80', 30);
  S.windowFog = function (g, t, rect, rgb, a) {
    g.save(); g.beginPath(); g.rect(...rect); g.clip();
    for (let i = 0; i < 6; i++) {
      const x = rect[0] + ((t * (6 + i * 2) + i * 140) % (rect[2] + 300)) - 150, y = rect[1] + rect[3] * (0.25 + 0.13 * i);
      const gr = g.createRadialGradient(x, y, 0, x, y, 120);
      gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = gr; g.fillRect(x - 160, y - 80, 320, 160);
    }
    g.restore();
  };
  // a squat polished brass bookbinder's weight
  S.drawWeight = function (g, x, y, s) {
    g.save(); g.translate(x, y); g.scale(s, s);
    g.fillStyle = 'rgba(0,0,0,0.35)'; g.beginPath(); g.ellipse(0, 2, 15, 4, 0, 0, 7); g.fill();
    const gr = g.createLinearGradient(-14, 0, 14, 0); gr.addColorStop(0, '#6a4a14'); gr.addColorStop(0.35, '#f2d27a'); gr.addColorStop(0.6, '#b8862e'); gr.addColorStop(1, '#4a3008');
    g.fillStyle = gr; g.strokeStyle = '#2a1a06'; g.lineWidth = 1.2;
    g.beginPath(); g.moveTo(-14, 0); g.lineTo(-14, -14); g.ellipse(0, -14, 14, 4, 0, Math.PI, 0); g.lineTo(14, 0); g.ellipse(0, 0, 14, 4, 0, 0, Math.PI); g.closePath(); g.fill(); g.stroke();
    g.beginPath(); g.ellipse(0, -14, 14, 4, 0, 0, 7); g.fillStyle = '#e8c468'; g.fill(); g.stroke();
    g.beginPath(); g.arc(0, -20, 5, 0, 7); g.fillStyle = gr; g.fill(); g.stroke();
    g.restore();
  };
  // covers a taken object with nearby painting (the window shelf, etc.)
  S.patchBg = function (g, dst, src) {
    const im = G.bgImage(); if (!im) return;
    const k = im.width / 1280;
    g.drawImage(im, src[0] * k, src[1] * k, dst[2] * k, dst[3] * k, dst[0], dst[1], dst[2], dst[3]);
  };

  // ---------------------------------------------------------------- chapter hooks in the shop
  const shopEnter = ROOMS.shop.enter;
  ROOMS.shop.enter = async function (entry) {
    if (F().ch === 2 && F().ch2_ready && !F().ch2_done) return S.ch2End();
    if (F().ch === 3 && F().has_tongue && F().founder_order && !F().ch3_done) return S.ch3End();
    if (shopEnter) return shopEnter.call(this, entry);
  };

  // ---------------------------------------------------------------- art the engine preloads
  window.STILLS = ['still_intro', 'still_1755', 'still_1955_a', 'still_1955_b', 'still_1955_c', 'still_city_morning', 'still_drawer', 'still_shop_after',
    'still_phone', 'still_amalia_box', 'still_tavern_full', 'still_quay_sweater', 'still_abilio_ring', 'still_jacket', 'still_shelf', 'still_ze_kiss', 'still_ze_bunk', 'still_cop_shelf', 'still_guitar_bed'];
  window.CLOSEUPS = ['paper_aged', 'close_photo1934', 'close_porthole', 'close_tideclock', 'close_bronze', 'close_clocks'];

  // ---------------------------------------------------------------- new game
  // preview links: ?scene=bath | cop | guitar jumps straight to that scene (no autosave)
  const PREVIEW = {
    bath: { flags: { ch: 2, met_celeste: true }, room: 'lavadouro', pos: [800, 640, 'e'], run: () => S.bathEgg() },
    cop: { flags: { ch: 1 }, room: 'police', pos: [420, 690, 'w'], run: () => S.flirtCop() },
    romance: { flags: { ch: 4, ze_awake: true, ze_believes: true, ze_in_cabin: true, ze_saved: true }, room: 'cabin', pos: [560, 640, 'e'], run: () => S.romance() },
    // the ending: hand Lacerda the ledger, then the last strike (the puzzle in between is skipped)
    finale: { flags: { ch: 5, tomas_confessed: true }, room: 'cistern', pos: [520, 640, 'e'], run: async () => {
      G.giveItem('ledger', true); G.giveItem('tongue', true);
      await S.giveLedger(); await G.wait(window.FAST ? 20 : 1500);
      G.giveItem('lantern', true); G.giveItem('knife', true);
      await S.cutRopes(); await S.giveLantern();
      Object.assign(F(), { blood: true, struck: ['sanches', 'coutinho', 'bastos'], strikes: 3, water: 2 });
      await G.wait(window.FAST ? 20 : 700);
      await S.strike('ferreira');
    } },
    guitar: { flags: { ch: 1, heard_song: true }, room: 'tavern', pos: [720, 660, 'w'], run: () => S.flirtGuitar() },
  };
  async function preview(k) {
    const P = PREVIEW[k];
    G.giveItem('notebook', true); Object.assign(F(), P.flags);
    await G.goRoom(P.room, null, { noEnter: true, instant: true, pos: P.pos });
    await G.wait(800);
    await P.run();
  }
  async function newGame() {
    const scene = new URLSearchParams(location.search).get('scene');
    if (PREVIEW[scene]) return preview(scene);
    G.giveItem('notebook', true);
    F().ch = 1; F().clock = '11:00';
    await G.card('CHAPTER I', 'The Fog  ·  11:00', 3000);
    await G.showStill('still_intro', () => say('narr_intro_1', 'narr_intro_2'), { zoom: [1.0, 1.16], pan: [[0.4, 0.55], [0.6, 0.5]], keep: true });
    await G.goRoom('shop', null, { noEnter: true, instant: true, pos: [815, 616, 'e'] }); // forearms resting on the counter top
    G.player.pose = 'asleep';
    G.endStill();
    await G.busy(async () => {
      await G.wait(900);
      await say('narr_intro_3', 'ines_wake');
      G.player.pose = null;
      await joke('alan_wake');
      G.player.dir = 'w';
      await say('ines_intro_2', 'alan_intro_3', 'gag_ines_1', 'gag_alan_ines_1', 'ines_intro_3');
      await S.joke('alan_intro_4');
      await say('ines_intro_4');
    });
    G.autosave();
  }

  window.Story = { newGame };
  document.getElementById('btn-new').onclick = () => G.begin(true);
  document.getElementById('btn-continue').onclick = () => G.begin(false);
  G.init(S.CHARS, S.ITEMS, ROOMS, window.SPRITES);
})();
