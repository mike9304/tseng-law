import { defineComponent } from '../define';
import EventRsvpElement from './Element';

export default defineComponent({
  kind: 'event-rsvp',
  displayName: '이벤트 신청',
  category: 'domain',
  icon: 'RSVP',
  defaultContent: {
    title: '이벤트 신청',
    showTicketInfo: true,
    successMessage: '신청이 접수되었습니다. 확인 메일을 기다려 주세요.',
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
