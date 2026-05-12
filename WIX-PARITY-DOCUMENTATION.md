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
