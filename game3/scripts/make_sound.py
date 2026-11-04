#!/usr/bin/env python3
"""Game III's music and Caribbean ambience, synthesised here: no samples, no services (the user, 2026-11-04: "can you
add environment sounds and music, without calling paid services?").

  python3 game3/scripts/make_sound.py [--only name,name] [--draft]

Writes audio/music/<id>.opus.m4a + .aac.m4a and tracks.json (the engine's music player), and audio/sfx/sd_*.mp3 with
their manifest entries (the ambience beds and details). Everything is built from simple physical models: plucked strings
as decaying harmonics, drums as pitched sines with a falling pitch and a click, the güira as scraped noise, reeds and
pipes as weighted harmonics, voices as harmonics through vowel formants, bells from inharmonic partials; one generated
room impulse for the reverb. The series' motif, three beats and a rest with the skip on the third, runs through the score.
"""
import json, os, subprocess, sys, hashlib
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt

SR = 44100
G3 = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MUS, SFX = os.path.join(G3, 'audio/music'), os.path.join(G3, 'audio/sfx')
TMP = os.path.join(G3, 'audio/.build'); os.makedirs(TMP, exist_ok=True)
args = sys.argv[1:]
ONLY = set(args[args.index('--only') + 1].split(',')) if '--only' in args else None
DRAFT = '--draft' in args
rng = np.random.default_rng(1996)

def hz(n): return 440.0 * 2 ** ((n - 69) / 12)          # midi note -> Hz
NOTE = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
def m(s):                                               # 'A3', 'C#4', 'Bb2' -> midi
    n = NOTE[s[0]]; i = 1
    while s[i] in '#b': n += 1 if s[i] == '#' else -1; i += 1
    return n + 12 * (int(s[i:]) + 1)

# ---------------------------------------------------------------- filters, envelopes
def lp(x, f, o=2): return sosfilt(butter(o, min(f, SR * 0.45) / (SR / 2), 'low', output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f / (SR / 2), 'high', output='sos'), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo / (SR / 2), min(hi, SR * 0.45) / (SR / 2)], 'band', output='sos'), x)
def t_(d): return np.arange(int(d * SR)) / SR
def adsr(n, a, d, s, r):
    a, d, r = int(a * SR), int(d * SR), int(r * SR); e = np.ones(n) * s
    if a: e[:min(a, n)] = np.linspace(0, 1, a)[:n]
    if d and a < n: k = min(d, n - a); e[a:a + k] = np.linspace(1, s, d)[:k]
    if r: k = min(r, n); e[n - k:] *= np.linspace(1, 0, k)
    return e
def noise(n): return rng.standard_normal(n)

# ---------------------------------------------------------------- instruments (return mono arrays)
def harmonics(f, d, amps, decays, inharm=0.0, vib=0.0, vibf=5.0):
    t = t_(d); out = np.zeros_like(t)
    ph = 2 * np.pi * f * (t + (vib / (2 * np.pi * vibf)) * np.sin(2 * np.pi * vibf * t) if vib else t)
    for k, (a, dc) in enumerate(zip(amps, decays), 1):
        if a <= 0 or f * k > SR * 0.45: continue
        out += a * np.sin(ph * k * (1 + inharm * k * k)) * np.exp(-dc * t)
    return out
def guitar(f, d=2.5, bright=1.0, nylon=True):
    n = 16; pick = 0.18
    amps = [abs(np.sin(np.pi * k * pick)) / k ** (1.15 if nylon else 0.9) * (bright ** (k / 6)) for k in range(1, n + 1)]
    decays = [1.6 + 0.9 * k for k in range(1, n + 1)]
    x = harmonics(f, d, amps, decays, inharm=0.00008)
    att = np.exp(-t_(d) * 300) * noise(len(x)) * 0.02
    return (x + hp(att, 1500)) * adsr(len(x), 0.002, 0, 1, 0.08)
def requinto(f, d=1.6):   # the bachata lead: bright, steel, quick
    return guitar(f, d, bright=1.6, nylon=False) * 0.9
def guitarra(f, d=2.2):   # Lisbon: the Portuguese guitar, pairs of strings a hair apart
    return guitar(f, d, 1.8, False) * 0.6 + guitar(f * 1.0035, d, 1.8, False) * 0.5
def bass(f, d=0.8):
    x = harmonics(f, d, [1, 0.45, 0.2, 0.08], [2.2, 3.5, 5, 7]); return lp(x, 900) * adsr(len(x), 0.004, 0, 1, 0.06)
def marimba(f, d=1.2):
    x = harmonics(f, d, [1, 0, 0, 0.35, 0, 0, 0, 0, 0, 0.12], [4.5, 1, 1, 9, 1, 1, 1, 1, 1, 16]); return x * adsr(len(x), 0.001, 0, 1, 0.05)
def organ(f, d):
    x = harmonics(f, d, [1, 0.6, 0.35, 0.25, 0.1, 0.12, 0, 0.08], [0.05] * 8); return x * adsr(len(x), 0.08, 0, 1, 0.4)
