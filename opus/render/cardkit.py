"""Shared card primitives for r16 / C13 r3 / C09 r2.

Palette, type scale and paper/bubble objects are carried over from the approved
r15 visual system (input/prior-workspace/drafts-for-review/20261018-cardnews-r15/
visual_system.py). Added here: Japanese and English support, a per-text audit
record (bbox, size) for overlap / orphan / minimum-size checks.
"""
from pathlib import Path
from functools import lru_cache
import base64, html, os, re, subprocess
from PIL import ImageFont

ROOT = Path(__file__).resolve().parent
# Fonts/objects are read in place from the prior lane (34 MB, not copied into the synced folder).
ASSETS = Path('/Users/son7/threads-opus-1019/work/render/assets')
FC = Path(os.environ.get('TMPDIR', '/tmp')) / 'opus-cardkit-fc'
INK, PAPER, ACCENT = '#171714', '#F4F0E7', '#F3482B'
MUTED = '#8C877B'
W, H = 1080, 1350
FAMILY = {'ko': 'Noto Sans KR', 'zh-TW': 'Noto Sans TC', 'ja': 'Noto Sans JP', 'en': 'Noto Sans KR'}
FILES = {'ko': 'NotoSansKR.ttf', 'zh-TW': 'NotoSansTC.ttf', 'ja': 'NotoSansJP.ttf', 'en': 'NotoSansKR.ttf'}
ENV = os.environ.copy()
ENV['FONTCONFIG_FILE'] = str(FC / 'fonts.conf')
MIN_TEXT = 32

AUDIT = []          # rows for the current card; reset by start()
OBSTACLES = []      # (name, bbox) of drawn objects that free text must not touch
GROUP = []          # stack of group transforms for bbox audit


def setup_fonts():
    (FC / '_cache').mkdir(parents=True, exist_ok=True)
    (FC / 'fonts.conf').write_text(
        '<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig>'
        f'<dir>{ASSETS / "fonts"}</dir><cachedir>{FC / "_cache"}</cachedir></fontconfig>')


def esc(v):
    return html.escape(str(v), quote=True)


@lru_cache(maxsize=512)
def font(lang, size, weight=400):
    face = ImageFont.truetype(str(ASSETS / 'fonts' / FILES[lang]), size=size)
    face.set_variation_by_axes([weight])
    return face


def width(value, lang, size, weight=400):
    return font(lang, size, weight).getlength(value)


# Full-width CJK punctuation right after Latin letters (e.g. "LINE，") gets itemized with the Latin
# run and drawn with the wrong (Korean/Japanese-style, half-width-looking) glyph. A <tspan> around
# the punctuation makes Pango shape it as CJK again.
CJK_PUNCT = re.compile('([\u3000-\u303f\u30fb\uff01-\uff0f\uff1a-\uff20\uff3b-\uff40\uff5b-\uff65]+)')


def text(value, x, y, size=44, fill=INK, weight=400, anchor='start', lang='ko'):
    ls = ' letter-spacing="-0.5"' if lang in ('ko', 'en') and size >= 70 else ''
    body = esc(value)
    if lang in ('zh-TW', 'ja'):
        body = CJK_PUNCT.sub(r'<tspan>\1</tspan>', body)
    return (f'<text x="{x}" y="{y}" font-family="{FAMILY[lang]}" font-size="{size}" '
            f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}"{ls}>{body}</text>')


def put(value, x, y, size, fill=INK, weight=700, lang='ko', maxw=960, anchor='start', role='copy',
        minimum=None, rotate=None):
    """Place one line. Shrinks to fit maxw but never below the minimum size."""
    minimum = MIN_TEXT if minimum is None else minimum
    if size < minimum:
        raise ValueError(f'[{lang}] {role} would be {size}px, below its {minimum}px floor: {value!r}')
    s = size
    while width(value, lang, s, weight) > maxw and s > minimum:
        s -= 1
    w = width(value, lang, s, weight)
    if w > maxw + 0.5:
        raise ValueError(f'[{lang}] too long for {maxw}px at {s}px: {value!r}')
    l, t, r, b = font(lang, s, weight).getbbox(value, anchor='ls')
    if role == 'amount' and re.fullmatch(r'[0-9,]+', value):
        w = r = ink_width(value, lang, s, weight)   # rsvg renders numerals narrower than PIL measures
    off = w if anchor == 'end' else (w / 2 if anchor == 'middle' else 0)
    AUDIT.append({'text': value, 'role': role, 'size': s, 'weight': weight, 'lang': lang,
                  'bbox': [x - off + l, y + t, x - off + r, y + b], 'rotate': rotate,
                  'group': list(GROUP)})
    return text(value, x, y, s, fill, weight, anchor, lang)


