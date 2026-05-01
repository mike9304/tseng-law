import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderCtaBannerCanvasNode } from '@/lib/builder/canvas/types';

const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.78rem', color: '#334155' };
const labelStyle: React.CSSProperties = { fontSize: '0.72rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' };
const inputStyle: React.CSSProperties = { padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.82rem', color: '#0f172a', outline: 'none' };

export default function CtaBannerInspector({ node, onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const ctaNode = node as BuilderCtaBannerCanvasNode;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label style={fieldStyle}>
        <span style={labelStyle}>제목</span>
        <input type="text" value={ctaNode.content.title} disabled={disabled} style={inputStyle}
          onChange={(e) => onUpdate({ title: e.target.value })} />
      </label>
      <label style={fieldStyle}>
        <span style={labelStyle}>설명</span>
        <textarea rows={3} value={ctaNode.content.description} disabled={disabled}
          style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }}
          onChange={(e) => onUpdate({ description: e.target.value })} />
      </label>
      <label style={fieldStyle}>
        <span style={labelStyle}>버튼 텍스트</span>
        <input type="text" value={ctaNode.content.buttonLabel} disabled={disabled} style={inputStyle}
          onChange={(e) => onUpdate({ buttonLabel: e.target.value })} />
      </label>
      <label style={fieldStyle}>
        <span style={labelStyle}>버튼 링크</span>
        <input type="text" value={ctaNode.content.buttonHref} disabled={disabled} style={inputStyle}
          placeholder="/ko/contact" onChange={(e) => onUpdate({ buttonHref: e.target.value })} />
      </label>
      <label style={fieldStyle}>
        <span style={labelStyle}>배경 색</span>
        <input type="text" value={ctaNode.content.backgroundColor} disabled={disabled} style={inputStyle}
          placeholder="#0b3b2e 또는 linear-gradient(...)" onChange={(e) => onUpdate({ backgroundColor: e.target.value })} />
        <div style={{ height: 32, borderRadius: 6, background: ctaNode.content.backgroundColor, border: '1px solid #e2e8f0' }} />
      </label>
    </div>
  );
}
