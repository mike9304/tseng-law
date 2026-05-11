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

import { get, list as listBlob, put } from '@vercel/blob';
import { mkdir, readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

// ─── Form Schema ──────────────────────────────────────────────────

export type FormFieldType = 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file' | 'date' | 'number';

export type ConditionalOperator =
  | 'equals'
  | 'not-equals'
  | 'contains'
  | 'empty'
  | 'not-empty';

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
    step?: number;
    allowDecimals?: boolean;
    dateMin?: string;
    dateMax?: string;
    accept?: string; // file types
    maxFileSize?: number; // bytes
  };
  conditionalOn?: {
    fieldId: string;
    value?: string;
    operator?: ConditionalOperator;
  };
  /** PR #7 — index into FormSchema.steps. Defaults to 0. */
  step?: number;
}

export interface FormStep {
  id: string;
  label: string;
}

export interface FormSchema {
  formId: string;
  name: string;
  fields: FormField[];
  /** PR #7 — multi-step support. When absent, the form is single-step. */
  steps?: FormStep[];
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
  files?: FormSubmissionFile[];
  submittedAt: string;
  ip?: string;
  userAgent?: string;
  read: boolean;
}

export interface FormSubmissionFile {
  fieldId: string;
  url?: string;
  name: string;
  size: number;
  type?: string;
  uploadedAt?: string;
}

const FORMS_PREFIX = 'builder-forms/schemas/';
const SUBMISSIONS_PREFIX = 'builder-forms/submissions/';
const FORMS_RUNTIME_ROOT = path.join(process.cwd(), 'runtime-data');

export async function saveFormSchema(schema: FormSchema): Promise<void> {
  await writeJson(`${FORMS_PREFIX}${schema.formId}.json`, JSON.stringify(schema));
}

export async function loadFormSchema(formId: string): Promise<FormSchema | null> {
  try {
    const raw = await readJson(`${FORMS_PREFIX}${formId}.json`);
    if (raw) return JSON.parse(raw) as FormSchema;
  } catch { /* empty */ }
  return null;
}

export async function listForms(): Promise<FormSchema[]> {
  try {
    const result = await listJsonPathnames(FORMS_PREFIX);
    const forms: FormSchema[] = [];
    for (const blob of result) {
      try {
        const raw = await readJson(blob.pathname);
        if (raw) forms.push(JSON.parse(raw) as FormSchema);
      } catch { /* skip */ }
    }
    return forms;
  } catch { return []; }
}

export async function saveSubmission(submission: FormSubmission): Promise<void> {
  const dateKey = submission.submittedAt.slice(0, 10);
  await writeJson(
    `${SUBMISSIONS_PREFIX}${submission.formId}/${dateKey}/${submission.submissionId}.json`,
    JSON.stringify(submission),
  );
}

export async function listSubmissions(formId: string, limit = 50): Promise<FormSubmission[]> {
  try {
    const result = await listJsonPathnames(`${SUBMISSIONS_PREFIX}${formId}/`);
    const submissions: FormSubmission[] = [];
    const blobs = result.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()).slice(0, limit);
    for (const blob of blobs) {
      try {
        const raw = await readJson(blob.pathname);
        if (raw) submissions.push(JSON.parse(raw) as FormSubmission);
      } catch { /* skip */ }
    }
    return submissions;
  } catch { return []; }
}

