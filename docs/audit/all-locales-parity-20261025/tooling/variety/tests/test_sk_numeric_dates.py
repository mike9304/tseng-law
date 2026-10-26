import json
from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
import variety_metrics as v

class SlovakNumericDateBoundaries(unittest.TestCase):
    def test_numeric_dates_and_real_sentence_boundaries(self):
        fixtures = json.loads((Path(__file__).parent / "sk-numeric-date" / "neutral-fixtures.json").read_text())["fixtures"]
        for case in fixtures:
            with self.subTest(case=case["id"]):
                actual = v.sentences(case["text"], "sk")
                self.assertEqual(actual, case["expected"])
                self.assertEqual(" ".join(actual).split(), case["text"].split())

if __name__ == "__main__":
    unittest.main()
