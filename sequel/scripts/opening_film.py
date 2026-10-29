#!/usr/bin/env python3
"""The opening film: Elena's last drive, cut from the animated paintings (the user, 2026-10-29: "replace the playable
version of the intro with a series of animated paintings - that would be an opening film to the whole thing").

  python3 sequel/scripts/opening_film.py [--burn]      art/review/opening_film/opening_film.mp4 (+ film_cues.json)

The storyboard (art/review/opening_film/index.html) shot by shot: each shot's clip (Higgsfield, Kling 3.0, silent:
art/review/opening_film/clips/sNN.mp4) is fitted to the shot's length (slowed a little, or its last frame held), cut
hard within a part and through black between parts; the date card and shot 13 are black. Under it: the recorded lines
(audio/voice), a few sounds (audio/sfx) and the music (Elena's theme from the road down, the title theme at the end).
film_cues.json gives each line's start and end in the film, so the game can caption it in its own lettering; --burn
also burns plain captions into the review copy. Nothing here touches the game.
"""
import json, os, subprocess, sys, tempfile

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(SEQ, 'art/review/opening_film')
V, SFX, MUS = (os.path.join(SEQ, 'audio', x) for x in ('voice', 'sfx', 'music'))
W, H, FPS = 1280, 720, 25
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'
LINES = json.loads(subprocess.run(['node', '-e', "global.window={};require(process.argv[1]);console.log(JSON.stringify(window.LINES))",
                                   os.path.join(SEQ, 'js/lines.js')], capture_output=True, text=True, check=True).stdout)

# (shot, part, length s, [(t, 'line'|'sfx', name, gain)])  a shot's length stretches to fit its last line
SHOTS = [
    ('s01', 1, 5, [(0, 'sfx', 'wind_arches', 0.5)]),
    ('s02', 1, 7, [(0, 'sfx', 'tower_wind', 0.5), (3.5, 'sfx', 'dog_distant', 0.4)]),
    ('s03', 1, 14, [(0.4, 'sfx', 'payphone_coins', 0.8), (2.0, 'sfx', 'phone_ring_distant', 0.5), (3.6, 'line', 'carmen_machine', 1),
                    (5.3, 'sfx', 'beep', 0.5), (5.8, 'line', 'elena_msg_01', 1)]),
    ('s04', 1, 14, [(0.3, 'line', 'elena_msg_02', 1), (9.0, 'line', 'elena_msg_03', 1)]),
    ('s05', 1, 6, [(0.0, 'sfx', 'phone_hangup', 0.7), (0.6, 'line', 'barman_stay', 1), (3.1, 'line', 'elena_stay', 1), (5.6, 'sfx', 'door_tavern', 0.6)]),
    ('s06', 2, 8, [(0, 'music', 'elena_car', 0.55)]),
    ('s07', 2, 8, [(1.5, 'line', 'elena_look_radio', 1)]),
    ('s08', 2, 7, [(0.5, 'line', 'elena_look_mirror', 1)]),
    ('s09', 2, 8, [(0.4, 'line', 'elena_look_notebook', 1)]),
    ('s10', 3, 12, [(0, 'music_out', '', 6), (1.0, 'sfx', 'wind_arches_2', 0.4), (2.0, 'line', 'elena_look_radio_2', 1),
                    (6.5, 'sfx', 'crash_wave', 0.25), (9.6, 'line', 'elena_look_air', 1)]),
    ('s11', 3, 7, [(0.2, 'sfx', 'water_seep', 0.7), (1.0, 'line', 'elena_salt', 1), (3.5, 'sfx', 'water_rise', 0.6)]),
    ('s12', 3, 8, [(0.0, 'sfx', 'water_rise_2', 0.6), (0.8, 'line', 'elena_doors', 1)]),
    ('s13', 3, 3, [(0.0, 'sfx', 'crash_wave', 0.7)]),
    ('s14', 4, 9, [(0.0, 'sfx', 'dawn_birds', 0.6), (1.2, 'line', 'gc_01', 1), (3.2, 'line', 'gc_02', 1), (5.4, 'line', 'gc_03', 1)]),
    ('s15', 4, 8, [(0.6, 'line', 'narr_open_01', 1), (4.2, 'line', 'narr_open_02', 1)]),
    ('s16', 4, 7, [(0, 'music', 'title', 0.7)]),
]
CARD = 'Gran Canaria  ·  21 December 1995  ·  the winter solstice'
FADE = 0.6   # through black between parts


def dur(p): return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout)
def ff(*a): subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *a], check=True)


