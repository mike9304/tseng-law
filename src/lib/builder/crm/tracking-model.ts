/**
 * Email open + click tracking with HMAC-signed tokens.
 *
 * - `signTrackingToken` builds a tamper-evident token bundling
 *   `{kind, contactId, campaignId, url?, iat}`. The URL is part of the
 *   signed payload for clicks, so the open-redirect surface stays closed.
 * - `verifyTrackingToken` validates the signature + expiry in constant time
 *   and returns the parsed payload.
 * - `logOpenEvent` / `logClickEvent` append to a file-backed event log with
 *   a hard cap to keep storage bounded.
 *
 * No external deps; secret resolution mirrors `automation-engine.ts`.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { get, put } from '@vercel/blob';

export type TrackingEventKind = 'open' | 'click';

export interface TrackingPayload {
  kind: TrackingEventKind;
  contactId: string;
  campaignId: string;
  url?: string;
  iat: number;
}

export interface TrackingEvent {
  id: string;
  kind: TrackingEventKind;
  contactId: string;
  campaignId: string;
  url?: string;
  occurredAt: string;
  userAgent?: string;
  ip?: string;
}

export interface TrackingEventsFile {
  version: 1;
  updatedAt: string;
  events: TrackingEvent[];
}

export const MAX_TRACKING_EVENTS = 10_000;
/** Tokens older than 90 days are treated as expired. */
const MAX_TOKEN_AGE_MS = 90 * 24 * 60 * 60 * 1000;

function rootDir(): string {
  return path.join(process.cwd(), 'runtime-data', 'crm');
}
function eventsFile(): string {
  return path.join(rootDir(), 'tracking-events.json');
}
const BLOB_PATH = 'crm/tracking-events.json';

function isBlobBackend(): boolean {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  if (process.env.CRM_BACKEND === 'local') return false;
  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.BUILDER_USE_BLOB_IN_DEV !== '1'
  ) {
    return false;
  }
  return true;
}

export function resolveTrackingSecret(): string | null {
  const candidate =
    process.env.CRM_TRACKING_SECRET ||
    process.env.CRM_WEBHOOK_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.BUILDER_WEBHOOK_SECRET ||
    '';
  const trimmed = candidate.trim();
  return trimmed ? trimmed : null;
}

function base64UrlEncode(value: string | Buffer): string {
  const buf = typeof value === 'string' ? Buffer.from(value, 'utf8') : value;
  return buf
    .toString('base64')
    .replace(/=+$/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(value: string): Buffer | null {
  try {
    const padded = value.replace(/-/g, '+').replace(/_/g, '/');
    const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
    return Buffer.from(padded + pad, 'base64');
  } catch {
    return null;
  }
}

function hmac(secret: string, body: string): string {
  return createHmac('sha256', secret).update(body).digest('hex');
}

function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
  } catch {
    return false;
  }
}

/**
 * Sign a tracking payload as `<base64url-payload>.<hex-hmac>`. The token
 * is URL-safe and can be embedded as a path segment or query value.
 *
 * For clicks, callers should pass `url`; verifiers will require the URL
 * to match the bound value so the endpoint cannot be used as an
 * open-redirect oracle.
 */
export function signTrackingToken(
  payload: Omit<TrackingPayload, 'iat'> & { iat?: number },
  secret: string,
): string {
  const full: TrackingPayload = {
    kind: payload.kind,
    contactId: payload.contactId,
    campaignId: payload.campaignId,
    url: payload.url,
    iat: payload.iat ?? Date.now(),
  };
  const encoded = base64UrlEncode(JSON.stringify(full));
  const sig = hmac(secret, encoded);
  return `${encoded}.${sig}`;
}

export interface VerifyOptions {
  /** Force the parsed token to match this kind. Defense-in-depth. */
  expectedKind?: TrackingEventKind;
  /** Override current time for testing. */
  now?: number;
}

export function verifyTrackingToken(
  token: string,
  secret: string,
  options: VerifyOptions = {},
): TrackingPayload | null {
  if (!token || typeof token !== 'string') return null;
  const dot = token.lastIndexOf('.');
  if (dot <= 0 || dot === token.length - 1) return null;
  const encoded = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = hmac(secret, encoded);
  if (!safeEqualHex(sig, expected)) return null;

  const raw = base64UrlDecode(encoded);
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw.toString('utf8'));
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== 'object') return null;
  const p = parsed as Partial<TrackingPayload>;
  if (
    (p.kind !== 'open' && p.kind !== 'click') ||
    typeof p.contactId !== 'string' ||
    typeof p.campaignId !== 'string' ||
    typeof p.iat !== 'number'
  ) {
    return null;
  }
  if (options.expectedKind && p.kind !== options.expectedKind) return null;
  if (p.kind === 'click' && typeof p.url !== 'string') return null;

  const now = options.now ?? Date.now();
  if (!Number.isFinite(p.iat) || p.iat > now + 60_000) return null;
  if (now - p.iat > MAX_TOKEN_AGE_MS) return null;

  return {
    kind: p.kind,
    contactId: p.contactId,
    campaignId: p.campaignId,
    url: p.url,
    iat: p.iat,
  };
}

// ─── Event log storage ───────────────────────────────────────────────────

function emptyFile(): TrackingEventsFile {
  return { version: 1, updatedAt: new Date(0).toISOString(), events: [] };
}

