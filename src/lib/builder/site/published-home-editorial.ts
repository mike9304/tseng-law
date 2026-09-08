import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  HOME_COMPOSITE_SECTION_IDS,
  PUBLISHED_HOME_COMPOSITE_HEIGHTS_BY_LOCALE,
  PUBLISHED_HOME_COMPOSITE_STAGE_HEIGHT_BY_LOCALE,
  type HomeCompositeSectionId,
} from '@/lib/builder/canvas/home-composite-parity';
import { getConsultationCtaLabel, getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import { siteContent } from '@/data/site-content';

const STAGE_WIDTH = 1280;
type Current9Locale = 'ko' | 'en' | 'zh-hant';

const CURRENT9_COMPONENT_KEYS: Record<HomeCompositeSectionId, string> = {
  'home-hero': 'hero-search',
  'home-insights': 'insights-archive',
  'home-services': 'services-bento',
  'home-attorney': 'home-attorney',
  'home-case-results': 'home-case-results',
  'home-stats': 'home-stats',
  'home-faq': 'faq-accordion',
  'home-offices': 'office-map-tabs',
  'home-contact': 'home-contact-cta',
};

export const CURRENT9_COMPOSITE_RENDER_ORDER = [
  'home-hero',
  'home-services',
  'home-attorney',
  'home-case-results',
  'home-stats',
  'home-insights',
  'home-faq',
  'home-offices',
  'home-contact',
] as const;

const KNOWN_UNDEFINED_NODE_KEYS = new Set([
  'parentId',
  'sticky',
  'hoverStyle',
  'animation',
  'responsive',
  'dataBinding',
  'appWidget',
  'anchorName',
]);

const EXPECTED_DOCUMENT_KEYS = new Set([
  'version',
  'locale',
  'updatedAt',
  'updatedBy',
  'stageWidth',
  'stageHeight',
  'nodes',
]);

const EXPECTED_NODE_KEYS = new Set([
  'id',
  'kind',
  'rect',
  'style',
  'zIndex',
  'rotation',
  'locked',
  'visible',
  'content',
]);

const JULY_HERO_TEXT_NODES = [
  ['home-hero-label', 'section-label'],
  ['home-hero-title', 'headline'],
  ['home-hero-subtitle', 'subtitle'],
] as const;

const JULY_COLUMNS_NODE_ID = 'home-hero-columns-link';
const JULY_EMAIL_NODE_ID = 'home-hero-email-consultation-link';
const JULY_MENU_NODE_IDS = [
  'home-hero-quick-menu-item-0',
  'home-hero-quick-menu-item-1',
  'home-hero-quick-menu-item-2',
  'home-hero-quick-menu-item-3',
  'home-hero-quick-menu-item-4',
  'home-hero-quick-menu-item-5',
] as const;

const JULY_SEARCH_INPUT_ID = 'home-hero-search-input';
const JULY_SEARCH_FORM_ID = 'home-hero-search-bar';
const JULY_SEARCH_SUBMIT_IDS = new Set([
  'home-hero-search-btn',
  'home-hero-search-button',
  'home-hero-search-submit',
]);

export const JULY_NATURAL_FLOW_SECTION_IDS = [
  'home-attorney-root',
  'home-stats-root',
  'home-insights-root',
  'home-faq-root',
  'home-offices-root',
  'home-contact-root',
] as const;

export const JULY_SHARED_RESULTS_PRIMITIVE_ID = 'home-case-results-root';

export const JULY_PRIMARY_FLOW_SECTION_IDS = [
  'home-attorney-root',
  'home-insights-root',
  'home-faq-root',
  'home-contact-root',
] as const;

export const JULY_SECONDARY_FLOW_SECTION_IDS = [
  'home-stats-root',
  'home-offices-root',
] as const;

export const JULY_ADMITTED_GEOMETRY_SKIP_SELECTOR = '.builder-pub-main[data-home-editorial="july"]';

export function shouldSkipJulyPublishedGeometry(
  target: { closest(selector: string): unknown } | null | undefined,
): boolean {
  return Boolean(target?.closest(JULY_ADMITTED_GEOMETRY_SKIP_SELECTOR));
}

export function applyJulySafeExpandedGeometry(
  style: {
    setProperty(name: string, value: string, priority?: string): void;
    removeProperty(name: string): string | void;
  },
  isOpen: boolean,
): void {
  if (!isOpen) {
    style.removeProperty('height');
    style.removeProperty('min-height');
    style.removeProperty('overflow');
    return;
  }
  style.setProperty('height', 'auto', 'important');
  style.removeProperty('min-height');
  style.setProperty('overflow', 'visible');
}

const JULY_NATURAL_FLOW_ROOT_SELECTORS = JULY_NATURAL_FLOW_SECTION_IDS
  .map((id) => `.builder-pub-main[data-home-editorial='july'] > .builder-pub-node[data-node-id='${id}']`)
  .join(',\n  ');

const JULY_PRIMARY_FLOW_ROOT_SELECTORS = JULY_PRIMARY_FLOW_SECTION_IDS
  .map((id) => `.builder-pub-main[data-home-editorial='july'] > .builder-pub-node[data-node-id='${id}']`)
  .join(',\n  ');

const JULY_SECONDARY_FLOW_ROOT_SELECTORS = JULY_SECONDARY_FLOW_SECTION_IDS
  .map((id) => `.builder-pub-main[data-home-editorial='july'] > .builder-pub-node[data-node-id='${id}']`)
  .join(',\n  ');

const JULY_NATURAL_FLOW_DESCENDANT_SELECTORS = JULY_NATURAL_FLOW_SECTION_IDS
  .map((id) => `.builder-pub-main[data-home-editorial='july'] > .builder-pub-node[data-node-id='${id}'] .builder-pub-node:not([data-node-id='home-attorney-badge']):not([data-node-id='home-attorney-image'])`)
  .join(',\n  ');

const JULY_NODE = (id: string) => `.builder-pub-main[data-home-editorial='july'] .builder-pub-node[data-node-id='${id}']`;

const JULY_OFFICE_LAYOUT_IDS = [
  'home-offices-layout-0',
  'home-offices-layout-1',
  'home-offices-layout-2',
  'home-offices-layout-3',
] as const;

const JULY_FAQ_ITEM_IDS = [
  'home-faq-item-0',
  'home-faq-item-1',
  'home-faq-item-2',
  'home-faq-item-3',
  'home-faq-item-4',
  'home-faq-item-5',
  'home-faq-item-6',
  'home-faq-item-7',
  'home-faq-item-8',
  'home-faq-item-9',
  'home-faq-item-10',
  'home-faq-item-11',
  'home-faq-item-12',
] as const;

const JULY_SECTION_TITLE_IDS = [
  'home-attorney-title',
  'home-stats-title',
  'home-insights-title',
  'home-faq-title',
  'home-offices-title',
  'home-contact-title',
] as const;

const JULY_SECTION_LABEL_IDS = [
  'home-attorney-label',
  'home-stats-label',
  'home-insights-label',
  'home-faq-label',
  'home-offices-label',
  'home-contact-label',
] as const;

const JULY_STATS_PROGRESS_IDS = [
  'home-stats-progress-0',
  'home-stats-progress-1',
  'home-stats-progress-2',
  'home-stats-progress-3',
] as const;

const PUBLISHED_HOME_HERO_POSTER =
  '/images/editorial/taichung-courthouse-civic-daylight-v2.webp';

const LEGACY_HOME_HERO_POSTERS = new Set([
  '/images/hero-bg-01.webp',
  '/images/hero-taipei-101-blue-hour.webp',
  '/images/hero-taiwan-modern-city-opening.webp',
  PUBLISHED_HOME_HERO_POSTER,
]);

export const CURRENT9_PUBLISHED_HOME_EDITORIAL_CSS = `
.builder-pub-main[data-home-editorial='current9'] {
  min-height: 0 !important;
  height: auto !important;
}
.builder-pub-main[data-home-editorial='current9'] > .builder-pub-node {
  min-height: 0 !important;
  height: auto !important;
}
.builder-pub-main[data-home-editorial='current9'] > .builder-pub-node[data-node-id='home-hero'],
.builder-pub-main[data-home-editorial='current9'] > .builder-pub-node[data-node-id='home-insights'] {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  padding-top: 0 !important;
}
@media (min-width: 1024px) {
  .builder-pub-main[data-home-editorial='current9'] > .builder-pub-node {
    min-height: 0 !important;
  }
}
.builder-pub-main[data-home-editorial='current9'] .home-contact-cta [data-cta='home-ai-intake-entry'] {
  min-height: 48px !important;
  padding-inline: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  color: var(--dark-text, #fff) !important;
  text-decoration: underline !important;
  text-underline-offset: 4px !important;
  box-shadow: none !important;
}
.builder-pub-main[data-home-editorial='current9'] #about.split-section .split-image--portrait::before,
.builder-pub-main[data-home-editorial='current9'] #about.split-section .split-image--portrait::after {
  content: none !important;
  display: none !important;
}
@media (max-width: 640px) {
  .builder-pub-main[data-home-editorial='current9'] #insights .insights-list-thumb {
    aspect-ratio: 16 / 9;
    max-height: 180px;
  }
}
`;

export const JULY_PUBLISHED_HOME_EDITORIAL_CSS = `
@media (min-width: 769px) {
  .builder-pub-main[data-home-editorial='july'] > .builder-pub-node[data-node-id='home-hero-root'] {
    display: none !important;
    height: 0 !important;
    min-height: 0 !important;
    margin: 0 !important;
  }
  .builder-pub-main[data-home-editorial='july'] > .builder-pub-node[data-anchor='mobile-parity-home-hero'] {
    display: block !important;
  }
  .builder-pub-main[data-home-editorial='july'] {
    min-height: 0 !important;
    height: auto !important;
  }
  ${JULY_NATURAL_FLOW_ROOT_SELECTORS} {
    height: auto !important;
    min-height: 0 !important;
    overflow: visible !important;
  }
  ${JULY_PRIMARY_FLOW_ROOT_SELECTORS} {
    padding-top: 96px !important;
  }
  ${JULY_SECONDARY_FLOW_ROOT_SELECTORS} {
    padding-top: 72px !important;
  }
  ${JULY_NATURAL_FLOW_DESCENDANT_SELECTORS} {
    position: relative !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    bottom: auto !important;
    height: auto !important;
    min-height: 0 !important;
  }
  ${JULY_NATURAL_FLOW_ROOT_SELECTORS} {
    max-width: 1200px !important;
    margin-left: auto !important;
    margin-right: auto !important;
    padding-left: 20px !important;
    padding-right: 20px !important;
    box-sizing: border-box !important;
  }
  @media (min-width: 1024px) and (max-width: 1199px) {
    ${JULY_NATURAL_FLOW_ROOT_SELECTORS} {
      padding-left: 40px !important;
      padding-right: 40px !important;
    }
  }
  ${JULY_NODE('home-contact-root')} {
    max-width: none !important;
    width: 100% !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    padding-inline: max(20px, calc((100% - 1200px) / 2 + 20px)) !important;
  }
  @media (min-width: 1024px) and (max-width: 1199px) {
    ${JULY_NODE('home-contact-root')} {
      padding-inline: max(40px, calc((100% - 1200px) / 2 + 40px)) !important;
    }
  }
  ${JULY_NODE('home-attorney-root')} {
    display: block !important;
  }
  ${JULY_NODE('home-attorney-root')} .split-section {
    display: grid !important;
    grid-template-columns: minmax(320px, 400px) minmax(0, 760px) !important;
    column-gap: 48px !important;
    align-items: start !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    min-height: 0 !important;
    height: auto !important;
    padding: 0 !important;
    margin: 0 !important;
    box-sizing: border-box !important;
  }
  ${JULY_NODE('home-attorney-root')} .split-content {
    padding: 0 !important;
    margin: 0 !important;
    justify-content: flex-start !important;
  }
  ${JULY_NODE('home-attorney-image-wrap')} {
    grid-column: 1 !important;
    min-width: 320px !important;
    max-width: 400px !important;
    width: 100% !important;
    height: auto !important;
    aspect-ratio: 4 / 5 !important;
    position: relative !important;
    padding: 0 !important;
    margin-top: 0 !important;
    align-self: start !important;
    overflow: hidden !important;
  }
  ${JULY_NODE('home-attorney-image')} {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  ${JULY_NODE('home-attorney-image')} img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    object-position: top center !important;
    display: block !important;
  }
  ${JULY_NODE('home-attorney-content')} {
    grid-column: 2 !important;
    width: 100% !important;
    max-width: 100% !important;
    margin-top: 0 !important;
    padding-top: 0 !important;
    align-self: start !important;
  }
  ${JULY_NODE('home-attorney-label')} {
    margin: 0 !important;
    padding-top: 0 !important;
    height: auto !important;
  }
  ${JULY_NODE('home-attorney-badge')} {
    position: absolute !important;
    top: auto !important;
    right: auto !important;
    bottom: 16px !important;
    left: 16px !important;
    height: auto !important;
  }
  ${JULY_NODE('home-attorney-intro-1')},
  ${JULY_NODE('home-attorney-intro-2')},
  ${JULY_NODE('home-attorney-summary')} {
    margin-top: 16px !important;
  }
  ${JULY_NODE('home-stats-container')},
  ${JULY_NODE('home-stats-grid')},
  ${JULY_NODE('home-stats-title')},
  ${JULY_NODE('home-offices-container')},
  ${JULY_NODE('home-insights-container')},
  ${JULY_NODE('home-insights-grid')},
  ${JULY_NODE('home-faq-container')},
  ${JULY_NODE('home-faq-list')},
  ${JULY_FAQ_ITEM_IDS.map((id) => JULY_NODE(id)).join(',\n  ')},
  ${JULY_FAQ_ITEM_IDS.map((id) => JULY_NODE(`${id}-question`)).join(',\n  ')},
  ${JULY_FAQ_ITEM_IDS.map((id) => JULY_NODE(`${id}-answer`)).join(',\n  ')},
  ${JULY_OFFICE_LAYOUT_IDS.map((id) => JULY_NODE(id)).join(',\n  ')},
  .builder-pub-main[data-home-editorial='july'] .stats-grid,
  .builder-pub-main[data-home-editorial='july'] .office-layout,
  .builder-pub-main[data-home-editorial='july'] .insights-grid {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
  }
  ${JULY_NODE('home-insights-container')} {
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
  }
  ${JULY_NODE('home-insights-grid')} {
    display: block !important;
    width: 100% !important;
    min-width: 0 !important;
  }
  ${JULY_NODE('home-insights-grid')} .insights-grid {
    display: grid !important;
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr) !important;
    column-gap: 24px !important;
    align-items: start !important;
    width: 100% !important;
    min-width: 0 !important;
  }
  ${JULY_NODE('home-insights-featured')},
  ${JULY_NODE('home-insights-list-wrap')} {
    width: 100% !important;
    max-width: none !important;
    min-width: 0 !important;
    justify-self: stretch !important;
  }
  ${JULY_NODE('home-insights-featured')} .builder-pub-node,
  ${JULY_NODE('home-insights-list-wrap')} .builder-pub-node {
    max-width: 100% !important;
  }
  ${JULY_NODE('home-insights-featured')} {
    grid-column: 1 !important;
    overflow: visible !important;
  }
  ${JULY_NODE('home-insights-list-wrap')} {
    grid-column: 2 !important;
  }
  ${JULY_NODE('home-stats-grid')} {
    display: block !important;
    width: 100% !important;
    min-width: 0 !important;
  }
  ${JULY_NODE('home-stats-grid')} .stats-grid {
    display: grid !important;
    grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
    gap: 20px !important;
    width: 100% !important;
    min-width: 0 !important;
  }
  @media (min-width: 1024px) and (max-width: 1199px) {
    ${JULY_NODE('home-stats-grid')} .stats-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
  }
  ${JULY_NODE('home-stats-card-0')},
  ${JULY_NODE('home-stats-card-1')},
  ${JULY_NODE('home-stats-card-2')},
  ${JULY_NODE('home-stats-card-3')} {
    width: 100% !important;
    min-width: 0 !important;
    max-width: none !important;
    justify-self: stretch !important;
  }
  ${JULY_NODE('home-stats-description')} {
    max-width: 100% !important;
  }
  ${JULY_NODE('home-insights-view-all')} {
    grid-column: 1 / -1 !important;
    justify-self: start !important;
    margin-top: 24px !important;
    width: auto !important;
  }
  ${JULY_NODE('home-faq-list')} {
    margin-top: 24px !important;
  }
  ${JULY_NODE('home-offices-tabs')} {
    display: flex !important;
    flex-wrap: wrap !important;
    width: 100% !important;
  }
  ${JULY_NODE('home-offices-tab-0')} { order: 1 !important; }
  ${JULY_NODE('home-offices-tab-1')} { order: 2 !important; }
  ${JULY_NODE('home-offices-tab-2')} { order: 3 !important; }
  ${JULY_NODE('home-offices-tab-3')} { order: 4 !important; }
  ${JULY_OFFICE_LAYOUT_IDS.map((id) => JULY_NODE(id)).join(',\n  ')} {
    display: block !important;
    width: 100% !important;
    min-width: 0 !important;
  }
  .builder-pub-main[data-home-editorial='july'] .office-layout {
    display: grid !important;
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr) !important;
    column-gap: 24px !important;
    align-items: start !important;
    width: 100% !important;
    min-width: 0 !important;
  }
  ${JULY_OFFICE_LAYOUT_IDS.map((id) => `${JULY_NODE(id)}[style*="display:none"]`).join(',\n  ')},
  ${JULY_OFFICE_LAYOUT_IDS.map((id) => `${JULY_NODE(id)}[style*="display: none"]`).join(',\n  ')} {
    display: none !important;
  }
  ${JULY_OFFICE_LAYOUT_IDS.map((id) => JULY_NODE(`${id}-map`)).join(',\n  ')} {
    grid-column: 1 !important;
    width: 100% !important;
    min-width: 0 !important;
    max-width: none !important;
    justify-self: stretch !important;
  }
  ${JULY_OFFICE_LAYOUT_IDS.map((id) => JULY_NODE(`${id}-card`)).join(',\n  ')} {
    grid-column: 2 !important;
    width: 100% !important;
    min-width: 0 !important;
    max-width: none !important;
    justify-self: stretch !important;
    align-self: start !important;
  }
  ${JULY_OFFICE_LAYOUT_IDS.map((id) => `${JULY_NODE(`${id}-map`)}:has(.builder-pub-node[data-node-id='${id}-map-embed']) .builder-pub-node[data-node-id='${id}-map-fallback']`).join(',\n  ')} {
    display: none !important;
  }
  ${JULY_NODE('home-contact-root')} {
    display: grid !important;
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr) !important;
    column-gap: 24px !important;
    align-items: center !important;
    background-color: #0c1c14 !important;
    background-image:
      radial-gradient(circle at top left, rgba(137, 167, 125, 0.18), transparent 28%),
      linear-gradient(120deg, rgba(12, 28, 20, 0.95) 0%, rgba(18, 41, 29, 0.9) 55%, rgba(12, 28, 20, 0.94) 100%),
      url('/images/feature-3.svg') !important;
    background-position:
      top left,
      center,
      right calc(max(20px, (100vw - min(100vw, 1200px)) / 2 + 20px)) center !important;
    background-size: auto, auto, min(41.666%, calc(min(100%, 1200px) * 5 / 12)) auto !important;
    background-repeat: no-repeat !important;
  }
  ${JULY_NODE('home-contact-container')},
  ${JULY_NODE('home-contact-copy')},
  ${JULY_NODE('home-contact-root')} .home-contact-cta {
    background: none !important;
    background-image: none !important;
    border: 0 !important;
    box-shadow: none !important;
  }
  ${JULY_NODE('home-contact-container')} {
    grid-column: 1 !important;
    width: 100% !important;
    max-width: 100% !important;
  }
  ${JULY_NODE('home-contact-ai-guide-copy')} {
    margin-top: 16px !important;
  }
  ${JULY_SECTION_TITLE_IDS.map((id) => JULY_NODE(id)).join(',\n  ')} {
    font-family: var(--font-heading-zh) !important;
    font-weight: 600 !important;
    font-size: 34px !important;
    line-height: 42px !important;
    letter-spacing: 0 !important;
  }
  @media (min-width: 1024px) and (max-width: 1199px) {
    ${JULY_SECTION_TITLE_IDS.map((id) => JULY_NODE(id)).join(',\n    ')} {
      font-size: 30px !important;
      line-height: 38px !important;
    }
  }
  ${JULY_NODE('home-contact-title')} {
    color: #ffffff !important;
  }
  ${JULY_SECTION_LABEL_IDS.map((id) => JULY_NODE(id)).join(',\n  ')} {
    color: var(--gold-dim) !important;
    font-size: 12px !important;
    line-height: 16px !important;
    letter-spacing: 0.12em !important;
    text-transform: uppercase !important;
    font-weight: 500 !important;
  }
  ${JULY_SECTION_LABEL_IDS.map((id) => `${JULY_NODE(id)}::before`).join(',\n  ')} {
    background: var(--gold) !important;
    height: 1px !important;
    opacity: 1 !important;
  }
  ${JULY_NODE('home-contact-label')} {
    color: var(--gold) !important;
  }
  .builder-pub-main[data-home-editorial='july'] [data-node-id^='home-faq-item-'][data-node-id$='-arrow'] {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .builder-pub-main[data-home-editorial='july'] [data-node-id^='home-faq-item-'] .faq-question[aria-expanded='true'] .faq-arrow,
  .builder-pub-main[data-home-editorial='july'] [data-node-id^='home-faq-item-'] .faq-question[aria-expanded='true'] [data-node-id$='-arrow'] {
    transform: rotate(90deg) !important;
    transform-origin: center center !important;
    transition: transform 0.2s ease !important;
  }
  @media (prefers-reduced-motion: reduce) {
    .builder-pub-main[data-home-editorial='july'] [data-node-id^='home-faq-item-'] .faq-question[aria-expanded='true'] .faq-arrow,
    .builder-pub-main[data-home-editorial='july'] [data-node-id^='home-faq-item-'] .faq-question[aria-expanded='true'] [data-node-id$='-arrow'] {
      transition: none !important;
    }
  }
  ${JULY_STATS_PROGRESS_IDS.map((id) => JULY_NODE(id)).join(',\n  ')} {
    margin-top: 8px !important;
    background: var(--gold) !important;
    border-color: var(--gold) !important;
  }
}
/* Grok-authored media frame repair; locally scoped to admitted insights. */
@media (min-width: 1024px) {
  .builder-pub-main[data-home-editorial='july'] > .builder-pub-node[data-node-id='home-insights-root'] .insights-featured-media > .builder-pub-node[data-node-id]:has(> .builder-image-media-frame),
  .builder-pub-main[data-home-editorial='july'] > .builder-pub-node[data-node-id='home-insights-root'] .insights-list-thumb > .builder-pub-node[data-node-id]:has(> .builder-image-media-frame) {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
  }

  .builder-pub-main[data-home-editorial='july'] > .builder-pub-node[data-node-id='home-insights-root'] .insights-featured-media > .builder-pub-node[data-node-id]:has(> .builder-image-media-frame) > .builder-image-media-frame,
  .builder-pub-main[data-home-editorial='july'] > .builder-pub-node[data-node-id='home-insights-root'] .insights-list-thumb > .builder-pub-node[data-node-id]:has(> .builder-image-media-frame) > .builder-image-media-frame {
    width: 100% !important;
    height: 100% !important;
  }

  .builder-pub-main[data-home-editorial='july'] > .builder-pub-node[data-node-id='home-insights-root'] .insights-featured-media > .builder-pub-node[data-node-id]:has(> .builder-image-media-frame) > .builder-image-media-frame > img,
  .builder-pub-main[data-home-editorial='july'] > .builder-pub-node[data-node-id='home-insights-root'] .insights-list-thumb > .builder-pub-node[data-node-id]:has(> .builder-image-media-frame) > .builder-image-media-frame > img {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
  }
}

`;

export type JulyHeroEditorialPresentation = {
  overrides: Record<string, string>;
  quickMenus: Array<{ label: string; href: string }>;
};

function isCurrent9Locale(value: string): value is Current9Locale {
  return value === 'ko' || value === 'en' || value === 'zh-hant';
}

function isPlainRecord(value: object): boolean {
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function ownDataDescriptor(value: object, key: string | symbol): PropertyDescriptor | null {
  const desc = Reflect.getOwnPropertyDescriptor(value, key);
  if (
    desc === undefined
    || desc.get !== undefined
    || desc.set !== undefined
    || !('value' in desc)
  ) {
    return null;
  }
  return desc;
}

function assertEnvelope(value: unknown): void {
  if (value === null) return;
  switch (typeof value) {
    case 'string':
    case 'boolean':
      return;
    case 'number':
      if (!Number.isFinite(value)) throw new Error('non-json');
      return;
    case 'undefined':
      return;
    case 'object':
      break;
    default:
      throw new Error('non-json');
  }
  if (Array.isArray(value)) {
    const lengthDesc = ownDataDescriptor(value, 'length');
    if (
      !lengthDesc
      || typeof lengthDesc.value !== 'number'
      || !Number.isInteger(lengthDesc.value)
      || lengthDesc.value < 0
    ) {
      throw new Error('non-json');
    }
    const length = lengthDesc.value as number;
    const expected = new Set<string>(['length']);
    for (let index = 0; index < length; index += 1) expected.add(String(index));
    const ownKeys = Reflect.ownKeys(value);
    if (ownKeys.length !== expected.size) throw new Error('non-json');
    for (const key of ownKeys) {
      if (typeof key !== 'string' || !expected.has(key)) throw new Error('non-json');
    }
    for (let index = 0; index < length; index += 1) {
      const desc = ownDataDescriptor(value, String(index));
      if (!desc || desc.enumerable !== true) throw new Error('non-json');
      assertEnvelope(desc.value);
    }
    return;
  }
  if (!isPlainRecord(value)) throw new Error('non-json');
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== 'string') throw new Error('non-json');
    const desc = ownDataDescriptor(value, key);
    if (!desc || desc.enumerable !== true) throw new Error('non-json');
    assertEnvelope(desc.value);
  }
}

