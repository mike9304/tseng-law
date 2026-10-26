"""Actual copied-checker CLI on only 45 changed R files; no source writes."""
from pathlib import Path
from datetime import datetime,timezone
import hashlib,json,os,subprocess,sys
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch09')
R=Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
M=R/'docs/audit/all-locales-parity-20261025/tooling/variety'
sys.path.insert(0,str(M));import variety_metrics as vm
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
ready=json.loads((B/'checks/integration-readiness-manifest.json').read_text())
tool={str(p.relative_to(M)):sha(p) for p in M.rglob('*') if p.is_file() and not p.is_symlink() and '__pycache__' not in p.parts}
env=dict(os.environ,PATH='/Users/son7/.nvm/versions/node/v24.14.1/bin:'+os.environ.get('PATH',''),PYTHONDONTWRITEBYTECODE='1')
rows=[]
for row in ready['files']+ready['repairs']:
 p=Path(row['destination']);locale=row['locale'];assert sha(p)==row['sha256']
 command=['python3',str(M/'variety_metrics.py'),'check',str(p),'--lang',locale]
 result=subprocess.run(command,cwd=R,env=env,capture_output=True,text=True)
 text=p.read_text();mapping=vm.multilingual.sentence_map(str(p),text,locale)
 metrics=vm.metrics(text,locale,mapping)
 paras,heads,items=vm.body_blocks(vm.strip_fm(text)[1],locale)
 arrays=[{'paragraph':para,'sentences':[{'text':s,'units':vm.slen(s,locale)} for s in vm.sentences(para,locale,mapping)]} for para in paras]
 rows.append({'file':str(p),'sha256':sha(p),'locale':locale,'command':command,'actualExitCode':result.returncode,'stdout':result.stdout,'stderr':result.stderr,'FAIL':[line for line in result.stdout.splitlines() if line.startswith('  FAIL')],'metrics':metrics,'arrays':arrays,'sourceUnchanged':sha(p)==row['sha256'],'reviewStatus':'Existing independent meaning/style closure reused on identical source bytes; no fresh full semantic reading inferred.'})
assert all(sha(M/p)==h for p,h in tool.items())
out={'atUTC':datetime.now(timezone.utc).isoformat(),'scope':'Only42 new and3 repaired actual R files, copied approved current tool; PL maps discovered from portable repository SHA paths.','toolHashes':tool,'toolUnchanged':True,'files':rows,'actualInvocations':len(rows),'failedFiles':sum(x['actualExitCode']!=0 for x in rows),'semanticStatus':'REVIEW_REQUIRED','publicDeployment':False}
with (B/'checks/integration-variety.json').open('x') as f:json.dump(out,f,ensure_ascii=False,indent=2);f.write('\n')
print(json.dumps({'files':len(rows),'failed':out['failedFiles'],'byLocale':{l:[{'id':Path(x['file']).name[:3],'exit':x['actualExitCode'],'sentences':x['metrics']['sentences'],'cv':x['metrics']['len_cv']} for x in rows if x['locale']==l] for l in sorted({x['locale'] for x in rows})}}))
raise SystemExit(1 if out['failedFiles'] else 0)
