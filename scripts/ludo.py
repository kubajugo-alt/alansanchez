#!/usr/bin/env python3
# Ludo.ai sprite animation for Alan: the pose changes, walks and turns he makes in the game, drawn between his own
# paintings. The user's rules (2026-10-23): hydra only; every sheet gets the "improve" pass (finer detail); every
# sheet is exported with the free 1.5x AI upscale (frame_size -1); Alan's consistency is checked on every result.
#
#   python3 scripts/ludo.py gen <name> --a alan_side --b alan_reach [--mid X] [--prompt "..."] [--loop] [--duration 3]
#       hydra keyframes (a -> [mid ->] b) -> improve -> adjust x1.5 and true size -> art/review/ludo/<name>/
#   python3 scripts/ludo.py fetch <name>       re-download a finished job's results (from its job.json)
#   python3 scripts/ludo.py account            credits left
#
# Each step's job id and result is kept in art/review/ludo/<name>/job.json, so a run that stops resumes where it
# left off and never pays twice (request_id makes a repeated request return the same job). Every paid call is
# logged in art/review/ludo/log.md with its credits. The API key comes from .env (LUDO_API_KEY) and is never
# printed or written anywhere else.
import argparse, base64, io, json, os, sys, time, urllib.request, urllib.error
from datetime import datetime
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'art/review/ludo')
API = 'https://api.ludo.ai/api'
UPSCALE = -1      # Ludo's frame_size -1: AI 1.5x upscaling (free on re-export)
TRUE_SIZE = -9    # the first sheet's export (only the upscaled re-export is used)


def key():
    if os.environ.get('LUDO_API_KEY'): return os.environ['LUDO_API_KEY']
    for line in open(os.path.join(ROOT, '.env')):
        k, _, v = line.strip().partition('=')
        if k == 'LUDO_API_KEY': return v.strip().strip('"\'')
    sys.exit('LUDO_API_KEY missing from .env')


def call(method, path, body=None, timeout=90):
    req = urllib.request.Request(API + path, method=method, data=json.dumps(body).encode() if body is not None else None,
                                 headers={'Authorization': 'ApiKey ' + key(), 'Content-Type': 'application/json'})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r: return json.loads(r.read() or b'{}')
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors='replace')[:800]
            if e.code in (429, 502, 503, 504) and attempt < 4: time.sleep(5 * 2 ** attempt); continue
            sys.exit(f'{method} {path}: HTTP {e.code} {msg}')
        except (urllib.error.URLError, TimeoutError) as e:
            if attempt < 4: time.sleep(5 * 2 ** attempt); continue
            sys.exit(f'{method} {path}: {e}')


def wait(job):
    jid = job.get('id') or job.get('job_id')
    while True:
        j = call('GET', f'/assets/jobs/{jid}?wait=60', timeout=120)
        st = j.get('status')
        if st == 'succeeded': return j
        if st in ('failed', 'canceled'): sys.exit(f'job {jid} {st}: {j.get("error")}')
        time.sleep(max(1, (j.get('poll_after_ms') or 2000) / 1000))


_META = None


def frame_meta():
    """Every frame's sprite data: js/sprites.js and the review candidates (their src too)."""
    global _META
    if _META is None:
        t = open(os.path.join(ROOT, 'js/sprites.js')).read(); _META = json.loads(t[t.index('{'):t.rindex('}') + 1])
        for c in json.load(open(os.path.join(ROOT, 'art/review/candidates.json')))['candidates']:
            if c.get('meta') and c['id'] not in _META: _META[c['id']] = dict(c['meta'], src=c['src'])
    return _META


