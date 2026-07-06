import { readIntegrations, type CrmIntegration } from '@/lib/builder/crm/integrations-model';
import type { CampaignRecipient } from '@/lib/builder/marketing/campaign-types';
import type { Subscriber } from '@/lib/builder/marketing/subscriber-types';

type CampaignAnalyticsEvent = {
  readonly kind: 'campaign-opened' | 'campaign-clicked';
  readonly occurredAt: string;
  readonly recipient: CampaignRecipient;
  readonly payload?: Record<string, unknown>;
};

type SubscriberAnalyticsEvent = {
  readonly kind: 'subscriber-unsubscribed';
  readonly occurredAt: string;
  readonly subscriber: Subscriber;
  readonly payload?: Record<string, unknown>;
};

export type MarketingAnalyticsEvent = CampaignAnalyticsEvent | SubscriberAnalyticsEvent;

type DispatchOptions = {
  readonly fetchImpl?: typeof fetch;
};

class MarketingAnalyticsIntegrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MarketingAnalyticsIntegrationError';
  }
}

function assertNever(value: never): never {
  throw new MarketingAnalyticsIntegrationError(`Unhandled marketing analytics variant: ${String(value)}`);
}

function serializeRecipient(recipient: CampaignRecipient): Record<string, unknown> {
  return {
    campaignId: recipient.campaignId,
    subscriberId: recipient.subscriberId,
    email: recipient.email,
    status: recipient.status,
  };
}

function serializeSubscriber(subscriber: Subscriber): Record<string, unknown> {
  return {
    subscriberId: subscriber.subscriberId,
    email: subscriber.email,
    status: subscriber.status,
  };
}

function buildGenericPayload(event: MarketingAnalyticsEvent): Record<string, unknown> {
  switch (event.kind) {
    case 'campaign-opened':
    case 'campaign-clicked':
      return {
        event: event.kind,
        triggeredAt: event.occurredAt,
        recipient: serializeRecipient(event.recipient),
        payload: event.payload ?? {},
      };
    case 'subscriber-unsubscribed':
      return {
        event: event.kind,
        triggeredAt: event.occurredAt,
        subscriber: serializeSubscriber(event.subscriber),
        payload: event.payload ?? {},
      };
    default:
      return assertNever(event);
  }
}

function slackHeadline(event: MarketingAnalyticsEvent): string {
  switch (event.kind) {
    case 'campaign-opened':
      return `Marketing campaign opened: ${event.recipient.email}`;
    case 'campaign-clicked':
      return `Marketing campaign clicked: ${event.recipient.email}`;
    case 'subscriber-unsubscribed':
      return `Marketing subscriber unsubscribed: ${event.subscriber.email}`;
    default:
      return assertNever(event);
  }
}

function buildSlackPayload(event: MarketingAnalyticsEvent): Record<string, unknown> {
  const headline = slackHeadline(event);
  const details =
    event.kind === 'subscriber-unsubscribed'
      ? [
          `*Event:* ${event.kind}`,
          `*Subscriber:* ${event.subscriber.subscriberId}`,
          `*Status:* ${event.subscriber.status}`,
        ]
      : [
          `*Event:* ${event.kind}`,
          `*Campaign:* ${event.recipient.campaignId}`,
          `*Subscriber:* ${event.recipient.subscriberId}`,
          `*Status:* ${event.recipient.status}`,
        ];
  return {
    text: headline,
    blocks: [
      { type: 'section', text: { type: 'mrkdwn', text: `*${headline}*` } },
      { type: 'section', text: { type: 'mrkdwn', text: details.join('\n') } },
    ],
  };
}

function logDispatchFailure(integrationId: string, error: unknown): void {
  if (error instanceof Error) {
    console.error('[marketing/analytics-integrations] dispatch failed:', integrationId, error.message);
    return;
  }
  console.error('[marketing/analytics-integrations] dispatch failed:', integrationId, String(error));
}

async function postWebhook(
  integration: CrmIntegration,
  body: Record<string, unknown>,
  fetchImpl: typeof fetch,
): Promise<void> {
  if (!integration.webhookUrl) return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);
  try {
    const response = await fetchImpl(integration.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) {
      console.error('[marketing/analytics-integrations] webhook rejected:', {
        integrationId: integration.id,
        status: response.status,
      });
    }
  } catch (error) {
    logDispatchFailure(integration.id, error);
  } finally {
    clearTimeout(timeout);
  }
}

async function dispatchOne(
  integration: CrmIntegration,
  event: MarketingAnalyticsEvent,
  fetchImpl: typeof fetch,
): Promise<void> {
  if (!integration.enabled) return;
  switch (integration.kind) {
    case 'generic-webhook':
      await postWebhook(integration, buildGenericPayload(event), fetchImpl);
      return;
    case 'slack-webhook':
      await postWebhook(integration, buildSlackPayload(event), fetchImpl);
      return;
    case 'mailchimp-stub':
      return;
    default:
      return assertNever(integration.kind);
  }
}

export async function dispatchMarketingAnalyticsEvent(
  event: MarketingAnalyticsEvent,
  options: DispatchOptions = {},
): Promise<void> {
  const fetchImpl = options.fetchImpl ?? fetch;
  try {
    const integrations = await readIntegrations();
    await Promise.all(integrations.map((integration) => dispatchOne(integration, event, fetchImpl)));
  } catch (error) {
    logDispatchFailure('read-integrations', error);
  }
}
