# CODEX-GOAL-WIX-FULL-BUILDER.md

> Codex `/goal create` 입력용 마스터 프롬프트.
> Long-horizon (multi-session). 단일 25h /goal로 끝나지 않는다.
> 첫 실행에서 4 마크다운 파일을 생성하고, 이후 매 /goal 호출은
> 같은 4 파일을 신뢰출처로 다음 마일스톤을 1개씩 닫는다.
> 사용자 검증은 마일스톤마다 받지 않는다.
> 사용자가 ad-hoc으로 주는 피드백만 흡수한다.
> 모든 마일스톤이 자동 검증 통과 + Done when 11박스 채워지면 단 1회만
> 사용자에게 "써보세요" 메시지 발송 후 OK 회신 받으면 종료.

---

## 1. Goal

호정국제 법률사무소용 빌더를 Wix-class 1:1 패리티 90%로 끌어올린다.
정량: `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` 의
W01~W225 중 자동 검증 + Codex 자평 기준 🟢 = 203 이상.
최종 종료는 사용자 직접 사용 후 OK 회신 1회.

## 2. Context

- Repo: `/Users/son7/Projects/tseng-law` (Next.js 14 App Router)
- 진입점: `/admin-builder` 단일
- 현재 자동 상태 (2026-05-09):
  - 21 Playwright bundle / 712 unit / 61 mutation guard 통과
  - W01~W30 거의 자동 통과 (사용자 검증 green 4/225)
  - W31~W225 거의 🔴
- 데이터 모델: `BuilderCanvasNode` discriminated union (`src/lib/builder/site/types.ts`)
- State: `useBuilderCanvasStore` (Zustand+immer)
- Storage: Vercel Blob + file backend (`persistence.ts`)
- Auth: 모든 mutation → `guardMutation()`
- 분담:
  - **이 Codex goal = 기능/스키마/perf/안전/위젯/Vertical apps 직접 코드, 자율**
  - **Claude (별도) = 디자인 + 스코프 정정 + 사용자 피드백 중계**
  - **사용자 = ad-hoc 사용 후 발견사항만 통보. 마일스톤별 게이트 없음**
- 신뢰출처 (always read first):
  - `AGENTS.md` (아키텍처 lock-in, 절대 위반 금지)
  - `Wix 체크포인트.md` (W01~W225 정의 / 상태 업데이트 대상)
  - `SESSION.md` (직전 세션 인계, 갱신 대상)
  - `CODEX-AUDIT-FINDINGS-2026-05-09.md` (Critical/High 잔여)
  - 첫 실행 시 생성하는 4 파일 (§5)

## 3. Constraints

### 아키텍처 Lock-in (절대)
- `BuilderCanvasNode` 필드 제거 금지 (추가만 허용)
- `section-snapshot-v1` 호환성 유지
- `/admin-builder` 단일 진입점 유지
- `guardMutation` 우회 / `--no-verify` / force push 금지
- `tree.ts` / `seed-home v` 변경 금지 (대규모 reseed 유발)
- `composite/Render.tsx` 의 `legacy-page-*` switch 제거 금지
- `legacy-*.tsx` 본문 수정 금지
- `siteContent` / `insights-archive` 외 데이터 파일 직접 수정 금지

### Anti-pattern 차단
1. **스코프 확산 금지**: 마일스톤이 명시한 W 외 다른 W 손대지 말 것
2. **검증 생략 금지**: 마일스톤 종료 = 자동 검증 게이트 전부 통과 + Done when 채움
3. **목표 드리프트 금지**: "Wix-class" = 체크포인트 90%. 자체 하향 조정 금지
4. **자평 complete 금지**: §4 박스 11개 채우기 전엔 어떤 메시지에서도
   "Goal complete" 단어 금지. 마일스톤별 "M__ done"은 OK
5. **같은 W 3회+ retry 금지**: 자동 검증 3회 연속 실패 시 ⚫ 보류,
   다음 마일스톤 진행, 사유 `WIX-PARITY-DOCUMENTATION.md` 기록
6. **Hot file 추가 churn 금지**: M02 split 끝나기 전엔 다음 4파일에 기능 추가 금지
   (버그 fix만 허용):
   - `src/components/builder/canvas/SandboxPage.tsx` (1610 LOC)
   - `src/components/builder/canvas/CanvasContainer.tsx` (2214 LOC)
   - `src/components/builder/canvas/CanvasNode.tsx` (1622 LOC)
   - `src/components/builder/canvas/SandboxPage.module.css` (4431 LOC)

### 의존성 강제 순서
- M00 (mergeMissingPages) 전에 다른 마일스톤 진행 금지
- M07 (모바일 스키마 잠금) 전에 Phase 3 위젯 팩(M11~M20) 진행 금지
- M02 (hot files split) 전에 M28 (에디터 고도화) 진행 금지
- M21 (Forms) 전에 M25 (Bookings 본격 1) 진행 금지

### 스키마 변경 / 마이그레이션 강제 룰 (절대)
- 어떤 마일스톤도 `BuilderCanvasNode` / site document / page document 스키마를
  변경하면 **반드시 같은 PR에 마이그레이션 path 포함**
- 마이그레이션 path = `src/lib/builder/site/types.ts`의 `normalizeCanvasDocument()` /
  `normalizeSiteDocument()` 안에 version detection + auto-fill 코드
- 신규 필수 필드는 반드시 default value 명시
- 기존 필드 제거 금지 (deprecated 표시만 가능, 제거는 사용자 인가 후 별도 PR)
- 스키마 변경 PR 전에 production site.json backup 키 발급:
  `builder-site/<id>/backups/before-M__-<timestamp>.json`
- 마이그레이션 dry-run 단위 테스트 필수: 기존 site fixture를 normalize → 결과 비교

### 위젯 캡처 프로토콜 (M11~M20 진입 시 강제)
- 각 위젯 팩 시작 직전 사용자에게 1회 요청:
  "M__ 시작합니다. Wix 해당 위젯 5개의 스크린샷/영상 reference 제공 부탁"
- 사용자가 reference 제공 → `WIX-PARITY-IMPLEMENT.md`의 해당 M 섹션에 첨부 link/이미지 path 기재
- reference 없으면 그 팩 ⚫ 보류, 다음 팩 진행
- reference에 명시된 시각/인터랙션 디테일이 없으면 자체 해석 금지

### 분담 예외 (Codex vs Claude)
- 기본 룰: 디자인 트랙 = Codex / 기능 트랙 = Claude (사용자 메모 기준)
- 이번 goal 예외 (Codex 직접 처리):
  - **단순 schema/runtime 위젯** (Text/Heading/Button/Container/Spacer/Divider 등):
    Codex가 schema + runtime + 기본 Inspector + 기본 시각 모두 직접
- 이번 goal에서 Claude로 분리 (Codex는 schema/runtime만):
  - **M22 Motion timeline editor (W173)**: keyframe drag UI / easing curve
    visualizer / 타임라인 시각 = Claude. Codex는 keyframe array schema +
    animation engine runtime + Inspector wiring만
  - **Advanced ColorPicker / FontPicker** (D-POOL-5): 이미 Codex 처리됨
  - **PreviewModal device frame 시각** (이미 Claude 처리됨)
- Claude 직접 디자인 시: Codex는 해당 영역 손대지 말 것

### 검증 게이트 (각 마일스톤 강제)
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warning만)
- `npm run test:unit` ✅
- `npm run security:builder-routes` ✅
- `npm run build` ✅
- tracked builder-editor Playwright bundle 전체 ✅
- 마일스톤별 신규 unit + Playwright ✅
- 신규 코드 visual regression baseline (M04 이후) ✅
- axe-core WCAG 2.1 AA 위반 0 (M04 이후) ✅
- 보안: guardMutation coverage 유지 ✅

