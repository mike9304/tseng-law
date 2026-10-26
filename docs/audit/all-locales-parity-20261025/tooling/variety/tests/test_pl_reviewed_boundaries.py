"""Real source/approval/evidence files; neutral synthetic approvals only.

The fixture reviewer below is not an approval of any manuscript. Literal
sentence arrays are fixed independently of the production splitter.
"""
from pathlib import Path
import contextlib
import copy
import hashlib
import io
import json
import os
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
import variety_metrics as vm
import variety_multilingual as mm


FULL = [
    ['W maju 2023 r. Biblioteka otworzyła nową salę.',
     'Wrócili czytelnicy.', 'Drzwi są otwarte.'],
    ['Katalog stoi przy oknie.', 'Anna czyta.',
     'Każda półka ma czytelne oznaczenie, więc książkę można odnaleźć bez pomocy pracownika.'],
]
ANSWER = [
    ['Kiedy otwarto wystawę?', 'W maju 2023 r.', 'Dziękuję za odpowiedź.'],
    ['Katalog stoi przy oknie.', 'Anna czyta.', 'Drzwi są otwarte.'],
]


def digest(payload):
    return hashlib.sha256(payload).hexdigest()


def json_bytes(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True,
                      separators=(',', ':')).encode('utf-8')


def fixture(folder, sentences=FULL, locale='pl', source_text=None, rows=None):
    source = folder / ('neutral.' + locale + '.md')
    text = source_text or '---\ntitle: "Neutral test only"\n---\n\n' + '\n\n'.join(' '.join(s) for s in sentences)
    source.write_text(text)
    rows = copy.deepcopy(rows if rows is not None else
                         [{'text': ' '.join(s), 'sentences': list(s)} for s in sentences])
    evidence = folder / 'independent-neutral-review.md'
    evidence.write_text('Synthetic neutral test evidence; not native review or manuscript approval.\n')
    approval = folder / 'approval.json'
    approval_data = {
        'schema_version': 1, 'locale': locale, 'status': 'approved',
        'reviewer': 'neutral-test-fixture-not-manuscript-approval',
        'entries': [{'source_sha256': digest(source.read_bytes()),
                     'method': 'independent_review', 'unresolved_boundaries': [],
                     'paragraphs_sha256': digest(json_bytes(rows))}],
        'evidence': [{'role': 'independent-review', 'path': evidence.name,
                      'sha256': digest(evidence.read_bytes())}],
    }
    approval.write_bytes(json_bytes(approval_data))
    record = {'source_sha256': digest(source.read_bytes()),
              'method': 'independent_review', 'unresolved_boundaries': [],
              'approval_record': {'path': approval.name,
                                  'sha256': digest(approval.read_bytes())},
              'paragraphs': rows}
    if locale == 'pl':
        record['locale'] = 'pl'
    map_path = source.with_suffix('.sentences.json')
    map_path.write_bytes(json_bytes(record))
    return source, text, map_path, record, approval, approval_data, evidence


def save_map(path, value):
    path.write_bytes(json_bytes(value))


