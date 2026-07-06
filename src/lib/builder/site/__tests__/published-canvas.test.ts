import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createDefaultCanvasNodeStyle,
  type BuilderCanvasDocument,
} from '@/lib/builder/canvas/types';
import type { BuilderPageMeta } from '@/lib/builder/site/types';
import { readPageCanvas } from '@/lib/builder/site/persistence';
import { readRevisionDocument } from '@/lib/builder/site/publish';
import { readPublishedPageCanvas } from '@/lib/builder/site/published-canvas';

vi.mock('@/lib/builder/site/persistence', () => ({
  readPageCanvas: vi.fn(),
}));

vi.mock('@/lib/builder/site/publish', () => ({
  readRevisionDocument: vi.fn(),
}));

function document(updatedBy: string): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-07-03T00:00:00.000Z',
    updatedBy,
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [],
  };
}

function legacyServiceIconDocument(): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-07-03T00:00:00.000Z',
    updatedBy: 'legacy-service-icons',
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [
      {
        id: 'home-services-card-2-icon-svg',
        kind: 'image',
        rect: { x: 40, y: 40, width: 48, height: 48 },
        style: createDefaultCanvasNodeStyle(),
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          src: '/images/home-services/icon-2.svg',
          alt: '서비스 아이콘',
          fit: 'contain',
        },
      },
    ],
  };
}

function pageMeta(publishedRevisionId?: string): BuilderPageMeta {
  return {
    pageId: 'home',
    slug: '',
    title: { ko: '홈', 'zh-hant': '首頁', en: 'Home' },
    locale: 'ko',
    createdAt: '2026-07-03T00:00:00.000Z',
    updatedAt: '2026-07-03T00:00:00.000Z',
    publishedAt: '2026-07-03T00:00:00.000Z',
    ...(publishedRevisionId ? { publishedRevisionId } : {}),
  };
}

beforeEach(() => {
  vi.mocked(readPageCanvas).mockReset();
  vi.mocked(readRevisionDocument).mockReset();
});

describe('readPublishedPageCanvas', () => {
  it('uses the current published canvas even when a revision is pinned', async () => {
    const published = document('published');
    vi.mocked(readPageCanvas).mockResolvedValue(published);

    await expect(readPublishedPageCanvas(pageMeta('rev-1'))).resolves.toEqual(published);
    expect(readPageCanvas).toHaveBeenCalledWith('tseng-law-main-site', 'home', 'published');
    expect(readRevisionDocument).not.toHaveBeenCalled();
  });

  it('falls back to the revision snapshot when the current published canvas is missing', async () => {
    const revision = document('revision');
    vi.mocked(readPageCanvas).mockResolvedValue(null);
    vi.mocked(readRevisionDocument).mockResolvedValue(revision);

    await expect(readPublishedPageCanvas(pageMeta('rev-1'))).resolves.toEqual(revision);
    expect(readPageCanvas).toHaveBeenCalledWith('tseng-law-main-site', 'home', 'published');
    expect(readRevisionDocument).toHaveBeenCalledWith('home', 'rev-1');
  });

  it('reads the published canvas directly when no revision is pinned', async () => {
    const published = document('published');
    vi.mocked(readPageCanvas).mockResolvedValue(published);

    await expect(readPublishedPageCanvas(pageMeta())).resolves.toEqual(published);
    expect(readRevisionDocument).not.toHaveBeenCalled();
    expect(readPageCanvas).toHaveBeenCalledWith('tseng-law-main-site', 'home', 'published');
  });

  it('normalizes legacy published service icon assets before public rendering', async () => {
    vi.mocked(readPageCanvas).mockResolvedValue(legacyServiceIconDocument());

    const normalized = await readPublishedPageCanvas(pageMeta());
    const icon = normalized?.nodes.find((node) => node.id === 'home-services-card-2-icon-svg');

    expect(icon?.kind).toBe('image');
    if (icon?.kind !== 'image') {
      throw new Error('Expected legacy service icon to normalize to an image node.');
    }
    expect(icon.content.src).toBe('/images/placeholder-image.svg');
    expect(icon.content.svg).toMatchObject({
      enabled: true,
      name: 'service-2',
      color: 'currentColor',
    });
  });
});
