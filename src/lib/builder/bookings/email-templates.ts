import { buildBookingManageUrl } from '@/lib/builder/bookings/manage-token';
import {
  bookingEmailTemplateTypes,
  textForLocale,
  type Booking,
  type BookingEmailTemplate,
  type BookingEmailTemplateType,
  type BookingService,
  type Staff,
} from '@/lib/builder/bookings/types';
import {
  getBookingEmailTemplate,
  listStoredBookingEmailTemplates,
  saveBookingEmailTemplate,
  timestamped,
} from '@/lib/builder/bookings/storage';
import {
  bookingEmailTemplateConfig,
  bookingEmailTemplatePlaceholders,
} from '@/lib/builder/bookings/email-template-config';

export { bookingEmailTemplateConfig, bookingEmailTemplatePlaceholders };

export type BookingEmailRenderContext = {
  service?: BookingService | null;
  staff?: Staff | null;
};

type Replacement = {
  text: string;
  html?: string;
};

function nowIso(): string {
  return new Date().toISOString();
}

export function isBookingEmailTemplateType(value: string): value is BookingEmailTemplateType {
  return (bookingEmailTemplateTypes as readonly string[]).includes(value);
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function textToHtml(input: string): string {
  return escapeHtml(input).replace(/\r?\n/g, '<br>');
}

export function defaultBookingEmailTemplate(type: BookingEmailTemplateType): BookingEmailTemplate {
  const stamp = nowIso();
  const config = bookingEmailTemplateConfig[type];
  return {
    templateId: type,
    type,
    subject: config.subject,
    body: config.body,
    isActive: true,
    createdAt: stamp,
    updatedAt: stamp,
  };
}

export async function listBookingEmailTemplates(): Promise<BookingEmailTemplate[]> {
  const stored = await listStoredBookingEmailTemplates();
  const byType = new Map(stored.map((template) => [template.type, template]));
  return bookingEmailTemplateTypes.map((type) => byType.get(type) ?? defaultBookingEmailTemplate(type));
}

export async function resolveBookingEmailTemplate(type: BookingEmailTemplateType): Promise<BookingEmailTemplate> {
  const stored = await getBookingEmailTemplate(type);
  if (stored?.isActive) return stored;
  return defaultBookingEmailTemplate(type);
}

export async function upsertBookingEmailTemplate(
  type: BookingEmailTemplateType,
  input: Pick<BookingEmailTemplate, 'subject' | 'body' | 'isActive'>,
): Promise<BookingEmailTemplate> {
  const existing = await getBookingEmailTemplate(type);
  const next = timestamped({
    templateId: type,
    type,
    subject: input.subject,
    body: input.body,
    isActive: input.isActive,
  }, existing?.createdAt);
  await saveBookingEmailTemplate(next);
  return next;
}

function formatDateTime(value: string, locale: Booking['customer']['locale']): string {
  try {
    return new Date(value).toLocaleString(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return value;
  }
}

function serviceName(booking: Booking, context: BookingEmailRenderContext): string {
  return textForLocale(context.service?.name, booking.customer.locale) || booking.serviceId;
}

function staffName(booking: Booking, context: BookingEmailRenderContext): string {
  return textForLocale(context.staff?.name, booking.customer.locale) || booking.staffId;
}

function bookingSummaryText(booking: Booking, context: BookingEmailRenderContext): string {
  const attachments = booking.customer.attachmentUrls ?? [];
  const customFields = booking.customer.customFields ?? [];
  const rows = [
    `Service: ${serviceName(booking, context)}`,
    `Staff: ${staffName(booking, context)}`,
    `Time: ${formatDateTime(booking.startAt, booking.customer.locale)}`,
    booking.meetingLink ? `Meeting link: ${booking.meetingLink}` : '',
    booking.customerTimezone ? `Customer timezone: ${booking.customerTimezone}` : '',
    `Name: ${booking.customer.name}`,
    `Email: ${booking.customer.email}`,
    booking.customer.phone ? `Phone: ${booking.customer.phone}` : '',
    booking.customer.notes ? `Notes: ${booking.customer.notes}` : '',
    booking.customer.caseSummary ? `Case summary: ${booking.customer.caseSummary}` : '',
    attachments.length > 0 ? `Attachments: ${attachments.join(', ')}` : '',
    ...customFields.map((field) => `${field.label}: ${field.value}`),
    `Manage: ${buildBookingManageUrl(booking, booking.customer.locale)}`,
  ];
  return rows.filter(Boolean).join('\n');
}

function bookingSummaryHtml(booking: Booking, context: BookingEmailRenderContext): string {
  const attachments = booking.customer.attachmentUrls ?? [];
  const customFields = booking.customer.customFields ?? [];
  const manageUrl = buildBookingManageUrl(booking, booking.customer.locale);
  return `
    <div style="border:1px solid #dbe4ef;border-radius:10px;padding:14px;margin:16px 0;background:#f8fafc">
      <p><strong>Service</strong>: ${escapeHtml(serviceName(booking, context))}</p>
      <p><strong>Staff</strong>: ${escapeHtml(staffName(booking, context))}</p>
      <p><strong>Time</strong>: ${escapeHtml(formatDateTime(booking.startAt, booking.customer.locale))}</p>
      ${booking.meetingLink ? `<p><strong>Meeting link</strong>: <a href="${escapeHtml(booking.meetingLink)}">${escapeHtml(booking.meetingLink)}</a></p>` : ''}
      ${booking.customerTimezone ? `<p><strong>Customer timezone</strong>: ${escapeHtml(booking.customerTimezone)}</p>` : ''}
      <p><strong>Name</strong>: ${escapeHtml(booking.customer.name)}</p>
      <p><strong>Email</strong>: ${escapeHtml(booking.customer.email)}</p>
      ${booking.customer.phone ? `<p><strong>Phone</strong>: ${escapeHtml(booking.customer.phone)}</p>` : ''}
      ${booking.customer.notes ? `<p><strong>Notes</strong>: ${escapeHtml(booking.customer.notes)}</p>` : ''}
      ${booking.customer.caseSummary ? `<p><strong>Case summary</strong>: ${escapeHtml(booking.customer.caseSummary)}</p>` : ''}
      ${attachments.length > 0 ? `<p><strong>Attachments</strong>: ${attachments.map((url) => escapeHtml(url)).join('<br>')}</p>` : ''}
      ${customFields.map((field) => `<p><strong>${escapeHtml(field.label)}</strong>: ${escapeHtml(field.value)}</p>`).join('')}
      <p><a href="${escapeHtml(manageUrl)}">Manage, reschedule, or cancel this booking</a></p>
    </div>
  `;
}

function replacementsForBooking(booking: Booking, context: BookingEmailRenderContext): Record<string, Replacement> {
  const manageUrl = buildBookingManageUrl(booking, booking.customer.locale);
  const summaryText = bookingSummaryText(booking, context);
  return {
    customerName: { text: booking.customer.name },
    customerEmail: { text: booking.customer.email },
    customerPhone: { text: booking.customer.phone || '-' },
    serviceName: { text: serviceName(booking, context) },
    staffName: { text: staffName(booking, context) },
    startTime: { text: formatDateTime(booking.startAt, booking.customer.locale) },
    endTime: { text: formatDateTime(booking.endAt, booking.customer.locale) },
    timezone: { text: booking.customerTimezone || '-' },
    meetingLink: { text: booking.meetingLink || 'Will be shared by the office' },
    manageUrl: { text: manageUrl, html: `<a href="${escapeHtml(manageUrl)}">${escapeHtml(manageUrl)}</a>` },
    caseSummary: { text: booking.customer.caseSummary || '-' },
    notes: { text: booking.customer.notes || '-' },
    bookingSummary: { text: summaryText, html: bookingSummaryHtml(booking, context) },
  };
}

function replaceTemplateText(template: string, replacements: Record<string, Replacement>): string {
  return template.replace(/{{\s*([a-zA-Z0-9]+)\s*}}/g, (match, key: string) => replacements[key]?.text ?? match);
}

function replaceTemplateHtml(template: string, replacements: Record<string, Replacement>): string {
  const tokenPattern = /{{\s*([a-zA-Z0-9]+)\s*}}/g;
  let html = '';
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenPattern.exec(template))) {
    html += textToHtml(template.slice(lastIndex, match.index));
    const replacement = replacements[match[1]];
    html += replacement?.html ?? textToHtml(replacement?.text ?? match[0]);
    lastIndex = match.index + match[0].length;
  }

  html += textToHtml(template.slice(lastIndex));
  return html;
}

export function renderBookingEmailTemplate(
  template: BookingEmailTemplate,
  booking: Booking,
  context: BookingEmailRenderContext = {},
): { subject: string; html: string; text: string } {
  const replacements = replacementsForBooking(booking, context);
  return {
    subject: replaceTemplateText(template.subject, replacements).trim(),
    html: replaceTemplateHtml(template.body, replacements),
    text: replaceTemplateText(template.body, replacements).trim(),
  };
}

export async function renderBookingEmail(
  type: BookingEmailTemplateType,
  booking: Booking,
  context: BookingEmailRenderContext = {},
): Promise<{ subject: string; html: string; text: string }> {
  const template = await resolveBookingEmailTemplate(type);
  return renderBookingEmailTemplate(template, booking, context);
}
