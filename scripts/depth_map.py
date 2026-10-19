# A depth map for a room painting (parallax): Depth Anything V2 small (ONNX, run locally; the model file is passed in,
# it isn't kept in the repo). Writes a greyscale PNG the size of the painting: white = near, black = far.
#   python3 scripts/depth_map.py <model.onnx> art/bg/se_cloister.jpg art/bg/se_cloister_depth.png
import sys, numpy as np, onnxruntime as ort
from PIL import Image, ImageFilter
model, src, out = sys.argv[1:4]
im = Image.open(src).convert('RGB'); W, H = im.size
S = 518  # the model's input: multiples of 14
x = np.asarray(im.resize((S * W // H // 14 * 14, S), Image.BICUBIC)).astype(np.float32) / 255
x = (x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
x = x.transpose(2, 0, 1)[None].astype(np.float32)
sess = ort.InferenceSession(model, providers=['CPUExecutionProvider'])
d = sess.run(None, {sess.get_inputs()[0].name: x})[0][0]
d = (d - d.min()) / (d.max() - d.min() + 1e-6)          # relative inverse depth: larger = nearer
img = Image.fromarray((d * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(2))
img.save(out); print('saved', out, img.size)
