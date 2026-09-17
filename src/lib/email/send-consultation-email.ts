import crypto from 'crypto';
import nodemailer from 'nodemailer';
import type { Locale } from '@/lib/locales';
import {
  getConsultationCategoryLabel,
  getConsultationCopy,
  getConsultationRiskLabel,
} from '@/lib/consultation/copy';
import type { InternationalInquiryRecord } from '@/lib/consultation/international-inquiry-store';
import type {
  ConsultationCategory,
  ConsultationCollectedFields,
  ConsultationRiskLevel,
  ConsultationTranscriptMessage,
} from '@/lib/consultation/types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function resolveSmtpRuntime() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  const notify = process.env.CONSULTATION_NOTIFY_EMAIL || process.env.NOTIFY_EMAIL || 'wei@hoveringlaw.com.tw';
  return { host, port, user, pass, notify };
}

export interface ConsultationEmailPayload {
  locale: Locale;
  sessionId: string;
  collectedFields: ConsultationCollectedFields;
  transcript: ConsultationTranscriptMessage[];
  classification: ConsultationCategory;
  riskLevel: ConsultationRiskLevel;
  referencedColumns: string[];
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function listHtml(items: string[]): string {
  if (!items.length) return '<p style="margin:0;color:#6b7280;">없음</p>';
  return `<ul style="margin:0;padding-left:18px;">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function buildTranscriptPreview(transcript: ConsultationTranscriptMessage[]): string[] {
  return transcript.slice(-6).map((entry) => `${entry.role === 'user' ? 'USER' : 'AI'}: ${entry.text}`);
}

function isSafeEmailHeader(value: string | undefined): value is string {
  if (!value || value.length > 254 || /[\r\n]/.test(value)) return false;
  return EMAIL_PATTERN.test(value);
}

function officialReplyEmail(): string {
  return resolveSmtpRuntime().notify.split(',').map((email) => email.trim()).find(isSafeEmailHeader)
    || 'wei@hoveringlaw.com.tw';
}

function createTransporter() {
  const smtp = resolveSmtpRuntime();
  if (!smtp.host.trim() || !smtp.port || !smtp.user.trim() || !smtp.pass.trim()) {
    throw new Error(
      'SMTP is not fully configured. Check SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.',
    );
  }
  const emails = smtp.notify.split(',').map((e) => e.trim()).filter(Boolean);
  if (!emails.length || emails.some((e) => !isSafeEmailHeader(e))) {
    throw new Error('CONSULTATION_NOTIFY_EMAIL / NOTIFY_EMAIL is missing or invalid.');
  }

  return nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    requireTLS: smtp.port !== 465, // enforce STARTTLS on port 587
    auth: { user: smtp.user, pass: smtp.pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
}

const MAX_RETRIES = 3;
const RETRY_BASE_MS = 1000;

async function sendMailOnce(
  transporter: nodemailer.Transporter,
  mailOptions: nodemailer.SendMailOptions,
): Promise<void> {
  const result = await transporter.sendMail(mailOptions);
  if (!result.messageId) {
    throw new Error('SMTP returned no messageId');
  }
}

async function sendMailWithRetry(
  transporter: nodemailer.Transporter,
  mailOptions: nodemailer.SendMailOptions,
): Promise<void> {
  let lastError: unknown;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      await sendMailOnce(transporter, mailOptions);
      return;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES - 1) {
        const delay = process.env.NODE_ENV === 'test' ? 0 : RETRY_BASE_MS * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

export async function sendConsultationEmail(payload: ConsultationEmailPayload): Promise<{ intakeId: string }> {
  const transporter = createTransporter();
  const intakeId = `HC-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const submittedAt = new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Taipei',
  }).format(new Date());

  const categoryLabel = getConsultationCategoryLabel(payload.locale, payload.classification);
  const riskLabel = getConsultationRiskLabel(payload.locale, payload.riskLevel);
  const copy = getConsultationCopy(payload.locale);
  const collected = payload.collectedFields;
  const hasContact = [collected.email, collected.phoneOrMessenger].filter(Boolean);

  const smtp = resolveSmtpRuntime();
  await sendMailWithRetry(transporter, {
    from: `"호정 AI Intake" <${smtp.user}>`,
    to: smtp.notify,
    replyTo: isSafeEmailHeader(collected.email) ? collected.email : officialReplyEmail(),
    subject: `[호정 AI상담] ${categoryLabel} / ${riskLabel} / ${intakeId}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:760px;margin:0 auto;padding:24px;color:#1f2937;">
        <h2 style="margin:0 0 16px;font-size:24px;color:#123b63;">호정 AI 상담 접수</h2>
        <table style="width:100%;border-collapse:collapse;border:1px solid #d6e0eb;margin-bottom:20px;">
          <tbody>
            <tr>
              <td style="padding:10px 12px;background:#f4f7fb;font-weight:700;width:180px;">접수 ID</td>
              <td style="padding:10px 12px;">${escapeHtml(intakeId)}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;background:#f4f7fb;font-weight:700;">접수 시간</td>
              <td style="padding:10px 12px;">${escapeHtml(submittedAt)}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;background:#f4f7fb;font-weight:700;">세션 ID</td>
              <td style="padding:10px 12px;font-family:monospace;">${escapeHtml(payload.sessionId)}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;background:#f4f7fb;font-weight:700;">언어</td>
              <td style="padding:10px 12px;">${escapeHtml(payload.locale)}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;background:#f4f7fb;font-weight:700;">문의 유형</td>
              <td style="padding:10px 12px;">${escapeHtml(categoryLabel)}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;background:#f4f7fb;font-weight:700;">위험도</td>
              <td style="padding:10px 12px;">${escapeHtml(riskLabel)}</td>
            </tr>
          </tbody>
        </table>

        <h3 style="margin:20px 0 8px;font-size:18px;color:#123b63;">기본 정보</h3>
        <table style="width:100%;border-collapse:collapse;border:1px solid #d6e0eb;margin-bottom:20px;">
          <tbody>
            <tr>
              <td style="padding:10px 12px;background:#f9fbfd;font-weight:700;width:180px;">${escapeHtml(copy.formLabels.name)}</td>
              <td style="padding:10px 12px;">${escapeHtml(collected.name || '-')}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;background:#f9fbfd;font-weight:700;">${escapeHtml(copy.formLabels.email)}</td>
              <td style="padding:10px 12px;">${escapeHtml(collected.email || '-')}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;background:#f9fbfd;font-weight:700;">${escapeHtml(copy.formLabels.phoneOrMessenger)}</td>
              <td style="padding:10px 12px;">${escapeHtml(collected.phoneOrMessenger || '-')}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;background:#f9fbfd;font-weight:700;">${escapeHtml(copy.formLabels.preferredContact)}</td>
              <td style="padding:10px 12px;">${escapeHtml(collected.preferredContact || '-')}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;background:#f9fbfd;font-weight:700;">${escapeHtml(copy.formLabels.companyOrOrganization)}</td>
              <td style="padding:10px 12px;">${escapeHtml(collected.companyOrOrganization || '-')}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;background:#f9fbfd;font-weight:700;">${escapeHtml(copy.formLabels.countryOrResidence)}</td>
              <td style="padding:10px 12px;">${escapeHtml(collected.countryOrResidence || '-')}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;background:#f9fbfd;font-weight:700;">${escapeHtml(copy.formLabels.preferredTime)}</td>
              <td style="padding:10px 12px;">${escapeHtml(collected.preferredTime || '-')}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;background:#f9fbfd;font-weight:700;">${escapeHtml(copy.formLabels.urgency)}</td>
              <td style="padding:10px 12px;">${escapeHtml(collected.urgency || '-')}</td>
            </tr>
          </tbody>
        </table>

        <h3 style="margin:20px 0 8px;font-size:18px;color:#123b63;">사건 요약</h3>
        <div style="border:1px solid #d6e0eb;background:#ffffff;padding:14px;white-space:pre-wrap;line-height:1.65;">
          ${escapeHtml(collected.summary || '-')}
        </div>

        <h3 style="margin:20px 0 8px;font-size:18px;color:#123b63;">현재 보유 자료</h3>
        <div style="border:1px solid #d6e0eb;background:#ffffff;padding:14px;white-space:pre-wrap;line-height:1.65;">
          ${escapeHtml(collected.hasDocuments || '-')}
        </div>

        <h3 style="margin:20px 0 8px;font-size:18px;color:#123b63;">AI 참고 칼럼</h3>
        ${listHtml(payload.referencedColumns)}

        <h3 style="margin:20px 0 8px;font-size:18px;color:#123b63;">최근 대화 요약</h3>
        ${listHtml(buildTranscriptPreview(payload.transcript))}

        <p style="margin-top:20px;color:#6b7280;font-size:12px;">
          연락 가능한 수단: ${escapeHtml(hasContact.join(' / ') || '없음')}<br />
          이 메일은 호정국제 사이트 AI 상담 위젯에서 자동 발송되었습니다.
        </p>
      </div>
    `,
  });

  return { intakeId };
}

