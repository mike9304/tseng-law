import collections
import datetime
import hashlib
import json
import os
from pathlib import Path
import re
import sys

BASE = Path('/Users/son7/tseng-all-language-columns-20261025/batch09')
CHECKS = BASE / 'checks'
SHARED = Path('/Users/son7/tseng-lanes-shared/variety')
sys.path.insert(0, str(SHARED))
import variety_metrics as vm

def digest(data):
    return hashlib.sha256(data).hexdigest()

def sha(path):
    return digest(Path(path).read_bytes())

def read(name):
    return json.loads((CHECKS / name).read_text())

output = CHECKS / 'sk-independent-checks.json'
assert not output.exists(), 'Preserve prior independent evidence'
manifest = read('sk-final-manifest.json')
inputs = read('sk-inputs.json')['records']
refs = {r['file']: r['sha256'] for r in manifest['refs']}
refs[str(CHECKS / 'sk-final-manifest.json')] = sha(CHECKS / 'sk-final-manifest.json')
input_delta = []
for r in inputs:
    now = sha(r['file'])
    if now != r['sha256']:
        assert r['file'] == str(SHARED / 'profiles/sk.json')
        assert now == '9c1b41e0373934c758fe139bdfdb3ea229d9fe628d967d01faaf8c251968ef8c'
        input_delta.append({'file': r['file'], 'before': r['sha256'], 'current': now,
                            'reason': 'Root-approved SK date-boundary profile installation'})
    refs[r['file']] = now
guard = read('sk-tool-guard-final.json')
for p, s in guard['toolAfter'].items():
    assert sha(p) == s, ('author-run tool drift', p)
    refs[p] = s
receipt = guard['installationReceipt']
assert sha(receipt['file']) == receipt['sha256']
refs[receipt['file']] = receipt['sha256']
primary = BASE.parent / 'batch06/research/retained/zh-hant-ev-primary-recovered.md'
refs[str(primary)] = sha(primary)
for p, s in refs.items():
    assert sha(p) == s, ('reference drift', p)

initials = {r['file']: r for r in read('sk-initial-manifest.json')['files']}
journals = [read('sk-self-edits-r%d.json' % i) for i in (1, 2, 3)]
metrics = {r['path']: r for r in read('sk-variety-final.json')['results']}
arrays = {r['path']: r for r in read('sk-sentences-final.json')}
metadata = {r['file']: r for r in read('sk-metadata-final.json')['files']}
snapshot_dir = CHECKS / 'sk-independent-r1-snapshot'
snapshot_dir.mkdir(exist_ok=False)
rows = []
for frozen in manifest['manuscripts']:
    p = Path(frozen['file'])
    raw = p.read_text()
    assert digest(raw.encode()) == frozen['sha256']
    refs[str(p)] = frozen['sha256']
    initial_row = initials[str(p)]
    initial = Path(initial_row['snapshot']).read_text()
    assert digest(initial.encode()) == initial_row['sha256']
    work = initial
    operations = []
    stage_results = []
    for stage in journals:
        f = next(r for r in stage['files'] if r.get('path', r.get('file')) == str(p))
        before = f.get('beforeSha256', f.get('beforeSHA256'))
        after = f.get('afterSha256', f.get('afterSHA256'))
        assert digest(work.encode()) == before
        for c in f['changes']:
            at = c['startBeforeEdit']
            assert work[at:at + len(c['old'])] == c['old']
            work = work[:at] + c['new'] + work[at + len(c['old']):]
            operations.append(c)
        assert digest(work.encode()) == after
        stage_results.append({'changes': len(f['changes']), 'before': before, 'after': after})
    assert work == raw
    reverse = raw
    for c in reversed(operations):
        at = c['startBeforeEdit']
        assert reverse[at:at + len(c['new'])] == c['new']
        reverse = reverse[:at] + c['old'] + reverse[at + len(c['new']):]
    assert reverse == initial
    (snapshot_dir / p.name).write_text(raw)
    _, body = vm.strip_fm(raw)
    paragraphs, heads, items = vm.body_blocks(body, 'sk')
    actual = [s for para in paragraphs for s in vm.sentences(para, 'sk')]
    recorded = [s['text'] for para in arrays[str(p)]['paragraphs'] for s in para['sentences']]
    assert actual == recorded
    assert arrays[str(p)]['sha256'] == frozen['sha256']
    check = metrics[str(p)]
    assert check['sha256'] == frozen['sha256'] and check['exitCode'] == 0
    assert check['argv'][-2:] == ['--lang', 'sk']
    assert 'OK — no variety limit violated' in check['stdout']
    computed = vm.metrics(raw, 'sk')
    assert computed == check['metrics']
    lengths = [vm.slen(s, 'sk') for s in actual]
    digits_unchanged = re.findall(r'\d+', initial) == re.findall(r'\d+', raw)
    url_pattern = r'\]\((https?://[^\s)]+)\)'
    urls_unchanged = re.findall(url_pattern, initial) == re.findall(url_pattern, raw)
    assert digits_unchanged and urls_unchanged
    rows.append({'id': int(p.name[:3]), 'file': str(p), 'sha256': frozen['sha256'],
                 'initialSHA256': initial_row['sha256'], 'exactForwardAndReverse': True,
                 'editCount': len(operations), 'stageResults': stage_results,
                 'numericSequenceUnchanged': digits_unchanged, 'URLSequenceUnchanged': urls_unchanged,
                 'requiredOfficialURLs': metadata[str(p)]['officialUrls'],
                 'actualCLIReused': check, 'paragraphs': paragraphs,
                 'sentences': actual, 'sentenceLengths': lengths, 'heads': heads, 'listItems': items,
                 'authorArrayExact': True, 'metricsRecomputedEqual': True,
                 'shortSentences': [s for s,n in zip(actual,lengths) if n <= 8],
                 'longSentences': [s for s,n in zip(actual,lengths) if n >= 32],
                 'paragraphOpeners': [x['opener'] for x in arrays[str(p)]['paragraphs']]})
assert sum(r['editCount'] for r in rows) == 22
assert sum(len(r['sentences']) for r in rows) == 260
result = {'atUTC': datetime.datetime.now(datetime.timezone.utc).isoformat(),
          'reviewer': '/root/column_inventory', 'role': 'independent AI semantic/style reviewer',
          'newCLIRuns': 0, 'actualAuthorCLIRunsVerified': 6,
          'scope': 'Current source, full FAQ and editorial review; independent byte/array/metric reconstruction; not human legal/native approval',
          'authorizedInputDelta': input_delta, 'refs': [{'file':p,'sha256':s} for p,s in refs.items()],
          'rows': rows}
output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'output':str(output), 'sha256':sha(output), 'refs':len(refs),
                  'forwardReverseFiles':len(rows), 'exactEdits':sum(r['editCount'] for r in rows),
                  'sentences':sum(len(r['sentences']) for r in rows), 'newCLIRuns':0,
                  'rows':[{'id':r['id'],'n':len(r['sentences']),'cv':r['actualCLIReused']['metrics']['len_cv']} for r in rows]}, ensure_ascii=False))