export function isSafeNormalizedDocumentEnvelope(value: unknown): boolean {
  try {
    assertEnvelope(value);
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  } catch {
    return false;
  }
}

function ownValue(record: object, key: string): unknown {
  const desc = ownDataDescriptor(record, key);
  return desc ? desc.value : undefined;
}

function sameJson(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function expectedStyle() {
  return createDefaultCanvasNodeStyle({ borderRadius: 0 });
}

function expectedYPositions(locale: Current9Locale): number[] {
  const heights = PUBLISHED_HOME_COMPOSITE_HEIGHTS_BY_LOCALE[locale];
  const keys = HOME_COMPOSITE_SECTION_IDS.map((id) => (
    id === 'home-hero' ? heights.hero
      : id === 'home-insights' ? heights.insights
        : id === 'home-services' ? heights.services
          : id === 'home-attorney' ? heights.attorney
            : id === 'home-case-results' ? heights.caseResults
              : id === 'home-stats' ? heights.stats
                : id === 'home-faq' ? heights.faq
                  : id === 'home-offices' ? heights.offices
                    : heights.contact
  ));
  const positions: number[] = [];
  let y = 0;
  for (const height of keys) {
    positions.push(y);
    y += height;
  }
  return positions;
}

function nodeMatchesCurrent9(
  node: object,
  locale: Current9Locale,
  index: number,
): boolean {
  const id = ownValue(node, 'id');
  const expectedId = HOME_COMPOSITE_SECTION_IDS[index];
  if (id !== expectedId) return false;
  if (ownValue(node, 'kind') !== 'composite') return false;
  if (ownValue(node, 'rotation') !== 0) return false;
  if (ownValue(node, 'locked') !== false) return false;
  if (ownValue(node, 'visible') !== true) return false;
  if (ownValue(node, 'zIndex') !== index) return false;
  const heights = PUBLISHED_HOME_COMPOSITE_HEIGHTS_BY_LOCALE[locale];
  const height =
    expectedId === 'home-hero' ? heights.hero
      : expectedId === 'home-insights' ? heights.insights
        : expectedId === 'home-services' ? heights.services
          : expectedId === 'home-attorney' ? heights.attorney
            : expectedId === 'home-case-results' ? heights.caseResults
              : expectedId === 'home-stats' ? heights.stats
                : expectedId === 'home-faq' ? heights.faq
                  : expectedId === 'home-offices' ? heights.offices
                    : heights.contact;
  const rect = ownValue(node, 'rect');
  if (!rect || typeof rect !== 'object' || Array.isArray(rect)) return false;
  if (!sameJson(rect, {
    x: 0,
    y: expectedYPositions(locale)[index],
    width: STAGE_WIDTH,
    height,
  })) return false;
  const style = ownValue(node, 'style');
  if (!sameJson(style, expectedStyle())) return false;
  const content = ownValue(node, 'content');
  if (!content || typeof content !== 'object' || Array.isArray(content)) return false;
  if (ownValue(content, 'componentKey') !== CURRENT9_COMPONENT_KEYS[expectedId]) return false;
  const config = ownValue(content, 'config');
  if (!config || typeof config !== 'object' || Array.isArray(config)) return false;
  const configKeys = Reflect.ownKeys(config);
  if (configKeys.length !== 1 || configKeys[0] !== 'locale') return false;
  if (ownValue(config, 'locale') !== locale) return false;
  const contentKeys = Reflect.ownKeys(content);
  if (contentKeys.some((key) => key !== 'componentKey' && key !== 'config')) return false;
  for (const key of Reflect.ownKeys(node)) {
    if (typeof key !== 'string') return false;
    if (EXPECTED_NODE_KEYS.has(key)) continue;
    const desc = ownDataDescriptor(node, key);
    if (!desc) return false;
    if (desc.value !== undefined) return false;
    if (!KNOWN_UNDEFINED_NODE_KEYS.has(key)) return false;
  }
  return true;
}

export function matchCurrent9PublishedHomeEditorial(input: {
  document: unknown;
  locale: string;
  slugPath: string;
}): { locale: Current9Locale } | null {
  const { document, locale, slugPath } = input;
  if (slugPath !== '') return null;
  if (!isCurrent9Locale(locale)) return null;
  if (!isSafeNormalizedDocumentEnvelope(document)) return null;
  if (document === null || typeof document !== 'object' || Array.isArray(document)) return null;
  if (ownValue(document, 'version') !== 1) return null;
  if (ownValue(document, 'locale') !== locale) return null;
  if (ownValue(document, 'stageWidth') !== STAGE_WIDTH) return null;
  if (ownValue(document, 'stageHeight') !== PUBLISHED_HOME_COMPOSITE_STAGE_HEIGHT_BY_LOCALE[locale]) {
    return null;
  }
  for (const key of Reflect.ownKeys(document)) {
    if (typeof key !== 'string') return null;
    if (EXPECTED_DOCUMENT_KEYS.has(key)) continue;
    return null;
  }
  const nodes = ownValue(document, 'nodes');
  if (!Array.isArray(nodes) || nodes.length !== HOME_COMPOSITE_SECTION_IDS.length) return null;
  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    if (!node || typeof node !== 'object' || Array.isArray(node)) return null;
    if (!nodeMatchesCurrent9(node, locale, index)) return null;
  }
  return { locale };
}

