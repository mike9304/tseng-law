import { mkdir, readdir, readFile, rm, writeFile } from 'fs/promises';
import path from 'path';
import { del, get, list, put } from '@vercel/blob';
import { getAllColumnPosts, type ColumnPost } from '@/lib/columns';
import type { Locale } from '@/lib/locales';
import {
  columnDocumentSchema,
  type ColumnDocument,
  type ColumnDocumentBundle,
  type ColumnFrontmatter,
  type ColumnLinkedSlugs,
  type ColumnListItem,
} from './types';

type ColumnBackend = 'blob' | 'file';
type ColumnVariant = 'draft' | 'published';

const COLUMN_BLOB_PREFIX = 'consultation-columns';

function getColumnBackend(): ColumnBackend {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return 'file';
  if (process.env.CONSULTATION_LOG_BACKEND === 'local') return 'file';
  return 'blob';
}

function getLocalColumnsRoot(): string {
  return (
    process.env.CONSULTATION_COLUMNS_DIR
    || path.join(process.cwd(), 'runtime-data', 'consultation-columns')
  );
}

function getLocalColumnsDir(locale: Locale): string {
  return path.join(getLocalColumnsRoot(), locale);
}

function buildColumnPathname(locale: Locale, slug: string, variant: ColumnVariant): string {
  const suffix = variant === 'draft' ? '.json' : '.published.json';
  return `${COLUMN_BLOB_PREFIX}/${locale}/${slug}${suffix}`;
}

function buildLocalColumnPath(locale: Locale, slug: string, variant: ColumnVariant): string {
  const suffix = variant === 'draft' ? '.json' : '.published.json';
  return path.join(getLocalColumnsDir(locale), `${slug}${suffix}`);
}

function isBlobNotFoundError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return message.includes('not found') || message.includes('404') || message.includes('no such');
}

function parseColumnBlobPath(locale: Locale, pathname: string): { slug: string; variant: ColumnVariant } | null {
  const prefix = `${COLUMN_BLOB_PREFIX}/${locale}/`;
  if (!pathname.startsWith(prefix)) return null;
  const name = pathname.slice(prefix.length);
  if (name.endsWith('.published.json')) {
    return { slug: name.slice(0, -'.published.json'.length), variant: 'published' };
  }
  if (name.endsWith('.json')) {
    return { slug: name.slice(0, -'.json'.length), variant: 'draft' };
  }
  return null;
}

function parseLocalColumnFilename(filename: string): { slug: string; variant: ColumnVariant } | null {
  if (filename.endsWith('.published.json')) {
    return { slug: filename.slice(0, -'.published.json'.length), variant: 'published' };
  }
  if (filename.endsWith('.json')) {
    return { slug: filename.slice(0, -'.json'.length), variant: 'draft' };
  }
  return null;
}

