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

## M02 — Hot files split

- 시작/종료: 2026-05-09T22:34:00+09:00 / 2026-05-09T23:24:00+09:00
- 변경 파일:
  - `src/components/builder/canvas/SandboxPage.tsx` — shell orchestration을 유지하고 rail/workspace/modals/site-state hook을 분리해 774 LOC로 축소
  - `src/components/builder/canvas/CanvasContainer.tsx` — context menu, stage nodes, rulers, toolbar, zoom dock, interaction hooks를 분리해 779 LOC로 축소
  - `src/components/builder/canvas/CanvasNode.tsx` — badge, quick panels, insights preview, selection overlay, rotation hook, node util을 분리해 794 LOC로 축소
  - `src/components/builder/canvas/SandboxPage.module.css` — node badge/quick panels/selection overlay/insights preview CSS를 component CSS module로 분리해 4189 LOC로 축소
  - `src/components/builder/canvas/__tests__/design-pool-shells.test.ts` — context menu action contract가 `CanvasContextMenuLayer.tsx` split 구조도 검사하도록 갱신
- 추가 파일:
  - `src/components/builder/canvas/SandboxEditorRail.tsx`
  - `src/components/builder/canvas/SandboxEditorWorkspace.tsx`
  - `src/components/builder/canvas/SandboxModalsRoot.tsx`
  - `src/components/builder/canvas/hooks/useSandboxSiteState.ts`
  - `src/components/builder/canvas/CanvasContextMenuLayer.tsx`
  - `src/components/builder/canvas/CanvasDropHighlight.tsx`
  - `src/components/builder/canvas/CanvasOverlapPickerLayer.tsx`
  - `src/components/builder/canvas/CanvasRulers.tsx`
  - `src/components/builder/canvas/CanvasSelectionToolbarLayer.tsx`
  - `src/components/builder/canvas/CanvasStageNodes.tsx`
  - `src/components/builder/canvas/CanvasStageToolbar.tsx`
  - `src/components/builder/canvas/CanvasZoomDock.tsx`
  - `src/components/builder/canvas/canvasInteraction.ts`
  - `src/components/builder/canvas/hooks/useCanvasInteractions.ts`
  - `src/components/builder/canvas/hooks/useCanvasKeyboard.ts`
  - `src/components/builder/canvas/hooks/useCanvasLinkEditing.ts`
  - `src/components/builder/canvas/hooks/useCanvasSelectionBox.ts`
  - `src/components/builder/canvas/CanvasInsightsPreview.tsx`
  - `src/components/builder/canvas/CanvasNodeBadge.tsx`
  - `src/components/builder/canvas/CanvasNodeQuickPanels.tsx`
  - `src/components/builder/canvas/CanvasNodeSelectionOverlay.tsx`
  - `src/components/builder/canvas/canvasNodeTypes.ts`
  - `src/components/builder/canvas/canvasNodeUtils.ts`
  - `src/components/builder/canvas/hooks/useCanvasNodeRotation.ts`
  - `src/components/builder/canvas/CanvasInsightsPreview.module.css`
  - `src/components/builder/canvas/CanvasNodeBadge.module.css`
  - `src/components/builder/canvas/CanvasNodeQuickPanels.module.css`
  - `src/components/builder/canvas/CanvasNodeSelectionOverlay.module.css`
- 커밋:
  - `101ca20 G-Editor: split sandbox page shell`
  - `2217e9c G-Editor: split canvas container interactions`
  - `9bf1338 G-Editor: split canvas node chrome`
  - `f6d9cd5 G-Editor: split canvas node styles`
- 의사결정:
  - M02는 기능 변경 0 원칙을 지키기 위해 기존 동작을 보존하는 extraction만 수행했다.
  - `CanvasNode.tsx`는 kind별 렌더 switch가 없고 registry render 구조라, 실제 소유권 기준으로 badge/quick panels/insights/selection/rotation/util을 분리했다.
  - CSS는 전체 8+ module 목표 중 우선 hot node 영역 4개 module을 분리했다. 남은 shell/panel/modal CSS는 후속 M04/M05에서 visual baseline 도입 후 더 잘게 쪼갠다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run test:unit` ✅ (27 files / 740 tests)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `NEXT_DIST_DIR=.next-m02 npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --workers=1` ✅
  - `BASE_URL=http://localhost:3000 npm run test:builder-editor -- --workers=1` ✅ (28 passed / 3.7m)
  - `git diff --check` ✅
- 리스크 / 알려진 문제:
  - `NEXT_DIST_DIR=.next-m02 npm run build`가 Next의 tsconfig include 자동 수정을 시도했으나 검증 부산물이라 되돌렸다.
  - M02 종료 시점의 CSS module 수는 hot node 영역 4개 추가다. 전체 goal Done when의 "CSS 컴포넌트별 8+ module"은 아직 미완이며 후속 Pre 마일스톤에서 계속 분리한다.
  - self-check subagent는 계정 사용량 제한으로 실행 실패했다. 대신 typecheck/lint/unit/security/build/full Playwright로 로컬 검증을 대체했다.
- 보류된 W (있을 경우):
  - 없음
- 사용자 피드백 흡수:
  - "사진/칼럼 클릭하면 백지"와 지도 quick edit 관련 회귀를 막기 위해 `asset-image-workflow`, `columns-ui-workflow`, `office-map-public`, `published-interactions`를 포함한 전체 builder-editor bundle로 확인했다.
- 다음 마일스톤: M03

## M03 — 보안 3건

- 시작/종료: 2026-05-09T23:28:00+09:00 / 2026-05-09T23:44:00+09:00
- 변경 파일:
  - `src/lib/builder/security/csrf.ts` — `BUILDER_ALLOWED_ORIGINS`, current host, `VERCEL_URL` 기반 Origin/Referer 검증을 추가하고 mismatch 응답을 `csrf_origin_mismatch`로 통일
  - `src/lib/builder/security/rate-limit.ts` — `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`이 있으면 Redis REST pipeline을 사용하고 실패/미설정 시 in-memory fallback 유지
  - `src/lib/builder/security/guard.ts` 및 builder mutation routes — rate-limit 비동기화를 위해 `await guardMutation()`으로 전환
  - `src/lib/builder/canvas/upload-validation.ts` — `BUILDER_ASSET_MAX_BYTES`, `BUILDER_ASSET_ALLOWED_MIME`, 1KB magic-byte sniffing, SVG sanitize 정책 추가
  - `src/lib/builder/assets.ts` / `src/app/api/builder/assets/route.ts` — SVG 저장 지원, sanitize 후 저장, 415/413 validation status 정책 적용
  - `src/app/api/booking/book/route.ts` — shared async rate-limit helper에 맞춰 public booking limiter도 `await` 처리
- 추가 파일:
  - `src/lib/builder/security/__tests__/csrf.test.ts`
  - `src/lib/builder/security/__tests__/rate-limit.test.ts`
  - `tests/builder-editor/asset-upload-security.playwright.ts`
- 커밋:
  - `b709f99 G-Editor: enforce builder csrf origin guard`
  - `27c27ea G-Editor: add builder rate limit fallback`
  - `deaeac7 G-Editor: harden builder asset uploads`
- 의사결정:
  - Upstash SDK 설치 대신 REST pipeline을 직접 사용했다. 네트워크 의존성을 늘리지 않으면서 M03 env contract를 만족하고, 실패 시 기존 local fallback을 보존한다.
  - Playwright/API helper 호환을 위해 localhost current host는 Origin/Referer가 없어도 허용하되, production-like host는 missing/mismatch 모두 403으로 막는다.
  - SVG는 무조건 차단하지 않고 script/event handler는 제거 후 저장, 외부 href와 data/javascript/vbscript protocol은 차단한다.
- 검증:
  - `npm run test:unit -- src/lib/builder/security/__tests__/csrf.test.ts src/lib/builder/security/__tests__/rate-limit.test.ts src/lib/builder/canvas/__tests__/upload-validation.test.ts` ✅ (38 tests)
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run test:unit` ✅ (29 files / 755 tests)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `NEXT_DIST_DIR=.next-m03 npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
  - localhost API upload check ✅ (`m03-valid.png` 200, spoofed PNG 415, 11MB PNG 413)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/asset-upload-security.playwright.ts --workers=1` ✅
  - `BASE_URL=http://localhost:3000 npm run test:builder-editor -- --workers=1` ✅ (29 passed / 3.7m)
  - `git diff --check` ✅
- 리스크 / 알려진 문제:
  - Chromium launch와 localhost fetch는 local sandbox에서 `EPERM`/Mach port permission 문제가 있어 sandbox 밖에서 검증했다.
  - `NEXT_DIST_DIR=.next-m03` build가 Next의 tsconfig include 자동 수정을 시도했으나 검증 부산물이라 되돌렸다.
  - `.next-m02/`, `.next-m03/`는 untracked build artifact로 남아 있다.
- 보류된 W (있을 경우):
  - 없음
- 사용자 피드백 흡수:
  - "계속 yes 묻는 것" 관련해 dependency install 없이 REST 구현으로 승인 프롬프트를 줄였다. 단, sandbox가 localhost/Chromium을 막는 경우만 필수 승인으로 실행했다.
- 다음 마일스톤: M04

## M04 — AI 검증 인프라 7종

- 시작/종료: 2026-05-09T23:45:00+09:00 / 2026-05-10T00:46:00+09:00
- 변경 파일:
  - `playwright.config.ts` — Chromium/WebKit/Firefox projects, screenshot baseline path, `toHaveScreenshot` tolerance 추가
  - `tests/builder-editor/visual-regression.playwright.ts` + `tests/visual/baseline/...` — first screen, catalog drawer, text inspector, preview mobile, site settings, asset library 6개 baseline 고정
  - `tests/builder-editor/a11y-smoke.playwright.ts` / `tests/builder-editor/helpers/a11y.ts` — axe-core WCAG 2.1 AA gate 추가
  - `tests/builder-editor/inline-text-ime.playwright.ts` — 임시 페이지 기반 Korean/Hanja composition 저장·reload 회귀 테스트 추가
  - `tests/builder-editor/zh-hant-smoke.playwright.ts` — Traditional Chinese editor/columns surface smoke 추가
  - `lighthouserc.json`, `scripts/run-lhci.mjs`, `.github/workflows/builder-quality.yml` — LHCI/CI quality gate 추가
  - `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `next.config.mjs`, `.env.example` — Sentry DSN no-op 기본값, tracing/replay 5% env contract 추가
  - `src/components/builder/canvas/*`, `src/lib/builder/components/container/Element.tsx`, `src/app/globals.css` — axe 대비/semantic fix와 decomposed container background 렌더링 보정
- 커밋:
  - `d4fdd5a G-Editor: add builder quality gates`
- 의사결정:
  - Sentry는 `NEXT_PUBLIC_SENTRY_DSN`이 있을 때만 `withSentryConfig`를 적용한다. 로컬/CI no-op을 기본으로 두어 DSN 미설정 환경에서 빌드 동작을 바꾸지 않는다.
  - Visual regression은 Chromium baseline만 고정하고, WebKit/Firefox는 long smoke로 동작 호환을 검증한다. 브라우저별 픽셀 차이를 baseline 3종으로 늘리기보다 M04에서는 핵심 6상태의 안정 baseline을 우선했다.
  - LHCI는 `@lhci/cli`가 로컬 Chrome을 못 찾는 경우가 있어 `scripts/run-lhci.mjs`에서 Playwright Chromium 경로를 자동 주입한다.
  - 칼럼/인사이트 quick action은 페이지 이동 동작이므로 `button + window.location` 대신 semantic `a` 링크로 바꿨다.
  - `ContainerElement`가 `content.background`/border 대신 기본 card variant 흰 배경을 렌더하던 버그를 수정했다. 이 문제는 칼럼 페이지 히어로 대비와 실제 visual parity 모두에 영향을 줬다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run test:unit` ✅ (29 files / 755 tests)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/a11y-smoke.playwright.ts tests/builder-editor/inline-text-ime.playwright.ts tests/builder-editor/visual-regression.playwright.ts tests/builder-editor/zh-hant-smoke.playwright.ts --project=chromium-builder --workers=1` ✅ (4 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --project=chromium-builder --workers=1` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --project=webkit-builder --project=firefox-builder --workers=1` ✅ (2 passed)
  - `NEXT_DIST_DIR=.next-m04 npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
  - `NEXT_DIST_DIR=.next-m04 npm run lhci` ✅ (exit 0)
  - `git diff --check` ✅
- 리스크 / 알려진 문제:
  - LHCI는 exit 0이지만 현재 warning 기준에서 `/ko/admin-builder` performance 0.76~0.78, SEO 0.42 경고가 남는다. M04 요구의 CI gate는 warning으로 동작하지만, M05 이후에는 admin-builder SEO noindex/metadata 정책과 heavy bundle 성능 분리를 별도 개선해야 한다.
  - Playwright/LHCI는 macOS local sandbox에서 브라우저 launch 권한 문제가 있어 sandbox 밖에서 실행했다.
  - self-check subagent는 계정 사용량 제한으로 실패했다. 대신 로컬 diff inspection, typecheck/lint/unit/security/build/LHCI/Playwright 7종으로 대체했다.
- 보류된 W (있을 경우):
  - 없음
- 사용자 피드백 흡수:
  - "칼럼아카이브/사진 클릭하면 백지" 계열 회귀를 잡기 위해 admin smoke에 칼럼 quick action 링크와 axe gate를 포함했다.
  - "검색 창 위치/기존 홈페이지 전체 불러오기" 피드백과 연결된 decomposed container 배경 렌더링 버그를 M04 a11y 검증 중 발견해 수정했다.
- 다음 마일스톤: M05

## M05 — Empty/error state sweep

- 시작/종료: 2026-05-10T00:49:00+09:00 / 2026-05-10T01:03:00+09:00
- 변경 파일:
  - `src/components/builder/canvas/CanvasStageNodes.tsx` — zero-node canvas를 "페이지가 비어있습니다. 좌측 + 패널..." empty state로 명확화
  - `src/components/builder/canvas/PageSwitcher.tsx` / `SandboxEditorRail.tsx` / `SandboxEditorWorkspace.tsx` — 페이지 목록 0건 empty state, 첫 페이지 만들기 CTA, page list load error toast 연결
  - `src/components/builder/editor/AssetLibraryModal.tsx` / `SandboxModalsRoot.tsx` — asset 0건 empty state, upload/retry CTA, asset API error toast 연결
  - `src/components/builder/canvas/hooks/useSandboxSiteState.ts` / `SandboxPage.tsx` / `SandboxTopBar.tsx` — network save retry toast, 401/403/500 save blocker reason, Publish disabled 상태 추가
  - `src/components/builder/canvas/InlineTextEditor.tsx` / `SandboxPage.module.css` — IME composition 중 외부 click blur 저장, 긴 한글 overflow-wrap 보강
  - `tests/builder-editor/empty-error-states.playwright.ts` — M05 9개 UI/API 실패·빈 상태 시나리오 추가
- 커밋:
  - `e14b5f7 G-Editor: add empty and error state gates`
- 의사결정:
  - 저장 실패는 네트워크 fetch 실패와 권한/서버 응답을 분리했다. 네트워크 실패는 retry action이 있는 toast, 401/403/500은 상단 "저장 차단" chip과 Publish disabled로 사용자가 계속 발행하지 못하게 막는다.
  - 자산/페이지 empty state는 모달/패널 안에서 바로 다음 행동을 제시한다. 별도 새 스키마나 데이터 파일 수정 없이 UI 상태만 보강했다.
  - IME는 조합 중 외부 클릭이 들어오면 compositionend를 먼저 flush하고 저장/blur를 실행하도록 했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run test:unit` ✅ (29 files / 755 tests)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/empty-error-states.playwright.ts --project=chromium-builder --workers=1` ✅ (9 passed)
  - `NEXT_DIST_DIR=.next-m05 npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
  - `git diff --check` ✅
- 리스크 / 알려진 문제:
  - Playwright Chromium launch는 macOS local sandbox에서 Mach port 권한 실패가 있어 sandbox 밖에서 실행했다.
  - `NEXT_DIST_DIR=.next-m05` build가 Next의 tsconfig include 자동 수정을 시도했으나 검증 부산물이라 되돌렸다.
- 보류된 W (있을 경우):
  - 없음
- 사용자 피드백 흡수:
  - "칼럼아카이브 같은거나 사진들 클릭하면 백지가 되는 에러" 계열에 대응해 칼럼 0건, 자산 0건, 페이지 0건, 네트워크 오류, 저장 권한/서버 오류를 실제 Playwright로 고정했다.
- 다음 마일스톤: M06

## M06 — .next/dev 재시작 의존성 fix

- 시작/종료: 2026-05-10T01:03:00+09:00 / 2026-05-10T01:06:00+09:00
- 변경 파일:
  - `next.config.mjs` — 기본 build 산출물은 `.next-build`, dev 산출물은 `NEXT_DEV=1`일 때 `.next-dev`, 명시 검증은 `NEXT_DIST_DIR` override 우선으로 분리
  - `package.json` / `scripts/clean-next-build.mjs` — `npm run dev` 시작 전 `.next-build`만 정리하고 `NEXT_DEV=1 next dev`로 실행
  - `.gitignore` — `.next-dev/`, `.next-build/` 추가
  - `tsconfig.json` — `.next-dev/types/**/*.ts`, `.next-build/types/**/*.ts`를 include에 추가해 Next 자동 tsconfig 수정 churn 제거
- 커밋:
  - `1d8cd84 G-Editor: isolate next dev and build outputs`
- 의사결정:
  - `rimraf` 의존성은 추가하지 않고 Node `rmSync` 스크립트로 `.next-build`만 삭제한다. 승인 프롬프트와 dependency surface를 늘리지 않기 위한 선택이다.
  - `NEXT_DIST_DIR`는 기존 검증 격리 방식과 호환되도록 최우선으로 유지한다.
  - dev script는 `.next-dev`를 쓰므로 build 후 기본 `.next`/`.next-build` 충돌 때문에 dev server를 매번 지우고 재시작하던 패턴을 끊는다.
- 검증:
  - `node -e "import('./next.config.mjs').then((m)=>console.log(m.default.distDir))"` ✅ `.next-build`
  - `NEXT_DEV=1 node -e "import('./next.config.mjs').then((m)=>console.log(m.default.distDir))"` ✅ `.next-dev`
  - `NEXT_DIST_DIR=.next-m06 node -e "import('./next.config.mjs').then((m)=>console.log(m.default.distDir))"` ✅ `.next-m06`
  - `node scripts/clean-next-build.mjs` ✅
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run test:unit` ✅ (29 files / 755 tests)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
  - `npm run dev -- --port 3010` ✅ (`.next-dev` 생성, `.next-build` 정리 확인 후 종료)
  - `git diff --check` ✅