export function reorderCurrent9PublishedHomeNodes<T extends { id: string }>(nodes: readonly T[]): T[] {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const ordered: T[] = [];
  for (const id of CURRENT9_COMPOSITE_RENDER_ORDER) {
    const node = byId.get(id);
    if (node) ordered.push(node);
  }
  for (const node of nodes) {
    if (!CURRENT9_COMPOSITE_RENDER_ORDER.includes(node.id as typeof CURRENT9_COMPOSITE_RENDER_ORDER[number])) {
      ordered.push(node);
    }
  }
  return ordered;
}

function nodeById(document: BuilderCanvasDocument, id: string): BuilderCanvasNode | undefined {
  return document.nodes.find((node) => node.id === id);
}

function readContentString(node: BuilderCanvasNode, keys: readonly string[]): string | null {
  const content = node.content as Record<string, unknown>;
  for (const key of keys) {
    const value = content[key];
    if (typeof value === 'string') return value;
  }
  return null;
}

function contentRecord(node: BuilderCanvasNode): Record<string, unknown> {
  return node.content as Record<string, unknown>;
}

function contentName(content: Record<string, unknown>): unknown {
  if (typeof content.name === 'string') return content.name;
  const attributes = content.attributes;
  if (attributes && typeof attributes === 'object' && !Array.isArray(attributes)) {
    const name = (attributes as { name?: unknown }).name;
    if (typeof name === 'string') return name;
  }
  return undefined;
}