function normalizeEvent(raw: unknown): TrackingEvent | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Partial<TrackingEvent>;
  if (
    typeof r.id !== 'string' ||
    (r.kind !== 'open' && r.kind !== 'click') ||
    typeof r.contactId !== 'string' ||
    typeof r.campaignId !== 'string' ||
    typeof r.occurredAt !== 'string'
  ) {
    return null;
  }
  return {
    id: r.id,
    kind: r.kind,
    contactId: r.contactId,
    campaignId: r.campaignId,
    url: typeof r.url === 'string' ? r.url : undefined,
    occurredAt: r.occurredAt,
    userAgent: typeof r.userAgent === 'string' ? r.userAgent : undefined,
    ip: typeof r.ip === 'string' ? r.ip : undefined,
  };
}

function normalizeFile(value: unknown): TrackingEventsFile {
  if (!value || typeof value !== 'object') return emptyFile();
  const v = value as Partial<TrackingEventsFile>;
  const events = Array.isArray(v.events)
    ? v.events.map(normalizeEvent).filter((e): e is TrackingEvent => e !== null)
    : [];
  return {
    version: 1,
    updatedAt: typeof v.updatedAt === 'string' ? v.updatedAt : new Date().toISOString(),
    events,
  };
}

async function readFromBackend(): Promise<TrackingEventsFile> {
  if (isBlobBackend()) {
    try {
      const result = await get(BLOB_PATH, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        const text = await new Response(result.stream).text();
        return normalizeFile(JSON.parse(text));
      }
    } catch {
      /* fallthrough */
    }
    return emptyFile();
  }
  try {
    return normalizeFile(JSON.parse(await fs.readFile(eventsFile(), 'utf8')));
  } catch {
    return emptyFile();
  }
}

async function writeToBackend(data: TrackingEventsFile): Promise<void> {
  const body = JSON.stringify(data, null, 2);
  if (isBlobBackend()) {
    await put(BLOB_PATH, body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }
  await fs.mkdir(rootDir(), { recursive: true });
  await fs.writeFile(eventsFile(), body, 'utf8');
}

let eventsLock: Promise<void> = Promise.resolve();

async function withQueue<T>(task: () => Promise<T>): Promise<T> {
  const previous = eventsLock;
  let release!: () => void;
  eventsLock = new Promise<void>((resolve) => {
    release = resolve;
  });
  await previous.catch(() => undefined);
  try {
    return await task();
  } finally {
    release();
  }
}

export function makeTrackingEventId(): string {
  return `trk_${Date.now().toString(36)}_${randomBytes(5).toString('hex')}`;
}

export interface LogEventInput {
  contactId: string;
  campaignId: string;
  url?: string;
  userAgent?: string;
  ip?: string;
}

async function appendEvent(
  kind: TrackingEventKind,
  input: LogEventInput,
): Promise<TrackingEvent> {
  return withQueue(async () => {
    const current = await readFromBackend();
    const event: TrackingEvent = {
      id: makeTrackingEventId(),
      kind,
      contactId: input.contactId,
      campaignId: input.campaignId,
      url: input.url,
      occurredAt: new Date().toISOString(),
      userAgent: input.userAgent,
      ip: input.ip,
    };
    let events = [...current.events, event];
    if (events.length > MAX_TRACKING_EVENTS) {
      events = events.slice(events.length - MAX_TRACKING_EVENTS);
    }
    const next: TrackingEventsFile = {
      version: 1,
      updatedAt: event.occurredAt,
      events,
    };
    await writeToBackend(next);
    return event;
  });
}

export function logOpenEvent(input: LogEventInput): Promise<TrackingEvent> {
  return appendEvent('open', input);
}

export function logClickEvent(input: LogEventInput): Promise<TrackingEvent> {
  return appendEvent('click', input);
}

export async function readTrackingEvents(): Promise<TrackingEvent[]> {
  return (await readFromBackend()).events;
}

export interface TrackingSummary {
  total: number;
  opens: number;
  clicks: number;
  byCampaign: Record<string, { opens: number; clicks: number }>;
}

export async function summarizeTracking(): Promise<TrackingSummary> {
  const events = await readTrackingEvents();
  const summary: TrackingSummary = {
    total: events.length,
    opens: 0,
    clicks: 0,
    byCampaign: {},
  };
  for (const event of events) {
    if (event.kind === 'open') summary.opens += 1;
    else summary.clicks += 1;
    const bucket =
      summary.byCampaign[event.campaignId] ?? { opens: 0, clicks: 0 };
    if (event.kind === 'open') bucket.opens += 1;
    else bucket.clicks += 1;
    summary.byCampaign[event.campaignId] = bucket;
  }
  return summary;
}

/**
 * A precomputed 43-byte transparent GIF89a pixel. Returned by the open
 * endpoint regardless of token validity so trackers never break inboxes.
 */
export const TRACKING_PIXEL_GIF: Buffer = Buffer.from([
  0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00,
  0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0x21, 0xf9, 0x04, 0x01, 0x00, 0x00, 0x00,
  0x00, 0x2c, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02,
  0x44, 0x01, 0x00, 0x3b,
]);

/**
 * Validate a candidate redirect URL before honoring it from a click token.
 * Defense-in-depth in case the secret leaks: we still refuse non-http(s)
 * and over-long URLs. The URL inside the payload was signed, so this only
 * fires on a compromised secret + malicious payload combination.
 */
export function isSafeRedirectUrl(value: string | undefined): value is string {
  if (typeof value !== 'string') return false;
  if (value.length > 2000) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}