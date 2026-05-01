import type { Metadata } from 'next';
import type { Locale } from '@/lib/locales';
import { normalizeLocale } from '@/lib/locales';
import { readColumnVariant } from '@/lib/builder/columns/storage';
import ColumnEditor from '@/components/builder/columns/ColumnEditor';
import ColumnFrontmatterPanel from '@/components/builder/columns/ColumnFrontmatterPanel';
import ColumnLocaleLinker from '@/components/builder/columns/ColumnLocaleLinker';
import {
  estimateReadingTime,
  getCategoryLabel,
  getColumnBlogCategory,
} from '@/components/builder/columns/blogAdminMeta';

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

  const category = getColumnBlogCategory(draft.frontmatter);
  const authorName = draft.frontmatter.author?.name ?? '호정국제 법률사무소';
  const readingTime = estimateReadingTime(`${draft.summary} ${draft.bodyMarkdown} ${draft.bodyHtml}`);

  return (
    <main className="column-editor-page">
      <header className="column-editor-page-header">
        <div>
          <a href={`/${locale}/admin-builder/columns`}>← 칼럼 목록</a>
          <h1>{draft.title || 'Untitled column'}</h1>
        </div>
        <a
          className="admin-console-ghost-btn"
          href={`/${locale}/columns/${encodeURIComponent(slug)}`}
          target="_blank"
          rel="noreferrer"
        >
          공개 페이지 열기
        </a>
      </header>

      <div className="column-editor-grid">
        <div className="column-editor-meta-rail">
          <ColumnFrontmatterPanel
            slug={slug}
            locale={locale}
            initial={draft.frontmatter}
          />
          <ColumnLocaleLinker
            slug={slug}
            locale={locale}
            linkedSlugs={draft.linkedSlugs || {}}
          />
        </div>
        <div className="column-editor-main-rail">
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
        <aside className="column-editor-preview-rail">
          <div className="column-preview-card">
            <div className="column-preview-toolbar">
              <span>Preview</span>
              <strong>{readingTime}분 읽기</strong>
            </div>
            {draft.frontmatter.featuredImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="column-preview-image" src={draft.frontmatter.featuredImage} alt="" />
            ) : (
              <div className="column-preview-image column-preview-image-placeholder">
                {draft.title.slice(0, 2).toUpperCase() || 'HJ'}
              </div>
            )}
            <div className="column-preview-body">
              <span className="column-category-chip" style={{ background: category.color }}>
                {getCategoryLabel(category, locale)}
              </span>
              <h2>{draft.title}</h2>
              <p className="column-preview-summary">{draft.summary}</p>
              <div className="column-preview-meta">
                <span>{authorName}</span>
                <span>
                  {draft.frontmatter.publishedAt
                    ? new Date(draft.frontmatter.publishedAt).toLocaleDateString('ko-KR')
                    : 'Draft'}
                </span>
              </div>
              <article
                className="column-preview-article"
                dangerouslySetInnerHTML={{ __html: draft.bodyHtml || '<p>본문 미리보기</p>' }}
              />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
