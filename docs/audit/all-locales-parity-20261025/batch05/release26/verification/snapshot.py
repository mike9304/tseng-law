from pathlib import Path
from datetime import datetime
import hashlib, json, subprocess, sys

R = Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
B = Path('/Users/son7/tseng-all-language-columns-20261025/batch05')
D = B / 'release26'
O = R / 'out-all-locales-batch05-release26'
EXPECTED = '63f5fad925cba35d71c44d37fd48071c3409c862'
phase = sys.argv[1]
assert phase in ('before', 'after')
destination = D / ('checks/snapshot-' + phase + '.json')
assert not destination.exists(), 'Preserve prior snapshot'

def record(p, root):
    digest = hashlib.sha256()
    with p.open('rb') as handle:
        while chunk := handle.read(1024 * 1024):
            digest.update(chunk)
    return {'path': str(p.relative_to(root)), 'bytes': p.stat().st_size, 'sha256': digest.hexdigest()}

def tree(root):
    return [record(p, root) for p in sorted(root.rglob('*')) if p.is_file()]

canonical = lambda value: json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()
hash_data = lambda data: hashlib.sha256(data).hexdigest()
head = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=R, text=True).strip()
build = json.loads((O / 'build-info.json').read_text())
assert head == build['commit'] == EXPECTED
manifest = json.loads((B / 'checks/integration-final-manuscript-manifest.json').read_text())
sources = []
for row in manifest['rows']:
    repository = record(Path(row['target']), R)
    assert repository['sha256'] == row['sha256']
    assert Path(row['target']).read_bytes() == Path(row['source']).read_bytes()
    sources.append(repository)
he = record(R / 'src/content/columns-he/706-taiwan-arc-renewal-changes-reentry.md', R)
assert he['sha256'] == 'fa78467ebf94880a503e0549e6f00b73950771324285d92524996f8e09f87b3d'
all_sources = [record(p, R) for p in sorted((R / 'src/content').rglob('*.md'))]
artifacts = tree(O)
preserved_roots = [B.parent / 'batch03', B.parent / 'batch04']
preserved_roots += sorted(p for p in R.iterdir() if p.is_dir() and (p.name.startswith('out-all-locales-batch03') or p.name.startswith('out-all-locales-batch04')))
preserved = {str(root): tree(root) for root in preserved_roots}
result = {'at': datetime.now().astimezone().isoformat(), 'phase': phase, 'head': head,
          'buildInfo': build, 'artifact': str(O), 'sources': sources, 'heRegressionSource': he,
          'allSources': all_sources, 'sourceTreeSha256': hash_data(canonical(all_sources)),
          'artifacts': artifacts, 'artifactCount': len(artifacts),
          'artifactBytes': sum(row['bytes'] for row in artifacts),
          'artifactTreeSha256': hash_data(canonical(artifacts)), 'preserved': preserved}
if phase == 'after':
    before = json.loads((D / 'checks/snapshot-before.json').read_text())
    result['comparison'] = {key: result[key] == before[key] for key in ['head', 'buildInfo', 'sources', 'heRegressionSource', 'allSources', 'artifacts']}
    result['preservedDrift'] = []
    result['preservedAdditions'] = {}
    for root, original in before['preserved'].items():
        current = {row['path']: row for row in result['preserved'][root]}
        original_paths = {row['path'] for row in original}
        result['preservedDrift'] += [{'root': root, 'path': row['path']} for row in original if current.get(row['path']) != row]
        additions = sorted(set(current) - original_paths)
        if additions:
            result['preservedAdditions'][root] = additions
        if root.startswith(str(R)):
            assert not additions, 'Older artifact gained files'
    assert all(result['comparison'].values()), result['comparison']
    assert not result['preservedDrift'], result['preservedDrift']
destination.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({key: result[key] for key in ['head', 'artifactCount', 'artifactBytes', 'sourceTreeSha256', 'artifactTreeSha256']}, indent=2))
print(json.dumps({'preservedFiles': {root: len(rows) for root, rows in preserved.items()}, 'comparison': result.get('comparison'), 'preservedDrift': result.get('preservedDrift')}, indent=2))
