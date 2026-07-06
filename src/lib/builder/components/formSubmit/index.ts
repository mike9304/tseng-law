import { defineComponent } from '../define';
import FormSubmitElement from './Element';
import FormSubmitInspector from './Inspector';
import { FORM_SUBMIT_KO_DEFAULTS } from '../form/form-controls-copy';

export default defineComponent({
  kind: 'form-submit',
  displayName: '제출 버튼',
  category: 'domain',
  icon: '➤',
  defaultContent: {
    label: FORM_SUBMIT_KO_DEFAULTS.label,
    style: 'primary' as const,
    fullWidth: false,
    loadingLabel: FORM_SUBMIT_KO_DEFAULTS.loadingLabel,
  },
  defaultStyle: {
    borderRadius: 8,
  },
  defaultRect: { width: 140, height: 48 },
  Render: FormSubmitElement,
  Inspector: FormSubmitInspector,
});
