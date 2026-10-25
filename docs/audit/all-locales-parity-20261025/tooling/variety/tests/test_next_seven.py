"""Neutral language contracts fixed before production profiles or target drafts."""
from pathlib import Path
import contextlib
import io
import json
import os
import subprocess
import sys
import tempfile
import unittest
import unicodedata

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
import variety_metrics as metrics
import variety_multilingual as multilingual

FIXTURES = json.loads((ROOT / 'tests/fixtures-next-seven.json').read_text())
LANGUAGES = ('da', 'nb', 'fi', 'pl', 'cs', 'ro', 'uk')


class NextSevenTests(unittest.TestCase):
    def require(self, lang):
        self.assertIn(lang, metrics.SUPPORTED, 'the actual locale must be explicitly supported')

    def test_explicit_and_path_routes_never_alias_the_language(self):
        for lang in LANGUAGES:
            with self.subTest(locale=lang):
                self.require(lang)
                self.assertEqual(metrics.guess_lang(f'/tmp/columns-{lang}/neutral.md'), lang)
                self.assertEqual(metrics.guess_lang(f'/tmp/neutral.{lang}.md'), lang)
                self.assertEqual(metrics.metrics('\n\n'.join(FIXTURES[lang]['sentences'][0][1] * 2), lang)['lang'], lang)

    def test_boundaries_keep_abbreviations_ordinals_and_quotes(self):
        # Dropping an abbreviation/ordinal/closing quote splits or joins these
        # separately fixed expected sentences, rather than a mock result.
        for lang in LANGUAGES:
            with self.subTest(locale=lang):
                self.require(lang)
                for text, wanted in FIXTURES[lang]['sentences']:
                    with self.subTest(text=text):
                        self.assertEqual(metrics.sentences(text, lang), wanted)
                        self.assertEqual(multilingual.split_sentences(text, lang), wanted)

    def test_unicode_units_and_canonical_openers(self):
        for lang in LANGUAGES:
            with self.subTest(locale=lang):
                self.require(lang)
                for text, wanted in FIXTURES[lang]['words']:
                    self.assertEqual(multilingual.words(text, lang), wanted)
                    self.assertEqual(metrics.slen(text, lang), len(wanted))
                for text, wanted in FIXTURES[lang]['openers']:
                    self.assertEqual(metrics.opener(text, lang), wanted)

    def test_preprocessing_preserves_boundaries_and_substantive_headings(self):
        for lang in LANGUAGES:
            with self.subTest(locale=lang):
                self.require(lang)
                row = FIXTURES[lang]
                self.assertEqual(metrics.sentences(row['url'][0], lang), row['url'][1])
                a, b = row['sentences'][0][1][:2]
                self.assertEqual(metrics.sentences(f'[{a}](https://example.test/a?x=1) {b}', lang), [a, b])
                for heading in row['sources']:
                    for spelling in (heading, unicodedata.normalize('NFD', heading)):
                        body = f'---\ntitle: "neutral"\n---\n\n{a}\n\n{spelling}\n\n{b}'
                        self.assertEqual(metrics.body_blocks(metrics.strip_fm(body)[1], lang)[0], [a])
                for heading in row['not_sources']:
                    self.assertEqual(metrics.body_blocks(a + '\n\n' + heading + '\n\n' + b, lang)[0], [a, b])

    def test_native_script_signals_and_citations(self):
        for lang in LANGUAGES:
            with self.subTest(locale=lang):
                self.require(lang)
                for text, wanted in FIXTURES[lang]['contrast']:
                    self.assertEqual(multilingual.contrasts(text, lang), wanted)
                for fixture, key, wanted in [('caveat', 'caveat', 5), ('hypothetical', 'hypo_open', True), ('citation', 'cite_end_share', 1), ('formula', 'formula_close', True)]:
                    text = '\n\n'.join([FIXTURES[lang][fixture]] * 5)
                    measured = metrics.metrics(text, lang)
                    self.assertIsNotNone(measured)
                    self.assertEqual(measured[key], wanted)

    def test_orthographic_threshold_edges_and_real_repetition_fail(self):
        with tempfile.TemporaryDirectory() as folder:
            for lang in LANGUAGES:
                with self.subTest(locale=lang):
                    self.require(lang)
                    # Each x is a visible orthographic token: literal lengths
                    # independently establish the 8/32 classification edges.
                    text = '\n\n'.join(' '.join(['x'] * n) + '.' for n in (8, 9, 31, 32, 4))
                    measured = metrics.metrics(text, lang)
                    self.assertEqual((measured['short_share'], measured['long_share']), (0.4, 0.2))
                    self.assertEqual(measured['length_unit'], 'orthographic_words')
                    p = Path(folder) / f'neutral.{lang}.md'
                    sentence = FIXTURES[lang]['sentences'][0][1][0]
                    p.write_text('\n\n'.join([sentence] * 8))
                    with contextlib.redirect_stdout(io.StringIO()):
                        self.assertEqual(metrics.check(str(p), lang), 1)
                    p.write_text(sentence)
                    with contextlib.redirect_stdout(io.StringIO()):
                        self.assertEqual(metrics.check(str(p), lang), 2)

    def test_unsupported_and_nonbokmal_codes_stay_unavailable(self):
        with tempfile.TemporaryDirectory() as folder:
            p = Path(folder) / 'unknown.md'
            p.write_text('Neutral sentence.\n\n' * 8)
            for args in ([], ['--lang', 'bg'], ['--lang', 'nn'], ['--lang', 'no'], ['--lang', 'xx']):
                run = subprocess.run([sys.executable, str(ROOT / 'variety_metrics.py'), 'check', str(p), *args], capture_output=True, text=True, env={**os.environ, 'PYTHONDONTWRITEBYTECODE': '1'})
                self.assertEqual(run.returncode, 2)
                self.assertNotIn('Traceback', run.stderr)


if __name__ == '__main__':
    unittest.main()
