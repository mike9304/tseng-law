"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { BuilderCollectionSummary } from "@/lib/builder/cms";
import type {
  BuilderPageDatasetOverview,
  BuilderDatasetSampleRecord,
} from "@/lib/builder/datasets";
import {
  buildDatasetBindingDefaultState,
  buildDatasetBindingEditorState,
  type BuilderDatasetBindingEditorState,
} from "@/lib/builder/dataset-binding-editor-model";
import {
  previewDatasetBinding,
  saveDatasetBinding,
  seedDatasetBinding,
} from "@/components/builder/datasets/datasetBindingApiClient";
import type {
  BuilderDatasetTargetId,
  BuilderPageDatasetFilter,
  BuilderPageDatasetSort,
} from "@/lib/builder/types";

type CmsBindableTargetSummary = {
  targetId: string;
  collectionId: string;
  label: string;
  recordCount: number;
};

type BuilderDatasetBindingEditorProps = {
  locale: string;
  siteId: string;
  pageKey: string;
  initialRevision: number;
  initialTargets: BuilderPageDatasetOverview[];
  collections: BuilderCollectionSummary[];
  /** WIX-PERFECT #6 Slice 3: user-created CMS collections bindable to the selected repeater. */
  cmsBindableTargets?: CmsBindableTargetSummary[];
  initialTargetId?: string;
};

const MAX_FILTER_ROWS = 6;
const MAX_SORT_ROWS = 3;
const DATASET_BINDING_DRAFT_STORAGE_PREFIX = "builder-dataset-binding-drafts";

function createBlankFilter(
  target: BuilderPageDatasetOverview,
): BuilderPageDatasetFilter {
  return {
    fieldId: target.filterFields[0]?.fieldId ?? "",
    operator: "contains",
    value: "",
  };
}

function createBlankSort(
  target: BuilderPageDatasetOverview,
): BuilderPageDatasetSort {
  return {
    fieldId: target.sortFields[0]?.fieldId ?? "",
    direction: "asc",
  };
}

function sanitizeFilters(
  filters: BuilderPageDatasetFilter[],
): BuilderPageDatasetFilter[] {
  return filters
    .map((filter) => ({
      fieldId: filter.fieldId.trim(),
      operator: (filter.operator === "equals" ? "equals" : "contains") as
        "equals" | "contains",
      value: filter.value.trim(),
    }))
    .filter((filter) => filter.fieldId && filter.value)
    .slice(0, MAX_FILTER_ROWS);
}

function sanitizeSort(
  sort: BuilderPageDatasetSort[],
): BuilderPageDatasetSort[] {
  return sort
    .map((entry) => ({
      fieldId: entry.fieldId.trim(),
      direction: (entry.direction === "desc" ? "desc" : "asc") as
        "asc" | "desc",
    }))
    .filter((entry) => entry.fieldId)
    .slice(0, MAX_SORT_ROWS);
}

function parseJsonArrayParam<T>(
  searchParams: URLSearchParams,
  key: string,
  isItem: (value: unknown) => value is T,
): T[] {
  const raw = searchParams.get(key)?.trim();
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isItem) : [];
  } catch {
    return [];
  }
}

function isFilterParam(value: unknown): value is BuilderPageDatasetFilter {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    typeof (value as BuilderPageDatasetFilter).fieldId === "string" &&
    typeof (value as BuilderPageDatasetFilter).operator === "string" &&
    typeof (value as BuilderPageDatasetFilter).value === "string"
  );
}

function isSortParam(value: unknown): value is BuilderPageDatasetSort {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    typeof (value as BuilderPageDatasetSort).fieldId === "string" &&
    typeof (value as BuilderPageDatasetSort).direction === "string"
  );
}

function buildBindingStateFromQuery(
  target: BuilderPageDatasetOverview,
  searchParams: URLSearchParams,
  fallback?: BuilderDatasetBindingEditorState,
): BuilderDatasetBindingEditorState {
  const targetState = fallback ?? buildDatasetBindingEditorState(target);
  const queryCollectionId = searchParams.get("collectionId")?.trim() ?? "";
  const queryMode = searchParams.get("mode")?.trim() ?? "";
  const queryLimit = searchParams.get("limit")?.trim() ?? "";
  const queryFilters = parseJsonArrayParam(
    searchParams,
    "filters",
    isFilterParam,
  ).slice(0, MAX_FILTER_ROWS);
  const querySort = parseJsonArrayParam(
    searchParams,
    "sort",
    isSortParam,
  ).slice(0, MAX_SORT_ROWS);

  return {
    ...targetState,
    collectionId: target.collectionIds.some(
      (collectionId) => collectionId === queryCollectionId,
    )
      ? queryCollectionId
      : targetState.collectionId,
    mode: target.modeOptions.some((modeOption) => modeOption === queryMode)
      ? queryMode
      : targetState.mode,
    limit:
      queryLimit !== "" && Number.isFinite(Number(queryLimit))
        ? Math.trunc(Number(queryLimit))
        : targetState.limit,
    filters: queryFilters.length > 0 ? queryFilters : targetState.filters,
    sort: querySort.length > 0 ? querySort : targetState.sort,
  };
}

