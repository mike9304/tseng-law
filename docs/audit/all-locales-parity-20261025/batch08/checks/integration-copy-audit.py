"""Copy selected B8 evidence byte-for-byte without replacing existing files."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import runpy
import shutil

B=Path('/Users/son7/tseng-all-language-columns-20261025/batch08')
cfg=runpy.run_path(str(B/'checks/integration-audit-selection.py'))
A=cfg['A']
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
selected=[]; retained=[]; symlinks=[]; excluded_capacity=[]
assert not A.exists(),f'Expected an absent B8 audit destination: {A}'
for p in sorted(B.rglob('*')):
    rel=p.relative_to(B)
    if not cfg['in_scope'](p):
        if p.is_file(): excluded_capacity.append(str(rel))
        continue
    if p.is_symlink():
        symlinks.append(str(rel));continue
    if not p.is_file() or p.name in cfg['SELF_EXCLUDED']:
        continue
    row={'path':str(rel),'source':str(p),'bytes':p.stat().st_size,'sha256':sha(p)}
    if cfg['select'](p):
        selected.append({**row,'destination':str(A/rel),'bytesIdentical':True})
    else:
        retained.append({**row,'reason':'Full inventory, raw corpus, draft/measurement/failure evidence or duplicate manuscript remains unchanged in BASE; compact summaries and final chains are copied.'})
# Complete selection and hashing before the first destination write.
for row in selected:
    p=Path(row['source']);q=Path(row['destination'])
    assert sha(p)==row['sha256'] and not q.exists()
    q.parent.mkdir(parents=True,exist_ok=True)
    with q.open('xb') as target, p.open('rb') as source:
        shutil.copyfileobj(source,target)
    assert sha(q)==row['sha256']
record={'at':datetime.now(timezone.utc).isoformat(),'sourceRoot':str(B),'destinationRoot':str(A),
        'copiedCount':len(selected),'copiedBytes':sum(x['bytes'] for x in selected),'copied':selected,
        'retainedCount':len(retained),'retainedBytes':sum(x['bytes'] for x in retained),'retainedOutsideAudit':retained,
        'capacityEvidenceExcludedFromReleaseAudit':excluded_capacity,'capacityRuntimeIncluded':False,
        'symlinkOverlaysNotTraversedOrCopied':symlinks,'selfExcluded':sorted(cfg['SELF_EXCLUDED']),
        'originalRecordsModified':False,'priorBatchEvidenceOverwritten':False,
        'portabilityLimit':'Scripts and historical evidence retain absolute BASE paths. Retained originals are indexed here, not claimed to be wholly contained in this repository audit.'}
out=B/'checks/integration-audit-copy-manifest.json'
with out.open('x') as f:f.write(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
target=A/'checks'/out.name
with target.open('xb') as dest, out.open('rb') as source:shutil.copyfileobj(source,dest)
assert sha(target)==sha(out)
print(json.dumps({'copiedCount':len(selected),'copiedBytes':record['copiedBytes'],'retainedCount':len(retained),'excludedCapacityFiles':len(excluded_capacity),'manifestSHA256':sha(out)}))
