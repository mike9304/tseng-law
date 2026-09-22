import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createDefaultCanvasNodeStyle,
  type BuilderCanvasDocument,
} from '@/lib/builder/canvas/types';
import {
  DEFAULT_THEME,
  type BuilderPageMeta,
  type BuilderSiteDocument,
} from '@/lib/builder/site/types';
import { buildPublishedSitePageMetadata } from '@/lib/builder/site/public-page';
import {
  readFooterCanvas,
  readHeaderCanvas,
  readLightboxCanvas,
  readSiteDocument,
} from '@/lib/builder/site/persistence';
import { readPublishedPageCanvas } from '@/lib/builder/site/published-canvas';
import { readBuilderPageSnapshot } from '@/lib/builder/persistence';
import { getAllColumnPostsIncludingBlob } from '@/lib/consultation/columns-blob-reader';

vi.mock('@/lib/builder/site/persistence', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/site/persistence')>();
  return {
    ...actual,
    readFooterCanvas: vi.fn(),
    readHeaderCanvas: vi.fn(),
    readLightboxCanvas: vi.fn(),
    readSiteDocument: vi.fn(),
  };
});

vi.mock('@/lib/builder/site/published-canvas', () => ({
  readPublishedPageCanvas: vi.fn(),
}));

vi.mock('@/lib/builder/persistence', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/persistence')>();
  return {
    ...actual,
    readBuilderPageSnapshot: vi.fn(),
  };
});

vi.mock('@/lib/consultation/columns-blob-reader', () => ({
  getAllColumnPostsIncludingBlob: vi.fn(),
}));

vi.mock('@/lib/builder/datasets', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/datasets')>();
  return {
    ...actual,
    // Metadata resolution does not consume dataset samples. Isolate it from
    // locale content records so this test covers every published locale.
    readBuilderPageDatasetOverviews: vi.fn(() => []),
  };
});

const now = '2026-07-06T00:00:00.000Z';

function makePage(overrides: Partial<BuilderPageMeta> = {}): BuilderPageMeta {
  return {
    pageId: 'page-1',
    slug: 'services',
    title: { ko: '업무분야', 'zh-hant': '服務領域', en: 'Practice Areas' },
    locale: 'ko',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    ...overrides,
  };
}

function makeSite(pages: BuilderPageMeta[]): BuilderSiteDocument {
  return {
    version: 1,
    siteId: 'tseng-law-main-site',
    name: '호정국제',
    locale: 'ko',
    navigation: [],
    theme: DEFAULT_THEME,
    pages,
    createdAt: now,
    updatedAt: now,
  };
}

function makePublishedCanvas(): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: 'published-seo-test',
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [
      {
        id: 'published-home-spacer',
        kind: 'spacer',
        rect: { x: 0, y: 0, width: 1280, height: 720 },
        style: createDefaultCanvasNodeStyle(),
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: { size: 32 },
      },
    ],
  };
}

function mockPublishedMetadataInputs(site: BuilderSiteDocument): void {
  vi.mocked(readSiteDocument).mockResolvedValue(site);
  vi.mocked(readPublishedPageCanvas).mockResolvedValue(makePublishedCanvas());
  vi.mocked(readHeaderCanvas).mockResolvedValue(null);
  vi.mocked(readFooterCanvas).mockResolvedValue(null);
  vi.mocked(readLightboxCanvas).mockResolvedValue(null);
  vi.mocked(readBuilderPageSnapshot).mockRejectedValue(new Error('No persisted home dataset'));
  vi.mocked(getAllColumnPostsIncludingBlob).mockResolvedValue([]);
}


import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
vi.mock('@/lib/builder/members/current-member',()=>({getCurrentSiteMember:vi.fn()}));
beforeEach(()=>{vi.clearAllMocks();vi.mocked(getCurrentSiteMember).mockResolvedValue(null);});
const member = {memberId:'m',email:'m@example.test',name:'Member',role:'premium',passwordHash:'unused',createdAt:now,verified:true,blocked:false} as const;
function setupRestricted(slug='secret', access=true){
 const page=makePage({slug,title:{ko:'PRIVATE_G2',en:'PRIVATE_G2','zh-hant':'PRIVATE_G2'},seo:{description:'PRIVATE_DESCRIPTION_G2'},memberAccess:{requireLogin:access,allowedRoles:['premium']}});
 mockPublishedMetadataInputs(makeSite([page]));
}
describe('shared metadata current member access',()=>{
 it.each(['secret','faq','videos','columns'])('%s anonymous has no private metadata',async slug=>{
  setupRestricted(slug);const value=await buildPublishedSitePageMetadata('ko',slug);
  expect(value).not.toBeNull();expect(JSON.stringify(value)).not.toContain('PRIVATE_');expect(value?.robots).toMatchObject({index:false,follow:false});expect(getCurrentSiteMember).toHaveBeenCalledOnce();
 });
 it.each([{...member,role:'free' as const},{...member,blocked:true},{...member,verified:false}])('denied member excludes protected metadata %#',async m=>{
  setupRestricted();vi.mocked(getCurrentSiteMember).mockResolvedValue(m);expect(JSON.stringify(await buildPublishedSitePageMetadata('ko','secret'))).not.toContain('PRIVATE_');
 });
 it('authorized member preserves published metadata',async()=>{setupRestricted();vi.mocked(getCurrentSiteMember).mockResolvedValue(member);expect(JSON.stringify(await buildPublishedSitePageMetadata('ko','secret'))).toContain('PRIVATE_G2');});
 it('public fast path avoids member lookup',async()=>{setupRestricted('secret',false);expect(JSON.stringify(await buildPublishedSitePageMetadata('ko','secret'))).toContain('PRIVATE_G2');expect(getCurrentSiteMember).not.toHaveBeenCalled();});
});

describe('actual builder-first generateMetadata entrypoints',()=>{
 it.each(['secret','faq','videos','columns'])('%s returns safe metadata on denial',async slug=>{
  setupRestricted(slug);
  const route=slug==='faq'?await import('@/app/[locale]/faq/page'):slug==='videos'?await import('@/app/[locale]/videos/page'):slug==='columns'?await import('@/app/[locale]/columns/page'):await import('@/app/[locale]/[[...slug]]/page');
  const result=await route.generateMetadata({params:Promise.resolve({locale:'ko' as const,slug:[slug]})});
  expect(JSON.stringify(result)).not.toContain('PRIVATE_');expect(result.robots).toMatchObject({index:false,follow:false});
 });
 it('auth lookup failure never yields private metadata',async()=>{setupRestricted();vi.mocked(getCurrentSiteMember).mockRejectedValue(new Error('session unavailable'));await expect(buildPublishedSitePageMetadata('ko','secret')).rejects.toThrow('session unavailable');});
});

describe('missing published metadata', () => {
  it('returns null for an unknown page without reading a member session', async () => {
    mockPublishedMetadataInputs(makeSite([]));

    expect(await buildPublishedSitePageMetadata('ko', 'unknown-page')).toBeNull();
    expect(getCurrentSiteMember).not.toHaveBeenCalled();
  });
});
