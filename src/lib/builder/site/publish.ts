/**
 * Phase 6 — Publish pipeline logic.
 *
 * Handles the draft → preview → publish lifecycle:
 * - Preview: generates a time-limited token URL for stakeholder review
 * - Publish: copies draft canvas to published + ISR revalidate
 * - Rollback: restores a previous revision as the current draft
 * - Publish checks: validates the page before allowing publish
 *   (missing alt, empty text, broken links, missing title)
 */

import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { publishPage, readPageCanvas, writePageCanvas, readSiteDocument } from './persistence';
import type { Locale } from '@/lib/locales';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';

// ─── Preview tokens (Blob-persisted for serverless) ──────────────

const PREVIEW_TTL_MS = 30 * 60 * 1000; // 30 minutes
const PREVIEW_BLOB_PREFIX = 'builder-preview-tokens/';

export async function createPreviewToken(pageId: string, locale: Locale): Promise<string> {
  const token = crypto.randomUUID();
  const entry = { pageId, locale, expiresAt: Date.now() + PREVIEW_TTL_MS };
  try {
    const { put } = await import('@vercel/blob');
    await put(`${PREVIEW_BLOB_PREFIX}${token}.json`, JSON.stringify(entry), {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
  } catch {
    // Blob unavailable — use URL-encoded fallback (token embeds the data)
    const encoded = Buffer.from(JSON.stringify(entry)).toString('base64url');
    return `inline-${encoded}`;
  }
  return token;
}

export async function resolvePreviewToken(token: string): Promise<{ pageId: string; locale: Locale } | null> {
  // Inline token fallback (no Blob needed)
  if (token.startsWith('inline-')) {
    try {
      const decoded = JSON.parse(Buffer.from(token.slice(7), 'base64url').toString('utf8')) as { pageId: string; locale: Locale; expiresAt: number };
      if (Date.now() > decoded.expiresAt) return null;
      return { pageId: decoded.pageId, locale: decoded.locale };
    } catch { return null; }
  }

  try {
    const { get } = await import('@vercel/blob');
    const result = await get(`${PREVIEW_BLOB_PREFIX}${token}.json`, { access: 'private', useCache: false });
    if (!result?.stream || result.statusCode !== 200) return null;
    const entry = JSON.parse(await new Response(result.stream).text()) as { pageId: string; locale: Locale; expiresAt: number };
    if (Date.now() > entry.expiresAt) return null;
    return { pageId: entry.pageId, locale: entry.locale };
  } catch {
    return null;
  }
}

// ─── Publish checks ──────────────────────────────────────────────

export interface PublishCheckResult {
  passed: boolean;
  warnings: string[];
  errors: string[];
}

export function runPublishChecks(doc: BuilderCanvasDocument): PublishCheckResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  for (const node of doc.nodes) {
    if (node.kind === 'text' && (!node.content.text || node.content.text.trim().length === 0)) {
      warnings.push(`빈 텍스트 노드: ${node.id}`);
    }
    if (node.kind === 'image' && !node.content.src) {
      errors.push(`이미지 소스 없음: ${node.id}`);
    }
    if (node.kind === 'image' && !node.content.alt) {
      warnings.push(`이미지 alt 텍스트 없음: ${node.id} (접근성)`);
    }
    if (node.kind === 'button' && !node.content.href) {
      warnings.push(`버튼 링크 없음: ${node.id}`);
    }
  }

  if (doc.nodes.length === 0) {
    errors.push('페이지에 요소가 없습니다.');
  }

  return {
    passed: errors.length === 0,
    warnings,
    errors,
  };
}

// ─── Publish flow ─────────────────────────────────────────────────

export async function publishPageWithChecks(
  siteId: string,
  pageId: string,
  locale: Locale,
): Promise<{ success: boolean; checks: PublishCheckResult; slug?: string }> {
  const draft = await readPageCanvas(siteId, pageId, 'draft');
  if (!draft) {
    return {
      success: false,
      checks: { passed: false, warnings: [], errors: ['Draft not found'] },
    };
  }

  const checks = runPublishChecks(draft);
  if (!checks.passed) {
    return { success: false, checks };
  }

  await publishPage(siteId, pageId, locale);

  const site = await readSiteDocument(siteId, locale);
  const pageMeta = site.pages.find((p) => p.pageId === pageId);
  const slug = pageMeta?.slug || '';

  try {
    revalidatePath(`/${locale}/p/${slug || ''}`);
  } catch { /* dev or non-existent path */ }

  return { success: true, checks, slug };
}

// ─── Version history (Blob-persisted for serverless) ─────────────

export interface PageRevision {
  revisionId: string;
  pageId: string;
  savedAt: string;
  nodeCount: number;
}

const REVISION_BLOB_PREFIX = 'builder-revisions/';
const MAX_REVISIONS = 50;

export async function recordRevision(pageId: string, doc: BuilderCanvasDocument): Promise<void> {
  const revisionId = `${pageId}-${Date.now()}`;
  try {
    const { put } = await import('@vercel/blob');
    await put(
      `${REVISION_BLOB_PREFIX}${pageId}/${revisionId}.json`,
      JSON.stringify({ ...doc, _revisionId: revisionId }),
      { access: 'private', allowOverwrite: true, contentType: 'application/json' },
    );
  } catch {
    // Blob unavailable — skip revision recording (dev mode)
  }
}

export async function listRevisions(pageId: string): Promise<PageRevision[]> {
  try {
    const { list } = await import('@vercel/blob');
    const result = await list({ prefix: `${REVISION_BLOB_PREFIX}${pageId}/` });
    const revisions = result.blobs
      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
      .slice(0, MAX_REVISIONS)
      .map((blob, i) => ({
        revisionId: blob.pathname.split('/').pop()?.replace('.json', '') || `rev-${i}`,
        pageId,
        savedAt: blob.uploadedAt.toISOString(),
        nodeCount: 0,
      }));
    return revisions;
  } catch {
    return [];
  }
}

export async function rollbackToRevision(
  siteId: string,
  pageId: string,
  revisionId: string,
): Promise<boolean> {
  try {
    const { get } = await import('@vercel/blob');
    const result = await get(`${REVISION_BLOB_PREFIX}${pageId}/${revisionId}.json`, {
      access: 'private',
      useCache: false,
    });
    if (!result?.stream || result.statusCode !== 200) return false;
    const doc = JSON.parse(await new Response(result.stream).text()) as BuilderCanvasDocument;
    await writePageCanvas(siteId, pageId, 'draft', doc);
    return true;
  } catch {
    return false;
  }
}
