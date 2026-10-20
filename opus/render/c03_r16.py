"""C03 r16 cards. Layout geometry follows the approved r15 cards (c03_layouts.py);
copy comes from copy/c03-<lang>.json. Explicit '\n' in copy = authored line break."""
import re
from cardkit import *

SRC = {
    'ko': ('대만 스린지방법원 간이법정', '115年度士小字第864號 · 2026.06.30 · 1심'),
    'zh-TW': ('士林地院 115年度士小字第864號', '2026.06.30·一審'),
    'ja': ('台湾・士林地方法院 士林簡易庭', '115年度士小字第864號・2026.06.30・一審'),
    'en': ('Shilin District Court · 115 Shi-Xiao-Zi 864', 'June 30, 2026 · small-claims ruling'),
}
LAW = {
    'ko': ('대만 민법 249조', '제2·3·4호'),
    'zh-TW': ('民法第249條', '第2、3、4款'),
    'ja': ('台湾民法第249条', '第2・3・4号'),
    'en': ('Taiwan Civil Code Art. 249', 'Items 2 to 4'),
}


def lines(value, lang, size, maxw, weight=900):
    if '\n' in value:
        return value.split('\n')
    rows = wrap(value, lang, size, maxw, weight)
    return rows


def foot(out, card, lang, dark, y1=1072, y2=1170):
    """Two-line lower text: context line + open-loop line with arrow."""
    fg = PAPER if dark else INK
    rows = card['foot']
    spec = [(rows[-1], 50, 700, 860, 'open-loop', 2)]
    if len(rows) == 2:
        spec.insert(0, (rows[0], 46, 500, 960, 'body', 2))
    top = stack(out, spec, 1185, lang, fg)
    assert top >= 1000, f'foot too tall ({top})'
    out.append(arrow(944, 1165, 65, ACCENT))


def conflict(card, lang, total):
    out = start(lang, True, card['tag'])
    out.append(put(card['labels']['amount_label'], 64, 194, 39, PAPER, 500, lang, 900, role='label'))
    num = card['labels'].get('amount', '21,800')
    unit = card['labels'].get('unit', '元')
    out.append(put(num, 48, 439, 250, ACCENT, 900, lang, 866, role='amount', minimum=200))
    nw = width(num, lang, 250, 900)
    if unit:
        out.append(put(unit, after(48, num, last_size(), unit, 77, lang), 433, 77, ACCENT, 900, lang, 160, role='unit'))
    # contract paper (unsigned) behind the bubble
    out.append(f'<g transform="rotate(-9 330 810)">{paper(79, 659, 502, 301, 0, False)}'
               f'{line(114, 887, 300, 887, INK, 2)}</g>')
    out.append(bubble(298, 540, 714, 315, PAPER, 'left', -3))
    rows = lines(card['headline'], lang, 74, 625)
    assert len(rows) <= 2, rows
    y0 = 693 if len(rows) == 2 else 745
    for i, v in enumerate(rows):
        out.append(put(v, 338, y0 + i * 102, common_size(rows, 74, lang, 625), INK, 900, lang, 625, role='headline'))
    foot(out, card, lang, True)
    return finish(out, lang, card['number'], total, True, SRC[lang])


def space(card, lang, total):
    out = start(lang, False, card['tag'])
    out += [bubble(60, 152, 960, 187, INK, 'left', -2),
            put(card['speaker'], 94, 204, 32, PAPER, 500, lang, 870, role='speaker'),
            put(card['headline'], 94, 291, 72, PAPER, 900, lang, 872, role='headline', minimum=48)]
    out += [f'<path d="M130 451 L792 389 L999 545 V941 L130 988 Z M130 451 V988 M792 389 V818 L999 941 M130 988 L792 818" '
            f'fill="none" stroke="{INK}" stroke-width="4"/>',
            f'<path d="M97 492 h-30 v453 h30 M1000 492 h30 v453 h-30" fill="none" stroke="{ACCENT}" stroke-width="13"/>',
            f'<image href="{data_uri("boxes-editorial.png")}" x="131" y="447" width="858" height="499" preserveAspectRatio="xMidYMid meet"/>']
    foot(out, card, lang, False)
    return finish(out, lang, card['number'], total, False, SRC[lang])


