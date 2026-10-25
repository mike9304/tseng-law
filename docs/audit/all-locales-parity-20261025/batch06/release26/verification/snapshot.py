from pathlib import Path
from datetime import datetime, timezone
import hashlib, json, subprocess, sys

R = Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
B = Path('/Users/son7/tseng-all-language-columns-20261025/batch06')
D = B/'release26'
O = R/'out-all-locales-batch06-release26'
EXPECTED = '5a2931d5afb21ace98b52a7ade1dc0db07d19c5a'
phase = sys.argv[1]
assert phase in ('before', 'after')
destination = D/'checks'/('snapshot-'+phase+'.json')
assert not destination.exists()

def record(p, root):
    return {'path': str(p.relative_to(root)), 'bytes': p.stat().st_size,
            'sha256': hashlib.sha256(p.read_bytes()).hexdigest()}

def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(',', ':')).encode()).hexdigest()

head = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=R, text=True).strip()
build = json.loads((O/'build-info.json').read_text())
assert head == build['commit'] == EXPECTED
manifest = json.loads((B/'checks/integration-readiness-manifest.json').read_text())
selected = []
for row in manifest['files']:
    current = record(Path(row['destination']), R)
    assert current['sha256'] == row['sha256']
    assert Path(row['destination']).read_bytes() == Path(row['path']).read_bytes()
    selected.append(current)
canonical = [record(Path(row['canonical_path']), R) for row in manifest['sourceFiles']]
assert all(current['sha256'] == frozen['current_sha256'] for current,frozen in zip(canonical,manifest['sourceFiles']))
all_sources = [record(p, R) for p in sorted((R/'src/content').rglob('*.md'))]
artifacts = [record(p, O) for p in sorted(O.rglob('*')) if p.is_file()]
result = {'at': datetime.now(timezone.utc).isoformat(), 'phase': phase, 'head': head, 'buildInfo': build,
          'selected42': selected, 'canonical6': canonical, 'allSources': all_sources,
          'sourceTreeSHA256': digest(all_sources), 'artifact': str(O), 'artifacts': artifacts,
          'artifactCount': len(artifacts), 'artifactBytes': sum(row['bytes'] for row in artifacts),
          'artifactTreeSHA256': digest(artifacts),
          'priorArtifactPolicy': 'No B3/B4/B5 artifact operation; their completed receipts remain unchanged. This snapshot binds the one current B6 artifact.'}
if phase == 'after':
    before = json.loads((D/'checks/snapshot-before.json').read_text())
    result['comparison'] = {key: result[key] == before[key] for key in ['head','buildInfo','selected42','canonical6','allSources','artifacts']}
    assert all(result['comparison'].values()), result['comparison']
    build_command = json.loads((B/'checks/static-build-release26-command.json').read_text())
    result['trackedSourceAndScriptsUnchanged'] = all(hashlib.sha256((R/p).read_bytes()).hexdigest() == h for p,h in build_command['trackedSrcScriptsSHA256'].items())
    assert result['trackedSourceAndScriptsUnchanged']
destination.write_text(json.dumps(result, indent=2)+'\n')
print(json.dumps({key:result[key] for key in ['head','artifactCount','artifactBytes','sourceTreeSHA256','artifactTreeSHA256']},indent=2))
if phase == 'after': print(json.dumps(result['comparison']))
