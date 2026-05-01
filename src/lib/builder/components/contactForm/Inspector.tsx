import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderContactFormCanvasNode } from '@/lib/builder/canvas/types';

const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.78rem', color: '#334155' };
const labelStyle: React.CSSProperties = { fontSize: '0.72rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' };
const inputStyle: React.CSSProperties = { padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.82rem', color: '#0f172a', outline: 'none' };

const AVAILABLE_FIELDS = ['name', 'email', 'phone', 'message', 'company', 'subject', 'address', 'preference'] as const;
const FIELD_LABELS: Record<string, string> = { name: '이름', email: '이메일', phone: '전화', message: '메시지', company: '회사', subject: '제목', address: '주소', preference: '선호' };

export default function ContactFormInspector({ node, onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const formNode = node as BuilderContactFormCanvasNode;
  const fields = formNode.content.fields ?? [];

  const toggleField = (key: string) => {
    const next = fields.includes(key) ? fields.filter((f) => f !== key) : [...fields, key];
    if (next.length === 0) return;
    onUpdate({ fields: next });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={fieldStyle}>
        <span style={labelStyle}>필드 ({fields.length})</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {AVAILABLE_FIELDS.map((key) => (
            <button key={key} type="button" disabled={disabled} onClick={() => toggleField(key)}
              style={{
                padding: '4px 10px', fontSize: '0.72rem',
                background: fields.includes(key) ? '#0f172a' : '#f1f5f9',
                color: fields.includes(key) ? '#fff' : '#334155',
                border: '1px solid ' + (fields.includes(key) ? '#0f172a' : '#e2e8f0'),
                borderRadius: 999, cursor: 'pointer',
              }}>
              {FIELD_LABELS[key] ?? key}
            </button>
          ))}
        </div>
      </div>
      <label style={fieldStyle}>
        <span style={labelStyle}>제출 버튼 라벨</span>
        <input type="text" value={formNode.content.submitLabel} disabled={disabled} style={inputStyle}
          onChange={(e) => onUpdate({ submitLabel: e.target.value })} />
      </label>
      <label style={fieldStyle}>
        <span style={labelStyle}>Action URL</span>
        <input type="text" value={formNode.content.action} disabled={disabled} style={inputStyle}
          placeholder="/api/consultation/submit" onChange={(e) => onUpdate({ action: e.target.value })} />
      </label>
    </div>
  );
}
