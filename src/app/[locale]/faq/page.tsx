import { normalizeLocale, type Locale } from '@/lib/locales';
import PageHeader from '@/components/PageHeader';
import { pageCopy } from '@/data/page-copy';
import { faqContent } from '@/data/faq-content';
import FAQAccordion from '@/components/FAQAccordion';

export default function FaqPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].faq;
  const items = faqContent[locale];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };

  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <FAQAccordion locale={locale} items={items} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
