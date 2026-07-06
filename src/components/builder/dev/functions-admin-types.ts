import type { DevLogEntry } from '@/lib/builder/dev/logs-store';

export interface BuilderFunctionRecord {
  id: string;
  name: string;
  slug: string;
  code: string;
  runtime: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BuilderDevLogEntry = DevLogEntry;

export type FunctionsResponse =
  | { ok: true; functions: BuilderFunctionRecord[] }
  | { ok: false; error?: string };

export type FunctionMutationResponse =
  | { ok: true; function: BuilderFunctionRecord }
  | { ok: false; error?: string; issue?: { message?: string } };

export type InvokeResponse =
  | { ok: true; result: unknown; logs: Array<{ level: string; message: string }> }
  | { ok: false; error?: string };

export type LogsResponse =
  | { ok: true; entries: BuilderDevLogEntry[] }
  | { ok: false; error?: string };
