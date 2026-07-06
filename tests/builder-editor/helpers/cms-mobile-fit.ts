import type { Page } from '@playwright/test';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';

export type OverflowBox = {
  readonly tagName: string;
  readonly className: string;
  readonly text: string;
  readonly left: number;
  readonly right: number;
  readonly width: number;
};

export type WidthMetrics = {
  readonly clientWidth: number;
  readonly scrollWidth: number;
  readonly overflowBoxes: readonly OverflowBox[];
};

export type ReferencePickerFixture = {
  readonly collection: BuilderCmsCollection;
  readonly primaryRecordId: string;
  readonly secondaryRecordId: string;
};

export async function readWidthMetrics(page: Page): Promise<WidthMetrics> {
  return page.evaluate((): WidthMetrics => {
    const clientWidth = document.documentElement.clientWidth;
    const overflowBoxes = Array.from(document.querySelectorAll('body *'))
      .map((element): OverflowBox => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        const className = typeof element.className === 'string' ? element.className : '';
        const visible = (
          style.display !== 'none'
          && style.visibility !== 'hidden'
          && rect.width > 0
          && rect.height > 0
        );
        return {
          tagName: element.tagName.toLowerCase(),
          className,
          text: visible ? (element.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 90) : '',
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        };
      })
      .filter((box) => box.left < -1 || box.right > clientWidth + 1)
      .slice(0, 12);

    return {
      clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflowBoxes,
    };
  });
}

export function makeMobileFitCollection(token: string): BuilderCmsCollection {
  const now = '2026-06-21T00:00:00.000Z';
  return {
    collectionId: `mobile-fit-${token}`,
    name: `Mobile Fit ${token}`,
    slug: `mobile-fit-${token}`,
    description: 'CMS mobile record-grid fit regression collection.',
    localized: false,
    fields: [
      { fieldId: 'field-title', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
      { fieldId: 'field-slug', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true, unique: true },
      { fieldId: 'field-summary', key: 'summary', label: 'Summary', type: 'rich-text', localized: false, repeated: false, required: false },
      { fieldId: 'field-category', key: 'category', label: 'Category', type: 'text', localized: false, repeated: false, required: false },
      { fieldId: 'field-difficulty', key: 'difficulty', label: 'Difficulty', type: 'text', localized: false, repeated: false, required: false },
    ],
    indexes: [],
    records: [
      {
        recordId: `record-${token}`,
        status: 'published',
        locale: 'ko',
        fields: {
          title: `Mobile Record ${token}`,
          slug: `mobile-record-${token}`,
          summary: `Long detail text for mobile CMS record grid wrapping ${token}`,
          category: 'responsive',
          difficulty: 'advanced',
        },
        revisions: [],
        createdAt: now,
        updatedAt: now,
      },
    ],
    permissions: { read: ['public'], create: ['admin'], update: ['admin'], delete: ['admin'] },
    createdAt: now,
    updatedAt: now,
  };
}

export function makeReferencePickerMobileFitCollection(token: string): ReferencePickerFixture {
  const now = '2026-06-21T00:00:00.000Z';
  const collectionId = `mobile-reference-${token}`;
  const primaryRecordId = `primary-${token}`;
  const secondaryRecordId = `secondary-${token}`;
  return {
    primaryRecordId,
    secondaryRecordId,
    collection: {
      collectionId,
      name: `Mobile Reference ${token}`,
      slug: collectionId,
      description: 'CMS mobile reference picker fit regression collection.',
      localized: false,
      fields: [
        { fieldId: 'field-title', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
        { fieldId: 'field-slug', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true, unique: true },
        {
          fieldId: 'field-related',
          key: 'related',
          label: 'Related record with a long mobile label',
          type: 'reference',
          localized: false,
          repeated: false,
          required: false,
          relationCollectionId: collectionId,
        },
      ],
      indexes: [],
      records: [
        {
          recordId: secondaryRecordId,
          status: 'published',
          locale: 'ko',
          fields: {
            title: `Secondary related record ${token}`,
            slug: `secondary-related-${token}`,
          },
          revisions: [],
          createdAt: now,
          updatedAt: now,
        },
        {
          recordId: primaryRecordId,
          status: 'published',
          locale: 'ko',
          fields: {
            title: `Primary reference record ${token}`,
            slug: `primary-reference-${token}`,
            related: secondaryRecordId,
          },
          revisions: [],
          createdAt: now,
          updatedAt: now,
        },
      ],
      permissions: { read: ['public'], create: ['admin'], update: ['admin'], delete: ['admin'] },
      createdAt: now,
      updatedAt: now,
    },
  };
}
