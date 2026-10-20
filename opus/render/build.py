"""Render cards: python3 build.py <case> <lang> [<lang>...] --out <dir>
case: c03 | c13 | c09. Copy: copy/<case>-<lang>.json. Writes images/<lang>/card-NN.{svg,png},
<lang>-overview.png and render-audit-<lang>.json into --out. Exits 1 on any audit problem."""
import json, sys, re, importlib
from pathlib import Path
import cardkit
from cardkit import *

MODULES = {'c03': 'c03_r16', 'c13': 'c13_r3', 'c09': 'c09_r2'}


def overview(paths, outfile):
    cols = 4 if len(paths) >= 7 else 3
    scale = 0.34 if cols == 4 else 0.42
    gap = 22
    ww, hh = W * scale, H * scale
    rows = (len(paths) + cols - 1) // cols
    width_ = round(cols * ww + (cols + 1) * gap)
    height_ = round(rows * hh + (rows + 1) * gap)
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{width_}" height="{height_}" viewBox="0 0 {width_} {height_}">',
           rect(0, 0, width_, height_, INK)]
    for i, p in enumerate(paths):
        inner = re.sub(r'^<svg[^>]+>|</svg>$', '', p.read_text())
        count = min(cols, len(paths) - (i // cols) * cols)
        offset = (cols - count) * (ww + gap) / 2
        out.append(f'<g transform="translate({gap+offset+(i%cols)*(ww+gap)} {gap+(i//cols)*(hh+gap)}) scale({scale})">{inner}</g>')
    out.append('</svg>')
    outfile.write_text(''.join(out))
    render(outfile, outfile.with_suffix('.png'))
    outfile.unlink()


def main():
    args = sys.argv[1:]
    out_dir = Path(args[args.index('--out') + 1])
    case = args[0]
    langs = [a for a in args[1:args.index('--out')]]
    setup_fonts()
    mod = importlib.import_module(MODULES[case])
    failed = False
    for lang in langs:
        copy = json.loads((ROOT / 'copy' / f'{case}-{lang}.json').read_text())
        cards = copy['cards']
        img = out_dir / 'images' / lang
        img.mkdir(parents=True, exist_ok=True)
        svgs, audit = [], []
        for card in cards:
            try:
                svg = mod.LAYOUTS[card['layout']](card, lang, len(cards))
            except (ValueError, AssertionError) as e:
                print(f'{case} {lang} card {card["number"]:02d} FIT-ERROR {e}')
                failed = True
                continue
            rows = [dict(r) for r in cardkit.AUDIT]
            problems = audit_rows(rows)
            obstacles = [list(o) for o in cardkit.OBSTACLES]
            sp = img / f'card-{card["number"]:02d}.svg'
            sp.write_text(svg)
            render(sp, sp.with_suffix('.png'))
            svgs.append(sp)
            audit.append({'card': card['number'], 'layout': card['layout'], 'problems': problems,
                          'min_size': min(r['size'] for r in rows),
                          'rows': [{k: (round(v, 1) if isinstance(v, float) else v) for k, v in r.items() if k != 'group'}
                                   | {'bbox': [round(b, 1) for b in r['bbox']]} for r in rows]})
            status = 'OK' if not problems else 'PROBLEMS'
            print(f'{case} {lang} card {card["number"]:02d} {card["layout"]:<14} min {audit[-1]["min_size"]}px {status}')
            for p in problems:
                print('   -', p)
                failed = True
        overview(svgs, out_dir / f'{lang}-overview.svg')
        (out_dir / '_review').mkdir(exist_ok=True)
        (out_dir / '_review' / f'render-audit-{lang}.json').write_text(json.dumps(audit, ensure_ascii=False, indent=1))
        for sp in svgs:
            sp.unlink()  # keep PNG deliverables only; SVG regenerated on demand
    sys.exit(1 if failed else 0)


if __name__ == '__main__':
    main()
