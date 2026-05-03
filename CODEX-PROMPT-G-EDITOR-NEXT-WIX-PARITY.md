# G-Editor Next Wix Parity Prompt

## 목적

호정 윅스 빌더의 `/ko/admin-builder` 데스크톱 에디터를 "Wix Editor를 그대로 쓰는 느낌"까지 끌어올리기 위한 다음 작업 프롬프트와 실행 계획이다.

현재 M1~M8 구현과 자동 검증은 완료됐지만, 체크포인트 정책상 사용자가 실제 브라우저에서 5분 이상 직접 클릭 검증을 통과하기 전까지 Wix 체크포인트를 green으로 올릴 수 없다. 다음 goal은 새 기능을 무작정 추가하는 것이 아니라, 실제 사용 중 느껴지는 Wix delta를 잡고 검증 가능한 완성도로 고정하는 데 집중한다.

## 현재 상태

- G-Editor M1~M8 기능 구현 완료:
  - Selection, resize, rotate, snap guide, top bar, left rail, context menu
  - save chip, undo/redo chip, duplicate, cross-page clipboard
  - asset library, image crop/filter/alt dialog
  - version history, publish checklist, SEO panel
  - Playwright 시나리오와 전체 검증 명령 추가
- 자동 검증 완료:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run test:unit`
  - `npm run security:builder-routes`
  - `npm run build`
  - `npm run smoke:builder`
  - `npm run test:builder-editor`
- 아직 남은 gap:
  - 사용자가 실제 브라우저에서 5분 자유 사용 후 "Wix 같다"라고 판단하는 직접 검증
  - 체크포인트 문서 green 전환은 사용자 직접 검증 이후만 가능
  - raw mouse drag/resize/rotate Playwright 검증의 안정성 보강
  - Wix와 비교했을 때 색, 밀도, hover, floating chip, inspector, drawer, modal의 미세 감각 보정

## 다음에 할 일

1. 먼저 사용자 직접 검증을 수행한다.
   - dev 서버에서 `/ko/admin-builder` 접속
   - 5분 동안 선택, 드래그, 리사이즈, 회전, 복제, 페이지 변경, 붙여넣기, asset, image edit, SEO, publish, version history를 자유롭게 사용
   - 어색한 지점을 "Wix delta bug"로 기록

2. 사용자가 발견한 delta를 우선순위화한다.
   - P0: 조작이 안 되거나 데이터가 사라지는 문제
   - P1: Wix와 다르게 느껴지는 핵심 직접 조작 문제
   - P2: hover, chip, spacing, radius, shadow, timing 같은 시각 polish
   - P3: 테스트 커버리지와 문서 보강

3. 자동 검증을 사람 검증에 맞게 보강한다.
   - 고정 fixture page 또는 deterministic test setup 마련
   - drag/resize/rotate/copy-paste/publish/SEO 흐름을 Playwright로 안정화
   - 필요한 UI에는 test id를 보강하되, 사용자 화면의 시각 밀도는 해치지 않는다

4. Wix parity polish를 별도 milestone으로 처리한다.
   - 에디터 shell: topbar, left rail, drawer, page dropdown, device toggle, publish button
   - 직접 조작: selection box, handles, snap guides, dimension chips, rotation chips
   - 워크플로우: save status, undo/redo, clipboard, image edit, SEO, publish checklist
   - 시스템 UI: context menu, inspector, asset modal, version history

5. 사용자 재검증 후 문서를 업데이트한다.
   - 사용자가 직접 통과한 항목만 `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md`에서 green 처리
   - `SESSION.md`에는 날짜별 결과, 남은 delta, 검증 명령 결과를 append

## 수동 검증 스크립트

```bash
cd /Users/son7/Projects/tseng-law
npm run dev
```

접속:

- URL: `http://localhost:3000/ko/admin-builder`
- 계정: `admin`
- 비밀번호: `local-review-2026!`

5분 자유 검증 순서:

1. 캔버스 노드 hover/선택
   - hover border가 얇게 뜨는지
   - 선택 시 파란 보더, 8개 흰 핸들, node label이 Wix처럼 보이는지

2. 드래그
   - parent/다른 노드 기준으로 snap guide가 뜨는지
   - 분홍/주황 guide와 `24px` chip이 자연스럽게 따라오는지
   - 움직임이 버벅이거나 guide가 과하게 깜빡이지 않는지

3. 리사이즈
   - corner/edge handle cursor가 맞는지
   - tooltip `320 x 200`이 커서 근처에서 안정적으로 보이는지
   - Shift로 aspect ratio가 유지되는지

4. 회전
   - 상단 rotation handle이 Wix처럼 잡히는지
   - dragging 중 `45°` chip이 뜨는지
   - Shift로 15도 단위 snap이 되는지

