from pathlib import Path
from datetime import datetime
from zoneinfo import ZoneInfo
import hashlib, json, re

B = Path('/Users/son7/tseng-all-language-columns-20261025/batch04')
R = Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
D = B / 'release26'
sha = lambda data: hashlib.sha256(data).hexdigest()
inputs = {}

def read(path):
    data = path.read_bytes()
    inputs[str(path)] = sha(data)
    return data

delta_path = B / 'checks/release26-delta.json'
manifest_path = B / 'checks/release26-manifest.json'
delta = json.loads(read(delta_path))
manifest = json.loads(read(manifest_path))
assert inputs[str(delta_path)] == 'dc40a62a90f17addec1dcea846022777e95f4c61cf845112e4eb1ddca76fbb47'
assert inputs[str(manifest_path)] == '30b1ce64d193723052e52c113e9978a7ebc9730b2ae6cd853310ed2d78bdd8d1'
display = {
    'he': ('25 באוקטובר 2026', '26 באוקטובר 2026'),
    'bn': ('25 অক্টোবর 2026', '26 অক্টোবর 2026'),
    'ur': ('25 اکتوبر 2026', '26 اکتوبر 2026'),
    'fa': ('25 اکتبر 2026', '26 اکتبر 2026'),
    'my': ('2026 ခုနှစ် အောက်တိုဘာ 25 ရက်', '2026 ခုနှစ် အောက်တိုဘာ 26 ရက်'),
    'ta': ('25 அக்டோபர் 2026', '26 அக்டோபர் 2026'),
    'ne': ('25 अक्टोबर 2026', '26 अक्टोबर 2026'),
}
slugs = ['taiwan-arc-first-application', 'taiwan-visa-residence-work-study-family', 'taiwan-arc-renewal-changes-reentry']
expected_paths = {f'src/content/columns-{locale}/{num}-{slug}.md' for locale in display for num, slug in enumerate(slugs, 704)}
assert len(delta['rows']) == len(manifest) == 21
assert {row['file'] for row in delta['rows']} == expected_paths
manifest_map = {str(Path(row['file']).relative_to(R)): row for row in manifest}
assert set(manifest_map) == expected_paths
rows = []
for row in delta['rows']:
    locale, rel = row['locale'], row['file']
    backup_path = Path(row['backup'])
    assert backup_path == B / 'pre-release26' / f'columns-{locale}' / Path(rel).name
    old, new, repo = read(backup_path), read(B / rel), read(R / rel)
    review_path = Path(row['review_file'])
    assert review_path.parent == B / 'reviews'
    review = read(review_path)
    assert sha(old) == row['before_sha256']
    assert sha(new) == sha(repo) == row['after_sha256'] == manifest_map[rel]['sha256']
    assert manifest_map[rel]['locale'] == locale
    assert sha(review) == row['review_sha256']
    assert row['before_sha256'].encode() in review

    old_fm, old_body = old.split(b'---\n', 2)[1:]
    new_fm, new_body = new.split(b'---\n', 2)[1:]
    assert old.startswith(b'---\n') and new.startswith(b'---\n')
    assert old_body == new_body
    old_lines, new_lines = old.splitlines(keepends=True), new.splitlines(keepends=True)
    assert len(old_lines) == len(new_lines)
    changed = [(index + 1, before, after) for index, (before, after) in enumerate(zip(old_lines, new_lines)) if before != after]
    assert len(changed) == 3
    expected = {
        b'published': (b'published: "2026-10-25"\n', b'published: "2026-10-26"\n'),
        b'lastmod': (b'lastmod: "2026-10-25"\n', b'lastmod: "2026-10-26"\n'),
        b'date_display': tuple(f'date_display: "{value}"\n'.encode() for value in display[locale]),
    }
    actual = {before.split(b':', 1)[0]: (before, after) for _, before, after in changed}
    assert actual == expected
    assert {(item['old'], item['new']) for item in row['changes']} == {(before.decode().rstrip('\n'), after.decode().rstrip('\n')) for _, before, after in changed}
    # Reverse only the three actual changed lines in memory, independently of root's replacement implementation.
    restored = list(new_lines)
    for line_number, before, after in changed:
        assert restored[line_number - 1] == after
        restored[line_number - 1] = before
    restored = b''.join(restored)
    assert restored == old and sha(restored) == row['before_sha256']
    strip_dates = lambda fm: b''.join(line for line in fm.splitlines(keepends=True) if line.split(b':', 1)[0] not in expected)
    assert strip_dates(old_fm) == strip_dates(new_fm)
    rows.append({
        'locale': locale, 'file': rel, 'beforeSha256': sha(old), 'afterSha256': sha(new),
        'reverseSha256': sha(restored), 'review': str(review_path.relative_to(B)), 'reviewSha256': sha(review),
        'beforeHashPresentInReview': True, 'changedLineNumbers': [number for number, _, _ in changed],
        'exactlyThreeDateLines': True, 'bodyBytesUnchanged': True, 'otherFrontmatterIncludingFaqBytesUnchanged': True,
        'rEqualsStaging': True, 'backupEqualsExactReverse': True,
        'published': '2026-10-26', 'lastmod': '2026-10-26', 'dateDisplay': display[locale][1],
    })