function buildBindingQueryFromState(
  targetId: string,
  draft: BuilderDatasetBindingEditorState,
  copyFromTargetId?: string,
): string {
  const query = new URLSearchParams();
  query.set("targetId", targetId);
  if (draft.collectionId) query.set("collectionId", draft.collectionId);
  if (draft.mode) query.set("mode", draft.mode);
  if (draft.limit !== "") query.set("limit", String(draft.limit));
  const filters = sanitizeFilters(draft.filters);
  const sort = sanitizeSort(draft.sort);
  if (filters.length > 0) query.set("filters", JSON.stringify(filters));
  if (sort.length > 0) query.set("sort", JSON.stringify(sort));
  if (copyFromTargetId) query.set("copyFromTargetId", copyFromTargetId);
  return query.toString();
}

function cloneEditorState(
  state: BuilderDatasetBindingEditorState,
): BuilderDatasetBindingEditorState {
  return {
    collectionId: state.collectionId,
    mode: state.mode,
    limit: state.limit,
    filters: state.filters.map((filter) => ({ ...filter })),
    sort: state.sort.map((entry) => ({ ...entry })),
  };
}

function normalizeDraftForTarget(
  target: BuilderPageDatasetOverview,
  sourceDraft: BuilderDatasetBindingEditorState,
): BuilderDatasetBindingEditorState {
  const targetFilterFieldIds = new Set(
    target.filterFields.map((field) => field.fieldId),
  );
  const targetSortFieldIds = new Set(
    target.sortFields.map((field) => field.fieldId),
  );
  const defaultDraft = buildDatasetBindingEditorState(target);

  return {
    collectionId: target.collectionIds.some(
      (collectionId) => collectionId === sourceDraft.collectionId,
    )
      ? sourceDraft.collectionId
      : target.defaultCollectionId,
    mode: target.modeOptions.some(
      (modeOption) => modeOption === sourceDraft.mode,
    )
      ? sourceDraft.mode
      : defaultDraft.mode,
    limit:
      typeof sourceDraft.limit === "number" &&
      Number.isFinite(sourceDraft.limit)
        ? sourceDraft.limit
        : defaultDraft.limit,
    filters: sanitizeFilters(sourceDraft.filters).filter((filter) =>
      targetFilterFieldIds.has(filter.fieldId),
    ),
    sort: sanitizeSort(sourceDraft.sort).filter((entry) =>
      targetSortFieldIds.has(entry.fieldId),
    ),
  };
}

function datasetBindingDraftStorageKey(
  siteId: string,
  locale: string,
  pageKey: string,
): string {
  return `${DATASET_BINDING_DRAFT_STORAGE_PREFIX}:${siteId}:${locale}:${pageKey}`;
}

function readStoredDrafts(
  siteId: string,
  locale: string,
  pageKey: string,
): Record<string, BuilderDatasetBindingEditorState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(
      datasetBindingDraftStorageKey(siteId, locale, pageKey),
    );
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") return {};
    return Object.fromEntries(
      Object.entries(parsed).flatMap(([targetId, value]) => {
        if (!value || typeof value !== "object") return [];
        const candidate = value as Partial<BuilderDatasetBindingEditorState>;
        if (
          typeof candidate.collectionId !== "string" ||
          typeof candidate.mode !== "string"
        )
          return [];
        if (!Array.isArray(candidate.filters) || !Array.isArray(candidate.sort))
          return [];
        return [
          [
            targetId,
            {
              collectionId: candidate.collectionId,
              mode: candidate.mode,
              limit:
                candidate.limit === "" || typeof candidate.limit === "number"
                  ? candidate.limit
                  : "",
              filters: candidate.filters
                .filter(
                  (filter): filter is BuilderPageDatasetFilter =>
                    Boolean(filter) &&
                    typeof filter === "object" &&
                    typeof (filter as BuilderPageDatasetFilter).fieldId ===
                      "string" &&
                    typeof (filter as BuilderPageDatasetFilter).operator ===
                      "string" &&
                    typeof (filter as BuilderPageDatasetFilter).value ===
                      "string",
                )
                .slice(0, MAX_FILTER_ROWS),
              sort: candidate.sort
                .filter(
                  (entry): entry is BuilderPageDatasetSort =>
                    Boolean(entry) &&
                    typeof entry === "object" &&
                    typeof (entry as BuilderPageDatasetSort).fieldId ===
                      "string" &&
                    typeof (entry as BuilderPageDatasetSort).direction ===
                      "string",
                )
                .slice(0, MAX_SORT_ROWS),
            },
          ],
        ];
      }),
    );
  } catch {
    return {};
  }
}

