import { NextRequest, NextResponse } from 'next/server';
import { describe, expect, it, vi } from 'vitest';
import { buildSecuritySummary } from '@/lib/builder/ops/security-summary';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { GET } from './route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(),
}));
vi.mock('@/lib/builder/ops/security-summary', () => ({
  buildSecuritySummary: vi.fn(),
}));

describe('GET /api/builder/ops/security', () => {
  it('requires manage-users permission and short-circuits denied reads', async () => {
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValueOnce(
      NextResponse.json({ error: 'Missing permission: manage-users' }, { status: 403 }),
    );
    const request = new NextRequest('https://law.example.test/api/builder/ops/security');

    const response = await GET(request);

    expect(response.status).toBe(403);
    expect(guardBuilderReadWithPermission).toHaveBeenCalledWith(request, 'manage-users');
    expect(buildSecuritySummary).not.toHaveBeenCalled();
  });
});
