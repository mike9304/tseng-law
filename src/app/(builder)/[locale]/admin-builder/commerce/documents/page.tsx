import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { listBillingDocuments } from '@/lib/builder/billing-documents';
import { loadBillingDocumentAutomationSettings } from '@/lib/builder/billing-document-automation';
import { listBillingDocumentWebhookEvents } from '@/lib/builder/billing-document-webhooks';
import { normalizeLocale, type Locale } from '@/lib/locales';
import BillingDocumentsClient from '@/components/builder/commerce/BillingDocumentsClient';
import styles from '@/components/builder/commerce/OrderManager.module.css';

export const dynamic = 'force-dynamic';

export default async function CommerceBillingDocumentsPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const site = await readSiteDocument(DEFAULT_BUILDER_SITE_ID, locale);
  const [documents, automationSettings, webhookEvents] = await Promise.all([
    listBillingDocuments({ locale }),
    loadBillingDocumentAutomationSettings(),
    listBillingDocumentWebhookEvents(),
  ]);

  return (
    <main className={styles.page}>
      <BillingDocumentsClient
        locale={locale}
        siteTitle={site.name}
        initialDocuments={documents}
        initialAutomationSettings={automationSettings}
        initialWebhookEvents={webhookEvents}
      />
    </main>
  );
}
