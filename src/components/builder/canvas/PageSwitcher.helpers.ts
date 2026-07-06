import { filterPublicPages } from '@/lib/builder/site/internal-pages';

export const FOCUSABLE_SELECTOR = [
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"]):not([type="hidden"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]:not([tabindex="-1"])',
].join(',');

type PageSwitcherListPage = {
  slug: string;
  title?: Record<string, string>;
};

export type PageSwitcherUnpublishedPage = {
  publishedAt?: string;
  publishedSavedAt?: string;
  lastPublishedDraftRevision?: number;
  draftRevision?: number;
  draftSavedAt?: string;
  hasUnpublishedChanges?: boolean;
};

export { isInternalSandboxPage } from '@/lib/builder/site/internal-pages';

export function filterVisiblePageSwitcherPages<T extends PageSwitcherListPage>(pages: T[]): T[] {
  return filterPublicPages(pages);
}

function timestampMs(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function pageHasUnpublishedChanges(page: PageSwitcherUnpublishedPage): boolean {
  if (typeof page.hasUnpublishedChanges === 'boolean') return page.hasUnpublishedChanges;
  if (!page.publishedAt) return false;
  if (typeof page.lastPublishedDraftRevision === 'number' && typeof page.draftRevision === 'number') {
    return page.draftRevision > page.lastPublishedDraftRevision;
  }
  const draftSavedMs = timestampMs(page.draftSavedAt);
  const publishedMs = timestampMs(page.publishedSavedAt ?? page.publishedAt);
  return draftSavedMs !== null && publishedMs !== null && draftSavedMs > publishedMs;
}

function readPageErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== 'object') return fallback;
  const body = payload as {
    error?: unknown;
    errorCode?: unknown;
    message?: unknown;
    issues?: unknown;
    validation?: unknown;
  };

  if ((body.errorCode ?? body.error) === 'duplicate_slug') {
    return '같은 locale 안에 동일한 slug를 쓰는 페이지가 있습니다.';
  }

  const issueSource = Array.isArray(body.issues)
    ? body.issues
    : Array.isArray(body.validation)
      ? body.validation
      : [];
  const firstIssue = issueSource.find((issue): issue is { message?: unknown; fixHint?: unknown; field?: unknown } => (
    Boolean(issue) && typeof issue === 'object'
  ));
  if (firstIssue) {
    if (typeof firstIssue.message === 'string' && firstIssue.message.trim()) {
      return firstIssue.message;
    }
    if (typeof firstIssue.fixHint === 'string' && firstIssue.fixHint.trim()) {
      return firstIssue.fixHint;
    }
  }

  if (typeof body.message === 'string' && body.message.trim()) return body.message;
  if (typeof body.error === 'string' && body.error.trim()) return body.error;
  return fallback;
}

export async function readPageResponseError(response: Response, fallback: string): Promise<string> {
  const payload = await response.json().catch(() => null) as unknown;
  return readPageErrorMessage(payload, fallback);
}
