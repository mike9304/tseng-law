import { z } from 'zod';

export const WEBHOOK_EVENT_TYPES = [
  'form.submitted',
  'booking.created',
  'booking.cancelled',
  'booking.rescheduled',
  'contact.created',
  'page.published',
  'member.registered',
] as const;

export type WebhookEventType = (typeof WEBHOOK_EVENT_TYPES)[number];

export interface WebhookSubscription {
  webhookId: string;
  url: string;
  events: WebhookEventType[];
  /** HMAC secret used to sign delivery bodies. Required. */
  secret: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type WebhookDeliveryStatus = 'success' | 'failed' | 'pending';

export interface WebhookDelivery {
  deliveryId: string;
  webhookId: string;
  event: WebhookEventType;
  payload: Record<string, unknown>;
  status: WebhookDeliveryStatus;
  attempts: number;
  responseStatus?: number;
  responseSnippet?: string;
  error?: string;
  createdAt: string;
  lastTriedAt?: string;
}

export const subscriptionCreateSchema = z.object({
  url: z.string().trim().url().max(2000),
  events: z.array(z.enum(WEBHOOK_EVENT_TYPES)).min(1).max(WEBHOOK_EVENT_TYPES.length),
  description: z.string().trim().max(300).optional(),
  active: z.boolean().default(true),
});

export const subscriptionUpdateSchema = subscriptionCreateSchema.partial();
