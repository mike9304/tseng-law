import type { BuilderCanvasNode } from './types';
import { createDefaultCanvasNodeStyle } from './types';
import { locales, type Locale } from '@/lib/locales';
import { pageCopy } from '@/data/page-copy';
import {
  createAttorneyProfileSectionNodes,
  createContactBlocksSectionNodes,
  createFirmIntroductionSectionNodes,
  createPageHeaderSectionNodes,
} from './decompose-page-shared';

const ZH_HANT_DESKTOP_BOTTOM_RESERVE = 175;

function buildAboutPage(y: number, locale: Locale, zBase: number): { nodes: BuilderCanvasNode[]; height: number } {
  const page = pageCopy[locale].about;
  let cursor = y;
  const nodes: BuilderCanvasNode[] = [];

  const header = createPageHeaderSectionNodes({
    prefix: 'page-about',
    y: cursor,
    locale,
    label: page.label,
    title: page.title,
    description: page.description,
    zBase,
  });
  nodes.push(...header.nodes);
  cursor += header.height;

  const firmIntro = createFirmIntroductionSectionNodes('page-about', cursor, locale, zBase + 100);
  nodes.push(...firmIntro.nodes);
  cursor += firmIntro.height;

  const attorney = createAttorneyProfileSectionNodes('page-about', cursor, locale, zBase + 200);
  nodes.push(...attorney.nodes);
  cursor += attorney.height;

  const contact = createContactBlocksSectionNodes(
    'page-about',
    cursor,
    locale,
    zBase + 300,
    true,
    locale === 'zh-hant' ? 63 : 0,
  );
  nodes.push(...contact.nodes);
  cursor += contact.height;

  if (locale === 'zh-hant') {
    const headerRoot = nodes.find((node) => node.id === 'page-about-page-header-root');
    if (headerRoot) {
      headerRoot.zIndex = zBase + 380;
    }
    nodes.push(createZhHantAboutDesktopParityNode(zBase + 390, locale));
    nodes.push(createZhHantAboutMobileParityNode(y, zBase + 400, locale));
  }

  return { nodes, height: cursor - y };
}

function createZhHantAboutDesktopParityNode(
  zIndex: number,
  locale: Locale,
): BuilderCanvasNode {
  return {
    id: 'about-desktop-parity',
    kind: 'composite',
    parentId: 'page-about-page-header-root',
    rect: { x: 0, y: 0, width: 1280, height: 428 },
    style: createDefaultCanvasNodeStyle({ borderRadius: 0 }),
    zIndex,
    rotation: 0,
    locked: false,
    visible: true,
    anchorName: 'desktop-parity-about',
    responsive: {
      mobile: { hidden: true },
      tablet: { hidden: true },
    },
    content: {
      componentKey: 'legacy-page-about',
      config: { locale },
    },
  };
}

function createZhHantAboutMobileParityNode(
  y: number,
  zIndex: number,
  locale: Locale,
): BuilderCanvasNode {
  return {
    id: 'about-mobile-parity',
    kind: 'composite',
    rect: { x: 0, y, width: 1280, height: 1 },
    style: createDefaultCanvasNodeStyle({ borderRadius: 0 }),
    zIndex,
    rotation: 0,
    locked: false,
    visible: true,
    anchorName: 'mobile-parity-about',
    responsive: {
      mobile: { rect: { x: 0, y, width: 375, height: 8205 } },
      tablet: { rect: { x: 0, y, width: 768, height: 7498 } },
    },
    content: {
      componentKey: 'legacy-page-about',
      config: { locale },
    },
  };
}

// Per-locale page height. The document's `stageHeight` is only a FLOOR — the
// published renderer resolves final height as max(stageHeight, deepest node
// bottom) (see src/lib/builder/site/public-page.tsx). Each locale's decomposed
// tree already ends tight (last section bottom = content bottom + the standard
// 88px SECTION_BOTTOM), so seeding a page with ITS OWN locale height avoids
// padding shorter locales (ko/zh-hant) up to the tallest (English) locale.
// Mirrors getLawyersPageRootHeight — seed-pages.ts should pass this per locale
// (like the lawyers page) instead of the cross-locale max constant.
export function getAboutPageRootHeight(locale: Locale): number {
  const pageHeight = buildAboutPage(0, locale, 0).height;
  return locale === 'zh-hant' ? pageHeight + ZH_HANT_DESKTOP_BOTTOM_RESERVE : pageHeight;
}

export const ABOUT_PAGE_ROOT_HEIGHT = Math.max(...locales.map((locale) => getAboutPageRootHeight(locale)));

export function createAboutPageDecomposedNodes(y: number, locale: Locale, zBase: number): BuilderCanvasNode[] {
  return buildAboutPage(y, locale, zBase).nodes;
}
