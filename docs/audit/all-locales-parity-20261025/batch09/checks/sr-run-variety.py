from pathlib import Path
import sys, os, json, hashlib, subprocess, datetime, re
sys.dont_write_bytecode=True
b=Path('/Users/son7/tseng-all-language-columns-20261025/batch09')
s=Path('/Users/son7/tseng-lanes-shared/variety')
stage=sys.argv[1]
assert re.fullmatch(r'[a-z0-9-]+',stage)
files=sorted((b/'src/content/columns-sr').glob('*.md'))
assert len(files)==6
if len(sys.argv)>2:
 selected={int(x) for x in sys.argv[2:]}
 files=[p for p in files if int(p.name.split('-')[0]) in selected]
 assert len(files)==len(selected)

out=b/'checks'/('sr-variety-'+stage+'.json');assert not out.exists()
os.environ['PATH']='/Users/son7/.nvm/versions/node/v24.14.1/bin:'+os.environ.get('PATH','')
os.environ['PYTHONDONTWRITEBYTECODE']='1'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
cmd=['python3',str(s/'variety_metrics.py'),'check',*[str(p) for p in files],'--lang','sr']
r=subprocess.run(cmd,capture_output=True,text=True)
record={'atUTC':datetime.datetime.now(datetime.timezone.utc).isoformat(),'command':cmd,'exitCode':r.returncode,'stdout':r.stdout,'stderr':r.stderr,'files':[{'file':str(p),'sha256':sha(p)} for p in files],'toolHashes':{str(p):sha(p) for p in [s/'variety_metrics.py',s/'variety_multilingual.py',s/'variety_expansion.py',s/'profiles/sr.json'] if p.exists()}}
if r.returncode!=2:
 sys.path.insert(0,str(s));import variety_metrics as v
 record['extraction']=[]
 for p in files:
  text=p.read_text();mapping=v.multilingual.sentence_map(str(p),text,'sr');fm,body=v.strip_fm(text);paras,heads,items=v.body_blocks(body,'sr')
  record['extraction'].append({'file':str(p),'sha256':sha(p),'metrics':v.metrics(text,'sr',mapping),'paragraphs':[{'index':i+1,'opener':v.opener(para,'sr'),'sentences':[{'text':sentence,'units':v.slen(sentence,'sr')} for sentence in v.sentences(para,'sr',mapping)]} for i,para in enumerate(paras)],'headings':heads,'listItems':items})
out.write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
print(r.stdout);print(r.stderr);print('Evidence:',out)
sys.exit(r.returncode)
