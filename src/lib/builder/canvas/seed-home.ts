import type { BuilderCanvasDocument } from './types';
import { createDefaultCanvasNodeStyle } from './types';
import type { Locale } from '@/lib/locales';

const STAGE_WIDTH = 1280;

const HERO_HEIGHT = 720;
const SERVICES_HEIGHT = 900;
const CONTACT_HEIGHT = 520;

const SECTION_GAP = 0;

export function createHomePageCanvasDocument(locale: Locale): BuilderCanvasDocument {
  const updatedAt = new Date().toISOString();
  let y = 0;

  const heroY = y;
  y += HERO_HEIGHT + SECTION_GAP;
  const servicesY = y;
  y += SERVICES_HEIGHT + SECTION_GAP;
  const contactY = y;
  y += CONTACT_HEIGHT;

  return {
    version: 1,
    locale,
    updatedAt,
    updatedBy: 'home-seed',
    stageWidth: STAGE_WIDTH,
    stageHeight: y + 40,
    nodes: [
      {
        id: 'home-hero',
        kind: 'composite',
        rect: { x: 0, y: heroY, width: STAGE_WIDTH, height: HERO_HEIGHT },
        style: createDefaultCanvasNodeStyle(),
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          componentKey: 'hero-search',
          config: { locale },
        },
      },
      {
        id: 'home-services',
        kind: 'composite',
        rect: { x: 0, y: servicesY, width: STAGE_WIDTH, height: SERVICES_HEIGHT },
        style: createDefaultCanvasNodeStyle(),
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          componentKey: 'services-bento',
          config: { locale },
        },
      },
      {
        id: 'home-contact',
        kind: 'composite',
        rect: { x: 0, y: contactY, width: STAGE_WIDTH, height: CONTACT_HEIGHT },
        style: createDefaultCanvasNodeStyle(),
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          componentKey: 'home-contact-cta',
          config: { locale },
        },
      },
    ],
  };
}
