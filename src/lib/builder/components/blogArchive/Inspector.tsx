import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderBlogArchiveCanvasNode } from '@/lib/builder/canvas/types';

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

export default function BlogArchiveInspector({ node, onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const fnode = node as BuilderBlogArchiveCanvasNode;
  const c = fnode.content;

  return (
    <>
      <span style={sectionLabelStyle}>Group</span>
      <label>
        <span>Group by</span>
        <select style={selectStyle} value={c.groupBy} disabled={disabled} onChange={(e) => onUpdate({ groupBy: e.target.value })}>
          <option value="month">Year › Month</option>
          <option value="year">Year only</option>
        </select>
      </label>
      <label>
        <input type="checkbox" checked={c.expandLatest} disabled={disabled} onChange={(e) => onUpdate({ expandLatest: e.target.checked })} />
        <span>최신 연도 자동 펼침</span>
      </label>
      <label>
        <input type="checkbox" checked={c.showCount} disabled={disabled} onChange={(e) => onUpdate({ showCount: e.target.checked })} />
        <span>글 수 보이기</span>
      </label>
    </>
  );
}
