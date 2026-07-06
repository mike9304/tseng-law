import type {
  BuilderDatasetSampleRecord,
  BuilderPageDatasetOverview,
} from "@/lib/builder/datasets";
import type {
  BuilderPageDatasetFilter,
  BuilderPageDatasetSort,
} from "@/lib/builder/types";
import {
  buildBuilderDatasetRequestHeaders,
  resolveBuilderDatasetClientUrl,
} from "@/components/builder/datasets/datasetSeedClient";

type DatasetBindingRequestContext = {
  locale: string;
  siteId: string;
  pageKey: string;
};

type DatasetBindingDraftPayload = {
  targetId: string;
  collectionId: string;
  mode: string;
  limit?: number;
  filters: BuilderPageDatasetFilter[];
  sort: BuilderPageDatasetSort[];
  cmsCollectionId?: string;
};

type DatasetBindingSavePayload = DatasetBindingDraftPayload & {
  expectedRevision: number;
};

type DatasetBindingSeedPayload = {
  targetId: string;
  expectedRevision: number;
};

type DatasetBindingMutationResult = {
  revision?: number;
  targets: BuilderPageDatasetOverview[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function endpoint(context: DatasetBindingRequestContext, suffix = ""): string {
  return resolveBuilderDatasetClientUrl(
    `/api/builder/sites/${encodeURIComponent(context.siteId)}/pages/${encodeURIComponent(context.pageKey)}/datasets${suffix}?locale=${encodeURIComponent(context.locale)}`,
  );
}

async function readPayload(
  response: Response,
): Promise<Record<string, unknown>> {
  try {
    const payload: unknown = await response.json();
    return isRecord(payload) ? payload : {};
  } catch {
    return {};
  }
}

function readApiError(
  payload: Record<string, unknown>,
  fallback: string,
): string {
  const error = payload.error;
  if (typeof error === "string" && error.trim()) return error;
  const message = payload.message;
  if (typeof message === "string" && message.trim()) return message;
  return fallback;
}

function fieldValuesAreStrings(
  value: unknown,
): value is Record<string, string> {
  return (
    isRecord(value) &&
    Object.values(value).every((entry) => typeof entry === "string")
  );
}

function isDatasetSampleRecord(
  value: unknown,
): value is BuilderDatasetSampleRecord {
  if (!isRecord(value)) return false;
  return (
    typeof value.recordId === "string" &&
    typeof value.primaryLabel === "string" &&
    typeof value.secondaryLabel === "string" &&
    typeof value.routePath === "string" &&
    fieldValuesAreStrings(value.fieldValues)
  );
}

function isDatasetOverview(
  value: unknown,
): value is BuilderPageDatasetOverview {
  if (!isRecord(value)) return false;
  return (
    typeof value.targetId === "string" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    Array.isArray(value.collectionIds) &&
    isRecord(value.currentBinding)
  );
}

function readTargets(
  payload: Record<string, unknown>,
  fallback: string,
): BuilderPageDatasetOverview[] {
  if (!Array.isArray(payload.targets)) {
    throw new Error(fallback);
  }
  const targets = payload.targets.filter(isDatasetOverview);
  if (targets.length !== payload.targets.length) {
    throw new Error(fallback);
  }
  return targets;
}

async function sendJsonRequest(
  url: string,
  method: "POST" | "PUT",
  body: Record<string, unknown>,
): Promise<{ response: Response; payload: Record<string, unknown> }> {
  const response = await fetch(url, {
    method,
    credentials: "same-origin",
    headers: buildBuilderDatasetRequestHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(body),
  });
  return {
    response,
    payload: await readPayload(response),
  };
}

export async function previewDatasetBinding(
  context: DatasetBindingRequestContext,
  draft: DatasetBindingDraftPayload,
): Promise<BuilderDatasetSampleRecord[]> {
  const { response, payload } = await sendJsonRequest(
    endpoint(context, "/preview"),
    "POST",
    draft,
  );
  if (!response.ok || payload.ok !== true) {
    throw new Error(readApiError(payload, "Failed to build dataset preview."));
  }
  const sampleRecords = payload.sampleRecords;
  return Array.isArray(sampleRecords)
    ? sampleRecords.filter(isDatasetSampleRecord)
    : [];
}

export async function saveDatasetBinding(
  context: DatasetBindingRequestContext,
  draft: DatasetBindingSavePayload,
): Promise<DatasetBindingMutationResult> {
  const { response, payload } = await sendJsonRequest(
    endpoint(context),
    "PUT",
    draft,
  );
  if (!response.ok || payload.ok !== true) {
    throw new Error(readApiError(payload, "Failed to save dataset binding."));
  }
  const revision =
    typeof payload.revision === "number" ? payload.revision : undefined;
  return {
    revision,
    targets: readTargets(payload, "Failed to save dataset binding."),
  };
}

export async function seedDatasetBinding(
  context: DatasetBindingRequestContext,
  body: DatasetBindingSeedPayload,
): Promise<DatasetBindingMutationResult> {
  const { response, payload } = await sendJsonRequest(
    endpoint(context, "/seed"),
    "POST",
    body,
  );
  if (!response.ok || payload.ok !== true) {
    throw new Error(readApiError(payload, "Failed to seed dataset binding."));
  }
  const revision =
    typeof payload.revision === "number" ? payload.revision : undefined;
  return {
    revision,
    targets: readTargets(payload, "Failed to seed dataset binding."),
  };
}
