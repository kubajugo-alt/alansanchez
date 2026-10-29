exec(open('lineup.py').read().split('H=860')[0].replace("OUT=sys.argv[1]","OUT=''"))
R='/home/user/alansanchez/sequel/'
im=Image.open(R+'art/sprites/alanv_front_k.webp').convert('RGBA'); a=np.asarray(im); ys,xs=np.where(a[...,3]>40); al=im.crop((xs.min(),ys.min(),xs.max()+1,ys.max()+1))
L=[(al,1.0)]+[(front(R+'art/designs/'+f+'.png'),k) for f,k in [('vasco_v9',1),('baute_v5_front',1),('rafa_v3',1),('yeray_v7',1),('carmen_v2',.92),('nieves_v2',.92)]]
H=1000; ims=[i.resize((round(i.width*round(H*k)/i.height),round(H*k)),Image.LANCZOS) for i,k in L]
gap=40; W=sum(i.width for i in ims)+gap*(len(ims)+1)
s=Image.new('RGB',(W,H+80),(0,160,80)); x=gap
for i in ims: s.paste(i,(x,H+40-i.height),i); x+=i.width+gap
s.save('cast_style_ref.png'); print(s.size)
