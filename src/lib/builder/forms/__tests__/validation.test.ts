import { describe, expect, it } from 'vitest';
import { validateSubmission, type FormSchema } from '@/lib/builder/forms/form-engine';

function makeSchema(fields: FormSchema['fields']): FormSchema {
  return {
    formId: 'validation-test',
    name: 'validation-test',
    fields,
    submitLabel: 'Submit',
    successMessage: 'ok',
    errorMessage: 'err',
    createdAt: '2026-05-11T00:00:00Z',
    updatedAt: '2026-05-11T00:00:00Z',
  };
}

describe('validateSubmission field coverage', () => {
  it('validates number bounds, decimal policy, and step', () => {
    const schema = makeSchema([
      {
        id: 'amount',
        type: 'number',
        label: 'Amount',
        required: true,
        validation: { min: 10, max: 20, step: 2, allowDecimals: false },
      },
    ]);

    expect(validateSubmission(schema, { amount: '9' })).toEqual(
      expect.arrayContaining([expect.objectContaining({ fieldId: 'amount' })]),
    );
    expect(validateSubmission(schema, { amount: '13.5' })).toHaveLength(2);
    expect(validateSubmission(schema, { amount: '14' })).toHaveLength(0);
  });

  it('rejects invalid select, radio, and checkbox options', () => {
    const schema = makeSchema([
      { id: 'select', type: 'select', label: 'Select', required: true, options: ['A', 'B'] },
      { id: 'radio', type: 'radio', label: 'Radio', required: true, options: ['yes', 'no'] },
      { id: 'checks', type: 'checkbox', label: 'Checks', required: true, options: ['x', 'y'] },
    ]);

    const errors = validateSubmission(schema, {
      select: 'C',
      radio: 'maybe',
      checks: ['x', 'z'],
    });

    expect(errors.map((error) => error.fieldId).sort()).toEqual(['checks', 'radio', 'select']);
  });

  it('validates date values and file metadata', () => {
    const schema = makeSchema([
      {
        id: 'day',
        type: 'date',
        label: 'Day',
        required: true,
        validation: { dateMin: '2026-05-01', dateMax: '2026-05-31' },
      },
      {
        id: 'attachment',
        type: 'file',
        label: 'Attachment',
        required: true,
        validation: { accept: 'image/*,.pdf', maxFileSize: 1024 },
      },
    ]);

    const errors = validateSubmission(
      schema,
      { day: '2026-06-01' },
      { files: [{ fieldId: 'attachment', name: 'payload.exe', type: 'application/octet-stream', size: 2048 }] },
    );

    expect(errors.map((error) => error.fieldId)).toEqual(['day', 'attachment', 'attachment']);
  });

  it('keeps conditionally hidden fields out of validation', () => {
    const schema = makeSchema([
      { id: 'caseType', type: 'select', label: 'Case', required: true, options: ['family', 'business'] },
      {
        id: 'businessId',
        type: 'text',
        label: 'Business ID',
        required: true,
        validation: { pattern: '^BIZ-' },
        conditionalOn: { fieldId: 'caseType', operator: 'equals', value: 'business' },
      },
    ]);

    expect(validateSubmission(schema, { caseType: 'family' })).toHaveLength(0);
    expect(validateSubmission(schema, { caseType: 'business', businessId: '123' })).toEqual(
      expect.arrayContaining([expect.objectContaining({ fieldId: 'businessId' })]),
    );
  });

  it('validates international phone numbers', () => {
    const schema = makeSchema([
      { id: 'phone', type: 'phone', label: 'Phone', required: true },
    ]);

    expect(validateSubmission(schema, { phone: '+82 10-1234-5678' })).toHaveLength(0);
    expect(validateSubmission(schema, { phone: 'abc' })).toEqual(
      expect.arrayContaining([expect.objectContaining({ fieldId: 'phone' })]),
    );
  });
});
