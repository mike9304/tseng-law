from pathlib import Path
from hashlib import sha256
from datetime import datetime,timezone
from difflib import SequenceMatcher
import json,re,sys
sys.dont_write_bytecode=True
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch08');C=B/'checks';S=Path('/Users/son7/tseng-lanes-shared/variety');sys.path.insert(0,str(S));import variety_metrics as vm
def h(x):return sha256(x if isinstance(x,bytes) else x.encode()).hexdigest()
def j(p):return json.loads(p.read_text())
a=j(C/'mn-author-r2-manifest.json');assert h((C/'mn-author-r2-manifest.json').read_bytes())=='03d461ff5aeb4367a6e89d287bc0ce638898e684779b399f88f0739280abc6d0'
base=j(C/'mn-independent-r1-originals.json');findings=j(C/'mn-independent-findings.json');oldproof=j(C/'mn-independent-proof.json');r1=j(C/'mn-independent-manifest.json');cli=j(C/'mn-variety-independent-r2.json')
for q in a['previousRecords']+a['tools']+a['sources']+a['evidence']:assert h(Path(q['path']).read_bytes())==q['sha256'],q['path']
for q in r1['inputs']+r1['evidence']+[r1['report']]:assert h(Path(q['path']).read_bytes())==q['sha256'],q['path']
rows=[];count=0;eq=0
for old in base['rows']:
 f=Path(old['file']);id=f.name[:3];before=old['text'];assert h(before)==old['sha256'];after=before;applied=[]
 for finding in findings['findings']:
  if finding['article']!=id:continue
  for e in finding['edits']:
   assert after.count(e['old'])==1;pos=after.index(e['old']);after=after[:pos]+e['new']+after[pos+len(e['old']):];applied.append(dict(e,offset=pos,finding=finding['id']));count+=1
 current=f.read_text();assert current==after
 ar=next(r for r in a['files'] if r['path']==str(f));assert h(current)==ar['sha256'];rev=current
 for e in reversed(applied):
  pos=e['offset'];assert rev[pos:pos+len(e['new'])]==e['new'];rev=rev[:pos]+e['old']+rev[pos+len(e['new']):]
 assert rev==before
 assert current.split('\n---\n',1)[0]==before.split('\n---\n',1)[0]
 assert re.findall(r'\]\(([^)]+)\)',current)==re.findall(r'\]\(([^)]+)\)',before)
 assert re.findall(r'\d+',current)==re.findall(r'\d+',before)
 paras,heads,lists=vm.body_blocks(vm.strip_fm(current)[1],'mn');sent=[vm.sentences(x,'mn') for x in paras];metrics=vm.metrics(current,'mn');prior=next(r for r in oldproof['rows'] if r['file']==str(f));oldsent=prior['sentencesByParagraph'];beforeflat=sum(oldsent,[]);afterflat=sum(sent,[]);delta=[]
 for tag,i,k,x,y in SequenceMatcher(None,beforeflat,afterflat,autojunk=False).get_opcodes():
  if tag=='equal':eq+=k-i
  else:delta.append({'kind':tag,'before':beforeflat[i:k],'after':afterflat[x:y],'oldOffset':i,'newOffset':x})
 if id in ['916','918']:
  cr=next(r for r in cli['rows'] if r['file']==str(f));assert cr['sha256']==h(current) and cr['exit']==0;assert metrics==cr['metrics'];assert sent==[[s['text'] for s in p['sentences']] for p in cr['paragraphs']];evidence='mn-variety-independent-r2.json';actualSHA=cr['sha256'];stdout=cr['stdout']
 else:
  assert sent==oldsent and metrics==prior['metrics'];evidence=prior['actualCLIEvidence'];actualSHA=prior['measuredSHA256'];stdout=prior['actualCLIStdout']
 rows.append({'file':str(f),'beforeSHA256':h(before),'sha256':h(current),'exactAppliedEdits':applied,'forwardAndInverseExact':True,'frontmatterAndFAQUnchanged':True,'URLSequenceUnchanged':True,'numericDigitSequenceUnchanged':True,'spelledNumberNote':'M03 restores зургаан for six-month notice period' if id=='918' else None,'actualCLIFileSHA256':actualSHA,'actualCLIEvidence':evidence,'actualCLIExit':0,'actualCLIStdout':stdout,'currentMetrics':metrics,'currentParagraphs':paras,'currentSentencesByParagraph':sent,'excludedHeadings':heads,'delta':delta,'newCLIThisReviewer':False})
assert count==5 and eq==239;assert sum(r['currentMetrics']['sentences'] for r in rows)==242
out=C/'mn-independent-r2-proof.json';assert not out.exists();result={'at':datetime.now(timezone.utc).isoformat(),'scope':'Own R1 full snapshots + own exact proposals independently replayed; only changed or adjacent prose reread, no whole-file approval inherited without delta check','rows':rows,'exactReplacements':count,'unchangedOrderedSegments':eq,'currentTotalSegments':242,'allPreviousArtifactsUnchanged':True,'toolInputs':a['tools'],'authorManifestSHA256':h((C/'mn-author-r2-manifest.json').read_bytes()),'oldR1ManifestSHA256':h((C/'mn-independent-manifest.json').read_bytes()),'newCLIRerunByReviewer':False,'semanticStatus':'Targeted reading recorded separately'};out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'exactEdits':count,'sameSegments':eq,'total':242,'rows':[{'id':Path(r['file']).name[:3],'sha256':r['sha256'],'delta':r['delta'],'metrics':r['currentMetrics']} for r in rows if r['exactAppliedEdits']]},ensure_ascii=False,indent=2))
