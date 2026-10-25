"""Additional neutral boundary cases frozen before their production fix."""
from pathlib import Path
import json
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
import variety_metrics as metrics
import variety_multilingual as multilingual

CASES = json.loads((ROOT / 'tests/fixtures-batch03-edges.json').read_text())


class Batch03EdgeTests(unittest.TestCase):
    def test_terminal_abbreviations_preserve_boundaries_after_unicode_spaces(self):
        for lang, sentences in CASES['terminal_abbreviations'].items():
            for separator in (' ', '\u00a0', '\u202f', '\t'):
                with self.subTest(locale=lang, separator=repr(separator)):
                    text = separator.join(sentences)
                    self.assertEqual(multilingual.split_sentences(text, lang), sentences)
                    self.assertEqual(metrics.sentences(text, lang), sentences)

    def test_raw_urls_keep_greek_question_punctuation(self):
        for case in CASES['greek_urls']:
            with self.subTest(text=case['input']):
                self.assertEqual(multilingual.split_sentences(case['input'], 'el'), case['raw_sentences'])
                self.assertEqual(metrics.sentences(case['input'], 'el'), case['visible_sentences'])

    def test_url_question_metrics_match_sentence_preprocessing(self):
        for case in CASES['greek_urls']:
            with self.subTest(question=case['question']):
                result = metrics.metrics('\n\n'.join([case['question']] * 5), 'el')
                self.assertEqual(result['sentences'], 5)
                self.assertEqual(result['questions'], 5)
                self.assertTrue(result['q_open'])


if __name__ == '__main__':
    unittest.main()
