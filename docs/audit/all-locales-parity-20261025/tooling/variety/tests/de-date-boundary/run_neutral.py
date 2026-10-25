#!/usr/bin/env python3
from pathlib import Path
import argparse
import hashlib
import json
import sys

sys.dont_write_bytecode = True
parser = argparse.ArgumentParser()
parser.add_argument('--root', required=True)
parser.add_argument('--report', required=True)
args = parser.parse_args()
root = Path(args.root).resolve()
work = Path(__file__).resolve().parent
destination = Path(args.report).resolve()
assert not destination.exists(), 'Preserve earlier results'
sys.path.insert(0, str(root))
import variety_multilingual as multilingual
import variety_metrics as metrics

fixture = json.loads((work / 'neutral-fixtures.json').read_text())
rows = []
for item in fixture['cases']:
    for space in [' ', '\u00a0', '\u202f']:
        text = item['text'].replace(' ', space)
        wanted = [sentence.replace(' ', space) for sentence in item['sentences']]
        direct = multilingual.split_sentences(text, 'de')
        pipeline = metrics.sentences(text, 'de')
        rows.append({'id':item['id'], 'kind':item['kind'], 'space':repr(space), 'text':text, 'expected':wanted, 'direct':direct, 'pipeline':pipeline, 'literal_slices': ''.join(text.split()) == ''.join(''.join(direct).split()), 'pass':direct == wanted and pipeline == wanted})

# Exercise the actual markdown paragraph pipeline with six declared sentences, not a target manuscript.
chosen = fixture['cases'][:3]
markdown = '---\ntitle: Neutral date boundary fixture\n---\n\n' + '\n\n'.join(item['text'] for item in chosen)
_, body = metrics.strip_fm(markdown)
paragraphs, _, _ = metrics.body_blocks(body, 'de')
actual = [sentence for paragraph in paragraphs for sentence in metrics.sentences(paragraph, 'de')]
wanted = [sentence for item in chosen for sentence in item['sentences']]
pipeline = {'expected':wanted,'actual':actual,'paragraphs':len(paragraphs),'pass':actual == wanted and len(paragraphs) == 3}
result = {'checker_root':str(root),'module_sha256':hashlib.sha256((root / 'variety_multilingual.py').read_bytes()).hexdigest(),'fixture_sha256':hashlib.sha256((work / 'neutral-fixtures.json').read_bytes()).hexdigest(),'rows':rows,'body_pipeline':pipeline,'summary':{'literal_cases':len(fixture['cases']),'space_variants':len(rows),'passed':sum(row['pass'] for row in rows),'failed':sum(not row['pass'] for row in rows),'body_pipeline_pass':pipeline['pass']}}
destination.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(result['summary']))
sys.exit(0 if all(row['pass'] for row in rows) and pipeline['pass'] else 1)
