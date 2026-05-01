import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderFaqListCanvasNode } from '@/lib/builder/canvas/types';

const labelStyle: React.CSSProperties = { fontSize: '0.72rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' };
const inputStyle: React.CSSProperties = { padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.82rem', color: '#0f172a', outline: 'none' };

export default function FaqListInspector({ node, onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const faqNode = node as BuilderFaqListCanvasNode;
  const items = faqNode.content.items ?? [];

  const updateItem = (index: number, patch: { question?: string; answer?: string }) => {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    onUpdate({ items: next });
  };
  const addItem = () => onUpdate({ items: [...items, { question: '', answer: '' }] });
  const removeItem = (index: number) => onUpdate({ items: items.filter((_, i) => i !== index) });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <span style={labelStyle}>항목 ({items.length})</span>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 10, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <input type="text" placeholder="질문" value={item.question} disabled={disabled} style={inputStyle}
            onChange={(e) => updateItem(i, { question: e.target.value })} />
          <textarea rows={3} placeholder="답변" value={item.answer} disabled={disabled}
            style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }}
            onChange={(e) => updateItem(i, { answer: e.target.value })} />
          <button type="button" disabled={disabled} onClick={() => removeItem(i)}
            style={{ alignSelf: 'flex-end', padding: '4px 10px', fontSize: '0.72rem', background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            제거
          </button>
        </div>
      ))}
      <button type="button" disabled={disabled} onClick={addItem}
        style={{ padding: '6px 12px', fontSize: '0.78rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
        + Q&A 추가
      </button>
    </div>
  );
}
