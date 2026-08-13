import type { BuilderCanvasNode } from './types';
import type { Locale } from '@/lib/locales';
import { getAttorneyProfilePath } from '@/data/attorney-profiles';
import { resolveHomeInsightsCardLabels } from '@/lib/builder/home-insights-card-format';
import { getAllColumnPosts, type ColumnPost } from '@/lib/columns';
import {
  HOME_STAGE_WIDTH,
  createHomeButtonNode,
  createHomeContainerNode,
  createHomeImageNode,
  createHomeTextNode,
} from './decompose-home-shared';

const copyByLocale = {
  ko: {
    label: 'INSIGHTS',
    title: '칼럼 아카이브',
    description: '실제 수집된 칼럼 본문과 이미지를 기반으로 주요 글을 바로 확인할 수 있습니다.',
    readMore: '자세히 보기',
    dateFallback: '게시일 확인중',
    prevLabel: '이전',
    nextLabel: '다음',
    viewAll: '모든 칼럼 보기',
  },
  'zh-hant': {
    label: 'INSIGHTS',
    title: '專欄精選',
    description: '以下內容直接對應已整理的專欄原文與圖片素材。',
    readMore: '閱讀全文',
    dateFallback: '日期待確認',
    prevLabel: '上一頁',
    nextLabel: '下一頁',
    viewAll: '查看所有專欄',
  },
  en: {
    label: 'INSIGHTS',
    title: 'Column Archive',
    description: 'Browse key posts prepared from curated legal columns and source images.',
    readMore: 'Read more',
    dateFallback: 'Date pending',
    prevLabel: 'Previous',
    nextLabel: 'Next',
    viewAll: 'View all columns',
  },
} as const;

const INSIGHTS_ROOT_HEIGHT = 820;
const INSIGHTS_LIST_ITEM_HEIGHT = 112;
const INSIGHTS_LIST_ITEM_PITCH = 124;
const INSIGHTS_LIST_MIN_HEIGHT = 360;
const INSIGHTS_LIST_NO_CONTROLS_MIN_HEIGHT = 360;
const INSIGHTS_PAGE_SIZE = 3;
const INSIGHTS_LIST_WRAP_X = 576;
const INSIGHTS_LIST_WRAP_WIDTH = 560;
const INSIGHTS_LIST_INSET_X = 16;
const INSIGHTS_LIST_WIDTH = 528;
const INSIGHTS_LIST_COPY_X = 120;
const INSIGHTS_LIST_COPY_WIDTH = 408;
const INSIGHTS_LIST_READTIME_WIDTH = 78;
const INSIGHTS_IMAGE_FALLBACK =
  '/images/blog/016-taiwan-inheritance-custody-analysis/featured-generic.webp';

type HomeInsightPost = {
  slug: string;
  title: string;
  dateDisplay: string;
  readTime: string;
  categoryLabel: string;
  featuredImage: string;
  summary: string;
};

export const INSIGHTS_SECTION_ROOT_HEIGHT = INSIGHTS_ROOT_HEIGHT;

function resolveInsightsImageSrc(src?: string | null): string {
  const normalized = src?.trim() ?? '';
  if (!normalized || /(?:^|\/)placeholder(?:[-./]|$)/i.test(normalized)) {
    return INSIGHTS_IMAGE_FALLBACK;
  }
  return normalized;
}

const ENGLISH_MONTHS = new Map([
  ['january', 1],
  ['february', 2],
  ['march', 3],
  ['april', 4],
  ['may', 5],
  ['june', 6],
  ['july', 7],
  ['august', 8],
  ['september', 9],
  ['october', 10],
  ['november', 11],
  ['december', 12],
]);

function toValidatedUtcDate(year: number, month: number, day: number): number | undefined {
  const timestamp = Date.UTC(year, month - 1, day);
  const parsed = new Date(timestamp);
  if (
    parsed.getUTCFullYear() !== year
    || parsed.getUTCMonth() !== month - 1
    || parsed.getUTCDate() !== day
  ) {
    return undefined;
  }
  return timestamp;
}

