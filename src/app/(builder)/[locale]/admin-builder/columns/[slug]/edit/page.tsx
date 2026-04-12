import type { Metadata } from 'next';
import type { Locale } from '@/lib/locales';
import { normalizeLocale } from '@/lib/locales';
import { readColumnVariant } from '@/lib/builder/columns/storage';
import ColumnEditor from '@/components/builder/columns/ColumnEditor';

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
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '1rem' }}>
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
    </main>
  );
}
