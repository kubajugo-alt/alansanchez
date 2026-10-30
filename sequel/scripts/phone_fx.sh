#!/usr/bin/env bash
# Make a voice line sound like it comes down a 1996 phone line (the user's rule: Inês is only ever heard on the phone,
# and Carmen's answering machine sounds the same). The source recording stays as generated; the treated copy is what
# the game plays.
#
#   bash sequel/scripts/phone_fx.sh <in.mp3> <out.mp3> [light|line|crackly]
#
# line (the default): the telephone band (300-3400 Hz), mono, 8 kHz resample, compression, soft clip, faint hiss.
# light: a wider band (200-5000 Hz), no resample, no hiss: a good line, the voice easy to follow.
# crackly: a narrower band (400-3000 Hz), 6 kHz resample, harder clipping and more hiss: a long-distance line.
set -euo pipefail
in="$1"; out="$2"; preset="${3:-line}"
case "$preset" in
  light)   lo=200; hi=5000; sr=16000; clip=0;   gain=1.2; hiss=0 ;;
  line)    lo=300; hi=3400; sr=8000;  clip=1;   gain=1.4; hiss=0.006 ;;
  crackly) lo=400; hi=3000; sr=6000;  clip=1;   gain=1.9; hiss=0.014 ;;
  *) echo "preset: light, line or crackly" >&2; exit 1 ;;
esac
soft=""; [ "$clip" = 1 ] && soft="asoftclip=type=tanh,"
ffmpeg -v error -y -i "$in" -filter_complex "
  [0:a]aformat=channel_layouts=mono,highpass=f=$lo,highpass=f=$lo,lowpass=f=$hi,lowpass=f=$hi,
       aresample=$sr,aresample=44100,
       acompressor=threshold=-20dB:ratio=4:attack=5:release=80,
       ${soft}volume=$gain[v];
  anoisesrc=color=pink:amplitude=$hiss:sample_rate=44100,highpass=f=$lo,lowpass=f=$hi[n];
  [v][n]amix=inputs=2:duration=first:normalize=0[o]" -map "[o]" -ac 1 -b:a 96k "$out"
