"""C13 r3 cards: 新竹地院113年度婚字第59號. r15 design language: dark/light rhythm,
hero number, speech bubbles, paper evidence objects, late verdict."""
from cardkit import *

SRC = {
    'ko': ('대만 신주지방법원', '113年度婚字第59號 · 2024.06.11 · 1심'),
    'zh-TW': ('新竹地院 113年度婚字第59號', '2024.06.11 · 一審'),
    'ja': ('台湾・新竹地方法院', '113年度婚字第59號・2024.06.11・一審'),
    'en': ('Hsinchu District Court · 113 Hun-Zi 59', 'June 11, 2024 · district court ruling'),
}
LAW = {
    'ko': ('대만 민법 1050조 · 73조', '협의이혼의 방식'),
    'zh-TW': ('民法第1050條 · 第73條', '兩願離婚的方式'),
    'ja': ('台湾民法第1050条・第73条', '協議離婚の方式'),
    'en': ('Taiwan Civil Code Arts. 1050, 73', 'Form of a divorce by agreement'),
}


def two_lines(value, lang, size, maxw, weight, floor):
    """Prefer two balanced lines at full size over one line shrunk below `floor`."""
    if not value or '\n' in value or width(value, lang, floor, weight) <= maxw:
        return value
    rows = balanced(value, lang, size, maxw, weight)
    return '\n'.join(rows) if len(rows) == 2 and not orphan(rows, lang) else value


def foot(out, card, lang, dark, bottom=1185, arrow_on=True):
    fg = PAPER if dark else INK
    a, b = (card['foot'] + ['', ''])[:2]
    b = two_lines(b, lang, 50, 860 if arrow_on else 960, 700, 46)
    top = stack(out, [(a, 46, 500, 960, 'body', 2), (b, 50, 700, 860 if arrow_on else 960, 'open-loop', 2)],
                bottom, lang, fg)
    if arrow_on and b:
        out.append(arrow(944, bottom - 20, 65, ACCENT))
    return top


def dry(fn):
    """Run a placement on a scratch list and roll back its audit rows; returns fn's result."""
    n, m = len(AUDIT), len(OBSTACLES)
    result = fn([])
    del AUDIT[n:], OBSTACLES[m:]
    return result


def foot_ink_top(card, lang, arrow_on=True):
    """Top of the foot text's ink, known before the rest of the card is laid out."""
    return dry(lambda o: foot(o, card, lang, False, arrow_on=arrow_on)) - 38


def scribble(x, y, w, color=INK):
    return (f'<path d="M{x} {y} q{w*0.12} -36 {w*0.22} 0 t{w*0.22} 0 t{w*0.22} -6 t{w*0.2} 4" '
            f'fill="none" stroke="{color}" stroke-width="4" stroke-linecap="round"/>')


def hook(card, lang, total):
    """Dark. Hero '2' witnesses + divorce agreement paper + husband's bubble."""
    out = start(lang, True, card['tag'])
    L = card['labels']
    shift = max(0, min(60, foot_ink_top(card, lang) - 997 - 95))  # 997: bubble tail bottom by default
    up = shift // 2
    block(out, L['label'], 64, 194 + up, 38, lang, 500, 500, PAPER, 1.25, 'label', 2)
    hero = L.get('hero', '2')
    out.append(put(hero, 40, 612 + up, 400, ACCENT, 900, lang, 330, role='amount'))
    if L['unit']:
        out.append(put(L['unit'], after(40, hero, 400, L['unit'], 96, lang, 22), 600 + up, 96, ACCENT, 900, lang, 320, role='unit'))
    out.append(obstacle('paper', 560, 150 + up, 1040, 600 + up))
    out.append(f'<g transform="translate(0 {up}) rotate(6 800 370)">')
    with grouped('paper'):
        out.append(paper(590, 170, 420, 410, 0, True))
        out.append(put(L['paper_title'], 630, 250, 40, INK, 900, lang, 320, role='object'))
        out.append(line(630, 282, 970, 282, INK, 2))
        out.append(scribble(636, 372, 150) + scribble(820, 372, 150))
        out.append(line(630, 396, 790, 396, INK, 2) + line(810, 396, 970, 396, INK, 2))
        out.append(rect(630, 450, 340, 84, ACCENT))
        out.append(put(L['stamp'], 800, 507, 40, INK, 900, lang, 320, 'middle', role='object'))
    out.append('</g>')
    out.append(obstacle('bubble', 120, 650 + shift, 1030, 975 + shift))
    out.append(bubble(130, 668 + shift, 890, 290, PAPER, 'left', -2))
    with grouped('bubble'):
        out.append(put(card['speaker'], 180, 730 + shift, 32, INK, 500, lang, 640, role='speaker'))
        rows = card['headline'].split('\n')
        for i, v in enumerate(rows):
            out.append(put(v, 180, 818 + shift + i * 96, common_size(rows, 70, lang, 800), INK, 900, lang, 800, role='headline', minimum=50))
    foot(out, card, lang, True)
    return finish(out, lang, card['number'], total, True, SRC[lang])


