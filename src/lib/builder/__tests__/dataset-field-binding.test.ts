import { describe, expect, it } from 'vitest';
import type { ColumnPost } from '@/lib/columns';
import {
  applyBuilderDatasetBindingToNode,
  resolveBuilderDatasetBindingRecordCount,
  resolveBuilderDatasetFieldValue,
} from '@/lib/builder/dataset-field-binding';
import {
  builderCanvasNodeSchema,
  type BuilderButtonCanvasNode,
  type BuilderContainerCanvasNode,
  type BuilderGalleryCanvasNode,
  type BuilderImageCanvasNode,
  type BuilderTextCanvasNode,
} from '@/lib/builder/canvas/types';
import { richTextFromPlainText } from '@/lib/builder/rich-text/sanitize';

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
    content: '회사설립 본문',
    summary: '회사설립 요약',
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
    content: '소송 본문',
    summary: '소송 요약',
  },
];

const context = { locale: 'ko' as const, posts };

function makeTextNode(): BuilderTextCanvasNode {
  return builderCanvasNodeSchema.parse({
    id: 'bound-text',
    kind: 'text',
    rect: { x: 0, y: 0, width: 320, height: 64 },
    zIndex: 1,
    content: {
      text: '기존 텍스트',
      richText: richTextFromPlainText('기존 텍스트'),
      fontSize: 32,
      color: '#111827',
      fontWeight: 'bold',
      align: 'left',
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    dataBinding: {
      targetId: 'home.insights.feed',
      fields: { text: 'title', href: 'href' },
    },
  }) as BuilderTextCanvasNode;
}

function makeImageNode(): BuilderImageCanvasNode {
  return builderCanvasNodeSchema.parse({
    id: 'bound-image',
    kind: 'image',
    rect: { x: 0, y: 0, width: 320, height: 180 },
    zIndex: 1,
    content: {
      src: '/images/placeholder-image.svg',
      alt: 'placeholder',
      fit: 'cover',
      link: null,
    },
    dataBinding: {
      targetId: 'home.insights.feed',
      recordIndex: 1,
      fields: { src: 'featuredImage', alt: 'title', href: 'href' },
    },
  }) as BuilderImageCanvasNode;
}

function makeButtonNode(): BuilderButtonCanvasNode {
  return builderCanvasNodeSchema.parse({
    id: 'bound-button',
    kind: 'button',
    rect: { x: 0, y: 0, width: 180, height: 48 },
    zIndex: 1,
    content: {
      label: '기존 버튼',
      href: '',
      style: 'primary-solid',
      link: null,
    },
    dataBinding: {
      targetId: 'home.services.list',
      fields: { label: 'title', href: 'href' },
    },
  }) as BuilderButtonCanvasNode;
}

function makeAttorneyImageNode(): BuilderImageCanvasNode {
  return builderCanvasNodeSchema.parse({
    id: 'bound-attorney-image',
    kind: 'image',
    rect: { x: 0, y: 0, width: 220, height: 220 },
    zIndex: 1,
    content: {
      src: '/images/placeholder-image.svg',
      alt: 'placeholder',
      fit: 'cover',
      link: null,
    },
    dataBinding: {
      targetId: 'home.attorney.profile',
      fields: { src: 'image', alt: 'name', href: 'href' },
    },
  }) as BuilderImageCanvasNode;
}

function makeGalleryNode(): BuilderGalleryCanvasNode {
  return builderCanvasNodeSchema.parse({
    id: 'bound-gallery',
    kind: 'gallery',
    rect: { x: 0, y: 0, width: 640, height: 320 },
    zIndex: 1,
    content: {
      images: [
        {
          src: '/images/placeholder-image.svg',
          alt: 'placeholder',
          caption: 'placeholder caption',
        },
      ],
      layout: 'grid',
      columns: 2,
      gap: 12,
      showCaptions: true,
      captionMode: 'below',
    },
    dataBinding: {
      targetId: 'home.insights.feed',
      fields: { src: 'featuredImage', alt: 'title', caption: 'categoryLabel' },
    },
  }) as BuilderGalleryCanvasNode;
}

function makeRepeaterNode(): BuilderContainerCanvasNode {
  return builderCanvasNodeSchema.parse({
    id: 'bound-repeater',
    kind: 'container',
    rect: { x: 0, y: 0, width: 720, height: 320 },
    zIndex: 1,
    content: {
      label: 'Repeater',
      background: '#ffffff',
      borderColor: '#e5e7eb',
      borderStyle: 'solid',
      borderWidth: 1,
      borderRadius: 16,
      padding: 20,
      layoutMode: 'repeater',
      flexConfig: {
        direction: 'row',
        wrap: true,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        gap: 16,
      },
      layoutItems: [
        {
          title: '기존 항목',
          description: '기존 설명',
          image: '/images/placeholder-image.svg',
        },
      ],
    },
    dataBinding: {
      targetId: 'home.insights.feed',
      fields: { title: 'title', description: 'summary', src: 'featuredImage' },
    },
  }) as BuilderContainerCanvasNode;
}

describe('builder dataset field binding', () => {
  it('binds text content and link fields without changing typography', () => {
    const node = makeTextNode();
    const rendered = applyBuilderDatasetBindingToNode(node, context) as BuilderTextCanvasNode;

    expect(rendered.content.text).toBe('대만 회사설립 기초편');
    expect(rendered.content.richText?.plainText).toBe('대만 회사설립 기초편');
    expect(rendered.content.link?.href).toBe('/ko/columns/taiwan-company-establishment-basics');
    expect(rendered.content.fontSize).toBe(node.content.fontSize);
    expect(rendered.content.fontWeight).toBe(node.content.fontWeight);
  });

  it('supports record index overrides for repeated child templates', () => {
    const node = makeTextNode();
    const rendered = applyBuilderDatasetBindingToNode(node, {
      ...context,
      recordIndexOverride: 1,
    }) as BuilderTextCanvasNode;

    expect(rendered.content.text).toBe('헬스장 부상 소송');
    expect(rendered.content.link?.href).toBe('/ko/columns/taiwan-gym-injury-lawsuit');
  });

  it('binds image source, alternate text, and link fields from column records', () => {
    const rendered = applyBuilderDatasetBindingToNode(makeImageNode(), context) as BuilderImageCanvasNode;

    expect(rendered.content.src).toBe('/images/blog/case.jpg');
    expect(rendered.content.alt).toBe('헬스장 부상 소송');
    expect(rendered.content.link?.href).toBe('/ko/columns/taiwan-gym-injury-lawsuit');
  });

  it('binds button label and href fields from service records', () => {
    const rendered = applyBuilderDatasetBindingToNode(makeButtonNode(), context) as BuilderButtonCanvasNode;

    expect(rendered.content.label).toBe('투자·법인설립');
    expect(rendered.content.href).toBe('/ko/services/investment');
    expect(rendered.content.link?.href).toBe('/ko/services/investment');
  });

  it('binds attorney profile image, alt text, and profile links', () => {
    const rendered = applyBuilderDatasetBindingToNode(makeAttorneyImageNode(), context) as BuilderImageCanvasNode;

    expect(rendered.content.src).toBe('/images/team/tseng-junwei.png');
    expect(rendered.content.alt).toBe('증준외 변호사');
    expect(rendered.content.link?.href).toBe('/ko/lawyers/wei-tseng');
    expect(resolveBuilderDatasetFieldValue({
      context,
      targetId: 'home.attorney.profile',
      fieldId: 'role',
    })).toContain('대표 변호사');
  });

  it('binds gallery images from column records while preserving layout controls', () => {
    const node = makeGalleryNode();
    const rendered = applyBuilderDatasetBindingToNode(node, context) as BuilderGalleryCanvasNode;

    expect(rendered.content.images).toHaveLength(2);
    expect(rendered.content.images[0]).toMatchObject({
      src: '/images/blog/company.jpg',
      alt: '대만 회사설립 기초편',
      caption: '법인설립',
      tags: ['formation', '법인설립'],
    });
    expect(rendered.content.images[1]).toMatchObject({
      src: '/images/blog/case.jpg',
      alt: '헬스장 부상 소송',
      caption: '소송사례',
      tags: ['case', '소송사례'],
    });
    expect(rendered.content.layout).toBe(node.content.layout);
    expect(rendered.content.columns).toBe(node.content.columns);
    expect(rendered.content.gap).toBe(node.content.gap);
  });

  it('binds repeater layout items from dataset records', () => {
    const node = makeRepeaterNode();
    const rendered = applyBuilderDatasetBindingToNode(node, context) as BuilderContainerCanvasNode;

    expect(rendered.content.layoutMode).toBe('repeater');
    expect(rendered.content.layoutItems).toHaveLength(2);
    expect(rendered.content.layoutItems?.[0]).toEqual({
      title: '대만 회사설립 기초편',
      description: '회사설립 요약',
      image: '/images/blog/company.jpg',
    });
    expect(rendered.content.layoutItems?.[1]).toEqual({
      title: '헬스장 부상 소송',
      description: '소송 요약',
      image: '/images/blog/case.jpg',
    });
    expect(rendered.content.flexConfig).toBe(node.content.flexConfig);
    expect(resolveBuilderDatasetBindingRecordCount(context, node.dataBinding!)).toBe(2);
  });

  it('does not use repeater preview record index as a published list offset', () => {
    const node = makeRepeaterNode();
    const previewCursorNode = {
      ...node,
      dataBinding: {
        ...node.dataBinding!,
        recordIndex: 1,
      },
    } as BuilderContainerCanvasNode;

    const rendered = applyBuilderDatasetBindingToNode(previewCursorNode, context) as BuilderContainerCanvasNode;

    expect(rendered.content.layoutItems).toHaveLength(2);
    expect(rendered.content.layoutItems?.[0]?.title).toBe('대만 회사설립 기초편');
    expect(resolveBuilderDatasetBindingRecordCount(context, previewCursorNode.dataBinding!)).toBe(2);
  });

  it('clears repeater layout items when dataset filters match no records', () => {
    const node = makeRepeaterNode();
    const emptyContext = {
      ...context,
      document: {
        pageKey: 'home' as const,
        datasets: [
          {
            version: 1 as const,
            datasetId: 'home.insights.feed' as const,
            targetId: 'home.insights.feed' as const,
            sectionKey: 'home.insights' as const,
            collectionId: 'columns' as const,
            mode: 'list' as const,
            filters: [{ fieldId: 'title', operator: 'equals' as const, value: '__no_match__' }],
            sort: [],
            limit: 4,
          },
        ],
      },
    };

    const rendered = applyBuilderDatasetBindingToNode(node, emptyContext) as BuilderContainerCanvasNode;

    expect(rendered.content.layoutItems).toEqual([]);
    expect(JSON.stringify(rendered.content.layoutItems)).not.toContain('기존 항목');
    expect(resolveBuilderDatasetBindingRecordCount(emptyContext, node.dataBinding!)).toBe(0);
  });

  it('prioritizes runtime records for user CMS collection dynamic list bindings', () => {
    const runtimeContext = {
      ...context,
      runtimeRecordsByTarget: {
        'home.insights.feed': [
          {
            recordId: 'recipe-alpha',
            primaryLabel: 'Alpha Soup',
            secondaryLabel: 'Alpha summary',
            routePath: '/ko/recipes/alpha-soup',
            fieldValues: {
              title: 'Alpha Soup',
              summary: 'Alpha custom summary',
              href: '/ko/recipes/alpha-soup',
              category: 'soup',
            },
          },
          {
            recordId: 'recipe-charlie',
            primaryLabel: 'Charlie Soup',
            secondaryLabel: 'Charlie summary',
            routePath: '/ko/recipes/charlie-soup',
            fieldValues: {
              title: 'Charlie Soup',
              summary: 'Charlie custom summary',
              href: '/ko/recipes/charlie-soup',
              category: 'soup',
            },
          },
        ],
      },
    };

    const text = applyBuilderDatasetBindingToNode(makeTextNode(), runtimeContext) as BuilderTextCanvasNode;
    expect(text.content.text).toBe('Alpha Soup');
    expect(text.content.link?.href).toBe('/ko/recipes/alpha-soup');

    const secondText = applyBuilderDatasetBindingToNode(makeTextNode(), {
      ...runtimeContext,
      recordIndexOverride: 1,
    }) as BuilderTextCanvasNode;
    expect(secondText.content.text).toBe('Charlie Soup');
    expect(secondText.content.link?.href).toBe('/ko/recipes/charlie-soup');

    const repeater = applyBuilderDatasetBindingToNode(makeRepeaterNode(), runtimeContext) as BuilderContainerCanvasNode;
    expect(repeater.content.layoutItems).toEqual([
      { title: 'Alpha Soup', description: 'Alpha custom summary', image: undefined },
      { title: 'Charlie Soup', description: 'Charlie custom summary', image: undefined },
    ]);
    expect(resolveBuilderDatasetBindingRecordCount(runtimeContext, makeRepeaterNode().dataBinding!)).toBe(2);
  });

  it('returns null for unsupported fields and clears mapped placeholder content', () => {
    const node = builderCanvasNodeSchema.parse({
      ...makeTextNode(),
      dataBinding: {
        targetId: 'home.insights.feed',
        fields: { text: 'missingField' },
      },
    }) as BuilderTextCanvasNode;

    expect(resolveBuilderDatasetFieldValue({
      context,
      targetId: 'home.insights.feed',
      fieldId: 'missingField',
    })).toBeNull();
    const rendered = applyBuilderDatasetBindingToNode(node, context) as BuilderTextCanvasNode;
    expect(rendered).not.toBe(node);
    expect(rendered.content.text).toBe('');
    expect(rendered.content.richText?.plainText).toBe('');

    const staleGallery = {
      ...makeGalleryNode(),
      dataBinding: {
        targetId: 'home.insights.feed' as const,
        fields: { src: 'missingImageField' },
      },
    } as BuilderGalleryCanvasNode;
    const renderedGallery = applyBuilderDatasetBindingToNode(staleGallery, context) as BuilderGalleryCanvasNode;
    expect(renderedGallery.content.images).toEqual([]);
  });
});
