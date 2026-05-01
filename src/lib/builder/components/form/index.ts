import { defineComponent } from '../define';
import FormElement from './Element';
import FormInspector from './Inspector';

export default defineComponent({
  kind: 'form',
  displayName: '폼',
  category: 'domain',
  icon: '⊞',
  defaultContent: {
    name: 'contact-form',
    submitTo: 'storage' as const,
    targetEmail: undefined,
    webhookUrl: undefined,
    successMessage: '감사합니다. 곧 연락드리겠습니다.',
    redirectUrl: undefined,
    method: 'POST' as const,
    layoutMode: 'absolute' as const,
    captcha: 'none' as const,
    steps: undefined,
    autoReplyEnabled: false,
    autoReplyTemplate: '',
  },
  defaultStyle: {
    backgroundColor: 'rgba(248, 250, 252, 0.96)',
    borderColor: '#cbd5e1',
    borderStyle: 'dashed' as const,
    borderWidth: 2,
    borderRadius: 16,
  },
  defaultRect: { width: 420, height: 360 },
  Render: FormElement,
  Inspector: FormInspector,
});
