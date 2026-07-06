import { describe, expect, it } from 'vitest';
import type { ColumnPost } from '@/lib/columns';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import {
  createDefaultBuilderPageDatasets,
  getBuilderBindableTargets,
  readBuilderPageDatasetOverviews,
  readBuilderDatasetRepeaterItems,
  replaceBuilderPageDatasetBinding,
  replaceBuilderPageDatasetLimit,
  resolveAttorneyProfileDatasetItems,
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
      'home.attorney.profile',
    ]);
    expect(getBuilderBindableTargets('home')[0]?.bindableFields.map((field) => field.fieldId)).toEqual(
      expect.arrayContaining(['title', 'featuredImage', 'href'])
    );
    expect(getBuilderBindableTargets('home')[0]?.bindableFields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fieldId: 'title', valueKind: 'text' }),
        expect.objectContaining({ fieldId: 'featuredImage', valueKind: 'image' }),
        expect.objectContaining({ fieldId: 'href', valueKind: 'url' }),
      ])
    );
    expect(getBuilderBindableTargets('home')[1]?.bindableFields.map((field) => field.fieldId)).toEqual(
      expect.arrayContaining(['title', 'description', 'href'])
    );
    expect(getBuilderBindableTargets('home')[2]?.bindableFields.map((field) => field.fieldId)).toEqual(
      expect.arrayContaining(['name', 'role', 'image', 'href'])
    );

    expect(createDefaultBuilderPageDatasets('home')).toMatchObject([
      {
        targetId: 'home.insights.feed',
        sectionKey: 'home.insights',
        collectionId: 'columns',
        sort: [],
        limit: 4,
      },
      {
        targetId: 'home.services.list',
        sectionKey: 'home.services',
        collectionId: 'service-areas',
        sort: [],
        limit: 6,
      },
      {
        targetId: 'home.attorney.profile',
        sectionKey: 'home.attorney',
        collectionId: 'attorney-profiles',
        sort: [],
        limit: 1,
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
    expect(items[0]?.href).toBe('/ko/services/investment');
    expect(items[0]?.relatedColumns?.[0]).toEqual({
      slug: 'taiwan-company-establishment-basics',
      title: '대만 회사설립 기초편',
    });
  });

  it('filters source runtime service items by slug from href', () => {
    const configuredDatasets = replaceBuilderPageDatasetBinding(
      createDefaultBuilderPageDatasets('home'),
      'home',
      'home.services.list',
      {
        filters: [{ fieldId: 'slug', operator: 'equals', value: 'source-service' }],
        sort: [],
        limit: 1,
      },
    );

    const items = resolveServicesDatasetItems(
      { pageKey: 'home', datasets: configuredDatasets },
      'ko',
      posts,
      [
        {
          title: 'Source service',
          description: 'Source service description',
          href: '/ko/services/source-service',
        },
      ],
    );

    expect(items).toEqual([
      {
        title: 'Source service',
        description: 'Source service description',
        href: '/ko/services/source-service',
      },
    ]);
  });

  it('applies dataset filters and sort order before runtime limits', () => {
    const configuredDatasets = replaceBuilderPageDatasetBinding(
      createDefaultBuilderPageDatasets('home'),
      'home',
      'home.insights.feed',
      {
        filters: [{ fieldId: 'category', operator: 'equals', value: 'case' }],
        sort: [{ fieldId: 'title', direction: 'asc' }],
        limit: 1,
      }
    );

    const items = readBuilderDatasetRepeaterItems(
      'home.insights.feed',
      configuredDatasets.find((binding) => binding.targetId === 'home.insights.feed')!,
      'ko',
      posts
    );

    expect(items).toEqual([
      expect.objectContaining({
        itemId: 'taiwan-gym-injury-lawsuit',
        title: '헬스장 부상 소송',
      }),
    ]);
  });

  it('normalizes unsupported dataset filter and sort fields out of bindings', () => {
    const configuredDatasets = replaceBuilderPageDatasetBinding(
      createDefaultBuilderPageDatasets('home'),
      'home',
      'home.services.list',
      {
        filters: [
          { fieldId: 'missing', operator: 'contains', value: 'ignored' },
          { fieldId: 'title', operator: 'contains', value: '소송' },
        ],
        sort: [
          { fieldId: 'missing', direction: 'desc' },
          { fieldId: 'title', direction: 'desc' },
        ],
      }
    );

    expect(configuredDatasets.find((binding) => binding.targetId === 'home.services.list')).toMatchObject({
      filters: [{ fieldId: 'title', operator: 'contains', value: '소송' }],
      sort: [{ fieldId: 'title', direction: 'desc' }],
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
      'home.attorney.profile',
    ]);
    expect(overviews.find((overview) => overview.targetId === 'home.services.list')).toMatchObject({
      defaultCollectionId: 'service-areas',
      modeOptions: ['list'],
      filterFields: expect.arrayContaining([
        expect.objectContaining({ fieldId: 'title' }),
        expect.objectContaining({ fieldId: 'href' }),
      ]),
      sortFields: expect.arrayContaining([
        expect.objectContaining({ fieldId: 'title' }),
        expect.objectContaining({ fieldId: 'href' }),
      ]),
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
      repeaterItems: expect.arrayContaining([
        expect.objectContaining({
          itemId: 'investment',
          title: '투자·법인설립',
          href: '/ko/services/investment',
        }),
      ]),
    });
    expect(overviews.find((overview) => overview.targetId === 'home.attorney.profile')).toMatchObject({
      defaultCollectionId: 'attorney-profiles',
      modeOptions: ['list'],
      currentBinding: {
        collectionId: 'attorney-profiles',
        limit: 1,
      },
      sampleRecords: expect.arrayContaining([
        expect.objectContaining({
          recordId: 'wei-tseng',
          primaryLabel: '증준외 변호사',
          routePath: '/ko/lawyers/wei-tseng',
        }),
      ]),
    });
  });

  it('prefers published cms collections for dataset preview records', () => {
    const document = {
      pageKey: 'home' as const,
      datasets: createDefaultBuilderPageDatasets('home'),
    };
    const cmsCollections: BuilderCmsCollection[] = [
      {
        collectionId: 'service-areas',
        name: 'Service Areas',
        slug: 'service-areas',
        description: 'CMS service areas',
        localized: true,
        fields: [
          { fieldId: 'field-slug', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true, unique: true },
          { fieldId: 'field-title', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
          { fieldId: 'field-description', key: 'description', label: 'Description', type: 'text', localized: false, repeated: false, required: false },
          { fieldId: 'field-key-points', key: 'keyPoints', label: 'Key points', type: 'string-list', localized: false, repeated: true, required: false },
          { fieldId: 'field-column-slugs', key: 'columnSlugs', label: 'Related columns', type: 'string-list', localized: false, repeated: true, required: false },
        ],
        indexes: [],
        records: [
          {
            recordId: 'cms-service-preview',
            status: 'published',
            locale: 'ko',
            fields: {
              slug: 'cms-service-preview',
              title: 'CMS 서비스 미리보기',
              description: 'CMS service preview description',
              keyPoints: ['CMS key point'],
              columnSlugs: ['taiwan-company-establishment-basics'],
            },
            createdAt: '2026-05-30T00:00:00.000Z',
            updatedAt: '2026-05-30T00:00:00.000Z',
          },
        ],
        permissions: { read: ['public'], create: ['staff'], update: ['staff'], delete: ['staff'] },
        createdAt: '2026-05-30T00:00:00.000Z',
        updatedAt: '2026-05-30T00:00:00.000Z',
      } as BuilderCmsCollection,
    ];

    const overviews = readBuilderPageDatasetOverviews('home', document, 'ko', posts, { cmsCollections });

    expect(overviews.find((overview) => overview.targetId === 'home.services.list')).toMatchObject({
      sampleRecords: expect.arrayContaining([
        expect.objectContaining({
          recordId: 'cms-service-preview',
          primaryLabel: 'CMS 서비스 미리보기',
          secondaryLabel: expect.stringContaining('CMS service preview description'),
        }),
      ]),
      repeaterItems: expect.arrayContaining([
        expect.objectContaining({
          itemId: 'cms-service-preview',
          title: 'CMS 서비스 미리보기',
        }),
      ]),
    });
  });

  it('projects any dataset target into generic repeater preview items', () => {
    const [insightsBinding, servicesBinding, attorneyBinding] = createDefaultBuilderPageDatasets('home');

    expect(
      readBuilderDatasetRepeaterItems('home.insights.feed', insightsBinding!, 'ko', posts)[0]
    ).toMatchObject({
      itemId: 'taiwan-company-establishment-basics',
      title: '대만 회사설립 기초편',
      href: '/ko/columns/taiwan-company-establishment-basics',
    });

    expect(
      readBuilderDatasetRepeaterItems('home.services.list', servicesBinding!, 'ko', posts)[0]
    ).toMatchObject({
      itemId: 'investment',
      title: '투자·법인설립',
      href: '/ko/services/investment',
    });

    expect(
      readBuilderDatasetRepeaterItems('home.attorney.profile', attorneyBinding!, 'ko', posts)[0]
    ).toMatchObject({
      itemId: 'wei-tseng',
      title: '증준외 변호사',
      href: '/ko/lawyers/wei-tseng',
    });
  });

  it('applies attorney profile dataset filters to profile items', () => {
    const configuredDatasets = replaceBuilderPageDatasetBinding(
      createDefaultBuilderPageDatasets('home'),
      'home',
      'home.attorney.profile',
      {
        filters: [{ fieldId: 'slug', operator: 'equals', value: 'wei-tseng' }],
        limit: 1,
      }
    );

    const items = resolveAttorneyProfileDatasetItems({ pageKey: 'home', datasets: configuredDatasets }, 'ko');

    expect(items).toEqual([
      expect.objectContaining({
        slug: 'wei-tseng',
        name: '증준외 변호사',
        href: '/ko/lawyers/wei-tseng',
      }),
    ]);
  });
});
