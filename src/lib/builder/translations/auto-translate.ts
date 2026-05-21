/**
 * F115 — Auto-translate adapter.
 *
 * Wraps the existing `/api/builder/ai-generator/text` (action='translate')
 * endpoint as the translation provider. Returns a Record<nodeId, string>
 * of proposed translations — does NOT persist. Callers (typically the
 * editor UI) are expected to review and then submit via the /edit route.
 *
 * Calls are issued sequentially with bounded concurrency (default 4) to
 * avoid hammering the upstream model. The AI text endpoint accepts one
 * text per request — true batching is a follow-up. See TODO at the
 * bottom of this file.
 */

import type { Locale } from '@/lib/locales';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';

export interface AutoTranslateSourceNode {
  nodeId: string;
  text: string;
  /** Hint for what role the text plays (e.g. 'button-label', 'heading'). */
  elementHint?: string;
}

export interface AutoTranslateProposal {
  nodeId: string;
  text: string;
}

export interface AutoTranslateError {
  nodeId: string;
  error: string;
}

export interface AutoTranslateResult {
  ok: boolean;
  proposals: AutoTranslateProposal[];
  errors: AutoTranslateError[];
}

/**
 * Pure helper: extract text-bearing nodes from a draft canvas. Mirrors
 * the subset of node kinds that sync.ts treats as translatable. Used by
 * the route + tests so we can decouple "what to translate" from "how".
 */
export function extractTranslatableNodes(
  canvas: BuilderCanvasDocument,
): AutoTranslateSourceNode[] {
  const out: AutoTranslateSourceNode[] = [];
  for (const node of canvas.nodes) {
    const item = nodeToSource(node);
    if (item) out.push(item);
  }
  return out;
}

function nodeToSource(node: BuilderCanvasNode): AutoTranslateSourceNode | null {
  switch (node.kind) {
    case 'text': {
      const text = (node.content as { text?: unknown }).text;
      if (typeof text !== 'string' || text.trim().length === 0) return null;
      return { nodeId: node.id, text, elementHint: 'body text' };
    }
    case 'heading': {
      const text = (node.content as { text?: unknown }).text;
      if (typeof text !== 'string' || text.trim().length === 0) return null;
      return { nodeId: node.id, text, elementHint: 'heading' };
    }
    case 'button': {
      const label = (node.content as { label?: unknown }).label;
      if (typeof label !== 'string' || label.trim().length === 0) return null;
      return { nodeId: node.id, text: label, elementHint: 'button label' };
    }
    case 'image': {
      const alt = (node.content as { alt?: unknown }).alt;
      if (typeof alt !== 'string' || alt.trim().length === 0) return null;
      return { nodeId: node.id, text: alt, elementHint: 'image alt text' };
    }
    default:
      return null;
  }
}

export interface AutoTranslateOptions {
  /** Absolute or relative URL — tests inject a localhost URL. */
  endpoint?: string;
  /** Forward this cookie header (e.g. CSRF / basic auth) when fetching. */
  cookieHeader?: string;
  /** Override the global fetch (e.g. for tests). */
  fetchImpl?: typeof fetch;
  /** Max parallel in-flight requests. Default 4. */
  concurrency?: number;
  /** Site / app name to feed the prompt as additional context. */
  siteName?: string;
}

const DEFAULT_ENDPOINT = '/api/builder/ai-generator/text';
const DEFAULT_CONCURRENCY = 4;

async function callTextEndpoint(
  fetchImpl: typeof fetch,
  endpoint: string,
  cookieHeader: string | undefined,
  payload: {
    text: string;
    sourceLocale: Locale;
    targetLocale: Locale;
    siteName?: string;
    elementHint?: string;
  },
): Promise<string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (cookieHeader) headers.Cookie = cookieHeader;
  const res = await fetchImpl(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      action: 'translate',
      ...payload,
    }),
  });
  const body = (await res.json().catch(() => null)) as
    | { ok?: boolean; text?: string; error?: string; message?: string }
    | null;
  if (!res.ok || !body?.ok) {
    throw new Error(body?.message || body?.error || `text endpoint failed (${res.status})`);
  }
  if (typeof body.text !== 'string' || body.text.length === 0) {
    throw new Error('text endpoint returned empty text');
  }
  return body.text;
}

/**
 * Translate a batch of source nodes. Runs with bounded concurrency.
 * Never throws — individual failures land in `result.errors`.
 */
export async function autoTranslateNodes(
  sources: AutoTranslateSourceNode[],
  sourceLocale: Locale,
  targetLocale: Locale,
  options: AutoTranslateOptions = {},
): Promise<AutoTranslateResult> {
  if (sourceLocale === targetLocale) {
    return {
      ok: false,
      proposals: [],
      errors: sources.map((source) => ({
        nodeId: source.nodeId,
        error: 'sourceLocale_eq_targetLocale',
      })),
    };
  }
  const fetchImpl = options.fetchImpl ?? fetch;
  const endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
  const concurrency = Math.max(
    1,
    Math.min(8, options.concurrency ?? DEFAULT_CONCURRENCY),
  );

  const proposals: AutoTranslateProposal[] = [];
  const errors: AutoTranslateError[] = [];
  let cursor = 0;

  async function worker(): Promise<void> {
    while (cursor < sources.length) {
      const index = cursor;
      cursor += 1;
      const source = sources[index];
      try {
        const text = await callTextEndpoint(
          fetchImpl,
          endpoint,
          options.cookieHeader,
          {
            text: source.text,
            sourceLocale,
            targetLocale,
            siteName: options.siteName,
            elementHint: source.elementHint,
          },
        );
        proposals.push({ nodeId: source.nodeId, text });
      } catch (err) {
        errors.push({
          nodeId: source.nodeId,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, sources.length) }, () => worker());
  await Promise.all(workers);

  return {
    ok: errors.length === 0,
    proposals,
    errors,
  };
}

// TODO(F115 follow-up): once the AI text endpoint supports an array of
// items in one request, replace the per-node fetch loop with a single
// batched call (target chunk size ~10). The current per-call latency is
// the limiting factor for large pages.