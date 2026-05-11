import { z } from 'zod';
import { locales, type Locale } from '@/lib/locales';

export type SubscriberStatus = 'pending' | 'subscribed' | 'unsubscribed' | 'bounced';

export interface Subscriber {
  subscriberId: string;
  email: string;
  contactId?: string;
  status: SubscriberStatus;
  tags: string[];
  preferredLocale: Locale;
  doubleOptInVerifiedAt?: string;
  doubleOptInToken?: string;
  unsubscribedAt?: string;
  unsubscribeToken: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

const localeSchema = z.enum(locales);

const tagListSchema = z.array(z.string().trim().min(1).max(64)).max(32).default([]);

export const subscribeRequestSchema = z.object({
  email: z.string().trim().email().max(200).toLowerCase(),
  preferredLocale: localeSchema.default('ko'),
  tags: tagListSchema,
  source: z.string().trim().min(1).max(80).default('public-form'),
  contactId: z.string().trim().min(1).max(120).optional(),
});

export const adminSubscriberCreateSchema = z.object({
  email: z.string().trim().email().max(200).toLowerCase(),
  preferredLocale: localeSchema.default('ko'),
  tags: tagListSchema,
  contactId: z.string().trim().min(1).max(120).optional(),
  source: z.string().trim().min(1).max(80).default('admin-create'),
  status: z.enum(['pending', 'subscribed']).default('subscribed'),
});

export const subscriberUpdateSchema = z.object({
  status: z.enum(['pending', 'subscribed', 'unsubscribed', 'bounced']).optional(),
  tags: tagListSchema.optional(),
  preferredLocale: localeSchema.optional(),
  contactId: z.string().trim().min(1).max(120).optional(),
});

export const subscriberImportRowSchema = z.object({
  email: z.string().trim().email().max(200).toLowerCase(),
  preferredLocale: localeSchema.default('ko'),
  tags: z.array(z.string().trim().min(1).max(64)).max(16).default([]),
});

export function isActiveSubscriber(subscriber: Subscriber): boolean {
  return subscriber.status === 'subscribed';
}
