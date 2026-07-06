import type { BuilderCanvasDocument, BuilderCanvasNode, CompositeComponentKey } from './types';
import { createDefaultCanvasNodeStyle } from './types';
import { responsivize } from '@/lib/builder/templates/_shared/responsivize';
import type { Locale } from '@/lib/locales';
import {
  createCaseResultsDecomposedNodes,
  CASE_RESULTS_ROOT_HEIGHT,
} from './decompose-case-results';
import {
  createHeroDecomposedNodes,
  HERO_MEDIA_IMAGE_NODE_IDS,
  HERO_SECTION_ROOT_HEIGHT,
} from './decompose-hero';
import {
  createInsightsDecomposedNodes,
  INSIGHTS_SECTION_ROOT_HEIGHT,
} from './decompose-insights';
import {
  createServicesDecomposedNodes,
  SERVICES_SECTION_ROOT_HEIGHT,
} from './decompose-services';
import {
  createAttorneyDecomposedNodes,
  ATTORNEY_SECTION_ROOT_HEIGHT,
} from './decompose-attorney';
import {
  createStatsDecomposedNodes,
  STATS_SECTION_ROOT_HEIGHT,
} from './decompose-stats';
import {
  createFaqDecomposedNodes,
  FAQ_SECTION_ROOT_HEIGHT,
} from './decompose-faq';
import {
  createOfficesDecomposedNodes,
  OFFICES_SECTION_ROOT_HEIGHT,
} from './decompose-offices';
import {
  createContactDecomposedNodes,
  CONTACT_SECTION_ROOT_HEIGHT,
} from './decompose-contact';

// v7: the home is now seeded as a live-reflecting `composite` stack (mirrors the
// real tseng-law.com home), with the editable decomposed layout preserved as the
// "decompose to edit" target.
// v10: default home is the live-reflecting COMPOSITE stack (mirrors tseng-law.com
// exactly); content is edited via the data admins, not the canvas. The editable
// decomposed home is kept for "decompose to edit" + admin migrations/locale
// repair. Bumping re-seeds existing homes to the live-matching composite.
// v12: composite home no longer receives auto-generated mobile rect overrides.
// The underlying live React sections own their responsive layout; auto-fit
// overrides inserted artificial mobile gaps and made the public home drift from
// the real site.
export const SEED_VERSION = 'home-seed-v12';
export const PREVIOUS_SEED_VERSIONS = new Set(['home-seed-v6', 'home-seed-v7', 'home-seed-v8', 'home-seed-v9', 'home-seed-v10', 'home-seed-v11']);

const STAGE_WIDTH = 1280;

type CompositeSpec = {
  kind: 'composite';
  id: string;
  componentKey: CompositeComponentKey;
  height: number;
};

type DecomposedSpec = {
  kind: 'decomposed';
  key: CompositeSectionKey;
  builder: (y: number, locale: Locale, zBase: number) => BuilderCanvasNode[];
  height: number;
};

type HomeSectionSpec = CompositeSpec | DecomposedSpec;

// Editable, granular home layout — the "decompose to edit" target and the
// subject of the layout regression test. Section order matches the live home.
const decomposedHomeSections: HomeSectionSpec[] = [
  { kind: 'decomposed', key: 'hero',        builder: createHeroDecomposedNodes,      height: HERO_SECTION_ROOT_HEIGHT },
  { kind: 'decomposed', key: 'insights',    builder: createInsightsDecomposedNodes,  height: INSIGHTS_SECTION_ROOT_HEIGHT },
  { kind: 'decomposed', key: 'services',    builder: createServicesDecomposedNodes,  height: SERVICES_SECTION_ROOT_HEIGHT },
  { kind: 'decomposed', key: 'attorney',    builder: createAttorneyDecomposedNodes,  height: ATTORNEY_SECTION_ROOT_HEIGHT },
  { kind: 'decomposed', key: 'caseResults', builder: createCaseResultsDecomposedNodes, height: CASE_RESULTS_ROOT_HEIGHT },
  { kind: 'decomposed', key: 'stats',       builder: createStatsDecomposedNodes,     height: STATS_SECTION_ROOT_HEIGHT },
  { kind: 'decomposed', key: 'faq',         builder: createFaqDecomposedNodes,       height: FAQ_SECTION_ROOT_HEIGHT },
  { kind: 'decomposed', key: 'offices',     builder: createOfficesDecomposedNodes,   height: OFFICES_SECTION_ROOT_HEIGHT },
  { kind: 'decomposed', key: 'contact',     builder: createContactDecomposedNodes,   height: CONTACT_SECTION_ROOT_HEIGHT },
];

