# CODEX PROMPT — D-POOL-4: Modal & Gallery & Settings System

You are the implementation agent for **D-POOL-4: Modal & Gallery & Settings System** in the 호정국제 빌더 프로젝트.

## 0. 목표

윅스 본가급 모달 시스템 1:1 패리티. 6개 모달을 단일 `ModalShell`로 통일하고, `SiteSettingsModal`을 시각 중심으로 격상하고, `TemplateGalleryModal`의 SVG wireframe 썸네일을 **HTML scaled mock** 렌더러로 교체.

핵심 결정:
1. **ModalShell 자체 구현** — 외부 dep 0. focus trap / esc / body-scroll-lock(reference-counted) / portal / prefers-reduced-motion 통합. z-index `base 9500 / nested 9700`.
2. **Tab 매핑 재구성** — 기존 6탭 (`settings / brand / colors / dark / typography / presets`) → 신규 6탭 (`general / brand / typography / presets / dark / advanced`). `colors` 탭의 **theme color tokens는 advanced로**, **site fonts(heading/body)는 typography로** 분리 흡수.
3. **Thumbnail 렌더러: Option B (HTML scaled mock)** — iframe×170 메모리 폭발 회피, 외부 dep 0, WeakMap+Map 2단 캐시 (템플릿당 최대 6 entries, FIFO 축출), IntersectionObserver lazy mount.
4. **Dark 탭** Light/Dark 좌우 분할 동시 미리보기.
5. **Presets 탭** hero gradient + 큰 Aa + 5색 swatch row 카드 그리드.
6. **6 모달 모두 ModalShell** 흡수 → 인라인 keyframes (`publishBackdropIn`, `publishModalIn`, `cropBackdropIn`, `cropModalIn`, `templateGalleryFadeIn`, `templateGalleryScaleIn`) 모두 제거. **글로벌 `fadeIn` (SandboxPage.module.css:2153)는 유지** — D2/D3 다른 컴포넌트가 사용 중이므로 절대 삭제 금지.

## 1. 변경 대상 파일

### 신규
- `src/components/builder/canvas/ModalShell.tsx`
- `src/components/builder/canvas/ModalShell.module.css`
- `src/components/builder/canvas/TemplateThumbnailRenderer.tsx`
- `src/components/builder/canvas/template-thumbnail-cache.ts`

### 수정
- `src/components/builder/canvas/SiteSettingsModal.tsx` — 6탭 재구성, 좌측 사이드 탭 레이아웃, ModalShell 흡수
- `src/components/builder/canvas/TemplateGalleryModal.tsx` — ModalShell 흡수, 썸네일 렌더러 교체, lazy mount
- `src/components/builder/canvas/TemplateThumbnailPlaceholder.tsx` — `TemplateThumbnailRenderer`로 위임만 남김 (호환 shim)
- `src/components/builder/canvas/ShortcutsHelpModal.tsx` — ModalShell 흡수
- `src/components/builder/canvas/MoveToPageModal.tsx` — ModalShell 흡수
- `src/components/builder/canvas/PublishModal.tsx` — ModalShell 흡수, 인라인 keyframes 제거
- `src/components/builder/canvas/CropModal.tsx` — ModalShell 흡수, 인라인 keyframes 제거
- `src/components/builder/editor/BrandKitPanel.tsx` — 시각 격상

### 절대 터치 금지
- `SandboxPage.tsx`, `SandboxPage.module.css` (D1)
- `Canvas*.tsx`, `*Overlay*.tsx` (D2)
- `SandboxInspectorPanel.tsx`, `SelectionToolbar.tsx`, `*ContextMenu*.tsx` (D3)
- `ColorPicker.tsx`, `FontPicker.tsx` 내부 (D5) — 호출만 OK
- `src/components/builder/published/*` (D6) — `DarkModeToggle.tsx`는 참조만 OK
- `AssetLibraryModal.tsx` — D-POOL-4 외부, ModalShell 통일 대상 아님

## 2. ModalShell (신규 통일 컴포넌트, 전체 코드)

