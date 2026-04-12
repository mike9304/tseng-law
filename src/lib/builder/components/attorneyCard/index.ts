import { defineComponent } from '../define';

export default defineComponent({
  kind: 'attorneyCard',
  displayName: 'attorneyCard',
  category: 'domain',
  icon: '◻',
  defaultContent: {},
  defaultRect: { width: 400, height: 250 },
  Render: function attorneyCardPlaceholder() {
    const React = require('react');
    return React.createElement('div', {
      style: { border: '2px dashed #d1d5db', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: '#9ca3af', fontSize: '0.85rem' },
    }, 'attorneyCard (Phase 7)');
  },
});
