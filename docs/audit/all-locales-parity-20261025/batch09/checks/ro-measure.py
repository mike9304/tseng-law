import argparse,datetime,hashlib,json,os,subprocess,sys
from pathlib import Path
sys.dont_write_bytecode=True
S=Path('/Users/son7/tseng-lanes-shared/variety');sys.path.insert(0,str(S))
import variety_metrics as vm
B=Path(__file__).resolve().parents[1];C=B/'checks';lang='ro'
p=argparse.ArgumentParser();p.add_argument('phase');p.add_argument('ids',nargs='*');a=p.parse_args()
assert a.phase.replace('-','').isalnum()
out=C/f'ro-variety-{a.phase}.json';assert not out.exists()
files=sorted((B/'src/content/columns-ro').glob('*.md'))
if a.ids:files=[f for f in files if f.name[:3] in a.ids]
assert files,'No selected manuscript files'
sha=lambda x:hashlib.sha256(x).hexdigest()
env=os.environ.copy();env['PATH']='/Users/son7/.nvm/versions/node/v24.14.1/bin:'+env.get('PATH','');env['PYTHONDONTWRITEBYTECODE']='1'
rows=[]
for f in files:
 raw=f.read_bytes();text=raw.decode();cmd=[sys.executable,str(S/'variety_metrics.py'),'check',str(f),'--lang',lang];r=subprocess.run(cmd,text=True,capture_output=True,env=env)
 _,body=vm.strip_fm(text);paras,heads,lists=vm.body_blocks(body,lang)
 rows.append({'file':str(f),'sha256':sha(raw),'command':cmd,'exit':r.returncode,'stdout':r.stdout,'stderr':r.stderr,'metrics':vm.metrics(text,lang),'paragraphs':[{'index':i+1,'opener':vm.opener(s,lang),'sentences':[{'text':t,'units':vm.slen(t,lang)} for t in vm.sentences(s,lang)]} for i,s in enumerate(paras)],'excludedHeadings':heads,'excludedListItems':lists})
 print(r.stdout,end='');print(r.stderr,end='',file=sys.stderr)
result={'at_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'phase':a.phase,'locale':lang,'method':'Actual shared CLI with explicit ro; arrays from unchanged shared functions. Metadata/FAQ/tables/headings/source list separately reviewed; not human-native/legal approval.','tool_inputs':[{'path':str(S/n),'sha256':sha((S/n).read_bytes())} for n in ['variety_metrics.py','variety_multilingual.py','variety_expansion.py','profiles/ro.json']],'rows':rows}
out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');sys.exit(max(r['exit'] for r in rows))
