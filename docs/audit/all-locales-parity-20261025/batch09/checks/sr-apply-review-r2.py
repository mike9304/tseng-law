from pathlib import Path
from hashlib import sha256
from datetime import datetime, timezone
from difflib import unified_diff
import json, re, yaml

B = Path('/Users/son7/tseng-all-language-columns-20261025/batch09')
C = B / 'checks'
def h(t): return sha256(t if isinstance(t, bytes) else t.encode()).hexdigest()
def record(p): return {'path': str(p), 'sha256': h(p.read_bytes()), 'bytes': p.stat().st_size}
m = json.loads((C/'sr-final-manifest.json').read_text())
f = json.loads((C/'sr-independent-findings.json').read_text())['optional'][0]
assert f['id'] == 'S01'
refs = [B/'reviews/sr-author.md', C/'sr-final-manifest.json', C/'sr-final-proof-current.json',
        B/'reviews/sr-independent.md', C/'sr-independent-manifest.json', C/'sr-independent-findings.json']
assert h(refs[0].read_bytes()) == '0520baa492ca270252fa4161faa9f399dd0ddfa33a3ff76a79a160f68c3a1f41'
assert h(refs[1].read_bytes()) == '3679a1bb60e2606dc9a4c38022ea6b55bd35ca0f0d23cc746a0808a1a780dc07'
assert h(refs[3].read_bytes()) == 'ca68e8e54a6e0e5430676ce528c6549295dbae4e958c6a4e9efb66dd30dba03f'
preserved = [record(p) for p in refs]
files = []
for r in m['manuscripts']:
    p = Path(r.get('path', r.get('file')))
    assert h(p.read_bytes()) == r['sha256'], str(p)
    files.append(record(p))
assert len(files) == 6
p = Path(f['path']); before = p.read_text()
assert before.count(f['sentence']) == before.count(f['exact_before']) == 1
after = before.replace(f['exact_before'], f['exact_after'], 1)
assert f['proposed_sentence'] in after
assert before.split('---', 2)[1] == after.split('---', 2)[1]
assert re.findall(r'\]\(([^)]+)\)', before) == re.findall(r'\]\(([^)]+)\)', after)
assert re.findall(r'\d+', before) == re.findall(r'\d+', after)
assert after.replace(f['exact_after'], f['exact_before'], 1) == before
out = C/'sr-review-r1-edits.json'; assert not out.exists()
evidence = {'atUTC': datetime.now(timezone.utc).isoformat(), 'authorization': 'Root adopted independent optional S01 exact clarification; no mandatory-error reclassification.',
    'preservedR1': preserved, 'beforeSix': files, 'finding': f,
    'path': str(p), 'beforeText': before, 'afterText': after, 'beforeSHA256': h(before), 'afterSHA256': h(after),
    'offset': before.index(f['exact_before']), 'exactReplacementCount': 1, 'forwardExact': True, 'reverseExact': True,
    'frontmatterFAQBytesUnchanged': True, 'URLAndNumericSequencesUnchanged': True,
    'diff': ''.join(unified_diff(before.splitlines(True), after.splitlines(True), fromfile='r1/'+p.name, tofile='r2/'+p.name))}
p.write_text(after)
assert p.read_text() == after
for r in preserved:
    assert h(Path(r['path']).read_bytes()) == r['sha256']
for r in files:
    if r['path'] != str(p): assert h(Path(r['path']).read_bytes()) == r['sha256']
evidence['appliedToActualBytes'] = True
out.write_text(json.dumps(evidence, ensure_ascii=False, indent=2)+'\n')
print(json.dumps({'file': str(p), 'oldSHA256': h(before), 'newSHA256': h(after), 'edits': 1,
    'unchangedOtherFiles': 5, 'evidence': record(out)}, ensure_ascii=False, indent=2))
