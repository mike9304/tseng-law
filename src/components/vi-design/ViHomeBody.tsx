import Image from 'next/image';
import Link from 'next/link';
import FAQAccordion from '@/components/FAQAccordion';
import JsonLd from '@/components/JsonLd';
import { resolveInsightsImageSrc } from '@/components/insights-image';
import ZhHantMonoIcon from '@/components/zh-hant-icons/ZhHantMonoIcon';
import { guidanceContent } from '@/data/international-guidance-content';
import { viSiteCopy } from '@/data/vi-site';
import { getColumnPublicationDate, sortColumnPostsNewestFirst, type ColumnPost } from '@/lib/column-post';
import { buildGuidancePersonJsonLd } from '@/lib/guidance-structured-data';
import { guidanceCanonicalUrl } from '@/lib/public-guidance';
import { buildGuidanceFaqJsonLd, buildGuidanceLegalServiceJsonLd, getOrganizationName, getSiteUrl } from '@/lib/seo';
import { ViContactBand, ViContainer, ViOfficePreview, ViSectionHeading, ViServiceGrid, ViTeamPreview } from './ViShared';
import styles from './ViSite.module.css';

function ColumnDate({ post }: { post: ColumnPost }) {
  const iso = getColumnPublicationDate(post);
  const display = iso ? new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`)) : post.dateDisplay;
  return display ? <time dateTime={iso || undefined}>{display}</time> : null;
}

function LatestColumns({ posts }: { posts: ColumnPost[] }) {
  const [featured, ...rest] = sortColumnPostsNewestFirst(posts).slice(0, 4);
  return (
    <section className={styles.section} id="insights" data-vi-column-source="vi">
      <ViContainer>
        <ViSectionHeading label={guidanceContent.vi.nav.columns} title={viSiteCopy.columns.title} description={viSiteCopy.columns.description} href="/vi/columns" linkLabel={viSiteCopy.columns.allAction} />
        {featured ? (
          <div className={styles.columnsGrid}>
            <article className={styles.featuredColumn}>
              <Link href={`/vi/columns/${featured.slug}`} className={styles.featuredImage} tabIndex={-1} aria-hidden="true">
                <Image src={resolveInsightsImageSrc(featured.featuredImage)} alt={featured.featuredImageAlt || ''} fill sizes="(max-width: 760px) 100vw, 52vw" />
              </Link>
              {featured.featuredImageCaption ? <p className={styles.mediaCaption}>{featured.featuredImageCaption}</p> : null}
              <div className={styles.columnMeta}><span>{featured.categoryLabel}</span><ColumnDate post={featured} /></div>
              <h3><Link href={`/vi/columns/${featured.slug}`}>{featured.title}</Link></h3>
              <p className={styles.columnSummary}>{featured.summary}</p>
            </article>
            <div className={styles.columnList}>
              {rest.map((post) => (
                <article key={post.slug} className={styles.columnRow}>
                  <div>
                    <div className={styles.columnMeta}><span>{post.categoryLabel}</span><ColumnDate post={post} /></div>
                    <h3><Link href={`/vi/columns/${post.slug}`}>{post.title}</Link></h3>
                    <p>{post.summary}</p>
                  </div>
                  <Link href={`/vi/columns/${post.slug}`} className={styles.columnThumbnail} tabIndex={-1} aria-hidden="true">
                    <Image src={resolveInsightsImageSrc(post.featuredImage)} alt="" fill sizes="(max-width: 480px) 88px, 120px" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        ) : null}
        <Link href="/vi/columns/issues" className={styles.issueLink}>
          <div><h3>{viSiteCopy.columns.issueTitle}</h3><p>{viSiteCopy.columns.issueDescription}</p></div>
          <span>{viSiteCopy.columns.issueAction}<ZhHantMonoIcon name="chevron-right" size={18} /></span>
        </Link>
      </ViContainer>
    </section>
  );
}

export default function ViHomeBody({ posts }: { posts: ColumnPost[] }) {
  const pack = guidanceContent.vi;
  const person = buildGuidancePersonJsonLd('vi');
  const faqs = [0, 2, 6].flatMap((index) => pack.pages.faq.faqs?.[index] ? [pack.pages.faq.faqs[index]] : []);
  const faqJsonLd = buildGuidanceFaqJsonLd(faqs, 'vi');
  const legalService = buildGuidanceLegalServiceJsonLd({
    inLanguage: 'vi',
    url: guidanceCanonicalUrl('vi', 'home', getSiteUrl()),
    description: pack.pages.home.description,
    contactUrl: guidanceCanonicalUrl('vi', 'contact', getSiteUrl()),
  });
  return (
    <div className={styles.site} id="vi-home" data-vi-design="home" data-vi-page="home" lang="vi">
      <JsonLd data={legalService} />
      {person ? <JsonLd data={person} /> : null}
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}
      <section className={styles.hero} id="hero" aria-labelledby="vi-home-title">
        <ViContainer className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.firmName}>{getOrganizationName('vi')}</p>
            <h1 id="vi-home-title">{viSiteCopy.home.title}</h1>
            <p className={styles.heroDescription}>{viSiteCopy.home.description}</p>
            <div className={styles.actions}>
              <Link href="/vi/contact#international-inquiry" className={styles.heroPrimary}>{pack.contactCta}</Link>
              <Link href="/vi/services" className={styles.heroSecondary}>{viSiteCopy.home.servicesAction}</Link>
            </div>
            <p className={styles.heroAudience}>{viSiteCopy.home.audience}</p>
          </div>
          {/* The city through a window with its shutter half open: decorative, so it stays out of the reading order. */}
          <div className={styles.heroFrame} aria-hidden="true">
            <Image src="/images/hero-taiwan-modern-city-opening.webp" alt="" fill priority sizes="(max-width: 760px) 100vw, 44vw" className={styles.heroImage} />
          </div>
        </ViContainer>
        <div className={styles.heroExplore}>
          <ViContainer>
            <Link href="/vi/columns">{viSiteCopy.home.articlesAction}<ZhHantMonoIcon name="chevron-right" size={18} /></Link>
            <Link href="/vi/columns/issues">{viSiteCopy.home.issuesAction}<ZhHantMonoIcon name="chevron-right" size={18} /></Link>
            <Link href="/vi/lawyers">{viSiteCopy.home.teamAction}<ZhHantMonoIcon name="chevron-right" size={18} /></Link>
          </ViContainer>
        </div>
      </section>
      <section className={`${styles.section} ${styles.paperSection}`} id="practice">
        <ViContainer>
          <ViSectionHeading label={pack.nav.services} title={viSiteCopy.services.title} description={viSiteCopy.services.description} href="/vi/services" linkLabel={viSiteCopy.services.allAction} />
          <ViServiceGrid />
        </ViContainer>
      </section>
      <LatestColumns posts={posts} />
      <ViTeamPreview />
      <div className={styles.faqRegion}>
        <FAQAccordion locale="vi" items={faqs} id="faq" sectionClassName={styles.faqSection} headingLabel={pack.nav.faq} headingTitle={viSiteCopy.faq.title} layout="split" />
        <ViContainer><Link className={styles.textLink} href="/vi/faq">{viSiteCopy.faq.allAction}<ZhHantMonoIcon name="chevron-right" size={16} /></Link></ViContainer>
      </div>
      <ViOfficePreview />
      <ViContactBand />
    </div>
  );
}
