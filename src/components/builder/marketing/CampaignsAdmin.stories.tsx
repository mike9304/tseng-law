import type { Meta, StoryObj } from '@storybook/react';
import CampaignsAdmin from './CampaignsAdmin';
import type { Campaign } from '@/lib/builder/marketing/campaign-types';

const baseCampaign = (overrides: Partial<Campaign>): Campaign => ({
  campaignId: 'camp_1',
  name: 'Spring update',
  subject: { ko: '봄 업데이트', 'zh-hant': '春季公告', en: 'Spring update' },
  bodyHtml: { ko: '<p>안녕</p>', 'zh-hant': '<p>Hi</p>', en: '<p>Hi</p>' },
  bodyText: { ko: '안녕', 'zh-hant': 'Hi', en: 'Hi' },
  segmentTags: [],
  fromName: '호정국제',
  fromAddress: 'bookings@hoveringlaw.com.tw',
  status: 'draft',
  stats: { recipients: 0, opens: 0, clicks: 0, unsubscribes: 0, bounces: 0 },
  createdAt: '2026-05-11T00:00:00Z',
  updatedAt: '2026-05-11T00:00:00Z',
  ...overrides,
});

const meta: Meta<typeof CampaignsAdmin> = {
  title: 'Marketing / Campaigns admin',
  component: CampaignsAdmin,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof CampaignsAdmin>;

export const Empty: Story = {
  args: { initialCampaigns: [], locale: 'ko' },
};

export const WithCampaigns: Story = {
  args: {
    locale: 'ko',
    initialCampaigns: [
      baseCampaign({ campaignId: 'c1', name: 'Spring update', status: 'draft' }),
      baseCampaign({
        campaignId: 'c2',
        name: 'Quarterly newsletter',
        status: 'sent',
        stats: { recipients: 320, opens: 180, clicks: 42, unsubscribes: 3, bounces: 6 },
      }),
      baseCampaign({ campaignId: 'c3', name: 'Webinar invite', status: 'scheduled' }),
    ],
  },
};
