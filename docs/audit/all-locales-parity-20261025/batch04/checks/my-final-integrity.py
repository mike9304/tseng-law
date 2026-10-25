from pathlib import Path
from datetime import datetime,timezone
import json,hashlib,re,sys,os,unicodedata
sys.dont_write_bytecode=True
os.environ['PATH']='/Users/son7/.nvm/versions/node/v24.14.1/bin:'+os.environ.get('PATH','')
sys.path.insert(0,'/Users/son7/tseng-lanes-shared/variety')
import variety_metrics as v
b=Path('/Users/son7/tseng-all-language-columns-20261025/batch04');c=b/'checks'
h=lambda s:hashlib.sha256(s.encode()).hexdigest()
original=json.loads((c/'my-review-r1-before.json').read_text())
print('snapshot keys',list(original))
files=original.get('files',[])
current={x['file']:Path(x['file']).read_text() for x in files}
restored=dict(current)
rounds=[]
e=json.loads((c/'my-rhythm-r3-edits.json').read_text());p=e['file'];assert h(restored[p])==e['afterSHA256'];assert restored[p].count(e['after'])==1;restored[p]=restored[p].replace(e['after'],e['before'],1);assert h(restored[p])==e['beforeSHA256'];rounds.append({'round':'rhythm-r3','file':p,'inverseMatches':True})
for name in ('my-rhythm-r2-edits.json','my-rhythm-edits.json'):
 for rec in json.loads((c/name).read_text())['records']:
  p=rec['file'];assert h(restored[p])==rec['afterSHA256']
  for x in reversed(rec['edits']):
   off=x['offset'];assert restored[p][off:off+len(x['after'])]==x['after'];restored[p]=restored[p][:off]+x['before']+restored[p][off+len(x['after']):]
   assert h(restored[p])==x['beforeSHA256']
  assert h(restored[p])==rec['beforeSHA256'];rounds.append({'round':name,'file':p,'inverseMatches':True})
r1=json.loads((c/'my-review-r1-edits.json').read_text());p=r1['file'];assert h(restored[p])==r1['afterSHA256']
for x in reversed(r1['edits']):
 assert restored[p].count(x['after'])==1;restored[p]=restored[p].replace(x['after'],x['before'],1)
assert h(restored[p])==r1['beforeSHA256'];rounds.append({'round':'independent-r1','file':p,'inverseMatches':True})
rows=[];boundaries=[]
lex=lambda s:''.join(ch for ch in s if unicodedata.category(ch)[0] in 'LMN')
for old in files:
 p=old['file'];assert restored[p]==old['text'];assert h(restored[p])==old['sha256']
 t=current[p];before_fm,before_body=v.strip_fm(old['text']);fm,body=v.strip_fm(t)
 before_urls=re.findall(r'\]\((https?://[^)]+)\)',old['text']);urls=re.findall(r'\]\((https?://[^)]+)\)',t)
 assert before_urls==urls
 row={'file':p,'r1SHA256':old['sha256'],'finalSHA256':h(t),'exactInverseToR1':True,'externalURLsValuesAndOrderUnchanged':True,'frontmatterUnchanged':fm==before_fm,'faqChange':'706 change-registration question and answer now expressly say apply; next-day 30-day period retained' if fm!=before_fm else None}
 rows.append(row)
 paras,heads,items=v.body_blocks(body,'my');br=[]
 for i,para in enumerate(paras,1):
  clean=v.unlink(para).strip();expected=[s.strip()+'။' for s in clean.split('။')[:-1]]
  if clean.split('။')[-1].strip():expected.append(clean.split('။')[-1].strip())
  extracted=v.sentences(para,'my');assert expected==extracted,(p,i,expected,extracted)
  assert ''.join(clean.split())==''.join(''.join(extracted).split())
  ss=[]
  for j,sent in enumerate(extracted,1):
   words=v.multilingual.words(sent,'my');assert lex(sent)==lex(''.join(words)),(p,i,j,'lexical coverage')
   ss.append({'sentence':j,'text':sent,'units':len(words),'wordlikeUnits':words,'allLetterMarkNumberCodepointsRetained':True})
  br.append({'paragraph':i,'u104bManualBoundaryCount':len(expected),'extractedBoundaryCount':len(extracted),'exactSentencesMatch':True,'sentences':ss})
 boundaries.append({'file':p,'sha256':h(t),'paragraphCount':len(paras),'sentenceCount':sum(len(x['sentences']) for x in br),'paragraphs':br})
record={'atUTC':datetime.now(timezone.utc).isoformat(),'method':'Read actual prose; compare all final extracted clauses with literal Myanmar U+104B stops (no quoted internal stop appears in these manuscripts); verify every letter/mark/number codepoint survives ICU wordlike extraction in order. Punctuation is intentionally not counted as a word. This is not a natural-word gold annotation.','files':rows,'reverseRounds':rounds,'boundaries':boundaries,'errors':0}
(c/'my-final-integrity.json').write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'files':rows,'paragraphs':sum(x['paragraphCount'] for x in boundaries),'sentences':sum(x['sentenceCount'] for x in boundaries),'errors':0},ensure_ascii=False,indent=2))