def agreement(card, lang, total):
    out = start(lang, False, card['tag'])
    L = card['labels']
    out += [f'<path d="M880 135 H1080 V1060 L930 1095 Z" fill="{ACCENT}"/>',
            bubble(158, 156, 862, 187, INK, 'right', 2),
            put(card['speaker'], 192, 207, 32, PAPER, 500, lang, 780, role='speaker'),
            put(card['headline'], 192, 294, 70, PAPER, 900, lang, 780, role='headline', minimum=48)]
    out.append('<g transform="rotate(-5 510 680)">')
    with grouped('memo'):
        out += [paper(94, 427, 832, 505, 0, True),
                put(L['terms'], 137, 501, 34, INK, 500, lang, 700, role='object'),
                line(137, 535, 883, 535, INK, 2),
                put(L['rent'], 137, 603, 34, INK, 500, lang, 450, role='object'),
                put('21,800', 137, 752, 135, INK, 900, lang, 520, role='amount', minimum=100),
                put(L['unit'], after(137, '21,800', 135, L['unit'], 50, lang, 12, 700), 752, 50, INK, 700, lang, 110, role='unit'),
                line(720, 574, 720, 820, INK, 2),
                put(L['min'], 768, 603, 34, INK, 500, lang, 140, role='object'),
                put('1', 768, 752, 135, ACCENT, 900, lang, 100, role='amount'),
                put(L['year'], 857, 752, 47, INK, 700, lang, 60, role='unit', minimum=32)]
    out.append('</g>')
    if L.get('memo_note'):
        out += [bubble(415, 927, 593, 113, INK, 'left', -2),
                put(L['memo_note'], 449, 1001, 38, PAPER, 700, lang, 525, role='object')]
    block(out, card['foot'][1], 60, 1170, 50, lang, 860, 700, INK, role='open-loop', max_lines=1)
    out.append(arrow(944, 1150, 65, ACCENT))
    return finish(out, lang, card['number'], total, False, SRC[lang])


def message(card, lang, total):
    out = start(lang, True, card['tag'])
    L = card['labels']
    out.append(put(L['context'], 60, 214, 38, PAPER, 500, lang, 950, role='object'))
    out.append('<g transform="rotate(-4 540 642)">')
    with grouped('msg'):
        out += [bubble(77, 300, 926, 643, PAPER, 'left'),
                put(L['amount'], 126, 464, 118, INK, 900, lang, 822, role='amount', minimum=80),
                line(126, 510, 951, 510, INK, 2)]
        rows = card['headline'].split('\n')
        for i, v in enumerate(rows):
            if i == L.get('mark', 0):
                ww = min(842, width(v, lang, 84, 900) + 24)
                out.append(rect(114, 582 + i * 126, ww, 110, ACCENT))
            out.append(put(v, 126, 668 + i * 126, common_size(rows, 84, lang, 820), INK, 900, lang, 820, role='headline', minimum=56))
        if L.get('note'):
            out.append(put(L['note'], 126, 668 + len(rows) * 126 - 22, 36, INK, 500, lang, 820, role='object'))
    out.append('</g>')
    foot(out, card, lang, True)
    return finish(out, lang, card['number'], total, True, SRC[lang])


