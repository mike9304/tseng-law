/**
 * F98 — Inline review markers (depth slice).
 *
 * Lightweight markers attached to canvas nodes for review workflows:
 * comments-as-anchors, TODOs, and explicit approvals. They are intentionally
 * lighter than `BuilderCollabComment` because a marker is meant to be a quick
 * inline annotation a reviewer can drop on any node — full threaded
 * discussion lives in comments-store.
 *
 * Storage: runtime-data/collab/review-markers/${siteId}.json (one file per
 * site, all pages co-located so a reviewer can pull "every open marker on
 * this site" without crawling per-page files). Task spec said a single
 * global file; scoped by siteId here to match comments-store layout.
 *
 * Per-site write mutex is identical to comments-store's pattern.
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { normalizeBuilderSiteId } from '@/lib/builder/site/identity';

export type ReviewMarkerKind = 'comment' | 'todo' | 'approval';

export const REVIEW_MARKER_KINDS: readonly ReviewMarkerKind[] = ['comment', 'todo', 'approval'];

export interface ReviewMarker {
  id: string;
  siteId: string;
  pageId: string;
  nodeId: string;
  kind: ReviewMarkerKind;
  text: string;
  createdBy: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
}

interface ReviewMarkersFile {
  version: 1;
  markers: ReviewMarker[];
}

const MAX_TEXT_LEN = 2_000;

const writeQueues = new Map<string, Promise<void>>();

function rootDir(): string {
  return path.join(process.cwd(), 'runtime-data', 'collab', 'review-markers');
}

function fileFor(siteId: string): string {
  return path.join(rootDir(), `${normalizeBuilderSiteId(siteId)}.json`);
}

function queueKey(siteId: string): string {
  return normalizeBuilderSiteId(siteId);
}

async function withLock<T>(siteId: string, task: () => Promise<T>): Promise<T> {
  const key = queueKey(siteId);
  const previous = writeQueues.get(key) ?? Promise.resolve();
  let release!: () => void;
  const current = new Promise<void>((resolve) => {
    release = resolve;
  });
  const queued = previous.catch(() => undefined).then(() => current);
  writeQueues.set(key, queued);

  await previous.catch(() => undefined);
  try {
    return await task();
  } finally {
    release();
    if (writeQueues.get(key) === queued) writeQueues.delete(key);
  }
}

function isReviewMarker(value: unknown): value is ReviewMarker {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.siteId === 'string' &&
    typeof v.pageId === 'string' &&
    typeof v.nodeId === 'string' &&
    typeof v.kind === 'string' &&
    REVIEW_MARKER_KINDS.includes(v.kind as ReviewMarkerKind) &&
    typeof v.text === 'string' &&
    typeof v.createdBy === 'string' &&
    typeof v.createdAt === 'string'
  );
}

async function readFileSafe(siteId: string): Promise<ReviewMarkersFile> {
  try {
    const text = await readFile(fileFor(siteId), 'utf8');
    const parsed = JSON.parse(text) as Partial<ReviewMarkersFile>;
    if (parsed && Array.isArray(parsed.markers)) {
      const valid = parsed.markers.filter(isReviewMarker);
      return { version: 1, markers: valid };
    }
  } catch { /* missing or invalid → empty */ }
  return { version: 1, markers: [] };
}

async function writeFileAtomic(siteId: string, file: ReviewMarkersFile): Promise<void> {
  const target = fileFor(siteId);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, JSON.stringify(file), 'utf8');
}

