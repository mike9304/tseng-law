"""Literal accented-final ordinal follower, added before its profile fix."""
from pathlib import Path
import sys
import unicodedata
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
import variety_metrics as metrics


class CatalanOrdinalTests(unittest.TestCase):
    def test_final_accent_in_ordinal_follower_keeps_nfc_nfd_equivalence(self):
        original = 'La 2a. edició comença avui. La sala és oberta.'
        expected = ['La 2a. edició comença avui.', 'La sala és oberta.']
        for form in ('NFC', 'NFD'):
            with self.subTest(form=form):
                self.assertEqual(metrics.sentences(unicodedata.normalize(form, original), 'ca'),
                                 [unicodedata.normalize(form, part) for part in expected])


if __name__ == '__main__':
    unittest.main()
