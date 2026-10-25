from pathlib import Path
from datetime import datetime,timezone
import json,hashlib,re,sys,os,unicodedata
sys.dont_write_bytecode=True
os.environ['PATH']='/Users/son7/.nvm/versions/node/v24.14.1/bin:'+os.environ.get('PATH','')
sys.path.insert(0,'/Users/son7/tseng-lanes-shared/variety');import variety_metrics as v
b=Path('/Users/son7/tseng-all-language-columns-20261025/batch05');c=b/'checks';repo=Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
h=lambda x:hashlib.sha256(x.encode()).hexdigest();sh=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
initial={x['file']:x for x in json.loads((c/'mn-initial-manuscripts.json').read_text())['files']};edits=json.loads((c/'mn-self-edits.json').read_text());audit=json.loads((c/'mn-content-audit.json').read_text())
rows=[];boundary_rows=[];lex=lambda s:''.join(ch for ch in s if unicodedata.category(ch)[0] in 'LMN')
for r in edits['records']:
 p=Path(r['file']);t=p.read_text();assert h(t)==r['afterSHA256'];inv=t
 for e in reversed(r['edits']):
  off=e['offset'];assert inv[off:off+len(e['after'])]==e['after'];inv=inv[:off]+e['before']+inv[off+len(e['after']):];assert h(inv)==e['beforeSHA256']
 old=initial[str(p)];assert inv==old['text'];assert h(inv)==old['sha256']
 fm,body=v.strip_fm(t);ofm,_=v.strip_fm(old['text'])
 expected_fm=ofm
 for e in r['edits']:
  if e['before'] in expected_fm:expected_fm=expected_fm.replace(e['before'],e['after'],1)
 assert fm==expected_fm
 urls=re.findall(r'\]\((https?://[^)]+)\)',t);ourls=re.findall(r'\]\((https?://[^)]+)\)',old['text']);assert urls==ourls
 paras,heads,items=v.body_blocks(body,'mn');br=[]
 for i,para in enumerate(paras,1):
  visible=v.unlink(para).strip();manual=[x.strip() for x in re.split(r'(?<=[.!?])\s+',visible) if x.strip()];actual=v.sentences(para,'mn');assert manual==actual,(p.name,i,manual,actual)
  assert ''.join(visible.split())==''.join(''.join(actual).split())
  sent=[]
  for s in actual:
   words=v.multilingual.words(s,'mn');assert lex(s)==lex(''.join(words)),(p.name,i,s)
   sent.append({'text':s,'wordUnits':words,'length':len(words),'letterMarkNumberCoverageExact':True})
  br.append({'paragraph':i,'opener':v.opener(para,'mn'),'manualBoundariesMatch':True,'sentences':sent})
 m=v.metrics(t,'mn');rows.append({'file':str(p),'initialSHA256':old['sha256'],'finalSHA256':h(t),'selfEdits':len(r['edits']),'reverseMatchesInitial':True,'frontmatterFAQUnchanged':fm==ofm,'declaredFrontmatterEditsOnly':True,'externalURLsValuesAndOrderUnchanged':True,'uniqueOfficialURLs':len(set(urls)),'metrics':m});boundary_rows.append({'file':str(p),'sha256':h(t),'paragraphs':br})
source_no_missing=[]
for x in audit['files']:
 s=x['sourceUrls'];assert set(s['expected'])<=set(s['actual']);source_no_missing.append({'file':x['file'],'sourceExpected':len(s['expected']),'actual':len(s['actual']),'missing':[],'added':sorted(set(s['actual'])-set(s['expected']))})
rulepaths=[Path('/Users/son7/agent-library/knowledge/editorial-voice.md'),repo/'AGENTS.md',repo/'docs/columns/EDITORIAL-VOICE.md',Path('/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md'),Path('/Users/son7/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md'),Path('/Users/son7/tseng-lanes-shared/LESSONS.md'),b/'BRIEF.md',b/'tooling/variety/ROOT-INSTALLATION.json',repo/'docs/audit/codex-column-recheck-20261024/research/source-refresh.md']
rules=[{'file':str(p),'exists':p.exists(),'sha256':sh(p) if p.exists() else None} for p in rulepaths]
receipt=b/'tooling/variety/ROOT-INSTALLATION.json';assert sh(receipt)=='c9340b9ced8aafd9c392a6aaebbad4f17a9cf558f68616db08747c4a542b7a39'
existing_fallback=[]
for slug in ['taiwan-foreign-spouse-residence','taiwan-employment-gold-card','taiwan-permanent-residence-aprc']:
 found=list((repo/'src/content/columns-mn').glob('*-'+slug+'.md'));existing_fallback.append({'slug':slug,'sameLocaleFiles':[str(x) for x in found]});assert not found
out={'atUTC':datetime.now(timezone.utc).isoformat(),'files':rows,'boundaries':boundary_rows,'method':'Read final prose and compare all literal sentence-ending period/question/exclamation boundaries with actual shared extraction. Body contains no internal dotted abbreviation requiring a special exception; metadata date dots are excluded as frontmatter. Verify all letter/mark/number codepoints retained in order. Orthographic unit checks are heuristic, not native-human approval.','sourceURLs':source_no_missing,'rulesAndReceipt':rules,'englishFallbacks':existing_fallback,'structuralErrors':audit['errors'],'errors':0}
(c/'mn-final-integrity.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'files':[{k:x[k] for k in ['file','finalSHA256','selfEdits','uniqueOfficialURLs']} for x in rows],'paragraphs':sum(len(x['paragraphs']) for x in boundary_rows),'sentences':sum(len(p['sentences']) for x in boundary_rows for p in x['paragraphs']),'errors':0,'rules':rules},ensure_ascii=False,indent=2))
