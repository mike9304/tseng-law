import type { Metadata } from 'next';
import { listExperiments } from '@/lib/builder/experiments/storage';
import ExperimentsAdmin from '@/components/builder/experiments/ExperimentsAdmin';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

function getExperimentsMetadata(locale: Locale): Metadata {
  return {
    title: locale === 'ko' ? '실험 관리자' : locale === 'zh-hant' ? '實驗管理員' : 'A/B Experiments',
    robots: { index: false, follow: false },
  };
}

export default async function ExperimentsPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const locale = normalizeLocale(params.locale);
  const experiments = await listExperiments();
  return (
    <main>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>
          {locale === 'ko' ? '실험' : locale === 'zh-hant' ? '實驗' : 'A/B Experiments'}
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
          {locale === 'ko'
            ? '페이지 단위 variant + sessionId hash 기반 sticky 할당. 전환은 /api/experiments/event로 보고. z-test 유의성 자동 계산.'
            : locale === 'zh-hant'
              ? '按頁面 variant + sessionId hash 的 sticky 分配。轉換回報至 /api/experiments/event，並自動計算 z-test 顯著性。'
              : 'Page-level variant + sessionId hash sticky assignment. Conversions reported to /api/experiments/event with automatic z-test significance.'}
        </p>
      </header>
      <ExperimentsAdmin locale={locale} initialExperiments={experiments} />
    </main>
  );
}

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  return getExperimentsMetadata(normalizeLocale(params.locale));
}
