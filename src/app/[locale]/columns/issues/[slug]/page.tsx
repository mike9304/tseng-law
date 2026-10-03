import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AiAuthorBox from '@/components/AiAuthorBox';
import AttorneyAuthorityCard from '@/components/AttorneyAuthorityCard';
import ColumnContent from '@/components/ColumnContent';
import ColumnGeneratedVideo from '@/components/ColumnGeneratedVideo';
import { resolveTrafficSubject } from '@/lib/traffic-collection';
import ColumnToc from '@/components/ColumnToc';
import JsonLd from '@/components/JsonLd';
import RecommendedForYou from '@/components/RecommendedForYou';
import { AI_COLUMN_ATTORNEY_HEADING } from '@/lib/ai-authored-columns';
import { getAllIssuePosts, isIssueBoardLocale, type ColumnPost, type IssueBoardLocale } from '@/lib/columns';
import { extractColumnToc } from '@/lib/column-toc';
import { getConsultationPublicMailto, CONSULTATION_EMAIL } from '@/lib/consultation/public-contact';
import { guidancePublicPath } from '@/lib/public-guidance';
import { guidanceContent } from '@/data/international-guidance-content';
import { issueBoardCopy, issueBoardPath } from '@/data/issue-board';
import type { SiteLocale } from '@/lib/locales';
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildFaqJsonLd, buildSeoMetadata } from '@/lib/seo';
import styles from '../../[slug]/ColumnDetail.module.css';
import zhStyles from '../../[slug]/ZhHantColumnDetail.module.css';
import enStyles from '../../[slug]/EnColumnDetail.module.css';
import EnPageShell from '@/components/en-design/EnPageShell';
import boardStyles from '@/components/IssueBoard.module.css';

export const dynamic = 'force-dynamic';

const MIN_TOC_SECTIONS = 3;

/** Shell (labels, mailto template, attorney card) locale; vi borrows en like other guidance pages. */
function shellLocale(locale: IssueBoardLocale): SiteLocale {
  return locale === 'vi' ? 'en' : locale;
}

type GuideLink = { href: string; label: string };

/** Practice-area links chosen by topic (not category), per the issue-board advice. */
function guideLinksFor(locale: IssueBoardLocale, post: ColumnPost): GuideLink[] {
  if (locale === 'vi') {
    return [
      { href: guidancePublicPath('vi', 'services'), label: guidanceContent.vi.nav.services },
      { href: guidancePublicPath('vi', 'lawyers'), label: guidanceContent.vi.nav.lawyers },
      { href: '/vi/columns', label: guidanceContent.vi.nav.columns },
    ];
  }
  if (locale === 'ja') {
    const service = post.topic === 'company' || post.topic === 'tax'
      ? { href: '/ja/services#investment', label: '台湾投資・会社設立' }
      : post.topic === 'litigation'
        ? { href: '/ja/services#civil', label: '台湾の民事紛争' }
        : { href: '/ja/services', label: '取扱業務' };
    return [service, { href: '/ja/lawyers/wei-tseng', label: '曾雋崴弁護士' }, { href: '/ja/columns', label: '実務コラム' }];
  }
  const label = (ko: string, zh: string, en: string) => (locale === 'ko' ? ko : locale === 'zh-hant' ? zh : en);
  const lawyer = { href: `/${locale}/taiwan-lawyer`, label: label('대만 변호사', '台灣律師', 'Taiwan Lawyer') };
  const service = post.topic === 'litigation'
    ? { href: `/${locale}/taiwan-litigation-lawyer`, label: label('대만 소송', '台灣訴訟', 'Taiwan Litigation') }
    : post.topic === 'company' || post.topic === 'tax'
      ? { href: `/${locale}/taiwan-company-setup-lawyer`, label: label('대만 회사설립', '台灣公司設立', 'Taiwan Company Setup') }
      : null;
  const expert = { href: `/${locale}/columns`, label: issueBoardCopy[locale].expertTab };
  return service ? [service, lawyer, expert] : [lawyer, expert];
}

async function resolve(props: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await props.params;
  if (!isIssueBoardLocale(locale)) return null;
  const posts = getAllIssuePosts(locale);
  const post = posts.find((candidate) => candidate.slug === slug);
  return post ? { locale, posts, post } : null;
}

export async function generateMetadata(props: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const resolved = await resolve(props);
  if (!resolved) return {};
  const { locale, post } = resolved;
  // Written natively for one country: self-canonical, no hreflang cluster, no x-default.
  return buildSeoMetadata({
    locale,
    title: post.seoTitle || post.title,
    description: post.summary,
    path: `/columns/issues/${post.slug}`,
    keywords: [post.title, issueBoardCopy[locale].label],
    images: post.featuredImage,
    type: 'article',
    alternateLocales: [locale],
    xDefaultWithinCluster: true,
  });
}

