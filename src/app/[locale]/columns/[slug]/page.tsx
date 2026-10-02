import ColumnDetailView, { type ColumnDetailViewProps } from './ColumnDetailView';
import TrafficColumnView from './TrafficColumnView';
import type { Metadata } from 'next';
import { trafficHubCopy } from '@/data/traffic-hub';
import { resolveTrafficSubject } from '@/lib/traffic-collection';
import { isTrafficDiagramId, isTrafficDiagramLocale, splitColumnContentAfterHeading } from '@/data/traffic-diagrams';
import { notFound } from 'next/navigation';
import { prioritizeRecommendedColumns } from '@/lib/column-audience';
import {
  AI_COLUMN_ATTORNEY_HEADING,
  buildAiAuthorJsonLd,
  getAiAuthorCopy,
  isAiAuthoredColumn,
} from '@/lib/ai-authored-columns';
import { normalizeSiteLocale, type SiteLocale, toBuilderLocale } from '@/lib/locales';
import { getAttorneyProfilePath } from '@/data/attorney-profiles';
import { getAllColumnPosts, getColumnPost, getColumnPublicationDate, parseColumnPublicationDate } from '@/lib/columns';
import { columnAlternateLocales } from '@/lib/column-language-links';
import { getAllColumnPostsIncludingBlob } from '@/lib/consultation/columns-blob-reader';
import { extractColumnToc } from '@/lib/column-toc';
import {
  isBuilderDynamicTemplateBlockVisible,
  readBuilderDynamicTemplatePublishedBlockVisibility,
} from '@/lib/builder/dynamic-template-drafts';
import { resolveTypography } from '@/lib/builder/columns/typography';
import type { ColumnTypography } from '@/lib/builder/columns/types';
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildFaqJsonLd, buildSeoMetadata } from '@/lib/seo';
import { isGuidanceLocale4 } from '@/lib/public-guidance';
import { guidancePublicPath } from '@/lib/public-guidance';
import { guidanceContent } from '@/data/international-guidance-content';

export const dynamic = 'force-dynamic';

const copy: Record<SiteLocale, {
  backLabel: string;
  attorneyHeading: string;
  guideTitle: string;
  consultationTitle: string;
  consultationText: string;
  consultationButton: string;
  faqHeading: string;
  tocLabel: string;
}> = {
  ko: {
    backLabel: '← 칼럼 목록으로',
    attorneyHeading: '이 글 검토 변호사',
    guideTitle: '함께 보는 주제',
    consultationTitle: '상담 예약',
    consultationText: '대만 법률 관련 궁금한 점이 있으시면 언제든 문의해 주세요.',
    consultationButton: '문의하기',
    faqHeading: '자주 묻는 질문',
    tocLabel: '이 글의 목차',
  },
  'zh-hant': {
    backLabel: '← 返回專欄列表',
    attorneyHeading: '審閱本文的律師',
    guideTitle: '延伸主題',
    consultationTitle: '預約諮詢',
    consultationText: '如有台灣法律問題，歡迎來信諮詢。',
    consultationButton: '電子郵件諮詢',
    faqHeading: '常見問題',
    tocLabel: '本文目錄',
  },
  en: {
    backLabel: '← Back to Insights',
    attorneyHeading: 'Reviewing Attorney',
    guideTitle: 'Related Topics',
    consultationTitle: 'Book Consultation',
    consultationText: 'If you have any questions about Taiwan law, feel free to contact us.',
    consultationButton: 'Contact Us',
    faqHeading: 'Frequently Asked Questions',
    tocLabel: 'In this article',
  },
  ja: {
    backLabel: '← コラム一覧へ',
    attorneyHeading: '本稿の監修弁護士',
    guideTitle: '関連トピック',
    consultationTitle: '相談予約',
    consultationText: '台湾法務についてご不明点があれば、お気軽にお問い合わせください。',
    consultationButton: 'お問い合わせ',
    faqHeading: 'よくある質問',
    tocLabel: 'この記事の目次',
  },
};

