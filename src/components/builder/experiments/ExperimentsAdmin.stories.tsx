import type { Meta, StoryObj } from '@storybook/react';
import ExperimentsAdmin from './ExperimentsAdmin';
import type { Experiment } from '@/lib/builder/experiments/types';

const make = (overrides: Partial<Experiment>): Experiment => ({
  experimentId: 'exp_demo',
  name: 'CTA color test',
  targetPath: '/ko/services',
  variants: [
    { variantId: 'control', label: 'control', weight: 50 },
    { variantId: 'green', label: 'green', weight: 50 },
  ],
  goalEvent: 'cta-click',
  status: 'running',
  metrics: {
    exposures: { control: 820, green: 800 },
    conversions: { control: 41, green: 73 },
  },
  createdAt: '2026-05-01T00:00:00Z',
  updatedAt: '2026-05-10T00:00:00Z',
  ...overrides,
});

const meta: Meta<typeof ExperimentsAdmin> = {
  title: 'Experiments / Admin',
  component: ExperimentsAdmin,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof ExperimentsAdmin>;

export const Empty: Story = { args: { initialExperiments: [] } };

export const Running: Story = {
  args: {
    initialExperiments: [
      make({ experimentId: 'e1', status: 'running' }),
      make({ experimentId: 'e2', name: 'Pricing reorder', status: 'paused' }),
      make({ experimentId: 'e3', name: 'Hero headline', status: 'completed' }),
    ],
  },
};
