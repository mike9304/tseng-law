"""Connect frozen current B8 bytes to saved actual CLI; no new article CLI."""
from pathlib import Path
from datetime import datetime,timezone
import hashlib,json,re
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch08')
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
read=lambda p:json.loads(Path(p).read_text())
M=read(B/'checks/integration-readiness-manifest.json')
def nodes(v):
 if isinstance(v,dict):
  yield v
  for x in v.values():yield from nodes(x)
 elif isinstance(v,list):
  for x in v:yield from nodes(x)
def record_path(value):
 p=Path(value);return p if p.is_absolute() else B/p if p.parts[0]=='checks' else B/'checks'/p
def file_rows(v):return v.get('files',v.get('rows',v.get('results',v.get('manuscripts'))))
def match_row(v,p):
 return next(x for x in file_rows(v) if x.get('file',x.get('path'))==str(p))

evidence=[]
mn_proof_path=B/'checks/mn-independent-r2-proof.json';mn_proof=read(mn_proof_path)
km_bridge_path=B/'checks/km-independent-verification.json'
for lane in M['localeEvidence']:
 locale=lane['locale'];author=read(lane['authorManifest']['path'])
 for target in [x for x in M['files'] if x['locale']==locale]:
  p=Path(target['path']);current=sha(p);assert current==target['sha256']
  item=match_row(author,p);connection='full_file_sha';bridge=None
  if locale=='fi': ev='fi-variety-independent-r2.json' if p.name.startswith('921-') else 'fi-variety-final.json'
  elif locale=='hr':ev=item['variety_evidence']
  elif locale in ['hu','is']:ev=item['actualCLIRecord']
  elif locale=='lv':ev=item['actualCLI']
  elif locale=='km':ev='km-variety-review-r2.json' if p.name.startswith('918-') else item['prior_record']['actualCLIEvidence']
  else:
   pr=match_row(mn_proof,p);assert pr['sha256']==current
   ev=pr['actualCLIEvidence']
  ep=record_path(ev);raw=read(ep);measured=match_row(raw,p);mh=measured['sha256']
  if mh!=current:
   if locale=='km' and p.name.startswith('919-'):
    connection='byte_identical_body_after_summary_only_change'
    bridge=km_bridge_path
    initial=B/'checks/km-initial-snapshots'/p.name
    assert sha(initial)==mh
    assert initial.read_text().split('---',2)[2]==p.read_text().split('---',2)[2]
   elif locale=='mn' and p.name[:3] in ['915','919','921']:
    pr=match_row(mn_proof,p);assert pr['actualCLIFileSHA256']==mh
    connection='independently_matched_measured_extraction_after_FAQ_and_heading_changes' if p.name.startswith('915-') else 'independently_verified_identical_body_after_FAQ_only_change'
    bridge=mn_proof_path
   else:raise AssertionError((locale,p.name,'unconnected current SHA'))
  owners=[x for x in nodes(raw) if isinstance(x.get('stdout'),str) and p.name in x['stdout']]
  selected=None
  for owner in owners:
   lines=owner['stdout'].splitlines()
   for n,line in enumerate(lines):
    if p.name in line and f'[{locale}]' in line:
     block='\n'.join(lines[n:n+2])
     if 'OK — no variety limit violated' in block:selected=(owner,block);break
   if selected:break
  assert selected,(locale,p.name,'saved actual OK block missing')
  owner,block=selected;exit_code=next((owner[k] for k in ['exit','exitCode','exit_code'] if k in owner),None)
  assert exit_code==0 or (locale=='km' and p.name[:3] in ['919','921'] and exit_code==1),(locale,p.name,exit_code)
  cv=float(re.search(r' cv=([0-9.]+)',block).group(1));count=int(re.search(r' sentences=(\d+)',block).group(1))
  recorded_tools=[]
  for n in nodes(raw):
   x=n.get('path',n.get('file'));h=n.get('sha256')
   if isinstance(x,str) and '/tseng-lanes-shared/variety/' in x and isinstance(h,str):recorded_tools.append({'path':x,'sha256':h})
   for x,h in n.items():
    if x.startswith('/Users/son7/tseng-lanes-shared/variety/') and isinstance(h,str) and len(h)==64:recorded_tools.append({'path':x,'sha256':h})
  recorded_tools=list({(x['path'],x['sha256']):x for x in recorded_tools}.values())
  evidence.append({'file':str(p),'sha256':current,'locale':locale,'savedCLIRecord':str(ep),'savedCLIRecordSHA256':sha(ep),'measuredFileSHA256':mh,'connection':connection,'independentConnectionProof':{'path':str(bridge),'sha256':sha(bridge)} if bridge else None,'actualBatchOrSingleExit':exit_code,'actualFileStdout':block,'sentences':count,'lenCV':cv,'recordedToolHashesUnchanged':recorded_tools,'currentToolEquivalenceEvidence':lane['independentManifest'],'newCLIExecuted':False})
assert len(evidence)==42
out={'at':datetime.now(timezone.utc).isoformat(),'count':42,'files':evidence,'fullFileSHAMatches':sum(x['connection']=='full_file_sha' for x in evidence),'explicitBodyOrExtractionConnections':sum(x['connection']!='full_file_sha' for x in evidence),'currentFileFAIL':0,'savedNonzeroBatchExitsRetained':sum(x['actualBatchOrSingleExit']!=0 for x in evidence),'totalMeasuredSegments':sum(x['sentences'] for x in evidence),'newArticleCLIRuns':0,'limitations':['KM919 and KM921 reuse per-file OK blocks from an actual overall exit1 initial batch; the batch exit is not rewritten.','KM919 is a summary-only byte-identical-body bridge. MN915 also changed a heading, so only measured extraction equivalence is claimed; MN919/921 use documented FAQ-only unchanged-body bridges.','Older c8f expansion executions remain c8f records; later direct extraction/installation compatibility is separate from a fresh CLI.','The early KM wrapper recorded the DA profile hash; its preserved provenance correction and independent KM compatibility evidence are retained. No new native-human, legal, browser or publication approval is inferred.']}
with (B/'checks/integration-variety-evidence.json').open('x') as f:f.write(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in out.items() if k not in ['files','limitations']}))
