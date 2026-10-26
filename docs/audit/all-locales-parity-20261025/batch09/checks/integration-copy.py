"""Copy the exact 42+3 manuscripts and 17 installed checker files into R."""
from pathlib import Path
from datetime import datetime,timezone
import hashlib,json,subprocess
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch09')
R=Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
M=json.loads((B/'checks/integration-readiness-manifest.json').read_text())
before=json.loads((B/'checks/integration-before.json').read_text())
assert subprocess.check_output(['git','rev-parse','HEAD'],cwd=R,text=True).strip()==M['baseCommit']
tests={'src/lib/__tests__/native-locale-columns.ts','src/lib/__tests__/case-translations-20261026.test.ts'}
changed={p for p,h in before['trackedSHA256'].items() if sha(R/p)!=h}
assert changed==tests,changed
dirty=subprocess.check_output(['git','status','--porcelain','--untracked-files=all'],cwd=R,text=True).splitlines()
assert {x[3:] for x in dirty}==tests,dirty
for rel,h in before['priorB9Evidence'].items():assert sha(B/rel)==h,rel
for x in M['directFinalEvidenceReferencesVerified']+M['toolInstallationReceipts']+[M['repairClosure'],M['repairAuthorManifest']]:assert sha(x['path'])==x['sha256'],x['path']
for x in M['sourceFiles']:assert sha(x['canonical_path'])==x['current_sha256']
rows=[]
for kind in ['files','repairs','toolCopies']:
 for row in M[kind]:
  p=Path(row['path']);q=Path(row['destination']);assert q.is_relative_to(R) and sha(p)==row['sha256']
  old=row.get('beforeSHA256');assert (sha(q) if q.exists() else None)==old,q
  rows.append({**row,'kind':kind})
for row in rows:
 p=Path(row['path']);q=Path(row['destination']);old=row.get('beforeSHA256')
 assert sha(p)==row['sha256'] and (sha(q) if q.exists() else None)==old
 q.parent.mkdir(parents=True,exist_ok=True)
 if old is None:
  with q.open('xb') as f:f.write(p.read_bytes())
 else:q.write_bytes(p.read_bytes())
 assert sha(q)==row['sha256']
out={'atUTC':datetime.now(timezone.utc).isoformat(),'baseCommit':M['baseCommit'],'readinessSHA256':sha(B/'checks/integration-readiness-manifest.json'),'copies':rows,'newArticles':42,'existingRepairs':3,'toolCopies':17,'unexpectedPriorChanges':0,'commitPushBuildDeploy':False}
with (B/'checks/integration-copy-manifest.json').open('x') as f:json.dump(out,f,ensure_ascii=False,indent=2);f.write('\n')
print(json.dumps({'copied':len(rows),'articles':42,'repairs':3,'toolFiles':17}))
