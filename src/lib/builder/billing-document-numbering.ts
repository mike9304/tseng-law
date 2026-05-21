import { promises as fs } from 'fs';
import { createHash } from 'crypto';
import path from 'path';
import { get, put } from '@vercel/blob';
import type { CommerceOrderDocumentType } from '@/lib/builder/commerce/orders-shared';

type CommerceBackend = 'blob' | 'file';

export const BILLING_DOCUMENT_NUMBERING_VERSION = 1;

export type BillingDocumentNumberStatus = 'reserved' | 'issued' | 'voided';
export type BillingDocumentNumberOwnerSource = 'order' | 'booking' | 'system';

export interface BillingDocumentNumberReservation {
  reservationId: string;
  key: string;
  type: CommerceOrderDocumentType;
  year: number;
  sequence: number;
  number: string;
  status: BillingDocumentNumberStatus;
  reservedAt: string;
  issuedAt?: string;
  voidedAt?: string;
  voidReason?: string;
  ownerSource?: BillingDocumentNumberOwnerSource;
  ownerId?: string;
  documentId?: string;
}

export interface BillingDocumentNumberingState {
  version: typeof BILLING_DOCUMENT_NUMBERING_VERSION;
  updatedAt: string;
  sequences: Record<string, number>;
  reservations: Record<string, BillingDocumentNumberReservation>;
}

const NUMBERING_BLOB = 'builder-commerce/billing-documents/numbering.json';
const DEFAULT_COMMERCE_ROOT = path.join(process.cwd(), 'runtime-data', 'builder-commerce');
const NUMBERING_LOCK_TIMEOUT_MS = 5000;
const NUMBERING_LOCK_STALE_MS = 15000;
const NUMBERING_LOCK_RETRY_MS = 25;

let numberingMutationQueue: Promise<void> = Promise.resolve();

function getBackend(): CommerceBackend {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return 'file';
  if (process.env.CONSULTATION_LOG_BACKEND === 'local') return 'file';
  if (process.env.BUILDER_COMMERCE_BACKEND === 'local') return 'file';
  if (process.env.NODE_ENV !== 'production' && process.env.BUILDER_USE_BLOB_IN_DEV !== '1') return 'file';
  return 'blob';
}

function commerceRoot(): string {
  return process.env.BUILDER_COMMERCE_ROOT?.trim() || DEFAULT_COMMERCE_ROOT;
}

function numberingFilePath(): string {
  return path.join(commerceRoot(), 'billing-documents', 'numbering.json');
}

function numberingLockFilePath(): string {
  return `${numberingFilePath()}.lock`;
}

function defaultState(now: string): BillingDocumentNumberingState {
  return {
    version: BILLING_DOCUMENT_NUMBERING_VERSION,
    updatedAt: now,
    sequences: {},
    reservations: {},
  };
}

function normalizeReservation(input: unknown): BillingDocumentNumberReservation | null {
  if (!input || typeof input !== 'object') return null;
  const source = input as Partial<BillingDocumentNumberReservation>;
  if (
    !source.reservationId
    || !source.key
    || (source.type !== 'invoice' && source.type !== 'receipt')
    || !source.number
    || !source.reservedAt
  ) {
    return null;
  }
  const sequence = Number(source.sequence);
  const year = Number(source.year);
  return {
    reservationId: String(source.reservationId),
    key: String(source.key),
    type: source.type,
    year: Number.isFinite(year) ? Math.floor(year) : new Date(source.reservedAt).getUTCFullYear(),
    sequence: Number.isFinite(sequence) ? Math.max(1, Math.floor(sequence)) : 1,
    number: String(source.number),
    status: source.status === 'issued' || source.status === 'voided' ? source.status : 'reserved',
    reservedAt: String(source.reservedAt),
    issuedAt: source.issuedAt ? String(source.issuedAt) : undefined,
    voidedAt: source.voidedAt ? String(source.voidedAt) : undefined,
    voidReason: source.voidReason ? String(source.voidReason) : undefined,
    ownerSource: source.ownerSource === 'order' || source.ownerSource === 'booking' || source.ownerSource === 'system'
      ? source.ownerSource
      : undefined,
    ownerId: source.ownerId ? String(source.ownerId) : undefined,
    documentId: source.documentId ? String(source.documentId) : undefined,
  };
}