```tsx
// src/components/builder/canvas/ModalShell.tsx
'use client';

import {
  useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState,
  type CSSProperties, type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import styles from './ModalShell.module.css';

export type ModalShellSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalShellTone = 'default' | 'neutral';

export interface ModalShellAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'warning';
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
}

export interface ModalShellProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  size?: ModalShellSize;
  tone?: ModalShellTone;
  nested?: boolean;
  dismissable?: boolean;
  toolbar?: ReactNode;
  children: ReactNode;
  footerHint?: ReactNode;
  actions?: ModalShellAction[];
  className?: string;
  bodyFlush?: boolean;
  fullViewport?: boolean;
  ariaLabel?: string;
  panelRef?: React.MutableRefObject<HTMLDivElement | null>;
}

const SIZE_WIDTHS: Record<ModalShellSize, number | string> = {
  sm: 440, md: 560, lg: 760, xl: 1080, full: '90vw',
};

const FOCUSABLE_SELECTOR = [
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"]):not([type="hidden"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]:not([tabindex="-1"])',
].join(',');

const scrollLock = (() => {
  let count = 0;
  let savedOverflow = '';
  let savedPaddingRight = '';
  return {
    acquire() {
      if (typeof document === 'undefined') return;
      if (count === 0) {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        savedOverflow = document.body.style.overflow;
        savedPaddingRight = document.body.style.paddingRight;
        document.body.style.overflow = 'hidden';
        if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      count += 1;
    },
    release() {
      if (typeof document === 'undefined') return;
      count = Math.max(0, count - 1);
      if (count === 0) {
        document.body.style.overflow = savedOverflow;
        document.body.style.paddingRight = savedPaddingRight;
      }
    },
  };
})();

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

function getActionStyle(variant: ModalShellAction['variant']): string {
  if (variant === 'primary') return styles.actionPrimary;
  if (variant === 'danger') return styles.actionDanger;
  if (variant === 'warning') return styles.actionWarning;
  if (variant === 'ghost') return styles.actionGhost;
  return styles.actionSecondary;
}

export default function ModalShell({
  open, onClose, title, subtitle, size = 'md', tone = 'default', nested = false,
  dismissable = true, toolbar, children, footerHint, actions, className,
  bodyFlush = false, fullViewport = false, ariaLabel, panelRef,
}: ModalShellProps) {
  const titleId = useId();
  const subtitleId = useId();
  const internalPanelRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useMemo(() => prefersReducedMotion(), []);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!open) return undefined;
    scrollLock.acquire();
    return () => scrollLock.release();
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return undefined;
    restoreFocusRef.current = (document.activeElement as HTMLElement) ?? null;
    const panel = internalPanelRef.current;
    if (panel) {
      const focusables = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      (focusables[0] ?? panel).focus({ preventScroll: true });
    }
    return () => {
      const previous = restoreFocusRef.current;
      if (previous && typeof previous.focus === 'function') {
        try { previous.focus({ preventScroll: true }); } catch {}
      }
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (!dismissable) return;
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const panel = internalPanelRef.current;
      if (!panel) return;
      const nodes = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
        .filter((n) => !n.hasAttribute('disabled') && n.tabIndex !== -1);
      if (nodes.length === 0) {
        event.preventDefault();
        panel.focus({ preventScroll: true });
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey) {
        if (active === first || active === panel) {
          event.preventDefault();
          last.focus({ preventScroll: true });
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    }
    window.addEventListener('keydown', handleKey, true);
    return () => window.removeEventListener('keydown', handleKey, true);
  }, [open, onClose, dismissable]);

  const handleBackdropClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!dismissable) return;
    if (event.target === event.currentTarget) onClose();
  }, [dismissable, onClose]);

  const setPanel = useCallback((node: HTMLDivElement | null) => {
    internalPanelRef.current = node;
    if (panelRef) panelRef.current = node;
  }, [panelRef]);

  const visibleActions = actions ?? [];
  const widthValue = SIZE_WIDTHS[size];
  const panelStyle: CSSProperties = fullViewport
    ? { width: '90vw', maxWidth: 1380, height: '88vh' }
    : { width: typeof widthValue === 'number' ? `min(${widthValue}px, 92vw)` : widthValue, maxHeight: '88vh' };

  if (!open || !mounted) return null;

  const root = (
    <div
      className={[styles.backdrop, nested ? styles.backdropNested : '', className ?? ''].filter(Boolean).join(' ')}
      onClick={handleBackdropClick}
      data-modal-shell="true"
      data-modal-nested={nested ? 'true' : 'false'}
      data-modal-tone={tone}
      data-reduce-motion={reduceMotion ? 'true' : 'false'}
    >
      <div
        ref={setPanel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitle ? subtitleId : undefined}
        aria-label={ariaLabel}
        tabIndex={-1}
        className={[styles.panel, fullViewport ? styles.panelFull : '', tone === 'neutral' ? styles.panelNeutral : ''].filter(Boolean).join(' ')}
        style={panelStyle}
      >
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h2 id={titleId} className={styles.title}>{title}</h2>
            {subtitle ? <p id={subtitleId} className={styles.subtitle}>{subtitle}</p> : null}
          </div>
          <button type="button" aria-label="Close" className={styles.closeButton} onClick={onClose} disabled={!dismissable}>
            <span aria-hidden>×</span>
          </button>
        </header>
        {toolbar ? <div className={styles.toolbar}>{toolbar}</div> : null}
        <div className={[styles.body, bodyFlush ? styles.bodyFlush : ''].filter(Boolean).join(' ')}>
          {children}
        </div>
        {visibleActions.length > 0 || footerHint ? (
          <footer className={styles.footer}>
            <div className={styles.footerHint}>{footerHint}</div>
            <div className={styles.actions}>
              {visibleActions.map((action, i) => (
                <button key={`${action.label}-${i}`} type="button"
                  className={[styles.actionButton, getActionStyle(action.variant)].join(' ')}
                  disabled={action.disabled || action.loading}
                  aria-label={action.ariaLabel ?? action.label}
                  onClick={action.onClick}>
                  {action.loading ? <span className={styles.spinner} aria-hidden /> : null}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </footer>
        ) : null}
      </div>
    </div>
  );

  return createPortal(root, document.body);
}
```

