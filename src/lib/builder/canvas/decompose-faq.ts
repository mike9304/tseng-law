import type { BuilderCanvasNode } from './types';
import type { Locale } from '@/lib/locales';
import { faqContent } from '@/data/faq-content';
import {
  HOME_STAGE_WIDTH,
  createHomeContainerNode,
  createHomeTextNode,
} from './decompose-home-shared';

const FAQ_ROOT_HEIGHT = 1280;

export const FAQ_SECTION_ROOT_HEIGHT = FAQ_ROOT_HEIGHT;

export function createFaqDecomposedNodes(
  rootY: number,
  locale: Locale,
  zBase: number,
): BuilderCanvasNode[] {
  const items = faqContent[locale];
  const sectionTitle =
    locale === 'ko' ? '자주 묻는 질문' : locale === 'zh-hant' ? '常見問題' : 'Frequently Asked Questions';
  const rootId = 'home-faq-root';
  const containerId = 'home-faq-container';
  const listId = 'home-faq-list';

  const nodes: BuilderCanvasNode[] = [
    createHomeContainerNode({
      id: rootId,
      rect: { x: 0, y: rootY, width: HOME_STAGE_WIDTH, height: FAQ_ROOT_HEIGHT },
      zIndex: zBase,
      label: 'home faq root',
      className: 'section section--gray',
      as: 'section',
      htmlId: 'faq',
      dataTone: 'light',
    }),
    createHomeContainerNode({
      id: containerId,
      parentId: rootId,
      rect: { x: 72, y: 88, width: 1136, height: 1104 },
      zIndex: 0,
      label: 'home faq container',
      className: 'container',
    }),
    createHomeTextNode({
      id: 'home-faq-label',
      parentId: containerId,
      rect: { x: 0, y: 0, width: 120, height: 28 },
      zIndex: 0,
      text: 'FAQ',
      className: 'section-label',
      as: 'div',
      fontWeight: 'medium',
    }),
    createHomeTextNode({
      id: 'home-faq-title',
      parentId: containerId,
      rect: { x: 0, y: 40, width: 560, height: 54 },
      zIndex: 1,
      text: sectionTitle,
      className: 'section-title',
      as: 'h2',
    }),
    createHomeContainerNode({
      id: listId,
      parentId: containerId,
      rect: { x: 0, y: 126, width: 1136, height: 940 },
      zIndex: 2,
      label: 'home faq list',
      className: 'faq-list',
    }),
  ];

  items.forEach((item, index) => {
    const itemId = `home-faq-item-${index}`;
    const questionId = `${itemId}-question`;
    const answerWrapId = `${itemId}-answer-wrap`;
    const itemY = index * 78;

    nodes.push(
      createHomeContainerNode({
        id: itemId,
        parentId: listId,
        rect: { x: 0, y: itemY, width: 1136, height: 68 },
        zIndex: index,
        label: `home faq item ${index + 1}`,
        className: 'faq-item',
        as: 'article',
      }),
      createHomeContainerNode({
        id: questionId,
        parentId: itemId,
        rect: { x: 0, y: 0, width: 1136, height: 52 },
        zIndex: 0,
        label: `home faq question ${index + 1}`,
        className: 'faq-question',
      }),
      createHomeTextNode({
        id: `${itemId}-question-text`,
        parentId: questionId,
        rect: { x: 16, y: 16, width: 1030, height: 24 },
        zIndex: 0,
        text: item.question,
        as: 'div',
        fontWeight: 'medium',
      }),
      createHomeTextNode({
        id: `${itemId}-arrow`,
        parentId: questionId,
        rect: { x: 1088, y: 16, width: 20, height: 20 },
        zIndex: 1,
        text: '▸',
        className: 'faq-arrow',
        as: 'span',
      }),
      createHomeContainerNode({
        id: answerWrapId,
        parentId: itemId,
        rect: { x: 16, y: 52, width: 1104, height: 56 },
        zIndex: 1,
        label: `home faq answer wrap ${index + 1}`,
        className: 'faq-answer-wrap',
      }),
      createHomeTextNode({
        id: `${itemId}-answer`,
        parentId: answerWrapId,
        rect: { x: 0, y: 0, width: 1104, height: 56 },
        zIndex: 0,
        text: item.answer,
        className: 'faq-answer',
        as: 'p',
      }),
    );
  });

  return nodes;
}
