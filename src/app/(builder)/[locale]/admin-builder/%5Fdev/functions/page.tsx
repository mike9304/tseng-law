import type { Metadata } from 'next';
import FunctionsAdmin from '@/components/builder/dev/FunctionsAdmin';
import { getFunctionsCopy } from '@/components/builder/dev/functions-copy';
import { getSdkCopy } from '@/components/builder/dev/sdk-copy';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const copy = getSdkCopy(params.locale as 'ko' | 'zh-hant' | 'en');
  return {
    title: copy.title,
    description: copy.intro,
    robots: { index: false, follow: false },
  };
}

export default async function BuilderFunctionsAdminPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const shellCopy = getFunctionsCopy(params.locale as 'ko' | 'zh-hant' | 'en');
  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>{shellCopy.title}</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>{shellCopy.description}</p>
      </header>
      <FunctionsAdmin locale={params.locale as 'ko' | 'zh-hant' | 'en'} />
    </main>
  );
}