def judgment(card, lang, total):
    out = start(lang, False, card['tag'])
    L = card['labels']
    out.append(rect(60, 160, 960, 191, ACCENT))
    rows = lines(card['headline'], lang, 76, 896)
    y0 = 285 if len(rows) == 1 else 243
    for i, v in enumerate(rows):
        out.append(put(v, 91, y0 + i * 88, common_size(rows, 76, lang, 896), INK, 900, lang, 896, role='headline', minimum=48))
    out.append(f'<g transform="rotate(-9 248 601)">{paper(78, 472, 340, 258, 0, False)}')
    with grouped('contract'):
        block(out, L['contract'], 113, 540, 40, lang, 270, 500, INK, 1.2, 'object', 2)
    out.append(line(113, 657, 383, 657, INK, 2) + '</g>')
    out.append('<g transform="rotate(5 730 626)">')
    with grouped('terms'):
        out.append(paper(474, 411, 516, 430, 0, True))
        block(out, L['agreed'], 513, 480, 40, lang, 421, 900, INK, 1.3, 'object', 2)
        out.append(line(513, 566, 944, 566, INK, 2))
        out.append(put(L['rent'], 513, 638, 40, INK, 700, lang, 420, role='object'))
        out.append(put(L['period'], 513, 705, 40, INK, 700, lang, 420, role='object'))
    out.append('</g>')
    out += [bubble(413, 764, 588, 182, INK, 'left', -3), obstacle('msgbubble', 380, 750, 1010, 990)]
    with grouped('msgbubble'):
        block(out, L['message'], 451, 846 if len(wrap(L['message'], lang, 44, 509, 900)) > 1 else 872,
              44, lang, 509, 900, PAPER, 1.25, 'object', 2)
    a, b = card['foot']
    top = stack(out, [(a, 44, 500, 960, 'body', 2), (b, 48, 700, 860, 'open-loop', 2)], 1185, lang, INK, gap=20)
    assert top >= 990, f'judgment foot too tall ({top})'
    out.append(arrow(944, 1165, 65, ACCENT))
    return finish(out, lang, card['number'], total, False, SRC[lang])


def envelope(x, y, w, h, ghost=False):
    stroke = PAPER if ghost else INK
    dash = ' stroke-dasharray="14 10"' if ghost else ''
    out = []
    if not ghost:
        out.append(rect(x + 12, y + 13, w, h, INK, 9, ACCENT, 2))
    out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="9" fill="{INK if ghost else PAPER}" stroke="{stroke}" stroke-width="4"{dash}/>')
    out.append(f'<path d="M{x+3} {y+8} L{x+w/2} {y+78} L{x+w-3} {y+8} M{x+4} {y+h-6} l76 -62 M{x+w-4} {y+h-6} l-64 -58" '
               f'fill="none" stroke="{stroke}" stroke-width="3"{dash}/>')
    return ''.join(out)


def deposit_rule(card, lang, total):
    out = start(lang, True, card['tag'])
    L = card['labels']
    rows = lines(card['headline'], lang, 80, 950)
    for i, v in enumerate(rows):
        out.append(put(v, 60, 210 + i * 100, common_size(rows, 80, lang, 950), PAPER, 900, lang, 950, role='headline', minimum=56))
    for x, side, number, unit_key, note_key in [(60, 'payer', '0', 'zero_unit', 'payer_note'),
                                                (556, 'recipient', '2', 'multiplier', 'recipient_note')]:
        ghost = side == 'payer'
        party = L[side].split('\n')
        assert len(party) <= 2
        for i, v in enumerate(party):
            out.append(put(v, x + 231, 440 + i * 56, 44, PAPER, 700, lang, 470, 'middle', role='rule-party'))
        if not ghost:
            out.append('<g transform="rotate(8 798 737)">' + envelope(x + 45, 594, 401, 240) + '</g>')
        ex, ey, ew, eh = x + 18, 636, 426, 246
        out.append(f'<g transform="rotate(-6 {ex+ew/2} {ey+eh/2})">')
        out.append(envelope(ex, ey, ew, eh, ghost))
        with grouped(side):
            nwid = width(number, lang, 217, 900)
            uw = width(L[unit_key], lang, 72, 900) if L[unit_key] else 0
            nx = ex + (ew - nwid - (10 + uw if uw else 0)) / 2
            out.append(put(number, nx, 865, 217, ACCENT, 900, lang, 250, role='amount'))
            if L[unit_key]:
                out.append(put(L[unit_key], nx + nwid + 10, 859, 72, PAPER if ghost else INK, 900, lang, 200, role='unit'))
        out.append('</g>')
        out.append(put(L[note_key], x + 12, 972, 42, PAPER, 500, lang, 450, role='rule-result'))
    out.append(f'<path d="M1006 638 Q1044 543 694 588 m28 -26 -28 26 34 9" fill="none" stroke="{ACCENT}" stroke-width="8"/>')
    block(out, card['foot'][0], 60, 1100, 46, lang, 960, 500, PAPER, 1.3, 'rule-condition', 2)
    return finish(out, lang, card['number'], total, True, LAW[lang])


