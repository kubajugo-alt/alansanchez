# Paints the hotel brand names out of Baute's south-coast map (keeps "Hotel", the bed icons, the red circles, the hand).
import sys, cv2, numpy as np
src, dst = sys.argv[1], sys.argv[2]
im = cv2.imread(src)
# the name lines inside each red circle (x0, y0, x1, y1) on the 1280x956 original
R = [(531, 520, 617, 537), (746, 463, 814, 480), (893, 441, 958, 469), (230, 576, 295, 605), (244, 669, 325, 697), (1151, 301, 1210, 326)]
mask = np.zeros(im.shape[:2], np.uint8)
for x0, y0, x1, y1 in R:
    roi = im[y0:y1, x0:x1].astype(int)
    b, g, r = roi[..., 0], roi[..., 1], roi[..., 2]
    lum = (r * 299 + g * 587 + b * 114) // 1000
    text = (lum < 175) & (b >= r - 10)
    mask[y0:y1, x0:x1][text] = 255
mask = cv2.dilate(mask, np.ones((3, 3), np.uint8), iterations=2)
out = cv2.inpaint(im, mask, 4, cv2.INPAINT_TELEA)
# soften what's left of the print in those boxes, feathered
soft = cv2.GaussianBlur(out, (0, 0), 2.2)
w = np.zeros(im.shape[:2], np.float32)
for x0, y0, x1, y1 in R: w[y0 - 1:y1 + 1, x0 - 1:x1 + 1] = 1
w = cv2.GaussianBlur(w, (0, 0), 1.5)[..., None]
out = (out * (1 - w) + soft * w).astype(np.uint8)
cv2.imwrite(dst, out)
