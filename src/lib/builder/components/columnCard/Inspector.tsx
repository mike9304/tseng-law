import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderColumnCardCanvasNode } from '@/lib/builder/canvas/types';
import {
  CARD_VARIANTS,
  legacyCardStyleToVariant,
  normalizeCardVariantKey,
} from '@/lib/builder/site/component-variants';

const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.78rem', color: '#334155' };
const labelStyle: React.CSSProperties = { fontSize: '0.72rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' };
const inputStyle: React.CSSProperties = { padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.82rem', color: '#0f172a', outline: 'none' };

export default function ColumnCardInspector({ node, onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const cardNode = node as BuilderColumnCardCanvasNode;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label style={fieldStyle}>
        <span style={labelStyle}>Slug</span>
        <input type="text" value={cardNode.content.slug} disabled={disabled} style={inputStyle}
          placeholder="001-taiwan-company-establishment" onChange={(e) => onUpdate({ slug: e.target.value })} />
      </label>
      <label style={fieldStyle}>
        <span style={labelStyle}>Locale</span>
        <select value={cardNode.content.locale} disabled={disabled} style={inputStyle} onChange={(e) => onUpdate({ locale: e.target.value })}>
          <option value="ko">한국어</option>
          <option value="zh-hant">繁體中文</option>
          <option value="en">English</option>
        </select>
      </label>
      <label style={fieldStyle}>
        <span style={labelStyle}>Card variant</span>
        <select
          value={normalizeCardVariantKey(cardNode.content.variant ?? legacyCardStyleToVariant(cardNode.content.cardStyle))}
          disabled={disabled}
          style={inputStyle}
          onChange={(e) => onUpdate({ variant: e.target.value })}
        >
          {CARD_VARIANTS.map((variant) => (
            <option key={variant.key} value={variant.key}>
              {variant.label}
            </option>
          ))}
        </select>
      </label>
      <label style={fieldStyle}>
        <span style={labelStyle}>제목 (override)</span>
        <input type="text" value={cardNode.content.title ?? ''} disabled={disabled} style={inputStyle}
          onChange={(e) => onUpdate({ title: e.target.value })} />
      </label>
      <label style={fieldStyle}>
        <span style={labelStyle}>날짜</span>
        <input type="text" value={cardNode.content.date ?? ''} disabled={disabled} style={inputStyle}
          placeholder="2026-04-30" onChange={(e) => onUpdate({ date: e.target.value })} />
      </label>
      <label style={fieldStyle}>
        <span style={labelStyle}>요약</span>
        <textarea rows={3} value={cardNode.content.summary ?? ''} disabled={disabled}
          style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }}
          onChange={(e) => onUpdate({ summary: e.target.value })} />
      </label>
    </div>
  );
}
