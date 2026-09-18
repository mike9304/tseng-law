# WO — Fable 5.1 최종 검수: de/es 칼럼 17×2

from: Grok 4.6 (구현 워커)
to: Fable 5.1 (총괄 검수, 읽기 전용)
date: 2026-09-17
worktree: `/Users/son7/Projects/tseng-law-i18n-de-es-20260917`
branch: `i18n/de-es-public-20260917` (uncommitted vs `origin/main` `90352b02`)
git add/commit/push/deploy: **금지**
칼럼 md·체커·라우팅 원본 수정: **금지**. 쓰는 파일은 아래 리포트 1개만.

산출물: `docs/seo/reviews/DE-ES-COLUMNS-FABLE51-REVIEW.md`

판정: 레인 전체 **APPROVE** 또는 **ITERATE**. 파일마다 PASS/FAIL. 근거는 `파일:줄`. 없는 문제를 지어내지 말 것. 원어민 검수는 이 검토가 대체하지 않는다.

---

## 제품 잠금 (이미 승인된 de/es 안내 레인)

- `de`/`es` = 공개 **안내** 로케일(페이지 언어). 상담 언어가 아님.
- 빌더 Locale·`siteLocales` 확대 금지. 독일어·스페인어 상담 가능 주장 금지.
- 격식: 독 `Sie`, 서 `usted`. 코드 `de`/`es`.
- 한국어 원문 동형(블록·H 레벨·이미지 경로·FAQ 수). `url`/`lastmod`/`featured_image` 바이트 동일.
- 허용 링크 변환만: `/ko/columns|contact|services|faq|pricing` → `/{lang}/…`. 그 외 `/ko/…` 유지.
- 일반 「한국 기업」 프레이밍 → `ausländische Unternehmen` / `empresas extranjeras`.
- 사실인 한국(한–대만 조세조약, 005 한국 은행·외환, 010 한국인 당사자, 006/008 한국 비교)은 유지.
- 금지: 독·서 상담 가능, 통역 제공, 즉시 응답, 성공률, 비용/결과 보장, 24/7, 무료 상담.

카테고리 정본 (`src/lib/columns.ts`):

| | de | es |
|---|---|---|
| formation | Gesellschaftsgründung in Taiwan | Constitución de sociedades en Taiwán |
| legal | Rechtliche Informationen zu Taiwan | Información jurídica de Taiwán |
| case | Fallanalyse | Análisis de casos |

설립 8: 001,002,004,005,011,013,015,017. 법률 8: 003,006,007,008,009,012,014,016. 사례 1: 010.

---

## 워커가 이미 돌린 것 (맹신 금지, 교차검증)

- `node scripts/check-column-translation.mjs --dir src/content/columns-de --lang de` → **17/17 PASS**
- 동 스크립트 `--dir src/content/columns-es --lang es` → **17/17 PASS**
- 체커 단위테스트 110/110
- 카테고리 패리티·사이트맵 테스트 PASS
- 로컬 `:3028` HTTP 200: `/de/columns` `/es/columns` `/de/columns/taiwan-overtaking-accident-liability` `/es/columns/taiwan-gym-injury-lawsuit` 배지 010 = Fallanalyse / Análisis de casos; `llms.txt` 칼럼 17건

체커 WARN(실패 아님, 당신이 맞는지 판단):

- de 006: extra `2×2` (zwei)
- es 003: 수사미해석 `제644호` `제477호` `제236호` (사건번호)
- es 006: extra `1×2, 2×2` (un/dos)
- es 007: 수사미해석 `제4호` ×4 (`112年憲判字第4號`)
- es 010: 수사미해석 `제7호`

---

## 검수 방법 (M8/M11과 동일)

Read/Grep. 셸은 grep·wc·기존 체커 재실행만. HTTP 라이브(tseng-law.com) 금지. 커밋 금지.

대조: 같은 슬러그 `src/content/columns/`(ko) + `src/content/columns-id/`(구조) + 필요 시 `columns-en/`.

### 게이트 (느슨하게 바꾸지 말 것)

1. **사실**: 조문·금액·일자·절차를 de/es가 새로 만들지 않았는가. 왜곡(단수/복수, 전 지점 vs 그 지점 — AR 004 사고) 없는가.
2. **링크**: 없는 `/{de,es}/columns/…` 를 있는 것처럼 가리키는가. 허용 변환 외 `/ko/` 가 무단 변경됐는가.
3. **금지 주장**: `Beratung auf Deutsch` / `deutschsprachige Beratung` / `kostenlose Beratung` / `consulta en español` / `consulta gratuita` / `intérprete` / `Dolmetscher gestellt` 등.
4. **국적 삽입**: 원 블록에 나라 이름이 없는데 `Deutschland` / `deutsche Unternehmen` / `España` / `empresas españolas` 를 넣었는가.
5. **한글 잔존** / **한자 병기 누락**(법률용어 병기가 빠진 문단).
6. **카테고리** frontmatter가 위 정본과 같은가. 010만 case.
7. **동형**: H1=title, 이미지 경로, FAQ 수, 고아 `​` 줄 보존.
8. **격식**: du/tú 누수. 다만 URL path `/dir/` 오탐 제외.

### 필독 (양 언어)

001, 003, 004, 005, 007, 008, 010, 012.

나머지는 grep + 표본 2~3편. 표본에서 FAIL이면 그 언어 전편으로 확대.

---

## 리포트 형식

```
판정: APPROVE | ITERATE
범위: columns-de 17 + columns-es 17
방법: Read/Grep. 원본 md 미수정.
```

그다음 파일별 PASS/FAIL 표. FAIL은 `파일:줄` + 원문 핵심 + 수정 한 줄. 권고(FAIL 아님)는 따로.

마지막 줄: `원어민 검수는 이 검토가 대체하지 않는다.`
