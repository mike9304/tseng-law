import type { Locale } from '@/lib/locales';
import type { BuilderCanvasDocument, BuilderCanvasNode } from './types';

export const HOME_COMPOSITE_SECTION_IDS = [
  'home-hero',
  'home-insights',
  'home-services',
  'home-attorney',
  'home-case-results',
  'home-stats',
  'home-faq',
  'home-offices',
  'home-contact',
] as const;

export type HomeCompositeSectionId = (typeof HOME_COMPOSITE_SECTION_IDS)[number];
export type HomeCompositeSectionKey =
  | 'hero'
  | 'insights'
  | 'services'
  | 'attorney'
  | 'caseResults'
  | 'stats'
  | 'faq'
  | 'offices'
  | 'contact';

export type HomeCompositeSectionHeights = Record<HomeCompositeSectionKey, number>;

/** Desktop floors measured from the current production site at 1280px. */
export const PUBLISHED_HOME_COMPOSITE_HEIGHTS_BY_LOCALE = {
  ko: {
    hero: 788,
    insights: 1277,
    services: 1278,
    attorney: 926,
    caseResults: 800,
    stats: 621,
    faq: 1333,
    offices: 909,
    contact: 532,
  },
  en: {
    hero: 788,
    insights: 1277,
    services: 1278,
    attorney: 926,
    caseResults: 800,
    stats: 621,
    faq: 1333,
    offices: 919,
    contact: 516,
  },
  'zh-hant': {
    hero: 774,
    insights: 1247,
    services: 1279,
    attorney: 926,
    caseResults: 843,
    stats: 622,
    faq: 1333,
    offices: 919,
    contact: 543,
  },
} as const satisfies Record<Locale, HomeCompositeSectionHeights>;

export const PUBLISHED_HOME_COMPOSITE_STAGE_HEIGHT_BY_LOCALE = {
  ko: 8504,
  en: 8460,
  'zh-hant': 8488,
} as const satisfies Record<Locale, number>;

type Geometry = Record<HomeCompositeSectionId, { x: number; y: number; width: number; height: number }>;

const SECTION_KEYS_BY_ID: Record<HomeCompositeSectionId, HomeCompositeSectionKey> = {
  'home-hero': 'hero',
  'home-insights': 'insights',
  'home-services': 'services',
  'home-attorney': 'attorney',
  'home-case-results': 'caseResults',
  'home-stats': 'stats',
  'home-faq': 'faq',
  'home-offices': 'offices',
  'home-contact': 'contact',
};

function buildGeometry(heights: HomeCompositeSectionHeights): Geometry {
  let y = 0;
  return Object.fromEntries(HOME_COMPOSITE_SECTION_IDS.map((id) => {
    const height = heights[SECTION_KEYS_BY_ID[id]];
    const entry = [id, { x: 0, y, width: 1280, height }] as const;
    y += height;
    return entry;
  })) as Geometry;
}

const TARGET_KO_GEOMETRY = buildGeometry(PUBLISHED_HOME_COMPOSITE_HEIGHTS_BY_LOCALE.ko);

const LEGACY_KO_FACTORY_FINGERPRINTS = [
  {
    stageHeight: 8460,
    geometry: buildGeometry({
      hero: 788,
      insights: 1277,
      services: 1278,
      attorney: 926,
      caseResults: 800,
      stats: 621,
      faq: 1333,
      offices: 919,
      contact: 516,
    }),
  },
  {
    stageHeight: 8477,
    geometry: buildGeometry({
      hero: 788,
      insights: 1277,
      services: 1279,
      attorney: 926,
      caseResults: 800,
      stats: 621,
      faq: 1333,
      offices: 919,
      contact: 532,
    }),
  },
] as const;

function rectMatches(node: BuilderCanvasNode, expected: Geometry[HomeCompositeSectionId]): boolean {
  return node.rect.x === expected.x
    && node.rect.y === expected.y
    && node.rect.width === expected.width
    && node.rect.height === expected.height;
}

function matchesFactoryFingerprint(
  document: BuilderCanvasDocument,
  fingerprint: (typeof LEGACY_KO_FACTORY_FINGERPRINTS)[number],
): boolean {
  if (document.stageHeight !== fingerprint.stageHeight) return false;
  if (!/^home-seed-v(?:10|11|12)(?:$|\+)/.test(document.updatedBy ?? '')) return false;
  if (document.nodes.length !== HOME_COMPOSITE_SECTION_IDS.length) return false;

  const nodesById = new Map(document.nodes.map((node) => [node.id, node] as const));
  return HOME_COMPOSITE_SECTION_IDS.every((id) => {
    const node = nodesById.get(id);
    return Boolean(
      node
      && node.kind === 'composite'
      && !node.parentId
      && rectMatches(node, fingerprint.geometry[id]),
    );
  });
}

/**
 * Read-time repair for two exact, known factory fingerprints. It deliberately
 * refuses approximate matches so a user-positioned composite home is never
 * rewritten merely because its document still carries an old seed marker.
 */
export function normalizeLegacyPublishedHomeComposite(
  document: BuilderCanvasDocument,
  locale: Locale,
): BuilderCanvasDocument {
  if (locale !== 'ko') return document;
  if (!LEGACY_KO_FACTORY_FINGERPRINTS.some((fingerprint) => (
    matchesFactoryFingerprint(document, fingerprint)
  ))) {
    return document;
  }

  return {
    ...document,
    stageHeight: PUBLISHED_HOME_COMPOSITE_STAGE_HEIGHT_BY_LOCALE.ko,
    nodes: document.nodes.map((node) => {
      if (!HOME_COMPOSITE_SECTION_IDS.includes(node.id as HomeCompositeSectionId)) return node;
      const rect = TARGET_KO_GEOMETRY[node.id as HomeCompositeSectionId];
      return { ...node, rect: { ...rect } };
    }),
  };
}
