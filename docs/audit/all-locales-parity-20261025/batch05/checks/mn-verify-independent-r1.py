from pathlib import Path
import datetime, hashlib, json, re, unicodedata

b=Path('/Users/son7/tseng-all-language-columns-20261025/batch05')
checks=b/'checks'
sha=lambda data:hashlib.sha256(data).hexdigest()
edits=json.loads((checks/'mn-independent-r1-edits.json').read_text())
current=json.loads((checks/'mn-variety-independent-r1.json').read_text())
previous=json.loads((checks/'mn-variety-final.json').read_text())
assert current['exitCode']==0
results=[]
for row in edits['files']:
 p=Path(row['file']);text=p.read_text();restored=text
 assert sha(p.read_bytes())==row['afterSHA256']
 for change in reversed(edits['changes']):
  if change['file']==p.name:
   assert restored.count(change['after'])==1
   restored=restored.replace(change['after'],change['before'],1)
 assert sha(restored.encode())==row['beforeSHA256']
 urls=lambda value:re.findall(r'https?://[^\s<>)\"]+',value)
 assert urls(text)==urls(restored)
 # M01 is the sole frontmatter change. The optional edits touch body only.
 fm=text.split('---',2)[1];oldfm=restored.split('---',2)[1]
 if p.name.startswith('706-'):
  m01=edits['changes'][0]
  assert fm.replace(m01['after'],m01['before'],1)==oldfm
 else:assert fm==oldfm
 extraction=next(x for x in current['extraction'] if x['file']==str(p))
 oldex=next(x for x in previous['extraction'] if x['file']==str(p))
 assert len(extraction['paragraphs'])==len(oldex['paragraphs'])
 paragraph_changes=[]
 for new,old in zip(extraction['paragraphs'],oldex['paragraphs']):
  if new['sentences']!=old['sentences']:
   paragraph_changes.append({'paragraphIndex':new['index'],'before':old['sentences'],'after':new['sentences']})
 assert len(paragraph_changes)==(0 if p.name.startswith('705-') else 1)
 for para in paragraph_changes:
  for sentence in para['after']:
   assert sentence['text'].endswith(('.', '?', '!'))
 results.append({'file':str(p),'sha256':row['afterSHA256'],'inverseSHA256':sha(restored.encode()),
  'inverseMatchesR1':True,'URLSequenceUnchanged':True,'frontmatterOnlyM01':True,
  'changedExtractedParagraphs':paragraph_changes,'metrics':extraction['metrics']})
report=b/'reviews/mn-independent.md'
assert sha(report.read_bytes())==edits['reviewSHA256']
audit=json.loads((checks/'mn-content-audit.json').read_text())
assert audit['selectedFiles']==3 and audit['errors']==0
out=checks/'mn-independent-r1-verification.json'
assert not out.exists()
out.write_text(json.dumps({'atUTC':datetime.datetime.now(datetime.timezone.utc).isoformat(),
 'r1ReportUnchanged':True,'r1SHA256':sha(report.read_bytes()),'files':results,
 'structure':{'errors':audit['errors'],'selectedFiles':audit['selectedFiles'],'semanticStatus':audit['semanticStatus']},
 'evidenceSHA256':{name:sha((checks/name).read_bytes()) for name in ['mn-independent-r1-edits.json','mn-variety-independent-r1.json','mn-content-audit.json']}},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'file':str(out),'sha256':sha(out.read_bytes()),'changedParagraphs':[{ 'file':Path(r['file']).name,'changes':r['changedExtractedParagraphs']} for r in results]},ensure_ascii=False,indent=2))
