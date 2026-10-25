from pathlib import Path
import hashlib
import json
import re
import subprocess
from datetime import datetime, timezone

ROOT = Path('/Users/son7/tseng-market-expansion-20261025')
REPO = ROOT / 'repo'
REVIEWS = ROOT / 'work/reviews'

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def read_json(path):
    return json.loads(path.read_text())

def readable(text):
    text = re.sub(r'(?<=[A-Za-z])(?=\d)', ' ', text)
    return re.sub(r'(?<=\d)(?=[A-Za-z])', ' ', text)

checks = read_json(REVIEWS / 'asia-final-current-checks.json')
content = read_json(REVIEWS / 'asia-final-evidence/review-content.json')
comparators = read_json(REVIEWS / 'asia-final-comparators.json')
expected_locale = {
    'vi': 'fea466bb8dc3c2f1582aa5ad418a8706b462097fd1be301d9ddeb7dd060f5da9',
    'id': '9c7a74d1f105f051826ce250b86b38d555a2f443d236229abbcd9723274af36d',
    'fil': 'd04c12eaf86a6322e9c5e33ecb8e7d688b8c1cc0f6d6c861e575499071fabe24',
}
method_path = ROOT / 'work/variety-review/review-final.json'
method_sha = 'f0cfcfea6e841dd0ed59df3b2727fd74bb236604d0991e124b88bceb12c3659c'
assert digest(method_path) == method_sha
method = read_json(method_path)
assert method['status'] == 'PASS'
assert method['per_locale']['fil']['status'] == 'PASS'
wrapper_path = ROOT / 'work/variety-candidate/variety_metrics.py'
wrapper_sha = '44c287ea5f6e26b694881418acebf4c9c115b87b2a965ea0c10a43fb1830e2e5'
assert digest(wrapper_path) == wrapper_sha
original_path = Path('/Users/son7/tseng-lanes-shared/variety/variety_metrics.py')
assert digest(original_path) == '69ea04deab5f7988be2eb10d93d2c6eaf75bd4db2de97f3e4cab7712183c6e38'
locale_reports = {}
for locale, sha in expected_locale.items():
    p = REVIEWS / f'{locale}-locale.json'
    assert digest(p) == sha, str(p)
    report = read_json(p)
    assert report['role'] == 'locale' and report['independentOfAuthor'] is True
    assert report['reviewer'] == f'/root/expand_locale_{locale}'
    assert report['reviewer'] != content['reviewer']
    locale_reports[locale] = report

