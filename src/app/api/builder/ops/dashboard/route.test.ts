import { NextRequest, NextResponse } from 'next/server';
import { describe, expect, it, vi } from 'vitest';
import { collectOpsDashboardView } from '@/lib/builder/ops/dashboard';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { GET } from './route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(),
}));
vi.mock('@/lib/builder/ops/dashboard', () => ({
  collectOpsDashboardView: vi.fn(),
}));

describe('GET /api/builder/ops/dashboard', () => {
  it('requires settings permission and short-circuits denied reads', async () => {
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValueOnce(
      NextResponse.json({ error: 'Missing permission: settings' }, { status: 403 }),
    );
    const request = new NextRequest('https://law.example.test/api/builder/ops/dashboard');

    const response = await GET(request);

    expect(response.status).toBe(403);
    expect(guardBuilderReadWithPermission).toHaveBeenCalledWith(request, 'settings');
    expect(collectOpsDashboardView).not.toHaveBeenCalled();
  });
});