function parseInsightsDate(value: string): number | undefined {
  const normalized = value.trim();
  if (!normalized) return undefined;

  const numericMatch = normalized.match(
    /^(\d{4})\s*[-./]\s*(\d{1,2})\s*[-./]\s*(\d{1,2})(?:[T\s].*)?$/,
  );
  if (numericMatch) {
    return toValidatedUtcDate(
      Number(numericMatch[1]),
      Number(numericMatch[2]),
      Number(numericMatch[3]),
    );
  }

  const cjkMatch = normalized.match(
    /^(\d{4})\s*[년年]\s*(\d{1,2})\s*[월月]\s*(\d{1,2})\s*[일日]$/,
  );
  if (cjkMatch) {
    return toValidatedUtcDate(
      Number(cjkMatch[1]),
      Number(cjkMatch[2]),
      Number(cjkMatch[3]),
    );
  }

  const englishMatch = normalized.match(
    /^([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?\s*,?\s*(\d{4})$/i,
  );
  if (!englishMatch) return undefined;
  const month = ENGLISH_MONTHS.get(englishMatch[1].toLowerCase());
  if (!month) return undefined;
  return toValidatedUtcDate(
    Number(englishMatch[3]),
    month,
    Number(englishMatch[2]),
  );
}

function resolveInsightsPosts(
  locale: Locale,
  sourcePosts: readonly ColumnPost[] = getAllColumnPosts(locale),
): HomeInsightPost[] {
  const copy = copyByLocale[locale];
  return sourcePosts
    .map((post, sourceIndex) => {
      const labels = resolveHomeInsightsCardLabels(post, copy.dateFallback);
      return {
        sourceIndex,
        publicationTimestamp:
          parseInsightsDate(post.dateDisplay) ?? parseInsightsDate(post.date),
        post: {
          slug: post.slug,
          title: post.title,
          dateDisplay: labels.date,
          readTime: labels.readTime,
          categoryLabel: post.categoryLabel,
          featuredImage: resolveInsightsImageSrc(post.featuredImage),
          summary: post.summary,
        },
      };
    })
    .sort((a, b) => {
      if (a.publicationTimestamp === undefined) {
        return b.publicationTimestamp === undefined
          ? a.sourceIndex - b.sourceIndex
          : 1;
      }
      if (b.publicationTimestamp === undefined) return -1;
      return b.publicationTimestamp - a.publicationTimestamp
        || a.sourceIndex - b.sourceIndex;
    })
    .map(({ post }) => post);
}

export function createInsightsDecomposedNodes(
  rootY: number,
  locale: Locale,
  zBase: number,
  sourcePosts?: readonly ColumnPost[],
): BuilderCanvasNode[] {
  const copy = copyByLocale[locale];
  const posts = resolveInsightsPosts(locale, sourcePosts);
  if (posts.length === 0) return [];

  const [featured, ...rest] = posts;
  const listItems = rest.slice(0, INSIGHTS_PAGE_SIZE);
  const pageCount = Math.max(1, Math.ceil(rest.length / 3));
  const hasPaginationControls = pageCount > 1;
  const listMinHeight = hasPaginationControls ? INSIGHTS_LIST_MIN_HEIGHT : INSIGHTS_LIST_NO_CONTROLS_MIN_HEIGHT;
  const listHeight = Math.max(
    listMinHeight,
    listItems.length > 0
      ? ((listItems.length - 1) * INSIGHTS_LIST_ITEM_PITCH) + INSIGHTS_LIST_ITEM_HEIGHT
      : listMinHeight,
  );
  const listTop = hasPaginationControls ? 54 : 10;
  const listWrapBottomPadding = 10;
  const listWrapHeight = listTop + listHeight + listWrapBottomPadding;
  const gridHeight = Math.max(430, listWrapHeight);
  const authorLabel =
    locale === 'ko' ? '증준외 변호사 검토' : locale === 'zh-hant' ? '曾雋崴律師審閱' : 'Reviewed by Wei Tseng';
  const authorHref = getAttorneyProfilePath(locale);
  const rootId = 'home-insights-root';
  const containerId = 'home-insights-container';
  const dividerId = 'home-insights-divider';
  const gridId = 'home-insights-grid';
  const featuredId = 'home-insights-featured';
  const listWrapId = 'home-insights-list-wrap';
  const listId = 'home-insights-list';

  const nodes: BuilderCanvasNode[] = [
    createHomeContainerNode({
      id: rootId,
      rect: { x: 0, y: rootY, width: HOME_STAGE_WIDTH, height: INSIGHTS_ROOT_HEIGHT },
      zIndex: zBase,
      label: 'home insights root',
      className: 'section section--gray',
      as: 'section',
      htmlId: 'insights',
      dataTone: 'light',
      variant: 'flat',
    }),
    createHomeContainerNode({
      id: containerId,
      parentId: rootId,
      rect: { x: 72, y: 48, width: 1136, height: INSIGHTS_ROOT_HEIGHT - 96 },
      zIndex: 0,
      label: 'home insights container',
      className: 'container',
    }),
    createHomeTextNode({
      id: 'home-insights-label',
      parentId: containerId,
      rect: { x: 0, y: 0, width: 180, height: 28 },
      zIndex: 0,
      text: copy.label,
      className: 'section-label',
      as: 'div',
      fontWeight: 'medium',
    }),
    createHomeTextNode({
      id: 'home-insights-title',
      parentId: containerId,
      rect: { x: 0, y: 34, width: 520, height: 48 },
      zIndex: 1,
      text: copy.title,
      className: 'section-title',
      as: 'h2',
    }),
    createHomeTextNode({
      id: 'home-insights-description',
      parentId: containerId,
      rect: { x: 0, y: 88, width: 720, height: 44 },
      zIndex: 2,
      text: copy.description,
      className: 'section-lede',
      as: 'p',
    }),
    createHomeContainerNode({
      id: dividerId,
      parentId: containerId,
      rect: { x: 0, y: 142, width: 1136, height: 20 },
      zIndex: 3,
      label: 'home insights divider',
      className: 'ornament-divider',
    }),
    createHomeContainerNode({
      id: 'home-insights-divider-mark',
      parentId: dividerId,
      rect: { x: 541, y: 4, width: 54, height: 12 },
      zIndex: 0,
      label: 'home insights divider mark',
      className: 'ornament',
    }),
    createHomeContainerNode({
      id: gridId,
      parentId: containerId,
      rect: { x: 0, y: 180, width: 1136, height: gridHeight },
      zIndex: 4,
      label: 'home insights grid',
      className: 'insights-grid',
    }),
    createHomeContainerNode({
      id: featuredId,
      parentId: gridId,
      rect: { x: 0, y: 0, width: 552, height: 430 },
      zIndex: 0,
      label: 'home insights featured',
      className: 'insights-featured',
      as: 'article',
    }),
    createHomeContainerNode({
      id: 'home-insights-featured-media',
      parentId: featuredId,
      rect: { x: 0, y: 0, width: 552, height: 230 },
      zIndex: 0,
      label: 'home insights featured media',
      className: 'insights-featured-media',
    }),
    createHomeImageNode({
      id: 'home-insights-featured-image',
      parentId: 'home-insights-featured-media',
      rect: { x: 0, y: 0, width: 552, height: 230 },
      zIndex: 0,
      src: featured.featuredImage,
      alt: featured.title,
    }),
    createHomeTextNode({
      id: 'home-insights-featured-category',
      parentId: 'home-insights-featured-media',
      rect: { x: 20, y: 20, width: 160, height: 24 },
      zIndex: 1,
      text: featured.categoryLabel,
      className: 'insights-category-badge',
      as: 'span',
      color: '#ffffff',
      fontWeight: 'medium',
    }),
    createHomeContainerNode({
      id: 'home-insights-featured-body',
      parentId: featuredId,
      rect: { x: 0, y: 230, width: 552, height: 200 },
      zIndex: 1,
      label: 'home insights featured body',
      className: 'insights-featured-body',
    }),
    createHomeContainerNode({
      id: 'home-insights-featured-meta',
      parentId: 'home-insights-featured-body',
      rect: { x: 0, y: 0, width: 512, height: 18 },
      zIndex: 0,
      label: 'home insights featured meta',
      className: 'insights-meta-row',
    }),
    createHomeTextNode({
      id: 'home-insights-featured-date',
      parentId: 'home-insights-featured-meta',
      rect: { x: 0, y: 0, width: 160, height: 18 },
      zIndex: 0,
      text: featured.dateDisplay || copy.dateFallback,
      className: 'insights-date',
      as: 'time',
    }),
    createHomeTextNode({
      id: 'home-insights-featured-readtime',
      parentId: 'home-insights-featured-meta',
      rect: { x: 424, y: 0, width: 88, height: 18 },
      zIndex: 1,
      text: featured.readTime,
      className: 'insights-readtime',
      as: 'span',
    }),
    createHomeButtonNode({
      id: 'home-insights-featured-byline',
      parentId: 'home-insights-featured-body',
      rect: { x: 0, y: 24, width: 200, height: 20 },
      zIndex: 1,
      label: authorLabel,
      href: authorHref,
      style: 'link',
      className: 'insights-byline',
      as: 'a',
    }),
    createHomeTextNode({
      id: 'home-insights-featured-title',
      parentId: 'home-insights-featured-body',
      rect: { x: 0, y: 50, width: 512, height: 54 },
      zIndex: 2,
      text: featured.title,
      className: 'insights-featured-title',
      as: 'h3',
    }),
    createHomeTextNode({
      id: 'home-insights-featured-summary',
      parentId: 'home-insights-featured-body',
      rect: { x: 0, y: 110, width: 512, height: 46 },
      zIndex: 3,
      text: featured.summary,
      className: 'insights-featured-summary',
      as: 'p',
    }),
    createHomeButtonNode({
      id: 'home-insights-featured-link',
      parentId: 'home-insights-featured-body',
      rect: { x: 0, y: 168, width: 180, height: 24 },
      zIndex: 4,
      label: `${copy.readMore} →`,
      href: `/${locale}/columns/${featured.slug}`,
      style: 'link',
      className: 'link-underline',
      as: 'a',
    }),
    createHomeContainerNode({
      id: listWrapId,
      parentId: gridId,
      rect: { x: INSIGHTS_LIST_WRAP_X, y: 0, width: INSIGHTS_LIST_WRAP_WIDTH, height: listWrapHeight },
      zIndex: 1,
      label: 'home insights list wrap',
      className: 'insights-list-wrap',
    }),
    createHomeContainerNode({
      id: listId,
      parentId: listWrapId,
      rect: { x: INSIGHTS_LIST_INSET_X, y: listTop, width: INSIGHTS_LIST_WIDTH, height: listHeight },
      zIndex: 1,
      label: 'home insights list',
      className: 'insights-list',
    }),
  ];

  if (hasPaginationControls) {
    nodes.push(
      createHomeContainerNode({
        id: 'home-insights-controls',
        parentId: listWrapId,
        rect: { x: INSIGHTS_LIST_INSET_X, y: 10, width: INSIGHTS_LIST_WIDTH, height: 32 },
        zIndex: 0,
        label: 'home insights controls',
        className: 'insights-controls',
      }),
      createHomeButtonNode({
        id: 'home-insights-prev',
        parentId: 'home-insights-controls',
        rect: { x: 0, y: 0, width: 96, height: 32 },
        zIndex: 0,
        label: `‹ ${copy.prevLabel}`,
        href: '#insights',
        style: 'secondary',
        className: 'insights-nav-btn',
        as: 'button',
      }),
      createHomeTextNode({
        id: 'home-insights-page-indicator',
        parentId: 'home-insights-controls',
        rect: { x: 166, y: 6, width: 196, height: 20 },
        zIndex: 1,
        text: `1 / ${pageCount}`,
        className: 'insights-page-indicator',
        as: 'span',
      }),
      createHomeButtonNode({
        id: 'home-insights-next',
        parentId: 'home-insights-controls',
        rect: { x: 432, y: 0, width: 96, height: 32 },
        zIndex: 2,
        label: `${copy.nextLabel} ›`,
        href: '#insights',
        style: 'secondary',
        className: 'insights-nav-btn',
        as: 'button',
      }),
    );
  }

  listItems.forEach((post, index) => {
    const itemId = `home-insights-item-${index}`;
    const thumbId = `${itemId}-thumb`;
    const copyId = `${itemId}-copy`;
    const metaId = `${itemId}-meta`;
    const itemY = index * INSIGHTS_LIST_ITEM_PITCH;

    nodes.push(
      createHomeContainerNode({
        id: itemId,
        parentId: listId,
        rect: { x: 0, y: itemY, width: INSIGHTS_LIST_WIDTH, height: INSIGHTS_LIST_ITEM_HEIGHT },
        zIndex: index,
        label: `home insights list item ${index + 1}`,
        className: 'insights-list-item',
        as: 'article',
      }),
      createHomeContainerNode({
        id: thumbId,
        parentId: itemId,
        rect: { x: 0, y: 0, width: 104, height: 78 },
        zIndex: 0,
        label: `home insights thumb ${index + 1}`,
        className: 'insights-list-thumb',
      }),
      createHomeImageNode({
        id: `${itemId}-image`,
        parentId: thumbId,
        rect: { x: 0, y: 0, width: 104, height: 78 },
        zIndex: 0,
        src: post.featuredImage,
        alt: post.title,
      }),
      createHomeTextNode({
        id: `${itemId}-badge`,
        parentId: thumbId,
        rect: { x: 8, y: 52, width: 88, height: 18 },
        zIndex: 1,
        text: post.categoryLabel,
        className: 'insights-category-badge insights-category-badge--compact',
        as: 'span',
        color: '#ffffff',
      }),
      createHomeContainerNode({
        id: copyId,
        parentId: itemId,
        rect: { x: INSIGHTS_LIST_COPY_X, y: 0, width: INSIGHTS_LIST_COPY_WIDTH, height: 108 },
        zIndex: 1,
        label: `home insights copy ${index + 1}`,
        className: 'insights-list-copy',
      }),
      createHomeContainerNode({
        id: metaId,
        parentId: copyId,
        rect: { x: 0, y: 0, width: INSIGHTS_LIST_COPY_WIDTH, height: 18 },
        zIndex: 0,
        label: `home insights meta ${index + 1}`,
        className: 'insights-meta-row',
      }),
      createHomeTextNode({
        id: `${itemId}-date`,
        parentId: metaId,
        rect: { x: 0, y: 0, width: 120, height: 18 },
        zIndex: 0,
        text: post.dateDisplay || copy.dateFallback,
        className: 'insights-date',
        as: 'span',
      }),
      createHomeTextNode({
        id: `${itemId}-readtime`,
        parentId: metaId,
        rect: { x: INSIGHTS_LIST_COPY_WIDTH - INSIGHTS_LIST_READTIME_WIDTH, y: 0, width: INSIGHTS_LIST_READTIME_WIDTH, height: 18 },
        zIndex: 1,
        text: post.readTime,
        className: 'insights-readtime',
        as: 'span',
      }),
      createHomeButtonNode({
        id: `${itemId}-byline`,
        parentId: copyId,
        rect: { x: 0, y: 20, width: 190, height: 18 },
        zIndex: 1,
        label: authorLabel,
        href: authorHref,
        style: 'link',
        className: 'insights-byline',
        as: 'a',
      }),
      createHomeTextNode({
        id: `${itemId}-title`,
        parentId: copyId,
        rect: { x: 0, y: 42, width: INSIGHTS_LIST_COPY_WIDTH, height: 38 },
        zIndex: 2,
        text: post.title,
        className: 'insights-list-title',
        as: 'h4',
      }),
      createHomeTextNode({
        id: `${itemId}-summary`,
        parentId: copyId,
        rect: { x: 0, y: 84, width: INSIGHTS_LIST_COPY_WIDTH, height: 24 },
        zIndex: 3,
        text: post.summary,
        className: 'insights-list-summary',
        as: 'p',
      }),
    );
  });

  nodes.push(
    createHomeButtonNode({
      id: 'home-insights-view-all',
      parentId: containerId,
      rect: { x: 458, y: 180 + gridHeight + 28, width: 220, height: 38 },
      zIndex: 5,
      label: `${copy.viewAll} →`,
      href: `/${locale}/columns`,
      style: 'outline',
      className: 'button button--outline',
      as: 'a',
    }),
  );

  return nodes;
}
