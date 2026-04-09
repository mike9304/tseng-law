import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import BuilderPublicPage from '@/components/admin/wix/builder/BuilderPublicPage';
import PageHeader from '@/components/PageHeader';
import ContactBlocks from '@/components/ContactBlocks';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import ConsultationGuideSection from '@/components/ConsultationGuideSection';
import AiConsultationSection from '@/components/consultation/AiConsultationSection';
import { pageCopy } from '@/data/page-copy';
import { getEnabledPublicBuilderDocument, resolveBuilderSeoCopy } from '@/lib/cms/builder-public';
import { buildSeoMetadata } from '@/lib/seo';

const contactKeywords: Record<Locale, string[]> = {
  ko: ['대만 변호사 상담', '법무법인 호정 연락처', '대만 회사설립 문의', '대만 소송 상담'],
  'zh-hant': ['台灣律師諮詢', '昊鼎聯絡方式', '台灣公司設立詢問', '台灣訴訟諮詢'],
  en: ['Taiwan lawyer contact', 'Taiwan legal consultation', 'Hovering contact', 'Taiwan company setup inquiry'],
};

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].contact;
  const builderDocument = await getEnabledPublicBuilderDocument('contact', locale);
  const seo = builderDocument
    ? resolveBuilderSeoCopy(builderDocument, copy.title, copy.description)
    : copy;

  return buildSeoMetadata({
    locale,
    title: seo.title,
    description: seo.description,
    path: '/contact',
    keywords: contactKeywords[locale],
  });
}

export default async function ContactPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].contact;

  const builderDocument = await getEnabledPublicBuilderDocument('contact', locale);
  if (builderDocument) {
    return <BuilderPublicPage document={builderDocument} />;
  }

  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <ConsultationGuideSection locale={locale} />
      <AiConsultationSection locale={locale} />
      <ContactBlocks locale={locale} showMainHeader={false} />
      <OfficeMapTabs locale={locale} />
    </>
  );
}
