# Downloads finished ElevenLabs generations named in a mapping file.
#   python3 scripts/fetch-voices.py map.json transcript.jsonl [more transcripts...]
# map.json: {"line_id": "session_id", ...}; the signed content URLs are read
# from the transcripts (they contain /content_generation/<session_id>/...).
import sys, json, re, os, subprocess
mapping = json.load(open(sys.argv[1]))
text = ''.join(open(p, errors='ignore').read() for p in sys.argv[2:])
urls = {}
for m in re.finditer(r'https://storage\.googleapis\.com/xi-backend/[^"\\\s]*?/content_generation/([A-Za-z0-9]+)/[A-Za-z0-9]+/content\.mp3\?[^"\\\s]+', text):
    urls[m.group(1)] = m.group(0)
out = os.environ.get('OUT') or os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'audio', 'voice')
ok = miss = 0
for lid, sid in mapping.items():
    dst = os.path.join(out, lid + '.mp3')
    if os.path.exists(dst) and os.path.getsize(dst) > 2000: ok += 1; continue
    u = urls.get(sid)
    if not u: print('no url', lid, sid); miss += 1; continue
    subprocess.run(['curl', '-sS', '-o', dst, u], check=False)
    if os.path.getsize(dst) < 2000: print('bad', lid); os.remove(dst); miss += 1
    else: ok += 1
print('ok', ok, 'missing', miss)
