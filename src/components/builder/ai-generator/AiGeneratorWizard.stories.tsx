import type { Meta, StoryObj } from '@storybook/react';
import AiGeneratorWizard from './AiGeneratorWizard';

const meta: Meta<typeof AiGeneratorWizard> = {
  title: 'AI Generator / Wizard',
  component: AiGeneratorWizard,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof AiGeneratorWizard>;

export const Default: Story = {
  args: { locale: 'ko' },
};
