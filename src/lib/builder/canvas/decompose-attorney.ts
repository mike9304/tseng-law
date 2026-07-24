import type { BuilderCanvasNode } from './types';
import type { Locale } from '@/lib/locales';
import { getAttorneyProfilePath } from '@/data/attorney-profiles';
import { teamContent } from '@/data/team-members';
import {
  HOME_STAGE_WIDTH,
  createHomeButtonNode,
  createHomeContainerNode,
  createHomeImageNode,
  createHomeTextNode,
} from './decompose-home-shared';

const copyByLocale = {
  ko: {
    label: 'ABOUT',
    title: '증준외 변호사, 한국 고객을 위한 대만 법률 파트너',
    summary:
      '법원 소송 실무와 기업 법률고문 경험을 바탕으로, SBS 뉴스에 법률 의견과 해설을 제공하고 WEI Lawyer를 통해 법률정보를 꾸준히 발행하고 있습니다.',
    cta: '변호사 프로필 보기',
  },
  'zh-hant': {
    label: 'ABOUT',
    title: '曾雋崴律師，專注服務韓國客戶的台灣法律夥伴',
    summary:
      '具備法院訴訟實務與企業法律顧問經驗，曾為 SBS 新聞提供法律意見與解說，並持續透過 WEI Lawyer 發布法律資訊。',
    cta: '查看律師簡介',
  },
  en: {
    label: 'ABOUT',
    title: 'Attorney Wei Tseng, Taiwan Legal Partner for Korean Clients',
    summary:
      'With experience in court litigation and corporate legal advisory work, Attorney Wei Tseng has provided legal commentary and advice to SBS News and continues to publish legal information through WEI Lawyer.',
    cta: 'View Lawyer Profile',
  },
} as const;

const ATTORNEY_ROOT_HEIGHT = 720;

export const ATTORNEY_SECTION_ROOT_HEIGHT = ATTORNEY_ROOT_HEIGHT;

export function createAttorneyDecomposedNodes(
  rootY: number,
  locale: Locale,
  zBase: number,
): BuilderCanvasNode[] {
  const lead = teamContent[locale].members[0];
  const copy = copyByLocale[locale];
  const profilePath = getAttorneyProfilePath(locale);
  const rootId = 'home-attorney-root';
  const imageWrapId = 'home-attorney-image-wrap';
  const badgeId = 'home-attorney-badge';
  const contentId = 'home-attorney-content';

  return [
    createHomeContainerNode({
      id: rootId,
      rect: { x: 0, y: rootY, width: HOME_STAGE_WIDTH, height: ATTORNEY_ROOT_HEIGHT },
      zIndex: zBase,
      label: 'home attorney root',
      className: 'section section--gray split-section split--img-left',
      as: 'section',
      htmlId: 'about',
      dataTone: 'light',
    }),
    createHomeContainerNode({
      id: imageWrapId,
      parentId: rootId,
      rect: { x: 0, y: 0, width: 576, height: ATTORNEY_ROOT_HEIGHT },
      zIndex: 0,
      label: 'home attorney image',
      className: 'split-image split-image--portrait',
    }),
    createHomeImageNode({
      id: 'home-attorney-image',
      parentId: imageWrapId,
      rect: { x: 0, y: 0, width: 576, height: ATTORNEY_ROOT_HEIGHT },
      zIndex: 0,
      src: lead.photo,
      alt: `${lead.name} ${lead.role}`,
    }),
    createHomeContainerNode({
      id: badgeId,
      parentId: imageWrapId,
      rect: { x: 24, y: 560, width: 528, height: 108 },
      zIndex: 1,
      label: 'home attorney badge',
      className: 'split-portrait-badge',
    }),
    createHomeTextNode({
      id: 'home-attorney-badge-name',
      parentId: badgeId,
      rect: { x: 0, y: 0, width: 240, height: 30 },
      zIndex: 0,
      text: lead.name,
      as: 'div',
      color: '#fffaf0',
      fontWeight: 'bold',
    }),
    createHomeTextNode({
      id: 'home-attorney-badge-role',
      parentId: badgeId,
      rect: { x: 0, y: 34, width: 280, height: 24 },
      zIndex: 1,
      text: lead.role,
      as: 'span',
      color: '#fffaf0',
    }),
    createHomeContainerNode({
      id: contentId,
      parentId: rootId,
      rect: { x: 576, y: 0, width: 704, height: ATTORNEY_ROOT_HEIGHT },
      zIndex: 1,
      label: 'home attorney content',
      className: 'split-content',
    }),
    createHomeTextNode({
      id: 'home-attorney-label',
      parentId: contentId,
      rect: { x: 0, y: 92, width: 180, height: 28 },
      zIndex: 0,
      text: copy.label,
      className: 'section-label',
      as: 'div',
      fontWeight: 'medium',
    }),
    createHomeTextNode({
      id: 'home-attorney-title',
      parentId: contentId,
      rect: { x: 0, y: 136, width: 560, height: 96 },
      zIndex: 1,
      text: copy.title,
      className: 'split-title',
      as: 'h2',
    }),
    createHomeContainerNode({
      id: 'home-attorney-divider',
      parentId: contentId,
      rect: { x: 0, y: 246, width: 80, height: 4 },
      zIndex: 2,
      label: 'home attorney divider',
      className: 'split-divider',
    }),
    createHomeTextNode({
      id: 'home-attorney-intro-1',
      parentId: contentId,
      rect: { x: 0, y: 274, width: 560, height: 58 },
      zIndex: 3,
      text: lead.intro[0],
      className: 'split-text',
      as: 'p',
    }),
    createHomeTextNode({
      id: 'home-attorney-intro-2',
      parentId: contentId,
      rect: { x: 0, y: 344, width: 560, height: 58 },
      zIndex: 4,
      text: lead.intro[1],
      className: 'split-text',
      as: 'p',
    }),
    createHomeTextNode({
      id: 'home-attorney-summary',
      parentId: contentId,
      rect: { x: 0, y: 414, width: 560, height: 82 },
      zIndex: 5,
      text: copy.summary,
      className: 'split-text',
      as: 'p',
    }),
    createHomeTextNode({
      id: 'home-attorney-contact-line',
      parentId: contentId,
      rect: { x: 0, y: 510, width: 560, height: 40 },
      zIndex: 6,
      text: `${lead.name} · ${lead.role} · ${lead.email}`,
      className: 'split-text',
      as: 'p',
    }),
    createHomeButtonNode({
      id: 'home-attorney-cta',
      parentId: contentId,
      rect: { x: 0, y: 574, width: 220, height: 28 },
      zIndex: 7,
      label: `${copy.cta} →`,
      href: profilePath,
      style: 'link',
      className: 'link-underline',
      as: 'a',
    }),
  ];
}
