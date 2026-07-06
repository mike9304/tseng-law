import { defineComponent } from '../define';
import EventRsvpElement from './Element';
import { EVENT_RSVP_LEGACY_DEFAULTS } from '../event-widgets-copy';

export default defineComponent({
  kind: 'event-rsvp',
  displayName: '이벤트 신청',
  category: 'domain',
  icon: 'RSVP',
  defaultContent: {
    title: EVENT_RSVP_LEGACY_DEFAULTS.title,
    showTicketInfo: true,
    successMessage: EVENT_RSVP_LEGACY_DEFAULTS.successMessage,
  },
  defaultStyle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
  },
  defaultRect: { width: 520, height: 560 },
  Render: EventRsvpElement,
});
