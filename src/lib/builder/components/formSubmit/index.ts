import { defineComponent } from '../define';
import FormSubmitElement from './Element';
import FormSubmitInspector from './Inspector';

export default defineComponent({
  kind: 'form-submit',
  displayName: '제출 버튼',
  category: 'domain',
  icon: '➤',
  defaultContent: {
    label: '제출',
    style: 'primary' as const,
    fullWidth: false,
    loadingLabel: '전송 중...',
  },
  defaultStyle: {
    borderRadius: 8,
  },
  defaultRect: { width: 140, height: 48 },
  Render: FormSubmitElement,
  Inspector: FormSubmitInspector,
});
