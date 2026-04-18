import type { BuilderCanvasDocument, BuilderCanvasNode, CompositeComponentKey } from './types';
import { createDefaultCanvasNodeStyle } from './types';
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

export const SEED_VERSION = 'home-seed-v6';

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

const homeSections: HomeSectionSpec[] = [
  { kind: 'decomposed', builder: createHeroDecomposedNodes,      height: HERO_SECTION_ROOT_HEIGHT },
  { kind: 'decomposed', builder: createInsightsDecomposedNodes,  height: INSIGHTS_SECTION_ROOT_HEIGHT },
  { kind: 'decomposed', builder: createServicesDecomposedNodes,  height: SERVICES_SECTION_ROOT_HEIGHT },
  { kind: 'decomposed', builder: createAttorneyDecomposedNodes,  height: ATTORNEY_SECTION_ROOT_HEIGHT },
  // home-case-results: decomposed pilot (S-03)
  { kind: 'decomposed', builder: createCaseResultsDecomposedNodes, height: CASE_RESULTS_ROOT_HEIGHT },
  { kind: 'decomposed', builder: createStatsDecomposedNodes,     height: STATS_SECTION_ROOT_HEIGHT },
  { kind: 'decomposed', builder: createFaqDecomposedNodes,       height: FAQ_SECTION_ROOT_HEIGHT },
  { kind: 'decomposed', builder: createOfficesDecomposedNodes,   height: OFFICES_SECTION_ROOT_HEIGHT },
  { kind: 'decomposed', builder: createContactDecomposedNodes,   height: CONTACT_SECTION_ROOT_HEIGHT },
];

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

export function createHomePageCanvasDocument(locale: Locale): BuilderCanvasDocument {
  const updatedAt = new Date().toISOString();
  const nodes: BuilderCanvasNode[] = [];
  let y = 0;
  let zBase = 0;

  homeSections.forEach((spec) => {
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

  return {
    version: 1,
    locale,
    updatedAt,
    updatedBy: SEED_VERSION,
    stageWidth: STAGE_WIDTH,
    stageHeight: y + 40,
    nodes,
  };
}
