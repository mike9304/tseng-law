"""Literal neutral cases fixed without reading new target manuscripts."""
from pathlib import Path
import contextlib
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

CASES = json.loads((ROOT / 'tests/fixtures-batch03.json').read_text())
LANGUAGES = ('bg', 'ca', 'el', 'hr', 'hu', 'is', 'sk')


class Batch03Tests(unittest.TestCase):
    def require(self, lang):
        self.assertIn(lang, metrics.SUPPORTED, 'explicit locale support is missing')

    def test_routes_and_real_cli_use_the_requested_locale(self):
        with tempfile.TemporaryDirectory(dir=ROOT) as tmp:
            for lang in LANGUAGES:
                with self.subTest(locale=lang):
                    self.require(lang)
                    self.assertEqual(metrics.guess_lang(f'/tmp/columns-{lang}/neutral.md'), lang)
                    self.assertEqual(metrics.guess_lang(f'/tmp/neutral.{lang}.md'), lang)
                    p = Path(tmp) / f'neutral.{lang}.md'
                    p.write_text('\n\n'.join([CASES[lang]['sentences'][0][1][0]] * 8))
                    run = subprocess.run([sys.executable, str(ROOT / 'variety_metrics.py'), 'check', str(p), '--lang', lang], capture_output=True, text=True, env={**os.environ, 'PYTHONDONTWRITEBYTECODE': '1'})
                    self.assertEqual(run.returncode, 1, run.stdout + run.stderr)
                    self.assertIn(f'[{lang}]', run.stdout)
                    self.assertIn('FAIL', run.stdout)

    def test_boundaries_do_not_split_abbreviations_ordinals_or_quotes(self):
        # Dropping a locale's protection or its quote/terminal handling changes
        # the separately fixed slices, not an expectation computed by the tool.
        for lang in LANGUAGES:
            with self.subTest(locale=lang):
                self.require(lang)
                for text, wanted in CASES[lang]['sentences']:
                    for form in ('NFC', 'NFD'):
                        with self.subTest(text=text, form=form):
                            actual_text = unicodedata.normalize(form, text)
                            expected = [unicodedata.normalize(form, s) for s in wanted]
                            self.assertEqual(metrics.sentences(actual_text, lang), expected)
                            self.assertEqual(multilingual.split_sentences(actual_text, lang), expected)

    def test_units_and_openers_respect_unicode_and_catalan_ela_geminada(self):
        for lang in LANGUAGES:
            with self.subTest(locale=lang):
                self.require(lang)
                for text, wanted in CASES[lang]['words']:
                    for form in ('NFC', 'NFD'):
                        self.assertEqual(multilingual.words(unicodedata.normalize(form, text), lang), [unicodedata.normalize(form, word) for word in wanted])
                for text, wanted in CASES[lang]['openers']:
                    self.assertEqual(metrics.opener(text, lang), wanted)
                    self.assertEqual(metrics.opener(unicodedata.normalize('NFD', text), lang), wanted)

    def test_source_headings_are_anchored_and_do_not_discard_ordinary_prose(self):
        for lang in LANGUAGES:
            with self.subTest(locale=lang):
                self.require(lang)
                first, second = CASES[lang]['sentences'][0][1][:2]
                for heading in CASES[lang]['sources']:
                    for form in ('NFC', 'NFD'):
                        body = first + '\n\n' + unicodedata.normalize(form, heading) + '\n\n' + second
                        self.assertEqual(metrics.body_blocks(body, lang)[0], [first])
                for heading in CASES[lang]['not_sources']:
                    self.assertEqual(metrics.body_blocks(first + '\n\n' + heading + '\n\n' + second, lang)[0], [first, second])

    def test_urls_markdown_and_unicode_whitespace_preserve_sentence_endings(self):
        for lang in LANGUAGES:
            with self.subTest(locale=lang):
                self.require(lang)
                text, wanted = CASES[lang]['url']
                self.assertEqual(metrics.sentences(text, lang), wanted)
                first, second = CASES[lang]['sentences'][0][1][:2]
                for space in (' ', '\u00a0', '\u202f', '\t'):
                    self.assertEqual(metrics.sentences(f'[{first}](https://example.test/a?x=1){space}{second}', lang), [first, second])
                raw = 'https://example.test/a?x=1.' + ' ' + second
                self.assertEqual(multilingual.split_sentences(raw, lang), ['https://example.test/a?x=1.', second])

    def test_contrasts_do_not_turn_ordinary_negation_or_next_sentence_into_a_hit(self):
        for lang in LANGUAGES:
            with self.subTest(locale=lang):
                self.require(lang)
                for text, wanted in CASES[lang]['contrast']:
                    self.assertEqual(multilingual.contrasts(text, lang), wanted)
                    self.assertEqual(multilingual.contrasts(unicodedata.normalize('NFD', text), lang), wanted)

    def test_signals_and_citations_use_the_actual_language(self):
        for lang in LANGUAGES:
            with self.subTest(locale=lang):
                self.require(lang)
                for key, metric, wanted in [('caveat', 'caveat', 5), ('hypothetical', 'hypo_open', True), ('citation', 'cite_end_share', 1), ('formula', 'formula_close', True)]:
                    value = metrics.metrics('\n\n'.join([CASES[lang][key]] * 5), lang)
                    self.assertIsNotNone(value)
                    self.assertEqual(value[metric], wanted, (lang, key, value))

    def test_greek_question_marks_and_citation_tails_match_sentence_boundaries(self):
        self.require('el')
        for question in CASES['el']['questions']:
            value = metrics.metrics('\n\n'.join([question] * 5), 'el')
            self.assertEqual(value['sentences'], 5)
            self.assertEqual(value['questions'], 5)
            self.assertTrue(value['q_open'])
        for mark in (';', '\u037e'):
            value = metrics.metrics('\n\n'.join([f'Είναι εδώ (άρθρο 2){mark}'] * 5), 'el')
            self.assertEqual(value['cite_end_share'], 1)
        # A semicolon must keep its old nonterminal role in another locale.
        self.assertEqual(metrics.sentences('Kopija je ovdje; vrata su otvorena. Zatim odlaze.', 'hr'), ['Kopija je ovdje; vrata su otvorena.', 'Zatim odlaze.'])

    def test_threshold_edges_short_inputs_and_reserved_markers_keep_failure_contract(self):
        with tempfile.TemporaryDirectory(dir=ROOT) as tmp:
            for lang in LANGUAGES:
                with self.subTest(locale=lang):
                    self.require(lang)
                    text = '\n\n'.join(' '.join(['x'] * n) + '.' for n in (8, 9, 31, 32, 4))
                    value = metrics.metrics(text, lang)
                    self.assertEqual((value['short_share'], value['long_share']), (0.4, 0.2))
                    self.assertEqual(value['length_unit'], 'orthographic_words')
                    p = Path(tmp) / f'short.{lang}.md'
                    p.write_text(CASES[lang]['sentences'][0][1][0])
                    with contextlib.redirect_stdout(io.StringIO()):
                        self.assertEqual(metrics.check(str(p), lang), 2)
                    for marker in ('\ue000', '\ue001'):
                        with self.assertRaises(multilingual.MeasurementError):
                            multilingual.split_sentences(marker + ' ' + p.read_text(), lang)

    def test_unknown_codes_paths_and_missing_profile_never_fallback(self):
        with tempfile.TemporaryDirectory(dir=ROOT) as tmp:
            p = Path(tmp) / 'unknown.md'
            p.write_text('A neutral sentence.\n\n' * 8)
            for args in ([], ['--lang', 'xx'], ['--lang', 'nn'], ['--lang', 'no'], ['--lang', 'xx']):
                run = subprocess.run([sys.executable, str(ROOT / 'variety_metrics.py'), 'check', str(p), *args], capture_output=True, text=True, env={**os.environ, 'PYTHONDONTWRITEBYTECODE': '1'})
                self.assertEqual(run.returncode, 2)
                self.assertNotIn('Traceback', run.stderr)
            self.require('bg')
            # Exercise the real loader against an empty profile directory;
            # never move or mutate a production profile for the negative test.
            old = multilingual.PROFILE_DIR
            multilingual.profile.cache_clear()
            try:
                multilingual.PROFILE_DIR = Path(tmp)
                with contextlib.redirect_stdout(io.StringIO()):
                    self.assertEqual(metrics.check(str(p), 'bg'), 2)
            finally:
                multilingual.PROFILE_DIR = old
                multilingual.profile.cache_clear()


if __name__ == '__main__':
    unittest.main()
