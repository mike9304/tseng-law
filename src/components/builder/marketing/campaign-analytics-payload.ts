import { z } from 'zod';

// Must stay in sync with CampaignStatus (campaign-types.ts). The dispatcher can
// mark a campaign 'partial' (mixed success/failure), and the stats route emits
// campaign.status verbatim — omitting it here makes CampaignAnalyticsPanel's
// safeParse drop a truthful partial campaign into the client error state.
const campaignStatusSchema = z.enum(['draft', 'scheduled', 'sending', 'sent', 'failed', 'partial']);
const recipientBreakdownSchema = z.object({
  pending: z.number(),
  sent: z.number(),
  failed: z.number(),
  bounced: z.number(),
  opened: z.number(),
  clicked: z.number(),
  unsubscribed: z.number(),
});
const campaignStatsSchema = z.object({
  recipients: z.number(),
  opens: z.number(),
  clicks: z.number(),
  unsubscribes: z.number(),
  bounces: z.number(),
});
const ratesSchema = z.object({
  open: z.number(),
  click: z.number(),
  unsubscribe: z.number(),
});
const campaignActivityEventSchema = z.object({
  kind: z.enum(['sent', 'opened', 'clicked', 'unsubscribed']),
  occurredAt: z.string(),
  subscriberId: z.string(),
  email: z.string(),
});
const campaignFunnelStepSchema = z.object({
  key: z.enum(['recipients', 'opens', 'clicks', 'unsubscribes', 'bounces']),
  count: z.number(),
  rate: z.number(),
});

export const campaignAnalyticsStatsPayloadSchema = z.object({
  ok: z.literal(true),
  campaign: z.object({
    campaignId: z.string(),
    name: z.string(),
    status: campaignStatusSchema,
    sentAt: z.string().optional(),
  }),
  stats: campaignStatsSchema,
  rates: ratesSchema,
  pending: z.number(),
  recipientBreakdown: recipientBreakdownSchema,
  recentEvents: z.array(campaignActivityEventSchema),
  funnel: z.array(campaignFunnelStepSchema),
});

export type CampaignAnalyticsStatsPayload = z.infer<typeof campaignAnalyticsStatsPayloadSchema>;
