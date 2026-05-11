import { describe, expect, it } from 'vitest';
import { validateSubmission, type FormSchema } from '@/lib/builder/forms/form-engine';

function makeSchema(fields: FormSchema['fields']): FormSchema {
  return {
    formId: 'test',
    name: 'test',
    fields,
    submitLabel: 'Submit',
    successMessage: 'ok',
    errorMessage: 'err',
    createdAt: '2026-05-11T00:00:00Z',
    updatedAt: '2026-05-11T00:00:00Z',
  };
}

describe('validateSubmission with conditional operators', () => {
  it('skips conditionally hidden required fields under not-equals', () => {
    const schema = makeSchema([
      { id: 'category', type: 'select', label: 'Category', required: true, options: ['A', 'B'] },
      {
        id: 'reason',
        type: 'text',
        label: 'Reason',
        required: true,
        conditionalOn: { fieldId: 'category', operator: 'not-equals', value: 'A' },
      },
    ]);
    const errs = validateSubmission(schema, { category: 'A' });
    // reason hidden because category === 'A' fails not-equals 'A' check, so required check skipped
    expect(errs.find((e) => e.fieldId === 'reason')).toBeUndefined();
  });

  it('requires conditionally visible fields under contains', () => {
    const schema = makeSchema([
      { id: 'tags', type: 'text', label: 'Tags', required: false },
      {
        id: 'detail',
        type: 'text',
        label: 'Detail',
        required: true,
        conditionalOn: { fieldId: 'tags', operator: 'contains', value: 'urgent' },
      },
    ]);
    const errs = validateSubmission(schema, { tags: 'urgent legal', detail: '' });
    expect(errs.find((e) => e.fieldId === 'detail')).toBeDefined();
  });

  it('honors empty operator (visible only when reference is blank)', () => {
    const schema = makeSchema([
      { id: 'opt1', type: 'text', label: 'opt1', required: false },
      {
        id: 'note',
        type: 'text',
        label: 'Note',
        required: true,
        conditionalOn: { fieldId: 'opt1', operator: 'empty' },
      },
    ]);
    const filled = validateSubmission(schema, { opt1: 'has value' });
    const blank = validateSubmission(schema, { opt1: '' });
    expect(filled.find((e) => e.fieldId === 'note')).toBeUndefined();
    expect(blank.find((e) => e.fieldId === 'note')).toBeDefined();
  });
});