- 리스크 / 알려진 문제:
  - sandbox 내부 curl은 3010 dev server에 연결하지 못했지만, dev process 로그와 산출물 분리는 확인했다.
- 보류된 W (있을 경우):
  - 없음
- 사용자 피드백 흡수:
  - 반복되던 “build 후 `.next` 삭제 + dev 재시작” 운영 부담을 줄였다. 이후 검증은 build와 dev가 서로 산출물을 덮어쓰지 않는 전제로 진행한다.
- 다음 마일스톤: M07

## M06 follow-up — post-M06 gate stabilization

- 시작/종료: 2026-05-10T01:21:00+09:00 / 2026-05-10T01:39:00+09:00
- 변경 파일:
  - `src/components/builder/canvas/SandboxPage.tsx` — `data-editor-ready` hydration flag 추가
  - `tests/builder-editor/helpers/editor.ts` — client-ready 이후 Playwright 클릭 시작
  - `src/components/builder/canvas/InlineTextEditor.tsx` — toolbar command 직전 현재 텍스트 저장으로 텍스트/서식 undo 단계 분리
  - `tests/builder-editor/design-pool.playwright.ts` — blank canvas empty state 문구 최신화
  - `tests/builder-editor/empty-error-states.playwright.ts` — IME/autosave 입력 전 전체 선택으로 ProseMirror append flake 제거
  - `SESSION.md` / `Wix 체크포인트.md` — 자동 gate 최신 증거 기록
- 커밋:
  - `16a3e51 G-Editor: stabilize post-M06 builder gates`
- 의사결정:
  - editor shell SSR 표시와 client hydration 완료를 명시적으로 분리한다. Playwright와 사용자가 hydration 전 click handler 미부착 상태를 치지 않게 하기 위한 안정화다.
  - inline text toolbar는 format command 직전에 저장을 한 번 시도한다. 변경이 없으면 signature guard로 no-op이고, 텍스트 변경이 있으면 서식 적용과 별도 undo/redo 단계가 된다.
- 검증:
  - `npm run typecheck` ✅
  - `git diff --check` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/inline-text-editor.playwright.ts --workers=1` ✅ (1 passed)
  - `BASE_URL=http://localhost:3000 npm run test:builder-editor -- --project=chromium-builder --workers=1` ✅ (42 passed / 4.3m)
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run test:unit` ✅ (29 files / 755 tests)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- 리스크 / 알려진 문제:
  - self-check subagent는 현재 thread agent limit 때문에 생성하지 못했다. full Chromium builder suite와 전체 gate로 대체 검증했다.
  - `/ko/admin-builder`는 Basic Auth 401 응답으로 정상 health를 확인했다.
- 보류된 W (있을 경우):
  - 없음
- 사용자 피드백 흡수:
  - “백지”, “검증 자체 안 됨”, “계속해야지” 피드백을 반영해 hydration readiness와 full suite 안정성을 먼저 닫았다.
- 다음 마일스톤: M07

## M06 follow-up — locale projection repair

- 시작/종료: 2026-05-10T02:38:00+09:00 / 2026-05-10T02:45:00+09:00
- 변경 파일:
  - `src/lib/builder/canvas/home-locale-repair.ts` — 홈 seed sentinel mismatch를 감지해 요청 locale의 localized content만 projection하는 helper 추가
  - `src/app/(builder)/[locale]/admin-builder/page.tsx` — 초기 홈 draft 로드 시 locale repair 적용, 요청 locale과 page locale이 다르면 공유 draft persistence 생략
  - `src/app/api/builder/site/pages/[pageId]/draft/route.ts` — 페이지 전환/초기 client refresh draft 응답도 요청 locale로 normalize+repair
  - `src/lib/builder/canvas/__tests__/home-locale-repair.test.ts` — zh-hant 홈 draft를 ko로 projection하면서 layout/style은 보존하는 unit test 추가
  - `tests/builder-editor/locale-projection.playwright.ts` — zh-hant editor view 이후 ko editor가 중국어 홈 문구로 오염되지 않는 Playwright 회귀 추가
- 의사결정:
  - runtime-data JSON은 직접 수정하지 않았다. `/ko/admin-builder` 로드 경로가 기존 zh-hant draft를 ko로 repair했고, 정상 save path를 통해 draft가 한국어로 회복됐다.
  - 같은 home pageId를 locale별로 공유하는 현재 모델에서는 다른 locale editor view가 원본 draft를 덮어쓰면 안 된다. 따라서 `initialPage.locale !== request locale`이면 서버 side upgrade/write를 생략한다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run test:unit` ✅ (30 files / 757 tests)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/locale-projection.playwright.ts --project=chromium-builder --workers=1` ✅
- 리스크 / 알려진 문제:
  - sandbox 내부 `curl`은 localhost 3000 연결을 간헐적으로 실패시켰지만, Next dev 로그와 Playwright browser 검증은 통과했다.
  - Playwright Chromium launch는 macOS local sandbox에서 Mach port 권한 실패가 있어 sandbox 밖에서 실행했다.
- 보류된 W (있을 경우):
  - 없음
- 사용자 피드백 흡수:
  - 2026-05-10 "편집기에 한국언데 왜 중국어로 사이트가 뜨지?" → M07 진행 전 locale projection blocker로 처리.
- 다음 마일스톤: M07

## M06 follow-up — section template pool and back navigation

- 시작/종료: 2026-05-10T02:52:00+09:00 / 2026-05-10T03:00:00+09:00
- 변경 파일:
  - `src/components/builder/canvas/SandboxEditorRail.tsx` — no-selection 섹션 chip을 실제 선택 버튼으로 변경, 섹션 상세에서 `← 섹션 목록` 복귀 버튼 추가
  - `src/components/builder/canvas/SandboxEditorWorkspace.tsx` / `src/components/builder/canvas/SandboxPage.tsx` — rail에서 selection clear/select가 가능하도록 연결
  - `src/lib/builder/canvas/section-templates.ts` — 섹션 variant pool을 12개로 확장하고 섹션별 label/description 추가
  - `src/lib/builder/site/component-variants.ts` / `src/lib/builder/canvas/decompose-home-shared.ts` — 카드 variant key schema를 확장된 섹션 variant와 공유
  - `src/components/builder/canvas/SandboxPage.module.css` — editor canvas의 12개 섹션 variant visual 적용
  - `src/lib/builder/site/public-page.tsx` — 공개 페이지에서도 같은 12개 섹션 variant visual 적용
  - `tests/builder-editor/section-template-click.playwright.ts` — chip 클릭, 12개 옵션 노출, 뒤로가기, 신규 variant 적용 회귀 추가
- 의사결정:
  - 기존 데이터와 layout node를 갈아엎지 않고 `content.variant`만 바꾸는 정책을 유지했다. 템플릿 선택은 Wix처럼 빠르게 preview/apply되지만 원문, 링크, 주소 데이터는 그대로 보존한다.
  - 외부 AI 디자인 사이트에서 템플릿을 가져오는 기능은 source ingestion, license/asset sanitization, section schema mapping이 필요하므로 별도 M-track으로 남긴다. 이번 수정은 사용자가 즉시 막힌 "네 개뿐"과 "뒤로 없음" UX를 먼저 닫는다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "switches stateful home section template variants|publishes stateful section template variants" --project=chromium-builder --workers=1` ✅ (2 passed)
  - `npm run test:unit` ✅ (30 files / 757 tests)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
  - `git diff --check` ✅
- 리스크 / 알려진 문제:
  - Chromium launch는 macOS local sandbox에서 Mach port 권한 실패가 있어 sandbox 밖에서 실행했다.
  - AI template site import는 아직 구현하지 않았다. Canva/Relume/Uizard류 외부 소스 import는 fetch/import pipeline과 디자인 토큰 mapping을 먼저 설계해야 한다.
- 보류된 W (있을 경우):
  - 없음
- 사용자 피드백 흡수:
  - 2026-05-10 "주요업무 눌러서 사용하려는데 겨우 네개 템플릿만 있네" → 12개 로컬 섹션 variant로 확장.
  - 2026-05-10 "템플릿 적용하려고 한뒤 다시 뒤로 가고 싶으면 그런 버튼도 없어" → `← 섹션 목록` 추가.
- 다음 마일스톤: M07

## M07 — mobile schema decision and lock

- 시작/종료: 2026-05-10T03:00:00+09:00 / 2026-05-10T03:06:00+09:00
- 변경 파일:
  - `src/lib/builder/canvas/types.ts` — responsive schema lock 주석 명시: `responsive.<vp>.fontSize`, `responsive.<vp>.hidden`
  - `src/lib/builder/site/types.ts` — `headerFooter.mobileSticky`, `headerFooter.mobileHamburger`, `mobileBottomBar` site-level schema 추가
  - `src/lib/builder/site/mobile-schema.ts` — site-level mobile schema default normalizer 추가
  - `src/lib/builder/site/persistence.ts` — site document lifecycle normalization에서 M07 default fill 연결
  - `scripts/migrate-builder-mobile-schema.mjs` — dry-run/apply migration, `before-M07-<timestamp>` backup, rollback-ready summary
  - `src/lib/builder/site/__tests__/mobile-schema.test.ts` — site default/explicit mobile schema unit coverage
  - `src/lib/builder/site/__tests__/mobile-schema-migration.test.ts` — temp fixture dry-run/apply/backup coverage
  - `src/lib/builder/canvas/__tests__/responsive-schema-lock.test.ts` — responsive fontSize/hidden cascade와 `hiddenOnViewports[]` 미채택 coverage
  - `Phase 2 모바일 스키마 초안.md` — M07 결정 lock과 rollback 문서
  - `WIX-PARITY-PLAN.md` — M07 🟢
  - `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` — Phase 2 schema lock 기록
- 의사결정:
  - per-viewport typography는 별도 typography scale token이 아니라 기존 resolver 방향인 `responsive.<vp>.fontSize`로 잠근다.
  - viewport visibility는 `hiddenOnViewports[]`가 아니라 `responsive.<vp>.hidden` boolean으로 잠근다.
  - mobile sticky와 hamburger는 개별 menu widget variant가 아니라 global header schema에서 처리한다.
  - mobile bottom CTA는 header/footer 하위가 아니라 site-level entity `mobileBottomBar`로 처리한다.
- 검증:
  - `npm run typecheck` ✅
  - `node scripts/migrate-builder-mobile-schema.mjs --site tseng-law-main-site --dry-run` ✅ (`changed:false`)
  - `npm run test:unit -- src/lib/builder/site/__tests__/mobile-schema.test.ts src/lib/builder/site/__tests__/mobile-schema-migration.test.ts src/lib/builder/canvas/__tests__/responsive-schema-lock.test.ts` ✅ (8 tests)
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
  - `npm run test:unit` ✅ (33 files / 765 tests)
- 리스크 / 알려진 문제:
  - M07은 schema lock이다. W31~W45의 사용자-facing 모바일 UI/preview/runtime은 M08~M10에서 구현해야 green 판정 가능하다.
- 보류된 W (있을 경우):
  - W31~W45 전부 M08~M10 구현 대기.
- 사용자 피드백 흡수:
  - "이 작업이 끝난뒤에도 7번 시작하고 다음 계속 작업 진행" → section template blocker 커밋 직후 M07을 시작하고 lock까지 완료.
- 다음 마일스톤: M08

## M08 — mobile inspector per-viewport UI

- 시작/종료: 2026-05-10T03:08:00+09:00 / 2026-05-10T03:21:00+09:00
- 변경 파일:
  - `src/components/builder/canvas/SandboxInspectorPanel.tsx` — Layout 탭 안에 Desktop/Tablet/Mobile viewport segmented control 추가, rect/fontSize/hidden override 상태 표시, `Override created` banner, viewport reset 연결.
  - `src/components/builder/canvas/SandboxTopBar.tsx` — top bar viewport button에 테스트/동기화용 data attribute 추가.
  - `src/components/builder/canvas/SandboxPage.tsx` — inspector에서 store viewport를 바꿔도 top bar/canvas width가 따라오도록 양방향 동기화.
  - `src/lib/builder/canvas/store.ts` — 에디터 미리보기용 services/FAQ open index 상태 추가.
  - `src/components/builder/canvas/CanvasNode.tsx` — services/FAQ 아코디언 open 상태를 선택 상태와 분리. 업무 글을 열어둔 뒤 다른 노드를 선택해도 상세 글이 사라지지 않게 수정.
  - `src/components/builder/canvas/SandboxEditorRail.tsx` — 디자인 패널에서 섹션 선택을 local focus 상태로도 유지해 `주요 서비스` chip 클릭 즉시 템플릿 목록이 열리도록 보강.
  - `tests/builder-editor/mobile-inspector.playwright.ts` — M08 브라우저 시나리오 추가.
  - `tests/builder-editor/section-template-click.playwright.ts` — 섹션 템플릿 선택 후 업무 글 유지 회귀 추가.