## 3. ModalShell.module.css (전체 코드)

```css
@keyframes modalShellBackdropIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes modalShellPanelIn {
  from { opacity: 0; transform: scale(0.96) translateY(6px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.backdrop {
  position: fixed;
  inset: 0;
  z-index: 9500;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: modalShellBackdropIn 200ms ease both;
  padding: 24px;
  box-sizing: border-box;
}

.backdropNested {
  z-index: 9700;
  background: rgba(15, 23, 42, 0.62);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.backdrop[data-reduce-motion="true"],
.backdropNested[data-reduce-motion="true"] {
  animation: none;
}

.panel {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 32px 80px rgba(15, 23, 42, 0.32), 0 12px 28px rgba(15, 23, 42, 0.18);
  overflow: hidden;
  outline: none;
  animation: modalShellPanelIn 220ms cubic-bezier(0.16, 1, 0.3, 1) both;
  min-height: 0;
}

.backdrop[data-reduce-motion="true"] .panel {
  animation: none;
}

.panelNeutral { background: #f8fafc; }

.panelFull {
  width: 90vw !important;
  max-width: 1380px !important;
  height: 88vh !important;
  max-height: 88vh !important;
}

.header {
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  align-items: start;
  padding: 18px 22px 16px;
  border-bottom: 1px solid #e2e8f0;
  min-height: 64px;
  box-sizing: border-box;
}

.headerText { min-width: 0; }
.title {
  margin: 0;
  font-size: 1.18rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.3;
  letter-spacing: -0.01em;
}
.subtitle {
  margin: 6px 0 0;
  font-size: 0.82rem;
  color: #64748b;
  line-height: 1.45;
}

.closeButton {
  width: 36px;
  height: 36px;
  border: 1px solid #dbe3ef;
  border-radius: 9px;
  background: #ffffff;
  color: #475569;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 120ms ease, color 120ms ease, border-color 120ms ease;
}
.closeButton:hover:not(:disabled) {
  background: #f1f5f9;
  color: #0f172a;
  border-color: #cbd5e1;
}
.closeButton:focus-visible {
  outline: 2px solid #116dff;
  outline-offset: 2px;
}
.closeButton:disabled { opacity: 0.4; cursor: not-allowed; }

.toolbar {
  flex: 0 0 auto;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
}

.body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: 24px;
  background: inherit;
  box-sizing: border-box;
}

.bodyFlush {
  padding: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.footer {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 22px;
  border-top: 1px solid #e2e8f0;
  background: #ffffff;
  min-height: 64px;
  box-sizing: border-box;
}

.footerHint {
  flex: 1 1 auto;
  min-width: 0;
  font-size: 0.78rem;
  color: #64748b;
  line-height: 1.45;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.actionButton {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border-radius: 9px;
  border: 1px solid transparent;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease, border-color 120ms ease, transform 100ms ease;
  min-height: 38px;
}
.actionButton:focus-visible { outline: 2px solid #116dff; outline-offset: 2px; }
.actionButton:disabled { opacity: 0.55; cursor: not-allowed; }

.actionPrimary { background: #116dff; color: #ffffff; border-color: #116dff; }
.actionPrimary:hover:not(:disabled) { background: #0b5cdb; border-color: #0b5cdb; }

.actionSecondary { background: #ffffff; color: #334155; border-color: #cbd5e1; }
.actionSecondary:hover:not(:disabled) { background: #f8fafc; border-color: #94a3b8; }

.actionGhost { background: transparent; color: #475569; border-color: transparent; }
.actionGhost:hover:not(:disabled) { background: #f1f5f9; }

.actionDanger { background: #dc2626; color: #ffffff; border-color: #dc2626; }
.actionDanger:hover:not(:disabled) { background: #b91c1c; border-color: #b91c1c; }

.actionWarning { background: #ffffff; color: #92400e; border-color: #f59e0b; }
.actionWarning:hover:not(:disabled) { background: #fffbeb; }

.spinner {
  width: 12px;
  height: 12px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: modalShellSpin 700ms linear infinite;
}

@keyframes modalShellSpin {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .backdrop { padding: 12px; }
  .panel { border-radius: 14px; }
  .header, .footer { padding-left: 16px; padding-right: 16px; }
  .body { padding: 18px; }
}
```

## 4. SiteSettingsModal 격상

### 탭 매핑

| 신규 | 기존 흡수 | 내용 |
|---|---|---|
| general | settings | 사무소 정보 폼 |
| brand | brand | BrandKitPanel |
| typography | typography + colors의 site fonts | Theme text presets 5종 + heading/body FontPicker |
| presets | presets | 5개 SITE_THEME_PRESETS 카드 그리드 |
| dark | dark | Light/Dark 좌우 분할 미리보기 |
| advanced | colors의 theme color tokens | THEME_COLOR_TOKENS 5종 raw hex |

**중요**: colors 탭 분리 — site fonts는 typography로, theme tokens는 advanced로.

### 레이아웃

