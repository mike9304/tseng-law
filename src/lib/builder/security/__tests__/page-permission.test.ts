import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { userHasPermission } from '@/lib/builder/security/resolve-permission';
import { requireBuilderPagePermission } from '@/lib/builder/security/page-permission';

vi.mock('next/headers', () => ({
  headers: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

vi.mock('@/lib/builder/columns/auth', () => ({
  requireBuilderAdminAuth: vi.fn(),
}));

vi.mock('@/lib/builder/security/resolve-permission', () => ({
  userHasPermission: vi.fn(),
}));

const headersMock = vi.mocked(headers);
const notFoundMock = vi.mocked(notFound);
const requireBuilderAdminAuthMock = vi.mocked(requireBuilderAdminAuth);
const userHasPermissionMock = vi.mocked(userHasPermission);

describe('requireBuilderPagePermission', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    headersMock.mockResolvedValue(new Headers({
      authorization: 'Basic current-request-credentials',
      cookie: 'builder_admin_session=current-request-session',
      'x-builder-username': 'forged-caller-owner',
    }) as Awaited<ReturnType<typeof headers>>);
  });

  it.each(['owner', 'admin'])(
    'allows authenticated %s-equivalent users with view-commerce permission',
    async (username) => {
      requireBuilderAdminAuthMock.mockReturnValueOnce({ username });
      userHasPermissionMock.mockResolvedValueOnce(true);

      await expect(requireBuilderPagePermission('view-commerce')).resolves.toEqual({
        username,
        permission: 'view-commerce',
      });

      expect(requireBuilderAdminAuthMock).toHaveBeenCalledTimes(1);
      const request = requireBuilderAdminAuthMock.mock.calls[0]?.[0];
      expect(request).toBeInstanceOf(NextRequest);
      expect(request.headers.get('authorization')).toBe('Basic current-request-credentials');
      expect(request.headers.get('cookie')).toBe('builder_admin_session=current-request-session');
      expect(userHasPermissionMock).toHaveBeenCalledWith(username, 'view-commerce');
      expect(userHasPermissionMock).not.toHaveBeenCalledWith('forged-caller-owner', 'view-commerce');
      expect(notFoundMock).not.toHaveBeenCalled();
    },
  );

  it.each(['editor', 'designer'])(
    'fails closed with notFound for authenticated %s users without permission',
    async (username) => {
      requireBuilderAdminAuthMock.mockReturnValueOnce({ username });
      userHasPermissionMock.mockResolvedValueOnce(false);

      await expect(requireBuilderPagePermission('view-commerce')).rejects.toThrow('NEXT_NOT_FOUND');

      expect(userHasPermissionMock).toHaveBeenCalledWith(username, 'view-commerce');
      expect(notFoundMock).toHaveBeenCalledTimes(1);
    },
  );

  it('fails closed with notFound when the current request is anonymous', async () => {
    requireBuilderAdminAuthMock.mockReturnValueOnce(
      NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
    );

    await expect(requireBuilderPagePermission('view-commerce')).rejects.toThrow('NEXT_NOT_FOUND');

    expect(notFoundMock).toHaveBeenCalledTimes(1);
    expect(userHasPermissionMock).not.toHaveBeenCalled();
  });
});
