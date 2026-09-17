import {
  AI_INTAKE_BACKEND_TIMEOUT_MS,
  AI_INTAKE_UPSTASH_RESPONSE_MAX_CHARS,
} from '@/lib/ai-intake/constants';

export type AiIntakeUpstashConfig = {
  url: string;
  token: string;
};

export type AiIntakeUpstashCommandResult =
  | { ok: true; result: unknown }
  | { ok: false };

export function resolveAiIntakeUpstash(): AiIntakeUpstashConfig | null {
  const explicitUrl = process.env.UPSTASH_REDIS_REST_URL?.trim() ?? '';
  const explicitToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ?? '';
  if (explicitUrl || explicitToken) {
    if (!explicitUrl || !explicitToken) return null;
    return { url: explicitUrl.replace(/\/+$/, ''), token: explicitToken };
  }

  const kvUrl = process.env.KV_REST_API_URL?.trim() ?? '';
  const kvToken = process.env.KV_REST_API_TOKEN?.trim() ?? '';
  if (!kvUrl || !kvToken) return null;
  return { url: kvUrl.replace(/\/+$/, ''), token: kvToken };
}

function parseJsonBounded(text: string): unknown | undefined {
  if (text.length > AI_INTAKE_UPSTASH_RESPONSE_MAX_CHARS) return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

function nonemptyError(value: unknown): boolean {
  if (value === undefined || value === null || value === '') return false;
  return true;
}

/**
 * Redis nil is a successful command result. Upstash REST encodes it as HTTP 200
 * `{ "result": null }`. That is `{ok:true,result:null}`, not a transport failure.
 */
export function readAiIntakeUpstashEnvelope(json: unknown): AiIntakeUpstashCommandResult {
  if (!json || typeof json !== 'object') return { ok: false };
  const record = json as { error?: unknown; result?: unknown };
  if (nonemptyError(record.error)) return { ok: false };
  if (!Object.prototype.hasOwnProperty.call(record, 'result')) return { ok: false };
  return { ok: true, result: record.result };
}

async function upstashCommand(
  config: AiIntakeUpstashConfig,
  command: unknown[],
): Promise<AiIntakeUpstashCommandResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_INTAKE_BACKEND_TIMEOUT_MS);
  try {
    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
      signal: controller.signal,
    });
    if (!response.ok) return { ok: false };
    const text = await response.text();
    const json = parseJsonBounded(text);
    if (json === undefined) return { ok: false };
    return readAiIntakeUpstashEnvelope(json);
  } catch {
    return { ok: false };
  } finally {
    clearTimeout(timeout);
  }
}

export async function aiIntakeUpstashEval(
  config: AiIntakeUpstashConfig,
  script: string,
  keys: string[],
  args: Array<string | number>,
): Promise<AiIntakeUpstashCommandResult> {
  return upstashCommand(config, ['EVAL', script, String(keys.length), ...keys, ...args.map(String)]);
}

export async function aiIntakeUpstashCommand(
  config: AiIntakeUpstashConfig,
  command: Array<string | number>,
): Promise<AiIntakeUpstashCommandResult> {
  return upstashCommand(config, command.map(String));
}