class PolishReviewedBoundariesTests(unittest.TestCase):
    def test_unmapped_date_readings_are_errors_not_guessed_merges(self):
        # Removing the ambiguity error would silently choose a different array.
        examples = [
            ' '.join(FULL[0]), ' '.join(ANSWER[0]),
            'Podaj datę otwarcia wystawy. 6 stycznia 2022 r. Dziękuję za odpowiedź.',
            'Podaj datę otwarcia wystawy! 6 stycznia 2022 r. Dziękuję za odpowiedź.',
            'Kiedy otwarto wystawę? W maju 2023 r. Biblioteka udostępniła nową salę.',
            'Remont zakończono, a 6 stycznia 2022 r. Biblioteka otworzyła salę.',
            'W paz\u0301dzierniku 2023 r. Biblioteka otworzyła salę.',
        ]
        for text in examples:
            with self.subTest(text=text), self.assertRaises(mm.MeasurementError):
                vm.sentences(text, 'pl')

    def test_valid_approved_map_preserves_full_sentence_reading_and_method(self):
        with tempfile.TemporaryDirectory() as tmp:
            source, text, path, *_ = fixture(Path(tmp))
            mapping = mm.sentence_map(source, text, 'pl', path)
            self.assertIsNotNone(mapping)
            self.assertEqual(vm.sentences(' '.join(FULL[0]), 'pl', mapping), FULL[0])
            measured = vm.metrics(text, 'pl', mapping)
            self.assertEqual(measured['sentences'], 6)
            self.assertEqual(measured['sentence_boundary_method'], 'reviewed_sha_bound_map')
            self.assertEqual(measured['length_unit'], 'orthographic_words')

    def test_valid_approved_map_preserves_short_answer_reading(self):
        with tempfile.TemporaryDirectory() as tmp:
            source, text, path, *_ = fixture(Path(tmp), ANSWER)
            mapping = mm.sentence_map(source, text, 'pl', path)
            self.assertIsNotNone(mapping)
            self.assertEqual(vm.sentences(' '.join(ANSWER[0]), 'pl', mapping), ANSWER[0])
            self.assertEqual(vm.metrics(text, 'pl', mapping)['sentences'], 6)

    def test_ordinary_unmapped_polish_keeps_real_terminal_and_lowercase(self):
        for text, expected in [
            ('Raport wydano w maju 2023 r. Biblioteka kupiła kopię.',
             ['Raport wydano w maju 2023 r.', 'Biblioteka kupiła kopię.']),
            ('W maju 2023 r. biblioteka otworzyła salę. Drzwi są otwarte.',
             ['W maju 2023 r. biblioteka otworzyła salę.', 'Drzwi są otwarte.']),
            ('Zastosowano art. 2 ust. 1. Wynik zapisano.',
             ['Zastosowano art. 2 ust. 1.', 'Wynik zapisano.']),
        ]:
            self.assertEqual(vm.sentences(text, 'pl'), expected)

    def test_changed_source_sha_rejects_previously_valid_map(self):
        with tempfile.TemporaryDirectory() as tmp:
            source, text, path, *_ = fixture(Path(tmp))
            source.write_text(text.replace('Neutral test only', 'Changed metadata'))
            with self.assertRaises(mm.MeasurementError):
                mm.sentence_map(source, source.read_text(), 'pl', path)

    def test_changed_approval_binding_and_review_evidence_are_rejected(self):
        for changed in ('approval', 'evidence'):
            with self.subTest(changed=changed), tempfile.TemporaryDirectory() as tmp:
                source, text, path, record, approval, data, evidence = fixture(Path(tmp))
                target = approval if changed == 'approval' else evidence
                target.write_bytes(target.read_bytes() + b' ')
                with self.assertRaises(mm.MeasurementError):
                    mm.sentence_map(source, text, 'pl', path)

    def test_boundary_change_with_same_text_requires_new_approval(self):
        with tempfile.TemporaryDirectory() as tmp:
            source, text, path, record, *_ = fixture(Path(tmp))
            record['paragraphs'][0]['sentences'] = [' '.join(FULL[0])]
            save_map(path, record)
            with self.assertRaises(mm.MeasurementError):
                mm.sentence_map(source, text, 'pl', path)

    def test_non_polish_map_or_approval_locale_is_rejected(self):
        for wrong in ('map', 'approval'):
            with self.subTest(wrong=wrong), tempfile.TemporaryDirectory() as tmp:
                source, text, path, record, approval, data, _ = fixture(Path(tmp))
                if wrong == 'map':
                    record['locale'] = 'th'
                else:
                    data['locale'] = 'th'
                    approval.write_bytes(json_bytes(data))
                    record['approval_record']['sha256'] = digest(approval.read_bytes())
                save_map(path, record)
                with self.assertRaises(mm.MeasurementError):
                    mm.sentence_map(source, text, 'pl', path)

    def test_missing_extra_reordered_and_duplicate_paragraph_coverage_fail(self):
        full_rows = [{'text': ' '.join(s), 'sentences': list(s)} for s in FULL]
        variants = [full_rows[:1], full_rows + [full_rows[0]], list(reversed(full_rows))]
        for rows in variants:
            with self.subTest(rows=rows), tempfile.TemporaryDirectory() as tmp:
                source, text, path, *_ = fixture(Path(tmp), rows=rows)
                mapping = mm.sentence_map(source, text, 'pl', path)
                with self.assertRaises(mm.MeasurementError):
                    vm.metrics(text, 'pl', mapping)
        with tempfile.TemporaryDirectory() as tmp:
            text = '\n\n'.join([' '.join(FULL[0]), ' '.join(FULL[0]), ' '.join(FULL[1])])
            source, text, path, *_ = fixture(Path(tmp), source_text=text, rows=full_rows)
            mapping = mm.sentence_map(source, text, 'pl', path)
            with self.assertRaises(mm.MeasurementError):
                vm.metrics(text, 'pl', mapping)

    def test_valid_map_handles_markdown_visible_text_and_all_paragraphs(self):
        with tempfile.TemporaryDirectory() as tmp:
            raw = '\n\n'.join(' '.join(s) for s in FULL).replace('Biblioteka', '[Biblioteka](https://example.test/catalog)')
            source, text, path, *_ = fixture(Path(tmp), source_text=raw)
            mapping = mm.sentence_map(source, text, 'pl', path)
            self.assertIsNotNone(mapping)
            self.assertEqual(vm.metrics(text, 'pl', mapping)['sentences'], 6)

    def test_map_reuse_on_changed_text_and_unvalidated_dict_fail(self):
        with tempfile.TemporaryDirectory() as tmp:
            source, text, path, *_ = fixture(Path(tmp))
            mapping = mm.sentence_map(source, text, 'pl', path)
            with self.assertRaises(mm.MeasurementError):
                vm.metrics(text.replace('Neutral test only', 'Different source'), 'pl', mapping)
            unvalidated = {' '.join(s): list(s) for s in FULL}
            with self.assertRaises(mm.MeasurementError):
                vm.metrics(text, 'pl', unvalidated)

    def test_missing_explicit_or_invalid_discovered_optional_map_errors(self):
        with tempfile.TemporaryDirectory() as tmp:
            source = Path(tmp) / 'neutral.pl.md'
            source.write_text('Katalog stoi przy oknie. Anna czyta.')
            self.assertIsNone(mm.sentence_map(source, source.read_text(), 'pl'))
            with self.assertRaises(mm.MeasurementError):
                mm.sentence_map(source, source.read_text(), 'pl', Path(tmp) / 'missing.json')
            source.with_suffix('.sentences.json').write_text('{}')
            with self.assertRaises(mm.MeasurementError):
                mm.sentence_map(source, source.read_text(), 'pl')

    def test_unapproved_and_unresolved_records_fail_even_with_matching_hashes(self):
        for field in ('status', 'method', 'unresolved_boundaries', 'evidence-role'):
            with self.subTest(field=field), tempfile.TemporaryDirectory() as tmp:
                source, text, path, record, approval, data, _ = fixture(Path(tmp))
                if field == 'status': data['status'] = 'draft'
                elif field == 'method': record['method'] = 'automatic_split'
                elif field == 'unresolved_boundaries': record[field] = ['date']
                else: data['evidence'][0]['role'] = 'author-only'
                approval.write_bytes(json_bytes(data))
                record['approval_record']['sha256'] = digest(approval.read_bytes())
                save_map(path, record)
                with self.assertRaises(mm.MeasurementError):
                    mm.sentence_map(source, text, 'pl', path)

    def test_thai_required_map_and_existing_review_contract_stay_exact(self):
        with tempfile.TemporaryDirectory() as tmp:
            source = Path(tmp) / 'neutral.th.md'
            source.write_text('เอกสารยังอยู่ที่เดิม')
            with self.assertRaises(mm.MeasurementError) as error:
                mm.sentence_map(source, source.read_text(), 'th')
            self.assertEqual(str(error.exception), 'Thai sentence boundaries require a reviewed, source-SHA-bound sentence map; no punctuation-only fallback')
            source, text, path, record, *_ = fixture(Path(tmp), [['เอกสารยังอยู่ที่เดิม', 'ผู้ส่งเก็บสำเนาไว้']], 'th')
            mapping = mm.sentence_map(source, text, 'th', path)
            self.assertEqual(mm.split_sentences('เอกสารยังอยู่ที่เดิม ผู้ส่งเก็บสำเนาไว้', 'th', mapping), ['เอกสารยังอยู่ที่เดิม', 'ผู้ส่งเก็บสำเนาไว้'])
            record['unresolved_boundaries'] = ['unresolved']
            save_map(path, record)
            with self.assertRaises(mm.MeasurementError) as error:
                mm.sentence_map(source, text, 'th', path)
            self.assertEqual(str(error.exception), f'missing or unresolved Thai sentence review: {path}')

    def test_other_locale_map_api_is_not_expanded(self):
        self.assertIsNone(mm.sentence_map('/not/a/source', 'Texte.', 'fr', '/not/a/map'))

    def test_actual_cli_unmapped_ambiguity_returns_two_without_traceback(self):
        with tempfile.TemporaryDirectory() as tmp:
            source = Path(tmp) / 'neutral.pl.md'
            source.write_text('\n\n'.join(' '.join(s) for s in FULL))
            run = subprocess.run([sys.executable, str(ROOT / 'variety_metrics.py'), 'check', str(source), '--lang', 'pl'], capture_output=True, text=True, env={**os.environ, 'PYTHONDONTWRITEBYTECODE': '1'})
            self.assertEqual(run.returncode, 2)
            self.assertIn('measurement unavailable', run.stdout)
            self.assertNotIn('Traceback', run.stderr)


if __name__ == '__main__':
    unittest.main()
