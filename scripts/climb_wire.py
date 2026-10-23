#!/usr/bin/env python3
# The climb out of the Sé pit, wired once its Ludo runs are fitted (scripts/ludo_review.py): the whole sequence
# alan_climb_k1, the run to k2, k2, the run to k3, k3, the run up, alan_front, as one list (wire.seq.climbOut on every
# frame of it: js/story/main.js puts it in once all are approved; js/story/se.js S.climbOut plays it), and each Ludo
# frame's meta.rim (where the near rim cuts him: his hands) blended between the paintings either side by how far the
# run has got (its fit.json t). The runs' own in-between wiring is dropped: the climb plays them itself.
#   python3 scripts/climb_wire.py
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
C = json.load(open(os.path.join(ROOT, 'art/review/candidates.json')))
by = {c['id']: c for c in C['candidates']}
rim = lambda k: (by[k]['meta'].get('rim', 0) if k in by else 0)


def run(name):
    f = json.load(open(os.path.join(ROOT, f'art/review/ludo/{name}/fit.json')))
    return [[(x['id'], x['t']) for x in s['frames']] for s in f['segments']]


out = run('climb_out'); up = run('climb_up')
keys = ['alan_climb_k1', 'alan_climb_k2', 'alan_climb_k3', 'alan_front']
seq = [keys[0]]
for j, seg in enumerate(out + up):
    a, b = keys[j], keys[j + 1]
    for cid, t in seg:
        by[cid]['meta']['rim'] = round(rim(a) * (1 - t) + rim(b) * t, 3) if rim(a) > 0 else 0.0
        seq.append(cid)
    seq.append(b)
wire = {'seq': {'climbOut': seq}}
for k in seq:
    if k in by: by[k]['wire'] = wire
json.dump(C, open(os.path.join(ROOT, 'art/review/candidates.json'), 'w'), indent=1)
print(len(seq), 'frames:', ' '.join(k.replace('alan_lu_', '').replace('alan_climb_', '') for k in seq))
