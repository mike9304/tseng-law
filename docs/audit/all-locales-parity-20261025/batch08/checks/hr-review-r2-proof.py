from pathlib import Path
from hashlib import sha256
from datetime import datetime,timezone
import json,re,difflib
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch08'); C=B/'checks'
def h(t): return sha256(t if isinstance(t,bytes) else t.encode()).hexdigest()
def read(n): return json.loads((C/n).read_text())
def front(t): return t.split('---',2)[1]
def urls(t): return re.findall(r'https?://[^\s)<>\"\]]+',t)
edit=read('hr-review-r2-edits.json'); old=read('hr-author-manifest.json')
base=read('hr-final-boundaries.json'); changed=read('hr-boundaries-review-r2.json'); cli=read('hr-variety-review-r2.json')
checks=[]; merged=dict(base)
for f,o in edit['before'].items():
 p=Path(f);now=p.read_text();changes=[r for r in edit['changes'] if r['file']==f]
 reverted=now
 for c in reversed(changes):
  assert reverted.count(c['new'])==1
  reverted=reverted.replace(c['new'],c['old'],1)
 assert h(reverted)==o['sha256'] and reverted==o['text']
 assert front(now)==front(o['text'])
 assert urls(now)==urls(o['text'])
 assert re.findall(r'\d+',now)==re.findall(r'\d+',o['text'])
 if changes:
  a=[s for q in base[p.name]['sentences_by_paragraph'] for s in q]
  z=[s for q in changed[p.name]['sentences_by_paragraph'] for s in q]
  delta=[]
  for tag,i,j,x,y in difflib.SequenceMatcher(a=a,b=z).get_opcodes():
   if tag!='equal': delta.append({'op':tag,'oldRange':[i,j],'newRange':[x,y],'old':a[i:j],'new':z[x:y],'oldWithNeighbors':a[max(0,i-1):j+1],'newWithNeighbors':z[max(0,x-1):y+1]})
  assert len(delta)==1
  assert base[p.name]['headings']==changed[p.name]['headings']
  assert base[p.name]['items']==changed[p.name]['items']
  merged[p.name]=changed[p.name]
 else:
  assert h(now)==o['sha256'];delta=[]
 checks.append({'file':f,'beforeSHA256':o['sha256'],'sha256':h(now),'bytes':len(now.encode()),'exactReverseRestoresR1':True,'frontmatterIncludingFAQUnchanged':True,'URLSequenceUnchanged':True,'NumericSequenceUnchanged':True,'changed':bool(changes),'boundaryDelta':delta})
for p,d in edit['originalRecords'].items():assert h(Path(p).read_bytes())==d
proof={'at':datetime.now(timezone.utc).isoformat(),'scope':'Three exact R1 edits only; no additional source or language policy changes','files':checks,'preservedOriginalRecords':edit['originalRecords'],'currentBodySegments':sum(len(q) for row in merged.values() for q in row['sentences_by_paragraph']),'actualChangedFileCLI':[{k:r[k] for k in ['file','sha256','exit','stdout']} for r in cli['files']],'actualCLIToolHashes':cli['tool_hashes'],'contentAuditSHA256':h((C/'hr-review-r2-content-audit.json').read_bytes()),'contentErrors':read('hr-review-r2-content-audit.json')['errors'],'semanticReviewItemsRetained':read('hr-review-r2-content-audit.json')['reviewItems'],'manualChangedAndNeighborBoundariesRead':True,'sourceL44ConditionalClaimReRead':True}
assert proof['currentBodySegments']==249
(C/'hr-review-r2-proof.json').write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n')
(C/'hr-boundaries-review-r2-merged.json').write_text(json.dumps(merged,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'files':[{k:r[k] for k in ['file','sha256','changed']} for r in checks],'bodySegments':proof['currentBodySegments'],'errors':proof['contentErrors'],'allReverse':True},ensure_ascii=False,indent=2))
