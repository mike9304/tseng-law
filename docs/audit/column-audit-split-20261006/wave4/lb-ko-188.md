# changes — ko 188 (WO-LINKB 규칙 B)

원문: src/content/columns/188-taiwan-road-rage-started-did-not-matter-driver-blocked.md (읽기만). 출력: draft.md. 본문 줄 수 원문 107 → draft 107 (줄 번호 동일).

## 판결별

- SLDM,115,易,383 (臺灣士林地方法院 115年度易字第383號, 2026-06-26)
  - 원문 출현 13 → 남긴 수 4 (L20 첫 인용, L32 블록 인용(L30) 직후, L44 블록 인용(L40) 뒤 첫 인용(L42 해설 문단 다음, 메모 2), L94 출처 목록)
  - 짧은 괄호로 바꾼 수 0
  - 통째로 지운 수 9 (L34, L54, L60, L62, L64, L78, L80, L82, L88)

합계: 판결 링크 13 → 4 (짧은 괄호 0, 통째로 삭제 9). ※ 짧은 괄호 건수는 링크 1개 기준(두 판결 병기 괄호는 링크 2개로 세므로 괄호 수와 다를 수 있음).

## 메모(판단 근거·판단 필요)

1. 1건의 판결만 다룬 글이라 본문 문단의 「법원은／판결은」가 곧 그 판결이다. 짧은 괄호 치환 0.
2. 블록 인용(>) 2개(L30, L40). L32는 L30 인용 바로 뒤 문단의 괄호라 유지. L40 인용은 L42 해설 문단에 링크가 없고, 그 인용 뒤 첫 인용이 L44라 이를 「블록 인용 직후 1회」로 유지했다(두 문단 뒤라 판단 필요). L44를 지우면 본문 유지는 첫 인용 + L32 + 출처 목록 3곳이 된다.

## 프런트매터
- lastmod만 "2026-10-06"으로(published ≤ 2026-10-06). read_time·title·summary 등 나머지 키 변경 없음(trimcheck: front-matter changed 항목 확인).

## 원문 URL 집합 == draft URL 집합 확인

```
$ diff <(grep -o 'https\?://[^)]*' ~/projects/tseng-law-audit-split-w4/src/content/columns/188-taiwan-road-rage-started-did-not-matter-driver-blocked.md | sort -u) <(grep -o 'https\?://[^)]*' ~/tseng-audit-split-1006/work/lb-ko-188/draft.md | sort -u); echo "exit=$?"
exit=0
       8
       8   # 마지막 두 줄 = 원문/draft 고유 URL 수
```

→ URL 집합 일치(diff 출력 없음, exit=0).
