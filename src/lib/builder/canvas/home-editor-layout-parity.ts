import type { Locale } from '@/lib/locales';
import type {
  BuilderCanvasDocument,
  BuilderCanvasNode,
  ResponsiveOverride,
} from './types';

export interface UpgradeHomeEditorLayoutParityOptions {
  readonly stampMetadata?: boolean;
}

type Rect = BuilderCanvasNode['rect'];

const LEGACY_ROOT_RECTS: Record<string, Rect> = {
  'home-hero-root': { x: 0, y: 0, width: 1280, height: 820 },
  'home-insights-root': { x: 0, y: 788, width: 1280, height: 1260 },
  'home-services-root': { x: 0, y: 2080, width: 1280, height: 1246 },
  'home-attorney-root': { x: 0, y: 3326, width: 1280, height: 720 },
  'home-case-results-root': { x: 0, y: 4046, width: 1280, height: 600 },
  'home-stats-root': { x: 0, y: 4646, width: 1280, height: 640 },
  'home-faq-root': { x: 0, y: 5691, width: 1280, height: 1333 },
  'home-offices-root': { x: 0, y: 7151, width: 1280, height: 919 },
  'home-contact-root': { x: 0, y: 7792, width: 1280, height: 640 },
};

const LIVE_ROOT_RECTS: Record<string, Rect> = {
  'home-hero-root': { x: 0, y: 0, width: 1280, height: 788 },
  'home-insights-root': { x: 0, y: 788, width: 1280, height: 820 },
  'home-services-root': { x: 0, y: 1608, width: 1280, height: 820 },
  'home-attorney-root': { x: 0, y: 2428, width: 1280, height: 926 },
  'home-case-results-root': { x: 0, y: 3354, width: 1280, height: 600 },
  'home-stats-root': { x: 0, y: 3954, width: 1280, height: 560 },
  'home-faq-root': { x: 0, y: 4514, width: 1280, height: 1160 },
  'home-offices-root': { x: 0, y: 5674, width: 1280, height: 919 },
  'home-contact-root': { x: 0, y: 6593, width: 1280, height: 532 },
};

