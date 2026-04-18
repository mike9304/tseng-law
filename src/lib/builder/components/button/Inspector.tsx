import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderButtonCanvasNode } from '@/lib/builder/canvas/types';

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  fontSize: '0.78rem',
  color: '#334155',
};

const inputStyle: React.CSSProperties = {
  padding: '6px 10px',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  fontSize: '0.82rem',
  color: '#0f172a',
  outline: 'none',
};

const labelTextStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: 600,
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const hintStyle: React.CSSProperties = {
  fontSize: '0.68rem',
  color: '#94a3b8',
  marginTop: 2,
};

export default function ButtonInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const buttonNode = node as BuilderButtonCanvasNode;
  const content = buttonNode.content;
  const resolvedTag = content.as ?? (content.href ? 'a' : 'button');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label style={fieldStyle}>
        <span style={labelTextStyle}>Label (표시 텍스트)</span>
        <input
          type="text"
          value={content.label}
          disabled={disabled}
          style={inputStyle}
          onChange={(event) => onUpdate({ label: event.target.value })}
        />
      </label>

      <label style={fieldStyle}>
        <span style={labelTextStyle}>Href (연결 URL / 페이지 경로)</span>
        <input
          type="text"
          value={content.href}
          disabled={disabled}
          placeholder="/ko/columns 또는 https://..."
          style={inputStyle}
          onChange={(event) => onUpdate({ href: event.target.value })}
          data-builder-href-input="true"
        />
        <span style={hintStyle}>
          내부 경로는 `/ko/...` 형식, 외부는 전체 URL. 비워두면 링크 없음.
        </span>
      </label>

      <label style={fieldStyle}>
        <span style={labelTextStyle}>Target (새 창 여부)</span>
        <select
          value={content.target ?? '_self'}
          disabled={disabled}
          style={inputStyle}
          onChange={(event) => {
            const next = event.target.value as '_self' | '_blank' | '_parent' | '_top';
            const patch: Record<string, unknown> = { target: next === '_self' ? undefined : next };
            if (next === '_blank') {
              patch.rel = 'noopener noreferrer';
            } else if (content.rel === 'noopener noreferrer') {
              patch.rel = undefined;
            }
            onUpdate(patch);
          }}
        >
          <option value="_self">같은 창</option>
          <option value="_blank">새 창 (_blank)</option>
          <option value="_parent">부모 프레임</option>
          <option value="_top">최상위 프레임</option>
        </select>
      </label>

      <label style={fieldStyle}>
        <span style={labelTextStyle}>Variant (스타일)</span>
        <select
          value={content.style}
          disabled={disabled}
          style={inputStyle}
          onChange={(event) => onUpdate({ style: event.target.value })}
        >
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="outline">Outline</option>
          <option value="ghost">Ghost</option>
          <option value="link">Link</option>
        </select>
      </label>

      <label style={fieldStyle}>
        <span style={labelTextStyle}>As (HTML 태그)</span>
        <select
          value={content.as ?? ''}
          disabled={disabled}
          style={inputStyle}
          onChange={(event) => {
            const v = event.target.value;
            onUpdate({ as: v === '' ? undefined : v });
          }}
        >
          <option value="">자동 ({resolvedTag})</option>
          <option value="a">a (링크)</option>
          <option value="button">button (폼 버튼)</option>
        </select>
      </label>

      {content.className ? (
        <div style={fieldStyle}>
          <span style={labelTextStyle}>Class (CSS, 읽기 전용)</span>
          <code
            style={{
              padding: '6px 10px',
              background: '#f1f5f9',
              borderRadius: 8,
              fontSize: '0.72rem',
              color: '#64748b',
              wordBreak: 'break-all',
            }}
          >
            {content.className}
          </code>
          <span style={hintStyle}>원본 사이트 CSS 연결. 임의 변경 금지 (시각 회귀 위험).</span>
        </div>
      ) : null}
    </div>
  );
}
