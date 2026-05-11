import type { Metadata } from 'next';
import { listExperiments } from '@/lib/builder/experiments/storage';
import ExperimentsAdmin from '@/components/builder/experiments/ExperimentsAdmin';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'A/B Experiments',
  robots: { index: false, follow: false },
};

export default async function ExperimentsPage() {
  const experiments = await listExperiments();
  return (
    <main>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>A/B Experiments</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
          페이지 단위 variant + sessionId hash 기반 sticky 할당. 전환은
          /api/experiments/event 로 보고. z-test 유의성 자동 계산.
        </p>
      </header>
      <ExperimentsAdmin initialExperiments={experiments} />
    </main>
  );
}
