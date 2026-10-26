"""Validate PL artifact graph after relocation without any BASE-path lookup."""
from pathlib import Path
from datetime import datetime,timezone
import hashlib,json,shutil,sys,tempfile
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch09');R=Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
M=R/'docs/audit/all-locales-parity-20261025/tooling/variety'
sys.path.insert(0,str(M));import variety_metrics as vm
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
data=json.loads((B/'checks/integration-pl-portability.json').read_text())
T=Path(tempfile.mkdtemp(prefix='tseng-b9-pl-portable-',dir='/private/tmp'));(T/'.git').write_text('fixture only\n')
copied={};rows=[]
def transfer(p):
 p=Path(p).resolve();assert p.is_relative_to(R)
 q=T/p.relative_to(R)
 if str(p) not in copied:
  q.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,q);assert sha(p)==sha(q);copied[str(p)]={'sha256':sha(p),'relativePath':str(p.relative_to(R))}
 return q
for row in data['maps']:
 source=transfer(row['destination']['path']);mp=transfer(row['portableMap']['path']);record=json.loads(mp.read_text())
 assert not Path(record['approval_record']['path']).is_absolute()
 original_map=Path(row['portableMap']['path']);approval_original=(original_map.parent/record['approval_record']['path']).resolve();ap=transfer(approval_original)
 approval=json.loads(ap.read_text())
 for e in approval['evidence']:
  assert not Path(e['path']).is_absolute();q=transfer((approval_original.parent/e['path']).resolve());assert sha(q)==e['sha256']
 mapping=vm.multilingual.sentence_map(str(source),source.read_text(),'pl')
 measured=vm.metrics(source.read_text(),'pl',mapping)
 rows.append({'sourceRelativePath':str(source.relative_to(T)),'sourceSHA256':sha(source),'mapSHA256':sha(mp),'sentences':measured['sentences'],'cv':measured['len_cv'],'automaticDiscovery':True})
out={'atUTC':datetime.now(timezone.utc).isoformat(),'isolatedFixture':str(T),'sourceAndArtifactsCopiedByteExactly':list(copied.values()),'rows':rows,'externalBaseEvidenceReadsRequired':False,'artifactGraphAllRelativeWithinRelocatedRepository':True,'measurement':'Actual checker API; CLI evidence remains the separate45 real R executions.','productionOrManuscriptChanges':False}
with (B/'checks/integration-pl-relocation.json').open('x') as f:json.dump(out,f,ensure_ascii=False,indent=2);f.write('\n')
print(json.dumps({'relocatedMaps':len(rows),'containedArtifacts':len(copied),'actualSentences':sum(x['sentences'] for x in rows),'outsideBaseLookup':False}))
