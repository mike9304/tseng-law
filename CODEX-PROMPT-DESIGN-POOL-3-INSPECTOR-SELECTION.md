# CODEX PROMPT — D-POOL-3: Inspector + Selection UI Cluster

> 너는 호정국제 빌더 프로젝트의 Senior Implementation Codex. 트랙 **D-POOL-3** 을 다음 명세로 1:1 구현한다. 메인 에이전트가 본 문서를 검수하며, 너는 코드만 정확히 산출한다.
> **레포:** `/Users/son7/Projects/tseng-law`
> **금지 영역:** SandboxPage 쉘(D1) / Canvas 오버레이(D2) / Modal(D4) / Picker 내부(D5, 단 swatch trigger 제외) / Public(D6).
> **폰트/이모지:** 본가 Wix 의 시각 언어를 따라 라벨은 **uppercase 11px**, 아이콘은 lucide 또는 단색 SVG 우선. 이모지는 기능 라벨(📌 / ⚓ / 🔗 등)에서만 허용.

---

## 0. 목표

1. 우측 **SandboxInspectorPanel** 을 **3대 메인 탭(Layout / Style / Content) + A11y/SEO/Animations** 구조로 재정렬하고, 모든 control row 를 **하나의 primitive 라이브러리 (`InspectorControls.tsx`)** 위에서 그린다.
2. 선택이 없을 때 빈 상태(Empty), 다중 선택 시 공통 속성 + **Mixed values dash**, 단일 선택 시 풀 폼이 자동 전환된다.
3. **SelectionToolbar** 를 macOS 다크 floating bar 로 격상 — blur, separator, 액션 그룹화, "더보기" 버튼이 ContextMenu 와 동일한 30+ 액션 트리거.
4. **ContextMenu** 를 30+ 액션 / 섹션 separator / 키보드 단축키 우측 정렬 / 위험 액션 분리 / 서브메뉴(▶) 가 가능한 macOS-style 메뉴로 격상.
5. 모든 색/스페이싱은 신규 `inspector-tokens.css` 로 통일하여 다크 모드 / 추후 Brand kit 연결을 대비.

---

## 1. 변경 대상 파일

**수정**
- `src/components/builder/canvas/SandboxInspectorPanel.tsx` — 3탭 + 빈/다중 상태 + primitive 사용으로 재구성.
- `src/components/builder/canvas/SelectionToolbar.tsx` — 다크 + blur + separator + 액션 그룹.
- `src/components/builder/canvas/ContextMenu.tsx` — 서브메뉴, kbd 정렬, 위험 분리.
- `src/components/builder/canvas/CanvasContainer.tsx` — ContextMenu actions 배열을 30+ 항목으로 확장(키 추가만 하고, 미구현 store 액션은 `() => {}` placeholder + `disabled: true` + `title: 'Coming soon — Codex F-track'`).
- `src/components/builder/canvas/SandboxPage.module.css` — context menu / selection toolbar 의 다크/blur/divider 토큰 활용 변형. 기존 `.contextMenu`/`.contextMenuAction` 셀렉터는 보존하되 색을 토큰화.

**신규**
- `src/components/builder/canvas/inspector-tokens.css` — Inspector / Toolbar / ContextMenu 공유 디자인 토큰. SandboxPage 라우트에서 1회 import.
- `src/components/builder/canvas/InspectorControls.tsx` — 7개 primitive: `LabeledRow` / `NumberStepper` / `SegmentedControl` / `SwatchRow` / `SliderRow` / `ToggleRow` / `AdvancedDisclosure` (+ 공용 `MixedValueIndicator`).

**터치 금지** (구조 또는 시그니처 변경 금지):
- `src/components/builder/canvas/SandboxPage.tsx` (쉘은 D1)
- `src/components/builder/canvas/CanvasNode.tsx` 내부 렌더 로직 (D2)
- `src/components/builder/editor/ColorPicker.tsx` 내부 (D5; trigger swatch 만 본 트랙)
- `src/lib/builder/site/theme-bindings.ts` 내부 (그대로 import)

> **이름 통일 (중요):** 본가 패리티를 위해 7개 primitive 중 첫 번째 이름은 `LabeledRow` 로 고정한다. 작업 도중 보일 수 있는 별칭 `InspectorRow` 는 모두 `LabeledRow` 로 표준화한다.