def pad(f, d, warm=1800):
    x = sum(harmonics(f * dt, d, [1 / k for k in range(1, 14)], [0.0] * 13) for dt in (0.996, 1.0, 1.005))
    return lp(x / 3, warm) * adsr(len(x), min(1.2, d / 3), 0, 1, min(1.5, d / 3))
def voice(f, d, vowel='a', vib=0.012):
    F = {'a': [(700, 110), (1220, 120), (2600, 160)], 'o': [(450, 90), (800, 100), (2830, 150)], 'u': [(325, 80), (700, 90), (2530, 150)]}[vowel]
    amps = []
    for k in range(1, 40):
        fk = f * k; a = sum(np.exp(-((fk - c) / w) ** 2 / 2) * g for (c, w), g in zip(F, (1, 0.5, 0.25))) + 0.02
        amps.append(a / k ** 0.3)
    x = harmonics(f, d, amps, [0.0] * 39, vib=vib, vibf=5.3)
    return x * adsr(len(x), 0.25, 0, 1, 0.5)
def accordion(f, d):
    a = [1 / k ** 0.7 if k % 2 else 0.6 / k for k in range(1, 18)]
    x = harmonics(f, d, a, [0.0] * 17) + harmonics(f * 1.004, d, a, [0.0] * 17)
    x = bp(x, 200, 4500) * (1 + 0.12 * np.sin(2 * np.pi * 5.5 * t_(d)))
    return x * adsr(len(x), 0.03, 0, 1, 0.08) * 0.5
def flute(f, d):
    x = harmonics(f, d, [1, 0.25, 0.08], [0] * 3, vib=0.01, vibf=4.8) + bp(noise(int(d * SR)), f, f * 3) * 0.05
    return x * adsr(len(x), 0.08, 0, 1, 0.15)
def bell(f, d=6.0):
    P = [0.56, 0.92, 1.19, 1.71, 2.0, 2.74, 3.0, 3.76, 4.07]; A = [0.6, 0.5, 1, 0.7, 0.6, 0.35, 0.3, 0.2, 0.15]
    t = t_(d); x = sum(a * np.sin(2 * np.pi * f * p * t) * np.exp(-t * (0.5 + p * 0.7)) for p, a in zip(P, A))
    return x * adsr(len(x), 0.002, 0, 1, 0.5) * 0.4
def drum(f0, f1, d, click=0.4, dec=9.0, nz=0.1):
    t = t_(d); fr = f1 + (f0 - f1) * np.exp(-t * 30); ph = 2 * np.pi * np.cumsum(fr) / SR
    x = np.sin(ph) * np.exp(-t * dec) + click * np.exp(-t * 400) * noise(len(t)) * 0.5 + nz * lp(noise(len(t)), 2000) * np.exp(-t * 25)
    return x
