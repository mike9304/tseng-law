"""Read-only R preflight, exact frozen input/repair/tool bindings, create-only ledger."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib,json,re,subprocess
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch09')
R=Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
S=Path('/Users/son7/tseng-lanes-shared/variety')
MIRROR=R/'docs/audit/all-locales-parity-20261025/tooling/variety'
HEAD='35cc5d32cb5a4394d674f1f767b5f32eedd5cee7'
CONFIG={
 'nb':('kimi-nb/r3-intake-manifest.json','checks/nb-independent-r3-final-manifest.json','236eaf2c36728c5a6bd6c2af50285d185ee03a695f419d43755bf19862249fb1','kimi-nb/raw-output-r3/author-review-r3.md','reviews/nb-independent-r3.md'),
 'ne':('checks/ne-author-r2-final-manifest.json','checks/ne-independent-r2-final-manifest.json','c3b3c36f0840bfb8f324be1ef9c3275b647f97e194279427d4640f5acb24344a','reviews/ne-author-r2.md','reviews/ne-independent-r2.md'),
 'pl':('kimi-pl/r4-intake-manifest.json','checks/pl-independent-r4-manifest.json','df9542c88093b21a519b7b3a1f374c9b55972167a041e9367676e48d07b754ca','kimi-pl/raw-output-r4/author-review-r4.md','reviews/pl-independent-r4.md'),
 'ro':('checks/ro-author-r3-manifest.json','checks/ro-independent-r2-manifest.json','ebaa9506140a8ae7823803b78777506547df75778a6909acef44f6f7ada826aa','reviews/ro-author-r3.md','reviews/ro-independent-r2.md'),
 'sk':('checks/sk-final-manifest-r2.json','checks/sk-independent-r2-final-manifest.json','ce0dda5c5a7f512fac2f3d9f19c2d7e975bf58b3eb995178e906160a789bddde','checks/sk-author-r2.md','reviews/sk-independent-r2.md'),
 'sl':('checks/sl-final-manifest-r2.json','checks/sl-independent-r2-manifest.json','952048fbb9abb65ab7475540fda2abc93c9e53a152ebefd94f9416bef2c03613','reviews/sl-author-r2.md','reviews/sl-independent-r2.md'),
 'sr':('checks/sr-final-manifest-r2.json','checks/sr-independent-r2-manifest.json','612dad7196d134d6e38b4abaff03db57914fb9f8be91bf01d498567da9ec84f9','reviews/sr-author-r2.md','reviews/sr-independent-r2.md'),
}
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def entry(p):
 p=Path(p);return {'path':str(p),'sha256':sha(p),'bytes':p.stat().st_size}
def read(p):return json.loads(Path(p).read_text())
def write(name,v):
 with (B/'checks'/name).open('x') as f:json.dump(v,f,ensure_ascii=False,indent=2);f.write('\n')
def nodes(v):
 if isinstance(v,dict):
  yield v
  for x in v.values():yield from nodes(x)
 elif isinstance(v,list):
  for x in v:yield from nodes(x)
def refs(v):
 for n in nodes(v):
  p=n.get('path',n.get('file'));h=n.get('sha256')
  if isinstance(p,str) and isinstance(h,str) and re.fullmatch('[0-9a-f]{64}',h):
   yield Path(p) if Path(p).is_absolute() else B/p,h
def current_rows(d):return next(d[k] for k in ['currentFiles','currentSources','currentManuscripts','files','manuscripts'] if k in d)
def current_map(rows):return {x.get('path',x.get('file')):x.get('sha256',x.get('afterSHA256',x.get('r4SHA256'))) for x in rows}

head=subprocess.check_output(['git','rev-parse','HEAD'],cwd=R,text=True).strip()
status=subprocess.check_output(['git','status','--porcelain'],cwd=R,text=True)
assert head==HEAD and not status,(head,status)
freeze=B.parent/'batch06/research/source-freeze.json';sources={}
for row in read(freeze)['canonical_rows']:
 p=Path(row['canonical_path']);assert sha(p)==row['current_sha256']
 assert sha(B.parent/'batch06/research'/row['current_snapshot'])==row['current_sha256']
 clusters=sorted(q.parent.name for q in (R/'src/content').glob('columns*/'+p.name));assert len(clusters)==22
 sources[p.name]={**row,'existingClusterDirectories':clusters}
files=[];lanes=[];verified={};historical=[]
for locale,(an,inn,ih,ar,ir) in CONFIG.items():
 ap=B/an;ip=B/inn;assert sha(ip)==ih
 a=read(ap);i=read(ip);assert i.get('mandatoryRemaining',i.get('mandatoryUnresolved'))==0
 am=current_map(a['sourceGuard'] if locale=='pl' else current_rows(a));im=current_map(current_rows(i))
 for doc in [a,i]:
  for p,h in refs(doc):
   if p.is_relative_to(B) and not p.is_relative_to(B/'src/content'):
    assert p.is_file() and sha(p)==h,(locale,p,h)
    verified[str(p)]=entry(p)
   elif p.is_file():historical.append({'path':str(p),'recordedSHA256':h,'currentSHA256':sha(p),'same':sha(p)==h,'note':'External/input version provenance; current canonical/manuscript/tool contracts are separately verified.'})
 for p in [ap,ip,B/ar,B/ir]:verified[str(p)]=entry(p)
 # Each current file is independently bound to both author/intake and closure.
 selected=sorted((B/'src/content'/f'columns-{locale}').glob('*.md'))
 assert len(selected)==6 and {p.name for p in selected}==set(sources)
 for p in selected:
  h=sha(p);assert am[str(p)]==im[str(p)]==h,(locale,p)
  dest=R/p.relative_to(B);assert not dest.exists()
  files.append({**entry(p),'locale':locale,'destination':str(dest),'canonical_path':sources[p.name]['canonical_path'],'canonical_sha256':sources[p.name]['current_sha256'],'faq_count_expected':2 if p.name.startswith('915-') else 3})
 lanes.append({'locale':locale,'authorManifest':entry(ap),'independentManifest':entry(ip),'authorReport':entry(B/ar),'independentReport':entry(B/ir),'mandatoryOpen':0,'optionalRemaining':i.get('optionalUnresolved',i.get('optionalRemaining',[]))})

skreport=B/'reviews/sk-existing-independent.md';assert sha(skreport)=='b30d85351aa39ce2a1779392cf80f7af7575d2b0030ce8d56ba9784130aac831'
receipt=json.loads(re.search(r'```json\n(.*?)\n```',skreport.read_text(),re.S).group(1))
assert receipt['authorManifestSHA256']==sha(B/'checks/sk-existing-final-manifest.json')
edits=[]
for n in ['sk-existing-edits-r1.json','sk-existing-edits-r2.json','sk-existing-edits-r3.json']:
 d=read(B/'checks'/n)
 for x in d['changes']:edits.append({**x,'file':x.get('file',d.get('file'))})
repairs=[]
for x in read(B/'checks/sk-existing-inputs.json')['files']:
 source=Path(x['source']);p=Path(x['file']);old=source.read_text();text=old
 assert sha(source)==x['sha256']==sha(x['snapshot'])
 selected=[e for e in edits if e['file']==str(p)]
 for e in selected:
  assert hashlib.sha256(text.encode()).hexdigest()==e['beforeSHA256']
  assert text.count(e['old'])==1;text=text.replace(e['old'],e['new'],1)
  assert hashlib.sha256(text.encode()).hexdigest()==e['afterSHA256']
 assert text==p.read_text()
 for e in reversed(selected):assert text.count(e['new'])==1;text=text.replace(e['new'],e['old'],1)
 assert text==old and old.split('---',2)[1]==p.read_text().split('---',2)[1]
 repairs.append({**entry(p),'destination':str(source),'beforeSHA256':sha(source),'exactEdits':len(selected),'forwardExact':True,'inverseExact':True,'frontmatterFAQBytesUnchanged':True,'locale':'sk'})
assert sum(x['exactEdits'] for x in repairs)==8

pl_install=B/'tooling/pl-date-boundaries-r2/ROOT-INSTALLATION.json'
sktr_install=B.parent/'batch10/tooling/sk-tr-root-install/ROOT-INSTALLATION.json'
sk_install=B/'tooling/sk-date-boundaries/ROOT-INSTALLATION.json'
assert sha(pl_install)=='5d0d4a3810e2eb864028cf32a97ee6a0d50baf5025a53fd20923f11547d1bc95'
assert sha(sktr_install)=='4a71e4966c7eabc64828cda77ca6161b007a8a794525c88e1fda1d8dd192fbe9'
toolcopies=[];toolchain={}
steps=[(sk_install,x['relative_path'],x.get('before_sha256'),x['sha256']) for x in read(sk_install)['installed']]
steps += [(pl_install,x['file'],x.get('baselineSHA256'),x['sha256']) for x in read(pl_install)['installed']]
steps += [(sktr_install,x['relativePath'],x['beforeSHA'],x['afterSHA']) for x in read(sktr_install)['files']]
for receipt_path,name,before,after in steps:
 q=MIRROR/name
 if name not in toolchain:toolchain[name]={'beforeSHA256':sha(q) if q.exists() else None,'steps':[]}
 chain=toolchain[name];previous=chain['steps'][-1]['afterSHA256'] if chain['steps'] else chain['beforeSHA256']
 assert previous==before,(name,previous,before)
 chain['steps'].append({'receipt':str(receipt_path),'beforeSHA256':before,'afterSHA256':after})
for name,chain in toolchain.items():
 p=S/name;assert sha(p)==chain['steps'][-1]['afterSHA256'],name
 toolcopies.append({**entry(p),'destination':str(MIRROR/name),**chain})
tracked=[p for p in subprocess.check_output(['git','ls-files','-z'],cwd=R).decode().split('\0') if p and (R/p).is_file()]
baseline={p:sha(R/p) for p in tracked}
markdown={p:h for p,h in baseline.items() if p.startswith('src/content/') and p.endswith('.md')}
arc={p:h for p,h in markdown.items() if '/columns' in p and Path(p).name[:4] in ['704-','705-','706-']};assert len(arc)==147
prior={str(p.relative_to(B)):sha(p) for p in B.rglob('*') if p.is_file() and not p.is_symlink() and not p.name.startswith('integration-')}
rules=[R/'docs/columns/EDITORIAL-VOICE.md',Path('/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md'),S.parent/'SENTENCE-VARIETY-RULE.md',S.parent/'LESSONS.md']
write('integration-before.json',{'atUTC':datetime.now(timezone.utc).isoformat(),'head':head,'gitStatus':status,'trackedSHA256':baseline,'existingMarkdown':markdown,'arc147':arc,'priorB9Evidence':prior,'rules':[entry(p) for p in rules],'homeVoiceMissing':not Path('/Users/son7/agent-library/knowledge/editorial-voice.md').exists()})
write('integration-sk-embedded-receipt.json',{'sourceReport':entry(skreport),'receipt':receipt,'separateIndependentManifestExists':False,'confirmedByReviewer':'column_deploy message: report-only ownership, embedded receipt is authoritative frozen execution evidence.'})
write('integration-readiness-manifest.json',{'atUTC':datetime.now(timezone.utc).isoformat(),'baseCommit':head,'sourceFreeze':entry(freeze),'sourceFiles':list(sources.values()),'localeEvidence':lanes,'files':files,'repairs':repairs,'repairClosure':entry(skreport),'repairAuthorManifest':entry(B/'checks/sk-existing-final-manifest.json'),'toolInstallationReceipts':[entry(sk_install),entry(pl_install),entry(sktr_install)],'toolCopies':toolcopies,'directFinalEvidenceReferencesVerified':list(verified.values()),'externalHistoricalReferences':historical,'capacityIncluded':False,'CSCandidateIncluded':False,'commitPushBuildDeploy':False})
print(json.dumps({'newFiles':len(files),'repairs':len(repairs),'tools':len(toolcopies),'existingMarkdown':len(markdown),'tracked':len(tracked),'priorB9':len(prior),'verifiedDirectEvidence':len(verified),'externalHistoricalDifferences':sum(not x['same'] for x in historical)}))
