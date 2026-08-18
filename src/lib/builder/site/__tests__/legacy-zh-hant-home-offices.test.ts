import { describe, expect, it } from 'vitest';
import {
  createOfficesDecomposedNodes,
  getOfficesResponsiveOverride,
} from '@/lib/builder/canvas/decompose-offices';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { projectLegacyZhHantHomeOffices } from '../legacy-zh-hant-home-offices';

function legacyThreeOfficeNodes(): BuilderCanvasNode[] {
  return createOfficesDecomposedNodes(0, 'zh-hant', 0).filter((node) =>
    node.id !== 'home-offices-tab-3'
    && !/^home-offices-layout-3(?:-|$)/.test(node.id),
  );
}

describe('projectLegacyZhHantHomeOffices', () => {
  it('projects the canonical Pingtung tab and layout subtree without changing persisted nodes', () => {
    const legacyNodes = legacyThreeOfficeNodes();
    const originalNodes = [...legacyNodes];

    const projected = projectLegacyZhHantHomeOffices(legacyNodes, 'zh-hant', true);
    const nodesById = new Map(projected.map((node) => [node.id, node]));

    expect(projected.slice(0, legacyNodes.length)).toEqual(originalNodes);
    expect(projected.slice(0, legacyNodes.length)).toEqual(legacyNodes);
    expect(projected.slice(0, legacyNodes.length).every((node, index) => node === legacyNodes[index])).toBe(true);
    expect(legacyNodes).toEqual(originalNodes);
    expect(nodesById.get('home-offices-tab-3')?.content).toMatchObject({ label: '屏東' });
    expect(nodesById.get('home-offices-layout-3-card-title')?.content).toMatchObject({ text: '屏東' });
    expect(nodesById.get('home-offices-layout-3-card-address')?.content).toMatchObject({
      text: '90443屏東縣九如鄉九如路三段46號',
    });
    expect(nodesById.get('home-offices-tab-3')?.responsive).toEqual({
      tablet: getOfficesResponsiveOverride('home-offices-tab-3', 'tablet'),
      mobile: getOfficesResponsiveOverride('home-offices-tab-3', 'mobile'),
    });
    expect(nodesById.get('home-offices-layout-3')?.responsive).toEqual({
      tablet: getOfficesResponsiveOverride('home-offices-layout-3', 'tablet'),
      mobile: getOfficesResponsiveOverride('home-offices-layout-3', 'mobile'),
    });
  });

  it.each([
    ['a non-zh-Hant canvas', 'ko' as const, true, legacyThreeOfficeNodes()],
    ['a non-home canvas', 'zh-hant' as const, false, legacyThreeOfficeNodes()],
    ['a canvas that already has tab 3', 'zh-hant' as const, true, createOfficesDecomposedNodes(0, 'zh-hant', 0)],
    ['a canvas with a noncanonical extra office tab', 'zh-hant' as const, true, [
      ...legacyThreeOfficeNodes(),
      {
        ...legacyThreeOfficeNodes().find((node) => node.id === 'home-offices-tab-2')!,
        id: 'home-offices-tab-4',
      },
    ]],
    ['a canvas with part of layout 3 already present', 'zh-hant' as const, true, [
      ...legacyThreeOfficeNodes(),
      {
        ...createOfficesDecomposedNodes(0, 'zh-hant', 0).find((node) => node.id === 'home-offices-layout-3')!,
      },
    ]],
  ])('does not project %s', (_description, locale, isHomePage, nodes) => {
    const projected = projectLegacyZhHantHomeOffices(nodes, locale, isHomePage);

    expect(projected).toEqual(nodes);
    expect(projected).not.toBe(nodes);
  });
});
