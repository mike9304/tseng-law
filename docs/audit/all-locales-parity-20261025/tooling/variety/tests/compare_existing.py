"""Compare all original fourteen-locale articles, including explicit unavailability."""
from pathlib import Path
import ast
import hashlib
import json
import sys
from baseline_support import load_baseline

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parents[4]
sys.path.insert(0, str(ROOT))
import variety_metrics as metrics
import variety_multilingual as multilingual

before, before_multilingual = load_baseline()
report = {'source_commit': 'ef3b24e73d84968eea08ea9d58e991ccbbf83fa8',
          'compared': 0, 'measured': 0, 'unavailable': [], 'skipped': [],
          'by_locale': {}, 'differences': [], 'baseline_integrity': [],
          'unchanged_profiles': [], 'hard_and_score_unchanged': False}

manifest = json.loads((ROOT / 'RESTORED-BASELINE.json').read_text())
for relative, entry in manifest['files'].items():
    actual = hashlib.sha256((ROOT / 'baseline14' / relative).read_bytes()).hexdigest()
    report['baseline_integrity'].append({'path': relative, 'matches': actual == entry['sha256']})
    if relative.startswith('profiles/'):
        report['unchanged_profiles'].append({'path': relative, 'matches': hashlib.sha256((ROOT / relative).read_bytes()).hexdigest() == entry['sha256']})

def contract_ast(path):
    tree = ast.parse(path.read_text())
    return [ast.dump(node, include_attributes=False) for node in tree.body
            if isinstance(node, ast.FunctionDef) and node.name == 'score'
            or isinstance(node, ast.Assign) and any(isinstance(target, ast.Name) and target.id == 'HARD' for target in node.targets)]

report['hard_and_score_unchanged'] = contract_ast(ROOT / 'variety_metrics.py') == contract_ast(ROOT / 'baseline14/variety_metrics.py')

def measure(module, companion, path, text, locale):
    try:
        mapping = companion.sentence_map(path, text, locale)
        measured = module.metrics(text, locale, mapping)
        return {'metrics': measured, 'score': module.score(measured, {}) if measured else None}
    except (OSError, UnicodeError, companion.MeasurementError) as error:
        return {'error_type': type(error).__name__, 'error': str(error)}

for directory, locale in before.DIRLANG.items():
    paths = sorted((REPO / 'src/content' / directory).glob('*.md'))
    report['by_locale'][locale] = len(paths)
    for path in paths:
        text = path.read_text()
        old = measure(before, before_multilingual, path, text, locale)
        new = measure(metrics, multilingual, path, text, locale)
        report['compared'] += 1
        relative = str(path.relative_to(REPO))
        if old != new:
            report['differences'].append({'path': relative, 'before': old, 'after': new})
        if 'error' in old:
            report['unavailable'].append({'path': relative, **old})
        elif old['metrics'] is None:
            report['skipped'].append(relative)
        else:
            report['measured'] += 1

report['ok'] = not report['differences'] and report['hard_and_score_unchanged'] and all(row['matches'] for row in report['baseline_integrity'] + report['unchanged_profiles'])
(ROOT / 'existing-regression.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({key: value for key, value in report.items() if key not in ('unavailable', 'skipped', 'baseline_integrity', 'unchanged_profiles')}, ensure_ascii=False, indent=2))
print('Unchanged unavailable:', len(report['unavailable']), 'unchanged skipped:', len(report['skipped']))
sys.exit(0 if report['ok'] else 1)