// Live-reflecting home: each section is a `composite` node rendering the SAME
// React component the live tseng-law.com home uses, in the same order, so the
// builder home mirrors the real site exactly.
// Natural render heights (1280px desktop) measured from the live published home
// via scripts/measure-home-sections.mjs. Used as the composite flow floor so the
// editor canvas stacks sections exactly like the published page. Re-run that
// script after content/layout changes and update these values.
const MEASURED_SECTION_HEIGHTS = {
  hero: 788,
  insights: 1277,
  services: 1278,
  attorney: 926,
  caseResults: 800,
  stats: 621,
  faq: 1333,
  offices: 919,
  contact: 516,
} as const;

type CompositeSectionKey = keyof typeof MEASURED_SECTION_HEIGHTS;
type CompositeSectionHeights = Record<CompositeSectionKey, number>;

const MEASURED_SECTION_HEIGHTS_BY_LOCALE = {
  ko: MEASURED_SECTION_HEIGHTS,
  en: MEASURED_SECTION_HEIGHTS,
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
} satisfies Record<Locale, CompositeSectionHeights>;

const ZH_HANT_DECOMPOSED_SECTION_HEIGHTS = MEASURED_SECTION_HEIGHTS_BY_LOCALE['zh-hant'];
const ZH_HANT_HERO_OVERLAY_BACKGROUND = 'radial-gradient(circle at 14% 28%, rgba(159, 135, 82, 0.18), transparent 36%), linear-gradient(180deg, transparent 55%, rgba(6, 16, 11, 0.55) 100%), linear-gradient(118deg, rgba(6, 16, 11, 0.82), rgba(6, 16, 11, 0.58) 42%, rgba(6, 16, 11, 0.22) 78%, rgba(6, 16, 11, 0.12))';
const ROOT_NODE_IDS = {
  hero: 'home-hero-root', insights: 'home-insights-root', services: 'home-services-root',
  attorney: 'home-attorney-root', caseResults: 'home-case-results-root', stats: 'home-stats-root',
  faq: 'home-faq-root', offices: 'home-offices-root', contact: 'home-contact-root',
} as const satisfies Record<CompositeSectionKey, string>;

type LocalizedGeometryInput = {
  readonly key: CompositeSectionKey;
  readonly locale: Locale;
  readonly nodes: BuilderCanvasNode[];
  readonly height: number;
};

function setNodeRect(
  nodesById: ReadonlyMap<string, BuilderCanvasNode>,
  id: string,
  rect: Partial<BuilderCanvasNode['rect']>,
): void {
  const node = nodesById.get(id);
  if (!node) return;
  node.rect = { ...node.rect, ...rect };
}

function shiftDirectChildrenY(
  nodes: BuilderCanvasNode[],
  parentId: string,
  deltaY: number,
): void {
  nodes.filter((node) => node.parentId === parentId).forEach((node) => {
    node.rect = { ...node.rect, y: node.rect.y + deltaY };
  });
}

function setNodeZIndex(
  nodesById: ReadonlyMap<string, BuilderCanvasNode>,
  id: string,
  zIndex: number,
): void {
  const node = nodesById.get(id);
  if (!node) return;
  node.zIndex = zIndex;
}

