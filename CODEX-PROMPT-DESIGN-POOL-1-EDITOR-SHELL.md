# CODEX PROMPT — D-POOL-1: Editor Shell Visual System

> 호정국제 빌더 admin 진입점(SandboxPage)의 chrome — 즉 전체 레이아웃 그리드, 상단 바, 좌측 도크(rail + slide panel), 캔버스 chrome(rulers/grid/zoom dock), 하단 statusbar — 를 Wix Studio / Webflow / Framer 수준의 모던 다크 chrome으로 격상한다. 이 프롬프트는 **트랙 D-POOL-1 전용**이며, Inspector 내부(D-POOL-3), Canvas 오버레이(D-POOL-2), Modal류(D-POOL-4), Picker류(D-POOL-5), Public 위젯(D-POOL-6)은 **터치 금지**.

---

## 0. 목표

1. 현재 `padding: 1rem 1rem 2rem`의 카드형 레이아웃을 **풀-블리드 1뷰포트 에디터 shell**(`100vh`, `overflow: hidden`)로 전환한다.
2. 상단 바를 **56px sticky 헤어라인**으로 고정하고 좌(사이트 셀렉터) / 중(디바이스 토글) / 우(Save·Preview·Publish) 3-zone 레이아웃을 만든다.
3. 좌측을 **60px icon rail + 320px slide panel**의 dock 구조로 정리한다.
4. 캔버스 영역에 **rulers (top + left)** + **dotted grid background** + **줌 dock(좌하)** + **헤어라인 보더 + soft shadow**를 추가한다.
5. 신규 **SandboxStatusBar (28px)** 를 하단에 깔고 zoom%, 위치, 자동저장, 단축키 힌트, dark/light 토글, density 토글을 옮긴다.
6. 디자인 토큰을 **`editorChrome.css`** 로 분리하고 `[data-editor-shell]` 루트 스코프로 격리해 published renderer로의 leak을 차단한다.
7. **Density** (`compact` / `cozy` / `comfortable`) 와 **Theme** (`light` / `dark`) 두 축의 attribute 토글을 도입한다.
8. 모든 모션 200ms `cubic-bezier(0.2, 0.8, 0.2, 1)`, `prefers-reduced-motion: reduce` 시 0ms.
9. focus-ring 2px solid `--editor-accent` + 2px offset, 키보드 네비게이션 보존.
10. 1280 / 980 / 720 세 브레이크포인트 가드.