```
ModalShell (size="xl", bodyFlush, width 880)
 ├── header: "사이트 설정" + 부제
 ├── body (flex row, no padding):
 │   ├── 좌측 사이드 (220px) - 탭 리스트 (vertical)
 │   │   각 탭: 36px 아이콘 + 라벨 + active 시 좌측 4px accent bar
 │   └── 우측 컨텐츠 (1fr) - 패널 영역, padding 24
 └── footer: 좌측 status + 우측 [취소] [저장]
```

### 탭별 내용

- **General**: 기존 settings 컨텐츠. FIELDS 배열 유지. "기본 정보" / "법적 정보" / "사이트 ID" 그룹화.
- **Brand kit**: BrandKitPanel (§8 시각 격상)
- **Typography**: Theme text presets 5개 카드 (heading/subheading/title/body/caption) + Site fonts (heading FontPicker + body FontPicker)
- **Presets**: 5개 SITE_THEME_PRESETS 카드. 각: hero gradient + Aa + 5색 swatch row + 설명 + body sample + Apply 버튼
- **Dark**: runtime 설정 + Light/Dark 좌우 분할 동시 미리보기 + dark color tokens
- **Advanced**: 6 raw hex token + radius scale + Reset to default

### 코드 골격

```tsx
const TABS = [
  { key: 'general', label: 'General', icon: '⚙' },
  { key: 'brand', label: 'Brand kit', icon: '✦' },
  { key: 'typography', label: 'Typography', icon: 'A' },
  { key: 'presets', label: 'Presets', icon: '◐' },
  { key: 'dark', label: 'Dark mode', icon: '☾' },
  { key: 'advanced', label: 'Advanced', icon: '⚒' },
] as const;

return (
  <ModalShell open={open} onClose={onClose} title="사이트 설정"
    subtitle="Brand kit · Typography · Dark · Presets로 사이트 전체 디자인을 한 화면에서 통제합니다."
    size="xl" bodyFlush
    actions={[
      { label: '취소', variant: 'secondary', onClick: onClose },
      { label: saving ? '저장 중...' : '저장', variant: 'primary', loading: saving, disabled: saving || loading, onClick: handleSave },
    ]}
    footerHint={error ? <span style={{ color: '#dc2626' }}>{error}</span> : notice ? <span style={{ color: '#0f766e' }}>{notice}</span> : null}>
    <div style={{ display: 'flex', minHeight: 0, flex: 1 }}>
      <nav style={tabSidebarStyle} aria-label="설정 탭">
        {TABS.map(tab => (
          <button key={tab.key} style={tabButtonStyle(activeTab === tab.key)} onClick={() => setActiveTab(tab.key)}>
            <span style={{ width: 4, height: 22, borderRadius: 2, background: activeTab === tab.key ? '#116dff' : 'transparent' }} />
            <span aria-hidden>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
      <section style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {/* 각 탭 컨텐츠 */}
      </section>
    </div>
  </ModalShell>
);
```

### 보존 로직
- `fetchSettings` / `handleSave` / `applyPreset` / `applyBrandKitToState` / `exportBrandKit` / `importBrandKit` 그대로
- `mergeTheme` / `themeFromPreset` / `toSettingsForm` / `toSettingsPayload` / `normalizeDarkModeConfig` / `isValidHexColor` 그대로
- `previewDark` state 제거 (좌우 분할로 항상 둘 다 표시)

## 5. TemplateGalleryModal 격상

### 변경
1. ModalShell로 교체 (`fullViewport`, `bodyFlush`)
2. `TemplateThumbnailRenderer`로 썸네일 교체
3. PreviewPanel은 nested ModalShell (`nested={true}`, z-index 9700), viewport switcher는 toolbar
4. 인라인 keyframes 블록 제거 (그리드 미디어 쿼리만 유지)

```tsx
return (
  <>
    <ModalShell open onClose={onClose} title="프리미엄 템플릿 쇼룸"
      subtitle="업종, 스타일, 밀도, 페이지 타입으로 고르고 desktop/tablet/mobile 첫인상을 확인하세요."
      fullViewport bodyFlush tone="neutral">
      <div className="template-gallery-body" style={{ display: 'grid', gridTemplateColumns: '230px minmax(0, 1fr)', minHeight: 0, flex: 1 }}>
        <aside className="template-gallery-sidebar">{/* TEMPLATE_CATEGORIES.map */}</aside>
        <main style={{ minWidth: 0, padding: 22, overflowY: 'auto', background: '#f8fafc' }}>
          {/* search row + filters + featured + grid */}
        </main>
      </div>
    </ModalShell>
    {previewTemplate ? (
      <ModalShell open onClose={() => setPreviewTemplate(null)}
        title={previewTemplate.name} subtitle={getTemplateQualityLabel(previewTemplate)}
        size="xl" nested bodyFlush
        toolbar={<ViewportSwitcher value={viewport} onChange={setViewport} />}
        actions={[
          { label: '닫기', variant: 'secondary', onClick: () => setPreviewTemplate(null) },
          { label: '이 템플릿 사용', variant: 'primary', onClick: () => selectTemplate(previewTemplate) },
        ]}>
        {/* 좌: preview canvas / 우: meta sidebar */}
      </ModalShell>
    ) : null}
  </>
);
```