### 사용자 피드백 흡수 룰
- 사용자 "X 안 됨" 보고 → 가까운 관련 마일스톤에 fix 추가, 진행 중단 없음
- 사용자 "Y 추가" 보고 → Plan.md에 새 행 추가, 의존 따져 위치 결정.
  현재 마일스톤 끝낸 후 진입
- 사용자 "Z 방향 바꿔" 보고 → Documentation.md 기록 + 영향 범위 통보 +
  작업 일시 멈춤 후 인가 받기
- 사용자 침묵 → 자율 진행 계속

### 절대 하지 말 것
- 마일스톤별 "확인해주세요" 식 사용자 검증 요청
- "OK 받으면 다음으로" 식 게이트
- 자평 PASS만으로 "Goal complete" 선언
- 사용자에게 직접 클릭 시퀀스 카드 발급 (사장님이 알아서 사용)

### 단 1회만 할 것
- §4 박스 10개 채워졌을 때 §6 step 13의 메시지 1회 발송

## 4. Done when (전체 Goal 종료 조건, 11박스)

자동 + Codex 자평 (사용자 인가 없이 채울 수 있음):
- [ ] `Wix 체크포인트.md` 자동 + Codex 자평 🟢 = 203/225 이상
- [ ] `CODEX-AUDIT-FINDINGS-2026-05-09.md` Critical 5 + High 7 = closed
- [ ] Hot files 4개 < 800 LOC (CSS 컴포넌트별 8+ module)
- [ ] 보안 3건 ON: CSRF Origin / Upstash rate / Asset upload validation
- [ ] AI 검증 인프라 7종 도입: visual regression / Sentry / Lighthouse CI /
      axe-core / 한글 IME 시뮬 / WebKit+Firefox project / zh-hant smoke
- [ ] Bookings W196~W215 중 18+ 자동 통과
- [ ] Mobile W31~W45 중 13+ 자동 통과
- [ ] Widgets W46~W135 중 60+ 자동 통과
- [ ] Forms W136~W150 전부 자동 통과
- [ ] Motion W151~W175 중 22+ 자동 통과
- [ ] SEO W186~W195 중 8+ 자동 통과

사용자 인가 (마지막 1회):
- [ ] 위 11박스 전부 채워진 시점에 §6 step 13 메시지 1회 발송 →
      사용자 OK 회신 → Goal complete 선언

---

## 5. 첫 호출 시 생성할 4 마크다운 파일

위치: `/Users/son7/Projects/tseng-law/`

### 5.1 `WIX-PARITY-PROMPT.md`
이 마스터 프롬프트 전체 그대로 저장. 변경 시 사용자 인가 필수.

### 5.2 `WIX-PARITY-PLAN.md` (마일스톤 보드)

```
| ID  | Phase  | 마일스톤                          | W 범위    | 추정 | 의존 | 상태 |
| M00 | Pre    | mergeMissingPages fix             | —         | 1h   | —    | 🔴   |
| M01 | Pre    | Performance 잔여 fix              | —         | 10h  | M00  | 🔴   |
| M02 | Pre    | Hot files split (4파일)           | —         | 14h  | M00  | 🔴   |
| M03 | Pre    | 보안 3건                          | —         | 4h   | M00  | 🔴   |
| M04 | Pre    | AI 검증 인프라 7종                | —         | 6h   | M02  | 🔴   |
| M05 | Pre    | Empty/error state sweep           | —         | 6h   | M02  | 🔴   |
| M06 | Pre    | .next/dev 재시작 의존성 fix       | —         | 3h   | —    | 🔴   |
| M07 | P2     | 모바일 스키마 결정 + 잠금         | —         | 4h   | M00  | 🔴   |
| M08 | P2     | Mobile inspector per-viewport UI  | W31~W38   | 12h  | M07  | 🔴   |
| M09 | P2     | Mobile auto-fit + 자동 변환       | W37,W39   | 8h   | M07  | 🔴   |
| M10 | P2     | Mobile sticky / preview iframe    | W40~W45   | 10h  | M07  | 🔴   |
| M11 | P3a    | Text 위젯 팩                      | W46~W55   | 18h  | M07  | 🔴   |
| M12 | P3b    | Media 위젯 팩                     | W56~W70   | 24h  | M07  | 🔴   |
| M13 | P3c    | Gallery 위젯 팩                   | W71~W78   | 18h  | M11  | 🔴   |
| M14 | P3d    | Layout 위젯 팩                    | W79~W88   | 20h  | M11  | 🔴   |
| M15 | P3e    | Interactive 위젯 팩               | W89~W98   | 18h  | M14  | 🔴   |
| M16 | P3f    | Navigation 위젯 팩                | W99~W105  | 14h  | M11  | 🔴   |
| M17 | P3g    | Social 위젯 팩                    | W106~W113 | 12h  | M11  | 🔴   |
| M18 | P3h    | Maps & Location 팩                | W114~W117 | 8h   | —    | 🔴   |
| M19 | P3i    | Decorative 팩                     | W118~W125 | 14h  | M14  | 🔴   |
| M20 | P3j    | Data Display 팩                   | W126~W135 | 22h  | M14  | 🔴   |
| M21 | P4     | Forms 후반                        | W141~W150 | 30h  | M11  | 🔴   |
| M22 | P5     | Motion 후반                       | W160~W175 | 40h  | M07  | 🔴   |
| M23 | P6     | Design system 마무리              | W184~W185 | 12h  | —    | 🔴   |
| M24 | P7     | SEO + Publish 성숙                | W186~W195 | 24h  | —    | 🔴   |
| M25 | P8     | Bookings 본격 1 (서비스/스태프)   | W196~W202 | 24h  | M21  | 🔴   |
| M26 | P8     | Bookings 본격 2 (예약/결제)       | W203~W210 | 28h  | M25  | 🔴   |
| M27 | P8     | Bookings 본격 3 (다국어/정책)     | W211~W215 | 16h  | M26  | 🔴   |
| M28 | P9     | 에디터 고도화                     | W216~W225 | 24h  | M02  | 🔴   |
```

상태:
- 🔴 미시작 / 🟡 진행 / 🟢 자동 통과 + Codex 자평 안정 / ⚫ 보류 (3회 retry 실패)

### 5.3 `WIX-PARITY-IMPLEMENT.md` (마일스톤별 매뉴얼)

§7의 M00~M28 상세 스펙을 그대로 복제 저장.

### 5.4 `WIX-PARITY-DOCUMENTATION.md` (의사결정 / 진행 / 리스크 / 피드백)

매 마일스톤 진행 시 append:

```
## M__ — <이름>

- 시작/종료: <ISO>
- 변경 파일:
  - path:line — 요약
- 추가 테스트: <개수>
- 의사결정:
  - <key=value>
- 리스크 / 알려진 문제:
  - ...
- 보류된 W (있을 경우):
  - W__ — 사유
- 사용자 피드백 흡수:
  - <시각> "<내용>" → 흡수 위치
- 다음 마일스톤: M__
```

---

## 6. 한 /goal 호출의 워크플로

