import type { BuilderCanvasNode } from './types';
import { locales, type Locale } from '@/lib/locales';
import { pageCopy } from '@/data/page-copy';
import {
  PAGE_CONTAINER_WIDTH,
  PAGE_CONTAINER_X,
  PAGE_STAGE_WIDTH,
  createPageHeaderSectionNodes,
  estimateTextHeight,
} from './decompose-page-shared';
import {
  createHomeButtonNode,
  createHomeContainerNode,
  createHomeTextNode,
} from './decompose-home-shared';

const SECTION_TOP = 88;
const SECTION_BOTTOM = 88;

const reviewCopy = {
  ko: {
    formTitle: '후기 작성',
    moderationNote: '후기는 검토 후 공개됩니다. 개인정보, 사건번호, 외부 링크는 제외해 주세요.',
    nickname: '닉네임',
    nicknamePh: '이름 또는 닉네임',
    rating: '별점',
    service: '이용 서비스',
    servicePh: '선택해 주세요',
    content: '후기 내용',
    contentPh: '서비스 이용 후기를 자유롭게 작성해 주세요.',
    submit: '후기 등록',
    reviewsTitle: '고객 후기',
    noReviews: '아직 등록된 후기가 없습니다. 첫 번째 후기를 남겨 주세요!',
  },
  'zh-hant': {
    formTitle: '撰寫評價',
    moderationNote: '評價送出後會先審核再公開。請勿填寫個資、案件編號或外部連結。',
    nickname: '暱稱',
    nicknamePh: '您的名字或暱稱',
    rating: '評分',
    service: '使用服務',
    servicePh: '請選擇',
    content: '評價內容',
    contentPh: '請自由撰寫您的服務體驗。',
    submit: '提交評價',
    reviewsTitle: '客戶評價',
    noReviews: '目前尚無評價，歡迎成為第一位！',
  },
  en: {
    formTitle: 'Write a Review',
    moderationNote: 'Reviews are published after moderation. Please omit private details, case numbers, and external links.',
    nickname: 'Nickname',
    nicknamePh: 'Your name or nickname',
    rating: 'Rating',
    service: 'Service Used',
    servicePh: 'Select a service',
    content: 'Review',
    contentPh: 'Share your experience with our services.',
    submit: 'Submit Review',
    reviewsTitle: 'Client Reviews',
    noReviews: 'No reviews yet. Be the first to share your experience!',
  },
} as const;

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
  const formTitleHeight = estimateTextHeight(copy.formTitle, 560, 32, 1.15);
  const noteHeight = estimateTextHeight(copy.moderationNote, 560, 16, 1.65);
  const reviewTitleHeight = estimateTextHeight(copy.reviewsTitle, 560, 32, 1.15);
  const emptyHeight = estimateTextHeight(copy.noReviews, 560, 16, 1.65);

  const nodes: BuilderCanvasNode[] = [
    createHomeContainerNode({
      id: rootId,
      rect: { x: 0, y, width: PAGE_STAGE_WIDTH, height: 1200 },
      zIndex: zBase,
      label: 'reviews section root',
      className: 'section review-section',
      as: 'section',
    }),
    createHomeContainerNode({
      id: containerId,
      parentId: rootId,
      rect: { x: PAGE_CONTAINER_X, y: SECTION_TOP, width: PAGE_CONTAINER_WIDTH, height: 980 },
      zIndex: 0,
      label: 'reviews section container',
      className: 'container',
    }),
    createHomeContainerNode({
      id: formWrapId,
      parentId: containerId,
      rect: { x: 0, y: 0, width: 560, height: 0 },
      zIndex: 0,
      label: 'review form wrap',
      className: 'review-form-wrap',
    }),
    createHomeTextNode({
      id: 'page-reviews-form-title',
      parentId: formWrapId,
      rect: { x: 0, y: 0, width: 560, height: formTitleHeight },
      zIndex: 0,
      text: copy.formTitle,
      className: 'review-form-title',
      as: 'h2',
      fontSize: 32,
      fontWeight: 'bold',
    }),
    createHomeTextNode({
      id: 'page-reviews-note',
      parentId: formWrapId,
      rect: { x: 0, y: formTitleHeight + 16, width: 560, height: noteHeight },
      zIndex: 1,
      text: copy.moderationNote,
      className: 'review-empty',
      as: 'p',
    }),
    createHomeContainerNode({
      id: formId,
      parentId: formWrapId,
      rect: { x: 0, y: formTitleHeight + 16 + noteHeight + 24, width: 560, height: 0 },
      zIndex: 2,
      label: 'review form',
      className: 'review-form',
    }),
  ];

  const rows = [
    { label: copy.nickname, placeholder: copy.nicknamePh, className: 'review-input', height: 48 },
    { label: copy.rating, placeholder: '', className: 'star-rating', height: 36 },
    { label: copy.service, placeholder: copy.servicePh, className: 'review-input review-select', height: 48 },
    { label: copy.content, placeholder: copy.contentPh, className: 'review-input review-textarea', height: 132 },
  ];

  let formCursor = 0;
  rows.forEach((row, index) => {
    const rowId = `page-reviews-row-${index}`;
    nodes.push(
      createHomeContainerNode({
        id: rowId,
        parentId: formId,
        rect: { x: 0, y: formCursor, width: 560, height: row.height + 34 },
        zIndex: index,
        label: `review row ${index + 1}`,
        className: 'review-form-row',
      }),
      createHomeTextNode({
        id: `${rowId}-label`,
        parentId: rowId,
        rect: { x: 0, y: 0, width: 180, height: 22 },
        zIndex: 0,
        text: row.label,
        className: 'review-label',
        as: 'div',
        fontWeight: 'medium',
      }),
    );

    if (index === 1) {
      const ratingId = `${rowId}-rating`;
      nodes.push(
        createHomeContainerNode({
          id: ratingId,
          parentId: rowId,
          rect: { x: 0, y: 34, width: 180, height: 36 },
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
            rect: { x: star * 34, y: 0, width: 28, height: 28 },
            zIndex: star,
            label: '★',
            href: '#page-reviews-form',
            style: 'ghost',
            className: 'star-btn star-filled',
            as: 'button',
          }),
        );
      }
    } else {
      nodes.push(
        createHomeContainerNode({
          id: `${rowId}-input`,
          parentId: rowId,
          rect: { x: 0, y: 34, width: 560, height: row.height },
          zIndex: 1,
          label: `review input ${index + 1}`,
          className: row.className,
        }),
        createHomeTextNode({
          id: `${rowId}-placeholder`,
          parentId: `${rowId}-input`,
          rect: { x: 16, y: 14, width: 520, height: Math.max(20, row.height - 28) },
          zIndex: 0,
          text: row.placeholder,
          as: 'span',
          fontSize: 15,
        }),
      );
    }

    formCursor += row.height + 52;
  });

  nodes.push(
    createHomeButtonNode({
      id: 'page-reviews-submit',
      parentId: formId,
      rect: { x: 0, y: formCursor, width: 180, height: 44 },
      zIndex: 10,
      label: copy.submit,
      href: `/${locale}/reviews`,
      style: 'primary',
      className: 'button review-submit',
      as: 'button',
    }),
    createHomeTextNode({
      id: 'page-reviews-list-title',
      parentId: containerId,
      rect: { x: 0, y: formTitleHeight + 16 + noteHeight + 24 + formCursor + 84, width: 560, height: reviewTitleHeight },
      zIndex: 3,
      text: copy.reviewsTitle,
      className: 'review-list-title',
      as: 'h2',
      fontSize: 32,
      fontWeight: 'bold',
    }),
    createHomeTextNode({
      id: 'page-reviews-empty',
      parentId: containerId,
      rect: { x: 0, y: formTitleHeight + 16 + noteHeight + 24 + formCursor + 84 + reviewTitleHeight + 20, width: 560, height: emptyHeight },
      zIndex: 4,
      text: copy.noReviews,
      className: 'review-empty',
      as: 'p',
    }),
  );

  const formHeight = formCursor + 44;
  const formWrapHeight = formTitleHeight + 16 + noteHeight + 24 + formHeight;
  const containerHeight = formWrapHeight + 84 + reviewTitleHeight + 20 + emptyHeight;
  nodes[2] = {
    ...nodes[2],
    rect: { x: 0, y: 0, width: 560, height: formWrapHeight },
  };
  nodes[5] = {
    ...nodes[5],
    rect: { x: 0, y: formTitleHeight + 16 + noteHeight + 24, width: 560, height: formHeight },
  };
  nodes[1] = {
    ...nodes[1],
    rect: { x: PAGE_CONTAINER_X, y: SECTION_TOP, width: PAGE_CONTAINER_WIDTH, height: containerHeight },
  };
  nodes[0] = {
    ...nodes[0],
    rect: { x: 0, y, width: PAGE_STAGE_WIDTH, height: SECTION_TOP + containerHeight + SECTION_BOTTOM },
  };

  return { nodes, height: SECTION_TOP + containerHeight + SECTION_BOTTOM };
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

export const REVIEWS_PAGE_ROOT_HEIGHT = Math.max(...locales.map((locale) => buildReviewsPage(0, locale, 0).height));

export function createReviewsPageDecomposedNodes(y: number, locale: Locale, zBase: number): BuilderCanvasNode[] {
  return buildReviewsPage(y, locale, zBase).nodes;
}
