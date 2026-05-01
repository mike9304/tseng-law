import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderBookingWidgetCanvasNode } from '@/lib/builder/canvas/types';

const sectionLabelStyle: React.CSSProperties = {
  color: '#64748b',
  display: 'block',
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  marginBottom: 4,
  marginTop: 12,
  textTransform: 'uppercase',
};

const selectStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 6,
  fontSize: '0.85rem',
  padding: '4px 6px',
  width: '100%',
};

export default function BookingWidgetInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const bookingNode = node as BuilderBookingWidgetCanvasNode;
  const c = bookingNode.content;

  return (
    <>
      <span style={sectionLabelStyle}>Section</span>
      <label>
        <span>Eyebrow</span>
        <input
          type="text"
          value={c.eyebrow}
          disabled={disabled}
          onChange={(event) => onUpdate({ eyebrow: event.target.value })}
          placeholder="Booking"
        />
      </label>
      <label>
        <span>Title</span>
        <input
          type="text"
          value={c.title}
          disabled={disabled}
          onChange={(event) => onUpdate({ title: event.target.value })}
          placeholder="Book a consultation"
        />
      </label>
      <label>
        <span>Locale</span>
        <select
          style={selectStyle}
          value={c.locale}
          disabled={disabled}
          onChange={(event) => onUpdate({ locale: event.target.value })}
        >
          <option value="ko">Korean</option>
          <option value="zh-hant">Traditional Chinese</option>
          <option value="en">English</option>
        </select>
      </label>

      <span style={sectionLabelStyle}>Booking Filters</span>
      <label>
        <span>Service ID</span>
        <input
          type="text"
          value={c.serviceId}
          disabled={disabled}
          onChange={(event) => onUpdate({ serviceId: event.target.value })}
          placeholder="svc-initial-consultation"
        />
      </label>
      <label>
        <span>Staff ID</span>
        <input
          type="text"
          value={c.staffId}
          disabled={disabled}
          onChange={(event) => onUpdate({ staffId: event.target.value })}
          placeholder="staff-tseng"
        />
      </label>

      <span style={sectionLabelStyle}>Completion</span>
      <label>
        <span>Success message</span>
        <textarea
          rows={3}
          value={c.successMessage}
          disabled={disabled}
          onChange={(event) => onUpdate({ successMessage: event.target.value })}
        />
      </label>
      <label>
        <span>Redirect after booking</span>
        <input
          type="text"
          value={c.redirectAfterBooking}
          disabled={disabled}
          onChange={(event) => onUpdate({ redirectAfterBooking: event.target.value })}
          placeholder="/ko/thank-you"
        />
      </label>
    </>
  );
}