function createZhHantHeroOverlayNode(height: number): BuilderCanvasNode {
  return {
    id: 'home-hero-overlay',
    kind: 'container',
    parentId: 'home-hero-root',
    rect: { x: 0, y: 0, width: STAGE_WIDTH, height },
    style: createDefaultCanvasNodeStyle({
      backgroundColor: ZH_HANT_HERO_OVERLAY_BACKGROUND,
      borderRadius: 0,
    }),
    zIndex: 0,
    rotation: 0,
    locked: true,
    visible: true,
    content: {
      label: 'home hero overlay',
      background: 'transparent',
      borderColor: '#cbd5e1',
      borderStyle: 'solid',
      borderWidth: 0,
      borderRadius: 0,
      padding: 0,
      layoutMode: 'absolute',
      className: 'home-hero-overlay',
      as: 'div',
    },
  };
}

function upsertNodeAfter(
  nodes: BuilderCanvasNode[],
  afterId: string,
  nextNode: BuilderCanvasNode,
): void {
  const existingIndex = nodes.findIndex((node) => node.id === nextNode.id);
  if (existingIndex >= 0) {
    nodes[existingIndex] = nextNode;
    return;
  }

  const afterIndex = nodes.findIndex((node) => node.id === afterId);
  nodes.splice(afterIndex >= 0 ? afterIndex + 1 : nodes.length, 0, nextNode);
}

function applyLocalizedDecomposedGeometry(input: LocalizedGeometryInput): BuilderCanvasNode[] {
  if (input.locale !== 'zh-hant') return input.nodes;

  const nodesById = new Map(input.nodes.map((node) => [node.id, node]));
  setNodeRect(nodesById, ROOT_NODE_IDS[input.key], { height: input.height });

  switch (input.key) {
    case 'hero':
      setNodeRect(nodesById, 'home-hero-media', { height: input.height });
      setNodeZIndex(nodesById, 'home-hero-media', 0);
      HERO_MEDIA_IMAGE_NODE_IDS.forEach((id) => {
        setNodeRect(nodesById, id, { height: input.height });
        setNodeZIndex(nodesById, id, 0);
      });
      upsertNodeAfter(
        input.nodes,
        HERO_MEDIA_IMAGE_NODE_IDS[HERO_MEDIA_IMAGE_NODE_IDS.length - 1] ?? 'home-hero-media',
        createZhHantHeroOverlayNode(input.height),
      );
      setNodeRect(nodesById, 'home-hero-inner', { y: 175 });
      setNodeRect(nodesById, 'home-hero-links', { y: 286 });
      setNodeRect(nodesById, 'home-hero-search-wrapper', { x: 51, y: 712, width: 1151 });
      setNodeRect(nodesById, 'home-hero-scroll-arrow', { y: input.height - 74 });
      break;
    case 'insights':
      setNodeRect(nodesById, 'home-insights-container', { height: input.height - 160 });
      break;
    case 'services':
      setNodeRect(nodesById, 'home-services-container', { height: input.height - 88 });
      break;
    case 'attorney':
      setNodeRect(nodesById, 'home-attorney-image-wrap', { height: input.height });
      setNodeRect(nodesById, 'home-attorney-image', { height: input.height });
      setNodeRect(nodesById, 'home-attorney-badge', { y: input.height - 160 });
      setNodeRect(nodesById, 'home-attorney-content', { height: input.height });
      shiftDirectChildrenY(input.nodes, 'home-attorney-content', 103);
      break;
    case 'caseResults':
      setNodeRect(nodesById, 'home-case-results-content', { height: input.height });
      shiftDirectChildrenY(input.nodes, 'home-case-results-content', 122);
      break;
    case 'faq':
      setNodeRect(nodesById, 'home-faq-container', { y: 110, height: 1206 });
      setNodeRect(nodesById, 'home-faq-list', { y: 149, height: 1074 });
      break;
    case 'offices':
      setNodeRect(nodesById, 'home-offices-container', { y: 149, height: 743 });
      setNodeRect(nodesById, 'home-offices-tabs', { y: 132 });
      [0, 1, 2].forEach((index) => {
        const layoutId = `home-offices-layout-${index}`;
        setNodeRect(nodesById, layoutId, { y: 198, height: 548 });
        setNodeRect(nodesById, `${layoutId}-map`, { height: 548 });
        setNodeRect(nodesById, `${layoutId}-card`, { height: 548 });
        setNodeRect(nodesById, `${layoutId}-card-map-link`, { y: 430 });
      });
      break;
    case 'stats':
    case 'contact':
      break;
  }
  return input.nodes;
}

