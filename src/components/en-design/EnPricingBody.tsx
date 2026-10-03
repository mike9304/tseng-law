import PageHeader from '@/components/PageHeader';
import PricingCards, { getPricingContent } from '@/components/PricingCards';
import { pageCopy } from '@/data/page-copy';
import EnPageShell, { EnBand, EnEmailButton, EnGlance } from './EnPageShell';
import EnLocalNav, { type EnLocalNavItem } from './EnLocalNav';

/** Short local-nav labels for the four fee titles (CONCEPT-V2 21: new short labels of existing fee titles). */
const FEE_NAV: readonly EnLocalNavItem[] = [
  { href: '#fee-consultation', label: 'Consultation' },
  { href: '#fee-litigation', label: 'Litigation' },
  { href: '#fee-company', label: 'Company setup' },
  { href: '#fee-retainer', label: 'Retainer' },
];

/**
 * en pricing page (CONCEPT-V2 12.3): title card with the credits row (billing currency, the consultation fee
 * with its unit and "Appointment required", how to meet; all from the pricing data) and the email pill, the
 * drops band (B1), a local nav to the four fee blocks and the fee sheet, which ends with its own email CTA.
 */
export default function EnPricingBody() {
  const copy = pageCopy.en.pricing;
  const data = getPricingContent('en');
  const consultation = data.items.find((item) => item.icon === 'consultation');
  const feeIds = new Set(data.items.map((item) => `#fee-${item.icon}`));
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
      <EnBand name="drops" />
      <EnLocalNav title={copy.title} items={FEE_NAV.filter((item) => feeIds.has(item.href))} />
      <PricingCards locale="en" />
    </EnPageShell>
  );
}
