# Makes approved review candidates ordinary game sprites: the painting goes to art/sprites/<id>.webp and its anchors
# into js/sprites.js, so the scenes and the face tools (scripts/face_kit.py) use it like any other frame. A promoted
# candidate drops off the review screen (scripts/review_candidates.py skips ids that are sprites).
#   python3 scripts/promote.py id ...                 (the candidate's own id)
#   python3 scripts/promote.py --as sprite_id id      (replaces an existing sprite with the candidate)
import json, os, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS = os.path.join(ROOT, 'js/sprites.js')


def main():
    args = sys.argv[1:]; target = None
    if args[:1] == ['--as']: target, args = args[1], args[2:]
    C = {c['id']: c for c in json.load(open(os.path.join(ROOT, 'art/review/candidates.json')))['candidates']}
    txt = open(JS).read(); head = txt[:txt.index('{')]; M = json.loads(txt[txt.index('{'):txt.rindex('}') + 1])
    for cid in args:
        c = C[cid]; sid = target or cid
        meta = c.get('meta') or json.load(open(os.path.join(ROOT, 'art/review/vasco', cid.replace('pair_vasco_', 'pair_') + '_meta.json')))
        shutil.copy(os.path.join(ROOT, c['src']), os.path.join(ROOT, f'art/sprites/{sid}.webp'))
        M[sid] = {k: v for k, v in meta.items() if k not in ('src',)}
        print(cid, '->', sid)
    open(JS, 'w').write(head + json.dumps(M, indent=1) + ';\n')


if __name__ == '__main__':
    main()
