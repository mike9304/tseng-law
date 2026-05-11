import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadFormSchema, createDefaultContactForm } from '@/lib/builder/forms/form-engine';
import FormSchemaEditor from '@/components/builder/forms/FormSchemaEditor';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Form Builder',
  robots: { index: false, follow: false },
};

export default async function FormBuilderPage({ params }: { params: { formId: string } }) {
  let schema = await loadFormSchema(params.formId);
  if (!schema && params.formId === 'default-contact') {
    schema = createDefaultContactForm();
  }
  if (!schema) notFound();
  return (
    <main>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>Form Builder</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
          드래그앤드롭으로 필드를 재정렬하고, step 분할 + 조건부 로직을 적용하세요.
        </p>
      </header>
      <FormSchemaEditor initialSchema={schema} />
    </main>
  );
}
