import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { mutateIntegrations } from '@/lib/builder/crm/integrations-model';
import * as route from '@/app/api/builder/crm/integrations/[id]/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

// Keep the real integrationPatchSchema (so validation runs); mock only the store.
vi.mock('@/lib/builder/crm/integrations-model', async (importActual) => {
  const actual = await importActual<typeof import('@/lib/builder/crm/integrations-model')>();
  return { ...actual, mutateIntegrations: vi.fn() };
});

const mockedMutate = vi.mocked(mutateIntegrations);

function req(method: string, body?: string): NextRequest {
  return new NextRequest(
    'https://law.example.test/api/builder/crm/integrations/itg-1?locale=ko',
    { method, headers: { 'content-type': 'application/json' }, body },
  );
}

describe('/api/builder/crm/integrations/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'admin-1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
  });

  it('PATCH toggles enabled and returns the updated integration', async () => {
    mockedMutate.mockResolvedValue({
      id: 'itg-1', kind: 'slack-webhook', enabled: false, createdAt: 'x',
    } as never);
    const res = await route.PATCH(req('PATCH', JSON.stringify({ enabled: false })), { params: { id: 'itg-1' } });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toMatchObject({ ok: true, integration: { id: 'itg-1', enabled: false } });
  });

  it('PATCH returns 404 when the integration is missing', async () => {
    mockedMutate.mockResolvedValue(null as never);
    const res = await route.PATCH(req('PATCH', JSON.stringify({ enabled: true })), { params: { id: 'nope' } });
    expect(res.status).toBe(404);
    expect((await res.json()).ok).toBe(false);
  });

  it('PATCH returns 400 on an invalid body (enabled not boolean)', async () => {
    const res = await route.PATCH(req('PATCH', JSON.stringify({ enabled: 'yes' })), { params: { id: 'itg-1' } });
    expect(res.status).toBe(400);
    expect(mockedMutate).not.toHaveBeenCalled();
  });

  it('DELETE removes the integration and returns ok', async () => {
    mockedMutate.mockResolvedValue(true as never);
    const res = await route.DELETE(req('DELETE'), { params: { id: 'itg-1' } });
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
  });

  it('DELETE returns 404 when nothing was removed', async () => {
    mockedMutate.mockResolvedValue(false as never);
    const res = await route.DELETE(req('DELETE'), { params: { id: 'nope' } });
    expect(res.status).toBe(404);
  });
});
