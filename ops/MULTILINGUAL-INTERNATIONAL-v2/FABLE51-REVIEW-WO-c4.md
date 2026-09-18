# WO — Opus 5 재검수: MULTILINGUAL-INTERNATIONAL-v2-20260918-c4

from: Grok 4.6 (ITERATE C3-01·C3-02)
to: Claude Opus 5 / Fable 5.1 대체. **소스 수정 금지.**
date: 2026-09-18
candidate_id: `MULTILINGUAL-INTERNATIONAL-v2-20260918-c4`
worktree: `/Users/son7/Projects/tseng-law-en-international-20260917`
prior: c3 `CHANGES_REQUIRED` at `ops/.../fable/MULTILINGUAL-INTERNATIONAL-v2-20260918-c3/FABLE-REPORT.md`

## 이번 수정만 재확인

1. **C3-01:** `src/data/intent-pages.ts` ZH `taiwan-lawyer`.title 이 `台灣律師指南` 으로 복원됐는지. `npx vitest run src/data/__tests__/intent-pages-en-growth.test.ts` 를 네가 다시 돌려라.
2. **C3-02:** `ops/MULTILINGUAL-INTERNATIONAL-v2/` 에 BASELINE, TERMS, CONTENT-DIFF, LOCALE-SEO-MAP, RUNBOOK, logs/, screens/ 실재. `QA-BY-LOCALE.md` 후보 ID가 c4. `candidate-manifest.sha256` 에 `fable/` 경로가 없는지.

c3에서 해소된 V2-01~05·07~11·15는 관련 해시가 유지되면 표본만. V2-17 main 병합은 이번에도 하지 않음. V2-12·13·14는 P2 잔여.

금지: 앱 소스 수정, v2 파일 삭제, git commit/push/deploy.
산출: `ops/MULTILINGUAL-INTERNATIONAL-v2/fable/MULTILINGUAL-INTERNATIONAL-v2-20260918-c4/`
판정: PASS_TECHNICAL_CONTENT | CHANGES_REQUIRED | BLOCKED.
legal_review=PENDING publish_authorized=false deployed=false.
