import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderColumnListCanvasNode } from '@/lib/builder/canvas/types';

const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.78rem', color: '#334155' };
const labelStyle: React.CSSProperties = { fontSize: '0.72rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' };
const inputStyle: React.CSSProperties = { padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.82rem', color: '#0f172a', outline: 'none' };

export default function ColumnListInspector({ node, onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const listNode = node as BuilderColumnListCanvasNode;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label style={fieldStyle}>
        <span style={labelStyle}>Locale</span>
        <select value={listNode.content.locale} disabled={disabled} style={inputStyle} onChange={(e) => onUpdate({ locale: e.target.value })}>
          <option value="ko">한국어</option>
          <option value="zh-hant">繁體中文</option>
          <option value="en">English</option>
        </select>
      </label>
      <label style={fieldStyle}>
        <span style={labelStyle}>Limit ({listNode.content.limit})</span>
        <input type="range" min={1} max={50} step={1} value={listNode.content.limit} disabled={disabled}
          onChange={(e) => onUpdate({ limit: Number(e.target.value) })} />
      </label>
      <label style={fieldStyle}>
        <span style={labelStyle}>Category 필터 (선택)</span>
        <input type="text" value={listNode.content.category ?? ''} disabled={disabled} style={inputStyle}
          placeholder="formation / labor / family ..." onChange={(e) => onUpdate({ category: e.target.value })} />
      </label>
      <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
        items 배열은 자동 채워집니다 (locale + category로 필터링).
      </span>
    </div>
  );
}
