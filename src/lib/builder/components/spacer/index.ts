import { defineComponent } from '../define';

export default defineComponent({
  kind: 'spacer',
  displayName: 'spacer',
  category: 'advanced',
  icon: '◻',
  defaultContent: {},
  defaultRect: { width: 300, height: 40 },
  Render: function spacerPlaceholder() {
    const React = require('react');
    return React.createElement('div', {
      style: { border: '2px dashed #d1d5db', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: '#9ca3af', fontSize: '0.85rem' },
    }, 'spacer (Phase 7)');
  },
});