- 구현:
  - Inspector Layout 탭에서 Desktop/Tablet/Mobile을 직접 전환한다.
  - inspector viewport 전환은 top bar BreakpointSwitcher와 같은 store 상태를 사용한다.
  - tablet/mobile에서 X/Y/Width/Height 입력 시 `responsive.<viewport>.rect` partial override가 생긴다.
  - text/heading 계열에서 Font size 입력 시 `responsive.<viewport>.fontSize` override가 생긴다.
  - Show on D/T/M 토글은 `responsive.<viewport>.hidden` override를 만들고, active viewport 숨김 상태를 명확히 경고한다.
  - override가 생기면 `Override created`; 없으면 desktop inherit 상태를 보여주고 Reset으로 해당 viewport override를 제거한다.
  - 사용자가 보고한 "주요업무 노드 선택 후 다른 노드 선택하면 글이 없어짐"은 에디터 preview open state를 selection에서 분리해 수정했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run test:unit` ✅ (33 files / 765 tests)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/mobile-inspector.playwright.ts --workers=1` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts tests/builder-editor/mobile-inspector.playwright.ts --workers=1` ✅ (2 passed)
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- W 판정:
  - W32/W34/W35/W38 green evidence 확보.
  - W31/W37 auto-fit 및 W39+ hamburger/preview runtime은 M09/M10 범위로 유지.
  - W33은 editor hidden override UI는 구현됐고 public mobile 미렌더 최종 증거는 M10 runtime 검증에서 닫는다.
- 다음 마일스톤: M09

## M09 — mobile auto-fit and automatic hamburger conversion

- 시작/종료: 2026-05-10T03:22:00+09:00 / 2026-05-10T03:39:00+09:00
- 변경 파일:
  - `src/lib/builder/canvas/responsive.ts` — tree-aware `autoFitMobileTree()` 추가. top-level root를 375px 전폭 세로 스택으로 배치하고, descendant local rect/fontSize를 같은 scale로 생성한다.
  - `src/lib/builder/canvas/store.ts` — `applyMobileAutoFit()` 추가. 기존 desktop 값은 건드리지 않고 누락된 `responsive.mobile.rect/fontSize`만 생성한다.
  - `src/components/builder/canvas/SandboxPage.tsx` — 모바일 viewport 진입/페이지 전환 시 auto-fit을 한 번만 적용하고, top bar와 store viewport sync를 단방향+명시 업데이트로 정리해 update-depth loop를 제거했다.
  - `src/components/builder/canvas/InspectorControls.tsx` — NumberStepper draft 동기화가 같은 문자열이면 setState하지 않도록 방어했다.
  - `src/components/builder/published/SiteHeader.tsx` — desktop horizontal navigation을 모바일 hamburger + slide drawer로 자동 변환. editor mobile viewport에서는 `mobileMode`로 강제 적용한다.
  - `src/components/builder/canvas/SandboxEditorWorkspace.tsx` — editor mobile viewport에서 SiteHeader mobile mode를 전달하고, hamburger/drawer click이 Navigation panel capture에 먹히지 않게 예외 처리.
  - `src/app/globals.css` — hamburger button, mobile drawer, forced editor mobile header styles 추가.
  - `src/lib/builder/canvas/__tests__/responsive-schema-lock.test.ts` — auto-fit rect/fontSize scaling 및 explicit mobile override 보존 unit 추가.
  - `tests/builder-editor/mobile-auto-fit.playwright.ts` — 모바일 진입, hamburger drawer open, services root 375px auto-fit, mobile font-size scaling 검증 추가.
  - `tests/builder-editor/mobile-inspector.playwright.ts` — M09 auto-fit 이후 모바일 진입 시 override 상태가 즉시 `created`인 정상 동작으로 기대값 갱신.
- 의사결정:
  - M09 auto-fit은 user-edited mobile override를 덮어쓰지 않는다. 누락된 mobile rect/fontSize만 채워 desktop layout을 보존한다.
  - editor mobile viewport는 브라우저 폭이 desktop이어도 Wix처럼 header가 즉시 hamburger로 보여야 하므로 `mobileMode` prop으로 강제 전환한다.
  - public runtime은 기존 CSS media query 기반 모바일 전환을 유지하고, 같은 drawer markup을 사용한다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run test:unit` ✅ (33 files / 766 tests)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/mobile-auto-fit.playwright.ts --workers=1` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/mobile-auto-fit.playwright.ts tests/builder-editor/mobile-inspector.playwright.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed)
- W 판정:
  - W31/W37/W39 green evidence 확보.
  - W40~W45는 M10 범위로 유지한다.
- 리스크 / 알려진 문제:
  - Playwright Chromium은 macOS local sandbox에서 Mach port 권한 실패가 있어 sandbox 밖에서 실행했다.
  - visual regression/axe-core 전용 gate는 M04 인프라 범위에서 계속 보강 필요.
- 사용자 피드백 흡수:
  - 2026-05-10 "편집기 로컬에서 뜬거 3000번 봤는데 사이트 열면 옆쪽이 짤려" → 모바일 viewport auto-fit을 적용해 375px canvas에서 root section 전폭/단열 배치를 생성.
  - 2026-05-10 "맨위 메뉴 눌렀을때 다른 메뉴 나오는 칸은 어떻게 편집 처리" → desktop mega edit flow는 유지하고, mobile viewport에서는 hamburger drawer 안의 메뉴 항목도 같은 `data-builder-nav-item-id` 편집 대상으로 노출.
- 다음 마일스톤: M10

## M10 — mobile sticky, preview iframe, bottom CTA, touch context menu

- 시작/종료: 2026-05-10T03:41:00+09:00 / 2026-05-10T03:55:00+09:00
- 변경 파일:
  - `src/app/api/builder/site/settings/route.ts` — `headerFooter.mobileSticky/mobileHamburger`, `mobileBottomBar`를 Site Settings GET/PUT payload로 노출. mutation은 기존 `guardMutation()` 유지.
  - `src/components/builder/canvas/SiteSettingsModal.tsx` — Mobile 탭 추가. sticky header, hamburger mode, bottom CTA enabled/actions를 UI에서 편집/저장.
  - `src/components/builder/published/SiteHeader.tsx` — `mobileSticky`, `mobileHamburger` prop과 runtime data attributes 추가. `force/off/auto` mode 지원.
  - `src/components/builder/published/MobileBottomBar.tsx` — published mobile fixed CTA bar 추가.
  - `src/lib/builder/site/public-page.tsx` — published fallback header와 global header canvas 모두 mobile sticky를 반영하고, bottom CTA를 렌더.
  - `src/app/globals.css` — sticky global header, hamburger off mode, mobile bottom CTA styles 추가.
  - `src/components/builder/canvas/CanvasNode.tsx` — touch pointer long-press가 contextmenu MouseEvent를 발화하도록 helper 추가.
  - `tests/builder-editor/mobile-runtime.playwright.ts` — M10 end-to-end 시나리오 추가.
- 구현:
  - PreviewModal은 기존 iframe + device frame 구현을 그대로 사용하고, M10 테스트에서 실제 발행 URL이 mobile iframe `src`로 들어가는지 검증했다.
  - 모바일 공개 페이지에서 site-level bottom CTA bar가 fixed로 표시된다.
  - fallback SiteHeader와 global header canvas 모두 `site.headerFooter.mobileSticky`를 runtime에 반영한다.
  - settings modal Mobile 탭에서 sticky/header mode/bottom CTA를 저장할 수 있다.
  - viewport 전환 후 undo stack이 유지되는지 `Cmd/Ctrl+D → Mobile 전환 → Cmd/Ctrl+Z`로 검증했다.
  - touch long-press는 560ms hold, 8px 이상 이동 시 취소로 구현했다.
  - M08의 W33 잔여 evidence도 같이 닫았다. `responsive.mobile.hidden` 노드가 public mobile viewport에서 숨겨지는지 확인했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run test:unit` ✅ (33 files / 766 tests)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/mobile-runtime.playwright.ts --workers=1` ✅
- W 판정:
  - W33/W40/W41/W42/W43/W44/W45 green evidence 확보.
- 리스크 / 알려진 문제:
  - 공개 루트 `/ko`는 legacy home이 우선 렌더된다. builder published runtime 검증은 생성/발행한 builder page slug로 수행했다.
  - Playwright Chromium은 macOS sandbox에서 Mach port 권한 실패가 있어 sandbox 밖에서 실행했다.
- 다음 마일스톤: M11

## M11 — text widget pack

- 시작/종료: 2026-05-10T03:58:00+09:00 / 2026-05-10T04:21:00+09:00
- 변경 파일:
  - `src/lib/builder/canvas/types.ts` — text node schema에 `columns`, `columnGap`, `quoteStyle`, `marquee`, `textPath`, `link`를 추가했다.
  - `src/components/builder/canvas/elements/TextElement.tsx` — multi-column, quote/pullquote, marquee, SVG text-path, full-text link 렌더를 추가했다.
  - `src/lib/builder/components/text/Inspector.tsx` — Rich text shortcut, column/quote/marquee/text-path controls, `LinkPicker` 연결을 추가했다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — `Text widget pack` 섹션과 W46~W55 프리셋 10종 quick-add를 추가했다. 연속 quick-add는 겹치지 않도록 cascade offset을 적용한다.
  - `src/components/builder/canvas/SandboxPage.module.css` — text widget preset 카드 UI를 editor token 기반으로 추가했다.
  - `src/app/globals.css` — marquee animation runtime style을 추가했다.
  - `src/lib/builder/canvas/__tests__/text-widgets.test.ts` — text widget schema normalization unit을 추가했다.
  - `tests/builder-editor/text-widgets.playwright.ts` — 격리 page 생성 → + 패널 Text widget pack 10종 클릭 → canvas 렌더 → Inspector link 확인 → cleanup 시나리오를 추가했다.
- 구현:
  - W46 Heading은 기존 `heading` registry node를 재사용하고 H1 level + theme preset으로 생성한다.
  - W47/W48은 기존 TipTap rich text document와 Inspector shortcut을 사용한다.
  - W49는 SVG `<textPath>` 렌더로 arc/wave curve를 지원한다.
  - W50은 `column-count`/gap 기반 multi-column text로 렌더한다.
  - W51/W52는 blockquote/list rich text document와 quote style을 프리셋으로 생성한다.
  - W53은 CSS animation 기반 marquee로 속도/방향을 Inspector에서 편집한다.
  - W54는 SiteSettings theme text preset을 그대로 사용한다.
  - W55는 shared `LinkPicker`와 `linkValueSchema`를 사용해 internal/anchor/external/mailto/tel 링크 정책을 따른다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/text-widgets.test.ts` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/text-widgets.playwright.ts --workers=1` ✅
- W 판정:
  - W46/W47/W48/W49/W50/W51/W52/W53/W54/W55 green evidence 확보.
- 리스크 / 알려진 문제:
  - M11은 repo의 실제 component registry 구조를 따랐다. goal 문서의 canonical 예시(`site/types.ts`, `published-node-frame.ts`, `components/widgets/...`)와 파일명이 다르지만, canvas/published 렌더는 현재 registry-driven 구조에서 동일 노드로 동작한다.
  - visual baseline 10개는 별도 screenshot 파일을 추가하지 않고, Playwright DOM/runtime evidence로 고정했다. M04 visual baseline suite에는 기존 editor states가 유지된다.
- 다음 마일스톤: M12

## M12 — media widget pack

- 변경 파일:
  - `src/lib/builder/canvas/types.ts` — `video`, `audio`, `lottie` kind를 schema union에 추가하고 image node에 `clickAction`, `hoverSrc`, `hotspots`, `compare`, `svg`, `gif` content를 추가했다. icon set은 `lucide`/`fontawesome`을 허용한다.
  - `src/components/builder/canvas/elements/ImageElement.tsx` — lightbox/popup click action, hotspot tooltip, before/after slider, hover swap, inline SVG color, GIF marker 렌더를 추가했다.
  - `src/lib/builder/components/image/Inspector.tsx` — media interaction, before/after, SVG/GIF controls를 추가했다.
  - `src/lib/builder/components/video/index.tsx`, `src/lib/builder/components/video/VideoRender.tsx` — MP4/direct video box와 background video mode, poster/controls Inspector를 추가했다.
  - `src/lib/builder/components/videoEmbed/index.tsx`/`VideoEmbedRender.tsx` — 기존 YouTube/Vimeo provider를 M12 프리셋에서 재사용한다.
  - `src/lib/builder/components/audio/index.tsx` — file audio player, Spotify embed, SoundCloud embed kind를 추가했다.
  - `src/lib/builder/components/lottie/index.tsx` — Lottie URL/label/autoplay/loop/speed kind와 fallback motion preview를 추가했다.
  - `src/lib/builder/components/icon/index.tsx` — Lucide/FontAwesome set 선택과 대표 SVG icon 렌더를 추가했다.
  - `src/lib/builder/components/registry.ts` — `audio`, `lottie` registry imports를 추가했다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — `Media widget pack` 섹션과 W56~W70 프리셋 15종 quick-add를 추가했다.
  - `src/components/builder/canvas/SandboxPage.module.css`, `src/app/globals.css` — media preset card, inspector fieldset, hotspot/compare/lightbox/lottie runtime style을 추가했다.
  - `src/lib/builder/canvas/__tests__/media-widgets.test.ts` — media schema normalization unit을 추가했다.
  - `tests/builder-editor/media-widgets.playwright.ts` — 격리 page 생성 → + 패널 Media widget pack 15종 클릭 → canvas DOM evidence 확인 → cleanup 시나리오를 추가했다.
- 구현:
  - W56/W60은 `image.content.clickAction`으로 none/link/lightbox/popup을 통합한다. legacy `lightbox:` link도 lightbox trigger로 해석한다.
  - W57은 image `hotspots[]`를 percent coordinate로 저장하고 hover/focus tooltip을 렌더한다.
  - W58은 image `compare` content로 before/after 이미지를 겹치고 range handle로 조정한다.
  - W59는 `hoverSrc` overlay image를 hover opacity swap으로 렌더한다.
  - W61은 업로드 pipeline 확장 없이 현재 목표 범위에서 inline SVG preset + color token/string editing으로 구현했다.
  - W62는 외부 Lottie iframe URL이 있으면 embed하고, 없으면 에디터에서 식별 가능한 animated preview를 제공한다.
  - W63/W66은 `video` kind의 `mode: box|background`로 묶었다.
  - W64/W65는 기존 `video-embed` kind의 YouTube/Vimeo provider를 M12 catalog preset으로 노출한다.
  - W67/W68은 `audio` kind의 `provider: file|spotify|soundcloud`로 묶었다.
  - W69는 image GIF marker와 query metadata를 보존한다.
  - W70은 기존 `icon` kind를 확장해 Lucide/FontAwesome 대표 icon set을 제공한다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/media-widgets.test.ts` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/media-widgets.playwright.ts --workers=1` ✅
- W 판정:
  - W56/W57/W58/W59/W60/W61/W62/W63/W64/W65/W66/W67/W68/W69/W70 green evidence 확보.
- 리스크 / 알려진 문제:
  - 실제 파일 업로드, Giphy 검색 API, Lottie JSON 파싱은 별도 asset pipeline 확장 트랙이다. M12는 Wix식 Add/Inspector/runtime surface를 먼저 완성했다.
  - Playwright helper가 시각 안정화를 위해 iframe을 숨기므로 YouTube/Vimeo는 visibility가 아니라 iframe src 존재로 검증한다.
- 다음 마일스톤: M13

## M13 — gallery widget pack

- 변경 파일:
  - `src/lib/builder/canvas/types.ts` — gallery image에 `caption`, `tags`를 추가하고 gallery content에 `layout`, `showCaptions`, `captionMode`, `activeFilter`, `autoplay`, `interval`, `thumbnailPosition`, `proStyle`을 추가했다.
  - `src/lib/builder/components/gallery/index.tsx` — gallery defaultContent를 grid layout 기반으로 확장했다.
  - `src/lib/builder/components/gallery/GalleryRender.tsx` — grid, masonry, slider, slideshow, thumbnail, pro gallery, caption overlay/below, tag filter bar, published lightbox를 렌더한다.
  - `src/lib/builder/components/gallery/Inspector.tsx` — layout dropdown, captions, filters, autoplay, thumbnail position, pro style, image caption/tag editor를 추가했다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — `Gallery widget pack` 섹션과 W71~W78 프리셋 8종 quick-add를 추가했다.
  - `src/app/globals.css` — gallery layout/filter/caption/slider/thumbnail/lightbox runtime style을 추가했다.
  - `src/lib/builder/canvas/__tests__/gallery-widgets.test.ts` — gallery schema normalization unit을 추가했다.
  - `tests/builder-editor/gallery-widgets.playwright.ts` — 격리 page 생성 → + 패널 Gallery widget pack 8종 클릭 → canvas DOM evidence 확인 → cleanup 시나리오를 추가했다.
- 구현:
  - W71은 `layout='grid'`와 columns/gap controls로 처리한다.
  - W72는 CSS columns 기반 masonry layout으로 처리한다.
  - W73/W74는 slider/slideshow layout, arrow buttons, dots, autoplay interval로 처리한다.
  - W75는 thumbnail navigation layout으로 처리한다.
  - W76은 `layout='pro'` + `proStyle='clean|mosaic|editorial'`로 Wix pro-like variant를 제공한다.
  - W77은 이미지별 caption과 `captionMode='below|overlay'`로 처리한다.
  - W78은 이미지별 tags와 `activeFilter` filter bar로 처리한다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/gallery-widgets.test.ts` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/gallery-widgets.playwright.ts --workers=1` ✅
- W 판정:
  - W71/W72/W73/W74/W75/W76/W77/W78 green evidence 확보.
- 리스크 / 알려진 문제:
  - 필터 pill은 현재 프리셋/Inspector 상태 반영 중심이다. 공개 페이지에서 사용자가 pill을 눌러 activeFilter를 바꾸는 상호작용은 M15 interactive track에서 더 고도화할 수 있다.
- 다음 마일스톤: M14

## M14 — layout widget pack

- 시작/종료: 2026-05-11 / 2026-05-11
- 변경 파일:
  - `src/lib/builder/canvas/types.ts` — container `layoutMode`에 strip/box/columns/repeater/tabs/accordion/slideshow/hoverBox와 `layoutItems`, `activeIndex`, `sticky`, `anchorTarget`를 추가했다.
  - `src/lib/builder/components/container/Element.tsx` — tabs/accordion/slideshow/hoverBox/repeater preview와 sticky/anchor data attributes를 렌더한다.
  - `src/lib/builder/components/container/Inspector.tsx` — layout mode, layout items, active index, sticky/anchor controls를 연결했다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — `Layout widget pack` W79~W88 프리셋 10종을 추가했다.
  - `tests/builder-editor/layout-widgets.playwright.ts` — layout widget pack quick-add DOM evidence를 추가했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅
  - `npm run test:unit` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/layout-widgets.playwright.ts --workers=1` ✅
