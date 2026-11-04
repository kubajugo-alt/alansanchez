#!/usr/bin/env python3
"""Apply the approved dialogue flags (HANDOFF entry 151): the user approved all 168 (2026-11-04, "approve all").

  python3 sequel/scripts/apply_dialogue_flags.py

For each flag in art/review/dialogue_flags/flags.json with new text: the text in js/lines.js is replaced (the id stays).
Where the reviewer quoted only the changed part of a line ("... in the damp."), it is spliced into the whole line
(SPLICE below, checked by hand). A line whose recording no longer matches has its mp3 moved to
audio/voice_stale/dialogue_review/ (so the new text shows as a caption until it is re-recorded with the same voice),
its id added to scripts/voice_redo.txt, and its audio-tag text dropped from scripts/tts_text.json (it was the old
words). The flags that change code (order, conditions, a pose, new looks) are done by hand in the story files.
"""
import json, os, re, shutil

SEQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
flags = json.load(open(os.path.join(SEQ, 'art/review/dialogue_flags/flags.json')))['flags']
lines_p = os.path.join(SEQ, 'js/lines.js'); src = open(lines_p, encoding='utf8').read()

def current(i):
    m = re.search(r'^  %s: \[\'([a-z_]+)\', (".*")\],\s*$' % re.escape(i), src, re.M)
    return m.group(1), json.loads(m.group(2)), m

# the reviewer quoted part of the line: (old part, new part), spliced by hand
SPLICE = {
    'baute_t_discs': ('in the weather.', 'in the damp.'),
    'carmen_cigs_thanks_3': ('learning, inglés.', 'learning, portugués.'),
    'alan_w_done': ("a letter nobody's opened in two hundred and forty-five years.", 'a letter that waited two hundred and forty-five years for me.'),
    'vasco_w_night_2': ('Six sockets empty now.', 'Six sockets empty.'),
    'mercedes_juan_2': ('He wrote that down too.', 'He swore to that too.'),
    'vasco_th_speech_1': ('Dozens of them,', 'Seven of them,'),
    'derek_th_vasco': ('twenty minutes of him', 'ten minutes of him'),
    'alan_th_desk_2': ("[pause] It's him.", "[pause] It's Montesdeoca."),
    'yeray_bar_1': ('once a month since Christmas', 'once a month since December'),
    'yeray_bar_2': ('[hiccup]', '[pause]'),
    'yeray_bar_6': ("He's been like a father to me.", "El jefe's been like a father to me."),
    'ines_call_sat_16': ("it's the reason it'll want you first.", "it's the reason it'll come for you."),
    'vasco_scenes_2': ("It's the grandmothers' romance.", "It's the grandmothers' telling."),
    'baute_v_03': ('for five hundred years', 'for nine hundred years'),
    'vasco_look_crates': ('The missing nails. All here.', 'The missing nails. [pause] Five of them.'),
    'alan_look_crates': ('wrapped in cloth', 'in straw'),
    'alan_su_idiot_4': ('Two people have drowned in their beds,', 'Six people have drowned since December,'),
    'vasco_m_knew_3': ('I lay in that vault all night', 'I lay in that vault a night and a day'),
    'chano_end_3': ("My cousin's husband's brother", "My cousin's wife's sister's husband"),
    'alan_pz_letter_done_1': ('every soul given back from it', 'every soul taken back from it'),
    'chano_s_tasarte_2': ('Twenty-five years old.', 'Twenty-eight years old.'),
    'ines_hint_aloe': ('Of course you did.', 'Naturally.'),
    'bg_museum_guest_academic_burn': ('the Guanche pottery slip', 'the old Canario pottery slip'),
    'alan_read_sketchbook_1': ('The boy from the end of the counter.', 'The boy at the corner table.'),
}
# the flags whose change is in the code, not (only) the words: their text, where they have one, set here
TEXT = {
    'alan_w_dawn_say': "I should have said it. I saw a ghost. The thing from the cistern. It's here, and I'm frightened.",
    'alan_ask_carmen_pepe': "A fisherman drowned in his bed last month, in La Isleta. Doña Pino has a list.",
}
CODE_ONLY = {'alan_look_vasco_reception', 'alan_look_gail', 'carmen_th_monte_2', 'narr_m_baute_silent'}
# lines the reviewers' fixes reach beyond the flagged ids (Saturday's radio hour moves to four: review_09-12)
EXTRA = {
    'alan_look_wait_hour': "The floor by the window. A good place to wait for four o'clock.",
    'narr_s_wait_bell': "He waits with the radio in his lap. At four o'clock the clock he wound on Wednesday strikes, and the north bell, his family's bell, gives one deep note over Vegueta.",
}
NEW = {   # new looks for the moments the old ones didn't describe (flags 7 and 13)
    'alan_look_vasco_walk': ('alan', "Vasco, still lit up from the party. He hasn't stopped talking about the light since the door.", 'alan_look_vasco_reception'),
    'alan_look_gail_dinner': ('alan', "Gail, in her good frock, pink shoulders out, whispering at Derek like a cinema usher.", 'alan_look_gail'),
}