def restaurant(card, lang, total):
    """Light. Top view of a table: two plates, two cups, the agreement and a pen."""
    out = start(lang, False, card['tag'])
    out += [bubble(60, 152, 960, 187, INK, 'left', -2),
            put(card['speaker'], 94, 204, 32, PAPER, 500, lang, 870, role='speaker'),
            put(card['headline'], 94, 291, 70, PAPER, 900, lang, 872, role='headline', minimum=48)]
    # table
    out.append(obstacle('table', 96, 380, 984, 945))
    out.append(f'<rect x="96" y="420" width="888" height="520" rx="260" fill="none" stroke="{INK}" stroke-width="4"/>')
    for cx, cy in [(300, 560), (780, 800)]:
        out.append(f'<circle cx="{cx}" cy="{cy}" r="92" fill="{PAPER}" stroke="{INK}" stroke-width="4"/>'
                   f'<circle cx="{cx}" cy="{cy}" r="58" fill="none" stroke="{INK}" stroke-width="2"/>')
    for cx, cy in [(440, 470), (640, 890)]:
        out.append(f'<circle cx="{cx}" cy="{cy}" r="34" fill="{PAPER}" stroke="{INK}" stroke-width="4"/>')
    # chopsticks
    out.append(line(178, 690, 300, 690, INK, 5) + line(178, 704, 300, 704, INK, 5))
    out.append(line(780, 662, 900, 662, INK, 5) + line(780, 676, 900, 676, INK, 5))
    out.append('<g transform="rotate(-8 560 690)">')
    with grouped('doc'):
        out.append(paper(420, 560, 280, 300, 0, True))
        out.append(put(card['labels']['doc'], 450, 620, 32, INK, 900, lang, 220, role='object'))
        out.append(line(450, 645, 670, 645, INK, 2))
        out.append(scribble(452, 720, 100) + line(450, 740, 560, 740, INK, 2))
        out.append(line(450, 800, 560, 800, ACCENT, 3, '8 8') + line(580, 800, 670, 800, ACCENT, 3, '8 8'))
    out.append('</g>')
    # pen
    out.append(f'<g transform="rotate(38 760 560)"><rect x="740" y="470" width="26" height="170" rx="5" fill="{ACCENT}" stroke="{INK}" stroke-width="3"/>'
               f'<path d="M740 640 L753 680 L766 640 Z" fill="{INK}"/></g>')
    if card['labels'].get('dashed'):
        out.append(put(card['labels']['dashed'], 540, 982, 34, ACCENT, 700, lang, 900, 'middle', role='object', minimum=32))
    foot(out, card, lang, False)
    return finish(out, lang, card['number'], total, False, SRC[lang])


