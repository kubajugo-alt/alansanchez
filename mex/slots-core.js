// Mex slots: the maths. No DOM in here, so node can simulate it (see sim.mjs).
(function (root) {
  // w = how often a symbol lands (per cell); pay = line-bet multiples for 3, 4, 5 in a row from the left.
  const SYMS = [
    { id: 'wild',    name: 'Mex (wild)', w: 8,  pay: [50, 250, 1500] },
    { id: 'seven',   name: 'Lucky 7',    w: 6,  pay: [40, 150, 600] },
    { id: 'chili',   name: 'Chili',      w: 8,  pay: [25, 80, 300] },
    { id: 'guitar',  name: 'Guitar',     w: 9,  pay: [20, 60, 200] },
    { id: 'taco',    name: 'Taco',       w: 10, pay: [15, 40, 150] },
    { id: 'pizza',   name: 'Pizza',      w: 11, pay: [10, 30, 100] },
    { id: 'cactus',  name: 'Cactus',     w: 12, pay: [8, 25, 80] },
    { id: 'lime',    name: 'Lime',       w: 13, pay: [6, 20, 60] },
    { id: 'tee',     name: 'Black tee',  w: 14, pay: [5, 15, 50] },
    { id: 'jeans',   name: 'Blue jeans', w: 14, pay: [5, 15, 50] },
    { id: 'scatter', name: 'Bonus',      w: 4,  pay: [2, 10, 50] } // x total bet, anywhere on the reels
  ];
  const BY_ID = Object.fromEntries(SYMS.map(s => [s.id, s]));
  const TOTAL_W = SYMS.reduce((a, s) => a + s.w, 0);
  const REELS = 5, ROWS = 3;
  // row index on each of the five reels
  const LINES = [
    [1, 1, 1, 1, 1], [0, 0, 0, 0, 0], [2, 2, 2, 2, 2],
    [0, 1, 2, 1, 0], [2, 1, 0, 1, 2], [0, 0, 1, 2, 2],
    [2, 2, 1, 0, 0], [1, 0, 1, 2, 1], [1, 2, 1, 0, 1]
  ];
  const FREE_SPINS = { 3: 8, 4: 12, 5: 20 };
  const FREE_MULT = 2;

  function pick(rng) {
    let r = rng() * TOTAL_W;
    for (const s of SYMS) { if ((r -= s.w) < 0) return s.id; }
    return SYMS[SYMS.length - 1].id;
  }

  // grid[reel][row]; at most one bonus symbol per reel
  function spinGrid(rng) {
    rng = rng || Math.random;
    const grid = [];
    for (let x = 0; x < REELS; x++) {
      const col = [];
      for (let y = 0; y < ROWS; y++) {
        let s = pick(rng);
        while (s === 'scatter' && col.includes('scatter')) s = pick(rng);
        col.push(s);
      }
      grid.push(col);
    }
    return grid;
  }

  function evalLine(syms) {
    // run of wilds from the left, paid as wilds
    let wildRun = 0;
    while (wildRun < REELS && syms[wildRun] === 'wild') wildRun++;
    let best = wildRun >= 3 ? { sym: 'wild', count: wildRun, mult: BY_ID.wild.pay[wildRun - 3] } : null;
    // first ordinary symbol sets the line; wilds stand in for it
    const target = syms.find(s => s !== 'wild');
    if (target && target !== 'scatter') {
      let n = 0;
      while (n < REELS && (syms[n] === target || syms[n] === 'wild')) n++;
      if (n >= 3) {
        const mult = BY_ID[target].pay[n - 3];
        if (!best || mult > best.mult) best = { sym: target, count: n, mult };
      }
    }
    return best;
  }

  function evaluate(grid, lineBet) {
    const wins = [];
    let total = 0;
    LINES.forEach((line, i) => {
      const hit = evalLine(line.map((row, x) => grid[x][row]));
      if (!hit) return;
      const amount = hit.mult * lineBet;
      total += amount;
      wins.push({ line: i, sym: hit.sym, count: hit.count, amount,
        cells: line.slice(0, hit.count).map((row, x) => [x, row]) });
    });
    const scCells = [];
    grid.forEach((col, x) => col.forEach((s, y) => { if (s === 'scatter') scCells.push([x, y]); }));
    let scatter = null;
    if (scCells.length >= 3) {
      const n = Math.min(scCells.length, 5);
      const amount = BY_ID.scatter.pay[n - 3] * lineBet * LINES.length;
      total += amount;
      scatter = { count: n, amount, cells: scCells, freeSpins: FREE_SPINS[n] };
    }
    return { wins, scatter, total };
  }

  const api = { SYMS, BY_ID, LINES, REELS, ROWS, FREE_SPINS, FREE_MULT, pick, spinGrid, evaluate };
  root.MexCore = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