---

## 2. InspectorControls primitives 라이브러리 (신규, 전체 코드)

`src/components/builder/canvas/InspectorControls.tsx` 를 다음과 동일하게 작성한다. 모든 primitive 는 **uncontrolled-friendly + `mixed?: boolean` + `linkedToken?` + `detached?` + `disabled?`** 를 받는다. props 타입은 `export` 한다.

```tsx
'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import {
  getThemeBindingBadgeStyle,
  type ThemeBindingTone,
} from '@/lib/builder/site/theme-bindings';

export type InspectorMixed = boolean;

export interface InspectorTokenBinding {
  token?: string;
  tone?: ThemeBindingTone;
  onToggleLink?: () => void;
}

interface BaseControlProps {
  disabled?: boolean;
  mixed?: boolean;
  hasOverride?: boolean;
}

export function MixedValueIndicator({ label = 'Mixed' }: { label?: string }) {
  return (
    <span
      role="status"
      aria-label="Mixed values"
      title="여러 선택 항목의 값이 다릅니다. 새 값을 입력하면 모두에 적용됩니다."
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        height: 24,
        padding: '0 8px',
        borderRadius: 6,
        background: 'var(--insp-mixed-bg, #f1f5f9)',
        color: 'var(--insp-mixed-fg, #64748b)',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.04em',
      }}
    >
      <span aria-hidden style={{ fontFamily: 'system-ui', fontSize: 13, lineHeight: 1 }}>—</span>
      {label}
    </span>
  );
}

export interface LabeledRowProps {
  label: string;
  hint?: string;
  binding?: InspectorTokenBinding;
  dense?: boolean;
  children: ReactNode;
  hasOverride?: boolean;
  id?: string;
  title?: string;
  helper?: ReactNode;
}

export function LabeledRow({
  label, hint, binding, dense = false, children, hasOverride = false, id, title, helper,
}: LabeledRowProps) {
  return (
    <div
      id={id}
      data-has-override={hasOverride ? 'true' : undefined}
      data-dense={dense ? 'true' : undefined}
      className="insp-row"
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(72px, 0.9fr) minmax(0, 1.1fr)',
        alignItems: 'center',
        columnGap: 12,
        minHeight: dense ? 28 : 34,
        padding: '0 4px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
        <span
          title={title ?? label}
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--insp-label, #475569)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {label}
        </span>
        {hint ? (
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--insp-label-hint, #94a3b8)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
            {hint}
          </span>
        ) : null}
        {binding?.tone ? (
          <button
            type="button"
            onClick={binding.onToggleLink}
            disabled={!binding.onToggleLink}
            title={binding.token ? `Bound to ${binding.token}` : 'Theme binding'}
            style={{ ...getThemeBindingBadgeStyle(binding.tone), cursor: binding.onToggleLink ? 'pointer' : 'default', border: 'none' }}
          >
            <span aria-hidden style={{ width: 6, height: 6, borderRadius: 999, background: 'currentColor', marginRight: 4, opacity: 0.85 }} />
            {binding.tone === 'linked' ? 'Linked' : binding.tone === 'detached' ? 'Detached' : 'Custom'}
          </button>
        ) : null}
        {hasOverride ? (
          <span aria-hidden title="현재 viewport override 적용됨" style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--insp-override-dot, #f59e0b)', marginLeft: 'auto' }} />
        ) : null}
      </div>
      <div style={{ minWidth: 0, display: 'flex', justifyContent: 'flex-end' }}>
        {children}
      </div>
      {helper ? (
        <div style={{ gridColumn: '1 / -1', marginTop: 4, fontSize: 11, color: '#64748b' }}>
          {helper}
        </div>
      ) : null}
    </div>
  );
}

export interface NumberStepperProps extends BaseControlProps {
  value: number | null;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  width?: number;
  fineStep?: number;
  ariaLabel?: string;
}

export const NumberStepper = forwardRef<HTMLInputElement, NumberStepperProps>(function NumberStepper(
  { value, onChange, min, max, step = 1, suffix, width = 96, fineStep, mixed, disabled, ariaLabel }, ref,
) {
  const [draft, setDraft] = useState<string>(value === null ? '' : String(value));
  useEffect(() => { setDraft(value === null ? '' : String(value)); }, [value]);
  const commit = useCallback((raw: string) => {
    const trimmed = raw.trim();
    if (trimmed === '') return;
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed)) { setDraft(value === null ? '' : String(value)); return; }
    const clamped = Math.min(max ?? Infinity, Math.max(min ?? -Infinity, parsed));
    onChange(clamped);
  }, [max, min, onChange, value]);
  const stepBy = useCallback((multiplier: number) => {
    const base = value ?? 0;
    const delta = (fineStep ?? step) * multiplier;
    onChange(Math.min(max ?? Infinity, Math.max(min ?? -Infinity, base + delta)));
  }, [fineStep, max, min, onChange, step, value]);
  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') { event.currentTarget.blur(); return; }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const dir = event.key === 'ArrowUp' ? 1 : -1;
      const mult = event.shiftKey ? 10 : event.altKey ? 0.1 : 1;
      stepBy(dir * mult);
    }
  }, [stepBy]);
  if (mixed) return <MixedValueIndicator />;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'stretch', height: 28, width, borderRadius: 8, border: '1px solid var(--insp-input-border, #e2e8f0)', background: disabled ? '#f8fafc' : 'var(--insp-input-bg, #fff)', overflow: 'hidden', opacity: disabled ? 0.55 : 1 }}>
      <button type="button" aria-label="Decrease" disabled={disabled} onClick={() => stepBy(-1)} style={{ width: 22, border: 'none', background: 'transparent', color: '#64748b', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>−</button>
      <input ref={ref} type="text" inputMode="numeric" aria-label={ariaLabel} disabled={disabled} value={draft}
        onChange={(e) => setDraft(e.target.value)} onBlur={(e) => commit(e.target.value)} onKeyDown={handleKeyDown}
        style={{ flex: 1, minWidth: 0, textAlign: 'center', fontSize: 12, fontVariantNumeric: 'tabular-nums', fontWeight: 600, background: 'transparent', border: 'none', outline: 'none', color: 'var(--insp-input-fg, #0f172a)' }} />
      {suffix ? <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0 6px', fontSize: 10, color: '#94a3b8', borderLeft: '1px solid var(--insp-input-border, #e2e8f0)' }}>{suffix}</span> : null}
      <button type="button" aria-label="Increase" disabled={disabled} onClick={() => stepBy(1)} style={{ width: 22, border: 'none', background: 'transparent', color: '#64748b', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>+</button>
    </div>
  );
});

export interface SegmentedOption<T extends string> { value: T; label?: string; icon?: ReactNode; title?: string; }
export interface SegmentedControlProps<T extends string> extends BaseControlProps {
  options: SegmentedOption<T>[];
  value: T | null;
  onChange: (next: T) => void;
  size?: 'sm' | 'md';
  ariaLabel?: string;
}

export function SegmentedControl<T extends string>({ options, value, onChange, size = 'sm', mixed, disabled, ariaLabel }: SegmentedControlProps<T>) {
  if (mixed) return <MixedValueIndicator />;
  const h = size === 'md' ? 30 : 26;
  return (
    <div role="radiogroup" aria-label={ariaLabel} style={{ display: 'inline-flex', height: h, padding: 2, borderRadius: 8, background: 'var(--insp-segment-bg, #f1f5f9)', border: '1px solid var(--insp-input-border, #e2e8f0)', opacity: disabled ? 0.55 : 1 }}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button key={option.value} type="button" role="radio" aria-checked={active} disabled={disabled} title={option.title} onClick={() => onChange(option.value)}
            style={{ minWidth: option.label ? 36 : h - 4, padding: option.label ? '0 8px' : 0, border: 'none', borderRadius: 6, background: active ? 'var(--insp-segment-active-bg, #fff)' : 'transparent', color: active ? 'var(--insp-segment-active-fg, #0f172a)' : '#64748b', fontSize: 11, fontWeight: 700, letterSpacing: '0.02em', boxShadow: active ? '0 1px 2px rgba(15,23,42,0.10)' : 'none', cursor: disabled ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            {option.icon}
            {option.label ? <span>{option.label}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

export interface SwatchRowProps extends BaseControlProps {
  cssValue: string | null;
  onClick: () => void;
  linkedToken?: string;
  detached?: boolean;
  ariaLabel?: string;
  size?: number;
}

export function SwatchRow({ cssValue, onClick, linkedToken, detached = false, mixed, disabled, ariaLabel, size = 24 }: SwatchRowProps) {
  if (mixed) return <MixedValueIndicator />;
  const tone: ThemeBindingTone = linkedToken ? 'linked' : detached ? 'detached' : 'custom';
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={ariaLabel ?? 'Open color picker'}
      title={linkedToken ? `Linked to ${linkedToken}` : detached ? 'Detached color' : 'Custom color'}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 28, padding: '0 8px 0 4px', borderRadius: 8, border: '1px solid var(--insp-input-border, #e2e8f0)', background: 'var(--insp-input-bg, #fff)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1 }}>
      <span aria-hidden style={{ width: size, height: size, borderRadius: 6, backgroundImage: 'linear-gradient(45deg,#e5e7eb 25%,transparent 25%,transparent 75%,#e5e7eb 75%),linear-gradient(45deg,#e5e7eb 25%,transparent 25%,transparent 75%,#e5e7eb 75%)', backgroundSize: '8px 8px', backgroundPosition: '0 0, 4px 4px', position: 'relative', border: '1px solid rgba(15,23,42,0.10)' }}>
        <span style={{ position: 'absolute', inset: 0, borderRadius: 5, background: cssValue ?? 'transparent' }} />
      </span>
      <span style={getThemeBindingBadgeStyle(tone)}>
        <span aria-hidden style={{ width: 6, height: 6, borderRadius: 999, background: 'currentColor', marginRight: 4, opacity: 0.85 }} />
        {tone === 'linked' ? 'Linked' : tone === 'detached' ? 'Detached' : 'Custom'}
      </span>
    </button>
  );
}

export interface SliderRowProps extends BaseControlProps {
  value: number | null;
  onChange: (next: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  ariaLabel?: string;
}

export function SliderRow({ value, onChange, min, max, step = 1, suffix, mixed, disabled, ariaLabel }: SliderRowProps) {
  if (mixed) return <MixedValueIndicator />;
  const v = value ?? min;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, width: '100%' }}>
      <input type="range" aria-label={ariaLabel} disabled={disabled} min={min} max={max} step={step} value={v}
        onChange={(e) => onChange(Number(e.target.value))} style={{ flex: 1, accentColor: 'var(--insp-accent, #2563eb)' }} />
      <span style={{ minWidth: 38, textAlign: 'right', fontSize: 11, fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: '#0f172a' }}>
        {v}{suffix ? <span style={{ color: '#94a3b8', marginLeft: 2 }}>{suffix}</span> : null}
      </span>
    </div>
  );
}

export interface ToggleRowProps extends BaseControlProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  ariaLabel?: string;
}

export function ToggleRow({ checked, onChange, mixed, disabled, ariaLabel }: ToggleRowProps) {
  if (mixed) return <MixedValueIndicator />;
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={ariaLabel} disabled={disabled} onClick={() => onChange(!checked)}
      style={{ position: 'relative', width: 36, height: 20, padding: 0, borderRadius: 999, border: '1px solid var(--insp-input-border, #e2e8f0)', background: checked ? 'var(--insp-accent, #2563eb)' : 'var(--insp-segment-bg, #e2e8f0)', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background 120ms ease', opacity: disabled ? 0.55 : 1 }}>
      <span aria-hidden style={{ position: 'absolute', top: 1, left: checked ? 17 : 1, width: 16, height: 16, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px rgba(15,23,42,0.18)', transition: 'left 140ms ease' }} />
    </button>
  );
}

export interface AdvancedDisclosureProps {
  label?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (next: boolean) => void;
  children: ReactNode;
}

export function AdvancedDisclosure({ label = 'Advanced', defaultOpen = false, open, onOpenChange, children }: AdvancedDisclosureProps) {
  const [internal, setInternal] = useState(defaultOpen);
  const isOpen = open ?? internal;
  const toggle = () => { const next = !isOpen; setInternal(next); onOpenChange?.(next); };
  return (
    <div style={{ marginTop: 12, borderTop: '1px solid var(--insp-divider, #eef2f6)', paddingTop: 8 }}>
      <button type="button" aria-expanded={isOpen} onClick={toggle}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, width: '100%', padding: '6px 4px', background: 'transparent', border: 'none', color: '#475569', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}>
        <span aria-hidden style={{ display: 'inline-block', transition: 'transform 140ms ease', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', fontSize: 10, color: '#94a3b8' }}>▶</span>
        {label}
      </button>
      <div hidden={!isOpen} style={{ display: isOpen ? 'flex' : 'none', flexDirection: 'column', gap: 6, padding: '4px 0 6px' }}>
        {children}
      </div>
    </div>
  );
}

export function InspectorSection({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section style={{ background: 'var(--insp-surface, #fff)', border: '1px solid var(--insp-card-border, #eef2f6)', borderRadius: 12, padding: 14, marginBottom: 12 }}>
      <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)}
        style={{ display: 'flex', alignItems: 'center', width: '100%', padding: 0, border: 'none', background: 'transparent', color: '#0f172a', fontSize: 12, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer', marginBottom: open ? 10 : 0 }}>
        <span style={{ flex: 1, textAlign: 'left' }}>{title}</span>
        <span aria-hidden style={{ display: 'inline-block', color: '#94a3b8', fontSize: 10, transition: 'transform 140ms ease', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
      </button>
      {open ? <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div> : null}
    </section>
  );
}
```

