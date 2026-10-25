#!/usr/bin/env python3
"""Post-r1 boundary controls and actual guarded CLI verification, no articles."""
import collections
import contextlib
import hashlib
import importlib.util
import io
import json
import os
from pathlib import Path
import subprocess
import sys
import unicodedata
from unittest.mock import patch

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parent
CANDIDATE = ROOT.parent / 'variety-candidate'
spec = importlib.util.spec_from_file_location('independent_runner', ROOT / 'run-independent-review.py')
runner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runner)
multi, metrics = runner.load(CANDIDATE / 'candidate', 'supplemental')
records = []

def check(name, actual, expected, detail=None):
    records.append(dict(id=name, status='PASS' if actual == expected else 'FAIL',
                        actual=actual, expected=expected, detail=detail))

sentence_cases = [
    ('cs', 'ordinary-ordinal', ['Jde o 5. odstavec 13. kapitoly.', 'Kopie je přiložena.']),
    ('cs', 'ordinal-century', ['Záznam pochází z 21. století.', 'Další údaje chybí.']),
    ('cs', 'terminal-integer', ['Číslo položky je 21.', 'Další údaj chybí.']),
    ('cs', 'terminal-year', ['Rok je 2026.', 'Nový dokument je přiložen.']),
    ('cs', 'date-in-parens', ['Dopis dorazil včera (25. 10. 2026).', 'Kopie je přiložena.']),
    ('he', 'report-negative', ['"מי חתם?"', 'העובד קרא את המסמך.']),
    ('he', 'report-positive', ['"מי חתם?" השיבה העובדת.', 'המסמך נשמר.']),
    ('lt', 'email-abbreviation', ['Dokumentus galima siųsti el. paštu.', 'Originalas lieka čia.']),
]
for lang, name, parts in sentence_cases:
    text = ' '.join(parts)
    check(f'{lang}-{name}', multi.split_sentences(text, lang), parts)
    nfd_text = unicodedata.normalize('NFD', text)
    nfd_expected = [unicodedata.normalize('NFD', part) for part in parts]
    check(f'{lang}-{name}-nfd-original-preserved', multi.split_sentences(nfd_text, lang), nfd_expected)

contrast_cases = [
    ('fil', 'Hindi lamang papel kundi pati lapis ang narito.', 0),
    ('fil', 'Iba-iba ang kulay ng mga papel.', 0),
    ('fil', 'Iba sa kahon ang sobre.', 1),
    ('he', 'לא רק נייר אלא גם עיפרון נמצא כאן.', 0),
    ('he', 'זה אינו נייר.', 0),
    ('he', 'זו אינה מעטפה אלא קופסה.', 1),
    ('nl', 'Niet alleen papier maar ook een potlood ligt hier.', 0),
    ('nl', 'Het is geen boete.', 0),
    ('nl', 'Het is geen boete. Maar de brief blijft hier.', 0),
    ('nl', 'Het is geen boete maar een betaling.', 1),
    ('pl', 'Nie tylko papier, ale również ołówek leży tutaj.', 0),
    ('cs', 'Nejen papír, ale také tužka leží zde.', 0),
    ('cs', 'Není to pokuta.', 0),
    ('cs', 'Nejde o pokutu. Ale dokument zůstává zde.', 0),
    ('lt', 'Ne tik popierius, bet ir pieštukas yra čia.', 0),
    ('lt', 'Tai ne mokestis.', 0),
    ('lt', 'Tai ne bauda, bet mokestis.', 1),
]
for i, (lang, text, expected) in enumerate(contrast_cases):
    check(f'contrast-control-{i}-{lang}', multi.contrasts(text, lang), expected, text)

for lang, text in [('nl', '## Referenties in het contract'),
                   ('pl', '## Źródła urzędowe a dowody prywatne'),
                   ('lt', '## Šaltiniai ir jų vertinimas')]:
    check(f'new-source-alias-negative-{lang}', multi.source_heading(text, lang), False, text)

# The original reviewer split-hyphen fixture is never overwritten. This
# separately tests the independently adjudicated author convention.
check('accepted-fil-hyphen-convention', multi.words('siya’y pag-ibig araw-araw', 'fil'),
      ['siya’y', 'pag-ibig', 'araw-araw'],
      'Accepted using pre-execution author freeze and KWF §§11.1/11.3; original reviewer discrepancy preserved.')
check('fil-numeric-hyphen-still-splits', multi.words('8-12 araw', 'fil'), ['8', '12', 'araw'])

