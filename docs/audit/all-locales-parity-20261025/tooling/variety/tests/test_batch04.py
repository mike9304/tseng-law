"""Seven explicit script contracts fixed before the production extension."""
from pathlib import Path
from unittest import mock
import ast
import contextlib
import hashlib
import io
import json
import os
import subprocess
import sys
import tempfile
import unicodedata
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
import variety_metrics as metrics
import variety_multilingual as multilingual

CASES = json.loads((ROOT / 'tests/fixtures-batch04.json').read_text())
MY_AUTHOR = json.loads((ROOT / 'tests/fixtures-my-author.json').read_text())


class BatchFourTests(unittest.TestCase):
    def require(self, locale):
        self.assertIn(locale, metrics.SUPPORTED, 'explicit support, never another locale alias')

    def test_explicit_registry_path_and_metric_locale(self):
        for locale, row in CASES.items():
            with self.subTest(locale=locale):
                self.require(locale)
                self.assertEqual(metrics.guess_lang(f'/tmp/columns-{locale}/neutral.md'), locale)
                self.assertEqual(metrics.guess_lang(f'/tmp/neutral.{locale}.md'), locale)
                body = '\n\n'.join(row['sentences'][0][1] * 3)
                self.assertEqual(metrics.metrics(body, locale)['lang'], locale)

    def test_literal_sentences_quotes_numbers_and_unicode_spacing(self):
        for locale, row in CASES.items():
            with self.subTest(locale=locale):
                self.require(locale)
                for text, wanted in row['sentences']:
                    for form in ('NFC', 'NFD'):
                        for space in (' ', '\u00a0', '\u202f'):
                            original = unicodedata.normalize(form, text.replace(' ', space))
                            expected = [unicodedata.normalize(form, s.replace(' ', space)) for s in wanted]
                            with self.subTest(text=text, form=form, space=repr(space)):
                                self.assertEqual(multilingual.split_sentences(original, locale), expected)
                                self.assertEqual(metrics.sentences(original, locale), expected)
                                self.assertEqual(''.join(original.split()), ''.join(''.join(expected).split()))

    def test_literal_units_keep_marks_joiners_digits_and_hebrew_abbreviations(self):
        for locale, row in CASES.items():
            with self.subTest(locale=locale):
                self.require(locale)
                for text, wanted in row['words']:
                    for form in ('NFC', 'NFD'):
                        for space in (' ', '\u00a0', '\u202f'):
                            original = unicodedata.normalize(form, text.replace(' ', space))
                            expected = [unicodedata.normalize(form, s) for s in wanted]
                            with self.subTest(text=text, form=form, space=repr(space)):
                                self.assertEqual(multilingual.words(original, locale), expected)
                                self.assertEqual(metrics.slen(original, locale), len(expected))
                text, wanted = row['words'][0]
                self.assertEqual(metrics.opener(text, locale), unicodedata.normalize('NFC', wanted[0]).casefold())

    def test_urls_markdown_sources_and_substantive_headings_through_real_pipeline(self):
        for locale, row in CASES.items():
            with self.subTest(locale=locale):
                self.require(locale)
                self.assertEqual(metrics.sentences(row['url'][0], locale), row['url'][1])
                a, b = row['sentences'][0][1]
                self.assertEqual(metrics.sentences(f'[{a}](https://example.test/a?x=1) {b}', locale), [a, b])
                for heading in row['sources']:
                    for form in ('NFC', 'NFD'):
                        heading = unicodedata.normalize(form, heading)
                        text = f'---\ntitle: Neutral\n---\n\n{a}\n\n{heading}\n\n{b}'
                        self.assertEqual(metrics.body_blocks(metrics.strip_fm(text)[1], locale)[0], [a])
                for heading in row['not_sources']:
                    text = a + '\n\n' + heading + '\n\n' + b
                    expected = [a, b] if heading.startswith('#') else [a, heading, b]
                    self.assertEqual(metrics.body_blocks(text, locale)[0], expected)
                # Ordinal suffixes in prose stay text; Markdown numbered lists
                # are excluded from prose by the existing scope contract.
                body = '\n\n'.join([a, '## Neutral section', '1. Neutral item', b, row['sources'][0], a])
                paras, heads, items = metrics.body_blocks(body, locale)
                self.assertEqual(paras, [a, b])
                self.assertEqual(len(items), 1)

    def test_contrast_is_not_ordinary_negation_addition_or_cross_sentence(self):
        for locale, row in CASES.items():
            with self.subTest(locale=locale):
                self.require(locale)
                for text, wanted in row['contrast']:
                    for form in ('NFC', 'NFD'):
                        with self.subTest(text=text, form=form):
                            self.assertEqual(multilingual.contrasts(unicodedata.normalize(form, text), locale), wanted)

    def test_native_openings_formula_closes_and_citations(self):
        for locale, row in CASES.items():
            with self.subTest(locale=locale):
                self.require(locale)
                for fixture, key, wanted in [('caveat', 'caveat', 5), ('hypothetical', 'hypo_open', True), ('formula', 'formula_close', True), ('citation', 'cite_end_share', 1)]:
                    body = '\n\n'.join([row[fixture]] * 5)
                    self.assertEqual(metrics.metrics(body, locale)[key], wanted)
                ordinary = '\n\n'.join(row['sentences'][0][1] * 3)
                value = metrics.metrics(ordinary, locale)
                self.assertEqual((value['hypo_open'], value['formula_close'], value['cite_end_share']), (False, False, 0))

    def test_8_32_unit_edges_real_repetition_failure_and_short_unavailable(self):
        with tempfile.TemporaryDirectory(dir=ROOT) as folder:
            for locale, row in CASES.items():
                with self.subTest(locale=locale):
                    self.require(locale)
                    unit = row['words'][0][1][0]
                    stop = '။' if locale == 'my' else '.'
                    text = '\n\n'.join(' '.join([unit] * n) + stop for n in (8, 9, 31, 32, 4))
                    value = metrics.metrics(text, locale)
                    self.assertEqual((value['short_threshold'], value['long_threshold']), (8, 32))
                    self.assertEqual((value['short_share'], value['long_share']), (0.4, 0.2))
                    self.assertEqual(value['length_unit'], 'icu_dictionary_wordlike_units' if locale == 'my' else 'orthographic_words')
                    path = Path(folder) / f'neutral.{locale}.md'
                    path.write_text('\n\n'.join([row['sentences'][0][1][0]] * 8))
                    run = subprocess.run([sys.executable, str(ROOT / 'variety_metrics.py'), 'check', str(path), '--lang', locale], capture_output=True, text=True)
                    self.assertEqual(run.returncode, 1, run.stdout + run.stderr)
                    self.assertNotIn('Traceback', run.stderr)
                    path.write_text(row['sentences'][0][1][0])
                    with contextlib.redirect_stdout(io.StringIO()):
                        self.assertEqual(metrics.check(str(path), locale), 2)

    def test_myanmar_separately_authored_literal_boundaries(self):
        self.require('my')
        for row in MY_AUTHOR['fixtures']:
            with self.subTest(id=row['id']):
                self.assertEqual(multilingual.split_sentences(row['text'], 'my'), row['expectedSentenceTexts'])
                self.assertEqual(metrics.sentences(row['text'], 'my'), row['expectedSentenceTexts'])

    def test_myanmar_runtime_is_explicit_and_unavailable_backend_never_falls_back(self):
        self.require('my')
        body = '\n\n'.join(CASES['my']['sentences'][0][1] * 3)
        value = metrics.metrics(body, 'my')
        self.assertEqual(value['word_segmenter']['locale'], 'my')
        self.assertEqual(value['word_segmenter']['icu'], '78.2')
        self.assertEqual(value['word_segmenter']['node'], '24.14.1')
        with tempfile.TemporaryDirectory(dir=ROOT) as folder:
            path = Path(folder) / 'neutral.my.md'
            path.write_text(body)
            run = subprocess.run([sys.executable, str(ROOT / 'variety_metrics.py'), 'check', str(path), '--lang', 'my'],
                                 capture_output=True, text=True, env={**os.environ, 'PATH': folder, 'PYTHONDONTWRITEBYTECODE': '1'})
            self.assertEqual(run.returncode, 2)
            self.assertIn('Burmese', run.stdout + run.stderr)
            self.assertNotIn('Traceback', run.stderr)
        # Failed dictionary invocation must not contaminate Thai's cache or
        # fall back to whitespace. The text is fresh to avoid a cache hit.
        with mock.patch.object(multilingual.shutil, 'which', return_value=None):
            with self.assertRaises(multilingual.MeasurementError):
                multilingual.words('စာအုပ်ခဲတံ အသစ် ၉၉၉၉', 'my')

    def test_unknown_locale_and_unknown_path_are_actual_exit_two(self):
        with tempfile.TemporaryDirectory(dir=ROOT) as folder:
            path = Path(folder) / 'unknown.md'
            path.write_text('Neutral sentence.\n\n' * 8)
            for args in ([], ['--lang', 'und'], ['--lang', 'nn'], ['--lang', 'xx'], ['--lang', 'bur']):
                run = subprocess.run([sys.executable, str(ROOT / 'variety_metrics.py'), 'check', str(path), *args], capture_output=True, text=True)
                self.assertEqual(run.returncode, 2)
                self.assertNotIn('Traceback', run.stderr)

    def test_myanmar_invalid_backend_response_or_process_failure_is_unavailable(self):
        self.require('my')
        bad = [
            'not json',
            json.dumps({'locale': 'th', 'tokens': [['စာအုပ်']]}),
            json.dumps({'locale': 'my', 'tokens': [['စာအုပ်']]}),
            json.dumps({'locale': 'my', 'tokens': [['စာအုပ်', 7]]}),
        ]
        for index, output in enumerate(bad):
            with self.subTest(index=index):
                text = 'စာအုပ် invalid-backend ' + str(index)
                with mock.patch.object(multilingual.subprocess, 'run', return_value=subprocess.CompletedProcess([], 0, output, '')):
                    with self.assertRaises(multilingual.MeasurementError):
                        multilingual.words(text, 'my')
                self.assertNotIn(text, multilingual._MYANMAR_WORDS)
        with mock.patch.object(multilingual.subprocess, 'run', side_effect=subprocess.CalledProcessError(1, ['node'])):
            with self.assertRaises(multilingual.MeasurementError):
                multilingual.words('စာအုပ် process-failure ၈၈၈', 'my')

    def test_every_old_profile_and_score_hard_ast_remain_identical(self):
        baseline = json.loads((ROOT / 'BASELINE35-INSTALLATION.json').read_text())
        for row in baseline['production_files']:
            if row['path'].startswith('profiles/'):
                # SK's explicitly frozen date-boundary revision is exercised
                # by test_sk_date_boundaries; every other profile stays exact.
                expected = ('2ea68f2ea8e9a6876c35ea895d8469bcf2c9e6091bb9c64f5bf0270c015bd9af'
                            if row['path'] == 'profiles/sk.json' else row['sha256'])
                # Reviewed TR inflected-ordinal profile; historic manifests stay intact.
                if row['path'] == 'profiles/tr.json':
                    expected = 'ac0f3d212c39e794053ec72fb742c74ebeb29f4111700540746a4feb32797423'
                # Explicit CS date-boundary revision; behavior is checked by test_cs_date_boundaries.
                if row['path'] == 'profiles/cs.json':
                    expected = 'a6718b5fe6af471dfe53bbf4e11087e3ac63dd20d43e44c657691499e8523088'
                self.assertEqual(hashlib.sha256((ROOT / row['path']).read_bytes()).hexdigest(), expected)
        def contract(path):
            return [ast.dump(n, include_attributes=False) for n in ast.parse(path.read_text()).body
                    if (isinstance(n, ast.FunctionDef) and n.name == 'score') or
                    (isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id == 'HARD' for t in n.targets))]
        self.assertEqual(contract(ROOT / 'variety_metrics.py'), contract(ROOT / 'baseline35/variety_metrics.py'))


if __name__ == '__main__':
    unittest.main()
