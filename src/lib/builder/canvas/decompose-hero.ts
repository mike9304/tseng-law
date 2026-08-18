import type { BuilderCanvasNode } from './types';
import type { Locale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import { getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import {
  HOME_STAGE_WIDTH,
  createHomeButtonNode,
  createHomeContainerNode,
  createHomeImageNode,
  createHomeTextNode,
} from './decompose-home-shared';

const HERO_ROOT_HEIGHT = 820;
const HERO_SEARCH_AVAILABLE_WIDTH = 1151;
// Keep the editable hero search safely above the next flow section even when
// the editor auto-fits the stage below 100% zoom. This stays in sync with
// upgradeHeroSearchForm (admin-builder/page.tsx), which repairs persisted
// documents to the same geometry.
export const HERO_SEARCH_WRAPPER_Y = 618;

export const HERO_SECTION_ROOT_HEIGHT = HERO_ROOT_HEIGHT;
export const HERO_MEDIA_IMAGE_SOURCES = [
  '/images/editorial/taichung-courthouse-civic-daylight-v2.webp',
] as const;
export const HERO_MEDIA_IMAGE_NODE_IDS = HERO_MEDIA_IMAGE_SOURCES.map((_, index) => (
  index === 0 ? 'home-hero-media-image' : `home-hero-media-image-${index + 1}`
));

const quickMenus = {
  ko: [
    { label: '업무분야', href: '/ko/services' },
    { label: '칼럼', href: '/ko/columns' },
    { label: '변호사', href: '/ko/lawyers' },
    { label: '자주 묻는 질문', href: '/ko/faq' },
    { label: '영상/채널', href: '/ko/videos' },
    { label: '연락처 정보', href: '/ko/contact' },
  ],
  'zh-hant': [
    { label: '服務領域', href: '/zh-hant/services' },
    { label: '專欄', href: '/zh-hant/columns' },
    { label: '律師', href: '/zh-hant/lawyers' },
    { label: '常見問題', href: '/zh-hant/faq' },
    { label: '影音/頻道', href: '/zh-hant/videos' },
    { label: '聯絡資訊', href: '/zh-hant/contact' },
  ],
  en: [
    { label: 'Services', href: '/en/services' },
    { label: 'Columns', href: '/en/columns' },
    { label: 'Lawyers', href: '/en/lawyers' },
    { label: 'FAQ', href: '/en/faq' },
    { label: 'Videos / Channel', href: '/en/videos' },
    { label: 'Contact information', href: '/en/contact' },
  ],
} as const;

const emailConsultationCtaLabels = {
  ko: '이메일 상담 신청',
  'zh-hant': '申請電子郵件諮詢',
  en: 'Request an Email Consultation',
} as const;

export function createHeroDecomposedNodes(
  rootY: number,
  locale: Locale,
  zBase: number,
): BuilderCanvasNode[] {
  const hero = siteContent[locale].hero;
  const rootId = 'home-hero-root';
  const mediaId = 'home-hero-media';
  const innerId = 'home-hero-inner';
  const copyId = 'home-hero-copy';
  const linksId = 'home-hero-links';
  const searchWrapperId = 'home-hero-search-wrapper';
  const searchContainerId = 'home-hero-search-container';
  const searchWrapId = 'home-hero-search-wrap';
  const searchBarId = 'home-hero-search-bar';
  const quickMenuId = 'home-hero-quick-menu';

  const nodes: BuilderCanvasNode[] = [
    createHomeContainerNode({
      id: rootId,
      rect: { x: 0, y: rootY, width: HOME_STAGE_WIDTH, height: HERO_ROOT_HEIGHT },
      zIndex: zBase,
      label: 'home hero root',
      className: 'hero',
      as: 'section',
      htmlId: 'hero',
      dataTone: 'dark',
    }),
    createHomeContainerNode({
      id: mediaId,
      parentId: rootId,
      rect: { x: 0, y: 0, width: HOME_STAGE_WIDTH, height: HERO_ROOT_HEIGHT },
      zIndex: 0,
      label: 'hero media',
      className: 'hero-media',
    }),
    ...HERO_MEDIA_IMAGE_SOURCES.map((src, index) => createHomeImageNode({
      id: HERO_MEDIA_IMAGE_NODE_IDS[index] ?? `home-hero-media-image-${index + 1}`,
      parentId: mediaId,
      rect: { x: 0, y: 0, width: HOME_STAGE_WIDTH, height: HERO_ROOT_HEIGHT },
      zIndex: 0,
      src,
      alt: index === 0 ? hero.title : '',
      ...(index === 0 ? {} : { style: { opacity: 0 } }),
    })),
    createHomeContainerNode({
      id: innerId,
      parentId: rootId,
      rect: { x: 51, y: 184, width: 1178, height: 483 },
      zIndex: 1,
      label: 'hero inner',
      className: 'container hero-inner',
    }),
    createHomeContainerNode({
      id: copyId,
      parentId: innerId,
      rect: { x: 0, y: 0, width: 780, height: 450 },
      zIndex: 0,
      label: 'hero copy',
      className: 'hero-copy',
    }),
    createHomeTextNode({
      id: 'home-hero-label',
      parentId: copyId,
      rect: { x: 0, y: 1, width: 240, height: 32 },
      zIndex: 0,
      text: hero.label,
      className: 'section-label',
      as: 'div',
      color: '#e9f2ea',
      fontWeight: 'medium',
    }),
    createHomeTextNode({
      id: 'home-hero-title',
      parentId: copyId,
      rect: { x: 0, y: 56, width: 780, height: 167 },
      zIndex: 1,
      text: hero.title,
      className: 'hero-title',
      as: 'h1',
      color: '#f7fcf7',
    }),
    createHomeTextNode({
      id: 'home-hero-subtitle',
      parentId: copyId,
      rect: { x: 0, y: 247, width: 580, height: 116 },
      zIndex: 2,
      text: hero.subtitle,
      className: 'hero-subtitle',
      as: 'p',
      color: '#dfece1',
    }),
    createHomeContainerNode({
      id: linksId,
      parentId: copyId,
      rect: { x: 0, y: 390, width: 460, height: 48 },
      zIndex: 3,
      label: 'hero links',
      className: 'hero-links-minimal hero-cta-actions',
      layoutMode: 'flex',
      flexConfig: {
        direction: 'row',
        wrap: false,
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 12,
      },
    }),
    createHomeButtonNode({
      id: 'home-hero-email-consultation-link',
      parentId: linksId,
      rect: { x: 0, y: 0, width: 220, height: 48 },
      zIndex: 0,
      label: emailConsultationCtaLabels[locale],
      href: getConsultationPublicMailto(locale),
      style: 'primary',
      className: 'button hero-cta-primary',
      as: 'a',
    }),
    createHomeButtonNode({
      id: 'home-hero-columns-link',
      parentId: linksId,
      rect: { x: 232, y: 0, width: 180, height: 48 },
      zIndex: 1,
      label: locale === 'ko' ? '호정칼럼 보기' : locale === 'zh-hant' ? '查看專欄內容' : 'View Columns',
      href: `/${locale}/columns`,
      style: 'secondary',
      className: 'button hero-cta-secondary',
      as: 'a',
    }),
    createHomeContainerNode({
      id: searchWrapperId,
      parentId: rootId,
      rect: { x: 0, y: HERO_SEARCH_WRAPPER_Y, width: HOME_STAGE_WIDTH, height: 62 },
      zIndex: 2,
      label: 'hero search wrapper',
      className: 'hero-search-wrapper',
    }),
    createHomeContainerNode({
      id: searchContainerId,
      parentId: searchWrapperId,
      rect: { x: 0, y: 0, width: HERO_SEARCH_AVAILABLE_WIDTH, height: 62 },
      zIndex: 0,
      label: 'hero search container',
      className: 'container',
    }),
    createHomeContainerNode({
      id: searchWrapId,
      parentId: searchContainerId,
      rect: { x: 0, y: 0, width: 760, height: 62 },
      zIndex: 0,
      label: 'hero search dropdown wrap',
      className: 'hero-search-dropdown-wrap',
    }),
    createHomeContainerNode({
      id: searchBarId,
      parentId: searchWrapId,
      rect: { x: 0, y: 0, width: 760, height: 62 },
      zIndex: 0,
      label: 'hero search bar',
      className: 'hero-search-bar overlap',
      as: 'form',
      action: `/${locale}/search`,
      method: 'get',
      layoutMode: 'flex',
      flexConfig: {
        direction: 'row',
        wrap: false,
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 0,
      },
    }),
    createHomeTextNode({
      id: 'home-hero-search-input',
      parentId: searchBarId,
      rect: { x: 0, y: 0, width: 700, height: 62 },
      zIndex: 0,
      text: hero.searchPlaceholder,
      className: 'search-input hero-search-input',
      as: 'input',
      inputType: 'search',
      name: 'q',
      placeholder: hero.searchPlaceholder,
      ariaLabel: hero.searchPlaceholder,
      color: '#ffffff',
    }),
    createHomeButtonNode({
      id: 'home-hero-search-button',
      parentId: searchBarId,
      rect: { x: 700, y: 0, width: 60, height: 62 },
      zIndex: 1,
      label: '⌕',
      href: `/${locale}/search`,
      style: 'ghost',
      className: 'hero-search-btn',
      as: 'button',
      buttonType: 'submit',
      ariaLabel: hero.searchButton,
    }),
    createHomeContainerNode({
      id: quickMenuId,
      parentId: searchWrapId,
      rect: { x: 0, y: 70, width: 760, height: 318 },
      zIndex: 2,
      label: 'hero quick menu focused state',
      className: 'hero-quick-menu builder-hero-quick-menu',
      as: 'nav',
    }),
    ...quickMenus[locale].map((item, index) =>
      createHomeButtonNode({
        id: `home-hero-quick-menu-item-${index}`,
        parentId: quickMenuId,
        rect: { x: 0, y: index * 53, width: 760, height: 53 },
        zIndex: index,
        label: item.label,
        href: item.href,
        style: 'link',
        className: 'hero-quick-menu-item builder-hero-quick-menu-item',
        as: 'a',
      }),
    ),
    createHomeButtonNode({
      id: 'home-hero-scroll-arrow',
      parentId: rootId,
      rect: { x: 1216, y: 746, width: 48, height: 48 },
      zIndex: 3,
      label: '⌄',
      href: '#insights',
      style: 'ghost',
      className: 'hero-scroll-arrow',
      as: 'a',
    }),
  ];

  return nodes;
}