```
1. WIX-PARITY-PLAN.md 읽기
2. 다음 🔴 마일스톤 1개 선택 (의존 충족된 것 중 가장 위)
3. WIX-PARITY-IMPLEMENT.md에서 해당 M 매뉴얼 읽기
4. SESSION.md에 이번 세션 계약 작성 (날짜/M__/스코프/금지)
5. 코드 작성 (스코프 확산 금지, hot files 룰 준수)
6. 자동 검증 게이트 통과 (§3 검증 게이트 전부)
7. 신규 unit / Playwright / visual regression / axe-core 추가
8. Wix 체크포인트.md 갱신 (자동 통과 W는 🟢, 진행만 된 W는 🟡 유지)
9. WIX-PARITY-DOCUMENTATION.md append
10. WIX-PARITY-PLAN.md 상태 갱신
11. SESSION.md 인계 (다음 호출이 M+1을 자동 선택할 수 있게)
12. /goal 종료. 사용자 검증 카드 발급 X. 다음 호출 대기.
13. 단, §4 11박스 전부 채워지면 12번째 박스용 단 1회 메시지:

    "전체 Wix 패리티 자동 기준 11/11 충족.
     - 체크포인트 🟢: <개수>/225
     - 감사 Critical/High: 전부 closed
     - 보안/검증 인프라: 전부 ON
     - 위젯/Forms/Motion/SEO/Bookings/Mobile: 자동 통과 ✅
     남은 항목: 사용자 직접 사용 후 OK 회신.
     /admin-builder 자유 사용 부탁드립니다.
     이상 발견 시 Documentation.md에 흡수해 추가 작업 진행하겠습니다."
```

---

## 7. 마일스톤 상세 매뉴얼 (M00 ~ M28)

### M00 — mergeMissingPages 데이터 손실 fix
**Why**: 두 탭 race로 삭제된 페이지가 silent corruption으로 부활.
**위치**: `src/lib/builder/site/persistence.ts:127-139` (mergeMissingPages 함수).
**작업**:
1. `writeSiteDocument()`의 `mergeMissingPages` 옵션 기본값을 `true` → `false`
2. `rg "writeSiteDocument" src/` 로 모든 호출자 grep
3. 의도적으로 missing page 부활이 필요한 호출자만 명시적 `{ mergeMissingPages: true }`
4. 신규 Playwright `tests/builder-editor/cross-tab-delete-race.playwright.ts`:
   - 탭 A로 `/ko/admin-builder` 열고 임시 page P 생성
   - 탭 B로 같은 site 열고 P 캔버스 변경 (메모리에 P 보유)
   - 탭 A에서 P 삭제 → API 200
   - 탭 B에서 다른 페이지 변경 저장 → API 200
   - `/api/builder/site/pages?locale=ko` GET → P 미부활 확인
   - cleanup
**Done**: 신규 Playwright 통과 + 기존 21+ Playwright bundle 회귀 0
**커밋**: `G-Editor: fix mergeMissingPages cross-tab data corruption`

### M01 — Performance 잔여 fix (감사 #6 #7 #9 #10 #11)
각각 별도 commit. 200/300 노드 fixture로 fps 회귀 측정 추가.

#### #7 history.ts:36 structuredClone 풀 도큐 → patch-based
- 의존: 이미 `immer` 사용 중. `produceWithPatches` 활용
- 변경: `history.ts`의 ring-buffer가 full document 대신 immer patches 저장
- ring 크기 100 유지
- undo/redo는 patches inverse 적용
- 기존 unit test 유지 + 신규: `history.test.ts`에 50+ 노드 페이지 100회 commit 메모리 < 200MB 검증
**커밋**: `G-Editor: replace history full clone with immer patches`

#### #6 snap.ts:99-247 1차+2차 루프 통합 + 후보 prune
- 1차 (alignment) / 2차 (spacing) 루프 합치기
- 후보 prune: 현재 viewport bounds 밖 노드 제외
- 200 노드 fixture에서 snap 시간 측정. 기존 대비 50%+ 감소 목표
- `snap.test.ts`에 prune 케이스 추가 (viewport 밖 노드 미포함 검증)
**커밋**: `G-Editor: prune snap candidates by viewport`

#### #10 InsightsArchiveListPreview SWR 캐싱
- 위치: `CanvasNode.tsx:217-326` 또는 별 컴포넌트
- locale별 cache key. SWR 또는 React.cache 사용
- locale 변경 시 invalidate
- 신규 unit test: 같은 locale 2회 mount → fetch 1회만
**커밋**: `G-Editor: cache insights archive preview by locale`

#### #11 Space-key keyup 가드
- 위치: `CanvasContainer.tsx:738-757`
- 기존 keyup handler가 isTextInput / activeElement contenteditable 체크 없이 toggle
- 추가: 활성 input/textarea/contenteditable 감지 시 early return
- `tests/builder-editor/admin-builder.playwright.ts`에 텍스트 입력 중 space 입력해도 pan mode 안 들어가는지 검증
**커밋**: `G-Editor: guard space-key keyup against text inputs`

#### #9 CanvasContainer.tsx:1252-1259 Math.min spread 제거
- spread 4번 → reduce 또는 외부 helper
- 65K 노드 stack overflow 방지
- 단위 테스트는 추가 안 해도 됨 (기존 test 회귀로 충분)
**커밋**: `G-Editor: avoid spread overflow in min/max bounds`

### M02 — Hot files split (기능 변경 0)
의존: M00 통과. 4 파일 각각 별도 PR/commit.

#### M02-1 SandboxPage.tsx (1610 → < 800)
- 추출 1: `src/components/builder/canvas/SandboxModalsRoot.tsx`
  (PreviewModal, ShortcutsHelpModal, MoveToPageModal, AssetLibraryModal,
   SiteSettingsModal, PublishModal, VersionHistoryPanel, SeoPanel 등 mount 묶음)
- 추출 2: `src/components/builder/canvas/hooks/useSandboxSiteState.ts`
  (site/page state + mutation handler 묶음)
- 추출 3: `src/components/builder/canvas/SandboxRailDocks.tsx`
  (좌하단 fixed return dock / public floating chrome dock)

#### M02-2 CanvasContainer.tsx (2214 → < 800)
- 추출: hooks 폴더에
  - `useCanvasDrag.ts`
  - `useCanvasResize.ts`
  - `useCanvasRotate.ts`
  - `useCanvasKeyboard.ts`
  - `useCanvasSelection.ts`
  - `useCanvasSnap.ts`
- pointermove/up handler가 위 hook들 조립

#### M02-3 CanvasNode.tsx (1622 → < 800)
- kind별 render branch 분리:
  - `src/components/builder/canvas/elements/TextNode.tsx`
  - `HeadingNode.tsx`
  - `ButtonNode.tsx`
  - `ImageNode.tsx`
  - `ContainerNode.tsx`
  - `SectionNode.tsx`
  - `CompositeNode.tsx`
  - `MapNode.tsx`
  - `BlogFeedNode.tsx`
  - `FormNode.tsx`
  - `BookingWidgetNode.tsx`
  - 기타 (Divider/Spacer/Icon/VideoEmbed)
- `CanvasNode.tsx`는 dispatch 컨테이너로

#### M02-4 SandboxPage.module.css (4431 → 8+ module)
- `topBar.module.css` (32px policy 영역)
- `leftRail.module.css` (64px dark rail)
- `drawer.module.css` (slide drawer)
- `stage.module.css` (canvas stage)
- `inspector.module.css`
- `modals.module.css`
- `statusBar.module.css`
- `tokens.module.css` (CSS variables 통합)
- 각 module은 700 LOC 이하

**검증**: typecheck/lint/test/build/Playwright 통과 + 시각 회귀 0
(visual regression baseline 비교)

### M03 — 보안 3건

