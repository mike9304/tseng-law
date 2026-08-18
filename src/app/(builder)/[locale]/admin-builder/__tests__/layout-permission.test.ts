import { NextResponse } from 'next/server';
import type { ReactElement, ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { resolveUserRole } from '@/lib/builder/security/resolve-permission';
import AdminBuilderLayout from '@/app/(builder)/[locale]/admin-builder/layout';
import type { AdminNavTree } from '@/lib/builder/admin-nav/nav-config';

vi.mock('next/headers', () => ({ headers: vi.fn() }));
vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));
vi.mock('@/lib/builder/columns/auth', () => ({ requireBuilderAdminAuth: vi.fn() }));
vi.mock('@/lib/builder/security/resolve-permission', () => ({ resolveUserRole: vi.fn() }));

const headersMock = vi.mocked(headers);
const notFoundMock = vi.mocked(notFound);
const requireBuilderAdminAuthMock = vi.mocked(requireBuilderAdminAuth);
const resolveUserRoleMock = vi.mocked(resolveUserRole);

describe('admin-builder layout navigation permissions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    headersMock.mockResolvedValue(new Headers({
      authorization: 'Basic layout-request',
      cookie: 'builder_admin_session=layout-session',
    }) as Awaited<ReturnType<typeof headers>>);
  });

  it('resolves the authenticated role once and passes a filtered navigation tree to the shell', async () => {
    requireBuilderAdminAuthMock.mockReturnValue({ username: 'editor' });
    resolveUserRoleMock.mockResolvedValue('editor');

    const layout = await AdminBuilderLayout({ children: null });
    const [, suspense] = layout.props.children as [ReactNode, ReactElement<{ children: ReactElement<{ navTree: AdminNavTree }> }>];
    const tree = suspense.props.children.props.navTree;
    const destinations = tree.sections.flatMap((section) => section.items.map((item) => item.href));

    expect(resolveUserRoleMock).toHaveBeenCalledTimes(1);
    expect(resolveUserRoleMock).toHaveBeenCalledWith('editor');
    expect(destinations).toContain('/cms');
    expect(destinations).not.toContain('/backups');
    expect(destinations).not.toContain('/members');
    expect(tree.sections.map((section) => section.heading)).toEqual([
      '편집',
      '비즈니스',
      '워크스페이스',
    ]);
  });

  it('fails closed when the request is unauthenticated', async () => {
    requireBuilderAdminAuthMock.mockReturnValue(
      NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
    );

    await expect(AdminBuilderLayout({ children: null })).rejects.toThrow('NEXT_NOT_FOUND');

    expect(notFoundMock).toHaveBeenCalledTimes(1);
    expect(resolveUserRoleMock).not.toHaveBeenCalled();
  });
});
