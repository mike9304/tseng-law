import type { BuilderCanvasDocument, BuilderCanvasNode, CompositeComponentKey } from './types';
import { createDefaultCanvasNodeStyle } from './types';
import type { Locale } from '@/lib/locales';
import {
  createCaseResultsDecomposedNodes,
  CASE_RESULTS_ROOT_HEIGHT,
} from './decompose-case-results';

export const SEED_VERSION = 'home-seed-v5';

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
  { kind: 'composite', id: 'home-hero',         componentKey: 'hero-search',       height: 820 },
  { kind: 'composite', id: 'home-insights',     componentKey: 'insights-archive',  height: 1200 },
  { kind: 'composite', id: 'home-services',     componentKey: 'services-bento',    height: 1400 },
  { kind: 'composite', id: 'home-attorney',     componentKey: 'home-attorney',     height: 720 },
  // home-case-results: decomposed pilot (S-03)
  { kind: 'decomposed', builder: createCaseResultsDecomposedNodes, height: CASE_RESULTS_ROOT_HEIGHT },
  { kind: 'composite', id: 'home-stats',        componentKey: 'home-stats',        height: 640 },
  { kind: 'composite', id: 'home-faq',          componentKey: 'faq-accordion',     height: 1280 },
  { kind: 'composite', id: 'home-offices',      componentKey: 'office-map-tabs',   height: 820 },
  { kind: 'composite', id: 'home-contact',      componentKey: 'home-contact-cta',  height: 640 },
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
