"""Compare the frozen installed 21-locale contract before the next seven.

This reads only the baseline's existing source paths, never new da/nb/fi/pl/cs/
ro/uk manuscripts. Input changes are explicit, not silently treated as drift in
the engine. The same current bytes are also measured with both implementations.
"""
from pathlib import Path
import argparse
import ast
import os
import hashlib
import importlib.util
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--repo-root', default=os.environ.get('TSENG_REPO_ROOT'),
                    help='Exact R path; no repository inference from copy location')
args = parser.parse_args()
if not args.repo_root:
    parser.error('--repo-root or TSENG_REPO_ROOT is required')
REPO = Path(args.repo_root).expanduser().resolve()
expected_repo = Path(json.loads((ROOT / 'BASELINE28.json').read_text())['repo_root']).resolve()
if REPO != expected_repo or not (REPO / '.git').exists():
    parser.error('repository does not match the frozen BASELINE28 repo_root')
sys.path.insert(0, str(ROOT))
import variety_metrics as current
import variety_multilingual as companion


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_file(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


saved = {name: sys.modules.get(name) for name in ('variety_expansion', 'variety_multilingual')}
try:
    before_expansion = load_file('baseline21_expansion', ROOT / 'baseline21/variety_expansion.py')
    sys.modules['variety_expansion'] = before_expansion
    before_companion = load_file('baseline21_multilingual', ROOT / 'baseline21/variety_multilingual.py')
    sys.modules['variety_multilingual'] = before_companion
    before = load_file('baseline21_metrics', ROOT / 'baseline21/variety_metrics.py')
finally:
    for name, value in saved.items():
        if value is None:
            sys.modules.pop(name, None)
        else:
            sys.modules[name] = value


def measure(module, language_module, path, text, locale):
    try:
        value = module.metrics(text, locale, language_module.sentence_map(path, text, locale))
        return {'metrics': value, 'score': module.score(value, {}) if value else None}
    except (OSError, UnicodeError, language_module.MeasurementError) as error:
        return {'error_type': type(error).__name__, 'error': str(error)}


def hard_and_score(path):
    tree = ast.parse(path.read_text())
    return [ast.dump(node, include_attributes=False) for node in tree.body
            if isinstance(node, ast.FunctionDef) and node.name == 'score'
            or isinstance(node, ast.Assign) and any(isinstance(target, ast.Name) and target.id == 'HARD' for target in node.targets)]


manifest = json.loads((ROOT / 'BASELINE21.json').read_text())
frozen = json.loads((ROOT / 'NEXT7-FIXTURES-FROZEN.json').read_text())
report = {'baseline_manifest_sha256': digest(ROOT / 'BASELINE21.json'),
          'compared': 0, 'measured': 0, 'by_locale': {}, 'unavailable': [],
          'input_changes': [], 'metric_differences': [], 'frozen_result_differences': [],
          'file_integrity': [], 'unchanged_profiles': [], 'shared_integrity': [],
          'neutral_fixture_integrity': [],
          'hard_and_score_unchanged': hard_and_score(ROOT / 'variety_metrics.py') == hard_and_score(ROOT / 'baseline21/variety_metrics.py')}
for row in manifest['files']:
    rel = row['path']
    report['file_integrity'].append({'path': rel, 'matches': digest(ROOT / 'baseline21' / rel) == row['sha256']})
    report['shared_integrity'].append({'path': rel, 'matches': digest(Path('/Users/son7/tseng-lanes-shared/variety') / rel) == row['installed_sha256']})
    if rel.startswith('profiles/'):
        report['unchanged_profiles'].append({'path': rel, 'matches': digest(ROOT / rel) == row['sha256']})
for rel, expected in frozen['files'].items():
    report['neutral_fixture_integrity'].append({'path': rel, 'matches': digest(ROOT / rel) == expected})

for row in manifest['articles']:
    path = REPO / row['path']
    raw = path.read_bytes()
    text = raw.decode('utf-8')
    lang = row['locale']
    report['by_locale'][lang] = report['by_locale'].get(lang, 0) + 1
    report['compared'] += 1
    old = measure(before, before_companion, path, text, lang)
    new = measure(current, companion, path, text, lang)
    changed = hashlib.sha256(raw).hexdigest() != row['sha256']
    if changed:
        report['input_changes'].append({'path': row['path'], 'before_sha256': row['sha256'], 'current_sha256': hashlib.sha256(raw).hexdigest()})
    frozen_result = {key: row[key] for key in ('metrics', 'score', 'error_type', 'error') if key in row}
    if not changed and old != frozen_result:
        report['frozen_result_differences'].append({'path': row['path'], 'frozen': frozen_result, 'baseline_remeasured': old})
    if old != new:
        report['metric_differences'].append({'path': row['path'], 'before': old, 'after': new})
    if 'error' in old:
        report['unavailable'].append({'path': row['path'], **old})
    elif old.get('metrics') is not None:
        report['measured'] += 1

report['ok'] = not report['metric_differences'] and not report['frozen_result_differences'] and report['hard_and_score_unchanged'] and all(row['matches'] for group in ('file_integrity', 'shared_integrity', 'unchanged_profiles', 'neutral_fixture_integrity') for row in report[group])
(ROOT / 'existing21-regression.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({key: report[key] for key in ('compared', 'measured', 'by_locale', 'input_changes', 'metric_differences', 'frozen_result_differences', 'hard_and_score_unchanged', 'ok')}, ensure_ascii=False, indent=2))
print('Unchanged unavailable:', len(report['unavailable']))
sys.exit(0 if report['ok'] else 1)
