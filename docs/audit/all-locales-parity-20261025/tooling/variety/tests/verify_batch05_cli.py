"""Actual entrypoints on nonpublishable neutral unit-stress inputs."""
from pathlib import Path
import datetime
import hashlib
import json
import os
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
CASES = json.loads((ROOT / 'tests/fixtures-batch05.json').read_text())


def main():
    # Fixed lengths and distinct labels exercise success, not language quality.
    lengths = [4, 25, 7, 40, 5, 18, 32, 8]
    labels = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel']
    generated = ROOT / 'tests/generated-batch05'
    generated.mkdir(exist_ok=True)
    records = []
    for locale, fixture in CASES.items():
        unit = fixture['words'][0][1][0]
        stop = '។' if locale == 'km' else '.'
        varied = '\n\n'.join(label + ' ' + ' '.join([unit] * (n - 1)) + stop for label, n in zip(labels, lengths))
        for kind, body in [('varied', varied), ('uniform', '\n\n'.join([fixture['sentences'][0][1][0]] * 8)), ('short', fixture['sentences'][0][1][0])]:
            path = generated / f'{kind}.{locale}.md'
            path.write_text('---\ntitle: Synthetic unit test, not publishable prose\n---\n\n' + body + '\n')
            records.append({'locale': locale, 'kind': kind, 'path': str(path.relative_to(ROOT)),
                            'sha256': hashlib.sha256(path.read_bytes()).hexdigest()})
    freeze = ROOT / 'CLI-BATCH05-INPUTS-FROZEN.json'
    if freeze.exists():
        if json.loads(freeze.read_text())['inputs'] != records:
            raise SystemExit('CLI neutral inputs drift; do not overwrite an earlier freeze')
    else:
        freeze.write_text(json.dumps({'at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
                                     'lengths_fixed_before_cli': lengths, 'natural_prose_or_target_score': False,
                                     'inputs': records}, ensure_ascii=False, indent=2) + '\n')
    output = []
    for row in records:
        path = ROOT / row['path']
        versions = [('candidate', ROOT / 'variety_metrics.py', {'varied': 0, 'uniform': 1, 'short': 2}[row['kind']])]
        if row['kind'] == 'varied':
            versions.append(('baseline42', ROOT / 'baseline42/variety_metrics.py', 2))
        for label, script, expected in versions:
            run = subprocess.run([sys.executable, str(script), 'check', str(path), '--lang', row['locale']], capture_output=True, text=True)
            output.append({**row, 'version': label, 'expected_exit': expected, 'exit_code': run.returncode,
                           'stdout': run.stdout, 'stderr': run.stderr,
                           'ok': run.returncode == expected and 'Traceback' not in run.stderr})
    with tempfile.TemporaryDirectory(dir=ROOT) as folder:
        path = generated / 'varied.km.md'
        run = subprocess.run([sys.executable, str(ROOT / 'variety_metrics.py'), 'check', str(path), '--lang', 'km'],
                             capture_output=True, text=True, env={**os.environ, 'PATH': folder})
        output.append({'kind': 'km_real_missing_backend', 'expected_exit': 2, 'exit_code': run.returncode,
                       'stdout': run.stdout, 'stderr': run.stderr,
                       'ok': run.returncode == 2 and 'Khmer' in run.stdout + run.stderr})
        unknown = Path(folder) / 'unknown.md'
        unknown.write_text('A neutral sentence.\n\n' * 8)
        for args in ([], ['--lang', 'und'], ['--lang', 'nn'], ['--lang', 'xx'], ['--lang', 'bur']):
            run = subprocess.run([sys.executable, str(ROOT / 'variety_metrics.py'), 'check', str(unknown), *args], capture_output=True, text=True)
            output.append({'kind': 'unsupported_or_unknown', 'args': args, 'expected_exit': 2,
                           'exit_code': run.returncode, 'stdout': run.stdout, 'stderr': run.stderr,
                           'ok': run.returncode == 2 and 'Traceback' not in run.stderr})
    result = {'recorded_at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
              'runtime': subprocess.check_output(['node', '-p', 'JSON.stringify({node:process.versions.node,icu:process.versions.icu,unicode:process.versions.unicode})'], text=True).strip(),
              'invocations': len(output), 'passed': sum(row['ok'] for row in output),
              'ok': all(row['ok'] for row in output), 'results': output}
    (ROOT / 'batch05-cli.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({k: v for k, v in result.items() if k != 'results'}, ensure_ascii=False))
    return 0 if result['ok'] else 1


if __name__ == '__main__':
    sys.exit(main())
