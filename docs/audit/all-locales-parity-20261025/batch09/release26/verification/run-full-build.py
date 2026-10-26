from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import os
import re
import socket
import shutil
import subprocess

R = Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
B = Path('/Users/son7/tseng-all-language-columns-20261025/batch09')
HEAD = os.environ.get('EXPECTED_COMMIT', '')
assert re.fullmatch(r'[a-f0-9]{40}', HEAD), 'Set explicit root-approved EXPECTED_COMMIT'
OUT = R/'out-all-locales-batch09-release26'
PREFIX = B/'release26/checks/static-build-release26'

def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def git(*args):
    return subprocess.check_output(['git', *args], cwd=R, text=True).strip()

def save(record):
    Path(str(PREFIX)+'-command.json').write_text(json.dumps(record, indent=2)+'\n')

assert git('rev-parse', 'HEAD') == HEAD and git('status', '--porcelain') == ''
assert not OUT.exists(), 'Preserve any existing artifact'
with socket.socket() as port_probe:
    port_probe.bind(('127.0.0.1',4643))
assert not Path(str(PREFIX)+'-full.log').exists(), 'Preserve initial build log'
tracked = {p: sha(R/p) for p in git('ls-files', 'src', 'scripts').splitlines() if (R/p).is_file()}
markdown = {str(p.relative_to(R)): sha(p) for p in (R/'src/content').rglob('*.md')}
cmd = ['node', 'scripts/static-site/build.mjs', '--out='+OUT.name, '--port=4643', '--media-origin=https://media.tseng-law.com']
record = {'startedAt': datetime.now(timezone.utc).isoformat(), 'cwd': str(R), 'HEAD': HEAD,
          'command': cmd, 'runtime': 'Node24.14.1 via NVM PATH',
          'dataMode': 'local fallback; --data intentionally omitted, not Air production CMS mirror parity',
          'mediaOrigin': 'https://media.tseng-law.com', 'exitCode': None,
          'allSourceMarkdownSHA256': markdown, 'trackedSrcScriptsSHA256': tracked}
save(record)
env = os.environ.copy()
env['PATH'] = '/Users/son7/.nvm/versions/node/v24.14.1/bin:'+env['PATH']
with Path(str(PREFIX)+'-full.log').open('w') as log:
    result = subprocess.run(cmd, cwd=R, env=env, stdout=log, stderr=subprocess.STDOUT)
record.update(finishedAt=datetime.now(timezone.utc).isoformat(), exitCode=result.returncode,
              HEADUnchanged=git('rev-parse', 'HEAD') == HEAD,
              sourceMarkdownUnchanged=all(sha(R/p) == h for p,h in markdown.items()),
              trackedSrcScriptsUnchanged=all(sha(R/p) == h for p,h in tracked.items()),
              finalGitStatus=git('status', '--porcelain'), logSHA256=sha(Path(str(PREFIX)+'-full.log')))
for source, suffix in [(R/'static-site-report.json', '-report.json'), (R/'.static-site-server.log', '-server.log'), (R/'static-site-media.json', '-media.json')]:
    if source.exists():
        destination = Path(str(PREFIX)+suffix)
        shutil.copyfile(source, destination)
save(record)
print(json.dumps({k:v for k,v in record.items() if not isinstance(v, dict)}, ensure_ascii=False))
print(Path(str(PREFIX)+'-full.log').read_text()[-3500:])
assert record['HEADUnchanged'] and record['sourceMarkdownUnchanged'] and record['trackedSrcScriptsUnchanged'] and not record['finalGitStatus']
raise SystemExit(result.returncode)
