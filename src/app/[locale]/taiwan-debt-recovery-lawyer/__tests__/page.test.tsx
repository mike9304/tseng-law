import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { CONSULTATION_EMAIL } from '@/lib/consultation/public-contact';
import { isGloballyNoindexPath } from '@/lib/seo-visibility';
import { debtRecoveryContent } from '../content';
import TaiwanDebtRecoveryLawyerPage, { generateMetadata } from '../page';

describe('EN unpublished debt-recovery candidate', () => {
  it('renders the five commercial problem types and the existing consultation email', async () => {
    const html = renderToStaticMarkup(
      await TaiwanDebtRecoveryLawyerPage({ params: Promise.resolve({ locale: 'en' }) }),
    );

    expect(html).toContain('Unpaid Invoices and Outstanding Payments');
    expect(html).toContain('Advance Payments and Undelivered Goods');
    expect(html).toContain('Defective Goods, Inspection and Acceptance Disputes');
    expect(html).toContain('Delayed Performance and Contract Disagreements');
    expect(html).toContain('When the Taiwan Counterparty Stops Responding');
    expect(html).toContain(`mailto:${CONSULTATION_EMAIL}`);
    expect(html).toContain('/en/services/civil');
    expect(html).toContain('not a complete statutory document set');
    expect(html).not.toMatch(/guaranteed win|will recover the money|always recoverable/i);
  });

  it('keeps the candidate noindex and outside any hreflang cluster', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: 'en' }) });
    expect(metadata.robots).toMatchObject({ index: false });
    expect(metadata.alternates?.languages ?? {}).toEqual({});
    expect(isGloballyNoindexPath('/taiwan-debt-recovery-lawyer')).toBe(true);
  });

  it('does not invent a recovery percentage or a universal no-visit promise', () => {
    const blob = JSON.stringify(debtRecoveryContent);
    expect(blob).not.toMatch(/% recovered|always recoverable|guaranteed win/i);
    expect(blob).toMatch(/is not promised/i);
  });
});
