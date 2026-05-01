import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderCustomEmbedCanvasNode } from '@/lib/builder/canvas/types';

const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.78rem', color: '#334155' };
const labelStyle: React.CSSProperties = { fontSize: '0.72rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' };

export default function CustomEmbedInspector({ node, onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const embedNode = node as BuilderCustomEmbedCanvasNode;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label style={fieldStyle}>
        <span style={labelStyle}>HTML (sandboxed)</span>
        <textarea rows={10} value={embedNode.content.html} disabled={disabled}
          placeholder="<iframe src='...' />" onChange={(e) => onUpdate({ html: e.target.value })}
          style={{ padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.78rem', color: '#0f172a', outline: 'none', fontFamily: 'monospace', resize: 'vertical' }} />
        <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>iframe sandbox로 렌더됩니다. script 실행 가능, 부모 접근 불가.</span>
      </label>
    </div>
  );
}
