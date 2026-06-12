"""Generate House of Clarence placeholder imagery — abstract material studies
in the brand palette. Temporary stand-ins until client photography arrives."""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = "/Users/rishisharath/Desktop/HOC/house-of-clarence/assets/"

def hexc(h):
    return np.array([int(h[i:i+2], 16) for i in (1, 3, 5)], float)

INK = hexc("#1c1c18"); CANVAS = hexc("#fcf9f2"); PAPER = hexc("#F6F4EF")
SAGE = hexc("#3B4138"); SAGE_SOFT = hexc("#5A6056"); BRASS = hexc("#9A7B4F")
BRASS_DEEP = hexc("#7C6240"); STONE = hexc("#B9B3A7"); STONE_LINE = hexc("#D8D3C9")

def smooth_noise(w, h, gx, gy, seed):
    rng = np.random.default_rng(seed)
    g = (rng.random((gy, gx)) * 255).astype(np.uint8)
    img = Image.fromarray(g).resize((w, h), Image.BICUBIC)
    return np.asarray(img, float) / 255.0

def ramp(t, colors):
    n = len(colors) - 1
    t = np.clip(t, 0, 1) * n
    i = np.minimum(t.astype(int), n - 1)
    f = t - i
    a = np.stack(colors)
    return a[i] + (a[i + 1] - a[i]) * f[..., None]

def finish(arr, path, grain_amt=3.5, vig=0.10, seed=99, q=88):
    h, w = arr.shape[:2]
    y, x = np.mgrid[0:h, 0:w]
    d = np.sqrt(((x - w / 2) / (w / 2)) ** 2 + ((y - h / 2) / (h / 2)) ** 2)
    arr = arr * (1 - vig * np.clip(d - 0.45, 0, 1)[..., None] ** 2)
    rng = np.random.default_rng(seed)
    arr = arr + rng.normal(0, grain_amt, arr.shape)
    Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).save(
        OUT + path, quality=q, subsampling=1)
    print("wrote", path)

def veins(w, h, n, seed, width=3, blur=2.5, drift=0.25):
    layer = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(layer)
    rng = np.random.default_rng(seed)
    for _ in range(n):
        x, y = rng.uniform(0, w), -10.0
        ang = rng.uniform(np.pi * 0.38, np.pi * 0.62)
        pts = [(x, y)]
        while -20 <= x <= w + 20 and y < h + 20:
            ang += rng.normal(0, drift)
            step = rng.uniform(10, 26)
            x += np.cos(ang) * step * 0.7
            y += abs(np.sin(ang)) * step
            pts.append((x, y))
        d.line(pts, fill=int(rng.uniform(110, 180)), width=width)
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    return np.asarray(layer, float) / 255.0

def radial(w, h, cx, cy, rad):
    y, x = np.mgrid[0:h, 0:w]
    d = np.sqrt(((x - cx * w) ** 2 + (y - cy * h) ** 2)) / (rad * w)
    return np.clip(1 - d, 0, 1)

# ---- Hero (2560x1920): evening light over a fluted, plastered wall ----------
def hero():
    w, h = 2560, 1920
    glow = radial(w, h, 0.68, 0.22, 0.95) ** 1.6
    cloud = smooth_noise(w, h, 7, 5, 11)
    t = np.clip(glow * 0.85 + cloud * 0.22, 0, 1)
    deep = INK * 0.7 + BRASS_DEEP * 0.3
    mid = SAGE * 0.45 + BRASS_DEEP * 0.55
    hi = hexc("#e7d8bb")
    arr = ramp(t, [deep * 0.85, deep, mid, hi])
    # fluted panel rhythm, brightest where the light falls
    x = np.arange(w)
    flute = (np.sin(x / w * np.pi * 64) * 0.5 + 0.5) ** 2
    arr = arr * (1 + (flute[None, :, None] - 0.5) * 0.10 * (0.3 + glow[..., None]))
    # soft floor shadow at the base anchors the composition
    yy = (np.mgrid[0:h, 0:w][0] / h)
    arr = arr * (1 - 0.25 * np.clip(yy - 0.72, 0, 1)[..., None] * 3.2)
    finish(arr, "hoc-hero-placeholder.jpg", grain_amt=4, vig=0.08, seed=1)

# ---- Tiles (1200x1200) ------------------------------------------------------
def tile_bathroom():
    w = h = 1200
    strata = smooth_noise(w, h, 3, 26, 21)
    cloud = smooth_noise(w, h, 6, 6, 22)
    t = strata * 0.7 + cloud * 0.3
    arr = ramp(t, [STONE * 0.92, STONE, STONE_LINE, hexc("#efe9dd")])
    v = veins(w, h, 4, 23, width=2, blur=3)
    arr = arr * (1 - v[..., None] * 0.35) + SAGE_SOFT * (v[..., None] * 0.35)
    finish(arr, "hoc-tile-bathroom.jpg", grain_amt=3, seed=24)

def tile_kitchen():
    w = h = 1200
    grain_field = smooth_noise(w, h, 60, 3, 31)
    wobble = smooth_noise(w, h, 5, 5, 32)
    t = np.clip(grain_field * 0.75 + wobble * 0.3, 0, 1)
    arr = ramp(t, [hexc("#7a5f3e"), hexc("#a07c4e"), hexc("#c2a06e"), hexc("#d4b88a")])
    streaks = smooth_noise(w, h, 90, 2, 33)
    arr = arr * (1 - np.clip(streaks - 0.78, 0, 1)[..., None] * 0.9)
    finish(arr, "hoc-tile-kitchen.jpg", grain_amt=3.5, seed=34)