checked_at = datetime.now(timezone.utc).isoformat()
head = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=REPO, text=True).strip()
records = []
for check in checks['records']:
    article = check['id']
    locale = check['locale']
    source = REPO / check['source_path']
    image = REPO / check['image_path']
    assert digest(source) == check['sha256'], f'Article changed: {article}'
    assert digest(image) == check['image_sha256'], f'Image changed: {article}'
    lr = next(x for x in locale_reports[locale]['records'] if x['source_path'] == check['source_path'])
    assert lr['sha256'] == check['sha256'] and lr['image_sha256'] == check['image_sha256']
    assert lr['verdict'] == 'PASS' and not lr['findings']
    assert check['caption_only_change_independently_verified']
    assert check['pre_caption_sha256'] == check['reverse_caption_sha256']
    assert check['visually_inspected_bytes_unchanged'] and check['source_unchanged_during_checks']
    assert check['bold_absent'] and check['internal_provenance'] and check['dates_consistent']
    runs = check['variety_runs']
    assert runs[-1]['exit_code'] == 0 and 'OK — no variety limit violated' in runs[-1]['stdout']
    if locale == 'fil':
        assert runs[0]['exit_code'] == 2 and runs[-1]['script_sha256'] == wrapper_sha
    else:
        assert len(runs) == 1
    detail = content['per_article'][str(article)]
    text = source.read_text()
    title = re.search(r'^title: "(.*)"$', text, re.M).group(1)
    rec = {
        'id': article,
        'locale': locale,
        'title': title,
        'source_path': check['source_path'],
        'sha256': check['sha256'],
        'source_mtime_utc': datetime.fromtimestamp(source.stat().st_mtime, timezone.utc).isoformat(),
        'checkedAt': checked_at,
        'verdict': 'PASS',
        'findings': [],
        'optional_style_findings': [],
        'locale_report': f'work/reviews/{locale}-locale.json',
        'locale_report_sha256': expected_locale[locale],
        'locale_reviewer': locale_reports[locale]['reviewer'],
        'locale_checkedAt': locale_reports[locale]['checkedAt'],
        'image_path': check['image_path'],
        'image_sha256': check['image_sha256'],
        'image_actually_inspected': True,
        'image_dimensions': check['dimensions'],
        'image_caption': check['caption'].strip('"'),
        'variety_command': runs[-1]['command'],
        'variety_exit_code': runs[-1]['exit_code'],
        'variety_script_sha256': runs[-1]['script_sha256'],
        'variety_stdout': runs[-1]['stdout'],
        'variety_stderr': runs[-1]['stderr'],
        'variety_measuredAt': check['checkedAt'],
        'original_variety_command': runs[0]['command'],
        'original_variety_exit_code': runs[0]['exit_code'],
        'checks_performed': readable(detail['checks']),
        'first_two_paragraph_deletion_review': readable(detail['opening']),
        'comparison_review': readable(detail['comparison']),
        'comparators': [
            {k: c[k] for k in ('path', 'sha256', 'published', 'title')}
            for c in comparators if f'columns-{locale}/' in c['path']
        ],
        'primary_sources': detail['sources'],
        'limitations': [readable(x) for x in detail['limitations']],
        'caption_only_change_independently_verified': True,
        'pre_caption_sha256': check['pre_caption_sha256'],
        'reverse_caption_sha256': check['reverse_caption_sha256'],
    }
    if locale == 'fil':
        rec['method_review'] = 'work/variety-review/review-final.json'
        rec['method_review_sha256'] = method_sha
        rec['limitations'].append('The shared checker returned unsupported exit 2. The recorded exit 0 is the independently approved task-local FIL extension with unchanged HARD thresholds; no shared installation or human-native certification is claimed.')
    records.append(rec)

evidence_paths = [
    'work/reviews/asia-final-current-checks.json',
    'work/reviews/asia-final-comparators.json',
    'work/reviews/asia-final-official-opens.json',
    'work/reviews/asia-final-official-opens-supplement.json',
    'work/reviews/asia-final-official-opens-supplement2.json',
    'work/reviews/asia-final-evidence/direct-fetch.json',
    'work/reviews/id-author-source-evidence.json',
    'work/reviews/fil-author-judgment-115-306.txt',
    'work/reviews/fil-author-source-opens.json',
    'work/reviews/vi-locale.md',
    'work/reviews/id-locale.md',
    'work/reviews/fil-locale.md',
    'work/research/sea-market.md',
    'work/research/sea-sources.json',
    'work/research/sea-research-corrections.json',
    'work/research/sea-artifact-hashes.json',
    'work/variety-review/review-final.json',
]
evidence = [{'path': p, 'sha256': digest(ROOT / p)} for p in evidence_paths]
section5 = 'Every final article was read in full, including metadata, FAQs, sources, alt and caption. Paragraph function, meaningful sentence-length variation, unnecessary contrast/questions, repeated paragraph openings, citation/claim/caveat loops, concrete endings, factual conditions and service-language boundaries were reviewed. No padding was added to meet a score; required legal distinctions and exceptions were retained. No unresolved MONOTONY or optional style finding remains. The FIL 927 formula-close heuristic is disclosed in the locale report and accepted after reading its concrete service-date task; the necessary consultation-language/retainer wording was retained.'
comparison_scope = 'The final reviewer independently inspected the actual openings, headings and substantive endings of the selected three recent same-locale comparators per locale, dated 2026-10-24; locale reviewers report complete comparator reading. The final reviewer also read VI 039 in full for FIL 926 overlap. These are snapshot comparisons, not a claim to have re-certified every existing article or every additional ARC article integrated into main during this review.'
image_review = 'All six actual 1536×1024 WebP files were displayed and inspected. Fictional still-life scenes fit the article: rental handover, graduate desk, caregiver pregnancy, restaurant versus care work, factory injury and court envelopes. No people, faces, readable documents, logos or flags were visible. Localized alt text matches the scenes; captions identify fiction. Final normalized captions were reread and reverse-substitution reproduced the prior reviewed full-file hashes, proving the final change was caption-only. Image bytes remained the inspected bytes.'

