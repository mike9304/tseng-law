import { defineComponent } from '../define';

export default defineComponent({
  kind: 'ctaBanner',
  displayName: 'ctaBanner',
  category: 'domain',
  icon: '◻',
  defaultContent: {},
  defaultRect: { width: 400, height: 250 },
  Render: function ctaBannerPlaceholder() {
    const React = require('react');
    return React.createElement('div', {
      style: { border: '2px dashed #d1d5db', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: '#9ca3af', fontSize: '0.85rem' },
    }, 'ctaBanner (Phase 7)');
  },
});