export class PreparedAiIntakeMailConfigError extends Error {
  readonly code = 'mail_config';
  constructor() {
    super('ai_intake_mail_config');
    this.name = 'PreparedAiIntakeMailConfigError';
  }
}

export interface PreparedAiIntakeEmailPayload {
  intakeId: string;
  subject: string;
  textBody: string;
  replyTo: string;
}

function htmlFromCanonicalText(textBody: string): string {
  return `<pre style="font-family:Arial,sans-serif;white-space:pre-wrap;margin:0;">${escapeHtml(textBody)}</pre>`;
}

export function assertConsultationSmtpReady(): void {
  try {
    createTransporter();
  } catch {
    throw new PreparedAiIntakeMailConfigError();
  }
}

export type PreparedAiIntakeSend = () => Promise<{ intakeId: string }>;

/**
 * Validate the exact AI-intake payload and create the transporter before any
 * durable claim. The returned closure performs the single SMTP attempt.
 */
export function prepareAiIntakeMailSend(payload: PreparedAiIntakeEmailPayload): PreparedAiIntakeSend {
  if (!payload.intakeId || /[\r\n]/.test(payload.intakeId) || payload.intakeId.length > 32) {
    throw new Error('invalid_prepared_intake_id');
  }
  if (!payload.subject || /[\r\n]/.test(payload.subject) || payload.subject.length > 200) {
    throw new Error('invalid_prepared_subject');
  }
  if (!payload.textBody || payload.textBody.length > 12_000) {
    throw new Error('invalid_prepared_body');
  }

  let transporter: ReturnType<typeof createTransporter>;
  try {
    transporter = createTransporter();
  } catch {
    throw new PreparedAiIntakeMailConfigError();
  }

  const smtp = resolveSmtpRuntime();
  const mailOptions: nodemailer.SendMailOptions = {
    from: `"호정 AI Intake" <${smtp.user}>`,
    to: smtp.notify,
    replyTo: isSafeEmailHeader(payload.replyTo) ? payload.replyTo : officialReplyEmail(),
    subject: payload.subject,
    text: payload.textBody,
    html: htmlFromCanonicalText(payload.textBody),
  };

  return async () => {
    await sendMailOnce(transporter, mailOptions);
    return { intakeId: payload.intakeId };
  };
}

