# changes — lb-en-099  (WO-LINKB 규칙 B)
원문: `~/projects/tseng-law-audit-split-w4/src/content/columns-en/099-taiwan-road-rage-freeway-cut-in-sentence-reduced.md` · 출력: `~/tseng-audit-split-1006/work/lb-en-099/draft.md`
변경 줄은 아래 목록뿐(원문과 diff로 대조). 프런트매터는 lastmod만 "2026-10-06"으로 갱신(published보다 앞서지 않음). read_time·title·summary는 그대로.

## 판결별
- PCDM,113,審訴,716 · 원문 출현 17 → 4 (남긴 곳: 첫 인용 1, 표 2, 출처 1) · 짧은 괄호로 바꾼 링크 3 · 통째로 지운 링크 10
- TPHM,114,上訴,5567 · 원문 출현 21 → 5 (남긴 곳: 첫 인용 1, 블록 인용 직후 2, 표 1, 출처 1) · 짧은 괄호로 바꾼 링크 4 · 통째로 지운 링크 12
- 짧은 괄호 문구 삽입 총 5곳 (링크 있는 괄호가 아니라 링크 없는 문구)

## 줄별 결정 (원문 줄 번호 = draft 줄 번호, 줄 수 불변)
- L21: 유지 — 첫 인용(두 판결 모두)
- L37: 유지 — 블록 인용 직후(고등법원)
- L67: 유지 — 블록 인용 직후(고등법원)
- L23: → (first-instance and High Court judgments): 문단에 법원 표시 없음
- L25: 삭제: 문단에 「The High Court later replaced…」「Both judgments record…」
- L29: 삭제: 「The first-instance judgment adopted…」
- L39: → (High Court judgment): 문단에 「The court」뿐(어느 판결인지 불명)
- L41: 삭제: 「The High Court left…」
- L43: 삭제: 「The judgments do not say…」(두 판결 총칭)
- L47: → (first-instance judgment): 문단에 법원 표시 없음, 기소·죄명 서술은 1심 판결 기재
- L49: 삭제: 「In the New Taipei District Court… it convicted」
- L53: 삭제: 「The High Court therefore reviewed…」
- L55: → (High Court judgment): 문단에 법원 표시 없음
- L59: 삭제: 「The High Court started from…」
- L69: 삭제: 「The first court… The High Court found…」
- L71: 삭제: 「the first court’s list」 등 법원 명시
- L73: 삭제: 「Both courts chose the lowest rate」
- L83: 삭제: 「The High Court did not revisit… Neither judgment mentions…」
- L85: 삭제 2건: 「the judgments do not say」「Neither court applied it」
- L87: 삭제: 「The High Court’s judgment ends…」
- L91: 삭제: 「the High Court … what the court counted」
- L93: → (first-instance and High Court judgments): 문단에 법원 표시 없음
- 표 행·출처 목록: 링크가 있는 곳은 그대로(위 「남긴 곳」 참조).

## 판단 메모
- 표(L77–79)의 링크 3건·출처 2건·블록 인용 직후 2건(L37, L67)은 그대로.

## 원문 URL 집합 == draft URL 집합
명령(bash):
```
diff <(grep -o 'https://judgment.judicial.gov.tw[^) ]*' ORIG | sort -u) <(grep -o 'https://judgment.judicial.gov.tw[^) ]*' DRAFT | sort -u) && echo 'URL SET IDENTICAL'
```
출력:
```
URL SET IDENTICAL
orig unique: 2  draft unique: 2
```
변경된 줄 수(diff `>`): 20
