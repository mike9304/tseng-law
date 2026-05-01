/**
 * Phase 11 — Forms & Submissions engine.
 *
 * FOR-01: Form schema model (field types, validation rules)
 * FOR-02: Submission storage (Blob-persisted)
 * FOR-03: Field types (text, email, phone, select, checkbox, textarea, file)
 * FOR-04: Conditional field logic
 * FOR-05: Submission notifications
 * FOR-06: CMS/contacts storage integration
 */

import { get, put, list } from '@vercel/blob';

// ─── Form Schema ──────────────────────────────────────────────────

export type FormFieldType = 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file' | 'date' | 'number';

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // for select/radio
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    accept?: string; // file types
    maxFileSize?: number; // bytes
  };
  conditionalOn?: {
    fieldId: string;
    value: string;
  };
}

export interface FormSchema {
  formId: string;
  name: string;
  fields: FormField[];
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
  notifyEmail?: string;
  redirectUrl?: string;
  storeInCms?: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Submissions ──────────────────────────────────────────────────

export interface FormSubmission {
  submissionId: string;
  formId: string;
  data: Record<string, unknown>;
  files?: Array<{ fieldId: string; url: string; name: string; size: number }>;
  submittedAt: string;
  ip?: string;
  userAgent?: string;
  read: boolean;
}

const FORMS_PREFIX = 'builder-forms/schemas/';
const SUBMISSIONS_PREFIX = 'builder-forms/submissions/';

export async function saveFormSchema(schema: FormSchema): Promise<void> {
  await put(`${FORMS_PREFIX}${schema.formId}.json`, JSON.stringify(schema), {
    access: 'private', allowOverwrite: true, contentType: 'application/json',
  });
}

export async function loadFormSchema(formId: string): Promise<FormSchema | null> {
  try {
    const result = await get(`${FORMS_PREFIX}${formId}.json`, { access: 'private', useCache: false });
    if (result?.statusCode === 200 && result.stream) {
      return JSON.parse(await new Response(result.stream).text()) as FormSchema;
    }
  } catch { /* empty */ }
  return null;
}

export async function listForms(): Promise<FormSchema[]> {
  try {
    const result = await list({ prefix: FORMS_PREFIX });
    const forms: FormSchema[] = [];
    for (const blob of result.blobs) {
      try {
        const res = await get(blob.pathname, { access: 'private', useCache: false });
        if (res?.statusCode === 200 && res.stream) {
          forms.push(JSON.parse(await new Response(res.stream).text()) as FormSchema);
        }
      } catch { /* skip */ }
    }
    return forms;
  } catch { return []; }
}

export async function saveSubmission(submission: FormSubmission): Promise<void> {
  const dateKey = submission.submittedAt.slice(0, 10);
  await put(
    `${SUBMISSIONS_PREFIX}${submission.formId}/${dateKey}/${submission.submissionId}.json`,
    JSON.stringify(submission),
    { access: 'private', allowOverwrite: true, contentType: 'application/json' },
  );
}

export async function listSubmissions(formId: string, limit = 50): Promise<FormSubmission[]> {
  try {
    const result = await list({ prefix: `${SUBMISSIONS_PREFIX}${formId}/` });
    const submissions: FormSubmission[] = [];
    const blobs = result.blobs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()).slice(0, limit);
    for (const blob of blobs) {
      try {
        const res = await get(blob.pathname, { access: 'private', useCache: false });
        if (res?.statusCode === 200 && res.stream) {
          submissions.push(JSON.parse(await new Response(res.stream).text()) as FormSubmission);
        }
      } catch { /* skip */ }
    }
    return submissions;
  } catch { return []; }
}

export async function listSubmissionFormIds(): Promise<string[]> {
  try {
    const result = await list({ prefix: SUBMISSIONS_PREFIX });
    const ids = new Set<string>();
    for (const blob of result.blobs) {
      const rest = blob.pathname.slice(SUBMISSIONS_PREFIX.length);
      const formId = rest.split('/')[0];
      if (formId) ids.add(formId);
    }
    return Array.from(ids).sort();
  } catch {
    return [];
  }
}

// ─── Validation ───────────────────────────────────────────────────

export function validateSubmission(
  schema: FormSchema,
  data: Record<string, unknown>,
): Array<{ fieldId: string; message: string }> {
  const errors: Array<{ fieldId: string; message: string }> = [];

  for (const field of schema.fields) {
    // Skip conditionally hidden fields
    if (field.conditionalOn) {
      const depValue = data[field.conditionalOn.fieldId];
      if (String(depValue) !== field.conditionalOn.value) continue;
    }

    const value = data[field.id];

    if (field.required && (value == null || String(value).trim() === '')) {
      errors.push({ fieldId: field.id, message: `${field.label}은(는) 필수입니다.` });
      continue;
    }

    if (!value) continue;
    const strVal = String(value);

    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strVal)) {
      errors.push({ fieldId: field.id, message: '유효한 이메일 주소를 입력하세요.' });
    }

    if (field.validation?.minLength && strVal.length < field.validation.minLength) {
      errors.push({ fieldId: field.id, message: `최소 ${field.validation.minLength}자 이상 입력하세요.` });
    }

    if (field.validation?.maxLength && strVal.length > field.validation.maxLength) {
      errors.push({ fieldId: field.id, message: `최대 ${field.validation.maxLength}자까지 입력 가능합니다.` });
    }

    if (field.validation?.pattern && !new RegExp(field.validation.pattern).test(strVal)) {
      errors.push({ fieldId: field.id, message: '입력 형식이 올바르지 않습니다.' });
    }
  }

  return errors;
}

// ─── Default contact form ─────────────────────────────────────────

export function createDefaultContactForm(): FormSchema {
  return {
    formId: 'default-contact',
    name: '상담 문의',
    fields: [
      { id: 'name', type: 'text', label: '이름', required: true, placeholder: '홍길동' },
      { id: 'email', type: 'email', label: '이메일', required: true, placeholder: 'you@example.com' },
      { id: 'phone', type: 'phone', label: '전화번호', required: false, placeholder: '+82-10-xxxx-xxxx' },
      { id: 'category', type: 'select', label: '문의 유형', required: true, options: ['회사설립', '교통사고', '이혼/가사', '형사', '노동', '상속', '기타'] },
      { id: 'message', type: 'textarea', label: '문의 내용', required: true, placeholder: '상담하고 싶은 내용을 자유롭게 작성해 주세요.', validation: { maxLength: 5000 } },
      { id: 'file', type: 'file', label: '관련 서류 첨부', required: false, validation: { accept: 'image/*,.pdf,.doc,.docx', maxFileSize: 10 * 1024 * 1024 } },
      { id: 'consent', type: 'checkbox', label: '개인정보 수집·이용에 동의합니다', required: true },
    ],
    submitLabel: '상담 신청',
    successMessage: '상담 신청이 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.',
    errorMessage: '접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    notifyEmail: 'wei@hoveringlaw.com.tw',
    storeInCms: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