export default async function IssueColumnPage(props: { params: Promise<{ locale: string; slug: string }> }) {
  const resolved = await resolve(props);
  if (!resolved) notFound();
  const { locale, posts, post } = resolved;
  const t = issueBoardCopy[locale];
  const shell = shellLocale(locale);
  const boardPath = issueBoardPath(locale);
  const articlePath = `${boardPath}/${post.slug}`;
  const tocEntries = locale === 'vi' ? [] : extractColumnToc(post.content);
  const faqItems = post.faq ?? [];
  const faqJsonLd = faqItems.length > 0 ? buildFaqJsonLd(faqItems, locale) : null;
  const guideLinks = guideLinksFor(locale, post);

  const index = posts.indexOf(post);
  const prevPost = index > 0 ? posts[index - 1] : null;
  const nextPost = index >= 0 && index < posts.length - 1 ? posts[index + 1] : null;

  // Newest first; same topic first. Issue board only (links stay on the board).
  const others = posts.filter((candidate) => candidate.slug !== post.slug);
  const recommendedItems = [
    ...others.filter((candidate) => candidate.topic && candidate.topic === post.topic),
    ...others.filter((candidate) => !candidate.topic || candidate.topic !== post.topic),
  ]
    .slice(0, 15)
    .map((candidate) => ({
      slug: candidate.slug,
      title: candidate.title,
      featuredImage: candidate.featuredImage,
      topic: candidate.topic,
      dateDisplay: candidate.dateDisplay || candidate.date,
      readTime: candidate.readTime,
    }));

  const navLinkStyle = {
    flex: 1,
    padding: '1rem 1.25rem',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    textDecoration: 'none',
    color: '#1f2937',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
  };

  const content = (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(locale, [
          { name: t.home, path: `/${locale}` },
          { name: t.columns, path: `/${locale}/columns` },
          { name: t.title, path: boardPath },
          { name: post.title, path: articlePath },
        ])}
      />
      <JsonLd
        data={buildArticleJsonLd({
          locale,
          title: post.title,
          description: post.summary,
          path: articlePath,
          image: post.featuredImage,
          datePublished: post.publicationDate || post.date,
          dateModified: post.date,
          articleSection: t.label,
        })}
      />
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}
      <section className={`blog-hero ${styles.hero}`} data-tone="dark" data-issue-column={post.slug}>
        <div className="blog-hero-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.featuredImage} alt="" aria-hidden="true" className={styles.heroBackdrop} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.featuredImage} alt={post.title} className="blog-hero-img" />
          <div className="blog-hero-overlay" />
        </div>
        <div className="container blog-hero-inner">
          <Link href={boardPath} className="blog-back-link">{t.backLabel}</Link>
          <span className="blog-category-badge">{t.label}</span>
          <h1 className="blog-hero-title">{post.title}</h1>
          <div className="blog-meta">
            <time dateTime={post.publicationDate || post.date}>{post.dateDisplay || post.date}</time>
            {post.readTime ? <span>{post.readTime}</span> : null}
          </div>
        </div>
      </section>
      <article className={`blog-article ${styles.article}`}>
        <div className="container blog-container">
          <div className="blog-body">
            <p className={boardStyles.dateNote} data-issue-date-note>{t.dateNote}</p>
            {tocEntries.length >= MIN_TOC_SECTIONS ? <ColumnToc entries={tocEntries} label={t.tocLabel} /> : null}
            <ColumnGeneratedVideo locale={locale} slug={post.slug} source="issue" autoPlay={resolveTrafficSubject(post, 'issue') !== null} />
            <ColumnContent content={post.content} locale={shell} />
            {faqItems.length > 0 ? (
              <section className="column-faq" aria-label={t.faqHeading}>
                <h2 className="blog-heading column-faq-heading">{t.faqHeading}</h2>
                <dl className="column-faq-list">
                  {faqItems.map((item, itemIndex) => (
                    <div className="column-faq-item" key={`${itemIndex}-${item.q}`}>
                      <dt className="column-faq-question">{item.q}</dt>
                      <dd className="column-faq-answer">{item.a}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}
            <AiAuthorBox locale={locale} />
            {recommendedItems.length > 0 ? (
              <RecommendedForYou
                locale={locale}
                hrefBase={boardPath}
                items={recommendedItems}
                currentSlug={post.slug}
                currentTopic={post.topic}
              />
            ) : null}
          </div>
          <aside className="blog-sidebar">
            <div className="blog-sidebar-card">
              <h3 className="blog-sidebar-title">{t.consultationTitle}</h3>
              <p className="blog-sidebar-text">{t.consultationText}</p>
              <a
                href={getConsultationPublicMailto(shell)}
                className="button blog-sidebar-btn"
                aria-label={`${t.consultationTitle}: ${CONSULTATION_EMAIL}`}
              >
                {t.consultationButton}
              </a>
            </div>
            <div className="blog-sidebar-card blog-sidebar-card--attorney">
              <AttorneyAuthorityCard locale={shell} heading={AI_COLUMN_ATTORNEY_HEADING[shell] ?? AI_COLUMN_ATTORNEY_HEADING.en} />
            </div>
            <div className="blog-sidebar-card">
              <h3 className="blog-sidebar-title">{t.relatedTitle}</h3>
              <ul className="blog-related-list">
                {guideLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="blog-related-link">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </article>
      {prevPost || nextPost ? (
        <nav className={`container column-post-nav ${styles.postNav}`} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '2rem 1rem', maxWidth: 900, margin: '0 auto 2rem' }}>
          {prevPost ? (
            <Link href={`${boardPath}/${prevPost.slug}`} style={navLinkStyle}>
              <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{t.prevLabel}</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.4 }}>{prevPost.title}</span>
            </Link>
          ) : <span style={{ flex: 1 }} />}
          {nextPost ? (
            <Link href={`${boardPath}/${nextPost.slug}`} style={{ ...navLinkStyle, textAlign: 'right', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{t.nextLabel}</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.4 }}>{nextPost.title}</span>
            </Link>
          ) : <span style={{ flex: 1 }} />}
        </nav>
      ) : null}
    </>
  );
  // zh-hant second pass (son7-87 / Opus 5.5): same article inside the zh-hant column-detail wrapper (split hero, sidebar).
  if (locale === 'zh-hant') {
    return <div className={zhStyles.root} id="zh-hant-column" data-zh-hant-design="issue">{content}</div>;
  }
  // en redesign (Opus 5.5 en lane): same article inside the en column-detail wrapper (night briefing hero, en sidebar).
  return locale === 'en'
    ? <EnPageShell page="issue"><div className={`${enStyles.detail} en-column`}>{content}</div></EnPageShell>
    : content;
}
