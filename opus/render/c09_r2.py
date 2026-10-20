"""C09 r2 cards: 士林簡易庭111年度士簡字第875號 (traffic accident, bus ran a red light).
r15 design language. Numbers follow the judgment's own totals only (PRIMARY-CHECK)."""
from cardkit import *

SRC = {
    'ko': ('대만 스린지방법원 간이법정', '111年度士簡字第875號 · 2024.01.09 · 1심'),
    'zh-TW': ('士林簡易庭 111年度士簡字第875號', '2024.01.09·一審'),
    'ja': ('台湾・士林地方法院 士林簡易庭', '111年度士簡字第875號・2024.01.09・一審'),
    'en': ('Shilin Summary Court · 111 Shi-Jian-Zi 875', 'Jan 9, 2024 · trial-level ruling'),
}


def foot(out, card, lang, dark, bottom=1185, arrow_on=True):
    fg = PAPER if dark else INK
    a, b = (card['foot'] + ['', ''])[:2]
    top = stack(out, [(a, 46, 500, 960, 'body', 2), (b, 50, 700, 860 if arrow_on else 960, 'open-loop', 2)],
                bottom, lang, fg)
    if arrow_on and b:
        out.append(arrow(944, bottom - 20, 65, ACCENT))
    return top


def crash(card, lang, total):
    """Dark. Claimed amount as hero + traffic light + bubble."""
    out = start(lang, True, card['tag'])
    L = card['labels']
    dy = 0
    if L.get('amount'):
        out.append(put(L['amount_label'], 64, 194, 39, PAPER, 500, lang, 900, role='label'))
        out.append(put(L['amount'], 44, 380, 180, ACCENT, 900, lang, 860, role='amount', minimum=120))
        if L.get('unit'):
            out.append(put(L['unit'], after(44, L['amount'], last_size(), L['unit'], 64, lang), 376, 64, ACCENT, 900, lang, 160, role='unit'))
    else:
        dy = -240
    # traffic light
    out.append(obstacle('light', 790, 430 + dy, 1000, 900 + dy))
    out.append(rect(840, 450 + dy, 130, 380, PAPER, 26) + f'<line x1="905" y1="{830 + dy}" x2="905" y2="{900 + dy}" stroke="{PAPER}" stroke-width="14"/>')
    for i, c in enumerate([ACCENT, MUTED, MUTED]):
        out.append(f'<circle cx="905" cy="{520 + i * 118 + dy}" r="44" fill="{c}" stroke="{INK}" stroke-width="4"/>')
    out.append(obstacle('bubble', 50, 470 + dy, 790, 900 + dy))
    out.append(bubble(60, 490 + dy, 720, 380, PAPER, 'left', -2))
    with grouped('bubble'):
        out.append(put(card['speaker'], 108, 556 + dy, 32, INK, 500, lang, 640, role='speaker'))
        rows = card['headline'].split('\n')
        for i, v in enumerate(rows):
            out.append(put(v, 108, 650 + dy + i * 96, common_size(rows, 72, lang, 640), INK, 900, lang, 640, role='headline', minimum=48))
    if not L.get('amount') and L.get('scene'):
        # top view, north up: the bus heads west through the junction on red; the scooter comes
        # south down the cross street and hits the bus's right (north) side.
        ry = 700
        out.append(obstacle('scene', 60, ry, 1020, ry + 290))
        rd = f'stroke="{MUTED}" stroke-width="4" fill="none"'
        out.append(f'<path d="M60 {ry+80} H560 M760 {ry+80} H1020 M60 {ry+250} H560 M760 {ry+250} H1020 '
                   f'M560 {ry} V{ry+80} M760 {ry} V{ry+80} M560 {ry+250} V{ry+290} M760 {ry+250} V{ry+290}" {rd}/>')
        out.append(f'<path d="M560 {ry+92} H760" stroke="{PAPER}" stroke-width="6" stroke-dasharray="16 10"/>')
        out.append(rect(420, ry + 110, 470, 110, PAPER, 14, INK, 4))
        for k in range(5):
            out.append(rect(450 + k * 84, ry + 135, 60, 60, INK, 6))
        out.append(f'<path d="M400 {ry+165} h-110 m30 -26 -30 26 30 26" fill="none" stroke="{PAPER}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>')
        out.append(rect(640, ry + 10, 36, 76, ACCENT, 10))
        out.append(f'<path d="M658 {ry-8} v14" stroke="{ACCENT}" stroke-width="6"/>')
        out.append(f'<path d="M626 {ry+28} h64" stroke="{ACCENT}" stroke-width="8" stroke-linecap="round"/>')
        out.append(f'<path d="M640 {ry+96} l18 14 18 -14" fill="none" stroke="{ACCENT}" stroke-width="6" stroke-linecap="round"/>')
    foot(out, card, lang, True)
    return finish(out, lang, card['number'], total, True, SRC[lang])


