import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createQaAttestationResponse,
  getQaRuntimeAttestation,
} from '@/lib/builder/security/qa-runtime-attestation';
import { GET } from '../route';

vi.mock('@/lib/builder/security/qa-runtime-attestation', () => ({
  createQaAttestationResponse: vi.fn(),
  getQaRuntimeAttestation: vi.fn(),
}));

const challenge = 'a'.repeat(64);
const manifest = {
  schemaVersion: 3,
  state: 'starting',
  runId: 'b'.repeat(32),
  serverPid: null,
};
const payload = {
  schemaVersion: 3,
  runId: 'b'.repeat(32),
  serverPid: 12345,
  challenge,
  signature: 'c'.repeat(64),
};

const getQaRuntimeAttestationMock = vi.mocked(getQaRuntimeAttestation);
const createQaAttestationResponseMock = vi.mocked(createQaAttestationResponse);

function request(headerValue?: string): NextRequest {
  const headers = new Headers();
  if (headerValue !== undefined) headers.set('x-builder-qa-challenge', headerValue);
  return new NextRequest('https://law.example.test/api/builder/_qa/attestation', { headers });
}

describe('builder QA runtime attestation API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getQaRuntimeAttestationMock.mockReturnValue(manifest as never);
    createQaAttestationResponseMock.mockReturnValue(payload as never);
  });

  it.each([undefined, '', 'not-a-challenge', 'A'.repeat(64), 'a'.repeat(63)])(
    'returns an empty 404 for an invalid challenge header (%s)',
    async (headerValue) => {
      const response = await GET(request(headerValue));

      expect(response.status).toBe(404);
      expect(await response.text()).toBe('');
      expect(response.headers.get('cache-control')).toContain('no-store');
      expect(getQaRuntimeAttestationMock).not.toHaveBeenCalled();
      expect(createQaAttestationResponseMock).not.toHaveBeenCalled();
    },
  );

  it('returns an empty 404 without leaking details when runtime attestation is unavailable', async () => {
    getQaRuntimeAttestationMock.mockReturnValue(null);

    const response = await GET(request(challenge));

    expect(response.status).toBe(404);
    expect(await response.text()).toBe('');
    expect(response.headers.get('cache-control')).toContain('no-store');
    expect(getQaRuntimeAttestationMock).toHaveBeenCalledWith({ allowStarting: true });
    expect(createQaAttestationResponseMock).not.toHaveBeenCalled();
  });

  it('returns the exact signed payload with no-store caching', async () => {
    const response = await GET(request(challenge));

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toContain('no-store');
    expect(await response.json()).toEqual(payload);
    expect(getQaRuntimeAttestationMock).toHaveBeenCalledWith({ allowStarting: true });
    expect(createQaAttestationResponseMock).toHaveBeenCalledWith(manifest, challenge);
  });

  it('converts validation or signing failures into an empty 404', async () => {
    createQaAttestationResponseMock.mockImplementation(() => {
      throw new Error('private manifest detail');
    });

    const response = await GET(request(challenge));

    expect(response.status).toBe(404);
    expect(await response.text()).toBe('');
    expect(response.headers.get('cache-control')).toContain('no-store');
  });
});
