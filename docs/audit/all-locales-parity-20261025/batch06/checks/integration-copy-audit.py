"""Copy compact B6 evidence, retaining a hash index of raw evidence left in BASE."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import shutil

B = Path('/Users/son7/tseng-all-language-columns-20261025/batch06')
A = Path('/Users/son7/Projects/tseng-law-all-locales-20261025/docs/audit/all-locales-parity-20261025/batch06')

def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

def select(p):
    rel = p.relative_to(B)
    if rel == Path('BRIEF.md') or rel.parts[0] in ['reviews', 'research']:
        return True
    if rel.parts[0] != 'checks' or len(rel.parts) != 2:
        return False
    if p.name == 'integration-audit-copy-manifest.json':
        return False
    if p.name.startswith('integration-'):
        return True
    if p.suffix == '.diff':
        return True
    # Keep bound final manifests and targeted closure/delta checks. Raw earlier
    # CLI logs, complete first-pass audits and drafting snapshots stay in BASE.
    names = ['manifest', 'independent-r2', '-r2-', '-r1-summary-', 'final', 'freeze', 'source-map', '-inputs', '-input-']
    return p.suffix in ['.json', '.md'] and any(token in p.name for token in names)

selected, excluded = [], []
for p in sorted(B.rglob('*')):
    if not p.is_file() or p.name == 'integration-audit-copy-manifest.json':
        continue
    rel = p.relative_to(B)
    row = {'path': str(rel), 'source': str(p), 'bytes': p.stat().st_size, 'sha256': sha(p)}
    if select(p):
        q = A/rel
        q.parent.mkdir(parents=True, exist_ok=True)
        if q.exists():
            assert q.read_bytes() == p.read_bytes(), f'Existing audit differs; preserve and inspect: {q}'
        else:
            shutil.copyfile(p, q)
        assert sha(q) == row['sha256']
        selected.append({**row, 'destination': str(q), 'identical': True})
    else:
        excluded.append({**row, 'reason': 'Raw prior evidence, manuscript duplicate, or already-installed tool evidence remains preserved in BASE; not deleted.'})
record = {'at': datetime.now(timezone.utc).isoformat(), 'sourceRoot': str(B), 'destinationRoot': str(A),
          'copied': selected, 'copiedCount': len(selected), 'copiedBytes': sum(x['bytes'] for x in selected),
          'retainedOutsideAudit': excluded, 'retainedCount': len(excluded),
          'manifestSelfExcluded': True, 'existingPriorBatchEvidenceOverwritten': False}
out = B/'checks/integration-audit-copy-manifest.json'
out.write_text(json.dumps(record, ensure_ascii=False, indent=2)+'\n')
target = A/'checks'/out.name
assert not target.exists()
shutil.copyfile(out, target)
print(json.dumps({'copied': len(selected), 'bytes': record['copiedBytes'], 'retained': len(excluded), 'manifestSHA256': sha(out)}))
