import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { getSdkDocSections } from '@/lib/builder/dev/sdk-docs';
import { GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({
    username: 'builder-admin@example.test',
    permission: 'settings',
  })),
}));

vi.mock('@/lib/builder/dev/sdk-docs', () => ({
  getSdkDocSections: vi.fn(() => []),
}));

describe('/api/builder/dev/sdk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValue({
      username: 'builder-admin@example.test',
      permission: 'settings',
    });
  });

  it('requires settings permission before returning SDK documentation', async () => {
    const request = new NextRequest('https://law.example.test/api/builder/dev/sdk');

    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(guardBuilderReadWithPermission).toHaveBeenCalledWith(request, 'settings');
    expect(getSdkDocSections).toHaveBeenCalledOnce();
  });

  it('returns the permission guard 403 before reading SDK documentation', async () => {
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValueOnce(
      NextResponse.json({ error: 'Missing permission: settings' }, { status: 403 }),
    );
    const request = new NextRequest('https://law.example.test/api/builder/dev/sdk');

    const response = await GET(request);

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: 'Missing permission: settings' });
    expect(guardBuilderReadWithPermission).toHaveBeenCalledWith(request, 'settings');
    expect(getSdkDocSections).not.toHaveBeenCalled();
  });
});
