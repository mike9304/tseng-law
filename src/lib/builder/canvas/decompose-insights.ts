import type { BuilderCanvasNode } from './types';
import type { Locale } from '@/lib/locales';
import { getAttorneyProfilePath } from '@/data/attorney-profiles';
import { getAllColumnPosts } from '@/lib/columns';
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

const INSIGHTS_ROOT_HEIGHT = 1200;

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

function resolveInsightsPosts(locale: Locale): HomeInsightPost[] {
  return getAllColumnPosts(locale).map((post) => ({
    slug: post.slug,
    title: post.title,
    dateDisplay: post.dateDisplay || post.date || '',
    readTime: post.readTime || '',
    categoryLabel: post.categoryLabel,
    featuredImage: post.featuredImage,
    summary: post.summary,
  }));
}

export function createInsightsDecomposedNodes(
  rootY: number,
  locale: Locale,
  zBase: number,
): BuilderCanvasNode[] {
  const copy = copyByLocale[locale];
  const posts = resolveInsightsPosts(locale);
  if (posts.length === 0) return [];

  const [featured, ...rest] = posts;
  const listItems = rest.slice(0, 3);
  const pageCount = Math.max(1, Math.ceil(rest.length / 3));
  const authorLabel =
    locale === 'ko' ? '증준외 변호사 검토' : locale === 'zh-hant' ? '曾俊瑋律師審閱' : 'Reviewed by Wei Tseng';
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
    }),
    createHomeContainerNode({
      id: containerId,
      parentId: rootId,
      rect: { x: 72, y: 88, width: 1136, height: 1040 },
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
      rect: { x: 0, y: 40, width: 520, height: 54 },
      zIndex: 1,
      text: copy.title,
      className: 'section-title',
      as: 'h2',
    }),
    createHomeTextNode({
      id: 'home-insights-description',
      parentId: containerId,
      rect: { x: 0, y: 104, width: 720, height: 58 },
      zIndex: 2,
      text: copy.description,
      className: 'section-lede',
      as: 'p',
    }),
    createHomeContainerNode({
      id: dividerId,
      parentId: containerId,
      rect: { x: 0, y: 182, width: 1136, height: 24 },
      zIndex: 3,
      label: 'home insights divider',
      className: 'ornament-divider',
    }),
    createHomeContainerNode({
      id: 'home-insights-divider-mark',
      parentId: dividerId,
      rect: { x: 541, y: 6, width: 54, height: 12 },
      zIndex: 0,
      label: 'home insights divider mark',
      className: 'ornament',
    }),
    createHomeContainerNode({
      id: gridId,
      parentId: containerId,
      rect: { x: 0, y: 238, width: 1136, height: 740 },
      zIndex: 4,
      label: 'home insights grid',
      className: 'insights-grid reveal-stagger',
    }),
    createHomeContainerNode({
      id: featuredId,
      parentId: gridId,
      rect: { x: 0, y: 0, width: 620, height: 720 },
      zIndex: 0,
      label: 'home insights featured',
      className: 'insights-featured',
      as: 'article',
    }),
    createHomeContainerNode({
      id: 'home-insights-featured-media',
      parentId: featuredId,
      rect: { x: 0, y: 0, width: 620, height: 360 },
      zIndex: 0,
      label: 'home insights featured media',
      className: 'insights-featured-media',
    }),
    createHomeImageNode({
      id: 'home-insights-featured-image',
      parentId: 'home-insights-featured-media',
      rect: { x: 0, y: 0, width: 620, height: 360 },
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
      rect: { x: 0, y: 360, width: 620, height: 360 },
      zIndex: 1,
      label: 'home insights featured body',
      className: 'insights-featured-body',
    }),
    createHomeContainerNode({
      id: 'home-insights-featured-meta',
      parentId: 'home-insights-featured-body',
      rect: { x: 0, y: 0, width: 560, height: 18 },
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
    } as never),
    createHomeTextNode({
      id: 'home-insights-featured-readtime',
      parentId: 'home-insights-featured-meta',
      rect: { x: 472, y: 0, width: 88, height: 18 },
      zIndex: 1,
      text: featured.readTime,
      className: 'insights-readtime',
      as: 'span',
    }),
    createHomeButtonNode({
      id: 'home-insights-featured-byline',
      parentId: 'home-insights-featured-body',
      rect: { x: 0, y: 34, width: 200, height: 20 },
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
      rect: { x: 0, y: 72, width: 560, height: 82 },
      zIndex: 2,
      text: featured.title,
      className: 'insights-featured-title',
      as: 'h3',
    }),
    createHomeTextNode({
      id: 'home-insights-featured-summary',
      parentId: 'home-insights-featured-body',
      rect: { x: 0, y: 166, width: 560, height: 108 },
      zIndex: 3,
      text: featured.summary,
      className: 'insights-featured-summary',
      as: 'p',
    }),
    createHomeButtonNode({
      id: 'home-insights-featured-link',
      parentId: 'home-insights-featured-body',
      rect: { x: 0, y: 292, width: 180, height: 24 },
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
      rect: { x: 650, y: 0, width: 486, height: 720 },
      zIndex: 1,
      label: 'home insights list wrap',
      className: 'insights-list-wrap',
    }),
    createHomeContainerNode({
      id: 'home-insights-controls',
      parentId: listWrapId,
      rect: { x: 20, y: 16, width: 446, height: 32 },
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
      rect: { x: 156, y: 6, width: 134, height: 20 },
      zIndex: 1,
      text: `1 / ${pageCount}`,
      className: 'insights-page-indicator',
      as: 'span',
    }),
    createHomeButtonNode({
      id: 'home-insights-next',
      parentId: 'home-insights-controls',
      rect: { x: 350, y: 0, width: 96, height: 32 },
      zIndex: 2,
      label: `${copy.nextLabel} ›`,
      href: '#insights',
      style: 'secondary',
      className: 'insights-nav-btn',
      as: 'button',
    }),
    createHomeContainerNode({
      id: listId,
      parentId: listWrapId,
      rect: { x: 20, y: 72, width: 446, height: 620 },
      zIndex: 1,
      label: 'home insights list',
      className: 'insights-list',
    }),
  ];

  listItems.forEach((post, index) => {
    const itemId = `home-insights-item-${index}`;
    const thumbId = `${itemId}-thumb`;
    const copyId = `${itemId}-copy`;
    const metaId = `${itemId}-meta`;
    const itemY = index * 196;

    nodes.push(
      createHomeContainerNode({
        id: itemId,
        parentId: listId,
        rect: { x: 0, y: itemY, width: 446, height: 176 },
        zIndex: index,
        label: `home insights list item ${index + 1}`,
        className: 'insights-list-item',
        as: 'article',
      }),
      createHomeContainerNode({
        id: thumbId,
        parentId: itemId,
        rect: { x: 0, y: 0, width: 128, height: 96 },
        zIndex: 0,
        label: `home insights thumb ${index + 1}`,
        className: 'insights-list-thumb',
      }),
      createHomeImageNode({
        id: `${itemId}-image`,
        parentId: thumbId,
        rect: { x: 0, y: 0, width: 128, height: 96 },
        zIndex: 0,
        src: post.featuredImage,
        alt: post.title,
      }),
      createHomeTextNode({
        id: `${itemId}-badge`,
        parentId: thumbId,
        rect: { x: 12, y: 64, width: 104, height: 20 },
        zIndex: 1,
        text: post.categoryLabel,
        className: 'insights-category-badge insights-category-badge--compact',
        as: 'span',
        color: '#ffffff',
      }),
      createHomeContainerNode({
        id: copyId,
        parentId: itemId,
        rect: { x: 148, y: 0, width: 298, height: 150 },
        zIndex: 1,
        label: `home insights copy ${index + 1}`,
        className: 'insights-list-copy',
      }),
      createHomeContainerNode({
        id: metaId,
        parentId: copyId,
        rect: { x: 0, y: 0, width: 298, height: 18 },
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
        rect: { x: 220, y: 0, width: 78, height: 18 },
        zIndex: 1,
        text: post.readTime,
        className: 'insights-readtime',
        as: 'span',
      }),
      createHomeButtonNode({
        id: `${itemId}-byline`,
        parentId: copyId,
        rect: { x: 0, y: 24, width: 190, height: 18 },
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
        rect: { x: 0, y: 50, width: 298, height: 46 },
        zIndex: 2,
        text: post.title,
        className: 'insights-list-title link-underline',
        as: 'h4',
      }),
      createHomeTextNode({
        id: `${itemId}-summary`,
        parentId: copyId,
        rect: { x: 0, y: 104, width: 298, height: 48 },
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
      rect: { x: 458, y: 1008, width: 220, height: 38 },
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
