from pathlib import Path
from hashlib import sha256
from datetime import datetime,timezone
import json,re,difflib,sys
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch08');C=B/'checks'
def h(x):return sha256(x if isinstance(x,bytes) else x.encode()).hexdigest()
def load(p):return json.loads(Path(p).read_text())
m=load(C/'lv-author-r2-final-manifest.json');before=load(C/'lv-author-r2-before.json');edit=load(C/'lv-author-r2-edits.json');oldReview=load(C/'lv-independent-manifest.json');finding=load(C/'lv-independent-findings.json')['optional'][0]
assert edit['old']==finding['old'] and edit['new']==finding['proposed']
for r in m['artifacts']+[m['oldAuthorManifest'],m['independentR1Manifest']]:assert h(Path(r['path']).read_bytes())==r['sha256']
for r in oldReview['artifacts']:assert h(Path(r['path']).read_bytes())==r['sha256']
checks=[]
for b,r in zip(before['manuscripts'],m['manuscripts']):
 assert b['file']==r['path'];current=Path(r['path']).read_text();assert h(current)==r['sha256']
 if r['changed']:
  assert b['text'].count(edit['old'])==1 and current==b['text'].replace(edit['old'],edit['new'],1)
  assert h(current.replace(edit['new'],edit['old'],1))==b['sha256']==finding['sha256']
 else:assert current==b['text'] and h(current)==b['sha256']
 assert current.split('---',2)[1]==b['text'].split('---',2)[1]
 assert re.findall(r'https?://[^\s)<>\"\]]+',current)==re.findall(r'https?://[^\s)<>\"\]]+',b['text'])
 assert re.findall(r'\d+',current)==re.findall(r'\d+',b['text'])
 checks.append({'file':r['path'],'beforeSHA256':b['sha256'],'sha256':r['sha256'],'changed':r['changed'],'inverseExact':True,'FMFAQNumbersURLUnchanged':True})
cli=load(C/'lv-variety-author-r2.json');row=cli['rows'][0]
assert row['sha256']==edit['currentSHA256'] and row['exit']==0
for t in cli['checkerInputs']:assert h(Path(t['path']).read_bytes())==t['sha256']
sys.path.insert(0,'/Users/son7/tseng-lanes-shared/variety');import variety_metrics as v
current=Path(row['file']).read_text();paras,heads,items=v.body_blocks(v.strip_fm(current)[1],'lv');sent=[v.sentences(p,'lv') for p in paras]
assert sent==[[s['text'] for s in p['sentences']] for p in row['paragraphs']]
old=[r for r in load(C/'lv-independent-proof.json')['rows'] if r['file']==row['file']][0]
a=[s for p in old['sentencesByParagraph'] for s in p];z=[s for p in sent for s in p]
delta=[]
for tag,i,j,x,y in difflib.SequenceMatcher(a=a,b=z).get_opcodes():
 if tag!='equal':delta.append({'tag':tag,'old':a[i:j],'new':z[x:y],'currentWithNeighbors':z[max(0,x-1):y+1]})
assert len(delta)==1 and delta[0]['old']==[edit['old']] and delta[0]['new']==[edit['new']]
assert v.metrics(current,'lv')==row['metrics']
structure=load(C/'lv-structure-author-r2.json');assert structure['errors']==0
out={'at':datetime.now(timezone.utc).isoformat(),'status':'S01_CLOSED','files':checks,'exactOneReplacement':True,'independentInverseRestoresR1':True,'currentBoundariesEqualActualCLI':True,'boundaryDelta':delta,'unchangedSentences':44,'currentSentences':45,'totalSixSentences':249,'actualCLIExit':row['exit'],'actualCLIStdout':row['stdout'],'actualCLIFile':str(C/'lv-variety-author-r2.json'),'toolHashes':cli['checkerInputs'],'changedStructureErrors':0,'priorIndependentArtifactsUnchanged':True,'newCLIRerunByReviewer':False}
(C/'lv-independent-r2-proof.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'delta':delta,'cv':row['metrics']['len_cv'],'current':edit['currentSHA256'],'allOldRecordsUnchanged':True},ensure_ascii=False,indent=2))