5. 편집 상태
   - 저장 중에는 좌하단 `Saving...`
   - 완료 후 `Saved`
   - undo/redo 시 좌하단 mini chip이 뜨는지

6. 키보드 흐름
   - `Cmd+D`: +20/+20 offset 복제, 자동 선택, toast
   - `Cmd+C` 후 페이지 변경
   - Pages panel 상단 clipboard pill 확인
   - `Cmd+V`: 현재 페이지에 붙여넣기

7. Shell UI
   - topbar 높이, 버튼 밀도, page dropdown, preview/publish가 Wix처럼 느껴지는지
   - left rail hover label과 slide panel이 빠르게 반응하는지
   - context menu hover, shortcut chip, divider가 통일되어 있는지

8. Modal/workflow
   - AssetLibrary folder/search/tag/sort/new folder/new tag
   - image node context menu 또는 inspector에서 Crop/Filter/Alt dialog
   - SeoPanel counter, Google preview, OG preview, canonical
   - PublishModal blocker/warning checklist
   - VersionHistory timeline과 restore button

## Wix Delta Bug 기록 양식

```md
### Wix delta bug

- 발생 위치:
- 재현 단계:
- 기대 동작:
- 실제 동작:
- Wix와 다른 느낌:
- 심각도: P0/P1/P2/P3
- 스크린샷/영상:
- 의심 파일:
```

## 다음 goal 프롬프트

아래 블록을 그대로 `/goal create`에 붙여 넣고, 사용자 직접 검증에서 나온 delta를 `Known Deltas`에 추가해서 시작한다.

