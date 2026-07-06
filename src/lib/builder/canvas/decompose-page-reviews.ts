import type { BuilderCanvasNode } from './types';
import { locales, type Locale } from '@/lib/locales';
import { pageCopy } from '@/data/page-copy';
import {
  PAGE_CONTAINER_WIDTH,
  PAGE_CONTAINER_X,
  PAGE_STAGE_WIDTH,
  createPageHeaderSectionNodes,
} from './decompose-page-shared';
import {
  createHomeButtonNode,
  createHomeContainerNode,
  createHomeTextNode,
} from './decompose-home-shared';
import { reviewCopy } from './decompose-page-reviews-copy';

const REVIEWS_LIVE_DESKTOP_ROOT_HEIGHT = 1711;
const REVIEWS_SECTION_HEIGHT = 1282;
const REVIEWS_SECTION_CONTAINER_Y = 141;
const REVIEWS_SECTION_CONTAINER_HEIGHT = 1001;
const REVIEWS_FORM_WRAP_WIDTH = 640;
const REVIEWS_FORM_WRAP_X = Math.round((PAGE_CONTAINER_WIDTH - REVIEWS_FORM_WRAP_WIDTH) / 2);
const REVIEWS_FORM_WRAP_HEIGHT = 759;
const REVIEWS_FORM_CONTENT_X = 32;
const REVIEWS_FORM_CONTENT_WIDTH = 574;
const REVIEWS_FORM_TITLE_Y = 32;
const REVIEWS_FORM_TITLE_HEIGHT = 24;
const REVIEWS_NOTE_Y = 81;
const REVIEWS_NOTE_HEIGHT = 137;
const REVIEWS_FORM_Y = 218;
const REVIEWS_FORM_HEIGHT = 508;
const REVIEWS_LIST_TITLE_Y = 816;
const REVIEWS_LIST_TITLE_HEIGHT = 24;
const REVIEWS_EMPTY_Y = 864;
const REVIEWS_EMPTY_HEIGHT = 137;

