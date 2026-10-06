# changes — 100 zh-hant (규칙 B, 판결 링크 반복 정리만)

- 원문: `/Users/son7/projects/tseng-law-audit-split-w4/src/content/columns-zh/100-taiwan-lowered-height-gantry-state-compensation-driver-fault.md`
- 출력: `/Users/son7/tseng-audit-split-1006/work/lb-zh-hant-100/draft.md`
- 프런트매터: lastmod "2026-10-03" → "2026-10-06" (published와 같거나 뒤). read_time·title·summary 그대로.
- 판결 링크 총수(`grep -o judgment.judicial.gov.tw | wc -l`): 원문 15 → draft 8. 바뀐 줄 수(`diff | grep -c ^>`): 18(lastmod 1줄 포함).

## 판결별

| 판결(법원,연,종류,번호,날짜) | 원문 출현 | 남긴 수 | 남긴 곳 | 짧은 괄호로 치환 | 통째로 지움 |
|---|---|---|---|---|---|
| TPHV,112,上國更一,4,20240529 | 10 | 2 | 첫 인용 1(L22), 출처 목록 1(신규 추가) | 5 | 4 |
| TPSV,111,台上,1715,20230523 | 3 | 2 | 첫 인용 1(L32), 출처 목록 1(신규 추가) | 0 | 2 |
| TPHV,112,上國更一,4,20240531 | 1 | 2 | 첫 인용 1(L50), 출처 목록 1(신규 추가) | 0 | 0 |
| TYDV,113,司聲,456,20240930 | 1 | 2 | 첫 인용 1(L52), 출처 목록 1(신규 추가) | 0 | 0 |

## 줄별 처리 (원문 줄 번호)

- L22: 유지
- L26: 치환「（高院判決）」
- L28: 치환「（高院判決）」
- L32: 유지, 삭제
- L36: 삭제
- L38: 치환「（高院判決）」
- L40: 삭제
- L42: 삭제
- L46: 치환「（高院判決）」
- L48: 치환「（高院判決）」
- L50: 삭제, 삭제, 유지
- L52: 유지

## 추가한 資料來源 절 (리드 추가 지시)

- 위치: 원문 L65의 맺음 문단(검증·면책 문장) 바로 앞, 같은 제목 아래 목록 뒤에 그 문단들이 이어짐(188·194와 같은 배치). 본문 마지막 절 뒤.
- 항목은 이 파일의 판결 URL 전부(고유 URL 기준) 1건씩, 날짜 내림차순. 법원·案號·날짜는 이 파일의 기존 인용문에서 그대로 가져옴(법원은 파일 표기대로 약칭 유지, 확장하지 않음).
- 날짜 출처: 更審判決 2024年5月29日·最高法院 2023年5月23日은 L50 본문, 更正裁定 2024年5月31日은 L50 링크 문구, 費用裁定 2024年9月30日은 L52 「同年9月30日」(앞 문장 맥락상 2024년; URL 끝 날짜 20240930과 일치).
- 更正裁定 URL(…20240531,2)은 案號가 更審判決과 같고(URL 식별자) 날짜·종류가 달라 별개 항목으로 적음.

  - 桃園地院113年度司聲字第456號裁定（2024年9月30日）  ← `TYDV,113,司聲,456`
  - 高院112年度上國更一字第4號更正裁定（2024年5月31日）  ← `TPHV,112,上國更一,4,20240531`
  - 高院112年度上國更一字第4號判決（2024年5月29日）  ← `TPHV,112,上國更一,4,20240529`
  - 最高法院111年度台上字第1715號判決（2023年5月23日）  ← `TPSV,111,台上,1715`

## 귀속 판단 기준·애매한 점

- 원문에 資料來源 목록·표가 없어 리드 추가 지시로 목록을 신설함(아래 절). 첫 인용 L22의 링크 문구(「高院112年度上國更一字第4號判決，事實及理由…」)에는 날짜가 없으나 그대로 유지. URL 4개: 更審判決 20240529, 最高法院 判決 20230523, 更正裁定 20240531, 費用裁定 20240930 — 앞의 둘 중 20240529와 20240531은 案號가 같고 날짜가 달라 별개 URL로 셈.
- 문단에 「更審法院」「最高法院」이 있으면 통째 삭제, 「法院」만 있는 L26·L28·L38·L46·L48은 「（高院判決）」(첫 인용 문구가 「高院112年度上國更一字第4號判決」이고 WO 예시 꼴을 따름; 본문은 「更審判決」라고 부르므로 「（更審判決）」가 더 맞다고 보면 일괄 치환 가능). L50은 더 앞 첫 인용이 있는 최고법원·更審 링크를 지우고 更正裁定 링크만 유지.

## 원문 URL 집합 == draft URL 집합 확인

```
diff <(grep -o 'https://judgment[^)]*' '/Users/son7/projects/tseng-law-audit-split-w4/src/content/columns-zh/100-taiwan-lowered-height-gantry-state-compensation-driver-fault.md' | sort -u) <(grep -o 'https://judgment[^)]*' '/Users/son7/tseng-audit-split-1006/work/lb-zh-hant-100/draft.md' | sort -u) && echo URL_SETS_IDENTICAL
URL_SETS_IDENTICAL
diff <(grep -o 'https://law.moj.gov.tw[^)]*' '/Users/son7/projects/tseng-law-audit-split-w4/src/content/columns-zh/100-taiwan-lowered-height-gantry-state-compensation-driver-fault.md') <(grep -o 'https://law.moj.gov.tw[^)]*' '/Users/son7/tseng-audit-split-1006/work/lb-zh-hant-100/draft.md') && echo LAW_LINKS_IDENTICAL
LAW_LINKS_IDENTICAL
```