## 6. TemplateThumbnailRenderer (HTML scaled mock + 캐시)

### template-thumbnail-cache.ts

```ts
import type { ReactElement } from 'react';
import type { PageTemplate } from '@/lib/builder/templates/types';

type ThumbnailKey = string;

interface TemplateCacheEntry {
  insertionOrder: ThumbnailKey[];
  byKey: Map<ThumbnailKey, ReactElement>;
}

const MAX_ENTRIES_PER_TEMPLATE = 6;
const cache = new WeakMap<PageTemplate, TemplateCacheEntry>();

export function buildThumbnailKey(width: number, height: number, tone: string): ThumbnailKey {
  return `${width}x${height}@${tone}`;
}

export function getCachedThumbnail(template: PageTemplate, key: ThumbnailKey): ReactElement | undefined {
  return cache.get(template)?.byKey.get(key);
}

export function setCachedThumbnail(template: PageTemplate, key: ThumbnailKey, element: ReactElement): void {
  let entry = cache.get(template);
  if (!entry) {
    entry = { insertionOrder: [], byKey: new Map() };
    cache.set(template, entry);
  }
  if (entry.byKey.has(key)) {
    entry.insertionOrder = entry.insertionOrder.filter((k) => k !== key);
    entry.insertionOrder.push(key);
    entry.byKey.set(key, element);
    return;
  }
  entry.byKey.set(key, element);
  entry.insertionOrder.push(key);
  while (entry.insertionOrder.length > MAX_ENTRIES_PER_TEMPLATE) {
    const evict = entry.insertionOrder.shift();
    if (evict) entry.byKey.delete(evict);
  }
}

export function clearThumbnailCache(template: PageTemplate): void {
  cache.delete(template);
}
```

### TemplateThumbnailRenderer.tsx

핵심 알고리즘:
- 노드 최대 60개 (zIndex 정렬)
- 각 노드 → CSS-positioned `<div>`로 렌더 (image=gradient, button=accent, heading=ink, text=mutedInk, divider=line, container=surface)
- transform scale로 width × document.stageWidth 비율 적용
- IntersectionObserver `rootMargin: '200px 0px'`
- footer ribbon (template name + visualStyle/pageType)
- premium 배지 (top-right pill)