사용 패턴:
```tsx
<InspectorSection title="Layout">
  <LabeledRow label="Width" hint="px" hasOverride={hasOverride}>
    <NumberStepper value={rect.width} onChange={(v) => commit('width', v)} min={72} suffix="px" />
  </LabeledRow>
  <LabeledRow label="Background" binding={{ tone: 'linked', token: 'brand.primary', onToggleLink }}>
    <SwatchRow cssValue={bg} onClick={openPicker} linkedToken="brand.primary" />
  </LabeledRow>
  <AdvancedDisclosure>
    <LabeledRow label="Opacity" dense><SliderRow value={opacity} min={0} max={100} suffix="%" onChange={...} /></LabeledRow>
  </AdvancedDisclosure>
</InspectorSection>
```

---

## 3. SandboxInspectorPanel 재구성 (3탭 + 빈 상태 + Mixed values)

### 3.1 외곽 구조

```tsx
<aside className={styles.inspectorPlaceholder}>
  <header className={styles.panelSectionHeader}>
    <div>
      <span>Inspector</span>
      <strong>{state === 'empty' ? 'Nothing selected'
        : state === 'multi' ? `${count} items selected`
        : `${selectedNode.kind} · inspector`}</strong>
    </div>
    <button className={styles.panelHeaderButton} onClick={() => setOpen(o => !o)}>
      {open ? 'Hide' : 'Show'}
    </button>
  </header>
  <div className={`${styles.panelBody} ${!open ? styles.panelBodyCollapsed : ''}`}>
    {state === 'empty' ? <InspectorEmptyState />
      : state === 'multi' ? <InspectorMultiState ... />
      : <InspectorTabs ... />}
  </div>
</aside>
```

