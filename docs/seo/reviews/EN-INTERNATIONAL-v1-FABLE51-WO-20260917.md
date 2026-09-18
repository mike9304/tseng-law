# WO — Fable 5.1 최종 검수: EN-INTERNATIONAL-v1

from: Grok 4.6 (구현)
to: Fable 5.1 (독립 검증, 읽기 전용). 사용량으로 Fable이 안 되면 **Opus 5**가 같은 WO로 대체.
date: 2026-09-17
candidate_id: `EN-INTERNATIONAL-v1-20260917-c1`
worktree: `/Users/son7/Projects/tseng-law-en-international-20260917`
branch: `seo/en-international-v1-20260917` (uncommitted vs `origin/main` `90352b029bfd5419c093a899d4bdeff49e5eb089`)
git add/commit/push/deploy: **금지**
원본 앱 소스 수정: **금지**. 산출물은 아래 검증 폴더만.

판정: `PASS_TECHNICAL_CONTENT` / `CHANGES_REQUIRED` / `BLOCKED` 중 하나. 배포 승인과 구분.
변호사 승인·발행 승인을 대신하지 마라. `legal_review=PENDING`, `publish_authorized=false`, `deployed=false`.

---

## 필독

1. `/Users/son7/Downloads/tseng-law-en-workpack/03_FABLE_VERIFICATION_PROMPT.md` (전체)
2. 같은 폴더 `01_MASTER_PLAN.md`, `05_ACCEPTANCE_TESTS.md`, `06_PAGE_COPY_BLUEPRINTS.md`
3. Grok 산출: `/Users/son7/Projects/tseng-law-grok-goal-proxy/out/EN-INTERNATIONAL-v1/`
   - `GROK-REPORT.md`, `QA-MATRIX.md`, `PAGE-MAP.md`, `CLAIM-REGISTER.md`, `RUNBOOK.md`, `candidate/MANIFEST.json`
4. 후보 소스: 위 worktree (미커밋 포함). git HEAD만 비교하지 마라.

## 산출물 (이 경로만 쓰기)

`/Users/son7/Projects/tseng-law-grok-goal-proxy/out/EN-INTERNATIONAL-v1/fable/EN-INTERNATIONAL-v1-20260917-c1/`

필수:
- `FABLE-REPORT.md` (03 프롬프트 보고 형식 9항)
- `QA-MATRIX.md` (42 tests PASS/FAIL/NOT_TESTED/BLOCKED)
- `STATUS.json` (`independent_validation`만 네가 채움. Grok 칸을 승인으로 바꾸지 마라)
- 독립 SHA-256 vs `candidate/MANIFEST.json`
- 실행한 명령·종료코드 로그

## 다섯 요구 (원문 대조)

1. 영문 회사설립이 한국 기업만 전제하지 않으면서 국가별 조건·실제 사례·언어 사실을 보존
2. 소송·민사 제목/본문/링크 일치. 미수금 고객이 상해 안내에서 끝나지 않음. 상해 자료는 삭제되지 않음
3. 가이드(`/en/guides/taiwan-company-setup`) vs 의뢰(`/en/taiwan-company-setup-lawyer`)가 다른 질문에 답함
4. 미수금·선금미납품·불량품·납기/계약위반·연락단절 다섯 유형
5. `/en` 첫 화면(1440×900, 390×844)에서 두 실제 href 경로. 기존 문의·다른 업무·언어 선택 보존

신규 URL은 최대 1개: `/en/taiwan-debt-recovery-lawyer` (EN-only, noindex, KO 404여야 함).

## 금지

- Grok PASS를 증거로 인정
- 원본 소스 수정 후 스스로 승인
- 운영 메일/분석 전송, push, deploy
- 간체 추가, D11 에이전트 UI를 공개 홈에 이식했다고 가정
- `APPROVED_BY_ATTORNEY` 기록

## Grok이 이미 돌린 것 (맹신 금지, 교차검증)

- typecheck 0, eslint 변경파일 0
- focused vitest 154 + sitemap/JA 62 + title 30
- localhost `127.0.0.1:4317` (이 세션 next dev; 꺼져 있으면 RUNBOOK대로 재기동)
- 스크린샷 `out/EN-INTERNATIONAL-v1/screenshots/`
- 전체 `npm run qa` / `build` / 320·768·200% 는 Grok NOT_TESTED

로컬 HTTP·lint·typecheck·관련 테스트는 직접 재실행하라. 환경이 없으면 그 항목은 NOT_TESTED.
