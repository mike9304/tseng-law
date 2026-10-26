"""Freeze authorized B8 inputs and clean R baseline; does not modify R."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import subprocess

B = Path('/Users/son7/tseng-all-language-columns-20261025/batch08')
R = Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
S = Path('/Users/son7/tseng-lanes-shared/variety')
HEAD = '52617670983d522fcf5dd8ed8d7c36ff374a82e5'
CONFIG = {
 'fi': ('fi-author-r2-final-manifest.json','fi-independent-r2-manifest.json','540c8c8ab4c0fac48fc4b3f8cb69641d051d0fd6679cd7720d1c4342488f36d7','65b1cdd84cc19e5db3aba61c948d9d7cc7074b02109101d940b0befa683075bd','reviews/fi-author-r2.md','reviews/fi-independent-r2.md','mustOpen'),
 'hr': ('hr-author-r2-manifest.json','hr-independent-r2-manifest.json','335d1dc625a09bab1703f2c8b99cb32cb69ab5ad65255ca5be44a101c2e52e76','9d964454819c9af13dee2e64e50a9b40fb6dde7e7bda2ff4237567fd09221f8e','reviews/hr-author-r2.md','reviews/hr-independent-r2.md','remaining_must'),
 'hu': ('hu-final-manifest-r2.json','hu-independent-r2-manifest.json','a39258c8ec0988a12e2b8377b593a828bd85f994b6142e8407cf521dfef7149a','b0ceac40702cd440f9cdbf7960ffa4c9c74646b221a86a341915f23a9e3d34ba','reviews/hu-author-r2.md','reviews/hu-independent-r2.md','mandatory_open'),
 'is': ('is-final-manifest-r2.json','is-independent-r2-final-manifest.json','a5328ee34cad2ff34628aa8531ed1296f5f58726d90a70044153982405ea4221','f21299a521bf66996b3add6ad8ddf5130bb815c7363f69c19a3b9094d7ea8ad0','checks/is-author-r2.md','reviews/is-independent-r2.md','mandatoryUnresolved'),
 'km': ('km-author-final-manifest-r2.json','km-independent-r2-manifest.json','fdcc558dee6d755383b48cea4e922191fc5d1ef49fb04291de034d18372d6e81','a6d27fc282e060651b83dbc0118703d67fd0d84703289de86e593011c42f8c06','reviews/km-author-r2.md','reviews/km-independent-r2.md','mandatoryRemaining'),
 'lv': ('lv-author-r2-final-manifest.json','lv-independent-r2-manifest.json','eea5584b04dc78a1ac97f7d26f1c507668894de3fcc970915089dbd61687c792','7197ea02f30ae9eaad8ba85b6b1bc461cd6c48614ef236e213e062e632cb0933','reviews/lv-author-r2.md','reviews/lv-independent-r2.md','mandatoryOpen'),
 'mn': ('mn-author-r2-manifest.json','mn-independent-r2-manifest.json','03d461ff5aeb4367a6e89d287bc0ce638898e684779b399f88f0739280abc6d0','572abb72cea13b2fea17297a10bc438796333ca7fec339bd45be91ad508f2c8d','reviews/mn-author-r2.md','reviews/mn-independent-r2.md','remainingMUST'),
}
def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def entry(p):
 p=Path(p); return {'path':str(p),'sha256':sha(p),'bytes':p.stat().st_size}
def read(p): return json.loads(Path(p).read_text())
def write(name,value):
 with (B/'checks'/name).open('x') as f: f.write(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
def nodes(v):
 if isinstance(v,dict):
  yield v
  for x in v.values(): yield from nodes(x)
 elif isinstance(v,list):
  for x in v: yield from nodes(x)
def refs(v):
 for n in nodes(v):
  p=n.get('path',n.get('file')); h=n.get('sha256')
  if isinstance(p,str) and isinstance(h,str) and len(h)==64:
   yield Path(p) if Path(p).is_absolute() else B/p,h
  for p,h in n.items():
   if isinstance(h,str) and len(h)==64 and (p.startswith(str(B)) or p.startswith(('checks/','reviews/'))):
    yield Path(p) if Path(p).is_absolute() else B/p,h
def current_rows(v): return v.get('files',v.get('manuscripts'))
def current_map(v):
 return {x.get('path',x.get('file')):x.get('sha256',x.get('currentSHA256',x.get('r2_sha256'))) for x in current_rows(v)}

head=subprocess.check_output(['git','rev-parse','HEAD'],cwd=R,text=True).strip()
status=subprocess.check_output(['git','status','--porcelain'],cwd=R,text=True)
assert head==HEAD and not status,(head,status)
source_freeze=B.parent/'batch06/research/source-freeze.json'
sources={}
for row in read(source_freeze)['canonical_rows']:
 p=Path(row['canonical_path']); assert sha(p)==row['current_sha256']
 assert sha(B.parent/'batch06/research'/row['current_snapshot'])==row['current_sha256']
 assert sha(B.parent/'batch06/research'/row['approved_snapshot'])==row['approved_sha256']
 clusters=sorted(q.parent.name for q in (R/'src/content').glob('columns*/'+p.name))
 assert len(clusters)==15,clusters
 sources[p.name]={**row,'existingClusterDirectories':clusters}

files=[];lanes=[];checked={}
for locale,(an,inn,ah,ih,ar,ir,must) in CONFIG.items():
 ap=B/'checks'/an;ip=B/'checks'/inn
 assert sha(ap)==ah and sha(ip)==ih,locale
 a=read(ap);i=read(ip); assert i[must]==0,locale
 documents=[(ap,a),(ip,i)]
 if locale=='hu': documents.append((B/'checks/hu-independent-r2-verification.json',read(B/'checks/hu-independent-r2-verification.json')))
 bound={}
 for owner,doc in documents:
  for p,h in refs(doc):
   if p.is_relative_to(B) and not p.is_relative_to(B/'src/content'):
    assert p.is_file() and sha(p)==h,(owner,p,h)
    checked[str(p)]={**entry(p),'referencedBy':str(owner)}
    bound[str(p)]=h
 assert sha(B/ar)==bound[str(B/ar)] and sha(B/ir)==bound[str(B/ir)],locale
 if locale=='hr': assert i['author_r2_manifest_sha256']==ah
 else: assert bound[str(ap)]==ah,locale
 am,im=current_map(a),current_map(i)
 selected=sorted((B/'src/content'/f'columns-{locale}').glob('*.md'))
 assert len(selected)==6 and {p.name for p in selected}==set(sources)
 for p in selected:
  h=sha(p);assert am[str(p)]==im[str(p)]==h,(locale,p)
  dest=R/p.relative_to(B);assert not dest.exists(),dest
  files.append({**entry(p),'locale':locale,'destination':str(dest),'canonical_path':sources[p.name]['canonical_path'],'canonical_sha256':sources[p.name]['current_sha256'],'faq_count_expected':2 if p.name.startswith('915-') else 3})
 lanes.append({'locale':locale,'authorManifest':entry(ap),'independentManifest':entry(ip),'authorReport':entry(B/ar),'independentReport':entry(B/ir),'mandatoryOpen':0})

fi_review=B/'existing-repairs/fi-independent-manifest.json'
is_review=B/'existing-repairs/is-independent-review.json'
assert sha(fi_review)=='b5ff76b829d2059a5ff7679d91c97074b68562ad5ce3e6d290922f0d388b54fa'
assert sha(is_review)=='eda5e7db51c92f340653194cf9f135bcf47cb7c753a7c266b9d54b3e93b456d2'
assert read(fi_review)['mustOpen']==read(is_review)['mandatoryUnresolved']==0
edits=read(B/'existing-repairs/fi-root-edits.json')['edits']+[read(B/'existing-repairs/is-root-edit.json')]
repairs=[]
for edit in edits:
 p=Path(edit['file']);dest=Path(edit['source']);old=dest.read_text();new=p.read_text()
 assert sha(dest)==edit['sourceSHA256'] and sha(p)==edit['currentSHA256']
 assert old.count(edit['old'])==new.count(edit['new'])==1
 assert old.replace(edit['old'],edit['new'],1)==new and new.replace(edit['new'],edit['old'],1)==old
 assert old.split('---',2)[1]==new.split('---',2)[1]
 repairs.append({**entry(p),'destination':str(dest),'beforeSHA256':sha(dest),'exactSingleReplacement':True,'inverseExact':True,'frontmatterFAQBytesUnchanged':True})
for manifest in [fi_review,is_review]:
 for p,h in refs(read(manifest)):
  if p.is_relative_to(B) and not p.is_relative_to(B/'existing-repairs/columns-fi') and not p.is_relative_to(B/'existing-repairs/columns-is'):
   assert sha(p)==h,(manifest,p);checked[str(p)]={**entry(p),'referencedBy':str(manifest)}

install=B/'tooling/date-boundaries/ROOT-INSTALL-RECEIPT.json';assert sha(install)=='b9618bb277abf32eb7bf767cc56400bb1af12ada154da431effd8b56dd68bf88'
mirror=R/'docs/audit/all-locales-parity-20261025/tooling/variety'
sync=[];unchanged=[]
for row in read(B/'tooling/date-boundaries/INSTALL-MANIFEST.json')['production_files']:
 p=S/row['relative_path'];q=mirror/row['relative_path'];assert sha(p)==row['sha256']
 if row['changed']:
  assert row['relative_path']=='variety_expansion.py' and sha(q)==read(install)['beforeSHA256']
  sync.append({**entry(p),'destination':str(q),'beforeSHA256':sha(q)})
 else:
  assert sha(q)==sha(p),q;unchanged.append(entry(q))
for row in read(install)['neutralTestsInstalled']:
 p=Path(row['path']);q=mirror/p.relative_to(S);assert sha(p)==row['sha256'] and not q.exists()
 sync.append({**entry(p),'destination':str(q),'beforeSHA256':None})
tracked=subprocess.check_output(['git','ls-files','-z','src','scripts'],cwd=R).decode().split('\0')
baseline={p:sha(R/p) for p in tracked if p and (R/p).is_file()}
markdown={p:h for p,h in baseline.items() if p.startswith('src/content/') and p.endswith('.md')}
assert len(markdown)==2370,len(markdown)
arc={p:h for p,h in markdown.items() if '/columns' in p and Path(p).name[:4] in ['704-','705-','706-']}
assert len(arc)==147,len(arc)
prior={str(p.relative_to(B)):sha(p) for p in B.rglob('*') if p.is_file() and not p.is_symlink() and not p.relative_to(B).parts[0]=='src' and not p.name.startswith('integration-')}
write('integration-before.json',{'at':datetime.now(timezone.utc).isoformat(),'head':head,'gitStatus':status,'trackedSourceAndScripts':baseline,'existingMarkdown':markdown,'arc147':arc,'toolMirrorUnchanged49':unchanged,'priorB8Evidence':prior,'capacityIncluded':False})
write('integration-readiness-manifest.json',{'at':datetime.now(timezone.utc).isoformat(),'status':'42_FINAL_FILES_7_CLOSURES_3_REPAIRS_VERIFIED','baseCommit':head,'sourceFreeze':entry(source_freeze),'sourceFiles':list(sources.values()),'localeEvidence':lanes,'files':files,'repairs':repairs,'repairClosures':[entry(fi_review),entry(is_review)],'toolInstallationReceipt':entry(install),'toolCopies':sync,'directFinalEvidenceReferencesVerified':list(checked.values()),'allNewDestinationsAbsent':True,'capacityIncluded':False,'newArticleCLIRuns':0,'humanNativeLegalApproval':False,'publicDeployment':False})
print(json.dumps({'newFiles':len(files),'locales':len(lanes),'repairs':len(repairs),'toolCopies':len(sync),'existingMarkdown':len(markdown),'arc':len(arc),'directEvidenceRefs':len(checked),'priorRecords':len(prior),'readinessSHA256':sha(B/'checks/integration-readiness-manifest.json')}))