changes = {}
for f in flags:
    i = f['id']
    if i in CODE_ONLY: continue
    spk, now, m = current(i)
    if i in TEXT: new = TEXT[i]
    elif i in SPLICE:
        a, b = SPLICE[i]; assert a in now, (i, a); new = now.replace(a, b, 1)
    else:
        new = f['suggested'].strip()
        assert new and not new.startswith(('...', '…')) and not new.endswith('…'), (i, new)
        if new.endswith('...') and not now.endswith('...') : raise SystemExit('partial? ' + i)
    changes[i] = new
for i, t in EXTRA.items(): changes[i] = t

for i, new in changes.items():
    assert re.fullmatch(r"[^\[\]]*(\[pause\][^\[\]]*)*", new), ('bracket', i, new)
    spk, now, m = current(i)
    if now == new: continue
    src = src[:m.start(2)] + json.dumps(new, ensure_ascii=False) + src[m.end(2):]
for i, (spk, t, after) in NEW.items():
    if re.search(r'^  %s:' % i, src, re.M): continue
    m = re.search(r'^  %s: .*$' % after, src, re.M)
    src = src[:m.end()] + '\n  %s: [%s, %s],' % (i, json.dumps(spk).replace('"', "'"), json.dumps(t, ensure_ascii=False)) + src[m.end():]
open(lines_p, 'w', encoding='utf8').write(src)

# recordings now stale, the redo list, the audio-tag texts
stale = os.path.join(SEQ, 'audio/voice_stale/dialogue_review'); os.makedirs(stale, exist_ok=True)
moved = []
for i in changes:
    mp3 = os.path.join(SEQ, 'audio/voice', i + '.mp3')
    if os.path.exists(mp3): shutil.move(mp3, os.path.join(stale, i + '.mp3')); moved.append(i)
redo_p = os.path.join(SEQ, 'scripts/voice_redo.txt'); redo = open(redo_p).read()
add = [i for i in moved + list(NEW) if not re.search(r'^%s$' % i, redo, re.M)]
if add: open(redo_p, 'a').write('# the dialogue review, HANDOFF 151\n' + '\n'.join(add) + '\n')
tts_p = os.path.join(SEQ, 'scripts/tts_text.json'); tts = json.load(open(tts_p, encoding='utf8'))
dropped = {i: tts.pop(i) for i in list(tts) if i in changes}
open(tts_p, 'w', encoding='utf8').write(json.dumps(tts, ensure_ascii=False, indent=2) + '\n')
if dropped: json.dump(dropped, open(os.path.join(stale, 'tts_text_dropped.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print(len(changes), 'lines changed;', len(NEW), 'new;', len(moved), 'recordings set aside;', len(dropped), 'audio-tag texts dropped')