def common_size(rows, size, lang, maxw, weight=900, minimum=None):
    """One size for every line of a multi-line headline (no per-line shrinking)."""
    minimum = MIN_TEXT if minimum is None else minimum
    s = size
    while s > minimum and any(width(r, lang, s, weight) > maxw for r in rows):
        s -= 1
    return s


# ---------- line breaking ----------
NO_START = set('，。、；：？！）」』】〉》,.;:?!)]}%・ー…ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮヵヶ々〻元円年月日')
NO_END = set('（「『【〈《([{$')


JA_BREAK_AFTER = set('、。，」）』！？はがをにでともへやのて')
ZH_BREAK_AFTER = set('，、。；：」）』！？的了在是和與也就都還但說')


def units(value, lang):
    if lang in ('ko', 'en'):
        return value.split(' '), ' '
    # zh / ja: segment at natural break opportunities (after punctuation / particles), keep
    # latin words and numbers together. Segments longer than a line are split later by wrap().
    toks = re.findall(r'[A-Za-z0-9][A-Za-z0-9,.\'%$+-]*|\s|.', value)
    toks = [t for t in toks if t != ' ']
    brk = JA_BREAK_AFTER if lang == 'ja' else ZH_BREAK_AFTER
    segs, cur = [], ''
    for t in toks:
        cur += t
        if t in brk or t.isspace():
            segs.append(cur); cur = ''
    if cur:
        segs.append(cur)
    return segs, ''


def wrap(value, lang, size, maxw, weight=500):
    rows = []
    for para in value.split('\n'):
        toks, joiner = units(para, lang)
        if joiner == '':
            fixed = []
            for t in toks:
                if width(t, lang, size, weight) > maxw:
                    fixed.extend(re.findall(r'[A-Za-z0-9][A-Za-z0-9,.\'%$+-]*|.', t))
                else:
                    fixed.append(t)
            toks = fixed
        cur = []           # tokens in the current row
        def text_of(ts):
            return joiner.join(ts)
        for tok in toks:
            cand = cur + [tok]
            if cur and width(text_of(cand), lang, size, weight) > maxw:
                if joiner == '' and tok[:1] in NO_START and len(cur) > 1:
                    carry = cur.pop()          # move the whole previous token down
                    rows.append(text_of(cur))
                    cur = [carry, tok]
                elif joiner == '' and cur[-1][-1:] in NO_END and len(cur) > 1:
                    carry = cur.pop()
                    rows.append(text_of(cur))
                    cur = [carry, tok]
                else:
                    rows.append(text_of(cur))
                    cur = [tok]
            else:
                cur = cand
        if cur:
            rows.append(text_of(cur))
    return rows


def balanced(value, lang, size, maxw, weight=500):
    """Greedy wrap, then rebalance so lines have similar widths (same line count)."""
    rows = wrap(value, lang, size, maxw, weight)
    if len(rows) < 2 or '\n' in value:
        return rows
    n = len(rows)
    lo, hi = maxw * 0.5, maxw
    best = rows
    for _ in range(14):
        mid = (lo + hi) / 2
        cand = wrap(value, lang, size, mid, weight)
        if len(cand) <= n and all(width(r, lang, size, weight) <= mid + 0.5 for r in cand):
            best, hi = cand, mid
        else:
            lo = mid
    return best


def orphan(rows, lang):
    """True if the last of several wrapped rows is a lone short word/fragment."""
    if len(rows) < 2:
        return False
    last = rows[-1].strip()
    if lang in ('ko',):
        return len(last.split(' ')) == 1
    if lang == 'en':
        return len(last.split(' ')) == 1
    core = re.sub(r'[，。、；：？！」』）\s]', '', last)
    return len(core) <= 2


