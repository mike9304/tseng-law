# changes — ja 188 (WO-LINKB 규칙 B)

원문: src/content/columns-ja/188-taiwan-road-rage-started-did-not-matter-driver-blocked.md (읽기만). 출력: draft.md. 본문 줄 수 원문 89 → draft 89 (줄 번호 동일).

## 판결별

- SLDM,115,易,383 (臺灣士林地方法院 115年度易字第383號, 2026-06-26)
  - 원문 출현 24 → 남긴 수 2 (L20 첫 인용, L78 출처 목록)
  - 짧은 괄호로 바꾼 수 0
  - 통째로 지운 수 22 (L22, L24, L28, L30, L32, L34, L36, L38, L42, L44, L46, L48, L50, L52, L56, L58, L60, L62, L66, L68, L70, L72)

합계: 판결 링크 24 → 2 (짧은 괄호 0, 통째로 삭제 22). ※ 짧은 괄호 건수는 링크 1개 기준(두 판결 병기 괄호는 링크 2개로 세므로 괄호 수와 다를 수 있음).

## 메모(판단 근거·판단 필요)

1. 1건의 판결만 다룬 글이라 본문 문단의 「裁判所は／判決は」가 곧 그 판결이다. 괄호 없이 문단 끝에 붙은 링크(「…です。[링크]」)와 「、[링크]」로 법령 링크 뒤에 붙은 것도 같은 판결 링크 반복으로 보고 지웠다. 짧은 괄호 치환 0.
2. 블록 인용(>)이 없어 「블록 인용 직후」 유지분 없음. 유지 2 = 첫 인용(L20) + 出典 목록(L78).

## 프런트매터
- lastmod만 "2026-10-06"으로(published ≤ 2026-10-06). read_time·title·summary 등 나머지 키 변경 없음(trimcheck: front-matter changed 항목 확인).

## 원문 URL 집합 == draft URL 집합 확인

```
$ diff <(grep -o 'https\?://[^)]*' ~/projects/tseng-law-audit-split-w4/src/content/columns-ja/188-taiwan-road-rage-started-did-not-matter-driver-blocked.md | sort -u) <(grep -o 'https\?://[^)]*' ~/tseng-audit-split-1006/work/lb-ja-188/draft.md | sort -u); echo "exit=$?"
exit=0
       6
       6   # 마지막 두 줄 = 원문/draft 고유 URL 수
```

→ URL 집합 일치(diff 출력 없음, exit=0).