def main(burn):
    tmp = tempfile.mkdtemp(dir=D); segs = []; cues = []; audio = []; t0 = 0.0; music = []
    for i, (sid, part, L, ev) in enumerate(SHOTS):
        for t, kind, name, g in ev:   # a shot is as long as its last line, and half a second more
            if kind == 'line': L = max(L, t + dur(os.path.join(V, name + '.mp3')) + 0.5)
        prev = SHOTS[i - 1][1] if i else None; nxt = SHOTS[i + 1][1] if i + 1 < len(SHOTS) else None
        fin = FADE if prev != part else 0; fout = FADE if nxt != part else 0
        out = os.path.join(tmp, f'{i:02d}.mp4'); clip = os.path.join(D, 'clips', sid + '.mp4')
        fade = ''.join([f',fade=t=in:st=0:d={fin}' if fin else '', f',fade=t=out:st={L - fout:.3f}:d={fout}' if fout else ''])
        if sid in ('s01', 's13') or not os.path.exists(clip):
            vf = f'color=c=black:s={W}x{H}:r={FPS}:d={L:.3f}'
            if sid == 's01': vf += f",drawtext=fontfile={FONT}:text='{CARD}':fontcolor=0xd9d2c4:fontsize=34:x=(w-tw)/2:y=(h-th)/2:alpha='min(1,max(0,min(t-0.8,{L}-0.8-t)))'"
            ff('-f', 'lavfi', '-i', vf, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', str(FPS), out)
        else:
            cd = dur(clip); k = min(1.3, max(1.0, L / cd))   # slower by up to 30%, then hold the last frame
            hold = max(0, L - cd * k)
            ff('-i', clip, '-vf', f'setpts={k:.4f}*PTS,scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={FPS},'
               f'tpad=stop_mode=clone:stop_duration={hold:.3f}{fade}', '-t', f'{L:.3f}', '-an', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', out)
        if sid == 's16':   # the title over the last painting (in the game, the film hands over to the title screen instead)
            t2 = out[:-4] + '_t.mp4'
            ff('-i', out, '-vf', f"drawtext=fontfile={FONT}:text='ALAN SANCHES II':fontcolor=0xf2e6cc:fontsize=64:x=(w-tw)/2:y=h*0.36:borderw=2:bordercolor=0x000000:alpha='min(1,max(0,t-1.2))',"
               f"drawtext=fontfile={FONT}:text='THE SHORTEST NIGHT':fontcolor=0xf2e6cc:fontsize=40:x=(w-tw)/2:y=h*0.36+84:borderw=2:bordercolor=0x000000:alpha='min(1,max(0,t-2.0))'",
               '-c:v', 'libx264', '-pix_fmt', 'yuv420p', t2); out = t2
        segs.append(out)
        for t, kind, name, g in ev:
            if kind == 'line':
                p = os.path.join(V, name + '.mp3'); audio.append((t0 + t, p, g))
                cues.append({'id': name, 'who': LINES[name][0], 'text': LINES[name][1].replace('[pause]', '').replace('  ', ' ').strip(), 'start': round(t0 + t, 2), 'end': round(t0 + t + dur(p), 2)})
            elif kind == 'sfx': audio.append((t0 + t, os.path.join(SFX, name + '.mp3'), g))
            elif kind == 'music': music.append(['in', t0 + t, os.path.join(MUS, name + '.aac.m4a'), g])
            elif kind == 'music_out': music.append(['out', t0 + t, '', g])
        t0 += L
    total = t0
    lst = os.path.join(tmp, 'list.txt'); open(lst, 'w').write(''.join(f"file '{s}'\n" for s in segs))
    vid = os.path.join(tmp, 'video.mp4'); ff('-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', vid)
    # the sound: every cue delayed to its place, the music beds faded in and out, all mixed under the voices
    ins, filt = [], []
    for n, (t, p, g) in enumerate(audio):
        ins += ['-i', p]; filt.append(f'[{n}:a]aresample=48000,volume={g},adelay={int(t * 1000)}|{int(t * 1000)}[a{n}]')
    n0 = len(audio); beds = []
    starts = [m for m in music if m[0] == 'in']; outs = [m for m in music if m[0] == 'out']
    for j, (_, t, p, g) in enumerate(starts):
        end = next((o[1] + o[3] for o in outs if o[1] > t), total)
        ins += ['-i', p]; L = end - t
        filt.append(f'[{n0 + j}:a]aresample=48000,atrim=0:{L:.3f},volume={g},afade=t=in:d=2,afade=t=out:st={max(0, L - 3):.3f}:d=3,adelay={int(t * 1000)}|{int(t * 1000)}[m{j}]')
        beds.append(f'[m{j}]')
    mix = ''.join(f'[a{n}]' for n in range(n0)) + ''.join(beds)
    filt.append(f'{mix}amix=inputs={n0 + len(beds)}:normalize=0,atrim=0:{total:.3f},alimiter=limit=0.95[out]')
    wav = os.path.join(tmp, 'mix.wav'); ff(*ins, '-filter_complex', ';'.join(filt), '-map', '[out]', '-ac', '2', wav)
    vf = []
    if burn:
        srt = os.path.join(tmp, 'c.srt')
        ts = lambda s: f'{int(s // 3600):02d}:{int(s % 3600 // 60):02d}:{int(s % 60):02d},{int(s * 1000 % 1000):03d}'
        open(srt, 'w').write('\n'.join(f'{k + 1}\n{ts(c["start"])} --> {ts(c["end"])}\n{c["text"]}\n' for k, c in enumerate(cues)))
        vf = ['-vf', f"subtitles={srt}:force_style='FontName=DejaVu Serif,Bold=1,FontSize=20,Outline=2,Shadow=1,MarginV=36'"]
    out = os.path.join(D, 'opening_film.mp4')
    ff('-i', vid, '-i', wav, *vf, '-c:v', 'libx264', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', '-shortest', out)
    json.dump({'duration': round(total, 2), 'cues': cues}, open(os.path.join(D, 'film_cues.json'), 'w'), indent=1, ensure_ascii=False)
    subprocess.run(['rm', '-r', tmp]); print(out, round(total, 1), 's,', len(cues), 'lines')


if __name__ == '__main__':
    main('--burn' in sys.argv)
