# Builds the review screen's candidate list (art/review/candidates.json + art/review/candidates/*.webp).
#   python3 scripts/review_candidates.py
# A candidate is a Gemini frame waiting for approval: its picture, the original(s) it was made from, its
# sprite metadata, and how it is wired in once approved. The game loads only approved candidates
# (art/review/approvals.json, written by the review screen), so nothing unapproved is ever on screen.
import json, os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REV = os.path.join(ROOT, 'art/review')
OUT = os.path.join(REV, 'candidates')
SP = lambda k: f'art/sprites/{k}.webp'
THREE_Q = ['alan_front', 'alan_flirt', 'alan_wink', 'alan_fluster', 'alan_swoon', 'alan_button', 'alan_yawn',
           'alan_enchanted1', 'alan_rapt1', 'alan_coffees']

# name, made from (originals), what it shows, wiring once approved
PHASE2 = [
    ('ib_weight_shift', ['alan_side', 'alan_walkA'], 'Proposal D: the weight shifting back just before the first step', {'walkStart': 0}),
    ('ib_walk_start', ['alan_side', 'alan_walkA'], 'the first step of a walk', {'walkStart': True}),
    ('ib_walk_stop', ['alan_walkB', 'alan_side'], 'the last step of a walk', {'walkStop': True}),
    ('ib_turn34', ['alan_side', 'alan_front'], 'turning toward us (3/4)', {'inbetween': {f'alan_side>{k}': ['@'] for k in THREE_Q}}),
    ('ib_turn34back', ['alan_side', 'alan_back'], 'turning away (3/4 back)', {'inbetween': {'alan_side>alan_back': ['@']}}),
    ('ib_smoke_in', ['alan_side', 'alan_smoke_light'], 'hand to the pocket for a cigarette', {'inbetween': {'alan_side>alan_smoke_light': ['@']}}),
    ('ib_smoke_out', ['alan_smoke_exhale', 'alan_side'], 'flicking the cigarette away',
     {'inbetween': {f'alan_smoke_{k}>alan_side': ['@'] for k in ('exhale', 'hold', 'inhale')}}),
    ('ib_stretch1', ['alan_yawn', 'alan_stretch'], 'arms rising (1 of 2)', {'inbetween': {'alan_yawn>alan_stretch': ['@', '#ib_stretch2']}}),
    ('ib_stretch2', ['alan_yawn', 'alan_stretch'], 'arms rising (2 of 2)', {'inbetween': {'alan_yawn>alan_stretch': ['#ib_stretch1', '@']}}),
    ('ib_stretch_down', ['alan_stretch', 'alan_side'], 'arms coming down', {'inbetween': {'alan_stretch>alan_side': ['@']}}),
    ('ib_read', ['alan_side', 'alan_read'], 'bringing the book up', {'inbetween': {'alan_side>alan_read': ['@']}}),
    ('ib_write', ['alan_side', 'alan_write'], 'bringing the notebook up', {'inbetween': {'alan_side>alan_write': ['@']}}),
    ('ib_phone', ['alan_side', 'alan_phone'], 'receiver half way to the ear', {'inbetween': {'alan_side>alan_phone': ['@']}}),
    ('ib_drink', ['alan_side', 'alan_drink'], 'the glass at chest height', {'inbetween': {'alan_side>alan_drink': ['@']}}),
    ('ib_cut', ['alan_side', 'alan_cutpalm'], 'knife and palm coming together', {'inbetween': {'alan_side>alan_cutpalm': ['@']}}),
    ('ib_reach', ['alan_side', 'alan_reach'], 'arm half out', {'inbetween': {'alan_side>alan_reach': ['@']}}),
    ('ib_pick1', ['alan_side', 'alan_pickup'], 'starting to bend (1 of 2)', {'inbetween': {'alan_side>alan_pickup': ['@', '#ib_pick2']}}),
    ('ib_pick2', ['alan_side', 'alan_pickup'], 'half way down (2 of 2)', {'inbetween': {'alan_side>alan_pickup': ['#ib_pick1', '@']}}),
    ('ib_throw', ['alan_side', 'alan_throw1'], 'the wind-up', {'inbetween': {'alan_side>alan_throw1': ['@']}}),
    ('ib_ring', ['alan_ring', 'alan_side'], 'lifting the hammer', {'inbetween': {'alan_side>alan_ring': ['@']}}),
    ('ib_pull', ['alan_pull', 'alan_side'], 'taking hold of the rope', {'inbetween': {'alan_side>alan_pull': ['@']}}),
    ('ib_wobble', ['alan_side', 'alan_wobble'], 'first loss of balance', {'inbetween': {'alan_side>alan_wobble': ['@']}}),
    ('ib_lantern', ['alan_side', 'alan_lantern'], 'lifting the lantern', {'inbetween': {'alan_side>alan_lantern': ['@']}}),
    ('ib_coffee_walk1', ['alan_coffees', 'alan_walkA'], 'carry walk with the coffees: contact step',
     {'set': {'coffees': {'walk': ['@', '#ib_coffee_walk2']}}}),
    ('ib_coffee_walk2', ['alan_coffees', 'alan_pass'], 'carry walk with the coffees: passing step',
     {'set': {'coffees': {'walk': ['#ib_coffee_walk1', '@']}}}),
]


