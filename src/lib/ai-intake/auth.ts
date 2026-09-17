import { createHash } from 'node:crypto';
import { z } from 'zod';
import { safeEqualStrings } from '@/lib/builder/security/timing-safe';
import {
  AI_INTAKE_CLIENT_ID_PATTERN,
  AI_INTAKE_MAX_BEARER_CHARS,
  AI_INTAKE_MAX_CLIENTS,
  AI_INTAKE_MAX_CLIENTS_JSON_CHARS,
  AI_INTAKE_MIN_BEARER_CHARS,
  AI_INTAKE_SHA256_HEX_PATTERN,
} from '@/lib/ai-intake/constants';

const clientLimitsSchema = z
  .object({
    requirementsMax: z.number().int().min(1).max(10_000).optional(),
    previewMax: z.number().int().min(1).max(1_000).optional(),
    submitMax: z.number().int().min(1).max(100).optional(),
  })
  .strict();

const clientSchema = z
  .object({
    clientId: z.string().regex(AI_INTAKE_CLIENT_ID_PATTERN),
    keySha256: z.string().regex(AI_INTAKE_SHA256_HEX_PATTERN),
    limits: clientLimitsSchema.optional(),
  })
  .strict();

const clientsSchema = z.array(clientSchema).min(1).max(AI_INTAKE_MAX_CLIENTS);

export type AiIntakeClient = z.infer<typeof clientSchema>;

export type AiIntakeAuthResult =
  | { ok: true; client: AiIntakeClient }
  | { ok: false; reason: 'unauthenticated' | 'config' };

let cachedEnv: string | undefined;
let cachedClients: AiIntakeClient[] | null | undefined;

export function resetAiIntakeAuthCacheForTests(): void {
  cachedEnv = undefined;
  cachedClients = undefined;
}

function sha256Hex(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function loadClients(): AiIntakeClient[] | null {
  const raw = process.env.AI_INTAKE_CLIENTS;
  if (raw === cachedEnv && cachedClients !== undefined) return cachedClients;
  cachedEnv = raw;
  cachedClients = parseClients(raw);
  return cachedClients;
}

/**
 * Return only the public identifiers from the validated client allowlist.
 * Authentication digests, limits, and the raw environment value never leave
 * this module. Invalid or unavailable configuration is an empty allowlist.
 */
export function getConfiguredAiIntakeClientIds(): readonly string[] {
  try {
    const clients = loadClients();
    return Object.freeze(clients ? clients.map((client) => client.clientId) : []);
  } catch {
    return Object.freeze([]);
  }
}

function parseClients(raw: string | undefined): AiIntakeClient[] | null {
  if (!raw || raw.trim().length === 0) return null;
  if (raw.length > AI_INTAKE_MAX_CLIENTS_JSON_CHARS) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  const result = clientsSchema.safeParse(parsed);
  if (!result.success) return null;
  const clientIds = new Set<string>();
  const keyDigests = new Set<string>();
  for (const client of result.data) {
    if (clientIds.has(client.clientId) || keyDigests.has(client.keySha256)) return null;
    clientIds.add(client.clientId);
    keyDigests.add(client.keySha256);
  }
  return result.data;
}

function parseBearer(header: string | null): string | null {
  if (!header) return null;
  const match = /^Bearer\s+(\S+)$/.exec(header.trim());
  if (!match) return null;
  const token = match[1];
  if (token.length < AI_INTAKE_MIN_BEARER_CHARS || token.length > AI_INTAKE_MAX_BEARER_CHARS) return null;
  return token;
}

export function authenticateAiIntakeRequest(headers: Headers): AiIntakeAuthResult {
  const clients = loadClients();
  if (!clients) return { ok: false, reason: 'config' };

  const presented = parseBearer(headers.get('authorization'));
  if (!presented) return { ok: false, reason: 'unauthenticated' };

  const presentedDigest = sha256Hex(presented);
  let matched: AiIntakeClient | null = null;
  for (const client of clients) {
    if (safeEqualStrings(presentedDigest, client.keySha256)) {
      matched = client;
    }
  }
  if (!matched) return { ok: false, reason: 'unauthenticated' };
  return { ok: true, client: matched };
}
