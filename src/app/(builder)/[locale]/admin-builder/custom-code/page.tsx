import type { Metadata } from 'next';
import CustomCodePanel from '@/components/builder/CustomCodePanel';
import DevLogsPanel from '@/components/builder/DevLogsPanel';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { readSiteDocument } from '@/lib/builder/site/persistence';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: '호정국제 사이트 에디터 · 커스텀 코드',
  robots: { index: false, follow: false },
};

export default async function CustomCodeAdminPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { pageId?: string };
}) {
  const locale: Locale = normalizeLocale(params.locale);
  const site = await readSiteDocument('default', locale);
  const pageId = searchParams?.pageId;
  const pageMeta = pageId ? site.pages.find((page) => page.pageId === pageId) : undefined;

  return (
    <main style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24, background: '#eef2f7', minHeight: '100vh' }}>
      <CustomCodePanel
        locale={locale}
        pageId={pageMeta?.pageId}
        initialSiteCode={site.customCode ?? {}}
        initialPageCode={pageMeta?.customCode ?? {}}
      />
      <DevLogsPanel />
    </main>
  );
}