def sides(card, lang, total):
    """Light. Claim headline + the agreement as the husband received it + both sides' bubbles."""
    out = start(lang, False, card['tag'])
    rows = card['headline'].split('\n')
    for i, v in enumerate(rows):
        out.append(put(v, 60, 214 + i * 92, common_size(rows, 70, lang, 960), INK, 900, lang, 960, role='headline', minimum=48))
    L = card['labels']
    top = 214 + len(rows) * 92 + 55
    # the agreement: witnesses signed, couple lines blank
    out.append(obstacle('paper', 50, top, 420, top + 470))
    out.append('<g transform="rotate(-4 235 %d)">' % (top + 230))
    with grouped('paper'):
        out.append(paper(70, top + 10, 330, 440, 0, True))
        out.append(put(L['doc'], 100, top + 78, 34, INK, 900, lang, 250, role='object'))
        out.append(line(100, top + 104, 370, top + 104, INK, 2))
        out.append(put(L['witness_lines'], 100, top + 160, 32, INK, 500, lang, 260, role='object'))
        out.append(scribble(104, top + 220, 110) + scribble(240, top + 220, 110))
        out.append(line(100, top + 240, 220, top + 240, INK, 2) + line(236, top + 240, 370, top + 240, INK, 2))
        out.append(put(L['couple_lines'], 100, top + 320, 32, ACCENT, 700, lang, 260, role='object'))
        out.append(scribble(104, top + 372, 110) + line(100, top + 392, 220, top + 392, INK, 2))
        out.append(line(236, top + 392, 370, top + 392, ACCENT, 3, '10 8'))
    out.append('</g>')
    bx, bw = 450, 570
    out.append(put(L['left_who'], bx, top + 40, 34, INK, 700, lang, 500, role='speaker'))
    out.append(bubble(bx, top + 62, bw, 190, PAPER, 'left', 0, INK))
    with grouped('b1'):
        block(out, L['left'], bx + 34, top + 140, 48, lang, bw - 68, 800, INK, 1.25, 'quote', 2)
    out.append(put(L['right_who'], bx + bw, top + 330, 34, INK, 700, lang, 500, 'end', role='speaker'))
    out.append(bubble(bx, top + 352, bw, 190, INK, 'right', 0))
    with grouped('b2'):
        block(out, L['right'], bx + 34, top + 430, 48, lang, bw - 68, 800, PAPER, 1.25, 'quote', 2)
    foot(out, card, lang, False)
    return finish(out, lang, card['number'], total, False, SRC[lang])


def testimony(card, lang, total):
    """Dark. Witness C's testimony as a big quote + three facts."""
    out = start(lang, True, card['tag'])
    L = card['labels']
    out.append(put(L['who'], 60, 214, 38, PAPER, 500, lang, 950, role='object'))
    out.append('<g transform="rotate(-3 540 520)">')
    with grouped('quote'):
        out.append(bubble(70, 270, 940, 400, PAPER, 'left'))
        rows = card['headline'].split('\n')
        for i, v in enumerate(rows):
            if i == L.get('mark', 1):
                ww = min(860, width(v, lang, 96, 900) + 26)
                out.append(rect(108, 362 + i * 128, ww, 118, ACCENT))
            out.append(put(v, 120, 450 + i * 128, common_size(rows, 96, lang, 840), INK, 900, lang, 840, role='headline', minimum=60))
    out.append('</g>')
    def facts(o, per):
        y = 780 + per
        for item in L['facts']:
            o.append(line(60, y - 46, 1020, y - 46, PAPER, 1))
            o.append(put('—', 60, y, 40, ACCENT, 900, lang, 60, role='bullet'))
            last, sz, n = block(o, item, 120, y, 40, lang, 900, 500, PAPER, 1.25, 'fact', 2)
            y = last + 76 + per
        return last
    slack = foot_ink_top(card, lang) - dry(lambda o: facts(o, 0)) - 14 - 100
    last_y = facts(out, max(0, min(24, round(slack / len(L['facts'])))))
    top = foot(out, card, lang, True)
    assert top - 52 >= last_y + 40, f'foot crowds the fact list (last fact {last_y}, foot top {top})'
    return finish(out, lang, card['number'], total, True, SRC[lang])


