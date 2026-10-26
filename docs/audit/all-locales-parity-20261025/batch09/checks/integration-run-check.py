"""Create-only actual execution receipts for bounded B9 integration checks."""
from pathlib import Path
from datetime import datetime,timezone
import argparse,hashlib,json,os,subprocess,time
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch09')
R=Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
M=R/'docs/audit/all-locales-parity-20261025/tooling/variety'
N='/Users/son7/.nvm/versions/node/v24.14.1/bin'
ap=argparse.ArgumentParser();ap.add_argument('kind',choices=['unit','neutral','checker']);a=ap.parse_args()
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
if a.kind=='unit':
 command=json.loads((B.parent/'batch07/checks/integration-affected-tests-command.json').read_text())['command'];command[0]=N+'/npm';cwd=R
 inputs=[R/p for p in command if p.startswith('src/')]+[R/'src/lib/__tests__/native-locale-columns.ts']
else:
 cwd=M
 command=['python3','-m','unittest','discover','-s','tests','-p','test_*.py'] if a.kind=='checker' else ['python3',str(M/'tests/date-boundaries/run_neutral.py'),'--root',str(M),'--report',str(B/'checks/integration-tool-neutral.json')]
 inputs=[p for p in M.rglob('*') if p.is_file() and not p.is_symlink() and '__pycache__' not in p.parts]
record={'startedAt':datetime.now(timezone.utc).isoformat(),'cwd':str(cwd),'command':command,'inputs':[{'path':str(p),'sha256':sha(p)} for p in inputs]}
env=dict(os.environ,PATH=N+':'+os.environ.get('PATH',''),PYTHONDONTWRITEBYTECODE='1',NO_COLOR='1')
out=B/f'checks/integration-{a.kind}.stdout';err=B/f'checks/integration-{a.kind}.stderr';started=time.monotonic()
with out.open('x') as o,err.open('x') as e:result=subprocess.run(command,cwd=cwd,env=env,stdout=o,stderr=e)
record.update({'endedAt':datetime.now(timezone.utc).isoformat(),'elapsedSeconds':round(time.monotonic()-started,3),'exitCode':result.returncode,'stdout':{'path':str(out),'sha256':sha(out)},'stderr':{'path':str(err),'sha256':sha(err)},'inputsUnchanged':all(sha(x['path'])==x['sha256'] for x in record['inputs'])})
with (B/f'checks/integration-{a.kind}-execution.json').open('x') as f:json.dump(record,f,indent=2);f.write('\n')
print(json.dumps({'check':a.kind,'exit':result.returncode,'seconds':record['elapsedSeconds'],'inputsUnchanged':record['inputsUnchanged']}));print(out.read_text()[-2000:]);print(err.read_text()[-1200:])
raise SystemExit(result.returncode)
