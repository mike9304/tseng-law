"""Copy only frozen, root-authorized B8 artifacts into R, with hash guards."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib,json,subprocess
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch08')
R=Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
M=json.loads((B/'checks/integration-readiness-manifest.json').read_text())
assert sha(B/'checks/integration-readiness-manifest.json')=='5276c5c2915e9a03e215066052b15d7f94cbfb172c5dc1c766561706af4e22f3'
assert subprocess.check_output(['git','rev-parse','HEAD'],cwd=R,text=True).strip()==M['baseCommit']
allowed_tests={'src/lib/__tests__/native-locale-columns.ts','src/lib/__tests__/case-translations-20261026.test.ts'}
dirty=subprocess.check_output(['git','status','--porcelain'],cwd=R,text=True).splitlines()
assert {line[3:] for line in dirty}==allowed_tests,dirty
for row in M['directFinalEvidenceReferencesVerified']:
 assert sha(row['path'])==row['sha256'],row['path']
for lane in M['localeEvidence']:
 for key in ['authorManifest','independentManifest','authorReport','independentReport']:
  assert sha(lane[key]['path'])==lane[key]['sha256']
for row in M['sourceFiles']:
 assert sha(row['canonical_path'])==row['current_sha256']
for row in M['repairClosures']+[M['toolInstallationReceipt']]:assert sha(row['path'])==row['sha256']
rows=[]
for kind in ['files','repairs','toolCopies']:
 for row in M[kind]:
  source=Path(row['path']);dest=Path(row['destination']);before=row.get('beforeSHA256')
  assert dest.is_relative_to(R) and sha(source)==row['sha256']
  if before is None:assert not dest.exists(),dest
  else:assert dest.is_file() and sha(dest)==before,(dest,'changed destination')
  rows.append({**row,'kind':kind,'sourceVerified':True,'beforeVerified':True})
for row in rows:
 source=Path(row['path']);dest=Path(row['destination']);dest.parent.mkdir(parents=True,exist_ok=True)
 if row.get('beforeSHA256') is not None:
  assert sha(dest)==row['beforeSHA256'];dest.write_bytes(source.read_bytes())
 else:
  with dest.open('xb') as f:f.write(source.read_bytes())
 assert sha(dest)==row['sha256'];row['copiedByteIdentical']=True
out={'at':datetime.now(timezone.utc).isoformat(),'baseCommit':M['baseCommit'],'copies':rows,'newArticles':42,'approvedExistingRepairs':3,'toolCopies':3,'unapprovedOverwrites':0,'capacityIncluded':False,'commitPushDeploy':False}
with (B/'checks/integration-copy-manifest.json').open('x') as f:f.write(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'copied':len(rows),'newArticles':42,'repairs':3,'tools':3,'manifestSHA256':sha(B/'checks/integration-copy-manifest.json')}))