```tsx
'use client';
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactElement } from 'react';
import type { PageTemplate } from '@/lib/builder/templates/types';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { resolveCanvasNodeAbsoluteRect } from '@/lib/builder/canvas/tree';
import { getTemplatePalette } from '@/lib/builder/templates/design-system';
import { buildThumbnailKey, getCachedThumbnail, setCachedThumbnail } from './template-thumbnail-cache';

const MAX_NODES = 60;
type ThumbnailTone = 'light' | 'dark' | 'preview';

interface Props {
  template: PageTemplate;
  width?: number;
  height?: number;
  tone?: ThumbnailTone;
  eager?: boolean;
}

function renderThumbnail(template: PageTemplate, width: number, height: number, tone: ThumbnailTone): ReactElement {
  const document = template.document;
  const palette = getTemplatePalette(template.paletteKey);
  const scale = Math.min(width / document.stageWidth, height / document.stageHeight);
  const renderWidth = document.stageWidth * scale;
  const renderHeight = document.stageHeight * scale;
  const offsetX = (width - renderWidth) / 2;
  const offsetY = (height - renderHeight) / 2;
  const nodesById = new Map(document.nodes.map(n => [n.id, n]));
  const nodes = [...document.nodes]
    .filter(n => n.visible !== false)
    .sort((l, r) => l.zIndex - r.zIndex)
    .slice(0, MAX_NODES);

  const imageGradient = `linear-gradient(135deg, ${palette.surfaceAlt} 0%, ${palette.accentSoft} 48%, ${palette.accent} 100%)`;
  const canvasGradient = `linear-gradient(135deg, ${palette.canvas} 0%, ${palette.surface} 58%, ${palette.accentSoft} 100%)`;
  const glow = `radial-gradient(circle at 80% 12%, ${palette.accent}55 0%, ${palette.accent}00 60%)`;

  return (
    <div style={{ position: 'relative', width, height, overflow: 'hidden', background: canvasGradient, fontFamily: 'Inter, system-ui, sans-serif', contain: 'strict' }} aria-hidden>
      <div style={{ position: 'absolute', inset: 0, background: glow, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: offsetX, top: offsetY, width: renderWidth, height: renderHeight, background: palette.surface, opacity: 0.82, border: `1px solid ${palette.line}`, borderRadius: 2 }} />
      {nodes.map(node => {
        const rect = resolveCanvasNodeAbsoluteRect(node, nodesById);
        const x = offsetX + rect.x * scale;
        const y = offsetY + rect.y * scale;
        const w = Math.max(1, rect.width * scale);
        const h = Math.max(1, rect.height * scale);
        const isContainer = node.kind === 'container' || node.kind === 'section' || node.kind === 'composite';
        let bg: string;
        if (node.kind === 'image' || node.kind === 'video-embed' || node.kind === 'gallery') bg = imageGradient;
        else if (node.kind === 'button' || node.kind === 'form-submit') bg = palette.accent;
        else if (node.kind === 'heading') bg = palette.ink;
        else if (node.kind === 'text') bg = palette.mutedInk;
        else if (node.kind === 'divider' || node.kind === 'spacer') bg = palette.line;
        else if (node.kind === 'icon') bg = palette.accent;
        else if (String(node.kind).startsWith('form')) bg = palette.accentSoft;
        else if (isContainer) bg = palette.surface;
        else bg = palette.surfaceAlt;
        return (
          <div key={node.id} style={{ position: 'absolute', left: x, top: y, width: w, height: h, background: bg, opacity: isContainer ? 0.85 : 1, borderRadius: node.kind === 'button' ? Math.max(3, Math.min(12, h * 0.18)) : 5, border: isContainer ? `0.7px solid ${palette.line}` : 'none', boxShadow: node.kind === 'button' ? `0 1px 2px ${palette.ink}33` : 'none' }} />
        );
      })}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 38, background: palette.ink, opacity: 0.92, color: palette.inverse, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, fontWeight: 700 }}>
        <span style={{ width: 30, height: 4, borderRadius: 2, background: palette.accent, flexShrink: 0 }} />
        <div style={{ minWidth: 0, overflow: 'hidden' }}>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{template.name}</div>
          <div style={{ opacity: 0.72, fontSize: 7.5, fontWeight: 600 }}>{[template.visualStyle, template.pageType].filter(Boolean).join(' / ')}</div>
        </div>
      </div>
      {template.qualityTier === 'premium' ? (
        <div style={{ position: 'absolute', top: 10, right: 10, background: palette.accent, color: palette.inverse, fontSize: 8, fontWeight: 800, padding: '3px 8px', borderRadius: 999, letterSpacing: '0.05em' }}>PREMIUM</div>
      ) : null}
      {tone === 'dark' ? (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.36)', mixBlendMode: 'multiply', pointerEvents: 'none' }} />
      ) : null}
    </div>
  );
}

export default function TemplateThumbnailRenderer({ template, width = 320, height = 190, tone = 'light', eager = false }: Props) {
  const [visible, setVisible] = useState(eager);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (eager || visible) return undefined;
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') { setVisible(true); return undefined; }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); break; }
      }
    }, { rootMargin: '200px 0px', threshold: 0 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [eager, visible]);

  const cachedKey = useMemo(() => buildThumbnailKey(width, height, tone), [width, height, tone]);
  const palette = useMemo(() => getTemplatePalette(template.paletteKey), [template.paletteKey]);

  const rendered = useMemo<ReactElement | null>(() => {
    if (!visible) return null;
    const cached = getCachedThumbnail(template, cachedKey);
    if (cached) return cached;
    const built = renderThumbnail(template, width, height, tone);
    setCachedThumbnail(template, cachedKey, built);
    return built;
  }, [template, cachedKey, visible, width, height, tone]);

  return (
    <div ref={containerRef} role="img" aria-label={`${template.name} 템플릿 미리보기`}
      style={{ width, height, display: 'block', position: 'relative', background: palette.canvas }}>
      {rendered ?? (
        <div style={{ width, height, background: `linear-gradient(135deg, ${palette.canvas} 0%, ${palette.surface} 60%, ${palette.accentSoft} 100%)`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 18, top: 22, width: '40%', height: 8, background: palette.line, opacity: 0.7, borderRadius: 4 }} />
          <div style={{ position: 'absolute', left: 18, top: 36, width: '64%', height: 6, background: palette.line, opacity: 0.5, borderRadius: 3 }} />
          <div style={{ position: 'absolute', left: 18, bottom: 24, width: 64, height: 18, background: palette.accent, opacity: 0.55, borderRadius: 6 }} />
        </div>
      )}
    </div>
  );
}
```

### TemplateThumbnailPlaceholder.tsx (호환 shim)

```tsx
import type { PageTemplate } from '@/lib/builder/templates/types';
import TemplateThumbnailRenderer from './TemplateThumbnailRenderer';

export default function TemplateThumbnailPlaceholder({ template, width = 240, height = 160 }: { template: PageTemplate; width?: number; height?: number }) {
  return <TemplateThumbnailRenderer template={template} width={width} height={height} />;
}
```

## 7. ShortcutsHelpModal / MoveToPageModal / PublishModal / CropModal 통일

### ShortcutsHelpModal
```tsx
return (
  <ModalShell open onClose={onClose} title="키보드 단축키" subtitle="Esc 또는 화면 바깥 클릭으로 닫습니다."
    size="lg" actions={[{ label: '닫기', variant: 'secondary', onClick: onClose }]}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
      {groups.map(group => ...)}
    </div>
  </ModalShell>
);
```

### MoveToPageModal
```tsx
return (
  <ModalShell open onClose={onClose} title="페이지로 이동"
    subtitle={`선택된 ${sourceNodeIds.length}개 요소를 다른 페이지로 옮깁니다.`}
    size="md"
    footerHint={errorMessage ? <span style={{ color: '#dc2626' }}>{errorMessage}</span> : submitting ? '이동 중...' : null}
    actions={[{ label: '닫기', variant: 'secondary', onClick: onClose, disabled: submitting }]}>
    {/* targets 리스트 */}
  </ModalShell>
);
```

