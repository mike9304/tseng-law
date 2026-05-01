import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderBlogCategoriesCanvasNode } from '@/lib/builder/canvas/types';

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

export default function BlogCategoriesInspector({ node, onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const fnode = node as BuilderBlogCategoriesCanvasNode;
  const c = fnode.content;

  const activeColorString =
    typeof c.activeColor === 'string' ? c.activeColor : '#0b3b2e';

  return (
    <>
      <span style={sectionLabelStyle}>Layout</span>
      <label>
        <span>Layout</span>
        <select style={selectStyle} value={c.layout} disabled={disabled} onChange={(e) => onUpdate({ layout: e.target.value })}>
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
          <option value="grid">Grid</option>
        </select>
      </label>

      <span style={sectionLabelStyle}>Display</span>
      <label>
        <input type="checkbox" checked={c.showAll} disabled={disabled} onChange={(e) => onUpdate({ showAll: e.target.checked })} />
        <span>{'"전체"'} 카테고리 보이기</span>
      </label>
      <label>
        <input type="checkbox" checked={c.showPostCount} disabled={disabled} onChange={(e) => onUpdate({ showPostCount: e.target.checked })} />
        <span>글 수 보이기</span>
      </label>

      <span style={sectionLabelStyle}>Active color</span>
      <label>
        <span>Color (hex)</span>
        <input
          type="text"
          value={activeColorString}
          disabled={disabled}
          onChange={(e) => onUpdate({ activeColor: e.target.value || undefined })}
          placeholder="#0b3b2e"
        />
      </label>
    </>
  );
}