def sprite_b64(name):
    """A game frame as a PNG data URL, alpha kept, always facing right (a painting facing left is mirrored, as the
    engine does on screen; '~' mirrors it once more)."""
    mir = name.endswith('~'); name = name.rstrip('~')
    if name.startswith('file:'):  # a composed keyframe (scripts/ludo_pair_key.py)
        k = os.path.join(ROOT, 'art/review/ludo/keys', name[5:])
        m = json.load(open(k + '.json')); p = k + '.png'
    else:
        m = frame_meta().get(name, {})
        p = os.path.join(ROOT, 'art/sprites', name + '.webp')
        if not os.path.exists(p): p = os.path.join(ROOT, m['src'])
    im = Image.open(p).convert('RGBA')
    if mir != bool(m.get('facesLeft')): im = im.transpose(Image.FLIP_LEFT_RIGHT)
    buf = io.BytesIO(); im.save(buf, 'PNG')
    return 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode()


def log(step, refs, prompt, out, credits):
    path = os.path.join(OUT, 'log.md')
    if not os.path.exists(path):
        with open(path, 'w') as f:
            f.write('# Ludo.ai generation log\n\n| date | step | model | keyframes | prompt | output | credits |\n|---|---|---|---|---|---|---|\n')
    with open(path, 'a') as f:
        f.write(f'| {datetime.now():%Y-%m-%d %H:%M} | {step} | {"forge" if step == "forge" else "hydra"} | {refs} | {prompt or ""} | {out} | {credits} |\n')


def account():
    return call('GET', '/assets/account')['credits']['available']


def step(state, name, label, method, path, body, paid, refs='', prompt=''):
    """One API job, remembered in state (job.json): skipped when already done."""
    if label in state and state[label].get('status') == 'succeeded': return state[label]['result']
    body = dict(body, request_id=f'alan-{name}-{label}-v{state.get("take", 1)}')
    job = call('POST', path, body)
    done = wait(job)
    state[label] = {'status': 'succeeded', 'job': done.get('id'), 'result': done['result'], 'credits': done.get('credits_charged', 0)}
    json.dump(state, open(os.path.join(OUT, name, 'job.json'), 'w'), indent=1)
    if paid: log(label, refs, prompt, f'art/review/ludo/{name}/', state[label]['credits'])
    print(f'  {name} {label}: done ({state[label]["credits"]} credits)', flush=True)
    return done['result']


def download(url, path):
    with urllib.request.urlopen(url, timeout=120) as r, open(path, 'wb') as f: f.write(r.read())


def fetch(name, state):
    d = os.path.join(OUT, name)
    for label in ('up', 'true'):
        r = state.get(label, {}).get('result')
        if not r: continue
        sub = os.path.join(d, label); os.makedirs(sub, exist_ok=True)
        download(r['spritesheet_url'], os.path.join(sub, 'sheet.png'))
        for i, u in enumerate(r.get('individual_frame_urls') or []):
            download(u, os.path.join(sub, f'f{i:02d}.png'))
        if r.get('video_url'): download(r['video_url'], os.path.join(sub, 'anim.mp4'))
    print(f'  downloaded to art/review/ludo/{name}/')


def gen(a):
    d = os.path.join(OUT, a.name); os.makedirs(d, exist_ok=True)
    jp = os.path.join(d, 'job.json')
    state = json.load(open(jp)) if os.path.exists(jp) else {}
    if getattr(a, 'take', 1) > state.get('take', 1):  # a new take: the earlier one kept under its number, then started afresh
        json.dump(state, open(os.path.join(d, f'job_take{state.get("take", 1)}.json'), 'w'), indent=1)
        state = {'take': a.take}
    state['spec'] = {'a': a.a, 'b': a.b, 'mid': a.mid, 'prompt': a.prompt, 'loop': a.loop, 'duration': a.duration, 'frames': a.frames}
    json.dump(state, open(jp, 'w'), indent=1)
    refs = ' -> '.join(x for x in (a.a, a.mid, a.b) if x)
    model = getattr(a, 'model', None) or 'hydra'
    body = {'model': model, 'initial_image': sprite_b64(a.a), 'loop': a.loop, 'crop': False, 'frames': a.frames,
            'duration': a.duration, 'frame_size': TRUE_SIZE, 'image_type': 'sprite'}
    if a.b: body['final_image'] = sprite_b64(a.b)
    if a.mid: body['middle_image'] = sprite_b64(a.mid)
    if a.prompt: body['motion_prompt'] = a.prompt
    path = '/assets/sprite/animate-keyframes' if a.mid or not a.prompt else '/assets/sprite/animate'
    raw = step(state, a.name, model, 'POST', path, body, True, refs, a.prompt)
    # the improve pass exists for hydra sheets only; a forge run (the fallback when hydra's moderation refuses) goes without
    imp = step(state, a.name, 'improve', 'POST', '/assets/sprite/edit',
               {'spritesheet_url': raw['spritesheet_url'], 'edit_mode': 'improve', 'loop': a.loop}, True, refs, 'improve') if model == 'hydra' else raw
    state['model'] = model; json.dump(state, open(jp, 'w'), indent=1)
    common = {'spritesheet_url': imp['spritesheet_url'], 'individual_frames': True, 'loop': a.loop, 'crop': False}
    step(state, a.name, 'up', 'POST', '/assets/sprite/adjust', dict(common, frame_size=UPSCALE), False)
    fetch(a.name, state)
    print(f'  {a.name}: credits left {account()}', flush=True)


