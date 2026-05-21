/**
 * F100 — Client review tokens.
 *
 * Short-lived signed URLs that let an outside reviewer load a read-only
 * preview of a branch or page without going through the basic-auth gate.
 * Sessions are tracked on disk so we can list, expire, or revoke them.
 *
 * Wire format: <base64url(payload)>.<hmac-sha256(payload)>
 * Payload: { id, branchOrPageId, audienceRole, exp, createdBy }
 *
 * Backed by NEXTAUTH_SECRET (with a few fallbacks identical to the
 * bookings manage-token helper).
 */

import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

export type ReviewAudienceRole = 'client';

export interface ReviewSession {
  id: string;
  branchOrPageId: string;
  audienceRole: ReviewAudienceRole;
  expiresAt: string;
  createdBy: string;
  createdAt: string;
  revoked?: boolean;
}

interface ReviewSessionDocument {
  sessions: ReviewSession[];
}

interface ReviewTokenPayload {
  id: string;
  branchOrPageId: string;
  audienceRole: ReviewAudienceRole;
  exp: number;
  createdBy: string;
}

const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const FILE_NAME = 'review-sessions.json';

let storageRoot: string | null = null;
let writeQueue: Promise<void> = Promise.resolve();

function defaultStorageRoot(): string {
  return path.join(process.cwd(), 'runtime-data', 'security');
}

function root(): string {
  return storageRoot ?? defaultStorageRoot();
}

function filePath(): string {
  return path.join(root(), FILE_NAME);
}

export function __setReviewStorageRootForTests(value: string): void {
  storageRoot = value;
}

export function __resetReviewStorageRootForTests(): void {
  storageRoot = null;
}

function nowIso(): string {
  return new Date().toISOString();
}

function getSecret(): string {
  return process.env.BUILDER_REVIEW_SECRET
    || process.env.NEXTAUTH_SECRET
    || process.env.CMS_SESSION_SECRET
    || 'dev-builder-review-secret';
}

function sign(payloadPart: string): string {
  return createHmac('sha256', getSecret()).update(payloadPart).digest('base64url');
}

function base64Url(input: string | Buffer): string {
  return Buffer.from(input).toString('base64url');
}

function isReviewAudienceRole(value: unknown): value is ReviewAudienceRole {
  return value === 'client';
}

function isNotFoundError(error: unknown): boolean {
  return Boolean(
    error
      && typeof error === 'object'
      && (error as { code?: unknown }).code === 'ENOENT',
  );
}

async function loadDocument(): Promise<ReviewSessionDocument> {
  try {
    const raw = await readFile(filePath(), 'utf8');
    const parsed = JSON.parse(raw) as Partial<ReviewSessionDocument>;
    const sessions = Array.isArray(parsed.sessions) ? parsed.sessions : [];
    return {
      sessions: sessions
        .map((entry) => (entry && typeof entry === 'object' ? (entry as ReviewSession) : null))
        .filter((entry): entry is ReviewSession => Boolean(entry?.id)),
    };
  } catch (error) {
    if (isNotFoundError(error)) return { sessions: [] };
    throw error;
  }
}

async function persistDocument(doc: ReviewSessionDocument): Promise<void> {
  await mkdir(root(), { recursive: true, mode: 0o700 });
  await writeFile(filePath(), JSON.stringify(doc, null, 2), { mode: 0o600 });
}

async function withWriteLock<T>(task: () => Promise<T>): Promise<T> {
  const previous = writeQueue;
  let release!: () => void;
  writeQueue = new Promise<void>((resolve) => {
    release = resolve;
  });
  await previous.catch(() => undefined);
  try {
    return await task();
  } finally {
    release();
  }
}

export interface CreateReviewSessionInput {
  branchOrPageId: string;
  audienceRole?: ReviewAudienceRole;
  createdBy: string;
  ttlMs?: number;
}

export interface CreatedReviewSession {
  session: ReviewSession;
  token: string;
  url: string;
}

export async function createReviewSession(
  input: CreateReviewSessionInput,
): Promise<CreatedReviewSession> {
  const branchOrPageId = input.branchOrPageId.trim();
  if (!branchOrPageId) throw new Error('branchOrPageId is required.');
  const audienceRole: ReviewAudienceRole = input.audienceRole ?? 'client';
  const createdBy = input.createdBy.trim() || 'system';
  const ttlMs = Math.max(1000 * 60, input.ttlMs ?? DEFAULT_TTL_MS);
  const id = `rev-${Date.now().toString(36)}-${randomUUID().slice(0, 8)}`;
  const createdAt = nowIso();
  const expiresAtMs = Date.now() + ttlMs;
  const session: ReviewSession = {
    id,
    branchOrPageId,
    audienceRole,
    expiresAt: new Date(expiresAtMs).toISOString(),
    createdBy,
    createdAt,
  };
  await withWriteLock(async () => {
    const doc = await loadDocument();
    await persistDocument({ sessions: [...doc.sessions, session] });
  });
  const payload: ReviewTokenPayload = {
    id: session.id,
    branchOrPageId,
    audienceRole,
    exp: expiresAtMs,
    createdBy,
  };
  const payloadPart = base64Url(JSON.stringify(payload));
  const token = `${payloadPart}.${sign(payloadPart)}`;
  const baseUrl = (process.env.SITE_URL
    || process.env.NEXT_PUBLIC_SITE_URL
    || 'http://localhost:3000').replace(/\/+$/, '');
  const url = `${baseUrl}/review/${encodeURIComponent(token)}`;
  return { session, token, url };
}

export interface VerifiedReviewToken {
  id: string;
  branchOrPageId: string;
  audienceRole: ReviewAudienceRole;
  createdBy: string;
  expiresAt: string;
}

export async function verifyReviewToken(token: string): Promise<VerifiedReviewToken | null> {
  const [payloadPart, signature] = token.split('.');
  if (!payloadPart || !signature) return null;
  const expected = sign(payloadPart);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  if (
    expectedBuffer.length !== signatureBuffer.length
    || !timingSafeEqual(expectedBuffer, signatureBuffer)
  ) return null;

  let payload: Partial<ReviewTokenPayload>;
  try {
    payload = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
  if (
    !payload.id
    || !payload.branchOrPageId
    || !payload.exp
    || !isReviewAudienceRole(payload.audienceRole)
    || payload.exp < Date.now()
  ) return null;

  const doc = await loadDocument();
  const session = doc.sessions.find((entry) => entry.id === payload.id);
  if (!session) return null;
  if (session.revoked) return null;
  if (Date.parse(session.expiresAt) < Date.now()) return null;

  return {
    id: session.id,
    branchOrPageId: session.branchOrPageId,
    audienceRole: session.audienceRole,
    createdBy: session.createdBy,
    expiresAt: session.expiresAt,
  };
}

export async function listReviewSessions(): Promise<ReviewSession[]> {
  const doc = await loadDocument();
  return [...doc.sessions].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function revokeReviewSession(id: string): Promise<boolean> {
  return withWriteLock(async () => {
    const doc = await loadDocument();
    const index = doc.sessions.findIndex((entry) => entry.id === id);
    if (index === -1) return false;
    const sessions = [...doc.sessions];
    sessions[index] = { ...sessions[index], revoked: true };
    await persistDocument({ sessions });
    return true;
  });
}