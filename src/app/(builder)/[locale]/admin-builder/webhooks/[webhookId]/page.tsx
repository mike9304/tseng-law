import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSubscription, listDeliveriesForWebhook } from '@/lib/builder/webhooks/storage';
import WebhookDeliveriesView from '@/components/builder/webhooks/WebhookDeliveriesView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Webhook Deliveries',
  robots: { index: false, follow: false },
};

export default async function WebhookDetailPage({ params }: { params: { webhookId: string } }) {
  const subscription = await getSubscription(params.webhookId);
  if (!subscription) notFound();
  const deliveries = await listDeliveriesForWebhook(params.webhookId);
  return (
    <WebhookDeliveriesView
      webhookId={subscription.webhookId}
      webhookUrl={subscription.url}
      initialDeliveries={deliveries.slice(0, 200)}
    />
  );
}
