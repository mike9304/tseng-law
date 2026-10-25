#!/usr/bin/env python3
"""Run frozen independent expectations and synthetic original-locale regression.

Never opens the publication repository or target manuscripts. All generated
fixtures and execution output stay below this review-owned directory.
"""
import argparse
import collections
import datetime
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import unicodedata

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parent
ORIGINAL = Path('/Users/son7/tseng-lanes-shared/variety')
FIXTURE_SHA = '41b6641d7f683f508b1db0a68984b46eedc903cc0aee1732b57a3191bd515511'
NEW = ('fil', 'he', 'nl', 'pl', 'cs', 'lt')

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def manifest(root):
    return {str(p.relative_to(root)): sha(p) for p in sorted(root.rglob('*'))
            if p.is_file() and p.suffix in ('.py', '.json', '.md') and '__pycache__' not in p.parts}

def load(root, label):
    spec = importlib.util.spec_from_file_location('variety_multilingual', root / 'variety_multilingual.py')
    multi = importlib.util.module_from_spec(spec)
    sys.modules['variety_multilingual'] = multi
    spec.loader.exec_module(multi)
    spec = importlib.util.spec_from_file_location(f'variety_metrics_{label}', root / 'variety_metrics.py')
    metrics = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(metrics)
    return multi, metrics

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--candidate', required=True, type=Path)
    parser.add_argument('--out', required=True, type=Path)
    args = parser.parse_args()
    candidate = args.candidate.resolve()
    assert (ROOT / 'neutral-fixtures.json').is_file()
    assert sha(ROOT / 'neutral-fixtures.json') == FIXTURE_SHA, 'frozen fixture SHA changed'
    assert ROOT == args.out.resolve().parent or ROOT in args.out.resolve().parents, 'review output must remain owned'
    before_original, before_candidate = manifest(ORIGINAL), manifest(candidate)
    original_multi, original_metrics = load(ORIGINAL, 'original')
    multi, metrics = load(candidate, 'candidate')
    records = []

    def check(identifier, actual, expected, detail=None):
        records.append({'id': identifier, 'status': 'PASS' if actual == expected else 'FAIL',
                        'actual': actual, 'expected': expected, 'detail': detail})

    for fixture in json.loads((ROOT / 'neutral-fixtures.json').read_text())['fixtures']:
        kind, lang, text = fixture['kind'], fixture['locale'], fixture['text']
        try:
            if kind == 'sentences':
                actual = multi.split_sentences(text, lang)
            elif kind == 'words':
                actual = multi.words(text, lang)
            elif kind == 'source_heading':
                actual = multi.source_heading(text, lang)
            elif kind == 'contrasts':
                actual = multi.contrasts(text, lang)
            elif kind == 'signal':
                actual = bool(re.search(multi.profile(lang)[fixture['pattern_key']], unicodedata.normalize('NFC', text)))
            elif kind == 'citation_metrics':
                measured = metrics.metrics(text, lang)
                actual = None if measured is None else {key: measured[key] for key in fixture['expected']}
            else:
                raise ValueError(kind)
            check(fixture['id'], actual, fixture['expected'], fixture['note'])
        except Exception as error:
            check(fixture['id'], {'error': f'{type(error).__name__}: {error}'}, fixture['expected'], fixture['note'])

    check('contract-hard-values', metrics.HARD, original_metrics.HARD)
    check('contract-short-units', multi.SHORT_WORDS, 8)
    check('contract-long-units', multi.LONG_WORDS, 32)
    check('contract-existing-supported', tuple(lang for lang in metrics.SUPPORTED if lang not in NEW), original_metrics.SUPPORTED)
    check('contract-new-supported', sorted(set(metrics.SUPPORTED) - set(original_metrics.SUPPORTED)), sorted(NEW))
    for name, oldhash in before_original.items():
        if name.startswith('profiles/'):
            check(f'original-profile-bytes-{name}', before_candidate.get(name), oldhash)

    # Identical synthetic paragraphs across all locales exercise every branch,
    # including punctuation, abbreviations, source headings and rhetorical rules.
    # They are measurement fixtures, not multilingual publishable prose.
    synthetic = [
        'Alpha beta.',
        'Beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu xi omicron pi rho sigma tau.',
        'Gamma delta epsilon zeta eta theta iota kappa lambda.',
        'Delta epsilon.',
        'Epsilon zeta eta theta iota kappa lambda mu nu xi omicron pi rho sigma tau upsilon phi chi psi omega alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu.',
        'Zeta eta theta iota.',
    ]
    script_neutral = {
        'ko': ['서류가 왔습니다.', '기록을 차례로 확인하면서 원본과 사본의 날짜도 대조했습니다.', '메일은 여기에 있습니다.', '문이 열렸습니다.', '접수 담당자는 서류에 적힌 주소와 이름을 읽고 별도 보관된 사본을 가져와 책상 위에 놓았습니다.', '다음 날 답변을 받았습니다.'],
        'ja': ['書類が届きました。', '担当者は机の上に置いた書類を順番に読み、日付と名前も照合しました。', '写しはこちらです。', '扉が開きました。', '別の封筒には先週届いた書類の写しが入っていたため、担当者は日付を確かめてから元の封筒と一緒に保管しました。', '翌日に返事が届きました。'],
        'zh-hant': ['文件到了。', '承辦人逐頁讀完桌上的文件，再把日期與姓名逐一核對。', '副本在這裡。', '門開了。', '另一個信封內裝著上週收到的文件副本，承辦人確認日期之後將兩個信封一起收好，並在紀錄中寫明收件時間。', '隔天收到回覆。'],
        'th': ['เอกสารมาถึงแล้ว', 'เจ้าหน้าที่อ่านเอกสารบนโต๊ะและตรวจชื่อกับวันที่ในสำเนาอีกครั้ง', 'สำเนาอยู่ที่นี่', 'ประตูเปิดแล้ว', 'อีกซองหนึ่งมีสำเนาเอกสารที่ได้รับเมื่อสัปดาห์ก่อน เจ้าหน้าที่จึงตรวจวันที่แล้วเก็บซองทั้งสองไว้ด้วยกัน', 'วันต่อมาได้รับคำตอบ'],
    }
    for lang in original_metrics.SUPPORTED:
        for variant in ('plain', 'extended'):
            sentences = script_neutral.get(lang, synthetic)
            text = '\n\n'.join(sentences)
            if variant == 'extended':
                text += '\n\n## A heading\n\nA citation appears (Article 5).\n\n- A list item.\n\n## Sources\n\nIgnored text.'
            mapping = {original_multi.normalized(s): [s] for s in sentences} if lang == 'th' else None
            if lang == 'th' and variant == 'extended':
                mapping.update({original_multi.normalized(s): [s] for s in ('A citation appears (Article 5).', 'Ignored text.')})
            try:
                old = original_metrics.metrics(text, lang, mapping)
                new = metrics.metrics(text, lang, mapping)
                check(f'regression-{lang}-{variant}-metrics', new, old)
                check(f'regression-{lang}-{variant}-score', metrics.score(new, {}) if new else None,
                      original_metrics.score(old, {}) if old else None)
            except Exception as error:
                check(f'regression-{lang}-{variant}-exception', str(error), None)
        directory = next(key for key, value in original_metrics.DIRLANG.items() if value == lang)
        check(f'regression-{lang}-routing', metrics.guess_lang(f'/neutral/{directory}/neutral.md'), lang)

    # Source-tail positive and negative integration: exclusion must depend on an
    # entire standalone heading, never an arbitrary substantive prefix.
    fixture_data = json.loads((ROOT / 'neutral-fixtures.json').read_text())['fixtures']
    for lang in NEW:
        pos = next(f['text'] for f in fixture_data if f['locale'] == lang and f['kind'] == 'source_heading' and f['expected'])
        neg = next(f['text'] for f in fixture_data if f['locale'] == lang and f['kind'] == 'source_heading' and not f['expected'])
        text = 'First neutral paragraph.\n\n' + neg + '\n\nSecond neutral paragraph.\n\n' + pos + '\n\nStructural source tail.'
        paras, heads, items = metrics.body_blocks(text, lang)
        check(f'source-tail-integration-{lang}', paras, ['First neutral paragraph.', 'Second neutral paragraph.'])
        check(f'new-routing-{lang}', metrics.guess_lang(f'/neutral/columns-{lang}/neutral.md'), lang)

    # Check actual CLI exit semantics and ensure unsupported/invalid inputs are
    # explicitly unavailable, never a zero-failure measurement PASS.
    generated = ROOT / 'generated'
    generated.mkdir(exist_ok=True)
    env = dict(os.environ, PYTHONDONTWRITEBYTECODE='1')
    def cli(identifier, file, options, expected, contains=None):
        run = subprocess.run([sys.executable, str(candidate / 'variety_metrics.py'), 'check', str(file)] + options,
                             capture_output=True, text=True, env=env, timeout=30)
        check(identifier + '-exit', run.returncode, expected, run.stdout + run.stderr)
        if contains is not None:
            check(identifier + '-message', contains in run.stdout + run.stderr, True)

    short = generated / 'neutral-short.md'
    short.write_text('Neutral sentence.\n', encoding='utf-8')
    for lang in NEW:
        cli(f'cli-{lang}-short', short, ['--lang', lang], 2, 'too short')
    cli('cli-unsupported-language', short, ['--lang', 'zz'], 2, 'invalid choice')
    cli('cli-unknown-path', short, [], 2, 'cannot infer language')
    bad = generated / 'invalid.md'
    bad.write_bytes(b'\xff\xfe\xff')
    cli('cli-invalid-utf8', bad, ['--lang', 'nl'], 2, 'measurement unavailable')
    cli('cli-thai-map-missing', short, ['--lang', 'th'], 2, 'reviewed')
    check('original-tree-unchanged', manifest(ORIGINAL), before_original)
    check('candidate-tree-unchanged-during-run', manifest(candidate), before_candidate)
    counts = collections.Counter(record['status'] for record in records)
    output = {
        'reviewed_at_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'reviewer': '/root/measure_new_locales_review',
        'candidate_path': str(candidate), 'candidate_manifest': before_candidate,
        'original_path': str(ORIGINAL), 'original_manifest': before_original,
        'fixture_sha256': FIXTURE_SHA,
        'summary': dict(total=len(records), passed=counts['PASS'], failed=counts['FAIL']),
        'records': records,
    }
    args.out.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'output': str(args.out), **output['summary']}))
    for row in records:
        if row['status'] != 'PASS':
            print(json.dumps(row, ensure_ascii=False))
    return int(counts['FAIL'] > 0)

if __name__ == '__main__':
    raise SystemExit(main())