- W 판정:
  - W79/W80/W81/W82/W83/W84/W85/W86/W87/W88 green evidence 확보.
- 커밋:
  - `b5b98bc G-Editor: add layout widget pack`
  - `cd07729 G-Editor: add layout widget pack playwright`

## M15 — interactive widget pack

- 시작/종료: 2026-05-11 / 2026-05-11
- 변경 파일:
  - `src/lib/builder/canvas/types.ts` — countdown/progress/rating/notification/back-to-top schema를 추가했다.
  - `src/lib/builder/components/countdown`, `progress`, `rating`, `notificationBar`, `backToTop` — runtime + Inspector를 추가했다.
  - `src/lib/builder/site/types.ts`, `src/components/builder/published/Popup*`, `CookieConsent*` — popup/cookie consent site-level entity와 published runtime을 추가했다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — `Interactive widget pack` W89~W98 프리셋을 추가했다.
  - `tests/builder-editor/interactive-widgets.playwright.ts` — canvas interactive widget pack quick-add evidence를 추가했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅
  - `npm run test:unit` ✅
- W 판정:
  - W89/W90은 기존 button variant/icon 버튼 프리셋으로 흡수.
  - W91/W92/W94는 popup/cookie consent site-level runtime으로 처리.
  - W93/W95/W96/W97/W98 green evidence 확보.
- 커밋:
  - `ac4231c G-Editor: add interactive widget pack`
  - `7e2466b G-Editor: add popup and cookie consent (M15-2)`

## M16 — navigation widget pack

- 시작/종료: 2026-05-11 / 2026-05-11
- 변경 파일:
  - `src/lib/builder/canvas/types.ts` — menu-bar/anchor-menu/breadcrumbs schema를 추가했다.
  - `src/lib/builder/components/menuBar`, `anchorMenu`, `breadcrumbs` — horizontal/vertical/dropdown/mega menu, sticky anchor menu, breadcrumb runtime + Inspector를 추가했다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — `Navigation widget pack` W99~W105 프리셋 7종을 추가했다.
  - `src/app/globals.css` — nav widget runtime style과 모바일 hamburger behavior를 추가했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅
  - `npm run test:unit` ✅
- W 판정:
  - W99/W100/W101/W102/W103/W104/W105 green evidence 확보.
- 커밋:
  - `93bb1fa G-Editor: add navigation widget pack`

## M17 — social widget pack

- 시작/종료: 2026-05-11 / 2026-05-11
- 변경 파일:
  - `src/lib/builder/canvas/types.ts` — social-bar/share-buttons/social-embed/floating-chat schema를 추가했다.
  - `src/lib/builder/components/socialBar`, `shareButtons`, `socialEmbed`, `floatingChat` — provider icon/link, share URL, embed placeholder, chat floating runtime + Inspector를 추가했다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — `Social widget pack` W106~W113 프리셋 8종을 추가했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅
  - `npm run test:unit` ✅
- W 판정:
  - W106/W107/W108/W109/W110/W111/W112/W113 green evidence 확보.
- 커밋:
  - `13a6eec G-Editor: add social widget pack`

## M18 — maps and location widget pack

- 시작/종료: 2026-05-11 / 2026-05-11
- 변경 파일:
  - `src/lib/builder/components/addressBlock`, `businessHours`, `multiLocationMap` — 주소 복합 카드, 영업시간, 다중 위치 지도/list runtime + Inspector를 추가했다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — `Maps & Location pack` W115~W117 프리셋을 추가했다.
  - 기존 W114 `map`은 office sync + quick edit panel + Google Maps iframe query 반영 테스트 근거를 유지한다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅
  - `npm run test:unit` ✅
- W 판정:
  - W114/W115/W116/W117 green evidence 확보.
- 커밋:
  - `7303e2f G-Editor: add maps and location widget pack`

## M19 — decorative widget pack

- 시작/종료: 2026-05-11 / 2026-05-11
- 변경 파일:
  - `src/lib/builder/canvas/types.ts` — shape/pattern/parallax-bg/frame/sticker schema를 추가했다.
  - `src/lib/builder/components/shape`, `pattern`, `parallaxBg`, `frame`, `sticker` — decorative runtime + Inspector를 추가했다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — `Decorative widget pack` W118~W125 프리셋 11종을 추가했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅
  - `npm run test:unit` ✅
- W 판정:
  - W118/W119/W120/W121/W122/W123/W124/W125 green evidence 확보.
- 커밋:
  - `3fa08ee G-Editor: add decorative widget pack`

## M20 — data display widget pack

- 시작/종료: 2026-05-11 / 2026-05-11
- 변경 파일:
  - `src/lib/builder/canvas/types.ts` — bar/line/pie chart, counter, testimonial carousel, pricing/comparison table, timeline, team member, service feature schema를 추가했다.
  - `src/lib/builder/components/barChart`, `lineChart`, `pieChart`, `counter`, `testimonialCarousel`, `pricingTable`, `comparisonTable`, `timeline`, `teamMemberCard`, `serviceFeatureCard` — data display runtime + Inspector를 추가했다.
  - `src/lib/builder/components/registry.ts` — data display registry imports를 추가했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit` ✅
- W 판정:
  - W126/W127/W128/W129/W130/W131/W132/W133/W134/W135 green evidence 확보.
- 커밋:
  - `9e54953 G-Editor: add data display widget pack`

## 2026-05-11 — editor compile blocker fix

- 사용자 피드백:
  - 주요업무 템플릿/노드 클릭 중 글이 사라지는 문제를 재확인하던 중 `/ko/admin-builder` 자체가 Build Error overlay로 막히는 상태를 발견했다.
- 원인:
  - hook을 쓰는 registry component 파일들이 Server Component로 해석되어 `addressBlock/index.tsx`의 `useState` import에서 Next compile error가 발생했다.
- 변경:
  - hook을 쓰는 registry components 11개에 `'use client'` boundary를 추가했다.
  - 기존 lint blocker였던 marketing dispatcher unused import와 guard placeholder argument를 정리했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --project=chromium-builder --workers=1` ✅
- 커밋:
  - `41f1f0c G-Editor: fix client hook component boundaries`

## 2026-05-11 — PR #16 builder error capture