#### M03-1 CSRF Origin 검증
- 위치: `src/lib/builder/api/guards.ts` (또는 guardMutation 호출 지점)
- 추가: 모든 mutation에서 `Origin` 또는 `Referer` 헤더 검증
- 허용 list: 환경변수 `BUILDER_ALLOWED_ORIGINS` (콤마 분리), default localhost+`tseng-law.com`
- 미일치 → 403 `csrf_origin_mismatch`
- 신규 unit test: guard helper에 invalid origin 입력 시 throw

#### M03-2 Upstash rate limit
- 의존성: `npm i @upstash/ratelimit @upstash/redis`
- 환경변수: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- 미설정 시 in-memory fallback (현재 동작 유지)
- mutation별 rate (publish 10/min, asset upload 30/min, draft 60/min)
- 429 응답에 `Retry-After` 헤더
- 신규 unit test: in-memory fallback 동작 검증

#### M03-3 Asset upload validation
- 위치: asset upload route (`src/app/api/builder/assets/...`)
- type allowlist: `image/png|jpeg|gif|webp|svg+xml`
- size cap: 10MB (`BUILDER_ASSET_MAX_BYTES` env override)
- MIME magic byte 검증: `npm i file-type` 또는 직접 1KB header sniff
- SVG는 추가 sanitize (스크립트/이벤트 핸들러 제거 — F2 패턴 재사용)
- 위반 시 415 `unsupported_media` / 413 `payload_too_large`
- 신규 Playwright: 1MB png OK / 0.1MB exe rejected / 50MB png rejected

**커밋**: 각각 별도

### M04 — AI 검증 인프라 7종
의존: M02 통과 (split 안된 hot file은 visual baseline 깨짐)

#### M04-1 Visual regression
- Playwright `toHaveScreenshot()` 활성화 (config.expect.toHaveScreenshot)
- baseline 추가:
  - `/ko/admin-builder` 첫 화면
  - Catalog drawer 열림
  - Inspector with text node selected
  - PreviewModal open with mobile device
  - Site Settings modal
  - Asset Library modal
- max diff 1px / 0.5% pixel ratio
- baseline 폴더: `tests/visual/baseline/`
- 새 위젯 추가 시마다 baseline 1개 추가 (M11~M20에서)

#### M04-2 Sentry
- `npm i @sentry/nextjs`
- `sentry.client.config.ts` + `sentry.server.config.ts` + `sentry.edge.config.ts`
- DSN env: `NEXT_PUBLIC_SENTRY_DSN` (없으면 no-op)
- BrowserTracing + Replay 5%
- builder route 전체 + public `/`,`/[locale]`
- 신규 unit test 없음 (런타임 도구)

#### M04-3 Lighthouse CI
- `npm i -D @lhci/cli`
- `lighthouserc.json`: 2 routes (`/ko/admin-builder`, `/ko`)
- assertions: perf 80 / a11y 95 / best 90 / seo 90 minor
- npm script: `"lhci": "lhci autorun"`
- CI integration (GitHub Actions yaml 추가, fail on assert)

#### M04-4 axe-core
- `npm i -D @axe-core/playwright`
- 모든 builder-editor smoke 끝에 `await checkA11y(page)` 호출 helper
- WCAG 2.1 AA 위반 0 fail
- 위반 발견 시 fix 후 재실행

#### M04-5 한글 IME 시뮬
- 신규 `tests/builder-editor/inline-text-ime.playwright.ts`
- TipTap inline editor에서:
  ```js
  await page.evaluate(() => {
    const el = document.querySelector('[data-builder-inline-text-editor]');
    el.dispatchEvent(new CompositionEvent('compositionstart'));
    el.dispatchEvent(new InputEvent('beforeinput', { data: '안녕' }));
    el.dispatchEvent(new CompositionEvent('compositionupdate', { data: '안녕' }));
    el.dispatchEvent(new CompositionEvent('compositionend', { data: '안녕' }));
  });
  ```
- blur → 저장 → reload → "안녕" 유지 검증
- 한자 시뮬도 동일 패턴 (`한자` → `漢字`)

#### M04-6 WebKit / Firefox project
- `playwright.config.ts`에 projects 추가:
  - `chromium-builder` (기본)
  - `webkit-builder` (admin-builder smoke만)
  - `firefox-builder` (admin-builder smoke만)
- CI matrix 3 brower
- 발견되는 Safari/Firefox-specific 버그 즉시 fix

#### M04-7 zh-hant smoke
- 신규 `tests/builder-editor/zh-hant-smoke.playwright.ts`
- `/zh-hant/admin-builder` 200, `/zh-hant/columns` 200
- 칼럼 제목 한자 렌더 회귀 검증
- 인스펙터/카탈로그 라벨 한자 fallback 확인

**커밋**: 각각 별도

### M05 — Empty / Error state sweep
**스코프**:
- 칼럼 0건일 때 columns 페이지 렌더 (empty state UI 추가)
- 페이지 0개일 때 PageSwitcher 빈 상태 + 신규 페이지 유도
- Asset 0개일 때 AssetLibraryModal 빈 상태 + 업로드 유도
- 네트워크 에러 시뮬: `page.route('**/api/**', r => r.abort())` 후 사용자에게
  토스트 (`네트워크 오류, 다시 시도해주세요`) + 재시도 버튼
- 401/500 응답 시 사용자 액션 차단 (저장 버튼 disabled) + 사유 표시
- IME 조합 중 외부 클릭 (blur) → composition end 처리 후 저장
- 매우 긴 한글 텍스트 (1000자) 입력 → overflow 처리
- 페이지 0 노드 → "페이지가 비어있습니다, 좌측 + 패널에서 추가하세요" 안내

**검증**: 신규 Playwright 6+개 (각 시나리오)

### M06 — .next/dev 재시작 의존성 fix
**Why**: SESSION에 12회+ "build 후 .next 삭제 + dev 재시작" 등장.
**옵션 A**: dev/build distDir 분리
- `next.config.mjs`에 `process.env.NEXT_DEV ? '.next-dev' : '.next-build'`
**옵션 B**: pre-dev hook
- npm script `"dev": "rimraf .next-build && next dev"`
어느 쪽이든 README + npm script + SESSION.md에 명시.

### M07 — 모바일 스키마 결정 + 잠금 (사용자 인가 필요한 인터럽트 1)
의존: M00.
**입력**: 사용자에게 다음 결정 1회 요청 (단 1회 인터럽트):
1. per-viewport `fontSize` override 위치:
   - 옵션 A: `responsive.tablet.style.fontSize` inline
   - 옵션 B: 별도 typography scale token
2. `hiddenOnViewports[]` vs 현재 `responsive.<vp>.hidden` boolean
3. mobile sticky header 자동 변환 (W43): 글로벌 헤더 schema에 `mobileSticky: boolean`
4. mobile bottom CTA 바 (W44): 별도 `mobileBottomBar` site-level entity
5. hamburger 자동 변환 (W39): 글로벌 헤더 schema 수준에서 처리 vs 위젯 variant

**결정 후**:
- `types.ts` schema 확장 (필드 추가만, 제거 금지)
- `Phase 2 모바일 스키마 초안.md`에 결정 lock 명시
- `Wix 체크포인트.md` Phase 2 헤더에 잠금 일시 기재
- `seed-home`은 변경 안 함 (lock-in)
- **마이그레이션 스크립트 작성 (강제, 같은 PR에)**:
  - `normalizeCanvasDocument()` / `normalizeSiteDocument()` 안에 version
    detection + auto-fill 추가
  - 신규 필드 default value 명시 (예: `responsive.tablet.fontSize = base.fontSize`)
  - production site.json backup → 마이그 → 결과 비교 dry-run 단위 테스트 추가
  - 백업 키: `builder-site/<id>/backups/before-M07-<timestamp>.json`
  - 롤백 path 문서화 (`Documentation.md`에 백업 키 + rollback 명령 기재)

