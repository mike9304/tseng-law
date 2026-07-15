'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { filterVisiblePageSwitcherPages } from '@/components/builder/canvas/PageSwitcher.helpers';
import type { BuilderPageSummary, ColumnPostsSummary } from '@/components/builder/canvas/SandboxEditorRail';
import type { MoveToPageResult } from '@/components/builder/canvas/SandboxModalsRoot';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { DECOMPOSABLE_PAGE_SLUGS } from '@/lib/builder/canvas/decomposable-slugs';
import { createBuilderDynamicListCanvasDocument } from '@/lib/builder/dynamic-list-pages';
import { buildSitePagePath, comparableSitePath, normalizeSiteHref } from '@/lib/builder/site/paths';
import { resolveBuilderSiteSettings } from '@/lib/builder/site/localized-settings';
import { DEFAULT_THEME, type BuilderNavItem, type BuilderSiteSettings, type BuilderTheme } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';

const AUTOSAVE_DEBOUNCE_MS = 1000;
const NETWORK_ERROR_MESSAGE = '네트워크 오류, 다시 시도해주세요';
const PAGE_SWITCH_SAVE_BLOCKED_MESSAGE = '현재 페이지 초안을 저장하지 못해 페이지 전환을 멈췄습니다.';

export interface DraftConflictActionMessages {
  readonly backupDownloaded: string;
  readonly backupFailed: string;
  readonly backupFailedPreserved: string;
  readonly serverBackupFailed: string;
  readonly serverLoadFailedPreserved: string;
  readonly newerBackupFailed: string;
  readonly serverLoaded: string;
  readonly serverUnexpectedFailure: string;
}

export function getDraftConflictActionMessages(locale: Locale): DraftConflictActionMessages {
  if (locale === 'zh-hant') {
    return {
      backupDownloaded: '已下載本機草稿備份。',
      backupFailed: '無法下載本機草稿備份。',
      backupFailedPreserved: '無法下載本機草稿備份。本機編輯內容仍保持不變。',
      serverBackupFailed: '因無法下載本機草稿備份，已停止載入伺服器草稿。',
      serverLoadFailedPreserved: '無法載入最新伺服器草稿。本機草稿仍保持不變。',
      newerBackupFailed: '因無法下載較新的本機變更備份，已停止載入伺服器草稿。',
      serverLoaded: '已備份本機草稿並載入最新伺服器草稿。',
      serverUnexpectedFailure: '無法載入伺服器草稿。本機草稿與衝突狀態仍保持不變。',
    };
  }
  if (locale === 'en') {
    return {
      backupDownloaded: 'Downloaded the local draft backup.',
      backupFailed: 'Could not download the local draft backup.',
      backupFailedPreserved: 'Could not download the local draft backup. Your local edit is unchanged.',
      serverBackupFailed: 'The server draft was not loaded because the local backup could not be downloaded.',
      serverLoadFailedPreserved: 'Could not load the latest server draft. Your local draft is unchanged.',
      newerBackupFailed: 'The server draft was not loaded because the newer local edit could not be backed up.',
      serverLoaded: 'Backed up the local draft and loaded the latest server draft.',
      serverUnexpectedFailure: 'Could not load the server draft. The local draft and conflict state are unchanged.',
    };
  }
  return {
    backupDownloaded: '로컬 초안 백업을 다운로드했습니다.',
    backupFailed: '로컬 초안 백업을 다운로드하지 못했습니다.',
    backupFailedPreserved: '로컬 초안 백업을 다운로드하지 못했습니다. 로컬 편집본은 그대로 유지됩니다.',
    serverBackupFailed: '로컬 초안 백업을 다운로드하지 못해 서버 초안 불러오기를 중단했습니다.',
    serverLoadFailedPreserved: '최신 서버 초안을 불러오지 못했습니다. 로컬 초안은 그대로 유지됩니다.',
    newerBackupFailed: '새 로컬 변경 백업을 다운로드하지 못해 서버 초안 불러오기를 중단했습니다.',
    serverLoaded: '로컬 초안을 백업하고 최신 서버 초안을 불러왔습니다.',
    serverUnexpectedFailure: '서버 초안을 불러오지 못했습니다. 로컬 초안과 충돌 상태는 그대로 유지됩니다.',
  };
}

function siteScopedQuery(locale: Locale | string, siteId: string): string {
  return new URLSearchParams({ locale, siteId }).toString();
}

interface LoadDraftOptions {
  skipIfEditedSinceRequest?: boolean;
  slug?: string;
  forceReplace?: boolean;
}

type ReplaceDocumentResult = 'applied' | 'same' | 'skipped-local-history';
export type PersistBeforeNavigationResult = 'saved' | 'blocked' | 'superseded';

export interface DraftSaveScope {
  pageId: string | null;
  locale: Locale;
  epoch: number;
}

export interface DraftSaveScopeController {
  current(): DraftSaveScope;
  isCurrent(scope: DraftSaveScope): boolean;
  transition(pageId: string | null, locale: Locale): DraftSaveScope;
  invalidate(): DraftSaveScope;
}

export function isDraftSaveScopeCurrent(
  request: DraftSaveScope,
  current: DraftSaveScope,
): boolean {
  return request.pageId === current.pageId
    && request.locale === current.locale
    && request.epoch === current.epoch;
}

export function createDraftSaveScopeController(
  pageId: string | null,
  locale: Locale,
): DraftSaveScopeController {
  let activeScope: DraftSaveScope = { pageId, locale, epoch: 0 };
  return {
    current(): DraftSaveScope {
      return activeScope;
    },
    isCurrent(scope: DraftSaveScope): boolean {
      return isDraftSaveScopeCurrent(scope, activeScope);
    },
    transition(nextPageId: string | null, nextLocale: Locale): DraftSaveScope {
      if (activeScope.pageId === nextPageId && activeScope.locale === nextLocale) {
        return activeScope;
      }
      activeScope = {
        pageId: nextPageId,
        locale: nextLocale,
        epoch: activeScope.epoch + 1,
      };
      return activeScope;
    },
    invalidate(): DraftSaveScope {
      activeScope = {
        ...activeScope,
        epoch: activeScope.epoch + 1,
      };
      return activeScope;
    },
  };
}

export interface DraftSaveQueue {
  enqueue(
    scope: DraftSaveScope,
    coalesceKey: object,
    task: () => Promise<boolean>,
  ): Promise<boolean>;
}

export function createDraftSaveQueue(): DraftSaveQueue {
  type SaveLane = {
    tail: Promise<boolean>;
    pendingByKey: Map<object, Promise<boolean>>;
  };
  const lanes = new Map<string, SaveLane>();
  const scopeKey = (scope: DraftSaveScope) => JSON.stringify([
    scope.pageId,
    scope.locale,
    scope.epoch,
  ]);

  return {
    enqueue(scope, coalesceKey, task): Promise<boolean> {
      const key = scopeKey(scope);
      const lane = lanes.get(key) ?? {
        tail: Promise.resolve(true),
        pendingByKey: new Map<object, Promise<boolean>>(),
      };
      lanes.set(key, lane);

      const pending = lane.pendingByKey.get(coalesceKey);
      if (pending) return pending;

      const result = lane.tail.then((previousSaved) => (previousSaved ? task() : false));
      lane.tail = result;
      lane.pendingByKey.set(coalesceKey, result);
      const releaseLane = () => {
        if (lane.pendingByKey.get(coalesceKey) === result) {
          lane.pendingByKey.delete(coalesceKey);
        }
        if (lane.tail === result) lanes.delete(key);
      };
      void result.then(releaseLane, releaseLane);
      return result;
    },
  };
}

export interface PersistLatestDraftForScopeOptions<TDocument extends object> {
  isScopeCurrent(): boolean;
  isBlocked(): boolean;
  getCurrentDocument(): TDocument | null;
  isDocumentSaved(document: TDocument): boolean;
  saveDocument(document: TDocument): Promise<boolean>;
}

export async function persistLatestDraftForScope<TDocument extends object>({
  isScopeCurrent,
  isBlocked,
  getCurrentDocument,
  isDocumentSaved,
  saveDocument,
}: PersistLatestDraftForScopeOptions<TDocument>): Promise<PersistBeforeNavigationResult> {
  if (!isScopeCurrent()) return 'superseded';
  if (isBlocked()) return 'blocked';

  let document = getCurrentDocument();
  if (!document || isDocumentSaved(document)) return 'saved';

  while (true) {
    if (!isScopeCurrent()) return 'superseded';
    if (isBlocked()) return 'blocked';

    let saveResult:
      | { status: 'fulfilled'; saved: boolean }
      | { status: 'rejected'; error: unknown };
    try {
      saveResult = {
        status: 'fulfilled',
        saved: await saveDocument(document),
      };
    } catch (error) {
      saveResult = { status: 'rejected', error };
    }

    if (!isScopeCurrent()) return 'superseded';
    const blocked = isBlocked();
    if (saveResult.status === 'rejected') throw saveResult.error;
    if (blocked || !saveResult.saved) return 'blocked';

    const latestDocument = getCurrentDocument();
    if (
      !latestDocument
      || latestDocument === document
      || isDocumentSaved(latestDocument)
    ) {
      return 'saved';
    }
    document = latestDocument;
  }
}

export interface SerializedTaskQueue {
  enqueue<T>(task: () => Promise<T>): Promise<T>;
}

export function createSerializedTaskQueue(): SerializedTaskQueue {
  let tail: Promise<void> = Promise.resolve();
  return {
    enqueue<T>(task: () => Promise<T>): Promise<T> {
      const result = tail.then(task, task);
      tail = result.then(() => undefined, () => undefined);
      return result;
    },
  };
}

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export interface DraftMeta {
  revision: number;
  savedAt: string;
  updatedBy?: string;
}

interface ExternalPropTransition {
  readonly id: number;
  readonly intentSeq: number;
  readonly pageId: string | null;
  readonly locale: Locale;
  readonly document: BuilderCanvasDocument;
  readonly draftMeta: DraftMeta | null;
  readonly slug: string;
  readonly siteSettings: BuilderSiteSettings | undefined;
  readonly siteTheme: BuilderTheme | undefined;
  readonly navItems: BuilderNavItem[] | undefined;
  readonly sitePages: BuilderPageSummary[] | undefined;
}

interface LocaleScopedSiteState {
  readonly siteSettings: BuilderSiteSettings | undefined;
  readonly siteTheme: BuilderTheme;
  readonly navItems: BuilderNavItem[];
  readonly sitePages: BuilderPageSummary[];
}

export interface DraftRecoverySnapshot {
  readonly capturedAt: string;
  readonly filename: string;
  readonly serializedDocument: string;
  readonly byteLength: number;
  readonly checksumSha256: string;
  readonly document: BuilderCanvasDocument;
}