def batch(a):
    """Every run in a spec file (scripts/ludo_alan.json), a few at a time; runs already done are skipped."""
    import threading, queue, types
    spec = json.load(open(a.spec))['runs']
    q = queue.Queue()
    for r in spec:
        if a.only and r['name'] not in a.only: continue
        jp = os.path.join(OUT, r['name'], 'job.json')
        st = json.load(open(jp)) if os.path.exists(jp) else {}
        if 'up' in st and st.get('take', 1) >= r.get('take', 1): continue
        q.put(r)
    print(f'{q.qsize()} runs to do', flush=True)
    def work():
        while True:
            try: r = q.get_nowait()
            except queue.Empty: return
            if a.budget and account() < a.budget: print(f'  {r["name"]}: skipped, under budget', flush=True); continue
            ns = types.SimpleNamespace(name=r['name'], a=r['a'], b=r.get('b'), mid=r.get('mid'), prompt=r.get('prompt'), loop=r.get('loop', False),
                                       duration=r.get('duration', 3), frames=r.get('frames', 36), take=r.get('take', 1))
            try: gen(ns)
            except SystemExit as e:
                if 'moderation' not in str(e): print(f'  {r["name"]}: FAILED {e}', flush=True); continue
                # hydra's moderation refused it (refunded): the user's rule is to try forge then (no improve pass there)
                print(f'  {r["name"]}: hydra refused, trying forge', flush=True)
                ns.model = 'forge'
                try: gen(ns)
                except SystemExit as e2: print(f'  {r["name"]}: FAILED on forge too {e2}', flush=True)
            except Exception as e: print(f'  {r["name"]}: FAILED {type(e).__name__} {e}', flush=True)
    ts = [threading.Thread(target=work) for _ in range(a.workers)]
    for t in ts: t.start()
    for t in ts: t.join()


def main():
    p = argparse.ArgumentParser(); sub = p.add_subparsers(dest='cmd', required=True)
    g = sub.add_parser('gen'); g.add_argument('name'); g.add_argument('--a', required=True); g.add_argument('--b')
    g.add_argument('--mid'); g.add_argument('--prompt'); g.add_argument('--loop', action='store_true')
    g.add_argument('--duration', type=float, default=3); g.add_argument('--frames', type=int, default=36)
    b = sub.add_parser('batch'); b.add_argument('spec'); b.add_argument('--only', nargs='*'); b.add_argument('--workers', type=int, default=3)
    b.add_argument('--budget', type=float, default=0, help='stop starting new runs below this many credits')
    f = sub.add_parser('fetch'); f.add_argument('name')
    sub.add_parser('account')
    a = p.parse_args()
    if a.cmd == 'account': print(account())
    elif a.cmd == 'fetch': fetch(a.name, json.load(open(os.path.join(OUT, a.name, 'job.json'))))
    elif a.cmd == 'batch': batch(a)
    else: gen(a)


if __name__ == '__main__':
    main()