### 3.2 빈 상태

```tsx
function InspectorEmptyState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '36px 24px', textAlign: 'center' }}>
      <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden>
        <rect x="6" y="6" width="44" height="44" rx="8" fill="none" stroke="#cbd5e1" strokeDasharray="4 4" />
        <circle cx="28" cy="28" r="3" fill="#94a3b8" />
      </svg>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>Select an element to edit</p>
      <p style={{ fontSize: 11, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
        Click any element on the canvas, or use the Layers panel.<br />
        Press <kbd>Esc</kbd> to deselect.
      </p>
    </div>
  );
}
```

### 3.3 다중 선택 + Mixed values

- 공통 속성만 노출: rect.x / rect.y / opacity / background / locked / visible / rotation
- 값이 다르면 `mixed={true}` → `MixedValueIndicator` 출력
- 입력 시 모든 선택 노드에 일괄 `updateNode` 적용

### 3.4 3탭 + 추가 탭

`activeTab: 'layout' | 'style' | 'content' | 'animations' | 'a11y' | 'seo'`. 메인 3탭 + secondary 3탭 두 줄 분리.

각 탭은 InspectorSection 으로 그룹화:
- **Layout**: Position & size / Rotation / Visibility & lock / Sticky pin / Anchor
- **Style**: Fill / Border / Shadow / Opacity / Filters
- **Content**: kind 별 (text → Text/Typography/Link, image → Source/Alt/Crop, button → Label/Variant/Link, composite → 슬롯/Overrides)
- **Animations / A11y / SEO**: 기존 컴포넌트 임포트, InspectorSection 으로 wrap

