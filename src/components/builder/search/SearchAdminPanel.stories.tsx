import type { Meta, StoryObj } from '@storybook/react';
import SearchAdminPanel from './SearchAdminPanel';

const meta: Meta<typeof SearchAdminPanel> = {
  title: 'Search / Admin',
  component: SearchAdminPanel,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof SearchAdminPanel>;

export const Empty: Story = {
  args: {
    initialIndexSummary: { builtAt: null, totals: {} },
    initialQueryStats: { totalQueries: 0, uniqueQueries: 0, top: [], zeroResultQueries: [] },
  },
};

export const WithTraffic: Story = {
  args: {
    initialIndexSummary: { builtAt: '2026-05-11T03:00:00Z', totals: { ko: 24, 'zh-hant': 18, en: 21 } },
    initialQueryStats: {
      totalQueries: 480,
      uniqueQueries: 96,
      top: [
        { query: '대만 진출', count: 64, avgHits: 4.2, zeroResults: false, locales: ['ko'], lastAt: '2026-05-11T02:00:00Z' },
        { query: '회사 설립', count: 42, avgHits: 3.1, zeroResults: false, locales: ['ko', 'zh-hant'], lastAt: '2026-05-11T01:00:00Z' },
        { query: '비자', count: 28, avgHits: 0, zeroResults: true, locales: ['ko'], lastAt: '2026-05-10T22:00:00Z' },
      ],
      zeroResultQueries: [
        { query: '비자', count: 28, avgHits: 0, zeroResults: true, locales: ['ko'], lastAt: '2026-05-10T22:00:00Z' },
      ],
    },
  },
};