function normalizeColumnDocument(input: unknown, variant: ColumnVariant): ColumnDocument | null {
  const parsed = columnDocumentSchema.safeParse(input);
  if (!parsed.success) return null;
  if (parsed.data.draft !== (variant === 'draft')) return null;
  return parsed.data;
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function normalizeIsoDate(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function markdownToBasicHtml(markdown: string): string {
  const lines = markdown.split(/\r?\n/);
  const out: string[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    out.push(`<p>${escapeHtml(paragraph.join(' '))}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (list.length === 0) return;
    out.push(`<ul>${list.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`);
    list = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }
    if (line.startsWith('### ')) {
      flushParagraph();
      flushList();
      out.push(`<h3>${escapeHtml(line.slice(4).trim())}</h3>`);
      continue;
    }
    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      out.push(`<h2>${escapeHtml(line.slice(3).trim())}</h2>`);
      continue;
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      flushParagraph();
      list.push(line.slice(2).trim());
      continue;
    }
    flushList();
    paragraph.push(line.replace(/\*\*/g, ''));
  }

  flushParagraph();
  flushList();
  return out.join('\n') || '<p></p>';
}

function legacyPostToColumnDocument(post: ColumnPost & { locale: Locale }): ColumnDocument {
  const now = new Date().toISOString();
  const lastmod = normalizeIsoDate(post.date, now);
  return {
    version: 1,
    slug: post.slug,
    locale: post.locale,
    title: post.title,
    summary: post.summary,
    bodyMarkdown: post.content,
    bodyHtml: markdownToBasicHtml(post.content),
    linkedSlugs: {},
    frontmatter: {
      lastmod,
      attorneyReviewStatus: 'reviewed',
      freshness: 'fresh',
      category: post.category,
      blogCategory: post.category,
      tags: [post.categoryLabel].filter(Boolean),
      author: {
        name: post.locale === 'zh-hant' ? '曾俊瑋律師' : post.locale === 'en' ? 'Attorney Wei Tseng' : '증준외 변호사',
        title: post.locale === 'zh-hant' ? '台灣律師' : post.locale === 'en' ? 'Taiwan Attorney' : '대만 변호사',
      },
      featuredImage: post.featuredImage,
      featured: false,
      publishedAt: lastmod,
      seo: {
        title: post.title,
        description: post.summary,
        ogImage: post.featuredImage,
      },
    },
    draft: false,
    revision: 1,
    updatedAt: lastmod,
    updatedBy: 'legacy-column-import',
  };
}

function readLegacyColumnDocument(locale: Locale, slug: string): ColumnDocument | null {
  const legacy = getAllColumnPosts(locale).find((post) => post.slug === slug);
  return legacy ? legacyPostToColumnDocument({ ...legacy, locale }) : null;
}

function listLegacyColumnSlugs(locale: Locale): string[] {
  return getAllColumnPosts(locale).map((post) => post.slug);
}

async function readBlobColumn(locale: Locale, slug: string, variant: ColumnVariant): Promise<ColumnDocument | null> {
  try {
    const result = await get(buildColumnPathname(locale, slug, variant), {
      access: 'private',
      useCache: false,
    });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    const text = await new Response(result.stream).text();
    return normalizeColumnDocument(JSON.parse(text), variant);
  } catch (error) {
    if (isBlobNotFoundError(error)) return null;
    throw error;
  }
}

async function readLocalColumn(locale: Locale, slug: string, variant: ColumnVariant): Promise<ColumnDocument | null> {
  try {
    const text = await readFile(buildLocalColumnPath(locale, slug, variant), 'utf8');
    return normalizeColumnDocument(JSON.parse(text), variant);
  } catch (error) {
    if ((error as NodeJS.ErrnoException | undefined)?.code === 'ENOENT') return null;
    throw error;
  }
}

async function writeBlobColumn(doc: ColumnDocument, variant: ColumnVariant): Promise<void> {
  await put(
    buildColumnPathname(doc.locale, doc.slug, variant),
    JSON.stringify({ ...doc, draft: variant === 'draft' }, null, 2),
    {
      access: 'private',
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType: 'application/json; charset=utf-8',
    },
  );
}

async function writeLocalColumn(doc: ColumnDocument, variant: ColumnVariant): Promise<void> {
  const dir = getLocalColumnsDir(doc.locale);
  await mkdir(dir, { recursive: true, mode: 0o700 });
  await writeFile(
    buildLocalColumnPath(doc.locale, doc.slug, variant),
    JSON.stringify({ ...doc, draft: variant === 'draft' }, null, 2),
    { encoding: 'utf8', mode: 0o600 },
  );
}

async function deleteBlobColumn(locale: Locale, slug: string, variant: ColumnVariant): Promise<void> {
  try {
    await del(buildColumnPathname(locale, slug, variant));
  } catch (error) {
    if (isBlobNotFoundError(error)) return;
    throw error;
  }
}

async function deleteLocalColumn(locale: Locale, slug: string, variant: ColumnVariant): Promise<void> {
  try {
    await rm(buildLocalColumnPath(locale, slug, variant), { force: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException | undefined)?.code === 'ENOENT') return;
    throw error;
  }
}

async function listBlobSlugs(locale: Locale): Promise<string[]> {
  const result = await list({ prefix: `${COLUMN_BLOB_PREFIX}/${locale}/` });
  const slugs = new Set<string>();
  for (const blob of result.blobs) {
    const parsed = parseColumnBlobPath(locale, blob.pathname);
    if (parsed?.slug) slugs.add(parsed.slug);
  }
  return [...slugs];
}

async function listLocalSlugs(locale: Locale): Promise<string[]> {
  try {
    const entries = await readdir(getLocalColumnsDir(locale));
    const slugs = new Set<string>();
    for (const entry of entries) {
      const parsed = parseLocalColumnFilename(entry);
      if (parsed?.slug) slugs.add(parsed.slug);
    }
    return [...slugs];
  } catch (error) {
    if ((error as NodeJS.ErrnoException | undefined)?.code === 'ENOENT') return [];
    throw error;
  }
}

function toColumnListItem(bundle: ColumnDocumentBundle): ColumnListItem | null {
  const preferred = bundle.preferred;
  if (!preferred) return null;
  return {
    slug: bundle.slug,
    locale: bundle.locale,
    title: preferred.title,
    summary: preferred.summary,
    linkedSlugs: preferred.linkedSlugs as ColumnLinkedSlugs,
    frontmatter: preferred.frontmatter as ColumnFrontmatter,
    hasDraft: Boolean(bundle.draft),
    hasPublished: Boolean(bundle.published),
    draftRevision: bundle.draft?.revision ?? null,
    publishedRevision: bundle.published?.revision ?? null,
    updatedAt: preferred.updatedAt,
    publishedUpdatedAt: bundle.published?.updatedAt ?? null,
    preferredSource: bundle.draft ? 'draft' : 'published',
  };
}

export function getColumnsStorageBackend(): ColumnBackend {
  return getColumnBackend();
}

export async function readColumnVariant(
  locale: Locale,
  slug: string,
  variant: ColumnVariant,
): Promise<ColumnDocument | null> {
  const stored = getColumnBackend() === 'blob'
    ? readBlobColumn(locale, slug, variant)
    : readLocalColumn(locale, slug, variant);
  const document = await stored;
  if (document || variant === 'draft') return document;
  return readLegacyColumnDocument(locale, slug);
}

export async function readColumnBundle(locale: Locale, slug: string): Promise<ColumnDocumentBundle> {
  const backend = getColumnBackend();
  const [draft, published] = await Promise.all([
    readColumnVariant(locale, slug, 'draft'),
    readColumnVariant(locale, slug, 'published'),
  ]);
  return {
    slug,
    locale,
    draft,
    published: published ?? readLegacyColumnDocument(locale, slug),
    preferred: draft ?? published ?? readLegacyColumnDocument(locale, slug),
    backend,
  };
}

export async function listColumnBundles(locale: Locale): Promise<ColumnDocumentBundle[]> {
  const backend = getColumnBackend();
  const storedSlugs = backend === 'blob' ? await listBlobSlugs(locale) : await listLocalSlugs(locale);
  const slugs = unique([...storedSlugs, ...listLegacyColumnSlugs(locale)]);
  const bundles = await Promise.all(slugs.map((slug) => readColumnBundle(locale, slug)));
  return bundles
    .filter((bundle) => bundle.preferred)
    .sort((a, b) => (b.preferred?.updatedAt ?? '').localeCompare(a.preferred?.updatedAt ?? ''));
}

export async function listColumns(locale: Locale): Promise<ColumnListItem[]> {
  const bundles = await listColumnBundles(locale);
  return bundles
    .map(toColumnListItem)
    .filter((value): value is ColumnListItem => Boolean(value));
}

export async function writeDraftColumn(doc: ColumnDocument): Promise<ColumnDocument> {
  const normalized = columnDocumentSchema.parse({ ...doc, draft: true });
  if (getColumnBackend() === 'blob') {
    await writeBlobColumn(normalized, 'draft');
  } else {
    await writeLocalColumn(normalized, 'draft');
  }
  return normalized;
}

export async function writePublishedColumn(doc: ColumnDocument): Promise<ColumnDocument> {
  const normalized = columnDocumentSchema.parse({ ...doc, draft: false });
  if (getColumnBackend() === 'blob') {
    await writeBlobColumn(normalized, 'published');
  } else {
    await writeLocalColumn(normalized, 'published');
  }
  return normalized;
}

export async function deleteDraftColumn(locale: Locale, slug: string): Promise<void> {
  if (getColumnBackend() === 'blob') {
    await deleteBlobColumn(locale, slug, 'draft');
  } else {
    await deleteLocalColumn(locale, slug, 'draft');
  }
}
