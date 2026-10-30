import numpy as np, sys, os
from PIL import Image, ImageFilter, ImageDraw, ImageFont
from scipy import ndimage
R='/home/user/alansanchez/sequel/'; OUT=sys.argv[1]
def key(p):
    a=np.asarray(Image.open(p).convert('RGBA')).astype(int)
    r,g,b=a[...,0],a[...,1],a[...,2]
    al=np.where((g>r+25)&(g>b+15),0,255).astype(np.uint8)
    al=np.asarray(Image.fromarray(al).filter(ImageFilter.MinFilter(3)))
    a=a.astype(np.uint8); a[...,3]=al; return a
def figures(a):
    m=a[...,3]>0; lab,n=ndimage.label(ndimage.binary_dilation(m,iterations=12))
    sizes=ndimage.sum(m,lab,range(1,n+1)); keep=[i+1 for i,s in enumerate(sizes) if s>0.15*max(sizes)]
    out=[]
    for k in keep:
        ys,xs=np.where((lab==k)&m); out.append((xs.min(),ys.min(),xs.max()+1,ys.max()+1))
    return sorted(out)
def front(p, which=-1):
    a=key(p); f=figures(a)[which]; return Image.fromarray(a).crop(f)
H=860
cast=[('Alan',Image.open(R+'art/sprites/alanv_front_k.webp').convert('RGBA'),1.0,'ok')]
cast+= [(n,front(R+'art/designs/'+f+'.png'),k,'ok') for n,f,k in [('Vasco','vasco_v9',1.0),('Baute','baute_v5_front',1.0),('Rafa','rafa_v3',1.0),('Yeray','yeray_v7',1.0),('Carmen','carmen_v2',.92)]]
cast+= [(n,front(R+'art/designs/'+f+'.png'),.92,'new') for n,f in [('Chano','chano_v4'),('Guard','guard_v2'),('Nieves','nieves_v2'),('Clerk','clerk_v2'),('Pino','pino_v2'),('Lolo','lolo_v2')]]
# trim Alan's sprite to its figure
a=np.asarray(cast[0][1]); ys,xs=np.where(a[...,3]>40); cast[0]=(cast[0][0],cast[0][1].crop((xs.min(),ys.min(),xs.max()+1,ys.max()+1)),1.0,'ok')
ims=[]
for n,im,k,t in cast:
    h=round(H*k); ims.append((n,im.resize((round(im.width*h/im.height),h),Image.LANCZOS),t))
gap=30; W=sum(i.width for _,i,_ in ims)+gap*(len(ims)+1)
sheet=Image.new('RGB',(W,H+90),(232,228,222)); d=ImageDraw.Draw(sheet)
try: font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',28)
except: font=None
x=gap
for n,im,t in ims:
    sheet.paste(im,(x,H+20-im.height),im)
    d.text((x+im.width//2-len(n)*8,H+40),n+(' (new)' if t=='new' else ''),fill=(120,30,30) if t=='new' else (30,30,30),font=font)
    x+=im.width+gap
d.line((0,H+20,W,H+20),fill=(150,150,150),width=2)
sheet.save(OUT,quality=90); print(sheet.size)
# head close-ups at the same head scale: top 22% of each figure, normalised to 300px tall
heads=[]
for n,im,t in ims:
    c=im.crop((0,0,im.width,round(im.height*0.2))); s=300/c.height
    heads.append((n,c.resize((round(c.width*s),300),Image.LANCZOS)))
W2=sum(h.width for _,h in heads)+20*(len(heads)+1); hs=Image.new('RGB',(W2,350),(232,228,222)); d=ImageDraw.Draw(hs); x=20
for n,h in heads: hs.paste(h,(x,10),h); d.text((x,315),n,fill=(30,30,30),font=font); x+=h.width+20
hs.save(OUT.replace('.jpg','_heads.jpg'),quality=90); print(hs.size)