---

## 4. Linked / Detached 인디케이터 강화

`@/lib/builder/site/theme-bindings` 의 `getThemeBindingBadgeStyle` / `ThemeBindingTone` 사용.

규칙:
1. 색/배경/타이포 row 는 `LabeledRow.binding`에 `{ tone, token, onToggleLink }` 전달
2. SwatchRow 는 prop 직접 chip 그림 (LabeledRow 중복 표시 방지)
3. chip 클릭:
   - linked → "Detach from theme" 액션
   - detached → "Link to token…" (D5 picker 토큰 메뉴)
   - custom → 비활성/안내
4. tooltip:
   - linked: `Bound to {token}. Click to detach.`
   - detached: `Custom value. Click to link to a theme token.`
   - custom: `Variant override. Reset to inherit.`

---

## 5. SelectionToolbar 격상 (다크 / blur / separator / 액션 그룹)

### 5.1 컨테이너

```tsx
<div role="toolbar" aria-label="Quick selection actions"
  style={{
    position: 'absolute', top, left, transform: 'translateX(-50%)',
    height: 36, padding: '4px 6px',
    display: 'inline-flex', alignItems: 'center', gap: 2,
    background: 'rgba(24, 24, 27, 0.92)', color: '#f8fafc',
    border: '1px solid rgba(255, 255, 255, 0.10)', borderRadius: 10,
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255,255,255,0.06)',
    backdropFilter: 'blur(14px) saturate(140%)',
    WebkitBackdropFilter: 'blur(14px) saturate(140%)',
    zIndex: 9999, animation: 'fadeIn 120ms ease', pointerEvents: 'auto',
  }} />
```

