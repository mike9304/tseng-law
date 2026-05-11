import { z } from 'zod';
import { locales } from '@/lib/locales';
import type { LocalizedText } from '@/lib/builder/bookings/types';

export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';

export interface CampaignStats {
  recipients: number;
  opens: number;
  clicks: number;
  unsubscribes: number;
  bounces: number;
}

export interface Campaign {
  campaignId: string;
  name: string;
  subject: LocalizedText;
  preheader?: LocalizedText;
  bodyHtml: LocalizedText;
  bodyText: LocalizedText;
  segmentTags: string[];
  fromName: string;
  fromAddress: string;
  status: CampaignStatus;
  scheduledAt?: string;
  sentAt?: string;
  lastError?: string;
  stats: CampaignStats;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignRecipient {
  campaignId: string;
  subscriberId: string;
  email: string;
  status: 'pending' | 'sent' | 'failed' | 'bounced' | 'opened' | 'clicked' | 'unsubscribed';
  attempts: number;
  sentAt?: string;
  openedAt?: string;
  clickedAt?: string;
  unsubscribedAt?: string;
  lastError?: string;
  trackingToken: string;
}

const localizedTextSchema = z.object({
  ko: z.string().min(1).max(2000),
  'zh-hant': z.string().min(1).max(2000),
  en: z.string().min(1).max(2000),
});

const localizedTextOptionalSchema = z.object({
  ko: z.string().max(2000).default(''),
  'zh-hant': z.string().max(2000).default(''),
  en: z.string().max(2000).default(''),
});

const localizedHtmlSchema = z.object({
  ko: z.string().min(1).max(200_000),
  'zh-hant': z.string().min(1).max(200_000),
  en: z.string().min(1).max(200_000),
});

export const campaignCreateSchema = z.object({
  name: z.string().trim().min(1).max(200),
  subject: localizedTextSchema,
  preheader: localizedTextOptionalSchema.optional(),
  bodyHtml: localizedHtmlSchema,
  bodyText: localizedTextSchema,
  segmentTags: z.array(z.string().trim().min(1).max(64)).max(16).default([]),
  fromName: z.string().trim().min(1).max(120).default('호정국제'),
  fromAddress: z.string().trim().email().max(200).default('bookings@hoveringlaw.com.tw'),
  scheduledAt: z.string().datetime().optional(),
});

export const campaignUpdateSchema = campaignCreateSchema.partial().extend({
  status: z.enum(['draft', 'scheduled']).optional(),
});

export const campaignSendSchema = z.object({
  testEmail: z.string().trim().email().max(200).optional(),
  batchSize: z.number().int().min(1).max(500).default(50),
});

export function createEmptyStats(): CampaignStats {
  return { recipients: 0, opens: 0, clicks: 0, unsubscribes: 0, bounces: 0 };
}

export function asLocaleKey(value: string): keyof LocalizedText {
  if (locales.includes(value as (typeof locales)[number])) {
    return value as keyof LocalizedText;
  }
  return 'ko';
}