```md
# Goal
호정 윅스 빌더 `/ko/admin-builder`의 데스크톱 에디터를 실제 사용자 검증 기준으로 Wix Editor에 더 가깝게 만든다.
M1~M8에서 구현된 기능을 기반으로, 사용자가 5분 자유 조작 중 발견한 Wix delta를 제거하고 자동 검증을 안정화한다.
목표는 "기능이 있다"가 아니라 "조작 감각, 시각 밀도, hover/drag/resize/rotate feedback이 Wix처럼 느껴진다"이다.

# Context
- 레포: `/Users/son7/Projects/tseng-law`
- Next.js 14 App Router
- 기존 G-Editor M1~M8 구현과 커밋 완료
- 자동 검증은 통과했지만, 체크포인트 green은 사용자 직접 검증 후에만 가능
- 현재 worktree에는 D-POOL/다른 트랙 미커밋 산출물이 있을 수 있으므로 절대 되돌리거나 섞어 commit하지 않는다
- 주요 구현 영역:
  - `src/components/builder/canvas/SelectionBox.tsx`
  - `src/components/builder/canvas/AlignmentGuides.tsx`
  - `src/components/builder/canvas/ContextMenu.tsx`
  - `src/components/builder/canvas/CanvasContainer.tsx`
  - `src/components/builder/editor/*`
  - `src/components/builder/modals/*`
  - `src/lib/builder/canvas/store.ts`
  - `tests/builder-editor/admin-builder.playwright.ts`

# Known Deltas
- 사용자 5분 직접 검증 결과를 여기에 추가한다.
- 각 항목은 재현 단계, 기대 동작, 실제 동작, 심각도, 스크린샷/영상 여부를 포함한다.

# Constraints
- 절대 금지:
  - `git push --force`, `--no-verify`, `--no-gpg-sign`
  - `tree.ts` 수정
  - `seed-home` v 변경
  - composite legacy switch 제거
  - `legacy-*.tsx` 본문 수정
  - Phase 2+ 스키마 확장, responsive 이외 viewport 필드 추가
  - 데이터 파일 직접 수정, 단 `siteContent/insights-archive` 예외
- 다른 트랙 영역 금지:
  - `src/lib/builder/components/<위젯>/`
  - `src/lib/builder/bookings/`
  - bookings admin
  - `src/components/builder/canvas/PreviewModal.tsx`
  - ShowOnDeviceToggles 묶음
  - Codex B3/B6/B7 색, 폰트, BrandKit, Dark mode 토큰 재작성
- 모든 mutation route는 `guardMutation()` 통과 필수
- 색, 간격, radius는 SiteSettings Theme 토큰과 B3/B6/B7 토큰 우선
- 기존 사용자/다른 트랙 변경은 revert하지 않는다
- commit 시 관련 파일만 stage한다

# Milestones

## M1. User Verification Delta Triage
- 사용자 5분 검증에서 나온 delta를 재현한다.
- P0/P1/P2/P3로 분류한다.
- 각 delta의 의심 컴포넌트와 검증 방법을 적는다.
- 자동 테스트로 잡을 수 있는 항목과 수동 검증이 필요한 항목을 분리한다.

## M2. Direct Manipulation Fidelity
- 선택, hover, drag, resize, rotate의 Wix-like 감각을 보정한다.
- snap tolerance, guide flicker, chip 위치, handle hit area, cursor를 검증한다.
- Shift resize aspect ratio와 Shift rotate 15도 snap을 실제 mouse flow로 검증한다.

## M3. Editor Shell Visual Density
- topbar, left rail, sliding drawer, page dropdown, context menu, inspector의 높이, 간격, hover, shadow, radius를 보정한다.
- 새 색을 만들지 말고 기존 token 또는 token alias만 사용한다.
- 텍스트가 버튼/칩/패널에서 넘치지 않는지 확인한다.

## M4. Workflow Persistence
- duplicate, copy/paste across pages, undo/redo, save chip, asset edit, image dialog, SEO save, publish checklist가 실제 상태와 일치하는지 검증한다.
- 필요한 경우 store action 또는 mutation session 경계를 보정한다.
- toast/chip 문구는 짧고 Wix-like로 유지한다.

## M5. Modal System Polish
- AssetLibrary, Crop/Filter/Alt, PublishModal, VersionHistory, SeoPanel의 layout과 interaction을 정리한다.
- keyboard focus, escape close, scroll containment, hover state를 점검한다.
- modal 내부 버튼과 chips가 기존 디자인 시스템과 일관되게 보이도록 한다.

## M6. Playwright Hardening
- `tests/builder-editor/admin-builder.playwright.ts`를 사용자 검증 경로에 맞게 확장한다.
- flake가 생기는 raw mouse flow는 deterministic fixture, stable selectors, bounding box guard로 안정화한다.
- 테스트가 실제 UI feedback을 확인하도록 한다.

## M7. Documentation And Checkpoint Update
- `SESSION.md` 끝에 결과를 append한다.
- `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md`는 사용자 직접 검증으로 통과한 항목만 green으로 올린다.
- 통과하지 못한 항목은 yellow 유지하고 delta를 남긴다.

# Done When
- 사용자 5분 직접 검증 delta가 P0/P1 없이 해결됐다.
- 선택/hover/drag/resize/rotate/snap guide/chip/handle이 실제 클릭 검증에서 Wix-like로 통과했다.
- topbar/left rail/context menu/inspector/modal의 시각 밀도가 Wix-like로 통과했다.
- duplicate, cross-page clipboard, undo/redo, save, asset, image edit, SEO, publish, version history 흐름이 실제 조작으로 통과했다.
- Playwright 시나리오가 핵심 경로를 안정적으로 검증한다.
- `npm run typecheck` 통과
- `npm run lint` 통과
- `npm run test:unit` 통과
- `npm run security:builder-routes` 통과
- `npm run build` 통과
- `BASE_URL=http://127.0.0.1:3000 npm run smoke:builder` 또는 실제 dev port 기준 통과
- `BASE_URL=http://127.0.0.1:3000 npm run test:builder-editor` 또는 실제 dev port 기준 통과
- milestone별 `G-Editor:` prefix commit 완료
- `SESSION.md`와 Wix 체크포인트 문서 업데이트 완료

# Verification Commands
```bash
npm run typecheck
npm run lint
npm run test:unit
npm run security:builder-routes
npm run build
BASE_URL=http://127.0.0.1:3000 BUILDER_SMOKE_TIMEOUT_MS=60000 npm run smoke:builder
BASE_URL=http://127.0.0.1:3000 npm run test:builder-editor
```

# Operating Rules
- 먼저 재현하고, 그 다음 최소 수정한다.
- Wix delta를 고치기 위해 unrelated refactor를 하지 않는다.
- dirty worktree가 있으면 `git status --short`로 확인하고, 내가 만든 파일만 stage한다.
- 사용자가 직접 검증하지 않은 체크포인트는 green 처리하지 않는다.
- 자동 테스트 통과와 사용자 직접 검증 통과를 분리해서 보고한다.
```

## 완성도를 높이는 판단 기준

- 기능 존재 여부보다 조작 감각을 우선한다.
- 시각 polish는 topbar/rail/canvas/context menu/inspector/modal 순서로 본다.
- drag/resize/rotate는 실제 mouse movement에서 끊김, flicker, chip 위치, hit area가 더 중요하다.
- Wix 체크포인트 green은 AI의 자체 검증만으로 올리지 않는다.
- "Wix처럼 보인다"보다 "Wix처럼 손에 붙는다"를 통과 기준으로 둔다.

## 바로 다음 액션

1. 사용자가 위 수동 검증 스크립트로 `/ko/admin-builder`를 5분간 직접 만져본다.
2. 발견한 차이를 `Wix delta bug` 형식으로 남긴다.
3. 위 `/goal create` 프롬프트의 `Known Deltas`에 붙여 넣는다.
4. 새 goal에서 P0/P1부터 고치고 milestone별로 commit한다.
