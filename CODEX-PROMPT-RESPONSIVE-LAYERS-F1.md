# CODEX 발주 프롬프트 — F1 반응형 Inspector + Layers 계층 탐색기

> **발행일**: 2026-04-30
> **선행**: B3/B6/B7/C1/D1/E1 모두 완료
> **분담**: Codex 담당 — Inspector breakpoint switcher 디자인 + SandboxLayersPanel을 hierarchy explorer로 재작성. Claude Agent는 Responsive schema/resolver와 registry 정합성 진행 중.
> **충돌 회피**: F1 = Inspector 시각/Layers 시각 + breakpoint toolbar UI. Claude는 schema(types.ts) + resolver(public-page) + store actions. 파일 분리.

---

## 1. 목적

Wix Studio에서 가장 시그니처 두 UX를 우리에게 이식:
1. **Breakpoint switcher** (Desktop/Tablet/Mobile 토글 + viewport별 override 시각화)
2. **Layers hierarchy explorer** (현재 flat z-index → Wix Studio식 트리 + 검색 + overlap selection)

호정 사이트 사용자가 "Wix Studio다" 라고 느끼는 핵심 두 표면.

---

## 2. 작업 범위

### 2.1 Breakpoint Switcher (상단 toolbar)

**현재 상태**:
- `SandboxTopBar.tsx`에 desktop/tablet/mobile toggle 이미 있음 (`ViewportMode`)
- 하지만 단순 wrapper 폭만 변경, override 시각 표시 없음

**목표 디자인 (Wix Studio 참고)**:
- Toolbar 중앙 또는 우측에 3 아이콘 (Desktop 🖥️ / Tablet 📱 / Mobile 📞)
- 활성 viewport는 큰 강조 (primary color border + bg)
- 각 viewport 표시 폭 텍스트 (1280 / 768 / 375)
- 우측에 "Reset to desktop" 버튼 (override 있을 때만 활성)
- **Override indicator**: 현재 viewport에 override가 있는 노드 선택 시 → Inspector에 작은 점/배지 표시 (Layout 탭의 X/Y/W/H 옆에 ● 표시 — primary 색)
- 캔버스: viewport 전환 시 stage width 변경 + override 적용 미리보기 (Claude agent가 해석 함수 만들면 자동)

**파일**:
- 수정: `src/components/builder/canvas/SandboxTopBar.tsx`
- 수정: `src/components/builder/canvas/SandboxInspectorPanel.tsx` (Layout 탭에 override indicator)
- 신규: `src/components/builder/editor/BreakpointBadge.tsx` (재사용 가능 작은 dot)

### 2.2 Layers Hierarchy Explorer

**현재 상태**:
- `SandboxLayersPanel.tsx` flat z-index 순 리스트. 부모-자식 관계 표시 안 됨
- 검색 / overlap selection / hover highlight 없음

**목표 디자인 (Wix Studio Layers 참고)**:

#### 2.2.1 트리 구조
- 부모 컨테이너 → 들여쓰기 자식 (16px per level)
- expand/collapse caret (▶ ▼)
- 각 행: `[caret] [icon: kind glyph] [name/id] [eye toggle] [lock toggle] [⋯ menu]`
- 활성 그룹 (`activeGroupId`) 표시: 좌측 4px primary border + bg highlight

#### 2.2.2 검색
- 패널 상단 search input (placeholder "노드 검색...")
- 매칭: id / kind / content text (text 노드의 text / button label) substring
- 매칭된 노드는 강조 + 부모 자동 expand
- 비매칭은 dimmed (`opacity 0.4`)

#### 2.2.3 Hover highlight
- 트리 항목 hover → canvas의 해당 노드에 outline 4px primary
- 선택 시 동일 (이미 selectedNode 있음)

#### 2.2.4 Overlap selection
- 캔버스 클릭 시 같은 위치에 여러 노드 겹쳐 있으면 가장 위 z-index 선택 (현재)
- **신규**: Alt+클릭 또는 우측 작은 화살표로 "다음 겹친 노드" 사이클 (Wix Studio 패턴)
- 또는 클릭 시 작은 "겹친 노드 N개" 팝업으로 선택 (단순 버전 OK)

#### 2.2.5 Drag-reorder
- 트리 행 drag handle (☰)로 위아래 드래그 → z-index 변경
- 다른 부모로 drag → parent 변경 (이미 store에 `moveNodeIntoContainer` 있음)

**파일**:
- 수정: `src/components/builder/canvas/SandboxLayersPanel.tsx` 전면 재작성
- 신규: `src/components/builder/canvas/LayersTreeRow.tsx` (개별 행 컴포넌트)
- 신규: `src/components/builder/canvas/LayerSearchInput.tsx` (선택, 인라인도 OK)

### 2.3 Snap/shortcut/toolbar parity (선택, 시간 남으면)