export interface DraftConflict {
  readonly errorCode: 'draft_conflict';
  readonly pageId: string;
  readonly locale: Locale;
  readonly expectedRevision: number | null;
  readonly currentRevision: number | null;
  readonly currentSavedAt?: string;
  readonly localRecovery: DraftRecoverySnapshot;
  /**
   * The current draft API has optimistic revision checks, but no idempotency
   * contract for an explicit conflict overwrite. Keep this hard-false until
   * that server contract exists; the UI must not invent a force-save path.
   */
  readonly canSaveLocalVersion: false;
}

export interface DraftConflictResponseBody {
  readonly errorCode?: unknown;
  readonly error?: unknown;
  readonly message?: unknown;
  readonly current?: {
    readonly revision?: unknown;
    readonly savedAt?: unknown;
  };
}

export function readExactDraftConflict(
  status: number,
  body: DraftConflictResponseBody | null,
): { currentRevision: number | null; currentSavedAt?: string } | null {
  if (status !== 409 || body?.errorCode !== 'draft_conflict') return null;
  return {
    currentRevision: typeof body.current?.revision === 'number'
      && Number.isInteger(body.current.revision)
      ? body.current.revision
      : null,
    currentSavedAt: typeof body.current?.savedAt === 'string'
      ? body.current.savedAt
      : undefined,
  };
}

function deepFreezeRecoveryValue<T>(value: T): T {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const child of Object.values(value as Record<string, unknown>)) {
    deepFreezeRecoveryValue(child);
  }
  return Object.freeze(value);
}

export async function sha256HexUtf8(value: string): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error('web_crypto_unavailable');
  const digest = await subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function recoveryFilenameSegment(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'page';
}

export async function createDraftRecoverySnapshot({
  document,
  pageId,
  locale,
  capturedAt = new Date().toISOString(),
}: {
  document: BuilderCanvasDocument;
  pageId: string;
  locale: Locale;
  capturedAt?: string;
}): Promise<DraftRecoverySnapshot> {
  // The exact pretty-printed UTF-8 bytes below are both downloaded and hashed.
  // Parsing those bytes also creates a detached recovery document that cannot
  // be changed by later edits to the live Zustand document.
  const serializedDocument = JSON.stringify(document, null, 2);
  const recoveryDocument = deepFreezeRecoveryValue(
    JSON.parse(serializedDocument) as BuilderCanvasDocument,
  );
  const byteLength = new TextEncoder().encode(serializedDocument).byteLength;
  const checksumSha256 = await sha256HexUtf8(serializedDocument);
  const timestamp = capturedAt.replace(/[:.]/g, '-');
  return Object.freeze({
    capturedAt,
    filename: [
      'builder-local-draft',
      recoveryFilenameSegment(pageId),
      locale,
      timestamp,
    ].join('-') + '.json',
    serializedDocument,
    byteLength,
    checksumSha256,
    document: recoveryDocument,
  });
}

export async function captureStableDraftRecoverySnapshot({
  getCurrentDocument,
  createSnapshot,
}: {
  getCurrentDocument: () => BuilderCanvasDocument | null;
  createSnapshot: (document: BuilderCanvasDocument) => Promise<DraftRecoverySnapshot>;
}): Promise<{
  readonly sourceDocument: BuilderCanvasDocument;
  readonly snapshot: DraftRecoverySnapshot;
} | null> {
  while (true) {
    const sourceDocument = getCurrentDocument();
    if (!sourceDocument) return null;
    const snapshot = await createSnapshot(sourceDocument);
    if (getCurrentDocument() !== sourceDocument) continue;
    return { sourceDocument, snapshot };
  }
}

export async function createDraftConflictTransition({
  authoritativeDraftMeta,
  pageId,
  locale,
  expectedRevision,
  currentRevision,
  currentSavedAt,
  localDocument,
}: {
  authoritativeDraftMeta: DraftMeta | null;
  pageId: string;
  locale: Locale;
  expectedRevision: number | null;
  currentRevision: number | null;
  currentSavedAt?: string;
  localDocument: BuilderCanvasDocument;
}): Promise<{
  readonly authoritativeDraftMeta: DraftMeta | null;
  readonly conflict: DraftConflict;
}> {
  const localRecovery = await createDraftRecoverySnapshot({
    document: localDocument,
    pageId,
    locale,
  });
  return Object.freeze({
    // Preserve the exact authoritative object. A conflict response describes
    // server-current metadata, but it is not a successful local save.
    authoritativeDraftMeta,
    conflict: Object.freeze({
      errorCode: 'draft_conflict' as const,
      pageId,
      locale,
      expectedRevision,
      currentRevision,
      currentSavedAt,
      localRecovery,
      canSaveLocalVersion: false as const,
    }),
  });
}

export function buildDraftRecoveryDownload(snapshot: DraftRecoverySnapshot): {
  readonly blob: Blob;
  readonly filename: string;
} {
  return {
    blob: new Blob([snapshot.serializedDocument], { type: 'application/json;charset=utf-8' }),
    filename: snapshot.filename,
  };
}

export function downloadDraftRecovery(snapshot: DraftRecoverySnapshot): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  const { blob, filename } = buildDraftRecoveryDownload(snapshot);
  const objectUrl = window.URL.createObjectURL(blob);
  try {
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = filename;
    anchor.rel = 'noopener';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    return true;
  } finally {
    window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 0);
  }
}

export function isDraftConflictBlocking(conflict: DraftConflict | null): boolean {
  return conflict !== null;
}

interface DraftResponseBody {
  draft?: DraftMeta | null;
  document?: BuilderCanvasDocument;
  snapshot?: { document?: BuilderCanvasDocument };
}

export type ServerLatestDraftChoice =
  | { readonly status: 'apply'; readonly document: BuilderCanvasDocument; readonly draft: DraftMeta | null }
  | { readonly status: 'blocked' };

export function resolveServerLatestDraftChoice({
  backupDownloaded,
  scopeCurrent,
  conflictCurrent,
  document,
  draft,
}: {
  backupDownloaded: boolean;
  scopeCurrent: boolean;
  conflictCurrent: boolean;
  document: BuilderCanvasDocument | null;
  draft: DraftMeta | null;
}): ServerLatestDraftChoice {
  if (!backupDownloaded || !scopeCurrent || !conflictCurrent || !document) {
    return { status: 'blocked' };
  }
  // Return the exact server response object. Conflict resolution must never
  // merge/rebase the preserved local draft into this explicit server choice.
  return { status: 'apply', document, draft };
}

interface CreatePageResponseBody {
  success?: boolean;
  pageId?: string;
  page?: BuilderPageSummary;
  error?: string;
  message?: string;
}

type MissingExpectedRevisionSaveResolution =
  | {
      status: 'accept-saved';
      draft: DraftMeta;
      document: BuilderCanvasDocument;
    }
  | {
      status: 'conflict';
      draft: DraftMeta;
    }
  | {
      status: 'missing';
    };

type ToastOptions = {
  actionLabel?: string;
  onAction?: () => void;
  ttlMs?: number;
};

async function fetchSiteDraft(
  pageId: string,
  locale: Locale,
  siteId: string,
): Promise<{ draft: DraftMeta | null; document: BuilderCanvasDocument | null } | null> {
  const response = await fetch(
    `/api/builder/site/pages/${encodeURIComponent(pageId)}/draft?${siteScopedQuery(locale, siteId)}`,
    { credentials: 'same-origin' },
  );
  if (!response.ok) return null;
  const data = (await response.json()) as DraftResponseBody;
  const document = data.snapshot?.document ?? data.document ?? null;
  const draft = data.draft ?? (document ? { revision: 0, savedAt: document.updatedAt } : null);
  return { draft, document };
}

const AUTO_DECOMPOSE_STANDARD_SLUGS = new Set<string>(
  DECOMPOSABLE_PAGE_SLUGS.filter((slug) => slug !== '' && slug !== 'faq'),
);

function normalizeDraftSlug(slug: string | undefined): string {
  return slug?.trim().replace(/^\/+|\/+$/g, '') ?? '';
}

function isDecomposablePageSlug(slug: string): boolean {
  return DECOMPOSABLE_PAGE_SLUGS.some((candidate) => candidate === slug);
}

function hasCompositeContentOverrides(node: BuilderCanvasDocument['nodes'][number]): boolean {
  if (node.kind !== 'composite') return false;
  const overrides = node.content.config?.overrides;
  return (
    !!overrides
    && typeof overrides === 'object'
    && !Array.isArray(overrides)
    && Object.keys(overrides).length > 0
  );
}

function hasCompositeOverrides(document: BuilderCanvasDocument): boolean {
  return document.nodes.some(hasCompositeContentOverrides);
}

export function shouldAutoDecomposeStandardPageDraft(
  document: BuilderCanvasDocument,
  slug: string | undefined,
): boolean {
  const normalizedSlug = normalizeDraftSlug(slug);
  if (!AUTO_DECOMPOSE_STANDARD_SLUGS.has(normalizedSlug)) return false;
  return isStandardPageLiveCompositeDraft(document, normalizedSlug);
}

function isStandardPageLiveCompositeDraft(
  document: BuilderCanvasDocument,
  normalizedSlug: string,
): boolean {
  if (document.nodes.length !== 2) return false;
  if (hasCompositeOverrides(document)) return false;

  const composites = document.nodes.filter((node) => node.kind === 'composite');
  if (composites.length !== 1) return false;
  const [composite] = composites;
  if (!composite || composite.kind !== 'composite') return false;

  return composite.content.componentKey === `legacy-page-${normalizedSlug}`;
}

export function shouldOfferDecomposeCurrentPage(
  document: BuilderCanvasDocument,
  slug: string | undefined,
): boolean {
  const normalizedSlug = normalizeDraftSlug(slug);
  if (!isDecomposablePageSlug(normalizedSlug)) return false;
  if (hasCompositeOverrides(document)) return false;
  if (shouldAutoDecomposeStandardPageDraft(document, normalizedSlug)) return true;
  if (normalizedSlug !== '') return isStandardPageLiveCompositeDraft(document, normalizedSlug);
  if (document.nodes.some((node) => node.id === 'home-hero-root')) return false;
  return document.nodes.some((node) => node.kind === 'composite');
}

