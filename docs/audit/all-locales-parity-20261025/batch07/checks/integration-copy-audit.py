"""Copy bounded B7 audit evidence and index preserved raw records; no source edits."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import shutil

B = Path('/Users/son7/tseng-all-language-columns-20261025/batch07')
A = Path('/Users/son7/Projects/tseng-law-all-locales-20261025/docs/audit/all-locales-parity-20261025/batch07')
forced = {Path(row['savedCLIRecord']) for row in json.loads((B / 'checks/integration-variety-evidence.json').read_text())['files']}
SELF_EXCLUDED = {'integration-audit-copy-manifest.json', 'integration-ready-freeze.json'}

def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

def select(p):
    rel = p.relative_to(B)
    if rel == Path('BRIEF.md') or rel.parts[0] == 'reviews' or p in forced:
        return True
    if len(rel.parts) != 2 or rel.parts[0] != 'checks':
        return False
    if p.name.startswith('integration-') or p.suffix == '.diff':
        return True
    return p.suffix in ['.json', '.md'] and any(k in p.name for k in ['manifest', 'independent', 'final', 'freeze', '-r2', '-r3', '-author', '-input'])

selected, retained, symlinks = [], [], []
for p in sorted(B.rglob('*')):
    if p.is_symlink():
        symlinks.append(str(p.relative_to(B)))
        continue
    if not p.is_file() or p.name in SELF_EXCLUDED:
        continue
    rel = p.relative_to(B)
    row = {'path': str(rel), 'source': str(p), 'bytes': p.stat().st_size, 'sha256': sha(p)}
    if select(p):
        q = A / rel
        q.parent.mkdir(parents=True, exist_ok=True)
        assert not q.exists() or q.read_bytes() == p.read_bytes(), f'Existing audit differs: {q}'
        if not q.exists():
            shutil.copyfile(p, q)
        assert sha(q) == row['sha256']
        selected.append({**row, 'destination': str(q), 'bytesIdentical': True})
    else:
        retained.append({**row, 'reason': 'Raw draft/failure/tool diagnostic or duplicate manuscript retained in BASE; not deleted or overwritten.'})
record = {'at': datetime.now(timezone.utc).isoformat(), 'sourceRoot': str(B), 'destinationRoot': str(A),
          'copiedCount': len(selected), 'copiedBytes': sum(x['bytes'] for x in selected), 'copied': selected,
          'retainedCount': len(retained), 'retainedOutsideAudit': retained,
          'symlinkOverlaysNotTraversedOrCopied': symlinks, 'selfExcluded': sorted(SELF_EXCLUDED),
          'priorBatchEvidenceOverwritten': False}
out = B / 'checks/integration-audit-copy-manifest.json'
assert not out.exists()
out.write_text(json.dumps(record, ensure_ascii=False, indent=2) + '\n')
target = A / 'checks' / out.name
assert not target.exists()
shutil.copyfile(out, target)
print(json.dumps({'copiedCount': len(selected), 'copiedBytes': record['copiedBytes'], 'retainedCount': len(retained), 'manifestSHA256': sha(out)}))