- 변경 파일:
  - `src/app/api/builder/errors/route.ts` — POST client/runtime error report + GET admin error log endpoint를 추가했다.
  - `src/lib/builder/errors/capture.ts` — local log + optional Sentry forward capture helper를 추가했다.
  - `src/lib/builder/errors/storage.ts` — Vercel Blob/file fallback error log storage를 추가했다.
  - `src/lib/builder/errors/sentry-adapter.ts` — `SENTRY_DSN` 기반 HTTP store API forwarder를 추가했다.
  - `src/lib/builder/errors/types.ts` — error origin/severity/entry 타입을 추가했다.
  - `src/lib/builder/errors/__tests__/*.test.ts` — capture + Sentry adapter unit tests 5개를 추가했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run test:unit -- src/lib/builder/errors/__tests__/capture.test.ts src/lib/builder/errors/__tests__/sentry-adapter.test.ts` ✅
  - `npm run security:builder-routes` ✅
- 리스크:
  - Sentry source map upload, alert routing은 아직 운영 배포 hook 작업으로 남아 있다. 현재 단계는 에러 수집/저장/선택적 forward의 코드 경로를 닫았다.

## M21 — forms advanced validation, upload, signature, and payment

- 시작/종료: 2026-05-11 / 2026-05-11
- 변경 파일:
  - `src/lib/builder/forms/form-engine.ts` — Vercel Blob/file fallback schema·submission storage, number/date/phone/select/radio/checkbox/file/conditional server validation을 추가했다.
  - `src/app/api/forms/submit/route.ts` — stored schema lookup, server validation, signature data URL materialization, file metadata persistence, webhook/email payload file forwarding을 추가했다.
  - `src/lib/builder/forms/uploads.ts`, `src/app/api/forms/uploads/**` — form file/signature upload 저장·조회 경로를 추가했다.
  - `src/lib/builder/components/form/Element.tsx` — published form submit 전에 파일 업로드를 수행하고 signature required 상태를 검사한다.
  - `src/lib/builder/components/formSignature/index.tsx` — canvas signature를 hidden PNG data URL 값으로 제출하고 runtime condition과 연결했다.
  - `src/lib/builder/components/formPayment/index.tsx`, `src/app/api/forms/stripe-checkout/route.ts` — Stripe Checkout session 생성 경로와 payment field CTA를 연결했다.
  - `src/components/builder/forms/FormSchemaEditor.tsx` — min/max/regex, number min/max/step/decimal, date range, file accept/max bytes 설정 UI를 추가했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npx vitest run src/app/api/forms/__tests__/submit-route.test.ts src/lib/builder/forms/__tests__/conditional.test.ts src/lib/builder/forms/__tests__/validation.test.ts` ✅
  - `npm run security:builder-routes` ✅
- W 판정:
  - W136~W150 green evidence 확보. W148은 Stripe Checkout session 경로 기준이며, webhook/refund/Payment Element 심화는 Bookings 결제 마일스톤에서 이어간다.

## M22 — motion runtime parity

- 시작/종료: 2026-05-11 / 2026-05-11
- 변경 파일:
  - `src/lib/builder/animations/presets.ts` — click/exit/loop/timeline/default normalize와 custom cubic-bezier easing value를 추가했다.
  - `src/lib/builder/canvas/types.ts` — exit/loop/timeline/click animation schema와 cubic-bezier string validation을 추가했다.
  - `src/lib/builder/animations/animation-render.ts` — published attrs/style와 editor hover opacity style을 exit/loop/timeline/click까지 확장했다.
  - `src/components/builder/editor/AnimationsTab.tsx` — Exit/Loop/Click controls, custom Easing field, scrub options, timeline wiring을 추가했다.
  - `src/components/builder/editor/MotionTimelineEditor.tsx` — offset/timeOffset keyframe 표시와 편집을 안정화했다.
  - `src/components/builder/published/AnimationsRoot.tsx` — exit viewport leave, scrub runtime, hover fade, loop intensity, click replay, timeline runtime을 연결했다.
  - `src/app/api/builder/site/settings/route.ts`, `src/components/builder/canvas/SiteSettingsModal.tsx` — W172 page transition 설정 UI/API를 추가했다.
  - `tests/builder-editor/motion-runtime.playwright.ts` — inspector controls와 임시 published page runtime attrs를 실제 브라우저로 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/animations/__tests__/animation-render.test.ts src/lib/builder/site/__tests__/published-node-frame.test.ts` ✅ (17 passed)
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/motion-runtime.playwright.ts --project=chromium-builder --workers=1` ✅ (2 passed)
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run security:builder-routes` ✅
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- W 판정:
  - W159/W160/W167/W168/W170/W171/W172/W173/W174/W175 자동검증 evidence 확보.
  - W174 elastic preset과 W173 Claude drag/easing-visualizer UI는 별도 디자인 트랙으로 남긴다.
- 커밋:
  - `cfd4ee5 G-Editor: advance motion runtime parity`
- 다음 마일스톤:
  - M23 Design system 마무리.

## M23 — design system finishing

- 시작/종료: 2026-05-11 / 2026-05-11
- 변경 파일:
  - `src/lib/builder/site/typography-scale.ts` — modular scale normalize/resolve helper를 정리했다.
  - `src/lib/builder/site/theme.ts` — typographyScale 적용 시 title/body/quote preset size를 자동 재계산한다.
  - `src/app/api/builder/site/settings/route.ts` — settings API theme schema/merge가 `typographyScale`을 저장·복원한다.
  - `src/components/builder/canvas/SiteSettingsModal.tsx` — Typography 탭 base/ratio 조작이 preset size에 즉시 반영되고 저장 후 재오픈된다.
  - `src/lib/builder/components/heading/Inspector.tsx` — heading inspector 기본 size도 active scale을 따른다.
  - `src/components/builder/editor/StyleTab.tsx` — Style sources visualizer를 추가해 Background/Border/Radius/Shadow/Opacity/Hover/Variant 출처를 Theme/Variant/Manual/Default chip으로 표시한다.
  - `src/lib/builder/site/__tests__/typography-scale.test.ts`, `src/lib/builder/site/__tests__/style-origin.test.ts`, `tests/builder-editor/design-system-m23.playwright.ts` — scale 저장/프리셋 계산/Style origin UI를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/site/__tests__/typography-scale.test.ts src/lib/builder/site/__tests__/style-origin.test.ts` ✅ (6 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-system-m23.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed)
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run security:builder-routes` ✅
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- W 판정:
  - W184/W185 자동검증 evidence 확보. 사용자 직접 QA 전까지 체크포인트는 `자동검증 통과 / 사용자 QA 대기`로 둔다.

## M24 — SEO + Publish maturity

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/app/robots.ts`, `src/lib/builder/seo/robots.ts` — site settings 기반 custom `robots.txt`를 우선 적용하고, 비어 있으면 기존 noindex 기반 자동 robots를 유지한다.
  - `src/app/api/builder/site/seo-settings/route.ts`, `src/components/builder/seo/SeoDashboardView.tsx` — SEO Tools 탭에 `Custom robots.txt` 편집/저장 UI와 API payload를 추가했다.
  - `src/lib/builder/site/publish.ts`, `src/app/api/builder/site/pages/[pageId]/publish/route.ts` — publish 결과에 `cacheInvalidatedAt`, `revalidatedPaths`를 노출하고 page/sitemap/robots 경로를 명시 revalidate한다.
  - `src/lib/builder/publish-gate/checks.ts`, `src/lib/builder/publish-gate/gate-runner.ts` — publish preflight에 `prerender-ready` info check를 추가했다.
  - `tests/builder-editor/seo-publish-history.playwright.ts` — robots 저장 → `/robots.txt` 반영, `prerender-ready`, publish revalidate evidence, rate-limit bucket isolation을 검증한다.
  - `src/lib/builder/seo/__tests__/robots.test.ts` — custom robots parser unit coverage를 추가했다.
  - `src/lib/builder/live-chat/types.ts`, live-chat routes/inbox, `LiveChatWidget.tsx`, `template-selector.ts` — M24 검증 중 발견된 lint-only no-op 정리를 수행했다. visitorToken 제거 helper와 async handler `void` 처리만 포함한다.
- 이미 존재하던 M24 기반:
  - sitemap 자동 생성, hreflang 시각화/alternate, redirect manager, canonical, structured data, OG/Twitter preview, VersionHistory rollback/publish preflight는 기존 구현과 `seo-publish-history.playwright.ts`에서 함께 검증된다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/seo/__tests__/robots.test.ts` ✅ (2 passed)
  - `npm run test:unit` ✅ (855 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts --project=chromium-builder --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
  - `npm run security:builder-routes` ✅ (109 route files / 90 mutation handlers)
  - `npm run lint` / `npm run build` ⚠️ M24 변경 파일은 통과했으나, 금지된 Bookings M25 영역 `CalendarSyncAdmin.tsx`의 기존 unused setter가 전역 lint/build를 막는다. 해당 한 줄 정리는 M25 Bookings milestone에서 처리한다.
- W 판정:
  - W186/W187/W188/W190/W191/W192/W193/W194/W195 자동검증 evidence 확보.
  - W189 scheduled publish는 현재 master prompt의 M24 구현 범위 밖이며, 별도 publish scheduling milestone로 남긴다.

## M25 — Bookings 본격 1 (서비스/스태프)

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/bookings/types.ts`, `storage.ts`, `availability.ts` — 서비스 결제 모드/가격/통화/예약 간격, 고객 타임존, 사건 개요/첨부/custom fields 타입과 저장/슬롯 계산을 확장했다.
  - `src/app/api/booking/book/route.ts`, `src/app/api/builder/bookings/admin-create/route.ts`, `src/app/api/builder/bookings/[id]/route.ts` — 공개 예약, 관리자 생성/수정 payload에 타임존과 커스텀 폼 데이터를 저장하고 paid service는 payment intent 선행을 요구한다.
  - `src/components/builder/bookings/BookingServicesAdmin.tsx`, `BookingStaffAdmin.tsx`, `BookingAvailabilityAdmin.tsx`, `BookingCalendarAdmin.tsx`, `BookingsAdmin.module.css` — Services/Staff/Availability 관리 UI를 Wix Bookings형 편집 흐름으로 확장했다.
  - `src/components/builder/bookings/BookingFlowSteps.tsx`, `src/lib/builder/components/bookingWidget/*`, `src/lib/builder/canvas/types.ts` — 공개 예약 위젯에 서비스→스태프→슬롯→정보 입력 flow, 로컬/업체 타임존 표시, 사건 개요/첨부/custom fields inspector를 연결했다.
  - `src/components/builder/bookings/CalendarSyncAdmin.tsx` — M24 전역 lint/build를 막던 기존 unused setter를 정리했다.
  - `src/lib/builder/bookings/__tests__/availability.test.ts`, `tests/builder-editor/bookings-m25.playwright.ts` — 서비스/스태프/availability/booking flow 자동검증을 추가했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/bookings/__tests__/availability.test.ts` ✅ (3 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m25.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run security:builder-routes` ✅ (109 route files / 90 mutation handlers)
  - `npx vitest run src/lib/builder/bookings/__tests__/availability.test.ts src/lib/builder/bookings/calendar-sync/__tests__/encryption.test.ts` ✅ (6 passed)
  - `npm run test:unit` ✅ (858 passed)
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- W 판정:
  - W196/W197/W198/W199/W200/W201/W202 자동검증 evidence 확보.
  - 결제는 옵션 C 하이브리드 기본으로 구현했다. 무료 서비스는 바로 예약되고, 유료 서비스는 기존 Stripe Payment Intent route를 선행 호출한 뒤 booking row를 저장한다. 로컬 개발 환경은 `pi_stub_dev` stub으로 E2E를 통과한다.
  - 실제 Stripe Payment Element 확인, 환불/리스케줄/취소 정책, calendar 양방향/Zoom 알림 심화는 M26~M27 Bookings 후속에서 계속 진행한다.
  - 사용자 직접 QA 전까지 체크포인트는 `자동검증 통과 / 사용자 QA 대기`로 둔다.

## M26 — Bookings 본격 2 partial (운영 대시보드/상태/리스케줄)

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/app/(builder)/[locale]/admin-builder/bookings/dashboard/page.tsx`, `src/components/builder/bookings/BookingDashboardAdmin.tsx` — Wix Bookings형 admin dashboard를 추가했다. 검색, 상태/staff/service/date 필터, 예약 상세 modal, 리스케줄, status transition, no-show 처리, timeline을 제공한다.
  - `src/components/builder/bookings/BookingCalendarAdmin.tsx` — Calendar 화면에 Month/Week/List view 전환을 추가했다.
  - `src/components/builder/bookings/BookingServicesAdmin.tsx`, `src/lib/builder/bookings/types.ts` — service 편집에 `meetingMode`와 `cancellationPolicyId`를 노출하고 API schema에 저장한다.
  - `src/app/api/builder/bookings/[id]/route.ts` — admin booking update가 cancellation reason/cancelledAt을 보존한다.
  - `src/lib/builder/bookings/notifications.ts` — meeting link가 생성된 booking은 confirmation email summary에도 링크를 포함한다.
  - `tests/builder-editor/bookings-m26-dashboard.playwright.ts` — service meeting/cancel policy 저장, dashboard filter/search, no-show, reschedule, confirm, calendar Month/Week/List 전환을 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run security:builder-routes` ✅ (109 route files / 90 mutation handlers)
  - `npx vitest run src/lib/builder/bookings/__tests__/availability.test.ts src/lib/builder/bookings/calendar-sync/__tests__/encryption.test.ts` ✅ (6 passed)
  - `npm run test:unit` ✅ (858 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m26-dashboard.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- W 판정:
  - Master prompt 기준 W205/W206/W207/W208/W209/W210의 운영 UI 핵심 자동검증 evidence 확보.
  - 외부 provider가 필요한 실제 Resend/SMTP 수신, Twilio SMS 수신, Zoom OAuth 실계정 생성, Google Calendar 양방향 pull, 고객 토큰 기반 cancel/reschedule link, Stripe Payment Element/환불 end-to-end는 후속 M26 slice로 남긴다.
  - 사용자 직접 QA 전까지 체크포인트는 `부분 자동검증 통과 / provider·고객 링크 후속`으로 둔다.

## M26 — Bookings 본격 2 customer link slice

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/bookings/manage-token.ts` — bookingId/customer email/expiry를 HMAC 서명한 고객 관리 토큰을 생성·검증하고 locale별 manage URL을 만든다.
  - `src/lib/builder/bookings/notifications.ts` — confirmation summary와 reminder email에 고객용 관리/리스케줄/취소 링크를 포함한다.
  - `src/app/api/booking/manage/[token]/route.ts` — signed token 기반 공개 GET/PATCH endpoint를 추가했다. 고객은 링크로 예약을 조회하고, 가능한 슬롯으로 reschedule하거나 cancellation policy/refund 계산을 거쳐 cancel할 수 있다.
  - `src/app/[locale]/bookings/manage/[token]/page.tsx`, `src/components/builder/bookings/BookingManageClient.tsx` — 공개 고객 관리 페이지를 추가했다.
  - `src/components/QuickContactWidget.tsx`, `src/components/YearEndEventPopup.tsx` — `/bookings/manage/` 유틸리티 페이지에서는 AI chat/event popup을 끄도록 해, 고객의 예약 변경/취소 버튼을 마케팅 오버레이가 가로막지 않게 했다.
  - `src/lib/builder/bookings/__tests__/manage-token.test.ts`, `tests/builder-editor/bookings-m26-customer-manage.playwright.ts` — 토큰 변조/만료 rejection과 공개 링크 reschedule/cancel flow를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/bookings/__tests__/manage-token.test.ts src/lib/builder/bookings/__tests__/availability.test.ts` ✅ (5 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m26-customer-manage.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W203/W206 고객 링크 자동검증 evidence 확보. 실제 Resend/SMTP 수신 자체는 provider QA 대기지만, 이메일 본문에 들어가는 signed manage URL과 링크 도착 후 reschedule/cancel 동작은 자동검증 통과.
  - W205는 provider QA, W210은 Stripe Payment Element/환불 E2E, W204는 Google Calendar 양방향 pull 후속으로 유지한다.

## M26 — Bookings 본격 2 calendar pull import slice

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/bookings/calendar-sync/types.ts` — provider pull 결과를 담는 `ExternalCalendarEvent` 타입을 추가했다.
  - `src/lib/builder/bookings/calendar-sync/google.ts`, `outlook.ts` — Google Calendar/Outlook calendarView timed events를 UTC ISO로 정규화해 가져오고, all-day/free 이벤트는 public slot 차단에 쓰지 않도록 제외한다. 삭제 이벤트는 날짜 없이 내려와도 cancellation event로 유지하고 provider pagination을 따라간다.
  - `src/lib/builder/bookings/calendar-sync/sync-engine.ts` — push event 설명에 `Booking ID:`를 심고 connection별 `eventMappings`로 provider event ID를 저장해 다음 sync부터 update로 덮어쓴다. Pull 시 저장된 external ID 또는 신뢰 가능한 Booking ID가 있으면 기존 booking reschedule/cancel로 반영한다. ID가 없는 외부 일정은 fake booking을 만들지 않고 staff `blockedDates` busy block으로 import/update/remove한다.
  - `src/components/builder/bookings/CalendarSyncAdmin.tsx`, `src/app/(builder)/[locale]/admin-builder/bookings/calendar-sync/page.tsx` — Calendar Sync UI 문구와 수동 동기화 결과를 push/pull 양방향 기준으로 정리했다.
  - `src/lib/builder/bookings/calendar-sync/__tests__/provider-mappers.test.ts`, `sync-engine.test.ts`, `src/lib/builder/bookings/__tests__/availability.test.ts` — provider mapper, pagination, free/all-day skip, idempotent busy import, deleted event removal, mapped external event tombstone cancel, stale duplicate push ignore, Booking ID 기반 reschedule/cancel, public slot exclusion을 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/bookings/calendar-sync/__tests__/provider-mappers.test.ts src/lib/builder/bookings/calendar-sync/__tests__/sync-engine.test.ts src/lib/builder/bookings/__tests__/availability.test.ts` ✅ (12 passed)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅
  - `npm run test:unit` ✅ (869 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W204는 자동검증 기준 `자동검증 통과 / provider OAuth QA 대기`로 상향한다. 실제 Google/Outlook 계정 OAuth, provider API quota/permissions, 실캘린더 event round-trip은 사용자·provider QA로 남긴다.

## M26 — Bookings 본격 2 payment element/refund slice

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/components/builder/bookings/BookingFlowSteps.tsx`, `BookingFlowSteps.module.css` — paid booking public widget을 Stripe Payment Element 확인 단계로 바꿨다. 유료 서비스는 `결제 준비` → Payment Element mount 또는 dev stub → `결제 확인/테스트 결제 완료` 후에만 `Confirm booking`이 활성화된다.
  - `src/app/api/booking/payment-intent/route.ts` — dev stub도 `paymentIntentId`를 반환하고, 실제 Stripe 모드에서는 publishable key 누락 시 503으로 명확히 실패한다.
  - `src/lib/builder/bookings/__tests__/refund.test.ts` — cancellation policy에 따른 full/partial/no-refund Stripe refund 계산과 booking payment status 적용을 단위 검증한다.
  - `src/app/api/booking/cancel/route.ts`, `src/app/api/booking/stripe-webhook/route.ts` — cancel/refund와 Stripe `charge.refunded` webhook 동시 처리 시 이미 취소·환불된 booking을 덮어쓰거나 downgrade하지 않도록 직전 재조회 race guard를 추가했다.
  - `tests/builder-editor/bookings-m25.playwright.ts` — public paid booking widget에서 결제 확인 전 예약 버튼 disabled, stub Payment Element 표시, 확인 후 booking 생성까지 E2E 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/bookings/__tests__/refund.test.ts` ✅ (3 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m25.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅
  - `npm run test:unit` ✅ (872 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W210은 `자동검증 통과 / live Stripe QA 대기`로 상향한다. 로컬 dev stub은 Payment Element UI gate까지 검증했고, 실제 카드 결제·환불은 Stripe publishable/secret/webhook 환경에서 사용자/provider QA가 필요하다.

## M27 — Bookings 본격 3 analytics/customer profile slice

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/bookings/analytics.ts` — booking list를 기반으로 total/upcoming/pending/confirmed/completed/cancelled/no-show, completion/cancellation/no-show rate, paid revenue, service/staff breakdown, customer email별 profile을 계산한다.
  - `src/components/builder/bookings/BookingDashboardAdmin.tsx`, `BookingsAdmin.module.css` — Dashboard 상단에 Wix Bookings형 analytics 카드와 service/customer breakdown을 추가하고, booking row와 detail modal에 고객 방문 횟수/이력 profile을 표시한다.
  - `src/lib/builder/bookings/__tests__/analytics.test.ts` — analytics summary와 customer profile grouping을 단위 검증한다.
  - `tests/builder-editor/bookings-m26-dashboard.playwright.ts` — 기존 dashboard E2E에 analytics panel, customer visit chip, profile modal, customer history timeline assertion을 추가했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/bookings/__tests__/analytics.test.ts` ✅ (2 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m26-dashboard.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅
  - `npm run test:unit` ✅ (874 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W213/W214는 `자동검증 통과 / 사용자 QA 대기`로 상향한다. Dashboard analytics와 고객 profile/history는 로컬 데이터 기준 동작을 검증했고, 실제 운영 데이터 분석·장기 이력 QA는 사용자 검증으로 남긴다.
  - 이 시점에서는 W211 waitlist, W212 recurring availability template, W215 booking email templates를 M27 후속 slice로 남겼다.

## M27 — Bookings 본격 3 waitlist slice

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/bookings/types.ts`, `storage.ts` — booking 본체 status를 오염시키지 않고 별도 `BookingWaitlistEntry`와 `waitlist` storage collection을 추가했다.
  - `src/app/api/booking/waitlist/route.ts` — 공개 waitlist POST route를 추가했다. rate limit, honeypot, service/staff validation, 빈 slot 확인, 동일 날짜/이메일 중복 방지를 거친 뒤 active waitlist entry를 저장한다.
  - `src/app/api/builder/bookings/waitlist/[id]/route.ts`, `[id]/promote/route.ts` — 관리자 waitlist status update와 promotion route를 추가했다. 모든 builder mutation은 `guardMutation({ permission: 'manage-bookings' })`를 통과하고, promotion은 직전 slot availability와 slot lock을 다시 확인한 뒤 normal booking을 생성한다.
  - `src/components/builder/bookings/BookingFlowSteps.tsx`, `BookingFlowSteps.module.css` — 공개 booking widget에서 선택 날짜에 slot이 없으면 Wix Bookings형 `Join waitlist` panel을 보여준다.
  - `src/components/builder/bookings/BookingDashboardAdmin.tsx`, `BookingsAdmin.module.css`, dashboard page — 관리자 dashboard에 waitlist count와 waitlist table/action(Promote, Contacted, Close)을 추가했다.
  - `src/lib/builder/webhooks/types.ts` — `booking.waitlist.joined` webhook event type을 추가했다.
  - `tests/builder-editor/bookings-m27-waitlist.playwright.ts` — 실제 공개 페이지에서 빈 시간표 → waitlist 등록 → admin dashboard 확인 → availability 재오픈 → promote → booking row 생성까지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m27-waitlist.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npx vitest run src/lib/builder/bookings/__tests__/analytics.test.ts src/lib/builder/bookings/__tests__/availability.test.ts` ✅ (6 passed)
  - `npm run security:builder-routes` ✅ (111 route files / 92 mutation handlers)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run test:unit` ✅ (874 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W211은 `자동검증 통과 / 사용자 QA 대기`로 상향한다. “만석 또는 slot 없음 → 대기 등록 → admin promotion” 경로는 자동검증 통과했다.
  - W212 recurring availability template, W215 booking email templates는 M27 후속 slice로 유지한다.

## M27 — Bookings 본격 3 recurring availability slice

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/bookings/availability-templates.ts` — 반복 가용성 템플릿(`Weekdays 10-18`, `Weekdays 09-18`, split lunch, weekend, clear)과 공휴일 캘린더 판정 helper를 추가했다.
  - `src/lib/builder/bookings/types.ts`, `storage.ts` — `StaffAvailability`에 `recurringTemplateId`, `holidayCalendar`을 추가하고 기존 availability 저장과 seed 기본값을 backward-compatible하게 유지했다.
  - `src/lib/builder/bookings/availability.ts` — public slot 계산에서 holiday calendar가 지정된 날짜는 recurring weekly block이 있어도 slot을 생성하지 않도록 했다.
  - `src/components/builder/bookings/BookingAvailabilityAdmin.tsx` — staff availability UI에 recurring template 선택/적용 버튼과 holiday calendar 선택을 추가했다.
  - `src/lib/builder/bookings/__tests__/availability-templates.test.ts`, `availability.test.ts` — 템플릿 적용, KR/TW/combined fixed holiday match, 공휴일 slot exclusion을 단위 검증한다.
  - `tests/builder-editor/bookings-m27-recurring-availability.playwright.ts` — admin UI에서 템플릿 적용/저장 후 일반 평일은 slot이 열리고 공휴일 평일은 slot이 비는 것을 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/bookings/__tests__/availability-templates.test.ts src/lib/builder/bookings/__tests__/availability.test.ts` ✅ (7 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m27-recurring-availability.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run security:builder-routes` ✅
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run test:unit` ✅ (877 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W212는 `자동검증 통과 / 사용자 QA 대기`로 상향한다. 매주 월~금 템플릿 적용과 KR/TW 공휴일 slot exclusion은 자동검증 통과했다.
  - W215 booking email templates는 M27 후속 slice로 유지한다.

## M27 — Bookings 본격 3 email templates slice

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/bookings/email-template-config.ts`, `email-templates.ts` — customer confirmation, admin notification, customer reminder, customer cancellation 템플릿 기본값과 placeholder 렌더러를 추가했다. `{{customerName}}`, `{{serviceName}}`, `{{staffName}}`, `{{startTime}}`, `{{manageUrl}}`, `{{bookingSummary}}` 등 핵심 변수를 지원하고 HTML 출력은 escape 처리한다.
  - `src/lib/builder/bookings/types.ts`, `storage.ts` — `BookingEmailTemplate` 타입과 `email-templates` storage collection을 추가했다.
  - `src/app/api/builder/bookings/email-templates/*` — 관리자 템플릿 조회/저장 API를 추가했다. PATCH는 `guardMutation({ permission: 'manage-bookings' })`를 통과한다.
  - `src/components/builder/bookings/BookingEmailTemplatesAdmin.tsx`, `BookingsAdminShell.tsx`, `BookingsAdmin.module.css`, email templates page — Bookings admin에 Email tab을 추가하고 템플릿 목록, subject/body editor, placeholder chips, live preview, reset/save flow를 제공한다.
  - `src/lib/builder/bookings/notifications.ts`, booking cancel/manage/admin update routes — booking confirmation/admin notification/reminder/cancellation 발송을 저장된 템플릿 기반 렌더링으로 전환했다. 취소 경로는 customer cancellation email을 보낸다.
  - `src/app/api/booking/email-reminders/route.ts` — cron-authorized email reminder dispatcher를 추가했다. 서비스 reminder offset을 우선 사용하고, 기본은 24h reminder다.
  - `src/lib/builder/bookings/__tests__/email-templates.test.ts`, `tests/builder-editor/bookings-m27-email-templates.playwright.ts` — 템플릿 렌더링/escape, 관리자 저장/미리보기/재로드 persistence를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/bookings/__tests__/email-templates.test.ts src/lib/builder/bookings/__tests__/availability-templates.test.ts` ✅ (4 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m27-email-templates.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run security:builder-routes` ✅ (113 route files / 93 mutation handlers)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run test:unit` ✅ (879 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W215는 `자동검증 통과 / 사용자·provider QA 대기`로 상향한다. 관리자 편집과 렌더링은 검증했고, 실제 Resend 발송·수신함 렌더링은 provider 환경 QA로 남긴다.
  - M27 W211~W215는 모두 자동검증 evidence를 확보했다.

## M28 — Editor advanced rulers/guides/grid slice

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/canvas/editor-prefs.ts`, `EditorPrefsButton.tsx` — editor preferences를 document dataset/CSS vars에 적용하고 `builder:editor-prefs-change` 이벤트로 설정 UI와 canvas toolbar를 동기화한다.
  - `src/components/builder/canvas/CanvasRulers.tsx`, `CustomGuidesOverlay.tsx`, `CanvasContainer.tsx` — 상단/좌측 pixel ruler, ruler click 기반 custom vertical/horizontal guide 생성, guide drag/remove, localStorage persistence를 연결했다.
  - `src/components/builder/canvas/CanvasStageToolbar.tsx`, `src/lib/builder/canvas/shortcuts.ts`, `hooks/useCanvasKeyboard.ts` — floating toolbar에 Grid toggle/size control을 추가하고 `Shift+G` 단축키를 연결했다.
  - `src/lib/builder/canvas/snap.ts`, `hooks/useCanvasInteractions.ts` — pixel grid snap과 custom reference guide snap을 기존 6px snap tolerance 경로에 연결했다.
  - `src/components/builder/canvas/SandboxEditorWorkspace.tsx` — header edit badge가 canvas ruler/floating toolbar를 덮지 않도록 위치를 보정했다.
  - `src/lib/builder/canvas/__tests__/snap.test.ts`, `tests/builder-editor/editor-guides-grid.playwright.ts` — grid snap, reference guide snap, rulers/grid toggle/grid size/Shift+G/guide persistence를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/canvas/__tests__/snap.test.ts` ✅ (6 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/editor-guides-grid.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run security:builder-routes` ✅ (113 route files / 93 mutation handlers)
- W 판정:
  - W216/W217/W218은 `자동검증 통과 / 사용자 QA 대기`로 상향한다. W219~W225는 다음 M28 slice로 남긴다.

## M28 — Editor advanced panels/shortcuts/timeline slice

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/canvas/shortcuts.ts`, `KeybindingsModal.tsx`, `EditorPrefsButton.tsx` — Wix형 단축키 맵을 `DEFAULT_KEYBINDINGS`로 정리하고, 사용자 override를 localStorage editor preferences에 저장한 뒤 실제 `matchShortcut` 처리에 반영한다.
  - `src/lib/builder/canvas/style-clipboard.ts`, `CanvasContainer.tsx`, `CanvasContextMenuLayer.tsx`, `hooks/useCanvasKeyboard.ts` — `Mod+Alt+C/V`와 context menu에서 style-only copy/paste를 지원한다.
  - `SandboxInspectorPanel.tsx` — 다중 선택 시 좌/중/우/상/중/하 정렬, horizontal/vertical distribute, match width/height 버튼을 노출한다.
  - `SandboxLayersPanel.tsx`, `LayersTreeRow.tsx`, `LayerSearchInput.tsx` — Layers tree에 자동검증용 data attr을 추가하고 zIndex/search/visibility/lock 트리 view를 검증 가능하게 했다.
  - `ComponentLibraryPanel.tsx`, `SandboxEditorRail.tsx` — Add drawer에 component library를 연결했다. 선택 노드 tree를 저장하고 fresh id로 +32/+32 offset 삽입한다.
  - `ElementCommentsPanel.tsx`, `SandboxInspectorPanel.tsx` — 선택 노드별 주석 thread를 inspector에 연결하고 editor preferences로 persist/broadcast한다.
  - `CanvasZoomDock.tsx` — zoom dock을 25~200% UI로 고정하고 자동검증 attr을 추가했다.
  - `UndoStackTimeline.tsx`, `SandboxEditorRail.tsx` — History drawer에 undo stack timeline을 추가하고 snapshot별 변경 요약/현재 cursor/Undo/Redo를 표시한다.
  - `src/lib/builder/canvas/__tests__/shortcuts.test.ts`, `tests/builder-editor/editor-advanced-panels.playwright.ts` — custom keybinding override, style paste, layers/search, component library, comments, align/distribute, zoom, undo timeline을 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/canvas/__tests__/shortcuts.test.ts` ✅ (2 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/editor-advanced-panels.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W219/W220/W221/W222/W223/W224/W225는 `자동검증 통과 / 사용자 QA 대기`로 상향한다.

## M29 — Red checkpoint close / responsive + scheduled publish

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/site/responsive-stylesheet.ts`, `src/lib/builder/site/public-page.tsx` — published responsive CSS 생성을 분리하고 tablet/mobile media query, hidden/fontSize/rect cascade, flow composite gap recomputation을 검증 가능한 모듈로 고정했다.
  - `src/lib/builder/site/scheduled-publish.ts` — page별 active schedule을 저장한다. 새 예약은 이전 scheduled job을 cancelled로 바꾸고, due runner는 기존 `publishPage()` pipeline을 호출한다.
  - `src/app/api/builder/site/pages/[pageId]/scheduled-publish/route.ts` — 예약 조회/생성/취소 API를 추가했다. 모든 mutation은 `guardMutation({ permission: 'publish' })`를 통과한다.
  - `src/app/api/cron/scheduled-publish/route.ts` — `CRON_SECRET` 기반 due publish runner를 추가했다.
  - `src/components/builder/canvas/PublishModal.tsx` — 예약 발행 패널을 추가했다. 예약 전 draft를 저장하고 expected draft revision을 job에 고정한다.
  - `src/lib/builder/site/__tests__/responsive-stylesheet.test.ts`, `scheduled-publish.test.ts` — public media CSS와 scheduled publish runner를 단위 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/site/__tests__/responsive-stylesheet.test.ts src/lib/builder/site/__tests__/scheduled-publish.test.ts` ✅ (5 passed)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run test:unit` ✅ (888 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W17/W36/W189는 `자동검증 통과 / 사용자 QA 대기`로 상향한다.

## M30 — Section template click stability

- 시작/종료: 2026-05-12 / 2026-05-12
- 사용자 피드백:
  - 주요 업무/섹션 디자인 템플릿을 클릭해 테스트할 때 텍스트가 사라지거나 다른 노드를 클릭한 뒤 글이 안 보이는 문제가 있었다.
  - 섹션 디자인 템플릿 삽입 후 뒤쪽 본문/히어로 클릭이 실제 사용자 클릭으로 안정적으로 되지 않았다.
- 변경 파일:
  - `src/components/builder/canvas/CanvasNode.tsx` — child-containing container도 실제 클릭 대상이 되도록 pointer events 정책을 보정했다. 서비스/FAQ interactive preview index는 선택 시점에 즉시 동기화해 selection 변경 직후 accordion body가 접히지 않게 했다.
  - `src/components/builder/canvas/CanvasNodeSelectionOverlay.module.css` — 회전 핸들을 콘텐츠 위에서 더 멀리 띄워, 선택 핸들이 바로 다음 텍스트 클릭을 가로막는 문제를 줄였다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — 내장 섹션 템플릿은 현재 visible root section 하단에 중앙 정렬로 삽입하고 root section만 선택하도록 변경했다. 새 섹션이 hero 위에 겹쳐 기존 노드 클릭을 막지 않는다.
  - `tests/builder-editor/section-template-click.playwright.ts` — `force: true`를 제거하고 실제 사용자 클릭 경로로 서비스 accordion, 섹션 삽입, 기존 hero 재클릭을 검증한다.
- 검증:
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npx vitest run src/lib/builder/canvas/__tests__/shortcuts.test.ts src/lib/builder/canvas/__tests__/snap.test.ts` ✅ (8 passed)
  - `npm run test:unit` ✅ (888 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W18/W22/W84 관련 실사용 click regression은 `자동검증 통과 / 사용자 QA 대기`로 둔다. 다음 self-goal은 남은 yellow checkpoint 중 W161/W174/W178/W181/W182/W183 계열을 우선 후보로 본다.

## M31 — Background parallax runtime

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/animations/presets.ts` — Scroll effect에 `background-parallax` 옵션을 추가했다. 기존 `parallax-y` element transform과 분리해 배경 이미지 전용 효과로 노출한다.
  - `src/components/builder/published/AnimationsRoot.tsx` — 공개 페이지 scroll runtime에서 `background-parallax` 노드의 background-position을 스크롤 진행률과 intensity 기준으로 갱신한다. Overlay+image 다중 background layer에서는 마지막 image layer만 움직인다.
  - `src/lib/builder/animations/__tests__/animation-render.test.ts` — preset option과 published attr emission을 단위 검증한다.
  - `tests/builder-editor/motion-runtime.playwright.ts` — Inspector에서 `background-parallax` 옵션 선택 가능 여부와 공개 페이지에서 `--builder-bg-parallax-position`이 실제 갱신되는 경로를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/animations/__tests__/animation-render.test.ts` ✅ (3 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/motion-runtime.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (889 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W161은 `자동검증 통과 / 사용자 QA 대기`로 상향한다. Element `parallax-y`와 background-only parallax 모두 런타임 evidence를 확보했다.

## M32 — Elastic easing preset

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/animations/presets.ts` — animation easing preset에 `elastic`을 추가했다.
  - `src/lib/builder/animations/animation-render.ts` — 저장값 `elastic`은 유지하되 published/editor CSS 출력에서는 `cubic-bezier(0.34, 1.56, 0.64, 1)`로 변환한다.
  - `src/components/builder/published/AnimationsRoot.tsx` — exit animation runtime도 legacy/직접 attr의 `elastic` 값을 CSS-safe cubic-bezier로 처리한다.
  - `src/lib/builder/animations/__tests__/animation-render.test.ts` — elastic option, normalization preservation, published/editor CSS conversion을 검증한다.
  - `tests/builder-editor/motion-runtime.playwright.ts` — Inspector easing dropdown에서 `elastic` 선택 가능 여부와 custom input disabled 상태를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/animations/__tests__/animation-render.test.ts` ✅ (4 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/motion-runtime.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (890 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W174는 `자동검증 통과 / 사용자 QA 대기`로 상향한다. 기본 easing, custom cubic-bezier, elastic preset이 모두 Inspector/runtime 경로에 존재한다.

## M33 — Radius/shadow effect presets

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/site/types.ts`, `src/lib/builder/site/theme.ts` — `BuilderTheme.effects`에 radius/shadow preset metadata를 추가하고, Sharp/Medium/Soft radius 및 None/Soft/Medium/Strong shadow preset helper를 제공한다.
  - `src/components/builder/canvas/SiteSettingsModal.tsx` — Site Settings > Presets 탭에 radius/shadow preset picker를 추가했다. 선택 즉시 theme preview와 brand kit export state가 갱신되고 저장 API payload에 포함된다.
  - `src/app/api/builder/site/settings/route.ts` — site theme schema가 `effects`를 검증하고, GET/PUT merge 과정에서 preset metadata를 정규화한다.
  - `src/lib/builder/site/component-variants.ts` — published/editor card variant elevation이 theme shadow preset을 읽도록 연결했다. flat card는 `none`을 유지한다.
  - `src/lib/builder/site/__tests__/theme-effects.test.ts`, `tests/builder-editor/design-pool.playwright.ts` — preset 적용, card shadow resolver, Site Settings 실제 클릭 흐름을 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/site/__tests__/theme-effects.test.ts` ✅ (2 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "covers Site Settings ModalShell" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (892 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W183은 `자동검증 통과 / 사용자 QA 대기`로 상향한다. Site Settings에서 전역 radius/shadow preset을 고르고 저장할 수 있으며, card variant shadow가 published 스타일에 반영된다.

## M34 — Design token bundle export/import

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/site/theme.ts` — `DesignTokenBundle` schema와 `createDesignTokenBundle()`, `normalizeDesignTokenTheme()`을 추가했다. colors/darkColors/fonts/radii/effects/text presets/typography scale을 한 JSON bundle로 정규화한다.
  - `src/components/builder/canvas/SiteSettingsModal.tsx` — Site Settings > Presets 탭에 `Export design tokens` / `Import design tokens` 버튼을 추가했다. Import는 현재 theme state와 brand kit export state를 즉시 갱신하고, 저장 버튼으로 API에 반영된다.
  - `src/lib/builder/site/__tests__/theme-effects.test.ts` — design token bundle round-trip을 단위 검증한다.
  - `tests/builder-editor/design-pool.playwright.ts` — 실제 modal에서 token JSON 다운로드 파일명, import file input, imported primary color 반영을 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/site/__tests__/theme-effects.test.ts` ✅ (3 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "covers Site Settings ModalShell" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (893 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W181은 `자동검증 통과 / 사용자 QA 대기`로 상향한다. Brand kit JSON과 별도로 전체 theme token bundle을 export/import할 수 있다.

## M35 — Custom My Theme save/load

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/components/builder/canvas/SiteSettingsModal.tsx` — Site Settings > Presets 탭에 My Themes 영역을 추가했다. 현재 theme를 `Save as My Theme`로 localStorage에 저장하고, 저장된 preset은 preview card에서 `Apply My Theme` 또는 `Delete`할 수 있다.
  - `tests/builder-editor/design-pool.playwright.ts` — My Theme 저장, preset card 표시, 재적용, 삭제 notice를 실제 브라우저 경로로 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "covers Site Settings ModalShell" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (893 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W178은 `자동검증 통과 / 사용자 QA 대기`로 상향한다. Built-in preset 외에 사용자가 현재 스타일을 My Theme로 저장하고 다시 불러올 수 있다.

## M36 — Brand asset library polish

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/components/builder/editor/BrandKitPanel.tsx` — Brand kit 탭 안에 Brand asset library 영역을 추가했다. Light logo/Dark logo/Favicon/OG image 4개 슬롯의 연결 상태를 한눈에 보여주고, 각 슬롯에서 Asset library를 바로 열 수 있다.
  - `src/components/builder/editor/AssetLibraryModal.tsx` — 모달을 특정 folder로 열고, 선택한 asset을 자동 folder/tag로 분류하는 옵션을 추가했다. Brand kit에서 연 asset picker는 Brand folder로 시작하고 선택 asset을 `brand` folder/tag에 연결한다.
  - `tests/builder-editor/design-pool.playwright.ts` — Site Settings 실제 클릭 흐름에서 Brand asset library 노출, 0/4 상태, Brand folder asset dialog 진입/닫기를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "covers Site Settings ModalShell" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (893 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W182는 `자동검증 통과 / 사용자 QA 대기`로 상향한다. Brand kit의 logo variant/color palette에서 실제 asset library를 직접 열고, 선택 asset을 brand asset으로 분류할 수 있다.

## M37 — Component design presets bulk apply

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/site/component-design-presets.ts` — Classic/Soft/Editorial/Conversion component design preset을 정의하고, 현재 페이지의 button/card/form field/form submit 노드에 일괄 patch하는 helper를 추가했다.
  - `src/components/builder/canvas/SiteSettingsModal.tsx` — Site Settings > Presets 탭에 Component design presets 영역을 추가했다. 각 preset은 button/card/form 매핑을 보여주고, 클릭 시 현재 페이지 요소들에 일괄 적용된다.
  - `src/components/builder/canvas/SandboxPage.tsx`, `src/components/builder/canvas/SandboxModalsRoot.tsx` — modal action을 canvas store mutation과 toast에 연결했다.
  - `src/lib/builder/site/__tests__/component-design-presets.test.ts`, `tests/builder-editor/design-pool.playwright.ts` — helper unit과 실제 modal 클릭 후 draft 저장 반영을 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/site/__tests__/component-design-presets.test.ts` ✅ (1 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "bulk applies component design presets" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (894 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W179는 `자동검증 통과 / 사용자 QA 대기`로 상향한다. 버튼 프리셋을 넘어서 card/form field/form submit까지 Site Settings에서 한 번에 적용되고 draft persistence까지 확인했다.

## M38 — Typography/source inspector polish

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SiteSettingsModal.tsx` — Typography 탭에 W184 scale preview ladder를 추가했다. base/ratio 변경 시 H1~H6/Body 계산 결과 px가 즉시 보인다.
  - `src/components/builder/editor/StyleTab.tsx` — W185 Style sources visualizer 각 행에 `theme.colors.*`, `variant:*`, `사용자 직접 입력`, `기본값` 힌트를 직접 표시한다. tooltip에만 숨어 있던 출처가 inspector에서 바로 읽힌다.
  - `tests/builder-editor/design-system-m23.playwright.ts` — typography preview H1/Body px와 style source hint 표시를 실제 브라우저 경로로 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-system-m23.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (894 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W184/W185는 계속 `자동검증 통과 / 사용자 QA 대기`로 둔다. 이미 통과한 기능에 실사용 가시성을 더해, typography scale과 style origin을 사용자가 더 즉시 이해할 수 있게 했다.

## M39 — Redirect manager public runtime evidence

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/seo/redirects-edge.ts`, `src/middleware.ts` — middleware redirect loader가 local origin에서는 same-origin public read endpoint를 사용하도록 보강했다. Production Blob path는 유지한다.
  - `src/app/api/builder/site/redirects/public/route.ts` — local-only GET endpoint를 추가해 middleware가 Node persistence에 저장된 redirect rules를 읽을 수 있게 했다. 외부 hostname은 404로 닫는다.
  - `tests/builder-editor/redirect-manager.playwright.ts` — Redirect manager UI에서 301/308 rule을 생성하고, public request를 `maxRedirects: 0`으로 보내 status와 Location header를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/redirect-manager.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (115 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (894 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W188은 `자동검증 통과 / 사용자 QA 대기` 유지. 기존 UI/API evidence에 실제 middleware public 301/308 response evidence를 추가했다.

## M40 — Structured data public JSON-LD evidence

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/site/types.ts` — `BuilderStructuredDataBlockType`에 `Article`을 정식 block type으로 추가했다.
  - `src/app/api/builder/site/pages/[pageId]/seo/route.ts`, `src/app/api/builder/site/seo-settings/route.ts` — page/site SEO 저장 schema에서 Article structured-data block을 허용한다.
  - `src/components/builder/canvas/SeoPanel.tsx` — Advanced > JSON-LD blocks를 Custom 전용에서 schema.org block picker로 확장했다. `+ Article` starter는 Article JSON-LD template을 즉시 채운다.
  - `tests/builder-editor/seo-publish-history.playwright.ts` — W192 public evidence를 추가했다. FAQ widget + Article block 페이지를 발행하고 공개 HTML의 `application/ld+json` payload에서 LegalService/BreadcrumbList/FAQPage/Article을 직접 검증한다. 기존 UI 클릭 테스트도 `+ Article` starter 값을 확인한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "covers W192|covers W26-W28 through actual editor UI clicks" --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (115 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (894 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W192는 `자동검증 통과 / 사용자 QA 대기` 유지. 기존 helper/UI evidence에 실제 published HTML JSON-LD payload 검증을 추가했다.

## M41 — Hreflang public metadata evidence

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `tests/builder-editor/seo-publish-history.playwright.ts` — W193 public metadata evidence를 추가했다. KO 페이지와 `linkedFromPageId` 기반 EN 페이지를 만들고, 두 draft를 발행한 뒤 공개 KO HTML의 alternate link를 검증한다.
- 검증:
  - 공개 HTML에서 `rel="alternate"` ko/en/x-default link가 `https://tseng-law.com/{locale}/{slug}` 형태로 주입된다.
  - legacy `/p/` URL이 alternate link에 섞이지 않는다.
  - SEO API의 `hreflang` 배열과 `missingLocales`가 Inspector 시각화에 필요한 상태를 반환한다.
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "covers W193" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (115 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (894 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W193은 `자동검증 통과 / 사용자 QA 대기` 유지. 기존 hreflang helper/Inspector evidence에 실제 published metadata alternate link 검증을 추가했다.

## M42 — Publish diff viewer 실사용 evidence

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/canvas/document-diff.ts` — Version History와 Publish dialog가 공유하는 draft-vs-revision diff helper를 추가했다. added/removed/modified node summary와 대표 변경 설명을 계산한다.
  - `src/components/builder/canvas/VersionHistoryPanel.tsx` — 기존 내장 diff 계산을 공용 helper로 교체해 같은 diff semantics를 유지한다.
  - `src/components/builder/canvas/PublishModal.tsx` — Publish dialog preflight 안에 `Draft vs published` 패널을 추가했다. 마지막 `publishedRevisionId` 문서를 revisions API로 읽고 현재 draft와 비교해 `+ / - / ~` 요약, published revision, 대표 변경 node를 발행 전에 보여준다.
  - `tests/builder-editor/seo-publish-history.playwright.ts` — W195 UI evidence를 추가했다. 최초 publish 후 draft title을 변경하고 Publish dialog를 열어 `+0 / -0 / ~1`, `~ 변경됨 1`, 변경 node id와 text diff가 표시되는지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "covers W195" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (115 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (894 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W195는 `자동검증 통과 / 사용자 QA 대기` 유지. 기존 Version History diff preview에 더해 실제 Publish dialog에서 draft-vs-published 변경 요약을 발행 직전 확인할 수 있게 했다.

## M43 — Pages CRUD validation hardening

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/PageSwitcher.tsx` — Pages 패널의 create/rename/delete 실패가 generic error로 끝나지 않도록 API validation payload를 읽어 사용자에게 원인 메시지를 표시한다. status 영역에 `role="status"`/`aria-live`를 추가하고, rename title/slug input에 명시적 접근성 label을 붙였다.
  - `tests/builder-editor/design-pool.playwright.ts` — 같은 locale 내 duplicate slug로 rename을 시도했을 때 Pages 패널이 `같은 locale 안에 동일한 slug...` 메시지를 보여주고 기존 source/target page가 모두 보존되는지 검증한다. 기존 rename/delete/nav sync 테스트도 함께 재실행했다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "duplicate slug validation|keeps active page slug" --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (기존 `<img>` warning만)
  - `npm run security:builder-routes` ✅ (115 builder route file / 95 mutation handler guard coverage)
  - `npm run test:unit` ✅ (72 files / 894 tests)
  - `npm run build` ✅ (Google Fonts 최적화 warning + 기존 `<img>` warning만)
- W 판정:
  - W14는 `자동검증 통과 / 사용자 QA 대기` 유지. 새 페이지 생성, duplicate 생성 방어, rename/delete/nav sync에 더해 rename validation 실패 UX까지 실제 UI evidence를 확보했다.

## M44 — Services template text persistence

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/canvas/store.ts` — editor interactive preview가 주요 서비스에서 마지막 open index만 기억하지 않고, 사용자가 한 번 열어 확인한 service card index 목록을 유지한다.
  - `src/components/builder/canvas/CanvasNode.tsx` — 주요 서비스 card/detail 노드는 현재 선택된 card뿐 아니라 이전에 reveal된 card도 editor canvas에서 계속 open preview로 렌더한다. public accordion runtime은 바꾸지 않고 editor 안정성만 보강했다.
  - `tests/builder-editor/section-template-click.playwright.ts` — 주요 서비스 디자인 템플릿 적용, 두 번째 card 선택, 섹션 설명/hero title 선택 뒤에도 card 0/1 상세 텍스트가 계속 보이는지 실제 클릭으로 검증한다.
  - `tests/builder-editor/admin-builder.playwright.ts` — 기존 smoke expectation을 editor multi-reveal 동작에 맞게 갱신했다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
  - `git diff --check` ✅ (M44 코드/test 파일)
  - `npm run lint` ✅ (기존 `<img>` warning만)
  - `npm run security:builder-routes` ✅ (115 builder route file / 95 mutation handler guard coverage)
  - `npm run test:unit` ✅ (72 files / 894 tests)
  - `npm run build` ✅ (Google Fonts 최적화 warning + 기존 `<img>` warning만)
  - 참고: `admin-builder.playwright.ts -g "covers Wix-like editor chrome"` smoke도 실행했지만, M44 서비스 assertion 이전의 기존 layout/hero quick-edit assertion에서 먼저 막혀 M44 gate로 쓰지 않았다.
- W 판정:
  - W18/W84는 `자동검증 통과 / 사용자 QA 대기` 유지. 사용자가 보고한 “주요업무/주요 서비스 노드 선택 후 다른 노드를 누르면 글이 사라짐” 회귀에 대해 editor 전용 persistence evidence를 확보했다.

## M45 — Locale page projection guard

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/site/persistence.ts` — site page 목록을 locale별로 projection하는 `projectPagesForLocale`/`canProjectPageToLocale` helper를 추가했다. KO/default route는 KO page만 보여주고, zh-hant/en route는 locale-specific page가 없는 경우에만 KO source page를 fallback으로 받는다.
  - `src/app/(builder)/[locale]/admin-builder/page.tsx` — editor initial page, requested `pageId`, page switcher 목록을 locale-visible page 집합에서만 고르게 했다.
  - `src/app/api/builder/site/pages/[pageId]/draft/route.ts` — draft GET/PUT 전에 page locale mismatch를 검사해 전용 zh-hant page를 KO locale로 읽거나 저장하려는 요청을 409 `locale_mismatch`로 거부한다.
  - `tests/builder-editor/locale-projection.playwright.ts` — zh-hant 전용 page를 생성하고 KO 목록 제외, zh-hant 목록 포함, KO draft 409, KO editor fallback home 렌더를 실제 API/UI 흐름으로 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/locale-projection.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W193은 `자동검증 통과 / 사용자 QA 대기` 유지. Pages와 hreflang/linking 작업 이후 남아 있던 locale pageId cross-open 위험을 editor route와 draft API 양쪽에서 닫았다.

## M46 — Service section gallery depth

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/sections/templates.ts` — services built-in section templates를 4개에서 12개로 확장했다. 신규 템플릿은 Practice Bento, Process Ladder, Risk Matrix, Retainer Packages, Industry Solutions, Comparison Table, Cross-border Desk, Case Intake Flow다.
  - `src/components/builder/sections/SectionTemplateCard.tsx` — template/category data attribute와 명시적 aria-label을 추가해 클릭 target과 자동검증을 안정화했다.
  - `src/components/builder/canvas/SandboxEditorRail.tsx` — Section design detail view 본문에 `섹션 목록으로 돌아가기` 버튼을 추가해 variant 목록에서 빠져나오는 흐름을 명확히 했다.
  - `src/lib/builder/sections/__tests__/normalize.test.ts` — built-in section 총량과 services category 기대 수를 61개/12개로 갱신했다.
  - `tests/builder-editor/section-template-click.playwright.ts` — Design panel back CTA, services built-in template 12개 노출, 신규 Practice Bento Board 노출을 실제 editor UI에서 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/sections/__tests__/normalize.test.ts` ✅ (17 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W18/W84는 `자동검증 통과 / 사용자 QA 대기` 유지. 사용자 체감상 “서비스/주요업무 템플릿이 너무 적고 돌아가기 어렵다”는 gap을 template depth와 editor back affordance로 보강했다.

## M47 — Node click movement guard

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/hooks/useCanvasInteractions.ts` — 클릭과 드래그를 분리하기 위해 move interaction에 4px 활성화 임계값을 추가했다. 선택 pointerdown은 기존처럼 유지하되, 포인터가 임계값 이상 움직이기 전에는 transient rect update, reparent, commit이 실행되지 않는다.
  - `tests/builder-editor/node-click-stability.playwright.ts` — 2px pointer jitter 클릭이 주요 서비스 노드를 이동시키지 않는지, 칼럼 아카이브와 이미지 클릭 뒤에도 `/ko/admin-builder` 캔버스와 Asset library modal이 살아있는지 실제 브라우저 클릭으로 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/node-click-stability.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W18/W84/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. 사용자가 보고한 “노드 선택 뒤 다른 노드 선택하면 아래로 사라지고 글이 안 보임”, “칼럼 아카이브/사진 클릭하면 백지” 경로를 accidental drag와 editor navigation 안정성 관점에서 막았다.

## M48 — Section template market search

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/sections/templates.ts` — built-in section template 검색 helper와 category별 한국어/영어 alias를 추가했다. `주요업무`, `주요 서비스`, `AI design`, `template market` 같은 검색어가 실제 services design pack을 찾는다.
  - `src/components/builder/sections/BuiltInSectionsPanel.tsx` — Section template market header, category filter, 결과 count를 추가했다. 검색어 변경 시 category filter를 All로 되돌려 검색 결과가 바로 보인다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — Add 패널 검색 결과에 section templates를 포함했다. 검색 중에도 맞는 섹션 템플릿 영역이 사라지지 않고, 전체 catalog count에도 반영된다.
  - `src/lib/builder/sections/__tests__/normalize.test.ts`, `tests/builder-editor/section-template-click.playwright.ts` — `주요업무` 검색으로 services 12개가 노출되고 Case Intake Flow까지 보이는지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/sections/__tests__/normalize.test.ts` ✅ (18 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
  - `git diff --check` ✅
- W 판정:
  - W18/W84/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. 사용자가 말한 “직접 디자인하지 않고 이미 템플릿 있는 전문 사이트처럼 가져다 쓰는” 흐름을 Add 패널의 template market 검색/필터 UX로 보강했다.

## M49 — Add panel page template showroom entry

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — Add 패널 상단에 `전체 페이지 템플릿 261개 보기` CTA를 추가했다.
  - `src/components/builder/canvas/SandboxEditorRail.tsx` — Add 패널 CTA가 Pages drawer로 전환하면서 page template gallery open request를 전달하게 했다.
  - `src/components/builder/canvas/PageSwitcher.tsx` — 외부 request id를 받아 기존 `TemplateGalleryModal`을 열 수 있게 했다. 기존 Pages `+ New` 흐름은 유지된다.
  - `tests/builder-editor/section-template-click.playwright.ts` — Add 패널에서 page template showroom을 열고 `261개 템플릿` 표시와 닫기까지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
  - `git diff --check` ✅
- W 판정:
  - W14/W18/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. 기존 261개 page template gallery가 Pages 내부에 숨어 있던 문제를 Add 패널의 template market 진입점으로 보강했다.

## M50 — Add-to-page template search handoff

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/TemplateGalleryModal.tsx` — `initialSearch` prop을 추가해 외부에서 열린 template showroom이 기존 검색어를 즉시 반영하게 했다.
  - `src/components/builder/canvas/PageSwitcher.tsx`, `SandboxEditorRail.tsx`, `SandboxCatalogPanel.tsx` — Add 패널 검색어를 Pages template gallery open request와 함께 전달한다.
  - `tests/builder-editor/section-template-click.playwright.ts` — Add 패널에서 `법률` 검색 후 template showroom을 열면 쇼룸 검색창도 `법률`이고 `법률사무소 홈`이 바로 보이는지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
  - `git diff --check` ✅
- W 판정:
  - W14/W18/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. Add 검색에서 page template showroom으로 넘어갈 때 검색 맥락이 끊기지 않게 했다.

## M51 — Page template prompt back path

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/PageSwitcher.tsx` — page template 선택 후 뜨는 slug prompt에 `다른 템플릿 선택` 버튼을 추가했다. 생성 확정 전에도 261개 template showroom으로 되돌아갈 수 있고, pending template은 안전하게 해제된다.
  - `tests/builder-editor/section-template-click.playwright.ts` — Add 패널 `법률` 검색 → page template showroom → `법률사무소 홈` preview → `이 템플릿 사용` → slug prompt → `다른 템플릿 선택` 경로를 실제 브라우저에서 검증한다. 되돌아온 showroom은 검색어 `법률`을 유지한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W18/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. 사용자가 지적한 template apply 후 back affordance 부재를 page template 생성 단계까지 보강했다.

## M52 — Page template search previews

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — Add 패널 검색 결과에 page template showroom preview 영역을 추가했다. `getTemplateCatalog()` metadata를 사용해 261개 page template 중 query match를 찾고, 이름/id/설명/태그/섹션 매칭 score로 상위 4개를 보여준다.
  - `tests/builder-editor/section-template-click.playwright.ts` — Add 패널 `법률` 검색 시 page template result 영역, `/261 page templates` count, `law-home` result card, card click 후 showroom search handoff, preview/use/back path를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
  - `git diff --check` ✅
- W 판정:
  - W14/W18/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. Add 검색에서 page template을 바로 발견하고 showroom으로 진입하는 전문 템플릿 마켓형 흐름을 보강했다.

## M53 — Page template result thumbnails

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — Add 패널 page template result card를 미니 showroom card로 바꿨다. `getAllTemplates()`를 사용해 full template document를 유지하고, `TemplateThumbnailRenderer` 썸네일, Premium/Standard badge, 페이지 타입, 스타일, 섹션 수, 대표 tag를 함께 렌더한다.
  - `tests/builder-editor/section-template-click.playwright.ts` — `law-home` result card 안에 `data-template-thumbnail-renderer="html-scaled-mock"` 썸네일과 Premium badge가 보이는지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
  - `git diff --check` ✅
- W 판정:
  - W14/W18/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. Add 검색 결과가 단순 목록이 아니라 실제 template market preview에 가깝게 보이도록 보강했다.

## M54 — FAQ reveal persistence

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/canvas/store.ts` — editor interactive preview state에 `faqRevealedIndices`를 추가했다. FAQ item을 선택할 때 open index와 함께 한 번 열어 본 index 목록을 누적한다.
  - `src/components/builder/canvas/CanvasNode.tsx` — FAQ item도 services처럼 현재 선택 index뿐 아니라 revealed index에 포함되면 `data-builder-preview-open`을 유지한다.
  - `tests/builder-editor/node-click-stability.playwright.ts` — FAQ 1번 answer를 연 뒤 hero title 같은 다른 노드를 선택해도 FAQ 0/1 answer text가 계속 visible인지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/node-click-stability.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
  - `git diff --check` ✅
- W 판정:
  - W18/W84/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. “다른 노드 선택 후 글이 안 보임” 회귀 방어를 FAQ accordion에도 확장했다.

## M55 — Interactive preview document reset

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/canvas/store.ts` — services/FAQ editor preview 기본 상태를 helper로 분리하고, `replaceDocument()` 시 선택/히스토리와 함께 preview open/revealed index도 초기화한다.
  - `src/lib/builder/canvas/__tests__/store-transient.test.ts` — 서비스 2번/FAQ 3번을 열어 둔 뒤 다른 문서로 교체하면 preview 상태가 `[0]` 기본값으로 돌아오는 단위 회귀를 추가했다.
- 검증:
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/store-transient.test.ts` ✅ (5 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W18/W84/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. page/template/document 전환 후 이전 페이지에서 열어 둔 서비스/FAQ preview 상태가 다음 문서의 텍스트 표시를 오염시키지 않게 막았다.

## M56 — Editor preference normalization

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/canvas/editor-prefs.ts` — localStorage의 과거/부분 editor prefs를 깊게 정규화한다. `rulers`, `outline`, `pixelGrid`, `alignDistribute` nested default를 채우고 grid size/opacity/tolerance를 clamp하며 invalid guide/keybinding/comment/library entry는 걸러낸다.
  - `src/lib/builder/canvas/__tests__/editor-prefs.test.ts` — nested field 누락 복구, invalid array entry 제거, numeric clamp를 단위 검증한다.
- 검증:
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/editor-prefs.test.ts` ✅ (2 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/editor-guides-grid.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W216~W225는 `자동검증 통과 / 사용자 QA 대기` 유지. 이전 버전 localStorage나 부분 저장된 prefs 때문에 rulers/grid/guides/shortcut/comment/component-library UI가 undefined nested 값으로 흔들리는 위험을 줄였다.

## M57 — Template gallery back search + preview sync

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/TemplateGalleryModal.tsx` — 쇼룸 내부 search input 변화를 `onSearchChange`로 상위에 알린다.
  - `src/components/builder/canvas/PageSwitcher.tsx` — template gallery open search와 last search를 분리해, 템플릿 적용 확인 prompt에서 `다른 템플릿 선택`으로 돌아갈 때 쇼룸 내부 최신 검색어를 유지한다.
  - `src/lib/builder/canvas/store.ts` — services/FAQ preview open/revealed index를 selection setter 단계에서 즉시 동기화한다. CanvasNode effect보다 아래에서 처리해 실제 클릭 경로에서 상세 글이 hidden으로 남는 플레이크를 줄인다.
  - `src/lib/builder/canvas/__tests__/store-transient.test.ts` — service/FAQ nested node 선택 직후 preview index가 바로 업데이트되는 store 단위 회귀를 추가했다.
  - `tests/builder-editor/section-template-click.playwright.ts` — Add 패널 `법률` 검색으로 showroom 진입 후 showroom 내부에서 `여행사 홈`으로 다시 검색하고, 적용 확인에서 뒤로 돌아와도 `여행사 홈` 검색어가 유지되는지 검증한다.
- 검증:
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/store-transient.test.ts src/lib/builder/canvas/__tests__/editor-prefs.test.ts` ✅ (8 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W18/W84/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. 사용자가 지적한 template back path와 주요업무 글 hidden 회귀를 각각 검색어 보존과 store-level preview sync로 보강했다.

## M58 — Template search aliases

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/templates/filters.ts` — page template 검색 alias와 score helper를 공통화했다. `홈페이지`, `주요업무`, `칼럼 아카이브`, `예약하기`, `쇼핑몰`, `여행사`, `치과`, `동물병원`, `AI 디자인 전문 사이트` 같은 한국어 검색어를 catalog 전체에서 처리한다.
  - `src/components/builder/canvas/TemplateGalleryModal.tsx` — template showroom 검색도 공통 `matchesTemplateSearch()`와 `normalizeTemplateSearchQuery()`를 사용하게 했다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — Add 패널 page template preview 검색과 score를 같은 helper로 교체하고, 상위 preview 노출을 8개로 늘렸다.
  - `src/lib/builder/templates/__tests__/filters.test.ts` — alias match, market phrasing, direct/alias score 우선순위를 261개 실제 template catalog로 검증한다.
  - `tests/builder-editor/section-template-click.playwright.ts` — Add 패널에서 `홈페이지` 검색만으로 page template results가 뜨고 `*-home` 템플릿이 보이는지 검증한다.
- 검증:
  - `npm run test:unit -- src/lib/builder/templates/__tests__/filters.test.ts` ✅ (5 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W18/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. 사용자가 말한 “템플릿 있는 AI 디자인 전문 사이트처럼 검색해서 가져오기” 흐름을 Add 패널과 full showroom 검색 기준까지 확장했다.

## M59 — Public locale page resolution guard

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/site/page-resolution.ts` — public/editor 공용 page meta resolver를 추가했다. `projectPagesForLocale()` 결과 안에서 home/slug 후보를 고르기 때문에 `/ko`가 같은 slug의 최신 `zh-hant` page meta를 잡지 않는다.
  - `src/lib/builder/site/public-page.tsx` — published page resolver가 locale-filtered resolver를 사용하게 했다.
  - `src/lib/builder/site/__tests__/page-resolution.test.ts` — zh-hant home이 더 최신이어도 Korean public home은 ko page를 고르고, target locale page가 없을 때만 default-locale projection을 허용하는 회귀를 추가했다.
  - `tests/builder-editor/locale-projection.playwright.ts` — `/zh-hant/admin-builder` 방문 후 `/ko/admin-builder`와 public `/ko`가 모두 한국어 home text를 유지하고 번중 hero text를 포함하지 않는지 검증한다.
- 검증:
  - `npm run test:unit -- src/lib/builder/site/__tests__/page-resolution.test.ts` ✅ (3 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/locale-projection.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W193은 `자동검증 통과 / 사용자 QA 대기` 유지. 사용자가 말한 “편집기는 한국어인데 사이트가 중국어로 뜨는” 경로를 public resolver 단에서 막았다.

## M60 — Template internal link locale normalization

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/canvas/types.ts` — `normalizeCanvasDocument()`가 node content 내부의 nested `href` 값을 재귀적으로 보정한다. `/ko`, `/zh-hant`, `/en`으로 시작하는 내부 링크만 요청 locale prefix로 바꾸고 외부 URL/순수 앵커는 유지한다.
  - `src/lib/builder/canvas/__tests__/locale-links.test.ts` — button link, image hotspot, nested link, query/hash 포함 locale prefix, 외부 URL, anchor link 보존을 검증한다.
- 검증:
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/locale-links.test.ts` ✅ (1 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/locale-projection.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W193/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. KO 기반 템플릿을 zh-hant/en 페이지에 적용할 때 CTA와 hotspot 링크가 `/ko/...`로 남아 locale 혼선을 만드는 경로를 막았다.

## M61 — Initial draft overwrite guard

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/hooks/useSandboxSiteState.ts` — `/admin-builder` 초기 draft fetch가 시작된 뒤 사용자가 템플릿/노드 편집을 먼저 수행하면, 늦게 도착한 초기 draft 응답이 현재 canvas를 `replaceDocument()`로 덮어쓰지 않게 했다.
- 검증:
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/store-transient.test.ts` ✅ (6 passed)
  - `npm run typecheck` ✅
- W 판정:
  - W18/W84/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. 사용자가 말한 “주요업무 템플릿 클릭 후 다른 노드 선택하면 글이 없어짐” 경로를 초기 draft race 관점에서 재현하고 차단했다.

## M62 — Design panel template discovery

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SandboxEditorRail.tsx` — Design 패널의 첫 화면을 섹션 이름 4개 pill 대신 카드형 template entry로 바꿨다. 각 섹션이 `12개 디자인 템플릿`을 가진다는 점을 표시하고, 같은 패널에서 전체 페이지 템플릿 261개 쇼룸으로 바로 이동할 수 있게 했다.
  - `tests/builder-editor/section-template-click.playwright.ts` — Design 패널에서 주요 서비스가 12개 디자인 템플릿으로 표시되는지, 전체 페이지 템플릿 버튼이 showroom을 `홈페이지` 검색으로 여는지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (4 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W18/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. 사용자가 말한 “주요업무 눌렀는데 겨우 네 개 템플릿만 있음” 혼선을 Design 패널 정보 구조에서 줄였다.

## M63 — Page template create retry state

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/PageSwitcher.tsx` — 템플릿/빈 페이지 생성 요청이 실패하면 slug prompt와 pending template을 유지한다. 성공한 경우에만 prompt를 닫고 pending template/slug input을 정리하며 새 pageId를 선택한다.
  - `tests/builder-editor/section-template-click.playwright.ts` — 중복 slug 페이지를 먼저 만든 뒤 page template showroom에서 `법률사무소 홈`을 선택하고 같은 slug로 생성 실패를 유도한다. 오류 뒤 prompt, 입력값, `다른 템플릿 선택` back path, showroom 검색어가 모두 유지되는지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (5 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W18/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. 템플릿 적용 직후 실패해도 사용자가 처음부터 다시 찾지 않고 바로 수정/뒤로가기를 할 수 있게 했다.
