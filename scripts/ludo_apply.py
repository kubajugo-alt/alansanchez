#!/usr/bin/env python3
# The user's decisions on the Ludo board (its "decisions" collection, saved to a JSON file with ArtifactData list)
# written into art/review/approvals.json for every frame of each run: approved runs go into the game, rejected ones
# stay out, redo and waiting runs are left as they are (still candidates, not in the game).
#   python3 scripts/ludo_apply.py <decisions.json>
# decisions.json: [{"id": "<run name>", "data": {"decision": ..., "note": ..., "at": ...}}, ...] (or {name: {...}}).
# Only the user's own clicks on the board decide; nothing here approves art on anyone's behalf.
import json, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
raw = json.load(open(sys.argv[1]))
if isinstance(raw, dict) and 'documents' in raw: raw = raw['documents']
dec = {d['id']: d.get('data', d) for d in raw} if isinstance(raw, list) else raw
C = json.load(open(os.path.join(ROOT, 'art/review/candidates.json')))['candidates']
ap_p = os.path.join(ROOT, 'art/review/approvals.json'); A = json.load(open(ap_p))
n = {'approved': 0, 'rejected': 0}
for run, d in dec.items():
    v = d.get('decision')
    if v not in n: continue
    for c in C:
        if c['id'].startswith((f'alan_lu_{run}_', f'pair_lu_{run}_')):
            A[c['id']] = {'decision': v, 'at': d.get('at'), 'note': ('Ludo board' + (': ' + d['note'] if d.get('note') else ''))}
            n[v] += 1
    if run == 'climb_out' and v in n:  # the climb's own paintings (scripts/climb_fit.py) go with its first run
        for c in C:
            if c['id'].startswith('alan_climb_k'): A[c['id']] = {'decision': v, 'at': d.get('at'), 'note': 'Ludo board: with climb_out'}
json.dump(A, open(ap_p, 'w'), indent=1)
print(n, 'frames written to art/review/approvals.json')
# a frame's face kit (scripts/face_transfer.py --ludo: alan_side's mouths and eyelids) goes in with the frame
fp = os.path.join(ROOT, 'js/faces.js'); t = open(fp).read(); head, body = t.split('window.FACES = ', 1)
FA = json.loads(body.rstrip().rstrip(';')); k = 0
for fid, D in FA.items():
    if '_lu_' in fid and (A.get(fid) or {}).get('decision') in ('approved', 'rejected'):
        ok = A[fid]['decision'] == 'approved'
        if D.get('ok') != ok: D['ok'] = ok; k += 1
open(fp, 'w').write(head + 'window.FACES = ' + json.dumps(FA, indent=1) + ';\n')
print(k, 'face kits switched with their frames')