### M08 — Mobile inspector per-viewport UI (W31~W38)
**스코프**:
- 인스펙터 Layout 탭에 viewport 토글 (Desktop/Tablet/Mobile)
- 토글 active viewport에 따라 rect/fontSize/hidden override 입력 행
- desktop 값에서 fork 시 "override created" 시각 표시
- override 제거 버튼 (default 상속)
- BreakpointSwitcher와 동기화

**검증**: Playwright `tests/builder-editor/mobile-inspector.playwright.ts`
- 임시 page 생성 → 노드 선택 → tablet 토글 → fontSize 24 → save
- desktop 토글 → 원본 fontSize 유지 확인
- mobile 토글 → hidden 체크 → save → public mobile viewport에서 미렌더 확인

### M09 — Mobile auto-fit + 자동 변환 (W37, W39)
- 모바일 모드에서 override 없는 노드는 단열/전폭/세로 스택 자동 fit
- BuilderNavItem 메뉴: 모바일에서 hamburger drawer로 자동 변환

### M10 — Mobile sticky / preview iframe (W40~W45)
- W40 PreviewModal에 실제 published page iframe (이미 컴포넌트 있음, wiring만)
- W41 viewport 아웃라인 (iPhone frame 그래픽)
- W42 viewport 전환 시 undo stack 유지 (현재 commit 기반이라 자동)
- W43 sticky header 모바일
- W44 footer fixed CTA bar
- W45 long-press = right-click (touch 환경에서 contextmenu 발화 helper)

### M11 — Text 위젯 팩 (W46~W55)
**위젯 10종**: Heading H1~H6 / Rich text inline toolbar / Inspector RTE /
Text on path / Multi-column / Quote / List / Marquee / Typography preset / Link

**위젯당 5점 셋 (canonical 패턴)**:
1. `src/lib/builder/site/types.ts` — `kind` enum 추가, `<Kind>NodeSchema = baseCanvasNodeSchema.extend(...)`
2. `src/components/builder/canvas/elements/<Kind>.tsx` — Element 렌더 (CanvasNode dispatch에서 호출)
3. `src/components/builder/canvas/elements/<Kind>Inspector.tsx` — Inspector content 탭
4. `src/lib/builder/site/published-node-frame.ts` — published render branch
5. `src/lib/builder/components/widgets/<kind>/index.ts` — registry export

**공통 패턴**:
- Inspector primitives: D-POOL-3 정의 사용
- TipTap: `immediatelyRender: false`
- 모든 link 입력: `LinkPicker` (C3)
- Typography preset: `theme.ts` text presets

**검증 (자동만)**:
- 신규 unit: 각 위젯 schema parse + clone (10 case)
- 신규 Playwright: + 패널 드래그 → 캔버스 드롭 → 인스펙터 편집 → 저장 → reload → public 렌더 (위젯당 1 시나리오)
- visual regression baseline 10개 추가
- axe scan 통과

**Done**:
- [ ] 10 위젯 구현 + 등록
- [ ] 자동 검증 게이트 통과
- [ ] 체크포인트.md W46~W55 🟢
- [ ] Documentation.md M11 기록

### M12 — Media 위젯 팩 (W56~W70)
- W56 Lightbox click trigger (이미지 클릭 → 풀스크린 모달)
- W57 Image hotspots (이미지 위 포인트 + 툴팁)
- W58 Before/After compare slider
- W59 Hover image swap
- W60 Image click action (link/lightbox/popup)
- W61 SVG 인라인 색 편집
- W62 Lottie animation
- W63 Video box (MP4 업로드)
- W64 YouTube embed (커스텀 wrap)
- W65 Vimeo embed
- W66 Video background (섹션 배경 영상)
- W67 Audio player
- W68 Spotify/SoundCloud
- W69 GIF (Giphy 검색 옵션)
- W70 Icon library (Lucide + FontAwesome)

같은 5점 셋 패턴. icon library는 1개 위젯으로 묶음 (kind 1, content.iconName 필드).

### M13 — Gallery 위젯 팩 (W71~W78)
- W71 Grid / W72 Masonry / W73 Slider / W74 Slideshow / W75 Thumbnail /
  W76 Pro gallery / W77 Caption overlay / W78 Filter

같은 패턴. `<GalleryNode kind="gallery" content.layout="grid|masonry|slider|...">` 단일 kind + variant로 묶기 권장.

### M14 — Layout 위젯 팩 (W79~W88)
- W79 Strip / W80 Box / W81 Column 2/3/4 / W82 Repeater / W83 Tabs / W84 Accordion / W85 Slideshow container / W86 Hover box / W87 Sticky/anchor / W88 Grid layout

`Container` kind 확장으로 처리. layoutMode 추가 ('strip', 'tabs', 'accordion', 'slideshow', 'hoverBox', 'grid').

### M15 — Interactive 위젯 팩 (W89~W98)
- W89 Button variants (이미 8 variant) / W90 Icon button / W91 Lightbox modal / W92 Popup with trigger / W93 Notification bar / W94 Cookie consent / W95 Countdown / W96 Progress / W97 Star rating / W98 Back to top

site-level entity 필요한 것들 (Lightbox, Popup, Notification bar, Cookie consent)은 기존 `site/types.ts` lightboxes 패턴 따라 확장.

### M16 — Navigation 위젯 팩 (W99~W105)
- W99 Horizontal menu / W100 Vertical / W101 Mobile hamburger 자동 변환 (M07 확정 후) / W102 Dropdown 계층 (이미 일부) / W103 Mega menu (이미지 패널 있는 진짜 mega) / W104 Anchor menu (페이지 내 섹션 점프) / W105 Breadcrumbs

### M17 — Social 위젯 팩 (W106~W113)
- W106 Social bar / W107 Share buttons / W108 Instagram feed / W109 YouTube subscribe / W110 LinkedIn follow / W111 WhatsApp 플로팅 / W112 Line / W113 Kakao

### M18 — Maps & Location (W114~W117)
- W114 (이미 🟡) sweep + green / W115 Address block / W116 영업시간 블록 / W117 다중 위치 지도

### M19 — Decorative (W118~W125)
- W118 Shape 라이브러리 / W119 Line/divider / W120 Spacer / W121 Gradient (🟢 유지) / W122 Pattern / W123 Parallax 배경 / W124 Frame / W125 Sticker

### M20 — Data Display (W126~W135)
- W126 Bar chart / W127 Line chart / W128 Pie chart / W129 Counter / W130 Testimonial carousel / W131 Pricing table / W132 Comparison table / W133 Timeline / W134 Team member card / W135 Service feature card

차트는 `recharts` 또는 `chart.js` 사용. lazy import.

### M21 — Forms 후반 (W141~W150)
- W141 Number/decimal validation / W142 Dropdown (있음, sweep) / W143 Radio (있음, sweep) / W144 Checkbox (있음) / W145 Date picker / W146 File upload (있음) / W147 Signature canvas (HTML5 canvas pad → PNG → asset 저장) / W148 Payment Stripe (Stripe Checkout 또는 Payment Element 통합) / W149 Conditional logic 강화 / W150 Submission dashboard + 메일 알림 강화

