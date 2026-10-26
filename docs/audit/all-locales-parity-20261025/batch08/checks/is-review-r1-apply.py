from pathlib import Path
import json,hashlib,datetime,difflib
b=Path('/Users/son7/tseng-all-language-columns-20261025/batch08');sha=lambda x:hashlib.sha256(x).hexdigest()
expected={'915':'3ba7ba24c0ec9c31fbfb1b0686032d33c305488acb64d55bb9d1c0f104841f3d','916':'03d2248e93f7bad97d76e622f07575eaaafc2b555641ab68b80a0cdf76e3f5cd','918':'3de83250611c1f1071803fb141c650446c65163ce32a06125485aa27e99b6c60','919':'09bab5c57eea037bd207f536090989cd76ad2e340f654d4ea63d3f3ffeb871ca','920':'b4b41ccba00179a1b54b5425964eebd992aff3076ba8646eafe90440ac9d27f8','921':'af57a32c37bce920c808c59c5264a593d07058f10a87f9e1376d436e5e6103c2'}
files=sorted((b/'src/content/columns-is').glob('*.md'));assert len(files)==6
for p in files:assert sha(p.read_bytes())==expected[p.name[:3]],p
snapshot=b/'checks/is-review-r1-snapshot';snapshot.mkdir()
for p in files+[b/'reviews/is-author.md',b/'checks/is-final-manifest.json',b/'reviews/is-independent.md',b/'checks/is-independent-final-manifest.json']:(snapshot/p.name).write_bytes(p.read_bytes())
changes={
'918':('Afhending íbúðar á Taívan: lánabréf og tilkynningarfrestur','Afhending íbúðar á Taívan: bréf um lán og tilkynningarfrestur','S01','SEO document terminology aligned with actual loan-related letter; body and FAQ unchanged'),
'916':(' Ósvöruð spurning getur staðið opin í yfirferðinni.','','S02','Remove repetitive short sentence; concrete investigations and technical findings/follow-up remain'),
'921':('Varðveislutíminn er takmarkaður.','Þrjátíu dagar eru lögbundið lágmark.','S03','Express statutory minimum, without adding a maximum or permission to delete; receipt-based seven-day disclosure unchanged')}
rows=[]
for p in files:
 before=p.read_text();after=before;edit=None
 if p.name[:3] in changes:
  old,new,issue,reason=changes[p.name[:3]];assert before.count(old)==1;index=before.index(old);after=before[:index]+new+before[index+len(old):]
  reverse=after[:index]+old+after[index+len(new):];assert reverse==before
  edit={'issue':issue,'old':old,'new':new,'offset':index,'reason':reason,'meaningPreserved':True,'reverseExact':True};p.write_text(after)
 rows.append({'path':str(p),'beforeSHA256':sha(before.encode()),'afterSHA256':sha(after.encode()),'changed':before!=after,'edit':edit,'diff':''.join(difflib.unified_diff(before.splitlines(True),after.splitlines(True),fromfile=p.name+'@R1',tofile=p.name+'@R2'))})
out={'atUTC':datetime.datetime.now(datetime.timezone.utc).isoformat(),'reviewSHA256':sha((b/'reviews/is-independent.md').read_bytes()),'snapshot':str(snapshot),'exactEdits':3,'files':rows,'originalAuthorAndReviewUnchanged':True,'latestLessonsSHA256':'86710ef330b108a916a7bb92a75f1ffa62dea53412e8a75f38472d9fa9b33130'}
(b/'checks/is-review-r1-edits.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps([{k:r[k] for k in ['path','afterSHA256','changed']} for r in rows],ensure_ascii=False))
