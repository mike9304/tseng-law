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
  builder: (y: number, locale: Locale, zBase: number) => BuilderCanvasNode[];
  height: number;
};

type HomeSectionSpec = CompositeSpec | DecomposedSpec;

// Editable, granular home layout — the "decompose to edit" target and the
// subject of the layout regression test. Section order matches the live home.
const decomposedHomeSections: HomeSectionSpec[] = [
  { kind: 'decomposed', builder: createHeroDecomposedNodes,      height: HERO_SECTION_ROOT_HEIGHT },
  { kind: 'decomposed', builder: createInsightsDecomposedNodes,  height: INSIGHTS_SECTION_ROOT_HEIGHT },
  { kind: 'decomposed', builder: createServicesDecomposedNodes,  height: SERVICES_SECTION_ROOT_HEIGHT },
  { kind: 'decomposed', builder: createAttorneyDecomposedNodes,  height: ATTORNEY_SECTION_ROOT_HEIGHT },
  { kind: 'decomposed', builder: createCaseResultsDecomposedNodes, height: CASE_RESULTS_ROOT_HEIGHT },
  { kind: 'decomposed', builder: createStatsDecomposedNodes,     height: STATS_SECTION_ROOT_HEIGHT },
  { kind: 'decomposed', builder: createFaqDecomposedNodes,       height: FAQ_SECTION_ROOT_HEIGHT },
  { kind: 'decomposed', builder: createOfficesDecomposedNodes,   height: OFFICES_SECTION_ROOT_HEIGHT },
  { kind: 'decomposed', builder: createContactDecomposedNodes,   height: CONTACT_SECTION_ROOT_HEIGHT },
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
    hero: 820,
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
    if (spec.kind === 'composite') {
      nodes.push(createCompositeNode(spec, y, zBase, locale));
      zBase += 1;
    } else {
      const decomposed = spec.builder(y, locale, zBase);
      nodes.push(...decomposed);
      zBase += decomposed.length;
    }
    y += spec.height;
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