/**
 * Send a server-prepared AI intake message. From/To remain server-owned.
 * The SMTP subject and text are exactly the canonical preview content.
 * HTML is a strictly escaped presentation of that same text.
 */
export async function sendPreparedAiIntakeEmail(
  payload: PreparedAiIntakeEmailPayload,
): Promise<{ intakeId: string }> {
  return prepareAiIntakeMailSend(payload)();
}

export interface NegativeFeedbackAlertPayload {
  locale: Locale;
  sessionId: string;
  messageId: string;
  classification?: ConsultationCategory;
  riskLevel?: ConsultationRiskLevel;
  /** Already PII-redacted at the route layer via clipFeedbackComment. */
  commentRedacted?: string;
  /** Public dashboard URL for this deploy, e.g. https://tseng-law.com/ko/admin-consultation. */
  dashboardUrl?: string;
}

/**
 * Fire-and-forget alert sent to the lawyer when a user marks an AI
 * answer as 👎. Reuses the same SMTP transport as the intake email
 * but with a tighter, alert-style body so it stands out in the inbox.
 *
 * The caller MUST have already PII-redacted the comment (the route
 * does this via clipFeedbackComment from feedback-store). Raw user
 * comments must never reach this function.
 */
export async function sendNegativeFeedbackAlert(
  payload: NegativeFeedbackAlertPayload,
): Promise<void> {
  const transporter = createTransporter();
  const submittedAt = new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Taipei',
  }).format(new Date());
  const categoryLabel = payload.classification
    ? getConsultationCategoryLabel(payload.locale, payload.classification)
    : '-';
  const riskLabel = payload.riskLevel
    ? getConsultationRiskLabel(payload.locale, payload.riskLevel)
    : '-';

  const smtp = resolveSmtpRuntime();
  await sendMailWithRetry(transporter, {
    from: `"호정 AI Intake" <${smtp.user}>`,
    to: smtp.notify,
    replyTo: smtp.notify,
    subject: `[호정 AI상담 👎] ${categoryLabel} / ${riskLabel} — 변호사 재검토 필요`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:24px;color:#1f2937;">
        <h2 style="margin:0 0 8px;font-size:22px;color:#b91c1c;">👎 부정적 피드백 수신</h2>
        <p style="margin:0 0 16px;color:#4b5563;font-size:14px;">
          AI 응답이 도움이 되지 않았다는 피드백이 들어왔습니다. 아래 정보를 토대로
          해당 세션을 재검토해 주시기 바랍니다.
        </p>
        <table style="width:100%;border-collapse:collapse;border:1px solid #d6e0eb;margin-bottom:16px;">
          <tbody>
            <tr>
              <td style="padding:8px 12px;background:#fef2f2;font-weight:700;width:140px;">시각</td>
              <td style="padding:8px 12px;">${escapeHtml(submittedAt)}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;background:#fef2f2;font-weight:700;">카테고리</td>
              <td style="padding:8px 12px;">${escapeHtml(categoryLabel)}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;background:#fef2f2;font-weight:700;">위험도</td>
              <td style="padding:8px 12px;">${escapeHtml(riskLabel)}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;background:#fef2f2;font-weight:700;">언어</td>
              <td style="padding:8px 12px;">${escapeHtml(payload.locale)}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;background:#fef2f2;font-weight:700;">세션 ID</td>
              <td style="padding:8px 12px;font-family:monospace;font-size:12px;">${escapeHtml(payload.sessionId)}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;background:#fef2f2;font-weight:700;">메시지 ID</td>
              <td style="padding:8px 12px;font-family:monospace;font-size:12px;">${escapeHtml(payload.messageId)}</td>
            </tr>
          </tbody>
        </table>
        <h3 style="margin:16px 0 6px;font-size:15px;color:#1f2937;">사용자 코멘트 (PII 마스킹 후)</h3>
        <div style="border:1px solid #d6e0eb;background:#ffffff;padding:12px;white-space:pre-wrap;line-height:1.55;font-size:14px;color:#1f2937;">
          ${escapeHtml(payload.commentRedacted || '(코멘트 없음)')}
        </div>
        ${
          payload.dashboardUrl
            ? `<p style="margin-top:18px;"><a href="${escapeHtml(payload.dashboardUrl)}" style="display:inline-block;padding:10px 16px;background:#123b63;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;">운영 대시보드 열기</a></p>`
            : ''
        }
        <p style="margin-top:20px;color:#6b7280;font-size:11px;">
          이 메일은 호정국제 AI 상담 위젯에서 부정 피드백 수신 즉시 자동 발송됩니다.
          메시지 본문은 저장되지 않으며 사용자 코멘트만 PII 마스킹 후 노출됩니다.
        </p>
      </div>
    `,
  });
}

export class InternationalInquiryMailConfigError extends Error {
  readonly code = 'mail_config';
  constructor() {
    super('international_inquiry_mail_config');
    this.name = 'InternationalInquiryMailConfigError';
  }
}

const INTERNATIONAL_INQUIRY_SUBJECT_PREFIX = '[Hovering international inquiry]';

function assertSmtpDelivery(result: {
  messageId?: unknown;
  accepted?: unknown;
  rejected?: unknown;
}): void {
  if (typeof result.messageId !== 'string' || result.messageId.length === 0) {
    throw new Error('SMTP returned no messageId');
  }
  const accepted = result.accepted;
  const rejected = result.rejected;
  if (
    Array.isArray(accepted)
    && accepted.length === 0
    && Array.isArray(rejected)
    && rejected.length > 0
  ) {
    throw new Error('SMTP rejected recipients');
  }
}

function internationalInquiryText(record: InternationalInquiryRecord): string {
  const payload = record.payload;
  return [
    'International inquiry',
    '',
    `Intake ID: ${record.intakeId}`,
    `Received at: ${record.receivedAt}`,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `UI locale: ${payload.uiLocale}`,
    `Original language: ${payload.originalLanguage}`,
    `Preferred consultation language: ${payload.preferredConsultationLanguage}`,
    '',
    'Original text:',
    payload.originalText,
  ].join('\n');
}

function internationalInquiryHtml(record: InternationalInquiryRecord): string {
  const payload = record.payload;
  const row = (label: string, value: string) => (
    `<tr><td style="padding:10px 12px;background:#f4f7fb;font-weight:700;width:220px;">${escapeHtml(label)}</td><td style="padding:10px 12px;">${escapeHtml(value)}</td></tr>`
  );
  return `
      <div style="font-family:Arial,sans-serif;max-width:760px;margin:0 auto;padding:24px;color:#1f2937;">
        <h2 style="margin:0 0 16px;font-size:22px;color:#123b63;">International inquiry</h2>
        <table style="width:100%;border-collapse:collapse;border:1px solid #d6e0eb;margin-bottom:20px;">
          <tbody>
            ${row('Intake ID', record.intakeId)}
            ${row('Received at', record.receivedAt)}
            ${row('Name', payload.name)}
            ${row('Email', payload.email)}
            ${row('UI locale', payload.uiLocale)}
            ${row('Original language', payload.originalLanguage)}
            ${row('Preferred consultation language', payload.preferredConsultationLanguage)}
          </tbody>
        </table>
        <h3 style="margin:20px 0 8px;font-size:16px;color:#123b63;">Original text</h3>
        <pre style="white-space:pre-wrap;border:1px solid #d6e0eb;background:#ffffff;padding:14px;line-height:1.65;margin:0;">${escapeHtml(payload.originalText)}</pre>
      </div>
    `;
}

export async function sendInternationalInquiryNotification(
  record: InternationalInquiryRecord,
): Promise<void> {
  let transporter: ReturnType<typeof createTransporter>;
  try {
    transporter = createTransporter();
  } catch {
    throw new InternationalInquiryMailConfigError();
  }

  const subject = `${INTERNATIONAL_INQUIRY_SUBJECT_PREFIX} ${record.intakeId}`;
  if (/[\r\n]/.test(subject) || /[\r\n]/.test(record.intakeId)) {
    throw new Error('invalid_international_inquiry_subject');
  }

  const smtp = resolveSmtpRuntime();
  const result = await transporter.sendMail({
    from: `"Hovering International Inquiry" <${smtp.user}>`,
    to: smtp.notify,
    replyTo: isSafeEmailHeader(record.payload.email) ? record.payload.email : officialReplyEmail(),
    subject,
    text: internationalInquiryText(record),
    html: internationalInquiryHtml(record),
  });
  assertSmtpDelivery(result);
}
