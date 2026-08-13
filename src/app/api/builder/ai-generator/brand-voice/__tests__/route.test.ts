import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readBrandVoiceProfile } from '@/lib/builder/ai-generator/brand-voice';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({
    username: 'admin',
    permission: 'edit-pages',
  })),
  guardMutation: vi.fn(),
}));

vi.mock('@/lib/builder/ai-generator/brand-voice', () => ({
  brandVoiceInputSchema: { safeParse: vi.fn() },
  readBrandVoiceProfile: vi.fn(),
  writeBrandVoiceProfile: vi.fn(),
}));

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const readBrandVoiceProfileMock = vi.mocked(readBrandVoiceProfile);

function request(): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/ai-generator/brand-voice');
}

describe('/api/builder/ai-generator/brand-voice GET', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({
      username: 'admin',
      permission: 'edit-pages',
    });
    readBrandVoiceProfileMock.mockResolvedValue({
      backend: 'file',
      persisted: false,
      profile: null,
    } as never);
  });

  it('requires edit-pages before returning the saved profile', async () => {
    const req = request();
    const response = await GET(req);

    expect(response.status).toBe(200);
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(req, 'edit-pages');
    expect(readBrandVoiceProfileMock).toHaveBeenCalledOnce();
  });

  it('short-circuits a missing edit-pages permission with 403', async () => {
    guardBuilderReadWithPermissionMock.mockResolvedValueOnce(
      NextResponse.json({ error: 'Missing permission: edit-pages' }, { status: 403 }),
    );
    const req = request();

    const response = await GET(req);

    expect(response.status).toBe(403);
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(req, 'edit-pages');
    expect(readBrandVoiceProfileMock).not.toHaveBeenCalled();
  });
});