### PublishModal
- 인라인 `keyframesCSS` 통째로 삭제, `<style>` 삭제
- `backdropStyle`, `modalStyle` 삭제

```tsx
return (
  <ModalShell open={open} onClose={onClose} title="Publish Page"
    subtitle={activePageId ? `revision ${draftMeta?.revision ?? 0} 기준 발행 예정` : undefined}
    size="md" footerHint={publishState === 'checking' ? '발행 가능 여부 확인 중...' : null}
    actions={[
      { label: publishState === 'success' ? '닫기' : '취소', variant: 'secondary', onClick: onClose },
      ...(publishState !== 'success' && hasWarningsOnly && !overrideWarnings
        ? [{ label: '경고 무시하고 발행', variant: 'warning' as const, onClick: () => setOverrideWarnings(true) }]
        : []),
      ...(publishState !== 'success'
        ? [{ label: publishState === 'publishing' ? '발행 중...' : '발행', variant: 'primary' as const,
            loading: publishState === 'publishing',
            disabled: !canPublish || publishState !== 'ready' || ((suite?.warningCount ?? 0) > 0 && !overrideWarnings),
            onClick: handlePublish }]
        : []),
    ]}>
    {/* checking / blockers / warnings / infos / success / error */}
  </ModalShell>
);
```

### CropModal
- 인라인 `CROP_KEYFRAMES`, `<style>`, `backdropStyle`, `modalStyle` 모두 삭제

```tsx
return (
  <ModalShell open={open} onClose={onClose} title="Crop Image" size="md"
    actions={[
      { label: 'Cancel', variant: 'secondary', onClick: onClose },
      { label: 'Apply', variant: 'primary', onClick: () => onConfirm(selectedAspect) },
    ]}>
    <div style={imageContainerStyle}>{/* image + ratio overlay */}</div>
    <div style={{ marginTop: 14, fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Aspect Ratio</div>
    <div style={ratioRowStyle}>{/* ratio buttons */}</div>
  </ModalShell>
);
```

## 8. BrandKitPanel 시각 격상

### 변경
1. Logo hero — 170px → 220px 카드, preview 92→108
2. 5색 swatch row (primary/secondary/accent/text/background)
3. Color tokens — "swatch 64×40 + label + hex input" 3-컬럼 그리드, hover scale 1.04 + accent ring
4. Typography preview — title/body font 옆 "Aa Body sample" 라이브 미리보기
5. Footer borderTop 구분선
6. AssetLibraryModal 호출 그대로 (ModalShell nested 동작)

### Logo hero

```tsx
<div style={{ width: 220, border: '1px solid #e2e8f0', borderRadius: 14, padding: 14, background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 12 }}>
  <div style={sectionHeadingStyle}>Logo</div>
  <div style={{ minHeight: 108, border: '1px dashed #cbd5e1', borderRadius: 12, background: value.colors.background, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 10 }}>
    {logoPreview ? <img src={logoPreview} alt="" style={{ maxWidth: '100%', maxHeight: 88, objectFit: 'contain' }} />
      : <span style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700 }}>Logo preview</span>}
  </div>
  <div aria-label="Brand swatch row" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
    {BRAND_COLOR_KEYS.map(key => (
      <span key={key} title={key} style={{ height: 28, borderRadius: 8, background: value.colors[key], border: '1px solid rgba(15,23,42,0.08)' }} />
    ))}
  </div>
</div>
```

### Color tokens

```tsx
{BRAND_COLOR_KEYS.map(key => (
  <div key={key} style={{ ...fieldStyle, gap: 8 }}>
    <label style={labelStyle}>{THEME_COLOR_LABELS[key]}</label>
    <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 10, alignItems: 'center' }}>
      <label style={{ width: 64, height: 40, borderRadius: 10, background: value.colors[key], border: '1px solid rgba(15,23,42,0.12)', cursor: 'pointer', position: 'relative', transition: 'transform 120ms ease' }}>
        <input type="color" value={...} style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer' }} onChange={...} />
      </label>
      <input type="text" value={value.colors[key]} style={inputStyle} onChange={...} />
    </div>
  </div>
))}
```

### Typography preview

```tsx
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
  <div style={fieldStyle}>
    <label>Title font</label>
    <FontPicker value={value.fonts.title} onChange={...} />
    <div style={{ marginTop: 8, padding: 12, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
      <div style={{ fontFamily: value.fonts.title, fontSize: 28, color: value.colors.text }}>Aa</div>
      <div style={{ fontFamily: value.fonts.title, fontSize: 13, color: value.colors.secondary }}>The quick brown fox</div>
    </div>
  </div>
  <div style={fieldStyle}>
    <label>Body font</label>
    <FontPicker value={value.fonts.body} onChange={...} />
    <div style={{ marginTop: 8, padding: 12, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
      <div style={{ fontFamily: value.fonts.body, fontSize: 14, color: value.colors.text }}>안녕하세요. 호정국제법률사무소입니다.</div>
    </div>
  </div>
</div>
```

