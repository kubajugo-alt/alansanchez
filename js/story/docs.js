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
    { img: PAPER, cls: 'doc-hand', html: `<p>milk · coffee · sardines (P.)</p><p><i>Sonnet XIV (unfinished)</i><br>The fog sits on the city like a cat…</p><p style="margin-top:2em">Mãe — 001 904 82? …</p>${F().vasco_thursday ? '<p>Dr. V. Teles — Sé, quintas (card)</p>' : ''}` },
    ...(F().sketched_tile ? [{ img: PAPER, cls: 'doc-hand', html: `<p>The tile: a bell under three waves. Blue on white.</p><svg viewBox="0 0 120 110" style="display:block;width:55%;margin:0.5em auto" fill="none" stroke="#2f3f78" stroke-width="2.4" stroke-linecap="round"><path d="M42 20 Q42 8 60 8 Q78 8 78 20 L86 58 L34 58 Z"/><path d="M30 58 L90 58"/><circle cx="60" cy="64" r="4"/><path d="M10 80 q10-8 20 0 t20 0 t20 0 t20 0 t20 0"/><path d="M10 92 q10-8 20 0 t20 0 t20 0 t20 0 t20 0"/><path d="M10 104 q10-8 20 0 t20 0 t20 0 t20 0 t20 0"/></svg>` }] : []),
    ...(F().tongue_sketched ? [{ img: PAPER, cls: 'doc-hand', html: `<p>Lacerda's glass case. 'Not for sale.'</p><svg viewBox="0 0 160 70" style="display:block;width:70%;margin:0.6em auto" fill="none" stroke="#3a3428" stroke-width="2.2" stroke-linecap="round"><circle cx="14" cy="35" r="6"/><path d="M20 35 L28 35"/><rect x="28" y="14" width="40" height="42" rx="7"/><path d="M36 15 L36 55 M60 15 L60 55"/><path d="M68 28 L78 30 L78 40 L68 42"/><path d="M78 32 L140 33 M78 38 L140 37"/><rect x="140" y="29" width="10" height="12" rx="4"/></svg><p>Loop, drum of a bob, collar, long shank, knob. Green in the dents.</p>${F().knows_twin ? '<p>A. says: <i>founders pour twice.</i> The twin is in the Sé reserve. Same pour, same marks. Never rung.</p>' : ''}` }] : []),
    ...(F().founder_order ? [{ img: PAPER, cls: 'doc-hand', html: `<p>Ferreira 1611</p><p>Bastos 1648</p><p>Coutinho 1702</p><p>Sanches 1739</p><p>— ring last to first —</p>` }] : []),
    ...((F().lore || []).length ? [{ img: PAPER, cls: 'doc-hand', html: `<p style="font-family:'IM Fell English',serif;text-align:center">The Bell</p>` +
      LORE.filter(([k]) => F().lore.includes(k)).map(([, t]) => `<p style="font-size:0.85em">· ${t}</p>`).join('') }] : []),
  ]);
  // "The Bell": what Alan has pieced together, in the order the city told him
  const LORE = [
    ['irmandade', 'The Brotherhood: widows and shipowners. Wanted their drowned back.'],
    ['joaquim_card', 'Grandfather donated their things to a museum and told nobody. Family tradition.'],
    ['file1955', "It's happened before. 1955. Grandfather was there."],
    ['suit', "A man in a cream linen suit. Patient. Asking about Maria's son."],
    ['turnings', "They don't die at night. They die when the river turns. (Rui's times against the tide table.)"],
    ['celeste', 'They die when the river turns. The tiles are bits of the sea. Bronze breaks them.'],
    ['reverse', "The bell was baptised in the sea. It doesn't send storms away. It invites them in."],
    ['godparents', "The Lacerdas were its godparents. That's why the water listens to them."],
    ['blood', 'Founders bled into the bronze. Only our blood makes it talk. Lucky us.'],
    ['order', 'Ring it backward, last to first: Sanches, Coutinho, Bastos, Ferreira. It renounces the sea.'],
    ['case', "Lacerda keeps a bell's tongue under glass. Not for sale. He'd notice a hair moved on the velvet."],
    ['twin', 'The founders cast two tongues from one pour. Only one was blessed and rung. The twin is in the Sé reserve. Grandfather put it there.'],
    ['father', 'Lacerda wants his father back. <s>So do I. Mine never came home either.</s>'],
  ];

  // Duarte's lyrics sheet: the fado written out in Portuguese, and in English for the foreigner
  S.LYRICS_PT = `<h3 style="font-family:'Homemade Apple',cursive;font-size:1.05em;margin:0 0 .4em">O Sino Afogado</h3><p style="margin:0 0 .55em">Nove dias jaz a névoa<br>sobre o rio, sobre o cais;<br>nove noites dorme o bronze<br>onde não o ouvem mais.</p><p style="margin:0 0 .55em">Os fundidores, por medo,<br>cortaram-lhe a língua um dia,<br>e ataram-no com o sangue<br>que nas veias lhes corria.</p><p style="margin:0 0 .55em">Ai, meu amor de fundidor,<br>não me fales do teu sino;<br>que eu já sei que o mar é longo<br>e o teu sangue é teu destino.</p><p style="margin:0 0 .55em">Onde o Carmo reza sem tecto,<br>a pedra chora sal frio;<br>vira as letras sete vezes,<br>filho do bronze e do rio.</p><p style="margin:0 0 .55em">Se o medo te prender, amor,<br>como prendeu quem o fez,<br>o mar espera, o mar é longo:<br>toca-o ao contrário, de vez.</p><p style="margin:0 0 .55em">Ai, meu amor de fundidor,<br>não me fales do teu sino;<br>que eu já sei que o mar é longo<br>e o teu sangue é teu destino.</p>`;
  S.LYRICS_EN = `<h3 style="font-family:'Homemade Apple',cursive;font-size:1.05em;margin:0 0 .4em">The Drowned Bell</h3><p style="margin:0 0 .55em">Nine days the fog lies<br>over the river, over the quay;<br>nine nights the bronze sleeps<br>where no one hears it any more.</p><p style="margin:0 0 .55em">The founders, out of fear,<br>cut out its tongue one day,<br>and bound it with the blood<br>that ran in their veins.</p><p style="margin:0 0 .55em">Oh, my bell-founder love,<br>don't speak to me of your bell;<br>for I know the sea is long,<br>and your blood is your fate.</p><p style="margin:0 0 .55em">Where the Carmo prays without a roof,<br>the stone weeps cold salt;<br>turn the letters seven times,<br>son of the bronze and the river.</p><p style="margin:0 0 .55em">If fear holds you, love,<br>as it held those who made it,<br>the sea waits, the sea is long:<br>ring it backward, once and for all.</p><p style="margin:0 0 .55em">Oh, my bell-founder love,<br>don't speak to me of your bell;<br>for I know the sea is long,<br>and your blood is your fate.</p>`;
  S.readLyrics = () => G.closeup([
    { img: PAPER, cls: 'doc-hand', html: `<div style="font-size:0.62em;line-height:1.45">${S.LYRICS_PT}</div>` },
    { img: PAPER, cls: 'doc-hand', html: `<div style="font-size:0.62em;line-height:1.45">${S.LYRICS_EN}<p style="text-align:right;margin-top:.6em">D.</p></div>` },
  ]);
  // the Diário de Notícias: weather, football, and a week of tides. Fog day 1 is Monday 23 October 1995,
  // so today, the ninth day, is Tuesday 31 (the tenth dawn is 1 November, All Saints')
  const FOG_DAY1 = 23, WEEKDAY = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  S.readPaper = () => {
    const rows = S.tideRows().slice(0, 9).map((r, i) => `<tr><th>${WEEKDAY[i % 7]} ${i + FOG_DAY1}</th>${r.map(m => `<td>${hm(m)}</td>`).join('')}</tr>`).join('');
    return G.closeup([{ img: PAPER, cls: '', html: `<h3 style="font-family:'IM Fell English',serif;letter-spacing:.08em">DIÁRIO DE NOTÍCIAS</h3>
      <p style="font-size:.75em;margin:.2em 0 .6em">NEVOEIRO CONTINUA SOBRE A CIDADE · Benfica empata em Setúbal · O tempo: frio, nevoeiro cerrado</p>
      <h4 style="margin:.2em 0">Marés · preia-mar e baixa-mar, Cais do Sodré</h4><table class="doc-table">${rows}</table>` }]);
  };
  // the deduction, in Alan's notebook: the three deaths against the tide table
  S.deductionPage = () => {
    const rows = S.tideRows().slice(0, 9);
    const deaths = { 1: 192, 4: 938, 7: 241 }; // Ferreira 03:12 (day 2, Tue 24), Bastos 15:38 (day 5, Fri 27), Maria 04:01 (day 8, Mon 30)
    const html = rows.map((r, i) => `<tr><th>${i + FOG_DAY1}</th>${r.map(m => `<td class="${deaths[i] === m ? 'circled' : ''}">${hm(m)}</td>`).join('')}<td style="font-family:'Homemade Apple',cursive;font-size:.8em">${{ 1: 'Ferreira', 4: 'Bastos', 7: 'M. Coutinho' }[i] || ''}</td></tr>`).join('');
    return G.closeup([{ img: PAPER, cls: '', html: `<h3 class="doc-hand" style="margin:0">turnings vs. deaths</h3><table class="doc-table">${html}</table>
      <p class="doc-hand" style="margin-top:.6em">03:12 · 15:38 · 04:01 — every one on a turning.</p>` }]);
  };
  // Ferreira's drawer: a brass four-wheel combination lock. Resolves true when it opens.
  S.drawerLock = function () {
    const code = F().lock_digits || (F().lock_digits = [0, 0, 0, 0]);
    let solved = false;
    if (window.FAST && code.join('') === '0312') { F().drawer_unlocked = true; return Promise.resolve(true); } // test hook: digits pre-set
    // the painted lock plate (art/closeups/close_drawerlock.jpg); only the wheels' numbers are drawn live
    return G.closeup([{ img: 'close:close_drawerlock', cls: 'land', canvas: { w: 1280, h: 720, draw(c) {
      const g = c.getContext('2d');
      const W = [315, 467, 625, 779], WY = 352, HW = 44, HH = 98, KNOB = [988, 356];
      const paint = () => {
        g.clearRect(0, 0, 1280, 720);
        g.textAlign = 'center'; g.textBaseline = 'middle';
        W.forEach((x, i) => {
          g.save(); g.beginPath(); g.rect(x - HW, WY - HH, HW * 2, HH * 2); g.clip();
          g.fillStyle = 'rgba(60,38,14,0.32)'; g.font = '44px Georgia, serif';
          g.fillText((code[i] + 9) % 10, x, WY - 72); g.fillText((code[i] + 1) % 10, x, WY + 76);
          g.fillStyle = '#24170a'; g.font = 'bold 92px Georgia, serif'; g.fillText(code[i], x, WY + 4);
          // the wheel's curve: darker toward the top and bottom of the window
          const sh = g.createLinearGradient(0, WY - HH, 0, WY + HH);
          sh.addColorStop(0, 'rgba(40,24,6,0.55)');
          sh.addColorStop(0.28, 'rgba(40,24,6,0)');
          sh.addColorStop(0.72, 'rgba(40,24,6,0)');
          sh.addColorStop(1, 'rgba(40,24,6,0.6)');
          g.fillStyle = sh; g.fillRect(x - HW, WY - HH, HW * 2, HH * 2);
          g.restore();
        });
        if (solved) { // the latch gives: a warm glint on the knob
          const gl = g.createRadialGradient(KNOB[0], KNOB[1], 4, KNOB[0], KNOB[1], 90);
          gl.addColorStop(0, 'rgba(255,236,170,0.75)'); gl.addColorStop(1, 'rgba(255,220,140,0)');
          g.fillStyle = gl; g.beginPath(); g.arc(KNOB[0], KNOB[1], 90, 0, 7); g.fill();
        }
      };
      paint();
      c.style.cursor = 'pointer';
      c.onclick = async ev => {
        ev.stopPropagation();
        const r = c.getBoundingClientRect(), x = (ev.clientX - r.left) * 1280 / r.width, y = (ev.clientY - r.top) * 720 / r.height;
        const i = W.findIndex(wx => Math.abs(x - wx) < HW + 14 && Math.abs(y - WY) < HH + 10);
        if (i >= 0) { code[i] = (code[i] + (y < WY ? 9 : 1)) % 10; window.Sound && Sound.sfx('dial_click', 0.5, 0.9 + Math.random() * 0.2); paint(); return; }
        if (Math.hypot(x - KNOB[0], y - KNOB[1]) < 80 && !solved) {
          if (code.join('') === '0312') { solved = true; paint(); window.Sound && Sound.sfx('drawer_open', 0.6); F().drawer_unlocked = true;
            setTimeout(() => { const xb = document.querySelector('#closeup .x'); if (xb) xb.click(); else document.querySelector('#closeup').click(); }, 700); }
          else { window.Sound && Sound.sfx('drawer_rattle', 0.5); G.say('alan_wrong_code'); }
        }
      };
    } } }]).then(() => solved || !!F().drawer_unlocked);
  };
  // Tide clock face: the painted dial with hands drawn live
  S.showTideClock = (ticking) => G.closeup([{ img: 'close:close_tideclock', cls: 'square', canvas: { w: 600, h: 600, draw(c) {
    const g = c.getContext('2d'); let t0 = performance.now();
    const loop = now => {
      if (!c.isConnected) return;
      g.clearRect(0, 0, 600, 600);
      const s = ticking ? (now - t0) / 1000 : 0;
      const hand = (cx, cy, ang, len, w, col) => {
        g.save();
        g.translate(cx, cy);
        g.rotate(ang);
        g.strokeStyle = col;
        g.lineWidth = w;
        g.lineCap = 'round';
        g.beginPath();
        g.moveTo(0, len * 0.15);
        g.lineTo(0, -len);
        g.stroke();
        g.restore();
      };
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
