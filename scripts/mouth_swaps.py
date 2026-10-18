# Lower-face swaps for lip-sync (Phase 4 prototype, alan_side): aligns each Gemini mouth painting to the head crop,
# keeps his chin from jutting forward, and swaps only the mouth and jaw (from TOP down, LEFT forward) back into the sprite.
#   python3 scripts/mouth_swaps.py 315 245
import os,sys,numpy as np,cv2
sys.path.insert(0,'scripts'); TOP,LEFT=int(sys.argv[1]),int(sys.argv[2]); sys.argv=['x']
import gen_image as g
from PIL import Image
P='art/review/alan/phase4/'; L=os.environ.get('PREVIEW_DIR', 'art/review/alan/phase4/preview/')
base_im=Image.open(P+'side_head.png').convert('RGBA'); base=np.asarray(base_im).astype(np.float32)
keyed=g.on_key(base_im); kw,kh=keyed.size; pad=((kw-base_im.width)//2,(kh-base_im.height)//2)
Bg=cv2.cvtColor((base[...,:3]/255).astype(np.float32),cv2.COLOR_RGB2GRAY)
H,W=base.shape[:2]; yy,xx=np.mgrid[0:H,0:W]
amask=np.zeros((H,W),np.uint8); amask[:TOP]=255; amask[base[...,3]<128]=0
spr=Image.open('art/sprites/alan_side.webp').convert('RGBA')
band=(yy>TOP-30)&(yy<TOP)&(xx>LEFT)&(base[...,3]>200)
def edge(a,y): r=np.where(a[y,:,3]>128)[0]; return r.max() if len(r) else -1
def chin(a): return max([y for y in range(380,540) if (a[y,300:400,3]>128).any()] or [0])
bchin=chin(base)
os.makedirs(L, exist_ok=True)
for s in 'ABCDEFGH':
    im=Image.open(P+f'mouth_{s}.png').convert('RGBA').resize((kw,kh),Image.LANCZOS).crop((pad[0],pad[1],pad[0]+W,pad[1]+H))
    Ag=cv2.cvtColor((np.asarray(im.convert('RGB'))/255).astype(np.float32),cv2.COLOR_RGB2GRAY)
    warp=np.eye(2,3,dtype=np.float32)
    cc,warp=cv2.findTransformECC(Bg,Ag,warp,cv2.MOTION_AFFINE,(cv2.TERM_CRITERIA_EPS|cv2.TERM_CRITERIA_COUNT,300,1e-6),amask,5)
    a=cv2.warpAffine(np.asarray(im),warp,(W,H),flags=cv2.INTER_LINEAR+cv2.WARP_INVERSE_MAP).astype(np.float32)
    a[...,:3]=np.clip(a[...,:3]+(base[band,:3].mean(0)-a[band,:3].mean(0)),0,255)
    diffs=[edge(a,y)-edge(base,y) for y in range(400,min(chin(a),bchin)-4) if edge(a,y)>0 and edge(base,y)>0]
    dx=max(0.0,float(np.median(diffs))) if diffs else 0.0
    if dx>2:
        ramp=np.clip((yy-370)/50,0,1)*dx
        a=cv2.remap(a,(xx+ramp).astype(np.float32),yy.astype(np.float32),cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT,borderValue=0)
    c=chin(a); bot=max(c,bchin)+8
    R=np.clip((yy-TOP)/22,0,1)*np.clip((xx-LEFT)/35,0,1)*np.clip((bot+10-yy)/10,0,1)
    R*=np.where(yy>440,np.clip((xx-290)/30,0,1),1)
    r=R[...,None]; comp=a*r+base*(1-r)
    under=(yy>c)&(yy<=bot+10)&(xx>300)&(a[...,3]<60)&(R>0.5); comp[under,3]=0
    Image.fromarray(comp.astype(np.uint8),'RGBA').resize((80,90),Image.LANCZOS).save(P+f'head_side_{s}.png')
    arr=np.asarray(spr).copy(); arr[30:120,70:150]=np.asarray(Image.fromarray(comp.astype(np.uint8),'RGBA').resize((80,90),Image.LANCZOS)); s2=Image.fromarray(arr,'RGBA')
    c2=s2.crop((60,10,175,140)).resize((345,390),Image.LANCZOS); bg=Image.new('RGBA',c2.size,(38,43,55,255)); bg.alpha_composite(c2); bg.convert('RGB').save(L+f'face_{s}.webp',quality=90)
Image.open(L+'face_A.webp').save(L+'face_X.webp',quality=90)