def evidence(card, lang, total):
    out = start(lang, False, card.get('tag', ''))
    L = card['labels']
    rows = lines(card['headline'], lang, 76, 950)
    for i, v in enumerate(rows):
        out.append(put(v, 60, 214 + i * 100, common_size(rows, 76, lang, 950), INK, 900, lang, 950, role='headline', minimum=56))
    out.append(paper(60, 395, 454, 420, 0, True))
    block(out, L['msg_context'], 88, 464, 34, lang, 394, 700, INK, 1.2, 'evidence-context', 2)
    out.append(line(88, 538, 482, 538, INK, 2))
    out.append(put(L['msg_amount'], 88, 615, 70, INK, 900, lang, 394, role='evidence-amount', minimum=56))
    out.append(put(L['msg_quote'], 88, 718, 78, ACCENT, 900, lang, 394, role='evidence-quote', minimum=56))
    out.append(line(88, 735, 482, 735, ACCENT, 4))
    if L.get('msg_translation'):
        out.append(put(L['msg_translation'], 88, 785, 42, INK, 500, lang, 394, role='evidence-translation'))
    out.append(paper(566, 395, 454, 420, 0, True))
    block(out, L['terms_context'], 594, 464, 34, lang, 394, 700, INK, 1.2, 'evidence-context', 2)
    out.append(line(594, 538, 988, 538, INK, 2))
    block(out, L['terms_1'], 594, 620, 46, lang, 394, 700, INK, 1.2, 'evidence-term', 2)
    block(out, L['terms_2'], 594, 760, 46, lang, 394, 700, INK, 1.2, 'evidence-term', 1)
    out.append(f'<path d="M287 830 V848 H793 V830 M540 848 V860" fill="none" stroke="{ACCENT}" stroke-width="5"/>')
    out.append(put(L['note'], 60, 908, 32, INK, 400, lang, 960, role='evidence-notice'))
    rows, sz = fit_rows(card['foot'][0], lang, 50, 900, 700, 3)
    step = round(sz * 1.32)
    box_h = (len(rows) - 1) * step + round(sz * 1.9)
    y0 = 960 + (250 - box_h) / 2
    out.append(rect(60, y0, 960, box_h, INK, 14))
    out.append(rect(60, y0, 14, box_h, ACCENT))
    for i, r in enumerate(rows):
        out.append(put(r, 100, y0 + sz * 1.25 + i * step, sz, PAPER, 700, lang, 900, role='practical', minimum=sz))
    return finish(out, lang, card['number'], total, False, SRC[lang])


def art_lease(out, x0, y0, x1, y1, card, lang):
    """Unsigned lease (left) + the deposit as a paper slip (right), vertically centred in the box."""
    L = card['labels']
    h = min(400, y1 - y0)
    top = y0 + (y1 - y0 - h) / 2
    cx, cy = 300, top + h / 2
    out.append(f'<g transform="rotate(-6 {cx} {cy})">')
    out.append(paper(90, top + 10, 420, h - 30, 0, True))
    out.append(put(L['paper_title'], 128, top + 82, 40, INK, 900, lang, 320, role='object'))
    out.append(line(128, top + 112, 470, top + 112, INK, 2))
    for k in range(3):
        out.append(line(128, top + 160 + k * 38, 470 - k * 60, top + 160 + k * 38, MUTED, 6))
    sy = top + h - 92
    out.append(line(128, sy, 300, sy, ACCENT, 4, '12 9') + line(320, sy, 470, sy, ACCENT, 4, '12 9'))
    out.append(put(L['unsigned'], 128, sy + 52, 34, ACCENT, 900, lang, 330, role='object'))
    out.append('</g>')
    bx, bw, bh = 560, 440, 250
    by = top + (h - bh) / 2 + 10
    out.append(f'<g transform="rotate(4 {bx + bw / 2} {by + bh / 2})">')
    out.append(rect(bx + 14, by + 16, bw, bh, ACCENT, 16) + rect(bx, by, bw, bh, PAPER, 16, INK, 3))
    out.append(put(L['amount_label'], bx + 36, by + 66, 34, INK, 700, lang, bw - 72, role='object'))
    out.append(line(bx + 36, by + 92, bx + bw - 36, by + 92, INK, 2))
    out.append(put(L['amount'], bx + 36, by + 196, 92, INK, 900, lang, bw - 72, role='amount', minimum=60))
    out.append('</g>')