## 9. 모션 / A11y

### 모션
- Backdrop fade 200ms ease
- Panel scale + translate 220ms cubic-bezier(0.16, 1, 0.3, 1)
- 카드 hover translateY -2px 160ms
- `prefers-reduced-motion: reduce` 시 모든 keyframe 제거

### A11y
- `role="dialog"` + `aria-modal="true"` + `aria-labelledby` + `aria-describedby`
- ESC 닫기 (capture phase)
- 외부 클릭 닫기
- Focus trap: 첫 focusable, Tab 순환
- Restore focus
- Reference-counted body scroll lock (nested 안전)

### Nested behavior
- 외부 ModalShell capture handler 등록
- nested mount 시 `event.stopPropagation()`
- nested 닫힐 때 외부 정상 동작

## 10. 6단계 commit 분할

### Commit 1: ModalShell 인프라
ModalShell.tsx + ModalShell.module.css. Reference-counted body-scroll, portal mount, ESC + backdrop close, focus trap. z-index 9500/9700. 4 size + fullViewport.

### Commit 2: TemplateThumbnailRenderer
template-thumbnail-cache.ts + TemplateThumbnailRenderer.tsx + TemplateThumbnailPlaceholder.tsx (compat shim). WeakMap+Map 2-tier cache, max 6 entries, IntersectionObserver lazy mount with 200px rootMargin.

### Commit 3: SiteSettingsModal 격상
6 tabs side nav. colors split: theme tokens → advanced, site fonts → typography. Dark side-by-side. Presets card grid.

### Commit 4: TemplateGalleryModal 격상
ModalShell + TemplateThumbnailRenderer. PreviewPanel = nested ModalShell. 인라인 keyframes 제거.

### Commit 5: 나머지 4 모달 ModalShell 흡수
ShortcutsHelpModal, MoveToPageModal, PublishModal (publishBackdropIn/publishModalIn 제거), CropModal (cropBackdropIn/cropModalIn 제거). 글로벌 fadeIn 보존.

### Commit 6: BrandKitPanel 시각 격상
Logo hero 220 wide + 5색 swatch row. Color tokens 64×40 swatch buttons. Title/body font live "Aa" + Korean sample.

## 11. 22단계 검증

### 빌드 / 정적
1. `pnpm tsc --noEmit` 통과
2. 인라인 모달 keyframes 0건: `grep -rn "publishBackdropIn\|publishModalIn\|cropBackdropIn\|cropModalIn\|templateGalleryFadeIn\|templateGalleryScaleIn" src/components/builder/canvas/`
3. `import TemplateThumbnailPlaceholder` grep — gallery 외부에서 0건
4. ModalShell 외부 dep 0 확인

### 모달 동작
5. SiteSettingsModal 6탭 클릭 → active accent bar 토글
6. General 탭 폼 입력 + 저장 → API PUT 200
7. Brand kit Apply → theme 즉시 변경
8. Typography heading/body FontPicker 동작
9. Presets 5개 카드 hero gradient + Aa + 5색
10. Dark 좌우 분할, light 색 변경 시 dark 갱신
11. Advanced 6 raw hex 편집, 잘못된 hex 시 빨강
12. ESC → 닫힘, focus 복귀
13. 외부 클릭 → 닫힘. nested 시 nested만

### Template gallery
14. 90vw / 88vh, 카테고리 사이드 + 그리드
15. IntersectionObserver lazy 로드
16. 카드 hover translateY -2px
17. PreviewPanel nested 9700
18. ViewportSwitcher 동작 + 별도 cache key
19. 캐시 동작
20. 170 템플릿 + 메모리 ~200MB 이내

### A11y
21. 키보드 Tab 순회, focus 트랩
22. `prefers-reduced-motion: reduce` 시 즉시

## 12. 금지 범위

1. `SandboxPage.module.css` 글로벌 `fadeIn` (line 2153) — D2/D3 사용 중
2. `SeoPanel.tsx`, `SelectionToolbar.tsx`, `FilterPanel.tsx`, `VersionHistoryPanel.tsx`, `SandboxInspectorPanel.tsx` — `animation: 'fadeIn 150ms ease'` 보존
3. `published/SiteHeader.tsx`, `DarkModeToggle.tsx` — D6 영역
4. `ColorPicker.tsx`, `FontPicker.tsx` 내부 — D5
5. `AssetLibraryModal.tsx` — D-POOL-4 외부, ModalShell 통일 안함
6. `SaveSectionModal.tsx`, `SubmissionDetailModal.tsx`, `PreviewModal.tsx`, `NewColumnModal.tsx` — 다른 트랙
7. `src/app/`, `src/lib/builder/site/`, `templates/registry.ts` — 빌더 외부
8. `BrandKit` JSON 스키마 (`@/lib/builder/site/theme`) — 변경 금지
9. `TemplateThumbnailPlaceholder` shim 즉시 삭제 금지
10. SiteSettingsModal fetch 경로 / 페이로드 모양 — 변경 금지

---

**완료 정의**: 6 commit 머지 + 22단계 검증 통과 = D-POOL-4 완료.
