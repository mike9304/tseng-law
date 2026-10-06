# changes — 194 zh-hant (규칙 B, 판결 링크 반복 정리만)

- 원문: `/Users/son7/projects/tseng-law-audit-split-w4/src/content/columns-zh/194-taiwan-road-rage-freeway-chase-own-dashcam-too.md`
- 출력: `/Users/son7/tseng-audit-split-1006/work/lb-zh-hant-194/draft.md`
- 프런트매터: lastmod "2026-10-04" → "2026-10-06" (published와 같거나 뒤). read_time·title·summary 그대로.
- 판결 링크 총수(`grep -o judgment.judicial.gov.tw | wc -l`): 원문 28 → draft 9. 바뀐 줄 수(`diff | grep -c ^>`): 15(lastmod 1줄 포함).

## 판결별

| 판결(법원,연,종류,번호,날짜) | 원문 출현 | 남긴 수 | 남긴 곳 | 짧은 괄호로 치환 | 통째로 지움 |
|---|---|---|---|---|---|
| PCDM,113,訴,756,20250430 | 6 | 3 | 첫 인용 1(L22), 표 근거 행 1, 출처 목록 1 | 0 | 3 |
| TPHM,114,上訴,5220,20260225 | 14 | 3 | 첫 인용 1(L24), 표 근거 행 1, 출처 목록 1 | 2 | 9 |
| TPSM,115,台上,2709,20260827 | 8 | 3 | 첫 인용 1(L32), 표 근거 행 1, 출처 목록 1 | 1 | 4 |

## 줄별 처리 (원문 줄 번호)

- L22: 유지
- L24: 유지
- L28: 삭제
- L30: 삭제, 삭제
- L32: 유지
- L34: 삭제
- L38: 치환「（最高法院判決）」
- L40: 삭제
- L42: 치환「（高院、最高法院判決）」, 삭제
- L44: 삭제
- L48: 삭제, 삭제, 삭제
- L50: 삭제
- L52: 삭제, 삭제
- L56: 삭제
- L64: 유지, 유지, 유지
- L68: 삭제
- L70: 삭제
- L72: 치환「（高院判決）」
- L76: 유지
- L77: 유지
- L78: 유지

## 귀속 판단 기준·애매한 점

- L64 「表列結果依據：」 행(표 바로 아래 세 판결 링크)은 이 글에서 표의 인용 허브라 규칙 B의 '표 행' 유지로 봄(표 자체 셀에는 링크 없음). 이를 삭제하라는 판단이면 PCDM·TPHM·TPSM 각 1개씩 더 줄어듦.
- 귀속 판정: 문단에 一審/高院/最高法院 중 하나라도 명시돼 있으면 괄호 통째 삭제, 「法院」만 있으면 짧은 괄호로 치환. L42는 두 판결을 함께 인용한 괄호라 「（高院、最高法院判決）」(WO 예시 「（一審、二審判決）」의 같은 꼴). L48 첫 괄호(高院+最高法院)는 같은 문단에 「高院」이 있어 통째 삭제 — 단 첫 문장의 최고법원 귀속은 문단에서 사라짐(애매한 판단).

## 원문 URL 집합 == draft URL 집합 확인

```
diff <(grep -o 'https://judgment[^)]*' '/Users/son7/projects/tseng-law-audit-split-w4/src/content/columns-zh/194-taiwan-road-rage-freeway-chase-own-dashcam-too.md' | sort -u) <(grep -o 'https://judgment[^)]*' '/Users/son7/tseng-audit-split-1006/work/lb-zh-hant-194/draft.md' | sort -u) && echo URL_SETS_IDENTICAL
URL_SETS_IDENTICAL
diff <(grep -o 'https://law.moj.gov.tw[^)]*' '/Users/son7/projects/tseng-law-audit-split-w4/src/content/columns-zh/194-taiwan-road-rage-freeway-chase-own-dashcam-too.md') <(grep -o 'https://law.moj.gov.tw[^)]*' '/Users/son7/tseng-audit-split-1006/work/lb-zh-hant-194/draft.md') && echo LAW_LINKS_IDENTICAL
LAW_LINKS_IDENTICAL
```