### M22 — Motion 후반 (W160~W175)
**Codex 스코프 (이번 goal)**:
- W159 Expand in (zoom 변형 추가)
- W160 Exit animation (entrance 반대 + IntersectionObserver leaving)
- W161 Background parallax (요소 parallax는 있음)
- W167 Scrub animation (스크롤 위치 = 프레임)
- W168 Hover fade (현재 lift/pulse만, fade 추가)
- W170~W171 Loop pulse/float/bounce
- W172 Page transition (route change fade/slide)
- W173 Motion timeline editor — **schema + runtime만**:
  - schema: `animation.timeline.keyframes[] = { timeOffset, properties, easing }` 타입
  - runtime: keyframe array → Web Animations API 또는 framer-motion 변환 + 재생 엔진
  - Inspector wiring: keyframe array를 받아서 prop 전달만 (시각 UI는 Claude)
- W174 Custom bezier — schema (cubic-bezier(x1,y1,x2,y2) string)만
- W175 Click trigger

**Claude 분담 (별도 진행, Codex는 손대지 말 것)**:
- W173 keyframe drag UI / easing curve visualizer / 타임라인 그래픽
- W174 cubic-bezier 시각 편집기 UI

**Codex가 끝내고 SESSION.md에 다음 표기**:
"M22 Codex 분량 완료. Claude timeline UI 트랙 발주 대기."

### M23 — Design system 마무리 (W184~W185)
- W184 Typography scale (1.125x/1.25x/1.333x ratio 드롭다운 → 모든 heading 자동 조정)
- W185 Style override visualizer ("이 스타일은 어디서 왔나" — theme/variant/manual 구분 표시)

### M24 — SEO + Publish 성숙 (W186~W195)
- W186 sitemap.xml 자동
- W187 hreflang 자동 (linkedPageIds 기반)
- W188 301 redirect 관리 UI
- W189 canonical URL 강화
- W190 slug 변경 시 자동 301
- W191 custom robots.txt
- W192 schema.org structured data (LegalService, FAQPage, Article)
- W193 pre-render 검증
- W194 CDN cache invalidation (publish 시 명시적)
- W195 SEO Inspector에 sitemap 포함 여부 + hreflang 시각화

### M25 — Bookings 본격 1 (W196~W202)
**M25 진입 직전 사용자 인가 인터럽트 2 (단 1회 질문)**:
호정 법률사무소 상담 결제 모델 결정 필요:
- 옵션 A: **무료 상담만** — 예약 = 일정만 잡고 결제 없음, Stripe 등 미연결
- 옵션 B: **전부 유료 상담** — 예약 시 선결제 (Stripe Payment Element)
- 옵션 C: **하이브리드** — 서비스별로 무료/유료 토글, service entity에 `pricing` 필드 추가

→ 사용자 응답 대기. 응답 후 W201 스코프 결정 후 진행.

**스코프**:
- W196 Service CRUD UI 풀 (옵션 C 선택 시 `pricing: { type: 'free'|'paid', amount, currency }` 추가)
- W197 Staff CRUD
- W198 Availability rules (요일/시간/예외)
- W199 예약 위젯 공개 페이지
- W200 슬롯 선택 UI
- W201 결제 통합 — 옵션별:
  - A: 스킵, "결제 없이 예약 확정" 흐름만
  - B: Stripe Payment Element 전체 통합 (Payment Intent + webhook + 환불 API)
  - C: service.pricing 따라 분기, paid 서비스만 Stripe
- W202 캘린더 sync Google/Apple (OAuth + iCal export)

**스키마 변경 시 마이그레이션 강제 룰 (§3) 적용**: `bookings/types.ts` 변경 PR에
normalizeBookings() 마이그 path 포함.

### M26 — Bookings 본격 2 (W203~W210)
- W203 예약 확정 이메일 (Resend / SMTP)
- W204 SMS 알림 (옵션, Twilio)
- W205 Zoom 자동 미팅 링크 (Zoom OAuth + Create meeting API)
- W206 캔슬 정책
- W207 리스케줄 UI
- W208 노쇼 처리
- W209 staff 캘린더 view
- W210 admin 예약 대시보드

### M27 — Bookings 본격 3 (W211~W215)
- W211 다국어 예약 (서비스명/설명 ko/zh-hant/en)
- W212 다중 사무소 (location 선택)
- W213 buffer time
- W214 timezone 처리
- W215 예약 분석 (월별 예약/취소율)

### M28 — 에디터 고도화 (W216~W225)
- W216 Rulers (좌/상단)
- W217 Layers tree advanced (이미 있음, sweep)
- W218 Outline/wireframe view
- W219 단축키 매핑 UI (사용자가 단축키 변경)
- W220 Align/distribute tools 강화 (수직/수평/매트릭스)
- W221 Pixel grid overlay
- W222 Reference guides (사용자가 가이드라인 그림)
- W223 Component library (사용자가 만든 재사용 노드)
- W224 Element comments (디자이너 주석)
- W225 Editor theme (라이트/다크)

---

## 8. 커밋 / SESSION 갱신 규칙

### 커밋 메시지
- prefix: `G-Editor:`
- 1 commit = 1 fix or 1 widget or 1 phase split
- 본문에 변경 사유 + 영향 범위
- Co-Authored-By 라인 자동 (Codex 기본)

### SESSION.md 인계
매 마일스톤 종료 시 다음 블록 append:

```
## YYYY-MM-DD Codex /goal M__ <이름>

범위:
- ...

검증:
- typecheck/lint/test/security/build/Playwright bundle 결과
- 신규 테스트 N개 추가
- visual regression baseline +N
- axe-core 위반 0

메모:
- 의사결정 / 리스크 / 사용자 피드백 흡수 내역
- 다음 마일스톤: M__
```

### Wix 체크포인트.md 갱신
자동 통과 + Codex 자평 안정 시:
- 상태 🔴/🟡 → 🟢
- 마지막 검증 열에 `YYYY-MM-DD Codex /goal M__: <증거>` 1줄

---

## 9. 워치도그 / 무인 실행 호환성

이 마스터는 다음 환경에서 호환:
- Codex `--full-auto` (권한 프롬프트 자동)
- tmux send-keys `y\n` 자동 yes
- ScheduleWakeup 또는 cron 12h 주기로 /goal resume
- `<<autonomous-loop-dynamic>>` sentinel 사용 가능

단 M07 (모바일 스키마 결정)은 사용자 인가 필요한 유일 인터럽트.
이 시점에 Codex가 사용자에게 결정 5개 질문 후 응답 받으면 진행.

---

## 10. 즉시 시작

이 프롬프트 받자마자:
1. `/Users/son7/Projects/tseng-law/`에 4 파일 생성
   - `WIX-PARITY-PROMPT.md` (이 마스터 그대로)
   - `WIX-PARITY-PLAN.md` (§5.2 표)
   - `WIX-PARITY-IMPLEMENT.md` (§7 M00~M28 그대로)
   - `WIX-PARITY-DOCUMENTATION.md` (빈 헤더만, append 형식)
2. M00 (mergeMissingPages fix) 즉시 시작
3. 종료 후 사용자 통보 X. /goal 종료, 다음 호출 대기.
4. 다음 호출에서 자동으로 M01 → M02 → ... 진행.
5. M07에서 사용자 결정 1회 요청 (5개 항목).
6. M28까지 끝나고 §4 11박스 채워지면 §6 step 13 메시지 1회 발송.
7. 사용자 OK → Goal complete 선언.

---

## 11. 보고 형식 (매 /goal 호출 종료 시)