def block(out, value, x, y, size, lang, maxw, weight=500, fill=INK, lead=1.32, role='body',
          max_lines=3, anchor='start', minimum=None):
    """Wrap and place a block; shrink (not below minimum) until it fits max_lines with no orphan."""
    minimum = MIN_TEXT if minimum is None else minimum
    for s in range(size, minimum - 1, -1):
        rows = balanced(value, lang, s, maxw, weight) if '\n' not in value else value.split('\n')
        authored = '\n' in value
        if len(rows) <= max_lines and (authored or not orphan(rows, lang)) and all(width(r, lang, s, weight) <= maxw for r in rows):
            break
    else:
        raise ValueError(f'[{lang}] block does not fit {max_lines} lines without orphan: {value!r} -> {rows}')
    step = round(s * lead)
    for i, r in enumerate(rows):
        out.append(put(r, x, y + i * step, s, fill, weight, lang, maxw, anchor, role, minimum=s))
    return y + (len(rows) - 1) * step, s, len(rows)


# ---------- objects ----------
def rect(x, y, w, h, fill=PAPER, radius=0, stroke=None, sw=2):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{fill}"'
            + (f' stroke="{stroke}" stroke-width="{sw}"' if stroke else '') + '/>')


def line(x1, y1, x2, y2, fill=INK, w=2, dash=None):
    return (f'<path d="M{x1} {y1} L{x2} {y2}" fill="none" stroke="{fill}" stroke-width="{w}"'
            + (f' stroke-dasharray="{dash}"' if dash else '') + '/>')


def arrow(x, y, length=70, fill=INK, w=5):
    return (f'<path d="M{x} {y} h{length} m-22 -20 22 20 -22 20" '
            f'fill="none" stroke="{fill}" stroke-width="{w}" stroke-linecap="square"/>')


def bubble(x, y, w, h, fill=PAPER, side='left', rotate=0, stroke=None, tail_depth=26):
    tailx = x + 52 if side == 'left' else x + w - 52
    tw = 25 if tail_depth >= 26 else 18
    tail = (f'<path d="M{tailx} {y+h-2} l{(-tw if side=="left" else tw)} {tail_depth+2} v-{tail_depth+4} Z" '
            f'fill="{fill}"' + (f' stroke="{stroke}" stroke-width="2"' if stroke else '') + '/>')
    return f'<g transform="rotate({rotate} {x+w/2} {y+h/2})">{rect(x, y, w, h, fill, 24, stroke)}{tail}</g>'


def paper(x, y, w, h, angle=0, folded=True, fill=PAPER):
    fold = 50
    shadow = rect(x + 12, y + 15, w, h, INK if fill == PAPER else PAPER)
    if folded:
        shape = (f'<path d="M{x} {y} H{x+w-fold} L{x+w} {y+fold} V{y+h} H{x} Z" '
                 f'fill="{fill}" stroke="{INK}" stroke-width="2"/>'
                 f'<path d="M{x+w-fold} {y} V{y+fold} H{x+w}" fill="none" stroke="{INK}" stroke-width="2"/>')
    else:
        shape = rect(x, y, w, h, fill, 0, INK)
    return f'<g transform="rotate({angle} {x+w/2} {y+h/2})">{shadow}{shape}</g>'


@lru_cache(maxsize=8)
def data_uri(name):
    return 'data:image/png;base64,' + base64.b64encode((ASSETS / 'objects' / name).read_bytes()).decode()


MAST = {'ko': '대만의 판결', 'zh-TW': '判決裡的事', 'ja': '台湾の判決から', 'en': 'Taiwan court files'}


def obstacle(name, x0, y0, x1, y1):
    OBSTACLES.append((name, [x0, y0, x1, y1]))
    return ''


def start(lang, dark=False, tag=''):
    AUDIT.clear()
    OBSTACLES.clear()
    bg, fg = (INK, PAPER) if dark else (PAPER, INK)
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" xml:lang="{lang}">',
           rect(0, 0, W, H, bg), rect(60, 58, 9, 30, ACCENT),
           put(MAST[lang], 84, 83, 32, fg, 700, lang, 420, role='masthead')]
    if tag:
        out.append(put(tag, 1020, 83, 32, fg, 400, lang, 560, 'end', role='tag'))
    return out


