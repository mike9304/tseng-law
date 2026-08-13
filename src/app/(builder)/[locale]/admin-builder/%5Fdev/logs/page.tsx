import type { Metadata } from 'next';
import DevLogsPanel from '@/components/builder/DevLogsPanel';
import { normalizeLocale, type Locale } from '@/lib/locales';

// Restores the "개발 > 로그" nav item (admin-nav/nav-config.ts → /_dev/logs),
// which 404'd because no route mounted the existing, self-contained DevLogsPanel
// (it polls /api/builder/dev/logs on its own). NOTE: the route segment must live
// under `%5Fdev` (URL-encoded `_`) — a literal `_dev` folder is a Next.js private
// folder and is excluded from routing, like the sibling functions/sdk/secrets pages.
export const dynamic = 'force-dynamic';

const COPY: Record<Locale, { title: string; heading: string; sub: string }> = {
  ko: {
    title: '호정국제 사이트 에디터 · 개발 로그',
    heading: '개발 로그',
    sub: 'function · webhook · app 로그 (5초 폴링)',
  },
  'zh-hant': {
    title: '網站編輯器 · 開發日誌',
    heading: '開發日誌',
    sub: 'function · webhook · app 日誌（每 5 秒輪詢）',
  },
  en: {
    title: 'Site Editor · Dev logs',
    heading: 'Dev logs',
    sub: 'function · webhook · app logs (polled every 5s)',
  },
};

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  return {
    title: COPY[locale].title,
    robots: { index: false, follow: false },
  };
}

export default async function DevLogsAdminPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const copy = COPY[normalizeLocale(params.locale)];
  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>{copy.heading}</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>{copy.sub}</p>
      </header>
      <div style={{ padding: 24 }}>
        <DevLogsPanel />
      </div>
    </main>
  );
}
