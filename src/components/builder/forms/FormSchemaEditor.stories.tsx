import type { Meta, StoryObj } from '@storybook/react';
import FormSchemaEditor from './FormSchemaEditor';
import type { FormSchema } from '@/lib/builder/forms/form-engine';

const sample: FormSchema = {
  formId: 'demo-form',
  name: '상담 신청',
  fields: [
    { id: 'name', type: 'text', label: '이름', required: true, step: 0 },
    { id: 'email', type: 'email', label: '이메일', required: true, step: 0 },
    { id: 'category', type: 'select', label: '문의 유형', required: true, options: ['일반', '소송', '회사설립'], step: 0 },
    { id: 'caseDetail', type: 'textarea', label: '사건 개요', required: true, step: 1, conditionalOn: { fieldId: 'category', operator: 'equals', value: '소송' } },
    { id: 'budget', type: 'number', label: '예산 (만원)', required: false, step: 1 },
  ],
  steps: [
    { id: 's0', label: '기본 정보' },
    { id: 's1', label: '상세' },
  ],
  submitLabel: 'Submit',
  successMessage: '접수되었습니다',
  errorMessage: '오류',
  createdAt: '2026-05-11T00:00:00Z',
  updatedAt: '2026-05-11T00:00:00Z',
};

const meta: Meta<typeof FormSchemaEditor> = {
  title: 'Forms / Schema editor',
  component: FormSchemaEditor,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof FormSchemaEditor>;

export const Sample: Story = {
  args: { initialSchema: sample },
};

export const Empty: Story = {
  args: {
    initialSchema: {
      ...sample,
      fields: [],
      steps: [{ id: 'default', label: '기본' }],
    },
  },
};
