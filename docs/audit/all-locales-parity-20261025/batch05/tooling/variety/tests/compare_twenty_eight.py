"""Compare frozen current inputs, requiring an explicit source repository.

Only the 28-locale baseline's recorded paths are read. Snapshot inputs are
measured by both implementations; a later source edit is a separate fact,
never an engine regression. This script deliberately does not infer the repo
from the depth of this task-local directory.
"""
from pathlib import Path
import argparse
import ast
import datetime
import hashlib
import importlib.util
import json
import os
import subprocess
import sys

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[1]


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_file(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def hard_and_score(path):
    tree = ast.parse(path.read_text())
    return [ast.dump(node, include_attributes=False) for node in tree.body
            if (isinstance(node, ast.FunctionDef) and node.name == 'score')
            or (isinstance(node, ast.Assign) and any(
                isinstance(target, ast.Name) and target.id == 'HARD'
                for target in node.targets))]


def measure(module, language_module, path, text, locale, frozen_mapping):
    try:
        mapping = frozen_mapping
        if mapping is None:
            mapping = language_module.sentence_map(path, text, locale)
        value = module.metrics(text, locale, mapping)
        return {'metrics': value, 'score': module.score(value, {}) if value else None}
    except (OSError, UnicodeError, language_module.MeasurementError) as error:
        return {'error_type': type(error).__name__, 'error': str(error)}


def checked_file(path, expected):
    actual = digest(path) if path.is_file() else None
    return {'path': str(path), 'expected_sha256': expected,
            'actual_sha256': actual, 'matches': actual == expected}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo-root', default=os.environ.get('TSENG_REPO_ROOT'),
                        help='Exact R path, or set TSENG_REPO_ROOT; never inferred')
    args = parser.parse_args()
    if not args.repo_root:
        parser.error('--repo-root or TSENG_REPO_ROOT is required')
    repo = Path(args.repo_root).expanduser().resolve()
    manifest = json.loads((ROOT / 'BASELINE28.json').read_text())
    restored = json.loads((ROOT / 'RESTORED-BASELINE28.json').read_text())
    if repo != Path(manifest['repo_root']).resolve():
        parser.error('repository does not match the frozen BASELINE28 repo_root')
    if not (repo / '.git').exists():
        parser.error('the explicit repository has no .git entry')

    sys.path.insert(0, str(ROOT))
    import variety_metrics as current
    import variety_multilingual as companion
    saved = {name: sys.modules.get(name)
             for name in ('variety_expansion', 'variety_multilingual')}
    try:
        old_expansion = load_file('baseline28_expansion', ROOT / 'baseline28/variety_expansion.py')
        sys.modules['variety_expansion'] = old_expansion
        old_companion = load_file('baseline28_multilingual', ROOT / 'baseline28/variety_multilingual.py')
        sys.modules['variety_multilingual'] = old_companion
        before = load_file('baseline28_metrics', ROOT / 'baseline28/variety_metrics.py')
    finally:
        for name, value in saved.items():
            if value is None:
                sys.modules.pop(name, None)
            else:
                sys.modules[name] = value

    source = repo / 'docs/audit/all-locales-parity-20261025/tooling/variety'
    shared = Path(restored['shared'])
    receipt_path = repo / 'docs/audit/all-locales-parity-20261025/checks/variety-next7-installation.json'
    receipt = json.loads(receipt_path.read_text())
    receipt_files = {row['path']: row['sha256'] for row in receipt['installedFiles']}
    current_head = subprocess.check_output(
        ['git', '-C', str(repo), 'rev-parse', 'HEAD'], text=True).strip()
    report = {
        'run_at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'repo_root_explicit': str(repo), 'frozen_repo_head': manifest['repo_head'],
        'current_repo_head': current_head,
        'baseline_manifest_sha256': digest(ROOT / 'BASELINE28.json'),
        'restoration_manifest_sha256': digest(ROOT / 'RESTORED-BASELINE28.json'),
        'compared': 0, 'measured': 0, 'by_locale': {}, 'unavailable': [],
        'snapshot_integrity': [], 'current_input_changes': [],
        'metric_differences': [], 'frozen_result_differences': [],
        'file_integrity': [], 'unchanged_profiles': [], 'source_integrity': [],
        'shared_integrity': [], 'receipt_integrity': [], 'neutral_fixture_integrity': [],
        'historical_input_changes': manifest['historical_input_changes'],
        'hard_and_score_unchanged': hard_and_score(ROOT / 'variety_metrics.py') == hard_and_score(ROOT / 'baseline28/variety_metrics.py'),
        'baseline_supported_locales_match': list(before.SUPPORTED) == manifest['supported_locales'],
        'candidate_supported_locale_count': len(current.SUPPORTED),
        'new_target_manuscripts_read': False,
        'score_reference': 'same empty corpus-median mapping as BASELINE28',
        'note': 'Thai missing-map errors are actually re-executed on frozen bytes; unavailable is not a measured PASS.'}
    report['receipt_integrity'].append(checked_file(receipt_path, restored['receipt_sha256']))
    known_paths = {row['path'] for row in manifest['articles']}
    current_paths = {}
    for directory, locale in before.DIRLANG.items():
        for path in sorted((repo / 'src/content' / directory).glob('*.md')):
            current_paths[str(path.relative_to(repo))] = (path, locale)
    report['current_source_inventory_count'] = len(current_paths)
    report['added_inputs_not_measured'] = [
        {'path': rel, 'locale': current_paths[rel][1],
         'sha256': digest(current_paths[rel][0])}
        for rel in sorted(set(current_paths) - known_paths)]
    expected_receipt = {row['path']: row['sha256'] for row in restored['installed_files']}
    report['receipt_entries_match'] = receipt_files == expected_receipt
    for row in restored['installed_files']:
        rel, expected = row['path'], row['sha256']
        for group, base in [('file_integrity', ROOT / 'baseline28'),
                            ('source_integrity', source), ('shared_integrity', shared)]:
            report[group].append(checked_file(base / rel, expected))
        if rel.startswith('profiles/'):
            report['unchanged_profiles'].append(checked_file(ROOT / rel, expected))
    for name in ('BATCH03-FIXTURES-FROZEN.json', 'BATCH03-EDGE-FIXTURES-FROZEN.json'):
        frozen = json.loads((ROOT / name).read_text())
        for rel, expected in frozen['files'].items():
            report['neutral_fixture_integrity'].append(checked_file(ROOT / rel, expected))

    for row in manifest['articles']:
        rel, lang = row['path'], row['locale']
        snapshot = ROOT / row['snapshot_path']
        integrity = checked_file(snapshot, row['sha256'])
        report['snapshot_integrity'].append(integrity)
        original = repo / rel
        current_hash = digest(original) if original.is_file() else None
        if current_hash != row['sha256']:
            report['current_input_changes'].append({
                'path': rel, 'frozen_sha256': row['sha256'], 'current_sha256': current_hash})
        if not integrity['matches']:
            continue
        text = snapshot.read_bytes().decode('utf-8')
        report['by_locale'][lang] = report['by_locale'].get(lang, 0) + 1
        report['compared'] += 1
        mapping = row.get('reviewed_sentence_map')
        old = measure(before, old_companion, snapshot, text, lang, mapping)
        new = measure(current, companion, snapshot, text, lang, mapping)
        frozen_result = {key: row[key] for key in ('metrics', 'score', 'error_type', 'error') if key in row}
        if old != frozen_result:
            report['frozen_result_differences'].append({'path': rel, 'frozen': frozen_result, 'baseline_remeasured': old})
        if old != new:
            report['metric_differences'].append({'path': rel, 'before': old, 'after': new})
        if 'error' in old:
            report['unavailable'].append({'path': rel, **old})
        elif old.get('metrics') is not None:
            report['measured'] += 1

    groups = ('snapshot_integrity', 'file_integrity', 'source_integrity',
              'shared_integrity', 'receipt_integrity', 'unchanged_profiles',
              'neutral_fixture_integrity')
    report['ok'] = (
        report['compared'] == manifest['article_count']
        and report['measured'] == manifest['measured']
        and len(report['unavailable']) == manifest['unavailable']
        and not report['metric_differences'] and not report['frozen_result_differences']
        and report['hard_and_score_unchanged'] and report['baseline_supported_locales_match']
        and report['candidate_supported_locale_count'] == 35 and report['receipt_entries_match']
        and all(row['matches'] for group in groups for row in report[group]))
    (ROOT / 'existing28-regression.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    summary = {key: report[key] for key in ('compared', 'measured', 'by_locale',
               'current_input_changes', 'metric_differences', 'frozen_result_differences',
               'hard_and_score_unchanged', 'ok')}
    summary['unchanged_unavailable'] = len(report['unavailable'])
    summary['historical_changed_inputs'] = len(report['historical_input_changes'])
    summary['added_inputs_not_measured'] = len(report['added_inputs_not_measured'])
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0 if report['ok'] else 1


if __name__ == '__main__':
    sys.exit(main())