function isJulySearchInput(node: BuilderCanvasNode): boolean {
  return node.id === JULY_SEARCH_INPUT_ID || contentName(contentRecord(node)) === 'q';
}

function isJulySearchForm(node: BuilderCanvasNode): boolean {
  return node.id === JULY_SEARCH_FORM_ID;
}

function isJulySearchSubmit(node: BuilderCanvasNode): boolean {
  return JULY_SEARCH_SUBMIT_IDS.has(node.id);
}

function isJulyHeroSearchControl(node: BuilderCanvasNode): boolean {
  if (node.id === 'home-hero-search-wrap' || node.id === 'home-hero-quick-menu') return false;
  return isJulySearchInput(node) || isJulySearchForm(node) || isJulySearchSubmit(node);
}

function julySearchControlMismatch(node: BuilderCanvasNode): boolean {
  const hero = siteContent['zh-hant'].hero;
  const content = contentRecord(node);

  if (isJulySearchInput(node)) {
    const name = contentName(content);
    if (name !== undefined && name !== 'q') return true;
    const type = readContentString(node, ['type', 'inputType']);
    if (type !== null && type !== 'search' && type !== 'text') return true;
    const placeholder = readContentString(node, ['placeholder']);
    if (placeholder !== null && placeholder !== hero.searchPlaceholder) return true;
    const inputAria = readContentString(node, ['ariaLabel', 'aria-label']);
    if (inputAria !== null && inputAria !== hero.searchPlaceholder) return true;
    return false;
  }

  if (isJulySearchSubmit(node)) {
    const type = readContentString(node, ['type']);
    if (type !== null && type !== 'submit' && type !== 'button') return true;
    const accessible = readContentString(node, ['ariaLabel', 'aria-label']);
    if (accessible !== null && accessible !== hero.searchButton) return true;
    return false;
  }

  if (isJulySearchForm(node)) {
    const action = readContentString(node, ['action']);
    if (action !== null && action !== '/zh-hant/search') return true;
    const method = readContentString(node, ['method']);
    if (method !== null && method.toLowerCase() !== 'get') return true;
    return false;
  }

  return true;
}