report = {
    'reviewer': content['reviewer'],
    'role': 'final',
    'independentOfAuthor': True,
    'independentOfLocaleReviewers': True,
    'independence': content['independence'],
    'checkedAt': checked_at,
    'review_date': content['review_date'],
    'repo_head_observed_at_final_binding': head,
    'scope': 'VI 922–923, ID 924–925, FIL 926–927 only. Manuscripts were read-only for this reviewer.',
    'verdict': 'PASS',
    'records': records,
    'unresolved_material_findings': [],
    'optional_style_findings': [],
    'resolved_findings': content['closed_findings'],
    'targeted_legal_repairs_successful': 2,
    'unsuccessful_targeted_legal_repair_passes': 0,
    'statutory_history_review': readable(content['statutory_history']),
    'market_review': readable(content['market']),
    'firm_service_review': content['service'],
    'section5_review': section5,
    'comparison_scope': comparison_scope,
    'image_review': image_review,
    'evidence': evidence,
    'limitations': [readable(x) for x in content['common_limits']],
    'publication_authority': False,
    'publication_or_live_readback_claimed': False,
    'manuscripts_mutated_by_reviewer': False,
}

md = [
    '# 동남아 6편 독립 최종 검수 — PASS',
    '',
    f'검수자: `{report["reviewer"]}` · 최종 파일 결속 시각: `{checked_at}` · 법률 확인일: `2026-10-25`.',
    '',
    'VI 922–923, ID 924–925, FIL 926–927의 현재 원고 6편 모두 PASS입니다. 미해결 법률·사실·문체 지적은 없습니다. 저자 및 별도 언어 검수자와 독립된 AI 검수 결과이며, 변호사 자격·사람 검수·게시 완료를 뜻하지 않습니다. 원고를 수정하거나 게시하지 않았습니다.',
    '',
    f'최종 결속 시점의 저장소 HEAD: `{head}`. 이 보고서는 아래 전체 파일 SHA에만 적용됩니다. 이후 본문·메타데이터·이미지 또는 언어 검수 보고서가 바뀌면 해당 부분을 다시 확인해야 합니다.',
    '',
    '## 원고별 결과와 근거',
    '',
]
for r in records:
    md.extend([
        f'### {r["id"]} · {r["locale"]} · PASS',
        '',
        r['title'],
        '',
        f'- 원고: `{r["source_path"]}`',
        f'- 전체 SHA-256: `{r["sha256"]}`',
        f'- 파일 수정 시각: `{r["source_mtime_utc"]}`',
        f'- 독립 언어 검수: `{r["locale_report"]}` · `{r["locale_reviewer"]}` · `{r["locale_checkedAt"]}`',
        f'- 언어 보고서 SHA-256: `{r["locale_report_sha256"]}`',
        f'- 실제 열람 이미지: `{r["image_path"]}` · SHA-256 `{r["image_sha256"]}`',
        f'- 최종 캡션: {r["image_caption"]}',
        '',
        '법률·사실 확인: ' + r['checks_performed'],
        '',
        '첫 두 문단 삭제 검토: ' + r['first_two_paragraph_deletion_review'],
        '',
        '비교 결과: ' + r['comparison_review'],
        '',
        '실제로 실행한 최종 문장 다양성 검사:',
        '',
        '```text',
        r['variety_command'],
        r['variety_stdout'].strip(),
        f'exit_code={r["variety_exit_code"]}',
        '```',
        '',
    ])
    if r['locale'] == 'fil':
        md.extend([
            'FIL의 원본 공유 검사는 미지원 exit 2였습니다. 위 exit 0은 별도 검증된 작업 전용 확장 결과입니다. 원본 실패를 PASS로 바꾸어 기록하지 않았습니다.',
            '',
            f'방법 검수: `{r["method_review"]}` · SHA `{r["method_review_sha256"]}`. 실제 실행 wrapper SHA: `{r["variety_script_sha256"]}`.',
            '',
        ])
    md.append('핵심 공식 근거: ' + ', '.join(f'[근거 {i+1}]({u})' for i,u in enumerate(r['primary_sources'])) + '.')
    md.append('')
    if r['limitations']:
        md.append('접근·검증 한계:')
        md.append('')
        md.extend('- ' + x for x in r['limitations'])
        md.append('')

