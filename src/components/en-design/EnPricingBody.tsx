import PageHeader from '@/components/PageHeader';
import PricingCards, { getPricingContent } from '@/components/PricingCards';
import { pageCopy } from '@/data/page-copy';
import EnPageShell, { EnEmailButton, EnGlance } from './EnPageShell';

/**
 * en pricing page (Opus 5.5 en lane, 2026-10-01): header fact sheet (billing currency, the
 * first-consultation fee and how it is held, all from the pricing data), then the rate card.
 */
export default function EnPricingBody() {
  const copy = pageCopy.en.pricing;
  const data = getPricingContent('en');
  const consultation = data.items.find((item) => item.icon === 'consultation');
  return (
    <EnPageShell page="pricing">
      <PageHeader locale="en" label={copy.label} title={copy.title} description={copy.description}>
        <EnGlance
          items={[
            { term: 'Currency', value: data.currency },
            ...(consultation
              ? [
                  { term: consultation.title, value: `${consultation.price} ${consultation.unit}`.trim(), note: consultation.details[3] },
                  { term: 'Meet', value: consultation.details[0] ?? '' },
                ]
              : []),
          ]}
          actions={<EnEmailButton label={data.ctaLabel} />}
        />
      </PageHeader>
      <PricingCards locale="en" />
    </EnPageShell>
  );
}
