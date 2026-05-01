import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderMapCanvasNode } from '@/lib/builder/canvas/types';

const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.78rem', color: '#334155' };
const labelStyle: React.CSSProperties = { fontSize: '0.72rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' };
const inputStyle: React.CSSProperties = { padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.82rem', color: '#0f172a', outline: 'none' };

export default function MapInspector({ node, onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const mapNode = node as BuilderMapCanvasNode;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label style={fieldStyle}>
        <span style={labelStyle}>주소</span>
        <textarea rows={2} value={mapNode.content.address} disabled={disabled} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
          placeholder="台北市大安區..." onChange={(e) => onUpdate({ address: e.target.value })} />
      </label>
      <label style={fieldStyle}>
        <span style={labelStyle}>줌 레벨 ({mapNode.content.zoom})</span>
        <input type="range" min={1} max={20} step={1} value={mapNode.content.zoom} disabled={disabled}
          onChange={(e) => onUpdate({ zoom: Number(e.target.value) })} />
      </label>
    </div>
  );
}