def tooth(x, y, w, h, state):
    """Upper incisor outline. state: whole / lost / broken."""
    path = (f'M{x} {y} H{x+w} V{y+h*0.62} Q{x+w} {y+h} {x+w/2} {y+h} Q{x} {y+h} {x} {y+h*0.62} Z')
    if state == 'lost':
        return f'<path d="{path}" fill="none" stroke="{ACCENT}" stroke-width="5" stroke-dasharray="14 10"/>'
    out = f'<path d="{path}" fill="{PAPER}" stroke="{INK}" stroke-width="5"/>'
    if state == 'broken':
        out += (f'<path d="M{x+w*0.15} {y+h*0.55} L{x+w*0.45} {y+h*0.42} L{x+w*0.55} {y+h*0.62} L{x+w*0.88} {y+h*0.48}" '
                f'fill="none" stroke="{ACCENT}" stroke-width="6" stroke-linejoin="bevel"/>')
    return out


def injuries(card, lang, total):
    """Light. Four upper front teeth (1 lost, 3 broken) + collarbone note."""
    out = start(lang, False, card['tag'])
    rows = card['headline'].split('\n')
    for i, v in enumerate(rows):
        out.append(put(v, 60, 214 + i * 96, common_size(rows, 76, lang, 960), INK, 900, lang, 960, role='headline', minimum=52))
    L = card['labels']
    top = 214 + len(rows) * 96 + 10
    n, m = len(AUDIT), len(OBSTACLES)
    ft = foot([], card, lang, False)
    del AUDIT[n:], OBSTACLES[m:]
    gum = top + 70 - max(0, (top + 70 + 500) - (ft - 38 - 70))   # keep the parent's row clear of the foot
    out.append(obstacle('teeth', 80, gum - 10, 1000, gum + 330))
    out.append(put(L['who_a'], 60, gum - 50, 36, INK, 700, lang, 900, role='label'))
    out.append(f'<path d="M80 {gum} Q540 {gum-60} 1000 {gum}" fill="none" stroke="{INK}" stroke-width="5"/>')
    states = ['broken', 'broken', 'lost', 'broken']   # viewer's left to right; lost = patient's upper left central
    for i, st in enumerate(states):
        out.append(tooth(150 + i * 200, gum + 10, 170, 300, st))
    out.append(put(L['teeth_note'], 540, gum + 380, 40, ACCENT, 800, lang, 960, 'middle', role='object'))
    out.append(line(60, gum + 430, 1020, gum + 430, INK, 1))
    out.append(put(L['who_b'], 60, gum + 500, 36, INK, 700, lang, 400, role='label'))
    out.append(put(L['b_note'], 1020, gum + 500, 44, INK, 800, lang, 600, 'end', role='object'))
    foot(out, card, lang, False)
    return finish(out, lang, card['number'], total, False, SRC[lang])


def envelope_obj(x, y, w, h):
    return (rect(x + 14, y + 16, w, h, INK, 10)
            + f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="{PAPER}" stroke="{INK}" stroke-width="4"/>'
            + f'<path d="M{x+4} {y+8} L{x+w/2} {y+h*0.26} L{x+w-4} {y+8}" fill="none" stroke="{INK}" stroke-width="4"/>')


def prepaid(card, lang, total):
    """Dark. The 100,000 paid during the criminal case, and what it was for."""
    out = start(lang, True, card['tag'])
    L = card['labels']
    out.append(put(L['context'], 60, 214, 38, PAPER, 500, lang, 960, role='object'))
    out.append(obstacle('envelope', 90, 260, 990, 760))
    out.append('<g transform="rotate(-4 540 500)">')
    with grouped('env'):
        out.append(envelope_obj(120, 280, 840, 440))
        out.append(put(L['amount'], 540, 585, 160, ACCENT, 900, lang, 740, 'middle', role='amount', minimum=110))
        out.append(put(L['memo'], 540, 668, 40, INK, 700, lang, 720, 'middle', role='object'))
    out.append('</g>')
    out.append(obstacle('bubble', 50, 780, 1030, 960))
    out.append(bubble(60, 800, 960, 140, ACCENT, 'left', 0))
    with grouped('bubble2'):
        out.append(put(card['headline'], 100, 892, 54, INK, 900, lang, 880, role='headline', minimum=40))
    foot(out, card, lang, True)
    return finish(out, lang, card['number'], total, True, SRC[lang])


