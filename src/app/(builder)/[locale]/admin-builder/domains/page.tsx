import type { Metadata } from 'next';
import { listDomains } from '@/lib/builder/domains/storage';
import { getVercelClient } from '@/lib/builder/domains/vercel-api';
import DomainsAdmin from '@/components/builder/domains/DomainsAdmin';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Custom Domains',
  robots: { index: false, follow: false },
};

export default async function DomainsPage() {
  const domains = await listDomains();
  const client = getVercelClient();
  return (
    <main>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>Custom Domains</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
          도메인을 등록하면 TXT + CNAME 안내가 표시됩니다. DNS 적용 후 검증 버튼을
          누르면 Vercel alias + SSL 이 자동 발급됩니다.
        </p>
        {!client.ok ? (
          <div style={{ marginTop: 8, padding: 8, background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 6, fontSize: 12, color: '#92400e' }}>
            Vercel API 가 설정되지 않았습니다. 필요한 env: {client.missing.join(', ')}.
            도메인 등록은 가능하지만 검증 단계에서 attach 가 실패합니다.
          </div>
        ) : null}
      </header>
      <DomainsAdmin initialDomains={domains} />
    </main>
  );
}
