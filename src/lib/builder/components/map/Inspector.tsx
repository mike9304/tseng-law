import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderMapCanvasNode } from '@/lib/builder/canvas/types';

const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.78rem', color: '#334155' };
const labelStyle: React.CSSProperties = { fontSize: '0.72rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' };
const inputStyle: React.CSSProperties = { padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.82rem', color: '#0f172a', outline: 'none' };
const presetGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 6 };
const presetButtonStyle: React.CSSProperties = { minHeight: 30, border: '1px solid #dbe2ea', borderRadius: 7, background: '#fff', color: '#0f172a', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' };
const zoomRowStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '32px 1fr 32px', gap: 6, alignItems: 'center' };

const OFFICE_PRESETS = [
  { label: '타이중', address: '臺中市北區館前路19號樓之1' },
  { label: '가오슝', address: '高雄市左營區安吉街233號' },
  { label: '타이베이', address: '台北市大同區承德路一段35號7樓之2' },
];

export default function MapInspector({ node, onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const mapNode = node as BuilderMapCanvasNode;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} data-builder-map-inspector="true">
      <div style={fieldStyle}>
        <span style={labelStyle}>사무소 프리셋</span>
        <div style={presetGridStyle}>
          {OFFICE_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              disabled={disabled}
              style={{ ...presetButtonStyle, opacity: disabled ? 0.5 : 1 }}
              aria-label={`${preset.label} office map preset`}
              onClick={() => onUpdate({ address: preset.address })}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
      <label style={fieldStyle}>
        <span style={labelStyle}>주소</span>
        <textarea rows={2} value={mapNode.content.address} disabled={disabled} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
          aria-label="Map address"
          placeholder="台北市大安區..." onChange={(e) => onUpdate({ address: e.target.value })} />
      </label>
      <label style={fieldStyle}>
        <span style={labelStyle}>줌 레벨 ({mapNode.content.zoom})</span>
        <div style={zoomRowStyle}>
          <button
            type="button"
            disabled={disabled || mapNode.content.zoom <= 1}
            style={presetButtonStyle}
            aria-label="Decrease map zoom"
            onClick={() => onUpdate({ zoom: Math.max(1, mapNode.content.zoom - 1) })}
          >
            -
          </button>
          <input type="range" min={1} max={20} step={1} value={mapNode.content.zoom} disabled={disabled}
            aria-label="Map zoom"
            onChange={(e) => onUpdate({ zoom: Number(e.target.value) })} />
          <button
            type="button"
            disabled={disabled || mapNode.content.zoom >= 20}
            style={presetButtonStyle}
            aria-label="Increase map zoom"
            onClick={() => onUpdate({ zoom: Math.min(20, mapNode.content.zoom + 1) })}
          >
            +
          </button>
        </div>
      </label>
    </div>
  );
}
