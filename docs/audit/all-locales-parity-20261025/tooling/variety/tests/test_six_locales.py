"""Hand-authored neutral expectations; no target article is an expectation source."""
from pathlib import Path
import contextlib
import io
import json
import os
import subprocess
import sys
import tempfile
import unittest
import warnings

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
import variety_metrics as metrics
import variety_multilingual as multilingual

FIXTURES = json.loads((ROOT / 'tests/fixtures-six.json').read_text())
FIXTURES.update(json.loads((ROOT / 'tests/fixtures-sv.json').read_text()))
LANGUAGES = ('ru', 'ms', 'fil', 'tr', 'nl', 'zh-hans', 'sv')


class SixLocaleTests(unittest.TestCase):
    def require(self, lang):
        self.assertIn(lang, metrics.SUPPORTED, 'requested locale must be explicitly supported')

    def test_routes_do_not_alias_a_language(self):
        for lang in LANGUAGES:
            with self.subTest(locale=lang):
                self.require(lang)
                self.assertEqual(metrics.guess_lang(f'/tmp/columns-{lang}/fixture.md'), lang)
                self.assertEqual(metrics.guess_lang(f'/tmp/fixture.{lang}.md'), lang)

    def test_sentence_boundaries_preserve_neutral_prose(self):
        for lang in LANGUAGES:
            with self.subTest(locale=lang):
                self.require(lang)
                for text, wanted in FIXTURES[lang]['sentences']:
                    with self.subTest(text=text):
                        self.assertEqual(metrics.sentences(text, lang), wanted)

    def test_units_preserve_marks_apostrophes_and_numeric_ranges(self):
        for lang in LANGUAGES:
            with self.subTest(locale=lang):
                self.require(lang)
                for text, wanted in FIXTURES[lang]['words']:
                    with self.subTest(text=text):
                        self.assertEqual(multilingual.words(text, lang), wanted)
                        self.assertEqual(metrics.slen(text, lang), len(wanted))

    def test_opener_uses_the_language_and_canonical_unicode(self):
        for lang in LANGUAGES:
            with self.subTest(locale=lang):
                self.require(lang)
                for text, wanted in FIXTURES[lang]['openers']:
                    self.assertEqual(metrics.opener(text, lang), wanted)

    def test_source_tail_is_anchored_not_a_substantive_heading(self):
        for lang in LANGUAGES:
            with self.subTest(locale=lang):
                self.require(lang)
                row = FIXTURES[lang]
                first = row['sentences'][0][1][0]
                second = row['sentences'][0][1][1]
                for heading in row['sources']:
                    prose, _, _ = metrics.body_blocks(first + '\n\n' + heading + '\n\n' + second, lang)
                    self.assertEqual(prose, [first])
                for heading in row['not_sources']:
                    prose, _, _ = metrics.body_blocks(first + '\n\n' + heading + '\n\n' + second, lang)
                    self.assertEqual(prose, [first, second])

    def test_contrasts_do_not_count_ordinary_negation(self):
        for lang in LANGUAGES:
            with self.subTest(locale=lang):
                self.require(lang)
                for text, wanted in FIXTURES[lang]['contrast']:
                    self.assertEqual(multilingual.contrasts(text, lang), wanted)

    def test_language_signals_and_citations(self):
        for lang in LANGUAGES:
            with self.subTest(locale=lang):
                self.require(lang)
                for key, expected in [('caveat', 'caveat'), ('hypothetical', 'hypo_open'), ('citation', 'cite_end_share')]:
                    measured = metrics.metrics('\n\n'.join([FIXTURES[lang][key]] * 5), lang)
                    self.assertIsNotNone(measured)
                    self.assertEqual(measured[expected], 5 if key == 'caveat' else 1)

    def test_url_removal_retains_the_sentence_boundary(self):
        for lang in LANGUAGES:
            with self.subTest(locale=lang):
                self.require(lang)
                text, wanted = FIXTURES[lang]['url']
                self.assertEqual(metrics.sentences(text, lang), wanted)
                label = FIXTURES[lang]['sentences'][0][1][0]
                self.assertEqual(metrics.sentences(f'[{label}](https://example.test/a?x=1)', lang), [label])

    def test_character_units_are_not_latin_word_units(self):
        self.require('zh-hans')
        result = metrics.metrics('\n\n'.join(FIXTURES['zh-hans']['sentences'][0][1] * 2), 'zh-hans')
        self.assertEqual(result['length_unit'], 'nonspace_characters_excluding_parentheticals')
        self.assertEqual((result['short_threshold'], result['long_threshold']), (12, 60))
        for lang in (value for value in LANGUAGES if value != 'zh-hans'):
            self.require(lang)
            result = metrics.metrics('\n\n'.join(FIXTURES[lang]['sentences'][0][1] * 2), lang)
            self.assertEqual(result['length_unit'], 'orthographic_words')
            self.assertEqual((result['short_threshold'], result['long_threshold']), (8, 32))

    def test_repeated_neutral_prose_really_fails_and_short_inputs_do_not_pass(self):
        with tempfile.TemporaryDirectory() as folder:
            for lang in LANGUAGES:
                with self.subTest(locale=lang):
                    self.require(lang)
                    path = Path(folder) / f'fixture.{lang}.md'
                    sentence = FIXTURES[lang]['sentences'][0][1][0]
                    path.write_text('\n\n'.join([sentence] * 8))
                    with contextlib.redirect_stdout(io.StringIO()):
                        self.assertEqual(metrics.check(str(path), lang), 1)
                    path.write_text(sentence)
                    with contextlib.redirect_stdout(io.StringIO()):
                        self.assertEqual(metrics.check(str(path), lang), 2)

    def test_unknown_cli_locale_and_path_fail_closed(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / 'unknown.md'
            path.write_text('A neutral line.\n\n' * 6)
            for extra in ([], ['--lang', 'xx']):
                run = subprocess.run([sys.executable, str(ROOT / 'variety_metrics.py'), 'check', str(path), *extra], capture_output=True, text=True,
                                     env={**os.environ, 'PYTHONDONTWRITEBYTECODE': '1'})
                self.assertEqual(run.returncode, 2)
                self.assertNotIn('Traceback', run.stderr)

    def test_check_closes_its_source_without_a_resource_warning(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / 'fixture.en.md'
            path.write_text('This neutral sentence is repeated.\n\n' * 6)
            with warnings.catch_warnings(record=True) as recorded, contextlib.redirect_stdout(io.StringIO()):
                warnings.simplefilter('always', ResourceWarning)
                metrics.check(str(path), 'en')
            self.assertEqual([str(item.message) for item in recorded if issubclass(item.category, ResourceWarning)], [])

    def test_raw_url_interior_is_not_a_sentence_boundary(self):
        self.require('ru')
        text = 'Адрес https://example.test/a?x=1. Копия готова.'
        self.assertEqual(multilingual.split_sentences(text, 'ru'), ['Адрес https://example.test/a?x=1.', 'Копия готова.'])

    def test_reserved_marker_is_an_explicit_measurement_error(self):
        self.require('ru')
        for marker in ('\ue000', '\ue001'):
            with self.assertRaises(multilingual.MeasurementError):
                multilingual.split_sentences('Копия ' + marker + ' готова.', 'ru')


if __name__ == '__main__':
    unittest.main()
