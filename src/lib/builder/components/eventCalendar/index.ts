import { defineComponent } from '../define';
import EventCalendarElement from './Element';

export default defineComponent({
  kind: 'event-calendar',
  displayName: '이벤트 캘린더',
  category: 'domain',
  icon: 'CAL',
  defaultContent: {
    months: 3,
    showPast: false,
    showCapacity: true,
  },
  defaultStyle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
  },
  defaultRect: { width: 980, height: 560 },
  Render: EventCalendarElement,
});
