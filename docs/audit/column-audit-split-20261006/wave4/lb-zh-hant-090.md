# changes — 090 zh-hant (규칙 B, 판결 링크 반복 정리만)

- 원문: `/Users/son7/projects/tseng-law-audit-split-w4/src/content/columns-zh/090-green-light-red-light-pedestrian-third-person.md`
- 출력: `/Users/son7/tseng-audit-split-1006/work/lb-zh-hant-090/draft.md`
- 프런트매터: lastmod "2026-10-03" → "2026-10-06" (published와 같거나 뒤). read_time·title·summary 그대로.
- 판결 링크 총수(`grep -o judgment.judicial.gov.tw | wc -l`): 원문 17 → draft 6. 바뀐 줄 수(`diff | grep -c ^>`): 19(lastmod 1줄 포함).

## 판결별

| 판결(법원,연,종류,번호,날짜) | 원문 출현 | 남긴 수 | 남긴 곳 | 짧은 괄호로 치환 | 통째로 지움 |
|---|---|---|---|---|---|
| TNHM,112,交上訴,423,20231108 | 11 | 2 | 첫 인용 1(L22), 출처 목록 1(신규 추가) | 4 | 6 |
| TPSM,113,台上,756,20240418 | 5 | 2 | 첫 인용 1(L26), 출처 목록 1(신규 추가) | 1 | 3 |
| TNDM,110,交易,581,20230112 | 1 | 2 | 첫 인용 1(L44), 출처 목록 1(신규 추가) | 0 | 0 |

## 줄별 처리 (원문 줄 번호)

- L22: 유지
- L24: 삭제
- L26: 삭제, 유지
- L28: 삭제, 삭제
- L30: 치환「（二審判決）」
- L32: 치환「（二審判決）」
- L34: 치환「（二審判決）」
- L36: 치환「（二審判決）」
- L38: 치환「（最高法院判決）」
- L40: 삭제
- L42: 삭제
- L44: 유지, 삭제
- L46: 삭제
- L48: 삭제

## 추가한 資料來源 절 (리드 추가 지시)

- 위치: 원문 L59의 맺음 문단(검증·면책 문장) 바로 앞, 같은 제목 아래 목록 뒤에 그 문단들이 이어짐(188·194와 같은 배치). 본문 마지막 절 뒤.
- 항목은 이 파일의 판결 URL 전부(고유 URL 기준) 1건씩, 날짜 내림차순. 법원·案號·날짜는 이 파일의 기존 인용문에서 그대로 가져옴(법원은 파일 표기대로 약칭 유지, 확장하지 않음).
- 「刑事判決」은 L42 「這三份刑事判決」에 근거. 법원명은 파일 표기(「臺南高分院」「臺南地院」)대로.

  - 最高法院113年度台上字第756號刑事判決（2024年4月18日）  ← `TPSM,113,台上,756`
  - 臺南高分院112年度交上訴字第423號刑事判決（2023年11月8日）  ← `TNHM,112,交上訴,423`
  - 臺南地院110年度交易字第581號刑事判決（2023年1月12日）  ← `TNDM,110,交易,581`

## 귀속 판단 기준·애매한 점

- 원문에 資料來源 목록·표가 없어 리드 추가 지시로 목록을 신설함(아래 절). 본문 첫 인용(TNHM L22, TPSM L26, TNDM L44)은 법원+案號+날짜를 모두 담은 풀 표기라 그대로 유지(지시 b).
- 글이 二審(臺南高分院)이라고 부르므로 짧은 괄호도 「（二審判決）」. 기존 괄호 「（[…](url)）」 안의 링크를 글자로만 바꿈(L30·L32·L34·L36), L38은 법령 링크와 같은 괄호 안에 「；最高法院判決」로 남김.
- 애매함: L30·L32·L34·L36 네 문단이 연속으로 「（二審判決）」가 됨(문단마다 「法院」만 있고 一審/二審/最高法院 중 어느 쪽인지는 괄호가 유일한 표시). 리듬이 거슬리면 L30 한 곳만 두고 나머지를 지워도 되나, 그건 WO 밖의 판단이라 하지 않음.

## 원문 URL 집합 == draft URL 집합 확인

```
diff <(grep -o 'https://judgment[^)]*' '/Users/son7/projects/tseng-law-audit-split-w4/src/content/columns-zh/090-green-light-red-light-pedestrian-third-person.md' | sort -u) <(grep -o 'https://judgment[^)]*' '/Users/son7/tseng-audit-split-1006/work/lb-zh-hant-090/draft.md' | sort -u) && echo URL_SETS_IDENTICAL
URL_SETS_IDENTICAL
diff <(grep -o 'https://law.moj.gov.tw[^)]*' '/Users/son7/projects/tseng-law-audit-split-w4/src/content/columns-zh/090-green-light-red-light-pedestrian-third-person.md') <(grep -o 'https://law.moj.gov.tw[^)]*' '/Users/son7/tseng-audit-split-1006/work/lb-zh-hant-090/draft.md') && echo LAW_LINKS_IDENTICAL
LAW_LINKS_IDENTICAL
```
