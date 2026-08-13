import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createSecret,
  listSecrets,
} from '@/lib/builder/dev/secrets-store';
import {
  guardBuilderReadWithPermission,
  guardMutation,
} from '@/lib/builder/security/guard';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/dev/secrets-store', () => ({
  createSecret: vi.fn(),
  listSecrets: vi.fn(),
  SecretValidationFailure: class SecretValidationFailure extends Error {},
}));

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(),
  guardMutation: vi.fn(),
}));

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const guardMutationMock = vi.mocked(guardMutation);
const createSecretMock = vi.mocked(createSecret);
const listSecretsMock = vi.mocked(listSecrets);

function request(method: 'GET' | 'POST' = 'GET', body?: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/dev/secrets', {
    method,
    headers: { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

describe('builder secrets API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({
      username: 'secrets-admin',
      permission: 'manage-secrets',
    });
    guardMutationMock.mockResolvedValue({
      username: 'secrets-admin',
      permission: 'manage-secrets',
    });
    listSecretsMock.mockResolvedValue([]);
  });

  it('requires manage-secrets permission before listing secret metadata', async () => {
    const response = await GET(request());

    expect(response.status).toBe(200);
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'manage-secrets',
    );
    expect(listSecretsMock).toHaveBeenCalledOnce();
  });

  it.each([
    ['unauthenticated', 401],
    ['authenticated without permission', 403],
  ])('returns %s denial without reading secret metadata', async (_label, status) => {
    guardBuilderReadWithPermissionMock.mockResolvedValueOnce(
      NextResponse.json({ error: status === 401 ? 'Unauthorized' : 'missing_permission' }, { status }),
    );

    const response = await GET(request());

    expect(response.status).toBe(status);
    expect(listSecretsMock).not.toHaveBeenCalled();
    expect(createSecretMock).not.toHaveBeenCalled();
  });

  it('preserves the manage-secrets mutation guard', async () => {
    createSecretMock.mockResolvedValue({
      secret: {
        id: 'secret-1',
        key: 'SERVICE_TOKEN',
        scope: 'site',
        allowedFunctions: [],
        createdAt: '2026-07-30T00:00:00.000Z',
        updatedAt: '2026-07-30T00:00:00.000Z',
        addedBy: 'secrets-admin',
      },
      plaintext: 'one-time-plaintext',
    } as never);

    const response = await POST(request('POST', {
      key: 'SERVICE_TOKEN',
      value: 'secret-value',
      scope: 'site',
    }));

    expect(response.status).toBe(201);
    expect(guardMutationMock).toHaveBeenCalledWith(
      expect.any(NextRequest),
      { permission: 'manage-secrets' },
    );
    expect(createSecretMock).toHaveBeenCalledOnce();
  });
});