function writeStoredDrafts(
  siteId: string,
  locale: string,
  pageKey: string,
  drafts: Record<string, BuilderDatasetBindingEditorState>,
): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      datasetBindingDraftStorageKey(siteId, locale, pageKey),
      JSON.stringify(drafts),
    );
  } catch {
    // Ignore storage failures; the URL remains the canonical shareable state.
  }
}

function resolveTargetDraftState(
  target: BuilderPageDatasetOverview,
  searchParams: URLSearchParams,
  cachedDraft?: BuilderDatasetBindingEditorState,
): BuilderDatasetBindingEditorState {
  return buildBindingStateFromQuery(target, searchParams, cachedDraft);
}

function getQueryTargetId(
  searchParams: URLSearchParams,
  fallbackTargetId: string,
): string {
  return searchParams.get("targetId")?.trim() || fallbackTargetId;
}

function buildHydratedDraftState(
  target: BuilderPageDatasetOverview,
  searchParams: URLSearchParams,
  draftsByTargetId: Record<string, BuilderDatasetBindingEditorState>,
  storedDrafts: Record<string, BuilderDatasetBindingEditorState>,
): BuilderDatasetBindingEditorState {
  const sourceTargetId = searchParams.get("copyFromTargetId")?.trim() ?? "";
  const cachedTargetDraft =
    draftsByTargetId[target.targetId] ?? storedDrafts[target.targetId];
  const sourceTarget = sourceTargetId
    ? (draftsByTargetId[sourceTargetId] ?? storedDrafts[sourceTargetId] ?? null)
    : null;
  const sourceDraft = sourceTarget ? sourceTarget : cachedTargetDraft;
  return resolveTargetDraftState(
    target,
    searchParams,
    sourceDraft ? normalizeDraftForTarget(target, sourceDraft) : undefined,
  );
}

