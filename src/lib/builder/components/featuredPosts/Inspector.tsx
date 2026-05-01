import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderFeaturedPostsCanvasNode } from '@/lib/builder/canvas/types';

const sectionLabelStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#64748b',
  marginTop: 12,
  marginBottom: 4,
  display: 'block',
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '4px 6px',
  fontSize: '0.85rem',
  border: '1px solid #e2e8f0',
  borderRadius: 6,
  background: '#fff',
};

export default function FeaturedPostsInspector({ node, onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const fnode = node as BuilderFeaturedPostsCanvasNode;
  const c = fnode.content;

  return (
    <>
      <span style={sectionLabelStyle}>Featured</span>
      <label>
        <span>Limit</span>
        <input
          type="number"
          min={1}
          max={10}
          value={c.limit}
          disabled={disabled}
          onChange={(e) => onUpdate({ limit: Math.max(1, Math.min(10, Number(e.target.value) || 1)) })}
        />
      </label>
      <label>
        <span>Layout</span>
        <select style={selectStyle} value={c.layout} disabled={disabled} onChange={(e) => onUpdate({ layout: e.target.value })}>
          <option value="hero">Hero (1 큰 + 사이드)</option>
          <option value="side-by-side">Side-by-side</option>
          <option value="stacked">Stacked</option>
        </select>
      </label>
    </>
  );
}
