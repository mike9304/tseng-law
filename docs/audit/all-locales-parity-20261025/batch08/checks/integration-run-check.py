"""Run one approved check, preserving full output and actual exit status."""
from pathlib import Path
from datetime import datetime, timezone
import argparse,hashlib,json,os,subprocess,time
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch08')
R=Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
NODEBIN='/Users/son7/.nvm/versions/node/v24.14.1/bin'
mirror=R/'docs/audit/all-locales-parity-20261025/tooling/variety'
ap=argparse.ArgumentParser();ap.add_argument('check',choices=['unit','neutral']);args=ap.parse_args()
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
if args.check=='unit':
 command=json.loads((B.parent/'batch07/checks/integration-affected-tests-command.json').read_text())['command']
 command[0]=NODEBIN+'/npm'
 inputs=[R/p for p in command if p.startswith('src/')]+[R/'src/lib/__tests__/native-locale-columns.ts']
else:
 command=['python3',str(mirror/'tests/date-boundaries/run_neutral.py'),'--root',str(mirror),'--report',str(B/'checks/integration-tool-neutral.json')]
 inputs=[mirror/'variety_metrics.py',mirror/'variety_multilingual.py',mirror/'variety_expansion.py',mirror/'tests/date-boundaries/run_neutral.py',mirror/'tests/date-boundaries/neutral-fixtures.json']
record={'startedAt':datetime.now(timezone.utc).isoformat(),'cwd':str(R),'command':command,'inputs':[{'path':str(p),'sha256':sha(p)} for p in inputs]}
env=dict(os.environ,PATH=NODEBIN+':'+os.environ.get('PATH',''),PYTHONDONTWRITEBYTECODE='1',NO_COLOR='1')
stdout=B/f'checks/integration-{args.check}.stdout';stderr=B/f'checks/integration-{args.check}.stderr'
started=time.monotonic()
with stdout.open('x') as out,stderr.open('x') as err:
 result=subprocess.run(command,cwd=R,env=env,stdout=out,stderr=err)
record.update({'endedAt':datetime.now(timezone.utc).isoformat(),'elapsedSeconds':round(time.monotonic()-started,3),'exitCode':result.returncode,'stdout':{'path':str(stdout),'sha256':sha(stdout)},'stderr':{'path':str(stderr),'sha256':sha(stderr)},'inputsUnchanged':all(sha(row['path'])==row['sha256'] for row in record['inputs'])})
with (B/f'checks/integration-{args.check}-execution.json').open('x') as f:f.write(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in record.items() if k not in ['inputs','command']},ensure_ascii=False))
print(stdout.read_text()[-2500:]);print(stderr.read_text()[-1200:])
raise SystemExit(result.returncode)