def versus(card, lang, total):
    """Light. Future dental cost: claim vs defence, big numbers."""
    out = start(lang, False, card['tag'])
    rows = card['headline'].split('\n')
    for i, v in enumerate(rows):
        out.append(put(v, 60, 214 + i * 96, common_size(rows, 76, lang, 960), INK, 900, lang, 960, role='headline', minimum=52))
    L = card['labels']
    top = 214 + len(rows) * 96 + 40
    out.append(obstacle('col-left', 60, top - 10, 500, top + 550))
    out.append(obstacle('col-right', 580, top - 10, 1020, top + 550))
    asz = 92
    while asz > 48 and (width(L['left_amount'], lang, asz, 900) > 380 or width(L['right_amount'], lang, asz, 900) > 380):
        asz -= 2
    for x, who, amount, note, fill, fg in [(60, L['left_who'], L['left_amount'], L['left_note'], INK, PAPER),
                                           (580, L['right_who'], L['right_amount'], L['right_note'], PAPER, INK)]:
        out.append(rect(x, top, 440, 540, fill, 18, INK, 3))
        with grouped(who):
            block(out, who, x + 34, top + 74, 40, lang, 372, 700, fg, 1.2, 'label', 2)
            out.append(put(amount, x + 34, top + 290, asz, ACCENT, 900, lang, 380, role='amount', minimum=asz))
            block(out, note, x + 34, top + 440, 38, lang, 372, 500, fg, 1.25, 'object', 2)
    out.append(put('vs', 540, top + 290, 40, ACCENT, 900, lang, 70, 'middle', role='sign'))
    foot(out, card, lang, False)
    return finish(out, lang, card['number'], total, False, SRC[lang])


def ruling(card, lang, total):
    """Light, accent band: the court's choice on the teeth + its reason."""
    out = start(lang, False, card['tag'])
    out.append(rect(60, 160, 960, 191, ACCENT))
    rows = card['headline'].split('\n')
    y0 = 285 if len(rows) == 1 else 243
    for i, v in enumerate(rows):
        out.append(put(v, 91, y0 + i * 88, common_size(rows, 72, lang, 896), INK, 900, lang, 896, role='headline', minimum=48))
    L = card['labels']
    out.append(put(L['amount'], 60, 560, 190, INK, 900, lang, 900, role='amount', minimum=120))
    out.append(put(L['amount_note'], 64, 646, 38, INK, 700, lang, 900, role='label'))
    out.append(obstacle('bubble', 50, 712, 1030, 960))
    out.append(put(L.get('reason_label', ''), 64, 700, 32, INK, 700, lang, 900, role='label') if L.get('reason_label') else '')
    out.append(rect(60, 718, 960, 214, INK, 18))  # a plain box: a summary of the court's reasons, not a quote
    with grouped('reason'):
        block(out, L['reason'], 100, 805, 50, lang, 860, 700, PAPER, 1.3, 'quote', 2)
    foot(out, card, lang, False)
    return finish(out, lang, card['number'], total, False, SRC[lang])


def cuts(card, lang, total):
    """Dark. Claimed -> allowed for three of B's items, each with one reason."""
    out = start(lang, True, card['tag'])
    rows = card['headline'].split('\n')
    for i, v in enumerate(rows):
        out.append(put(v, 60, 214 + i * 92, common_size(rows, 72, lang, 960), PAPER, 900, lang, 960, role='headline', minimum=50))
    y = 214 + len(rows) * 92 + 60
    k = 1.0
    if len(card['labels']['items']) == 1:
        k = 1.4   # one item: draw it larger and centre it between headline and foot
        n, m = len(AUDIT), len(OBSTACLES)
        ft = foot([], card, lang, True, arrow_on=bool(card['foot'][1:] and card['foot'][1]))
        del AUDIT[n:], OBSTACLES[m:]
        y = max(y, round((y - 50 + ft - 60) / 2 - 130 * k / 2 + 20))
    for item in card['labels']['items']:
        a, b, c_, d_ = round(36 * k), round(58 * k), round(54 * k), round(70 * k)
        out.append(line(60, y - 50, 1020, y - 50, PAPER, 1))
        out.append(put(item['what'], 60, y, a, PAPER, 500, lang, 960, role='label'))
        while width(item['from'], lang, b, 700) + width(item['to'], lang, d_, 900) + 104 * k > 960 and b > 40:
            b -= 2; d_ -= 2; c_ -= 2
        claimed_w = width(item['from'], lang, b, 700)
        out.append(put(item['from'], 60, y + round(76 * k), b, MUTED, 700, lang, 600, role='amount-old'))
        out.append(line(56, y + round(56 * k), 64 + claimed_w, y + round(56 * k), MUTED, 5))
        out.append(put('→', 60 + claimed_w + 26 * k, y + round(74 * k), c_, ACCENT, 900, lang, 100, role='sign'))
        out.append(put(item['to'], 60 + claimed_w + 104 * k, y + round(78 * k), d_, ACCENT, 900, lang, 960 - claimed_w - 104 * k, role='amount'))
        out.append(put(item['why'], 60, y + round(130 * k), a, PAPER, 500, lang, 960, role='reason'))
        y += round(232 * k)
    foot(out, card, lang, True, arrow_on=bool(card['foot'][1:] and card['foot'][1]))
    return finish(out, lang, card['number'], total, True, SRC[lang])


