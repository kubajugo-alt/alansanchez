import sys; sys.path.insert(0,'/home/user/alansanchez/sequel/scripts')
exec(open('lineup.py').read().split('H=860')[0].replace("OUT=sys.argv[1]","OUT=''"))
import head_scale
from PIL import ImageDraw, ImageFont
R='/home/user/alansanchez/sequel/'
L=[('Alan',None),('Vasco','vasco_v9'),('Baute','baute_v5_front'),('Rafa','rafa_v3'),('Yeray','yeray_v7'),('Carmen','carmen_v2'),('Chano','chano_v4'),('Guard','guard_v2'),('Nieves','nieves_v2'),('Clerk','clerk_v2'),('Pino','pino_v2'),('Lolo','lolo_v2')]
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',22)
tiles=[]
for n,f in L:
    if f is None:
        im=Image.open(R+'art/sprites/alanv_front_k.webp').convert('RGBA'); a=np.asarray(im); ys,xs=np.where(a[...,3]>40); im=im.crop((xs.min(),ys.min(),xs.max()+1,ys.max()+1))
    else: im=front(R+'art/designs/'+f+'.png')
    im=im.resize((round(im.width*860/im.height),860),Image.LANCZOS)
    b=head_scale.face(im)
    print(f'{n:7s} face h/body h = {b[3]/860:.3f}  body/face = {860/b[3]:.1f}')
    # tile: face box scaled to 220px tall, with margin
    x,y,w,h=b[:4]; c=im.crop((int(x-w*.6),int(y-h*.7),int(x+w*1.6),int(y+h*1.5))); s=360/c.height
    t=Image.new('RGB',(round(c.width*s),400),(232,228,222)); t.paste(c.resize((round(c.width*s),360),Image.LANCZOS),(0,0),c.resize((round(c.width*s),360),Image.LANCZOS))
    ImageDraw.Draw(t).text((8,368),n,fill=(30,30,30),font=font); tiles.append(t)
tw=max(t.width for t in tiles); sheet=Image.new('RGB',(tw*6+70,820),(232,228,222))
for i,t in enumerate(tiles): sheet.paste(t,(10+(i%6)*(tw+10),10+(i//6)*410))
sheet.save('heads12.jpg',quality=90)
