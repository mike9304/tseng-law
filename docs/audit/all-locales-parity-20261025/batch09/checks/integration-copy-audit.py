"""Copy selected B9 evidence, keeping earlier PL portable bindings and every original."""
from pathlib import Path
from datetime import datetime,timezone
import hashlib,json,runpy,shutil
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch09');C=B/'checks';cfg=runpy.run_path(str(C/'integration-audit-selection.py'));A=cfg['A']
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
ready=json.loads((C/'integration-readiness-manifest.json').read_text());portable=json.loads((C/'integration-pl-portability.json').read_text())
preexisting=[x['copy'] for x in portable['originals']]+[x['portable'] for x in portable['approvals']]
assert {p for p in A.rglob('*') if p.is_file()}=={Path(x['path']) for x in preexisting}
assert all(sha(x['path'])==x['sha256'] for x in preexisting)
selected=[];retained=[];symlinks=[]
for p in sorted(B.rglob('*')):
 rel=p.relative_to(B)
 if p.is_symlink():symlinks.append(str(rel));continue
 if not p.is_file() or p.name in cfg['SELF_EXCLUDED']:continue
 row={'path':str(rel),'source':str(p),'bytes':p.stat().st_size,'sha256':sha(p)}
 if cfg['select'](p):selected.append({**row,'destination':str(A/rel),'bytesIdentical':True})
 else:retained.append({**row,'reason':'Original raw corpus/measurement, full inventory/baseline, manuscript duplicate or other historical evidence retained in BASE; selected final chains and summaries copied.'})
for x in ready['toolInstallationReceipts']:
 p=Path(x['path'])
 if not p.is_relative_to(B):
  assert sha(p)==x['sha256'];q=A/'tool-installations'/p.parent.name/p.name
  selected.append({'path':str(q.relative_to(A)),'source':str(p),'bytes':p.stat().st_size,'sha256':sha(p),'destination':str(q),'bytesIdentical':True,'externalInstallationReceipt':True})
assert len({x['destination'] for x in selected})==len(selected)
for x in selected:assert sha(x['source'])==x['sha256'] and not Path(x['destination']).exists()
for x in selected:
 p=Path(x['source']);q=Path(x['destination']);assert sha(p)==x['sha256'];q.parent.mkdir(parents=True,exist_ok=True)
 with p.open('rb') as src,q.open('xb') as dest:shutil.copyfileobj(src,dest)
 assert sha(q)==x['sha256']
record={'atUTC':datetime.now(timezone.utc).isoformat(),'sourceRoot':str(B),'destinationRoot':str(A),'copiedCount':len(selected),'copiedBytes':sum(x['bytes'] for x in selected),'copied':selected,'preexistingPortableBindings':preexisting,'retainedCount':len(retained),'retainedBytes':sum(x['bytes'] for x in retained),'retainedOutsideAudit':retained,'symlinksNotTraversedOrCopied':symlinks,'selfExcluded':sorted(cfg['SELF_EXCLUDED']),'originalRecordsModified':False,'priorBatchAuditOverwritten':False,'capacityIncluded':False,'portabilityLimit':'Actual PL binding graph is relative and separately relocated. Historical reports/scripts retain absolute BASE paths. Retained originals are indexed, not claimed contained in the repository audit.'}
out=C/'integration-audit-copy-manifest.json'
with out.open('x') as f:json.dump(record,f,ensure_ascii=False,indent=2);f.write('\n')
with out.open('rb') as src,(A/'checks'/out.name).open('xb') as dst:shutil.copyfileobj(src,dst)
assert sha(A/'checks'/out.name)==sha(out)
print(json.dumps({'copiedCount':len(selected),'copiedBytes':record['copiedBytes'],'preexistingPL':len(preexisting),'retainedCount':len(retained),'manifestSHA256':sha(out)}))
