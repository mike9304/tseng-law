import { defineComponent } from '../define';
import EventListElement from './Element';

export default defineComponent({
  kind: 'event-list',
  displayName: '이벤트 목록',
  category: 'domain',
  icon: 'CAL',
  defaultContent: {
    layout: 'cards' as const,
    limit: 6,
    timeFilter: 'upcoming' as const,
    showDescription: true,
    showCapacity: true,
    showRsvp: true,
    columns: 3,
  },
  defaultStyle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
  },
  defaultRect: { width: 1120, height: 620 },
  Render: EventListElement,
});
