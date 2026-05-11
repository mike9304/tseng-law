'use client';

import { useMemo, useState } from 'react';
import type {
  ConditionalOperator,
  FormField,
  FormFieldType,
  FormSchema,
  FormStep,
} from '@/lib/builder/forms/form-engine';

interface Props {
  initialSchema: FormSchema;
}

const FIELD_TYPES: FormFieldType[] = [
  'text', 'email', 'phone', 'textarea', 'select', 'checkbox', 'radio', 'file', 'date', 'number',
];

const OPERATORS: Array<{ value: ConditionalOperator; label: string }> = [
  { value: 'equals', label: '같음' },
  { value: 'not-equals', label: '같지 않음' },
  { value: 'contains', label: '포함' },
  { value: 'empty', label: '비어있음' },
  { value: 'not-empty', label: '비어있지 않음' },
];

function makeFieldId(): string {
  return `field_${Math.random().toString(36).slice(2, 9)}`;
}

function makeStepId(): string {
  return `step_${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * PR #7 — Form schema editor (drag-drop reorder, multi-step, conditional logic builder, preview).
 *
 * Uses native HTML5 drag handles. Each field can be assigned to a step, given
 * a conditional visibility rule, and previewed on the right pane.
 */
export default function FormSchemaEditor({ initialSchema }: Props) {
  const [schema, setSchema] = useState<FormSchema>(initialSchema);
  const [activeStep, setActiveStep] = useState(0);
  const [previewValues, setPreviewValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const steps: FormStep[] = schema.steps ?? [{ id: 'default', label: '기본' }];

  const fieldsForActiveStep = useMemo(
    () => schema.fields.filter((f) => (f.step ?? 0) === activeStep),
    [schema.fields, activeStep],
  );

  function updateField(id: string, patch: Partial<FormField>) {
    setSchema((s) => ({
      ...s,
      fields: s.fields.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    }));
  }

  function addField() {
    const newField: FormField = {
      id: makeFieldId(),
      type: 'text',
      label: '새 필드',
      required: false,
      step: activeStep,
    };
    setSchema((s) => ({ ...s, fields: [...s.fields, newField] }));
  }

  function removeField(id: string) {
    setSchema((s) => ({ ...s, fields: s.fields.filter((f) => f.id !== id) }));
  }

  function moveField(fromIdx: number, toIdx: number) {
    setSchema((s) => {
      const next = [...s.fields];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return { ...s, fields: next };
    });
  }

  function addStep() {
    const next: FormStep = { id: makeStepId(), label: `Step ${steps.length + 1}` };
    setSchema((s) => ({ ...s, steps: [...steps, next] }));
    setActiveStep(steps.length);
  }

  function isFieldVisible(field: FormField): boolean {
    if (!field.conditionalOn) return true;
    const actual = previewValues[field.conditionalOn.fieldId] ?? '';
    const expected = field.conditionalOn.value ?? '';
    const op = field.conditionalOn.operator ?? 'equals';
    switch (op) {
      case 'equals': return actual === expected;
      case 'not-equals': return actual !== expected;
      case 'contains': return actual.includes(expected);
      case 'empty': return actual.trim().length === 0;
      case 'not-empty': return actual.trim().length > 0;
    }
  }

  async function save() {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`/api/builder/forms/schemas/${schema.formId}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: schema.name,
          fields: schema.fields,
          steps: schema.steps,
          submitLabel: schema.submitLabel,
          successMessage: schema.successMessage,
          errorMessage: schema.errorMessage,
          notifyEmail: schema.notifyEmail,
          redirectUrl: schema.redirectUrl,
          storeInCms: schema.storeInCms,
        }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        setMessage(`저장 실패: ${payload.error ?? res.statusText}`);
      } else {
        setMessage('저장 완료');
      }
    } finally {
      setSaving(false);
    }
  }

  const allFieldIdx = (id: string) => schema.fields.findIndex((f) => f.id === id);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, padding: 24 }}>
      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="text"
            value={schema.name}
            onChange={(e) => setSchema((s) => ({ ...s, name: e.target.value }))}
            style={{ fontSize: 16, fontWeight: 700, padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, flex: 1 }}
          />
          <button type="button" disabled={saving} onClick={save} style={{ padding: '8px 14px', border: 0, background: saving ? '#94a3b8' : '#0f172a', color: '#fff', borderRadius: 8, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
        {message ? <div style={{ fontSize: 12, color: message.includes('실패') ? '#dc2626' : '#16a34a' }}>{message}</div> : null}

        <div style={{ display: 'flex', gap: 6, alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 6 }}>
          {steps.map((step, idx) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveStep(idx)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: activeStep === idx ? '2px solid #0f172a' : '1px solid #cbd5e1',
                background: activeStep === idx ? '#0f172a' : '#fff',
                color: activeStep === idx ? '#fff' : '#475569',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {step.label}
            </button>
          ))}
          <button type="button" onClick={addStep} style={{ marginLeft: 8, padding: '6px 12px', border: '1px dashed #94a3b8', background: 'transparent', borderRadius: 6, fontSize: 12, color: '#475569', cursor: 'pointer' }}>
            + 새 step
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {fieldsForActiveStep.length === 0 ? (
            <div style={{ padding: 16, textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>
              필드가 없습니다.
            </div>
          ) : (
            fieldsForActiveStep.map((field) => {
              const globalIdx = allFieldIdx(field.id);
              return (
                <div
                  key={field.id}
                  draggable
                  onDragStart={() => setDragIdx(globalIdx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragIdx == null || dragIdx === globalIdx) return;
                    moveField(dragIdx, globalIdx);
                    setDragIdx(null);
                  }}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    background: '#fff',
                  }}
                >
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ cursor: 'grab', color: '#94a3b8', fontSize: 14 }} title="드래그하여 정렬">⋮⋮</span>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      style={{ flex: 1, padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 13 }}
                    />
                    <select
                      value={field.type}
                      onChange={(e) => updateField(field.id, { type: e.target.value as FormFieldType })}
                      style={{ padding: '4px 6px', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 12 }}
                    >
                      {FIELD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <label style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <input type="checkbox" checked={field.required} onChange={(e) => updateField(field.id, { required: e.target.checked })} />
                      필수
                    </label>
                    <select
                      value={field.step ?? 0}
                      onChange={(e) => updateField(field.id, { step: Number(e.target.value) })}
                      title="step 할당"
                      style={{ padding: '4px 6px', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 11 }}
                    >
                      {steps.map((s, i) => <option key={s.id} value={i}>{s.label}</option>)}
                    </select>
                    <button type="button" onClick={() => removeField(field.id)} style={{ background: 'transparent', border: 0, color: '#dc2626', cursor: 'pointer', fontSize: 16 }}>×</button>
                  </div>

                  {field.type === 'select' || field.type === 'radio' || field.type === 'checkbox' ? (
                    <input
                      type="text"
                      placeholder="옵션 (쉼표 구분)"
                      value={(field.options ?? []).join(', ')}
                      onChange={(e) => updateField(field.id, { options: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                      style={{ padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 12 }}
                    />
                  ) : null}

                  <details style={{ fontSize: 11 }}>
                    <summary style={{ cursor: 'pointer', color: '#475569' }}>
                      조건부 로직 {field.conditionalOn ? '·  설정됨' : ''}
                    </summary>
                    <div style={{ display: 'flex', gap: 6, padding: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <label style={{ fontSize: 11 }}>이 필드 보임 :</label>
                      <select
                        value={field.conditionalOn?.fieldId ?? ''}
                        onChange={(e) => updateField(field.id, {
                          conditionalOn: e.target.value
                            ? { fieldId: e.target.value, operator: field.conditionalOn?.operator ?? 'equals', value: field.conditionalOn?.value ?? '' }
                            : undefined,
                        })}
                        style={{ padding: '4px 6px', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 11 }}
                      >
                        <option value="">— 없음 —</option>
                        {schema.fields.filter((f) => f.id !== field.id).map((f) => (
                          <option key={f.id} value={f.id}>{f.label}</option>
                        ))}
                      </select>
                      {field.conditionalOn ? (
                        <>
                          <select
                            value={field.conditionalOn.operator ?? 'equals'}
                            onChange={(e) => updateField(field.id, {
                              conditionalOn: { ...field.conditionalOn!, operator: e.target.value as ConditionalOperator },
                            })}
                            style={{ padding: '4px 6px', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 11 }}
                          >
                            {OPERATORS.map((op) => <option key={op.value} value={op.value}>{op.label}</option>)}
                          </select>
                          {field.conditionalOn.operator !== 'empty' && field.conditionalOn.operator !== 'not-empty' ? (
                            <input
                              type="text"
                              placeholder="값"
                              value={field.conditionalOn.value ?? ''}
                              onChange={(e) => updateField(field.id, {
                                conditionalOn: { ...field.conditionalOn!, value: e.target.value },
                              })}
                              style={{ padding: '4px 6px', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 11, flex: 1, minWidth: 80 }}
                            />
                          ) : null}
                        </>
                      ) : null}
                    </div>
                  </details>
                </div>
              );
            })
          )}
        </div>

        <button type="button" onClick={addField} style={{ alignSelf: 'flex-start', padding: '8px 14px', border: '1px dashed #475569', background: 'transparent', color: '#0f172a', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
          + 필드 추가
        </button>
      </section>

      <aside style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <strong style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>미리보기 — {steps[activeStep]?.label}</strong>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {fieldsForActiveStep.length === 0 ? (
            <span style={{ color: '#94a3b8', fontSize: 12 }}>이 step 에 필드가 없습니다.</span>
          ) : (
            fieldsForActiveStep.filter(isFieldVisible).map((field) => (
              <label key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
                {field.label}{field.required ? <span style={{ color: '#dc2626' }}> *</span> : null}
                {field.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    value={previewValues[field.id] ?? ''}
                    onChange={(e) => setPreviewValues((v) => ({ ...v, [field.id]: e.target.value }))}
                    style={{ padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: 4 }}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={previewValues[field.id] ?? ''}
                    onChange={(e) => setPreviewValues((v) => ({ ...v, [field.id]: e.target.value }))}
                    style={{ padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: 4 }}
                  >
                    <option value="">— 선택 —</option>
                    {(field.options ?? []).map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input
                    type={field.type === 'number' || field.type === 'date' || field.type === 'email' ? field.type : 'text'}
                    placeholder={field.placeholder}
                    value={previewValues[field.id] ?? ''}
                    onChange={(e) => setPreviewValues((v) => ({ ...v, [field.id]: e.target.value }))}
                    style={{ padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: 4 }}
                  />
                )}
              </label>
            ))
          )}
          <button type="button" disabled style={{ marginTop: 8, padding: '8px 14px', border: 0, background: '#0f172a', color: '#fff', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'not-allowed', opacity: 0.6 }}>
            {schema.submitLabel}
          </button>
        </div>
      </aside>
    </div>
  );
}
