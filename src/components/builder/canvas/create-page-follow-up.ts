/** Follow-up after a successful create-page POST. No React runtime. */

export type CreatePageFollowUpScope = {
  siteId: string;
  locale: string;
};

export type CreatePageOwnerSnapshot = CreatePageFollowUpScope & {
  pageId?: string | null;
  mounted?: boolean;
};

export type CreatePageSuccessData = {
  pageId?: string;
  page?: { pageId?: string; slug?: string } | null;
};

export type CreatePageRefreshCanApply = () => boolean;

export type CreatePageFollowUpDeps = {
  origin: CreatePageFollowUpScope;
  fetchPages: () => unknown;
  resetChild: () => void;
  setCreating: (creating: boolean) => void;
  selectPage: (pageId: string, slug?: string) => unknown;
  refreshParentPages?: () => unknown;
  convergeOwnPages?: () => unknown;
  getOwner?: () => CreatePageOwnerSnapshot | null | undefined;
  observeBackgroundError?: (error: unknown) => void;
};

export type CreatePageFollowUpHandle = {
  creatingHandled: boolean;
  background: Promise<void>;
};

export type SilentGuardedCanApply = () => boolean;

export type SilentGuardedRequest = () => unknown;

export type SilentGuardedResponseLike = {
  ok: boolean;
  json: () => unknown;
};

export type SilentGuardedApply<T> = (data: T) => unknown;

export function canApplyCreatePageOwnerRefresh(
  origin: CreatePageFollowUpScope,
  current: CreatePageOwnerSnapshot | null | undefined,
): boolean {
  if (!current) return false;
  if (current.mounted === false) return false;
  return current.siteId === origin.siteId && current.locale === origin.locale;
}

export function createCreatePageRefreshCanApply(
  origin: CreatePageFollowUpScope,
  getOwner: () => CreatePageOwnerSnapshot | null | undefined,
): CreatePageRefreshCanApply {
  return () => canApplyCreatePageOwnerRefresh(origin, getOwner());
}

function isOwnerAllowed(deps: CreatePageFollowUpDeps): boolean {
  if (!deps.getOwner) return true;
  return canApplyCreatePageOwnerRefresh(deps.origin, deps.getOwner());
}

function notifyFollowUpError(deps: CreatePageFollowUpDeps, error: unknown): void {
  if (!isOwnerAllowed(deps)) return;
  deps.observeBackgroundError?.(error);
}

function hasFullCreatedPage(data: CreatePageSuccessData): boolean {
  return data.page != null;
}

async function runFallbackFollowUp(
  pageId: string,
  slug: string | undefined,
  deps: CreatePageFollowUpDeps,
): Promise<void> {
  await deps.fetchPages();
  deps.resetChild();
  deps.setCreating(false);
  try {
    await deps.selectPage(pageId, slug);
  } catch (error) {
    notifyFollowUpError(deps, error);
  }
}

async function observeSelectionThenRefreshParent(
  selection: unknown,
  deps: CreatePageFollowUpDeps,
): Promise<void> {
  let resolved: unknown;
  try {
    resolved = await selection;
  } catch (error) {
    notifyFollowUpError(deps, error);
    return;
  }
  if (resolved === false && deps.convergeOwnPages && isOwnerAllowed(deps)) {
    try {
      await deps.convergeOwnPages();
    } catch (error) {
      notifyFollowUpError(deps, error);
    }
  }
  if (!deps.refreshParentPages) return;
  if (!isOwnerAllowed(deps)) return;
  try {
    await deps.refreshParentPages();
  } catch (error) {
    notifyFollowUpError(deps, error);
  }
}

export function runCreatePageFollowUp(
  data: CreatePageSuccessData,
  pageId: string,
  deps: CreatePageFollowUpDeps,
): CreatePageFollowUpHandle {
  const slug = data.page?.slug;

  if (!hasFullCreatedPage(data) || deps.refreshParentPages == null) {
    return {
      creatingHandled: false,
      background: runFallbackFollowUp(pageId, slug, deps),
    };
  }

  deps.resetChild();
  deps.setCreating(false);

  let selection: unknown;
  try {
    selection = deps.selectPage(pageId, slug);
  } catch (error) {
    return {
      creatingHandled: true,
      background: Promise.resolve().then(() => {
        notifyFollowUpError(deps, error);
      }),
    };
  }

  return {
    creatingHandled: true,
    background: observeSelectionThenRefreshParent(selection, deps),
  };
}

function isSilentGuardedResponseLike(
  value: unknown,
): value is SilentGuardedResponseLike {
  return (
    typeof value === "object" &&
    value !== null &&
    "ok" in value &&
    typeof (value as SilentGuardedResponseLike).json === "function"
  );
}

/** Silent guarded request/apply. Non-OK and failed requests are absorbed. */
export async function runSilentGuardedRequestApply<T>(
  canApply: SilentGuardedCanApply,
  request: SilentGuardedRequest,
  ...applies: SilentGuardedApply<T>[]
): Promise<void> {
  if (!canApply()) return;

  let response: unknown;
  try {
    response = await request();
  } catch {
    return;
  }

  if (!canApply()) return;
  if (!isSilentGuardedResponseLike(response) || !response.ok) return;

  let data: T;
  try {
    data = (await response.json()) as T;
  } catch {
    return;
  }

  if (!canApply()) return;

  for (const apply of applies) {
    if (!canApply()) return;
    await apply(data);
  }
}
