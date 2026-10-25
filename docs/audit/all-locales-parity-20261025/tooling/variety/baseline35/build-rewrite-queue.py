#!/usr/bin/env python3
"""Rank published columns (origin/main) by monotony score → ~/tseng-lanes-shared/REWRITE-QUEUE.tsv (top N, default 30).
usage: build-rewrite-queue.py [--top 30] [--repo ~/Projects/tseng-law]   (uses git archive origin/main; read-only)"""
import os, sys, json, subprocess, tempfile, argparse, shutil
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import variety_metrics as V
ap = argparse.ArgumentParser(); ap.add_argument('--top', type=int, default=30); ap.add_argument('--repo', default=os.path.expanduser('~/Projects/tseng-law'))
a = ap.parse_args()
tmp = tempfile.mkdtemp(prefix='rwq-')
arc = subprocess.run(['git', '-C', a.repo, 'archive', 'origin/main', *[f'src/content/{d}' for d in V.DIRLANG]], capture_output=True, check=True).stdout
subprocess.run(['tar', '-x', '-C', tmp], input=arc, check=True)
head = subprocess.run(['git', '-C', a.repo, 'rev-parse', '--short', 'origin/main'], capture_output=True, text=True).stdout.strip()
rows = []
for d, lang in V.DIRLANG.items():
    dd = os.path.join(tmp, 'src/content', d)
    for f in sorted(os.listdir(dd)):
        if not f.endswith('.md'): continue
        m = V.metrics(open(os.path.join(dd, f), encoding='utf-8').read(), lang)
        if not m: continue
        m.update(file=f'src/content/{d}/{f}', num=f.split('-')[0], slug=f[:-3].split('-', 1)[1]); rows.append(m)
for r in rows: r['score'] = V.score(r, {})
def reasons(m):
    R = []
    if m['len_cv'] < 0.45: R.append(f"flat sentence lengths cv {m['len_cv']}")
    if m['short_share'] < 0.08: R.append(f"very short sentences {round(100*m['short_share'])}%")
    if m['even_run3'] > 0.15: R.append(f"same-length runs {round(100*m['even_run3'])}%")
    if m['cite_end_share'] > 0.30: R.append(f"(statute)-closing sentences {round(100*m['cite_end_share'])}%")
    if m['cite_para_share'] > 0.75: R.append(f"citation in {round(100*m['cite_para_share'])}% of paragraphs")
    if m['top_opener_n'] > max(2, m['paras'] // 8): R.append(f"{m['top_opener_n']} paragraphs open with '{m['top_opener']}'")
    if m['contrast'] > 3: R.append(f"contrast template x{m['contrast']}")
    if m['caveat'] > 4: R.append(f"caveat openers x{m['caveat']}")
    if m['hypo_open']: R.append('stock hypothetical opener')
    if m['lang'] == 'ja' and min(m['ja_desu'], m['ja_da']) >= 3: R.append(f"ja register mixed ({m['ja_desu']} desu/masu, {m['ja_da']} da/dearu)")
    if m['questions'] == 0: R.append('no question in body')
    return '; '.join(R)
rows.sort(key=lambda r: -r['score'])
out = os.path.expanduser('~/tseng-lanes-shared/REWRITE-QUEUE.tsv')
with open(out + '.tmp', 'w', encoding='utf-8') as f:
    f.write(f'# rank\tlang\tnumber\tslug\tmonotony_score\treasons\tfile\tpublished\t(origin/main {head}; score 0-100, higher = more monotonous; variety_metrics.py)\n')
    for i, r in enumerate(rows[:a.top], 1):
        f.write(f"{i}\t{r['lang']}\t{r['num']}\t{r['slug']}\t{r['score']}\t{reasons(r)}\t{r['file']}\t\n")
os.replace(out + '.tmp', out); shutil.rmtree(tmp, ignore_errors=True)
print(f'{len(rows)} columns scored; top {a.top} → {out}')
