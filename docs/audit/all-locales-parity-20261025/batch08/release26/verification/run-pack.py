from pathlib import Path
from datetime import datetime, timezone
import hashlib, json, os, re, subprocess, sys

R = Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
D = Path('/Users/son7/tseng-all-language-columns-20261025/batch08/release26')
O = R/'out-all-locales-batch08-release26'
expected = os.environ.get('EXPECTED_COMMIT', '')
assert re.fullmatch(r'[a-f0-9]{40}', expected), 'Set explicit root-approved EXPECTED_COMMIT'
assert json.loads((O/'build-info.json').read_text())['commit'] == expected
assert not (D/'pack').exists(), 'Preserve any earlier package'
assert not (D/'checks/pack-command.json').exists(), 'Preserve first command receipt'
assert not (D/'checks/pack.log').exists(), 'Preserve first pack log'

def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

env = os.environ.copy()
env['PATH'] = '/Users/son7/.nvm/versions/node/v24.14.1/bin:'+env['PATH']
sources = {p: sha(R/p) for p in ['scripts/static-site/sites-pack.mjs', 'scripts/static-site/sites-worker.js']}
previous = json.loads(Path('/Users/son7/tseng-all-language-columns-20261025/batch07/release26-r2/checks/browser-pack-report.json').read_text())
assert sources['scripts/static-site/sites-pack.mjs'] == previous['packerSha256']
assert sources['scripts/static-site/sites-worker.js'] == previous['workerTemplateSha256']
cmd = ['node', 'scripts/static-site/sites-pack.mjs', '--out='+str(O), '--dist='+str(D/'pack')]
record = {'startedAt': datetime.now(timezone.utc).isoformat(), 'expectedCommit': expected,
          'cwd': str(R), 'command': cmd, 'mode': 'unchanged default packer; capacity candidate not imported',
          'sourceSHA256': sources, 'sameDefaultPackerAndWorkerAsB7': True, 'exitCode': None}
receipt = D/'checks/pack-command.json'
receipt.write_text(json.dumps(record, indent=2)+'\n')
with (D/'checks/pack.log').open('x') as log:
    result = subprocess.run(cmd, cwd=R, env=env, stdout=log, stderr=subprocess.STDOUT)
record.update(finishedAt=datetime.now(timezone.utc).isoformat(), exitCode=result.returncode,
              sourceUnchanged=all(sha(R/p) == h for p,h in sources.items()),
              logSHA256=sha(D/'checks/pack.log'))
receipt.write_text(json.dumps(record, indent=2)+'\n')
print(json.dumps(record))
print((D/'checks/pack.log').read_text()[-3000:])
assert record['sourceUnchanged']
if result.returncode:
    raise SystemExit(result.returncode)

checks = []
for script, args in [('pack-verify.mjs', [str(O)]), ('pack-config-verify.mjs', [])]:
    command = ['node', str(D/'verification'/script), *args]
    log_path = D/'checks'/(script.removesuffix('.mjs')+'.log')
    with log_path.open('x') as log:
        result = subprocess.run(command, cwd=R, env=env, stdout=log, stderr=subprocess.STDOUT)
    checks.append({'command': command, 'exitCode': result.returncode,
                   'scriptSHA256': sha(D/'verification'/script), 'logSHA256': sha(log_path)})
    print(log_path.read_text()[-3000:])
    if result.returncode:
        break
(D/'checks/pack-verification-commands.json').write_text(json.dumps(checks, indent=2)+'\n')
raise SystemExit(any(row['exitCode'] != 0 for row in checks))
