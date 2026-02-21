import { normalizeLocale, type Locale } from '@/lib/locales';
import PageHeader from '@/components/PageHeader';
import { pageCopy } from '@/data/page-copy';
import ContactBlocks from '@/components/ContactBlocks';
import AttorneyProfileSection from '@/components/AttorneyProfileSection';
import FirmIntroductionSection from '@/components/FirmIntroductionSection';

export default function AboutPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].about;
  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <FirmIntroductionSection locale={locale} />
      <AttorneyProfileSection locale={locale} />
      <ContactBlocks locale={locale} />
    </>
  );
}
