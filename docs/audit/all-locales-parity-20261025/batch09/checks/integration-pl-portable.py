"""Rebind only artifact locations; preserve independently approved PL arrays/decisions."""
from pathlib import Path
from datetime import datetime,timezone
import copy,hashlib,json,os,sys
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch09')
R=Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
A=R/'docs/audit/all-locales-parity-20261025/batch09/boundaries/pl'
MAPS=R/'docs/audit/variety-segments'
TOOL=R/'docs/audit/all-locales-parity-20261025/tooling/variety'
sys.path.insert(0,str(TOOL));import variety_multilingual as multi
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def entry(p):return {'path':str(p),'sha256':sha(p),'bytes':Path(p).stat().st_size}
def write(p,data):
 p.parent.mkdir(parents=True,exist_ok=True)
 with p.open('xb') as f:f.write(data)
def serialized(d):return (json.dumps(d,ensure_ascii=False,indent=2)+'\n').encode()
def bound(binding,base):
 p=Path(binding['path']);p=p if p.is_absolute() else base/p
 assert sha(p)==binding['sha256'];return p
originals={};approvals={};rows=[]
def preserve(p):
 p=Path(p)
 if str(p) not in originals:
  q=A/'originals'/(sha(p)+'-'+p.name);write(q,p.read_bytes())
  originals[str(p)]={'source':entry(p),'copy':entry(q),'byteIdentical':True}
 return Path(originals[str(p)]['copy']['path'])
for row in json.loads((B/'checks/pl-independent-r4-manifest.json').read_text())['currentSources']:
 source=Path(row['file']);dest=R/source.relative_to(B)
 assert sha(source)==sha(dest)==row['sha256']
 oldmap=Path(row['map']['file']);assert sha(oldmap)==row['map']['sha256'];preserve(oldmap)
 record=json.loads(oldmap.read_text());oldapproval=bound(record['approval_record'],oldmap.parent)
 assert record['source_sha256']==row['sha256']
 preserve(oldapproval)
 if str(oldapproval) not in approvals:
  original=json.loads(oldapproval.read_text());new=copy.deepcopy(original)
  approval=A/'approvals'/(sha(oldapproval)+'.json')
  for e in new['evidence']:
   p=bound(e,oldapproval.parent);q=preserve(p);e['path']=os.path.relpath(q,approval.parent)
  assert all({k:v for k,v in x.items() if k!='path'}=={k:v for k,v in y.items() if k!='path'} for x,y in zip(original['evidence'],new['evidence']))
  assert {k:v for k,v in original.items() if k!='evidence'}=={k:v for k,v in new.items() if k!='evidence'}
  write(approval,serialized(new));approvals[str(oldapproval)]={'original':entry(oldapproval),'portable':entry(approval),'onlyEvidencePathsRebound':True}
 approval=Path(approvals[str(oldapproval)]['portable']['path'])
 newmap=copy.deepcopy(record);p=MAPS/(row['sha256']+'.json')
 newmap['approval_record']={'path':os.path.relpath(approval,p.parent),'sha256':sha(approval)}
 assert {k:v for k,v in record.items() if k!='approval_record'}=={k:v for k,v in newmap.items() if k!='approval_record'}
 write(p,serialized(newmap))
 # Exercise source-SHA/discovered path/approval/evidence validation on actual R bytes.
 mapping=multi.sentence_map(str(dest),dest.read_text(),'pl')
 assert isinstance(mapping,multi.ReviewedPolishMap)
 rows.append({'source':entry(source),'destination':entry(dest),'originalMap':entry(oldmap),'portableMap':entry(p),'paragraphsSHA256':multi.paragraphs_sha256(record['paragraphs']),'paragraphs':len(record['paragraphs']),'sentences':sum(len(x['sentences']) for x in record['paragraphs']),'sourceAndAllApprovedParagraphBytesPreserved':True,'automaticRepositoryDiscoveryValidated':True})
out={'atUTC':datetime.now(timezone.utc).isoformat(),'scope':'Location-only rebinding of frozen independent boundary approval; no new linguistic/legal approval','maps':rows,'approvals':list(approvals.values()),'originals':list(originals.values()),'originalApprovalRecordsModified':False,'originalMapsModified':False,'sourceBytesChanged':False,'humanNativeLegalApproval':False}
p=B/'checks/integration-pl-portability.json';write(p,serialized(out))
print(json.dumps({'maps':len(rows),'approvals':len(approvals),'originalArtifacts':len(originals),'sentences':sum(x['sentences'] for x in rows),'automaticDiscovery':True}))
