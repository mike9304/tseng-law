# changes — 188 zh-hant (규칙 B, 판결 링크 반복 정리만)

- 원문: `/Users/son7/projects/tseng-law-audit-split-w4/src/content/columns-zh/188-taiwan-road-rage-started-did-not-matter-driver-blocked.md`
- 출력: `/Users/son7/tseng-audit-split-1006/work/lb-zh-hant-188/draft.md`
- 프런트매터: lastmod "2026-10-04" → "2026-10-06" (published와 같거나 뒤). read_time·title·summary 그대로.
- 판결 링크 총수(`grep -o judgment.judicial.gov.tw | wc -l`): 원문 22 → draft 2. 바뀐 줄 수(`diff | grep -c ^>`): 21(lastmod 1줄 포함).

## 판결별

| 판결(법원,연,종류,번호,날짜) | 원문 출현 | 남긴 수 | 남긴 곳 | 짧은 괄호로 치환 | 통째로 지움 |
|---|---|---|---|---|---|
| SLDM,115,易,383,20260626 | 22 | 2 | 첫 인용 1(L22), 출처 목록 1 | 2 | 18 |

## 줄별 처리 (원문 줄 번호)

- L22: 유지
- L24: 삭제
- L28: 치환「（一審判決）」
- L30: 삭제
- L34: 삭제
- L38: 삭제
- L40: 삭제
- L42: 삭제
- L44: 삭제
- L48: 삭제
- L50: 삭제
- L52: 치환「（一審判決）」
- L54: 삭제
- L58: 삭제
- L60: 삭제
- L70: 삭제
- L72: 삭제
- L74: 삭제
- L78: 삭제
- L80: 삭제
- L82: 삭제
- L88: 유지

## 귀속 판단 기준·애매한 점

- 이 파일은 판결이 1건뿐이라 문단에 「法院」「判決」「士林地院」 중 하나가 있으면 귀속이 이미 있는 것으로 보고 괄호를 통째로 지움. L28·L52는 문단에 법원·판결을 가리키는 말이 전혀 없어 「（一審判決）」로 치환.
- 표(L64–68)에는 링크가 없고 출처 목록(L88)이 유일한 목록 링크라 유지.

## 원문 URL 집합 == draft URL 집합 확인

```
diff <(grep -o 'https://judgment[^)]*' '/Users/son7/projects/tseng-law-audit-split-w4/src/content/columns-zh/188-taiwan-road-rage-started-did-not-matter-driver-blocked.md' | sort -u) <(grep -o 'https://judgment[^)]*' '/Users/son7/tseng-audit-split-1006/work/lb-zh-hant-188/draft.md' | sort -u) && echo URL_SETS_IDENTICAL
URL_SETS_IDENTICAL
diff <(grep -o 'https://law.moj.gov.tw[^)]*' '/Users/son7/projects/tseng-law-audit-split-w4/src/content/columns-zh/188-taiwan-road-rage-started-did-not-matter-driver-blocked.md') <(grep -o 'https://law.moj.gov.tw[^)]*' '/Users/son7/tseng-audit-split-1006/work/lb-zh-hant-188/draft.md') && echo LAW_LINKS_IDENTICAL
LAW_LINKS_IDENTICAL
```
