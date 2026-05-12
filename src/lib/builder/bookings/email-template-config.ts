import type { BookingEmailTemplateType } from '@/lib/builder/bookings/types';

export const bookingEmailTemplatePlaceholders = [
  'customerName',
  'customerEmail',
  'customerPhone',
  'serviceName',
  'staffName',
  'startTime',
  'endTime',
  'timezone',
  'meetingLink',
  'manageUrl',
  'caseSummary',
  'notes',
  'bookingSummary',
] as const;

export const bookingEmailTemplateConfig: Record<
  BookingEmailTemplateType,
  { label: string; description: string; subject: string; body: string }
> = {
  'customer-confirmation': {
    label: 'Customer confirmation',
    description: 'Sent to the customer after a booking is created or promoted from the waitlist.',
    subject: '[Hojeong] {{serviceName}} booking confirmed',
    body: `Hello {{customerName}},

Your consultation is confirmed.

Service: {{serviceName}}
Attorney: {{staffName}}
Time: {{startTime}}
Meeting link: {{meetingLink}}

You can manage, reschedule, or cancel here:
{{manageUrl}}

{{bookingSummary}}`,
  },
  'admin-notification': {
    label: 'Admin notification',
    description: 'Sent to the assigned attorney or bookings admin when a booking is created.',
    subject: '[Bookings] New consultation: {{customerName}}',
    body: `A new consultation has been booked.

Customer: {{customerName}}
Email: {{customerEmail}}
Phone: {{customerPhone}}
Service: {{serviceName}}
Attorney: {{staffName}}
Time: {{startTime}}

Case summary:
{{caseSummary}}

{{bookingSummary}}`,
  },
  'customer-reminder': {
    label: 'Customer reminder',
    description: 'Sent before a consultation as the reminder email body.',
    subject: '[Hojeong] Consultation reminder: {{startTime}}',
    body: `Hello {{customerName}},

This is a reminder for your upcoming consultation.

Service: {{serviceName}}
Attorney: {{staffName}}
Time: {{startTime}}
Meeting link: {{meetingLink}}

Manage this booking:
{{manageUrl}}`,
  },
  'customer-cancellation': {
    label: 'Customer cancellation',
    description: 'Sent to the customer when a booking is cancelled.',
    subject: '[Hojeong] Consultation booking cancelled',
    body: `Hello {{customerName}},

Your consultation has been cancelled.

Service: {{serviceName}}
Attorney: {{staffName}}
Original time: {{startTime}}

If this was a mistake, please book a new consultation from the site.`,
  },
};
