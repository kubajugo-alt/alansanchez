#!/usr/bin/env python3
"""Measures the fitted Ludo runs (art/review/ludo/<run>/fit) for the engine: a walk's steps and ground per frame, and an
action's peak (the frame furthest from its first, where the pose holds while the story runs).
  python3 sequel/scripts/ludo_measure.py      -> prints JSON {run: {...}}
"""
import glob, json, os, sys
import numpy as np
from PIL import Image
SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
L = os.path.join(SEQ, 'art/review/ludo')
STEP_H = 0.34  # a step towards or away from the camera, as a share of his height (Game I's measure)


def frames(run):
    return [np.asarray(Image.open(f))[:, :, 3] > 40 for f in sorted(glob.glob(os.path.join(L, run, 'fit', 'f*.webp')))]


def feet(a):
    ys, xs = np.where(a)
    lo = ys.max() - int(0.05 * (ys.max() - ys.min()))
    fx = xs[ys >= lo]
    return fx.min(), fx.max(), fx.mean()


def peaks(v):
    n = len(v); return [i for i in range(n) if v[i] > v[(i - 1) % n] and v[i] >= v[(i + 1) % n]]


def walk(run, side):
    A = frames(run); h0 = json.load(open(os.path.join(L, run, 'fit.json')))['meta']['h']
    F = [feet(a) for a in A]
    if side:
        span = np.array([b - a for a, b, _ in F], float)
        sm = np.convolve(np.r_[span[-2:], span, span[:2]], np.ones(5) / 5, 'valid')
        big = [i for i in peaks(sm) if sm[i] > sm.min() + 0.5 * (sm.max() - sm.min())]
        steps = max(1, len(big)); travel = steps * (np.percentile(span, 95) - np.percentile(span, 5))
        return {'steps': steps, 'step': round(travel / len(A) / h0, 4), 'at': big}
    c = np.array([m for _, _, m in F]); c = c - c.mean()
    sm = np.convolve(np.r_[c[-2:], c, c[:2]], np.ones(5) / 5, 'valid')
    cross = sum(1 for i in range(len(sm)) if np.sign(sm[i]) != np.sign(sm[(i + 1) % len(sm)]))
    steps = max(2, cross)
    return {'steps': steps, 'step': round(steps * STEP_H / len(A), 4)}


def action(run):
    A = frames(run)
    d = [np.logical_xor(A[0], a).sum() / A[0].sum() for a in A]
    return {'hold': int(np.argmax(d)), 'diff': round(float(max(d)), 3)}


if __name__ == '__main__':
    R = [r['name'] for r in json.load(open(os.path.join(SEQ, 'scripts/ludo_runs.json')))['runs']]
    out = {}
    for r in R:
        if '_walk_side' in r: out[r] = walk(r, True)
        elif '_walk_' in r: out[r] = walk(r, False)
        elif not r.startswith('talk_') and '_talk_' not in r and '_turn_' not in r: out[r] = action(r)
    print(json.dumps(out, indent=1))
