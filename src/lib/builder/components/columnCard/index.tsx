import { defineComponent } from '../define';

export default defineComponent({
  kind: 'columnCard',
  displayName: 'columnCard',
  category: 'domain',
  icon: '◻',
  defaultContent: {},
  defaultStyle: {},
  defaultRect: { width: 400, height: 250 },
  Render: function columnCardPlaceholder() {
    return (
      <div style={{ border: '2px dashed #d1d5db', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: '#9ca3af', fontSize: '0.85rem' }}>
        columnCard (Phase 7)
      </div>
    );
  },
});