def math(card, lang, total):
    """Light info: how the prepaid money and insurance came off, per person."""
    out = start(lang, False, card.get('tag', ''))
    rows = card['headline'].split('\n')
    for i, v in enumerate(rows):
        out.append(put(v, 60, 214 + i * 92, common_size(rows, 70, lang, 960), INK, 900, lang, 960, role='headline', minimum=50))
    y = 214 + len(rows) * 92 + 20
    for person in card['labels']['people']:
        out.append(paper(60, y - 50, 960, 306, 0, False))
        out.append(obstacle('slip', 60, y - 50, 1032, y + 272))
        with grouped(person['who']):
            out.append(put(person['who'], 96, y + 14, 38, INK, 900, lang, 300, role='label'))
            for j, (label, val) in enumerate(person['lines']):
                last = j == len(person['lines']) - 1
                yy = y + 68 + j * 46 + (22 if last else 0)
                out.append(put(label, 96, yy, 36, INK, 700 if last else 500, lang, 520, role='label'))
                out.append(put(val, 990, yy, 40 if not last else 46, ACCENT if last else INK, 900 if last else 700,
                               lang, 380, 'end', role='amount'))
                if j == len(person['lines']) - 2:
                    out.append(line(96, yy + 22, 990, yy + 22, INK, 2))
        y += 356
    foot(out, card, lang, False, arrow_on=False)
    return finish(out, lang, card['number'], total, False, SRC[lang])


def art_bars(out, x0, y0, x1, y1, card, lang):
    """Claimed vs allowed, two honest bars (allowed share drawn to scale)."""
    L = card['labels']
    rows = L['bars']
    gap = (y1 - y0) / len(rows)
    for i, b in enumerate(rows):
        y = y0 + i * gap + 46
        out.append(put(b['what'], 60, y, 40, PAPER, 700, lang, 560, role='label'))
        out.append(put(b['result'], 1020, y, 40, ACCENT, 900, lang, 420, 'end', role='label'))
        by = y + 30
        out.append(rect(60, by, 960, 74, 'none', 10, MUTED, 4))
        out.append(rect(60, by, max(18, 960 * b['ratio']), 74, ACCENT, 10))
        if b.get('note'):
            out.append(put(b['note'], 60, by + 128, 34, PAPER, 500, lang, 960, role='object'))
    if L.get('legend'):
        out.append(put(L['legend'], 60, y1 - 4, 32, '#C9C3B6', 500, lang, 960, role='object'))


def core(card, lang, total):
    return core_card(card, lang, total, art_bars, SRC[lang])


def proof(card, lang, total):
    """Light info card: what decided each amount (item / outcome / why)."""
    out = start(lang, False, card.get('tag', ''))
    rows = card['headline'].split('\n')
    for i, v in enumerate(rows):
        out.append(put(v, 60, 214 + i * 92, common_size(rows, 70, lang, 960), INK, 900, lang, 960, role='headline', minimum=50))
    y = 214 + len(rows) * 92 + 60
    if len(card['labels']['items']) == 1:
        n, m = len(AUDIT), len(OBSTACLES)
        ft = foot([], card, lang, True, arrow_on=bool(card['foot'][1:] and card['foot'][1]))
        del AUDIT[n:], OBSTACLES[m:]
        y = max(y, round((y - 50 + ft - 60) / 2 - 90))
    for item in card['labels']['items']:
        out.append(line(60, y - 52, 1020, y - 52, INK, 2))
        out.append(put(item['what'], 60, y, 40, INK, 900, lang, 560, role='label'))
        out.append(put(item['outcome'], 1020, y, 40, ACCENT, 900, lang, 420, 'end', role='amount'))
        last, sz, n = block(out, item['why'], 60, y + 62, 38, lang, 960, 500, INK, 1.28, 'reason', 2)
        y = last + 120
    foot(out, card, lang, False, arrow_on=False)
    return finish(out, lang, card['number'], total, False, SRC[lang])


