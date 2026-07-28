import type { Metadata } from 'next';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';
import OpsAdmin from '@/components/builder/ops/OpsAdmin';

export const dynamic = 'force-dynamic';

type SearchParamValue = string | string[] | undefined;

const COPY: Record<Locale, { title: string; description: string; heading: string; body: string }> = {
  ko: {
    title: 'Ops 대시보드',
    description: '배포, 캐시, 백업, 로그, 성능, 보안 상태를 확인합니다.',
    heading: 'Ops 대시보드',
    body: 'Deploy / cache / backup / logs / perf / security 헬스 통합 보드. 모든 패널은 builder admin 권한이 있어야 보입니다.',
  },
  'zh-hant': {
    title: 'Ops 儀表板',
    description: '查看部署、快取、備份、記錄、效能與安全狀態。',
    heading: 'Ops 儀表板',
    body: 'Deploy / cache / backup / logs / perf / security 健康整合面板。所有面板都需要 builder admin 權限。',
  },
  en: {
    title: 'Ops Dashboard',
    description: 'Inspect deploy, cache, backup, logs, perf, and security health.',
    heading: 'Ops Dashboard',
    body: 'Deploy / cache / backup / logs / perf / security health overview. Every panel requires builder admin access.',
  },
};

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: COPY[locale].title,
    description: COPY[locale].description,
    path: '/admin-builder/ops',
    alternateLocales: locales,
    noindex: true,
  });
}

function firstSearchParam(value: SearchParamValue): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function OpsPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: Record<string, SearchParamValue>;
}) {
  const locale = normalizeLocale(params.locale);
  const text = COPY[locale];
  const query = firstSearchParam(searchParams?.q) ?? firstSearchParam(searchParams?.query);
  return (
    <main>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>{text.heading}</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>{text.body}</p>
      </header>
      <OpsAdmin
        locale={locale}
        initialSearchParams={{
          tab: firstSearchParam(searchParams?.tab),
          type: firstSearchParam(searchParams?.type),
          level: firstSearchParam(searchParams?.level),
          query,
        }}
      />
    </main>
  );
}
