"""Neutral 42→49 contract. These expectations precede profile implementation."""
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

CASES = json.loads((ROOT / 'tests/fixtures-batch05.json').read_text())


class BatchFiveTests(unittest.TestCase):
    def require(self, locale):
        self.assertIn(locale, metrics.SUPPORTED, 'explicit new locale support required')

    def test_registry_and_real_length_contract(self):
        for locale, row in CASES.items():
            with self.subTest(locale=locale):
                self.require(locale)
                self.assertEqual(metrics.guess_lang(f'/tmp/columns-{locale}/neutral.md'), locale)
                self.assertEqual(metrics.guess_lang(f'/tmp/neutral.{locale}.md'), locale)
                unit = row['words'][0][1][0]
                stop = '។' if locale == 'km' else '.'
                body = '\n\n'.join(' '.join([unit] * n) + stop for n in (8, 9, 31, 32, 4))
                value = metrics.metrics(body, locale)
                self.assertEqual(value['lang'], locale)
                self.assertEqual((value['short_threshold'], value['long_threshold']), (8, 32))
                self.assertEqual((value['short_share'], value['long_share']), (0.4, 0.2))
                self.assertEqual(value['length_unit'], 'icu_dictionary_wordlike_units' if locale == 'km' else 'orthographic_words')

    def test_literal_sentence_boundaries_survive_unicode_normalization(self):
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

    def test_literal_units_and_opener(self):
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
                text, tokens = row['words'][0]
                self.assertEqual(metrics.opener(text, locale), unicodedata.normalize('NFC', tokens[0]).casefold())

    def test_markdown_url_sources_and_content_heading_scope(self):
        for locale, row in CASES.items():
            with self.subTest(locale=locale):
                self.require(locale)
                self.assertEqual(metrics.sentences(row['url'][0], locale), row['url'][1])
                a, b = row['sentences'][0][1]
                self.assertEqual(metrics.sentences(f'[{a}](https://example.test/a?x=1) {b}', locale), [a, b])
                for heading in row['sources']:
                    for form in ('NFC', 'NFD'):
                        body = a + '\n\n' + unicodedata.normalize(form, heading) + '\n\n' + b
                        self.assertEqual(metrics.body_blocks(body, locale)[0], [a])
                for heading in row['not_sources']:
                    body = a + '\n\n' + heading + '\n\n' + b
                    self.assertEqual(metrics.body_blocks(body, locale)[0], [a, b] if heading.startswith('#') else [a, heading, b])
                paragraphs, headings, items = metrics.body_blocks('\n\n'.join([a, '## Neutral section', '1. Neutral item', b, row['sources'][0], a]), locale)
                self.assertEqual(paragraphs, [a, b])
                self.assertEqual(len(items), 1)

    def test_rhetoric_distinguishes_negation_and_additive_or_cross_sentence(self):
        for locale, row in CASES.items():
            with self.subTest(locale=locale):
                self.require(locale)
                for text, wanted in row['contrast']:
                    for form in ('NFC', 'NFD'):
                        with self.subTest(text=text, form=form):
                            self.assertEqual(multilingual.contrasts(unicodedata.normalize(form, text), locale), wanted)
                for fixture, key, wanted in [('caveat', 'caveat', 5), ('hypothetical', 'hypo_open', True), ('formula', 'formula_close', True), ('citation', 'cite_para_share', 1)]:
                    value = metrics.metrics('\n\n'.join([row[fixture]] * 5), locale)
                    self.assertEqual(value[key], wanted, (locale, fixture, value))
                direct = metrics.metrics('\n\n'.join([row['citation']] * 5), locale)
                self.assertEqual(direct['cite_end_share'], 0)
                wrapped = '(' + row['citation'].rstrip('.។') + ').'
                self.assertEqual(metrics.metrics('\n\n'.join([wrapped] * 5), locale)['cite_end_share'], 1)
                value = metrics.metrics('\n\n'.join(row['sentences'][0][1] * 3), locale)
                self.assertEqual((value['hypo_open'], value['formula_close'], value['cite_end_share']), (False, False, 0))

    def test_real_failure_short_unavailable_and_unsupported_paths(self):
        with tempfile.TemporaryDirectory(dir=ROOT) as folder:
            for locale, row in CASES.items():
                with self.subTest(locale=locale):
                    self.require(locale)
                    path = Path(folder) / f'neutral.{locale}.md'
                    path.write_text('\n\n'.join([row['sentences'][0][1][0]] * 8))
                    run = subprocess.run([sys.executable, str(ROOT / 'variety_metrics.py'), 'check', str(path), '--lang', locale], text=True, capture_output=True)
                    self.assertEqual(run.returncode, 1, run.stdout + run.stderr)
                    self.assertNotIn('Traceback', run.stderr)
                    path.write_text(row['sentences'][0][1][0])
                    with contextlib.redirect_stdout(io.StringIO()):
                        self.assertEqual(metrics.check(str(path), locale), 2)
            path = Path(folder) / 'unknown.md'
            path.write_text('Neutral sentence.\n\n' * 8)
            for args in ([], ['--lang', 'xx'], ['--lang', 'sr-latn'], ['--lang', 'kh'], ['--lang', 'no']):
                run = subprocess.run([sys.executable, str(ROOT / 'variety_metrics.py'), 'check', str(path), *args], text=True, capture_output=True)
                self.assertEqual(run.returncode, 2)

    def test_khmer_dictionary_runtime_and_real_unavailability(self):
        self.require('km')
        body = '\n\n'.join(CASES['km']['sentences'][0][1] * 3)
        value = metrics.metrics(body, 'km')
        self.assertEqual(value['word_segmenter'], {'locale': 'km', 'node': '24.14.1', 'icu': '78.2', 'unicode': '17.0', 'whitespace': 'Unicode_White_Space_phrase_chunks'})
        with tempfile.TemporaryDirectory(dir=ROOT) as folder:
            path = Path(folder) / 'neutral.km.md'
            path.write_text(body)
            run = subprocess.run([sys.executable, str(ROOT / 'variety_metrics.py'), 'check', str(path), '--lang', 'km'], text=True, capture_output=True,
                                 env={**os.environ, 'PATH': folder, 'PYTHONDONTWRITEBYTECODE': '1'})
            self.assertEqual(run.returncode, 2)
            self.assertIn('Khmer', run.stdout + run.stderr)
            self.assertNotIn('Traceback', run.stderr)
        for text in CASES['km']['unavailable']:
            with self.subTest(text=text), self.assertRaises(multilingual.MeasurementError):
                multilingual.split_sentences(text, 'km')
        with mock.patch.object(multilingual.shutil, 'which', return_value=None):
            with self.assertRaises(multilingual.MeasurementError):
                multilingual.words('សៀវភៅ fresh missing backend ៩៩៩៩', 'km')

    def test_khmer_backend_failures_do_not_cache_invalid_results(self):
        self.require('km')
        bad = ['not json', json.dumps({'locale': 'th', 'tokens': [['សៀវភៅ']]}),
               json.dumps({'locale': 'km', 'tokens': [['សៀវភៅ']]}),
               json.dumps({'locale': 'km', 'tokens': [['សៀវភៅ', 7]]})]
        for index, output in enumerate(bad):
            text = 'សៀវភៅ invalid backend ' + str(index)
            with self.subTest(index=index), mock.patch.object(multilingual.subprocess, 'run', return_value=subprocess.CompletedProcess([], 0, output, '')):
                with self.assertRaises(multilingual.MeasurementError):
                    multilingual.words(text, 'km')
                self.assertNotIn(text, multilingual._KHMER_WORDS)
        with mock.patch.object(multilingual.subprocess, 'run', side_effect=subprocess.CalledProcessError(1, ['node'])):
            with self.assertRaises(multilingual.MeasurementError):
                multilingual.words('សៀវភៅ runtime failure ៩៩៩៨', 'km')

    def test_khmer_separately_authored_boundaries_and_declared_unavailable_case(self):
        self.require('km')
        author = json.loads((ROOT / 'tests/fixtures-km-author.json').read_text())
        for row in author['cases']:
            with self.subTest(id=row['id']):
                if row['id'] == 'km-neutral-04-etc':
                    with self.assertRaises(multilingual.MeasurementError):
                        multilingual.split_sentences(row['input'], 'km')
                else:
                    self.assertEqual(multilingual.split_sentences(row['input'], 'km'), row['expectedSentences'])
                    self.assertEqual(metrics.sentences(row['input'], 'km'), row['expectedSentences'])

    def test_previous_profiles_score_hard_and_dictionary_functions_unchanged(self):
        before = json.loads((ROOT / 'BASELINE42-CANDIDATE.json').read_text())
        for row in before['production_files']:
            if row['path'].startswith('profiles/'):
                # Keep the historic manifest intact; only the reviewed SK
                # date patterns have a new exact hash and behavioral fixtures.
                expected = ('2ea68f2ea8e9a6876c35ea895d8469bcf2c9e6091bb9c64f5bf0270c015bd9af'
                            if row['path'] == 'profiles/sk.json' else row['sha256'])
                # Reviewed TR inflected-ordinal profile; historic manifests stay intact.
                if row['path'] == 'profiles/tr.json':
                    expected = 'ac0f3d212c39e794053ec72fb742c74ebeb29f4111700540746a4feb32797423'
                # Explicit CS date-boundary revision; behavior is checked by test_cs_date_boundaries.
                if row['path'] == 'profiles/cs.json':
                    expected = 'a6718b5fe6af471dfe53bbf4e11087e3ac63dd20d43e44c657691499e8523088'
                self.assertEqual(hashlib.sha256((ROOT / row['path']).read_bytes()).hexdigest(), expected)
        def nodes(path, names):
            return [ast.dump(n, include_attributes=False) for n in ast.parse(path.read_text()).body
                    if (isinstance(n, ast.FunctionDef) and n.name in names) or
                    (isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id in names for t in n.targets))]
        self.assertEqual(nodes(ROOT / 'variety_metrics.py', {'score', 'HARD'}), nodes(ROOT / 'baseline42/variety_metrics.py', {'score', 'HARD'}))
        self.assertEqual(nodes(ROOT / 'variety_multilingual.py', {'prepare_myanmar_words', 'SHORT_WORDS', 'LONG_WORDS'}), nodes(ROOT / 'baseline42/variety_multilingual.py', {'prepare_myanmar_words', 'SHORT_WORDS', 'LONG_WORDS'}))


if __name__ == '__main__':
    unittest.main()
