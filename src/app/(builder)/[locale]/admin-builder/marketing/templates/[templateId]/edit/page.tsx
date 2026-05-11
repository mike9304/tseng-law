import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { normalizeLocale } from '@/lib/locales';
import { getTemplate } from '@/lib/builder/marketing/templates/storage';
import MarketingNav from '@/components/builder/marketing/MarketingNav';
import TemplateEditor from '@/components/builder/marketing/TemplateEditor';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Edit Template',
  robots: { index: false, follow: false },
};

export default async function TemplateEditPage({
  params,
}: {
  params: { locale: string; templateId: string };
}) {
  const locale = normalizeLocale(params.locale);
  const template = await getTemplate(params.templateId);
  if (!template) notFound();
  return (
    <main>
      <MarketingNav locale={locale} active="campaigns" />
      <TemplateEditor initialTemplate={template} />
    </main>
  );
}
