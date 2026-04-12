import type { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import { normalizeLocale, type Locale } from '@/lib/locales';
import PageHeader from '@/components/PageHeader';
import ContactBlocks from '@/components/ContactBlocks';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import ConsultationGuideSection from '@/components/ConsultationGuideSection';
import { pageCopy } from '@/data/page-copy';
import { buildSeoMetadata } from '@/lib/seo';
import BuilderPublishedContactRenderer from '@/components/builder/BuilderPublishedContactRenderer';
import { readBuilderPageSnapshot } from '@/lib/builder/persistence';

const contactKeywords: Record<Locale, string[]> = {
  ko: ['대만 변호사 상담', '법무법인 호정 연락처', '대만 회사설립 문의', '대만 소송 상담'],
  'zh-hant': ['台灣律師諮詢', '昊鼎聯絡方式', '台灣公司設立詢問', '台灣訴訟諮詢'],
  en: ['Taiwan lawyer contact', 'Taiwan legal consultation', 'Hovering contact', 'Taiwan company setup inquiry'],
};

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].contact;

  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/contact',
    keywords: contactKeywords[locale],
  });
}

export default async function ContactPage({ params }: { params: { locale: Locale } }) {
  noStore();
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].contact;
  const publishedSnapshot = await readBuilderPageSnapshot('contact', 'published', locale);

  return (
    publishedSnapshot.persisted ? (
      <BuilderPublishedContactRenderer
        locale={locale}
        document={publishedSnapshot.snapshot.document}
        header={{
          label: copy.label,
          title: copy.title,
          description: copy.description,
        }}
        state={publishedSnapshot.snapshot.state}
        revealSections
      />
    ) : (
      <LegacyContactPage locale={locale} />
    )
  );
}

function LegacyContactPage({ locale }: { locale: Locale }) {
  const copy = pageCopy[locale].contact;

  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <ConsultationGuideSection locale={locale} />
      <ContactBlocks locale={locale} showMainHeader={false} />
      <OfficeMapTabs locale={locale} />
    </>
  );
}
