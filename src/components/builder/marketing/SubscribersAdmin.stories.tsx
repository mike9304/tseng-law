import type { Meta, StoryObj } from '@storybook/react';
import SubscribersAdmin from './SubscribersAdmin';
import type { Subscriber } from '@/lib/builder/marketing/subscriber-types';

const make = (overrides: Partial<Subscriber>): Subscriber => ({
  subscriberId: 'sub_1',
  email: 'user@example.com',
  status: 'subscribed',
  tags: [],
  preferredLocale: 'ko',
  unsubscribeToken: 'tok',
  source: 'public-form',
  createdAt: '2026-04-01T00:00:00Z',
  updatedAt: '2026-04-01T00:00:00Z',
  ...overrides,
});

const meta: Meta<typeof SubscribersAdmin> = {
  title: 'Marketing / Subscribers admin',
  component: SubscribersAdmin,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof SubscribersAdmin>;

export const Empty: Story = { args: { initialSubscribers: [] } };

export const Mixed: Story = {
  args: {
    initialSubscribers: [
      make({ subscriberId: 's1', email: 'kim@example.com', tags: ['vip'], status: 'subscribed' }),
      make({ subscriberId: 's2', email: 'lee@example.com', tags: ['lead'], status: 'pending' }),
      make({ subscriberId: 's3', email: 'park@example.com', status: 'unsubscribed' }),
      make({ subscriberId: 's4', email: 'choi@example.com', status: 'bounced' }),
    ],
  },
};