### 5.2 액션 버튼

- 32×32, icon 14~16px monochrome white
- hover: `background: rgba(255,255,255,0.08)`
- active: `background: rgba(37,99,235,0.30)` + `color: #bfdbfe`
- disabled: opacity 0.4
- 단축키는 `title`만, 라벨 X (아이콘만)

### 5.3 그룹 separator

3 그룹으로 분할, 4px gap + 1px divider:
1. **편집**: edit-link, edit-text, replace-image
2. **구조**: duplicate, forward, backward, align/match (multi-select)
3. **위험/추가**: delete, more(⋯)

```tsx
<span aria-hidden style={{ width: 1, height: 20, margin: '0 4px', background: 'rgba(255,255,255,0.14)' }} />
```

### 5.4 selection summary chip

좌측 라벨 chip: `background: rgba(37, 99, 235, 0.18); color: #bfdbfe;` + border-right divider

### 5.5 더보기(⋯) → ContextMenu 통합

`onOpenMoreMenu(event)` 호출 → 부모 `setContextMenu({ x, y, … })` 로 30+ 액션 트리

---

## 6. ContextMenu 격상 (macOS-style 30+ 액션)

### 6.1 ContextMenu.tsx props

```tsx
export interface ContextMenuAction {
  key: string;
  label: string;
  title?: string;
  shortcut?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  separator?: boolean;
  tone?: 'default' | 'danger';
  children?: ContextMenuAction[];
  onSelect?: () => void;
}
```

### 6.2 시각 토큰

- 컨테이너: `width: 280px; max-height: min(560px, 80vh); overflow-y: auto; padding: 6px; border-radius: 12px; background: rgba(255,255,255,0.96); backdrop-filter: blur(20px) saturate(160%); border: 1px solid rgba(15,23,42,0.08); box-shadow: 0 24px 60px rgba(15,23,42,0.22);`
- 메뉴 row: `min-height: 28px; padding: 4px 10px; border-radius: 6px; gap: 10px; font-size: 13px; font-weight: 500; color: #1f2937;`
- 호버: `background: var(--insp-accent, #2563eb); color: #fff;`
- disabled: `opacity: 0.4; cursor: default;`
- danger: `color: #dc2626;` 호버 `background: #dc2626; color: #fff;`. 자동 `<hr>` 분리
- 서브메뉴 ▶ + 200ms 지연 후 우측 panel
- 단축키 우측 정렬: `font: 12px / system-ui-mono; color: #94a3b8;`

### 6.3 키보드 네비게이션

