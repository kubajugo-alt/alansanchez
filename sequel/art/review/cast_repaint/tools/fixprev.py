import sys; sys.path.insert(0,'/home/user/alansanchez/sequel/scripts')
exec(open('lineup.py').read().split('H=860')[0].replace("OUT=sys.argv[1]","OUT=''"))
import head_scale
from PIL import ImageDraw, ImageFont
R='/home/user/alansanchez/sequel/'; TARGET=0.113
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',28)
def fig(f):
    if f is None:
        im=Image.open(R+'art/sprites/alanv_front_k.webp').convert('RGBA'); a=np.asarray(im); ys,xs=np.where(a[...,3]>40); return im.crop((xs.min(),ys.min(),xs.max()+1,ys.max()+1))
    return front(R+'art/designs/'+f+'.png')
def trim(im):
    a=np.asarray(im); ys,xs=np.where(a[...,3]>20); return im.crop((xs.min(),ys.min(),xs.max()+1,ys.max()+1))
L=[('Alan',None,1,0),('Vasco','vasco_v9',1,0),('Baute','baute_v5_front',1,0),('Rafa','rafa_v3',1,0),('Yeray','yeray_v7',1,0),('Carmen','carmen_v2',.92,0),
   ('Chano','chano_v4',.92,1),('Guard','guard_v2',.92,1),('Nieves','nieves_v2',.92,1),('Clerk','clerk_v2',.92,1),('Pino','pino_v2',.92,1),('Lolo','lolo_v2',.92,1)]
H=860; out=[]
for n,f,k,new in L:
    im=fig(f); im=im.resize((round(im.width*1000/im.height),1000),Image.LANCZOS)
    if new:
        b=head_scale.face(im); r=b[3]/1000
        if r>TARGET*1.03:
            kk=TARGET/r; im=trim(head_scale.grow(im,b,kk,pad=0)); print(n,'head x',round(kk,3))
    h=round(H*k); out.append((n,im.resize((round(im.width*h/im.height),h),Image.LANCZOS),new))
gap=30; W=sum(i.width for _,i,_ in out)+gap*(len(out)+1)
s=Image.new('RGB',(W,H+90),(232,228,222)); d=ImageDraw.Draw(s); x=gap
for n,im,new in out:
    s.paste(im,(x,H+20-im.height),im); d.text((x+im.width//2-len(n)*8,H+40),n,fill=(120,30,30) if new else (30,30,30),font=font); x+=im.width+gap
d.line((0,H+20,W,H+20),fill=(150,150,150),width=2); s.save('lineup12_headfix.jpg',quality=90)
