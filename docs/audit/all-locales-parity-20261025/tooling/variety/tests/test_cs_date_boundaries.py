"""Czech named dates must not split; real sentence ends must not be joined."""
from pathlib import Path
import json
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
import variety_metrics as metrics

CASES = json.loads((ROOT/'tests/cs-date-boundaries/neutral-fixtures.json').read_text())


class CzechDateBoundaries(unittest.TestCase):
    def test_named_dates_ranges_and_true_sentence_ends(self):
        # These literal arrays were fixed and failed before the profile edit.
        # Removing lowercase date support splits them; broad case-insensitive
        # protection wrongly joins numeric ends to a capitalized month.
        for case in CASES['sentences']:
            with self.subTest(id=case['id']):
                self.assertEqual(metrics.sentences(case['input'], 'cs'), case['expected'])

    def test_visible_prose_and_list_classification(self):
        for case in CASES['blocks']:
            with self.subTest(id=case['id']):
                paragraphs, _, items = metrics.body_blocks(case['input'], 'cs')
                self.assertEqual(paragraphs, case['expectedParagraphs'])
                self.assertEqual(items, case['expectedListItems'])
                self.assertEqual([s for p in paragraphs for s in metrics.sentences(p, 'cs')],
                                 case['expectedSentences'])


if __name__ == '__main__':
    unittest.main()