def core(card, lang, total):
    return core_card(card, lang, total, art_lease, SRC[lang])



def mark(kind, cx, cy, size, color):
    if kind == 'ok':
        return (f'<path d="M{cx-size*0.45} {cy} L{cx-size*0.12} {cy+size*0.33} L{cx+size*0.5} {cy-size*0.38}" '
                f'fill="none" stroke="{color}" stroke-width="{size*0.16}" stroke-linecap="round" stroke-linejoin="round"/>')
    return (f'<path d="M{cx-size*0.4} {cy-size*0.4} L{cx+size*0.4} {cy+size*0.4} M{cx+size*0.4} {cy-size*0.4} L{cx-size*0.4} {cy+size*0.4}" '
            f'fill="none" stroke="{color}" stroke-width="{size*0.16}" stroke-linecap="round"/>')


def foot_plain(out, card, lang, bottom=1185):
    """Lower text without the open-loop arrow (last card). Returns top y."""
    a, b = (card['foot'] + ['', ''])[:2]
    return stack(out, [(a, 46, 500, 960, 'body', 2), (b, 50, 700, 960, 'open-loop', 2)], bottom, lang, INK)


def proof(card, lang, total):
    """Light last card (r7 fix2): what was on record vs. what the renter had to prove. Same geometry as c09_r2.docs."""
    out = start(lang, False, card.get('tag', ''))
    rows = card['headline'].split('\n')
    hs = common_size(rows, 76, lang, 960)
    for i, v in enumerate(rows):
        out.append(put(v, 60, 214 + i * 96, hs, INK, 900, lang, 960, role='headline', minimum=52))
    n, m = len(AUDIT), len(OBSTACLES)
    ft = foot_plain([], card, lang)
    del AUDIT[n:], OBSTACLES[m:]
    top = 214 + (len(rows) - 1) * 96 + 80
    h = min(560, ft - 60 - top)
    assert h >= 440, f'[{lang}] no room for the two papers ({top}..{ft})'
    w, xs = 450, (60, 570)
    two = any(len(d['proves'].split('\n') if '\n' in d['proves'] else wrap(d['proves'], lang, 42, w - 72, 900)) > 1
              for d in card['labels']['docs'])
    lab_y, st_off = (340, 40) if two else (360, 52)
    for x, d in zip(xs, card['labels']['docs']):
        ok = d['kind'] == 'ok'
        out.append(obstacle(d['title'], x, top, x + w + 14, top + h + 16))
        if ok:
            out.append(paper(x, top, w, h, 0, True))
        else:
            out.append(f'<rect x="{x}" y="{top}" width="{w}" height="{h}" rx="6" fill="none" stroke="{INK}" '
                       f'stroke-width="4" stroke-dasharray="18 12"/>')
        with grouped(d['title']):
            block(out, d['title'], x + 36, top + 74, 40, lang, w - 72, 900, INK, 1.2, 'label', 2)
            ty = top + 74 + (len(wrap(d['title'], lang, 40, w - 72, 900)) - 1) * 48
            out.append(line(x + 36, ty + 28, x + w - 36, ty + 28, INK, 2))
            by, _, _ = block(out, d['body'], x + 36, ty + 104, 44, lang, w - 72, 800, INK, 1.25, 'object', 3)
            assert by <= top + 300, f'[{lang}] proof body too tall ({by - top})'
            out.append(put(d['proves_label'], x + 36, top + lab_y, 32, MUTED, 700, lang, w - 72, role='label'))
            block(out, d['proves'], x + 36, top + lab_y + 54, 42, lang, w - 72, 900, ACCENT if ok else INK, 1.2, 'object', 2)
            sy = top + h - st_off
            out.append(mark(d['kind'], x + 70, sy - 14, 54, INK if ok else ACCENT))
            out.append(put(d['status'], x + 114, sy, 38, INK if ok else ACCENT, 900, lang, w - 150, role='label'))
    foot_plain(out, card, lang)
    return finish(out, lang, card['number'], total, False, SRC[lang])

LAYOUTS = {f.__name__: f for f in [core, conflict, space, agreement, message, judgment, deposit_rule, evidence, proof]}