function compositeKey(node: BuilderCanvasNode): string | undefined {
  if (node.kind !== 'composite') return undefined;
  const key = (node.content as { componentKey?: unknown }).componentKey;
  return typeof key === 'string' ? key : undefined;
}

export function publishedHomeEditorialCompositeProps(
  node: BuilderCanvasNode,
  context: {
    current9: boolean;
    july: JulyHeroEditorialPresentation | null;
  },
): {
  homeEditorialPresentation?: 'editorial';
  publishedSurfaceOverrides?: Record<string, string>;
  publishedHeroQuickMenus?: Array<{ label: string; href: string }>;
} {
  const key = compositeKey(node);
  if (context.current9) {
    if (
      (node.id === 'home-hero' && key === 'hero-search')
      || (node.id === 'home-services' && key === 'services-bento')
      || (node.id === 'home-attorney' && key === 'home-attorney')
      || (node.id === 'home-insights' && key === 'insights-archive')
      || (node.id === 'home-offices' && key === 'office-map-tabs')
    ) {
      return { homeEditorialPresentation: 'editorial' };
    }
  }
  if (context.july) {
    if (node.anchorName === 'mobile-parity-home-hero' && key === 'hero-search') {
      return {
        homeEditorialPresentation: 'editorial',
        publishedSurfaceOverrides: context.july.overrides,
        publishedHeroQuickMenus: context.july.quickMenus,
      };
    }
    if (node.anchorName === 'mobile-parity-home-services' && key === 'services-bento') {
      return { homeEditorialPresentation: 'editorial' };
    }
  }
  return {};
}

