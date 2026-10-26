import argparse,datetime,hashlib,json,os,subprocess,sys
from pathlib import Path
sys.dont_write_bytecode=True
S=Path('/Users/son7/tseng-lanes-shared/variety');sys.path.insert(0,str(S))
import variety_metrics as vm
B=Path(__file__).resolve().parents[1];C=B/'checks'
p=argparse.ArgumentParser();p.add_argument('phase');p.add_argument('ids',nargs='*');a=p.parse_args()
assert a.phase.replace('-','').isalnum()
out=C/f'mn-variety-{a.phase}.json';assert not out.exists()
files=sorted((B/'src/content/columns-mn').glob('*.md'))
if a.ids:files=[f for f in files if f.name[:3] in a.ids]
sha=lambda x:hashlib.sha256(x).hexdigest()
env=os.environ.copy();env['PATH']='/Users/son7/.nvm/versions/node/v24.14.1/bin:'+env.get('PATH','');env['PYTHONDONTWRITEBYTECODE']='1'
if a.phase=='initial':
 snap=C/'mn-initial-drafts.json';assert not snap.exists();snap.write_text(json.dumps([{'file':str(f),'sha256':sha(f.read_bytes()),'text':f.read_text()} for f in files],ensure_ascii=False,indent=2)+'\n')
rows=[]
for f in files:
 raw=f.read_bytes();text=raw.decode();cmd=[sys.executable,str(S/'variety_metrics.py'),'check',str(f),'--lang','mn'];r=subprocess.run(cmd,text=True,capture_output=True,env=env)
 _,body=vm.strip_fm(text);paras,heads,lists=vm.body_blocks(body,'mn')
 row={'file':str(f),'sha256':sha(raw),'command':cmd,'exit':r.returncode,'stdout':r.stdout,'stderr':r.stderr,'metrics':vm.metrics(text,'mn'),'paragraphs':[{'index':i+1,'opener':vm.opener(s,'mn'),'sentences':[{'text':t,'units':vm.slen(t,'mn')} for t in vm.sentences(s,'mn')]} for i,s in enumerate(paras)],'excludedHeadings':heads,'excludedListItems':lists};rows.append(row)
 print(r.stdout,end='');print(r.stderr,end='',file=sys.stderr)
result={'at_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'phase':a.phase,'locale':'mn','method':'Actual shared CLI with explicit mn; extracted arrays from unchanged shared functions. Orthographic units, not native readability or legal approval. Metadata/FAQ/tables/headings/source list separately reviewed.','tool_inputs':[{'path':str(S/n),'sha256':sha((S/n).read_bytes())} for n in ['variety_metrics.py','variety_multilingual.py','variety_expansion.py','profiles/mn.json']],'rows':rows}
out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');sys.exit(max(r['exit'] for r in rows))
