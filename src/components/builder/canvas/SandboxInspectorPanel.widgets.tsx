import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { resolveViewportHidden } from '@/lib/builder/canvas/responsive';

export type ViewportLite = 'desktop' | 'tablet' | 'mobile';

export const DEVICE_META: Array<{ vp: ViewportLite; icon: string; short: string; label: string }> = [
  { vp: 'desktop', icon: '▭', short: 'D', label: 'Desktop' },
  { vp: 'tablet', icon: '⬜', short: 'T', label: 'Tablet' },
  { vp: 'mobile', icon: '▯', short: 'M', label: 'Mobile' },
];

export function ShowOnDeviceToggles({
  node,
  updateNode,
  updateResponsiveOverride,
  activeViewport,
}: {
  node: BuilderCanvasNode;
  updateNode: (id: string, updater: (node: BuilderCanvasNode) => BuilderCanvasNode) => void;
  updateResponsiveOverride: (
    id: string,
    viewport: 'tablet' | 'mobile',
    patch: { hidden?: boolean | undefined },
  ) => void;
  activeViewport: ViewportLite;
}) {
  const disabled = node.locked;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginTop: 12,
        padding: '8px 10px',
        borderRadius: 10,
        background: 'linear-gradient(180deg, #f8fafc, #f1f5f9)',
        border: '1px solid #e2e8f0',
      }}
    >
      <span
        style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          color: '#475569',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        표시 기기
      </span>
      <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
        {DEVICE_META.map(({ vp, icon, short, label }) => {
          const visible = vp === 'desktop'
            ? Boolean(node.visible)
            : !resolveViewportHidden(node, vp);
          const isActiveVp = activeViewport === vp;
          return (
            <button
              key={vp}
              type="button"
              aria-pressed={visible}
              aria-label={`${label}에서 ${visible ? '보임' : '숨김'} (클릭하여 토글)`}
              title={`${label} · ${visible ? '보임' : '숨김'}\n클릭하여 토글${isActiveVp ? ' (현재 편집 중)' : ''}`}
              disabled={disabled}
              onClick={() => {
                if (vp === 'desktop') {
                  updateNode(node.id, (n) => ({ ...n, visible: !visible }));
                  return;
                }
                updateResponsiveOverride(node.id, vp, {
                  hidden: visible ? true : undefined,
                });
              }}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '5px 9px',
                borderRadius: 8,
                border: visible
                  ? `1px solid ${isActiveVp ? '#1d4ed8' : '#cbd5e1'}`
                  : '1px solid #e2e8f0',
                background: visible
                  ? (isActiveVp ? 'linear-gradient(180deg, #dbeafe, #bfdbfe)' : '#fff')
                  : '#f1f5f9',
                color: visible ? (isActiveVp ? '#1e3a8a' : '#0f172a') : '#94a3b8',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.55 : 1,
                fontSize: '0.74rem',
                fontWeight: 600,
                lineHeight: 1,
                transition: 'all 120ms ease',
                boxShadow: visible && isActiveVp ? '0 1px 0 rgba(29,78,216,0.18)' : 'none',
              }}
            >
              <span aria-hidden style={{ fontSize: '0.85rem' }}>{icon}</span>
              <span>{short}</span>
              {!visible ? (
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      width: '85%',
                      height: 1,
                      background: '#94a3b8',
                      transform: 'rotate(-12deg)',
                      transformOrigin: 'center',
                    }}
                  />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function InspectorEmptyState() {
  return (
    <div
      data-builder-inspector-empty="true"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '36px 24px',
        textAlign: 'center',
      }}
    >
      <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden>
        <rect x="6" y="6" width="44" height="44" rx="8" fill="none" stroke="#cbd5e1" strokeDasharray="4 4" />
        <circle cx="28" cy="28" r="3" fill="#94a3b8" />
      </svg>
      <p style={{ margin: 0, color: '#0f172a', fontSize: 13, fontWeight: 700 }}>편집할 요소를 선택하세요</p>
      <p style={{ margin: 0, color: '#475569', fontSize: 11, lineHeight: 1.5 }}>
        캔버스에서 요소를 클릭하거나 레이어 패널을 사용하세요.<br />
        선택 해제: <kbd style={{ color: '#0f172a', fontWeight: 800 }}>Esc</kbd>
      </p>
    </div>
  );
}

export function renderCompositeSurfaceEditor({
  node,
  surfaceKey,
  onUpdate,
  onClose,
}: {
  node: BuilderCanvasNode;
  surfaceKey: string;
  onUpdate: (overrides: Record<string, string>) => void;
  onClose: () => void;
}): JSX.Element {
  const config = (node.content as { config?: Record<string, unknown> }).config ?? {};
  const overrides = (config.overrides as Record<string, string> | undefined) ?? {};
  const current = overrides[surfaceKey] ?? '';
  return (
    <section
      style={{
        padding: 12,
        borderRadius: 10,
        border: '1px solid #bfdbfe',
        background: '#eff6ff',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        marginBottom: 12,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ fontSize: '0.78rem', color: '#1e40af' }}>
          슬롯 편집 · {surfaceKey}
        </strong>
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: '2px 8px',
            fontSize: '0.72rem',
            border: '1px solid #bfdbfe',
            background: 'white',
            borderRadius: 6,
            cursor: 'pointer',
            color: '#1e40af',
          }}
        >
          닫기
        </button>
      </div>
      <textarea
        value={current}
        placeholder="비워두면 원본 기본값을 사용합니다"
        onChange={(e) => {
          const value = e.target.value;
          const next = { ...overrides };
          if (value === '') {
            delete next[surfaceKey];
          } else {
            next[surfaceKey] = value;
          }
          onUpdate(next);
        }}
        style={{
          padding: '6px 10px',
          border: '1px solid #93c5fd',
          borderRadius: 8,
          fontSize: '0.82rem',
          color: '#0f172a',
          outline: 'none',
          minHeight: 64,
          resize: 'vertical',
          fontFamily: 'inherit',
        }}
      />
    </section>
  );
}