for file, initial in inputs.items():
    assert sha(Path(file).read_bytes()) == initial, 'Input changed during review: ' + file
at = datetime.now(ZoneInfo('Asia/Seoul')).isoformat()
result = {'at': at, 'reviewer': 'column_deploy', 'scope': 'Independent metadata-only date reverse proof; not a new seven-language legal review or new source refresh', 'inputHashes': inputs, 'inputHashesUnchangedAtEnd': True, 'rows': rows, 'summary': {'files': 21, 'reverseMatches': 21, 'dateOnlyMatches': 21, 'unchangedBodies': 21, 'unchangedOtherFrontmatterAndFaq': 21, 'priorReviewHashBindings': 21, 'repoStagingMatches': 21, 'failures': 0}}
json_path = D / 'checks/date-change-review.json'
md_path = D / 'checks/date-change-review.md'
assert not json_path.exists() and not md_path.exists()
json_path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
lines = [
    '# B4 release26 날짜 변경 독립 확인', '',
    f'검수자: `column_deploy` AI. 실제 실행: `{at}`.', '',
    '판정: 21/21 일치, 오류 0. 보존 원본과 현재 staging·R를 직접 읽어 비교했고, 변경된 세 줄을 메모리에서 되돌리면 각 최종 독립 검수 당시의 원본 SHA가 정확히 복원된다. 원고·기존 검수 보고서·보존 원본은 수정하지 않았다.', '',
    '변경은 front matter의 `published`, `lastmod`, `date_display` 세 줄에서 2026-10-25를 2026-10-26으로 바꾼 것뿐이다. 각 파일의 실제 줄별 차이를 먼저 구한 뒤 허용된 키·값과 대조했다. 본문 및 나머지 front matter 전체가 바이트 단위로 동일하므로 FAQ·제목·요약·수치·법적 조건·이미지·캡션·출처도 그대로다. 실제 최초 발행일 조정이며, 본문의 24–25일 출처 확인을 26일 재조사로 바꾸지 않았다.', '',
    '각 보존 원본의 해시가 root 변경표의 before 값과 같고, 그 값이 해당 최종 독립 보고서 본문에 실제 존재함을 확인했다. 독립 보고서 자체의 해시도 변경표의 고정값과 같다. 새 staging·R·manifest·변경표 after 값은 모두 일치한다. 이는 변경 범위와 검수본 연결 확인이며, 이번 작업자가 다른 여섯 언어의 법률·원어 전체 검수를 새로 수행했다는 뜻은 아니다.', '',
    '## 고정 근거', '',
    f'- root 변경표: `checks/release26-delta.json` — `{inputs[str(delta_path)]}`',
    f'- root manifest: `checks/release26-manifest.json` — `{inputs[str(manifest_path)]}`',
    f'- 독립 실행 결과: `release26/checks/date-change-review.json` — `{sha(json_path.read_bytes())}`',
    '- 재현 스크립트: `release26/verification/date-change-proof.py` (증거 파일이 있으면 덮어쓰기를 거부한다).', '',
    '## 현지 표시 날짜', '', '| 언어 | 이전 | 현재 |', '|---|---|---|',
]
lines += [f'| {locale} | {before} | {after} |' for locale, (before, after) in display.items()]
lines += ['', '## 21편의 검수본 연결', '', '| 원고 | 보존 원본 = 역복원 SHA-256 | 현재 staging = R = manifest SHA-256 |', '|---|---|---|']
lines += [f"| {row['locale']} {Path(row['file']).name[:3]} | `{row['beforeSha256']}` | `{row['afterSha256']}` |" for row in rows]
lines += ['', '종료 시 변경표·manifest·보존 원본·staging·R·기존 독립 보고서의 모든 입력 SHA를 다시 계산해 시작값과 같음을 확인했다. 최종 빌드와 브라우저·RTL·패키지 검증은 root의 빌드 완료 알림 후 별도로 실행한다.', '']
md_path.write_text('\n'.join(lines))
print(json.dumps({'summary': result['summary'], 'report': str(md_path), 'reportSha256': sha(md_path.read_bytes()), 'evidenceSha256': sha(json_path.read_bytes()), 'at': at}, ensure_ascii=False, indent=2))