export async function generateMetadata(props: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const params = await props.params;

  if (isGuidanceLocale4(params.locale)) {
    const post = getColumnPost(params.slug, params.locale);
    if (!post) return {};
    return buildSeoMetadata({
      locale: params.locale,
      title: post.seoTitle || post.title,
      description: post.summary,
      path: `/columns/${post.slug}`,
      keywords: [post.title, post.categoryLabel, 'Taiwan law'],
      images: post.featuredImageAlt ? { url: post.socialImage || post.featuredImage, alt: post.featuredImageAlt } : post.socialImage || post.featuredImage,
      type: 'article',
      noindex: false,
      alternateLocales: columnAlternateLocales(post.slug, params.locale),
      // Single-locale columns have no English twin for x-default.
      xDefaultWithinCluster: true,
    });
  }

  const locale = normalizeSiteLocale(params.locale);

  // Try file-based first (fast, sync), then fall back to blob-aware reader.
  // Japanese is file-backed only (no builder locale contract for ja).
  let post = getColumnPost(params.slug, locale);
  if (!post && locale !== 'ja') {
    const allPosts = await getAllColumnPostsIncludingBlob(toBuilderLocale(locale));
    post = allPosts.find((p) => p.slug === params.slug);
  }

  if (!post) {
    return {};
  }

  return buildSeoMetadata({
    locale,
    title: post.seoTitle || post.title,
    description: post.summary,
    path: `/columns/${post.slug}`,
    keywords: [
      post.title,
      post.categoryLabel,
      locale === 'ko'
        ? '대만 법률'
        : locale === 'zh-hant'
          ? '台灣法律'
          : locale === 'ja'
            ? '台湾法律'
            : 'Taiwan law',
    ],
    images: post.featuredImageAlt ? { url: post.socialImage || post.featuredImage, alt: post.featuredImageAlt } : post.socialImage || post.featuredImage,
    type: 'article',
    noindex: false,
    alternateLocales: columnAlternateLocales(post.slug, locale),
    xDefaultWithinCluster: true,
  });
}

