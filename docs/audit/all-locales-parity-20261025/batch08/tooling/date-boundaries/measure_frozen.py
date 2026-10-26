#!/usr/bin/env python3
"""Measure a frozen working-tree snapshot, never infer a repository from cwd."""
from pathlib import Path
import argparse
import collections
import contextlib
import hashlib
import io
import json
import statistics
import sys

sys.dont_write_bytecode = True
ap = argparse.ArgumentParser()
ap.add_argument('--tool-root', required=True)
ap.add_argument('--input-root', required=True)
ap.add_argument('--repository', required=True)
ap.add_argument('--report', required=True)
args = ap.parse_args()
work = Path(__file__).resolve().parent
freeze = json.loads((work / 'INPUT-FREEZE.json').read_text())
assert Path(args.repository).resolve() == Path(freeze['R'])
root = Path(args.tool_root).resolve()
source = Path(args.input_root).resolve()
assert source == (work / 'regression-inputs/src/content').resolve()
sys.path.insert(0, str(root))
import variety_metrics as vm

sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
rows = []
for directory, lang in vm.DIRLANG.items():
    for path in sorted((source / directory).glob('*.md')):
        text = path.read_text()
        row = {'file': str(path.relative_to(source)), 'lang': lang, 'sha256': sha(path)}
        _, body = vm.strip_fm(text)
        paragraphs, headings, items = vm.body_blocks(body, lang)
        row.update(paragraphs=paragraphs, headings=headings, list_items=items)
        try:
            mapping = vm.multilingual.sentence_map(str(path), text, lang)
            row['sentences'] = [s for p in paragraphs for s in vm.sentences(p, lang, mapping)]
            row['metrics'] = vm.metrics(text, lang, mapping)
        except vm.multilingual.MeasurementError as error:
            row['error'] = str(error)
        capture = io.StringIO()
        with contextlib.redirect_stdout(capture):
            row['check_exit'] = vm.check(str(path), lang)
        row['check_stdout'] = capture.getvalue()
        rows.append(row)
medians = {}
for lang in vm.SUPPORTED:
    measurements = [r['metrics'] for r in rows if r['lang'] == lang and r.get('metrics')]
    if measurements:
        medians[lang] = {'num_per100': statistics.median(m['num_per100'] for m in measurements)}
for row in rows:
    if row.get('metrics'):
        row['score'] = vm.score(row['metrics'], medians[row['lang']])
summary = {'files': len(rows), 'by_locale': dict(collections.Counter(r['lang'] for r in rows)),
           'check_exits': dict(collections.Counter(r['check_exit'] for r in rows)),
           'measurement_errors': sum('error' in r for r in rows)}
record = {'tool_root': str(root), 'input_root': str(source), 'source_repository': str(Path(args.repository).resolve()),
          'input_freeze_sha256': sha(work / 'INPUT-FREEZE.json'), 'summary': summary,
          'corpus_medians': medians, 'rows': rows}
with Path(args.report).open('x') as handle:
    handle.write(json.dumps(record, ensure_ascii=False, separators=(',', ':')) + '\n')
print(json.dumps(summary))