export function deriveJulyHeroEditorialPresentation(
  document: BuilderCanvasDocument,
  locale: string,
): JulyHeroEditorialPresentation | null {
  if (locale !== 'zh-hant' || document.locale !== 'zh-hant') return null;
  const overrides: Record<string, string> = {};
  for (const [nodeId, surfaceKey] of JULY_HERO_TEXT_NODES) {
    const node = nodeById(document, nodeId);
    if (!node) return null;
    const text = readContentString(node, ['text', 'label']);
    if (text === null) return null;
    overrides[surfaceKey] = text;
  }
  const columns = nodeById(document, JULY_COLUMNS_NODE_ID);
  if (!columns) return null;
  const columnsLabel = readContentString(columns, ['label', 'text']);
  const columnsHref = readContentString(columns, ['href']);
  if (columnsLabel === null || columnsHref !== '/zh-hant/columns') return null;
  overrides['columns-link'] = columnsLabel;

  const email = nodeById(document, JULY_EMAIL_NODE_ID);
  if (email) {
    const emailHref = readContentString(email, ['href']);
    const emailLabel = readContentString(email, ['label', 'text']);
    if (emailHref !== getConsultationPublicMailto('zh-hant')) return null;
    if (emailLabel && emailLabel !== '申請電子郵件諮詢' && emailLabel !== getConsultationCtaLabel('zh-hant')) {
      return null;
    }
  }

  const searchControls = document.nodes.filter(isJulyHeroSearchControl);
  if (searchControls.length === 0) return null;
  if (searchControls.some(julySearchControlMismatch)) return null;

  const media = document.nodes.find((node) => node.id === 'home-hero-media-image');
  if (media && media.kind === 'image') {
    const src = (media.content as { src?: string }).src;
    if (typeof src === 'string' && !LEGACY_HOME_HERO_POSTERS.has(src)) return null;
  }

  const quickMenus: Array<{ label: string; href: string }> = [];
  for (const id of JULY_MENU_NODE_IDS) {
    const node = nodeById(document, id);
    if (!node) return null;
    const label = readContentString(node, ['label', 'text']);
    const href = readContentString(node, ['href']);
    if (label === null || href === null || !href.startsWith('/zh-hant/')) return null;
    quickMenus.push({ label, href });
  }
  if (quickMenus.length !== 6) return null;
  return { overrides, quickMenus };
}
