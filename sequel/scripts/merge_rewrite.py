#!/usr/bin/env python3
"""Merge the day rewrites (2026-10-30: the user, "do all of the days"; one agent per day wrote its story file and its
lines to docs/rewrite/<day>.json) into js/lines.js: changed ids get their new text in place, new ids go in a block per
day at the end, removed ids go; emotion tags into js/story/emotions.js. Prints what it did and any speaker that isn't
in window.SPEAKERS.

  python3 sequel/scripts/merge_rewrite.py wed thu fri sat sun mon
"""
import json, os, re, sys

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DAYS = {'wed': 'Wednesday, Chapter Two', 'thu': 'Thursday, Chapter Three', 'fri': 'Friday, Chapters Four and Five',
        'sat': 'Saturday, Chapters Six and Seven', 'sun': 'Sunday, Chapters Eight to Ten', 'mon': 'Monday, Chapters Eleven and Twelve, and the prologue'}


def entry(i, sp, t): return f"  {i}: ['{sp}', {json.dumps(t, ensure_ascii=False)}],"


def main(days):
    f = os.path.join(SEQ, 'js/lines.js'); s = open(f).read()
    sp_block = s[s.index('window.SPEAKERS'):s.index('};', s.index('window.SPEAKERS'))]
    speakers = set(re.findall(r'(\w+): \[', sp_block)) | {'narr'}
    em_f = os.path.join(SEQ, 'js/story/emotions.js'); em = open(em_f).read()
    for d in days:
        j = json.load(open(os.path.join(SEQ, 'docs/rewrite', d + '.json')))
        bad = sorted({v[0] for v in list(j['changed'].values()) + list(j['new'].values())} - speakers - set(j.get('speakers', {})))
        if bad: print(d, 'UNKNOWN SPEAKERS', bad)
        n = 0
        for i, (sp, t) in j['changed'].items():
            pat = re.compile(r'^  ' + re.escape(i) + r": \[.*\],$", re.M)
            if not pat.search(s): print(d, 'not found', i); continue
            s = pat.sub(lambda m: entry(i, sp, t), s, count=1); n += 1
        for i in j['removed']:
            s, k = re.subn(r'^  ' + re.escape(i) + r": \[.*\],\n", '', s, count=1, flags=re.M)
        end = s.rindex('\n};')
        block = f"\n  // {DAYS[d]}, rewritten from the novel (2026-10-30)\n" + '\n'.join(entry(i, sp, t) for i, (sp, t) in j['new'].items())
        s = s[:end] + block + s[end:]
        for e, ids in (j.get('emotions') or {}).items():
            ids = [x for x in ids if f"'{x}'" not in em]
            if not ids: continue
            m = re.search(r"(\n    " + e + r": \[)(.*?)(\],)", em, re.S)
            if not m: print(d, 'no emotion', e); continue
            em = em[:m.end(2)] + ', ' + ', '.join(f"'{x}'" for x in ids) + em[m.end(2):]
        for i in j['removed']: em = em.replace(f", '{i}'", '').replace(f"'{i}', ", '')
        print(d, n, 'changed,', len(j['new']), 'new,', len(j['removed']), 'removed')
    open(f, 'w').write(s); open(em_f, 'w').write(em)


if __name__ == '__main__':
    main(sys.argv[1:])
