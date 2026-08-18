import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { listBookingEmailTemplates } from '@/lib/builder/bookings/email-templates';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/bookings/email-templates', () => ({
  listBookingEmailTemplates: vi.fn(async () => []),
}));

describe('/api/builder/bookings/email-templates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValue({ username: 'admin' });
  });

  it('requires view-bookings and does not read templates on denial', async () => {
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValueOnce(
      NextResponse.json({ error: 'Missing permission: view-bookings' }, { status: 403 }),
    );
    const route = await import('../route');
    const request = new NextRequest('https://law.example.test/api/builder/bookings/email-templates');
    const response = await route.GET(request);

    expect(response.status).toBe(403);
    expect(guardBuilderReadWithPermission).toHaveBeenCalledWith(request, 'view-bookings');
    expect(listBookingEmailTemplates).not.toHaveBeenCalled();
  });
});
