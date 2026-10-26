"""Apply only the approved MN independent-R1 findings; preserve earlier evidence."""
from pathlib import Path
import datetime
import difflib
import hashlib
import json
import re

B = Path('/Users/son7/tseng-all-language-columns-20261025/batch08')
C = B / 'checks'
OUT = C / 'mn-r2-edits.json'
assert not OUT.exists(), 'Do not overwrite prior R2 evidence'
sha = lambda data: hashlib.sha256(data).hexdigest()
record = lambda p: {'path': str(p), 'sha256': sha(p.read_bytes())}
manifest_path = C / 'mn-independent-manifest.json'
findings_path = C / 'mn-independent-findings.json'
assert sha(manifest_path.read_bytes()) == '778b505285d40f5be18d272d01d8650a96151fca2f17d2ac8e858350169d30cc'
assert sha(findings_path.read_bytes()) == '7fc86eb51c52c2d80d03a7340f797318f87d8600d157002244277aa3b83e5b7c'
manifest = json.loads(manifest_path.read_text())
findings = json.loads(findings_path.read_text())['findings']
assert [f['id'] for f in findings] == ['M01', 'M02', 'M03', 'S01']
assert sha(Path(manifest['report']['path']).read_bytes()) == manifest['report']['sha256']
for item in manifest['currentTools']:
    assert sha(Path(item['path']).read_bytes()) == item['sha256']
for f in findings:
    source = f['source']
    assert sha(Path(source['path']).read_bytes()) == source['sha256']
prior_records = [record(p) for folder in [C, B / 'reviews']
                 for p in sorted(folder.glob('mn-*'))
                 if p.is_file() and p != Path(__file__)]
originals = {r['file']: r for r in json.loads((C / 'mn-independent-r1-originals.json').read_text())['rows']}
rows = []
pending = []
for item in manifest['files']:
    p = Path(item['path'])
    assert p.parent == B / 'src/content/columns-mn'
    raw = p.read_bytes()
    assert sha(raw) == item['sha256']
    old = raw.decode('utf-8')
    assert old == originals[str(p)]['text']
    current = old
    applied = []
    for finding in findings:
        if finding['file'] != str(p):
            continue
        for edit in finding['edits']:
            assert current.count(edit['old']) == 1, (finding['id'], p)
            pos = current.index(edit['old'])
            applied.append({'finding': finding['id'], 'severity': finding['severity'],
                            'offsetUnit': 'Unicode code points at this forward step',
                            'offset': pos, 'old': edit['old'], 'new': edit['new'],
                            'reason': finding['reason'], 'meaningPreserved': finding['meaningPreserved']})
            current = current[:pos] + edit['new'] + current[pos + len(edit['old']):]
    reverse = current
    for edit in reversed(applied):
        pos = edit['offset']
        assert reverse[pos:pos + len(edit['new'])] == edit['new']
        reverse = reverse[:pos] + edit['old'] + reverse[pos + len(edit['new']):]
    assert reverse.encode() == raw
    forward = reverse
    for edit in applied:
        pos = edit['offset']
        assert forward[pos:pos + len(edit['old'])] == edit['old']
        forward = forward[:pos] + edit['new'] + forward[pos + len(edit['old']):]
    assert forward == current
    old_fm, old_body = old.split('\n---\n', 1)
    new_fm, new_body = current.split('\n---\n', 1)
    assert old_fm == new_fm
    assert re.findall(r'\]\(([^)]+)\)', old) == re.findall(r'\]\(([^)]+)\)', current)
    assert re.findall(r'\d+', old) == re.findall(r'\d+', current)
    rows.append({'file': str(p), 'oldSHA256': sha(raw), 'newSHA256': sha(current.encode()),
                 'changed': bool(applied), 'oldText': old, 'newText': current,
                 'changes': applied, 'forwardReplayIdentical': True, 'reverseReplayIdentical': True,
                 'frontmatterAndFAQBytesUnchanged': True, 'markdownURLSequenceUnchanged': True,
                 'numericDigitSequenceUnchanged': True,
                 'spelledNumberNote': 'M03 restores зургаан (six) in the notice-period description; not a claim that all spelled-out numbers are unchanged.' if p.name.startswith('918') else None,
                 'rawBodyBytesUnchanged': old_body == new_body,
                 'diff': ''.join(difflib.unified_diff(old.splitlines(True), current.splitlines(True), fromfile='R1/' + p.name, tofile='R2/' + p.name))})
    if applied:
        pending.append((p, current.encode()))
assert len(pending) == 3
assert sum(len(r['changes']) for r in rows) == 5
for p, data in pending:
    p.write_bytes(data)
for r in rows:
    assert sha(Path(r['file']).read_bytes()) == r['newSHA256']
for r in prior_records:
    assert sha(Path(r['path']).read_bytes()) == r['sha256']
result = {'at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
          'scope': 'Root-authorized M01 M02 M03 and meaning-preserving S01 only; 5 exact replacements in 3 MN manuscripts.',
          'inputManifest': record(manifest_path), 'findings': record(findings_path),
          'previousRecords': prior_records, 'previousRecordsUnchanged': True,
          'tools': manifest['currentTools'], 'sources': [f['source'] for f in findings],
          'files': rows, 'changedManuscripts': 3, 'exactReplacements': 5,
          'newCLIScope': 'Only 916 and 918 have measured-body changes. 915 heading-only change requires extraction equality and manual heading review; existing actual CLI is reused.'}
OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'output': str(OUT), 'sha256': sha(OUT.read_bytes()),
                  'files': [{k: r[k] for k in ['file','oldSHA256','newSHA256','changed']} for r in rows]}, ensure_ascii=False, indent=2))
