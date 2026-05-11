import type { Meta, StoryObj } from '@storybook/react';
import BackupsAdmin from './BackupsAdmin';

const meta: Meta<typeof BackupsAdmin> = {
  title: 'Backups / Admin',
  component: BackupsAdmin,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof BackupsAdmin>;

export const Empty: Story = { args: { initialBackups: [] } };

export const Mixed: Story = {
  args: {
    initialBackups: [
      { backupId: 'bkp_a', createdAt: '2026-05-11T01:00:00Z', triggeredBy: 'cron', prefixCount: 10, entryCount: 412, sizeBytes: 824_000 },
      { backupId: 'bkp_b', createdAt: '2026-05-10T01:00:00Z', triggeredBy: 'manual', prefixCount: 10, entryCount: 408, sizeBytes: 812_000 },
      { backupId: 'bkp_c', createdAt: '2026-05-09T01:00:00Z', triggeredBy: 'cron', prefixCount: 10, entryCount: 401, sizeBytes: 798_500 },
    ],
  },
};
