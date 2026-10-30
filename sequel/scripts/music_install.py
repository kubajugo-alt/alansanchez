#!/usr/bin/env python3
"""The user's picked music takes (scripts/gen_music.py) made into the game's tracks, as Game I's (docs/MUSIC.md).

  python3 sequel/scripts/music_install.py [ids...]      (no ids: every pick below)

Each pick, audio/music_src/<id>_<take>.mp3, gets one linear gain to -23 LUFS integrated (no compression or limiting),
then is encoded twice from the same 48 kHz master: audio/music/<id>.opus.m4a (Opus 112 kb/s) and <id>.aac.m4a
(AAC-LC 144 kb/s). tracks.json gets the track's dur, inp (first audible moment), out (the loop point: where the
music's own tail drops away, plus up to 2 s of it) and v (a hash of the file, for the cache).
"""
import hashlib, json, os, subprocess, sys, tempfile
import numpy as np

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC, OUT = os.path.join(SEQ, 'audio/music_src'), os.path.join(SEQ, 'audio/music')
TARGET = -23.0
# the user's picks from the review page (2026-10-28)
PICKS = {'title': 2, 'elena_car': 1, 'gando': 1, 'hotel_lobby': 1, 'hotel_room': 1, 'hotel_restaurant': 2,
         'canteras': 2, 'beach': 2, 'museum_hall': 1, 'museum_courtyard': 2, 'archive': 1, 'baute_office': 2,
         'santa_ana': 1, 'santa_ana_inside': 2, 'belfry': 2, 'colon': 1, 'isleta': 2, 'rafa_bar': 1,
         'rafa_studio': 1, 'carmen_flat': 2, 'landrover': 2, 'camp': 2, 'cave6': 2, 'vault': 1, 'map': 1}


def ff(*a):
    return subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-y', *a], capture_output=True, text=True, check=True)


def lufs(path):
    err = ff('-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-').stderr
    summ = err[err.rindex('Summary:'):]
    return float(summ.split('I:')[1].split('LUFS')[0])


def edges(wav):
    """inp: the first 20 ms window above -50 dBFS. out: the last window within 30 dB of the music's median level,
    plus up to 2 s of the tail after it."""
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', wav, '-ac', '1', '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.float32); sr = 48000; n = sr // 50
    w = x[:len(x) // n * n].reshape(-1, n)
    db = 20 * np.log10(np.sqrt((w ** 2).mean(1)) + 1e-9)
    dur = len(x) / sr
    inp = float(np.argmax(db > -50)) / 50
    loud = np.where(db > np.median(db) - 30)[0]
    out = min(dur, (loud[-1] + 1) / 50 + 2.0)
    return round(dur, 3), round(inp, 2), round(out, 2)


def install(mid):
    src = os.path.join(SRC, f'{mid}_{PICKS[mid]}.mp3')
    with tempfile.TemporaryDirectory() as t:
        wav = os.path.join(t, 'm.wav')
        ff('-i', src, '-ar', '48000', '-c:a', 'pcm_f32le', wav)
        gain = TARGET - lufs(wav)
        master = os.path.join(t, 'g.wav')
        ff('-i', wav, '-af', f'volume={gain:.2f}dB', '-c:a', 'pcm_f32le', master)
        dur, inp, out = edges(master)
        ff('-i', master, '-c:a', 'libopus', '-b:a', '112k', '-vbr', 'on', '-movflags', '+faststart', '-f', 'mp4', os.path.join(OUT, f'{mid}.opus.m4a'))
        ff('-i', master, '-c:a', 'aac', '-b:a', '144k', '-movflags', '+faststart', '-f', 'mp4', os.path.join(OUT, f'{mid}.aac.m4a'))
    v = hashlib.md5(open(os.path.join(OUT, f'{mid}.opus.m4a'), 'rb').read()).hexdigest()[:8]
    check = lufs(os.path.join(OUT, f'{mid}.aac.m4a'))
    return {'dur': dur, 'inp': inp, 'out': out, 'v': v}, gain, check


if __name__ == '__main__':
    ids = sys.argv[1:] or list(PICKS)
    tj = os.path.join(OUT, 'tracks.json')
    meta = json.load(open(tj)) if os.path.exists(tj) else {}
    for mid in ids:
        m, g, c = install(mid)
        meta[mid] = m
        print(f'{mid}: take {PICKS[mid]}, gain {g:+.1f} dB, aac {c:.1f} LUFS, {m}', flush=True)
    json.dump(dict(sorted(meta.items())), open(tj, 'w'), indent=1)
