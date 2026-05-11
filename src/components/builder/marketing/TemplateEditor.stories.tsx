import type { Meta, StoryObj } from '@storybook/react';
import TemplateEditor from './TemplateEditor';
import type { EmailTemplate } from '@/lib/builder/marketing/templates/types';

const sample: EmailTemplate = {
  templateId: 'tpl_demo',
  name: '예약 확인 메일',
  blocks: [
    { blockId: 'h1', kind: 'heading', text: '예약이 확정되었습니다', level: 1, align: 'left' },
    { blockId: 't1', kind: 'text', text: '안녕하세요, 호정국제법률사무소입니다.\n예약이 확정되어 안내 드립니다.' },
    { blockId: 's1', kind: 'spacer', height: 16 },
    { blockId: 'b1', kind: 'button', label: '예약 확인하기', href: 'https://tseng-law.com/bookings/x', background: '#0f172a', textColor: '#ffffff' },
    { blockId: 'd1', kind: 'divider', color: '#e2e8f0' },
    { blockId: 't2', kind: 'text', text: '문의가 있으시면 회신 부탁드립니다.' },
  ],
  pageBackground: '#f1f5f9',
  contentBackground: '#ffffff',
  createdAt: '2026-05-11T00:00:00Z',
  updatedAt: '2026-05-11T00:00:00Z',
};

const meta: Meta<typeof TemplateEditor> = {
  title: 'Marketing / Template editor',
  component: TemplateEditor,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof TemplateEditor>;

export const Sample: Story = {
  args: { initialTemplate: sample },
};

export const Empty: Story = {
  args: {
    initialTemplate: { ...sample, blocks: [] },
  },
};
