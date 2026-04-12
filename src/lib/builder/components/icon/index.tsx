import { defineComponent } from '../define';

export default defineComponent({
  kind: 'icon',
  displayName: 'icon',
  category: 'media',
  icon: '◻',
  defaultContent: {},
  defaultStyle: {},
  defaultRect: { width: 300, height: 200 },
  Render: function iconPlaceholder() {
    return (
      <div style={{ border: '2px dashed #d1d5db', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: '#9ca3af', fontSize: '0.85rem' }}>
        icon (Phase 7)
      </div>
    );
  },
});
