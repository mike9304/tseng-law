#!/usr/bin/env python3
from pathlib import Path
import argparse
import hashlib
import json
import os
import subprocess
import sys

sys.dont_write_bytecode = True
ap = argparse.ArgumentParser()
ap.add_argument('--tool-root', required=True)
ap.add_argument('--report', required=True)
args = ap.parse_args()
work = Path(__file__).resolve().parent
root = Path(args.tool_root).resolve()
sys.path.insert(0, str(root))
import variety_metrics as vm

sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
manifest = json.loads((work / 'TARGET-INPUTS.json').read_text())
rows = []
for source in manifest['files']:
    path = Path(source['snapshot_path'])
    assert sha(path) == source['sha256']
    text = path.read_text()
    lang = source['lang']
    _, body = vm.strip_fm(text)
    paragraphs, headings, items = vm.body_blocks(body, lang)
    sentences = [s for p in paragraphs for s in vm.sentences(p, lang)]
    command = [sys.executable, str(root / 'variety_metrics.py'), 'check', str(path), '--lang', lang]
    run = subprocess.run(command, capture_output=True, text=True, env={**os.environ, 'PYTHONDONTWRITEBYTECODE':'1'})
    rows.append({**source, 'paragraphs': paragraphs, 'headings': headings, 'list_items': items,
                 'sentences': sentences, 'lengths': [vm.slen(s, lang) for s in sentences],
                 'metrics': vm.metrics(text, lang), 'command': command,
                 'exit': run.returncode, 'stdout': run.stdout, 'stderr': run.stderr})
with Path(args.report).open('x') as handle:
    handle.write(json.dumps({'tool_root': str(root), 'target_inputs_sha256': sha(work / 'TARGET-INPUTS.json'),
                            'rows': rows}, ensure_ascii=False, indent=2) + '\n')
print(json.dumps([{'lang': r['lang'], 'file': Path(r['source_path']).name, 'exit': r['exit'],
                   'sentences':len(r['sentences']), 'cv':r['metrics']['len_cv']} for r in rows]))
