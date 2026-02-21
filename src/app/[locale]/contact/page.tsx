import { normalizeLocale, type Locale } from '@/lib/locales';
import PageHeader from '@/components/PageHeader';
import ContactBlocks from '@/components/ContactBlocks';
import MessengerChatSection from '@/components/MessengerChatSection';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import { pageCopy } from '@/data/page-copy';

export default function ContactPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].contact;
  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <MessengerChatSection locale={locale} />
      <ContactBlocks locale={locale} showMainHeader={false} />
      <OfficeMapTabs locale={locale} />
    </>
  );
}
