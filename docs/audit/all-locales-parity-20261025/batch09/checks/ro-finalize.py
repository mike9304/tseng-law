from pathlib import Path
from hashlib import sha256
from datetime import datetime,timezone
from difflib import SequenceMatcher
import json,sys,re
sys.dont_write_bytecode=True
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch09');C=B/'checks';S=Path('/Users/son7/tseng-lanes-shared/variety');sys.path.insert(0,str(S));import variety_metrics as vm
def h(x):return sha256(x if isinstance(x,bytes) else x.encode()).hexdigest()
def j(p):return json.loads(p.read_text())
def row(p):return {'path':str(p),'sha256':h(p.read_bytes())}
initial=j(C/'ro-initial-drafts.json');edits=j(C/'ro-self-edits-r1.json');inputs=j(C/'ro-inputs.json');first=j(C/'ro-variety-first-cli.json');last=j(C/'ro-variety-edited-r1.json');audit=j(C/'ro-content-audit-r1.json');rows=[];equal=0;faq=0
for q in inputs['inputs']+inputs['recentFullRead']+inputs['images']:assert h(Path(q['path']).read_bytes())==q['sha256'],q['path']
for s in inputs['canonical']:
 for key in ['snapshot','R']:assert h(Path(s[key]['path']).read_bytes())==s[key]['sha256']
for q in first['tool_inputs']+last['tool_inputs']:assert h(Path(q['path']).read_bytes())==q['sha256'],q['path']
for old in initial['rows']:
 f=Path(old['file']);id=f.name[:3];e=next(r for r in edits['rows'] if r['file']==str(f));before=old['text'];assert h(before)==old['sha256']==e['beforeSHA256'];after=before
 for x in e['edits']:
  k=x['offset'];assert after[k:k+len(x['old'])]==x['old'];after=after[:k]+x['new']+after[k+len(x['old']):]
 current=f.read_text();assert after==current==e['afterText'] and h(current)==e['afterSHA256'];reverse=current
 for x in reversed(e['edits']):
  k=x['offset'];assert reverse[k:k+len(x['new'])]==x['new'];reverse=reverse[:k]+x['old']+reverse[k+len(x['new']):]
 assert reverse==before
 source=next(s for s in inputs['canonical'] if s['target']==str(f));st=Path(source['snapshot']['path']).read_text()
 urls=lambda t:set(re.findall(r'https?://[^\s)<>"\]]+',t))
 assert urls(current)==urls(st)
 body,tail=current.split('\n## Surse oficiale\n',1);assert urls(body)==urls(tail)
 assert current.split('\n---\n',1)[0]==before.split('\n---\n',1)[0]
 assert not re.search(r'\*\*|__|</?(?:strong|b)(?:\s|>)',current,re.I)
 ar=next(r for g in audit['groups'] for r in g['files'] if Path(r['file']).name==f.name);assert ar['sha256']==h(current) and not ar['errors']
 cli=first if id=='918' else last;cr=next(r for r in cli['rows'] if r['file']==str(f));assert cr['exit']==0 and 'FAIL' not in cr['stdout']
 if id=='918':assert cr['sha256']==old['sha256']
 else:assert cr['sha256']==h(current)
 paras,heads,items=vm.body_blocks(vm.strip_fm(current)[1],'ro');sent=[[{'text':t,'units':vm.slen(t,'ro')} for t in vm.sentences(p,'ro')] for p in paras];metrics=vm.metrics(current,'ro');assert metrics==cr['metrics'];assert sent==[r['sentences'] for r in cr['paragraphs']]
 oldcli=next(r for r in first['rows'] if r['file']==str(f));aa=[s['text'] for p in oldcli['paragraphs'] for s in p['sentences']];zz=[s['text'] for p in sent for s in p];delta=[]
 for tag,i,k,x,y in SequenceMatcher(None,aa,zz,autojunk=False).get_opcodes():
  if tag=='equal':equal+=k-i
  else:delta.append({'kind':tag,'before':aa[i:k],'after':zz[x:y],'contextAfter':zz[max(0,x-1):min(len(zz),y+1)]})
 count=len(re.findall(r'^  - q:',current,re.M));assert count==(2 if id=='915' else 3);faq+=count
 rows.append({'path':str(f),'sha256':h(current),'initialSHA256':old['sha256'],'canonicalSHA256':source['snapshot']['sha256'],'exactEditReplayInverse':True,'actualCLIPath':str(C/('ro-variety-first-cli.json' if id=='918' else 'ro-variety-edited-r1.json')),'measuredFileSHA256':cr['sha256'],'currentFileMeasuredDirectly':id!='918','measurementBridge':'Source-footer-only change; current extracted paragraphs/sentences/metrics exactly same as initial actualCLI. Raw body bytes differ.' if id=='918' else None,'actualCLIExit':cr['exit'],'actualCLIStdout':cr['stdout'],'metrics':metrics,'paragraphs':paras,'sentencesByParagraph':sent,'heads':heads,'items':items,'boundaryDelta':delta,'FMFAQUnchanged':True,'FAQCount':count,'sourceURLs':sorted(urls(current)),'sameSourceURLsInBodyAndFooter':True,'autoErrors':0,'requiredItems':len([q for q in ar['reviews'] if q['status']=='REQUIRED']),'initialParagraphsRead':len(oldcli['paragraphs'])})
assert faq==17 and equal==217 and sum(r['metrics']['sentences'] for r in rows)==228
out=C/'ro-final-proof.json';assert not out.exists();proof={'at':datetime.now(timezone.utc).isoformat(),'scope':'Author self-check, not independent review','rows':rows,'totalFAQ':faq,'initialSegments':230,'currentSegments':228,'identicalOrderedSegments':equal,'newCurrentSegments':228-equal,'fullInitial230Read':True,'new11AndAllChangedAdjacentRead':True,'allCurrentCoveredByActualArrayReading':True,'sourceURLsPerFileTotal':sum(len(r['sourceURLs']) for r in rows),'uniqueOfficialURLs':len(set(u for r in rows for u in r['sourceURLs'])),'autoErrors':0,'requiredItems':sum(r['requiredItems'] for r in rows),'inputsAtEndUnchanged':True,'tools':last['tool_inputs'],'initialFailures':{'919':'len_cv0.445','920':'len_cv0.433','921':'len_cv0.442'},'ignoredAsPostEditEvidence':['ro-variety-initial.json: empty wrapper output, noCLI','ro-variety-r1.json: same initial five after edit-wrapper failure'],'errorsRetained':['ro-preparation-error.json','ro-measure-initial-error.json','ro-self-edit-wrapper-error.json'],'numericOccurrenceChange':'920 deletes one redundant duplicate Art15 mention; original full Article15 condition remains. Other numeric sequences unchanged.'}
out.write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'currentSHA':[{'id':Path(r['path']).name[:3],'sha256':r['sha256'],'CV':r['metrics']['len_cv'],'segments':r['metrics']['sentences']} for r in rows],'FAQ':17,'segments':228,'same':equal,'new':228-equal,'errors':0,'required':proof['requiredItems'],'proof':row(out)},ensure_ascii=False,indent=2))