def verdict(card, lang, total):
    """Light with accent band; court document with stamp and rings."""
    out = start(lang, False, card['tag'])
    out.append(rect(60, 160, 960, 191, ACCENT))
    rows = card['headline'].split('\n')
    y0 = 285 if len(rows) == 1 else 243
    for i, v in enumerate(rows):
        out.append(put(v, 91, y0 + i * 88, common_size(rows, 76, lang, 896), INK, 900, lang, 896, role='headline', minimum=48))
    L = card['labels']
    g = max(0, min(50, foot_ink_top(card, lang) - 934 - 105))  # 934: paper shadow bottom by default
    out.append(obstacle('doc', 120, 450, 960, 920 + g))
    out.append('<g transform="translate(0 50) rotate(-3 540 640)">')
    with grouped('doc'):
        out.append(paper(160, 420, 760, 430 + g, 0, True))
        out.append(put(L['court'], 205, 492, 36, INK, 700, lang, 600, role='object'))
        out.append(line(205, 520, 870, 520, INK, 2))
        out.append(put(L['ruling'], 540, 608 + g // 4, 64, ACCENT, 900, lang, 660, 'middle', role='object', minimum=44))
        cy = 712 + g // 2
        out.append(f'<circle cx="495" cy="{cy}" r="66" fill="none" stroke="{INK}" stroke-width="10"/>'
                   f'<circle cx="585" cy="{cy}" r="66" fill="none" stroke="{INK}" stroke-width="10"/>')
        out.append(put(L['note'], 540, 822 + g * 3 // 4, 34, INK, 500, lang, 640, 'middle', role='object'))
    out.append('</g>')
    foot(out, card, lang, False)
    return finish(out, lang, card['number'], total, False, SRC[lang])


def mark(kind, cx, cy, size, color):
    if kind == 'ok':
        return (f'<path d="M{cx-size*0.45} {cy} L{cx-size*0.12} {cy+size*0.33} L{cx+size*0.5} {cy-size*0.38}" '
                f'fill="none" stroke="{color}" stroke-width="{size*0.16}" stroke-linecap="round" stroke-linejoin="round"/>')
    return (f'<path d="M{cx-size*0.4} {cy-size*0.4} L{cx+size*0.4} {cy+size*0.4} M{cx+size*0.4} {cy-size*0.4} L{cx-size*0.4} {cy+size*0.4}" '
            f'fill="none" stroke="{color}" stroke-width="{size*0.16}" stroke-linecap="round"/>')


def formula(card, lang, total):
    """Dark. This case against the three required elements: ok / ok / missing."""
    out = start(lang, True, card['tag'])
    rows = card['headline'].split('\n')
    for i, v in enumerate(rows):
        out.append(put(v, 60, 214 + i * 96, common_size(rows, 76, lang, 960), PAPER, 900, lang, 960, role='headline', minimum=52))
    L = card['labels']
    top = 214 + len(rows) * 96 + 40
    res = dry(lambda o: block(o, L['result'], 60, 0, 50, lang, 960, 900, ACCENT, 1.25, 'result', 2))[0]
    g = max(0, min(50, foot_ink_top(card, lang, False) - (top + 480 + res + 12) - 110))
    bw, bh, gap = 290, 380 + g, 45
    for i, (kind, label) in enumerate(L['items']):
        x = 60 + i * (bw + gap)
        bad = kind == 'x'
        out.append(rect(x, top, bw, bh, ACCENT if bad else PAPER, 18))
        out.append(mark(kind, x + bw / 2, top + 125 + g * 2 // 5, 130, INK))
        block(out, label, x + bw / 2, top + 268 + g * 3 // 5, 44, lang, bw - 36, 700, INK, 1.2, 'object', 2, anchor='middle')
    y = top + bh + 100
    block(out, L['result'], 60, y, 50, lang, 960, 900, ACCENT, 1.25, 'result', 2)
    foot(out, card, lang, True, arrow_on=False)
    return finish(out, lang, card['number'], total, True, LAW[lang])


def witnesses(card, lang, total):
    """Light info card. Each witness must confirm BOTH spouses; in this case C reached only the wife."""
    out = start(lang, False, card.get('tag', ''))
    rows = card['headline'].split('\n')
    for i, v in enumerate(rows):
        out.append(put(v, 60, 214 + i * 92, common_size(rows, 70, lang, 960), INK, 900, lang, 960, role='headline', minimum=50))
    L = card['labels']
    top = 214 + len(rows) * 92 + 20
    if L.get('sub'):
        out.append(put(L['sub'], 60, top, 34, INK, 500, lang, 960, role='label'))
    sy = top + (60 if L.get('sub') else 20)
    ft = foot_ink_top(card, lang, arrow_on=card['number'] < total)
    wy = sy + max(300, min(400, ft - 40 - 200 - sy))   # keep the grey note (wy+180) clear of the foot
    out.append(obstacle('diagram', 100, sy - 10, 980, wy + 150))
    def node(x, y, label, fill=PAPER, stroke=INK, fg=INK):
        return (rect(x, y, 300, 130, fill, 16, stroke, 4)
                + put(label, x + 150, y + 84, 48, fg, 800, lang, 260, 'middle', role='node'))
    with grouped('diagram'):
        out.append(node(140, sy, L['husband']))
        out.append(node(640, sy, L['wife']))
        out.append(node(140, wy, L['w1'], PAPER, ACCENT, INK))
        out.append(node(640, wy, L['w2'], PAPER, MUTED, MUTED))
        out.append(put(L['w2_note'], 790, wy + 180, 34, '#625D53', 500, lang, 330, 'middle', role='node-note'))
    out.append(obstacle('diagram-bottom', 600, wy + 140, 980, wy + 192))
    defs = ''.join(f'<marker id="m{c[1:]}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">'
                   f'<path d="M0 0 L8 4 L0 8 Z" fill="{c}"/></marker>' for c in (INK, ACCENT))
    out.append('<defs>' + defs + '</defs>')
    # wife -> C: C heard it from the wife (solid accent, arrowhead at C); C -> husband: never (dashed, X)
    out.append(f'<path d="M770 {sy + 136} L338 {wy - 4}" stroke="{ACCENT}" stroke-width="6" fill="none" marker-end="url(#m{ACCENT[1:]})"/>')
    out.append(f'<path d="M290 {wy} L290 {sy + 136}" stroke="{ACCENT}" stroke-width="5" fill="none" stroke-dasharray="14 12"/>')
    out.append(mark('x', 290, (wy + sy + 130) / 2, 90, ACCENT))
    with grouped('diagram-note'):
        mid = (wy + sy + 130) / 2   # the X on the dashed line; note sits to its left, clear of the line
        block(out, L['c_note'], 236, mid - 6, 34, lang, 176, 700, ACCENT, 1.2, 'node-note', 2, anchor='end')
        if L.get('wife_note'):
            out.append(put(L['wife_note'], 600, (wy + sy + 130) / 2 + 40, 34, ACCENT, 700, lang, 330, role='node-note'))
    foot(out, card, lang, False, arrow_on=card['number'] < total)
    return finish(out, lang, card['number'], total, False, SRC[lang])


def art_void(out, x0, y0, x1, y1, card, lang):
    """Divorce agreement with the registration stamp, crossed by a big VOID seal."""
    L = card['labels']
    h = min(420, y1 - y0)
    top = y0 + (y1 - y0 - h) / 2
    px, pw = 150, 560
    out.append(f'<g transform="rotate(-5 {px + pw / 2} {top + h / 2})">')
    out.append(paper(px, top + 10, pw, h - 30, 0, True))
    out.append(put(L['paper_title'], px + 44, top + 84, 42, INK, 900, lang, pw - 140, role='object'))
    out.append(line(px + 44, top + 114, px + pw - 44, top + 114, INK, 2))
    out.append(scribble(px + 50, top + 196, 150) + scribble(px + 290, top + 196, 150))
    out.append(line(px + 44, top + 220, px + 250, top + 220, INK, 2) + line(px + 284, top + 220, px + pw - 44, top + 220, INK, 2))
    out.append(rect(px + 44, top + h - 150, 360, 84, ACCENT))
    out.append(put(L['stamp'], px + 224, top + h - 93, 40, INK, 900, lang, 330, 'middle', role='object'))
    out.append('</g>')
    cx, cy, r = 800, top + h / 2 + 10, 165
    out.append(f'<g transform="rotate(-12 {cx} {cy})">'
               f'<circle cx="{cx + 10}" cy="{cy + 12}" r="{r}" fill="{INK}" stroke="{ACCENT}" stroke-width="3"/>'
               f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{PAPER}" stroke="{ACCENT}" stroke-width="16"/>'
               f'<circle cx="{cx}" cy="{cy}" r="{r - 24}" fill="none" stroke="{ACCENT}" stroke-width="5"/>')
    vs = 120
    while vs > 60 and width(L['void'], lang, vs, 900) > 2 * (r - 40):
        vs -= 4
    out.append(put(L['void'], cx, cy + vs * 0.36, vs, ACCENT, 900, lang, 2 * (r - 40), 'middle', role='object'))
    out.append('</g>')


def core(card, lang, total):
    return core_card(card, lang, total, art_void, SRC[lang])


LAYOUTS = {f.__name__: f for f in [core, hook, restaurant, sides, testimony, verdict, formula, witnesses]}