# phase 3: in-between paintings for the way into and out of a combined sprite (Alan with someone), anchored like
# the pairs themselves (scripts/pair_anchors.py: Alan's feet, the partner's feet); played when the review
# screen's pair transition is set to 'gemini'
PHASE3_T = json.load(open(os.path.join(ROOT, 'scripts/pair_ibs.json')))['pairs']
PHASE3_STEPS = json.load(open(os.path.join(ROOT, 'scripts/pair_ibs.json')))['steps']


def pair_meta(png, side):
    import sys; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import numpy as np
    from pair_anchors import feet
    al = np.asarray(Image.open(png).convert('RGBA'))[..., 3] > 128; W, H = al.shape[1], al.shape[0]
    a0, a1 = side
    ax, fy, top = feet(al, int(a0 * W), int(a1 * W))
    px, pfy, _ = feet(al, *((int(a1 * W), W) if a0 == 0 else (0, int(a0 * W))))
    ys = np.where(al.any(1))[0]
    return {'w': float(W), 'hh': float(H), 'h': float(round(fy - top)) if fy - top >= 690 else 720.0, 'ax': round(ax, 1), 'fy': round(fy + 0.5, 1),
            'top': float(ys.min()), 'px': round(px, 1), 'pfy': round(pfy + 0.5, 1), 'rigid': True}


# the walk with both legs (cycle: A, down, passing, up, then the other leg's contact, down, passing, up); until
# a frame is approved its slot keeps the old one (the second step reused the first step's paintings)
# the cycle: walkA (near leg forward), the near leg carrying him (pre2, pass2, up2), then the far leg forward and carrying
# him (contact_far, pre1, pass1, up1). Every painting before contact_far had the near leg in front, so each step was
# taken with the same leg: a skip.
WALK2 = [('pre2_low', 1, 'walk: just after the heel lands, a short step: the near leg in front taking his weight, the far heel lifting'),
         ('pass2_low', 2, 'walk: passing (near leg standing, the far foot swinging low)'),
         ('up2_low', 3, 'walk: standing on the near leg, the far leg reaching forward, low'),
         ('contact_far_low', 4, 'walk: the other step: the FAR leg forward, heel down, the near arm swinging forward'),
         ('pre1_low', 5, 'walk: the other step: a short step, the far leg in front taking his weight, the near heel lifting'),
         ('pass1_low', 6, 'walk: the other step: passing (far leg standing, the near foot swinging low)'),
         ('up1_low', 7, 'walk: the other step: standing on the far leg, the near leg reaching forward, low')]

VASCO_WALK = [('walk_passN', 2, 'walk: passing (near leg standing, the far foot swinging past)'),
              ('walk_upN', 3, 'walk: standing on the near leg, the far leg reaching forward'),
              ('walk_far', 4, 'walk: the other step: the FAR leg forward, heel down, the near arm swinging forward'),
              ('walk_preF', 5, 'walk: the other step: a short step, the far leg in front taking his weight'),
              ('walk_passF', 6, 'walk: the other step: passing (far leg standing, the near foot swinging past)')]


def put(src_png, key):
    """The candidate's image, written once: later fixes to it (jeans colour, cut-out edges) are kept on a rebuild."""
    dst = os.path.join(OUT, key + '.webp')
    if not os.path.exists(dst): Image.open(src_png).convert('RGBA').save(dst, lossless=True)


