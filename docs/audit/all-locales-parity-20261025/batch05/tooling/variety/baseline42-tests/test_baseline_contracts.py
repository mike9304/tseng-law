"""Exercise preserved language fixtures and failure contracts against real code."""
from pathlib import Path
import contextlib
import hashlib
import io
import json
import os
import subprocess
import sys
import tempfile
import unittest
from baseline_support import load_baseline

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
import variety_metrics as metrics
import variety_multilingual as multilingual


class BaselineContractTests(unittest.TestCase):
    def test_every_original_profile_fixture(self):
        for path in sorted((ROOT / 'baseline14/profiles').glob('*.json')):
            profile = json.loads(path.read_text())
            lang = profile['locale']
            for index, row in enumerate(profile.get('sentence_fixtures', [])):
                with self.subTest(locale=lang, category='sentences', fixture=index):
                    mapping = {multilingual.normalized(row['text']): row['sentences']} if lang == 'th' else None
                    self.assertEqual(multilingual.split_sentences(row['text'], lang, mapping), row['sentences'])
            for index, row in enumerate(profile.get('word_fixtures', [])):
                with self.subTest(locale=lang, category='words', fixture=index):
                    self.assertEqual(multilingual.words(row['text'], lang), row['tokens'])
            for index, row in enumerate(profile.get('body_fixtures', [])):
                with self.subTest(locale=lang, category='body', fixture=index):
                    paragraphs, _, _ = metrics.body_blocks(row['text'], lang)
                    self.assertEqual([sentence for paragraph in paragraphs for sentence in metrics.sentences(paragraph, lang)], row['sentences'])

    def test_original_four_samples_keep_metrics_and_scores(self):
        old, _ = load_baseline()
        texts = {
            'ko': '서류는 여기 있습니다. 사본도 남았습니다. 긴 문장이 필요한 경우에는 사실과 날짜를 한 문장 안에서 함께 설명합니다.\n\n기간은 짧습니다. 원본을 보관했습니다. 검토는 끝났습니다.',
            'ja': '書類はここにあります。写しも残っています。長い文が必要な場合には事実と日付を一つの文の中で説明します。\n\n期間は短いです。原本は保管しました。確認は終わりました。',
            'en': 'The copy remains here. A second sheet is ready. When the longer explanation is needed, the details and the date can appear together in one sentence.\n\nTime is short. Keep the original. The review is complete.',
            'zh-hant': '文件還在。副本已經備好。需要較長的說明時，可以把事情的經過和日期放在同一個句子。\n\n期限很短。原件仍然保留。核對已經完成。',
        }
        for lang, text in texts.items():
            with self.subTest(locale=lang):
                before = old.metrics(text, lang)
                after = metrics.metrics(text, lang)
                self.assertEqual(after, before)
                self.assertEqual(metrics.score(after, {}), old.score(before, {}))

    def test_missing_and_unapproved_thai_boundaries_stay_unavailable(self):
        with tempfile.TemporaryDirectory() as folder:
            source = Path(folder) / 'fixture.th.md'
            text = 'เอกสารยังอยู่ที่เดิม ผู้ส่งเก็บสำเนาไว้'
            source.write_text(text)
            with contextlib.redirect_stdout(io.StringIO()):
                self.assertEqual(metrics.check(str(source), 'th'), 2)
            source.with_suffix('.sentences.json').write_text(json.dumps({
                'source_sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
                'method': 'independent_review', 'unresolved_boundaries': [],
                'paragraphs': [{'text': text, 'sentences': [text]}],
            }, ensure_ascii=False))
            with self.assertRaises(multilingual.MeasurementError):
                multilingual.sentence_map(source, text, 'th')

    def test_invalid_utf8_is_unavailable_without_traceback(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / 'invalid.ru.md'
            path.write_bytes(b'\xff')
            run = subprocess.run([sys.executable, str(ROOT / 'variety_metrics.py'), 'check', str(path)], capture_output=True, text=True,
                                 env={**os.environ, 'PYTHONDONTWRITEBYTECODE': '1'})
            self.assertEqual(run.returncode, 2)
            self.assertNotIn('Traceback', run.stderr)


if __name__ == '__main__':
    unittest.main()
