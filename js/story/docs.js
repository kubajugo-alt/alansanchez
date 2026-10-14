// Close-up documents: the ledger, the 1955 file, the list, the tide card,
// Ferreira's repair book, the notebook, the tide clock, the photograph.
(function () {
  const { G, F, say } = window.S;
  const PAPER = 'close:paper_aged';
  const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const shift = (s, k) => s.replace(/[A-Z]/g, c => ABC[(ABC.indexOf(c) + k + 26) % 26]);
  S.cipher = { ABC, shift, PLAIN: 'THE BROTHERHOOD RANG THE DROWNED BELL' };
  const enc = s => shift(s.toUpperCase(), 7);

  const RITE = 'SHOULD THE TONGUE BE FOUND LET THE LAST OF THE BELL HAND RING IT BACKWARD AGAINST THE ORDER THE FOUNDERS RANG THE CITY LAST TO FIRST AT A TURNING OF THE TIDE WITH HIS OWN BLOOD ON THE BRONZE';
  const P1955 = 'AFONSO LACERDA DROWNED IN HIS OWN WATER I HAD THE TONGUE IN MY HAND AND THE BELL BEFORE ME AND I RAN HIS BOY WATCHED THE LACERDAS ARE PATIENT GOD FORGIVE ME SO AM I';

  const ledgerPages = () => {
    const d = F().decoded;
    const pages = [
      { img: PAPER, cls: 'doc-ledger', html: d
        ? `<h3>The Brotherhood rang the drowned bell</h3><p><i>Lisbon, 1756.</i> Set down by the four founders in the old cipher, the key cut in the weeping stone of the Carmo.</p><p class="cipher">${enc(S.cipher.PLAIN)}</p>`
        : `<h3>&nbsp;</h3><p class="cipher">${enc(S.cipher.PLAIN)}</p><p class="cipher">${enc('THE FOUR FOUNDERS SET THIS DOWN IN SEVENTEEN FIFTY SIX')}</p><p class="cipher">${enc('THE KEY IS CUT IN THE WEEPING STONE')}</p>` },
      { img: PAPER, cls: 'doc-ledger', html: d
        ? `<h3>The rite</h3><p>Should the tongue be found, let the last of the bell-hand ring it backward, against the order the founders rang the city: <b>last to first</b>, at a turning of the tide, with his own blood on the bronze.</p>`
        : `<p class="cipher">${enc(RITE)}</p>` },
      { img: PAPER, cls: 'doc-hand', html: d
        ? `<p>1955.</p><p>Afonso Lacerda drowned in his own water. I had the tongue in my hand and the bell before me, and I ran. His boy watched.</p><p>The Lacerdas are patient. God forgive me, so am I.</p><p style="text-align:right">J. S.</p>`
        : `<p class="cipher" style="font-family:'Homemade Apple',cursive">${enc(P1955)}</p>` },
    ];
    if (F().genealogy_read) pages.push(...S.genealogyPages());
    return pages;
  };
  S.readLedger = async function () { await G.closeup(ledgerPages()); await say(F().genealogy_read ? 'alan_look_ledger_genealogy' : F().decoded ? 'alan_look_ledger_decoded' : 'alan_look_ledger'); };

  S.genealogyPages = () => [
    { img: PAPER, cls: 'doc-hand', html: `<p style="font-family:'IM Fell English',serif;text-align:center">The Founders · 1755</p>
      <p>Ferreira — … — <s>Ferreira, clockmaker, Baixa</s></p><p>Bastos — … — <s>Bastos, teacher, Graça</s></p>
      <p>Coutinho — … — Maria Coutinho, fishwife, Madragoa. Her son José, no father registered, fisherman, the <u>Maria Fé</u>, Cais do Sodré. I have told Maria. I have not told the boy. <i>J.S., 1994</i></p>
      <p>Sanches — … — Joaquim — son, d. 1967 — Alan.</p>` },
  ];

  S.readFile55 = async function () {
    await G.closeup([
      { img: PAPER, cls: 'doc-typed', html: `<div class="stamp">INEXPLICADO</div><p>POLÍCIA JUDICIÁRIA — LISBOA</p><p>PROCESSO 55/114 · NOVEMBRO 1955</p><p>Nevoeiro de nove dias. Dois afogamentos.</p>
        <p>1. Estivador, Alfama. Encontrado na cama, quarto fechado, pulmões com água do mar. Azulejo azul no quarto (sino sob ondas).</p>
        <p>2. A. Lacerda, antiquário. Encontrado na cisterna inundada sob o Convento do Carmo.</p>
        <p>Testemunhas: J. Sanches, livreiro, 43 anos ("encontrou o segundo corpo"). Um menor, acólito, sem nome. Uma lavadeira, recusou assinar.</p><p>Arquivado: INEXPLICADO.</p>` },
    ]);
    await say('alan_look_file');
  };

  // Ferreira's table of turnings for the ten days of the fog
  S.tideRows = () => {
    const rows = [];
    let t = 3 * 60 + 12 - 50; // day 1, drifting ~50 min later each day
    for (let d = 1; d <= 10; d++) {
      const day = []; let base = (t + (d - 1) * 50) % (24 * 60);
      for (let k = 0; k < 4; k++) day.push((base + k * 372) % (24 * 60));
      rows.push(day);
    }
    const fix = { 2: [192], 5: [938], 8: [241], 9: [1105], 10: [35] }; // 03:12, 15:38, 04:01, 18:25, 00:35
    for (const d in fix) { const r = rows[d - 1]; r[0] = fix[d][0]; for (let k = 1; k < 4; k++) r[k] = (r[0] + k * 372) % 1440; r.sort((a, b) => a - b); }
    return rows;
  };
  const hm = m => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  S.readTideCard = async function () {
    const circ = new Set(F().ze_believes ? ['192', '938', '241'] : []);
    const rows = S.tideRows().map((r, i) => `<tr><th>${i + 1}</th>${r.map(m => `<td class="${circ.has(String(m)) ? 'circled' : ''}">${hm(m)}</td>`).join('')}</tr>`).join('');
    await G.closeup([{ img: PAPER, cls: '', html: `<h3 style="font-family:'IM Fell English',serif">Viragens da maré</h3><table class="doc-table"><tr><th>dia</th><th colspan="4">turnings</th></tr>${rows}</table>
      <p class="doc-hand" style="margin-top:0.8em">The river keeps strange hours in fog. — F.</p>` }]);
    await say('alan_look_tidecard');
  };

  S.readList = () => G.closeup([{ img: PAPER, cls: 'doc-hand', html: `<p>&nbsp;</p><p>Ferreira</p><p>Bastos</p><p>Coutinho</p><p>Sanches</p><p style="text-align:right;font-size:0.8em">— if anything happens to me —</p>` }]);
  S.readRepair = () => G.closeup([
    { img: PAPER, cls: 'doc-hand', html: `<p>Out. 1995 — Tide clock, for myself, because the river is keeping time and I want to see it.</p><p>Out. 1995 — Lacerda, vitrine lock, spare cut. (He asked twice.)</p>` },
    { img: PAPER, cls: 'doc-hand', html: `<p>1961 — note for the next man at this bench:</p><p>All my founder locks share one key-square. Ferreira, Bastos, Coutinho, Sanches. Old habit. Old families.</p>` },
  ]);
  S.readNotebook = () => G.closeup([
    { img: PAPER, cls: 'doc-hand', html: `<p>milk · coffee · sardines (P.)</p><p><i>Sonnet XIV (unfinished)</i><br>The fog sits on the city like a cat…</p><p style="margin-top:2em">Mãe — 22 31 70 4?</p>` },
    ...(F().sketched_tile ? [{ img: PAPER, cls: 'doc-hand', html: `<p>The tile: a bell under three waves. Blue on white.</p><svg viewBox="0 0 120 110" style="display:block;width:55%;margin:0.5em auto" fill="none" stroke="#2f3f78" stroke-width="2.4" stroke-linecap="round"><path d="M42 20 Q42 8 60 8 Q78 8 78 20 L86 58 L34 58 Z"/><path d="M30 58 L90 58"/><circle cx="60" cy="64" r="4"/><path d="M10 80 q10-8 20 0 t20 0 t20 0 t20 0 t20 0"/><path d="M10 92 q10-8 20 0 t20 0 t20 0 t20 0 t20 0"/><path d="M10 104 q10-8 20 0 t20 0 t20 0 t20 0 t20 0"/></svg>` }] : []),
    ...(F().founder_order ? [{ img: PAPER, cls: 'doc-hand', html: `<p>Ferreira 1611</p><p>Bastos 1648</p><p>Coutinho 1702</p><p>Sanches 1739</p><p>— ring last to first —</p>` }] : []),
  ]);

  // Tide clock face: the painted dial with hands drawn live
  S.showTideClock = (ticking) => G.closeup([{ img: 'close:close_tideclock', cls: 'square', canvas: { w: 600, h: 600, draw(c) {
    const g = c.getContext('2d'); let t0 = performance.now();
    const loop = now => {
      if (!c.isConnected) return;
      g.clearRect(0, 0, 600, 600);
      const s = ticking ? (now - t0) / 1000 : 0;
      const hand = (cx, cy, ang, len, w, col) => { g.save(); g.translate(cx, cy); g.rotate(ang); g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, len * 0.15); g.lineTo(0, -len); g.stroke(); g.restore(); };
      hand(300, 270, (3 + 12 / 60) / 12 * Math.PI * 2 + s * 0.002, 110, 9, '#2a1a0a');
      hand(300, 270, (12 / 60) * Math.PI * 2 + s * 0.02, 170, 6, '#2a1a0a');
      hand(300, 270, s * Math.PI * 2 / 60, 180, 2, '#8a1a10');
      hand(300, 420, Math.sin(s * 0.6) * 0.9 * (ticking ? 1 : 0), 60, 5, '#1a2a4a');
      g.fillStyle = '#b8913f'; g.beginPath(); g.arc(300, 270, 10, 0, 7); g.fill(); g.beginPath(); g.arc(300, 420, 7, 0, 7); g.fill();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  } } }], { auto: ticking ? 4200 : 0 });

  S.showPhoto = () => G.closeup([{ img: 'close:close_photo1934', cls: 'wide' }]);
  S.showPorthole = () => G.closeup([{ img: 'close:close_porthole', cls: 'square' }]);
  S.showClocks = () => G.closeup([{ img: 'close:close_clocks', cls: 'land', html: `<div class="doc-tags"><span style="left:11%;top:79%">F. 03:12</span><span style="left:33.5%;top:79%">B. 15:38</span><span style="left:56%;top:79%">C. 04:01</span><span style="left:79%;top:79%">J.C. 18:25</span></div>` }]);
  S.showBellMark = (text) => G.closeup([{ img: 'close:close_bronze', cls: 'land', html: `<div class="doc-engrave">${text}</div>` }], { auto: 2600 });
})();