> 디자인 톤: **모던 다크 chrome (#0F1115 / #1A1B1F) + indigo accent (#6366F1) + 헤어라인 스트로크 (rgba(255,255,255,0.06)) + glassy panel (backdrop-filter: blur(12px))**. 호정의 권위감/절제미는 헤어라인의 정확함, 8px 그리드, "장식 없는" 타이포(Inter / Pretendard)로 표현한다.

---

## 1. 변경 대상 파일 (정확 경로)

### 수정 (소유)
- `src/components/builder/canvas/SandboxPage.tsx` — 루트 `<main>`에 `data-editor-shell` 부착, 레이아웃 그리드 변경, statusbar 마운트
- `src/components/builder/canvas/SandboxPage.module.css` — **additive 마이그레이션** (전면 재작성 금지). 토큰 consume + 신규 chrome 클래스만 추가
- `src/components/builder/canvas/SandboxTopBar.tsx` — 56px sticky 3-zone 그리드, 칩 일부를 statusbar로 이관
- `src/components/builder/canvas/SandboxCatalogPanel.tsx` — chrome (panel header/divider) 만 토큰화
- `src/components/builder/canvas/SandboxLayersPanel.tsx` — chrome 만 토큰화
- `src/components/builder/canvas/PageSwitcher.tsx` — chrome 만 토큰화

### 신규
- `src/components/builder/canvas/tokens/editorChrome.css` — 글로벌 CSS, `[data-editor-shell]` 스코프
- `src/components/builder/canvas/SandboxStatusBar.tsx` — 28px statusbar 컴포넌트

### 터치 금지
- `SandboxInspectorPanel.tsx` 내부 → D-POOL-3 (단, `.inspectorColumn` 래퍼 width/flex 정도는 본 트랙)
- `CanvasContainer.tsx`, `SelectionBox.tsx`, `AlignmentGuides.tsx`, `CanvasNode.tsx` → D-POOL-2
  - 단, **rulers, canvas grid background, zoom dock**은 D-POOL-1 소유
- 모든 `*Modal.tsx` → D-POOL-4
- `ColorPicker.tsx`, `FontPicker.tsx` → D-POOL-5
- `src/components/builder/published/*` → D-POOL-6

---

## 2. 디자인 토큰 (`editorChrome.css` 신규)

> **중요**: `:root` 풀어 놓지 않음. 모든 토큰은 `[data-editor-shell]` 스코프 안에서만.

```css
[data-editor-shell] {
  /* Surface */
  --editor-bg: #F4F5F7;
  --editor-panel: #FFFFFF;
  --editor-panel-elevated: #FFFFFF;
  --editor-canvas-bg: #E9ECF1;
  --editor-overlay: rgba(15, 17, 21, 0.04);

  /* Stroke */
  --editor-border-hairline: rgba(15, 17, 21, 0.08);
  --editor-border-strong: rgba(15, 17, 21, 0.16);
  --editor-divider: rgba(15, 17, 21, 0.06);

  /* Foreground */
  --editor-fg-primary: #0F1115;
  --editor-fg-secondary: #3A3F49;
  --editor-fg-muted: #6B7280;
  --editor-fg-inverse: #FFFFFF;

  /* Accent — indigo */
  --editor-accent: #6366F1;
  --editor-accent-hover: #4F46E5;
  --editor-accent-soft: rgba(99, 102, 241, 0.10);
  --editor-accent-ring: rgba(99, 102, 241, 0.32);

  /* Status */
  --editor-success: #10B981;
  --editor-warning: #F59E0B;
  --editor-error: #EF4444;

  /* Radius */
  --editor-radius-sm: 6px;
  --editor-radius-md: 10px;
  --editor-radius-lg: 14px;
  --editor-radius-pill: 999px;

  /* Shadow */
  --editor-shadow-panel: 0 1px 2px rgba(15, 17, 21, 0.04), 0 8px 24px rgba(15, 17, 21, 0.06);
  --editor-shadow-popover: 0 2px 8px rgba(15, 17, 21, 0.08), 0 16px 40px rgba(15, 17, 21, 0.12);
  --editor-shadow-canvas: 0 0 0 1px rgba(15, 17, 21, 0.06), 0 24px 48px rgba(15, 17, 21, 0.08);

  /* Typography */
  --editor-font-sans: 'Inter', 'Pretendard', system-ui, -apple-system, sans-serif;
  --editor-font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
  --editor-font-size-xs: 11px;
  --editor-font-size-sm: 12px;
  --editor-font-size-md: 13px;
  --editor-font-size-lg: 14px;
  --editor-line-tight: 1.25;
  --editor-line-cozy: 1.4;

  /* Layout */
  --editor-topbar-h: 56px;
  --editor-statusbar-h: 28px;
  --editor-rail-w: 60px;
  --editor-drawer-w: 320px;
  --editor-inspector-w: 320px;
  --editor-ruler-w: 24px;

  /* Motion */
  --editor-ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
  --editor-dur-fast: 120ms;
  --editor-dur-base: 200ms;
  --editor-dur-slow: 320ms;

  /* Density (cozy default) */
  --editor-row-h: 32px;
  --editor-control-h: 30px;
  --editor-pad-x: 12px;
  --editor-pad-y: 8px;
  --editor-gap: 8px;

  /* Z-index */
  --editor-z-canvas: 0;
  --editor-z-overlay: 10;
  --editor-z-rail: 30;
  --editor-z-drawer: 40;
  --editor-z-topbar: 50;
  --editor-z-statusbar: 50;
  --editor-z-toast: 60;
  --editor-z-popover: 70;
}

[data-editor-shell][data-editor-density="compact"] {
  --editor-row-h: 26px;
  --editor-control-h: 26px;
  --editor-pad-x: 8px;
  --editor-pad-y: 5px;
  --editor-gap: 6px;
  --editor-font-size-md: 12px;
}

[data-editor-shell][data-editor-density="comfortable"] {
  --editor-row-h: 38px;
  --editor-control-h: 36px;
  --editor-pad-x: 16px;
  --editor-pad-y: 12px;
  --editor-gap: 12px;
  --editor-font-size-md: 14px;
}

[data-editor-shell][data-editor-theme="dark"] {
  --editor-bg: #0F1115;
  --editor-panel: #1A1B1F;
  --editor-panel-elevated: #232428;
  --editor-canvas-bg: #16181C;
  --editor-overlay: rgba(255, 255, 255, 0.04);
  --editor-border-hairline: rgba(255, 255, 255, 0.06);
  --editor-border-strong: rgba(255, 255, 255, 0.14);
  --editor-divider: rgba(255, 255, 255, 0.05);
  --editor-fg-primary: #F4F5F7;
  --editor-fg-secondary: #C7CAD1;
  --editor-fg-muted: #8A8F99;
  --editor-fg-inverse: #0F1115;
  --editor-accent: #818CF8;
  --editor-accent-hover: #A5B4FC;
  --editor-accent-soft: rgba(129, 140, 248, 0.16);
  --editor-accent-ring: rgba(129, 140, 248, 0.40);
  --editor-shadow-panel: 0 1px 2px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.5);
  --editor-shadow-popover: 0 2px 8px rgba(0, 0, 0, 0.5), 0 16px 40px rgba(0, 0, 0, 0.6);
  --editor-shadow-canvas: 0 0 0 1px rgba(255, 255, 255, 0.06), 0 24px 48px rgba(0, 0, 0, 0.55);
}

@media (prefers-reduced-motion: reduce) {
  [data-editor-shell] * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

[data-editor-shell] :where(button, [role="button"], a, input, select, textarea, [tabindex]):focus-visible {
  outline: 2px solid var(--editor-accent);
  outline-offset: 2px;
  border-radius: var(--editor-radius-sm);
}

[data-editor-shell] *::-webkit-scrollbar { width: 10px; height: 10px; }
[data-editor-shell] *::-webkit-scrollbar-thumb {
  background: var(--editor-border-strong);
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: padding-box;
}
[data-editor-shell] *::-webkit-scrollbar-track { background: transparent; }
```

**Import**: `SandboxPage.tsx` 최상단에 `import './tokens/editorChrome.css';`

---

## 3. SandboxPage 쉘 그리드 (코드 디프)

### 3-1. 구조 변경

**현재**: `padding: 1rem 1rem 2rem` 카드형, `min-height: calc(100vh - 152px)`
**목표**:
```
<main data-editor-shell data-editor-theme=... data-editor-density=...>
  <SandboxTopBar />                    // 56px sticky
  <section.editorShell>                // flex:1, min-height:0
    <.iconRail>     // 60px
    <.drawer>       // 320px slide
    <.canvasColumn> // 1fr (rulers/grid/zoom dock)
    <.inspectorColumn> // 320px
  </section>
  <SandboxStatusBar />                 // 28px
</main>
```

### 3-2. SandboxPage.module.css 디프

```css
/* === BEFORE ===
.shell {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 1rem 1rem 2rem;
  color: #000624;
  font-family: 'Inter', 'Pretendard', system-ui, -apple-system, sans-serif;
}
=== AFTER === */
.shell {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--editor-fg-primary);
  background: var(--editor-bg);
  font-family: var(--editor-font-sans);
  font-size: var(--editor-font-size-md);
  line-height: var(--editor-line-cozy);
}

.editorShell {
  display: flex;
  gap: 0;
  align-items: stretch;
  flex: 1 1 auto;
  min-height: 0;
  background: var(--editor-bg);
}

.iconRail {
  flex: 0 0 var(--editor-rail-w);
  width: var(--editor-rail-w);
  min-width: var(--editor-rail-w);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 6px;
  background: var(--editor-panel);
  border-right: 1px solid var(--editor-border-hairline);
  z-index: var(--editor-z-rail);
}

.drawer {
  flex: 0 0 var(--editor-drawer-w);
  width: var(--editor-drawer-w);
  min-width: var(--editor-drawer-w);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--editor-panel);
  border-right: 1px solid var(--editor-border-hairline);
  box-shadow: var(--editor-shadow-panel);
  transition:
    flex-basis var(--editor-dur-base) var(--editor-ease-out),
    width var(--editor-dur-base) var(--editor-ease-out),
    min-width var(--editor-dur-base) var(--editor-ease-out),
    opacity var(--editor-dur-fast) var(--editor-ease-out);
}

.drawerHidden {
  flex-basis: 0;
  width: 0;
  min-width: 0;
  opacity: 0;
  pointer-events: none;
  border-right-color: transparent;
}

.drawerBody {
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px;
}

.canvasColumn {
  position: relative;
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  border: 0;
  border-radius: 0;
  background: var(--editor-canvas-bg);
  background-image: radial-gradient(
    circle,
    color-mix(in srgb, var(--editor-fg-muted) 18%, transparent) 1px,
    transparent 1.5px
  );
  background-size: 16px 16px;
  background-position: 0 0;
  padding: var(--editor-ruler-w) 24px 56px var(--editor-ruler-w);
}

.inspectorColumn {
  flex: 0 0 var(--editor-inspector-w);
  width: var(--editor-inspector-w);
  min-width: var(--editor-inspector-w);
  background: var(--editor-panel);
  border-left: 1px solid var(--editor-border-hairline);
  overflow-y: auto;
  overflow-x: hidden;
}
```

### 3-3. SandboxPage.tsx — Density / theme hook

```tsx
type EditorDensity = 'compact' | 'cozy' | 'comfortable';
type EditorTheme = 'light' | 'dark';

function useEditorDensity(): [EditorDensity, (d: EditorDensity) => void] {
  const [density, setDensityState] = useState<EditorDensity>('cozy');
  useEffect(() => {
    const stored = window.localStorage.getItem('builder.editor.density') as EditorDensity | null;
    if (stored === 'compact' || stored === 'cozy' || stored === 'comfortable') setDensityState(stored);
  }, []);
  const setDensity = useCallback((d: EditorDensity) => {
    setDensityState(d);
    window.localStorage.setItem('builder.editor.density', d);
  }, []);
  return [density, setDensity];
}

function useEditorTheme(): [EditorTheme, (t: EditorTheme) => void] {
  const [theme, setThemeState] = useState<EditorTheme>('light');
  useEffect(() => {
    const stored = window.localStorage.getItem('builder.editor.theme') as EditorTheme | null;
    if (stored === 'light' || stored === 'dark') setThemeState(stored);
  }, []);
  const setTheme = useCallback((t: EditorTheme) => {
    setThemeState(t);
    window.localStorage.setItem('builder.editor.theme', t);
  }, []);
  return [theme, setTheme];
}
```

마크업:
```tsx
<main className={styles.shell} data-editor-shell="" data-editor-theme={editorTheme} data-editor-density={editorDensity}>
  <SandboxTopBar ... />
  {draftConflict ? <div className={styles.conflictBanner}>...</div> : null}
  <section className={styles.editorShell}>
    <div className={styles.iconRail}>...</div>
    <aside className={`${styles.drawer} ${!activeDrawer ? styles.drawerHidden : ''}`}>...</aside>
    <div className={styles.canvasColumn}>
      <div className={styles.canvasRulerTop} aria-hidden />
      <div className={styles.canvasRulerLeft} aria-hidden />
      {/* CanvasContainer 등 기존 컨텐츠 */}
      <div className={styles.zoomDock}>
        <button className={styles.zoomButton} onClick={() => setEditorZoom(z => Math.max(0.25, z - 0.1))}>−</button>
        <span className={styles.zoomValue}>{Math.round(editorZoom * 100)}%</span>
        <button className={styles.zoomButton} onClick={() => setEditorZoom(z => Math.min(2, z + 0.1))}>+</button>
        <button className={styles.zoomReset} onClick={() => setEditorZoom(1)}>Fit</button>
      </div>
    </div>
    <div className={`${styles.inspectorColumn} ${!hasSelection ? styles.inspectorHidden : ''}`}>...</div>
  </section>
  <SandboxStatusBar
    zoom={editorZoom}
    nodeCount={document?.nodes.length ?? 0}
    selectedSummary={selectedSummary}
    draftSaveState={draftSaveState}
    density={editorDensity}
    onDensityChange={setEditorDensity}
    theme={editorTheme}
    onThemeChange={setEditorTheme}
    onOpenShortcuts={() => setHelpOpen(true)}
  />
</main>
```

`editorZoom` state는 SandboxPage 로컬 (`useState<number>(1)`).

---

## 4. Top Bar 시각 사양 + 코드

### 4-1. 시각

| 항목 | 값 |
|---|---|
| 높이 | 56px |
| 배경 | `var(--editor-panel)` + alpha 0.85 + blur 12px |
| 보더 | `border-bottom: 1px solid var(--editor-border-hairline)` |
| 그리드 | `1fr auto 1fr` |
| 좌 | 사이트셀렉터 + 페이지 슬러그 chip + selection count |
| 중 | 디바이스 토글 (D/T/M) segmented control |
| 우 | save badge / 미리보기 / SEO / 히스토리 / 발행 |

### 4-2. CSS

```css
.topBar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  height: var(--editor-topbar-h);
  padding: 0 16px;
  background: color-mix(in srgb, var(--editor-panel) 85%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--editor-border-hairline);
  z-index: var(--editor-z-topbar);
  border-radius: 0;
  margin: 0;
  animation: none;
}

.topBarLeft  { display: flex; align-items: center; gap: 8px; min-width: 0; }
.topBarMid   { display: flex; align-items: center; justify-content: center; gap: 4px; }
.topBarRight { display: flex; align-items: center; justify-content: flex-end; gap: 6px; min-width: 0; }

.topBarSiteName {
  font-size: 14px;
  font-weight: 700;
  color: var(--editor-fg-primary);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--editor-radius-sm);
  transition: background var(--editor-dur-fast) var(--editor-ease-out);
}
.topBarSiteName:hover { background: var(--editor-overlay); }

.topBarSlug {
  font-family: var(--editor-font-mono);
  font-size: 11px;
  font-weight: 500;
  color: var(--editor-fg-muted);
  padding: 2px 8px;
  border-radius: var(--editor-radius-sm);
  background: var(--editor-overlay);
}

.topBarSelectionChip {
  font-size: 11px;
  font-weight: 600;
  color: var(--editor-accent);
  padding: 2px 8px;
  border-radius: var(--editor-radius-pill);
  background: var(--editor-accent-soft);
}

.deviceToggle {
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 2px;
  border-radius: var(--editor-radius-md);
  background: var(--editor-overlay);
  border: 1px solid var(--editor-border-hairline);
}
.deviceButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 28px;
  min-width: 36px;
  padding: 0 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--editor-fg-secondary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background var(--editor-dur-fast) var(--editor-ease-out), color var(--editor-dur-fast) var(--editor-ease-out);
}
.deviceButton:hover { color: var(--editor-fg-primary); }
.deviceButtonActive {
  background: var(--editor-panel);
  color: var(--editor-accent);
  box-shadow: 0 1px 2px rgba(15, 17, 21, 0.06);
}
.deviceButton svg { width: 14px; height: 14px; }

.topBarGhost {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: var(--editor-radius-sm);
  background: transparent;
  color: var(--editor-fg-secondary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background var(--editor-dur-fast) var(--editor-ease-out), border-color var(--editor-dur-fast) var(--editor-ease-out);
}
.topBarGhost:hover {
  background: var(--editor-overlay);
  border-color: var(--editor-border-hairline);
  color: var(--editor-fg-primary);
}
.topBarGhost:disabled { opacity: 0.4; cursor: not-allowed; }

.topBarPublish {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 14px;
  border: 0;
  border-radius: var(--editor-radius-sm);
  background: var(--editor-accent);
  color: var(--editor-fg-inverse);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background var(--editor-dur-fast) var(--editor-ease-out), transform var(--editor-dur-fast) var(--editor-ease-out);
}
.topBarPublish:hover { background: var(--editor-accent-hover); }
.topBarPublish:active { transform: scale(0.98); }

.saveStatus {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 600;
  color: var(--editor-fg-muted);
  padding: 0 6px;
}
.saveStatus[data-state="saving"] { color: var(--editor-warning); }
.saveStatus[data-state="saved"]  { color: var(--editor-success); }
.saveStatus[data-state="error"]  { color: var(--editor-error); }
.saveStatusDot {
  width: 6px; height: 6px; border-radius: 999px;
  background: currentColor;
}
.saveStatus[data-state="saving"] .saveStatusDot {
  animation: editorPulse 1.2s var(--editor-ease-out) infinite;
}
@keyframes editorPulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.35; }
}
```

### 4-3. SandboxTopBar.tsx 변경

기존 chip(`backend / nodes / selected / Space+drag pan / locale chip`) 모두 statusbar로 이관. topbar는 사이트 이름 / 디바이스 토글 / save badge / 우측 액션만.

```tsx
<header className={styles.topBar} role="banner">
  <div className={styles.topBarLeft}>
    <button className={styles.topBarSiteName} onClick={onOpenSettings}>호정국제</button>
    {activePageId ? <span className={styles.topBarSlug}>/{activePageId}</span> : null}
    {selectionCount > 0 ? <span className={styles.topBarSelectionChip}>{selectionCount}개 선택</span> : null}
  </div>
  <div className={styles.topBarMid}>
    <div className={styles.deviceToggle} role="tablist" aria-label="디바이스">
      {VIEWPORT_OPTIONS.map(option => {
        const active = viewport === option.mode;
        return (
          <button key={option.mode} type="button" role="tab" aria-selected={active}
            className={`${styles.deviceButton} ${active ? styles.deviceButtonActive : ''}`}
            onClick={() => onViewportChange(option.mode)}>
            <DeviceIcon d={option.iconPath} />
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  </div>
  <div className={styles.topBarRight}>
    {saveLabel ? <span className={styles.saveStatus} data-state={draftSaveState}>
      <span className={styles.saveStatusDot} aria-hidden />{saveLabel}
    </span> : null}
    {onLocaleChange ? <LocaleSwitcher ... /> : null}
    {onOpenHistory ? <button className={styles.topBarGhost} onClick={onOpenHistory}>히스토리</button> : null}
    <button className={styles.topBarGhost} disabled={!onOpenPreview} onClick={onOpenPreview}>미리보기</button>
    <button className={styles.topBarGhost} disabled={!canOpenSeo} onClick={onOpenSeo}>SEO</button>
    <button className={styles.topBarPublish} onClick={onPublish}>발행</button>
  </div>
</header>
```

VIEWPORT_OPTIONS: 14×14 viewBox SVG (Heroicons-mini stroke 1.5)

---

## 5. 좌측 도크 (Rail 60px + Panel 320px)

### 5-1. Rail

```css
.railButton {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 48px;
  height: 48px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: var(--editor-radius-md);
  background: transparent;
  color: var(--editor-fg-muted);
  cursor: pointer;
  transition: background var(--editor-dur-fast) var(--editor-ease-out), color var(--editor-dur-fast) var(--editor-ease-out), border-color var(--editor-dur-fast) var(--editor-ease-out);
}
.railButton:hover {
  background: var(--editor-overlay);
  color: var(--editor-fg-primary);
}
.railButtonActive {
  background: var(--editor-accent-soft);
  color: var(--editor-accent);
  border-color: transparent;
  box-shadow: inset 2px 0 0 var(--editor-accent);
}
.railButtonIcon { font-size: 16px; line-height: 1; }
.railButtonLabel {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
```

### 5-2. Drawer

```css
.panelSection {
  position: static;
  border: 0;
  border-radius: 0;
  background: transparent;
  padding: 12px;
  border-bottom: 1px solid var(--editor-divider);
  animation: none;
}

.panelSectionHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.panelSectionHeader span {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--editor-fg-muted);
}
.panelSectionHeader strong {
  font-size: 14px;
  font-weight: 700;
  color: var(--editor-fg-primary);
  margin-top: 2px;
}

.panelHeaderButton {
  height: var(--editor-control-h);
  padding: 0 10px;
  border: 1px solid var(--editor-border-hairline);
  border-radius: var(--editor-radius-sm);
  background: var(--editor-panel-elevated);
  color: var(--editor-fg-secondary);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}
.panelHeaderButton:hover {
  background: var(--editor-overlay);
  border-color: var(--editor-border-strong);
  color: var(--editor-fg-primary);
}

.catalogItem {
  background: var(--editor-panel-elevated);
  border-color: var(--editor-border-hairline);
}
.catalogItem:hover {
  background: var(--editor-overlay);
  border-color: var(--editor-accent);
  box-shadow: 0 1px 2px rgba(15, 17, 21, 0.04);
}
.layerSearchWrap {
  background: var(--editor-overlay);
  border-color: var(--editor-border-hairline);
}
.layerSearchInput {
  background: var(--editor-panel);
  color: var(--editor-fg-primary);
}
.layerSearchInput:focus {
  border-color: var(--editor-accent);
  box-shadow: 0 0 0 3px var(--editor-accent-ring);
}
```

---

## 6. 캔버스 chrome (rulers / grid / zoom dock)

### 6-1. Rulers

```css
.canvasRulerTop,
.canvasRulerLeft {
  position: absolute;
  background: var(--editor-panel);
  border-color: var(--editor-border-hairline);
  z-index: var(--editor-z-overlay);
  pointer-events: none;
}
.canvasRulerTop {
  top: 0;
  left: var(--editor-ruler-w);
  right: 0;
  height: var(--editor-ruler-w);
  border-bottom: 1px solid var(--editor-border-hairline);
  background-image: repeating-linear-gradient(90deg, transparent 0, transparent 49px, var(--editor-border-hairline) 49px, var(--editor-border-hairline) 50px);
}
.canvasRulerLeft {
  top: var(--editor-ruler-w);
  left: 0;
  bottom: 0;
  width: var(--editor-ruler-w);
  border-right: 1px solid var(--editor-border-hairline);
  background-image: repeating-linear-gradient(0deg, transparent 0, transparent 49px, var(--editor-border-hairline) 49px, var(--editor-border-hairline) 50px);
}
.canvasColumn::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: var(--editor-ruler-w); height: var(--editor-ruler-w);
  background: var(--editor-panel);
  border-right: 1px solid var(--editor-border-hairline);
  border-bottom: 1px solid var(--editor-border-hairline);
  z-index: var(--editor-z-overlay);
  pointer-events: none;
}
```

### 6-2. Zoom dock

```css
.zoomDock {
  position: absolute;
  bottom: 16px;
  left: calc(var(--editor-ruler-w) + 16px);
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 32px;
  padding: 2px;
  border-radius: var(--editor-radius-md);
  background: color-mix(in srgb, var(--editor-panel) 90%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--editor-border-hairline);
  box-shadow: var(--editor-shadow-popover);
  z-index: var(--editor-z-overlay);
  font-size: 11px;
}
.zoomButton, .zoomReset {
  height: 28px;
  border: 0;
  background: transparent;
  color: var(--editor-fg-secondary);
  cursor: pointer;
  border-radius: var(--editor-radius-sm);
  transition: background var(--editor-dur-fast) var(--editor-ease-out);
}
.zoomButton {
  width: 28px;
  font-size: 14px;
  font-weight: 700;
}
.zoomReset {
  padding: 0 8px;
  font-weight: 600;
  font-size: 11px;
}
.zoomButton:hover, .zoomReset:hover {
  background: var(--editor-overlay);
  color: var(--editor-fg-primary);
}
.zoomValue {
  font-family: var(--editor-font-mono);
  font-size: 11px;
  font-weight: 600;
  color: var(--editor-fg-primary);
  min-width: 38px;
  text-align: center;
  padding: 0 4px;
  user-select: none;
}
```

---

## 7. SandboxStatusBar (신규, 28px)

```tsx
'use client';
import { useEffect, useState } from 'react';
import styles from './SandboxPage.module.css';

interface Props {
  zoom: number;
  nodeCount: number;
  selectedSummary: string;
  draftSaveState: 'idle' | 'saving' | 'saved' | 'error';
  density: 'compact' | 'cozy' | 'comfortable';
  onDensityChange: (d: 'compact' | 'cozy' | 'comfortable') => void;
  theme: 'light' | 'dark';
  onThemeChange: (t: 'light' | 'dark') => void;
  onOpenShortcuts?: () => void;
}

const DENSITY_LABELS = { compact: 'Compact', cozy: 'Cozy', comfortable: 'Comfy' };

export default function SandboxStatusBar({ zoom, nodeCount, selectedSummary, draftSaveState, density, onDensityChange, theme, onThemeChange, onOpenShortcuts }: Props) {
  const [autosaveAt, setAutosaveAt] = useState<string | null>(null);
  useEffect(() => {
    if (draftSaveState === 'saved') {
      const now = new Date();
      setAutosaveAt(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    }
  }, [draftSaveState]);

  return (
    <footer className={styles.statusBar} role="contentinfo">
      <div className={styles.statusBarLeft}>
        <span className={styles.statusItem}><span className={styles.statusItemKey}>Zoom</span><span className={styles.statusItemVal}>{Math.round(zoom * 100)}%</span></span>
        <span className={styles.statusDivider} aria-hidden />
        <span className={styles.statusItem}><span className={styles.statusItemKey}>Nodes</span><span className={styles.statusItemVal}>{nodeCount}</span></span>
        <span className={styles.statusDivider} aria-hidden />
        <span className={styles.statusItem}><span className={styles.statusItemKey}>Selected</span><span className={styles.statusItemVal}>{selectedSummary}</span></span>
      </div>
      <div className={styles.statusBarMid}>
        <span className={styles.statusHint}>Space + drag: pan</span>
        <span className={styles.statusDivider} aria-hidden />
        <button className={styles.statusButton} onClick={onOpenShortcuts}>? Shortcuts</button>
        {autosaveAt ? <><span className={styles.statusDivider} aria-hidden /><span className={styles.statusItem}><span className={styles.statusItemKey}>Autosaved</span><span className={styles.statusItemVal}>{autosaveAt}</span></span></> : null}
      </div>
      <div className={styles.statusBarRight}>
        <div className={styles.densityChipGroup}>
          {(['compact', 'cozy', 'comfortable'] as const).map(d => (
            <button key={d} className={`${styles.densityChip} ${density === d ? styles.densityChipActive : ''}`}
              aria-pressed={density === d} onClick={() => onDensityChange(d)}>
              {DENSITY_LABELS[d]}
            </button>
          ))}
        </div>
        <span className={styles.statusDivider} aria-hidden />
        <button className={styles.themeToggle} onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')} aria-label="에디터 테마 토글">
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </div>
    </footer>
  );
}
```

CSS:
```css
.statusBar {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  height: var(--editor-statusbar-h);
  padding: 0 12px;
  background: var(--editor-panel);
  border-top: 1px solid var(--editor-border-hairline);
  font-size: 11px;
  color: var(--editor-fg-muted);
  z-index: var(--editor-z-statusbar);
  user-select: none;
}
.statusBarLeft  { display: flex; align-items: center; gap: 8px; flex: 1 1 0; min-width: 0; }
.statusBarMid   { display: flex; align-items: center; gap: 8px; flex: 1 1 0; min-width: 0; justify-content: center; }
.statusBarRight { display: flex; align-items: center; gap: 6px; flex: 1 1 0; min-width: 0; justify-content: flex-end; }

.statusItem { display: inline-flex; align-items: center; gap: 4px; white-space: nowrap; }
.statusItemKey {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--editor-fg-muted);
}
.statusItemVal {
  font-family: var(--editor-font-mono);
  font-size: 11px;
  font-weight: 600;
  color: var(--editor-fg-secondary);
}
.statusDivider {
  width: 1px;
  height: 14px;
  background: var(--editor-divider);
}
.statusHint {
  font-size: 11px;
  font-weight: 500;
  color: var(--editor-fg-muted);
  white-space: nowrap;
}
.statusButton {
  height: 22px;
  padding: 0 8px;
  border: 0;
  border-radius: var(--editor-radius-sm);
  background: transparent;
  color: var(--editor-fg-secondary);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}
.statusButton:hover {
  background: var(--editor-overlay);
  color: var(--editor-fg-primary);
}

.densityChipGroup {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 1px;
  border-radius: 6px;
  background: var(--editor-overlay);
  border: 1px solid var(--editor-border-hairline);
}
.densityChip {
  height: 18px;
  padding: 0 7px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--editor-fg-muted);
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
}
.densityChip:hover { color: var(--editor-fg-primary); }
.densityChipActive {
  background: var(--editor-panel);
  color: var(--editor-accent);
}

.themeToggle {
  width: 22px; height: 22px;
  display: inline-flex; align-items: center; justify-content: center;
  border: 0;
  border-radius: var(--editor-radius-sm);
  background: transparent;
  color: var(--editor-fg-secondary);
  font-size: 12px;
  cursor: pointer;
}
.themeToggle:hover {
  background: var(--editor-overlay);
  color: var(--editor-fg-primary);
}

[data-editor-shell][data-editor-density="compact"] .statusHint { display: none; }
```

---

## 8. 모션 / A11y / 반응형

### 모션
- 표준: 200ms `cubic-bezier(0.2, 0.8, 0.2, 1)`
- 빠름 (hover bg): 120ms
- drawer slide: 200ms
- save dot pulse: 1200ms infinite
- `prefers-reduced-motion: reduce` → 0.01ms (글로벌 룰)

### A11y
- focus-visible: 2px solid accent + 2px offset
- role/aria: banner / contentinfo / tablist / group / pressed / selected
- 색 대비: light AAA (19.4:1), dark AA (14.5:1), muted AA (4.6/4.8:1)
- 키보드: native button 사용 → 자연 tab order
- emoji는 `aria-hidden`, 라벨 텍스트만 SR 노출

### 반응형

```css
@media (max-width: 1279px) {
  [data-editor-shell] { --editor-drawer-w: 280px; --editor-inspector-w: 296px; }
}
@media (max-width: 979px) {
  [data-editor-shell] { --editor-drawer-w: 256px; --editor-inspector-w: 280px; }
  [data-editor-shell] .statusHint { display: none; }
}
@media (max-width: 719px) {
  [data-editor-shell] .drawer:not(.drawerHidden) {
    position: absolute;
    top: var(--editor-topbar-h);
    bottom: var(--editor-statusbar-h);
    left: var(--editor-rail-w);
    z-index: var(--editor-z-drawer);
    box-shadow: var(--editor-shadow-popover);
  }
  [data-editor-shell] .inspectorColumn { --editor-inspector-w: 256px; }
}
```

---

## 9. 검증

### 자동
- `pnpm typecheck` / `pnpm lint` / `pnpm build` 통과
- vitest는 chrome 변경에 깨지지 않음 (Playwright 미설치)

### 수동
- [ ] `/ko/admin-builder` 진입 — 풀-블리드 1뷰포트
- [ ] topbar 56px, statusbar 28px, rail 60px, drawer 320px
- [ ] 디바이스 토글 D/T/M 클릭 → segmented active 120ms 전환
- [ ] rail active — 좌측 indigo strip
- [ ] drawer 토글 200ms slide
- [ ] 캔버스 dotted grid 16px
- [ ] ruler corner / top / left 표시
- [ ] zoom dock — +/− 25–200 범위
- [ ] density 토글 즉시 반영
- [ ] theme 토글 + 새로고침 후 localStorage 복원
- [ ] 키보드 모든 chrome 도달 (focus-ring indigo 2px + offset 2px)
- [ ] reduced-motion 시 슬라이드/펄스 정지

### 비-회귀
- [ ] Inspector 내부 (D-POOL-3) 시각 무변
- [ ] CanvasContainer (D-POOL-2) SelectionBox/AlignmentGuides 동작
- [ ] Modal류 (D-POOL-4) 룩 무변
- [ ] published renderer (`/ko`) 토큰 무상속

---

## 10. 금지 범위

| 영역 | 트랙 | 본 트랙 |
|---|---|---|
| Inspector 내부 | D-POOL-3 | 금지 (단 `.inspectorColumn` 폭/배경/보더는 본 트랙) |
| Canvas overlay | D-POOL-2 | 금지 (rulers/grid/zoom dock은 본 트랙 — DOM 형제 다름) |
| Modal | D-POOL-4 | 금지 |
| ColorPicker / FontPicker | D-POOL-5 | 금지 |
| Published renderer | D-POOL-6 | 금지 |

---

## 11. Wix vs 우리 디자인 차이점

| 영역 | Wix Studio | 본 트랙 | 근거 |
|---|---|---|---|
| accent | blue (#3B82F6) | indigo (#6366F1) | 호정 권위감/절제 |
| topbar bg | 솔리드 | glassy + blur 12 | 레이어 깊이감 |
| topbar height | 60px | 56px | 8px 그리드 정렬 |
| icon rail | label 옵션 | 60px + 9px label 항상 | 한국어 UX 인지 부담 |
| canvas frame | 8px corner | 0 radius, 헤어라인 | "frame-less" 모던 룩 |
| ruler labels | 있음 | strip만 (라벨 후속) | zoom/scroll 결합 후속 |
| zoom dock | 우하/좌하 | 좌하 | rail과 같은 column 일관성 |
| density | on/off | 3단 | 화면크기별 차이 |
| dark mode | OS 따라감 | 수동 (localStorage) | 캔버스 미리보기와 분리 |
| save indicator | chip "Saved" | dot + text | publish primary와 시선 분리 |

---

## 12. 7-step 커밋 분할

### Commit 1 — Tokens scaffold
- 신규 `editorChrome.css` (Section 2)
- `SandboxPage.tsx` import 추가, `<main>` data-editor-* 정적 attr
- 검증: 빌드 통과, 시각 변화 없음

### Commit 2 — Shell layout migration
- `.shell` `.editorShell` `.iconRail` `.drawer` `.canvasColumn` `.inspectorColumn` Section 3-2 AFTER로 교체
- `min-height: 0`, `100vh; overflow: hidden`
- 검증: 페이지 스크롤바 사라짐, 패널 독립 스크롤

### Commit 3 — Top bar restructure
- `SandboxTopBar.tsx` Section 4-3
- `.topBar` 관련 클래스 추가
- 검증: topbar 56px, 발행 indigo, save dot pulse

### Commit 4 — Rail + drawer chrome polish
- `.railButton`, `.panelSection*`, `.catalogItem`, `.layerSearchWrap` 토큰화
- 검증: rail active strip, drawer slide 200ms

### Commit 5 — Canvas chrome (rulers + grid + zoom dock)
- dotted grid + ruler corner mask + zoom dock
- 검증: rulers 정상, grid 16px, zoom +/- 동작

### Commit 6 — StatusBar + density/theme persistence
- `SandboxStatusBar.tsx` 신규
- `useEditorDensity` / `useEditorTheme` hook
- 검증: density/theme 토글 + localStorage 복원

### Commit 7 — Responsive + a11y polish
- 1280/980/720 미디어 가드
- focus-visible / aria-* 점검
- reduced-motion 검증

---

## 부록 — Migration risk notes

1. **인라인 스타일 vs 모듈 클래스**: chrome 영역만 토큰화, 다른 트랙 영역 인라인 유지.
2. **`.breakpointSwitcher` 등 dead code**: 본 PR에서 제거 X (별도 cleanup PR).
3. **emoji vs SVG**: rail emoji 보존, 디바이스 토글만 SVG.
4. **글로벌 CSS 임포트**: `editorChrome.css`는 SandboxPage import (admin-builder 진입에서만).
5. **Hydration**: density/theme 초기 항상 cozy/light, useEffect에서 localStorage.
6. **`editorZoom`**: SandboxPage 로컬 state, store 승격은 D-POOL-2 협업 후속.

끝.
