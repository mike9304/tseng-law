import type { Locale } from '@/lib/locales';
import { HERO_SEARCH_WRAPPER_Y } from './decompose-hero';
import type { BuilderCanvasDocument, BuilderCanvasNode } from './types';

export interface UpgradeHomeHeroSearchFormOptions {
  readonly stampMetadata?: boolean;
}

type NodePatch = Partial<Omit<BuilderCanvasNode, 'content'>> & { content?: Record<string, unknown> };

function withNodePatch(
  node: BuilderCanvasNode,
  patch: NodePatch,
): { node: BuilderCanvasNode; changed: boolean } {
  const nextNode = {
    ...node,
    ...patch,
    rect: patch.rect ? { ...node.rect, ...patch.rect } : node.rect,
    content: patch.content ? { ...node.content, ...patch.content } : node.content,
  } as BuilderCanvasNode;
  return {
    node: nextNode,
    changed: JSON.stringify(nextNode) !== JSON.stringify(node),
  };
}

/**
 * Repairs the editable decomposed home hero-search node hierarchy to the
 * locale-aware render-parity geometry. Extracted from the admin-builder page so
 * both the initial server render and the draft GET read path normalize the
 * document consistently.
 *
 * Options:
 * - `stampMetadata: true` (default): when a node changes, stamp
 *   `updatedAt=now` and append `+hero-search-parity` to `updatedBy`. This is
 *   the behaviour the editor's initial-page migration expects.
 * - `stampMetadata: false`: keep the original `updatedAt`/`updatedBy`. Use this
 *   for read-only normalization (e.g. draft GET responses) so a record-level
 *   `updatedBy=admin` stored draft is never implicitly mutated.
 *
 * Idempotent: returns the same object reference when nothing changes.
 */
export function upgradeHomeHeroSearchForm(
  document: BuilderCanvasDocument,
  locale: Locale,
  options: UpgradeHomeHeroSearchFormOptions = {},
): BuilderCanvasDocument {
  const stampMetadata = options.stampMetadata ?? true;
  let changed = false;
  const searchButtonLabel = locale === 'ko' ? '검색' : locale === 'zh-hant' ? '搜尋' : 'Search';
  const heroSearchWrapperX = locale === 'ko' || locale === 'zh-hant' ? 51 : 0;
  const heroSearchWrapperWidth = locale === 'ko' ? 760 : locale === 'zh-hant' ? 1151 : 1280;
  const heroSearchContainerWidth = locale === 'ko' ? 760 : 1151;
  const nextNodes: BuilderCanvasNode[] = [];
  let hasInputNode = document.nodes.some((node) => node.id === 'home-hero-search-input');

  for (const node of document.nodes) {
    let result: { node: BuilderCanvasNode; changed: boolean } | null = null;

    if (node.id === 'home-hero-search-wrapper') {
      result = withNodePatch(node, {
        parentId: 'home-hero-root',
        rect: { x: heroSearchWrapperX, y: HERO_SEARCH_WRAPPER_Y, width: heroSearchWrapperWidth, height: 62 },
      });
    } else if (node.id === 'home-hero-search-container') {
      result = withNodePatch(node, {
        parentId: 'home-hero-search-wrapper',
        rect: { x: 0, y: 0, width: heroSearchContainerWidth, height: 62 },
      });
    } else if (node.id === 'home-hero-search-wrap') {
      result = withNodePatch(node, {
        parentId: 'home-hero-search-container',
        rect: { x: 0, y: 0, width: 760, height: 62 },
      });
    } else if (node.id === 'home-hero-search-bar') {
      result = withNodePatch(node, {
        parentId: 'home-hero-search-wrap',
        rect: { x: 0, y: 0, width: 760, height: 62 },
        content: {
          as: 'form',
          action: `/${locale}/search`,
          method: 'get',
          layoutMode: 'flex',
          flexConfig: {
            direction: 'row',
            wrap: false,
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 0,
          },
        },
      });
    } else if (node.id === 'home-hero-search-placeholder' && !hasInputNode) {
      const placeholder = node.content && 'text' in node.content && typeof node.content.text === 'string'
        ? node.content.text
        : '';
      result = withNodePatch(node, {
        id: 'home-hero-search-input',
        parentId: 'home-hero-search-bar',
        rect: { x: 0, y: 0, width: 700, height: 62 },
        content: {
          as: 'input',
          inputType: 'search',
          name: 'q',
          placeholder,
          ariaLabel: placeholder,
        },
      });
      hasInputNode = true;
    } else if (node.id === 'home-hero-search-placeholder') {
      changed = true;
      continue;
    } else if (node.id === 'home-hero-search-input') {
      const placeholder = node.content && 'text' in node.content && typeof node.content.text === 'string'
        ? node.content.text
        : '';
      result = withNodePatch(node, {
        parentId: 'home-hero-search-bar',
        rect: { x: 0, y: 0, width: 700, height: 62 },
        content: {
          as: 'input',
          inputType: 'search',
          name: 'q',
          placeholder,
          ariaLabel: placeholder,
        },
      });
    } else if (node.id === 'home-hero-search-button') {
      result = withNodePatch(node, {
        parentId: 'home-hero-search-bar',
        rect: { x: 700, y: 0, width: 60, height: 62 },
        content: {
          as: 'button',
          buttonType: 'submit',
          ariaLabel: searchButtonLabel,
        },
      });
    } else if (node.id === 'home-hero-quick-menu') {
      result = withNodePatch(node, {
        parentId: 'home-hero-search-wrap',
        rect: { ...node.rect, x: 0, y: 70, width: 760 },
      });
    } else if (/^home-hero-quick-menu-item-\d+$/.test(node.id)) {
      result = withNodePatch(node, {
        parentId: 'home-hero-quick-menu',
        rect: { ...node.rect, width: 760 },
      });
    }

    if (result) {
      changed = changed || result.changed;
      nextNodes.push(result.node);
    } else {
      nextNodes.push(node);
    }
  }

  if (!changed) return document;
  if (!stampMetadata) {
    return {
      ...document,
      nodes: nextNodes,
    };
  }
  return {
    ...document,
    updatedAt: new Date().toISOString(),
    updatedBy: `${document.updatedBy || 'builder'}+hero-search-parity`,
    nodes: nextNodes,
  };
}
