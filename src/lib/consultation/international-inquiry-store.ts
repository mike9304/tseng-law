import { createHash, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { constants as fsConstants, type Stats } from 'node:fs';
import {
  chmod,
  lstat,
  link,
  mkdir,
  open,
  realpath,
  unlink,
  type FileHandle,
} from 'node:fs/promises';
import path from 'node:path';
import {
  BlobNotFoundError,
  BlobPreconditionFailedError,
  get as blobGet,
  put as blobPut,
} from '@vercel/blob';
import { z } from 'zod';
import { inquiryLanguageSchema } from './intake-language-contract';

/**
 * Durable raw international-inquiry repository (G2).
 *
 * This module is storage only: it is not an HTTP route and must never be
 * mounted as an unauthenticated lookup/status API. Record identifiers are
 * unguessable UUIDs but are still not authentication.
 */

const SCHEMA_VERSION = 1 as const;
const HEX64 = /^[a-f0-9]{64}$/;
const ISO_INSTANT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const MAX_RECORD_BYTES = 80_000;
const BLOB_PREFIX = 'international-inquiries';
const UNAVAILABLE_MESSAGE = 'International inquiry storage is unavailable';
const INVALID_INPUT_MESSAGE = 'International inquiry input is invalid';
const NOT_FOUND_MESSAGE = 'International inquiry was not found';

const EXCL_WRITE_FLAGS =
  fsConstants.O_WRONLY
  | fsConstants.O_CREAT
  | fsConstants.O_EXCL
  | (typeof fsConstants.O_NOFOLLOW === 'number' ? fsConstants.O_NOFOLLOW : 0);

const READ_FLAGS =
  fsConstants.O_RDONLY
  | (typeof fsConstants.O_NOFOLLOW === 'number' ? fsConstants.O_NOFOLLOW : 0);

const DIR_READ_FLAGS =
  fsConstants.O_RDONLY
  | (typeof fsConstants.O_NOFOLLOW === 'number' ? fsConstants.O_NOFOLLOW : 0)
  | (typeof fsConstants.O_DIRECTORY === 'number' ? fsConstants.O_DIRECTORY : 0);

export const internationalInquiryInputSchema = inquiryLanguageSchema
  .extend({
    requestId: z.string().trim().uuid(),
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().min(3).max(254).email(),
  })
  .strict();

const storedPayloadSchema = inquiryLanguageSchema
  .extend({
    requestId: z.string().uuid(),
    name: z.string().min(1).max(120),
    email: z.string().min(3).max(254).email(),
  })
  .strict();

const inquiryRecordSchema = z
  .object({
    schemaVersion: z.literal(SCHEMA_VERSION),
    intakeId: z.string().uuid(),
    receivedAt: z.string().regex(ISO_INSTANT),
    payload: storedPayloadSchema,
    payloadSha256: z.string().regex(HEX64),
  })
  .strict();

const notifiedReceiptSchema = z
  .object({
    schemaVersion: z.literal(SCHEMA_VERSION),
    kind: z.literal('notified'),
    requestKey: z.string().regex(HEX64),
    intakeId: z.string().uuid(),
    payloadSha256: z.string().regex(HEX64),
    notifiedAt: z.string().regex(ISO_INSTANT),
  })
  .strict();

export type InternationalInquiryInput = z.infer<typeof internationalInquiryInputSchema>;
export type InternationalInquiryPayload = z.infer<typeof storedPayloadSchema>;
export type InternationalInquiryRecord = z.infer<typeof inquiryRecordSchema>;
export type InternationalInquiryNotification = 'pending' | 'sent';

export type InternationalInquiryCreateOutcome =
  | {
      kind: 'created' | 'existing';
      record: InternationalInquiryRecord;
      notification: InternationalInquiryNotification;
    }
  | { kind: 'conflict' };

export type InternationalInquiryReadResult = {
  record: InternationalInquiryRecord;
  notification: InternationalInquiryNotification;
};

type ObjectKind = 'raw' | 'notify';
type Backend =
  | { type: 'blob'; token: string }
  | { type: 'local'; root: string };

export class InternationalInquiryStorageUnavailableError extends Error {
  readonly code = 'storage_unavailable' as const;

  constructor() {
    super(UNAVAILABLE_MESSAGE);
    this.name = 'InternationalInquiryStorageUnavailableError';
  }
}

export class InternationalInquiryInvalidInputError extends Error {
  readonly code = 'invalid_input' as const;

  constructor() {
    super(INVALID_INPUT_MESSAGE);
    this.name = 'InternationalInquiryInvalidInputError';
  }
}

export class InternationalInquiryNotFoundError extends Error {
  readonly code = 'not_found' as const;

  constructor() {
    super(NOT_FOUND_MESSAGE);
    this.name = 'InternationalInquiryNotFoundError';
  }
}

function storageUnavailable(): InternationalInquiryStorageUnavailableError {
  return new InternationalInquiryStorageUnavailableError();
}

function invalidInput(): InternationalInquiryInvalidInputError {
  return new InternationalInquiryInvalidInputError();
}

function notFound(): InternationalInquiryNotFoundError {
  return new InternationalInquiryNotFoundError();
}

function isControlledError(error: unknown): boolean {
  return (
    error instanceof InternationalInquiryStorageUnavailableError
    || error instanceof InternationalInquiryInvalidInputError
    || error instanceof InternationalInquiryNotFoundError
  );
}

function rethrowControlledOrUnavailable(error: unknown): never {
  if (isControlledError(error)) throw error;
  throw storageUnavailable();
}

function errorCode(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') return undefined;
  const code = (error as { code?: unknown }).code;
  return typeof code === 'string' ? code : undefined;
}

function isEnoent(error: unknown): boolean {
  return errorCode(error) === 'ENOENT';
}

function isEexist(error: unknown): boolean {
  return errorCode(error) === 'EEXIST';
}

function isFailClosedProductionRuntime(): boolean {
  const vercel = process.env.VERCEL?.trim();
  const vercelUrl = process.env.VERCEL_URL?.trim();
  return Boolean(vercel || vercelUrl);
}

function configuredLocalRoot(): string {
  const explicit = process.env.INTERNATIONAL_INQUIRY_DIR;
  if (explicit !== undefined) {
    const trimmed = explicit.trim();
    if (trimmed.length === 0) throw storageUnavailable();
    return path.resolve(trimmed);
  }
  return path.resolve(process.cwd(), 'runtime-data', 'international-inquiries');
}

function isInsideRoot(root: string, candidate: string): boolean {
  const rel = path.relative(root, candidate);
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

function assertInsideRoot(root: string, candidate: string): string {
  const resolvedRoot = path.resolve(root);
  const resolvedCandidate = path.resolve(candidate);
  if (!isInsideRoot(resolvedRoot, resolvedCandidate)) throw storageUnavailable();
  return resolvedCandidate;
}

function requestKeyFromId(requestId: string): string {
  return createHash('sha256').update(requestId, 'utf8').digest('hex');
}

function canonicalPayload(payload: InternationalInquiryPayload): InternationalInquiryPayload {
  return {
    requestId: payload.requestId,
    name: payload.name,
    email: payload.email,
    uiLocale: payload.uiLocale,
    originalLanguage: payload.originalLanguage,
    preferredConsultationLanguage: payload.preferredConsultationLanguage,
    originalText: payload.originalText,
    consent: payload.consent,
  };
}

function payloadSha256(payload: InternationalInquiryPayload): string {
  return createHash('sha256')
    .update(JSON.stringify(canonicalPayload(payload)), 'utf8')
    .digest('hex');
}

function equalDigest(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  try {
    return timingSafeEqual(Buffer.from(left, 'utf8'), Buffer.from(right, 'utf8'));
  } catch {
    return false;
  }
}

function parseInput(input: unknown): InternationalInquiryPayload {
  const parsed = internationalInquiryInputSchema.safeParse(input);
  if (!parsed.success) throw invalidInput();
  return canonicalPayload({
    ...parsed.data,
    requestId: parsed.data.requestId.toLowerCase(),
  });
}

function parseRequestId(requestId: unknown): string {
  const parsed = z.string().trim().uuid().safeParse(requestId);
  if (!parsed.success) throw invalidInput();
  return parsed.data.toLowerCase();
}

function serializeRecord(record: InternationalInquiryRecord): string {
  return JSON.stringify({
    schemaVersion: SCHEMA_VERSION,
    intakeId: record.intakeId,
    receivedAt: record.receivedAt,
    payload: canonicalPayload(record.payload),
    payloadSha256: record.payloadSha256,
  });
}

function serializeReceipt(receipt: z.infer<typeof notifiedReceiptSchema>): string {
  return JSON.stringify({
    schemaVersion: SCHEMA_VERSION,
    kind: 'notified',
    requestKey: receipt.requestKey,
    intakeId: receipt.intakeId,
    payloadSha256: receipt.payloadSha256,
    notifiedAt: receipt.notifiedAt,
  });
}

function parseStoredRecord(raw: string, requestKey: string): InternationalInquiryRecord {
  if (raw.length > MAX_RECORD_BYTES) throw storageUnavailable();
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    throw storageUnavailable();
  }
  const record = inquiryRecordSchema.safeParse(parsed);
  if (!record.success) throw storageUnavailable();
  const digest = payloadSha256(record.data.payload);
  if (!equalDigest(record.data.payloadSha256, digest)) throw storageUnavailable();
  if (requestKeyFromId(record.data.payload.requestId) !== requestKey) {
    throw storageUnavailable();
  }
  return record.data;
}

function parseStoredReceipt(
  raw: string,
  requestKey: string,
  record: InternationalInquiryRecord,
): void {
  if (raw.length > MAX_RECORD_BYTES) throw storageUnavailable();
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    throw storageUnavailable();
  }
  const receipt = notifiedReceiptSchema.safeParse(parsed);
  if (!receipt.success) throw storageUnavailable();
  if (
    !equalDigest(receipt.data.requestKey, requestKey)
    || !equalDigest(receipt.data.payloadSha256, record.payloadSha256)
    || receipt.data.intakeId !== record.intakeId
  ) {
    throw storageUnavailable();
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

function newRecord(payload: InternationalInquiryPayload): InternationalInquiryRecord {
  const digest = payloadSha256(payload);
  return {
    schemaVersion: SCHEMA_VERSION,
    intakeId: randomUUID(),
    receivedAt: nowIso(),
    payload,
    payloadSha256: digest,
  };
}

function newReceipt(record: InternationalInquiryRecord, requestKey: string) {
  return {
    schemaVersion: SCHEMA_VERSION,
    kind: 'notified' as const,
    requestKey,
    intakeId: record.intakeId,
    payloadSha256: record.payloadSha256,
    notifiedAt: nowIso(),
  };
}

function blobPathname(kind: ObjectKind, requestKey: string): string {
  if (!HEX64.test(requestKey)) throw storageUnavailable();
  return `${BLOB_PREFIX}/${kind}/${requestKey}.json`;
}

async function resolveLocalRoot(): Promise<string> {
  const configured = configuredLocalRoot();
  try {
    const stats = await lstat(configured);
    if (stats.isSymbolicLink() || !stats.isDirectory()) throw storageUnavailable();
  } catch (error) {
    if (!isEnoent(error)) rethrowControlledOrUnavailable(error);
    try {
      await mkdir(configured, { recursive: true, mode: 0o700 });
    } catch (mkdirError) {
      rethrowControlledOrUnavailable(mkdirError);
    }
    try {
      const created = await lstat(configured);
      if (created.isSymbolicLink() || !created.isDirectory()) throw storageUnavailable();
    } catch (statError) {
      rethrowControlledOrUnavailable(statError);
    }
  }
  try {
    await chmod(configured, 0o700);
  } catch (error) {
    rethrowControlledOrUnavailable(error);
  }
  let real: string;
  try {
    real = await realpath(configured);
  } catch (error) {
    rethrowControlledOrUnavailable(error);
  }
  return real;
}

async function ensureOwnedDirectory(root: string, relative: string): Promise<string> {
  const dir = assertInsideRoot(root, path.join(root, relative));
  try {
    const stats = await lstat(dir);
    if (stats.isSymbolicLink() || !stats.isDirectory()) throw storageUnavailable();
  } catch (error) {
    if (!isEnoent(error)) rethrowControlledOrUnavailable(error);
    try {
      await mkdir(dir, { recursive: true, mode: 0o700 });
    } catch (mkdirError) {
      rethrowControlledOrUnavailable(mkdirError);
    }
    try {
      const created = await lstat(dir);
      if (created.isSymbolicLink() || !created.isDirectory()) throw storageUnavailable();
    } catch (statError) {
      rethrowControlledOrUnavailable(statError);
    }
  }
  try {
    await chmod(dir, 0o700);
    const real = await realpath(dir);
    if (!isInsideRoot(root, real)) throw storageUnavailable();
    return dir;
  } catch (error) {
    rethrowControlledOrUnavailable(error);
  }
}

async function assertRegularFile(file: string): Promise<Stats> {
  let stats: Stats;
  try {
    stats = await lstat(file);
  } catch (error) {
    if (isEnoent(error)) throw error;
    throw storageUnavailable();
  }
  if (stats.isSymbolicLink() || !stats.isFile()) throw storageUnavailable();
  if (stats.size > MAX_RECORD_BYTES) throw storageUnavailable();
  return stats;
}

async function assertExistingOwnedDirectory(root: string, dir: string): Promise<string> {
  const candidate = assertInsideRoot(root, dir);
  let stats: Stats;
  try {
    stats = await lstat(candidate);
  } catch (error) {
    if (isEnoent(error)) throw error;
    throw storageUnavailable();
  }
  if (stats.isSymbolicLink() || !stats.isDirectory()) throw storageUnavailable();
  let real: string;
  try {
    real = await realpath(candidate);
  } catch (error) {
    rethrowControlledOrUnavailable(error);
  }
  if (!isInsideRoot(root, real)) throw storageUnavailable();
  return candidate;
}

async function fsyncDirectory(dir: string): Promise<void> {
  const handle = await open(dir, DIR_READ_FLAGS);
  try {
    await handle.sync();
  } finally {
    await handle.close();
  }
}

async function confirmExistingPublishedObject(
  root: string,
  directory: string,
  target: string,
): Promise<void> {
  await assertExistingOwnedDirectory(root, directory);
  await assertRegularFile(target);
  await fsyncDirectory(directory);
}

async function closeQuietly(handle: FileHandle | null): Promise<void> {
  if (!handle) return;
  try {
    await handle.close();
  } catch {
    // The caller already has a more specific error or a committed result.
  }
}

async function unlinkQuietly(file: string): Promise<void> {
  try {
    await unlink(file);
  } catch (error) {
    if (!isEnoent(error)) {
      // Residue in tmp/ is recoverable; do not surface user content.
    }
  }
}

async function exclusivePublishLocal(
  root: string,
  kind: ObjectKind,
  requestKey: string,
  body: string,
): Promise<'created' | 'exists'> {
  const directory = await ensureOwnedDirectory(root, kind);
  const tmpDir = await ensureOwnedDirectory(root, 'tmp');
  const target = assertInsideRoot(root, path.join(directory, `${requestKey}.json`));
  const temp = assertInsideRoot(root, path.join(tmpDir, `${randomBytes(16).toString('hex')}.tmp`));

  let handle: FileHandle | null = null;
  try {
    handle = await open(temp, EXCL_WRITE_FLAGS, 0o600);
    await handle.writeFile(body, 'utf8');
    await handle.sync();
    await handle.close();
    handle = null;
    try {
      await link(temp, target);
    } catch (error) {
      if (isEexist(error)) {
        await confirmExistingPublishedObject(root, directory, target);
        return 'exists';
      }
      throw storageUnavailable();
    }
    // Requested durable success requires publication-directory sync. A failed
    // sync keeps the committed public record for retry and must not report
    // created; the public target is never unlinked here.
    await fsyncDirectory(directory);
    return 'created';
  } catch (error) {
    rethrowControlledOrUnavailable(error);
  } finally {
    await closeQuietly(handle);
    await unlinkQuietly(temp);
  }
}

async function readLocalObject(
  root: string,
  kind: ObjectKind,
  requestKey: string,
): Promise<{ kind: 'found'; text: string } | { kind: 'absent' }> {
  const directory = assertInsideRoot(root, path.join(root, kind));
  const target = assertInsideRoot(root, path.join(directory, `${requestKey}.json`));
  try {
    await assertExistingOwnedDirectory(root, directory);
    await assertRegularFile(target);
  } catch (error) {
    if (isEnoent(error)) return { kind: 'absent' };
    rethrowControlledOrUnavailable(error);
  }
  let handle: FileHandle | null = null;
  try {
    handle = await open(target, READ_FLAGS);
    const text = await handle.readFile('utf8');
    return { kind: 'found', text };
  } catch (error) {
    if (isEnoent(error)) return { kind: 'absent' };
    rethrowControlledOrUnavailable(error);
  } finally {
    await closeQuietly(handle);
  }
}

function isExplicitBlobNotFound(error: unknown): boolean {
  if (error instanceof BlobNotFoundError) return true;
  if (!error || typeof error !== 'object') return false;
  const candidate = error as {
    name?: unknown;
    status?: unknown;
    statusCode?: unknown;
    code?: unknown;
  };
  return (
    candidate.name === 'BlobNotFoundError'
    || candidate.status === 404
    || candidate.statusCode === 404
    || candidate.code === 'blob_not_found'
  );
}

function isBlobPreconditionFailed(error: unknown): boolean {
  return (
    error instanceof BlobPreconditionFailedError
    || (
      Boolean(error)
      && typeof error === 'object'
      && (error as { name?: unknown }).name === 'BlobPreconditionFailedError'
    )
  );
}

async function readBlobObject(
  token: string,
  kind: ObjectKind,
  requestKey: string,
): Promise<{ kind: 'found'; text: string } | { kind: 'absent' }> {
  let result: Awaited<ReturnType<typeof blobGet>>;
  try {
    result = await blobGet(blobPathname(kind, requestKey), {
      access: 'private',
      useCache: false,
      token,
    });
  } catch (error) {
    if (isExplicitBlobNotFound(error)) return { kind: 'absent' };
    throw storageUnavailable();
  }
  if (result === null) return { kind: 'absent' };
  const statusCode = (result as { statusCode?: unknown }).statusCode;
  if (statusCode === 404) return { kind: 'absent' };
  if (!result || statusCode !== 200 || !result.stream) throw storageUnavailable();
  try {
    const text = await new Response(result.stream).text();
    return { kind: 'found', text };
  } catch {
    throw storageUnavailable();
  }
}

async function putBlobImmutable(
  token: string,
  kind: ObjectKind,
  requestKey: string,
  body: string,
): Promise<'created' | 'exists'> {
  try {
    await blobPut(blobPathname(kind, requestKey), body, {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: false,
      contentType: 'application/json',
      token,
    });
    return 'created';
  } catch (error) {
    if (isBlobPreconditionFailed(error)) return 'exists';
    throw storageUnavailable();
  }
}

async function selectBackend(): Promise<Backend> {
  if (isFailClosedProductionRuntime()) {
    const token = process.env.BLOB_READ_WRITE_TOKEN?.trim() ?? '';
    if (!token) throw storageUnavailable();
    return { type: 'blob', token };
  }
  return { type: 'local', root: await resolveLocalRoot() };
}

async function publishObject(
  backend: Backend,
  kind: ObjectKind,
  requestKey: string,
  body: string,
): Promise<'created' | 'exists'> {
  if (backend.type === 'blob') {
    return putBlobImmutable(backend.token, kind, requestKey, body);
  }
  return exclusivePublishLocal(backend.root, kind, requestKey, body);
}

async function readObject(
  backend: Backend,
  kind: ObjectKind,
  requestKey: string,
): Promise<{ kind: 'found'; text: string } | { kind: 'absent' }> {
  if (backend.type === 'blob') {
    return readBlobObject(backend.token, kind, requestKey);
  }
  return readLocalObject(backend.root, kind, requestKey);
}

async function loadRecord(
  backend: Backend,
  requestKey: string,
): Promise<InternationalInquiryRecord | null> {
  const raw = await readObject(backend, 'raw', requestKey);
  if (raw.kind === 'absent') return null;
  return parseStoredRecord(raw.text, requestKey);
}

async function loadNotification(
  backend: Backend,
  requestKey: string,
  record: InternationalInquiryRecord,
): Promise<InternationalInquiryNotification> {
  const receipt = await readObject(backend, 'notify', requestKey);
  if (receipt.kind === 'absent') return 'pending';
  parseStoredReceipt(receipt.text, requestKey, record);
  return 'sent';
}

async function persistCreate(input: unknown): Promise<InternationalInquiryCreateOutcome> {
  const payload = parseInput(input);
  const requestKey = requestKeyFromId(payload.requestId);
  const record = newRecord(payload);
  const backend = await selectBackend();
  const published = await publishObject(backend, 'raw', requestKey, serializeRecord(record));
  if (published === 'created') {
    const notification = await loadNotification(backend, requestKey, record);
    return { kind: 'created', record, notification };
  }
  const existing = await loadRecord(backend, requestKey);
  if (!existing) throw storageUnavailable();
  if (!equalDigest(existing.payloadSha256, record.payloadSha256)) {
    return { kind: 'conflict' };
  }
  const notification = await loadNotification(backend, requestKey, existing);
  return { kind: 'existing', record: existing, notification };
}

async function persistRead(requestId: unknown): Promise<InternationalInquiryReadResult | null> {
  const normalizedId = parseRequestId(requestId);
  const requestKey = requestKeyFromId(normalizedId);
  const backend = await selectBackend();
  const record = await loadRecord(backend, requestKey);
  if (!record) return null;
  const notification = await loadNotification(backend, requestKey, record);
  return { record, notification };
}

async function persistMarkNotified(requestId: unknown): Promise<InternationalInquiryReadResult> {
  const normalizedId = parseRequestId(requestId);
  const requestKey = requestKeyFromId(normalizedId);
  const backend = await selectBackend();
  const record = await loadRecord(backend, requestKey);
  if (!record) throw notFound();
  const receipt = newReceipt(record, requestKey);
  const published = await publishObject(
    backend,
    'notify',
    requestKey,
    serializeReceipt(receipt),
  );
  if (published === 'exists') {
    const notification = await loadNotification(backend, requestKey, record);
    if (notification !== 'sent') throw storageUnavailable();
    return { record, notification };
  }
  return { record, notification: 'sent' };
}

export class InternationalInquiryStore {
  create(input: unknown): Promise<InternationalInquiryCreateOutcome> {
    return persistCreate(input);
  }

  read(requestId: string): Promise<InternationalInquiryReadResult | null> {
    return persistRead(requestId);
  }

  markNotified(requestId: string): Promise<InternationalInquiryReadResult> {
    return persistMarkNotified(requestId);
  }
}

export function createInternationalInquiryStore(): InternationalInquiryStore {
  return new InternationalInquiryStore();
}

export async function createInternationalInquiry(
  input: unknown,
): Promise<InternationalInquiryCreateOutcome> {
  return createInternationalInquiryStore().create(input);
}

export async function readInternationalInquiry(
  requestId: string,
): Promise<InternationalInquiryReadResult | null> {
  return createInternationalInquiryStore().read(requestId);
}

export async function markInternationalInquiryNotified(
  requestId: string,
): Promise<InternationalInquiryReadResult> {
  return createInternationalInquiryStore().markNotified(requestId);
}
