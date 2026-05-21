import type { Metadata } from 'next';
import SecretsAdmin from '@/components/builder/dev/SecretsAdmin';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '시크릿 관리',
  robots: { index: false, follow: false },
};

export default function BuilderSecretsAdminPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>Secrets</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
          서버리스 함수에서 사용하는 암호화된 시크릿을 관리합니다. KEK은
          `BUILDER_SECRET_KEK` 또는 `NEXTAUTH_SECRET` 환경 변수에서 가져옵니다.
        </p>
      </header>
      <SecretsAdmin />
    </main>
  );
}