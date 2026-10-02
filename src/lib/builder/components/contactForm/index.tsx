'use client';

import { defineComponent } from '../define';
import ContactFormInspector from './Inspector';
import { CONTACT_FORM_LEGACY_DEFAULTS } from '../conversion-widgets-copy';

import ContactFormRender from './Render';

export default defineComponent({
  kind: 'contactForm',
  displayName: 'contactForm',
  category: 'domain',
  icon: '◻',
  defaultContent: {
    fields: CONTACT_FORM_LEGACY_DEFAULTS.fields.map((field) => field),
    submitLabel: CONTACT_FORM_LEGACY_DEFAULTS.submitLabel,
    action: CONTACT_FORM_LEGACY_DEFAULTS.action,
  },
  defaultStyle: {},
  defaultRect: { width: 400, height: 250 },
  Render: ContactFormRender,
  Inspector: ContactFormInspector,
});