function normalizeReservations(input: unknown): Record<string, BillingDocumentNumberReservation> {
  if (!input || typeof input !== 'object') return {};
  return Object.fromEntries(
    Object.values(input as Record<string, unknown>)
      .map(normalizeReservation)
      .filter((reservation): reservation is BillingDocumentNumberReservation => Boolean(reservation))
      .map((reservation) => [reservation.reservationId, reservation]),
  );
}

async function readState(now: string): Promise<BillingDocumentNumberingState> {
  try {
    if (getBackend() === 'blob') {
      const result = await get(NUMBERING_BLOB, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        const state = await new Response(result.stream).json() as Partial<BillingDocumentNumberingState>;
        return {
          version: BILLING_DOCUMENT_NUMBERING_VERSION,
          updatedAt: typeof state.updatedAt === 'string' ? state.updatedAt : now,
          sequences: state.sequences && typeof state.sequences === 'object' ? state.sequences as Record<string, number> : {},
          reservations: normalizeReservations(state.reservations),
        };
      }
    } else {
      const raw = await fs.readFile(numberingFilePath(), 'utf8');
      const state = JSON.parse(raw) as Partial<BillingDocumentNumberingState>;
      return {
        version: BILLING_DOCUMENT_NUMBERING_VERSION,
        updatedAt: typeof state.updatedAt === 'string' ? state.updatedAt : now,
        sequences: state.sequences && typeof state.sequences === 'object' ? state.sequences as Record<string, number> : {},
        reservations: normalizeReservations(state.reservations),
      };
    }
  } catch {
    return defaultState(now);
  }
  return defaultState(now);
}

async function writeState(state: BillingDocumentNumberingState): Promise<void> {
  const body = JSON.stringify(state, null, 2);
  if (getBackend() === 'blob') {
    await put(NUMBERING_BLOB, body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }

  const filePath = numberingFilePath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, body, 'utf8');
}

