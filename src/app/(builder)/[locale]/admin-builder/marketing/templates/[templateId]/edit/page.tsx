import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { normalizeLocale } from '@/lib/locales';
import { getTemplate } from '@/lib/builder/marketing/templates/storage';
import MarketingNav from '@/components/builder/marketing/MarketingNav';
import TemplateEditor from '@/components/builder/marketing/TemplateEditor';

export const dynamic = 'force-dynamic';

const copy = {
  ko: { title: '템플릿 편집' },
  'zh-hant': { title: '編輯範本' },
  en: { title: 'Edit Template' },
} as const;

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = normalizeLocale(params.locale);
  return {
    title: copy[locale].title,
    robots: { index: false, follow: false },
  };
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
      <MarketingNav locale={locale} active="templates" />
      <TemplateEditor initialTemplate={template} locale={locale} />
    </main>
  );
}