export async function listSubmissionFormIds(): Promise<string[]> {
  try {
    const result = await listJsonPathnames(SUBMISSIONS_PREFIX);
    const ids = new Set<string>();
    for (const blob of result) {
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
  options: { files?: FormSubmissionFile[] } = {},
): Array<{ fieldId: string; message: string }> {
  const errors: Array<{ fieldId: string; message: string }> = [];
  const files = options.files ?? [];

  for (const field of schema.fields) {
    if (!isSchemaFieldVisible(field, data)) continue;

    const value = data[field.id];
    const fieldFiles = files.filter((file) => file.fieldId === field.id);

    if (field.required && isEmptyFieldValue(field, value, fieldFiles)) {
      errors.push({ fieldId: field.id, message: `${field.label}은(는) 필수입니다.` });
      continue;
    }

    if (isEmptyFieldValue(field, value, fieldFiles)) continue;
    const strVal = String(value);

    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strVal)) {
      errors.push({ fieldId: field.id, message: '유효한 이메일 주소를 입력하세요.' });
    }

    if (field.type === 'phone' && !/^\+?[\d\s().-]{7,25}$/.test(strVal)) {
      errors.push({ fieldId: field.id, message: '유효한 전화번호를 입력하세요.' });
    }

    if (field.type === 'number') {
      const numeric = Number(strVal);
      if (!Number.isFinite(numeric)) {
        errors.push({ fieldId: field.id, message: '숫자를 입력하세요.' });
      } else {
        if (field.validation?.allowDecimals === false && !Number.isInteger(numeric)) {
          errors.push({ fieldId: field.id, message: '정수만 입력할 수 있습니다.' });
        }
        if (typeof field.validation?.min === 'number' && numeric < field.validation.min) {
          errors.push({ fieldId: field.id, message: `${field.validation.min} 이상 입력하세요.` });
        }
        if (typeof field.validation?.max === 'number' && numeric > field.validation.max) {
          errors.push({ fieldId: field.id, message: `${field.validation.max} 이하로 입력하세요.` });
        }
        if (typeof field.validation?.step === 'number' && field.validation.step > 0) {
          const base = field.validation.min ?? 0;
          const units = (numeric - base) / field.validation.step;
          if (Math.abs(units - Math.round(units)) > 1e-8) {
            errors.push({ fieldId: field.id, message: `${field.validation.step} 단위로 입력하세요.` });
          }
        }
      }
    }

    if (field.type === 'date') {
      if (!isValidDateLike(strVal)) {
        errors.push({ fieldId: field.id, message: '유효한 날짜를 입력하세요.' });
      } else {
        if (field.validation?.dateMin && strVal < field.validation.dateMin) {
          errors.push({ fieldId: field.id, message: `${field.validation.dateMin} 이후 날짜를 선택하세요.` });
        }
        if (field.validation?.dateMax && strVal > field.validation.dateMax) {
          errors.push({ fieldId: field.id, message: `${field.validation.dateMax} 이전 날짜를 선택하세요.` });
        }
      }
    }

    if ((field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && field.options?.length) {
      const allowed = new Set(field.options);
      const submitted = normalizeChoiceValues(value);
      const invalid = submitted.find((item) => !allowed.has(item));
      if (invalid) {
        errors.push({ fieldId: field.id, message: '선택할 수 없는 옵션입니다.' });
      }
    }

    if (field.type === 'file') {
      for (const file of fieldFiles) {
        if (field.validation?.maxFileSize && file.size > field.validation.maxFileSize) {
          errors.push({ fieldId: field.id, message: `파일은 ${Math.round(field.validation.maxFileSize / 1024 / 1024)}MB 이하로 첨부해 주세요.` });
        }
        if (field.validation?.accept && !fileMatchesAccept(file, field.validation.accept)) {
          errors.push({ fieldId: field.id, message: '허용되지 않는 파일 형식입니다.' });
        }
      }
    }

    if (field.validation?.minLength && strVal.length < field.validation.minLength) {
      errors.push({ fieldId: field.id, message: `최소 ${field.validation.minLength}자 이상 입력하세요.` });
    }

    if (field.validation?.maxLength && strVal.length > field.validation.maxLength) {
      errors.push({ fieldId: field.id, message: `최대 ${field.validation.maxLength}자까지 입력 가능합니다.` });
    }

    if (field.validation?.pattern) {
      try {
        if (!new RegExp(field.validation.pattern).test(strVal)) {
          errors.push({ fieldId: field.id, message: '입력 형식이 올바르지 않습니다.' });
        }
      } catch {
        errors.push({ fieldId: field.id, message: '검증식 설정이 올바르지 않습니다.' });
      }
    }
  }

  return errors;
}

function hasBlobToken(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

async function readJson(pathname: string): Promise<string | null> {
  if (hasBlobToken()) {
    try {
      const result = await get(pathname, { access: 'private', useCache: false });
      if (!result || result.statusCode !== 200 || !result.stream) return null;
      return new Response(result.stream).text();
    } catch {
      return null;
    }
  }

  try {
    return await readFile(resolveFormsRuntimePath(pathname), 'utf8');
  } catch (error) {
    if (isNodeNotFoundError(error)) return null;
    throw error;
  }
}

async function writeJson(pathname: string, json: string): Promise<void> {
  if (hasBlobToken()) {
    await put(pathname, json, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }

  const resolved = resolveFormsRuntimePath(pathname);
  await mkdir(path.dirname(resolved), { recursive: true, mode: 0o700 });
  await writeFile(resolved, json, { mode: 0o600 });
}

async function listJsonPathnames(prefix: string): Promise<Array<{ pathname: string; uploadedAt: Date }>> {
  if (hasBlobToken()) {
    const result = await listBlob({ prefix });
    return result.blobs.map((blob) => ({ pathname: blob.pathname, uploadedAt: blob.uploadedAt }));
  }

  const root = resolveFormsRuntimePath(prefix);
  const files: Array<{ pathname: string; uploadedAt: Date }> = [];
  await walkJsonFiles(root, prefix, files);
  return files;
}

async function walkJsonFiles(
  root: string,
  prefix: string,
  files: Array<{ pathname: string; uploadedAt: Date }>,
): Promise<void> {
  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch (error) {
    if (isNodeNotFoundError(error)) return;
    throw error;
  }

  for (const entry of entries) {
    const absolute = path.join(root, entry.name);
    const pathname = `${prefix}${entry.name}`;
    if (entry.isDirectory()) {
      await walkJsonFiles(`${absolute}/`, `${pathname}/`, files);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push({ pathname, uploadedAt: new Date() });
    }
  }
}

function resolveFormsRuntimePath(pathname: string): string {
  return path.join(FORMS_RUNTIME_ROOT, pathname);
}

function isNodeNotFoundError(error: unknown): boolean {
  return (
    Boolean(error) &&
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'ENOENT'
  );
}

function isSchemaFieldVisible(field: FormField, data: Record<string, unknown>): boolean {
  if (!field.conditionalOn) return true;
  const depValue = data[field.conditionalOn.fieldId];
  const actual = valueToText(depValue);
  const expected = field.conditionalOn.value ?? '';
  const op = field.conditionalOn.operator ?? 'equals';

  switch (op) {
    case 'equals':
      return Array.isArray(depValue) ? depValue.map(String).includes(expected) : actual === expected;
    case 'not-equals':
      return Array.isArray(depValue) ? !depValue.map(String).includes(expected) : actual !== expected;
    case 'contains':
      return actual.includes(expected);
    case 'empty':
      return actual.trim().length === 0;
    case 'not-empty':
      return actual.trim().length > 0;
  }
}

function isEmptyFieldValue(field: FormField, value: unknown, files: FormSubmissionFile[]): boolean {
  if (field.type === 'file') return files.length === 0;
  if (Array.isArray(value)) return value.length === 0 || value.every((item) => String(item).trim() === '');
  if (typeof value === 'boolean') return value === false;
  return value == null || String(value).trim() === '';
}

function valueToText(value: unknown): string {
  if (Array.isArray(value)) return value.map(String).join(',');
  if (typeof value === 'boolean') return value ? 'true' : '';
  return value == null ? '' : String(value);
}

function normalizeChoiceValues(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value === 'boolean') return value ? ['true'] : [];
  if (value == null) return [];
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function isValidDateLike(value: string): boolean {
  if (!value.trim()) return false;
  return !Number.isNaN(Date.parse(value));
}

function fileMatchesAccept(file: FormSubmissionFile, accept: string): boolean {
  const tokens = accept.split(',').map((token) => token.trim().toLowerCase()).filter(Boolean);
  if (tokens.length === 0) return true;
  const type = (file.type ?? '').toLowerCase();
  const name = file.name.toLowerCase();
  return tokens.some((token) => {
    if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1));
    if (token.startsWith('.')) return name.endsWith(token);
    return type === token;
  });
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