def finish(out, lang, number, total, dark=False, source=('', '')):
    fg = PAPER if dark else INK
    out += [line(60, 1230, 1020, 1230, fg, 1),
            put(source[0], 60, 1274, 32, fg, 400, lang, 700, role='source'),
            put(source[1], 60, 1313, 32, fg, 400, lang, 700, role='source'),
            put(f'{number:02d}', 1020, 1307, 42, fg, 900, lang, 120, 'end', role='page')]
    for i in range(total):
        out.append(rect(1000 - (total - i) * 24 - 40, 1277, 14, 4, ACCENT if i == number - 1 else fg))
    out.append('</svg>')
    return ''.join(out)


def render(svg_path, png_path):
    subprocess.run(['rsvg-convert', str(svg_path), '-o', str(png_path)], check=True, capture_output=True, env=ENV)


# ---------- audit ----------
def _overlap(a, b, pad=2):
    return not (a[2] <= b[0] + pad or b[2] <= a[0] + pad or a[3] <= b[1] + pad or b[3] <= a[1] + pad)


def audit_rows(rows):
    """Return a list of problems: text under 32px, outside canvas, overlapping text."""
    problems = []
    for r in rows:
        if r['size'] < MIN_TEXT:
            problems.append(f"small text {r['size']}px: {r['text']}")
        x0, y0, x1, y1 = r['bbox']
        if not r['group'] and (x0 < 40 or x1 > W - 40 or y0 < 40 or y1 > H - 20):
            problems.append(f"outside safe area {r['bbox']}: {r['text']}")
    flat = [r for r in rows if not r['group']]
    ok_pair = lambda a, b: {a['role'], b['role']} == {'amount', 'unit'}  # rsvg numerals render narrower than PIL; checked by eye
    for i in range(len(flat)):
        for j in range(i + 1, len(flat)):
            if _overlap(flat[i]['bbox'], flat[j]['bbox']) and not ok_pair(flat[i], flat[j]):
                problems.append(f"overlap: {flat[i]['text']!r} x {flat[j]['text']!r}")
    for r in flat:
        if r['role'] in ('masthead', 'tag', 'source', 'page'):
            continue
        for name, box in OBSTACLES:
            if _overlap(r['bbox'], box, pad=0):
                problems.append(f"text over object {name}: {r['text']!r}")
    # rows inside the same rotated group are compared with each other
    groups = {}
    for r in rows:
        if r['group']:
            groups.setdefault(tuple(r['group']), []).append(r)
    for g, rs in groups.items():
        for i in range(len(rs)):
            for j in range(i + 1, len(rs)):
                if _overlap(rs[i]['bbox'], rs[j]['bbox']) and not ok_pair(rs[i], rs[j]):
                    problems.append(f"overlap in {g}: {rs[i]['text']!r} x {rs[j]['text']!r}")
    return problems


class grouped:
    """Context manager: mark rows placed inside a rotated SVG group."""
    def __init__(self, name):
        self.name = name

    def __enter__(self):
        GROUP.append(self.name)

    def __exit__(self, *a):
        GROUP.pop()


def fit_rows(value, lang, size, maxw, weight=500, max_lines=2, minimum=None):
    """Smallest line count first: try 1 line from size down to ~85%, then more lines."""
    minimum = MIN_TEXT if minimum is None else minimum
    if '\n' in value:
        rows = value.split('\n')
        for s in range(size, minimum - 1, -1):
            if all(width(r, lang, s, weight) <= maxw for r in rows):
                return rows, s
        raise ValueError(f'[{lang}] authored lines too wide: {rows}')
    for n in range(1, max_lines + 1):
        floor = max(minimum, round(size * 0.86)) if n < max_lines else minimum
        for s in range(size, floor - 1, -1):
            rows = balanced(value, lang, s, maxw, weight)
            if len(rows) == n and not orphan(rows, lang) and all(width(r, lang, s, weight) <= maxw for r in rows):
                return rows, s
    raise ValueError(f'[{lang}] cannot fit {max_lines} lines without orphan: {value!r}')


