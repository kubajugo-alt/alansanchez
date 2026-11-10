// Return-to-player check: node mex/sim.mjs [spins]
import { createRequire } from 'node:module';
const C = createRequire(import.meta.url)('./slots-core.js');
const N = +process.argv[2] || 2_000_000;
const bet = C.LINES.length; // line bet 1
let paid = 0, hits = 0, bonus = 0, free = 0, max = 0;
for (let i = 0; i < N; i++) {
  let r = C.evaluate(C.spinGrid(), 1), win = r.total;
  let queue = r.scatter ? r.scatter.freeSpins : 0;
  if (queue) bonus++;
  while (queue-- > 0) {
    free++;
    r = C.evaluate(C.spinGrid(), 1);
    win += r.total * C.FREE_MULT;
    if (r.scatter) queue += r.scatter.freeSpins;
  }
  if (win) hits++;
  if (win > max) max = win;
  paid += win;
}
console.log(`spins ${N}  RTP ${(100 * paid / (N * bet)).toFixed(2)}%  hit rate ${(100 * hits / N).toFixed(1)}%  ` +
  `bonus 1 in ${(N / bonus).toFixed(0)}  biggest win ${(max / bet).toFixed(0)}x bet`);
