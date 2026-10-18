# Lip-sync swaps for alan_side (Phase 4 prototype), the cut-out way: his own painted lower jaw, cut along the jawline,
# swings down about the hinge below his ear (by the angle that drops the chin as far as Gemini's painting of that
# shape does); Gemini's lips and open mouth go on top; the old chin is removed where the swung one no longer covers it.
#   python3 scripts/mouth_swaps.py   (PREVIEW_DIR= for the preview faces; default art/review/alan/phase4/preview/)
import os,sys,numpy as np,cv2
sys.path.insert(0,'scripts'); sys.argv=['x']
import gen_image as g
from PIL import Image, ImageDraw
P='art/review/alan/phase4/'; L=os.environ.get('PREVIEW_DIR','art/review/alan/phase4/preview/'); os.makedirs(L, exist_ok=True)
base_im=Image.open(P+'side_head.png').convert('RGBA'); base=np.asarray(base_im).astype(np.float32)
H,W=base.shape[:2]; yy,xx=np.mgrid[0:H,0:W]
keyed=g.on_key(base_im); kw,kh=keyed.size; pad=((kw-W)//2,(kh-H)//2)
Bg=cv2.cvtColor((base[...,:3]/255).astype(np.float32),cv2.COLOR_RGB2GRAY)
amask=np.zeros((H,W),np.uint8); amask[:275]=255; amask[base[...,3]<128]=0
HX,HY=70,330                                   # the jaw hinge, below the ear
# his lower jaw: below the line under the lower lip back to the hinge, above the jawline (ear to chin)
jaw=Image.new('L',(W,H),0)
ImageDraw.Draw(jaw).polygon([(HX,HY),(250,338),(300,352),(380,352),(480,352),(480,500),(345,486),(250,474),(150,436),(40,368)],fill=255)
jaw=cv2.GaussianBlur(np.asarray(jaw).astype(np.float32)/255,(0,0),6)
jaw*=np.clip((xx-HX)/60,0,1)                    # soft at the hinge, so the cheek doesn't tear
def chin(a): return max([y for y in range(380,540) if (a[y,300:400,3]>128).any()] or [0])
bchin=chin(base)
def rot(img,deg):
    M=cv2.getRotationMatrix2D((HX,HY),-deg,1.0)   # clockwise on screen: the chin swings down and back
    return cv2.warpAffine(img,M,(W,H),flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT,borderValue=0)
def drop(deg):
    M=cv2.getRotationMatrix2D((HX,HY),-deg,1.0); p=M@np.array([340,bchin,1.0]); return p[1]-bchin
spr=Image.open('art/sprites/alan_side.webp').convert('RGBA')
band=(yy>250)&(yy<275)&(xx>230)&(base[...,3]>200)
# his own mouth painted out first (lips and smile line filled from the skin around them), so neither the swung jaw
# nor the new mouth's soft edge shows the old lips underneath
lips=np.zeros((H,W),np.uint8)
cv2.ellipse(lips,(318,327),(66,24),4,0,360,255,-1)
lips[base[...,3]<200]=0
clean=base.copy()
clean[...,:3]=cv2.inpaint(base[...,:3].astype(np.uint8),lips,9,cv2.INPAINT_TELEA).astype(np.float32)
# ...and the old lips' front outline (the pale rim of his profile at the mouth), so the new mouth draws its own
for y in range(298,368):
    r=np.where(clean[y,:,3]>40)[0]
    if len(r): clean[y,r.max()-12:,3]=0
for s in 'ABCDEFGH':
    im=Image.open(P+f'mouth_{s}.png').convert('RGBA').resize((kw,kh),Image.LANCZOS).crop((pad[0],pad[1],pad[0]+W,pad[1]+H))
    Ag=cv2.cvtColor((np.asarray(im.convert('RGB'))/255).astype(np.float32),cv2.COLOR_RGB2GRAY)
    warp=np.eye(2,3,dtype=np.float32)
    _,warp=cv2.findTransformECC(Bg,Ag,warp,cv2.MOTION_AFFINE,(cv2.TERM_CRITERIA_EPS|cv2.TERM_CRITERIA_COUNT,300,1e-6),amask,5)
    a=cv2.warpAffine(np.asarray(im),warp,(W,H),flags=cv2.INTER_LINEAR+cv2.WARP_INVERSE_MAP).astype(np.float32)
    a[...,:3]=np.clip(a[...,:3]+(base[band,:3].mean(0)-a[band,:3].mean(0)),0,255)
    want=max(chin(a)-bchin,0)
    if s=='C': want=max(want,12)
    if s in 'ABG': want=min(want,4)
    deg=0.0
    while drop(deg)<want and deg<14: deg+=0.25
    # 1. his own jaw, swung down
    jr=rot(np.dstack([clean[...,:3],clean[...,3]*jaw]),deg)
    comp=clean.copy()
    # the old chin goes where the swung chin no longer covers it (in front of the throat), so there's one outline
    front=(jaw>0.3)&(xx>300)&(yy>360); comp[front,3]=0
    al=jr[...,3:4]/255; comp[...,:3]=jr[...,:3]*al+comp[...,:3]*(1-al); comp[...,3]=np.maximum(comp[...,3],jr[...,3])
    # 2. Gemini's lips and open mouth, from under the nose to the top of the swung jaw
    M=rot(np.dstack([np.zeros((H,W,3)),(jaw>0.02).astype(np.float32)*255]),deg)[...,3]/255  # where the jaw now is
    lip_bot=352+drop(deg)*0.85
    # the mouth as Gemini painted it: lips, teeth and the dark opening, found where its painting differs from his face
    # (compared with his face with the jaw swung), closed up, grown a little and feathered
    ref=comp[...,:3]
    diff=np.abs(a[...,:3]-ref).sum(-1)
    zone=(yy>292)&(yy<chin(a)-12)&(xx>235)&(a[...,3]>128)
    mk=((diff>70)&zone).astype(np.uint8)
    mk=cv2.morphologyEx(mk,cv2.MORPH_CLOSE,np.ones((15,15),np.uint8))
    n,lab,st,_=cv2.connectedComponentsWithStats(mk,8)
    if n>1: mk=(lab==1+np.argmax(st[1:,cv2.CC_STAT_AREA])).astype(np.uint8)   # the mouth, not stray stubble
    mk=cv2.dilate(mk,np.ones((13,13),np.uint8))
    mz=cv2.GaussianBlur(mk.astype(np.float32),(0,0),5)*np.clip((yy-286)/12,0,1)
    mz=mz*(a[...,3]/255)                        # only where Gemini painted his face (never its background)
    m=mz[...,None]; comp[...,:3]=a[...,:3]*m+comp[...,:3]*(1-m)
    comp[...,3]=np.where(mz>0.5,np.maximum(comp[...,3],a[...,3]),comp[...,3])
    # between the lips, in profile: the dark inside of the mouth, up to the front of the lips (never background)
    dark=a[...,:3][(a[...,3]>200)&(mz>0.3)&(a[...,:3].sum(-1)<180)]
    ink=dark.mean(0) if len(dark) else np.array([60,25,20.])
    rows=range(300,int(lip_bot)+10)
    fronts=[(y,np.where(comp[y,:,3]>128)[0].max()) for y in rows if (comp[y,:,3]>128).any()]
    if fronts:
        lim={}
        for i,(y,f) in enumerate(fronts):  # the lips' front edge: the furthest-forward lip above and below this row
            above=[f2 for y2,f2 in fronts if y-25<=y2<y]; below=[f2 for y2,f2 in fronts if y<y2<=y+25]
            lim[y]=min(max(above) if above else f, max(below) if below else f)
        for y,f in fronts:
            gap=(xx[y]>f)&(xx[y]<=lim[y]-2)
            comp[y,gap,:3]=ink; comp[y,gap,3]=255
    Image.fromarray(comp.astype(np.uint8),'RGBA').resize((80,90),Image.LANCZOS).save(P+f'head_side_{s}.png')
    arr=np.asarray(spr).copy(); arr[30:120,70:150]=np.asarray(Image.fromarray(comp.astype(np.uint8),'RGBA').resize((80,90),Image.LANCZOS)); s2=Image.fromarray(arr,'RGBA')
    c2=s2.crop((60,10,175,140)).resize((345,390),Image.LANCZOS); bgc=Image.new('RGBA',c2.size,(38,43,55,255)); bgc.alpha_composite(c2); bgc.convert('RGB').save(L+f'face_{s}.webp',quality=90)
    print(s,'jaw opens',deg,'deg, chin drop',round(drop(deg)/6,1),'px at sprite size')
Image.open(L+'face_A.webp').save(L+'face_X.webp',quality=90)