export default async function ColumnDetailPage(props: { params: Promise<{ locale: string; slug: string }> }) {
  const params = await props.params;
  const rawLocale = params.locale;
  const guidanceLocale = isGuidanceLocale4(rawLocale) ? rawLocale : null;
  const locale: SiteLocale = guidanceLocale ? 'en' : normalizeSiteLocale(rawLocale);
  const urlLocale = guidanceLocale ?? locale;

  // Get all posts including Blob — single source of truth for content + prev/next
  // Japanese + new four: file-backed only (no builder/Blob contract).
  const allPosts =
    locale === 'ja' || guidanceLocale
      ? getAllColumnPosts(urlLocale)
      : await getAllColumnPostsIncludingBlob(toBuilderLocale(locale));
  const post = allPosts.find((p) => p.slug === params.slug);
  if (!post) return notFound();
  const modifiedDate = parseColumnPublicationDate(post.date);
  const publicationDate = getColumnPublicationDate(post);
  const showTrafficUpdate = urlLocale in trafficHubCopy
    && resolveTrafficSubject(post) !== null
    && Boolean(modifiedDate && publicationDate && modifiedDate !== publicationDate);

  const currentIndex = allPosts.indexOf(post);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  /*
   * Guidance locales render this shell with `locale` coerced to 'en' above, so
   * every label came out English under a Vietnamese/Thai/Indonesian/Filipino
   * article — "Back to Insights", "Contact Us", "Frequently Asked Questions".
   * The content pack already publishes reviewed wording for three of the seven,
   * so use those. The remaining four (attorneyHeading, guideTitle,
   * consultationTitle, consultationText) have no equivalent in the pack and are
   * left in English rather than invented here — they need the translation lane.
   */
  const guidancePack = guidanceLocale ? guidanceContent[guidanceLocale] : null;
  const t = guidancePack
    ? {
        ...copy.en,
        backLabel: `← ${guidancePack.nav.columns}`,
        faqHeading: guidancePack.nav.faq,
        consultationButton: guidancePack.contactCta,
      }
    : copy[locale];
  // Guidance locales borrow the English shell labels, so they get no TOC label
  // (and no TOC) until the translation lane supplies one.
  const tocEntries = guidancePack ? [] : extractColumnToc(post.content);
  const diagramVideo = post.diagramVideo && isTrafficDiagramId(post.diagramVideo.id) && isTrafficDiagramLocale(urlLocale)
    ? { id: post.diagramVideo.id, locale: urlLocale }
    : null;
  const diagramSplit = diagramVideo && post.diagramVideo?.afterHeading
    ? splitColumnContentAfterHeading(post.content, post.diagramVideo.afterHeading)
    : null;
  const authorName =
    locale === 'ko'
      ? '증준외 변호사'
      : locale === 'zh-hant'
        ? '曾雋崴律師'
        : locale === 'ja'
          ? '曾雋崴弁護士'
          : 'Attorney Wei Tseng';
  // AI-written columns: no attorney byline or review claim; the Legal AI
  // Assistant author box closes the article instead.
  const aiAuthored = isAiAuthoredColumn(post);
  const aiAuthor = aiAuthored ? getAiAuthorCopy(urlLocale) : null;
  const attorneyHeading = aiAuthored
    ? AI_COLUMN_ATTORNEY_HEADING[locale] ?? AI_COLUMN_ATTORNEY_HEADING.en
    : t.attorneyHeading;
  const authorProfilePath = getAttorneyProfilePath(locale);
  const authorHref = guidanceLocale
    ? guidancePublicPath(guidanceLocale, 'lawyers')
    : authorProfilePath;
  const guideLinks =
    guidanceLocale
      ? [
          { href: guidancePublicPath(guidanceLocale, 'services'), label: guidanceContent[guidanceLocale].nav.services },
          { href: guidancePublicPath(guidanceLocale, 'lawyers'), label: guidanceContent[guidanceLocale].nav.lawyers },
        ]
      : locale === 'ja'
      ? post.category === 'formation'
        ? [
            { href: '/ja/services#investment', label: '台湾投資・会社設立' },
            { href: '/ja/lawyers/wei-tseng', label: '曾雋崴弁護士' },
          ]
        : post.category === 'case'
          ? [
              { href: '/ja/services#civil', label: '台湾の民事紛争' },
              { href: '/ja/lawyers/wei-tseng', label: '曾雋崴弁護士' },
            ]
          : [
              { href: '/ja/services', label: '取扱業務' },
              { href: '/ja/lawyers/wei-tseng', label: '曾雋崴弁護士' },
            ]
      : post.category === 'formation'
        ? [
            { href: `/${locale}/taiwan-company-setup-lawyer`, label: locale === 'ko' ? '대만 회사설립' : locale === 'zh-hant' ? '台灣公司設立' : 'Taiwan Company Setup' },
            { href: `/${locale}/taiwan-lawyer`, label: locale === 'ko' ? '대만 변호사' : locale === 'zh-hant' ? '台灣律師' : 'Taiwan Lawyer' },
          ]
        : post.category === 'case'
          ? [
              { href: `/${locale}/taiwan-litigation-lawyer`, label: locale === 'ko' ? '대만 소송' : locale === 'zh-hant' ? '台灣訴訟' : 'Taiwan Litigation' },
              { href: `/${locale}/taiwan-lawyer`, label: locale === 'ko' ? '대만 변호사' : locale === 'zh-hant' ? '台灣律師' : 'Taiwan Lawyer' },
            ]
          : [
              { href: `/${locale}/taiwan-lawyer`, label: locale === 'ko' ? '대만 변호사' : locale === 'zh-hant' ? '台灣律師' : 'Taiwan Lawyer' },
              { href: `/${locale}/taiwan-company-setup-lawyer`, label: locale === 'ko' ? '대만 회사설립' : locale === 'zh-hant' ? '台灣公司設立' : 'Taiwan Company Setup' },
            ];

  // "Recommended for you" at the end: static order = same topic (newest
  // first), then this locale's recommended columns, then the rest. The client
  // may reorder by session interests (sessionStorage only).
  const otherPosts = prioritizeRecommendedColumns(urlLocale, allPosts.filter((p) => p.slug !== post.slug));
  const isTrafficColumn = resolveTrafficSubject(post) !== null;
  const recommendedItems = (isTrafficColumn ? otherPosts.filter((p) => resolveTrafficSubject(p) !== null) : [
    ...otherPosts.filter((p) => p.topic && p.topic === post.topic),
    ...otherPosts.filter((p) => !p.topic || p.topic !== post.topic),
  ])
    .slice(0, 15)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      featuredImage: p.featuredImage,
      topic: p.topic,
      dateDisplay: p.dateDisplay || p.date,
      readTime: p.readTime,
    }));

  const prevLabel = locale === 'ko' ? '← 이전 칼럼' : locale === 'zh-hant' ? '← 上一篇' : locale === 'ja' ? '← 前のコラム' : '← Previous';
  const nextLabel = locale === 'ko' ? '다음 칼럼 →' : locale === 'zh-hant' ? '下一篇 →' : locale === 'ja' ? '次のコラム →' : 'Next →';

  // FAQ (FAQPage schema + plain-text "자주 묻는 질문" section). Only the two
  // indexed, hand-authored locales (ko / zh-hant) carry an `faq` array; the
  // en route overlays ko frontmatter onto translated copy, so we skip it there
  // to avoid rendering Korean answers under an English heading.
  const faqItems = post.faq ?? [];
  // File-backed EN columns now carry translated FAQ; render for all locales with FAQ data.
  const showFaq = faqItems.length > 0;
  const faqJsonLd = showFaq ? buildFaqJsonLd(faqItems, locale) : null;

  const templateVisibility = await readBuilderDynamicTemplatePublishedBlockVisibility(
    'columns.item-template',
    toBuilderLocale(locale)
  );
  const showHero = isBuilderDynamicTemplateBlockVisible(templateVisibility, 'columns.item.hero');
  const showBody = isBuilderDynamicTemplateBlockVisible(templateVisibility, 'columns.item.body');
  const showSeo = isBuilderDynamicTemplateBlockVisible(templateVisibility, 'columns.item.seo');

  const typography = resolveTypography(
    toBuilderLocale(locale),
    (post.typography as ColumnTypography | undefined)
      ?? (post.typographyPresetId
        ? { presetId: post.typographyPresetId } as ColumnTypography
        : undefined),
  );

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(locale, [
    { name: locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : locale === 'ja' ? 'ホーム' : 'Home', path: `/${urlLocale}` },
    { name: locale === 'ko' ? '칼럼' : locale === 'zh-hant' ? '專欄' : locale === 'ja' ? 'コラム' : 'Insights', path: `/${urlLocale}/columns` },
    { name: post.title, path: `/${urlLocale}/columns/${post.slug}` },
  ]);
  const articleJsonLd = buildArticleJsonLd({
    locale: urlLocale,
    title: post.title,
    description: post.summary,
    path: `/${urlLocale}/columns/${post.slug}`,
    image: post.featuredImage,
    datePublished: post.publicationDate || post.date,
    dateModified: post.date,
    authorName: aiAuthor ? aiAuthor.label : authorName,
    authorUrl: authorHref,
    authorEntity: aiAuthored ? buildAiAuthorJsonLd(urlLocale) : undefined,
    authorSameAs: [
      'https://www.hoveringlaw.com.tw/en/wei.html',
      'https://www.wei-wei-lawyer.com/lawyertseng',
      'https://www.youtube.com/@weilawyer',
      'https://blog.naver.com/wei_lawyer/223461663913',
    ],
    authorAlternateNames: ['증준외', '曾雋崴', 'Wei Tseng'],
    articleSection: post.categoryLabel,
  });
  const viewProps: ColumnDetailViewProps = {
    locale,
    urlLocale,
    post: {
      slug: post.slug,
      title: post.title,
      categoryLabel: post.categoryLabel,
      featuredImage: post.featuredImage,
      featuredImageAlt: post.featuredImageAlt,
      featuredImageCaption: post.featuredImageCaption,
      dateDisplay: post.dateDisplay,
      date: post.date,
      readTime: post.readTime,
      content: showBody && !diagramSplit ? post.content : '',
      topic: post.topic,
    },
    prevPost: showBody && prevPost ? { slug: prevPost.slug, title: prevPost.title } : null,
    nextPost: showBody && nextPost ? { slug: nextPost.slug, title: nextPost.title } : null,
    t,
    tocEntries: showBody ? tocEntries : [],
    diagramVideo: showBody ? diagramVideo : null,
    diagramSplit: showBody ? diagramSplit : null,
    authorName,
    authorHref,
    aiAuthored,
    aiAuthor: aiAuthor ? { label: aiAuthor.label } : null,
    attorneyHeading,
    guideLinks: showBody ? guideLinks : [],
    recommendedItems: showBody ? recommendedItems : [],
    isTrafficColumn,
    showTrafficUpdate,
    modifiedDate,
    prevLabel,
    nextLabel,
    faqItems: showBody ? faqItems : [],
    showFaq,
    faqJsonLd: showSeo ? faqJsonLd : null,
    breadcrumbJsonLd: showSeo ? breadcrumbJsonLd : {},
    articleJsonLd: showSeo ? articleJsonLd : {},
    showHero,
    showBody,
    showSeo,
    typography,
  };
  // Traffic columns hydrate a synchronous view from complete public data, while
  // retaining server HTML and leaving other columns on the server-view path.
  return isTrafficColumn ? <TrafficColumnView {...viewProps} /> : <ColumnDetailView {...viewProps} />;
}
