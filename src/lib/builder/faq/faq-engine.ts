/**
 * Native FAQ app engine.
 *
 * F47 promotes the legacy static FAQ copy into app-backed records so admin,
 * public widgets, JSON-LD, and search index all read the same source.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { get, list, put } from '@vercel/blob';
import { faqContent } from '@/data/faq-content';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import type { SearchDoc } from '@/lib/builder/search/types';
import {
  DEFAULT_FAQ_CATEGORIES,
  getFaqCategoryLabel,
  sortFaqItems,
  type BuilderFaqCategory,
  type BuilderFaqItem,
  type FaqListQuery,
  type FaqStatus,
} from './faq-shared';

export type {
  BuilderFaqCategory,
  BuilderFaqItem,
  FaqListQuery,
  FaqSortBy,
  FaqStatus,
} from './faq-shared';
export { DEFAULT_FAQ_CATEGORIES, getFaqCategoryLabel, sortFaqItems };

type FaqBackend = 'blob' | 'file';
type StoredFaqItem = BuilderFaqItem & { deleted?: boolean };

const FAQ_PREFIX = 'builder-faq/items/';
const DEFAULT_FAQ_ROOT = path.join(process.cwd(), 'runtime-data', 'builder-faq');
const STATIC_SEED_DATE = '2026-05-20T00:00:00.000Z';

const SEED_CATEGORY_BY_INDEX = [
  'company-setup',
  'company-setup',
  'company-setup',
  'company-setup',
  'labor-law',
  'labor-law',
  'civil-traffic',
  'civil-traffic',
  'family-divorce',
  'family-divorce',
  'criminal-defense',
  'consultation',
  'consultation',
];

function getBackend(): FaqBackend {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return 'file';
  if (process.env.CONSULTATION_LOG_BACKEND === 'local') return 'file';
  if (process.env.BUILDER_FAQ_BACKEND === 'local') return 'file';
  if (process.env.NODE_ENV !== 'production' && process.env.BUILDER_USE_BLOB_IN_DEV !== '1') return 'file';
  return 'blob';
}

function faqRoot(): string {
  return process.env.BUILDER_FAQ_ROOT?.trim() || DEFAULT_FAQ_ROOT;
}

function faqBlobPath(faqId: string): string {
  return `${FAQ_PREFIX}${faqId}.json`;
}

function faqFilePath(faqId: string): string {
  return path.join(faqRoot(), 'items', `${faqId}.json`);
}

async function writeJson(blobPath: string, filePath: string, data: unknown): Promise<void> {
  const body = JSON.stringify(data, null, 2);
  if (getBackend() === 'blob') {
    await put(blobPath, body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, body, 'utf8');
}

async function readJson<T>(blobPath: string, filePath: string): Promise<T | null> {
  try {
    if (getBackend() === 'blob') {
      const result = await get(blobPath, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        return JSON.parse(await new Response(result.stream).text()) as T;
      }
      return null;
    }

    return JSON.parse(await fs.readFile(filePath, 'utf8')) as T;
  } catch {
    return null;
  }
}

async function listStoredFaqJson(): Promise<StoredFaqItem[]> {
  if (getBackend() === 'blob') {
    const result = await list({ prefix: FAQ_PREFIX });
    const values: StoredFaqItem[] = [];
    for (const blob of result.blobs) {
      const faqId = path.basename(blob.pathname, '.json');
      const parsed = await readJson<StoredFaqItem>(blob.pathname, faqFilePath(faqId));
      if (parsed) values.push(parsed);
    }
    return values;
  }

  const dir = path.join(faqRoot(), 'items');
  const files = await fs.readdir(dir).catch(() => []);
  const values: StoredFaqItem[] = [];
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const raw = await fs.readFile(path.join(dir, file), 'utf8').catch(() => '');
    if (!raw) continue;
    try {
      values.push(JSON.parse(raw) as StoredFaqItem);
    } catch {
      // Skip malformed local records.
    }
  }
  return values;
}

function nowIso(): string {
  return new Date().toISOString();
}

function safeTrim(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function normalizeStatus(status: unknown): FaqStatus {
  return status === 'draft' ? 'draft' : 'published';
}

export function slugifyFaqQuestion(question: string): string {
  const slug = question
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9가-힣一-龥ぁ-んァ-ン]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return slug || `faq-${Date.now()}`;
}

export function makeFaqId(): string {
  return `faq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((tag) => safeTrim(tag, 60))
    .filter(Boolean)
    .slice(0, 20);
}

export function normalizeFaqItem(input: Partial<BuilderFaqItem>): BuilderFaqItem {
  const at = nowIso();
  const locale = normalizeLocale(input.locale);
  const question = safeTrim(input.question, 500);
  const faqId = safeTrim(input.faqId, 120) || makeFaqId();
  const categoryId = DEFAULT_FAQ_CATEGORIES.some((category) => category.categoryId === input.categoryId)
    ? String(input.categoryId)
    : 'company-setup';

  return {
    faqId,
    slug: safeTrim(input.slug, 120) || slugifyFaqQuestion(question),
    locale,
    question,
    answer: safeTrim(input.answer, 5000),
    categoryId,
    tags: normalizeTags(input.tags),
    status: normalizeStatus(input.status),
    sortOrder: Number.isFinite(input.sortOrder)
      ? Math.max(0, Math.round(input.sortOrder ?? 0))
      : 1000,
    schemaEnabled: input.schemaEnabled !== false,
    createdAt: input.createdAt && Number.isFinite(Date.parse(input.createdAt)) ? input.createdAt : at,
    updatedAt: input.updatedAt && Number.isFinite(Date.parse(input.updatedAt)) ? input.updatedAt : at,
  };
}

export function seedFaqItems(): BuilderFaqItem[] {
  const out: BuilderFaqItem[] = [];
  for (const locale of locales) {
    faqContent[locale].forEach((item, index) => {
      const categoryId = SEED_CATEGORY_BY_INDEX[index] ?? 'consultation';
      out.push(normalizeFaqItem({
        faqId: `seed-${locale}-${index + 1}`,
        slug: slugifyFaqQuestion(item.question),
        locale,
        question: item.question,
        answer: item.answer,
        categoryId,
        tags: [getFaqCategoryLabel(categoryId, locale)],
        status: 'published',
        sortOrder: (index + 1) * 10,
        schemaEnabled: true,
        createdAt: STATIC_SEED_DATE,
        updatedAt: STATIC_SEED_DATE,
      }));
    });
  }
  return out;
}

export function listFaqCategories(): BuilderFaqCategory[] {
  return [...DEFAULT_FAQ_CATEGORIES].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function listAllFaqItems(): Promise<BuilderFaqItem[]> {
  const merged = new Map<string, StoredFaqItem>();
  for (const item of seedFaqItems()) {
    merged.set(item.faqId, item);
  }
  for (const item of await listStoredFaqJson()) {
    merged.set(item.faqId, item);
  }
  return Array.from(merged.values())
    .filter((item) => !item.deleted)
    .map(normalizeFaqItem);
}

export async function loadFaqItem(faqId: string): Promise<BuilderFaqItem | null> {
  const stored = await readJson<StoredFaqItem>(faqBlobPath(faqId), faqFilePath(faqId));
  if (stored?.deleted) return null;
  if (stored) return normalizeFaqItem(stored);
  return seedFaqItems().find((item) => item.faqId === faqId) ?? null;
}

export function filterFaqItems(items: BuilderFaqItem[], query: FaqListQuery = {}): BuilderFaqItem[] {
  const locale = query.locale;
  const status = query.status ?? 'published';
  const categoryId = query.categoryId?.trim();
  const normalizedQuery = query.q?.trim().toLowerCase();

  let next = items;
  if (locale) next = next.filter((item) => item.locale === locale);
  if (status !== 'all') next = next.filter((item) => item.status === status);
  if (query.schemaOnly) next = next.filter((item) => item.schemaEnabled);
  if (categoryId && categoryId !== 'all') next = next.filter((item) => item.categoryId === categoryId);
  if (normalizedQuery) {
    next = next.filter((item) => [
      item.question,
      item.answer,
      item.categoryId,
      getFaqCategoryLabel(item.categoryId, item.locale),
      ...item.tags,
    ].some((value) => value.toLowerCase().includes(normalizedQuery)));
  }
  next = sortFaqItems(next, query.sortBy ?? 'manual');
  if (query.limit) next = next.slice(0, Math.max(1, Math.min(100, query.limit)));
  return next;
}

export async function listFaqItems(query: FaqListQuery = {}): Promise<BuilderFaqItem[]> {
  return filterFaqItems(await listAllFaqItems(), query);
}

export async function saveFaqItem(item: BuilderFaqItem): Promise<BuilderFaqItem> {
  const normalized = normalizeFaqItem({ ...item, updatedAt: nowIso() });
  await writeJson(faqBlobPath(normalized.faqId), faqFilePath(normalized.faqId), normalized);
  return normalized;
}

export async function createFaqItem(input: Partial<BuilderFaqItem>): Promise<BuilderFaqItem> {
  const normalized = normalizeFaqItem({
    ...input,
    faqId: makeFaqId(),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });
  await writeJson(faqBlobPath(normalized.faqId), faqFilePath(normalized.faqId), normalized);
  return normalized;
}

export async function deleteFaqItem(faqId: string): Promise<void> {
  const existing = await loadFaqItem(faqId);
  await writeJson(
    faqBlobPath(faqId),
    faqFilePath(faqId),
    existing ? { ...existing, deleted: true, updatedAt: nowIso() } : { faqId, deleted: true },
  );
}

export function validateFaqItem(item: Partial<BuilderFaqItem>): string[] {
  const errors: string[] = [];
  if (!item.question?.trim()) errors.push('질문을 입력하세요.');
  if (!item.answer?.trim()) errors.push('답변을 입력하세요.');
  if (!item.locale || !locales.includes(item.locale)) errors.push('지원하지 않는 언어입니다.');
  if (!item.categoryId || !DEFAULT_FAQ_CATEGORIES.some((category) => category.categoryId === item.categoryId)) {
    errors.push('카테고리를 선택하세요.');
  }
  return errors;
}

export function faqItemsToSchemaItems(items: BuilderFaqItem[]): Array<{ question: string; answer: string }> {
  return items
    .filter((item) => item.schemaEnabled && item.status === 'published')
    .map((item) => ({
      question: item.question.trim(),
      answer: item.answer.trim(),
    }))
    .filter((item) => item.question && item.answer);
}

export async function listFaqSearchDocs(locale: Locale): Promise<SearchDoc[]> {
  const items = await listFaqItems({ locale, status: 'published' });
  return items.map((item): SearchDoc => ({
    id: `faq:${locale}:${item.faqId}`,
    kind: 'faq',
    locale,
    title: item.question,
    url: `/${locale}/faq?category=${encodeURIComponent(item.categoryId)}#${encodeURIComponent(item.slug)}`,
    summary: item.answer.slice(0, 180),
    body: [
      item.question,
      item.answer,
      getFaqCategoryLabel(item.categoryId, locale),
      ...item.tags,
    ].join('\n'),
    publishedAt: item.updatedAt,
    tags: [item.categoryId, ...item.tags],
  }));
}