function isNodeErrorCode(error: unknown, code: string): boolean {
  return Boolean(error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === code);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function acquireFileNumberingLock(): Promise<() => Promise<void>> {
  const filePath = numberingLockFilePath();
  const startedAt = Date.now();
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  while (true) {
    try {
      const handle = await fs.open(filePath, 'wx');
      try {
        await handle.writeFile(JSON.stringify({
          pid: process.pid,
          createdAt: new Date().toISOString(),
        }), 'utf8');
      } finally {
        await handle.close();
      }
      return async () => {
        await fs.rm(filePath, { force: true }).catch(() => undefined);
      };
    } catch (error) {
      if (!isNodeErrorCode(error, 'EEXIST')) throw error;

      try {
        const stat = await fs.stat(filePath);
        if (Date.now() - stat.mtimeMs > NUMBERING_LOCK_STALE_MS) {
          await fs.rm(filePath, { force: true });
          continue;
        }
      } catch (statError) {
        if (isNodeErrorCode(statError, 'ENOENT')) continue;
        throw statError;
      }

      if (Date.now() - startedAt > NUMBERING_LOCK_TIMEOUT_MS) {
        throw new Error('Timed out waiting for billing document numbering lock');
      }

      await sleep(NUMBERING_LOCK_RETRY_MS);
    }
  }
}

async function withNumberingMutation<T>(operation: () => Promise<T>): Promise<T> {
  const previous = numberingMutationQueue;
  let releaseQueue!: () => void;
  numberingMutationQueue = new Promise<void>((resolve) => {
    releaseQueue = resolve;
  });

  await previous.catch(() => undefined);

  try {
    if (getBackend() !== 'file') return await operation();

    const releaseFileLock = await acquireFileNumberingLock();
    try {
      return await operation();
    } finally {
      await releaseFileLock();
    }
  } finally {
    releaseQueue();
  }
}

function sequenceKey(type: CommerceOrderDocumentType, issuedAt: string): string {
  const year = new Date(issuedAt).getUTCFullYear();
  return `${year}:${type}`;
}

export function formatBillingDocumentNumber(type: CommerceOrderDocumentType, issuedAt: string, sequence: number): string {
  const prefix = type === 'invoice' ? 'INV' : 'RCT';
  const year = new Date(issuedAt).getUTCFullYear();
  return `${prefix}-${year}-${String(sequence).padStart(6, '0')}`;
}

function reservationId(type: CommerceOrderDocumentType, issuedAt: string, sequence: number): string {
  const key = `${type}:${issuedAt}:${sequence}:${Math.random().toString(36).slice(2)}`;
  return `num_${createHash('sha256').update(key).digest('base64url').slice(0, 24)}`;
}

export async function reserveBillingDocumentNumber(
  type: CommerceOrderDocumentType,
  issuedAt: string,
): Promise<BillingDocumentNumberReservation> {
  return withNumberingMutation(async () => {
    const state = await readState(issuedAt);
    const key = sequenceKey(type, issuedAt);
    const current = Number(state.sequences[key]);
    const next = Number.isFinite(current) ? Math.max(0, Math.floor(current)) + 1 : 1;
    const year = new Date(issuedAt).getUTCFullYear();
    const reservation: BillingDocumentNumberReservation = {
      reservationId: reservationId(type, issuedAt, next),
      key,
      type,
      year,
      sequence: next,
      number: formatBillingDocumentNumber(type, issuedAt, next),
      status: 'reserved',
      reservedAt: new Date().toISOString(),
    };
    const updated: BillingDocumentNumberingState = {
      version: BILLING_DOCUMENT_NUMBERING_VERSION,
      updatedAt: new Date().toISOString(),
      sequences: {
        ...state.sequences,
        [key]: next,
      },
      reservations: {
        ...state.reservations,
        [reservation.reservationId]: reservation,
      },
    };
    await writeState(updated);
    return reservation;
  });
}

export async function commitBillingDocumentNumber(
  reservationId: string,
  owner: {
    ownerSource: BillingDocumentNumberOwnerSource;
    ownerId: string;
    documentId: string;
  },
): Promise<BillingDocumentNumberReservation | null> {
  return withNumberingMutation(async () => {
    const now = new Date().toISOString();
    const state = await readState(now);
    const reservation = state.reservations[reservationId];
    if (!reservation) return null;
    const nextReservation: BillingDocumentNumberReservation = {
      ...reservation,
      status: 'issued',
      issuedAt: reservation.issuedAt ?? now,
      ownerSource: owner.ownerSource,
      ownerId: owner.ownerId,
      documentId: owner.documentId,
    };
    await writeState({
      ...state,
      updatedAt: now,
      reservations: {
        ...state.reservations,
        [reservationId]: nextReservation,
      },
    });
    return nextReservation;
  });
}

export async function voidBillingDocumentNumber(
  reservationId: string,
  reason: string,
): Promise<BillingDocumentNumberReservation | null> {
  return withNumberingMutation(async () => {
    const now = new Date().toISOString();
    const state = await readState(now);
    const reservation = state.reservations[reservationId];
    if (!reservation) return null;
    const nextReservation: BillingDocumentNumberReservation = {
      ...reservation,
      status: 'voided',
      voidedAt: reservation.voidedAt ?? now,
      voidReason: reason,
    };
    await writeState({
      ...state,
      updatedAt: now,
      reservations: {
        ...state.reservations,
        [reservationId]: nextReservation,
      },
    });
    return nextReservation;
  });
}

export async function listBillingDocumentNumberReservations(): Promise<BillingDocumentNumberReservation[]> {
  const state = await readState(new Date().toISOString());
  return Object.values(state.reservations)
    .sort((left, right) => left.reservedAt.localeCompare(right.reservedAt));
}

export async function nextBillingDocumentNumber(type: CommerceOrderDocumentType, issuedAt: string): Promise<string> {
  const reservation = await reserveBillingDocumentNumber(type, issuedAt);
  await commitBillingDocumentNumber(reservation.reservationId, {
    ownerSource: 'system',
    ownerId: 'legacy',
    documentId: reservation.reservationId,
  });
  return reservation.number;
}