def tambora(low=True): return drum(160 if low else 260, 95 if low else 180, 0.5, 0.3, 11)
def palo(): return drum(120, 62, 1.2, 0.25, 4.5, 0.12)          # the long drum of the salves
def conga(hi=False): return drum(330 if hi else 240, 220 if hi else 170, 0.35, 0.5, 14)
def bongo(hi=False): return drum(520 if hi else 400, 420 if hi else 330, 0.18, 0.6, 24)
def guira(d=0.12, acc=1.0):
    n = int(d * SR); x = hp(noise(n), 3500) * np.concatenate([np.linspace(0.3, 1, n // 2), np.linspace(1, 0, n - n // 2)])
    return x * 0.35 * acc
def shaker(d=0.09): n = int(d * SR); return hp(noise(n), 5000) * np.hanning(n) * 0.25
def clave(): t = t_(0.12); return np.sin(2 * np.pi * 2500 * t) * np.exp(-t * 60) * 0.5
def thump(): return drum(70, 42, 0.4, 0.05, 9, 0.0)            # a heartbeat

# ---------------------------------------------------------------- a track: a stereo buffer you place sounds into
class Track:
    def __init__(self, bars, bpm, beats=4):
        self.bpm, self.beats = bpm, beats
        self.spb = 60.0 / bpm; self.len = bars * beats * self.spb
        n = int((self.len + 8) * SR); self.L = np.zeros(n); self.R = np.zeros(n); self.send = np.zeros(n)
    def at(self, bar, beat=0.0): return (bar * self.beats + beat) * self.spb
    def put(self, x, t, vol=1.0, pan=0.0, rev=0.25):
        i = int(t * SR); x = x * vol; j = min(len(self.L), i + len(x)); x = x[:j - i]
        if i < 0 or not len(x): return
        self.L[i:j] += x * np.cos((pan + 1) * np.pi / 4); self.R[i:j] += x * np.sin((pan + 1) * np.pi / 4); self.send[i:j] += x * rev
    def render(self, verb=2.2, master=0.85, swing=0):
        ir = room_ir(verb)
        wl, wr = fftconvolve(self.send, ir[0])[:len(self.L)], fftconvolve(self.send, ir[1])[:len(self.L)]
        L, R = self.L + wl, self.R + wr
        n = int(self.len * SR); tail = L[n:n + 6 * SR], R[n:n + 6 * SR]
        L, R = L[:n].copy(), R[:n].copy(); L[:len(tail[0])] += tail[0]; R[:len(tail[1])] += tail[1]   # the tail wraps to the top: the loop has no seam
        st = np.stack([L, R]); st = st / (np.sqrt(np.mean(st ** 2)) + 1e-9) * 0.1 * master        # about -20 dB RMS
        return np.tanh(st * 1.4) / 1.4
_irs = {}
def room_ir(decay):
    if decay in _irs: return _irs[decay]
    n = int(decay * SR); t = np.arange(n) / SR
    ir = [lp(noise(n), 5000) * np.exp(-t * 6.9 / decay) * 0.18 for _ in range(2)]
    _irs[decay] = ir; return ir

# ---------------------------------------------------------------- harmony helpers
def chord(root, kind='m'):
    iv = {'m': [0, 3, 7], 'M': [0, 4, 7], '7': [0, 4, 7, 10], 'm7': [0, 3, 7, 10], 'M7': [0, 4, 7, 11], 'dim': [0, 3, 6]}[kind]
    return [root + i for i in iv]
MOTIF = [0.0, 0.5, 1.15]            # three beats and a rest, the skip on the third (in beats of a 2-beat cell)

# ================================================================ the score
def t_title():
    T = Track(24, 76); prog = [(m('A2'), 'm'), (m('F2'), 'M'), (m('C3'), 'M'), (m('E2'), '7')]
    for b in range(24):
        r, k = prog[(b // 2) % 4]; ch = chord(r + 12, k)
        for i, nn in enumerate([ch[0], ch[1], ch[2], ch[1] + 12, ch[2], ch[1], ch[0] + 12, ch[2]]):
            T.put(guitar(hz(nn), 2.4), T.at(b, i * 0.5), 0.32, -0.25 + 0.06 * i, 0.3)
        if b % 2 == 0: T.put(bass(hz(r), 3.0), T.at(b), 0.5, 0, 0.1)
        if b >= 4:
            for c in range(2): [T.put(palo(), T.at(b, c * 2 + x), 0.55 if x == 0 else 0.42, 0.1, 0.2) for x in MOTIF]
    mel = [('E5', 2), ('D5', 1), ('C5', 1), ('B4', 2), ('A4', 2), ('C5', 1.5), ('B4', 0.5), ('A4', 1), ('G#4', 1), ('A4', 4), ('', 4)]
    for start in (8, 16):
        t = T.at(start)
        for nn, d in mel:
            if nn: T.put(flute(hz(m(nn)), d * T.spb * 1.1), t, 0.28, 0.2, 0.45)
            t += d * T.spb
    for b in (0, 12): T.put(bell(hz(m('A3')), 7), T.at(b), 0.3, -0.3, 0.6)
    return T.render(2.6)

def t_hostal():   # a slow bolero-bachata in the courtyard: requinto over nylon, bongo, soft güira
    T = Track(32, 104); prog = [(m('D3'), 'M'), (m('B2'), 'm'), (m('E3'), 'm'), (m('A2'), '7')]
    for b in range(32):
        r, k = prog[b % 4]; ch = chord(r + 12, k)
        for i, x in enumerate([0, 1, 1.5, 2, 3, 3.5]): T.put(guitar(hz(ch[i % len(ch)] + (12 if i > 2 else 0)), 1.6), T.at(b, x), 0.26, -0.3, 0.25)
        T.put(bass(hz(r), 1.2), T.at(b), 0.45); T.put(bass(hz(r + 7), 0.8), T.at(b, 2.5), 0.3)
        for x in (0, 1, 2, 3): T.put(bongo(x % 2 == 1), T.at(b, x + 0.5), 0.22, 0.3, 0.15)
        for x in np.arange(0, 4, 0.5): T.put(guira(0.1, 1.2 if x % 1 == 0 else 0.7), T.at(b, x), 0.18, 0.45, 0.1)
    scale = [m(n) for n in ('D5', 'E5', 'F#5', 'A5', 'B5', 'A5', 'F#5', 'E5')]
    for b in range(8, 32, 1):
        if b % 8 in (6, 7): continue
        r = prog[b % 4][0]
        for j, x in enumerate([0, 0.75, 1.5, 2.5]):
            nn = scale[(b * 3 + j) % len(scale)]
            T.put(requinto(hz(nn), 0.9), T.at(b, x), 0.2, 0.25, 0.3)
    return T.render(1.6)

def t_zona():     # the streets by day: a merengue at half heat, accordion, güira, tambora
    T = Track(32, 126); prog = [(m('G2'), 'M'), (m('C3'), 'M'), (m('D3'), '7'), (m('G2'), 'M')]
    for b in range(32):
        r, k = prog[(b // 2) % 4]; ch = chord(r + 12, k)
        for x in np.arange(0, 4, 0.5): T.put(guira(0.08, 1.3 if x % 1 == 0 else 0.6), T.at(b, x), 0.2, 0.4, 0.08)
        for x, lo in ((0, True), (1.5, False), (2, True), (3, False), (3.5, False)): T.put(tambora(lo), T.at(b, x), 0.38, -0.15, 0.12)
        T.put(bass(hz(r), 0.5), T.at(b), 0.42); T.put(bass(hz(r + 7), 0.5), T.at(b, 2), 0.35)
        for x in (0.5, 1.5, 2.5, 3.5): [T.put(guitar(hz(n), 0.4, 1.2), T.at(b, x), 0.12, -0.35, 0.1) for n in ch]
    line = ['B4', 'D5', 'G5', 'F#5', 'E5', 'D5', 'B4', 'C5', 'A4', 'C5', 'E5', 'D5', 'C5', 'B4', 'A4', 'G4']
    for b in range(4, 32):
        if b % 8 >= 6: continue
        for j in range(4): T.put(accordion(hz(m(line[(b * 4 + j) % 16])), T.spb * 0.9), T.at(b, j), 0.2, 0.15, 0.25)
    return T.render(1.2)

def t_cathedral():  # the Primada: organ in the stone, the bell, a far choir
    T = Track(16, 54); prog = [(m('D3'), 'm'), (m('Bb2'), 'M'), (m('F3'), 'M'), (m('A2'), 'M')]
    for b in range(16):
        r, k = prog[b % 4]
        for n in chord(r, k) + [r - 12]: T.put(organ(hz(n), T.spb * 4.2), T.at(b), 0.16, 0, 0.6)
        if b % 4 == 0: T.put(bell(hz(m('D3')), 8), T.at(b, 0.5), 0.35, -0.4, 0.8)
    for b in range(4, 16, 2):
        r, k = prog[b % 4]
        for n in chord(r + 12, k): T.put(voice(hz(n), T.spb * 7.5, 'o'), T.at(b), 0.07, 0.3, 0.9)
    return T.render(4.5, 0.7)

def t_archive():  # Inês: paper, patience, a ticking marimba line
    T = Track(24, 88); prog = [(m('E3'), 'm'), (m('C3'), 'M'), (m('A2'), 'm'), (m('B2'), '7')]
    for b in range(24):
        r, k = prog[(b // 2) % 4]; ch = chord(r + 12, k)
        for j in range(8): T.put(marimba(hz(ch[j % 3] + 12 * (j // 3 % 2))), T.at(b, j * 0.5), 0.18, -0.2 + 0.05 * j, 0.25)
        if b % 2 == 0: T.put(pad(hz(r), T.spb * 8, 900), T.at(b), 0.12, 0, 0.4)
        for x in range(4): T.put(clave() * 0.3, T.at(b, x), 0.15, 0.5, 0.1)
    return T.render(2.0, 0.75)

def t_salve():    # San Antón at night: the palos in the rhythm, a voice calling, the pad answering
    T = Track(56, 92, 2)
    for b in range(56):
        for x in MOTIF: T.put(palo(), T.at(b, x), 0.55 if x == 0 else 0.45, -0.1, 0.3)
        T.put(conga(True), T.at(b, 1.5), 0.25, 0.4, 0.2)
        for x in np.arange(0, 2, 0.5): T.put(shaker(), T.at(b, x + 0.25), 0.18, 0.5, 0.1)
    call = [('A4', 1.5), ('G4', 0.5), ('E4', 2), ('', 2), ('A4', 1), ('C5', 1), ('A4', 1), ('G4', 1), ('E4', 4), ('', 4)]
    for start in (4, 18, 34, 46):
        t = T.at(start)
        for nn, d in call:
            if nn: T.put(voice(hz(m(nn)), d * T.spb * 1.05, 'a', 0.018), t, 0.16, 0.15, 0.5)
            t += d * T.spb
    for b in range(0, 56, 4): T.put(pad(hz(m('A2')), T.spb * 8, 700), T.at(b), 0.14, 0, 0.5)
    return T.render(2.4)

def t_dread():    # the Sea near: a drone, the heartbeat in the series' rhythm, salt in the air
    T = Track(40, 60, 2)
    d = T.len + 6
    T.put(pad(hz(m('D2')), d, 400), 0, 0.25, -0.2, 0.5); T.put(pad(hz(m('A2')) * 1.01, d, 500), 0, 0.12, 0.3, 0.6)
    sw = lp(noise(int(d * SR)), 300) * (0.5 + 0.5 * np.sin(2 * np.pi * t_(d) / 9.0)); T.put(sw, 0, 0.08, 0, 0.4)
    for b in range(40):
        for x in MOTIF: T.put(thump(), T.at(b, x), 0.6 if x == 0 else 0.45, 0, 0.15)
        if b % 4 == 3: T.put(bell(hz(m('D2')), 7) * 0.6, T.at(b, 1), 0.22, -0.5, 0.9)
    return T.render(5.0, 0.7)

def t_yolande():  # the market and Yolande: rara bamboo horns in hocket, drums, an iron bell
    T = Track(24, 112)
    for b in range(24):
        for x in (0, 1.5, 2, 3): T.put(conga(x in (1.5, 3)), T.at(b, x), 0.32, -0.2, 0.15)
        for x in MOTIF: T.put(palo(), T.at(b, x * 1.0), 0.32, 0.1, 0.2)
        for x in (0, 0.75, 1.5, 2.5, 3): T.put(clave() * 0.6, T.at(b, x), 0.14, 0.5, 0.1)
        hock = [m('E4'), m('G4'), m('A4'), m('G4')]
        for j, x in enumerate((0.5, 1.0, 2.5, 3.0)): T.put(flute(hz(hock[j]), T.spb * 0.45) * 1.2, T.at(b, x), 0.16, (-1) ** j * 0.4, 0.3)
        if b % 2 == 0: T.put(bass(hz(m('E2')), 1.2), T.at(b), 0.4)
    return T.render(1.8)

def t_bachata():  # the blue-door bar: a bachata, the real thing at last
    T = Track(32, 128); prog = [(m('A2'), 'm'), (m('F2'), 'M'), (m('C3'), 'M'), (m('G2'), 'M')]
    for b in range(32):
        r, k = prog[b % 4]; ch = chord(r + 12, k)
        for x in (0, 1, 2, 3): T.put(bongo(x % 2 == 0), T.at(b, x), 0.28, 0.3, 0.12)
        T.put(conga(), T.at(b, 3.5), 0.25, 0.35, 0.12)
        for x in np.arange(0, 4, 0.5): T.put(guira(0.07, 1.2 if x % 1 == 0 else 0.7), T.at(b, x), 0.22, -0.4, 0.06)
        T.put(bass(hz(r), 0.5), T.at(b), 0.45); T.put(bass(hz(r + 7), 0.4), T.at(b, 1.5), 0.32); T.put(bass(hz(r + 12), 0.4), T.at(b, 3), 0.3)
        for x in (0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5): T.put(guitar(hz(ch[int(x * 2) % 3] + 12), 0.5), T.at(b, x), 0.16, -0.25, 0.15)
        if b >= 4 and b % 8 < 6:
            mel = [ch[2] + 12, ch[1] + 12, ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[2] + 14, ch[2] + 12, ch[1] + 12]
            for j, x in enumerate(np.arange(0, 4, 0.5)): T.put(requinto(hz(mel[j]), 0.5), T.at(b, x + 0.25), 0.18, 0.2, 0.2)
    return T.render(1.4)

def t_gallera():  # Villa Consuelo: Lilo's drum, the crowd through the wall
    T = Track(64, 100, 2)
    for b in range(64):
        for x in MOTIF: T.put(palo(), T.at(b, x), 0.6 if x == 0 else 0.48, 0, 0.25)
        if b % 2: T.put(conga(True), T.at(b, 1.6), 0.3, 0.3, 0.2)
    d = T.len + 6; crowd = bp(noise(int(d * SR)), 300, 1800) * (0.4 + 0.6 * np.abs(np.sin(2 * np.pi * t_(d) / 13.0)) ** 3)
    T.put(crowd, 0, 0.06, 0.4, 0.3)
    return T.render(2.0, 0.85)

def t_1586():     # 1586: drums, a wooden flute, the voices of the eleven
    T = Track(48, 70, 2)
    for b in range(48):
        for x in MOTIF: T.put(palo(), T.at(b, x), 0.5, -0.1, 0.4)
        if b % 2 == 0: T.put(pad(hz(m('D2')), T.spb * 4.5, 500), T.at(b), 0.16, 0, 0.6)
    tune = [('D5', 1), ('F5', 1), ('G5', 2), ('A5', 1), ('G5', 1), ('F5', 1), ('D5', 3), ('', 2), ('C5', 1), ('D5', 3)]
    for st in (2, 18, 34):
        t = T.at(st)
        for nn, d in tune:
            if nn: T.put(flute(hz(m(nn)) * 0.5, d * T.spb), t, 0.3, 0.25, 0.55)
            t += d * T.spb
    for b in range(4, 48, 8):
        for n in (m('D3'), m('A3'), m('F3')): T.put(voice(hz(n), T.spb * 7, 'u'), T.at(b), 0.08, -0.2, 0.8)
    return T.render(3.5, 0.75)

def t_lisbon():   # the shop on the Rua de São Miguel: a guitarra in minor, a fado's patience
    T = Track(16, 66); prog = [(m('E3'), 'm'), (m('B2'), '7'), (m('E3'), 'm'), (m('A2'), 'm'), (m('E3'), 'm'), (m('B2'), '7'), (m('E3'), 'm'), (m('E3'), 'm')]
    for b in range(16):
        r, k = prog[b % 8]; ch = chord(r, k)
        for x in (0, 1, 2, 3): T.put(guitar(hz(ch[0] - 12 if x % 2 == 0 else ch[1]), 1.2, 0.8), T.at(b, x), 0.22, -0.3, 0.2)
        mel = [ch[2] + 12, ch[1] + 12, ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[0] + 24]
        for j, x in enumerate((0, 0.5, 1, 2, 2.5, 3)): T.put(guitarra(hz(mel[j])), T.at(b, x + 0.25), 0.16, 0.25, 0.3)
    return T.render(1.8, 0.8)

def t_finale():   # the shore: every drum, both halves, the motif at full strength
    T = Track(56, 96, 2)
    for b in range(56):
        k = min(1.0, 0.4 + b / 16)
        for x in MOTIF: T.put(palo(), T.at(b, x), 0.6 * k, -0.15, 0.3); T.put(conga(True), T.at(b, x + 0.02), 0.3 * k, 0.35, 0.25)
        for x in np.arange(0, 2, 0.25): T.put(shaker(), T.at(b, x), 0.12 * k, 0.5, 0.1)
        if b % 2 == 0: T.put(pad(hz(m('A2')), T.spb * 4.5, 900), T.at(b), 0.18, 0, 0.5); T.put(bass(hz(m('A1')), 2), T.at(b), 0.4)
    for b in range(8, 56, 4):
        for n in (m('A3'), m('C4'), m('E4')): T.put(voice(hz(n), T.spb * 7.5, 'a'), T.at(b), 0.07, 0, 0.7)
        for n in (m('E4'), m('G4')): T.put(voice(hz(n), T.spb * 3.5, 'o'), T.at(b + 2), 0.06, 0.4, 0.7)
    return T.render(3.0)

def t_ending():   # after: the theme again, gentle, the guitar alone at first
    T = Track(16, 70); prog = [(m('A2'), 'm'), (m('F2'), 'M'), (m('C3'), 'M'), (m('G2'), 'M')]
    for b in range(16):
        r, k = prog[b % 4]; ch = chord(r + 12, k)
        for i, nn in enumerate([ch[0], ch[1], ch[2], ch[1] + 12, ch[2], ch[1]]): T.put(guitar(hz(nn), 2.4), T.at(b, i * 0.66), 0.3, -0.2 + 0.07 * i, 0.35)
        T.put(bass(hz(r), 3), T.at(b), 0.35)
    for b in (4, 8, 12):
        for x in MOTIF: T.put(palo() * 0.6, T.at(b, x), 0.35, 0.1, 0.3)
    mel = [('E5', 2), ('D5', 1), ('C5', 1), ('B4', 2), ('C5', 2), ('A4', 4)]
    t = T.at(8)
    for nn, d in mel: T.put(flute(hz(m(nn)), d * T.spb), t, 0.24, 0.2, 0.5); t += d * T.spb
    return T.render(2.8, 0.8)

MUSIC = {'title': t_title, 'hostal': t_hostal, 'zona': t_zona, 'cathedral': t_cathedral, 'archive': t_archive, 'salve': t_salve,
         'dread': t_dread, 'yolande': t_yolande, 'bachata': t_bachata, 'gallera': t_gallera, 'p1586': t_1586, 'lisbon': t_lisbon,
         'finale': t_finale, 'ending': t_ending}

# ================================================================ ambience beds (seamless 60 s loops) and details
def loopify(x, xf=3.0):
    n = int(xf * SR); body = x[..., :-n].copy(); fade = np.linspace(0, 1, n)
    body[..., :n] = body[..., :n] * fade + x[..., -n:] * (1 - fade); return body
def stereo(a, b=None): return np.stack([a, a if b is None else b])
def a_insects(d, rate=7.5, f=4200, k=1.0):   # cicadas by day, crickets at night: pulsed narrow tones
    t = t_(d); out = np.zeros_like(t)
    for i in range(6):
        ff = f * (0.85 + 0.3 * rng.random()); rr = rate * (0.8 + 0.4 * rng.random())
        env = (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * rr * t + rng.random() * 6))) * (0.6 + 0.4 * np.sin(2 * np.pi * t / (7 + 5 * rng.random()) + rng.random() * 6))
        buzz = 0.5 + 0.5 * np.sign(np.sin(2 * np.pi * (180 + 80 * rng.random()) * t))   # the wing's rasp: a fast pulse, not a whistle
        out += bp(np.sin(2 * np.pi * ff * t) * buzz + noise(len(t)) * 0.3, ff * 0.7, ff * 1.4) * lp(env, 60) * 0.12
    return out * k
def a_traffic(d): x = lp(noise(int(d * SR)), 180, 3) * 3 + bp(noise(int(d * SR)), 300, 900) * 0.15; return x * (0.8 + 0.2 * np.sin(2 * np.pi * t_(d) / 17))
def a_surf(d, k=1.0, per=7.0):
    t = t_(d); env = np.zeros_like(t); tt = 0.0
    while tt < d:
        i = int(tt * SR); L = int((per * (0.8 + 0.4 * rng.random())) * SR); seg = np.linspace(0, 1, L)
        e = np.where(seg < 0.25, seg / 0.25, np.exp(-(seg - 0.25) * 4.5)); j = min(len(env), i + L); env[i:j] = np.maximum(env[i:j], e[:j - i]); tt += per * (0.7 + 0.5 * rng.random())
    return (lp(noise(len(t)), 900) * 0.7 + bp(noise(len(t)), 900, 4000) * 0.25) * (0.15 + env) * k
def a_wind(d, k=1.0): t = t_(d); return bp(noise(len(t)), 150, 1200) * (0.4 + 0.6 * np.abs(np.sin(2 * np.pi * t / 11 + np.sin(t / 3)))) * k
def a_rain(d, k=1.0): n = int(d * SR); x = hp(noise(n), 1200) * 0.5 + lp(noise(n), 500) * 0.4; drops = (rng.random(n) < 0.0009) * noise(n) * 4; return (x + hp(drops, 2500)) * k
def a_fountain(d): n = int(d * SR); return bp(noise(n), 1500, 6000) * (0.7 + 0.3 * lp(noise(n), 8) * 8)
def a_crowd(d, k=1.0):
    t = t_(d); out = np.zeros_like(t)
    for i in range(14):
        f1 = 400 + 600 * rng.random(); talk = lp(np.clip(noise(len(t)), 0, None), 4) * 6
        out += bp(noise(len(t)), f1, f1 * 2.2) * np.clip(talk, 0, 1) * 0.15
    return out * k
def a_fan(d): t = t_(d); return lp(noise(len(t)), 400) * (1 + 0.15 * np.sin(2 * np.pi * 3.1 * t)) * 0.5 + np.sin(2 * np.pi * 120 * t) * 0.02
def a_room(d): return lp(noise(int(d * SR)), 250) * 0.4
def a_furnace(d): t = t_(d); return lp(noise(len(t)), 120, 3) * 4 * (1 + 0.2 * np.sin(2 * np.pi * t / 5)) + bp(noise(len(t)), 400, 1500) * 0.1
def bird(f=3200, n=5):          # a tropical call: a few chirps sliding down
    out = []
    for i in range(n):
        d = 0.07 + 0.05 * rng.random(); t = t_(d); fr = f * (1.2 - 0.4 * t / d) * (0.9 + 0.2 * rng.random())
        out.append(np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.sin(np.pi * t / d) * 0.5); out.append(np.zeros(int(0.05 * SR)))
    return np.concatenate(out)
def rooster():
    segs = [(500, 0.12), (700, 0.18), (650, 0.5), (420, 0.35)]; out = []
    for f, d in segs:
        t = t_(d); x = sum(np.sin(2 * np.pi * f * k * t) / k for k in range(1, 9)) * np.hanning(len(t)); out.append(x)
    return bp(np.concatenate(out), 300, 3500) * 0.4
def radio_far():                # a far merengue through a cheap radio speaker: the hostal's, a neighbour's
    T = Track(4, 126)
    for b in range(4):
        for x in np.arange(0, 4, 0.5): T.put(guira(0.08), T.at(b, x), 0.3)
        for x in (0, 2): T.put(tambora(), T.at(b, x), 0.5)
        for j in range(4): T.put(accordion(hz(m(['G4', 'B4', 'D5', 'B4'][j])), T.spb * 0.8), T.at(b, j), 0.3)
    x = T.L[:int(T.len * SR)]; return bp(x, 500, 3000) / (np.max(np.abs(x)) + 1e-9) * 0.5
def horn(): t = t_(0.5); return bp(np.sign(np.sin(2 * np.pi * 410 * t)) + np.sign(np.sin(2 * np.pi * 517 * t)), 300, 2500) * np.hanning(len(t)) * 0.2
def motor(): t = t_(3.0); f = 60 + 40 * np.sin(np.pi * t / 3); return lp(np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)), 600) * np.hanning(len(t)) * 0.25
def gecko(): out = []; [out.extend([np.sin(2 * np.pi * 1800 * t_(0.03)) * np.hanning(int(0.03 * SR)) * 0.3, np.zeros(int(0.09 * SR))]) for _ in range(6)]; return np.concatenate(out)
def clank(): t = t_(1.2); return sum(np.sin(2 * np.pi * f * t) * np.exp(-t * (3 + i)) for i, f in enumerate((310, 523, 871, 1290))) * 0.15

def norm(x, db): r = np.sqrt(np.mean(x ** 2)) + 1e-9; return x / r * 10 ** (db / 20)
D = 63.0
BEDS = {
    'sd_street':   lambda: stereo(norm(a_traffic(D), -26) + norm(a_insects(D, 9, 5200), -36), norm(a_traffic(D), -26) + norm(a_insects(D, 9, 5000), -36)),
    'sd_courtyard': lambda: stereo(norm(a_fountain(D), -30) + norm(a_traffic(D), -36), norm(a_fountain(D), -31) + norm(a_traffic(D), -36)),
    'sd_night':    lambda: stereo(norm(a_insects(D, 14, 3900), -30) + norm(a_room(D), -40), norm(a_insects(D, 13, 4300), -30) + norm(a_room(D), -40)),
    'sd_church':   lambda: stereo(norm(a_room(D), -36) + norm(a_wind(D, 0.5), -42), norm(a_room(D), -36) + norm(a_wind(D, 0.5), -42)),
    'sd_tower':    lambda: stereo(norm(a_wind(D), -30) + norm(a_surf(D), -38), norm(a_wind(D), -30) + norm(a_surf(D), -38)),
    'sd_sea':      lambda: stereo(norm(a_surf(D), -24) + norm(a_wind(D, 0.4), -38), norm(a_surf(D), -24) + norm(a_wind(D, 0.4), -38)),
    'sd_storm':    lambda: stereo(norm(a_surf(D, 1, 5), -20) + norm(a_wind(D), -26) + norm(a_rain(D), -28), norm(a_surf(D, 1, 5), -20) + norm(a_wind(D), -26) + norm(a_rain(D), -28)),
    'sd_rain':     lambda: stereo(norm(a_rain(D), -26), norm(a_rain(D), -26)),
    'sd_market':   lambda: stereo(norm(a_crowd(D), -26) + norm(a_traffic(D), -38), norm(a_crowd(D), -26) + norm(a_traffic(D), -38)),
    'sd_bar':      lambda: stereo(norm(a_crowd(D), -30) + norm(a_fan(D), -38), norm(a_crowd(D), -30) + norm(a_fan(D), -38)),
    'sd_gallera':  lambda: stereo(norm(a_crowd(D, 1.5), -24), norm(a_crowd(D, 1.5), -24)),
    'sd_room':     lambda: stereo(norm(a_fan(D), -32) + norm(a_traffic(D), -42), norm(a_fan(D), -32) + norm(a_traffic(D), -42)),
    'sd_office':   lambda: stereo(norm(a_fan(D), -32) + norm(a_room(D), -40), norm(a_fan(D), -33) + norm(a_room(D), -40)),
    'sd_cell':     lambda: stereo(norm(a_room(D), -32) + norm(a_fan(D), -44), norm(a_room(D), -32) + norm(a_fan(D), -44)),
    'sd_foundry':  lambda: stereo(norm(a_furnace(D), -24), norm(a_furnace(D), -24)),
    'sd_1586':     lambda: stereo(norm(a_surf(D, 0.8), -30) + norm(a_wind(D, 0.6), -36) + norm(a_insects(D, 6, 4800), -40), norm(a_surf(D, 0.8), -30) + norm(a_wind(D, 0.6), -36) + norm(a_insects(D, 6, 4600), -40)),
}
DETAILS = {'sd_bird': lambda: bird(), 'sd_bird_2': lambda: bird(2400, 3), 'sd_bird_3': lambda: bird(4100, 6), 'sd_rooster': rooster,
           'sd_radio': radio_far, 'sd_horn': horn, 'sd_horn_2': horn, 'sd_motor': motor, 'sd_gecko': gecko, 'sd_clank': clank, 'sd_clank_2': clank}

def write_mp3(name, x):
    wav = os.path.join(TMP, name + '.wav')
    import wave
    x = np.clip(x, -1, 1); x = x if x.ndim == 2 else np.stack([x, x])
    with wave.open(wav, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x.T * 32767).astype('<i2').tobytes())
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-c:a', 'libmp3lame', '-b:a', '112k', os.path.join(SFX, name + '.mp3')], check=True)
    os.remove(wav)
def write_track(name, x):
    wav = os.path.join(TMP, name + '.wav')
    import wave
    with wave.open(wav, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1).T * 32767).astype('<i2').tobytes())
    for codec, ext, br in (('libopus', 'opus.m4a', '96k'), ('aac', 'aac.m4a', '128k')):
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-c:a', codec, '-b:a', br] + (['-ar', '48000'] if codec == 'libopus' else []) + ['-f', 'mp4', os.path.join(MUS, name + '.' + ext)], check=True)
    os.remove(wav)

os.makedirs(MUS, exist_ok=True)
tj = os.path.join(MUS, 'tracks.json'); tracks = json.load(open(tj)) if os.path.exists(tj) else {}
for name, fn in MUSIC.items():
    if ONLY and name not in ONLY: continue
    x = fn(); dur = x.shape[1] / SR
    write_track(name, x)
    tracks[name] = {'dur': round(dur, 3), 'inp': 0.05, 'out': round(dur - 0.05, 3), 'v': hashlib.md5(x.tobytes()).hexdigest()[:8]}
    print('music', name, round(dur, 1), 's')
json.dump(tracks, open(tj, 'w'), indent=1, sort_keys=True)
man = os.path.join(SFX, 'manifest.json'); mf = json.load(open(man))
for name, fn in list(BEDS.items()) + list(DETAILS.items()):
    if ONLY and name not in ONLY: continue
    x = fn()
    if name in BEDS: x = loopify(x)
    write_mp3(name, x); mf[name] = hashlib.md5(x.tobytes()).hexdigest()[:8]
    print('sfx', name)
json.dump(mf, open(man, 'w'), sort_keys=True)
