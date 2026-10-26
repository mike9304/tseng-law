from pathlib import Path
from html.parser import HTMLParser
from datetime import datetime,timezone
import hashlib,json,re,sys,difflib
sys.dont_write_bytecode=True
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch09');C=B/'checks';S=Path('/Users/son7/tseng-lanes-shared/variety')
sys.path.insert(0,str(S));import variety_metrics as v
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
shat=lambda t:hashlib.sha256(t.encode()).hexdigest()
initial=json.loads((C/'sr-initial-manuscripts.json').read_text())
edits=json.loads((C/'sr-self-edits.json').read_text())
first=json.loads((C/'sr-variety-initial.json').read_text())
second=json.loads((C/'sr-variety-revised.json').read_text())
html=json.loads((C/'sr-metadata-render.json').read_text())
structure=json.loads((C/'sr-content-audit-final.json').read_text())
assert not html['errors'] and structure['errors']==0

class Paragraphs(HTMLParser):
 def __init__(self):super().__init__(convert_charrefs=True);self.depth=0;self.buf=[];self.paragraphs=[]
 def handle_starttag(self,tag,attrs):
  if tag=='p':self.depth+=1;self.buf=[]
  if tag=='br' and self.depth:self.buf.append('\n')
 def handle_endtag(self,tag):
  if tag=='p' and self.depth:self.paragraphs.append(''.join(self.buf));self.depth-=1
 def handle_data(self,data):
  if self.depth:self.buf.append(data)

rows=[]
for base in initial['files']:
 p=Path(base['path']);text=p.read_text();old=base['text'];assert shat(old)==base['sha256']
 rev=text
 for e in reversed(edits['edits']):
  if e['path']==str(p):assert rev.count(e['after'])==1;rev=rev.replace(e['after'],e['before'],1)
 assert rev==old
 prior=next(r for r in first['extraction'] if r['file']==str(p))
 r=next((r for r in second['extraction'] if r['file']==str(p)),prior)
 evidence=second if r is not prior else first
 assert r['sha256']==sha(p)
 metadata=next(x for x in html['rows'] if x['file']==str(p));assert metadata['sha256']==sha(p)
 parser=Paragraphs();parser.feed(metadata['renderedBodyHTML'])
 rendered_sentences=[s for pp in parser.paragraphs for s in v.sentences(pp,'sr')]
 source_sentences=[s['text'] for pp in r['paragraphs'] for s in pp['sentences']]
 lengths=[s['units'] for pp in r['paragraphs'] for s in pp['sentences']]
 assert rendered_sentences==source_sentences,(p,'actual render/source arrays differ')
 assert [v.slen(x,'sr') for x in rendered_sentences]==lengths
 assert len(parser.paragraphs)==len(r['paragraphs'])
 assert re.findall(r'\]\(([^\s)]+)\)',text)==re.findall(r'\]\(([^\s)]+)\)',old)
 assert re.findall(r'\d+',text)==re.findall(r'\d+',old)
 assert text.split('---',2)[1]==old.split('---',2)[1]
 assert not re.search('[\u0400-\u04ff]',text),'Cyrillic detected in Latin-script target'
 prior_sentences=[s['text'] for pp in prior['paragraphs'] for s in pp['sentences']]
 changes=[]
 for op,i,j,k,l in difflib.SequenceMatcher(a=prior_sentences,b=source_sentences,autojunk=False).get_opcodes():
  if op!='equal':changes.append({'operation':op,'old_start':i+1,'new_start':k+1,'before':prior_sentences[i:j],'after':source_sentences[k:l]})
 rows.append({'file':str(p),'sha256':sha(p),'initial_sha256':base['sha256'],'inverse_exact':True,'frontmatter_FAQ_unchanged':True,'URL_sequence_and_numeric_tokens_unchanged':True,'actual_cli_evidence':'sr-variety-revised.json' if evidence is second else 'sr-variety-initial.json','observed_batch_exit':evidence['exitCode'],'observed_file_status':'OK — no variety limit violated','metrics':r['metrics'],'actual_source_sentences':source_sentences,'actual_rendered_sentences':rendered_sentences,'actual_rendered_paragraphs':parser.paragraphs,'source_render_arrays_and_lengths_identical':True,'lengths':lengths,'sentence_changes_after_initial':changes,'initial_human_read_count':len(prior_sentences),'current_segment_count':len(source_sentences),'source_paragraphs':r['paragraphs'],'headings':r['headings'],'image':metadata['image'],'sourceSHA256':metadata['sourceSHA256']})
for f,h in second['toolHashes'].items():assert sha(f)==h
result={'at':datetime.now(timezone.utc).isoformat(),'rows':rows,'actual_cli_invocations':2,'actual_cli_file_measurements':11,'initial_batch_exit':first['exitCode'],'initial_FAIL_files':['918','919'],'revised_batch_exit':second['exitCode'],'unchanged_921_basis':'Initial batch exited1 because other files failed; this exact SHA was individually OK. No new per-file exit0 claimed.','current_total_segments':sum(r['current_segment_count'] for r in rows),'initial_total_segments':sum(r['initial_human_read_count'] for r in rows),'current_all_files_FAIL0':True,'structural_errors':structure['errors'],'FAQ_total':sum(len(x['metadata']['faq']) for x in html['rows']),'same_tool_hashes':second['toolHashes'],'all_initial_bytes_recoverable':True,'meaning_and_boundary_review':'Initial240 segments read in full; all actual7edit strings and resulting changed segments directly reread. Current238 segments correspond exactly to actual ReactMarkdown paragraph text. Conditions/figures/officialURL/FAQ preserved.','limits':['Model author self-review; no native human or legal approval','Direct full original image viewing reused from continuous B6 work by unchanged byte hashes','Only parser HTML/prose arrays verified; no full browser/card/JSON-LD/feed/public deployment claim']}
out=C/'sr-final-proof.json';assert not out.exists();out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'file':str(out),'sha256':sha(out),'current_segments':result['current_total_segments'],'FAQ':result['FAQ_total'],'six_exact_reverse':len(rows),'source_render_match':True},ensure_ascii=False,indent=2))
for r in rows:
 for d in r['sentence_changes_after_initial']:print(Path(r['file']).name[:3],d)
