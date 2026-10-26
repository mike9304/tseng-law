"""Literal Turkish inflected ordinal and true-sentence-end contracts."""
from pathlib import Path
import json,sys,unittest
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
import variety_metrics as v
import variety_multilingual as m
FIXTURES=ROOT/'tests/tr-ordinal-boundaries'
class TurkishOrdinalTests(unittest.TestCase):
    def check_cases(self,name):
        for row in json.loads((FIXTURES/name).read_text())['cases']:
            with self.subTest(id=row['id']):
                self.assertEqual(v.sentences(row['text'],'tr'),row['expected'])
                self.assertEqual(m.split_sentences(row['text'],'tr'),row['expected'])
    def test_inflected_nouns_and_true_sentence_ends(self):
        self.check_cases('neutral-fixtures.json')
    def test_locative_relative_forms_and_true_sentence_end(self):
        self.check_cases('neutral-relative-fixtures.json')
    def test_paragraph_and_heading_boundaries(self):
        body='Kitabın 7. sayfasını okuduk. Sonra durduk.\n\n## 4. Madde\n\nListenin 2. bendini okuduk.\n\n## Resmî kaynaklar\n\nBu bölüm istatistik dışında.'
        paragraphs,_,_=v.body_blocks(body,'tr')
        self.assertEqual(paragraphs,['Kitabın 7. sayfasını okuduk. Sonra durduk.','Listenin 2. bendini okuduk.'])
        self.assertEqual([v.sentences(p,'tr') for p in paragraphs],[['Kitabın 7. sayfasını okuduk.','Sonra durduk.'],['Listenin 2. bendini okuduk.']])
if __name__=='__main__':unittest.main()
