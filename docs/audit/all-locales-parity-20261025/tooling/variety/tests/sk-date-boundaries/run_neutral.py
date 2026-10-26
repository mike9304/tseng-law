#!/usr/bin/env python3
"""Exercise literal neutral boundary contracts against the specified real tool."""
from pathlib import Path
import argparse
import datetime
import hashlib
import json
import re
import sys

sys.dont_write_bytecode = True
ap = argparse.ArgumentParser()
ap.add_argument('--root', required=True)
ap.add_argument('--fixtures', required=True)
ap.add_argument('--report', required=True)
args = ap.parse_args()
root = Path(args.root).resolve()
fixture = Path(args.fixtures).resolve()
sys.path.insert(0, str(root))
import variety_metrics as vm

cases = json.loads(fixture.read_text())
rows = []
for case in cases['sentences']:
    actual = vm.sentences(case['input'], 'sk')
    visible = vm.multilingual.expansion.visible_text(case['input'])
    preserved = re.sub(r'\s+', '', ''.join(actual)) == re.sub(r'\s+', '', visible)
    rows.append({'id': case['id'], 'kind': 'sentence', 'input': case['input'],
                 'expected': case['expected'], 'actual': actual,
                 'units': [vm.slen(t, 'sk') for t in actual],
                 'visibleTextPreservedExceptWhitespace': preserved,
                 'passed': actual == case['expected'] and preserved})
for case in cases['blocks']:
    paras, heads, items = vm.body_blocks(case['input'], 'sk')
    actual = [s for p in paras for s in vm.sentences(p, 'sk')]
    passed = (paras == case['expectedParagraphs'] and items == case['expectedListItems']
              and actual == case['expectedSentences'])
    rows.append({'id': case['id'], 'kind': 'block', 'input': case['input'],
                 'expected': case['expectedSentences'], 'actual': actual,
                 'paragraphs': paras, 'headings': heads, 'listItems': items, 'passed': passed})
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
result = {'atUTC': datetime.datetime.now(datetime.timezone.utc).isoformat(),
          'root': str(root), 'fixture': str(fixture), 'fixtureSHA256': sha(fixture),
          'tools': {n: sha(root/n) for n in ['variety_metrics.py','variety_multilingual.py','variety_expansion.py','profiles/sk.json']},
          'cases': len(rows), 'passed': sum(r['passed'] for r in rows),
          'failed': [r['id'] for r in rows if not r['passed']], 'rows': rows}
with Path(args.report).open('x') as f:
    f.write(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({k:result[k] for k in ['cases','passed','failed']},ensure_ascii=False))
sys.exit(0 if all(r['passed'] for r in rows) else 1)
