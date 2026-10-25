from pathlib import Path
import sys,os,json,hashlib,subprocess,datetime,re
sys.dont_write_bytecode=True
b=Path('/Users/son7/tseng-all-language-columns-20261025/batch05')
s=Path('/Users/son7/tseng-lanes-shared/variety')
stage=sys.argv[1] if len(sys.argv)>1 else 'initial'
assert re.fullmatch(r'[a-z0-9-]+',stage)
files=sorted((b/'src/content/columns-mn').glob('70[4-6]-*.md'))
assert len(files)==3
os.environ['PATH']='/Users/son7/.nvm/versions/node/v24.14.1/bin:'+os.environ.get('PATH','')
os.environ['PYTHONDONTWRITEBYTECODE']='1'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
cmd=['python3',str(s/'variety_metrics.py'),'check',*[str(p) for p in files],'--lang','mn']
r=subprocess.run(cmd,capture_output=True,text=True)
record={'atUTC':datetime.datetime.now(datetime.timezone.utc).isoformat(),'command':cmd,'exitCode':r.returncode,'stdout':r.stdout,'stderr':r.stderr,'files':[{'file':str(p),'sha256':sha(p)} for p in files],'toolHashes':{str(p):sha(p) for p in [s/'variety_metrics.py',s/'variety_multilingual.py',s/'variety_expansion.py',s/'profiles/mn.json'] if p.exists()}}
if r.returncode!=2:
 sys.path.insert(0,str(s));import variety_metrics as v
 record['extraction']=[]
 for p in files:
  text=p.read_text();mapping=v.multilingual.sentence_map(str(p),text,'mn');fm,body=v.strip_fm(text);paras,heads,items=v.body_blocks(body,'mn')
  record['extraction'].append({'file':str(p),'sha256':sha(p),'metrics':v.metrics(text,'mn',mapping),'paragraphs':[{'index':i+1,'opener':v.opener(para,'mn'),'sentences':[{'text':sentence,'units':v.slen(sentence,'mn')} for sentence in v.sentences(para,'mn',mapping)]} for i,para in enumerate(paras)],'headings':heads,'listItems':items})
path=b/'checks'/('mn-variety-'+stage+'.json');path.write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
print(r.stdout);print(r.stderr);print('Evidence:',path)
sys.exit(r.returncode)
