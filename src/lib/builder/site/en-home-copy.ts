import {
  EN_HOME_HERO_SUBTITLE,
  EN_HOME_SERVICES_DESCRIPTION,
} from '@/data/en-service-scope';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';

const STOCK_HERO_SUBTITLE =
  'Our multilingual legal team provides practical guidance for Taiwan investment, disputes, and cross-border matters.';

const STOCK_SERVICES_DESCRIPTION =
  'Structured support for investment, litigation, and advisory matters in Taiwan.';

const PRIMITIVE_STOCK_TEXT: ReadonlyMap<string, { from: string; to: string }> = new Map([
  ['home-hero-subtitle', { from: STOCK_HERO_SUBTITLE, to: EN_HOME_HERO_SUBTITLE }],
  ['home-services-description', { from: STOCK_SERVICES_DESCRIPTION, to: EN_HOME_SERVICES_DESCRIPTION }],
]);

const COMPOSITE_STOCK_OVERRIDES: ReadonlyMap<string, { surfaceKey: string; from: string; to: string }> = new Map([
  ['hero-search', { surfaceKey: 'subtitle', from: STOCK_HERO_SUBTITLE, to: EN_HOME_HERO_SUBTITLE }],
  ['services-bento', { surfaceKey: 'description', from: STOCK_SERVICES_DESCRIPTION, to: EN_HOME_SERVICES_DESCRIPTION }],
]);

function projectPrimitiveStockText(node: BuilderCanvasNode): BuilderCanvasNode {
  if (node.kind !== 'text') return node;
  const mapping = PRIMITIVE_STOCK_TEXT.get(node.id);
  if (!mapping) return node;
  if (node.content.text !== mapping.from) return node;
  if (mapping.to === node.content.text) return node;

  return {
    ...node,
    content: {
      ...node.content,
      text: mapping.to,
    },
  };
}

function projectCompositeStockOverrides(node: BuilderCanvasNode): BuilderCanvasNode {
  if (node.kind !== 'composite') return node;
  const { componentKey, config } = node.content;
  if (!config || config.locale !== 'en') return node;
  const mapping = COMPOSITE_STOCK_OVERRIDES.get(componentKey);
  if (!mapping) return node;

  const overrides = config.overrides;
  if (!overrides || typeof overrides !== 'object' || Array.isArray(overrides)) {
    return node;
  }

  const record = overrides as Record<string, unknown>;
  const current = record[mapping.surfaceKey];
  if (current !== mapping.from) return node;
  if (mapping.to === current) return node;

  return {
    ...node,
    content: {
      ...node.content,
      config: {
        ...config,
        overrides: {
          ...record,
          [mapping.surfaceKey]: mapping.to,
        },
      },
    },
  };
}

/**
 * Read-only published EN-home projection for leftover seed hero/services copy.
 * Saved custom copy, bound nodes, other locales, other identities, and non-home
 * routes stay on the original node reference. Never writes the stored document.
 */
export function projectPublishedEnHomeCopy(
  node: BuilderCanvasNode,
  slugPath: string,
  locale: Locale,
): BuilderCanvasNode {
  if (slugPath !== '') return node;
  if (locale !== 'en') return node;
  if (node.dataBinding !== undefined) return node;
  if (node.kind === 'text') return projectPrimitiveStockText(node);
  if (node.kind === 'composite') return projectCompositeStockOverrides(node);
  return node;
}
