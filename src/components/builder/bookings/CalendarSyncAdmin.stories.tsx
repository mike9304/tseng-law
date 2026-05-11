import type { Meta, StoryObj } from '@storybook/react';
import CalendarSyncAdmin from './CalendarSyncAdmin';
import type { CalendarConnection } from '@/lib/builder/bookings/calendar-sync/types';

const make = (overrides: Partial<CalendarConnection>): CalendarConnection => ({
  connectionId: 'cs_google_staff_1',
  staffId: 'staff_1',
  provider: 'google',
  refreshTokenEncrypted: 'iv:cipher:tag',
  scope: 'https://www.googleapis.com/auth/calendar.events',
  status: 'connected',
  createdAt: '2026-05-01T00:00:00Z',
  updatedAt: '2026-05-10T00:00:00Z',
  ...overrides,
});

const meta: Meta<typeof CalendarSyncAdmin> = {
  title: 'Bookings / Calendar sync admin',
  component: CalendarSyncAdmin,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof CalendarSyncAdmin>;

export const NoStaff: Story = {
  args: { initialConnections: [], staff: [], googleConfigured: false, outlookConfigured: false },
};

export const Mixed: Story = {
  args: {
    staff: [
      { staffId: 'staff_1', name: '호정 변호사' },
      { staffId: 'staff_2', name: 'Lee 변호사' },
    ],
    googleConfigured: true,
    outlookConfigured: true,
    initialConnections: [
      make({ staffId: 'staff_1', provider: 'google', status: 'connected', lastSyncedAt: '2026-05-10T03:00:00Z' }),
      make({ staffId: 'staff_2', provider: 'outlook', status: 'error', lastError: 'refresh failed' }),
    ],
  },
};
