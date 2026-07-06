export type CodeSlotRunStatus =
  | { readonly state: 'idle' }
  | { readonly state: 'running' }
  | {
    readonly state: 'success';
    readonly result: string;
    readonly logs: readonly string[];
  }
  | {
    readonly state: 'error';
    readonly error: string;
    readonly logs: readonly string[];
  };

export type CodeSlotRunResponse = {
  readonly ok?: boolean;
  readonly result?: unknown;
  readonly error?: string;
  readonly logs?: readonly { readonly message?: string }[];
};

export type CodeSlotHistoryLogEntry = {
  readonly id: string;
  readonly level: string;
  readonly message: string;
  readonly timestamp: string;
  readonly reference?: string;
};

export type CodeSlotLogsResponse = {
  readonly ok?: boolean;
  readonly entries?: readonly unknown[];
};

export type DevFunctionSummary = {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly enabled: boolean;
};

export type FunctionsState =
  | { readonly state: 'loading' }
  | { readonly state: 'loaded'; readonly functions: readonly DevFunctionSummary[] }
  | { readonly state: 'error' };

export function stringifyCodeSlotResult(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'undefined') return 'undefined';
  try {
    return JSON.stringify(value, null, 2) ?? 'null';
  } catch (error) {
    if (error instanceof TypeError) return String(value);
    throw error;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

export function isCodeSlotRunResponse(value: unknown): value is CodeSlotRunResponse {
  return isRecord(value);
}

function isCodeSlotHistoryLogEntry(value: unknown): value is CodeSlotHistoryLogEntry {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string'
    && typeof value.level === 'string'
    && typeof value.message === 'string'
    && typeof value.timestamp === 'string'
    && (typeof value.reference === 'undefined' || typeof value.reference === 'string');
}

function isDevFunctionSummary(value: unknown): value is DevFunctionSummary {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string'
    && typeof value.name === 'string'
    && typeof value.slug === 'string'
    && typeof value.enabled === 'boolean';
}

export function functionsFromResponse(value: unknown): readonly DevFunctionSummary[] | null {
  if (!isRecord(value) || !Array.isArray(value.functions)) return null;
  const functions = value.functions.filter(isDevFunctionSummary);
  return functions.length === value.functions.length ? functions : null;
}

export function logsFromRunResponse(payload: CodeSlotRunResponse): readonly string[] {
  return payload.logs
    ?.map((entry) => entry.message)
    .filter((message): message is string => typeof message === 'string' && message.length > 0)
    ?? [];
}

export function historyLogsFromResponse(value: unknown): readonly CodeSlotHistoryLogEntry[] | null {
  if (!isRecord(value) || value.ok !== true || !Array.isArray(value.entries)) return null;
  const entries = value.entries.filter(isCodeSlotHistoryLogEntry);
  return entries.length === value.entries.length ? entries : null;
}

export function functionOptionLabel(fn: DevFunctionSummary, disabledSuffix: string): string {
  const base = `${fn.name} (${fn.slug})`;
  return fn.enabled ? base : `${base} - ${disabledSuffix}`;
}