- ArrowDown/Up: 다음/이전
- Enter: 실행
- Esc: 닫기
- ArrowRight: 서브메뉴 진입
- ArrowLeft: 서브메뉴 닫기

### 6.4 CanvasContainer 액션 배열 (33 actions + 6 separators)

| # | key | label | shortcut | tone |
|---|---|---|---|---|
| 1 | edit-text | 텍스트 편집 | — | default |
| 2 | replace-image | 이미지 교체 | — | default |
| 3 | edit-alt | Alt 텍스트 편집 | — | default |
| 4 | edit-link | 링크 편집 | ⌘K | default |
| 5 | remove-link | 링크 제거 | — | default |
| sep-clipboard | — | — | — | — |
| 6 | copy | Copy | ⌘C | default |
| 7 | cut | Cut | ⌘X | default |
| 8 | paste | Paste | ⌘V | default |
| 9 | duplicate | Duplicate | ⌘D | default |
| 10 | paste-style | Paste style | ⌥⇧⌘V | default |
| 11 | copy-style | Copy style | ⌥⌘C | default |
| sep-arrange | — | — | — | — |
| 12 | bring-front | Bring to front | ⇧⌘] | default |
| 13 | bring-forward | Bring forward | ⌘] | default |
| 14 | send-backward | Send backward | ⌘[ | default |
| 15 | send-back | Send to back | ⇧⌘[ | default |
| 16 | group | Group selection | ⌘G | default |
| 17 | ungroup | Ungroup | ⇧⌘G | default |
| sep-align | — | — | — | — |
| 18 | align-left | Align left | — | default |
| 19 | align-center | Align center | — | default |
| 20 | align-right | Align right | — | default |
| 21 | align-top | Align top | — | default |
| 22 | align-middle | Align middle | — | default |
| 23 | align-bottom | Align bottom | — | default |
| 24 | distribute-h | Distribute horizontally | — | default |
| 25 | distribute-v | Distribute vertically | — | default |
| 26 | match-width | Match width | — | default |
| 27 | match-height | Match height | — | default |
| sep-state | — | — | — | — |
| 28 | lock | Lock / Unlock | ⌘L | default |
| 29 | hide-on-viewport (children: D/T/M) | Hide on viewport ▶ | — | default |
| 30 | pin-to-screen | Pin to screen | — | default |
| 31 | anchor-link | Anchor link… | — | default |
| 32 | animations | Animations… | — | default |
| 33 | effects | Effects… | — | default |
| sep-section | — | — | — | — |
| 34 | save-as-section | Save as section | — | default |
| 35 | add-to-library | Add to library | — | default |
| 36 | move-to-page | Move to page ▶ | — | default |
| 37 | convert-to-component | Convert to component | — | default |
| 38 | style-override (children) | Style override ▶ | — | default |
| 39 | reset-style | Reset style | — | default |
| sep-danger (자동) | — | — | — | — |
| 40 | delete | Delete | ⌫ | danger |

### children 트리 예시

```tsx
{
  key: 'hide-on-viewport',
  label: 'Hide on viewport',
  children: [
    { key: 'hide-desktop', label: 'Hide on desktop', onSelect: () => toggleHidden('desktop') },
    { key: 'hide-tablet',  label: 'Hide on tablet',  onSelect: () => toggleHidden('tablet')  },
    { key: 'hide-mobile',  label: 'Hide on mobile',  onSelect: () => toggleHidden('mobile')  },
  ],
},
```

### disabled placeholder 패턴

```tsx
{ key: 'pin-to-screen', label: 'Pin to screen', disabled: true, title: 'Coming soon — Codex F-track', onSelect: () => {} }
```

---

## 7. 디자인 토큰 (`inspector-tokens.css`)

```css
:root {
  --insp-surface: #ffffff;
  --insp-surface-muted: #f8fafc;
  --insp-card-border: #eef2f6;
  --insp-divider: #eef2f6;
  --insp-label: #475569;
  --insp-label-strong: #0f172a;
  --insp-label-hint: #94a3b8;
  --insp-input-bg: #ffffff;
  --insp-input-border: #e2e8f0;
  --insp-input-fg: #0f172a;
  --insp-segment-bg: #f1f5f9;
  --insp-segment-active-bg: #ffffff;
  --insp-segment-active-fg: #0f172a;
  --insp-mixed-bg: #f1f5f9;
  --insp-mixed-fg: #64748b;
  --insp-override-dot: #f59e0b;
  --insp-accent: #2563eb;
  --insp-accent-soft: #dbeafe;
  --insp-danger: #dc2626;
  --ctx-bg: rgba(255, 255, 255, 0.96);
  --ctx-border: rgba(15, 23, 42, 0.08);
  --ctx-shadow: 0 24px 60px rgba(15, 23, 42, 0.22);
  --ctx-item-fg: #1f2937;
  --ctx-item-active-bg: var(--insp-accent);
  --ctx-item-active-fg: #ffffff;
  --tb-bg: rgba(24, 24, 27, 0.92);
  --tb-border: rgba(255, 255, 255, 0.10);
  --tb-fg: #f8fafc;
  --tb-divider: rgba(255, 255, 255, 0.14);
  --tb-hover-bg: rgba(255, 255, 255, 0.08);
  --tb-active-bg: rgba(37, 99, 235, 0.30);
  --tb-active-fg: #bfdbfe;
}

@media (prefers-color-scheme: dark) {
  :root {
    --insp-surface: #0f172a;
    --insp-surface-muted: #111827;
    --insp-card-border: #1f2937;
    --insp-divider: #1f2937;
    --insp-label: #cbd5e1;
    --insp-label-strong: #f8fafc;
    --insp-label-hint: #64748b;
    --insp-input-bg: #111827;
    --insp-input-border: #1f2937;
    --insp-input-fg: #f8fafc;
    --insp-segment-bg: #111827;
    --insp-segment-active-bg: #1f2937;
    --insp-segment-active-fg: #f8fafc;
    --insp-mixed-bg: #1f2937;
    --insp-mixed-fg: #94a3b8;
    --ctx-bg: rgba(15, 23, 42, 0.92);
    --ctx-border: rgba(255, 255, 255, 0.08);
    --ctx-shadow: 0 24px 60px rgba(0, 0, 0, 0.50);
    --ctx-item-fg: #e2e8f0;
  }
}
```

SandboxPage.tsx 한 줄 import — `import './inspector-tokens.css'` (D1 owner 협업).

---

## 8. 검증

1. `npm run lint && npm run build` 통과
2. 단일 선택: 3대 메인 탭 표시, 모든 row 가 primitive 사용
3. 다중 선택: Width row 에 `— Mixed` chip, 일괄 적용
4. 빈 상태: illustration + "Select an element to edit"
5. Linked/Detached: token 연결 swatch chip + 점, hex 입력 시 Detached
6. SelectionToolbar: 다크 + blur, 3 그룹 + divider, ⋯ 클릭 시 ContextMenu
7. ContextMenu: 33 actions / 6 separators / 서브메뉴 / 키보드 네비
8. Override dot: tablet override 시 우측 오렌지 점
9. 다크 모드: prefers-color-scheme 자동 전환
10. 스크린샷 7장: empty / single (Layout/Style/Content) / multi-mixed / SelectionToolbar / ContextMenu submenu / dark

---

## 9. 금지 범위

- `SandboxPage.tsx` 본체 수정 금지 (한 줄 import 요청만)
- `CanvasNode.tsx` / `CanvasContainer.tsx` 의 선택/이벤트 흐름 변경 금지 (actions 배열만 확장)
- `ColorPicker.tsx` 내부 수정 금지 (D5)
- 새 store action 추가 금지 (F-track)
- `theme-bindings.ts` 수정 금지
- npm 의존성 추가 금지
- SelectionToolbar / ContextMenu 의 콜백 props 시그니처 변경 금지

---

## 작업 흐름

1. `inspector-tokens.css` 작성 → SandboxPage import 요청
2. `InspectorControls.tsx` 작성 + lint 통과
3. SandboxInspectorPanel layout 탭 컨버트 → screenshot
4. style / content / animations / a11y / seo 순으로
5. SelectionToolbar 격상
6. ContextMenu 격상 (서브메뉴 + 키보드 네비)
7. CanvasContainer actions 배열 확장 (33 + 6 separators)
8. 빌드 / 스크린샷 / PR

> 본 문서가 곧 PR 본문 골격이다. 각 섹션 헤더를 그대로 PR description 에 복붙해도 된다.
