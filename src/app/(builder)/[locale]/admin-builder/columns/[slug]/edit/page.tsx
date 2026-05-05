import type { Metadata } from 'next';
import type { Locale } from '@/lib/locales';
import { normalizeLocale } from '@/lib/locales';
import { readColumnBundle } from '@/lib/builder/columns/storage';
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

  const bundle = await readColumnBundle(locale, slug);
  const column = bundle.draft ?? bundle.published;

  if (!column) {
    return (
      <main className="column-editor-page" style={{ padding: '2rem', fontFamily: 'system-ui' }}>
        <h1>칼럼을 찾을 수 없습니다</h1>
        <p>
          <code>{slug}</code> (locale: {locale}) 에 해당하는 draft 가 없습니다.
        </p>
        <a href={`/${locale}/admin-builder/columns`}>← 목록으로</a>
        <a
          className="column-builder-return-dock column-builder-return-dock--single"
          href={`/${locale}/admin-builder`}
          aria-label="편집 홈 메뉴로 돌아가기"
        >
          <span>←</span>
          <strong>편집 홈 메뉴</strong>
        </a>
      </main>
    );
  }

  const category = getColumnBlogCategory(column.frontmatter);
  const authorName = column.frontmatter.author?.name ?? '호정국제 법률사무소';
  const readingTime = estimateReadingTime(`${column.summary} ${column.bodyMarkdown} ${column.bodyHtml}`);

  return (
    <main className="column-editor-page">
      <div className="column-builder-return-dock" aria-label="Column editor quick navigation">
        <a
          className="column-builder-return-primary"
          href={`/${locale}/admin-builder`}
          aria-label="편집 홈 메뉴로 돌아가기"
        >
          <span>←</span>
          <strong>편집 홈 메뉴</strong>
        </a>
        <a
          className="column-builder-return-secondary"
          href={`/${locale}/admin-builder/columns`}
          aria-label="칼럼 목록으로 돌아가기"
        >
          칼럼 목록
        </a>
      </div>
      <header className="column-editor-page-header">
        <div>
          <nav className="column-editor-breadcrumb" aria-label="Column editor navigation">
            <a href={`/${locale}/admin-builder`}>← 편집 홈</a>
            <a href={`/${locale}/admin-builder/columns`}>칼럼 목록</a>
          </nav>
          <h1>{column.title || 'Untitled column'}</h1>
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
              <span>고급 설정</span>
              <strong>카테고리, 대표 이미지, 번역, 미리보기</strong>
            </summary>
            <div className="column-editor-advanced-grid">
              <div className="column-editor-meta-rail">
                <ColumnFrontmatterPanel
                  slug={slug}
                  locale={locale}
                  initial={column.frontmatter}
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
                    <span>Preview</span>
                    <strong>{readingTime}분 읽기</strong>
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
                          ? new Date(column.frontmatter.publishedAt).toLocaleDateString('ko-KR')
                          : 'Draft'}
                      </span>
                    </div>
                    <article
                      className="column-preview-article"
                      dangerouslySetInnerHTML={{ __html: column.bodyHtml || '<p>본문 미리보기</p>' }}
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