function createReviewSectionNodes(
  y: number,
  locale: Locale,
  zBase: number,
): { nodes: BuilderCanvasNode[]; height: number } {
  const copy = reviewCopy[locale];
  const rootId = 'page-reviews-section-root';
  const containerId = 'page-reviews-section-container';
  const formWrapId = 'page-reviews-form-wrap';
  const formId = 'page-reviews-form';

  const nodes: BuilderCanvasNode[] = [
    createHomeContainerNode({
      id: rootId,
      rect: { x: 0, y, width: PAGE_STAGE_WIDTH, height: REVIEWS_SECTION_HEIGHT },
      zIndex: zBase,
      label: 'reviews section root',
      className: 'section review-section',
      as: 'section',
    }),
    createHomeContainerNode({
      id: containerId,
      parentId: rootId,
      rect: { x: PAGE_CONTAINER_X, y: REVIEWS_SECTION_CONTAINER_Y, width: PAGE_CONTAINER_WIDTH, height: REVIEWS_SECTION_CONTAINER_HEIGHT },
      zIndex: 0,
      label: 'reviews section container',
      className: 'container',
    }),
    createHomeContainerNode({
      id: formWrapId,
      parentId: containerId,
      rect: { x: REVIEWS_FORM_WRAP_X, y: 0, width: REVIEWS_FORM_WRAP_WIDTH, height: REVIEWS_FORM_WRAP_HEIGHT },
      zIndex: 0,
      label: 'review form wrap',
      className: 'review-form-wrap',
    }),
    createHomeTextNode({
      id: 'page-reviews-form-title',
      parentId: formWrapId,
      rect: { x: REVIEWS_FORM_CONTENT_X, y: REVIEWS_FORM_TITLE_Y, width: REVIEWS_FORM_CONTENT_WIDTH, height: REVIEWS_FORM_TITLE_HEIGHT },
      zIndex: 0,
      text: copy.formTitle,
      className: 'review-form-title',
      as: 'h2',
      fontSize: 20,
      fontWeight: 'bold',
    }),
    createHomeTextNode({
      id: 'page-reviews-note',
      parentId: formWrapId,
      rect: { x: REVIEWS_FORM_CONTENT_X, y: REVIEWS_NOTE_Y, width: REVIEWS_FORM_CONTENT_WIDTH, height: REVIEWS_NOTE_HEIGHT },
      zIndex: 1,
      text: copy.moderationNote,
      className: 'review-empty',
      as: 'p',
      fontSize: 15,
    }),
    createHomeContainerNode({
      id: formId,
      parentId: formWrapId,
      rect: { x: REVIEWS_FORM_CONTENT_X, y: REVIEWS_FORM_Y, width: REVIEWS_FORM_CONTENT_WIDTH, height: REVIEWS_FORM_HEIGHT },
      zIndex: 2,
      label: 'review form',
      className: 'review-form',
      as: 'form',
    }),
  ];

  const rows = [
    { label: copy.nickname, placeholder: copy.nicknamePh, y: 0, height: 77, inputY: 32, inputHeight: 46 },
    { label: copy.rating, placeholder: '', y: 94, height: 57, inputY: 31, inputHeight: 26 },
    { label: copy.service, placeholder: copy.servicePh, y: 166, height: 77, inputY: 32, inputHeight: 46 },
    { label: copy.content, placeholder: copy.contentPh, y: 260, height: 177, inputY: 31, inputHeight: 146 },
  ];

  rows.forEach((row, index) => {
    const rowId = `page-reviews-row-${index}`;
    nodes.push(
      createHomeContainerNode({
        id: rowId,
        parentId: formId,
        rect: { x: 0, y: row.y, width: REVIEWS_FORM_CONTENT_WIDTH, height: row.height },
        zIndex: index,
        label: `review row ${index + 1}`,
        className: 'review-form-row',
      }),
      createHomeTextNode({
        id: `${rowId}-label`,
        parentId: rowId,
        rect: { x: 0, y: 0, width: REVIEWS_FORM_CONTENT_WIDTH, height: 23 },
        zIndex: 0,
        text: row.label,
        className: 'review-label',
        as: 'div',
        fontSize: 13,
        fontWeight: 'medium',
      }),
    );

    if (index === 1) {
      const ratingId = `${rowId}-rating`;
      nodes.push(
        createHomeContainerNode({
          id: ratingId,
          parentId: rowId,
          rect: { x: 0, y: row.inputY, width: REVIEWS_FORM_CONTENT_WIDTH, height: row.inputHeight },
          zIndex: 1,
          label: 'review rating',
          className: 'star-rating',
        }),
      );
      for (let star = 0; star < 5; star += 1) {
        nodes.push(
          createHomeButtonNode({
            id: `${ratingId}-star-${star}`,
            parentId: ratingId,
            rect: { x: star * 28, y: 0, width: 26, height: 26 },
            zIndex: star,
            label: '★',
            href: '#page-reviews-form',
            style: 'ghost',
            className: 'star-btn',
            as: 'button',
          }),
        );
      }
    } else {
      nodes.push(
        createHomeContainerNode({
          id: `${rowId}-input`,
          parentId: rowId,
          rect: { x: 0, y: row.inputY, width: REVIEWS_FORM_CONTENT_WIDTH, height: row.inputHeight },
          zIndex: 1,
          label: `review input ${index + 1}`,
          className: index === 2
            ? 'review-input review-select'
            : index === 3
              ? 'review-input review-textarea'
              : 'review-input',
        }),
        createHomeTextNode({
          id: `${rowId}-placeholder`,
          parentId: `${rowId}-input`,
          rect: { x: 16, y: index === 3 ? 14 : 13, width: REVIEWS_FORM_CONTENT_WIDTH - 32, height: index === 3 ? 120 : 22 },
          zIndex: 0,
          text: row.placeholder,
          as: 'span',
          fontSize: 15,
        }),
      );
    }
  });

  nodes.push(
    createHomeButtonNode({
      id: 'page-reviews-submit',
      parentId: formId,
      rect: { x: 0, y: 461, width: 102, height: 47 },
      zIndex: 10,
      label: copy.submit,
      href: `/${locale}/reviews`,
      style: 'primary',
      className: 'button review-submit',
      as: 'button',
      buttonType: 'submit',
    }),
    createHomeTextNode({
      id: 'page-reviews-list-title',
      parentId: containerId,
      rect: { x: 0, y: REVIEWS_LIST_TITLE_Y, width: PAGE_CONTAINER_WIDTH, height: REVIEWS_LIST_TITLE_HEIGHT },
      zIndex: 3,
      text: copy.reviewsTitle,
      className: 'review-list-title',
      as: 'h2',
      fontSize: 20,
      fontWeight: 'bold',
    }),
    createHomeTextNode({
      id: 'page-reviews-empty',
      parentId: containerId,
      rect: { x: 0, y: REVIEWS_EMPTY_Y, width: PAGE_CONTAINER_WIDTH, height: REVIEWS_EMPTY_HEIGHT },
      zIndex: 4,
      text: copy.noReviews,
      className: 'review-empty',
      as: 'p',
      fontSize: 15,
    }),
  );

  return { nodes, height: REVIEWS_SECTION_HEIGHT };
}

function buildReviewsPage(y: number, locale: Locale, zBase: number): { nodes: BuilderCanvasNode[]; height: number } {
  const page = pageCopy[locale].reviews;
  let cursor = y;
  const nodes: BuilderCanvasNode[] = [];

  const header = createPageHeaderSectionNodes({
    prefix: 'page-reviews',
    y: cursor,
    locale,
    label: page.label,
    title: page.title,
    description: page.description,
    zBase,
  });
  nodes.push(...header.nodes);
  cursor += header.height;

  const reviews = createReviewSectionNodes(cursor, locale, zBase + 100);
  nodes.push(...reviews.nodes);
  cursor += reviews.height;

  return { nodes, height: cursor - y };
}

export const REVIEWS_PAGE_ROOT_HEIGHT = Math.max(
  REVIEWS_LIVE_DESKTOP_ROOT_HEIGHT,
  ...locales.map((locale) => buildReviewsPage(0, locale, 0).height),
);

export function createReviewsPageDecomposedNodes(y: number, locale: Locale, zBase: number): BuilderCanvasNode[] {
  return buildReviewsPage(y, locale, zBase).nodes;
}