async function decomposeStandardPageDraft(slug: string, locale: Locale, siteId: string): Promise<boolean> {
  const response = await fetch(
    `/api/builder/site/pages/decompose?${siteScopedQuery(locale, siteId)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ siteId, slug, locale }),
    },
  );
  return response.ok;
}

function areCanvasDocumentsSame(left: BuilderCanvasDocument, right: BuilderCanvasDocument): boolean {
  if (left === right) return true;
  return (
    left.version === right.version
    && left.locale === right.locale
    && left.updatedAt === right.updatedAt
    && left.updatedBy === right.updatedBy
    && left.stageWidth === right.stageWidth
    && left.stageHeight === right.stageHeight
    && JSON.stringify(left.nodes) === JSON.stringify(right.nodes)
  );
}

function areDraftMetasSame(left: DraftMeta | null | undefined, right: DraftMeta | null | undefined): boolean {
  if (!left || !right) return false;
  return (
    left.revision === right.revision
    && left.savedAt === right.savedAt
    && left.updatedBy === right.updatedBy
  );
}

export function shouldKeepInitialDocumentForInitialDraftLoad({
  activePageId,
  fetchedDocument,
  fetchedDraft,
  initialDocument,
  initialDraft,
  initialPageId,
}: {
  activePageId: string | null;
  fetchedDocument: BuilderCanvasDocument;
  fetchedDraft: DraftMeta | null | undefined;
  initialDocument: BuilderCanvasDocument;
  initialDraft: DraftMeta | null | undefined;
  initialPageId: string | null;
}): boolean {
  if (activePageId !== initialPageId) return false;
  if (!areDraftMetasSame(fetchedDraft, initialDraft)) return false;
  return !areCanvasDocumentsSame(fetchedDocument, initialDocument);
}

export function areDraftDocumentsEquivalentForStaleRevision(
  left: BuilderCanvasDocument,
  right: BuilderCanvasDocument,
): boolean {
  if (left === right) return true;
  return (
    left.version === right.version
    && left.locale === right.locale
    && left.updatedAt === right.updatedAt
    && left.stageWidth === right.stageWidth
    && left.stageHeight === right.stageHeight
    && JSON.stringify(left.nodes) === JSON.stringify(right.nodes)
  );
}

export function resolveMissingExpectedRevisionDraftSave(
  latest: { draft: DraftMeta | null; document: BuilderCanvasDocument | null } | null,
  nextDocument: BuilderCanvasDocument,
): MissingExpectedRevisionSaveResolution {
  if (!latest?.draft) return { status: 'missing' };
  if (
    latest.document
    && areDraftDocumentsEquivalentForStaleRevision(latest.document, nextDocument)
  ) {
    return {
      status: 'accept-saved',
      draft: latest.draft,
      document: latest.document,
    };
  }
  return {
    status: 'conflict',
    draft: latest.draft,
  };
}

async function isSiteDraftMissing(pageId: string, locale: Locale, siteId: string): Promise<boolean> {
  const response = await fetch(
    `/api/builder/site/pages/${encodeURIComponent(pageId)}/draft?${siteScopedQuery(locale, siteId)}`,
    { credentials: 'same-origin' },
  );
  return response.status === 404;
}

function columnsPageTitle(locale: Locale): string {
  if (locale === 'zh-hant') return '昊鼎專欄';
  if (locale === 'en') return 'Columns';
  return '호정칼럼';
}

export function useSandboxSiteState({
  initialDocument,
  initialDraftMeta,
  locale,
  siteId,
  initialPageId,
  siteSettings,
  siteTheme,
  navItems,
  currentSlug,
  sitePages,
  canvasDocument,
  hasLocalHistory,
  mutationBaseDocument,
  replaceDocument,
  setDraftSaveState,
  pushToast,
  onMissingHeaderPage,
}: {
  initialDocument: BuilderCanvasDocument;
  initialDraftMeta?: DraftMeta | null;
  locale: Locale;
  siteId: string;
  initialPageId?: string;
  siteSettings?: BuilderSiteSettings;
  siteTheme?: BuilderTheme;
  navItems?: BuilderNavItem[];
  currentSlug?: string;
  sitePages?: BuilderPageSummary[];
  canvasDocument: BuilderCanvasDocument | null;
  hasLocalHistory: boolean;
  mutationBaseDocument: BuilderCanvasDocument | null;
  replaceDocument: (document: BuilderCanvasDocument, options?: { preserveSelection?: boolean }) => void;
  setDraftSaveState: (state: 'idle' | 'saving' | 'saved' | 'error') => void;
  pushToast: (message: string, tone: 'success' | 'error', options?: ToastOptions) => void;
  onMissingHeaderPage?: (href: string) => void;
}) {
  const initialDraftLoadedRef = useRef(false);
  const initialPageIdRef = useRef<string | null>(initialPageId ?? null);
  const localePropRef = useRef(locale);
  const activeScopeControllerRef = useRef<DraftSaveScopeController | null>(null);
  if (activeScopeControllerRef.current === null) {
    activeScopeControllerRef.current = createDraftSaveScopeController(initialPageId ?? null, locale);
  }
  const activeScopeController = activeScopeControllerRef.current;
  const canvasDocumentRef = useRef<BuilderCanvasDocument | null>(canvasDocument);
  const canvasDocumentPropRef = useRef<BuilderCanvasDocument | null>(canvasDocument);
  const syncedDocumentRef = useRef<{
    scope: DraftSaveScope;
    document: BuilderCanvasDocument;
  }>({
    scope: activeScopeController.current(),
    document: initialDocument,
  });
  const markDraftDocumentSynced = useCallback((
    scope: DraftSaveScope,
    document: BuilderCanvasDocument,
  ) => {
    if (!activeScopeController.isCurrent(scope)) return;
    syncedDocumentRef.current = { scope, document };
  }, [activeScopeController]);
  const hasLocalHistoryRef = useRef(hasLocalHistory);
  const mutationBaseDocumentRef = useRef<BuilderCanvasDocument | null>(mutationBaseDocument);
  const autosaveTimerRef = useRef<number | null>(null);
  const draftSaveQueueRef = useRef<DraftSaveQueue | null>(null);
  if (draftSaveQueueRef.current === null) {
    draftSaveQueueRef.current = createDraftSaveQueue();
  }
  const navigationQueueRef = useRef<SerializedTaskQueue | null>(null);
  if (navigationQueueRef.current === null) {
    navigationQueueRef.current = createSerializedTaskQueue();
  }
  const nextNavigationIntentRef = useRef(0);
  const latestNavigationIntentRef = useRef(0);
  const nextExternalTransitionIdRef = useRef(0);
  const pendingExternalTransitionRef = useRef<ExternalPropTransition | null>(null);
  const enqueuedExternalTransitionIdsRef = useRef(new Set<number>());
  const mountedRef = useRef(true);
  const appliedPropDocumentRef = useRef<BuilderCanvasDocument | null>(null);
  const appliedPropDraftMetaRef = useRef<DraftMeta | null | undefined>(undefined);
  const [syncedUpdatedAt, setSyncedUpdatedAtState] = useState(initialDocument.updatedAt);
  const syncedUpdatedAtRef = useRef(initialDocument.updatedAt);
  const setSyncedUpdatedAt = useCallback((updatedAt: string) => {
    syncedUpdatedAtRef.current = updatedAt;
    setSyncedUpdatedAtState(updatedAt);
  }, []);
  const [draftMeta, setDraftMetaState] = useState<DraftMeta | null>(initialDraftMeta ?? null);
  const draftMetaRef = useRef<DraftMeta | null>(initialDraftMeta ?? null);
  const setDraftMeta = useCallback((nextDraftMeta: DraftMeta | null) => {
    draftMetaRef.current = nextDraftMeta;
    setDraftMetaState(nextDraftMeta);
  }, []);
  const [draftConflict, setDraftConflictState] = useState<DraftConflict | null>(null);
  const draftConflictRef = useRef<DraftConflict | null>(null);
  const setDraftConflict = useCallback((nextConflict: DraftConflict | null) => {
    draftConflictRef.current = nextConflict;
    setDraftConflictState(nextConflict);
  }, []);
  const [activePageId, setActivePageId] = useState<string | null>(initialPageId ?? null);
  const [activeCanvasLocale, setActiveCanvasLocale] = useState<Locale>(locale);
  const [siteSettingsState, setSiteSettingsState] = useState<BuilderSiteSettings | undefined>(siteSettings);
  const [siteThemeState, setSiteThemeState] = useState<BuilderTheme>(siteTheme ?? DEFAULT_THEME);
  const [navItemsState, setNavItemsState] = useState<BuilderNavItem[]>(navItems ?? []);
  const [sitePagesState, setSitePagesState] = useState<BuilderPageSummary[]>(() => (
    filterVisiblePageSwitcherPages(sitePages ?? [])
  ));
  const [columnPostsSummary, setColumnPostsSummary] = useState<ColumnPostsSummary>({
    loading: true,
    total: null,
    posts: [],
    error: null,
  });
  const [columnsPageLookupPending, setColumnsPageLookupPending] = useState(false);
  const [currentSlugState, setCurrentSlugStateValue] = useState(currentSlug ?? '');
  const currentSlugStateRef = useRef(currentSlug ?? '');
  const setCurrentSlugState = useCallback((nextSlug: string) => {
    currentSlugStateRef.current = nextSlug;
    setCurrentSlugStateValue(nextSlug);
  }, []);
  const [saveBlockReason, setSaveBlockReasonState] = useState<string | null>(null);
  const [externalTransitionRetryToken, setExternalTransitionRetryToken] = useState(0);
  const saveBlockReasonRef = useRef<string | null>(null);
  const setSaveBlockReason = useCallback((nextReason: string | null) => {
    saveBlockReasonRef.current = nextReason;
    setSaveBlockReasonState(nextReason);
  }, []);
  const canDecomposeCurrentPage = useMemo(
    () => shouldOfferDecomposeCurrentPage(canvasDocument ?? initialDocument, currentSlugState),
    [canvasDocument, currentSlugState, initialDocument],
  );

  useEffect(() => {
    const enqueuedExternalTransitionIds = enqueuedExternalTransitionIdsRef.current;
    mountedRef.current = true;
    const activeScope = activeScopeController.current();
    if (!activeScopeController.isCurrent(syncedDocumentRef.current.scope)) {
      syncedDocumentRef.current = {
        scope: activeScope,
        document: canvasDocumentRef.current ?? syncedDocumentRef.current.document,
      };
    }
    return () => {
      mountedRef.current = false;
      initialDraftLoadedRef.current = false;
      pendingExternalTransitionRef.current = null;
      enqueuedExternalTransitionIds.clear();
      const unmountIntentSeq = nextNavigationIntentRef.current + 1;
      nextNavigationIntentRef.current = unmountIntentSeq;
      latestNavigationIntentRef.current = unmountIntentSeq;
      appliedPropDocumentRef.current = null;
      appliedPropDraftMetaRef.current = undefined;
      activeScopeController.invalidate();
    };
  }, [activeScopeController]);

  // Reconciliation runs in a layout effect in the browser. Mirror render-time
  // values synchronously so it never observes the previous render's dirty or
  // transient-mutation state through refs.
  if (canvasDocumentPropRef.current !== canvasDocument) {
    canvasDocumentPropRef.current = canvasDocument;
    canvasDocumentRef.current = canvasDocument;
  }
  hasLocalHistoryRef.current = hasLocalHistory;
  mutationBaseDocumentRef.current = mutationBaseDocument;

  const replaceDocumentIfChanged = useCallback(
    (
      nextDocument: BuilderCanvasDocument,
      options: {
        preserveSelection?: boolean;
        resetSelectionWhenSame?: boolean;
        skipWhenLocalHistory?: boolean;
        forceReplace?: boolean;
      } = {},
    ): ReplaceDocumentResult => {
      const currentDocument = canvasDocumentRef.current;
      if (currentDocument && options.skipWhenLocalHistory && hasLocalHistoryRef.current) {
        return 'skipped-local-history';
      }
      if (!options.forceReplace && currentDocument && areCanvasDocumentsSame(currentDocument, nextDocument)) {
        if (options.resetSelectionWhenSame) {
          canvasDocumentRef.current = nextDocument;
          hasLocalHistoryRef.current = false;
          mutationBaseDocumentRef.current = null;
          replaceDocument(nextDocument);
          return 'applied';
        }
        return 'same';
      }
      // Keep imperative navigation/save reads coherent before React publishes
      // the store update. A queued B -> C navigation may begin in the next
      // microtask, earlier than the effects that mirror these values.
      canvasDocumentRef.current = nextDocument;
      hasLocalHistoryRef.current = false;
      mutationBaseDocumentRef.current = null;
      replaceDocument(nextDocument, { preserveSelection: options.preserveSelection });
      return 'applied';
    },
    [replaceDocument],
  );

  const loadDraft = useCallback(
    async (pageId: string, nextLocale: Locale, options: LoadDraftOptions = {}): Promise<boolean> => {
      const requestScope = activeScopeController.current();
      if (requestScope.pageId !== pageId || requestScope.locale !== nextLocale) return false;
      const isCurrentLoad = () => activeScopeController.isCurrent(requestScope);
      const requestDocumentUpdatedAt = canvasDocumentRef.current?.updatedAt ?? initialDocument.updatedAt;
      const requestHadLocalHistory = hasLocalHistoryRef.current;
      let payload = await fetchSiteDraft(pageId, nextLocale, siteId);
      if (!payload?.document) return false;
      let draftDocument = payload.document;
      if (!isCurrentLoad()) return false;
      const draftSlug = normalizeDraftSlug(options.slug);
      if (shouldAutoDecomposeStandardPageDraft(draftDocument, draftSlug)) {
        const decomposed = await decomposeStandardPageDraft(draftSlug, nextLocale, siteId);
        if (!isCurrentLoad()) return false;
        if (decomposed) {
          const decomposedPayload = await fetchSiteDraft(pageId, nextLocale, siteId);
          if (!isCurrentLoad()) return false;
          if (decomposedPayload?.document) {
            payload = decomposedPayload;
            draftDocument = decomposedPayload.document;
          }
        }
      }
      if (options.skipIfEditedSinceRequest && !requestHadLocalHistory && hasLocalHistoryRef.current) {
        return false;
      }
      if (options.skipIfEditedSinceRequest && mutationBaseDocumentRef.current) return false;
      if (!isCurrentLoad()) return false;
      if (
        options.skipIfEditedSinceRequest
        && canvasDocumentRef.current
        && canvasDocumentRef.current.updatedAt !== requestDocumentUpdatedAt
        && canvasDocumentRef.current.updatedAt !== initialDocument.updatedAt
      ) {
        return false;
      }
      if (
        options.skipIfEditedSinceRequest
        && shouldKeepInitialDocumentForInitialDraftLoad({
          activePageId: activeScopeController.current().pageId,
          fetchedDocument: draftDocument,
          fetchedDraft: payload.draft,
          initialDocument,
          initialDraft: initialDraftMeta ?? null,
          initialPageId: initialPageIdRef.current,
        })
      ) {
        markDraftDocumentSynced(requestScope, initialDocument);
        setSyncedUpdatedAt(initialDocument.updatedAt);
        setDraftMeta(payload.draft ?? initialDraftMeta ?? null);
        setDraftConflict(null);
        setDraftSaveState('idle');
        setSaveBlockReason(null);
        return true;
      }
      replaceDocumentIfChanged(draftDocument, {
        preserveSelection: options.skipIfEditedSinceRequest === true,
        forceReplace: options.forceReplace,
      });
      markDraftDocumentSynced(requestScope, draftDocument);
      setSyncedUpdatedAt(draftDocument.updatedAt);
      setDraftMeta(payload.draft);
      setDraftConflict(null);
      setDraftSaveState('idle');
      setSaveBlockReason(null);
      return true;
    },
    [
      activeScopeController,
      initialDocument,
      initialDraftMeta,
      markDraftDocumentSynced,
      replaceDocumentIfChanged,
      setDraftConflict,
      setDraftMeta,
      setDraftSaveState,
      setSaveBlockReason,
      setSyncedUpdatedAt,
      siteId,
    ],
  );

  const fetchDraftForNavigation = useCallback(async (
    pageId: string,
    nextLocale: Locale,
    slug: string | undefined,
    sourceScope: DraftSaveScope,
  ): Promise<{ document: BuilderCanvasDocument; draft: DraftMeta | null } | null> => {
    const isCurrentSource = () => mountedRef.current
      && activeScopeController.isCurrent(sourceScope);
    if (!isCurrentSource()) return null;
    let payload = await fetchSiteDraft(pageId, nextLocale, siteId);
    if (!isCurrentSource() || !payload?.document) return null;
    let draftDocument = payload.document;
    const draftSlug = normalizeDraftSlug(slug);
    if (shouldAutoDecomposeStandardPageDraft(draftDocument, draftSlug)) {
      const decomposed = await decomposeStandardPageDraft(draftSlug, nextLocale, siteId);
      if (!isCurrentSource()) return null;
      if (decomposed) {
        const decomposedPayload = await fetchSiteDraft(pageId, nextLocale, siteId);
        if (!isCurrentSource()) return null;
        if (decomposedPayload?.document) {
          payload = decomposedPayload;
          draftDocument = decomposedPayload.document;
        }
      }
    }
    return {
      document: draftDocument,
      draft: payload.draft,
    };
  }, [activeScopeController, siteId]);

  const fetchLocaleScopedSiteState = useCallback(async (
    nextLocale: Locale,
    sourceScope: DraftSaveScope,
  ): Promise<LocaleScopedSiteState | null> => {
    const isCurrentSource = () => mountedRef.current
      && activeScopeController.isCurrent(sourceScope);
    if (!isCurrentSource()) return null;

    const query = siteScopedQuery(nextLocale, siteId);
    const [pagesResponse, navigationResponse, settingsResponse] = await Promise.all([
      fetch(`/api/builder/site/pages?${query}`, { credentials: 'same-origin' }),
      fetch(`/api/builder/site/navigation?${query}`, { credentials: 'same-origin' }),
      fetch(`/api/builder/site/settings?${query}`, { credentials: 'same-origin' }),
    ]);
    if (!isCurrentSource()) return null;
    if (!pagesResponse.ok || !navigationResponse.ok || !settingsResponse.ok) return null;

    const [pagesPayload, navigationPayload, settingsPayload] = await Promise.all([
      pagesResponse.json() as Promise<{ pages?: BuilderPageSummary[] }>,
      navigationResponse.json() as Promise<{ navigation?: BuilderNavItem[] }>,
      settingsResponse.json() as Promise<{
        settings?: BuilderSiteSettings;
        theme?: BuilderTheme;
      }>,
    ]);
    if (!isCurrentSource()) return null;
    if (
      !Array.isArray(pagesPayload.pages)
      || !Array.isArray(navigationPayload.navigation)
      || !settingsPayload.theme
    ) {
      return null;
    }

    return {
      siteSettings: settingsPayload.settings,
      siteTheme: settingsPayload.theme,
      navItems: navigationPayload.navigation,
      sitePages: filterVisiblePageSwitcherPages(pagesPayload.pages),
    };
  }, [activeScopeController, siteId]);

  const commitLoadedNavigationDraft = useCallback(({
    pageId,
    nextLocale,
    payload,
    previousScope,
    slug,
    localeSiteState,
  }: {
    pageId: string;
    nextLocale: Locale;
    payload: { document: BuilderCanvasDocument; draft: DraftMeta | null };
    previousScope: DraftSaveScope;
    slug?: string;
    localeSiteState?: LocaleScopedSiteState;
  }) => {
    const scopeChanged = previousScope.pageId !== pageId || previousScope.locale !== nextLocale;
    const targetScope = activeScopeController.transition(pageId, nextLocale);
    replaceDocumentIfChanged(payload.document, {
      forceReplace: scopeChanged,
      resetSelectionWhenSame: true,
    });
    markDraftDocumentSynced(targetScope, payload.document);
    setSyncedUpdatedAt(payload.document.updatedAt);
    setDraftMeta(payload.draft);
    setDraftConflict(null);
    setSaveBlockReason(null);
    setDraftSaveState('idle');
    if (localeSiteState) {
      setSiteSettingsState(localeSiteState.siteSettings);
      setSiteThemeState(localeSiteState.siteTheme);
      setNavItemsState(localeSiteState.navItems);
      setSitePagesState(localeSiteState.sitePages);
    }
    setActivePageId(pageId);
    setActiveCanvasLocale(nextLocale);
    if (typeof slug === 'string') setCurrentSlugState(slug);
    return targetScope;
  }, [
    activeScopeController,
    markDraftDocumentSynced,
    replaceDocumentIfChanged,
    setCurrentSlugState,
    setDraftConflict,
    setDraftMeta,
    setDraftSaveState,
    setSaveBlockReason,
    setSyncedUpdatedAt,
  ]);

  useEffect(() => {
    if (!activePageId || initialDraftLoadedRef.current) return;
    const activeScope = activeScopeController.current();
    if (activeScope.pageId !== activePageId) return;
    initialDraftLoadedRef.current = true;
    void loadDraft(activePageId, activeScope.locale, {
      skipIfEditedSinceRequest: true,
      slug: currentSlugState,
    });
  }, [activePageId, activeScopeController, currentSlugState, loadDraft]);

  useEffect(() => {
    if (localePropRef.current !== locale || activeCanvasLocale !== locale) return;
    setSiteSettingsState(siteSettings);
  }, [activeCanvasLocale, locale, siteSettings]);

  useEffect(() => {
    if (localePropRef.current !== locale || activeCanvasLocale !== locale) return;
    setSiteThemeState(siteTheme ?? DEFAULT_THEME);
  }, [activeCanvasLocale, locale, siteTheme]);

  useEffect(() => {
    if (localePropRef.current !== locale || activeCanvasLocale !== locale) return;
    setNavItemsState(navItems ?? []);
  }, [activeCanvasLocale, locale, navItems]);

  useEffect(() => {
    if (localePropRef.current !== locale || activeCanvasLocale !== locale) return;
    setSitePagesState(filterVisiblePageSwitcherPages(sitePages ?? []));
  }, [activeCanvasLocale, locale, sitePages]);

  useEffect(() => {
    let cancelled = false;
    setColumnPostsSummary((state) => ({ ...state, loading: true, error: null }));
    const params = new URLSearchParams({
      locale: activeCanvasLocale,
      scope: 'all',
      limit: '5',
    });

    fetch(`/api/builder/blog/posts?${params.toString()}`, { credentials: 'same-origin' })
      .then((response) => response.json())
      .then((payload: unknown) => {
        if (cancelled) return;
        if (!payload || typeof payload !== 'object') throw new Error('invalid_response');
        const result = payload as {
          ok?: boolean;
          total?: number;
          error?: string;
          posts?: Array<{ slug?: string; title?: string }>;
        };
        if (!result.ok || !Array.isArray(result.posts)) {
          throw new Error(result.error || 'columns_unavailable');
        }

        setColumnPostsSummary({
          loading: false,
          total: typeof result.total === 'number' ? result.total : result.posts.length,
          posts: result.posts
            .filter((post): post is { slug: string; title: string } => Boolean(post.slug && post.title))
            .map((post) => ({ slug: post.slug, title: post.title })),
          error: null,
        });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setColumnPostsSummary({
          loading: false,
          total: null,
          posts: [],
          error: error instanceof Error ? error.message : 'columns_unavailable',
        });
      });

    return () => {
      cancelled = true;
    };
  }, [activeCanvasLocale]);

  const saveDraftDocument = useCallback(
    (nextDocument: BuilderCanvasDocument): Promise<boolean> => {
      const requestScope = activeScopeController.current();
      const isCurrentRequest = () => activeScopeController.isCurrent(requestScope);

      return draftSaveQueueRef.current!.enqueue(requestScope, nextDocument, async () => {
        if (!isCurrentRequest()) return true;
        // Read after the previous queued save settles so consecutive local
        // autosaves use the revision advanced by their predecessor.
        const requestExpectedRevision = draftMetaRef.current?.revision;
        const failHttpSave = (status: number): false => {
          if (!isCurrentRequest()) return false;
          const isTransientHttpFailure = status === 408 || status === 429 || status >= 500;
          const failure = status === 400
            ? {
              reason: '저장 요청이 올바르지 않아 이동을 중단했습니다. 페이지를 새로고침해 상태를 확인해주세요.',
              retryable: false,
            }
            : status === 404
              ? {
                reason: '현재 페이지 draft를 찾을 수 없어 이동을 중단했습니다. Pages에서 페이지 상태를 확인해주세요.',
                retryable: false,
              }
              : status === 422
                ? {
                  reason: '현재 draft 데이터 검증에 실패해 이동을 중단했습니다. 로컬 편집본은 그대로 유지됩니다.',
                  retryable: false,
                }
                : status === 429
                  ? {
                    reason: '저장 요청이 잠시 제한되었습니다. 잠시 후 다시 시도해주세요.',
                    retryable: true,
                  }
                  : {
                    reason: `초안을 저장할 수 없어 이동을 중단했습니다. (HTTP ${status})`,
                    retryable: isTransientHttpFailure,
                  };
          setSaveBlockReason(failure.reason);
          setDraftSaveState('error');
          pushToast(failure.reason, 'error', {
            actionLabel: failure.retryable ? '다시 시도' : undefined,
            ttlMs: 8000,
            onAction: failure.retryable
              ? () => {
                if (!isCurrentRequest() || saveBlockReasonRef.current !== failure.reason) return;
                setSaveBlockReason(null);
                setDraftSaveState('idle');
              }
              : undefined,
          });
          return false;
        };

        if (!requestScope.pageId) {
          const response = await fetch(`/api/builder/sandbox/draft?locale=${requestScope.locale}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({ document: nextDocument }),
          });
          if (!response.ok) return failHttpSave(response.status);
          if (!isCurrentRequest()) return true;
          markDraftDocumentSynced(requestScope, nextDocument);
          setSyncedUpdatedAt(nextDocument.updatedAt);
          setDraftSaveState('saved');
          setSaveBlockReason(null);
          return true;
        }

        const putDraft = (expectedRevision: number | undefined) =>
          fetch(`/api/builder/site/pages/${requestScope.pageId}/draft?${siteScopedQuery(requestScope.locale, siteId)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({ siteId, expectedRevision, document: nextDocument }),
          });

        const response = await putDraft(requestExpectedRevision);
        if (!isCurrentRequest()) return true;

        if (response.status === 428) {
          const latest = await fetchSiteDraft(requestScope.pageId, requestScope.locale, siteId);
          if (!isCurrentRequest()) return true;
          const resolution = resolveMissingExpectedRevisionDraftSave(latest, nextDocument);
          if (resolution.status === 'missing') return failHttpSave(response.status);
          if (resolution.status === 'accept-saved') {
            setDraftMeta(resolution.draft);
            markDraftDocumentSynced(requestScope, nextDocument);
            setSyncedUpdatedAt(resolution.document.updatedAt);
            setDraftConflict(null);
            setDraftSaveState('saved');
            setSaveBlockReason(null);
            return true;
          }
          // This is `draft_expected_revision_required`, not an exact
          // `draft_conflict`. Retain the authoritative meta and local document,
          // but fail closed instead of mislabelling every revision error as a
          // stale-writer conflict.
          const reason = '저장 리비전 정보가 없어 자동 저장을 멈췄습니다. 로컬 변경을 보존한 채 다시 불러와 주세요.';
          setSaveBlockReason(reason);
          setDraftSaveState('error');
          pushToast(reason, 'error', { ttlMs: 8000 });
          return false;
        }

        let conflictBody: DraftConflictResponseBody | null = null;
        if (response.status === 409) {
          conflictBody = (await response.json().catch(() => ({}))) as DraftConflictResponseBody;
          if (!isCurrentRequest()) return true;
        }

        if (response.status === 409) {
          const exactConflict = readExactDraftConflict(response.status, conflictBody);
          if (exactConflict) {
            const latestLocalDocument = canvasDocumentRef.current ?? nextDocument;
            const transition = await createDraftConflictTransition({
              authoritativeDraftMeta: draftMetaRef.current,
              pageId: requestScope.pageId,
              locale: requestScope.locale,
              expectedRevision: requestExpectedRevision ?? null,
              currentRevision: exactConflict.currentRevision,
              currentSavedAt: exactConflict.currentSavedAt,
              localDocument: latestLocalDocument,
            });
            if (!isCurrentRequest()) return true;
            // Do not advance draftMeta or mark the local document synced here.
            // The server revision belongs only to this explicit conflict state.
            setDraftConflict(transition.conflict);
            setDraftSaveState('error');
            return false;
          }

          // Locale mismatch and every other HTTP 409 are not stale-writer
          // conflicts. They still fail closed so autosave/navigation/publish do
          // not continue after an unresolved save error.
          const reason = typeof conflictBody?.message === 'string'
            ? conflictBody.message
            : typeof conflictBody?.error === 'string'
              ? conflictBody.error
            : '현재 페이지 초안을 저장할 수 없어 저장과 이동을 멈췄습니다.';
          setSaveBlockReason(reason);
          setDraftSaveState('error');
          pushToast(reason, 'error', { ttlMs: 8000 });
          return false;
        }

        if (response.status === 401 || response.status === 403) {
          const reason = '로그인이 만료되어 저장할 수 없습니다. 다시 로그인한 뒤 시도해주세요.';
          setSaveBlockReason(reason);
          setDraftSaveState('error');
          pushToast(reason, 'error', { ttlMs: 7000 });
          return false;
        }

        if (response.status >= 500) {
          return failHttpSave(response.status);
        }

        if (!response.ok) return failHttpSave(response.status);

        const data = (await response.json()) as DraftResponseBody;
        if (!isCurrentRequest()) return true;
        if (data.draft) setDraftMeta(data.draft);
        markDraftDocumentSynced(requestScope, nextDocument);
        setSyncedUpdatedAt(data.document?.updatedAt ?? nextDocument.updatedAt);
        setDraftConflict(null);
        setDraftSaveState('saved');
        setSaveBlockReason(null);
        return true;
      });
    },
    [
      activeScopeController,
      markDraftDocumentSynced,
      pushToast,
      setDraftConflict,
      setDraftMeta,
      setDraftSaveState,
      setSaveBlockReason,
      setSyncedUpdatedAt,
      siteId,
    ],
  );

  useEffect(() => {
    if (!canvasDocument) return undefined;
    if (mutationBaseDocument) return undefined;
    if (draftConflict) return undefined;
    if (saveBlockReason) return undefined;
    if (canvasDocument.updatedAt === syncedUpdatedAt) return undefined;

    const autosaveScope = activeScopeController.current();
    const isAutosaveScopeCurrent = () => activeScopeController.isCurrent(autosaveScope);
    setDraftSaveState('saving');
    const timer = window.setTimeout(async () => {
      if (autosaveTimerRef.current === timer) autosaveTimerRef.current = null;
      try {
        const saved = await saveDraftDocument(canvasDocument);
        if (!saved && isAutosaveScopeCurrent()) setDraftSaveState('error');
      } catch {
        if (!isAutosaveScopeCurrent()) return;
        setDraftSaveState('error');
        pushToast(NETWORK_ERROR_MESSAGE, 'error', {
          actionLabel: '다시 시도',
          ttlMs: 8000,
          onAction: () => {
            if (!isAutosaveScopeCurrent()) return;
            setDraftSaveState('saving');
            void saveDraftDocument(canvasDocument).catch(() => {
              if (!isAutosaveScopeCurrent()) return;
              setDraftSaveState('error');
              pushToast(NETWORK_ERROR_MESSAGE, 'error', { ttlMs: 6000 });
            });
          },
        });
      }
    }, AUTOSAVE_DEBOUNCE_MS);
    autosaveTimerRef.current = timer;

    return () => {
      if (autosaveTimerRef.current === timer) autosaveTimerRef.current = null;
      window.clearTimeout(timer);
    };
  }, [
    canvasDocument,
    activeScopeController,
    draftConflict,
    mutationBaseDocument,
    saveDraftDocument,
    saveBlockReason,
    setDraftSaveState,
    pushToast,
    syncedUpdatedAt,
  ]);

  const persistCurrentDraftBeforeNavigation = useCallback(async (): Promise<PersistBeforeNavigationResult> => {
    const persistenceScope = activeScopeController.current();
    let saveStarted = false;
    const result = await persistLatestDraftForScope({
      isScopeCurrent: () => activeScopeController.isCurrent(persistenceScope),
      isBlocked: () => Boolean(
        mutationBaseDocumentRef.current
        || draftConflictRef.current
        || saveBlockReasonRef.current
      ),
      getCurrentDocument: () => canvasDocumentRef.current,
      isDocumentSaved: (document) => {
        const syncedDocument = syncedDocumentRef.current;
        return isDraftSaveScopeCurrent(syncedDocument.scope, persistenceScope)
          && syncedDocument.document === document;
      },
      saveDocument: (document) => {
        if (!saveStarted) {
          saveStarted = true;
          if (autosaveTimerRef.current !== null) {
            window.clearTimeout(autosaveTimerRef.current);
            autosaveTimerRef.current = null;
          }
          setDraftSaveState('saving');
        }
        return saveDraftDocument(document);
      },
    });

    if (
      result === 'blocked'
      && saveStarted
      && activeScopeController.isCurrent(persistenceScope)
    ) {
      setDraftSaveState('error');
    }
    return result;
  }, [
    activeScopeController,
    saveDraftDocument,
    setDraftSaveState,
  ]);

  const enqueueExternalPropTransition = useCallback((transition: ExternalPropTransition) => {
    const enqueuedIds = enqueuedExternalTransitionIdsRef.current;
    if (enqueuedIds.has(transition.id)) return;
    enqueuedIds.add(transition.id);

    void navigationQueueRef.current!.enqueue(async () => {
      const isLatestTransition = () => mountedRef.current
        && pendingExternalTransitionRef.current === transition
        && latestNavigationIntentRef.current === transition.intentSeq;
      const previousScope = activeScopeController.current();
      let targetScope: DraftSaveScope | null = null;
      let transitionedScope = false;
      try {
        if (!isLatestTransition()) return;
        const persisted = await persistCurrentDraftBeforeNavigation();
        if (!isLatestTransition()) return;
        if (persisted !== 'saved') {
          if (
            persisted === 'blocked'
            && activeScopeController.isCurrent(previousScope)
            && !draftConflictRef.current
            && !saveBlockReasonRef.current
          ) {
            pushToast(PAGE_SWITCH_SAVE_BLOCKED_MESSAGE, 'error', { ttlMs: 8000 });
          }
          return;
        }

        const currentScope = activeScopeController.current();
        const scopeChanged = currentScope.pageId !== transition.pageId
          || currentScope.locale !== transition.locale;
        targetScope = scopeChanged
          ? activeScopeController.transition(transition.pageId, transition.locale)
          : currentScope;
        transitionedScope = scopeChanged;

        const result = replaceDocumentIfChanged(transition.document, {
          resetSelectionWhenSame: true,
          skipWhenLocalHistory: !scopeChanged,
          forceReplace: scopeChanged,
        });
        if (!isLatestTransition()) return;

        initialPageIdRef.current = transition.pageId;
        localePropRef.current = transition.locale;
        initialDraftLoadedRef.current = true;
        pendingExternalTransitionRef.current = null;
        appliedPropDocumentRef.current = transition.document;
        appliedPropDraftMetaRef.current = transition.draftMeta;
        setActivePageId(transition.pageId);
        setActiveCanvasLocale(transition.locale);
        setCurrentSlugState(transition.slug);
        setSiteSettingsState(transition.siteSettings);
        setSiteThemeState(transition.siteTheme ?? DEFAULT_THEME);
        setNavItemsState(transition.navItems ?? []);
        setSitePagesState(filterVisiblePageSwitcherPages(transition.sitePages ?? []));
        if (result !== 'skipped-local-history') {
          setDraftMeta(transition.draftMeta);
          markDraftDocumentSynced(targetScope, transition.document);
          setSyncedUpdatedAt(transition.document.updatedAt);
        }
        setDraftConflict(null);
        setSaveBlockReason(null);
        setDraftSaveState('idle');
      } catch {
        let rollbackScope: DraftSaveScope | null = null;
        if (
          transitionedScope
          && targetScope
          && activeScopeController.isCurrent(targetScope)
        ) {
          rollbackScope = activeScopeController.transition(previousScope.pageId, previousScope.locale);
          setActivePageId(previousScope.pageId);
          setActiveCanvasLocale(previousScope.locale);
        }
        const effectiveScope = rollbackScope ?? previousScope;
        if (!isLatestTransition() || !activeScopeController.isCurrent(effectiveScope)) return;
        setDraftSaveState('error');
        pushToast(NETWORK_ERROR_MESSAGE, 'error', {
          actionLabel: '다시 시도',
          ttlMs: 8000,
          onAction: () => {
            if (!isLatestTransition() || !activeScopeController.isCurrent(effectiveScope)) return;
            setDraftSaveState('idle');
            setExternalTransitionRetryToken((token) => token + 1);
          },
        });
      } finally {
        enqueuedIds.delete(transition.id);
      }
    });
  }, [
    activeScopeController,
    markDraftDocumentSynced,
    persistCurrentDraftBeforeNavigation,
    pushToast,
    replaceDocumentIfChanged,
    setCurrentSlugState,
    setDraftConflict,
    setDraftMeta,
    setDraftSaveState,
    setSaveBlockReason,
    setSyncedUpdatedAt,
  ]);

  useIsomorphicLayoutEffect(() => {
    const targetPageId = initialPageId ?? null;
    const targetDraftMeta = initialDraftMeta ?? null;
    const targetSlug = currentSlug ?? '';
    const identityChanged = initialPageIdRef.current !== targetPageId
      || localePropRef.current !== locale;

    if (identityChanged) {
      const pending = pendingExternalTransitionRef.current;
      const transition = pending
        && pending.pageId === targetPageId
        && pending.locale === locale
        && pending.document === initialDocument
        && pending.draftMeta === targetDraftMeta
        && pending.slug === targetSlug
        && pending.siteSettings === siteSettings
        && pending.siteTheme === siteTheme
        && pending.navItems === navItems
        && pending.sitePages === sitePages
        ? pending
        : {
          id: nextExternalTransitionIdRef.current + 1,
          intentSeq: nextNavigationIntentRef.current + 1,
          pageId: targetPageId,
          locale,
          document: initialDocument,
          draftMeta: targetDraftMeta,
          slug: targetSlug,
          siteSettings,
          siteTheme,
          navItems,
          sitePages,
        };
      if (transition !== pending) {
        nextExternalTransitionIdRef.current = transition.id;
        nextNavigationIntentRef.current = transition.intentSeq;
        latestNavigationIntentRef.current = transition.intentSeq;
        pendingExternalTransitionRef.current = transition;
      }
      if (!draftConflict && !saveBlockReason && !mutationBaseDocument) {
        enqueueExternalPropTransition(transition);
      }
      return;
    }

    // A parent may return to the already-committed identity while an older
    // target is queued. Cancel that stale intent and apply only this snapshot.
    pendingExternalTransitionRef.current = null;
    const activeScope = activeScopeController.current();
    if (activeScope.pageId !== targetPageId || activeScope.locale !== locale) return;
    setCurrentSlugState(targetSlug);
    setActiveCanvasLocale(locale);
    if (draftConflict || mutationBaseDocument) return;
    if (
      appliedPropDocumentRef.current === initialDocument
      && appliedPropDraftMetaRef.current === targetDraftMeta
    ) {
      return;
    }
    const result = replaceDocumentIfChanged(initialDocument, {
      resetSelectionWhenSame: true,
      skipWhenLocalHistory: true,
    });
    if (result === 'skipped-local-history') return;
    appliedPropDocumentRef.current = initialDocument;
    appliedPropDraftMetaRef.current = targetDraftMeta;
    setDraftMeta(targetDraftMeta);
    markDraftDocumentSynced(activeScope, initialDocument);
    setSyncedUpdatedAt(initialDocument.updatedAt);
  }, [
    activeScopeController,
    currentSlug,
    draftConflict,
    enqueueExternalPropTransition,
    externalTransitionRetryToken,
    hasLocalHistory,
    initialDocument,
    initialDraftMeta,
    initialPageId,
    locale,
    markDraftDocumentSynced,
    mutationBaseDocument,
    navItems,
    replaceDocumentIfChanged,
    saveBlockReason,
    sitePages,
    siteSettings,
    siteTheme,
    setCurrentSlugState,
    setDraftMeta,
    setSyncedUpdatedAt,
  ]);

  const handleLocaleChange = useCallback((newLocale: Locale, linkedPageId: string | null) => {
    const navigationId = nextNavigationIntentRef.current + 1;
    nextNavigationIntentRef.current = navigationId;
    latestNavigationIntentRef.current = navigationId;
    const isLatestNavigation = () => mountedRef.current
      && latestNavigationIntentRef.current === navigationId;

    return navigationQueueRef.current!.enqueue(async () => {
      if (!isLatestNavigation()) return;
      if (!linkedPageId) {
        pushToast(`No linked page for ${newLocale}`, 'error');
        return;
      }

      const previousScope = activeScopeController.current();
      try {
        const persisted = await persistCurrentDraftBeforeNavigation();
        if (!isLatestNavigation() || persisted === 'superseded') return;
        if (persisted === 'blocked') {
          if (isLatestNavigation() && activeScopeController.isCurrent(previousScope)) {
            pushToast(PAGE_SWITCH_SAVE_BLOCKED_MESSAGE, 'error', { ttlMs: 8000 });
          }
          return;
        }
        const localeSiteState = await fetchLocaleScopedSiteState(newLocale, previousScope);
        if (!isLatestNavigation()) return;
        if (!localeSiteState) {
          if (activeScopeController.isCurrent(previousScope)) {
            pushToast('연결된 locale의 사이트 데이터를 불러오지 못했습니다.', 'error', { ttlMs: 8000 });
          }
          return;
        }
        const targetSlug = localeSiteState.sitePages.find((page) => page.pageId === linkedPageId)?.slug
          ?? currentSlugStateRef.current;
        const payload = await fetchDraftForNavigation(
          linkedPageId,
          newLocale,
          targetSlug,
          previousScope,
        );
        if (!isLatestNavigation()) return;
        if (!payload) {
          if (activeScopeController.isCurrent(previousScope)) {
            pushToast('연결된 locale 페이지 draft를 불러오지 못했습니다.', 'error', { ttlMs: 8000 });
          }
          return;
        }
        const finalPersisted = await persistCurrentDraftBeforeNavigation();
        if (!isLatestNavigation() || finalPersisted !== 'saved') {
          if (
            finalPersisted === 'blocked'
            && isLatestNavigation()
            && activeScopeController.isCurrent(previousScope)
          ) {
            pushToast(PAGE_SWITCH_SAVE_BLOCKED_MESSAGE, 'error', { ttlMs: 8000 });
          }
          return;
        }
        if (!activeScopeController.isCurrent(previousScope)) return;
        const targetScope = commitLoadedNavigationDraft({
          pageId: linkedPageId,
          nextLocale: newLocale,
          payload,
          previousScope,
          slug: targetSlug,
          localeSiteState,
        });
        if (!isLatestNavigation() || !activeScopeController.isCurrent(targetScope)) return;
        pushToast(`Switched to ${newLocale}`, 'success');
      } catch {
        if (!isLatestNavigation() || !activeScopeController.isCurrent(previousScope)) return;
        pushToast(NETWORK_ERROR_MESSAGE, 'error', {
          ttlMs: 8000,
        });
      }
    });
  }, [
    activeScopeController,
    commitLoadedNavigationDraft,
    fetchDraftForNavigation,
    fetchLocaleScopedSiteState,
    persistCurrentDraftBeforeNavigation,
    pushToast,
  ]);

  const handleSelectPage = useCallback((pageId: string, nextSlug?: string) => {
    const navigationId = nextNavigationIntentRef.current + 1;
    nextNavigationIntentRef.current = navigationId;
    latestNavigationIntentRef.current = navigationId;
    const isLatestNavigation = () => mountedRef.current
      && latestNavigationIntentRef.current === navigationId;

    return navigationQueueRef.current!.enqueue(async () => {
      if (!isLatestNavigation()) return false;
      const previousScope = activeScopeController.current();
      const targetSlug = nextSlug ?? sitePagesState.find((page) => page.pageId === pageId)?.slug;
      try {
        const persisted = await persistCurrentDraftBeforeNavigation();
        if (!isLatestNavigation() || persisted === 'superseded') return false;
        if (persisted === 'blocked') {
          if (isLatestNavigation() && activeScopeController.isCurrent(previousScope)) {
            pushToast(PAGE_SWITCH_SAVE_BLOCKED_MESSAGE, 'error', { ttlMs: 8000 });
          }
          return false;
        }
        const payload = await fetchDraftForNavigation(
          pageId,
          previousScope.locale,
          targetSlug,
          previousScope,
        );
        if (!isLatestNavigation()) return false;
        if (!payload) {
          if (activeScopeController.isCurrent(previousScope)) {
            pushToast('페이지 draft를 불러오지 못했습니다. Pages에서 페이지 상태를 확인해주세요.', 'error', {
              ttlMs: 8000,
            });
          }
          return false;
        }
        const finalPersisted = await persistCurrentDraftBeforeNavigation();
        if (!isLatestNavigation() || finalPersisted !== 'saved') {
          if (
            finalPersisted === 'blocked'
            && isLatestNavigation()
            && activeScopeController.isCurrent(previousScope)
          ) {
            pushToast(PAGE_SWITCH_SAVE_BLOCKED_MESSAGE, 'error', { ttlMs: 8000 });
          }
          return false;
        }
        if (!activeScopeController.isCurrent(previousScope)) return false;
        const targetScope = commitLoadedNavigationDraft({
          pageId,
          nextLocale: previousScope.locale,
          payload,
          previousScope,
          slug: targetSlug,
        });
        if (!isLatestNavigation() || !activeScopeController.isCurrent(targetScope)) return false;
        pushToast(`Loaded page: ${pageId}`, 'success');
        return true;
      } catch {
        if (!isLatestNavigation() || !activeScopeController.isCurrent(previousScope)) return false;
        pushToast(NETWORK_ERROR_MESSAGE, 'error', {
          ttlMs: 8000,
        });
        return false;
      }
    });
  }, [
    activeScopeController,
    commitLoadedNavigationDraft,
    fetchDraftForNavigation,
    persistCurrentDraftBeforeNavigation,
    pushToast,
    sitePagesState,
  ]);

  const handleDecomposeCurrentPage = useCallback(() => (
    navigationQueueRef.current!.enqueue(async (): Promise<boolean> => {
      const activeScope = activeScopeController.current();
      const pageId = activeScope.pageId;
      const slug = normalizeDraftSlug(currentSlugStateRef.current);
      const document = canvasDocumentRef.current ?? initialDocument;
      if (!pageId || !shouldOfferDecomposeCurrentPage(document, slug)) {
        pushToast('이 페이지는 현재 요소 편집으로 전환할 수 없습니다.', 'error', { ttlMs: 7000 });
        return false;
      }

      try {
        const persisted = await persistCurrentDraftBeforeNavigation();
        if (persisted !== 'saved') {
          if (persisted === 'superseded') return false;
          pushToast(PAGE_SWITCH_SAVE_BLOCKED_MESSAGE, 'error', { ttlMs: 8000 });
          return false;
        }
        setDraftSaveState('saving');
        const decomposed = await decomposeStandardPageDraft(slug, activeScope.locale, siteId);
        if (!activeScopeController.isCurrent(activeScope)) return false;
        if (!decomposed) {
          setDraftSaveState('error');
          pushToast('페이지를 요소 편집으로 전환하지 못했습니다.', 'error', { ttlMs: 8000 });
          return false;
        }
        const loaded = await loadDraft(pageId, activeScope.locale, { slug });
        if (!activeScopeController.isCurrent(activeScope)) return false;
        if (!loaded) {
          setDraftSaveState('error');
          pushToast('전환된 페이지 draft를 불러오지 못했습니다.', 'error', { ttlMs: 8000 });
          return false;
        }
        pushToast('페이지를 요소 편집으로 전환했습니다.', 'success');
        return true;
      } catch {
        if (!activeScopeController.isCurrent(activeScope)) return false;
        setDraftSaveState('error');
        pushToast(NETWORK_ERROR_MESSAGE, 'error', { ttlMs: 8000 });
        return false;
      }
    })
  ), [
    activeScopeController,
    initialDocument,
    loadDraft,
    persistCurrentDraftBeforeNavigation,
    pushToast,
    setDraftSaveState,
    siteId,
  ]);

  const handlePagesChange = useCallback((pages: BuilderPageSummary[]) => {
    const visiblePages = filterVisiblePageSwitcherPages(pages);
    setSitePagesState(visiblePages);

    const active = visiblePages.find((page) => page.pageId === activeScopeController.current().pageId);
    if (active) setCurrentSlugState(active.slug);
  }, [activeScopeController, setCurrentSlugState]);

  const refreshSitePages = useCallback(async () => {
    const requestScope = activeScopeController.current();
    const response = await fetch(`/api/builder/site/pages?${siteScopedQuery(requestScope.locale, siteId)}`, { credentials: 'same-origin' });
    if (!response.ok) throw new Error(`Failed to load pages: ${response.status}`);
    if (!activeScopeController.isCurrent(requestScope)) return [];
    const payload = (await response.json()) as { pages?: BuilderPageSummary[] };
    if (!activeScopeController.isCurrent(requestScope)) return [];
    const pages = Array.isArray(payload.pages) ? payload.pages : [];
    handlePagesChange(pages);
    return pages;
  }, [activeScopeController, handlePagesChange, siteId]);

  const handleHeaderNavigate = useCallback((href: string) => {
    const navigationLocale = activeScopeController.current().locale;
    const normalizedHref = normalizeSiteHref(href, navigationLocale);
    const targetPath = comparableSitePath(normalizedHref, navigationLocale);
    const findTargetPage = (pages: typeof sitePagesState) => pages.find((page) => {
      const pagePath = buildSitePagePath(navigationLocale, page.isHomePage ? '' : page.slug);
      return comparableSitePath(pagePath, navigationLocale) === targetPath;
    });
    const targetPage = findTargetPage(sitePagesState);

    if (targetPage) {
      void handleSelectPage(targetPage.pageId, targetPage.slug);
      return;
    }

    void refreshSitePages()
      .then((pages) => {
        const refreshedTargetPage = findTargetPage(pages);
        if (refreshedTargetPage) {
          void handleSelectPage(refreshedTargetPage.pageId, refreshedTargetPage.slug);
          return;
        }
        onMissingHeaderPage?.(normalizedHref);
        pushToast(`No builder page for ${normalizedHref}`, 'error');
      })
      .catch(() => {
        onMissingHeaderPage?.(normalizedHref);
        pushToast(NETWORK_ERROR_MESSAGE, 'error', {
          ttlMs: 8000,
        });
      });
  }, [activeScopeController, handleSelectPage, onMissingHeaderPage, pushToast, refreshSitePages, sitePagesState]);

  const headerNavItems = useMemo<BuilderNavItem[]>(() => {
    const hasColumns = navItemsState.some((item) => (
      comparableSitePath(normalizeSiteHref(item.href, activeCanvasLocale), activeCanvasLocale)
        === comparableSitePath(`/${activeCanvasLocale}/columns`, activeCanvasLocale)
    ));
    if (hasColumns) return navItemsState;
    return [
      ...navItemsState,
      {
        id: 'nav-columns',
        pageId: 'external-columns',
        href: '/columns',
        label: { ko: '칼럼', 'zh-hant': '專欄', en: 'Columns' },
      },
    ];
  }, [activeCanvasLocale, navItemsState]);

  const linkPickerSitePages = useMemo(() => {
    const pages = sitePagesState.map((page) => ({
      path: page.isHomePage ? `/${activeCanvasLocale}` : `/${activeCanvasLocale}/${page.slug}`,
      title: page.isHomePage ? 'Home' : page.slug,
      slug: page.slug,
    }));
    if (!pages.some((page) => page.slug === 'columns')) {
      pages.push({ path: `/${activeCanvasLocale}/columns`, title: 'Columns', slug: 'columns' });
    }
    return pages;
  }, [activeCanvasLocale, sitePagesState]);

  const columnsPage = sitePagesState.find((page) => page.slug === 'columns') ?? null;

  const updateColumnsNavigationPageId = useCallback((pageId: string) => {
    const navigationLocale = activeScopeController.current().locale;
    setNavItemsState((items) => {
      const columnsPath = comparableSitePath(`/${navigationLocale}/columns`, navigationLocale);
      let updated = false;
      const nextItems = items.map((item) => {
        const itemPath = comparableSitePath(normalizeSiteHref(item.href, navigationLocale), navigationLocale);
        if (item.id !== 'nav-columns' && item.pageId !== 'external-columns' && itemPath !== columnsPath) {
          return item;
        }
        updated = true;
        return {
          ...item,
          pageId,
          href: '/columns',
          label: {
            ...(typeof item.label === 'object' ? item.label : { ko: item.label, 'zh-hant': item.label, en: item.label }),
            [navigationLocale]: columnsPageTitle(navigationLocale),
          },
        };
      });
      if (updated) return nextItems;
      return [
        ...nextItems,
        {
          id: 'nav-columns',
          pageId,
          href: '/columns',
          label: { ko: '호정칼럼', 'zh-hant': '昊鼎專欄', en: 'Columns' },
        },
      ];
    });
  }, [activeScopeController]);

  const restoreColumnsDraftIfMissing = useCallback(async (pageId: string): Promise<boolean> => {
    const requestScope = activeScopeController.current();
    const missing = await isSiteDraftMissing(pageId, requestScope.locale, siteId);
    if (!activeScopeController.isCurrent(requestScope)) return false;
    if (!missing) return false;
    const document = createBuilderDynamicListCanvasDocument({ collectionId: 'columns', locale: requestScope.locale });
    const response = await fetch(`/api/builder/site/pages/${encodeURIComponent(pageId)}/draft?${siteScopedQuery(requestScope.locale, siteId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ siteId, document }),
    });
    return response.ok && activeScopeController.isCurrent(requestScope);
  }, [activeScopeController, siteId]);

  const createColumnsBuilderPage = useCallback(async (): Promise<BuilderPageSummary | null> => {
    const requestScope = activeScopeController.current();
    const response = await fetch(`/api/builder/site/pages?${siteScopedQuery(requestScope.locale, siteId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        siteId,
        locale: requestScope.locale,
        slug: 'columns',
        title: columnsPageTitle(requestScope.locale),
        addToNavigation: true,
        dynamicListCollectionId: 'columns',
        dynamicListLimit: 6,
      }),
    });
    const data = (await response.json().catch(() => ({}))) as CreatePageResponseBody;
    if (!activeScopeController.isCurrent(requestScope)) return null;
    if (!response.ok && response.status !== 409) {
      pushToast(data.message || data.error || '칼럼 페이지를 생성하지 못했습니다.', 'error', {
        ttlMs: 8000,
      });
      return null;
    }

    const pages = await refreshSitePages();
    const createdPageId = data.pageId ?? data.page?.pageId ?? null;
    const targetPage = pages.find((page) => (
      (createdPageId && page.pageId === createdPageId) || page.slug === 'columns'
    )) ?? data.page ?? null;
    if (targetPage?.pageId) {
      updateColumnsNavigationPageId(targetPage.pageId);
    }
    return targetPage;
  }, [activeScopeController, pushToast, refreshSitePages, siteId, updateColumnsNavigationPageId]);

  const refreshColumnsPageIfNeeded = useCallback(() => {
    if (columnsPage || columnsPageLookupPending) return;
    setColumnsPageLookupPending(true);
    refreshSitePages()
      .catch(() => pushToast(NETWORK_ERROR_MESSAGE, 'error', {
        ttlMs: 8000,
      }))
      .finally(() => setColumnsPageLookupPending(false));
  }, [columnsPage, columnsPageLookupPending, pushToast, refreshSitePages]);

  const handleOpenColumnsPage = useCallback(async (openPagesDrawer: () => void) => {
    if (draftConflictRef.current) {
      pushToast(PAGE_SWITCH_SAVE_BLOCKED_MESSAGE, 'error', { ttlMs: 8000 });
      return false;
    }
    let targetPage = columnsPage;
    if (!targetPage) {
      setColumnsPageLookupPending(true);
      try {
        const pages = await refreshSitePages();
        targetPage = pages.find((page) => page.slug === 'columns') ?? null;
        if (!targetPage) {
          targetPage = await createColumnsBuilderPage();
        }
      } catch {
        pushToast(NETWORK_ERROR_MESSAGE, 'error', {
          ttlMs: 8000,
        });
      } finally {
        setColumnsPageLookupPending(false);
      }
    }

    if (targetPage) {
      updateColumnsNavigationPageId(targetPage.pageId);
      const opened = await handleSelectPage(targetPage.pageId, targetPage.slug);
      if (opened) return true;
      try {
        const restored = await restoreColumnsDraftIfMissing(targetPage.pageId);
        if (restored) {
          pushToast('칼럼 페이지 draft를 복구했습니다.', 'success');
          return await handleSelectPage(targetPage.pageId, targetPage.slug);
        }
      } catch {
        pushToast(NETWORK_ERROR_MESSAGE, 'error', {
          ttlMs: 8000,
        });
      }
      return false;
    }

    openPagesDrawer();
    pushToast('Columns page not found. Open Pages to create or restore it.', 'error');
    return false;
  }, [
    columnsPage,
    createColumnsBuilderPage,
    handleSelectPage,
    pushToast,
    refreshSitePages,
    restoreColumnsDraftIfMissing,
    updateColumnsNavigationPageId,
  ]);

  const captureStableConflictRecovery = useCallback(async (
    conflict: DraftConflict,
  ): Promise<{
    conflict: DraftConflict;
    sourceDocument: BuilderCanvasDocument;
  } | null> => {
    const requestScope = activeScopeController.current();
    if (
      requestScope.pageId !== conflict.pageId
      || requestScope.locale !== conflict.locale
      || draftConflictRef.current !== conflict
    ) {
      return null;
    }

    const captured = await captureStableDraftRecoverySnapshot({
      getCurrentDocument: () => canvasDocumentRef.current,
      createSnapshot: (document) => createDraftRecoverySnapshot({
        document,
        pageId: conflict.pageId,
        locale: conflict.locale,
      }),
    });
    if (!captured) return null;
    if (!activeScopeController.isCurrent(requestScope)) return null;
    if (draftConflictRef.current !== conflict) return null;
    const nextConflict = Object.freeze({ ...conflict, localRecovery: captured.snapshot });
    setDraftConflict(nextConflict);
    return { conflict: nextConflict, sourceDocument: captured.sourceDocument };
  }, [activeScopeController, setDraftConflict]);

  const handleDownloadDraftConflictRecovery = useCallback(async (): Promise<boolean> => {
    const requestScope = activeScopeController.current();
    const messages = getDraftConflictActionMessages(
      draftConflictRef.current?.locale ?? requestScope.locale,
    );
    try {
      const conflict = draftConflictRef.current;
      if (!conflict) return false;
      const captured = await captureStableConflictRecovery(conflict);
      if (!captured) return false;
      const downloaded = downloadDraftRecovery(captured.conflict.localRecovery);
      pushToast(
        downloaded ? messages.backupDownloaded : messages.backupFailed,
        downloaded ? 'success' : 'error',
        { ttlMs: downloaded ? 5000 : 8000 },
      );
      return downloaded;
    } catch {
      if (!mountedRef.current || !activeScopeController.isCurrent(requestScope)) return false;
      pushToast(messages.backupFailedPreserved, 'error', {
        ttlMs: 8000,
      });
      return false;
    }
  }, [activeScopeController, captureStableConflictRecovery, pushToast]);

  const handleUseServerDraftAfterConflict = useCallback(async (): Promise<boolean> => {
    const requestScope = activeScopeController.current();
    const messages = getDraftConflictActionMessages(
      draftConflictRef.current?.locale ?? requestScope.locale,
    );
    try {
      const initialConflict = draftConflictRef.current;
      if (!initialConflict) return false;
      if (
        requestScope.pageId !== initialConflict.pageId
        || requestScope.locale !== initialConflict.locale
      ) {
        return false;
      }

      // First preserve the latest local bytes. Never replace the canvas unless a
      // download has actually been initiated from a stable recovery snapshot.
      let protectedRecovery = await captureStableConflictRecovery(initialConflict);
      if (!protectedRecovery) return false;
      let backupDownloaded = downloadDraftRecovery(protectedRecovery.conflict.localRecovery);
      if (!backupDownloaded) {
        pushToast(messages.serverBackupFailed, 'error', {
          ttlMs: 8000,
        });
        return false;
      }

      const payload = await fetchSiteDraft(requestScope.pageId, requestScope.locale, siteId);
      if (!activeScopeController.isCurrent(requestScope)) return false;
      if (draftConflictRef.current !== protectedRecovery.conflict) return false;
      if (!payload?.document) {
        pushToast(messages.serverLoadFailedPreserved, 'error', {
          ttlMs: 8000,
        });
        return false;
      }

      // A user may have edited again while the GET was in flight. Capture and
      // download those newer exact bytes too, then replace synchronously without
      // another await window that could lose a final edit.
      if (canvasDocumentRef.current !== protectedRecovery.sourceDocument) {
        const recaptured = await captureStableConflictRecovery(protectedRecovery.conflict);
        if (!recaptured) return false;
        backupDownloaded = downloadDraftRecovery(recaptured.conflict.localRecovery);
        if (!backupDownloaded) {
          pushToast(messages.newerBackupFailed, 'error', {
            ttlMs: 8000,
          });
          return false;
        }
        protectedRecovery = recaptured;
      }

      const choice = resolveServerLatestDraftChoice({
        backupDownloaded,
        scopeCurrent: activeScopeController.isCurrent(requestScope),
        conflictCurrent: draftConflictRef.current === protectedRecovery.conflict,
        document: payload.document,
        draft: payload.draft,
      });
      if (choice.status === 'blocked') return false;
      replaceDocumentIfChanged(choice.document, { forceReplace: true });
      markDraftDocumentSynced(requestScope, choice.document);
      setSyncedUpdatedAt(choice.document.updatedAt);
      setDraftMeta(choice.draft);
      setDraftConflict(null);
      setSaveBlockReason(null);
      setDraftSaveState('idle');
      pushToast(messages.serverLoaded, 'success', { ttlMs: 7000 });
      return true;
    } catch {
      if (!mountedRef.current || !activeScopeController.isCurrent(requestScope)) return false;
      pushToast(messages.serverUnexpectedFailure, 'error', {
        ttlMs: 8000,
      });
      return false;
    }
  }, [
    activeScopeController,
    captureStableConflictRecovery,
    markDraftDocumentSynced,
    pushToast,
    replaceDocumentIfChanged,
    setDraftConflict,
    setDraftMeta,
    setDraftSaveState,
    setSaveBlockReason,
    setSyncedUpdatedAt,
    siteId,
  ]);

  const handlePublishDraftSaved = useCallback((nextDraftMeta: DraftMeta, savedDocument?: BuilderCanvasDocument) => {
    // An already-open publish modal may finish after autosave detects a newer
    // server draft. Its callback cannot resolve or erase that edit conflict.
    if (draftConflictRef.current) return;
    setDraftMeta(nextDraftMeta);
    if (savedDocument) setSyncedUpdatedAt(savedDocument.updatedAt);
    setDraftConflict(null);
  }, [
    setDraftConflict,
    setDraftMeta,
    setSyncedUpdatedAt,
  ]);

  const handleMoveCompleted = useCallback(
    async (result: MoveToPageResult) => {
      const requestScope = activeScopeController.current();
      if (!requestScope.pageId) return;
      try {
        const response = await fetch(
          `/api/builder/site/pages/${requestScope.pageId}/draft?${siteScopedQuery(requestScope.locale, siteId)}`,
          { credentials: 'same-origin' },
        );
        if (!activeScopeController.isCurrent(requestScope)) return;
        if (response.ok) {
          const data = (await response.json()) as DraftResponseBody;
          if (!activeScopeController.isCurrent(requestScope)) return;
          if (data.draft) setDraftMeta(data.draft);
          if (data.document) {
            replaceDocumentIfChanged(data.document);
            markDraftDocumentSynced(requestScope, data.document);
            setSyncedUpdatedAt(data.document.updatedAt);
          }
        }
      } catch {
        // best effort: server already moved nodes; user can refresh manually
      }
      if (!activeScopeController.isCurrent(requestScope)) return;
      pushToast(`${result.movedCount}개 요소를 /${result.targetSlug}(으)로 이동했습니다`, 'success');
    },
    [
      activeScopeController,
      markDraftDocumentSynced,
      pushToast,
      replaceDocumentIfChanged,
      setDraftMeta,
      setSyncedUpdatedAt,
      siteId,
    ],
  );

  const resolvedSiteSettingsState = resolveBuilderSiteSettings(siteSettingsState, activeCanvasLocale);

  return {
    activeCanvasLocale,
    activePageId,
    canDecomposeCurrentPage,
    columnPostsSummary,
    columnsPage,
    columnsPageLookupPending,
    currentSlugState,
    draftConflict,
    draftMeta,
    hasDraftConflict: isDraftConflictBlocking(draftConflict),
    headerNavItems,
    linkPickerSitePages,
    navItemsState,
    saveBlockReason,
    setCurrentSlugState,
    setNavItemsState,
    setSitePagesState,
    setSiteSettingsState,
    setSiteThemeState,
    sitePagesState,
    siteSettingsState: resolvedSiteSettingsState,
    siteThemeState,
    handleHeaderNavigate,
    handleLocaleChange,
    handleDecomposeCurrentPage,
    handleMoveCompleted,
    handleOpenColumnsPage,
    handlePagesChange,
    handlePublishDraftSaved,
    handleDownloadDraftConflictRecovery,
    handleUseServerDraftAfterConflict,
    handleSelectPage,
    refreshColumnsPageIfNeeded,
  };
}
