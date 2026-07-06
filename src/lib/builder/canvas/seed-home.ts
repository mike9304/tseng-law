import type { BuilderCanvasDocument, BuilderCanvasNode, BuilderImageCanvasNode, CompositeComponentKey } from './types';
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

const KO_MEASURED_SECTION_HEIGHTS = {
  hero: 788,
  insights: 1277,
  services: 1279,
  attorney: 926,
  caseResults: 800,
  stats: 621,
  faq: 1333,
  offices: 919,
  contact: 532,
} satisfies CompositeSectionHeights;

const MEASURED_SECTION_HEIGHTS_BY_LOCALE = {
  ko: KO_MEASURED_SECTION_HEIGHTS,
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

const KO_DECOMPOSED_SECTION_HEIGHTS = MEASURED_SECTION_HEIGHTS_BY_LOCALE.ko;
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

function setImageNodeContent(
  nodesById: ReadonlyMap<string, BuilderCanvasNode>,
  id: string,
  content: Partial<BuilderImageCanvasNode['content']>,
): void {
  const node = nodesById.get(id);
  if (node?.kind !== 'image') return;
  node.content = { ...node.content, ...content };
}

function replaceNode(
  nodes: BuilderCanvasNode[],
  nodesById: Map<string, BuilderCanvasNode>,
  id: string,
  createNextNode: (node: BuilderCanvasNode) => BuilderCanvasNode,
): void {
  const node = nodesById.get(id);
  if (!node) return;
  const nextNode = createNextNode(node);
  const index = nodes.findIndex((candidate) => candidate.id === id);
  if (index >= 0) nodes[index] = nextNode;
  nodesById.set(id, nextNode);
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

function setTextNodeText(
  nodesById: ReadonlyMap<string, BuilderCanvasNode>,
  id: string,
  text: string,
): void {
  const node = nodesById.get(id);
  if (node?.kind !== 'text') return;
  node.content = { ...node.content, text };
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

function getDecomposedSectionHeights(locale: Locale): CompositeSectionHeights | null {
  if (locale === 'ko') return KO_DECOMPOSED_SECTION_HEIGHTS;
  if (locale === 'zh-hant') return ZH_HANT_DECOMPOSED_SECTION_HEIGHTS;
  return null;
}

function applyLocalizedDecomposedGeometry(input: LocalizedGeometryInput): BuilderCanvasNode[] {
  if (input.locale !== 'ko' && input.locale !== 'zh-hant') return input.nodes;

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
      if (input.locale === 'ko') {
        setNodeRect(nodesById, 'home-hero-inner', { y: 161 });
        setNodeRect(nodesById, 'home-hero-search-wrapper', { x: 51, y: 713, width: 760 });
        setNodeRect(nodesById, 'home-hero-search-container', { width: 760 });
        setNodeRect(nodesById, 'home-hero-scroll-arrow', { y: 700 });
      } else {
        setNodeRect(nodesById, 'home-hero-inner', { y: 175 });
        setNodeRect(nodesById, 'home-hero-links', { y: 286 });
        setNodeRect(nodesById, 'home-hero-search-wrapper', { x: 51, y: 712, width: 1151 });
        setNodeRect(nodesById, 'home-hero-scroll-arrow', { y: input.height - 74 });
      }
      break;
    case 'insights':
      if (input.locale === 'ko') {
        setNodeRect(nodesById, 'home-insights-container', { x: 51, y: 89, width: 1178, height: input.height - 160 });
        setNodeRect(nodesById, 'home-insights-grid', { y: 268, width: 1178 });
      } else {
        setNodeRect(nodesById, 'home-insights-container', { height: input.height - 160 });
      }
      break;
    case 'services':
      if (input.locale === 'ko') {
        setNodeRect(nodesById, 'home-services-container', { x: 51, y: 151, width: 1178, height: input.height - 151 });
        setNodeRect(nodesById, 'home-services-list', { y: 173, width: 1178, height: 882 });
      } else {
        setNodeRect(nodesById, 'home-services-container', { height: input.height - 88 });
      }
      break;
    case 'attorney':
      if (input.locale === 'ko') {
        setNodeRect(nodesById, 'home-attorney-image-wrap', { y: 141, height: 644 });
        setNodeRect(nodesById, 'home-attorney-image', { height: 644 });
        setNodeRect(nodesById, 'home-attorney-badge', { x: 22, y: 546, width: 533, height: 77 });
        setNodeRect(nodesById, 'home-attorney-content', { y: 141, height: 644 });
        setNodeRect(nodesById, 'home-attorney-label', { y: 125 });
        setNodeRect(nodesById, 'home-attorney-title', { y: 164, height: 86 });
        setNodeRect(nodesById, 'home-attorney-divider', { y: 274 });
        setNodeRect(nodesById, 'home-attorney-intro-1', { y: 302 });
        setNodeRect(nodesById, 'home-attorney-intro-2', { y: 372 });
        setNodeRect(nodesById, 'home-attorney-summary', { y: 442 });
        setNodeRect(nodesById, 'home-attorney-contact-line', { y: 510 });
        setNodeRect(nodesById, 'home-attorney-cta', { y: 491 });
      } else {
        setNodeRect(nodesById, 'home-attorney-image-wrap', { y: 142, height: 644 });
        setNodeRect(nodesById, 'home-attorney-image', { y: 0, height: 644 });
        setImageNodeContent(nodesById, 'home-attorney-image', {
          src: '/_next/image?url=%2Fimages%2Fteam%2Ftseng-junwei%2Epng&w=640&q=75',
          gif: { provider: 'manual' },
          filters: {
            brightness: 93,
            contrast: 98,
            saturation: 93,
            blur: 0,
            grayscale: 0,
            sepia: 0,
          },
        });
        setNodeRect(nodesById, 'home-attorney-badge', { x: 0, y: 567, width: 533, height: 77 });
        setNodeRect(nodesById, 'home-attorney-badge-name', { x: 17, y: 17, width: 497, height: 19 });
        setNodeRect(nodesById, 'home-attorney-badge-role', { x: 17, y: 39, width: 497, height: 22 });
        setNodeRect(nodesById, 'home-attorney-content', { y: 141, height: 644 });
        setNodeRect(nodesById, 'home-attorney-label', { x: 77, y: 139, width: 550, height: 21 });
        setNodeRect(nodesById, 'home-attorney-title', { x: 77, y: 177, width: 550, height: 86 });
        replaceNode(input.nodes, nodesById, 'home-attorney-divider', (node): BuilderCanvasNode => ({
          ...node,
          kind: 'divider',
          rect: { ...node.rect, x: 77, y: 269, width: 40, height: 32 },
          style: createDefaultCanvasNodeStyle({ backgroundColor: 'transparent', borderRadius: 0 }),
          content: {
            orientation: 'horizontal',
            thickness: 2,
            color: '#16382d',
            style: 'solid',
          },
        }));
        setNodeRect(nodesById, 'home-attorney-intro-1', { x: 77, y: 306, width: 540, height: 27 });
        setNodeRect(nodesById, 'home-attorney-intro-2', { x: 77, y: 349, width: 540, height: 27 });
        setNodeRect(nodesById, 'home-attorney-summary', { x: 77, y: 392, width: 540, height: 27 });
        setNodeRect(nodesById, 'home-attorney-contact-line', { x: 77, y: 435, width: 540, height: 27 });
        setNodeRect(nodesById, 'home-attorney-cta', { x: 77, y: 478, width: 550, height: 29 });
      }
      break;
    case 'caseResults':
      if (input.locale === 'ko') {
        setNodeRect(nodesById, 'home-case-results-content', { y: 219, height: input.height - 219 });
        setNodeRect(nodesById, 'home-case-results-title', { y: 39, height: 130 });
        setNodeRect(nodesById, 'home-case-results-divider', { y: 180 });
        setNodeRect(nodesById, 'home-case-results-desc', { y: 200 });
        setNodeRect(nodesById, 'home-case-results-summary', { y: 290 });
        setNodeRect(nodesById, 'home-case-results-cta', { y: 333 });
      } else {
        setNodeRect(nodesById, 'home-case-results-content', { height: input.height });
        shiftDirectChildrenY(input.nodes, 'home-case-results-content', 122);
      }
      break;
    case 'faq':
      if (input.locale === 'ko') {
        setNodeRect(nodesById, 'home-faq-container', { x: 51, y: 150, width: 1178, height: input.height - 150 });
        setTextNodeText(nodesById, 'home-faq-label', '자주 묻는 질문');
        setNodeRect(nodesById, 'home-faq-label', { width: 151 });
        setNodeRect(nodesById, 'home-faq-title', { width: 1178, y: 39 });
        setNodeRect(nodesById, 'home-faq-list', { y: 132, width: 1178, height: 990 });
        input.nodes.forEach((node) => {
          const match = /^home-faq-item-(\d+)$/.exec(node.id);
          if (!match || node.parentId !== 'home-faq-list') return;
          const itemIndexText = match[1];
          if (!itemIndexText) return;
          const itemIndex = Number(itemIndexText);
          setNodeRect(nodesById, node.id, { y: itemIndex * 71, width: 1176, height: 58 });
          setNodeRect(nodesById, `${node.id}-question`, { width: 1176, height: 58 });
          setNodeRect(nodesById, `${node.id}-question-text`, { y: 17, width: 1070 });
          setNodeRect(nodesById, `${node.id}-arrow`, { y: 19, x: 1138 });
          setNodeRect(nodesById, `${node.id}-answer-wrap`, { y: 58 });
        });
      } else {
        setNodeRect(nodesById, 'home-faq-container', { y: 110, height: 1206 });
        setNodeRect(nodesById, 'home-faq-list', { y: 149, height: 1074 });
      }
      break;
    case 'offices':
      setNodeRect(
        nodesById,
        'home-offices-container',
        input.locale === 'ko'
          ? { x: 51, y: 149, width: 1178, height: 743 }
          : input.locale === 'zh-hant'
            ? { x: 51, y: 149, width: 1178, height: 628 }
          : { y: 149, height: 743 },
      );
      setNodeRect(nodesById, 'home-offices-tabs', input.locale === 'zh-hant' ? { y: 132, width: 1178, height: 47 } : { y: 132 });
      [0, 1, 2].forEach((index) => {
        const layoutId = `home-offices-layout-${index}`;
        if (input.locale === 'zh-hant') {
          setNodeRect(nodesById, layoutId, { y: 198, width: 1178, height: 422 });
          setNodeRect(nodesById, `${layoutId}-map`, { width: 687, height: 422 });
          setNodeRect(nodesById, `${layoutId}-map-embed`, { width: 687, height: 422 });
          setNodeRect(nodesById, `${layoutId}-map-fallback`, { width: 687, height: 422 });
          setNodeRect(nodesById, `${layoutId}-map-panel`, { x: 24, y: 247, height: 152 });
          setNodeRect(nodesById, `${layoutId}-card`, { x: 704, width: 474, height: 422 });
          setNodeRect(nodesById, `${layoutId}-card-label`, { x: 25, y: -47 });
          setNodeRect(nodesById, `${layoutId}-card-title`, { x: 25, y: 32, width: 424 });
          setNodeRect(nodesById, `${layoutId}-card-address`, { x: 25, y: 58, width: 424 });
          setNodeRect(nodesById, `${layoutId}-card-phone`, { x: 25, y: 98 });
          setNodeRect(nodesById, `${layoutId}-card-fax`, { x: 25, y: 137 });
          setNodeRect(nodesById, `${layoutId}-card-map-link`, { x: 25, y: 195, width: 250 });
          return;
        }
        setNodeRect(nodesById, layoutId, { y: 198, height: 548 });
        setNodeRect(nodesById, `${layoutId}-map`, { height: 548 });
        setNodeRect(nodesById, `${layoutId}-map-fallback`, { height: 548 });
        setNodeRect(nodesById, `${layoutId}-map-panel`, { y: 366 });
        setNodeRect(nodesById, `${layoutId}-card`, { height: 548 });
        setNodeRect(nodesById, `${layoutId}-card-map-link`, { y: 430 });
      });
      break;
    case 'stats':
      if (input.locale === 'ko') {
        setNodeRect(nodesById, 'home-stats-container', { x: 51, y: 151, width: 1178, height: input.height - 151 });
      }
      break;
    case 'contact':
      if (input.locale === 'ko') {
        setNodeRect(nodesById, 'home-contact-container', { x: 51, y: 151, width: 1178, height: input.height - 151 });
        setNodeRect(nodesById, 'home-contact-title', { y: 39 });
        setNodeRect(nodesById, 'home-contact-description', { y: 111 });
        setNodeRect(nodesById, 'home-contact-actions', { y: 193 });
      }
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
    let sectionHeight = spec.height;
    if (spec.kind === 'decomposed') {
      const localizedHeights = getDecomposedSectionHeights(locale);
      sectionHeight = localizedHeights ? localizedHeights[spec.key] : spec.height;
    }
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
