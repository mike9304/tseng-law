import type { Metadata } from 'next';
import type { Locale } from '@/lib/locales';
import { normalizeLocale } from '@/lib/locales';
import { readColumnVariant } from '@/lib/builder/columns/storage';
import ColumnEditor from '@/components/builder/columns/ColumnEditor';
import ColumnFrontmatterPanel from '@/components/builder/columns/ColumnFrontmatterPanel';
import ColumnLocaleLinker from '@/components/builder/columns/ColumnLocaleLinker';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Column Editor',
  robots: { index: false, follow: false },
};

export default async function ColumnEditPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale: Locale = normalizeLocale(params.locale);
  const slug = params.slug;

  const draft = await readColumnVariant(locale, slug, 'draft');

  if (!draft) {
    return (
      <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
        <h1>칼럼을 찾을 수 없습니다</h1>
        <p>
          <code>{slug}</code> (locale: {locale}) 에 해당하는 draft 가 없습니다.
        </p>
        <a href={`/${locale}/admin-builder/columns`}>← 목록으로</a>
      </main>
    );
  }

  return (
    <main style={{ display: 'flex', gap: '2rem', maxWidth: 1200, margin: '0 auto', padding: '1rem' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <ColumnEditor
          slug={slug}
          locale={locale}
          initialContent={{
            title: draft.title,
            summary: draft.summary,
            bodyHtml: draft.bodyHtml,
            bodyMarkdown: draft.bodyMarkdown,
          }}
        />
      </div>
      <div style={{ width: 280, flexShrink: 0 }}>
        <ColumnFrontmatterPanel
          slug={slug}
          locale={locale}
          initial={{
            lastmod: draft.frontmatter.lastmod,
            attorneyReviewStatus: draft.frontmatter.attorneyReviewStatus,
            freshness: draft.frontmatter.freshness,
            category: draft.frontmatter.category || 'legal',
          }}
        />
        <ColumnLocaleLinker
          slug={slug}
          locale={locale}
          linkedSlugs={draft.linkedSlugs || {}}
        />
      </div>
    </main>
  );
}
