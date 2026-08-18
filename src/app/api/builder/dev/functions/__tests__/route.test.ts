import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { readBuilderFunctions } from '@/lib/builder/dev/functions-model';
import { GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({
    username: 'builder-admin@example.test',
    permission: 'settings',
  })),
  guardMutation: vi.fn(),
}));

vi.mock('@/lib/builder/dev/functions-model', () => ({
  createBuilderFunction: vi.fn(),
  readBuilderFunctions: vi.fn(async () => []),
  saveBuilderFunctions: vi.fn(),
  validateBuilderFunctionInput: vi.fn(),
}));

describe('/api/builder/dev/functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValue({
      username: 'builder-admin@example.test',
      permission: 'settings',
    });
  });

  it('requires settings permission before listing functions', async () => {
    const request = new NextRequest('https://law.example.test/api/builder/dev/functions');

    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(guardBuilderReadWithPermission).toHaveBeenCalledWith(request, 'settings');
    expect(readBuilderFunctions).toHaveBeenCalledOnce();
  });

  it('returns the permission guard 403 before reading functions', async () => {
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValueOnce(
      NextResponse.json({ error: 'Missing permission: settings' }, { status: 403 }),
    );
    const request = new NextRequest('https://law.example.test/api/builder/dev/functions');

    const response = await GET(request);

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: 'Missing permission: settings' });
    expect(guardBuilderReadWithPermission).toHaveBeenCalledWith(request, 'settings');
    expect(readBuilderFunctions).not.toHaveBeenCalled();
  });
});
