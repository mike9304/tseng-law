import type { Meta, StoryObj } from '@storybook/react';
import ErrorsAdmin from './ErrorsAdmin';
import type { CapturedError } from '@/lib/builder/errors/types';

const make = (overrides: Partial<CapturedError>): CapturedError => ({
  errorId: 'err_1',
  origin: 'api',
  severity: 'error',
  message: 'Unhandled exception in /api/forms/submit',
  capturedAt: '2026-05-10T10:00:00Z',
  forwardedToSentry: false,
  ...overrides,
});

const meta: Meta<typeof ErrorsAdmin> = {
  title: 'Errors / Admin',
  component: ErrorsAdmin,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof ErrorsAdmin>;

export const Empty: Story = {
  args: {
    initialEntries: [],
    totalCount: 0,
    severityCount: {},
    sentryConfigured: false,
  },
};

export const Mixed: Story = {
  args: {
    initialEntries: [
      make({ errorId: 'e1', severity: 'fatal', origin: 'builder', message: 'Selection overlay crashed', forwardedToSentry: true }),
      make({ errorId: 'e2', severity: 'error', origin: 'api', message: 'Stripe webhook 502', tags: { route: '/api/booking/stripe-webhook' } }),
      make({ errorId: 'e3', severity: 'warning', origin: 'site', message: 'Slow image load on /ko/services' }),
      make({ errorId: 'e4', severity: 'info', origin: 'client', message: 'Visitor closed modal without action' }),
    ],
    totalCount: 4,
    severityCount: { fatal: 1, error: 1, warning: 1, info: 1 },
    sentryConfigured: true,
  },
};
