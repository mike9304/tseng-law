import { describe, expect, it } from 'vitest';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';
import type { ColumnPost } from '@/lib/columns';
import {
  resolvePublishedAttorneyRuntimeItems,
  resolvePublishedServiceRuntimeItems,
} from '@/lib/builder/site/runtime-items';

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
];

describe('published runtime source override items', () => {
  it('maps service source overrides into published service runtime items', () => {
    const site: Pick<BuilderSiteDocument, 'cmsCollections' | 'sourceCollectionOverrides'> = {
      sourceCollectionOverrides: {
        serviceAreas: [
          {
            sourceSlug: 'investment',
            slug: 'investment-updated',
            title: { ko: '수정된 서비스' },
            subtitle: { ko: '수정된 서비스 설명' },
            keyPoints: { ko: ['수정된 핵심 포인트'] },
            columnSlugs: ['taiwan-company-establishment-basics'],
          },
        ],
      },
    };

    expect(resolvePublishedServiceRuntimeItems(site, 'ko', posts)?.[0]).toMatchObject({
      title: '수정된 서비스',
      description: '수정된 서비스 설명',
      href: '/ko/services/investment-updated',
      details: ['수정된 핵심 포인트'],
      relatedColumns: [{ slug: 'taiwan-company-establishment-basics', title: '대만 회사설립 기초편' }],
    });
  });

  it('maps attorney source overrides into published attorney runtime items', () => {
    const site: Pick<BuilderSiteDocument, 'cmsCollections' | 'sourceCollectionOverrides'> = {
      sourceCollectionOverrides: {
        attorneyProfiles: [
          {
            sourceSlug: 'wei-tseng',
            slug: 'wei-tseng-updated',
            localized: {
              ko: {
                name: '수정된 변호사',
                role: '수정된 역할',
                title: '수정된 제목',
                description: '수정된 소개',
              },
            },
            email: 'updated@example.test',
            image: '/images/team/updated.png',
            imageAltText: '수정된 변호사 프로필 사진',
            imageFocalPoint: { x: 0.2, y: 0.8 },
          },
        ],
      },
    };

    expect(resolvePublishedAttorneyRuntimeItems(site, 'ko')?.[0]).toMatchObject({
      slug: 'wei-tseng-updated',
      name: '수정된 변호사',
      role: '수정된 역할',
      title: '수정된 제목',
      description: '수정된 소개',
      email: 'updated@example.test',
      image: '/images/team/updated.png',
      imageAltText: '수정된 변호사 프로필 사진',
      imageFocalPoint: { x: 0.2, y: 0.8 },
      href: '/ko/lawyers/wei-tseng-updated',
    });
  });
});
