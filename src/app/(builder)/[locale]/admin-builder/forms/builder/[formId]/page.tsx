import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadFormSchema, createDefaultContactForm } from '@/lib/builder/forms/form-engine';
import FormSchemaEditor from '@/components/builder/forms/FormSchemaEditor';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { getFormsCopy } from '@/components/builder/forms/forms-copy';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const copy = getFormsCopy(params.locale as 'ko' | 'zh-hant' | 'en');
  return {
    title: copy.builder.title,
    description: copy.builder.description,
    robots: { index: false, follow: false },
  };
}

export default async function FormBuilderPage({ params }: { params: { locale: string; formId: string } }) {
  const copy = getFormsCopy(params.locale as 'ko' | 'zh-hant' | 'en');
  let schema = await loadFormSchema(params.formId);
  if (!schema && params.formId === 'default-contact') {
    schema = createDefaultContactForm();
  }
  if (!schema) notFound();
  return (
    <main>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>{copy.builder.title}</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>{copy.builder.body}</p>
      </header>
      <FormSchemaEditor
        initialSchema={schema}
        locale={params.locale}
        siteId={DEFAULT_BUILDER_SITE_ID}
      />
    </main>
  );
}
