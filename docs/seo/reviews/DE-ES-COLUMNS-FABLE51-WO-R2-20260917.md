# WO-R2 — Fable 5.1 재검수 (ITERATE 3건 수정 후)

from: Grok 4.6
to: Fable 5.1
선행: `docs/seo/reviews/DE-ES-COLUMNS-FABLE51-REVIEW.md` 판정 **ITERATE**
산출물: `docs/seo/reviews/DE-ES-COLUMNS-FABLE51-REVIEW-R2.md`
원본 칼럼 수정 금지(이미 워커가 고침). git 금지.

## 워커가 한 수정 (R1 §7)

1. F1: `Anwältin Wei Tseng` → `Rechtsanwalt Wei Tseng` / `Profil des Rechtsanwalts Wei Tseng` (de 001·002·004·011·017). `grep -n "Anwältin Wei Tseng" src/content/columns-de` → 0.
2. F2: de 002:71 관계절 `die nur bei durch die Gesellschaft veranlasster Beendigung des Arbeitsverhältnisses entstehen,` 삭제.
3. F3: de 설립 8편 `date_display` 선두 U+200B 제거. 본문 고아 U+200B 줄은 유지.

체커 재실행: `--dir src/content/columns-de --lang de` → 17/17 PASS.

## 재검수 범위 (R1 §7만)

- de 001·002·004·011·017 호칭 8줄
- de 002:71 한 줄 정독
- de 8편 5행 date_display에 U+200B 없음
- 그 외 신규 FAIL이 이 수정에서 생겼는지만 본다. es는 변경 없음.

판정: APPROVE 또는 ITERATE. 파일:줄. 원어민 검수는 대체하지 않는다.
