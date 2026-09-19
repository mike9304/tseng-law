# WO — Fable 5.1 / Claude Opus 5 독립 검수: MULTILINGUAL-INTERNATIONAL-v2

from: Grok 4.6 (구현)
to: Fable 5.1. Fable CLI 한도면 **Claude Opus 5**가 같은 WO로 대체.
date: 2026-09-17
candidate_id: `MULTILINGUAL-INTERNATIONAL-v2-20260917-c2`
worktree: `/Users/son7/Projects/tseng-law-en-international-20260917`
branch: `seo/en-international-v1-20260917` (미커밋 포함, HEAD `90352b02`)
owner: 사용자 지시 2026-09-17 — 배포 전 Opus 5 검수

## 이 WO가 EN-v1 검수와 다른 점 (혼동 금지)

- **지금 검수 대상은 v2다.** EN-INTERNATIONAL-v1 작업을 폐기하지 말고, 그 위에 올린 다국어 후보를 검증하라.
- 15:55 IN-claude의 「v2 레인 이 워크트리에서 제거」지시는 **이 WO로 폐기한다.** v2 파일을 지우지 마라.
- v1 WO의 「P07는 EN-only, KO 404」는 **v2에서 대체됨.** 핵심 4언어(`en`/`ja`/`ko`/`zh-hant`)에 미공개 P07 최대 1개씩이 허용이다.
- v1의 「EN만 수정」은 v2 범위표로 대체됨. 상담언어 4개·무배포·소스 수정 금지·D11/D12는 유지.

## 금지 (최우선)

- **앱 소스 수정 금지.** 결함은 리포트로만 Grok에 반환.
- git add / commit / push / deploy / reset / stash / force-checkout 금지.
- v2 파일 삭제 금지. 특히:
  - `src/components/LocaleHomePathNav.tsx`
  - `src/data/multilingual-international-v2.ts`
  - `src/components/CivilCommercialBlock.tsx`
  - `src/components/__tests__/multilingual-international-v2.test.tsx`
  - `src/app/[locale]/taiwan-debt-recovery-lawyer/`
- 운영 메일·폼·분석 실제 제출 금지.
- Grok PASS를 증거로 승인하지 마라. 변호사 승인·발행 승인을 대신하지 마라.
- `independent_validation`만 네가 채운다. `legal_review=PENDING`, `publish_authorized=false`, `deployed=false` 유지.

## 필독

1. `/Users/son7/Downloads/tseng-law-multilingual-v2/03_FABLE_MULTILINGUAL_PROMPT.md` **전체**
2. 같은 폴더 `01_MULTILINGUAL_PLAN.md`, `02_GROK_MULTILINGUAL_PROMPT.md`, `04_MULTILINGUAL_ACCEPTANCE.md`, `05_SOURCES.md`
3. 기존 v1 검수 프롬프트는 참고만. v2와 충돌하면 **v2가 이 레인 정본**.
4. Grok 산출: `/Users/son7/Projects/tseng-law-en-international-20260917/ops/MULTILINGUAL-INTERNATIONAL-v2/`
5. 후보 소스: 위 worktree **미커밋 포함**. git HEAD만으로 동일성 판단 금지.

## 산출물 (이 경로만 쓰기)

`/Users/son7/Projects/tseng-law-en-international-20260917/ops/MULTILINGUAL-INTERNATIONAL-v2/fable/MULTILINGUAL-INTERNATIONAL-v2-20260917-c2/`

필수:
- `FABLE-REPORT.md` (03 프롬프트 보고 형식)
- `QA-BY-LOCALE.md` (ML01–ML24 × locale × page_role/URL, PASS/FAIL/NOT_TESTED/BLOCKED)
- `STATUS.json` (`independent_validation`만 채움)
- 시작/종료 SHA-256 vs `ops/MULTILINGUAL-INTERNATIONAL-v2/candidate-manifest.sha256`
- 실행한 명령·종료코드 로그

판정: `PASS_TECHNICAL_CONTENT` / `CHANGES_REQUIRED` / `BLOCKED` 중 하나. 배포 승인과 구분.

## 반드시 직접 확인할 것

1. **동일 후보:** `LocaleHomePathNav.tsx` 등이 트리에 있고 manifest 해시와 맞는가. 없으면 구현 미복원이지 통과가 아니다.
2. **JA P03:** `src/content/columns-ja/001-taiwan-company-establishment-basics.md` 도입문이 `한국기업을 보편 독자`로 남아 있으면 FAIL. `일본기업이나 개인사업자` 전제여야 하고 `台湾・韓国所得税協定`은 일본 조약으로 개명되면 FAIL.
3. **홈 두 경로:** `HeroSearch`/`CinematicOpening`이 `locale==='en'`으로만 경로를 숨기면 FAIL. 핵심 4언어 첫 화면에 설립/분쟁 실제 href. 안내형 `vi/id/th/fil/ar`는 설립안내/법률문제안내 두 경로.
4. **P07:** `taiwan-debt-recovery-lawyer/page.tsx`가 `locale !== 'en'`이면 `notFound()`면 FAIL. ja/ko/zh-hant도 미공개 다섯 상황 + noindex + 빈 hreflang.
5. **정보 ≠ 의뢰:** 가이드 `planHeading`과 `taiwan-company-setup-lawyer` 제목이 같으면 FAIL.
6. **상담언어 4개 유지.** 9언어 상담 광고 있으면 FAIL. 안내형 문의 전 상담언어 고지, 통역/SLA/예약 보장 문구 있으면 FAIL.
7. **AR:** 정책 없는 MENA 국가규칙 신설이면 FAIL. 기존 `/ar` 회귀는 확인.
8. 테스트는 실제 존재하는 `npx vitest run src/components/__tests__/multilingual-international-v2.test.tsx` 를 네가 다시 돌려라. Grok 로그 맹신 금지.

## Grok이 돌렸다고 한 것 (교차검증용, 맹신 금지)

- `npx vitest run src/components/__tests__/multilingual-international-v2.test.tsx src/components/__tests__/en-international-v1.test.tsx` ×2 → 18 passed
- guidance-country-mentions / disclosure-parity / seo-hreflang / columns-ja-content / global-seo-locale-integrity → 46 passed
- localhost `127.0.0.1:3044` `/en` `/ja` `/vi` `/ko` 200 + path labels (세션 next dev; 꺼져 있으면 재기동하되 소스 수정 금지)

결함은 파일:라인 + 재현 + 기대/실제로 Grok에 반환. 소스에 손대지 마라.
