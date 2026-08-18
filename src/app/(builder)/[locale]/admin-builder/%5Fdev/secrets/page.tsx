import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import SecretsAdmin from '@/components/builder/dev/SecretsAdmin';
import { getSecretsAdminCopy } from '@/components/builder/dev/secrets-copy';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const copy = getSecretsAdminCopy(locale);
  return {
    title: copy.pageTitle,
    description: copy.pageDescription,
    robots: { index: false, follow: false },
  };
}

export default async function BuilderSecretsAdminPage(props: { params: Promise<{ locale: Locale }> }) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const copy = getSecretsAdminCopy(locale);
  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>{copy.adminTitle}</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>{copy.adminDescription}</p>
      </header>
      <SecretsAdmin locale={locale} />
    </main>
  );
}
