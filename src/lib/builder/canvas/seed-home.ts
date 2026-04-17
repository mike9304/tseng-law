import type { BuilderCanvasDocument, BuilderCanvasNode, CompositeComponentKey } from './types';
import { createDefaultCanvasNodeStyle } from './types';
import type { Locale } from '@/lib/locales';

export const SEED_VERSION = 'home-seed-v4';

const STAGE_WIDTH = 1280;

type HomeCompositeSpec = {
  id: string;
  componentKey: CompositeComponentKey;
  height: number;
};

const homeSections: HomeCompositeSpec[] = [
  { id: 'home-hero',          componentKey: 'hero-search',       height: 820 },
  { id: 'home-insights',      componentKey: 'insights-archive',  height: 1200 },
  { id: 'home-services',      componentKey: 'services-bento',    height: 1400 },
  { id: 'home-attorney',      componentKey: 'home-attorney',     height: 720 },
  { id: 'home-case-results',  componentKey: 'home-case-results', height: 600 },
  { id: 'home-stats',         componentKey: 'home-stats',        height: 640 },
  { id: 'home-faq',           componentKey: 'faq-accordion',     height: 1280 },
  { id: 'home-offices',       componentKey: 'office-map-tabs',   height: 820 },
  { id: 'home-contact',       componentKey: 'home-contact-cta',  height: 640 },
];

function createCompositeNode(
  spec: HomeCompositeSpec,
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

  homeSections.forEach((spec, index) => {
    nodes.push(createCompositeNode(spec, y, index, locale));
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
