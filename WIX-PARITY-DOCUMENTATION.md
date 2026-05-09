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

## M01 — Performance 잔여 fix

- 시작/종료: 2026-05-09T22:05:00+09:00 / 2026-05-09T22:33:00+09:00
- 변경 파일:
  - `src/lib/builder/canvas/store.ts` — group bounds 계산에서 `Math.min(...array)`/`Math.max(...array)` 제거
  - `src/lib/builder/canvas/__tests__/store-transient.test.ts` — 1,500개 선택 그룹화 회귀 테스트 추가
  - `src/components/builder/canvas/CanvasContainer.tsx` — Space keyup도 input/textarea/select/contenteditable 타깃이면 pan 종료 처리에서 제외
  - `tests/builder-editor/admin-builder.playwright.ts` — inspector number input에서 Space keydown/keyup이 canvas pan 상태를 만들지 않는 회귀 테스트 추가
  - `src/lib/builder/canvas/snap.ts` — active viewport 밖 snap 후보 prune
  - `src/lib/builder/canvas/__tests__/snap.test.ts` — viewport 밖 snap 후보 제거 테스트 추가
  - `src/components/builder/canvas/insights-preview-cache.ts` — insights archive preview posts를 locale별 promise/data cache로 분리
  - `src/components/builder/canvas/CanvasNode.tsx` — archive preview가 cache loader를 사용하도록 변경
  - `src/components/builder/canvas/__tests__/insights-preview-cache.test.ts` — same-locale dedupe, locale 분리, failure retry 테스트 추가
  - `tests/builder-editor/office-map-public.playwright.ts` — draft polling이 429뿐 아니라 일시 `ECONNRESET`도 재시도하도록 보강
  - `WIX-PARITY-PLAN.md` / `WIX-PARITY-DOCUMENTATION.md` / `SESSION.md` — M01 진행/검증 기록
- 커밋:
  - `a950f84 G-Editor: avoid spread overflow in group bounds`
  - `21d64b2 G-Editor: guard space-keyup in text inputs`
  - `4751ff8 G-Editor: prune snap candidates by viewport`
  - `613bf94 G-Editor: cache insights archive preview by locale`
  - `9b96359 G-Editor: harden office map draft polling`
- 의사결정:
  - 감사 #7의 "history structuredClone full doc" 지적은 현재 HEAD와 맞지 않는다. `src/lib/builder/canvas/history.ts`는 이미 structural-sharing snapshot 방식이고 `history.test.ts`가 무제한 session history를 검증하므로 patch-based 재작성은 이번 마일스톤에서 하지 않았다.
  - `CanvasNode` archive preview는 SWR dependency를 새로 들이지 않고 module-level promise/data cache로 해결했다. 같은 locale의 동시/후속 mount fetch를 1회로 합치고, 실패 시 cache를 지워 다음 mount에서 재시도한다.
  - Office map Playwright 실패는 앱 assertion 실패가 아니라 dev 서버 부하 중 draft GET의 `ECONNRESET`/429 조합이었다. 실제 map 시나리오는 단독 재실행과 전체 재실행에서 통과했으므로 테스트 polling 안정성만 보강했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warning only)
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/store-transient.test.ts` ✅ (4 tests)
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/snap.test.ts` ✅ (4 tests)
  - `npm run test:unit -- src/components/builder/canvas/__tests__/insights-preview-cache.test.ts` ✅ (3 tests)
  - `npm run test:unit` ✅ (27 files / 740 tests)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/office-map-public.playwright.ts -g "edits a generic Google map address" --workers=1` ✅
  - `BASE_URL=http://localhost:3000 npm run test:builder-editor -- --workers=1` ✅ (28 passed)
- 리스크 / 알려진 문제:
  - macOS Chromium Mach port 권한 문제로 일부 Playwright는 sandbox 밖 실행이 필요했다.
  - M01은 W 범위 없는 선행 성능/안정성 마일스톤이라 `Wix 체크포인트.md` 변경은 없다.
- 보류된 W (있을 경우):
  - 없음
- 사용자 피드백 흡수:
  - "렉걸리듯이 흔들림", "사진/칼럼 클릭하면 백지"류 피드백에 직접 연결되는 hot path와 test polling 안정성을 먼저 닫았다.
- 다음 마일스톤: M02
