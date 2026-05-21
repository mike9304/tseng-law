import { promises as fs } from 'fs';
import path from 'path';
import { createHash, randomUUID } from 'node:crypto';
import { get, put } from '@vercel/blob';

type TemplateBackend = 'blob' | 'file';

export type BillingDocumentTemplateLanguage = 'ko' | 'en' | 'zh-hant';

export const BILLING_DOCUMENT_TEMPLATES_VERSION = 1;

export interface BillingDocumentTemplate {
  id: string;
  name: string;
  language: BillingDocumentTemplateLanguage;
  headerHtml: string;
  footerHtml: string;
  accentColor: string;
  logoAssetId?: string;
  includeQrCode: boolean;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BillingDocumentTemplatesState {
  version: typeof BILLING_DOCUMENT_TEMPLATES_VERSION;
  updatedAt: string;
  templates: Record<string, BillingDocumentTemplate>;
}

export interface BillingDocumentTemplateInput {
  name?: string;
  language?: BillingDocumentTemplateLanguage;
  headerHtml?: string;
  footerHtml?: string;
  accentColor?: string;
  logoAssetId?: string | null;
  includeQrCode?: boolean;
  isDefault?: boolean;
}

const TEMPLATES_BLOB = 'builder/billing/templates.json';
const DEFAULT_TEMPLATES_ROOT = path.join(process.cwd(), 'runtime-data', 'billing');
const ACCENT_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;
const NAME_MAX_LENGTH = 120;
const HTML_FIELD_MAX_LENGTH = 4000;
const LOGO_ASSET_ID_MAX_LENGTH = 200;

function getBackend(): TemplateBackend {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return 'file';
  if (process.env.BUILDER_COMMERCE_BACKEND === 'local') return 'file';
  if (process.env.BILLING_TEMPLATES_BACKEND === 'local') return 'file';
  if (process.env.NODE_ENV !== 'production' && process.env.BUILDER_USE_BLOB_IN_DEV !== '1') return 'file';
  return 'blob';
}

function templatesRoot(): string {
  return process.env.BILLING_TEMPLATES_ROOT?.trim() || DEFAULT_TEMPLATES_ROOT;
}

function templatesFilePath(): string {
  return path.join(templatesRoot(), 'templates.json');
}

function isLanguage(value: unknown): value is BillingDocumentTemplateLanguage {
  return value === 'ko' || value === 'en' || value === 'zh-hant';
}

function safeTrim(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function normalizeAccentColor(value: unknown, fallback = '#1d4ed8'): string {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return ACCENT_COLOR_PATTERN.test(trimmed) ? trimmed.toLowerCase() : fallback;
}

function normalizeTemplate(input: unknown, now: string): BillingDocumentTemplate | null {
  if (!input || typeof input !== 'object') return null;
  const source = input as Partial<BillingDocumentTemplate>;
  if (!source.id || typeof source.id !== 'string') return null;
  const name = safeTrim(source.name, NAME_MAX_LENGTH) || 'Untitled template';
  const language: BillingDocumentTemplateLanguage = isLanguage(source.language) ? source.language : 'ko';
  return {
    id: source.id,
    name,
    language,
    headerHtml: safeTrim(source.headerHtml, HTML_FIELD_MAX_LENGTH),
    footerHtml: safeTrim(source.footerHtml, HTML_FIELD_MAX_LENGTH),
    accentColor: normalizeAccentColor(source.accentColor),
    logoAssetId: typeof source.logoAssetId === 'string' && source.logoAssetId.trim()
      ? safeTrim(source.logoAssetId, LOGO_ASSET_ID_MAX_LENGTH)
      : undefined,
    includeQrCode: Boolean(source.includeQrCode),
    isDefault: Boolean(source.isDefault),
    createdAt: typeof source.createdAt === 'string' ? source.createdAt : now,
    updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : now,
  };
}

function defaultState(now: string): BillingDocumentTemplatesState {
  return {
    version: BILLING_DOCUMENT_TEMPLATES_VERSION,
    updatedAt: now,
    templates: {},
  };
}

async function readState(now: string): Promise<BillingDocumentTemplatesState> {
  try {
    if (getBackend() === 'blob') {
      const result = await get(TEMPLATES_BLOB, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        const parsed = await new Response(result.stream).json() as Partial<BillingDocumentTemplatesState>;
        return normalizeState(parsed, now);
      }
      return defaultState(now);
    }
    const raw = await fs.readFile(templatesFilePath(), 'utf8');
    return normalizeState(JSON.parse(raw) as Partial<BillingDocumentTemplatesState>, now);
  } catch {
    return defaultState(now);
  }
}

function normalizeState(input: Partial<BillingDocumentTemplatesState>, now: string): BillingDocumentTemplatesState {
  const templates: Record<string, BillingDocumentTemplate> = {};
  if (input && typeof input === 'object' && input.templates && typeof input.templates === 'object') {
    for (const entry of Object.values(input.templates)) {
      const normalized = normalizeTemplate(entry, now);
      if (normalized) templates[normalized.id] = normalized;
    }
  }
  return {
    version: BILLING_DOCUMENT_TEMPLATES_VERSION,
    updatedAt: typeof input?.updatedAt === 'string' ? input.updatedAt : now,
    templates,
  };
}

async function writeState(state: BillingDocumentTemplatesState): Promise<void> {
  const body = JSON.stringify(state, null, 2);
  if (getBackend() === 'blob') {
    await put(TEMPLATES_BLOB, body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }
  const filePath = templatesFilePath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, body, 'utf8');
}

function templateId(): string {
  return `bdtpl_${createHash('sha256').update(`${Date.now()}:${randomUUID()}`).digest('hex').slice(0, 24)}`;
}

export async function listBillingDocumentTemplates(): Promise<BillingDocumentTemplate[]> {
  const state = await readState(new Date().toISOString());
  return Object.values(state.templates).sort((left, right) => {
    if (left.isDefault && !right.isDefault) return -1;
    if (!left.isDefault && right.isDefault) return 1;
    return right.updatedAt.localeCompare(left.updatedAt);
  });
}

export async function getBillingDocumentTemplate(id: string): Promise<BillingDocumentTemplate | null> {
  const state = await readState(new Date().toISOString());
  return state.templates[id] ?? null;
}

export async function getDefaultBillingDocumentTemplate(
  language?: BillingDocumentTemplateLanguage,
): Promise<BillingDocumentTemplate | null> {
  const templates = await listBillingDocumentTemplates();
  if (language) {
    const localized = templates.find((template) => template.isDefault && template.language === language);
    if (localized) return localized;
  }
  return templates.find((template) => template.isDefault) ?? null;
}

function mergeInput(
  existing: BillingDocumentTemplate | null,
  input: BillingDocumentTemplateInput,
  now: string,
): BillingDocumentTemplate {
  const language: BillingDocumentTemplateLanguage = isLanguage(input.language)
    ? input.language
    : existing?.language ?? 'ko';
  const name = safeTrim(input.name, NAME_MAX_LENGTH) || existing?.name || 'Untitled template';
  const logoAssetId = input.logoAssetId === null
    ? undefined
    : (typeof input.logoAssetId === 'string'
      ? safeTrim(input.logoAssetId, LOGO_ASSET_ID_MAX_LENGTH) || undefined
      : existing?.logoAssetId);
  return {
    id: existing?.id ?? templateId(),
    name,
    language,
    headerHtml: typeof input.headerHtml === 'string'
      ? safeTrim(input.headerHtml, HTML_FIELD_MAX_LENGTH)
      : existing?.headerHtml ?? '',
    footerHtml: typeof input.footerHtml === 'string'
      ? safeTrim(input.footerHtml, HTML_FIELD_MAX_LENGTH)
      : existing?.footerHtml ?? '',
    accentColor: typeof input.accentColor === 'string'
      ? normalizeAccentColor(input.accentColor, existing?.accentColor ?? '#1d4ed8')
      : existing?.accentColor ?? '#1d4ed8',
    logoAssetId,
    includeQrCode: typeof input.includeQrCode === 'boolean'
      ? input.includeQrCode
      : existing?.includeQrCode ?? false,
    isDefault: typeof input.isDefault === 'boolean' ? input.isDefault : existing?.isDefault ?? false,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

function dedupeDefault(
  state: BillingDocumentTemplatesState,
  template: BillingDocumentTemplate,
): BillingDocumentTemplatesState {
  if (!template.isDefault) return state;
  const next: Record<string, BillingDocumentTemplate> = {};
  for (const [id, entry] of Object.entries(state.templates)) {
    next[id] = id === template.id || entry.language !== template.language
      ? entry
      : { ...entry, isDefault: false };
  }
  return { ...state, templates: next };
}

export async function createBillingDocumentTemplate(input: BillingDocumentTemplateInput): Promise<BillingDocumentTemplate> {
  const now = new Date().toISOString();
  const state = await readState(now);
  const template = mergeInput(null, input, now);
  const withTemplate = {
    ...state,
    templates: { ...state.templates, [template.id]: template },
  };
  const next = dedupeDefault(withTemplate, template);
  await writeState({ ...next, updatedAt: now });
  return template;
}

export async function updateBillingDocumentTemplate(
  id: string,
  input: BillingDocumentTemplateInput,
): Promise<BillingDocumentTemplate | null> {
  const now = new Date().toISOString();
  const state = await readState(now);
  const existing = state.templates[id];
  if (!existing) return null;
  const template = mergeInput(existing, input, now);
  const withTemplate = {
    ...state,
    templates: { ...state.templates, [id]: template },
  };
  const next = dedupeDefault(withTemplate, template);
  await writeState({ ...next, updatedAt: now });
  return template;
}

export async function deleteBillingDocumentTemplate(id: string): Promise<boolean> {
  const now = new Date().toISOString();
  const state = await readState(now);
  if (!state.templates[id]) return false;
  const next: Record<string, BillingDocumentTemplate> = { ...state.templates };
  delete next[id];
  await writeState({
    ...state,
    templates: next,
    updatedAt: now,
  });
  return true;
}