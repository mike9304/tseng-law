# changes — lb-en-201  (WO-LINKB 규칙 B)
원문: `~/projects/tseng-law-audit-split-w4/src/content/columns-en/201-taiwan-road-rage-52-seconds-subtracted-case.md` · 출력: `~/tseng-audit-split-1006/work/lb-en-201/draft.md`
변경 줄은 아래 목록뿐(원문과 diff로 대조). 프런트매터는 lastmod만 (이미 2026-10-06이라 변경 없음).

## 판결별
- TPHM,114,上易,2198 · 원문 출현 16 → 3 (남긴 곳: 첫 인용 1, 출처 2) · 짧은 괄호로 바꾼 링크 6 · 통째로 지운 링크 7
- 짧은 괄호 문구 삽입 총 6곳 (링크 있는 괄호가 아니라 링크 없는 문구)

## 줄별 결정 (원문 줄 번호 = draft 줄 번호, 줄 수 불변)
- L23: 유지 — 첫 인용
- L25: → (High Court judgment): 문단에 법원 표시 없음
- L29: 삭제: 「The first court inspected…」
- L31: → (first-instance judgment): 문단에 「The judgment’s…」뿐
- L33: → (first-instance judgment): 문단에 법원 표시 없음
- L37: → (first-instance and High Court judgments): 문단에 법원 표시 없음(주장 서술)
- L39: 삭제: 「The trial court… The High Court explained…」
- L41: 삭제: 「The first court… The High Court agreed…」
- L50: 삭제: 「The High Court judgment states…」
- L54: 삭제: 「the courts applied… these judgments」
- L56: 삭제: 「The High Court disagreed.」
- L60: → (High Court judgment): 문단에 법원 표시 없음(「this acquittal」「this decision」)
- L62: 삭제: 「Neither court applied it… These criminal judgments report…」
- L64: → (first-instance judgment): 문단에 법원 표시 없음, 링크 라벨이 1심(첨부 판결)
- 표 행·출처 목록: 링크가 있는 곳은 그대로(위 「남긴 곳」 참조).

## 판단 메모
- 이 글의 판결 링크는 괄호가 아니라 문단 끝 문장형 `[라벨](url).` 이었다. 같은 규칙 B를 적용: 첫 인용(L23)·출처(L68–69)만 남기고 삭제 또는 짧은 괄호로 치환(마침표는 괄호 뒤로 옮김).
- 표에 링크 없음, 블록 인용 없음.

## 원문 URL 집합 == draft URL 집합
명령(bash):
```
diff <(grep -o 'https://judgment.judicial.gov.tw[^) ]*' ORIG | sort -u) <(grep -o 'https://judgment.judicial.gov.tw[^) ]*' DRAFT | sort -u) && echo 'URL SET IDENTICAL'
```
출력:
```
URL SET IDENTICAL
orig unique: 1  draft unique: 1
```
변경된 줄 수(diff `>`): 13
