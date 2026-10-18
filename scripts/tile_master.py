# One bell tile in every painting: the blue-bell azulejo from still_tr1_list, flattened, is projected onto the tile's
# face in each painting (corners measured by hand, top-left first), relit with that painting's own light on the tile.
#   python3 scripts/tile_master.py      (reads and writes art/review/stills/*.png)
import cv2, numpy as np
from PIL import Image

D = 'art/review/stills/'
MASTER = ('still_tr1_list', [(819, 397.5), (1000, 367.5), (1046, 545), (855, 556)])
TILES = {
    'still_maria_tile': [(360.7, 484.7), (463.3, 460.3), (521.7, 540.3), (416.7, 570.7)],
    'still_maria_list': [(273, 508.7), (364.7, 478.7), (426.3, 550.3), (326.3, 583.7)],
    'still_maria_dawn': [(591.3, 607), (705.3, 587), (767, 649.3), (637, 676)],
    'still_maria_water': [(397.3, 250.7), (451.7, 239), (488, 280.7), (430.7, 300.7)],
    'still_newspaper': [(547.3, 496.7), (625.7, 536.7), (577.3, 596.7), (490.7, 543.3)],
    'still_tr1_maria': [(413.3, 459.3), (501.7, 444.3), (558.3, 531), (466.7, 552.7)],
    'close_porthole': [(682.3, 710.7), (759, 682.3), (815.7, 719), (734, 757.3)],
}
N = 512
sq = np.float32([(0, 0), (N, 0), (N, N), (0, N)])
src = np.asarray(Image.open(D + MASTER[0] + '.png').convert('RGB')).astype(np.float32)
master = cv2.warpPerspective(src, cv2.getPerspectiveTransform(np.float32(MASTER[1]), sq), (N, N), flags=cv2.INTER_CUBIC)
# its own light taken out (flat, evenly lit design), so each painting can put its light back on
ml = cv2.GaussianBlur(master.mean(-1), (0, 0), N / 6)
master = np.clip(master / (ml / ml.mean())[..., None], 0, 255)
Image.fromarray(master.astype(np.uint8)).save(D + '_master_tile.png')

for name, quad in TILES.items():
    im = np.asarray(Image.open(D + name + '.png').convert('RGB')).astype(np.float32)
    H, W = im.shape[:2]
    M = cv2.getPerspectiveTransform(sq, np.float32(quad))
    warped = cv2.warpPerspective(master, M, (W, H), flags=cv2.INTER_AREA if cv2.contourArea(np.float32(quad)) < N * N / 4 else cv2.INTER_CUBIC)
    mask = cv2.warpPerspective(np.ones((N, N), np.float32), M, (W, H))
    inner = cv2.erode((mask > 0.5).astype(np.uint8), np.ones((3, 3), np.uint8))
    # this painting's light on the tile: the tile area's own brightness, smoothed, against the master's
    side = max(4.0, np.sqrt(cv2.contourArea(np.float32(quad))) / 5)
    num = cv2.GaussianBlur(im.mean(-1) * inner, (0, 0), side); den = cv2.GaussianBlur(inner.astype(np.float32), (0, 0), side) + 1e-3
    wnum = cv2.GaussianBlur(warped.mean(-1) * inner, (0, 0), side)
    light = (num / den) / np.maximum(wnum / den, 1)
    tint = im[inner > 0].mean(0) / np.maximum(warped[inner > 0].mean(0), 1)   # the painting's colour cast (lamp, moon)
    tint = tint / tint.mean()
    lit = np.clip(warped * light[..., None] * tint, 0, 255)
    a = cv2.GaussianBlur(mask, (0, 0), 0.7)[..., None]
    out = lit * a + im * (1 - a)
    Image.fromarray(out.astype(np.uint8)).save(D + name + '.png')
    print(name, 'tile', round(np.sqrt(cv2.contourArea(np.float32(quad)))), 'px across')
