import type { Meta, StoryObj } from '@storybook/react';
import WebhooksAdmin from './WebhooksAdmin';
import type { WebhookSubscription } from '@/lib/builder/webhooks/types';

const make = (overrides: Partial<WebhookSubscription>): WebhookSubscription => ({
  webhookId: 'wh_1',
  url: 'https://hooks.example.com/incoming',
  events: ['form.submitted'],
  secret: 'whsec_redacted…',
  active: true,
  createdAt: '2026-05-01T00:00:00Z',
  updatedAt: '2026-05-01T00:00:00Z',
  ...overrides,
});

const meta: Meta<typeof WebhooksAdmin> = {
  title: 'Webhooks / Admin',
  component: WebhooksAdmin,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof WebhooksAdmin>;

export const Empty: Story = { args: { initialSubscriptions: [] } };

export const Mixed: Story = {
  args: {
    initialSubscriptions: [
      make({ webhookId: 'w1', url: 'https://hooks.zapier.com/x', events: ['form.submitted', 'booking.created'], description: 'Zapier CRM bridge' }),
      make({ webhookId: 'w2', url: 'https://make.com/y', events: ['booking.cancelled'], active: false }),
      make({ webhookId: 'w3', url: 'https://n8n.example.com/z', events: ['page.published'] }),
    ],
  },
};
