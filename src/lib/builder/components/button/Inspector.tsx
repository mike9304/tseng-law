import type { BuilderComponentInspectorProps } from '../define';
import LinkPicker from '@/components/builder/editor/LinkPicker';
import type { BuilderButtonCanvasNode } from '@/lib/builder/canvas/types';
import { linkValueFromLegacy, type LinkValue } from '@/lib/builder/links';
import {
  BUTTON_VARIANTS,
  normalizeButtonVariantKey,
} from '@/lib/builder/site/component-variants';

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
  linkPickerContext,
}: BuilderComponentInspectorProps) {
  const buttonNode = node as BuilderButtonCanvasNode;
  const content = buttonNode.content;
  const linkValue = linkValueFromLegacy(content);
  const resolvedTag = content.as ?? (linkValue?.href ? 'a' : 'button');

  function handleLinkChange(link: LinkValue | null) {
    onUpdate({
      link: link ?? undefined,
      href: link?.href ?? '',
      target: link?.target === '_blank' ? '_blank' : undefined,
      rel: link?.rel,
      title: link?.title,
      ariaLabel: link?.ariaLabel,
    });
  }

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

      <div style={fieldStyle}>
        <span style={labelTextStyle}>Link</span>
        <LinkPicker
          value={linkValue}
          onChange={handleLinkChange}
          context={linkPickerContext}
          disabled={disabled}
        />
        <span style={hintStyle}>
          내부 경로, 앵커, lightbox, http(s), mailto, tel 링크만 저장됩니다.
        </span>
      </div>

      <label style={fieldStyle}>
        <span style={labelTextStyle}>Variant (스타일)</span>
        <select
          value={normalizeButtonVariantKey(content.style)}
          disabled={disabled}
          style={inputStyle}
          onChange={(event) => onUpdate({ style: event.target.value })}
        >
          {BUTTON_VARIANTS.map((variant) => (
            <option key={variant.key} value={variant.key}>
              {variant.label}
            </option>
          ))}
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
