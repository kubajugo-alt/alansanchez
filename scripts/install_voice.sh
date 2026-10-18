#!/bin/sh
# Installs a new voice take for a line: levels it to the median loudness of that speaker's other lines (EBU R128),
# encodes it like the rest (64 kbps mono mp3) and remakes its lip-sync cues if the speaker is Alan.
#   scripts/install_voice.sh <line_id> <take.mp3>
set -e
id=$1; src=$2; cd "$(dirname "$0")/.."
who=$(node -e "global.window={};require('./js/lines.js');process.stdout.write(window.LINES['$id'][0])")
loud() { ffmpeg -hide_banner -nostats -i "$1" -af ebur128 -f null - 2>&1 | awk '/^ *I:/{v=$2} END{print v}'; }
target=$(for f in $(node -e "global.window={};require('./js/lines.js');const L=window.LINES;console.log(Object.keys(L).filter(k=>L[k][0]==='$who'&&k!=='$id').slice(0,12).join(' '))"); do [ -e audio/voice/$f.mp3 ] && loud audio/voice/$f.mp3; done | sort -n | awk '{a[NR]=$1} END{print a[int((NR+1)/2)]}')
now=$(loud "$src"); gain=$(echo "$target - $now" | bc)
ffmpeg -v error -y -i "$src" -af "volume=${gain}dB" -ac 1 -ar 44100 -b:a 64k audio/voice/$id.mp3
echo "$id ($who): $now LUFS -> $target LUFS (${gain} dB)"
[ "$who" = alan ] && [ -n "$RHUBARB" ] && python3 scripts/lipsync.py "$id" | tail -1 || true