md.extend(['## 수정 완료된 중요 지적', ''])
for f in report['resolved_findings']:
    md.extend([
        f'### {f["id"]} — 수정 완료',
        '',
        f'위치: `{f["file_line"]}` (지적 당시 행 번호).',
        '',
        '지적 당시 정확한 문장:',
        '',
        '> ' + f['exact_sentence'],
        '',
        readable(f['reason']) + f' [공식 근거]({f["source"]}).',
        '',
        '제안한 수정: ' + f['proposed_rewrite'],
        '',
        '법률 의미: ' + ('기존 결론을 유지하면서 적용 법률의 명칭을 명확히 했습니다.' if f['legal_meaning_preserved'] is True else readable(f['legal_meaning_preserved'])),
        '',
        '재검수: ' + readable(f['status']),
        '',
    ])
md.extend([
    '두 법률 지적 모두 첫 좁은 수정에서 해결됐습니다. 성공하지 못한 최종 법률 수정 라운드는 0회입니다. VI 922의 적용 범위 추가는 실질적 적용 결론을 좁히는 수정으로 기록했으며, 단순한 표현 교정으로 처리하지 않았습니다.',
    '',
    '## 현행법·시행일·자료 한계',
    '',
    report['statutory_history_review'],
    '',
    'MOJ가 표시한 편찬 기준일은 2026-10-16이었습니다. 검수 당일 현재 법문·연혁·시행 조항과 더 최근 MOL/WDA 자료를 대조했으며, 법 개정안이나 향후 시행 조항을 이미 시행된 규칙으로 사용하지 않았습니다. 반복 접근 실패와 실제 대체 열람 자료는 해당 원고 항목 및 원응답 증거에 구분했습니다.',
    '',
    'FIL 927의 2026-07-03 타이베이 지방법원 115年度抗字第306號 판결은 이 검수자의 실시간 재접속이 실패했습니다. 같은 작업에서 저자가 확보한 공식 웹 도구 응답의 전체 50행과 URL·메타데이터를 실제로 읽고, 적용 법률은 별도로 직접 열었습니다. 독립적인 판결 실시간 접속 성공이나 제3자 요약에 근거한 검증으로 표기하지 않습니다.',
    '',
    '## 언어·중복·이미지·서비스 검토',
    '',
    report['comparison_scope'],
    '',
    '실제로 비교한 스냅샷:',
    '',
])
for c in comparators:
    md.append(f'- `{c["path"]}` · 게시일 {c["published"].strip(chr(34))} · SHA `{c["sha256"]}`')
md.extend([
    '',
    report['section5_review'],
    '',
    report['image_review'],
    '',
    report['firm_service_review'],
    '',
    report['market_review'],
    '',
    '원고 6편 모두 bold가 없고 내부 `legal-ai-assistant` provenance가 유지됩니다. 인간 필자·인간 원어민 검수·외국 변호사 자격·보장된 결과·공개 AI footer를 추가하지 않았습니다. 인도네시아어 925의 임금 관련 내부 링크도 실제 대상 파일을 확인했습니다.',
    '',
    '## 증거 파일',
    '',
])
for e in evidence:
    md.append(f'- `{e["path"]}` · SHA-256 `{e["sha256"]}`')
md.extend([
    '',
    '## 최종 판정의 한계',
    '',
])
md.extend('- ' + x for x in report['limitations'])
md.extend(['', '게시·배포·공개 페이지 읽기·브라우저 시각 및 상호작용 검증은 이 보고서의 범위가 아닙니다. 최종 검수 원고 6편의 정확한 버전과 독립 언어 검수 증거를 상위 담당자에게 인계합니다.', ''])

for r in records:
    assert digest(REPO / r['source_path']) == r['sha256']
    assert digest(REPO / r['image_path']) == r['image_sha256']
    assert digest(ROOT / r['locale_report']) == r['locale_report_sha256']
for name, data in [('asia-final.json', json.dumps(report, ensure_ascii=False, indent=2) + '\n'), ('asia-final.md', '\n'.join(md))]:
    dest = REVIEWS / name
    tmp = dest.with_suffix(dest.suffix + '.tmp')
    tmp.write_text(data)
    tmp.replace(dest)
print(json.dumps({'verdict': 'PASS', 'articles': len(records), 'checkedAt': checked_at, 'head': head, 'reports': {name: digest(REVIEWS / name) for name in ['asia-final.json', 'asia-final.md']}}, ensure_ascii=False, indent=2))
