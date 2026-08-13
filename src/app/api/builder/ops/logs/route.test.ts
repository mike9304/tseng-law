import { NextRequest, NextResponse } from 'next/server';
import { describe, expect, it, vi } from 'vitest';
import { aggregateLogs } from '@/lib/builder/ops/logs-aggregator';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { GET } from './route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(),
}));
vi.mock('@/lib/builder/ops/logs-aggregator', () => ({
  aggregateLogs: vi.fn(),
}));

describe('GET /api/builder/ops/logs', () => {
  it('requires settings permission and short-circuits denied reads', async () => {
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValueOnce(
      NextResponse.json({ error: 'Missing permission: settings' }, { status: 403 }),
    );
    const request = new NextRequest('https://law.example.test/api/builder/ops/logs');

    const response = await GET(request);

    expect(response.status).toBe(403);
    expect(guardBuilderReadWithPermission).toHaveBeenCalledWith(request, 'settings');
    expect(aggregateLogs).not.toHaveBeenCalled();
  });
});