def stack(out, items, bottom, lang, fill, gap=26):
    """items: list of (value, size, weight, maxw, role, max_lines). Placed bottom-up, last item's
    last baseline at `bottom`. Returns top baseline."""
    placed = []
    for value, size, weight, maxw, role, ml in items:
        if not value:
            continue
        rows, s = fit_rows(value, lang, size, maxw, weight, ml)
        placed.append((rows, s, weight, maxw, role))
    y = bottom
    plan = []
    for rows, s, weight, maxw, role in reversed(placed):
        step = round(s * 1.28)
        top = y - (len(rows) - 1) * step
        plan.append((top, rows, s, weight, maxw, role, step))
        y = top - round(s * 1.0) - gap
    for top, rows, s, weight, maxw, role, step in reversed(plan):
        for i, r in enumerate(rows):
            out.append(put(r, 60, top + i * step, s, fill, weight, lang, maxw, role=role, minimum=s))
    return plan[-1][0] if plan else bottom


_INK_CACHE = {}


def ink_extent(value, lang, size, weight=900):
    """Actual rendered advance of `value` in rsvg (variable-font numerals render narrower than PIL
    measures). Measured once by rasterizing; returns the right edge of ink relative to x."""
    key = (value, lang, size, weight)
    if key in _INK_CACHE:
        return _INK_CACHE[key]
    import tempfile, numpy as np
    from PIL import Image
    w = int(width(value, lang, size, weight) + 200)
    h = int(size * 1.6)
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" xml:lang="{lang}">'
           f'<rect width="{w}" height="{h}" fill="#FFFFFF"/>' + text(value, 50, int(size * 1.2), size, '#000000', weight, 'start', lang) + '</svg>')
    with tempfile.TemporaryDirectory() as d:
        sp = Path(d) / 'm.svg'
        sp.write_text(svg)
        render(sp, Path(d) / 'm.png')
        im = np.array(Image.open(Path(d) / 'm.png').convert('L'))
    cols = np.where((im < 128).any(axis=0))[0]
    res = (float(cols.min() - 50), float(cols.max() - 50)) if len(cols) else (0.0, 0.0)
    _INK_CACHE[key] = res
    return res


def ink_width(value, lang, size, weight=900):
    return ink_extent(value, lang, size, weight)[1]


def after(num_x, num_value, num_size, unit_value, unit_size, lang, gap=14, weight=900):
    """x for a unit placed `gap` px of visible space after a rendered number."""
    return num_x + ink_extent(num_value, lang, num_size, weight)[1] + gap - ink_extent(unit_value, lang, unit_size, weight)[0]


def last_size():
    return AUDIT[-1]['size']


# ---------- card 1: the gist up front (resume 3, 2026-10-19) ----------
def foot_block(out, card, lang, dark, bottom=1185, arrow_on=True):
    """foot[0] = plain context line, foot[1] = bold line (open loop, arrow) — both optional."""
    fg = PAPER if dark else INK
    a, b = (list(card.get('foot', [])) + ['', ''])[:2]
    top = stack(out, [(a, 46, 500, 960, 'body', 2), (b, 50, 700, 860 if arrow_on else 960, 'open-loop', 2)],
                bottom, lang, fg)
    if arrow_on and b:
        out.append(arrow(944, bottom - 20, 65, ACCENT))
    return top


def core_card(card, lang, total, art, src):
    """Dark. Kicker + the conclusion as a big headline + one case object + one 'why' line.
    art(out, x0, y0, x1, y1, card, lang) draws the object inside the free box."""
    out = start(lang, True, card['tag'])
    L = card['labels']
    out.append(put(L['kicker'], 64, 196, 38, ACCENT, 700, lang, 950, role='label'))
    rows = card['headline'].split('\n')
    hs = common_size(rows, L.get('size', 96), lang, 960)
    step = round(hs * 1.2)
    y = 196 + 40 + hs
    for i, v in enumerate(rows):
        out.append(put(v, 60, y + i * step, hs, PAPER, 900, lang, 960, role='headline', minimum=56))
    head_bottom = y + (len(rows) - 1) * step + round(hs * 0.3)
    n, m = len(AUDIT), len(OBSTACLES)
    foot_top = foot_block([], card, lang, True)
    del AUDIT[n:], OBSTACLES[m:]
    y0, y1 = head_bottom + 50, foot_top - 40 - 60
    assert y1 - y0 >= 300, f'[{lang}] no room for the card-1 object ({y0}..{y1})'
    out.append(obstacle('art', 60, y0, 1020, y1))
    with grouped('art'):
        art(out, 60, y0, 1020, y1, card, lang)
    foot_block(out, card, lang, True)
    return finish(out, lang, card['number'], total, True, src)