def main():
    os.makedirs(OUT, exist_ok=True)
    cands = []
    for name, orig, what, wire in PHASE2:
        src_png = os.path.join(REV, f'alan/phase2/{name}.png')
        if not os.path.exists(src_png): continue
        key = 'alan_' + name
        put(src_png, key)
        meta = json.load(open(os.path.join(REV, f'alan/phase2/{name}_meta.json')))
        meta = {k: (float(v) if isinstance(v, (int, float)) else v) for k, v in meta.items() if k in ('w', 'hh', 'h', 'ax', 'fy', 'top', 'facesLeft')}
        cands.append({'id': key, 'char': 'alan', 'phase': 2, 'kind': 'inbetween', 'what': what,
                      'src': f'art/review/candidates/{key}.webp', 'originals': [SP(o) for o in orig], 'meta': meta,
                      'wire': json.loads(json.dumps(wire).replace('"@"', json.dumps(key)).replace('"#ib_', '"alan_ib_'))})
    for pk, solo, who, side, dirs, scene, *_ in PHASE3_T:
        for d in dirs:
            name, key = f'ib_{pk[5:]}_{d}', pk.replace('pair_', 'pair_ib_', 1) + '_' + d
            src_png = os.path.join(REV, f'alan/phase3/{name}.png')
            if not os.path.exists(src_png): continue
            put(src_png, key)
            cands.append({'id': key, 'char': 'alan', 'phase': 3, 'kind': 'pair-inbetween', 'pair': pk,
                          'what': f'{scene}: {"stepping into" if d == "in" else "stepping out of"} {pk}',
                          'src': f'art/review/candidates/{key}.webp', 'originals': [SP(pk), SP(solo), SP('alan_side')], 'meta': pair_meta(src_png, side),
                          'wire': {'pairIb': {pk: {d: [key]}}}})
    # the steps from one pair painting to the next (S.pairStep), on the same side as the sequence's pairs
    sides = {p[0]: p[3] for p in PHASE3_T}
    for a, b, who, scene, *_ in PHASE3_STEPS:
        side = sides.get(a) or next((v for k, v in sides.items() if k.split('_')[:2] == a.split('_')[:2]), None)
        if side is None: side = next(sides[s[0]] for s in PHASE3_STEPS if s[1] == a and s[0] in sides)
        name = f'ib_{a[5:]}__{b.split("_")[-1]}'
        key = 'pair_ib_' + name[3:]
        src_png = os.path.join(REV, f'alan/phase3/{name}.png')
        if not os.path.exists(src_png): continue
        put(src_png, key)
        cands.append({'id': key, 'char': 'alan', 'phase': 3, 'kind': 'pair-inbetween', 'pair': a,
                      'what': f'{scene}: from {a} to {b}',
                      'src': f'art/review/candidates/{key}.webp', 'originals': [SP(a), SP(b)], 'meta': pair_meta(src_png, side),
                      'wire': {'pairIb': {f'{a}>{b}': {'step': [key]}}}})
    # the scripted sequences (bath, swim, dressing): one painting halfway through each change (scripts/gen_seq_ibs.py;
    # camera cuts into close-ups stay cuts)
    for a, b, what in json.load(open(os.path.join(ROOT, 'scripts/seq_ibs.json'))):
        name = f"ib_{a.replace('alan_', '')}__{b.replace('alan_', '')}"
        src_png = os.path.join(REV, f'alan/phase2/{name}.png')
        if not os.path.exists(src_png): continue
        key = 'alan_' + name
        put(src_png, key)
        meta = json.load(open(os.path.join(REV, f'alan/phase2/{name}_meta.json')))
        meta = {k: float(v) for k, v in meta.items() if k in ('w', 'hh', 'h', 'ax', 'fy', 'top')}
        cands.append({'id': key, 'char': 'alan', 'phase': 2, 'kind': 'inbetween', 'what': what,
                      'src': f'art/review/candidates/{key}.webp', 'originals': [SP(a), SP(b)], 'meta': meta,
                      'wire': {'inbetween': {f'{a}>{b}': [key]}}})
    # the full walk (both legs): each new painting takes its slot in the 8-step cycle once approved
    for name, slot, what in WALK2:
        src_png = os.path.join(REV, f'alan/walk2/{name}.png')
        if not os.path.exists(src_png): continue
        key = 'alan_walk_' + name.replace('_low', 'L')
        put(src_png, key)
        meta = json.load(open(os.path.join(REV, f'alan/walk2/{name}_meta.json')))
        meta = {k: float(v) for k, v in meta.items() if k in ('w', 'hh', 'h', 'ax', 'fy', 'top')}
        cands.append({'id': key, 'char': 'alan', 'phase': 2, 'kind': 'walk', 'what': what,
                      'src': f'art/review/candidates/{key}.webp', 'originals': [SP('alan_walkDown'), SP('alan_walkUp')], 'meta': meta,
                      'wire': {'walkSlot': slot}})
    # Vasco's new paintings (scripts/gen_vasco.py, the map's groups A-E): each one a pose of his own once approved;
    # the scenes that use them are wired after approval
    for j in json.load(open(os.path.join(ROOT, 'scripts/vasco_frames.json'))):
        src_png = os.path.join(REV, f"vasco/{j['name']}.png")
        if not os.path.exists(src_png): continue
        key = 'vasco_' + j['name']
        put(src_png, key)
        meta = json.load(open(os.path.join(REV, f"vasco/{j['name']}_meta.json")))
        meta = {k: float(v) for k, v in meta.items() if k in ('w', 'hh', 'h', 'ax', 'fy', 'top')}
        cands.append({'id': key, 'char': 'vasco', 'phase': 2, 'kind': 'pose', 'what': f"Vasco ({j['group']}): {j['what']}",
                      'src': f'art/review/candidates/{key}.webp', 'originals': [SP(r) if '/' not in r else r for r in j['refs'] if 'vasco' in r], 'meta': meta,
                      'wire': {'poses': {j['name']: key}}})
    # the love scene, afterwards (se.js S.vascoLove): the two of them on the store floor against a crate, the clapper
    # between them; in the room until the Canva still (still_store_after) exists
    src_png = os.path.join(REV, 'vasco/pair_after.png')
    if os.path.exists(src_png):
        key = 'pair_vasco_after'
        put(src_png, key)
        meta = json.load(open(os.path.join(REV, 'vasco/pair_after_meta.json')))
        cands.append({'id': key, 'char': 'alan', 'phase': 3, 'kind': 'pose', 'what': 'The love scene, afterwards: on the floor against a crate, shirts open, laughing, the clapper between them',
                      'src': f'art/review/candidates/{key}.webp', 'originals': [SP('pair_vasco_shirtless'), SP('pair_vasco_clapper')], 'meta': meta,
                      'wire': {'poses': {key: key}}})
    # Vasco's walk, the same fix as Alan's: every painted stride had his near leg in front. 8 steps: walk1 (near leg
    # forward), pass1, passN, upN, walk_far (far leg forward: scripts/walk_swap_cut.py, repainted), preF, passF, pass2.
    # walkBase is the cycle the slots go into (all or none, like Alan's)
    base = ['vasco_walk1', 'vasco_pass1', 'vasco_pass1', 'vasco_walk2', 'vasco_walk2', 'vasco_pass2', 'vasco_pass2', 'vasco_pass2']
    for name, slot, what in VASCO_WALK:
        src_png = os.path.join(REV, f'vasco/{name}.png')
        if not os.path.exists(src_png): continue
        key = 'vasco_' + name
        put(src_png, key)
        meta = json.load(open(os.path.join(REV, f'vasco/{name}_meta.json')))
        meta = {k: float(v) for k, v in meta.items() if k in ('w', 'hh', 'h', 'ax', 'fy', 'top')}
        cands.append({'id': key, 'char': 'vasco', 'phase': 2, 'kind': 'walk', 'what': 'Vasco ' + what,
                      'src': f'art/review/candidates/{key}.webp', 'originals': [SP('vasco_walk1'), SP('vasco_pass1')], 'meta': meta,
                      'wire': {'walkSlot': slot, 'walkBase': base}})
    # phase 1 flagged frames: a proposal that needs no new painting
    cands.append({'id': 'wire_alan_untie', 'char': 'alan', 'phase': 2, 'kind': 'wiring',
                  'what': 'Proposal A: the successful haul on the mooring line (Ch. IV) uses the unused alan_untie; the failed first try keeps alan_pull',
                  'src': SP('alan_untie'), 'originals': [SP('alan_pull')], 'meta': None, 'wire': {'poses': {'untie': 'alan_untie'}}})
    json.dump({'candidates': cands}, open(os.path.join(REV, 'candidates.json'), 'w'), indent=1)
    ap = os.path.join(REV, 'approvals.json')
    if not os.path.exists(ap): json.dump({}, open(ap, 'w'))
    print(len(cands), 'candidates')


if __name__ == '__main__':
    main()
