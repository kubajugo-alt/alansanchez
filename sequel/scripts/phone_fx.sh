#!/usr/bin/env bash
# Make a voice line sound like it comes down a 1996 phone line (the user's rule: Inês is only ever heard on the phone,
# and Carmen's answering machine sounds the same). The source recording stays as generated; the treated copy is what
# the game plays.
#
#   bash sequel/scripts/phone_fx.sh <in.mp3> <out.mp3>
#
# Telephone band (300-3400 Hz), mono, 8 kHz-ish bandwidth, a little saturation and compression, and a faint line hiss
# under the voice.
set -euo pipefail
in="$1"; out="$2"
ffmpeg -v error -y -i "$in" -filter_complex "
  [0:a]aformat=channel_layouts=mono,highpass=f=300,highpass=f=300,lowpass=f=3400,lowpass=f=3400,
       aresample=8000,aresample=44100,
       acompressor=threshold=-20dB:ratio=4:attack=5:release=80,
       asoftclip=type=tanh,volume=1.4[v];
  anoisesrc=color=pink:amplitude=0.006:sample_rate=44100,highpass=f=300,lowpass=f=3400[n];
  [v][n]amix=inputs=2:duration=first:normalize=0[o]" -map "[o]" -ac 1 -b:a 96k "$out"
