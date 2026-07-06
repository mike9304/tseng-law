import { describe, expect, it } from 'vitest';
import type { ColumnPost } from '@/lib/columns';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import {
  resolvePublishedCmsAttorneyItems,
  findPublishedCmsCollectionRecordSeo,
  resolvePublishedCmsColumnPosts,
  resolvePublishedCmsCollectionRecordPreviews,
  resolvePublishedCmsServiceItems,
} from '@/lib/builder/site/cms-runtime';

function makeCollection(overrides: Partial<BuilderCmsCollection>): BuilderCmsCollection {
  return {
    collectionId: 'columns',
    name: 'Columns',
    slug: 'columns',
    description: 'CMS columns',
    localized: true,
    fields: [],
    indexes: [],
    records: [],
    permissions: { read: ['public'], create: ['staff'], update: ['staff'], delete: ['staff'] },
    createdAt: '2026-05-30T00:00:00.000Z',
    updatedAt: '2026-05-30T00:00:00.000Z',
    ...overrides,
  };
}

describe('cms runtime collection resolution', () => {
  it('prefers published cms collection records for dynamic list previews', () => {
    const site = {
      cmsCollections: [
        makeCollection({
          collectionId: 'columns',
          records: [
            {
              recordId: 'cms-column-draft',
              status: 'draft',
              locale: 'ko',
              fields: { slug: 'cms-column-draft', title: 'Draft title' },
              createdAt: '2026-05-30T00:00:00.000Z',
              updatedAt: '2026-05-30T00:00:00.000Z',
            },
            {
              recordId: 'cms-column-published',
              status: 'published',
              locale: 'ko',
              fields: {
                slug: 'cms-column-published',
                title: 'CMS column title',
                summary: '<p>CMS summary text</p>',
                category: 'News',
                date: '2026-05-28',
                featuredImage: { url: '/api/builder/assets/hero.webp' },
              },
              createdAt: '2026-05-30T00:00:00.000Z',
              updatedAt: '2026-05-30T00:00:00.000Z',
            },
          ],
        }),
      ],
    };

    expect(resolvePublishedCmsCollectionRecordPreviews(site, 'columns', 'ko')).toEqual([
      {
        recordId: 'cms-column-published',
        primaryLabel: 'CMS column title',
        secondaryLabel: 'News · 2026-05-28 · 대만 법률',
        routePath: '/ko/columns/cms-column-published',
        fieldValues: {
          category: 'News',
          date: '2026-05-28',
          description: 'CMS summary text',
          featuredImage: '/api/builder/assets/hero.webp',
          href: '/ko/columns/cms-column-published',
          name: 'CMS column title',
          recordId: 'cms-column-published',
          slug: 'cms-column-published',
          summary: 'CMS summary text',
          title: 'CMS column title',
          url: '/ko/columns/cms-column-published',
        },
      },
    ]);
  });

  it('maps published cms column records into runtime column posts', () => {
    const site = {
      cmsCollections: [
        makeCollection({
          collectionId: 'columns',
          records: [
            {
              recordId: 'cms-column-draft',
              status: 'draft',
              locale: 'ko',
              fields: { slug: 'cms-column-draft', title: 'Draft title' },
              createdAt: '2026-05-30T00:00:00.000Z',
              updatedAt: '2026-05-30T00:00:00.000Z',
            },
            {
              recordId: 'cms-column-published',
              status: 'published',
              locale: 'ko',
              fields: {
                slug: 'cms-column-published',
                title: 'CMS column title',
                summary: '<p>CMS summary text</p>',
                category: 'legal',
                categoryLabel: 'Legal Information',
                date: '2026-05-28',
                dateDisplay: '2026-05-28',
                readTime: '5 min',
                featuredImage: { url: '/api/builder/assets/hero.webp' },
              },
              createdAt: '2026-05-30T00:00:00.000Z',
              updatedAt: '2026-05-30T00:00:00.000Z',
            },
          ],
        }),
      ],
    };

    expect(resolvePublishedCmsColumnPosts(site, 'ko')).toEqual([
      {
        slug: 'cms-column-published',
        title: 'CMS column title',
        date: '2026-05-28',
        dateDisplay: '2026-05-28',
        readTime: '5 min',
        category: 'legal',
        categoryLabel: 'Legal Information',
        blogCategory: 'general',
        tags: [],
        featuredImage: '/api/builder/assets/hero.webp',
        content: 'CMS summary text',
        summary: 'CMS summary text',
      },
    ]);
  });

  it('reads seo metadata from published cms collection records', () => {
    const site = {
      cmsCollections: [
        makeCollection({
          collectionId: 'attorney-profiles',
          records: [
            {
              recordId: 'ada-lovelace',
              status: 'published',
              locale: 'en',
              fields: {
                slug: 'ada-lovelace',
                name: 'Ada Lovelace',
                role: 'Partner',
                description: '<p>Mathematics and litigation.</p>',
                email: 'ada@example.test',
                image: { url: '/api/builder/assets/ada.webp' },
              },
              createdAt: '2026-05-30T00:00:00.000Z',
              updatedAt: '2026-05-30T00:00:00.000Z',
            },
          ],
        }),
      ],
    };

    expect(findPublishedCmsCollectionRecordSeo(site, 'attorney-profiles', 'en', 'ada-lovelace')).toEqual({
      title: 'Ada Lovelace',
      description: 'Mathematics and litigation.',
      canonicalPath: '/en/lawyers/ada-lovelace',
      keywords: ['Ada Lovelace', 'Partner', 'ada@example.test'],
      image: '/api/builder/assets/ada.webp',
      noIndex: false,
    });
  });

  it('maps published cms service records into runtime service items', () => {
    const site = {
      cmsCollections: [
        makeCollection({
          collectionId: 'service-areas',
          records: [
            {
              recordId: 'service-area-one',
              status: 'published',
              locale: 'ko',
              fields: {
                slug: 'service-area-one',
                title: 'Service Area One',
                description: 'Service description',
                keyPoints: ['Point 1', 'Point 2'],
                columnSlugs: ['cms-column-published'],
              },
              createdAt: '2026-05-30T00:00:00.000Z',
              updatedAt: '2026-05-30T00:00:00.000Z',
            },
          ],
        }),
      ],
    };
    const posts: ColumnPost[] = [
      {
        slug: 'cms-column-published',
        title: 'Published column',
        category: 'legal',
        categoryLabel: 'Legal Information',
        date: '2026-05-28',
        dateDisplay: '2026-05-28',
        readTime: '3 min',
        summary: 'Summary',
        content: 'Content',
        featuredImage: '/api/builder/assets/hero.webp',
      },
    ];

    expect(resolvePublishedCmsServiceItems(site, 'ko', posts)).toEqual([
      {
        title: 'Service Area One',
        description: 'Service description',
        href: '/ko/services/service-area-one',
        details: ['Point 1', 'Point 2'],
        relatedColumns: [{ slug: 'cms-column-published', title: 'Published column' }],
      },
    ]);
  });

  it('maps published cms attorney records into runtime attorney items', () => {
    const site = {
      cmsCollections: [
        makeCollection({
          collectionId: 'attorney-profiles',
          records: [
            {
              recordId: 'record-ada',
              status: 'published',
              locale: 'en',
              fields: {
                slug: 'ada-lovelace',
                name: 'Ada Lovelace',
                role: 'Partner',
                title: 'Ada Lovelace | Partner',
                description: '<p>Strategy and litigation.</p>',
                email: 'ada@example.test',
                image: { url: '/api/builder/assets/ada.webp' },
                summary: ['Problem solving', 'Leadership'],
              },
              createdAt: '2026-05-30T00:00:00.000Z',
              updatedAt: '2026-05-30T00:00:00.000Z',
            },
          ],
        }),
      ],
    };

    expect(resolvePublishedCmsAttorneyItems(site, 'en')).toEqual([
      {
        slug: 'ada-lovelace',
        name: 'Ada Lovelace',
        role: 'Partner',
        title: 'Ada Lovelace | Partner',
        description: 'Strategy and litigation.',
        email: 'ada@example.test',
        image: '/api/builder/assets/ada.webp',
        imageAltText: 'Ada Lovelace Partner',
        imageFocalPoint: { x: 0.5, y: 0.5 },
        summary: ['Problem solving', 'Leadership'],
        href: '/en/lawyers/ada-lovelace',
      },
    ]);
  });
});
