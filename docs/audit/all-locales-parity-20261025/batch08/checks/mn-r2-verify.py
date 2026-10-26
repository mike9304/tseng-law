from pathlib import Path
from collections import Counter
import datetime
import difflib
import hashlib
import json
import re
import sys

sys.dont_write_bytecode = True
B = Path('/Users/son7/tseng-all-language-columns-20261025/batch08')
C = B / 'checks'
S = Path('/Users/son7/tseng-lanes-shared/variety')
sys.path.insert(0, str(S))
import variety_metrics as vm

sha = lambda b: hashlib.sha256(b).hexdigest()
out = C / 'mn-r2-boundary-delta.json'
assert not out.exists()
edits = json.loads((C / 'mn-r2-edits.json').read_text())
baseline = json.loads((C / 'mn-boundary-review.json').read_text())
actual = json.loads((C / 'mn-variety-independent-r2.json').read_text())
new_cli = {r['file']: r for r in actual['rows']}
assert {Path(k).name[:3] for k in new_cli} == {'916', '918'}
for row in new_cli.values():
    assert row['exit'] == 0
    assert 'OK — no variety limit violated' in row['stdout']
for r in edits['previousRecords']:
    assert sha(Path(r['path']).read_bytes()) == r['sha256'], r['path']
for r in edits['tools']:
    assert sha(Path(r['path']).read_bytes()) == r['sha256'], r['path']
for r in actual['tool_inputs']:
    assert r in edits['tools']

flatten = lambda paras: [s for p in paras for s in p['sentences']]
rows = []
for old in baseline['all_rows']:
    p = Path(old['file'])
    item = next(r for r in edits['files'] if r['file'] == str(p))
    assert old['sha256'] == item['oldSHA256']
    assert sha(p.read_bytes()) == item['newSHA256']
    assert p.read_text() == item['newText']
    _, old_vm_body = vm.strip_fm(item['oldText'])
    old_body = item['oldText'].split('\n---\n', 1)[1]
    assert old_vm_body == '\n' + old_body
    assert sha(old_body.encode()) == old['body_sha256']
    if str(p) in new_cli:
        new = new_cli[str(p)]
        assert new['sha256'] == item['newSHA256']
        paragraphs, heads, lists, metrics = new['paragraphs'], new['excludedHeadings'], new['excludedListItems'], new['metrics']
        evidence = 'mn-variety-independent-r2.json'
        reuse = False
    elif p.name.startswith('915'):
        _, body = vm.strip_fm(item['newText'])
        paras, heads, lists = vm.body_blocks(body, 'mn')
        paragraphs = [{'index': i + 1, 'opener': vm.opener(s, 'mn'),
                       'sentences': [{'text': t, 'units': vm.slen(t, 'mn')} for t in vm.sentences(s, 'mn')]}
                      for i, s in enumerate(paras)]
        metrics = vm.metrics(item['newText'], 'mn')
        assert paragraphs == old['paragraphs']
        assert metrics == old['metrics']
        assert lists == old['excluded_list_items']
        assert heads[1:] == old['excluded_headings'][1:]
        assert heads[0] == 'Хугацаа сунгуулах хүсэлтийн дараа мөнгө нэхэмжилсэн нь'
        evidence = old['actual_cli_evidence']
        reuse = True
    else:
        assert item['oldSHA256'] == item['newSHA256']
        paragraphs, heads, lists, metrics = old['paragraphs'], old['excluded_headings'], old['excluded_list_items'], old['metrics']
        evidence = old['actual_cli_evidence']
        reuse = True
    old_s = flatten(old['paragraphs'])
    new_s = flatten(paragraphs)
    matches = difflib.SequenceMatcher(a=[s['text'] for s in old_s], b=[s['text'] for s in new_s], autojunk=False)
    delta = []
    unchanged = 0
    for tag, i, j, k, l in matches.get_opcodes():
        if tag == 'equal':
            assert old_s[i:j] == new_s[k:l]
            unchanged += j - i
        else:
            delta.append({'operation': tag, 'oldIndexZeroBased': [i, j], 'newIndexZeroBased': [k, l],
                          'old': old_s[i:j], 'new': new_s[k:l],
                          'newPrevious': new_s[k-1:k] if k else [], 'newNext': new_s[l:l+1]})
    assert [x['opener'] for x in paragraphs] == [x['opener'] for x in old['paragraphs']]
    rows.append({'file': str(p), 'oldSHA256': item['oldSHA256'], 'newSHA256': item['newSHA256'],
                 'oldCount': len(old_s), 'newCount': len(new_s), 'unchangedOrderedSegments': unchanged,
                 'changedSegments': delta, 'oldMetrics': old['metrics'], 'newMetrics': metrics,
                 'actualCLI': evidence, 'newActualCLIRun': not reuse,
                 'reuseExplanation': ('915 heading-only delta; current extraction and every metric equal prior exact measured-body evidence, including the prior metadata-only bridge.' if p.name.startswith('915') else 'Whole manuscript SHA unchanged from the reviewed R1.' if reuse else None),
                 'paragraphOpenersUnchanged': True,
                 'paragraphOpeners': [x['opener'] for x in paragraphs],
                 'shortSentences': [x for x in new_s if x['units'] <= 8],
                 'oldHeadings': old['excluded_headings'], 'newHeadings': heads,
                 'listItems': lists, 'paragraphs': paragraphs})
assert sum(r['oldCount'] for r in rows) == 242
assert sum(r['newCount'] for r in rows) == 242
assert sum(r['unchangedOrderedSegments'] for r in rows) == 239
result = {'at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
          'scope': 'Delta against all 242 frozen R1 extracted body segments; no all-six CLI rerun.',
          'baseline': {'path': str(C / 'mn-boundary-review.json'), 'sha256': sha((C / 'mn-boundary-review.json').read_bytes())},
          'actualCLI': {'path': str(C / 'mn-variety-independent-r2.json'), 'sha256': sha((C / 'mn-variety-independent-r2.json').read_bytes())},
          'tools': edits['tools'], 'previousRecordsUnchanged': True,
          'oldSegments': 242, 'newSegments': 242, 'unchangedOrderedSegments': 239,
          'rows': rows,
          'limits': 'Orthographic-word heuristic with unchanged thresholds and code; not native readability, independent tool certification, legal approval, or public render verification.'}
out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'output': str(out), 'sha256': sha(out.read_bytes()),
                  'rows': [{k:r[k] for k in ['file','oldCount','newCount','unchangedOrderedSegments','changedSegments','paragraphOpeners','newHeadings']} for r in rows]}, ensure_ascii=False, indent=2))
