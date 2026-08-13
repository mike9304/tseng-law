import type { Metadata } from 'next';
import type { Locale } from '@/lib/locales';
import { normalizeLocale } from '@/lib/locales';
import { readColumnBundle } from '@/lib/builder/columns/storage';
import ColumnEditWorkspace from '@/components/builder/columns/ColumnEditWorkspace';
import { getColumnEditCopy } from '@/components/builder/columns/column-edit-copy';

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  props: {
    params: Promise<{ locale: string; slug: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const copy = getColumnEditCopy(locale);
  return {
    title: copy.pageTitle,
    robots: { index: false, follow: false },
  };
}

export default async function ColumnEditPage(
  props: {
    params: Promise<{ locale: string; slug: string }>;
  }
) {
  const params = await props.params;
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

      <ColumnEditWorkspace
        slug={slug}
        locale={locale}
        column={column}
        hasPublished={Boolean(bundle.published || column.frontmatter.slugRedirectFrom)}
      />
    </main>
  );
}
