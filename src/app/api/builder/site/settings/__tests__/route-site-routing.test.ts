import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';
import * as route from '@/app/api/builder/site/settings/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({
    username: 'admin-1',
    permission: 'settings',
  })),
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);

const SELECTED_SITE_ID = 'workspace-settings';
const SELECTED_SITE_REFERER =
  `https://law.example.test/ko/admin-builder?siteId=${SELECTED_SITE_ID}&pageId=home`;

function createSite(siteId: string): BuilderSiteDocument {
  return {
    version: 1,
    siteId,
    name: '호정국제',
    locale: 'ko',
    navigation: [],
    theme: {
      colors: {
        primary: '#123b63',
        secondary: '#1e5a96',
        accent: '#e8a838',
        background: '#ffffff',
        text: '#1f2937',
        muted: '#f3f4f6',
      },
      fonts: { heading: 'system-ui', body: 'system-ui' },
      radii: { sm: 2, md: 8, lg: 12 },
    },
    settings: {
      firmName: `${siteId} Law`,
      phone: '02-1234-5678',
    },
    pages: [],
    createdAt: '2026-05-29T00:00:00.000Z',
    updatedAt: '2026-05-29T00:00:00.000Z',
  };
}

function getRequest(): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/site/settings?locale=ko', {
    headers: { referer: SELECTED_SITE_REFERER },
  });
}

function putRequest(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/site/settings?locale=ko', {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      referer: SELECTED_SITE_REFERER,
    },
    body: JSON.stringify(body),
  });
}

describe('/api/builder/site/settings selected site routing', () => {
  let site: BuilderSiteDocument;

  beforeEach(() => {
    vi.clearAllMocks();
    site = createSite(SELECTED_SITE_ID);
    mockedReadSiteDocument.mockResolvedValue(site);
    mockedWriteSiteDocument.mockImplementation(async (nextSite) => {
      site = nextSite;
      mockedReadSiteDocument.mockResolvedValue(site);
    });
  });

  it('routes settings GET to the selected workspace site from the editor referer', async () => {
    const request = getRequest();
    const response = await route.GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(guardBuilderReadWithPermission).toHaveBeenCalledWith(request, 'settings');
    expect(data.settings.firmName).toBe('workspace-settings Law');
    expect(mockedReadSiteDocument).toHaveBeenCalledWith(SELECTED_SITE_ID, 'ko');
  });

  it('routes settings PUT writes to the selected workspace site from the editor referer', async () => {
    const response = await route.PUT(putRequest({
      settings: { firmName: 'Workspace Settings Law' },
    }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.settings.firmName).toBe('Workspace Settings Law');
    expect(mockedReadSiteDocument).toHaveBeenCalledWith(SELECTED_SITE_ID, 'ko');
    expect(mockedWriteSiteDocument).toHaveBeenCalledWith(
      expect.objectContaining({ siteId: SELECTED_SITE_ID }),
    );
  });
});