def tile_living():
    w = h = 1200
    cloud = smooth_noise(w, h, 4, 4, 41)
    drape = smooth_noise(w, h, 24, 3, 45)   # soft vertical drape, like linen folds
    t = np.clip(cloud * 0.55 + drape * 0.5, 0, 1)
    arr = ramp(t, [SAGE * 0.85, SAGE, SAGE_SOFT, hexc("#788070")])
    light = radial(w, h, 0.3, 0.2, 1.2) ** 2
    arr = arr * (1 + light[..., None] * 0.18)
    finish(arr, "hoc-tile-living.jpg", grain_amt=2, seed=43)

def tile_lighting():
    w = h = 1200
    base = INK * 0.9 + BRASS_DEEP * 0.1
    arr = np.ones((h, w, 3)) * base
    glow = radial(w, h, 0.5, 0.34, 0.55) ** 2.2
    core = radial(w, h, 0.5, 0.34, 0.13) ** 1.2
    warm = hexc("#caa05e")
    arr = arr + warm * glow[..., None] * 0.75 + hexc("#f3ddb4") * core[..., None] * 0.8
    # faint pendant drop line above the glow
    drop = np.zeros((h, w))
    drop[: int(0.30 * h), int(0.498 * w): int(0.502 * w)] = 1
    drop = np.asarray(Image.fromarray((drop * 255).astype(np.uint8)).filter(
        ImageFilter.GaussianBlur(2)), float) / 255.0
    arr = arr + BRASS * drop[..., None] * 0.5
    finish(arr, "hoc-tile-lighting.jpg", grain_amt=3, vig=0.16, seed=44)

# ---- Editorial splits (1600x1200) ------------------------------------------
def editorial_marble():
    w, h = 1600, 1200
    cloud = smooth_noise(w, h, 5, 4, 51)
    arr = ramp(cloud, [hexc("#e9e4d8"), PAPER, hexc("#f8f5ee")])
    v1 = veins(w, h, 5, 52, width=4, blur=2.2, drift=0.3)
    v2 = veins(w, h, 9, 53, width=2, blur=1.6, drift=0.35)
    grey = SAGE * 0.55 + STONE * 0.45
    arr = arr * (1 - v1[..., None] * 0.5) + grey * (v1[..., None] * 0.5)
    arr = arr * (1 - v2[..., None] * 0.25) + SAGE_SOFT * (v2[..., None] * 0.25)
    vb = veins(w, h, 2, 54, width=2, blur=1.2)
    arr = arr * (1 - vb[..., None] * 0.3) + BRASS * (vb[..., None] * 0.3)
    finish(arr, "hoc-editorial-marble.jpg", grain_amt=2.5, vig=0.06, seed=55)

def editorial_oak():
    w, h = 1600, 1200
    grain_field = smooth_noise(w, h, 3, 70, 61)   # horizontal grain
    wobble = smooth_noise(w, h, 6, 6, 62)
    t = np.clip(grain_field * 0.7 + wobble * 0.35, 0, 1)
    arr = ramp(t, [hexc("#6e5538"), hexc("#94714a"), hexc("#b8945f"), hexc("#cfb183")])
    rings = smooth_noise(w, h, 2, 110, 63)
    arr = arr * (1 - np.clip(rings - 0.8, 0, 1)[..., None] * 0.8)
    light = radial(w, h, 0.25, 0.25, 1.3) ** 2
    arr = arr * (1 + light[..., None] * 0.12)
    finish(arr, "hoc-editorial-oak.jpg", grain_amt=3, vig=0.08, seed=64)

# ---- About page header (2000x1125): plaster wall with soft arches -----------
def about_header():
    w, h = 2000, 1125
    y, x = np.mgrid[0:h, 0:w]
    diag = (x / w * 0.6 + (1 - y / h) * 0.4)
    cloud = smooth_noise(w, h, 6, 4, 71)
    t = np.clip(diag * 0.7 + cloud * 0.3, 0, 1)
    arr = ramp(t, [STONE, hexc("#cdc7ba"), hexc("#e6e0d2"), hexc("#f4efe4")])
    # three blurred arch outlines, barely-there architectural hint
    layer = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(layer)
    for i, cx in enumerate((0.22, 0.5, 0.78)):
        ww, top = 0.16 * w, 0.32 * h
        x0, x1 = cx * w - ww, cx * w + ww
        d.arc([x0, top, x1, top + 2 * ww], 180, 360, fill=120, width=6)
        d.line([x0, top + ww, x0, h], fill=120, width=6)
        d.line([x1, top + ww, x1, h], fill=120, width=6)
    a = np.asarray(layer.filter(ImageFilter.GaussianBlur(3)), float) / 255.0
    shade = SAGE * 0.3 + STONE * 0.7
    arr = arr * (1 - a[..., None] * 0.22) + shade * (a[..., None] * 0.22)
    finish(arr, "hoc-pageheader-about.jpg", grain_amt=2.5, vig=0.05, seed=72)

hero(); tile_bathroom(); tile_kitchen(); tile_living(); tile_lighting()
editorial_marble(); editorial_oak(); about_header()
