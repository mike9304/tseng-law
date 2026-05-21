import type { Metadata } from 'next';
import OpsAdmin from '@/components/builder/ops/OpsAdmin';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Ops Dashboard',
  robots: { index: false, follow: false },
};

export default function OpsPage() {
  return (
    <main>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>Ops Dashboard</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
          Deploy / cache / backup / logs / perf / security 헬스 통합 보드.
          모든 패널은 builder admin 권한이 있어야 보입니다.
        </p>
      </header>
      <OpsAdmin />
    </main>
  );
}