function createCompositeHomeSections(locale: Locale): CompositeSpec[] {
  const heights = MEASURED_SECTION_HEIGHTS_BY_LOCALE[locale];
  return [
    { kind: 'composite', id: 'home-hero',          componentKey: 'hero-search',       height: heights.hero },
    { kind: 'composite', id: 'home-insights',      componentKey: 'insights-archive',  height: heights.insights },
    { kind: 'composite', id: 'home-services',      componentKey: 'services-bento',    height: heights.services },
    { kind: 'composite', id: 'home-attorney',      componentKey: 'home-attorney',     height: heights.attorney },
    { kind: 'composite', id: 'home-case-results',  componentKey: 'home-case-results', height: heights.caseResults },
    { kind: 'composite', id: 'home-stats',         componentKey: 'home-stats',        height: heights.stats },
    { kind: 'composite', id: 'home-faq',           componentKey: 'faq-accordion',     height: heights.faq },
    { kind: 'composite', id: 'home-offices',       componentKey: 'office-map-tabs',   height: heights.offices },
    { kind: 'composite', id: 'home-contact',       componentKey: 'home-contact-cta',  height: heights.contact },
  ];
}

function createCompositeNode(
  spec: CompositeSpec,
  y: number,
  zIndex: number,
  locale: Locale,
): BuilderCanvasNode {
  return {
    id: spec.id,
    kind: 'composite',
    rect: { x: 0, y, width: STAGE_WIDTH, height: spec.height },
    style: createDefaultCanvasNodeStyle({ borderRadius: 0 }),
    zIndex,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      componentKey: spec.componentKey,
      config: { locale },
    },
  };
}

function buildHomeDocument(locale: Locale, sections: HomeSectionSpec[]): BuilderCanvasDocument {
  const updatedAt = new Date().toISOString();
  const nodes: BuilderCanvasNode[] = [];
  let y = 0;
  let zBase = 0;

  sections.forEach((spec) => {
    const sectionHeight = spec.kind === 'decomposed' && locale === 'zh-hant'
      ? ZH_HANT_DECOMPOSED_SECTION_HEIGHTS[spec.key]
      : spec.height;
    if (spec.kind === 'composite') {
      nodes.push(createCompositeNode(spec, y, zBase, locale));
      zBase += 1;
    } else {
      const decomposed = applyLocalizedDecomposedGeometry({
        key: spec.key,
        locale,
        nodes: spec.builder(y, locale, zBase),
        height: sectionHeight,
      });
      nodes.push(...decomposed);
      zBase += decomposed.length;
    }
    y += sectionHeight;
  });
  if (sections.some((spec) => spec.kind === 'decomposed')) {
    responsivize(nodes);
  }

  return {
    version: 1,
    locale,
    updatedAt,
    updatedBy: SEED_VERSION,
    stageWidth: STAGE_WIDTH,
    stageHeight: y + 2,
    nodes,
  };
}

// Default home seed: live-reflecting COMPOSITE stack — mirrors the live
// tseng-law.com home exactly (section content is edited via the data admins).
export function createHomePageCanvasDocument(locale: Locale): BuilderCanvasDocument {
  return buildHomeDocument(locale, createCompositeHomeSections(locale));
}

// Editable decomposed home — the "decompose to edit" target and the subject of
// the admin migrations / locale repair / layout regression test.
export function createHomePageCanvasDocumentDecomposed(locale: Locale): BuilderCanvasDocument {
  return buildHomeDocument(locale, decomposedHomeSections);
}
