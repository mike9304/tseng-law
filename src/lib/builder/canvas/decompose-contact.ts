import type { BuilderCanvasNode } from './types';
import type { Locale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import {
  HOME_STAGE_WIDTH,
  createHomeButtonNode,
  createHomeContainerNode,
  createHomeTextNode,
} from './decompose-home-shared';

const CONTACT_ROOT_HEIGHT = 640;

export const CONTACT_SECTION_ROOT_HEIGHT = CONTACT_ROOT_HEIGHT;

export function createContactDecomposedNodes(
  rootY: number,
  locale: Locale,
  zBase: number,
): BuilderCanvasNode[] {
  const content = siteContent[locale];
  const contact = content.contact;
  const representativeTel = content.quickContact.actions.find((action) => action.href.startsWith('tel:'));
  const title =
    locale === 'ko'
      ? '대만 법률 이슈, 지금 바로 상담하세요.'
      : locale === 'zh-hant'
        ? '台灣法律議題，立即諮詢。'
        : 'Talk to us now about your Taiwan legal issue.';
  const description =
    locale === 'ko'
      ? '사업·소송·법인설립 문의를 유형별로 빠르게 연결해드립니다.'
      : locale === 'zh-hant'
        ? '依案件類型安排投資、訴訟與公司設立諮詢流程。'
        : 'We quickly route business, litigation, and incorporation inquiries by case type.';

  const rootId = 'home-contact-root';
  const containerId = 'home-contact-container';
  const copyId = 'home-contact-copy';
  const actionsId = 'home-contact-actions';

  const nodes: BuilderCanvasNode[] = [
    createHomeContainerNode({
      id: rootId,
      rect: { x: 0, y: rootY, width: HOME_STAGE_WIDTH, height: CONTACT_ROOT_HEIGHT },
      zIndex: zBase,
      label: 'home contact root',
      className: 'section section--dark home-contact-cta',
      as: 'section',
      htmlId: 'contact',
      dataTone: 'dark',
    }),
    createHomeContainerNode({
      id: containerId,
      parentId: rootId,
      rect: { x: 72, y: 120, width: 1136, height: 380 },
      zIndex: 0,
      label: 'home contact container',
      className: 'container',
    }),
    createHomeContainerNode({
      id: copyId,
      parentId: containerId,
      rect: { x: 0, y: 0, width: 680, height: 180 },
      zIndex: 0,
      label: 'home contact copy',
    }),
    createHomeTextNode({
      id: 'home-contact-label',
      parentId: copyId,
      rect: { x: 0, y: 0, width: 200, height: 28 },
      zIndex: 0,
      text: contact.label,
      className: 'section-label',
      as: 'div',
      color: '#e9f2ea',
      fontWeight: 'medium',
    }),
    createHomeTextNode({
      id: 'home-contact-title',
      parentId: copyId,
      rect: { x: 0, y: 42, width: 640, height: 56 },
      zIndex: 1,
      text: title,
      className: 'section-title',
      as: 'h2',
      color: '#f8fafc',
    }),
    createHomeTextNode({
      id: 'home-contact-description',
      parentId: copyId,
      rect: { x: 0, y: 114, width: 560, height: 58 },
      zIndex: 2,
      text: description,
      className: 'section-lede',
      as: 'p',
      color: '#dfece1',
    }),
    createHomeContainerNode({
      id: actionsId,
      parentId: containerId,
      rect: { x: 0, y: 214, width: 520, height: 56 },
      zIndex: 1,
      label: 'home contact actions',
      className: 'home-contact-actions',
    }),
    createHomeButtonNode({
      id: 'home-contact-primary',
      parentId: actionsId,
      rect: { x: 0, y: 0, width: 180, height: 44 },
      zIndex: 0,
      label: contact.cta.label,
      href: `/${locale}/contact`,
      style: 'ghost',
      className: 'button ghost',
      as: 'a',
    }),
  ];

  if (representativeTel) {
    nodes.push(
      createHomeButtonNode({
        id: 'home-contact-phone',
        parentId: actionsId,
        rect: { x: 194, y: 0, width: 220, height: 44 },
        zIndex: 1,
        label: representativeTel.value,
        href: representativeTel.href,
        style: 'secondary',
        className: 'button secondary',
        as: 'a',
      }),
    );
  }

  return nodes;
}
