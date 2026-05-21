import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderFaqListCanvasNode } from '@/lib/builder/canvas/types';
import { DEFAULT_FAQ_CATEGORIES } from '@/lib/builder/faq/faq-shared';

const labelStyle: React.CSSProperties = { fontSize: '0.72rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' };
const inputStyle: React.CSSProperties = { padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.82rem', color: '#0f172a', outline: 'none' };
const rowStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 };
const checkStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr)', gap: 8, alignItems: 'center', fontSize: '0.82rem', color: '#334155' };

export default function FaqListInspector({ node, onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const faqNode = node as BuilderFaqListCanvasNode;
  const items = faqNode.content.items ?? [];
  const source = faqNode.content.source ?? 'static';

  const updateItem = (index: number, patch: { question?: string; answer?: string }) => {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    onUpdate({ items: next });
  };
  const addItem = () => onUpdate({ items: [...items, { question: '', answer: '' }] });
  const removeItem = (index: number) => onUpdate({ items: items.filter((_, i) => i !== index) });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label style={{ display: 'grid', gap: 6 }}>
        <span style={labelStyle}>소스</span>
        <select
          value={source}
          disabled={disabled}
          style={inputStyle}
          onChange={(e) => onUpdate({ source: e.currentTarget.value })}
        >
          <option value="static">직접 입력</option>
          <option value="app">FAQ 앱 데이터</option>
        </select>
      </label>
      <div style={rowStyle}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={labelStyle}>카테고리</span>
          <select
            value={faqNode.content.categoryId ?? 'all'}
            disabled={disabled}
            style={inputStyle}
            onChange={(e) => onUpdate({ categoryId: e.currentTarget.value })}
          >
            <option value="all">전체</option>
            {DEFAULT_FAQ_CATEGORIES.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>{category.label.ko}</option>
            ))}
          </select>
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={labelStyle}>표시 수</span>
          <input
            type="number"
            min={1}
            max={100}
            value={faqNode.content.limit ?? 50}
            disabled={disabled}
            style={inputStyle}
            onChange={(e) => onUpdate({ limit: Number(e.currentTarget.value) })}
          />
        </label>
      </div>
      <label style={checkStyle}>
        <input
          type="checkbox"
          checked={faqNode.content.showSearch ?? false}
          disabled={disabled}
          onChange={(e) => onUpdate({ showSearch: e.currentTarget.checked })}
        />
        검색창 표시
      </label>
      <label style={checkStyle}>
        <input
          type="checkbox"
          checked={faqNode.content.showCategoryFilter ?? true}
          disabled={disabled}
          onChange={(e) => onUpdate({ showCategoryFilter: e.currentTarget.checked })}
        />
        카테고리 필터 표시
      </label>
      <label style={checkStyle}>
        <input
          type="checkbox"
          checked={faqNode.content.expandFirst ?? true}
          disabled={disabled}
          onChange={(e) => onUpdate({ expandFirst: e.currentTarget.checked })}
        />
        첫 질문 열기
      </label>
      <label style={checkStyle}>
        <input
          type="checkbox"
          checked={faqNode.content.schemaEnabled ?? true}
          disabled={disabled}
          onChange={(e) => onUpdate({ schemaEnabled: e.currentTarget.checked })}
        />
        FAQPage schema 출력
      </label>
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
