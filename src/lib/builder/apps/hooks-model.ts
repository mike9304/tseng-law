/**
 * F109 — App extension hooks: shared types.
 *
 * Apps register lifecycle hooks that the builder fires on well-known events
 * (page save, public render, order created, reservation created, CMS record
 * created, publish completed). Handlers are in-process callbacks; this slice
 * also persists METADATA so the registry survives restarts even though the
 * function references themselves cannot be serialised.
 *
 * See hooks-registry.ts for the runtime + file-backed metadata store.
 */

export const APP_HOOK_KINDS = [
  'editor.page-save',
  'public.page-render',
  'commerce.order-created',
  'bookings.reservation-created',
  'cms.record-created',
  'publish.completed',
] as const;

export type AppHookKind = (typeof APP_HOOK_KINDS)[number];

export interface EditorPageSavePayload {
  siteId: string;
  pageId: string;
  revision: number;
  savedAt: string;
}

export interface PublicPageRenderPayload {
  siteId: string;
  pageId: string;
  slug: string;
  locale: string;
}

export interface CommerceOrderCreatedPayload {
  orderId: string;
  totalCents: number;
  currency?: string;
}

export interface BookingsReservationCreatedPayload {
  bookingId: string;
  serviceId: string;
  staffId?: string;
  startAt: string;
}

export interface CmsRecordCreatedPayload {
  collectionId: string;
  recordId: string;
  locale?: string;
}

export interface PublishCompletedPayload {
  siteId: string;
  pageId: string;
  revision: number;
  publishedAt?: string;
}

export type AppHookEvent =
  | { kind: 'editor.page-save'; payload: EditorPageSavePayload }
  | { kind: 'public.page-render'; payload: PublicPageRenderPayload }
  | { kind: 'commerce.order-created'; payload: CommerceOrderCreatedPayload }
  | { kind: 'bookings.reservation-created'; payload: BookingsReservationCreatedPayload }
  | { kind: 'cms.record-created'; payload: CmsRecordCreatedPayload }
  | { kind: 'publish.completed'; payload: PublishCompletedPayload };

export interface AppHookContext {
  appId: string;
  log: (message: string) => void;
}

export type AppHookHandler = (event: AppHookEvent, ctx: AppHookContext) => Promise<void> | void;

/**
 * Live in-memory registration. `handler` is a function reference, so this
 * value is NOT directly persisted — see RegisteredAppHookRecord for the
 * file-backed shape.
 */
export interface RegisteredAppHook {
  appId: string;
  kind: AppHookKind;
  hookId?: string;
  priority?: number;
  handler: AppHookHandler;
}

/**
 * Persisted metadata for a registered hook. Survives process restarts;
 * handlers must be re-registered after reload before dispatch can call them.
 */
export interface RegisteredAppHookRecord {
  hookId: string;
  appId: string;
  kind: AppHookKind;
  priority: number;
  registeredAt: string;
  /** When true the persisted record currently has a live handler bound. */
  active?: boolean;
  /**
   * F112 secret id for the stored hook code body, when the registry POST
   * route was able to persist via the secrets store. Stored code is dormant
   * in this slice — it is not executed.
   */
  codeSecretId?: string;
  /** Fallback stub note when no secret store was available. */
  codeStubNote?: string;
}

export interface RegisteredAppHookView extends RegisteredAppHookRecord {
  /** True when the in-memory registry currently has a live handler bound. */
  hasHandler: boolean;
}

export interface HookDispatchSummary {
  kind: AppHookKind;
  invoked: number;
  failed: number;
  dispatchedAt: string;
}

export function isAppHookKind(value: unknown): value is AppHookKind {
  return typeof value === 'string' && (APP_HOOK_KINDS as readonly string[]).includes(value);
}

const APP_ID_PATTERN = /^[a-z][a-z0-9-]{1,79}$/;
const HOOK_ID_PATTERN = /^[a-z][a-z0-9-]{1,79}$/;

export function isValidAppHookId(value: string): boolean {
  return typeof value === 'string' && HOOK_ID_PATTERN.test(value);
}

export function isValidAppId(value: string): boolean {
  return typeof value === 'string' && APP_ID_PATTERN.test(value);
}

export function makeHookId(appId: string, kind: AppHookKind, suffix?: string): string {
  const safeSuffix = (suffix ?? '').trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
  const tail = safeSuffix || Math.random().toString(36).slice(2, 8);
  return `${appId}-${kind.replace(/[^a-z0-9-]+/g, '-')}-${tail}`.slice(0, 80);
}

/**
 * Derive an F112 secret key for the stored code body of a hook. Must satisfy
 * F112's `/^[A-Z][A-Z0-9_]{0,63}$/` pattern. Long inputs are deterministically
 * truncated; non-conforming characters are replaced with underscores.
 */
export function deriveHookCodeSecretKey(appId: string, hookId: string): string {
  const sanitize = (input: string) => input
    .toUpperCase()
    .replace(/[^A-Z0-9_]/g, '_')
    .replace(/^_+|_+$/g, '');
  const base = `APP_HOOK_${sanitize(appId)}_${sanitize(hookId)}`;
  if (base.length <= 64) return base;
  // Preserve a deterministic suffix so the key remains unique after truncation.
  let hash = 0;
  for (let i = 0; i < base.length; i += 1) hash = ((hash << 5) - hash + base.charCodeAt(i)) | 0;
  const suffix = `_${(hash >>> 0).toString(16).toUpperCase()}`;
  return base.slice(0, 64 - suffix.length) + suffix;
}