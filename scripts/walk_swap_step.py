# The far-leg step of Alan's walk, roughed out from alan_walkA's rig parts (art/rigs/alan/side/, scripts/rig_cut.py):
# every painted contact frame had his NEAR leg in front, so each step was taken with the same leg (a skip), and
# Gemini would not swap the legs from a painting alone. This swaps them by hand: the near leg swung back about the
# hip and drawn on top, the forward leg darkened behind it as the far leg, the near arm swung forward over the
# jacket. Gemini then repaints the rough (art/review/alan/walk2/far_contact_rough.png -> contact_far_low.png).
#   python3 scripts/walk_swap_step.py [leg_deg arm_deg out.png]     (default 39 -45)
import json, math, sys, numpy as np
from PIL import Image, ImageEnhance
import os
R=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'art')+'/rigs/alan/side/'; r=json.load(open(R+'rig.json')); W,H=r['size']; B=r['bones']
def layer(k):
    c=Image.new('RGBA',(W,H)); p=r['parts'][k]; c.paste(Image.open(R+k+'.png'),(p['x'],p['y'])); return c
def shade(im,f):
    a=np.asarray(im).astype(np.float32); a[...,:3]*=f; return Image.fromarray(np.clip(a,0,255).astype(np.uint8))
def rot(im,deg,c): return im.rotate(deg,resample=Image.BICUBIC,center=tuple(c))
leg_a=float(sys.argv[1]) if len(sys.argv)>1 else 39; arm_a=float(sys.argv[2]) if len(sys.argv)>2 else -45
hip=B['near_leg']['hip']; sh=B['near_arm']['shoulder']
near_leg=layer('near_leg'); torso=layer('torso'); near_arm=layer('near_arm')
out=Image.new('RGBA',(W,H))
out.alpha_composite(shade(rot(near_arm,-arm_a*0.6,sh),0.72))     # far arm: swung back, behind him
out.alpha_composite(shade(near_leg,0.78))                          # far leg: forward, behind
out.alpha_composite(rot(near_leg,-leg_a,hip))                      # near leg: back, on top
out.alpha_composite(torso)
out.alpha_composite(rot(near_arm,-arm_a,sh))                       # near arm: forward, on top
out.save(sys.argv[3] if len(sys.argv)>3 else 'rough.png')
# where the rotated ankle lands
t=math.radians(leg_a); ax,ay=B['near_leg']['ankle']; dx,dy=ax-hip[0],ay-hip[1]
print('ankle', round(hip[0]+dx*math.cos(t)-dy*math.sin(t)), round(hip[1]+dx*math.sin(t)+dy*math.cos(t)))
