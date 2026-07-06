import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { BuilderCmsCollection, BuilderCmsRecord } from '@/lib/builder/cms-types';
import { listBookings, listServices } from '@/lib/builder/bookings/storage';
import { listOrders } from '@/lib/builder/commerce/orders-engine';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { DEFAULT_THEME, type BuilderSiteDocument } from '@/lib/builder/site/types';
import {
  buildWorkspaceAnalyticsRollup,
} from '@/lib/builder/workspace/analytics-aggregate';
import { summarizeSharedAssets } from '@/lib/builder/workspace/shared-assets';
import {
  listMembers,
  listWorkspaceSites,
} from '@/lib/builder/workspace/workspace-store';
import type {
  BuilderWorkspaceMember,
  BuilderWorkspaceSite,
} from '@/lib/builder/workspace/account-model';

vi.mock('@/lib/builder/bookings/storage', () => ({
  listBookings: vi.fn(),
  listServices: vi.fn(),
}));

vi.mock('@/lib/builder/commerce/orders-engine', () => ({
  listOrders: vi.fn(),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
}));

vi.mock('@/lib/builder/workspace/shared-assets', () => ({
  summarizeSharedAssets: vi.fn(),
}));

vi.mock('@/lib/builder/workspace/workspace-store', () => ({
  listMembers: vi.fn(),
  listWorkspaceSites: vi.fn(),
}));

const generatedAtPattern = /^\d{4}-\d{2}-\d{2}T/;

const listBookingsMock = vi.mocked(listBookings);
const listServicesMock = vi.mocked(listServices);
const listOrdersMock = vi.mocked(listOrders);
const readSiteDocumentMock = vi.mocked(readSiteDocument);
const summarizeSharedAssetsMock = vi.mocked(summarizeSharedAssets);
const listMembersMock = vi.mocked(listMembers);
const listWorkspaceSitesMock = vi.mocked(listWorkspaceSites);

function workspaceSite(siteId: string, name: string): BuilderWorkspaceSite {
  return {
    siteId,
    name,
    accountId: 'workspace-1',
    role: 'owner',
    createdAt: `2026-06-2${siteId.endsWith('a') ? '0' : '1'}T00:00:00.000Z`,
  };
}

function workspaceMember(email: string): BuilderWorkspaceMember {
  return {
    email,
    accountId: 'workspace-1',
    role: 'owner',
    addedAt: '2026-06-20T00:00:00.000Z',
  };
}

function cmsRecord(recordId: string, updatedAt: string): BuilderCmsRecord {
  return {
    recordId,
    status: 'published',
    fields: {},
    createdAt: '2026-06-20T00:00:00.000Z',
    updatedAt,
  };
}

function cmsCollection(
  collectionId: string,
  records: BuilderCmsRecord[],
  updatedAt: string,
): BuilderCmsCollection {
  return {
    collectionId,
    name: collectionId,
    slug: collectionId,
    description: '',
    localized: false,
    fields: [],
    indexes: [],
    records,
    permissions: { read: ['public'], create: ['admin'], update: ['admin'], delete: ['admin'] },
    createdAt: '2026-06-20T00:00:00.000Z',
    updatedAt,
  };
}

function siteDocument(siteId: string, collections: BuilderCmsCollection[]): BuilderSiteDocument {
  return {
    version: 1,
    siteId,
    name: siteId,
    locale: 'ko',
    navigation: [],
    theme: DEFAULT_THEME,
    pages: [],
    cmsCollections: collections,
    createdAt: '2026-06-20T00:00:00.000Z',
    updatedAt: '2026-06-20T00:00:00.000Z',
  };
}

describe('buildWorkspaceAnalyticsRollup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listOrdersMock.mockResolvedValue([]);
    listBookingsMock.mockResolvedValue([]);
    listServicesMock.mockResolvedValue([]);
    summarizeSharedAssetsMock.mockResolvedValue({
      count: 2,
      totalBytes: 350,
      latestUploadedAt: '2026-06-22T00:00:00.000Z',
    });
    listMembersMock.mockResolvedValue([
      workspaceMember('owner@example.test'),
      workspaceMember('editor@example.test'),
    ]);
  });

  it('rolls workspace operations across sites, members, shared assets, and CMS records', async () => {
    const siteDocs = new Map<string, BuilderSiteDocument>([
      [
        'site-a',
        siteDocument('site-a', [
          cmsCollection('columns', [
            cmsRecord('column-1', '2026-06-21T00:00:00.000Z'),
            cmsRecord('column-2', '2026-06-21T01:00:00.000Z'),
          ], '2026-06-21T02:00:00.000Z'),
          cmsCollection('service-areas', [
            cmsRecord('area-1', '2026-06-21T03:00:00.000Z'),
          ], '2026-06-21T04:00:00.000Z'),
        ]),
      ],
      [
        'site-b',
        siteDocument('site-b', [
          cmsCollection('columns', [
            cmsRecord('column-3', '2026-06-21T05:00:00.000Z'),
          ], '2026-06-21T06:00:00.000Z'),
        ]),
      ],
    ]);
    listWorkspaceSitesMock.mockResolvedValue([
      workspaceSite('site-a', 'Site A'),
      workspaceSite('site-b', 'Site B'),
    ]);
    readSiteDocumentMock.mockImplementation(async (siteId) => (
      siteDocs.get(siteId) ?? siteDocument(siteId, [])
    ));

    const rollup = await buildWorkspaceAnalyticsRollup();

    expect(rollup.generatedAt).toMatch(generatedAtPattern);
    expect(rollup.operations).toEqual({
      siteCount: 2,
      memberCount: 2,
      sharedAssetCount: 2,
      sharedAssetBytes: 350,
      cmsCollectionCount: 2,
      cmsRecordCount: 4,
      latestCmsUpdatedAt: '2026-06-21T06:00:00.000Z',
      latestSharedAssetUploadedAt: '2026-06-22T00:00:00.000Z',
    });
    expect(rollup.sites).toEqual([
      expect.objectContaining({
        siteId: 'site-a',
        siteName: 'Site A',
        cmsCollectionCount: 2,
        cmsRecordCount: 3,
        latestCmsUpdatedAt: '2026-06-21T04:00:00.000Z',
      }),
      expect.objectContaining({
        siteId: 'site-b',
        siteName: 'Site B',
        cmsCollectionCount: 1,
        cmsRecordCount: 1,
        latestCmsUpdatedAt: '2026-06-21T06:00:00.000Z',
      }),
    ]);
  });

  it('still reports member and asset operations when no sites are registered', async () => {
    listWorkspaceSitesMock.mockResolvedValue([]);

    const rollup = await buildWorkspaceAnalyticsRollup();

    expect(rollup.totalOrders).toBe(0);
    expect(rollup.sites).toEqual([]);
    expect(rollup.operations).toEqual({
      siteCount: 0,
      memberCount: 2,
      sharedAssetCount: 2,
      sharedAssetBytes: 350,
      cmsCollectionCount: 0,
      cmsRecordCount: 0,
      latestCmsUpdatedAt: null,
      latestSharedAssetUploadedAt: '2026-06-22T00:00:00.000Z',
    });
  });
});
