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


def main():
    os.makedirs(OUT, exist_ok=True)
    cands = []
    for name, orig, what, wire in PHASE2:
        src_png = os.path.join(REV, f'alan/phase2/{name}.png')
        if not os.path.exists(src_png): continue
        key = 'alan_' + name
        Image.open(src_png).convert('RGBA').save(os.path.join(OUT, key + '.webp'), lossless=True)
        meta = json.load(open(os.path.join(REV, f'alan/phase2/{name}_meta.json')))
        meta = {k: (float(v) if isinstance(v, (int, float)) else v) for k, v in meta.items() if k in ('w', 'hh', 'h', 'ax', 'fy', 'top', 'facesLeft')}
        cands.append({'id': key, 'char': 'alan', 'phase': 2, 'kind': 'inbetween', 'what': what,
                      'src': f'art/review/candidates/{key}.webp', 'originals': [SP(o) for o in orig], 'meta': meta,
                      'wire': json.loads(json.dumps(wire).replace('"@"', json.dumps(key)).replace('"#ib_', '"alan_ib_'))})
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