tail = '\n\nPopierius yra čia.\n\nYra kita kopija.\n\nDurys yra atviros.\n\nLaiškas jau atėjo.'
for name, sentence, expected in [
    ('suffix-full', 'Nuoroda pateikta (5 straipsnis).', .2),
    ('suffix-genitive', 'Nuoroda pateikta (5 straipsnio 1 dalis).', .2),
    ('suffix-abbreviated', 'Nuoroda pateikta (5 str. 1 d.).', .2),
    ('suffix-negative', 'Nuoroda pateikta (5 lentelė).', 0),
]:
    result = metrics.metrics(sentence + tail, 'lt')
    check(f'lt-{name}-sentences', result['sentences'], 5)
    check(f'lt-{name}-citation-ending', result['cite_end_share'], expected)

generated = ROOT / 'generated'
generated.mkdir(exist_ok=True)
varied = generated / 'neutral-varied.md'
varied.write_text('\n\n'.join([
    'Alpha beta.',
    'Beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu xi omicron pi rho sigma tau.',
    'Gamma delta epsilon zeta eta theta iota kappa lambda.',
    'Delta epsilon.',
    'Epsilon zeta eta theta iota kappa lambda mu nu xi omicron pi rho sigma tau upsilon phi chi psi omega alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu.',
    'Zeta eta theta iota.',
]), encoding='utf-8')
uniform = generated / 'neutral-uniform.md'
uniform.write_text('\n\n'.join(['Alpha beta gamma delta epsilon zeta eta theta.'] * 6), encoding='utf-8')
env = dict(os.environ, PYTHONDONTWRITEBYTECODE='1')
wrapper = CANDIDATE / 'variety_metrics.py'
for lang in runner.NEW:
    for name, path, expected in [('varied', varied, 0), ('uniform', uniform, 1)]:
        run = subprocess.run([sys.executable, str(wrapper), 'check', str(path), '--lang', lang],
                             capture_output=True, text=True, env=env, timeout=30)
        check(f'wrapper-{lang}-{name}-exit', run.returncode, expected, run.stdout + run.stderr)
        check(f'wrapper-{lang}-{name}-official-unavailable-label',
              f'OFFICIAL CHECKER: {lang} unsupported (exit 2; not a measured PASS).' in run.stderr, True)
        check(f'wrapper-{lang}-{name}-task-local-label', 'TASK-LOCAL EXTENSION:' in run.stderr, True)

run = subprocess.run([sys.executable, str(wrapper), 'corpus', str(generated)],
                     capture_output=True, text=True, env=env, timeout=30)
check('wrapper-corpus-unavailable', run.returncode, 2, run.stdout + run.stderr)
run = subprocess.run([sys.executable, str(wrapper), 'check', str(varied), '--lang', 'zz'],
                     capture_output=True, text=True, env=env, timeout=30)
check('wrapper-unknown-locale-unavailable', run.returncode, 2, run.stdout + run.stderr)

# Execute the exact wrapper under mocks for two future shared-checker states.
# This is explicit simulated fail-closed logic, separate from actual CLI tests.
for label, code, stdout, stderr in [('official-supported', 0, 'OFFICIAL OK\n', ''),
                                  ('official-unavailable-other-reason', 2, 'measurement unavailable: invalid UTF-8\n', '')]:
    buffer_out, buffer_err = io.StringIO(), io.StringIO()
    with patch.object(sys, 'argv', [str(wrapper), 'check', str(varied), '--lang', 'fil']), \
         patch.object(subprocess, 'run', return_value=subprocess.CompletedProcess([], code, stdout, stderr)), \
         patch.object(os, 'execv') as execute, patch.object(os, 'execve') as execute_env, \
         contextlib.redirect_stdout(buffer_out), contextlib.redirect_stderr(buffer_err):
        try:
            exec(compile(wrapper.read_text(), str(wrapper), 'exec'), {'__file__': str(wrapper), '__name__': '__main__'})
            exit_code = 0
        except SystemExit as error:
            exit_code = error.code
    check(f'wrapper-simulation-{label}-exit', exit_code, 2)
    check(f'wrapper-simulation-{label}-no-local-execution', execute.call_count + execute_env.call_count, 0)
    check(f'wrapper-simulation-{label}-explicit-withheld', 'extension withheld' in buffer_err.getvalue(), True)

manifest_path = CANDIDATE / 'evidence/candidate-manifest-repair-r1.json'
manifest = json.loads(manifest_path.read_text())
for entry in manifest['files']:
    path = CANDIDATE / entry['path']
    check('exact-manifest-' + entry['path'], runner.sha(path), entry['sha256'])
counts = collections.Counter(row['status'] for row in records)
output = dict(summary=dict(total=len(records), passed=counts['PASS'], failed=counts['FAIL']),
              candidate_manifest_path=str(manifest_path), candidate_manifest_sha256=runner.sha(manifest_path),
              checks=records)
(ROOT / 'supplemental-results.json').write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(output['summary']))
for row in records:
    if row['status'] != 'PASS':
        print(json.dumps(row, ensure_ascii=False))
raise SystemExit(int(counts['FAIL'] > 0))
