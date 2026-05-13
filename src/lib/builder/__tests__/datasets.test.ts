import { describe, expect, it } from 'vitest';
import type { ColumnPost } from '@/lib/columns';
import {
  createDefaultBuilderPageDatasets,
  getBuilderBindableTargets,
  readBuilderPageDatasetOverviews,
  replaceBuilderPageDatasetLimit,
  resolveServicesDatasetItems,
} from '@/lib/builder/datasets';

const posts: ColumnPost[] = [
  {
    slug: 'taiwan-company-establishment-basics',
    title: '대만 회사설립 기초편',
    date: '2026-01-01',
    dateDisplay: '2026.01.01',
    readTime: '5분',
    category: 'formation',
    categoryLabel: '법인설립',
    featuredImage: '/images/blog/company.jpg',
    content: '',
    summary: '',
  },
  {
    slug: 'taiwan-gym-injury-lawsuit',
    title: '헬스장 부상 소송',
    date: '2026-01-02',
    dateDisplay: '2026.01.02',
    readTime: '6분',
    category: 'case',
    categoryLabel: '소송사례',
    featuredImage: '/images/blog/case.jpg',
    content: '',
    summary: '',
  },
];

describe('builder datasets', () => {
  it('creates default home bindings for insights and services', () => {
    expect(getBuilderBindableTargets('home').map((target) => target.targetId)).toEqual([
      'home.insights.feed',
      'home.services.list',
    ]);

    expect(createDefaultBuilderPageDatasets('home')).toMatchObject([
      {
        targetId: 'home.insights.feed',
        sectionKey: 'home.insights',
        collectionId: 'columns',
        limit: 4,
      },
      {
        targetId: 'home.services.list',
        sectionKey: 'home.services',
        collectionId: 'service-areas',
        limit: 6,
      },
    ]);
  });

  it('applies the service-area dataset limit to runtime service items', () => {
    const defaultDatasets = createDefaultBuilderPageDatasets('home');
    const limitedDatasets = replaceBuilderPageDatasetLimit(
      defaultDatasets,
      'home',
      'home.services.list',
      3
    );

    const items = resolveServicesDatasetItems({ pageKey: 'home', datasets: limitedDatasets }, 'ko', posts);

    expect(items).toHaveLength(3);
    expect(items.map((item) => item.title)).toEqual([
      '투자·법인설립',
      '민사소송·손해배상',
      '가사소송',
    ]);
    expect(items[0]?.href).toBe('/ko/services#investment');
    expect(items[0]?.relatedColumns?.[0]).toEqual({
      slug: 'taiwan-company-establishment-basics',
      title: '대만 회사설립 기초편',
    });
  });

  it('exposes service dataset samples in page dataset overviews', () => {
    const document = {
      pageKey: 'home' as const,
      datasets: createDefaultBuilderPageDatasets('home'),
    };

    const overviews = readBuilderPageDatasetOverviews('home', document, 'ko', posts);

    expect(overviews.map((overview) => overview.targetId)).toEqual([
      'home.insights.feed',
      'home.services.list',
    ]);
    expect(overviews.find((overview) => overview.targetId === 'home.services.list')).toMatchObject({
      currentBinding: {
        collectionId: 'service-areas',
        limit: 6,
      },
      sampleRecords: expect.arrayContaining([
        expect.objectContaining({
          recordId: 'investment',
          primaryLabel: '투자·법인설립',
          routePath: '/ko/services/investment',
        }),
      ]),
    });
  });
});