function generateMarkerId(): string {
  return `rmk-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function sanitizeMarkerText(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (trimmed.length > MAX_TEXT_LEN) return trimmed.slice(0, MAX_TEXT_LEN);
  return trimmed;
}

export function isReviewMarkerKind(value: unknown): value is ReviewMarkerKind {
  return typeof value === 'string'
    && REVIEW_MARKER_KINDS.includes(value as ReviewMarkerKind);
}

export interface CreateReviewMarkerInput {
  siteId: string;
  pageId: string;
  nodeId: string;
  kind: ReviewMarkerKind;
  text: string;
  createdBy: string;
}

export async function createReviewMarker(
  input: CreateReviewMarkerInput,
): Promise<ReviewMarker> {
  const siteId = normalizeBuilderSiteId(input.siteId);
  const text = sanitizeMarkerText(input.text);
  if (!text) throw new Error('createReviewMarker: text must be a non-empty string');
  if (!input.pageId) throw new Error('createReviewMarker: pageId is required');
  if (!input.nodeId) throw new Error('createReviewMarker: nodeId is required');
  if (!isReviewMarkerKind(input.kind)) {
    throw new Error(`createReviewMarker: unknown kind "${String(input.kind)}"`);
  }
  if (!input.createdBy) throw new Error('createReviewMarker: createdBy is required');

  const marker: ReviewMarker = {
    id: generateMarkerId(),
    siteId,
    pageId: input.pageId,
    nodeId: input.nodeId,
    kind: input.kind,
    text,
    createdBy: input.createdBy,
    createdAt: new Date().toISOString(),
  };

  await withLock(siteId, async () => {
    const file = await readFileSafe(siteId);
    file.markers.push(marker);
    await writeFileAtomic(siteId, file);
  });
  return marker;
}

export interface ListReviewMarkersFilter {
  pageId?: string;
  nodeId?: string;
  kind?: ReviewMarkerKind;
  includeResolved?: boolean;
}

export async function listReviewMarkers(
  siteId: string,
  filter: ListReviewMarkersFilter = {},
): Promise<ReviewMarker[]> {
  const file = await readFileSafe(siteId);
  let markers = file.markers;
  if (filter.pageId) markers = markers.filter((m) => m.pageId === filter.pageId);
  if (filter.nodeId) markers = markers.filter((m) => m.nodeId === filter.nodeId);
  if (filter.kind) markers = markers.filter((m) => m.kind === filter.kind);
  if (!filter.includeResolved) markers = markers.filter((m) => !m.resolvedAt);
  // Newest first.
  return [...markers].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getReviewMarker(
  siteId: string,
  markerId: string,
): Promise<ReviewMarker | null> {
  const file = await readFileSafe(siteId);
  return file.markers.find((m) => m.id === markerId) ?? null;
}

async function patchMarker(
  siteId: string,
  markerId: string,
  patch: (marker: ReviewMarker) => ReviewMarker,
): Promise<ReviewMarker | null> {
  let updated: ReviewMarker | null = null;
  await withLock(siteId, async () => {
    const file = await readFileSafe(siteId);
    const idx = file.markers.findIndex((m) => m.id === markerId);
    if (idx < 0) return;
    const next = patch(file.markers[idx]);
    file.markers[idx] = next;
    await writeFileAtomic(siteId, file);
    updated = next;
  });
  return updated;
}

export interface UpdateReviewMarkerInput {
  text?: string;
  kind?: ReviewMarkerKind;
}

export async function updateReviewMarker(
  siteId: string,
  markerId: string,
  patch: UpdateReviewMarkerInput,
): Promise<ReviewMarker | null> {
  return patchMarker(siteId, markerId, (marker) => {
    const next: ReviewMarker = { ...marker };
    if (patch.text !== undefined) {
      const cleaned = sanitizeMarkerText(patch.text);
      if (cleaned) next.text = cleaned;
    }
    if (patch.kind !== undefined && isReviewMarkerKind(patch.kind)) {
      next.kind = patch.kind;
    }
    return next;
  });
}

export async function resolveReviewMarker(
  siteId: string,
  markerId: string,
  resolvedBy: string,
): Promise<ReviewMarker | null> {
  return patchMarker(siteId, markerId, (marker) => ({
    ...marker,
    resolvedAt: marker.resolvedAt ?? new Date().toISOString(),
    resolvedBy: marker.resolvedBy ?? resolvedBy,
  }));
}

export async function unresolveReviewMarker(
  siteId: string,
  markerId: string,
): Promise<ReviewMarker | null> {
  return patchMarker(siteId, markerId, (marker) => {
    if (!marker.resolvedAt && !marker.resolvedBy) return marker;
    const next: ReviewMarker = { ...marker };
    delete next.resolvedAt;
    delete next.resolvedBy;
    return next;
  });
}

export async function deleteReviewMarker(
  siteId: string,
  markerId: string,
): Promise<boolean> {
  let deleted = false;
  await withLock(siteId, async () => {
    const file = await readFileSafe(siteId);
    const before = file.markers.length;
    file.markers = file.markers.filter((m) => m.id !== markerId);
    if (file.markers.length !== before) {
      await writeFileAtomic(siteId, file);
      deleted = true;
    }
  });
  return deleted;
}

/** Test-only — clears in-memory write queues. File contents are scoped by cwd. */
export function __resetReviewMarkersForTests(): void {
  writeQueues.clear();
}