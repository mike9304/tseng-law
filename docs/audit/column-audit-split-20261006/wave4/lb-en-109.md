# changes — lb-en-109  (WO-LINKB 규칙 B)
원문: `~/projects/tseng-law-audit-split-w4/src/content/columns-en/109-taiwan-road-rage-baseball-bat-fracture-damages.md` · 출력: `~/tseng-audit-split-1006/work/lb-en-109/draft.md`
변경 줄은 아래 목록뿐(원문과 diff로 대조). 프런트매터는 lastmod만 (이미 2026-10-06이라 변경 없음).

## 판결별
- KLDM,114,易,159 · 원문 출현 4 → 2 (남긴 곳: 첫 인용 1, 출처 1) · 짧은 괄호로 바꾼 링크 1 · 통째로 지운 링크 1
- KLDV,114,訴,502 · 원문 출현 10 → 2 (남긴 곳: 첫 인용 1, 출처 1) · 짧은 괄호로 바꾼 링크 6 · 통째로 지운 링크 2
- TPHM,115,上易,1045 · 원문 출현 2 → 2 (남긴 곳: 첫 인용 1, 출처 1) · 짧은 괄호로 바꾼 링크 0 · 통째로 지운 링크 0
- 짧은 괄호 문구 삽입 총 7곳 (링크 있는 괄호가 아니라 링크 없는 문구)

## 줄별 결정 (원문 줄 번호 = draft 줄 번호, 줄 수 불변)
- L21: 유지 — 첫 인용(형사)
- L23: 유지 — 첫 인용(민사)
- L27: 유지 — 첫 인용(고등법원)
- L35: 삭제: 「the Keelung District Court used… The judgment adopted…」
- L41: → (criminal judgment): 문단에 「the court」뿐, 같은 법원의 형사·민사 두 판결이 있어 유형으로 구분
- L43: 삭제: 「According to the later civil judgment…」
- L47: 삭제: 「the criminal division transferred to the civil division」
- L64: → (civil judgment): 문단에 「The court」뿐
- L66: → (civil judgment): 문단에 「The court」뿐
- L68: → (civil judgment): 문단에 「the court」뿐
- L74: → (civil judgment): 문단에 「The court」「The judgment」뿐
- L76: → (civil judgment): 문단에 「the court」뿐
- L78: → (civil judgment): 문단에 법원 표시 없음
- 표 행·출처 목록: 링크가 있는 곳은 그대로(위 「남긴 곳」 참조).

## 판단 메모
- 짧은 괄호 문구: 같은 Keelung District Court의 형사·민사 1심 판결이 둘이라 WO의 "(first-instance judgment)"로는 구분이 안 되어 "(criminal judgment)" "(civil judgment)"을 썼다.

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
변경된 줄 수(diff `>`): 10
