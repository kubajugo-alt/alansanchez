#!/usr/bin/env python3
"""Sharper room paintings (the user, 2026-10-30: "for game 1 we did an image quality fix, making sure that the
backgrounds and sprites are sharp. I think this game needs this too"). The engine already draws at the screen's own
resolution (engine/base.js render scale, Game I's entry 79); what's soft is the paintings themselves, stored at
1280x720 and stretched 1.5x on a 1080p screen, 2x on a Retina one.

Real-ESRGAN x2 (RRDBNet; weights RealESRGAN_x2.pth from https://huggingface.co/ai-forever/Real-ESRGAN, passed in, not
kept in the repo; CPU torch), run in overlapping tiles. It only sharpens what is painted: Higgsfield's upscaler was
tried first and repainted details (the picture over the bed in 404 became a different picture), so it is not used.

  python3 sequel/scripts/upscale_bg.py <RealESRGAN_x2.pth> <in.jpg> <out.jpg>
"""
import sys
import numpy as np, torch, torch.nn as nn, torch.nn.functional as Fn
from PIL import Image


class RDB(nn.Module):
    def __init__(s, nf=64, gc=32):
        super().__init__()
        s.conv1 = nn.Conv2d(nf, gc, 3, 1, 1); s.conv2 = nn.Conv2d(nf + gc, gc, 3, 1, 1); s.conv3 = nn.Conv2d(nf + 2 * gc, gc, 3, 1, 1)
        s.conv4 = nn.Conv2d(nf + 3 * gc, gc, 3, 1, 1); s.conv5 = nn.Conv2d(nf + 4 * gc, nf, 3, 1, 1); s.l = nn.LeakyReLU(0.2, True)

    def forward(s, x):
        x1 = s.l(s.conv1(x)); x2 = s.l(s.conv2(torch.cat((x, x1), 1))); x3 = s.l(s.conv3(torch.cat((x, x1, x2), 1)))
        x4 = s.l(s.conv4(torch.cat((x, x1, x2, x3), 1))); x5 = s.conv5(torch.cat((x, x1, x2, x3, x4), 1))
        return x5 * 0.2 + x


class RRDB(nn.Module):
    def __init__(s, nf=64, gc=32):
        super().__init__(); s.rdb1 = RDB(nf, gc); s.rdb2 = RDB(nf, gc); s.rdb3 = RDB(nf, gc)

    def forward(s, x): return s.rdb3(s.rdb2(s.rdb1(x))) * 0.2 + x


class RRDBNet(nn.Module):   # Real-ESRGAN's x2: the input is pixel-unshuffled by 2 (12 channels), then upsampled x4
    def __init__(s, nf=64, nb=23, gc=32):
        super().__init__()
        s.conv_first = nn.Conv2d(12, nf, 3, 1, 1); s.body = nn.Sequential(*[RRDB(nf, gc) for _ in range(nb)])
        s.conv_body = nn.Conv2d(nf, nf, 3, 1, 1); s.conv_up1 = nn.Conv2d(nf, nf, 3, 1, 1); s.conv_up2 = nn.Conv2d(nf, nf, 3, 1, 1)
        s.conv_hr = nn.Conv2d(nf, nf, 3, 1, 1); s.conv_last = nn.Conv2d(nf, 3, 3, 1, 1); s.l = nn.LeakyReLU(0.2, True)

    def forward(s, x):
        f = s.conv_first(Fn.pixel_unshuffle(x, 2)); f = f + s.conv_body(s.body(f))
        f = s.l(s.conv_up1(Fn.interpolate(f, scale_factor=2, mode='nearest')))
        f = s.l(s.conv_up2(Fn.interpolate(f, scale_factor=2, mode='nearest')))
        return s.conv_last(s.l(s.conv_hr(f)))


def load(path):
    net = RRDBNet(); sd = torch.load(path, map_location='cpu')
    sd = sd.get('params_ema', sd.get('params', sd))
    net.load_state_dict(sd, strict=True); net.eval(); return net


def upscale(net, im, tile=256, pad=16):
    x = torch.from_numpy(np.asarray(im.convert('RGB')).astype(np.float32) / 255).permute(2, 0, 1)[None]
    _, _, H, W = x.shape; out = torch.zeros(1, 3, H * 2, W * 2)
    with torch.no_grad():
        for y in range(0, H, tile):
            for x0 in range(0, W, tile):
                ya, yb, xa, xb = max(0, y - pad), min(H, y + tile + pad), max(0, x0 - pad), min(W, x0 + tile + pad)
                o = net(x[:, :, ya:yb, xa:xb])
                ty, tx = (y - ya) * 2, (x0 - xa) * 2; th, tw = (min(H, y + tile) - y) * 2, (min(W, x0 + tile) - x0) * 2
                out[:, :, y * 2:y * 2 + th, x0 * 2:x0 * 2 + tw] = o[:, :, ty:ty + th, tx:tx + tw]
    return Image.fromarray((out[0].clamp(0, 1).permute(1, 2, 0).numpy() * 255 + 0.5).astype(np.uint8))


if __name__ == '__main__':
    torch.set_num_threads(8)
    w, src, dst = sys.argv[1:4]
    upscale(load(w), Image.open(src)).save(dst, quality=90, subsampling=0)
    print('saved', dst)
