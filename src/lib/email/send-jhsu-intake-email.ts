/**
 * jhsu (son-7.com, 徐嘉駿律師 刑事 site) 상담 문의 → 사무소 통지 메일.
 *
 * 수신: 徐嘉駿律師 + 曾雋崴律師 (두 곳 동시). SMTP 설정은 tseng-law 상담 메일과 공유한다.
 * 개인정보는 메일 본문에만 담고 서버에 저장하지 않는다(문의 로그 없음).
 */
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const DEFAULT_RECIPIENTS = 'jjhsu@hoveringlaw.com.tw,wei@hoveringlaw.com.tw';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface JhsuIntakePayload {
  name: string;
  phone: string;
  email?: string;
  role: string;
  stage: string;
  orgSize?: string;
  counterparty?: string;
  message: string;
  preferredTime?: string;
  source?: string;
  pageUrl?: string;
}

function isSafeEmailHeader(value: string | undefined): value is string {
  if (!value || value.length > 254 || /[\r\n]/.test(value)) return false;
  return EMAIL_PATTERN.test(value);
}

export function resolveJhsuRecipients(): string[] {
  const configured = (process.env.JHSU_NOTIFY_EMAIL || DEFAULT_RECIPIENTS)
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);
  if (!configured.length || configured.some((email) => !isSafeEmailHeader(email))) {
    throw new Error('JHSU_NOTIFY_EMAIL is invalid.');
  }
  return configured;
}

function createTransporter() {
  if (!SMTP_HOST?.trim() || !SMTP_PORT || !SMTP_USER?.trim() || !SMTP_PASS?.trim()) {
    throw new Error('SMTP is not fully configured. Check SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.');
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    requireTLS: SMTP_PORT !== 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function row(label: string, value: string | undefined): string {
  const text = value?.trim() ? escapeHtml(value.trim()).replace(/\n/g, '<br>') : '—';
  return `<tr><th style="text-align:left;padding:6px 10px;color:#5b6472;font-weight:500;white-space:nowrap;vertical-align:top;">${label}</th><td style="padding:6px 10px;">${text}</td></tr>`;
}

export function buildJhsuIntakeEmail(payload: JhsuIntakePayload, intakeId: string, submittedAt: string) {
  const subject = `[son-7.com 諮詢] ${payload.role}／${payload.stage}｜${payload.name}（${intakeId}）`;
  const html = `
<div style="font-family:-apple-system,'PingFang TC','Microsoft JhengHei',sans-serif;font-size:14px;color:#14171c;max-width:640px;">
  <p style="margin:0 0 12px;font-size:16px;font-weight:700;">徐嘉駿律師網站（son-7.com）諮詢表單</p>
  <p style="margin:0 0 14px;color:#5b6472;">編號 ${intakeId} ‧ ${escapeHtml(submittedAt)}（台北時間）</p>
  <table style="border-collapse:collapse;width:100%;border:1px solid #e3e6eb;">
    ${row('姓名', payload.name)}
    ${row('聯絡電話', payload.phone)}
    ${row('Email', payload.email)}
    ${row('諮詢身分', payload.role)}
    ${row('目前階段', payload.stage)}
    ${row('公司規模', payload.orgSize)}
    ${row('對方當事人（利益衝突確認用）', payload.counterparty)}
    ${row('方便聯絡時段', payload.preferredTime)}
    ${row('簡述情況', payload.message)}
    ${row('來源頁面', payload.pageUrl)}
  </table>
  <p style="margin:14px 0 0;color:#5b6472;font-size:12px;">本信由網站表單自動寄出，同時寄給徐嘉駿律師與曾雋崴律師。受任前請先進行利益衝突確認。回覆時請直接聯絡當事人，勿回覆本信。</p>
</div>`;
  const text = [
    `徐嘉駿律師網站（son-7.com）諮詢表單 ${intakeId} ${submittedAt}`,
    `姓名: ${payload.name}`, `聯絡電話: ${payload.phone}`, `Email: ${payload.email || '—'}`,
    `諮詢身分: ${payload.role}`, `目前階段: ${payload.stage}`, `公司規模: ${payload.orgSize || '—'}`,
    `對方當事人: ${payload.counterparty || '—'}`, `方便聯絡時段: ${payload.preferredTime || '—'}`,
    `簡述情況:\n${payload.message}`, `來源頁面: ${payload.pageUrl || '—'}`,
  ].join('\n');
  return { subject, html, text };
}

export async function sendJhsuIntakeEmail(payload: JhsuIntakePayload): Promise<{ intakeId: string }> {
  const transporter = createTransporter();
  const recipients = resolveJhsuRecipients();
  const intakeId = `JH-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const submittedAt = new Intl.DateTimeFormat('zh-TW', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Taipei',
  }).format(new Date());
  const { subject, html, text } = buildJhsuIntakeEmail(payload, intakeId, submittedAt);
  const replyTo = isSafeEmailHeader(payload.email) ? payload.email : undefined;
  const result = await transporter.sendMail({
    from: `"son-7.com 諮詢表單" <${SMTP_USER}>`,
    to: recipients.join(', '),
    replyTo,
    subject,
    text,
    html,
  });
  if (!result.messageId) throw new Error('SMTP returned no messageId');
  return { intakeId };
}
