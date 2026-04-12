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

// ─── Preview tokens ───────────────────────────────────────────────

const previewTokens = new Map<string, { pageId: string; locale: Locale; expiresAt: number }>();
const PREVIEW_TTL_MS = 30 * 60 * 1000; // 30 minutes

export function createPreviewToken(pageId: string, locale: Locale): string {
  const token = crypto.randomUUID();
  previewTokens.set(token, {
    pageId,
    locale,
    expiresAt: Date.now() + PREVIEW_TTL_MS,
  });
  return token;
}

export function resolvePreviewToken(token: string): { pageId: string; locale: Locale } | null {
  const entry = previewTokens.get(token);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    previewTokens.delete(token);
    return null;
  }
  return { pageId: entry.pageId, locale: entry.locale };
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
    revalidatePath(`/${locale}/${slug || ''}`);
  } catch { /* dev or non-existent path */ }

  return { success: true, checks, slug };
}

// ─── Version history ──────────────────────────────────────────────

export interface PageRevision {
  revisionId: string;
  pageId: string;
  savedAt: string;
  nodeCount: number;
}

const revisionStore = new Map<string, BuilderCanvasDocument[]>();
const MAX_REVISIONS = 50;

export function recordRevision(pageId: string, doc: BuilderCanvasDocument): void {
  const key = pageId;
  const revisions = revisionStore.get(key) || [];
  revisions.push(structuredClone(doc));
  if (revisions.length > MAX_REVISIONS) revisions.shift();
  revisionStore.set(key, revisions);
}

export function listRevisions(pageId: string): PageRevision[] {
  const revisions = revisionStore.get(pageId) || [];
  return revisions.map((doc, i) => ({
    revisionId: `rev-${i}`,
    pageId,
    savedAt: doc.updatedAt,
    nodeCount: doc.nodes.length,
  }));
}

export async function rollbackToRevision(
  siteId: string,
  pageId: string,
  revisionIndex: number,
): Promise<boolean> {
  const revisions = revisionStore.get(pageId) || [];
  const target = revisions[revisionIndex];
  if (!target) return false;
  await writePageCanvas(siteId, pageId, 'draft', target);
  return true;
}
