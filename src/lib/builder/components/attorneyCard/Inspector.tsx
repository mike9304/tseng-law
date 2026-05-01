import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderAttorneyCardCanvasNode } from '@/lib/builder/canvas/types';
import {
  CARD_VARIANTS,
  legacyCardStyleToVariant,
  normalizeCardVariantKey,
} from '@/lib/builder/site/component-variants';

const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.78rem', color: '#334155' };
const labelStyle: React.CSSProperties = { fontSize: '0.72rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' };
const inputStyle: React.CSSProperties = { padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.82rem', color: '#0f172a', outline: 'none' };

export default function AttorneyCardInspector({ node, onUpdate, disabled = false, onRequestAssetLibrary }: BuilderComponentInspectorProps) {
  const cardNode = node as BuilderAttorneyCardCanvasNode;
  const specialties = cardNode.content.specialties ?? [];
  const specialtiesText = specialties.join(', ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label style={fieldStyle}>
        <span style={labelStyle}>이름</span>
        <input type="text" value={cardNode.content.name} disabled={disabled} style={inputStyle}
          onChange={(e) => onUpdate({ name: e.target.value })} />
      </label>
      <label style={fieldStyle}>
        <span style={labelStyle}>직책</span>
        <input type="text" value={cardNode.content.title} disabled={disabled} style={inputStyle}
          placeholder="대표 변호사 / Managing Attorney" onChange={(e) => onUpdate({ title: e.target.value })} />
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
        <span style={labelStyle}>사진 URL</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <input type="text" value={cardNode.content.photo} disabled={disabled} style={{ ...inputStyle, flex: 1 }}
            onChange={(e) => onUpdate({ photo: e.target.value })} />
          {onRequestAssetLibrary && (
            <button type="button" disabled={disabled} onClick={onRequestAssetLibrary}
              style={{ padding: '6px 10px', fontSize: '0.72rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
              📁
            </button>
          )}
        </div>
      </label>
      <label style={fieldStyle}>
        <span style={labelStyle}>전문 분야 (쉼표 구분)</span>
        <input type="text" value={specialtiesText} disabled={disabled} style={inputStyle}
          placeholder="회사법, 노동법, 형사" onChange={(e) => {
            const next = e.target.value.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 20);
            onUpdate({ specialties: next });
          }} />
      </label>
    </div>
  );
}
