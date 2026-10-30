// Readable things as close-ups: the daily paper, the bell's rubbing, the founders' letter (and Inês's decode), Abreu
// Galindo, the conservation list, the 1484 inquiry, Doña Pino's list, Baute's photograph and map, Rafa's sketchbook and
// drawing, Elena's notebook and the Guardia photograph, Elena's sun charts.
(function () {
  const S = window.S, { G, F, say } = S;
  const PAPER = 'close:paper_aged';
  const page = (html, cls) => ({ img: PAPER, cls: cls || 'doc-hand', html });

  // ---------------------------------------------------------------- the paper, one a day from Chano's kiosk
  const PAPERS = {
    // (Tuesday's plants two things early: Montesdeoca's south-coast plans and the weather; the user, 2026-10-29)
    1: ['Montesdeoca anuncia un nuevo hotel en el sur', 'Ignacio Montesdeoca, owner of the Hotel Cristina, presents plans for a 600-room resort at Meloneras, "with a waterfall". Also: Las Palmas turns 518; bonfire permits for San Juan. The weather: panza de burro until further notice.'],
    2: ['El Museo Canario recibe a sus mecenas', 'The Risco Caído expedition welcomes "a specialist from Lisbon". Hotelier Ignacio Montesdeoca promises new display cases.'],
    3: ['Muere ahogado en su cama un pescador de La Isleta', 'José "Pepe" Santana, 61, one of four survivors of the trawler Virgen del Pino (1971), found drowned in his bed. His floor was dry. Police speak of "a medical cause".'],
    4: ['Mareas a deshoras en Las Canteras', 'The harbour master cannot explain tides arriving at the wrong hours. Surfers report "waves coming in backwards".'],
    5: ['Fallece Agustín Ramos, socorrista jubilado', 'The retired lifeguard, saved from a rip at Las Canteras in 1958, was found in his armchair, drowned. The third death by water on dry land this week.'],
    6: ['Niebla y agua en La Isleta', 'Black fog and flooding in La Isleta on Saturday evening, with no rain and no wind. A fisherwoman, 74, "saved by her husband, who was mending nets".'],
    7: ['¡Feliz cumpleaños, Las Palmas!', 'Fireworks tonight over Las Canteras for the city\'s 518th birthday.'],
  };
  S.readPaper = async function () {
    const p = PAPERS[F().paper_day || F().ch || 1] || PAPERS[1];
    await G.closeup([page(`<p style="font-family:'IM Fell English',serif;text-align:center;font-size:1.3em">LA PROVINCIA</p><h3>${p[0]}</h3><p>${p[1]}</p>`, 'doc-news')]);
    await say(F().ch === 3 ? 'alan_read_paper_pepe' : F().ch === 5 ? 'alan_read_paper_agustin' : (F().paper_day || F().ch) === 1 ? 'alan_read_paper_tue' : 'alan_read_paper');
    if (F().ch === 3) F().pepe_known = true;
    if (F().ch === 5) F().agustin_known = true;
  };

  // Tuesday's postcard to Inês (bought and posted at Chano's kiosk, js/story/tue.js): written from the inventory
  S.writeCard = async function () {
    const f = F();
    if (f.postcard_written) return say('alan_look_postcard');
    await G.closeup([page(`<h3>Las Canteras · Gran Canaria</h3><p>Inês. Arrived. Luggage in Madrid. Vasco is radiant, there's no other word for it. He kissed me in front of two nuns.</p><p>I don't know why that makes me want to cry. Don't tell him.</p><p style="text-align:right">A.</p>`)]);
    await say('alan_postcard_write');
    f.postcard_written = true;
    await say('alan_postcard_written');
  };

  // ---------------------------------------------------------------- the bell and the founders
  S.readInscription = async function () {
    await G.closeup([page(`<h3>Santa Ana · the north bell</h3><p style="font-family:'IM Fell English',serif;text-align:center">SANTA ANA ROGA POR NOS<br>FVNDIDO EM LISBOA E NAS PALMAS<br>ANNO 1751</p><p style="text-align:center;font-size:1.4em">⟁ S ⟁</p><p>The founders' mark: the S between two bells. The same as the stone in Lisbon. The same as Grandfather's ledger.</p>`)]);
    await say('alan_look_inscription');
  };
  S.readLetter = async function () {
    if (F().fax_read) return S.readFax();
    await G.closeup([page(`<p style="font-family:'Homemade Apple',cursive;opacity:0.55;line-height:2">Ao proximo fundidor que vier … a fechadura da montanha … Magec … nao toqueis … as mulheres de branco … a agua … ultima … desceo com ella …</p>`)]);
    await say('alan_look_letter');
  };
  S.readFax = async function () {
    await G.closeup([
      page(`<h3>FAX · Livraria Sanches, Lisboa · 22.VI.96</h3><p><i>Alan, here it is. Third time through, with Bastos's dictionary and two coffees. — I.</i></p><p>To the next founder who comes. We came to learn the lock in the mountain, because we are to cast a bell for the widows and we are afraid of what it may call. The women of the island called the Sea in the year '83 and it would not be aimed. They shut it out with the sun.</p>`),
      page(`<p>Know these rules, as they were told to us. <b>The Sea strikes first at whoever understands the lock.</b> <b>It comes for every soul that was taken back from it.</b> It may be shut out again only at a turning, from inside its own water, at the door, while the sun rises.</p><p>The last of the women set the stones with her own hands, standing in the water. When the door shut, <b>she went down with it.</b> No one held her.</p><p>We have cast our first bell here, under her lock. God keep it silent. <i>— S., F., B., C., Las Palmas, 1751</i></p>`),
    ]);
    if (!F().fax_read) { F().fax_read = true; await say('alan_read_fax_1', 'alan_read_fax_2'); }
    else await say('alan_look_fax');
  };
  S.readGalindo = async function () {
    await G.closeup([page(`<h3>Fr. J. de Abreu Galindo · <i>Historia de la conquista de las siete islas de Canaria</i></h3><p>Of the women they called <i>harimaguadas</i>, who lived apart and served at the holy places, and bathed in the sea at set times …</p><p>Of <b>Magec</b>, the sun, which they held above all …</p><p style="opacity:0.7">(Someone has underlined "bathed in the sea at set times" twice, in pencil.)</p>`)]);
    await say('alan_look_galindo');
  };

  // ---------------------------------------------------------------- the museum
  S.readDiscList = async function () {
    const n = S.discsOut(), rows = [1, 2, 3, 4, 5, 6, 7].map(i => `<p>Disco ${['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][i - 1]} · ${i <= n ? (i === 1 ? '<s>21.XII.95</s> retirado (conservación)' : `retirado ${17 + i}.VI.96 (conservación)`) : '<i>in situ</i>'}</p>`).join('');
    await G.closeup([page(`<h3>Cueva 6 · discos de obsidiana · conservación</h3>${rows}<p style="text-align:right">R. B.</p>`, 'doc-ledger')]);
    F().saw_disc_list = true;
    await say(F().ch >= 5 ? 'alan_look_disclist_late' : 'alan_look_disclist');
  };
  S.readInquiry = async function () {
    await G.closeup([
      page(`<h3>Pesquisa · 1484</h3><p>Into the loss of the caravels <i>Santa Clara</i>, <i>La Gallega</i> and <i>San Telmo</i>, and of the camp before Gáldar.</p><p>Juan de Quintana, master of the <i>Santa Clara</i>, sworn: that on the eve of the equinox of March the sea rose black <b>against the wind</b>; that women in white sang on the cliffs; that the sea came every night thereafter into low places and beds, for three months; that on the morning of Saint John it went back, and did not come again.</p>`),
      page(`<p>The bishop declared it a miracle of the Baptist.</p><p>Juan de Quintana, pulled from the water by a Canario fisherman, died in his bed eleven days after giving this testimony. He was found drowned.</p><p style="font-family:'Homemade Apple',cursive;text-align:right;margin-top:2em">Nadie preguntó a las mujeres.</p><p style="font-size:0.8em;opacity:0.7">1505: requested by the Holy Office, which searched one year for "las brujas del 83", and found no one.</p>`),
    ]);
    F().inquiry_read = true;
  };
  S.readBauteDesk = async function () {
    await G.closeup([
      page(`<h3>Photograph · 1966</h3><p>A hillside of red earth torn open, a bulldozer, a skip. A young man in shirtsleeves with a clipboard has turned to look at the camera. On the back, in ink: <i>Abuela's hill. They put them in the skip.</i></p>`),
      page(`<h3>Map · the south coast</h3><p>Maspalomas, Playa del Inglés, San Agustín. Six hotels circled in red. In the margin: <b>23·VI · amanecer</b>. Four of the six are Montesdeoca's.</p>`),
    ]);
    F().saw_map = true;
  };

  // ---------------------------------------------------------------- La Isleta
  S.readPinoList = async function () {
    const struck = n => (F().ch >= 3 && n === 1) || (F().ch >= 5 && n === 2);
    const names = ['José Santana', 'Agustín Ramos', 'Pino Medina', 'Antonio Cabrera'];
    await G.closeup([page(`<h3>Virgen del Pino · 1971</h3>${names.map((nm, i) => `<p>${struck(i + 1) ? `<s>${nm}</s>` : nm}</p>`).join('')}<p style="opacity:0.7">(Agustín was not on the boat: "the sea had him first, in '58, and an old man in a rowing boat took him back".)</p>${F().alan_on_list ? '<p style="font-family:\'Homemade Apple\',cursive">Alan Sanches</p>' : ''}`)]);
    F().pino_list = true;
  };

  // ---------------------------------------------------------------- Rafa
  S.readSketchbook = async function () {
    await G.closeup([
      page(`<h3>&nbsp;</h3><p>Fishermen. A dog asleep under a domino table. Hands, dozens of hands. A woman laughing with her eyes shut.</p>`),
      page(`<h3>Friday</h3><p>A boy at the end of the bar, head on his arm. Beside him, in Rafa's quick hand, words caught as they were said:</p><p style="font-family:'Homemade Apple',cursive">"la conservación es mentira — los discos bajan a la bóveda de abajo, de noche — sólo Rayco tiene la llave — ¿y si se lo digo al doctor?"</p><p>Underneath: <b>Yeray, del Risco</b>.</p>`),
      page(`<h3>Friday, later</h3><p>A man with his head thrown back, laughing too hard. Under it: <i>el portugués. Triste.</i></p>`),
    ]);
    if (!F().sketchbook_read) { F().sketchbook_read = true; await say('alan_read_sketchbook_1', 'alan_read_sketchbook_2', 'alan_read_sketchbook_3'); }
  };
  S.lookDrawing = async function () {
    await G.showStill('still_rafa_drawing', () => say('alan_look_drawing'), { zoom: [1.02, 1.08] });
    G.endStill();
  };

  // ---------------------------------------------------------------- Elena
  S.readElena = async function () {
    await G.closeup([
      page(`<h3>E. Suárez · Cueva 6 · 1995</h3><p>Seven circles in a line; one shaded empty. <i>"Six. There should be seven."</i></p><p>Not a calendar. The triangles are arrows: all of them point <b>down</b>. The discs are not ornaments, they steer the beam. With all seven the San Juan sun falls dead centre on the great triangle. <b>That is the lock.</b></p>`),
      page(`<p>To close it: every disc back, the last one turned to the tilt of the world. To open it: the last one turned so the beam falls on the door.</p><p>The door is in the floor.</p><p><i>Whoever closes it has to be in the water. Ask C. if the grandmothers' saying has a second half.</i></p>`),
    ]);
    F().elena_read = true;
  };
  S.readGcPhoto = async function () {
    await G.closeup([page(`<h3>Guardia Civil · Artenara · 22.XII.95</h3><p>The windscreen of a Renault 4, from outside. On the glass, drawn in a crust of salt, a triangle, point down.</p><p>${F().cave_explained ? 'The same triangle as the engravings in Carmen\'s photographs of Cave 6.' : ''}</p>`)]);
    F().gc_seen = true;
  };
  S.readCharts = async function () {
    await G.closeup([page(`<h3>E. Suárez · sun paths, Cueva 6</h3><p>The beam's path by date and hour, in a careful hand: equinox, solstice, the days between. A dotted line marked <i>"con los siete"</i> runs to the great triangle at the back, at <i>"San Juan, amanecer"</i>.</p>`, 'doc-ledger')]);
    await say('vasco_look_charts');
  };
})();
