# changes — lb-en-194  (WO-LINKB 규칙 B)
원문: `~/projects/tseng-law-audit-split-w4/src/content/columns-en/194-taiwan-road-rage-freeway-chase-own-dashcam-too.md` · 출력: `~/tseng-audit-split-1006/work/lb-en-194/draft.md`
변경 줄은 아래 목록뿐(원문과 diff로 대조). 프런트매터는 lastmod만 "2026-10-06"으로 갱신(published보다 앞서지 않음). read_time·title·summary는 그대로.

## 판결별
- TPHM,114,上訴,5220 · 원문 출현 14 → 3 (남긴 곳: 첫 인용 1, 표 1, 출처 1) · 짧은 괄호로 바꾼 링크 1 · 통째로 지운 링크 10
- PCDM,113,訴,756 · 원문 출현 9 → 3 (남긴 곳: 첫 인용 1, 표 1, 출처 1) · 짧은 괄호로 바꾼 링크 1 · 통째로 지운 링크 5
- TPSM,115,台上,2709 · 원문 출현 9 → 3 (남긴 곳: 첫 인용 1, 표 1, 출처 1) · 짧은 괄호로 바꾼 링크 1 · 통째로 지운 링크 5
- 짧은 괄호 문구 삽입 총 2곳 (링크 있는 괄호가 아니라 링크 없는 문구)

## 줄별 결정 (원문 줄 번호 = draft 줄 번호, 줄 수 불변)
- L22: 유지 — 첫 인용(고등법원·1심)
- L24: 유지 — 첫 인용(최고법원)
- L24: 고등법원 링크만 삭제, 최고법원 링크는 첫 인용이라 유지(괄호는 링크 1개로 축소)
- L28: 삭제: 「The High Court inspected…」
- L30: 삭제: 「The trial court found…」
- L32: 삭제: 「The High Court… The Supreme Court…」
- L34: 삭제: 「The High Court said…」
- L38: → (Supreme Court judgment): 문단에 법원 표시 없음(상고 주장 서술)
- L40: 삭제: 「The High Court’s inspection… The Supreme Court accepted…」
- L42: 삭제: 「The High Court found…」
- L44: 삭제: 「The courts found… The Supreme Court found…」
- L48: 삭제: 「The trial court described…」
- L50: 삭제: 「The trial court explained…」
- L52: 삭제: 「The High Court rejected… the trial court」
- L56: 삭제: 「The courts considered…」(총칭)
- L64: 삭제: 「These judgments do not establish… the criminal decisions」(총칭)
- L66: 삭제: 「the Supreme Court decision… The Supreme Court applied」
- L68: → (first-instance and High Court judgments): 문단에 법원 표시 없음
- 표 행·출처 목록: 링크가 있는 곳은 그대로(위 「남긴 곳」 참조).

## 판단 메모
- L24: 한 괄호에 고등법원·최고법원 링크가 같이 있었고 최고법원은 여기가 첫 인용이라 그 링크만 남김.
- 표(L60–62) 결과 셀 링크 3건은 審級 표 각 행이라 그대로.

## 원문 URL 집합 == draft URL 집합
명령(bash):
```
diff <(grep -o 'https://judgment.judicial.gov.tw[^) ]*' ORIG | sort -u) <(grep -o 'https://judgment.judicial.gov.tw[^) ]*' DRAFT | sort -u) && echo 'URL SET IDENTICAL'
```
출력:
```
URL SET IDENTICAL
orig unique: 3  draft unique: 3
```
변경된 줄 수(diff `>`): 17