def mark(kind, cx, cy, size, color):
    if kind == 'ok':
        return (f'<path d="M{cx-size*0.45} {cy} L{cx-size*0.12} {cy+size*0.33} L{cx+size*0.5} {cy-size*0.38}" '
                f'fill="none" stroke="{color}" stroke-width="{size*0.16}" stroke-linecap="round" stroke-linejoin="round"/>')
    return (f'<path d="M{cx-size*0.4} {cy-size*0.4} L{cx+size*0.4} {cy+size*0.4} M{cx+size*0.4} {cy-size*0.4} L{cx-size*0.4} {cy+size*0.4}" '
            f'fill="none" stroke="{color}" stroke-width="{size*0.16}" stroke-linecap="round"/>')


def docs(card, lang, total):
    """Light info card (P3 r1): what each paper proves. Left = submitted, right = not submitted (dashed)."""
    out = start(lang, False, card.get('tag', ''))
    rows = card['headline'].split('\n')
    hs = common_size(rows, 76, lang, 960)
    for i, v in enumerate(rows):
        out.append(put(v, 60, 214 + i * 96, hs, INK, 900, lang, 960, role='headline', minimum=52))
    n, m = len(AUDIT), len(OBSTACLES)
    ft = foot([], card, lang, False, arrow_on=False)
    del AUDIT[n:], OBSTACLES[m:]
    top = 214 + (len(rows) - 1) * 96 + 80
    h = min(560, ft - 60 - top)
    assert h >= 440, f'[{lang}] no room for the two papers ({top}..{ft})'
    w, xs = 450, (60, 570)
    for x, d in zip(xs, card['labels']['docs']):
        ok = d['kind'] == 'ok'
        out.append(obstacle(d['title'], x, top, x + w + 14, top + h + 16))
        if ok:
            out.append(paper(x, top, w, h, 0, True))
        else:
            out.append(f'<rect x="{x}" y="{top}" width="{w}" height="{h}" rx="6" fill="none" stroke="{INK}" '
                       f'stroke-width="4" stroke-dasharray="18 12"/>')
        with grouped(d['title']):
            out.append(put(d['title'], x + 36, top + 74, 40, INK, 900, lang, w - 110, role='label'))
            out.append(line(x + 36, top + 102, x + w - 36, top + 102, INK, 2))
            block(out, d['body'], x + 36, top + 178, 50, lang, w - 72, 800, INK, 1.25, 'object', 2)
            out.append(put(d['proves_label'], x + 36, top + 330, 32, MUTED, 700, lang, w - 72, role='label'))
            block(out, d['proves'], x + 36, top + 384, 42, lang, w - 72, 900, ACCENT if ok else INK, 1.2, 'object', 2)
            sy = top + h - 52
            out.append(mark(d['kind'], x + 70, sy - 14, 54, INK if ok else ACCENT))
            out.append(put(d['status'], x + 114, sy, 38, INK if ok else ACCENT, 900, lang, w - 150, role='label'))
    foot(out, card, lang, False, arrow_on=False)
    return finish(out, lang, card['number'], total, False, SRC[lang])



def art_claims(out, x0, y0, x1, y1, card, lang):
    """r8b card-1 hook: the two claims from one crash as two slips, amounts claimed only. No outcome."""
    L = card['labels']
    h = min(380, y1 - y0)
    top = y0 + (y1 - y0 - h) / 2
    w = 430
    for i, (x, ang, c) in enumerate(zip((70, 560), (-4, 3), L['claims'])):
        cx, cy = x + w / 2, top + h / 2
        out.append(f'<g transform="rotate({ang} {cx} {cy})">')
        out.append(rect(x + 14, top + 16, w, h - 20, ACCENT, 16) + rect(x, top, w, h - 20, PAPER, 16, INK, 3))
        out.append(put(c['who'], x + 34, top + 66, 36, INK, 900, lang, w - 68, role='object'))
        out.append(line(x + 34, top + 92, x + w - 34, top + 92, INK, 2))
        block(out, c['what'], x + 34, top + 150, 34, lang, w - 68, 700, INK, 1.25, 'object', 2)
        out.append(put(c['amount'], x + 34, top + h - 60, 64, INK, 900, lang, w - 68, role='amount', minimum=44))
        out.append('</g>')


def core_claims(card, lang, total):
    return core_card(card, lang, total, art_claims, SRC[lang])

LAYOUTS = {f.__name__: f for f in [core, crash, injuries, prepaid, versus, ruling, cuts, math, proof, docs, core_claims]}
