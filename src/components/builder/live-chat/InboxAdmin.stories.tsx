import type { Meta, StoryObj } from '@storybook/react';
import InboxAdmin from './InboxAdmin';

const meta: Meta<typeof InboxAdmin> = {
  title: 'Live chat / Inbox',
  component: InboxAdmin,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof InboxAdmin>;

export const Empty: Story = { args: { initialConversations: [] } };

export const Mixed: Story = {
  args: {
    initialConversations: [
      {
        conversationId: 'cnv_1',
        visitorName: '김민지',
        visitorEmail: 'minji@example.com',
        pagePath: '/ko/services',
        status: 'open',
        createdAt: '2026-05-11T01:00:00Z',
        updatedAt: '2026-05-11T01:05:00Z',
        lastMessageAt: '2026-05-11T01:05:00Z',
        unreadByAdmin: 2,
      },
      {
        conversationId: 'cnv_2',
        visitorName: '익명',
        pagePath: '/ko/contact',
        status: 'open',
        createdAt: '2026-05-10T22:00:00Z',
        updatedAt: '2026-05-10T22:10:00Z',
        lastMessageAt: '2026-05-10T22:10:00Z',
        unreadByAdmin: 0,
      },
      {
        conversationId: 'cnv_3',
        visitorName: 'John',
        visitorEmail: 'john@example.com',
        status: 'closed',
        createdAt: '2026-05-09T12:00:00Z',
        updatedAt: '2026-05-09T12:30:00Z',
        lastMessageAt: '2026-05-09T12:30:00Z',
        unreadByAdmin: 0,
      },
    ],
  },
};
