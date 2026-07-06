import type { Metadata } from 'next';
import type { Locale } from '@/lib/locales';
import { normalizeLocale } from '@/lib/locales';
import { readColumnBundle } from '@/lib/builder/columns/storage';
import ColumnEditor from '@/components/builder/columns/ColumnEditor';
import ColumnFrontmatterPanel from '@/components/builder/columns/ColumnFrontmatterPanel';
import ColumnLocaleLinker from '@/components/builder/columns/ColumnLocaleLinker';
import { getColumnEditCopy } from '@/components/builder/columns/column-edit-copy';
import {
  estimateReadingTime,
  getCategoryLabel,
  getColumnBlogCategory,
} from '@/components/builder/columns/blogAdminMeta';

export const dynamic = 'force-dynamic';

export function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Metadata {
  const locale = normalizeLocale(params.locale);
  const copy = getColumnEditCopy(locale);
  return {
    title: copy.pageTitle,
    robots: { index: false, follow: false },
  };
}

export default async function ColumnEditPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale: Locale = normalizeLocale(params.locale);
  const copy = getColumnEditCopy(locale);
  const slug = params.slug;

  const bundle = await readColumnBundle(locale, slug);
  const column = bundle.draft ?? bundle.published;

  if (!column) {
    return (
      <main className="column-editor-page" style={{ padding: '2rem', fontFamily: 'system-ui' }}>
        <h1>{copy.notFoundTitle}</h1>
        <p>
          <code>{slug}</code> (locale: {locale}) {copy.notFoundDescription}
        </p>
        <a href={`/${locale}/admin-builder/columns`}>{copy.backToList}</a>
        <a
          className="column-builder-return-dock column-builder-return-dock--single"
          href={`/${locale}/admin-builder`}
          aria-label={copy.backToHomeAria}
        >
          <span>←</span>
          <strong>{copy.backToHome}</strong>
        </a>
      </main>
    );
  }

  const category = getColumnBlogCategory(column.frontmatter);
  const authorName = column.frontmatter.author?.name ?? '호정국제 법률사무소';
  const readingTime = estimateReadingTime(`${column.summary} ${column.bodyMarkdown} ${column.bodyHtml}`);
  const dateLocale = locale === 'zh-hant' ? 'zh-Hant-TW' : locale === 'ko' ? 'ko-KR' : 'en-US';

  return (
    <main className="column-editor-page">
      <div className="column-builder-return-dock" aria-label={copy.quickNavAria}>
        <a
          className="column-builder-return-primary"
          href={`/${locale}/admin-builder`}
          aria-label={copy.backToHomeAria}
        >
          <span>←</span>
          <strong>{copy.backToHome}</strong>
        </a>
        <a
          className="column-builder-return-secondary"
          href={`/${locale}/admin-builder/columns`}
          aria-label={copy.breadcrumbList}
        >
          {copy.breadcrumbList}
        </a>
      </div>
      <header className="column-editor-page-header">
        <div>
          <nav className="column-editor-breadcrumb" aria-label={copy.breadcrumbAria}>
            <a href={`/${locale}/admin-builder`}>{copy.breadcrumbHome}</a>
            <a href={`/${locale}/admin-builder/columns`}>{copy.breadcrumbList}</a>
          </nav>
          <h1>{column.title || copy.untitledColumn}</h1>
        </div>
        <a
          className="admin-console-ghost-btn"
          href={`/${locale}/columns/${encodeURIComponent(slug)}`}
          target="_blank"
          rel="noreferrer"
        >
          {copy.openPublicPage}
        </a>
      </header>

      <div className="column-editor-grid column-editor-grid--writer">
        <div className="column-editor-main-rail">
          <ColumnEditor
            slug={slug}
            locale={locale}
            initialContent={{
              title: column.title,
              summary: column.summary,
              bodyHtml: column.bodyHtml,
              bodyMarkdown: column.bodyMarkdown,
            }}
          />
          <details className="column-editor-advanced-shell">
            <summary>
              <span>{copy.advancedSummaryTitle}</span>
              <strong>{copy.advancedSummaryDescription}</strong>
            </summary>
            <div className="column-editor-advanced-grid">
              <div className="column-editor-meta-rail">
                <ColumnFrontmatterPanel
                  slug={slug}
                  locale={locale}
                  initial={column.frontmatter}
                  hasPublished={Boolean(bundle.published || column.frontmatter.slugRedirectFrom)}
                />
                <ColumnLocaleLinker
                  slug={slug}
                  locale={locale}
                  linkedSlugs={column.linkedSlugs || {}}
                />
              </div>
              <aside className="column-editor-preview-rail">
                <div className="column-preview-card">
                  <div className="column-preview-toolbar">
                    <span>{copy.previewLabel}</span>
                    <strong>{readingTime}{copy.previewReadingTimeSuffix}</strong>
                  </div>
                  {column.frontmatter.featuredImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="column-preview-image" src={column.frontmatter.featuredImage} alt="" />
                  ) : (
                    <div className="column-preview-image column-preview-image-placeholder">
                      {column.title.slice(0, 2).toUpperCase() || 'HJ'}
                    </div>
                  )}
                  <div className="column-preview-body">
                    <span className="column-category-chip" style={{ background: category.color }}>
                      {getCategoryLabel(category, locale)}
                    </span>
                    <h2>{column.title}</h2>
                    <p className="column-preview-summary">{column.summary}</p>
                    <div className="column-preview-meta">
                      <span>{authorName}</span>
                      <span>
                        {column.frontmatter.publishedAt
                          ? new Date(column.frontmatter.publishedAt).toLocaleDateString(dateLocale)
                          : copy.draftLabel}
                      </span>
                    </div>
                    <article
                      className="column-preview-article"
                      dangerouslySetInnerHTML={{ __html: column.bodyHtml || `<p>${copy.previewFallback}</p>` }}
                    />
                  </div>
                </div>
              </aside>
            </div>
          </details>
        </div>
      </div>
    </main>
  );
}