**현재 부족**:
- Resize 시 grid snap 약함 (스냅 모드 토글 없음)
- 겹친 요소 Esc 취소 흐름
- Alt-drag로 복사 (Wix 표준)

**목표**:
- Toolbar에 "Snap to grid" 토글 (8px / 16px / 24px / off)
- Esc 누르면 진행 중인 drag/resize cancel (rect 복원)
- Alt-drag = 노드 복사 후 새 위치에 (기존 동작 유지하면서 복제 추가)

**파일**:
- 수정: `src/components/builder/canvas/CanvasContainer.tsx` (drag handler에 Alt 분기)
- 수정: `src/components/builder/canvas/SandboxTopBar.tsx` (snap 토글)
- 수정: `src/lib/builder/canvas/snap.ts` (snap size 변수화)

(선택 항목이라 시간 부족하면 skip. 필수는 2.1 + 2.2)

### 2.4 디자인 톤 (Wix Studio 참고)

- Breakpoint switcher: 다크/투명 배경, 활성 시 흰 bg + primary text
- Layers tree: 좁은 폰트 (font-size 12px), padding 4px, 행 height 24px
- Tree icons: divider/spacer 단순 글리프 (이미 SandboxLayersPanel에 있음 - 재활용)
- Search: 상단 sticky, focus 시 primary border
- Hover highlight 캔버스 outline: `2px solid var(--primary, #3b82f6)`, transition opacity 100ms
- Override indicator dot: 6px primary circle, label "tablet" / "mobile"

---

## 3. 검증 방법

```bash
cd /Users/son7/Projects/tseng-law
npm run lint
npm run build
npx tsc --noEmit --incremental false
```

**브라우저**:
1. `/ko/admin-builder` Basic Auth: `admin / local-review-2026!`
2. Top toolbar에 Desktop/Tablet/Mobile 토글 → 클릭 시 stage width 변경 + 활성 강조
3. 노드 선택 → Layout 탭 → tablet override 했으면 X/Y 옆 ● 점
4. Reset 버튼 클릭 → override 제거 (Claude resolver와 통합되어야 동작)
5. 좌측 Layers 패널 → 트리 구조 (부모-자식 들여쓰기)
6. 검색창에 "hero" 입력 → 매칭 강조 + 비매칭 dimmed
7. 트리 행 hover → canvas에 outline 표시
8. 트리 drag-reorder → z-index 변경
9. 캔버스 Alt+클릭 (선택) → 겹친 다음 노드 사이클

---

## 4. 작업 규칙 (`AGENTS.md` 준수)

- **Claude Agent F2 (Responsive schema/resolver) 영역 건드리지 말 것**:
  - `src/lib/builder/canvas/types.ts`의 `responsive` field 추가/스키마 정의 (Claude)
  - `src/lib/builder/site/public-page.tsx`의 viewport resolver 로직 (Claude)
  - `src/lib/builder/canvas/store.ts`의 viewport-aware mutation (Claude)
- **Claude Agent F3 영역 건드리지 말 것**:
  - `types.ts`의 새 node kinds 추가 (registry parity)
  - `registry.ts` 등록
- **Codex 자유 영역**: TopBar viewport switcher 시각, Inspector breakpoint indicator, LayersPanel 전면 재작성, Tree 행 컴포넌트, search UI, hover highlight CSS
- legacy-*.tsx 본문 수정 금지
- composite/Render.tsx legacy 폴백 제거 금지
- `tree.ts` / `seed-home v` 변경 금지
- `git push --force`, `--no-verify` 금지

---

## 5. Definition of Done

- [ ] Breakpoint switcher 시각 + 활성 강조 + width 표시 + Reset 버튼
- [ ] Inspector Layout 탭에 override indicator dot
- [ ] LayersPanel 트리 구조 (부모-자식 들여쓰기 + caret)
- [ ] Layers 검색 (id/kind/content 텍스트)
- [ ] Layers hover → canvas outline highlight
- [ ] Layers drag-reorder z-index/parent
- [ ] (선택) Snap 토글 + Esc cancel + Alt-drag 복사
- [ ] lint/build/tsc 통과
- [ ] 브라우저 9단계 통과
- [ ] SESSION.md commit + 한줄 요약 갱신

---

## 6. 인수인계

작업 완료 시 commit 분할 권장:
- `F1-1 breakpoint switcher visual + override indicator`
- `F1-2 layers hierarchy explorer (tree + search + hover + drag)`
- `F1-3 (optional) snap toggle / esc cancel / alt-drag copy`

다음 세션 후보 제안 (`F5 timeline animation`, `F6 multi-step forms` 등)

---

이 프롬프트: `/Users/son7/Projects/tseng-law/CODEX-PROMPT-RESPONSIVE-LAYERS-F1.md`. Codex 던질 때 경로만 알려주면 됨.
