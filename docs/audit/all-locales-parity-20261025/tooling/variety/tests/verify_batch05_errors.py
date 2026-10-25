"""Real CLI error paths; isolated fault injection never mutates release files."""
from pathlib import Path
import datetime
import json
import os
import shlex
import shutil
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]


def main():
    node = shutil.which('node')
    if not node:
        raise SystemExit('explicit Node24 PATH required for this audit')
    records = []
    def run(kind, script, path, locale, text, env=None):
        path.write_text(text)
        result = subprocess.run([sys.executable, str(script), 'check', str(path), '--lang', locale],
                                capture_output=True, text=True, env=env)
        records.append({'kind':kind, 'locale':locale, 'expected_exit':2, 'exit_code':result.returncode,
                        'stdout':result.stdout, 'stderr':result.stderr,
                        'ok':result.returncode == 2 and 'Traceback' not in result.stderr})
    with tempfile.TemporaryDirectory(dir=ROOT) as directory:
        folder = Path(directory)
        path = folder / 'neutral.km.md'
        body = (ROOT / 'tests/generated-batch05/varied.km.md').read_text()
        script = ROOT / 'variety_metrics.py'
        run('native_abbreviation_ambiguous', script, path, 'km', 'សៀវភៅ ប៊ិច ។ល។ សិស្សអាន។\n\n' * 5)
        for locale in ('km','mn','sr','sl','lt','lv','et'):
            run('reserved_marker', script, path, locale, 'Alpha\ue000 neutral.\n\n' * 5)
        # Actual Node executes the production JS. These preloads deliberately
        # inject capability failures; they do not claim this runtime lacks ICU.
        wrappers = folder / 'bin'
        wrappers.mkdir()
        cases = {
            'icu_locale_unavailable': "Intl.Segmenter.supportedLocalesOf = () => [];",
            'icu_resolved_locale_fallback': "Intl.Segmenter.prototype.resolvedOptions = () => ({locale:'th',granularity:'word'});",
            'icu_dictionary_probe_differs': "Intl.Segmenter.prototype.segment = text => [{isWordLike:true,segment:text}];",
        }
        for kind, source in cases.items():
            preload = folder / (kind + '.cjs')
            preload.write_text(source + '\n')
            wrapper = wrappers / 'node'
            wrapper.write_text('#!/bin/sh\nexec ' + shlex.quote(node) + ' --require ' + shlex.quote(str(preload)) + ' "$@"\n')
            wrapper.chmod(0o755)
            run(kind, script, path, 'km', body, {**os.environ,'PATH':str(wrappers)})
        (wrappers / 'node').write_text('#!/bin/sh\nprintf not-json\n')
        run('malformed_backend_output', script, path, 'km', body, {**os.environ,'PATH':str(wrappers)})
        (wrappers / 'node').write_text('#!/bin/sh\nexit 7\n')
        run('backend_nonzero_exit', script, path, 'km', body, {**os.environ,'PATH':str(wrappers)})
        isolated = folder / 'isolated'
        isolated.mkdir()
        for name in ('variety_metrics.py','variety_multilingual.py','variety_expansion.py'):
            shutil.copyfile(ROOT / name, isolated / name)
        (isolated / 'profiles').mkdir()
        run('missing_profile', isolated / 'variety_metrics.py', path, 'sr', 'Knjiga je ovde.\n\n' * 8)
        profile = isolated / 'profiles/km.json'
        profile.write_text('not json')
        run('invalid_profile_json', isolated / 'variety_metrics.py', path, 'km', body)
        profile.write_text(json.dumps({'locale':'th'}))
        run('profile_locale_mismatch', isolated / 'variety_metrics.py', path, 'km', body)
    result = {'recorded_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),
              'actual_cli_fault_injection':True, 'candidate_files_mutated':False, 'node':node,
              'invocations':len(records),'passed':sum(r['ok'] for r in records),
              'ok':all(r['ok'] for r in records),'results':records}
    (ROOT / 'batch05-errors.json').write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps({k:v for k,v in result.items() if k != 'results'}))
    return 0 if result['ok'] else 1


if __name__ == '__main__':
    sys.exit(main())
