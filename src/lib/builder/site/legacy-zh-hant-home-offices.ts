import type { Locale } from '@/lib/locales';
import {
  createOfficesDecomposedNodes,
  getOfficesResponsiveOverride,
} from '@/lib/builder/canvas/decompose-offices';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

const LEGACY_TAB_IDS = [
  'home-offices-tab-0',
  'home-offices-tab-1',
  'home-offices-tab-2',
] as const;
const MISSING_TAB_ID = 'home-offices-tab-3';
const MISSING_LAYOUT_SUBTREE = /^home-offices-layout-3(?:-|$)/;

function isLegacyZhHantHomeOfficesCanvas(
  nodes: readonly BuilderCanvasNode[],
  locale: Locale,
  isHomePage: boolean,
): boolean {
  if (locale !== 'zh-hant' || !isHomePage) return false;

  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const canonicalParents = [
    ['home-offices-container', 'home-offices-root'],
    ['home-offices-tabs', 'home-offices-container'],
    ...LEGACY_TAB_IDS.map((id) => [id, 'home-offices-tabs']),
    ['home-offices-layout-0', 'home-offices-container'],
    ['home-offices-layout-1', 'home-offices-container'],
    ['home-offices-layout-2', 'home-offices-container'],
  ] as const;
  if (canonicalParents.some(([id, parentId]) => nodesById.get(id)?.parentId !== parentId)) {
    return false;
  }

  const officeTabIds = nodes
    .map((node) => node.id)
    .filter((id) => /^home-offices-tab-\d+$/.test(id))
    .sort();
  if (
    officeTabIds.length !== LEGACY_TAB_IDS.length
    || officeTabIds.some((id, index) => id !== LEGACY_TAB_IDS[index])
  ) {
    return false;
  }

  return !nodesById.has(MISSING_TAB_ID)
    && !nodes.some((node) => MISSING_LAYOUT_SUBTREE.test(node.id));
}

function withOfficesResponsiveOverrides(node: BuilderCanvasNode): BuilderCanvasNode {
  const tablet = getOfficesResponsiveOverride(node.id, 'tablet');
  const mobile = getOfficesResponsiveOverride(node.id, 'mobile');
  if (!tablet && !mobile) return node;

  return {
    ...node,
    responsive: {
      ...node.responsive,
      ...(tablet ? {
        tablet: {
          ...node.responsive?.tablet,
          ...tablet,
          rect: {
            ...node.responsive?.tablet?.rect,
            ...tablet.rect,
          },
        },
      } : {}),
      ...(mobile ? {
        mobile: {
          ...node.responsive?.mobile,
          ...mobile,
          rect: {
            ...node.responsive?.mobile?.rect,
            ...mobile.rect,
          },
        },
      } : {}),
    },
  };
}

/**
 * Runtime-only parity for the published zh-Hant home canvas saved before the
 * Pingtung office was added. The guard deliberately recognizes only the
 * canonical three-tab office structure and never writes to the canvas data.
 */
export function projectLegacyZhHantHomeOffices(
  nodes: readonly BuilderCanvasNode[],
  locale: Locale,
  isHomePage: boolean,
): BuilderCanvasNode[] {
  if (!isLegacyZhHantHomeOfficesCanvas(nodes, locale, isHomePage)) {
    return [...nodes];
  }

  const missingNodes = createOfficesDecomposedNodes(0, 'zh-hant', 0)
    .filter((node) => node.id === MISSING_TAB_ID || MISSING_LAYOUT_SUBTREE.test(node.id))
    .map(withOfficesResponsiveOverrides);

  return [...nodes, ...missingNodes];
}