```
M__ <이름> done.

변경 파일:
- path:line — 요약 (최대 10줄)

신규 테스트: N개
체크포인트 변화: W__~W__ N개 🟢
보류된 W: 없음 / W__ — 사유
다음 마일스톤: M__ (의존 충족됨)

자동 검증:
- typecheck/lint/test:unit/security/build/Playwright ✅

다음 호출 대기.
```

§4 11박스 전부 채우기 전까지는 위 형식 유지.
11박스 채워진 호출에서만 §6 step 13 메시지 발송.

---

## 12. Inspector Primitives (canonical, 모든 위젯 Inspector가 사용)

위젯 70~100개를 일관된 Inspector UX로 만들기 위해 다음 primitive를
`src/components/builder/canvas/InspectorControls/`에 1회 정의 후 모든 Inspector에서
재사용한다. **새 primitive 정의는 사용자 인가 필요. 모든 위젯 Inspector는
아래 primitive 외 직접 input 작성 금지.**

### 12.1 필수 primitive 18종

| 컴포넌트 | 용도 | 핵심 props |
|---|---|---|
| `<InspectorSection>` | Inspector 섹션 헤더 + 접기/펼치기 | title, defaultOpen, children |
| `<InspectorRow>` | label + control 1행 | label, hint?, error?, children |
| `<NumberInput>` | px / 정수 / 소수 | value, onChange, min, max, step, suffix |
| `<RangeSlider>` | opacity / borderRadius / blur (0~100, 0~50px 등) | value, onChange, min, max, step, marks? |
| `<SpacingInput>` | padding / margin 4-side | value: { top, right, bottom, left }, onChange, linked? |
| `<ColorInput>` | 기본 색 입력 (HEX) | value, onChange |
| `<ColorInputAdvanced>` | HEX/RGB/HSL + EyeDropper + WCAG + Brand/Theme/Recent | D-POOL-5 |
| `<FontPicker>` | System/Site/Google + preview | value, onChange, allowGoogle? |
| `<TextInput>` | 한 줄 텍스트 (alt/href/aria-label) | value, onChange, placeholder, maxLength? |
| `<TextareaInput>` | 여러 줄 텍스트 (description/주소) | value, onChange, rows? |
| `<SelectChips>` | 단일 선택 (variant choice) | options: [{value, label, icon?}], value, onChange |
| `<RadioGroup>` | 단일 선택 (visual orientation) | options, value, onChange |
| `<ToggleRow>` | bool + label | label, value, onChange, hint? |
| `<DropdownMenu>` | 일반 select | options, value, onChange |
| `<LinkPicker>` | external/internal/anchor/mailto/tel | value: LinkValue, onChange (C3 기존) |
| `<AssetPicker>` | asset library trigger + 미리보기 | value, onChange, accept: 'image'/'video'/'svg'/'lottie' |
| `<IconPicker>` | Lucide + FontAwesome 검색/선택 | value, onChange |
| `<KeyValueRows>` | 동적 array (data attrs / list items) | value, onChange, rowSchema |
| `<DangerButton>` | 삭제 등 destructive | label, onClick, confirm? |

### 12.2 일관성 규칙
- 모든 primitive는 동일 spacing/typography 토큰 사용 (D-POOL-3 inspector tokens)
- error 표시는 row 하단 12px 빨간 텍스트
- hint 표시는 row 하단 12px 회색 텍스트
- 모든 control은 disabled state 지원 (회색 + cursor not-allowed)
- focus state는 wix-blue 2px outline
- mobile에서도 동일 컴포넌트 (반응형 X — Inspector는 desktop 전용 panel)

### 12.3 신규 위젯 Inspector 작성 규칙
- 위젯별 Inspector 파일 (`<Kind>Inspector.tsx`)은 위 primitive만 조립
- 자체 input element / button element 작성 금지
- 새 primitive 필요 시 `WIX-PARITY-DOCUMENTATION.md`에 제안 + 사용자 인가 후 추가
- 인가 없이 임시 input 작성 시 PR reject

### 12.4 검증
- `tests/inspector-primitives.test.tsx` 단위 테스트로 18종 각각 render + onChange + a11y 검증
- Storybook 또는 fixture page로 시각 회귀 baseline
- M11~M20의 모든 신규 Inspector는 위 primitive grep으로 사용 여부 확인

---

## 13. 환경변수 스펙 (`.env.example` 계약)

`/Users/son7/Projects/tseng-law/.env.example`에 다음 전부 명시.
프로젝트 README에도 동일 표 유지.

### 13.1 기존 (이미 사용 중, 유지)
| 키 | 용도 | default |
|---|---|---|
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob production storage | (prod에서만) |
| `BUILDER_USE_BLOB_IN_DEV` | dev에서 강제로 Blob 사용 | unset (= local backend) |
| `BUILDER_SITE_BACKEND` | `local` 또는 `blob` 강제 override | unset |
| `BUILDER_SMOKE_TIMEOUT_MS` | Playwright smoke timeout | 60000 |
| `NEXT_DIST_DIR` | distDir override (검증 격리) | `.next` |
| `BUILDER_BASIC_AUTH_USER` | admin Basic Auth 사용자명 | `admin` |
| `BUILDER_BASIC_AUTH_PASS` | admin Basic Auth 비번 | `local-review-2026!` |

### 13.2 M03 보안 (신규)
| 키 | 용도 | default |
|---|---|---|
| `BUILDER_ALLOWED_ORIGINS` | CSRF Origin allowlist (콤마) | `http://localhost:3000,https://tseng-law.com` |
| `UPSTASH_REDIS_REST_URL` | Upstash rate limit URL | unset (= in-memory fallback) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash token | unset |
| `BUILDER_ASSET_MAX_BYTES` | asset upload max | `10485760` (10MB) |
| `BUILDER_ASSET_ALLOWED_MIME` | asset MIME allowlist | `image/png,image/jpeg,image/gif,image/webp,image/svg+xml` |

### 13.3 M04 검증 인프라 (신규)
| 키 | 용도 | default |
|---|---|---|
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry browser DSN | unset (= no-op) |
| `SENTRY_AUTH_TOKEN` | Sentry source map upload | unset |
| `SENTRY_ORG` / `SENTRY_PROJECT` | Sentry CLI | unset |
| `LHCI_GITHUB_APP_TOKEN` | Lighthouse CI GitHub | unset |
| `LIGHTHOUSE_PERF_THRESHOLD` | perf 점수 게이트 | `80` |
| `LIGHTHOUSE_A11Y_THRESHOLD` | a11y 점수 게이트 | `95` |
| `LIGHTHOUSE_BEST_THRESHOLD` | best practices 게이트 | `90` |
| `LIGHTHOUSE_SEO_THRESHOLD` | seo 게이트 | `90` |
| `AXE_RULES_DISABLED` | 비활성 axe 룰 ID (콤마) | `` (모두 활성) |
| `AXE_TAGS` | axe 검사 태그 | `wcag2a,wcag2aa,wcag21a,wcag21aa` |

### 13.4 M21 Forms (이미 일부)
| 키 | 용도 |
|---|---|
| `RESEND_API_KEY` | Resend 이메일 |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | SMTP fallback |
| `HCAPTCHA_SITE_KEY` / `HCAPTCHA_SECRET` | hCaptcha |
| `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET` | Cloudflare Turnstile |

