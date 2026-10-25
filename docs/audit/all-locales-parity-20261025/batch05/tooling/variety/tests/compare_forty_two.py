"""Replay exactly frozen old42 bytes. Repository location is always explicit."""
from pathlib import Path
import argparse
import ast
import datetime
import hashlib
import importlib.util
import json
import os
import statistics
import subprocess
import sys

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[1]


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def contract(path):
    return [ast.dump(n, include_attributes=False) for n in ast.parse(path.read_text()).body
            if (isinstance(n, ast.FunctionDef) and n.name == 'score') or
            (isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id == 'HARD' for t in n.targets))]


def measure(module, companion, row, path, text):
    try:
        mapping = row.get('reviewed_sentence_map')
        if mapping is None:
            mapping = companion.sentence_map(path, text, row['locale'])
        value = module.metrics(text, row['locale'], mapping)
        if value is None:
            return {'metrics': None, 'check_exit': 2 if row['locale'] in companion.LANGUAGES else 0, 'unmeasured_skip': True}
        fails = []
        for key, (operator, threshold, _) in module.HARD.items():
            if threshold == 'dyn':
                threshold = max(2, value['paras'] // 8)
            if not (value[key] >= threshold if operator == '>=' else value[key] <= threshold):
                fails.append(key)
        if value['lang'] == 'ja' and min(value['ja_desu'], value['ja_da']) >= 3:
            fails.append('ja_style_mixed')
        return {'metrics': value, 'score_default': module.score(value, {}),
                'hard_failures': fails, 'check_exit': 1 if fails else 0}
    except (OSError, UnicodeError, companion.MeasurementError) as error:
        return {'error_type': type(error).__name__, 'error': str(error), 'check_exit': 2}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo-root', required=True)
    args = parser.parse_args()
    repo = Path(args.repo_root).expanduser().resolve()
    inputs = json.loads((ROOT / 'BASELINE42-INPUTS.json').read_text())
    baseline = json.loads((ROOT / 'BASELINE42-CANDIDATE.json').read_text())
    frozen = json.loads((ROOT / 'CANDIDATE-FROZEN.json').read_text())
    if repo != Path(inputs['repo_root']).resolve() or not (repo / '.git').exists():
        parser.error('explicit repo-root must equal the frozen real repository; no parent-depth inference')
    previous_path = Path(baseline['source_candidate']) / 'BASELINE35-INPUTS.json'
    sys.path.insert(0, str(ROOT))
    import variety_metrics as candidate
    import variety_multilingual as companion
    saved = {k: sys.modules.get(k) for k in ('variety_expansion', 'variety_multilingual')}
    try:
        old_expansion = load('frozen42_expansion', ROOT / 'baseline42/variety_expansion.py')
        sys.modules['variety_expansion'] = old_expansion
        old_companion = load('frozen42_multilingual', ROOT / 'baseline42/variety_multilingual.py')
        sys.modules['variety_multilingual'] = old_companion
        old = load('frozen42_metrics', ROOT / 'baseline42/variety_metrics.py')
    finally:
        for key, value in saved.items():
            if value is None:
                sys.modules.pop(key, None)
            else:
                sys.modules[key] = value
    failures = []

    def integrity():
        for row in baseline['production_files']:
            for base in (ROOT / 'baseline42',):
                if sha(base / row['path']) != row['sha256']:
                    failures.append(str(base / row['path']))
            if row['path'].startswith('profiles/') and sha(ROOT / row['path']) != row['sha256']:
                failures.append(str(ROOT / row['path']))
        for row in frozen['production_files']:
            if sha(ROOT / row['path']) != row['sha256']:
                failures.append(str(ROOT / row['path']))
        if sha(Path(baseline['source_candidate']) / 'BATCH04-VERIFICATION.json') != baseline['source_manifest_sha256']:
            failures.append('source candidate manifest drift')

    integrity()
    if failures:
        parser.error('production or baseline differs from frozen hashes')
    report = {'recorded_at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
              'repo_root': str(repo), 'frozen_repo_head': inputs['repo_head'],
              'repo_head_start': subprocess.check_output(['git', '-C', str(repo), 'rev-parse', 'HEAD'], text=True).strip(),
              'count_scope': inputs['count_scope'], 'input_manifest_sha256': sha(ROOT / 'BASELINE42-INPUTS.json'),
              'candidate_freeze_sha256': sha(ROOT / 'CANDIDATE-FROZEN.json'),
              'compared': 0, 'measured': 0, 'unavailable': 0, 'by_locale': {},
              'metrics_score_hard_differences': [], 'boundary_differences': [], 'unit_differences': [],
              'source_input_drift': [], 'rows': [], 'integrity_failures': failures,
              'score_hard_ast_unchanged': contract(ROOT / 'variety_metrics.py') == contract(ROOT / 'baseline42/variety_metrics.py')}
    for row in inputs['files']:
        path = ROOT / row['snapshot']
        if sha(path) != row['sha256']:
            failures.append(str(path)); continue
        text = path.read_bytes().decode('utf-8')
        before = measure(old, old_companion, row, path, text)
        after = measure(candidate, companion, row, path, text)
        result = {**row, 'before': before, 'after': after}
        report['compared'] += 1
        report['by_locale'][row['locale']] = report['by_locale'].get(row['locale'], 0) + 1
        if before.get('metrics'):
            report['measured'] += 1
        elif 'error' in before:
            report['unavailable'] += 1
        if before != after:
            report['metrics_score_hard_differences'].append(row['path'])
        if row['locale'] != 'th':
            _, body = old.strip_fm(text)
            old_paras = old.body_blocks(body, row['locale'])[0]
            new_paras = candidate.body_blocks(body, row['locale'])[0]
            old_sentences = [s for p in old_paras for s in old.sentences(p, row['locale'])]
            new_sentences = [s for p in new_paras for s in candidate.sentences(p, row['locale'])]
            if old_paras != new_paras or old_sentences != new_sentences:
                report['boundary_differences'].append(row['path'])
            if row['locale'] in old_companion.LANGUAGES:
                old_words = [old_companion.words(s, row['locale']) for s in old_sentences]
                new_words = [companion.words(s, row['locale']) for s in new_sentences]
                if old_words != new_words:
                    report['unit_differences'].append(row['path'])
        current_path = Path(row['path'])
        current_hash = sha(current_path) if current_path.is_file() else None
        if current_hash != row['sha256']:
            report['source_input_drift'].append({'path': row['path'], 'frozen_sha256': row['sha256'], 'current_sha256': current_hash})
        report['rows'].append(result)
    # Compare score with both default and actual per-locale num_per100 median.
    for locale in inputs['supported42']:
        group = [r for r in report['rows'] if r['locale'] == locale and r['before'].get('metrics')]
        if not group:
            continue
        median = statistics.median(r['before']['metrics']['num_per100'] for r in group)
        for row in group:
            row['before']['score_corpus_median'] = old.score(row['before']['metrics'], {'num_per100': median})
            row['after']['score_corpus_median'] = candidate.score(row['after']['metrics'], {'num_per100': median})
            if row['before']['score_corpus_median'] != row['after']['score_corpus_median']:
                report['metrics_score_hard_differences'].append(row['path'])
    previous = json.loads(previous_path.read_text())
    prev = {r['path']: r['sha256'] for r in previous['files']}
    now = {r['path']: r['sha256'] for r in inputs['files']}
    report['input_delta_from_previous35_audit'] = {
        'previous_manifest_sha256': sha(previous_path), 'previous_raw_files': len(prev),
        'current_frozen_raw_files': len(now), 'added': sorted(now.keys() - prev.keys()),
        'removed': sorted(prev.keys() - now.keys()),
        'changed': [{'path': p, 'before_sha256': prev[p], 'after_sha256': now[p]}
                    for p in sorted(now.keys() & prev.keys()) if prev[p] != now[p]],
        'interpretation': 'Input additions/edits, not checker regression; paired comparisons above use identical frozen bytes.'}
    integrity()
    report['repo_head_end'] = subprocess.check_output(['git', '-C', str(repo), 'rev-parse', 'HEAD'], text=True).strip()
    report['ok'] = (report['compared'] == len(inputs['files']) and len(report['by_locale']) == 42
                    and not report['metrics_score_hard_differences'] and not report['boundary_differences']
                    and not report['unit_differences'] and not failures and report['score_hard_ast_unchanged'])
    (ROOT / 'batch05-regression.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    summary = {k: v for k, v in report.items() if k != 'rows'}
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0 if report['ok'] else 1


if __name__ == '__main__':
    sys.exit(main())
