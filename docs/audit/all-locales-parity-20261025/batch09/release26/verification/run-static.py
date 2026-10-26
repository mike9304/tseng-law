from pathlib import Path
from datetime import datetime, timezone
import hashlib, json, os, re, subprocess, sys

D = Path('/Users/son7/tseng-all-language-columns-20261025/batch09/release26')
R = Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
expected = os.environ.get('EXPECTED_COMMIT', '')
assert re.fullmatch(r'[a-f0-9]{40}', expected), 'Set explicit root-approved EXPECTED_COMMIT'
selection = sys.argv[1]
assert selection in ['cases174', 'arc147-regression', 'sk-repairs3']
script = D/'verification'/('static-'+selection+'.mjs')
prefix = D/'checks'/('static-'+selection)
log_path = Path(str(prefix)+'.log')
receipt = Path(str(prefix)+'-command.json')
assert not log_path.exists() and not receipt.exists(), 'Preserve first-run evidence'
env = os.environ.copy()
env['PATH'] = '/Users/son7/.nvm/versions/node/v24.14.1/bin:'+env['PATH']
command = ['node', str(script)]
record = {'startedAt': datetime.now(timezone.utc).isoformat(), 'cwd': str(R),
          'expectedCommit': expected, 'command': command, 'exitCode': None,
          'scriptSHA256': hashlib.sha256(script.read_bytes()).hexdigest()}
receipt.write_text(json.dumps(record, indent=2)+'\n')
with log_path.open('x') as log:
    result = subprocess.run(command, cwd=R, env=env, stdout=log, stderr=subprocess.STDOUT)
record.update(finishedAt=datetime.now(timezone.utc).isoformat(), exitCode=result.returncode,
              logSHA256=hashlib.sha256(log_path.read_bytes()).hexdigest())
receipt.write_text(json.dumps(record, indent=2)+'\n')
print(json.dumps(record))
print(log_path.read_text()[-4000:])
raise SystemExit(result.returncode)
