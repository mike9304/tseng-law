"""Write card copy as plain text for reviewers: dump.py <case> <lang...>"""
import json, sys
from pathlib import Path
HERE = Path(__file__).parent
DEST = {'c03': 'r16', 'c13': 'c13', 'c09': 'c09'}
case, langs = sys.argv[1], sys.argv[2:]
for lang in langs:
    d = json.loads((HERE / 'copy' / f'{case}-{lang}.json').read_text())
    out = []
    for c in d['cards']:
        out.append(f"[카드 {c['number']:02d} · {c['layout']}]")
        for k, v in c.items():
            if k in ('number', 'layout'):
                continue
            if k == 'labels':
                out += [f'label.{a}: {b}' for a, b in v.items()]
            elif k == 'foot':
                out += [f'foot{i}: {x}' for i, x in enumerate(v, 1) if x]
            elif isinstance(v, str):
                out.append(f'{k}: {v}')
        out.append('')
    p = HERE.parent / DEST[case] / f'cards-{lang}.txt'
    p.write_text('\n'.join(out))
    print('wrote', p)
