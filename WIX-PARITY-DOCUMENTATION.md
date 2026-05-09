# WIX-PARITY-DOCUMENTATION.md

Long-horizon Wix parity decision/progress/risk log.
Created: 2026-05-09T12:52:13.760Z

## M00 — mergeMissingPages 데이터 손실 fix

- 시작/종료: 2026-05-09T21:52:00+09:00 / 2026-05-09T22:04:00+09:00
- 변경 파일:
  - `WIX-PARITY-PROMPT.md` — `CODEX-GOAL-WIX-FULL-BUILDER.md` 전체를 마스터 프롬프트로 복제
  - `WIX-PARITY-IMPLEMENT.md` — 마스터 프롬프트 §7 M00~M28 상세 매뉴얼 복제
  - `tests/builder-editor/cross-tab-delete-race.playwright.ts` — 실제 `/ko/admin-builder` 탭 2개 + API delete/list + stale site write 회귀 테스트 추가
  - `WIX-PARITY-PLAN.md` — M00 상태를 🟢로 변경
  - `WIX-PARITY-DOCUMENTATION.md` — M00 의사결정/검증/리스크 기록
  - `SESSION.md` — M00 bootstrap 결과 및 다음 마일스톤 인계 기록
- 추가 테스트: 1개 Playwright
- 의사결정:
  - `preserveMissingPages` 기본값은 true 유지. `CODEX-AUDIT-FINDINGS-2026-05-09.md`가 확인한 대로 현재 `reconcileSiteDocumentPagesForWrite()`는 stale next-only page를 `createdAt < latest site timestamp` 기준으로 drop해서 삭제 페이지 부활을 이미 차단한다.
  - 마스터 문서의 "기본값 false" 지시는 검증된 동시 생성 보존 시나리오를 깨므로 적용하지 않았다. 대신 M00의 실제 위험인 cross-tab 삭제 부활 방지를 Playwright 회귀 테스트로 고정했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warning only)
  - `npm run test:unit -- src/lib/builder/site/__tests__/persistence.test.ts` ✅ (10 tests)
  - `npm run test:unit` ✅ (26 files / 735 tests)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/cross-tab-delete-race.playwright.ts --workers=1` ✅
  - `BASE_URL=http://localhost:3000 npm run test:builder-editor -- --workers=1` ✅ (28 passed)
- 리스크 / 알려진 문제:
  - 첫 Playwright 실행은 macOS Chromium Mach port sandbox 권한 문제로 브라우저 launch 전 실패했다. 동일 명령을 승인된 sandbox 밖 실행으로 재실행해 통과했다.
  - 첫 `npm run build`와 full Playwright 병렬 실행은 3000번 dev server의 `.next` 산출물과 build 산출물이 충돌해 route module lookup이 깨졌다. dev server 정지 → `.next` 삭제 → build 단독 실행 → dev server 재시작 후 재검증은 통과했다.
  - M00은 W 범위가 없어 Wix 체크포인트 상태 변경 없음.
- 보류된 W (있을 경우):
  - 없음
- 사용자 피드백 흡수:
  - 2026-05-09 "클로드에게 너의 코드들 감사를 시켰어 참고해 src/lib/builder/site/persistence.ts:127-139" → M00에서 감사 #5를 재검증하고 false-positive 판정을 코드/테스트로 반영
- 다음 마일스톤: M01
