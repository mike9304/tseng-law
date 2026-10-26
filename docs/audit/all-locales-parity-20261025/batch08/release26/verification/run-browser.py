from pathlib import Path
from datetime import datetime, timezone
import hashlib, json, os, re, subprocess, sys

B = Path('/Users/son7/tseng-all-language-columns-20261025/batch08/release26')
R = Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
expected = os.environ.get('EXPECTED_COMMIT', '')
assert re.fullmatch(r'[a-f0-9]{40}', expected), 'Set explicit root-approved EXPECTED_COMMIT'
focus = sys.argv[1] if len(sys.argv) > 1 else 'primary'
assert focus in ['primary','regressions']
script = B/'verification/browser-cases.mjs'
prefix = B/'checks'/('browser-primary104' if focus == 'primary' else 'browser-regressions11')
assert not Path(str(prefix)+'.log').exists()
cmd = ['node', str(script), '--commit='+expected]
if focus == 'regressions':
    cmd += ['--focus=regressions', '--report='+str(B/'checks/browser-regressions-results.json')]
env = os.environ.copy()
env['PATH'] = '/Users/son7/.nvm/versions/node/v24.14.1/bin:'+env['PATH']
record = {'startedAt':datetime.now(timezone.utc).isoformat(),'cwd':str(R),'command':cmd,
          'scriptSHA256':hashlib.sha256(script.read_bytes()).hexdigest(),'exitCode':None}
Path(str(prefix)+'-command.json').write_text(json.dumps(record,indent=2)+'\n')
with Path(str(prefix)+'.log').open('w') as log:
    result = subprocess.run(cmd,cwd=R,env=env,stdout=log,stderr=subprocess.STDOUT)
record.update(endedAt=datetime.now(timezone.utc).isoformat(),exitCode=result.returncode,
              logSHA256=hashlib.sha256(Path(str(prefix)+'.log').read_bytes()).hexdigest())
Path(str(prefix)+'-command.json').write_text(json.dumps(record,indent=2)+'\n')
print(json.dumps(record));print(Path(str(prefix)+'.log').read_text()[-5000:])
raise SystemExit(result.returncode)