### 13.5 M25~M27 Bookings (M25 결정 후 ON)
| 키 | 용도 | 옵션 |
|---|---|---|
| `STRIPE_PUBLISHABLE_KEY` | Stripe browser | B/C 옵션 시 필수 |
| `STRIPE_SECRET_KEY` | Stripe server | B/C 필수 |
| `STRIPE_WEBHOOK_SECRET` | webhook 검증 | B/C 필수 |
| `GOOGLE_OAUTH_CLIENT_ID` | 캘린더 sync | W202 필수 |
| `GOOGLE_OAUTH_CLIENT_SECRET` | 캘린더 sync | W202 필수 |
| `ZOOM_CLIENT_ID` | 자동 미팅 링크 | W205 필수 |
| `ZOOM_CLIENT_SECRET` | 자동 미팅 링크 | W205 필수 |
| `TWILIO_ACCOUNT_SID` | SMS 알림 (옵션) | W204 옵션 |
| `TWILIO_AUTH_TOKEN` | SMS | W204 옵션 |

### 13.6 검증 게이트
- 새 환경변수 추가 시 `.env.example` + README 표 + master 이 섹션 동시 업데이트
- 미설정 시 fallback 또는 명확한 에러 메시지 (`process.env.X is required for feature Y`)
- 비밀 키는 절대 코드/테스트 fixture에 하드코딩 금지

---

## 14. 마이그레이션 / 스키마 진화 룰

§3 강제 룰의 상세 매뉴얼.

### 14.1 마이그레이션 함수 위치
- `src/lib/builder/site/types.ts` — `normalizeCanvasDocument()`
- `src/lib/builder/site/persistence.ts` — `normalizeSiteDocument()`
- `src/lib/builder/bookings/types.ts` — `normalizeBookings()` (M25에서 신규)
- 각 함수는 입력 document version 감지 → 누락 필드 default fill → 신규 schema로 반환

### 14.2 version 감지 패턴
```ts
// types.ts 상단
export const CANVAS_DOCUMENT_VERSION = 7; // 기존 6에서 +1 시 마이그 path 추가

function normalizeCanvasDocument(input: unknown): BuilderCanvasDocument {
  const version = (input as any)?.version ?? 1;
  let doc = input as any;
  if (version < 2) doc = migrateV1toV2(doc);
  if (version < 3) doc = migrateV2toV3(doc);
  // ... 누적 적용
  if (version < CANVAS_DOCUMENT_VERSION) doc = migrateLatest(doc);
  return canvasDocumentSchema.parse({ ...doc, version: CANVAS_DOCUMENT_VERSION });
}
```

### 14.3 신규 필드 기본값 룰
- optional 필드: `.optional()` + 코드에서 `??` fallback
- required 필드 추가 시: 마이그레이션 함수에서 default 명시 후 schema에 추가
- enum 값 추가는 자유 (역호환). 제거는 절대 금지

### 14.4 백업 키 규칙
- 마이그 직전 백업 키: `builder-site/<siteId>/backups/before-M__-<ISO>.json`
- 백업 retention: 최소 30일
- `Documentation.md`에 백업 키 + rollback 명령 기재 (예: `vercel blob copy <키> builder-site/<siteId>/site.json`)

### 14.5 dry-run 단위 테스트 (필수)
각 마이그레이션 PR에 다음 fixture 테스트 추가:
- `tests/migrations/M__.test.ts`:
  - `fixtures/before-M__/site.json` (마이그 전)
  - `fixtures/after-M__/site.json` (마이그 후 expected)
  - `expect(normalize(before)).toEqual(after)`
- 호정 production site.json 익명화 사본도 fixture에 포함

### 14.6 production 적용 절차
1. PR 머지 전 staging blob에 백업 + 마이그 dry-run
2. dry-run 결과 사용자에게 보고
3. 승인 후 production deploy
4. deploy 직후 `/api/builder/site/audit?siteId=<id>` 같은 audit endpoint로 마이그 결과 확인
5. 7일간 모니터링 (Sentry error rate / API 5xx)

---

## 15. 위젯 캡처 프로토콜 (Wix reference)

§3 룰의 상세 매뉴얼.

### 15.1 팩 시작 직전 사용자 요청 형식
```
M__ 시작 준비.
다음 위젯 N개의 Wix 동작 reference 부탁드립니다:
- W__ <위젯명> — 어떤 인터랙션이 핵심인지 (1줄)
- ...

제공 형식:
- 정적: editor.wix.com 또는 wix.com 데모 사이트의 위젯 스크린샷 1~3장
- 동적 인터랙션: 짧은 화면 녹화 (5~30초) — drag/click/hover 시 시각 변화
- 위치: /Users/son7/Desktop/wix-references/M__/W__/ 폴더에 저장
```

### 15.2 reference 흡수
- 사용자 제공 후 Codex가 `WIX-PARITY-IMPLEMENT.md`의 해당 M 섹션 하단에 첨부
- 형식:
  ```
  ### M__ Wix References (사용자 제공 YYYY-MM-DD)
  - W__ <위젯명>:
    - /Users/son7/Desktop/wix-references/M__/W__/<file>.{png,mp4}
    - 핵심 디테일: <사용자가 강조한 부분 quote>
  ```

### 15.3 미제공 처리
- reference 없이 위젯 만들면 "Wix처럼"의 정의가 자체 해석 → follow-up loop
- reference 미제공 시 그 W는 ⚫ 보류
- 팩 내 5/10 W만 reference 있으면 그 5만 진행, 나머지 보류 + Documentation 기록

### 15.4 reference 활용 룰
- Codex는 시각/인터랙션 디테일을 reference에 명시된 만큼만 구현
- reference에 없는 시각 결정 (색/폰트/spacing)은 호정 brand kit + theme.ts 기본값 사용
- reference와 호정 brand 충돌 시 brand 우선, 충돌 사유 Documentation 기재

---

## 16. Codex vs Claude 분담 (이번 goal 한정)

기본 룰은 사용자 메모 (`feedback_design_codex_split.md`):
- 디자인 트랙 = Codex
- 기능 트랙 = Claude

이번 goal 예외:

### 16.1 Codex 직접 처리 (디자인까지)
- 단순 schema/runtime 위젯 (Text/Heading/Button/Container/Spacer/Divider/Icon/VideoEmbed)
- 기본 Inspector (§12 primitive 조립만)
- 기본 시각 (theme.ts 토큰 + brand kit 기본값)

### 16.2 Codex schema/runtime만, UI는 Claude 별도 트랙
- **M22 W173 Motion timeline editor**:
  - Codex: keyframe array schema + Web Animations runtime + Inspector wiring
  - Claude: keyframe drag UI / easing curve visualizer / 타임라인 시각
- **M22 W174 Custom bezier UI**:
  - Codex: cubic-bezier string schema + 입력 검증
  - Claude: 4-handle bezier 시각 편집기
- **M28 W219 단축키 매핑 UI**:
  - Codex: 단축키 storage + binding 적용 runtime
  - Claude: 매핑 편집 UI

### 16.3 이미 Claude/Codex 처리됨 (재작업 금지)
- ColorPicker / FontPicker advanced (D-POOL-5 Codex)
- PreviewModal device frame (Claude)
- TopBar / Rail / Drawer chrome (D-POOL-1 Codex)
- BlogPostCard / BlogFeed layouts (D-POOL-6 Codex)

### 16.4 충돌 회피 룰
- Codex가 §16.2의 UI 영역에 임의 디자인 작성 금지
- Claude 디자인 트랙 발주 전엔 해당 UI 부분 placeholder만 (`<TODO Claude design />` 주석 + 기능 props만 노출)
- SESSION.md에 매번 Claude 발주 대기 항목 표시:
  "Claude 트랙 대기: M22 timeline UI / M22 bezier UI / M28 shortcut 매핑 UI"

---

END OF MASTER PROMPT.
