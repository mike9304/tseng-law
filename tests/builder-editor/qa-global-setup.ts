import type { FullConfig } from '@playwright/test';
import { randomBytes } from 'node:crypto';
import path from 'node:path';
import {
  QA_MANIFEST_SCHEMA_VERSION,
  loadReadyQaIsolationManifestForCoordinator,
  resolveQaIsolationManifestPath,
  verifyQaAttestationResponse,
} from '../../src/lib/builder/security/qa-runtime-attestation';
import type {
  QaAttestationResponse,
} from '../../src/lib/builder/security/qa-runtime-attestation';

const ATTESTATION_TIMEOUT_MS = 10_000;
const HEX_256_PATTERN = /^[a-f0-9]{64}$/;

const ATTESTATION_RESPONSE_KEYS = [
  'schemaVersion',
  'runId',
  'serverPid',
  'challenge',
  'signature',
] as const;

function requireInternalEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`QA attestation is missing the internal ${name} assertion.`);
  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isQaAttestationPayload(value: unknown): value is QaAttestationResponse {
  if (!isRecord(value)) return false;
  const actualKeys = Object.keys(value).sort();
  const expectedKeys = [...ATTESTATION_RESPONSE_KEYS].sort();
  return isRecord(value)
    && actualKeys.length === expectedKeys.length
    && actualKeys.every((key, index) => key === expectedKeys[index])
    && value.schemaVersion === QA_MANIFEST_SCHEMA_VERSION
    && typeof value.runId === 'string'
    && typeof value.serverPid === 'number'
    && Number.isSafeInteger(value.serverPid)
    && typeof value.challenge === 'string'
    && typeof value.signature === 'string'
    && HEX_256_PATTERN.test(value.signature);
}

export default async function qaGlobalSetup(_config: FullConfig): Promise<void> {
  const repositoryRoot = path.resolve(__dirname, '..', '..');
  if (requireInternalEnvironment('QA_INTERNAL_REPOSITORY_ROOT') !== repositoryRoot) {
    throw new Error('QA attestation repository assertion does not match this checkout.');
  }

  const baseUrl = requireInternalEnvironment('QA_INTERNAL_BASE_URL');
  const manifestPath = resolveQaIsolationManifestPath({ repositoryRoot, baseUrl });
  if (requireInternalEnvironment('QA_INTERNAL_MANIFEST_PATH') !== manifestPath) {
    throw new Error('QA attestation manifest assertion does not match the fixed coordinator path.');
  }

  const initialManifest = loadReadyQaIsolationManifestForCoordinator({
    repositoryRoot,
    baseUrl,
  });
  if (
    initialManifest.runId !== requireInternalEnvironment('QA_INTERNAL_RUN_ID')
    || initialManifest.nonce !== requireInternalEnvironment('QA_INTERNAL_ATTESTATION_NONCE')
  ) {
    throw new Error('QA attestation manifest identity changed before global setup.');
  }

  const challenge = randomBytes(32).toString('hex');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ATTESTATION_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(new URL('/api/builder/_qa/attestation', baseUrl), {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'cache-control': 'no-store',
        pragma: 'no-cache',
        'x-builder-qa-challenge': challenge,
      },
      signal: controller.signal,
    });
  } catch {
    throw new Error('QA attestation endpoint was unreachable or timed out.');
  } finally {
    clearTimeout(timeout);
  }

  if (response.status !== 200) {
    throw new Error(`QA attestation endpoint rejected the challenge (HTTP ${response.status}).`);
  }
  const cacheControl = response.headers.get('cache-control') ?? '';
  if (!cacheControl.split(',').some((directive) => directive.trim().toLowerCase() === 'no-store')) {
    throw new Error('QA attestation response must set Cache-Control: no-store.');
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error('QA attestation endpoint returned invalid JSON.');
  }

  // Reload after the network round trip. A replaced/restarted manifest must
  // fail closed even if the response itself was well formed.
  const manifest = loadReadyQaIsolationManifestForCoordinator({ repositoryRoot, baseUrl });
  if (
    !isQaAttestationPayload(payload)
    || payload.runId !== manifest.runId
    || payload.serverPid !== manifest.serverPid
    || payload.challenge !== challenge
    || manifest.runId !== initialManifest.runId
    || manifest.serverPid !== initialManifest.serverPid
    || manifest.nonce !== initialManifest.nonce
  ) {
    throw new Error('QA attestation response or ready-manifest identity is invalid.');
  }

  if (!verifyQaAttestationResponse(manifest, challenge, payload)) {
    throw new Error('QA attestation signature verification failed.');
  }
}
