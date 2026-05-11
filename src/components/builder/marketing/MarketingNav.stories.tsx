import type { Meta, StoryObj } from '@storybook/react';
import MarketingNav from './MarketingNav';

const meta: Meta<typeof MarketingNav> = {
  title: 'Marketing / Nav',
  component: MarketingNav,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof MarketingNav>;

export const Campaigns: Story = {
  args: { locale: 'ko', active: 'campaigns' },
};

export const Subscribers: Story = {
  args: { locale: 'ko', active: 'subscribers' },
};
