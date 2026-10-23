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
        if c['id'].startswith(f'alan_lu_{run}_'):
            A[c['id']] = {'decision': v, 'at': d.get('at'), 'note': ('Ludo board' + (': ' + d['note'] if d.get('note') else ''))}
            n[v] += 1
json.dump(A, open(ap_p, 'w'), indent=1)
print(n, 'frames written to art/review/approvals.json')
