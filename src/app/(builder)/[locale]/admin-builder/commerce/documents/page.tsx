import type { Metadata } from 'next';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { listBillingDocuments } from '@/lib/builder/billing-documents';
import { loadBillingDocumentAutomationSettings } from '@/lib/builder/billing-document-automation';
import { listBillingDocumentWebhookEvents } from '@/lib/builder/billing-document-webhooks';
import { requireBuilderPagePermission } from '@/lib/builder/security/page-permission';
import { normalizeLocale, type Locale } from '@/lib/locales';
import BillingDocumentsClient from '@/components/builder/commerce/BillingDocumentsClient';
import styles from '@/components/builder/commerce/OrderManager.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const title = locale === 'ko' ? '청구서 문서' : locale === 'zh-hant' ? '帳單文件' : 'Billing documents';
  return {
    title,
    description: locale === 'ko'
      ? '주문과 예약 청구서, 영수증, 결제 링크, 수동 결제 기록을 한곳에서 관리합니다.'
      : locale === 'zh-hant'
        ? '在同一處管理訂單與預約的發票、收據、付款連結與手動付款紀錄。'
        : 'Manage invoices, receipts, pay links, and manual payment records for orders and bookings in one place.',
  };
}

export default async function CommerceBillingDocumentsPage(props: { params: Promise<{ locale: Locale }> }) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  await requireBuilderPagePermission('view-commerce');
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
