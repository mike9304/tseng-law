"""Neutral IS continuations and true abbreviation ends, fixed before changes."""
from pathlib import Path
import json
import sys
import unicodedata
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
import variety_metrics as metrics
import variety_multilingual as multilingual
CASES = json.loads((ROOT / 'tests/fixtures-is-fix.json').read_text())


class IcelandicFixTests(unittest.TestCase):
    def test_literal_boundaries_include_coordinated_ordinals_terminal_gr_and_title_negatives(self):
        for case in CASES:
            for form in ('NFC', 'NFD'):
                for space in (' ', '\u00a0', '\u202f'):
                    with self.subTest(text=case['text'], form=form, space=repr(space)):
                        text = unicodedata.normalize(form, case['text'].replace(' ', space))
                        wanted = [unicodedata.normalize(form, s.replace(' ', space)) for s in case['sentences']]
                        self.assertEqual(multilingual.split_sentences(text, 'is'), wanted)
                        self.assertEqual(metrics.sentences(text, 'is'), wanted)
                        self.assertEqual(''.join(text.split()), ''.join(''.join(wanted).split()))

    def test_actual_markdown_source_tail_pipeline_counts_the_fixed_sentences(self):
        paragraphs = [case['text'] for case in CASES]
        paragraphs[0] = '[' + paragraphs[0] + '](https://example.test/library)'
        body = '---\ntitle: Neutral fixture\n---\n\n' + '\n\n'.join(paragraphs)
        body += '\n\n## Heimildir\n\nÞessi lína er utan mælingarinnar.'
        value = metrics.metrics(body, 'is')
        self.assertEqual(value['sentences'], 22)
        self.assertEqual(value['paras'], 14)


if __name__ == '__main__':
    unittest.main()
