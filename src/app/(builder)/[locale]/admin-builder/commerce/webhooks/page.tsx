import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { listPaymentWebhookEvents } from '@/lib/builder/commerce/payment-webhooks-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';
import PaymentWebhookManagerClient from '@/components/builder/commerce/PaymentWebhookManagerClient';

export const dynamic = 'force-dynamic';

export default async function CommercePaymentWebhooksPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const site = await readSiteDocument(DEFAULT_BUILDER_SITE_ID, locale);
  const events = await listPaymentWebhookEvents();

  return (
    <PaymentWebhookManagerClient
      locale={locale}
      siteTitle={site.name}
      initialEvents={events}
    />
  );
}
