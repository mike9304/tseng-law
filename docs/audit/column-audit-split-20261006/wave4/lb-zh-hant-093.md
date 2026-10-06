# changes — 093 zh-hant (규칙 B, 판결 링크 반복 정리만)

- 원문: `/Users/son7/projects/tseng-law-audit-split-w4/src/content/columns-zh/093-taiwan-gas-station-tanker-reversing-beeper-liability.md`
- 출력: `/Users/son7/tseng-audit-split-1006/work/lb-zh-hant-093/draft.md`
- 프런트매터: lastmod "2026-10-03" → "2026-10-06" (published와 같거나 뒤). read_time·title·summary 그대로.
- 판결 링크 총수(`grep -o judgment.judicial.gov.tw | wc -l`): 원문 18 → draft 4. 바뀐 줄 수(`diff | grep -c ^>`): 20(lastmod 1줄 포함).

## 판결별

| 판결(법원,연,종류,번호,날짜) | 원문 출현 | 남긴 수 | 남긴 곳 | 짧은 괄호로 치환 | 통째로 지움 |
|---|---|---|---|---|---|
| KLDV,110,基簡,687,20220121 | 14 | 2 | 첫 인용 1(L20), 출처 목록 1(신규 추가) | 2 | 11 |
| KLDM,109,交易,100,20200820 | 4 | 2 | 첫 인용 1(L26), 출처 목록 1(신규 추가) | 1 | 2 |

## 줄별 처리 (원문 줄 번호)

- L20: 유지
- L22: 삭제
- L26: 삭제, 유지
- L28: 치환「（刑事判決）」
- L30: 치환「（民事、刑事判決）」, 삭제
- L34: 삭제
- L38: 삭제
- L42: 삭제
- L44: 삭제
- L48: 삭제
- L52: 삭제
- L54: 삭제
- L56: 치환「（民事判決）」
- L58: 삭제
- L62: 삭제, 삭제

## 추가한 資料來源 절 (리드 추가 지시)

- 위치: 원문 L76의 맺음 문단(검증·면책 문장) 바로 앞, 같은 제목 아래 목록 뒤에 그 문단들이 이어짐(188·194와 같은 배치). 본문 마지막 절 뒤.
- 항목은 이 파일의 판결 URL 전부(고유 URL 기준) 1건씩, 날짜 내림차순. 법원·案號·날짜는 이 파일의 기존 인용문에서 그대로 가져옴(법원은 파일 표기대로 약칭 유지, 확장하지 않음).
- 민사/형사 구분은 L22·L62의 기존 표기(「民事判決」「刑事判決」)를 그대로 씀.

  - 臺灣基隆地方法院基隆簡易庭110年度基簡字第687號民事判決（2022年1月21日）  ← `KLDV,110,基簡,687`
  - 臺灣基隆地方法院109年度交易字第100號刑事判決（2020年8月20日）  ← `KLDM,109,交易,100`

## 귀속 판단 기준·애매한 점

- 원문에 資料來源 목록·표가 없어 리드 추가 지시로 목록을 신설함(아래 절). 첫 인용 링크 문구가 案號가 아니라 쪽번호식 약칭(「民判二（一）、三（一）1、2」「刑判五㈡⒉」)이라 '풀 표기 유지' 조건에 해당하지 않아 약칭 링크 그대로 유지.
- 형사판결의 案號(109年度交易字第100號)는 L62 본문에서 처음 적히고 본문 링크는 L26(첫 인용)에만 남지만, 신설한 資料來源 목록이 案號·날짜·링크를 한 줄로 보여 줌.
- 같은 기륭지원의 민사·형사 두 판결이라 구분은 법원이 아니라 민사/형사. 글이 L22에서 민사판결을 본 판결로 규정하고 형사는 항상 「刑事判決」로 명시하므로, 「法院」「判決」만 있는 민사 링크는 통째 삭제, 형사 링크는 문단에 「刑事」가 없으면 「（刑事判決）」로 치환(L28), 민사+형사 동시 인용 괄호는 「（民事、刑事判決）」(L30), 문단에 법원·판결 표시가 전혀 없는 L56은 「（民事判決）」.

## 원문 URL 집합 == draft URL 집합 확인

```
diff <(grep -o 'https://judgment[^)]*' '/Users/son7/projects/tseng-law-audit-split-w4/src/content/columns-zh/093-taiwan-gas-station-tanker-reversing-beeper-liability.md' | sort -u) <(grep -o 'https://judgment[^)]*' '/Users/son7/tseng-audit-split-1006/work/lb-zh-hant-093/draft.md' | sort -u) && echo URL_SETS_IDENTICAL
URL_SETS_IDENTICAL
diff <(grep -o 'https://law.moj.gov.tw[^)]*' '/Users/son7/projects/tseng-law-audit-split-w4/src/content/columns-zh/093-taiwan-gas-station-tanker-reversing-beeper-liability.md') <(grep -o 'https://law.moj.gov.tw[^)]*' '/Users/son7/tseng-audit-split-1006/work/lb-zh-hant-093/draft.md') && echo LAW_LINKS_IDENTICAL
LAW_LINKS_IDENTICAL
```
