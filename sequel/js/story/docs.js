// Readable things as close-ups: the daily paper, the bell's rubbing, the founders' letter (and Inês's decode), Abreu
// Galindo, the conservation list, the 1484 inquiry, Doña Pino's list, Baute's photograph and map, Rafa's sketchbook and
// drawing, Elena's notebook and the Guardia photograph, Elena's sun charts.
(function () {
  const S = window.S, { G, F, say } = S;
  const PAPER = 'close:paper_aged';
  const page = (html, cls) => ({ img: PAPER, cls: cls || 'doc-hand', html });
  // a painted picture as the whole page (art/closeups/<name>.jpg, listed in main.js's CLOSEUPS), fitted, with a short
  // caption under it (the approved pictures of 2026-10-31, art/review/items/cu/; HANDOFF entry 116)
  const photo = (name, cap) => ({ img: 'close:' + name, cls: 'photo', html: cap ? `<div class="cap">${cap}</div>` : '' });
  S.closePhoto = photo;

  // ---------------------------------------------------------------- the paper, one a day from Chano's kiosk
  const PAPERS = {
    // (Tuesday's plants two things early: Montesdeoca's south-coast plans and the weather; the user, 2026-10-29)
    1: ['Montesdeoca anuncia un nuevo hotel en el sur', 'Ignacio Montesdeoca, owner of the Hotel Cristina, presents plans for a 600-room resort at Meloneras, "with a waterfall". Also: Las Palmas turns 518; bonfire permits for San Juan. The weather: panza de burro until further notice.'],
    2: ['El Museo Canario recibe a sus mecenas', 'The Risco Caído expedition welcomes "a specialist from Lisbon". Hotelier Ignacio Montesdeoca promises new display cases.'],
    3: ['Un mes sin respuestas', 'A month after José "Pepe" Santana, 72, a La Isleta fisherman and one of seven survivors of the trawler Virgen del Pino (1971), was found drowned in his bed, his floor dry, his son asks why the police closed the file in a day.'],
    4: ['Mareas a deshoras en Las Canteras', 'The harbour master cannot explain tides arriving at the wrong hours. Surfers report "waves coming in backwards".'],
    5: ['Seis muertes por ahogamiento lejos del agua', 'Six people found drowned far from any water since December, one a month: in the barranco below Artenara, in Agaete, Arguineguín, Gáldar, Telde and La Isleta. The police "see no relation".'],
    6: ['Niebla y agua en La Isleta', 'Black fog and flooding in La Isleta on Saturday evening, with no rain and no wind. A fisherwoman, 74, "saved by her husband, who was mending nets".'],
    7: ['¡Feliz cumpleaños, Las Palmas!', 'Fireworks tonight over Las Canteras for the city\'s 518th birthday.'],
  };
  S.readPaper = async function () {
    const p = PAPERS[F().paper_day || F().ch || 1] || PAPERS[1];
    await G.closeup([page(`<p style="font-family:'IM Fell English',serif;text-align:center;font-size:1.3em">LA PROVINCIA</p><h3>${p[0]}</h3><p>${p[1]}</p>`, 'doc-news')]);
    await say(F().ch === 3 ? 'alan_read_paper_pepe' : F().ch === 5 ? 'alan_read_paper_agustin' : (F().paper_day || F().ch) === 1 ? 'alan_read_paper_tue' : 'alan_read_paper');
    if (F().ch === 3) F().pepe_known = true;
  };

  // Tuesday's postcard to Inês (bought and posted at Chano's kiosk, js/story/tue.js): written from the inventory
  S.writeCard = async function () {
    const f = F();
    if (f.postcard_written) { await G.closeup([photo('postcard')]); return say('alan_look_postcard'); }
    await G.closeup([photo('postcard', 'Las Canteras · Gran Canaria'), page(`<h3>Las Canteras · Gran Canaria</h3><p>Inês. Arrived. Luggage in Madrid. Vasco is radiant, there's no other word for it. He kissed me in front of two nuns.</p><p>I don't know why that makes me want to cry. Don't tell him.</p><p style="text-align:right">A.</p>`)]);
    await say('alan_postcard_write');
    f.postcard_written = true;
    await say('alan_postcard_written');
  };

  // ---------------------------------------------------------------- the bell and the founders
  S.readInscription = async function () {
    await G.closeup([photo('rubbing', `Santa Ana · the north bell. The founders' mark: the S between two bells. The same as the stone in Lisbon. The same as Grandfather's ledger.`)]);
    await say('alan_look_inscription');
  };
  S.readLetter = async function () {
    if (F().fax_read) return S.readFax();
    await G.closeup([photo('letter_1751', `<i>Ao proximo fundidor que vier … a fechadura da montanha … Magec … nao toqueis … as mulheres de branco … a agua … ultima … desceo com ella …</i>`)]);
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
    // (one a month, at the new moon, from the winter turning: CAVE6.md; the seventh, the sun, never left)
    const n = S.discsOut(), DATES = ['20.XII.95', '20.I.96', '18.II.96', '19.III.96', '17.IV.96', '17.V.96'];
    const rows = [1, 2, 3, 4, 5, 6, 7].map(i => `<p>Disco ${['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][i - 1]} · ${i <= n ? `retirado ${DATES[i - 1]} (conservación)` : '<i>in situ</i>'}</p>`).join('');
    await G.closeup([page(`<h3>Cueva 6 · discos de obsidiana · conservación</h3>${rows}<p style="text-align:right">R. B.</p>`, 'doc-ledger')]);
    F().saw_disc_list = true;
    await say(F().ch >= 5 ? 'alan_look_disclist_late' : 'alan_look_disclist');
  };
  S.readInquiry = async function () {
    await G.closeup([
      page(`<h3>Pesquisa · 1484 · fol. 11</h3><p>Into the loss of the caravels <i>Santa Clara</i>, <i>La Gallega</i> and <i>San Telmo</i>, and of the camp before Gáldar.</p><p>Juan de Quintana, master of the <i>Santa Clara</i>, sworn: that on the eve of the equinox of March the sea rose black <b>against the wind</b>; that women in white sang on the cliffs; that the sea came every night thereafter into low places and beds, for three months; that at noon on the day of Saint John it went back, and did not come again.</p>`),
      page(`<h3>fol. 13</h3><p>The bishop declared it a miracle of the Baptist.</p><p>Juan de Quintana, pulled from the water by a Canario fisherman, died in his bed eleven days after giving this testimony. He was found drowned.</p><p style="font-family:'Homemade Apple',cursive;text-align:right;margin-top:2em">Nadie preguntó a las mujeres.</p><p style="font-size:0.8em;opacity:0.7">1505: requested by the Holy Office, which searched one year for "las brujas del 83", and found no one.</p>`),
    ]);
    F().inquiry_read = true;
  };
  S.readBauteDesk = async function () {
    await G.closeup([
      photo('baute_1966', `On the back, in ink: <i>Abuela's hill. They put them in the skip.</i>`),
      photo('map_south', `The south coast: six hotels circled in red. Four of the six are Montesdeoca's.`),
    ]);
    F().saw_map = true;
  };

  // ---------------------------------------------------------------- La Isleta
  S.readPinoList = async function () {
    // the seven the fishing boat pulled out of the water in 1971: five crossed out, one a month since Christmas
    const struck = n => n <= 5;
    const names = ['Juan Afonso', 'Tomás Rivero', 'Andrés Ojeda', 'Domingo Hernández', 'José Santana', 'Pino Medina', 'Antonio Cabrera'];
    await G.closeup([page(`<h3>Los que el mar devolvió</h3>${names.map((nm, i) => `<p>${struck(i + 1) ? `<s>${nm}</s>` : nm}</p>`).join('')}<p style="opacity:0.7">(The seven from the <i>Virgen del Pino</i>, 1971.)</p><p style="opacity:0.7">(In pencil, by the crossed-out names: <i>enero, Agaete · febrero, Arguineguín · marzo, Gáldar · abril, Telde · mayo, aquí</i>. By Antonio: <i>Caracas</i>. By Pino: <i>junio</i>.)</p>${F().alan_on_list ? '<p style="font-family:\'Homemade Apple\',cursive">Alan Sanches</p>' : ''}`)]);
    F().pino_list = true;
  };

  // ---------------------------------------------------------------- Rafa
  S.readSketchbook = async function () {
    await G.closeup([
      // (the laughing man, "el portugués. Triste.", is on the sketchbook's spread now)
      photo('sketchbook', `Fishermen. A dog asleep under a domino table. Hands. A woman laughing with her eyes shut. And, Friday, later: a man laughing too hard.`),
      photo('napkin_yeray', `Friday, a napkin from the bar. Round the edge: <i>…has the key. The Portuguese doctor doesn't know.</i> Underneath: <b>Yeray, del Risco</b>.`),
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
      photo('elena_notebook', `E. Suárez · Cueva 6 · 1995. Seven circles, the floor of the chamber under the cave; one shaded empty.`),
      page(`<p>Not a calendar. The triangles are arrows: all of them point <b>down</b>. The discs are not ornaments, they are mirrors: at noon each throws the sun back up onto its own triangle. Six moons and the sun. <b>That is the lock.</b></p><p>To close it: every disc back in its own socket, the sun flat in the middle, at noon on the turning. To open it: the sun turned to face the sun. Send him back.</p><p>The door is in the floor.</p><p><i>Whoever closes it has to be in the water. Ask C. if the grandmothers' saying has a second half.</i></p>`),
    ]);
    F().elena_read = true;
  };
  S.readGcPhoto = async function () {
    await G.closeup([photo('gc_photo', `Guardia Civil · Artenara · 22.XII.95. The windscreen of a Renault 4: a triangle drawn in a crust of salt, point down.${F().cave_explained ? ' The same triangle as the engravings in Carmen\'s photographs of Cave 6.' : ''}`)]);
    F().gc_seen = true;
  };
  S.readCharts = async function () {
    await G.closeup([photo('elena_charts', `E. Suárez · Cueva 6 · the sockets: a line from each to its triangle on the wall, every line crossing in the hole. The sun disc tipped a little off the flat.`)]);
    await say('vasco_look_charts');
  };
})();
