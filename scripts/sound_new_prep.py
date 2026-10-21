# The sound pass (?sound=new, docs/SOUND.md): ElevenLabs generations (4 variations each) cut and levelled into
# audio/sfx. Footsteps: each take cut to its first step (from just before the heel lands to before the next sound),
# faded, mono, peak-matched; a take that isn't one clean step (no clear hit, or too long) is left out. Details:
# trimmed of silence in front, faded, levelled to one loudness. Loops: the steadiest take kept whole, levelled.
#   python3 scripts/sound_new_prep.py <dir of generations: <name>_<1..4>.mp3>
import os, subprocess, sys, json
import numpy as np

SR = 44100
OUT = 'audio/sfx'
STEPS = ['step_wood', 'step_stone', 'step_cobble', 'step_tile', 'step_wet', 'step_deck']
DETAILS = {  # name: (target loudness dBFS RMS of the sounding part, max seconds)
    'dog_distant': (-26, 3.0), 'paper_shuffle': (-24, 2.5), 'drip_echo': (-26, 3.0), 'stone_settle': (-26, 2.5),
    'canary': (-24, 6.0), 'voices_window': (-26, 8.0), 'wind_arches': (-24, 7.0), 'dial_click': (-20, 0.4)}
LOOPS = {'amb_bedroom': -34, 'bell_hum_soft': -30, 'water_lap': -28}
TAKE_BASE = {'dial_click': 4}  # dial_click has takes 1-3 already: the new ones are _4.._7


def load(f):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()


def save(a, name):
    p = f'{OUT}/{name}.mp3'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-codec:a', 'libmp3lame', '-q:a', '3', p],
                   input=a.astype(np.float32).tobytes(), check=True)
    return p


def env(a, win=0.005):
    n = max(1, int(SR * win)); e = np.sqrt(np.convolve(a * a, np.ones(n) / n, 'same')); return e


def fade(a, fin=0.003, fout=0.04):
    a = a.copy(); i, o = int(SR * fin), int(SR * fout)
    if len(a) > i: a[:i] *= np.linspace(0, 1, i)
    if len(a) > o: a[-o:] *= np.linspace(1, 0, o)
    return a


def rms_db(a):
    e = env(a, 0.05); loud = e[e > e.max() * 0.1]
    return 20 * np.log10(np.sqrt(np.mean(loud ** 2)) + 1e-9)


def first_step(a):
    """the first hit: from 4 ms before it to where it has died away (or just before the next hit), at most 0.5 s"""
    e = env(a, 0.003); pk = e.max()
    if pk < 1e-3: return None
    on = int(np.argmax(e > pk * 0.2))
    start = max(0, on - int(SR * 0.004))
    # the next step: a rise back over half the peak at least 150 ms on (heel and toe of one step land closer than that)
    after = e[on:]; g = int(SR * 0.15)
    nxt = int(np.argmax(after[g:] > pk * 0.5)) if len(after) > g and np.any(after[g:] > pk * 0.5) else None
    end = on + (g + nxt - int(SR * 0.01) if nxt is not None else len(after))
    tail = np.argmax(e[on:end] < pk * 0.02) if np.any(e[on:end] < pk * 0.02) else end - on
    end = min(end, on + max(tail, int(SR * 0.12)) + int(SR * 0.05), on + int(SR * 0.5))
    return a[start:end]


def main(src):
    made = {}
    for k in STEPS:
        n = 0
        for i in range(1, 5):
            f = f'{src}/{k}_{i}.mp3'
            if not os.path.exists(f): continue
            s = first_step(load(f))
            if s is None or len(s) < SR * 0.05: print('skip', f); continue
            s = fade(s, 0.002, 0.05); s *= 10 ** (-6 / 20) / (np.abs(s).max() + 1e-9)   # peaks at -6 dBFS: steps alike
            n += 1; made[save(s, k if n == 1 else f'{k}_{n}')] = round(len(s) / SR, 3)
    for k, (target, mx) in DETAILS.items():
        n = TAKE_BASE.get(k, 1) - 1
        for i in range(1, 5):
            f = f'{src}/{k}_{i}.mp3'
            if not os.path.exists(f): continue
            a = load(f); e = env(a, 0.005)
            if e.max() < 1e-3: print('silent', f); continue
            on = max(0, int(np.argmax(e > e.max() * 0.05)) - int(SR * 0.005)); a = a[on:on + int(SR * mx)]
            last = len(a) - int(np.argmax(env(a, 0.02)[::-1] > env(a, 0.02).max() * 0.01)); a = a[:min(len(a), last + int(SR * 0.1))]
            a = fade(a, 0.003, min(0.3, len(a) / SR * 0.2)); a *= 10 ** ((target - rms_db(a)) / 20)
            if np.abs(a).max() > 0.95: a *= 0.95 / np.abs(a).max()
            n += 1; made[save(a, k if n == 1 else f'{k}_{n}')] = round(len(a) / SR, 3)
    for k, target in LOOPS.items():
        best = None
        for i in range(1, 5):
            f = f'{src}/{k}_{i}.mp3'
            if not os.path.exists(f): continue
            a = load(f); e = env(a, 0.5)[int(SR * 0.5):-int(SR * 0.5)]
            var = np.std(20 * np.log10(e + 1e-6))  # the steadiest bed: least swing in level
            if best is None or var < best[0]: best = (var, a, f)
        a = best[1] * 10 ** ((target - rms_db(best[1])) / 20)
        made[save(a, k)] = round(len(a) / SR, 2); print(k, 'from', os.path.basename(best[2]), 'swing', round(best[0], 1), 'dB')
    print(json.dumps(made, indent=0))


if __name__ == '__main__':
    main(sys.argv[1])