function sameRect(rect: Rect | undefined, expected: Rect): boolean {
  return Boolean(
    rect
    && rect.x === expected.x
    && rect.y === expected.y
    && rect.width === expected.width
    && rect.height === expected.height,
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function responsiveRect(
  override: ResponsiveOverride | undefined,
): Partial<Rect> | undefined {
  return override?.rect;
}

function patchResponsiveRect(
  node: BuilderCanvasNode,
  viewport: 'tablet' | 'mobile',
  expected: Partial<Rect>,
  nextRect: Partial<Rect>,
): BuilderCanvasNode {
  const override = node.responsive?.[viewport];
  const rect = responsiveRect(override);
  if (!rect) return node;
  if (Object.entries(expected).some(([key, value]) => rect[key as keyof Rect] !== value)) return node;
  return {
    ...node,
    responsive: {
      ...node.responsive,
      [viewport]: {
        ...override,
        rect: { ...rect, ...nextRect },
      },
    },
  } as BuilderCanvasNode;
}

function repairCaseResponsive(node: BuilderCanvasNode): BuilderCanvasNode {
  const patches: Partial<Record<BuilderCanvasNode['id'], {
    tablet: { expected: Partial<Rect>; next: Partial<Rect> };
    mobile: { expected: Partial<Rect>; next: Partial<Rect> };
  }>> = {
    'home-case-results-label': {
      tablet: { expected: { x: 32, y: 32, width: 400, height: 40 }, next: { x: 20, y: 33, width: 720, height: 24 } },
      mobile: { expected: { x: 32, y: 32, width: 279, height: 40 }, next: { x: 16, y: 26, width: 341, height: 24 } },
    },
    'home-case-results-title': {
      tablet: { expected: { x: 32, y: 82, width: 670, height: 120 }, next: { x: 20, y: 72, width: 720, height: 144 } },
      mobile: { expected: { x: 32, y: 82, width: 279, height: 120 }, next: { x: 16, y: 64, width: 341, height: 104 } },
    },
    'home-case-results-desc': {
      tablet: { expected: { x: 32, y: 232, width: 670, height: 80 }, next: { x: 20, y: 256, width: 720, height: 54 } },
      mobile: { expected: { x: 32, y: 232, width: 279, height: 80 }, next: { x: 16, y: 210, width: 341, height: 81 } },
    },
    'home-case-results-summary': {
      tablet: { expected: { x: 32, y: 322, width: 670, height: 60 }, next: { x: 20, y: 327, width: 720, height: 32 } },
      mobile: { expected: { x: 32, y: 322, width: 279, height: 60 }, next: { x: 16, y: 307, width: 341, height: 54 } },
    },
    'home-case-results-cta': {
      tablet: { expected: { x: 32, y: 392, width: 200, height: 36 }, next: { x: 20, y: 379, width: 200, height: 36 } },
      mobile: { expected: { x: 32, y: 392, width: 200, height: 36 }, next: { x: 16, y: 387, width: 200, height: 36 } },
    },
  };
  const patch = patches[node.id];
  if (!patch) return node;
  return patchResponsiveRect(
    patchResponsiveRect(node, 'tablet', patch.tablet.expected, patch.tablet.next),
    'mobile',
    patch.mobile.expected,
    patch.mobile.next,
  );
}

function repairLegacyCaseNode(node: BuilderCanvasNode): BuilderCanvasNode {
  if (node.id === 'home-case-results-content'
    && node.parentId === 'home-case-results-root'
    && sameRect(node.rect, { x: 0, y: 0, width: 1280, height: 600 })) {
    return { ...node, rect: { x: 0, y: 0, width: 1280, height: 600 } } as BuilderCanvasNode;
  }

  const desktopRects: Partial<Record<string, { expected: Rect; next: Rect }>> = {
    'home-case-results-label': {
      expected: { x: 0, y: 0, width: 400, height: 40 },
      next: { x: 78, y: 0, width: 400, height: 40 },
    },
    'home-case-results-title': {
      expected: { x: 0, y: 50, width: 720, height: 120 },
      next: { x: 78, y: 39, width: 720, height: 130 },
    },
    'home-case-results-desc': {
      expected: { x: 0, y: 200, width: 720, height: 80 },
      next: { x: 78, y: 210, width: 720, height: 80 },
    },
    'home-case-results-summary': {
      expected: { x: 0, y: 290, width: 720, height: 60 },
      next: { x: 78, y: 280, width: 720, height: 60 },
    },
    'home-case-results-cta': {
      expected: { x: 0, y: 360, width: 200, height: 36 },
      next: { x: 78, y: 333, width: 200, height: 36 },
    },
  };
  const patch = desktopRects[node.id];
  if (patch && node.parentId === 'home-case-results-content' && sameRect(node.rect, patch.expected)) {
    return repairCaseResponsive({ ...node, rect: patch.next } as BuilderCanvasNode);
  }

  if (node.id !== 'home-case-results-divider' || node.kind !== 'container') {
    return repairCaseResponsive(node);
  }
  const content = node.content as unknown;
  if (!isRecord(content) || content.className !== 'split-divider') return node;
  const knownDesktop = (
    node.parentId === 'home-case-results-root'
    && sameRect(node.rect, { x: 51, y: 180, width: 80, height: 40 })
  ) || (
    node.parentId === 'home-case-results-content'
    && sameRect(node.rect, { x: 0, y: 180, width: 80, height: 4 })
  );
  if (!knownDesktop) return node;

  let repaired = {
    ...node,
    kind: 'divider' as const,
    parentId: 'home-case-results-content',
    rect: { x: 78, y: 172, width: 40, height: 32 },
    content: {
      orientation: 'horizontal' as const,
      thickness: 2,
      color: '#9f8752',
      style: 'solid' as const,
    },
  } as BuilderCanvasNode;
  repaired = patchResponsiveRect(
    repaired,
    'tablet',
    { x: 32, y: 212, width: 80, height: 4 },
    { x: 20, y: 234, width: 40, height: 4 },
  );
  repaired = patchResponsiveRect(
    repaired,
    'mobile',
    { x: 32, y: 212, width: 80, height: 4 },
    { x: 16, y: 188, width: 40, height: 4 },
  );
  return repaired;
}

function repairLegacyContactNode(node: BuilderCanvasNode): BuilderCanvasNode {
  if (node.id === 'home-contact-container'
    && node.parentId === 'home-contact-root'
    && sameRect(node.rect, { x: 72, y: 120, width: 1136, height: 380 })) {
    return { ...node, rect: { x: 51, y: 151, width: 1178, height: 381 } } as BuilderCanvasNode;
  }
  if (node.id === 'home-contact-copy') {
    const knownDetached = node.parentId === 'home-contact-root'
      && sameRect(node.rect, { x: 95, y: 120, width: 770, height: 180 });
    const knownNested = node.parentId === 'home-contact-container'
      && sameRect(node.rect, { x: 0, y: 0, width: 680, height: 180 });
    if (knownDetached || knownNested) {
      return {
        ...node,
        parentId: 'home-contact-container',
        rect: { x: 0, y: 0, width: 1178, height: 180 },
      } as BuilderCanvasNode;
    }
  }
  if (node.id === 'home-contact-title'
    && node.parentId === 'home-contact-copy'
    && sameRect(node.rect, { x: 0, y: 42, width: 640, height: 56 })) {
    return { ...node, rect: { x: 0, y: 39, width: 1178, height: 56 } } as BuilderCanvasNode;
  }
  if (node.id === 'home-contact-description'
    && node.parentId === 'home-contact-copy'
    && sameRect(node.rect, { x: 0, y: 114, width: 560, height: 58 })) {
    return { ...node, rect: { x: 0, y: 111, width: 720, height: 58 } } as BuilderCanvasNode;
  }
  if (node.id === 'home-contact-actions'
    && node.parentId === 'home-contact-container'
    && sameRect(node.rect, { x: 0, y: 214, width: 520, height: 56 })) {
    return { ...node, rect: { x: 0, y: 193, width: 1178, height: 56 } } as BuilderCanvasNode;
  }
  return node;
}

function repairLegacyStatsNode(node: BuilderCanvasNode): BuilderCanvasNode {
  if (node.id === 'home-stats-container'
    && node.parentId === 'home-stats-root'
    && sameRect(node.rect, { x: 72, y: 80, width: 1136, height: 480 })) {
    return { ...node, rect: { x: 72, y: 64, width: 1136, height: 432 } } as BuilderCanvasNode;
  }
  if (node.id === 'home-stats-title'
    && node.parentId === 'home-stats-container'
    && sameRect(node.rect, { x: 0, y: 40, width: 560, height: 54 })) {
    return node;
  }
  if (node.id === 'home-stats-description'
    && node.parentId === 'home-stats-container'
    && sameRect(node.rect, { x: 0, y: 106, width: 760, height: 64 })) {
    return node;
  }
  if (node.id === 'home-stats-grid'
    && node.parentId === 'home-stats-container'
    && sameRect(node.rect, { x: 0, y: 214, width: 1136, height: 200 })) {
    return { ...node, rect: { x: 0, y: 200, width: 1136, height: 164 } } as BuilderCanvasNode;
  }
  return node;
}

function repairLegacyHeroNode(node: BuilderCanvasNode): BuilderCanvasNode {
  if (!node.id.startsWith('home-hero-') || node.id === 'home-hero-root') return node;
  if (node.rect.height !== 820) return node;
  if (!['home-hero-media', 'home-hero-media-image', 'home-hero-media-image-2', 'home-hero-media-image-3'].includes(node.id)) {
    return node;
  }
  return { ...node, rect: { ...node.rect, height: 788 } } as BuilderCanvasNode;
}

/**
 * Repairs only the exact decomposed-home factory fingerprints that rendered
 * differently from the public site. Custom geometry is deliberately left
 * alone. Read paths should pass `stampMetadata: false`; the corrected geometry
 * is persisted naturally with the author's next real edit.
 */
export function upgradeHomeEditorLayoutParity(
  document: BuilderCanvasDocument,
  locale: Locale,
  options: UpgradeHomeEditorLayoutParityOptions = {},
): BuilderCanvasDocument {
  if (locale !== 'ko' || !document.nodes.some((node) => node.id === 'home-hero-root')) {
    return document;
  }

  const nodesById = new Map(document.nodes.map((node) => [node.id, node]));
  const isExactLegacyRootStack = Object.entries(LEGACY_ROOT_RECTS).every(([id, rect]) => (
    sameRect(nodesById.get(id)?.rect, rect)
  ));
  let changed = false;
  const nodes = document.nodes.map((node) => {
    let next = node;
    const legacyRootRect = LEGACY_ROOT_RECTS[node.id];
    if (legacyRootRect && LIVE_ROOT_RECTS[node.id] && sameRect(node.rect, legacyRootRect)) {
      next = { ...next, rect: LIVE_ROOT_RECTS[node.id] } as BuilderCanvasNode;
    }
    next = repairLegacyCaseNode(next);
    next = repairLegacyStatsNode(next);
    next = repairLegacyContactNode(next);
    next = repairLegacyHeroNode(next);
    if (next !== node) changed = true;
    return next;
  });

  if (!changed) return document;
  const layoutDocument = {
    ...document,
    ...(isExactLegacyRootStack ? { stageHeight: 7127 } : {}),
    nodes,
  };
  if (options.stampMetadata === false) return layoutDocument;
  return {
    ...layoutDocument,
    updatedAt: new Date().toISOString(),
    updatedBy: `${document.updatedBy || 'builder'}+home-editor-parity`,
  };
}
