"""SK calendar ordinals and true sentence ends, with literal neutral arrays."""
from pathlib import Path
import json
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
import variety_metrics as vm

CASES = json.loads((ROOT / 'tests/sk-date-boundaries/neutral-fixtures.json').read_text())


class SlovakDateBoundaries(unittest.TestCase):
    def test_dates_and_true_sentence_ends(self):
        for case in CASES['sentences']:
            with self.subTest(id=case['id']):
                self.assertEqual(vm.sentences(case['input'], 'sk'), case['expected'])

    def test_original_markdown_classification_then_visible_boundaries(self):
        for case in CASES['blocks']:
            with self.subTest(id=case['id']):
                paragraphs, _, items = vm.body_blocks(case['input'], 'sk')
                self.assertEqual(paragraphs, case['expectedParagraphs'])
                self.assertEqual(items, case['expectedListItems'])
                self.assertEqual([s for p in paragraphs for s in vm.sentences(p, 'sk')], case['expectedSentences'])


if __name__ == '__main__':
    unittest.main()
