from pathlib import Path
from hashlib import sha256
from datetime import datetime,timezone
import json,sys,re
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch08');C=B/'checks';R=Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
def h(t):return sha256(t if isinstance(t,bytes) else t.encode()).hexdigest()
def load(p):return json.loads(Path(p).read_text())
def body(t):return t.split('\n---\n',1)[1]
def replace_at(t,e):
 pos=e['offset'];assert t[pos:pos+len(e['old'])]==e['old'];return t[:pos]+e['new']+t[pos+len(e['old']):]
def inverse_at(t,e):
 pos=e['offset'];assert t[pos:pos+len(e['new'])]==e['new'];return t[:pos]+e['old']+t[pos+len(e['new']):]
a=load(C/'mn-author-manifest.json');assert h((C/'mn-author-manifest.json').read_bytes())=='99cae94f51a3a1d7f4690dac71dab39af4a02e22099ee5b944beb5b633534d14'
start=load(C/'mn-independent-start.json');initial={r['file']:r for r in load(C/'mn-initial-drafts.json')};states={f:[r['text']] for f,r in initial.items()};chains=[]
for r in start['files']:assert h(Path(r['path']).read_bytes())==r['sha256']
for r in a['evidence']+a['tools']+[a['author'],a['content_audit']]:assert h(Path(r['path']).read_bytes())==r['sha256']
r1=load(C/'mn-self-edits-r1.json')
phases=[('body-r1',[dict(row,edits=[x for x in r1['edits'] if x['id']==Path(row['file']).name[:3]]) for row in r1['files']]),('body-r2',load(C/'mn-self-edits-r2.json')['rows']),('FAQ',load(C/'mn-faq-alignment.json')['rows'])]
for phase,rows in phases:
 for row in rows:
  f=row['file'];before=states[f][-1];assert h(before)==row['before_sha256']
  if 'before_text' in row:assert before==row['before_text']
  after=before
  for e in row['edits']:after=replace_at(after,e)
  assert h(after)==row['after_sha256'];reverse=after
  for e in reversed(row['edits']):reverse=inverse_at(reverse,e)
  assert reverse==before
  if phase=='FAQ':assert body(after)==body(before)
  else:assert after.split('\n---\n',1)[0]==before.split('\n---\n',1)[0]
  assert re.findall(r'https?://[^\s)<>\"\]]+',after)==re.findall(r'https?://[^\s)<>\"\]]+',before)
  states[f].append(after);chains.append({'phase':phase,'file':f,'count':len(row['edits']),'beforeSHA256':h(before),'afterSHA256':h(after),'forwardAndInverseExact':True,'FAQBodyUnchanged':phase=='FAQ'})
sys.path.insert(0,'/Users/son7/tseng-lanes-shared/variety');import variety_metrics as v
currentRows=[]
for row in a['files']:
 f=row['path'];text=Path(f).read_text();assert text==states[f][-1] and h(text)==row['sha256']
 measured=[s for s in states[f] if h(s)==row['measured_file_sha256']];assert len(measured)==1 and body(text)==body(measured[0]);assert h(body(text))==row['body_sha256']
 cli=load(C/row['actual_cli_evidence']);cr=[r for r in cli['rows'] if r['file']==f and r['sha256']==row['measured_file_sha256']];assert len(cr)==1;cr=cr[0];assert cr['exit']==0
 for q in cli['tool_inputs']:assert h(Path(q['path']).read_bytes())==q['sha256']
 paras,heads,items=v.body_blocks(v.strip_fm(text)[1],'mn');sent=[v.sentences(p,'mn') for p in paras]
 assert sent==[[s['text'] for s in p['sentences']] for p in cr['paragraphs']]
 metrics=v.metrics(text,'mn');assert metrics==cr['metrics']
 currentRows.append({'file':f,'sha256':h(text),'measuredSHA256':row['measured_file_sha256'],'bodySHA256':row['body_sha256'],'sameActualMeasuredBody':True,'actualCLIEvidence':str(C/row['actual_cli_evidence']),'actualCLIExit':cr['exit'],'actualCLIStdout':cr['stdout'],'toolHashes':cli['tool_inputs'],'metrics':metrics,'paragraphs':paras,'sentencesByParagraph':sent,'headings':heads,'items':items,'exactInitialToCurrentAndInverse':True})
canonical=[]
for row in a['files']:
 name=Path(row['path']).name;en=name.startswith(('915-','916-'));s=B.parent/'batch06/research/canonical-snapshots'/('en-'if en else'zh-')
 s=Path(str(s)+name);r=R/'src/content'/('columns-en'if en else'columns-zh')/name;assert h(s.read_bytes())==h(r.read_bytes());canonical.append({'snapshot':str(s),'R':str(r),'sha256':h(s.read_bytes())})
inputs=[{'path':str(C/'mn-author-manifest.json'),'sha256':h((C/'mn-author-manifest.json').read_bytes())}]+a['evidence']+a['tools']+[a['author'],a['content_audit']]
inputs +=[{'path':p,'sha256':h(Path(p).read_bytes())} for row in canonical for p in [row['snapshot'],row['R']]]
inputs +=load(C/'mn-independent-preparation.json')['inputs']
for q in inputs:assert h(Path(q['path']).read_bytes())==q['sha256']
result={'at':datetime.now(timezone.utc).isoformat(),'scope':'Independent replay of exact author edit offsets and current extraction; actual CLI body-identical receipts reused without relabelling full-file SHA','rows':currentRows,'chains':chains,'totalSegments':sum(r['metrics']['sentences'] for r in currentRows),'newCLIRerunByReviewer':False,'authorEdits':{'bodyR1':22,'bodyR2':6,'FAQFields':19},'canonical':canonical,'inputs':inputs,'allInitialGuardManuscriptsUnchanged':True,'findingStatus':'Meaning review in progress; numerical PASS is not semantic approval'}
assert result['totalSegments']==242
(C/'mn-independent-proof.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'files':[{k:r[k] for k in ['file','sha256','measuredSHA256','actualCLIExit']} for r in currentRows],'totalSegments':242,'chainCount':len(chains),'inputCount':len(inputs)},ensure_ascii=False,indent=2))
