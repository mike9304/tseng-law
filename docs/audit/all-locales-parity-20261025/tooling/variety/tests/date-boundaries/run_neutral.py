#!/usr/bin/env python3
"""Exercise literal neutral display/boundary contracts against a selected copy."""
from pathlib import Path
import argparse
import hashlib
import json
import sys

sys.dont_write_bytecode = True
ap = argparse.ArgumentParser()
ap.add_argument('--root', required=True)
ap.add_argument('--report', required=True)
args = ap.parse_args()
work = Path(__file__).resolve().parent
root = Path(args.root).resolve()
sys.path.insert(0, str(root))
import variety_metrics as metrics
import variety_expansion as expansion

fixture_path = work / 'neutral-fixtures.json'
fixtures = json.loads(fixture_path.read_text())
results = []
for case in fixtures['sentences']:
    paragraphs, headings, items = metrics.body_blocks(case['input'], case['lang'])
    actual = [s for p in paragraphs for s in metrics.sentences(p, case['lang'])]
    checks = {'sentences': actual == case['expected_sentences']}
    if 'expected_paragraph_count' in case:
        checks['paragraph_count'] = len(paragraphs) == case['expected_paragraph_count']
    if 'expected_list_count' in case:
        checks['list_count'] = len(items) == case['expected_list_count']
    lengths = [metrics.slen(s, case['lang']) for s in actual]
    if 'expected_lengths' in case:
        checks['lengths'] = lengths == case['expected_lengths']
    results.append({'id': case['id'], 'checks': checks, 'passed': all(checks.values()),
                    'actual': actual, 'lengths': lengths,
                    'paragraphs': paragraphs, 'list_items': items})
for case in fixtures['visible_text']:
    actual = expansion.visible_text(case['input'])
    results.append({'id': case['id'], 'passed': actual == case['expected'], 'actual': actual})
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
report = {'root': str(root), 'fixture_sha256': sha(fixture_path),
          'production_sha256': {p.name: sha(p) for p in sorted(root.glob('*.py'))},
          'cases': len(results), 'passed': sum(x['passed'] for x in results), 'results': results}
with Path(args.report).open('x') as handle:
    handle.write(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'cases': report['cases'], 'passed': report['passed'],
                  'failed_ids': [x['id'] for x in results if not x['passed']]}))
sys.exit(0 if report['passed'] == report['cases'] else 1)
