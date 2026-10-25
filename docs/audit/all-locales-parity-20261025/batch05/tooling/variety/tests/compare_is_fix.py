"""Same-byte Icelandic-fix impact, with explicit release/prior/staging roots."""
from pathlib import Path
import argparse
import ast
import datetime
import difflib
import hashlib
import importlib.util
import json
import os
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


def hard_keys(module, value):
    failed = []
    for key, (op, threshold, _) in module.HARD.items():
        if threshold == 'dyn':
            threshold = max(2, value['paras'] // 8)
        if not (value[key] >= threshold if op == '>=' else value[key] <= threshold):
            failed.append(key)
    if value['lang'] == 'ja' and min(value['ja_desu'], value['ja_da']) >= 3:
        failed.append('ja_style_mixed')
    return failed


def measure(module, companion, path, text, locale, mapping=None):
    try:
        if mapping is None:
            mapping = companion.sentence_map(path, text, locale)
        value = module.metrics(text, locale, mapping)
        if value is None:
            return {'metrics': None, 'score': None, 'unmeasured_skip': True,
                    'check_exit': 2 if locale in companion.LANGUAGES else 0}
        failed = hard_keys(module, value)
        return {'metrics': value, 'score': module.score(value, {}),
                'hard_failures': failed, 'check_exit': 1 if failed else 0}
    except (OSError, UnicodeError, companion.MeasurementError) as error:
        return {'error_type': type(error).__name__, 'error': str(error), 'check_exit': 2}


def segments(module, text, locale):
    _, body = module.strip_fm(text)
    paragraphs = module.body_blocks(body, locale)[0]
    return [s for p in paragraphs for s in module.sentences(p, locale)]


def score_contract(path):
    tree = ast.parse(path.read_text())
    return [ast.dump(node, include_attributes=False) for node in tree.body
            if (isinstance(node, ast.FunctionDef) and node.name == 'score')
            or (isinstance(node, ast.Assign) and any(
                isinstance(target, ast.Name) and target.id == 'HARD' for target in node.targets))]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo-root', required=True)
    parser.add_argument('--prior-audit-root', required=True)
    parser.add_argument('--batch-root', required=True)
    args = parser.parse_args()
    repo, prior, batch = [Path(value).expanduser().resolve()
                          for value in (args.repo_root, args.prior_audit_root, args.batch_root)]
    baseline = json.loads((ROOT / 'BASELINE35-INSTALLATION.json').read_text())
    old28 = json.loads((ROOT / 'BASELINE28.json').read_text())
    frozen = json.loads((ROOT / 'FIX-CANDIDATE-FROZEN.json').read_text())
    if repo != Path(old28['repo_root']).resolve() or not (repo / '.git').exists():
        parser.error('repo-root must match the frozen release repository')
    if prior != Path(baseline['prior_frozen_28_audit']).resolve():
        parser.error('prior-audit-root must match the installed baseline provenance')
    if batch != prior.parent.parent or not (batch / 'src/content').is_dir():
        parser.error('batch-root must match the explicit prior audit batch')
    sys.path.insert(0, str(ROOT))
    import variety_metrics as candidate
    import variety_multilingual as companion
    saved = {name: sys.modules.get(name) for name in ('variety_expansion', 'variety_multilingual')}
    try:
        before_expansion = load('installed35_expansion', ROOT / 'baseline35/variety_expansion.py')
        sys.modules['variety_expansion'] = before_expansion
        before_companion = load('installed35_multilingual', ROOT / 'baseline35/variety_multilingual.py')
        sys.modules['variety_multilingual'] = before_companion
        before = load('installed35_metrics', ROOT / 'baseline35/variety_metrics.py')
    finally:
        for name, value in saved.items():
            if value is None:
                sys.modules.pop(name, None)
            else:
                sys.modules[name] = value
    report = {
        'run_at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'repo_root': str(repo), 'prior_audit_root': str(prior), 'batch_root': str(batch),
        'repo_head_start': subprocess.check_output(['git', '-C', str(repo), 'rev-parse', 'HEAD'], text=True).strip(),
        'candidate_freeze_sha256': sha(ROOT / 'FIX-CANDIDATE-FROZEN.json'),
        'code_frozen_before_input_measurement': True,
        'reported_target_fragments_seen_before_fix': True,
        'integrity_failures': [], 'unexpected_locale_differences': [],
        'source_edits_during_run': [], 'excluded_staged_sk': [],
        'old28': {'compared': 0, 'measured': 0, 'unavailable': 0, 'differences': [], 'frozen_result_differences': []},
        'release35': {'compared': 0, 'measured': 0, 'unavailable': 0, 'by_locale': {}, 'rows': [], 'changed': []},
        'staged_batch03': {'compared': 0, 'measured': 0, 'unavailable': 0, 'by_locale': {}, 'rows': [], 'changed': []},
        'text_and_units_preserved': True, 'actual_staged_cli': [],
        'score_hard_unchanged': score_contract(ROOT / 'variety_metrics.py') == score_contract(ROOT / 'baseline35/variety_metrics.py')}

    def validate_code():
        for row in baseline['production_files']:
            for base in (ROOT / 'baseline35', Path(baseline['shared'])):
                p = base / row['path']
                if not p.is_file() or sha(p) != row['sha256']:
                    report['integrity_failures'].append(str(p))
            if row['path'].startswith('profiles/') and row['path'] not in ('profiles/is.json',):
                if sha(ROOT / row['path']) != row['sha256']:
                    report['integrity_failures'].append(str(ROOT / row['path']))
        for row in frozen['production_files']:
            if sha(ROOT / row['path']) != row['sha256']:
                report['integrity_failures'].append(str(ROOT / row['path']))
        if sha(Path(baseline['root_installation_receipt'])) != baseline['receipt_sha256']:
            report['integrity_failures'].append(baseline['root_installation_receipt'])

    validate_code()
    if report['integrity_failures']:
        parser.error('frozen or installed code integrity differs; do not measure changed code')
    for row in old28['articles']:
        path = prior / row['snapshot_path']
        if sha(path) != row['sha256']:
            report['integrity_failures'].append(str(path))
            continue
        text = path.read_bytes().decode('utf-8')
        old = measure(before, before_companion, path, text, row['locale'], row.get('reviewed_sentence_map'))
        new = measure(candidate, companion, path, text, row['locale'], row.get('reviewed_sentence_map'))
        report['old28']['compared'] += 1
        if old != new:
            report['old28']['differences'].append({'path': row['path'], 'before': old, 'after': new})
        keys = ('metrics', 'score', 'error_type', 'error')
        expected = {key: row[key] for key in keys if key in row}
        if {key: old[key] for key in keys if key in old} != expected:
            report['old28']['frozen_result_differences'].append(row['path'])
        if 'error' in old:
            report['old28']['unavailable'] += 1
        elif old.get('metrics'):
            report['old28']['measured'] += 1

    inputs = []
    for directory, locale in candidate.DIRLANG.items():
        for path in sorted((repo / 'src/content' / directory).glob('*.md')):
            inputs.append(('release35', path, repo, locale))
    for locale in ('bg', 'ca', 'el', 'hr', 'hu', 'is', 'sk'):
        for path in sorted((batch / 'src/content' / f'columns-{locale}').glob('*.md')):
            inputs.append(('staged_batch03', path, batch, locale))
    # Freeze bytes for every selected input before deriving any before/after result.
    frozen_inputs = []
    for group, path, base, locale in inputs:
        raw = path.read_bytes()
        digest = hashlib.sha256(raw).hexdigest()
        snapshot = ROOT / 'impact-inputs' / group / path.relative_to(base)
        snapshot.parent.mkdir(parents=True, exist_ok=True)
        if snapshot.exists() and snapshot.read_bytes() != raw:
            parser.error('snapshot exists with other bytes; preserve the prior run instead of replacing it')
        snapshot.write_bytes(raw)
        record = {'path': str(path), 'relative_path': str(path.relative_to(base)), 'locale': locale,
                  'sha256': digest, 'snapshot': str(snapshot.relative_to(ROOT)), 'group': group}
        frozen_inputs.append(record)
    (ROOT / 'IMPACT-INPUTS-FROZEN.json').write_text(json.dumps({
        'frozen_at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'candidate_freeze_sha256': report['candidate_freeze_sha256'], 'inputs': frozen_inputs,
        'excluded_staged_sk': report['excluded_staged_sk']}, ensure_ascii=False, indent=2) + '\n')
    for row in frozen_inputs:
        path = ROOT / row['snapshot']
        text = path.read_bytes().decode('utf-8')
        locale, group = row['locale'], row['group']
        # None of the current Thai sources have an approved map; if that changes,
        # validate the original binding before freezing a reviewed map.
        mapping = None
        if locale == 'th':
            try:
                mapping = before_companion.sentence_map(row['path'], text, locale)
            except before_companion.MeasurementError:
                pass
        old = measure(before, before_companion, path, text, locale, mapping)
        new = measure(candidate, companion, path, text, locale, mapping)
        result = {**row, 'before': old, 'after': new}
        target = report[group]
        target['compared'] += 1
        target['by_locale'][locale] = target['by_locale'].get(locale, 0) + 1
        if 'error' in old:
            target['unavailable'] += 1
        elif old.get('metrics'):
            target['measured'] += 1
        if old != new:
            target['changed'].append(row['path'])
            if locale not in ('is',):
                report['unexpected_locale_differences'].append(row['path'])
        if locale in ('is',):
            old_sentences = segments(before, text, locale)
            new_sentences = segments(candidate, text, locale)
            result['text_preserved'] = ''.join(''.join(old_sentences).split()) == ''.join(''.join(new_sentences).split())
            result['word_units_preserved'] = [word for sentence in old_sentences for word in before_companion.words(sentence, locale)] == [word for sentence in new_sentences for word in companion.words(sentence, locale)]
            report['text_and_units_preserved'] &= result['text_preserved'] and result['word_units_preserved']
            result['boundary_changes'] = [
                {'operation': tag, 'before': old_sentences[a:b], 'after': new_sentences[c:d]}
                for tag, a, b, c, d in difflib.SequenceMatcher(a=old_sentences, b=new_sentences, autojunk=False).get_opcodes()
                if tag != 'equal']
            if group == 'staged_batch03':
                for label, script in [('before', ROOT / 'baseline35/variety_metrics.py'), ('after', ROOT / 'variety_metrics.py')]:
                    run = subprocess.run([sys.executable, str(script), 'check', str(path), '--lang', locale],
                                         capture_output=True, text=True, env={**os.environ, 'PYTHONDONTWRITEBYTECODE': '1'})
                    report['actual_staged_cli'].append({'path': row['path'], 'version': label, 'exit_code': run.returncode,
                                                       'matches_recorded_exit': run.returncode == (old if label == 'before' else new)['check_exit'],
                                                       'stdout': run.stdout, 'stderr': run.stderr})
        target['rows'].append(result)
        if sha(Path(row['path'])) != row['sha256']:
            report['source_edits_during_run'].append({'path': row['path'], 'frozen_sha256': row['sha256'],
                                                    'current_sha256': sha(Path(row['path']))})
    validate_code()
    report['repo_head_end'] = subprocess.check_output(['git', '-C', str(repo), 'rev-parse', 'HEAD'], text=True).strip()
    report['ok'] = (
        report['old28']['compared'] == 1572 and report['old28']['measured'] == 1541
        and report['old28']['unavailable'] == 31 and not report['old28']['differences']
        and not report['old28']['frozen_result_differences'] and not report['unexpected_locale_differences']
        and not report['integrity_failures'] and report['text_and_units_preserved']
        and report['score_hard_unchanged'] and all(row['matches_recorded_exit'] for row in report['actual_staged_cli']))
    (ROOT / 'is-fix-impact.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    summary = {key: report[key] for key in ('old28', 'unexpected_locale_differences', 'source_edits_during_run',
               'integrity_failures', 'text_and_units_preserved', 'score_hard_unchanged', 'ok')}
    for group in ('release35', 'staged_batch03'):
        summary[group] = {key: value for key, value in report[group].items() if key != 'rows'}
    summary['excluded_staged_sk'] = report['excluded_staged_sk']
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0 if report['ok'] else 1


if __name__ == '__main__':
    sys.exit(main())
