import { describe, expect, it } from 'vitest';
import { createHomeBuilderDocument } from '@/lib/builder/defaults';
import {
  buildBuilderSceneDocument,
  filterBuilderSceneVisibleNodeIds,
} from '@/lib/builder/scene';
import type { ColumnPost } from '@/lib/columns';

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
    summary: '대만 법인 설립 절차 요약',
  },
];

describe('builder scene graph', () => {
  it('projects dataset bindings into visual repeater preview nodes', () => {
    const scene = buildBuilderSceneDocument(createHomeBuilderDocument('ko'), { posts });
    const repeaterNode = Object.values(scene.nodes).find(
      (node) => node.nodeKind === 'repeater' && node.datasetTargetId === 'home.insights.feed'
    );

    expect(repeaterNode).toMatchObject({
      datasetCollectionId: 'columns',
      repeaterItems: [
        expect.objectContaining({
          itemId: 'taiwan-company-establishment-basics',
          title: '대만 회사설립 기초편',
          href: '/ko/columns/taiwan-company-establishment-basics',
        }),
      ],
    });
    expect(repeaterNode?.notes.join(' ')).toContain('Repeater preview resolves 1 records');
  });

  it('includes repeater item copy in scene search', () => {
    const scene = buildBuilderSceneDocument(createHomeBuilderDocument('ko'), { posts });
    const visibleNodeIds = filterBuilderSceneVisibleNodeIds(scene, '대만 회사설립', []);

    expect(
      Object.values(scene.nodes).some(
        (node) => visibleNodeIds.has(node.nodeId) && node.datasetTargetId === 'home.insights.feed'
      )
    ).toBe(true);
  });
});