// SIZE_OK: This legacy single-surface editor still owns URL draft state, local draft cache,
// target switching, and form rendering. This slice extracted network I/O and styling so the
// actual dataset behavior can be verified without taking on a broad render-tree split.
export default function BuilderDatasetBindingEditor({
  locale,
  siteId,
  pageKey,
  initialRevision,
  initialTargets,
  collections,
  cmsBindableTargets = [],
  initialTargetId,
}: BuilderDatasetBindingEditorProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const lastHydratedSearchParamsRef = useRef<string | null>(null);
  const initialCopyFromTargetId =
    searchParams.get("copyFromTargetId")?.trim() ?? "";
  const storedDrafts = useMemo(
    () => readStoredDrafts(siteId, locale, pageKey),
    [locale, pageKey, siteId],
  );
  const initialTarget = useMemo(() => {
    const preferred = initialTargetId
      ? initialTargets.find((target) => target.targetId === initialTargetId)
      : null;
    return preferred ?? initialTargets[0] ?? null;
  }, [initialTargetId, initialTargets]);
  const initialCopySourceTarget = useMemo(
    () =>
      initialCopyFromTargetId
        ? (initialTargets.find(
            (target) => target.targetId === initialCopyFromTargetId,
          ) ?? null)
        : null,
    [initialCopyFromTargetId, initialTargets],
  );

  const [targets, setTargets] = useState(initialTargets);
  const [selectedTargetId, setSelectedTargetId] = useState<
    BuilderDatasetTargetId | string
  >(
    getQueryTargetId(
      new URLSearchParams(searchParams.toString()),
      initialTarget?.targetId ?? "",
    ),
  );
  const [draftsByTargetId, setDraftsByTargetId] = useState<
    Record<string, BuilderDatasetBindingEditorState>
  >({});
  const [draft, setDraft] = useState<BuilderDatasetBindingEditorState>(() =>
    initialTarget
      ? buildHydratedDraftState(
          initialTarget,
          new URLSearchParams(searchParams.toString()),
          {},
          initialCopySourceTarget
            ? {
                [initialCopySourceTarget.targetId]:
                  buildDatasetBindingEditorState(initialCopySourceTarget),
              }
            : storedDrafts,
        )
      : {
          collectionId: "",
          mode: "list",
          limit: "",
          filters: [],
          sort: [],
        },
  );
  const [busy, setBusy] = useState(false);
  const [expectedRevision, setExpectedRevision] = useState(initialRevision);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewRecords, setPreviewRecords] = useState<
    BuilderDatasetSampleRecord[]
  >([]);
  const [previewLoading, setPreviewLoading] = useState(Boolean(initialTarget));
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [copyFromTargetId, setCopyFromTargetId] = useState(
    initialCopyFromTargetId,
  );
  // WIX-PERFECT #6 Slice 3: optional user-CMS-collection source for the selected repeater.
  // Kept as separate local state (not threaded through the built-in draft type) so the
  // existing built-in binding machinery stays untouched. Empty string = use built-in source.
  const [cmsCollectionId, setCmsCollectionId] = useState<string>("");

  const selectedTarget = useMemo(
    () =>
      targets.find((target) => target.targetId === selectedTargetId) ??
      targets[0] ??
      null,
    [selectedTargetId, targets],
  );

  const collectionOptions = useMemo(
    () =>
      collections.filter(
        (collection) =>
          selectedTarget?.collectionIds.includes(collection.id) ?? false,
      ),
    [collections, selectedTarget],
  );

  function applySelectedTarget(nextTargetId: string) {
    const nextTarget = targets.find(
      (target) => target.targetId === nextTargetId,
    );
    if (!nextTarget) return;
    const nextDraft =
      draftsByTargetId[nextTargetId] ??
      storedDrafts[nextTargetId] ??
      buildDatasetBindingEditorState(nextTarget);
    if (selectedTargetId) {
      setDraftsByTargetId((current) => ({
        ...current,
        [selectedTargetId]: cloneEditorState(draft),
      }));
    }
    setSelectedTargetId(nextTargetId);
    setDraft(cloneEditorState(nextDraft));
    setCopyFromTargetId("");
    setMessage(null);
    setError(null);
  }

  function copyBindingFromTarget(sourceTargetId: string) {
    const sourceTarget = targets.find(
      (target) => target.targetId === sourceTargetId,
    );
    if (!selectedTarget || !sourceTarget) return;
    const sourceDraft =
      draftsByTargetId[sourceTargetId] ??
      storedDrafts[sourceTargetId] ??
      resolveTargetDraftState(
        sourceTarget,
        new URLSearchParams(searchParams.toString()),
      );
    const nextDraft = normalizeDraftForTarget(selectedTarget, sourceDraft);
    setDraft(nextDraft);
    setDraftsByTargetId((current) => ({
      ...current,
      [selectedTarget.targetId]: nextDraft,
    }));
    setCopyFromTargetId(sourceTargetId);
    setMessage(`Copied from ${sourceTarget.title}.`);
    setError(null);
  }

  function applyDefaultBinding() {
    if (!selectedTarget) return;
    const nextDraft = buildDatasetBindingDefaultState(selectedTarget);
    setDraft(nextDraft);
    setCopyFromTargetId("");
    setMessage(null);
    setError(null);
  }

  useEffect(() => {
    if (!selectedTarget) return;
    const query = buildBindingQueryFromState(
      selectedTarget.targetId,
      draft,
      copyFromTargetId,
    );
    const nextHref = query ? `${pathname}?${query}` : pathname;
    if (searchParams.toString() !== query) {
      router.replace(nextHref, { scroll: false });
    }
  }, [copyFromTargetId, draft, pathname, router, searchParams, selectedTarget]);

  useEffect(() => {
    if (!selectedTarget) return;
    setDraftsByTargetId((current) => {
      const cached = current[selectedTarget.targetId];
      const nextDraft = cloneEditorState(draft);
      if (
        cached &&
        cached.collectionId === nextDraft.collectionId &&
        cached.mode === nextDraft.mode &&
        cached.limit === nextDraft.limit &&
        cached.filters.length === nextDraft.filters.length &&
        cached.sort.length === nextDraft.sort.length &&
        cached.filters.every((filter, index) => {
          const nextFilter = nextDraft.filters[index];
          return (
            nextFilter &&
            filter.fieldId === nextFilter.fieldId &&
            filter.operator === nextFilter.operator &&
            filter.value === nextFilter.value
          );
        }) &&
        cached.sort.every((entry, index) => {
          const nextSort = nextDraft.sort[index];
          return (
            nextSort &&
            entry.fieldId === nextSort.fieldId &&
            entry.direction === nextSort.direction
          );
        })
      ) {
        return current;
      }
      return {
        ...current,
        [selectedTarget.targetId]: nextDraft,
      };
    });
  }, [draft, selectedTarget]);

  useEffect(() => {
    if (!selectedTarget) return;
    writeStoredDrafts(siteId, locale, pageKey, {
      ...draftsByTargetId,
      [selectedTarget.targetId]: cloneEditorState(draft),
    });
  }, [draft, draftsByTargetId, locale, pageKey, selectedTarget, siteId]);

  useEffect(() => {
    if (lastHydratedSearchParamsRef.current === searchParamsString) return;

    const nextTargetId = getQueryTargetId(
      searchParams,
      initialTarget?.targetId ?? "",
    );
    const nextTarget = targets.find(
      (target) => target.targetId === nextTargetId,
    );
    if (!nextTarget) return;
    const nextDraft = buildHydratedDraftState(
      nextTarget,
      new URLSearchParams(searchParams.toString()),
      draftsByTargetId,
      storedDrafts,
    );
    const nextDraftJson = JSON.stringify(nextDraft);
    const currentDraftJson = JSON.stringify(draft);
    if (
      nextTargetId === selectedTargetId &&
      nextDraftJson === currentDraftJson
    ) {
      lastHydratedSearchParamsRef.current = searchParamsString;
      return;
    }

    setSelectedTargetId(nextTargetId);
    setDraft(nextDraft);
    setCopyFromTargetId(searchParams.get("copyFromTargetId")?.trim() ?? "");
    lastHydratedSearchParamsRef.current = searchParamsString;
  }, [
    draft,
    draftsByTargetId,
    initialTarget?.targetId,
    searchParams,
    searchParamsString,
    selectedTargetId,
    storedDrafts,
    targets,
  ]);

  useEffect(() => {
    if (!selectedTarget) return undefined;

    let cancelled = false;
    const timeout = window.setTimeout(async () => {
      setPreviewLoading(true);
      setPreviewError(null);
      try {
        const sampleRecords = await previewDatasetBinding(
          {
            locale,
            siteId,
            pageKey,
          },
          {
            targetId: selectedTarget.targetId,
            collectionId: draft.collectionId,
            mode: draft.mode,
            limit: draft.limit === "" ? undefined : draft.limit,
            filters: sanitizeFilters(draft.filters),
            sort: sanitizeSort(draft.sort),
            ...(cmsCollectionId ? { cmsCollectionId } : {}),
          },
        );
        if (!cancelled) {
          setPreviewRecords(sampleRecords);
        }
      } catch (previewFetchError) {
        if (!cancelled) {
          setPreviewError(
            previewFetchError instanceof Error
              ? previewFetchError.message
              : "Failed to build dataset preview.",
          );
          setPreviewRecords([]);
        }
      } finally {
        if (!cancelled) {
          setPreviewLoading(false);
        }
      }
    }, 280);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [
    draft.collectionId,
    draft.filters,
    draft.limit,
    draft.mode,
    draft.sort,
    cmsCollectionId,
    locale,
    pageKey,
    selectedTarget,
    siteId,
  ]);

  function updateFilter(
    index: number,
    patch: Partial<BuilderPageDatasetFilter>,
  ) {
    setDraft((current) => ({
      ...current,
      filters: current.filters.map((filter, filterIndex) =>
        filterIndex === index ? { ...filter, ...patch } : filter,
      ),
    }));
  }

  function addFilter() {
    if (!selectedTarget || draft.filters.length >= MAX_FILTER_ROWS) return;
    setDraft((current) => ({
      ...current,
      filters: [...current.filters, createBlankFilter(selectedTarget)],
    }));
  }

  function removeFilter(index: number) {
    setDraft((current) => ({
      ...current,
      filters: current.filters.filter(
        (_, filterIndex) => filterIndex !== index,
      ),
    }));
  }

  function updateSort(index: number, patch: Partial<BuilderPageDatasetSort>) {
    setDraft((current) => ({
      ...current,
      sort: current.sort.map((entry, sortIndex) =>
        sortIndex === index ? { ...entry, ...patch } : entry,
      ),
    }));
  }

  function addSort() {
    if (!selectedTarget || draft.sort.length >= MAX_SORT_ROWS) return;
    setDraft((current) => ({
      ...current,
      sort: [...current.sort, createBlankSort(selectedTarget)],
    }));
  }

  function removeSort(index: number) {
    setDraft((current) => ({
      ...current,
      sort: current.sort.filter((_, sortIndex) => sortIndex !== index),
    }));
  }

  async function saveBinding() {
    if (!selectedTarget) return;
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      const filters = sanitizeFilters(draft.filters);
      const sort = sanitizeSort(draft.sort);

      const result = await saveDatasetBinding(
        {
          locale,
          siteId,
          pageKey,
        },
        {
          targetId: selectedTarget.targetId,
          collectionId: draft.collectionId,
          mode: draft.mode,
          limit: draft.limit === "" ? undefined : draft.limit,
          filters,
          sort,
          expectedRevision,
          ...(cmsCollectionId ? { cmsCollectionId } : {}),
        },
      );
      setTargets(result.targets);
      if (typeof result.revision === "number")
        setExpectedRevision(result.revision);
      setMessage("Dataset binding saved.");
      setCopyFromTargetId("");
      const nextTarget = result.targets.find(
        (target) => target.targetId === selectedTarget.targetId,
      );
      if (nextTarget) {
        const nextDraft = buildDatasetBindingEditorState(nextTarget);
        setDraft(nextDraft);
        setDraftsByTargetId((current) => ({
          ...current,
          [nextTarget.targetId]: cloneEditorState(nextDraft),
        }));
      }
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save dataset binding.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function seedBinding() {
    if (!selectedTarget) return;
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      const result = await seedDatasetBinding(
        {
          locale,
          siteId,
          pageKey,
        },
        {
          targetId: selectedTarget.targetId,
          expectedRevision,
        },
      );
      setTargets(result.targets);
      if (typeof result.revision === "number")
        setExpectedRevision(result.revision);
      setCopyFromTargetId("");
      const nextTarget = result.targets.find(
        (target) => target.targetId === selectedTarget.targetId,
      );
      if (nextTarget) {
        const nextDraft = buildDatasetBindingEditorState(nextTarget);
        setDraft(nextDraft);
        setDraftsByTargetId((current) => ({
          ...current,
          [nextTarget.targetId]: cloneEditorState(nextDraft),
        }));
      }
      setMessage("Default binding seeded.");
    } catch (seedError) {
      setError(
        seedError instanceof Error
          ? seedError.message
          : "Failed to seed dataset binding.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="builder-dataset-binding-editor"
      data-dataset-binding-editor={pageKey}
    >
      <aside className="builder-dataset-binding-card">
        <h2 className="builder-dataset-binding-card-title">Dataset targets</h2>
        <div className="builder-dataset-binding-target-list">
          {targets.map((target) => (
            <button
              key={target.targetId}
              type="button"
              onClick={() => applySelectedTarget(target.targetId)}
              aria-pressed={target.targetId === selectedTargetId}
              className={`builder-dataset-binding-target${target.targetId === selectedTargetId ? " builder-dataset-binding-target--active" : ""}`}
            >
              {target.title}
              <div className="builder-dataset-binding-target-meta">
                {target.currentBinding.collectionId} · limit{" "}
                {target.currentBinding.limit ?? "auto"}
              </div>
            </button>
          ))}
        </div>
      </aside>

      {selectedTarget ? (
        <section className="builder-dataset-binding-card">
          <h2 className="builder-dataset-binding-card-title">
            {selectedTarget.title}
          </h2>
          <p className="builder-dataset-binding-card-description">
            {selectedTarget.description}
          </p>
          <div className="builder-dataset-binding-toolbar">
            <button
              type="button"
              onClick={() => applyDefaultBinding()}
              disabled={busy}
              className="builder-action-btn"
            >
              Reset to defaults
            </button>
            <button
              type="button"
              onClick={() => void seedBinding()}
              disabled={busy}
              className="builder-action-btn builder-action-btn--primary"
            >
              Seed defaults and save
            </button>
            <span className="builder-dataset-binding-inline-help">
              Allowed collections: {selectedTarget.collectionIds.join(", ")}
            </span>
          </div>

          {targets.length > 1 ? (
            <div className="builder-dataset-binding-toolbar">
              <label className="builder-dataset-binding-label builder-dataset-binding-label--compact">
                Copy binding from
                <select
                  value={copyFromTargetId}
                  onChange={(event) => setCopyFromTargetId(event.target.value)}
                  className="builder-dataset-binding-input"
                  disabled={busy}
                >
                  <option value="">Choose a target</option>
                  {targets
                    .filter(
                      (target) => target.targetId !== selectedTarget.targetId,
                    )
                    .map((target) => (
                      <option key={target.targetId} value={target.targetId}>
                        {target.title}
                      </option>
                    ))}
                </select>
              </label>
              <button
                type="button"
                className="builder-action-btn"
                disabled={busy || !copyFromTargetId}
                onClick={() => copyBindingFromTarget(copyFromTargetId)}
              >
                Copy draft
              </button>
              <span className="builder-dataset-binding-inline-help">
                Use an existing target as the starting point for this binding.
              </span>
            </div>
          ) : null}

          <div className="builder-dataset-binding-form">
            <label className="builder-dataset-binding-label">
              Collection
              <select
                value={draft.collectionId}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    collectionId: event.target.value,
                  }))
                }
                className="builder-dataset-binding-input"
                disabled={busy}
              >
                {collectionOptions.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.title}
                  </option>
                ))}
              </select>
            </label>

            {cmsBindableTargets.length > 0 ? (
              <label className="builder-dataset-binding-label">
                CMS collection (your data)
                <select
                  value={cmsCollectionId}
                  onChange={(event) => setCmsCollectionId(event.target.value)}
                  className="builder-dataset-binding-input"
                  disabled={busy}
                >
                  <option value="">— Use built-in source —</option>
                  {cmsBindableTargets.map((target) => (
                    <option key={target.targetId} value={target.collectionId}>
                      {target.label} ({target.recordCount})
                    </option>
                  ))}
                </select>
                <span className="builder-dataset-binding-help">
                  Bind this repeater to a collection you created in the Content
                  Manager.
                </span>
              </label>
            ) : null}

            <label className="builder-dataset-binding-label">
              Limit
              <div className="builder-dataset-binding-limit">
                <input
                  type="number"
                  value={draft.limit}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      limit:
                        event.target.value === ""
                          ? ""
                          : Number(event.target.value),
                    }))
                  }
                  className="builder-dataset-binding-input builder-dataset-binding-input--number"
                  min={0}
                  disabled={busy}
                />
                <div className="builder-dataset-binding-chip-row">
                  {(selectedTarget.limitOptions ?? []).map((limitOption) => (
                    <button
                      key={limitOption}
                      type="button"
                      className="builder-action-btn"
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          limit: limitOption,
                        }))
                      }
                      disabled={busy}
                    >
                      {limitOption}
                    </button>
                  ))}
                </div>
              </div>
            </label>

            <div className="builder-dataset-binding-fieldset">
              <div className="builder-dataset-binding-section-head">
                <div>
                  <div className="builder-dataset-binding-section-title">
                    Filters
                  </div>
                  <div className="builder-dataset-binding-section-meta">
                    Allowed fields:{" "}
                    {selectedTarget.filterFields
                      .map((field) => field.label)
                      .join(", ") || "none"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addFilter}
                  disabled={busy || draft.filters.length >= MAX_FILTER_ROWS}
                  className="builder-action-btn"
                >
                  Add filter
                </button>
              </div>

              <div className="builder-dataset-binding-row-list">
                {draft.filters.map((filter, index) => (
                  <div
                    key={`${filter.fieldId}-${index}`}
                    className="builder-dataset-binding-filter-row"
                  >
                    <select
                      aria-label={`Filter ${index + 1} field`}
                      value={filter.fieldId}
                      onChange={(event) =>
                        updateFilter(index, { fieldId: event.target.value })
                      }
                      className="builder-dataset-binding-input"
                      disabled={busy}
                    >
                      {selectedTarget.filterFields.map((field) => (
                        <option key={field.fieldId} value={field.fieldId}>
                          {field.label}
                        </option>
                      ))}
                    </select>
                    <select
                      aria-label={`Filter ${index + 1} operator`}
                      value={filter.operator}
                      onChange={(event) =>
                        updateFilter(index, {
                          operator:
                            event.target.value === "equals"
                              ? "equals"
                              : "contains",
                        })
                      }
                      className="builder-dataset-binding-input"
                      disabled={busy}
                    >
                      <option value="contains">contains</option>
                      <option value="equals">equals</option>
                    </select>
                    <input
                      aria-label={`Filter ${index + 1} value`}
                      value={filter.value}
                      onChange={(event) =>
                        updateFilter(index, { value: event.target.value })
                      }
                      placeholder="Value"
                      className="builder-dataset-binding-input"
                      disabled={busy}
                    />
                    <button
                      type="button"
                      onClick={() => removeFilter(index)}
                      className="builder-action-btn"
                      disabled={busy}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {draft.filters.length === 0 ? (
                  <div className="builder-dataset-binding-empty">
                    No filters configured.
                  </div>
                ) : null}
              </div>
            </div>

            <div className="builder-dataset-binding-fieldset">
              <div className="builder-dataset-binding-section-head">
                <div>
                  <div className="builder-dataset-binding-section-title">
                    Sort
                  </div>
                  <div className="builder-dataset-binding-section-meta">
                    Allowed fields:{" "}
                    {selectedTarget.sortFields
                      .map((field) => field.label)
                      .join(", ") || "none"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addSort}
                  disabled={busy || draft.sort.length >= MAX_SORT_ROWS}
                  className="builder-action-btn"
                >
                  Add sort
                </button>
              </div>

              <div className="builder-dataset-binding-row-list">
                {draft.sort.map((entry, index) => (
                  <div
                    key={`${entry.fieldId}-${index}`}
                    className="builder-dataset-binding-sort-row"
                  >
                    <select
                      aria-label={`Sort ${index + 1} field`}
                      value={entry.fieldId}
                      onChange={(event) =>
                        updateSort(index, { fieldId: event.target.value })
                      }
                      className="builder-dataset-binding-input"
                      disabled={busy}
                    >
                      {selectedTarget.sortFields.map((field) => (
                        <option key={field.fieldId} value={field.fieldId}>
                          {field.label}
                        </option>
                      ))}
                    </select>
                    <select
                      aria-label={`Sort ${index + 1} direction`}
                      value={entry.direction}
                      onChange={(event) =>
                        updateSort(index, {
                          direction:
                            event.target.value === "desc" ? "desc" : "asc",
                        })
                      }
                      className="builder-dataset-binding-input"
                      disabled={busy}
                    >
                      <option value="asc">ascending</option>
                      <option value="desc">descending</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeSort(index)}
                      className="builder-action-btn"
                      disabled={busy}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {draft.sort.length === 0 ? (
                  <div className="builder-dataset-binding-empty">
                    No sort order configured.
                  </div>
                ) : null}
              </div>
            </div>

            <label className="builder-dataset-binding-label">
              Mode
              <select
                value={draft.mode}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    mode: event.target.value,
                  }))
                }
                className="builder-dataset-binding-input"
                disabled={busy}
              >
                {selectedTarget.modeOptions.map((modeOption) => (
                  <option key={modeOption} value={modeOption}>
                    {modeOption}
                  </option>
                ))}
              </select>
            </label>

            <div className="builder-dataset-binding-actions">
              <button
                type="button"
                onClick={() => void saveBinding()}
                disabled={busy}
                className="builder-action-btn builder-action-btn--primary"
              >
                Save binding
              </button>
              {message ? (
                <span
                  role="status"
                  aria-live="polite"
                  className="builder-dataset-binding-status builder-dataset-binding-status--success"
                >
                  {message}
                </span>
              ) : null}
              {error ? (
                <span
                  role="alert"
                  className="builder-dataset-binding-status builder-dataset-binding-status--error"
                >
                  {error}
                </span>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {selectedTarget ? (
        <section className="builder-dataset-binding-card builder-dataset-binding-preview">
          <h2 className="builder-dataset-binding-card-title">Live preview</h2>
          <p className="builder-dataset-binding-card-description">
            Preview updates automatically as you edit the draft binding. This is
            read-only and does not save anything.
          </p>
          {previewLoading ? (
            <p className="builder-dataset-binding-muted">Refreshing preview…</p>
          ) : null}
          {previewError ? (
            <p className="builder-dataset-binding-status builder-dataset-binding-status--error">
              {previewError}
            </p>
          ) : null}
          {!previewLoading && !previewError ? (
            <p className="builder-dataset-binding-muted">
              Showing {previewRecords.length} preview record
              {previewRecords.length === 1 ? "" : "s"}.
            </p>
          ) : null}
          <div className="builder-dataset-binding-preview-list">
            {previewRecords.map((record) => (
              <article
                key={record.recordId}
                className="builder-dataset-binding-preview-record"
              >
                <div className="builder-dataset-binding-preview-head">
                  <div>
                    <strong className="builder-dataset-binding-preview-title">
                      {record.primaryLabel}
                    </strong>
                    <span className="builder-dataset-binding-preview-meta">
                      {record.secondaryLabel}
                    </span>
                  </div>
                  <span className="builder-dataset-binding-preview-route">
                    {record.routePath}
                  </span>
                </div>
                <dl className="builder-dataset-binding-preview-fields">
                  {Object.entries(record.fieldValues)
                    .slice(0, 4)
                    .map(([fieldId, value]) => (
                      <div key={fieldId}>
                        <dt className="builder-dataset-binding-preview-field-name">
                          {fieldId}
                        </dt>
                        <dd className="builder-dataset-binding-preview-field-value">
                          {value || "—"}
                        </dd>
                      </div>
                    ))}
                </dl>
              </article>
            ))}
            {!previewLoading && previewRecords.length === 0 ? (
              <div className="builder-dataset-binding-empty">
                No preview records returned for this draft binding.
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
