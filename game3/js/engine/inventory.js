// Inventory: items given and taken, the bar and its icons, one item used with another, the
// item cursor, and reading the notebook.
(function () {
  const E = window.Engine;
  const { canvas, $, wrap, invEl, invBar, ITEMS } = E;

  // ---------------------------------------------------------------- inventory
  function has(id) { return E.state.inv.includes(id); }
  const ITEM_SFX = { key: 'key_pickup', fkey: 'key_pickup', bkey: 'key_pickup', ckey: 'key_pickup', vkey: 'keys_ring', reserve_key: 'key_jingle', ledger: 'book_take', coins: 'cash_register',
    newspaper: 'paper_take', file55: 'paper_take', tidecard: 'paper_take', lyrics_sheet: 'paper_take', sketch: 'paper_take', brotherhood_charter: 'paper_take', vasco_card: 'paper_take',
    tongue: 'brass_heavy', twin: 'brass_heavy', matches: 'matchbox', glass: 'glass_set', lantern: 'lantern', knife: 'knife_take', sardine: 'sardine_catch', sanches_fragment: 'stone_clack', magnifier: 'pickup' };
  function giveItem(id, silent) {
    if (has(id)) return;
    E.state.inv.push(id); renderInv();
    // each thing taken sounds like itself: a key jingles, paper rustles, brass is heavy
    if (!silent) { Sound.sfx(ITEM_SFX[id] || 'pickup', 0.8); flashInv(); }
  }
  function takeItem(id) { E.state.inv = E.state.inv.filter(i => i !== id); if (E.selItem === id) E.selItem = null; renderInv(); }
  function flashInv() {
    invBar.classList.add('show', 'flash');
    setTimeout(() => invBar.classList.remove('flash'), 900);
    setTimeout(() => { if (!E.invHover && !E.selItem) invBar.classList.remove('show'); }, 1800);
  }
  function itemName(id) { const it = ITEMS[id]; return typeof it.name === 'function' ? it.name() : it.name; }
  function renderInv() {
    invEl.innerHTML = '';
    E.state.inv.forEach(id => {
      const slot = document.createElement('div');
      slot.className = 'slot' + (E.selItem === id ? ' selected' : '');
      const c = document.createElement('canvas'); c.width = 96; c.height = 96;
      c.getContext('2d').drawImage(iconFor(id), 0, 0, 96, 96);
      slot.appendChild(c);
      slot.title = itemName(id);
      slot.onclick = e => { e.stopPropagation(); clickItem(id); };
      if (ITEMS[id] && ITEMS[id].read) { // the notebook: a Read tab on its icon (also the N key and the ✎ button)
        const rb = document.createElement('button'); rb.className = 'read'; rb.textContent = 'Read'; rb.title = itemName(id) + ' (N)';
        rb.onclick = e => { e.stopPropagation(); readItem(id); };
        slot.appendChild(rb);
      }
      slot.oncontextmenu = e => { e.preventDefault(); e.stopPropagation(); if (!E.busy) lookItem(id); };
      slot.onmouseenter = () => { if (!E.busy) E.showHoverText(E.selItem && E.selItem !== id ? `Use ${itemName(E.selItem)} with ${itemName(id)}` : itemName(id), slot); };
      slot.onmouseleave = () => E.hideHover();
      invEl.appendChild(slot);
    });
    updateCursor();
    const nb = $('#nb-btn'); if (nb) nb.classList.toggle('hidden', !E.state.inv.includes('notebook'));
  }
  // read an item's pages (the notebook): N key, the ✎ button, the Read tab on its inventory icon
  async function readItem(id) {
    id = id || 'notebook';
    const cu = $('#closeup');
    if (cu && !cu.classList.contains('hidden')) { const x = cu.querySelector('.x'); if (x) x.click(); return; } // a second press closes it
    if (!E.state.inv.includes(id) || !ITEMS[id]) return;
    if (E.busy || E.dialogResolve || E.cutscene) { E.toast('Not now'); return; }
    E.noteInput(); E.selItem = null; renderInv(); invBar.classList.remove('show');
    E.busy++; try { await E.runHandler(ITEMS[id].read || ITEMS[id].look); } finally { E.busy--; E.updateHover(); }
  }
  async function lookItem(id) {
    E.busy++; try { await E.runHandler(ITEMS[id].look); } finally { E.busy--; }
  }
  function clickItem(id) {
    if (E.busy) return;
    Sound.sfx('click');
    if (E.selItem && E.selItem !== id) {
      const a = ITEMS[E.selItem], b = ITEMS[id];
      const h = (a.with && a.with[id]) || (b.with && b.with[E.selItem]);
      E.selItem = null; renderInv();
      E.busy++; E.runHandler(h || (E.player.speaker || 'alan') + '_def_item').finally(() => { E.busy--; });
      return;
    }
    E.selItem = E.selItem === id ? null : id;
    renderInv();
  }
  function iconFor(id) {
    const it = ITEMS[id], key = typeof it.icon === 'function' ? it.icon() : (it.icon || id);
    return FX.icon(key);
  }
  function updateCursor() {
    wrap.classList.toggle('holding', !!E.selItem);
    if (E.selItem) {
      const [c, cg] = FX.mk(64, 64);
      cg.drawImage(iconFor(E.selItem), 0, 0, 64, 64);
      canvas.style.cursor = `url(${c.toDataURL()}) 8 8, pointer`;
    } else canvas.style.cursor = '';
  }

  Object.assign(E, { has, giveItem, takeItem, itemName, renderInv, readItem });
})();
