import { defineComponent } from '../define';

export default defineComponent({
  kind: 'divider',
  displayName: 'divider',
  category: 'advanced',
  icon: '◻',
  defaultContent: {},
  defaultStyle: {},
  defaultRect: { width: 300, height: 4 },
  Render: function dividerPlaceholder() {
    return (
      <div style={{ border: '2px dashed #d1d5db', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: '#9ca3af', fontSize: '0.85rem' }}>
        divider (Phase 7)
      </div>
    );
  },
});
