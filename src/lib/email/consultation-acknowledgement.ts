/**
 * F0 — inquiry acknowledgement copy (transactional).
 *
 * Sent to the person who submitted a consultation intake so they know the
 * enquiry arrived. Deliberately excludes anything that would make this an
 * advertisement or a promise:
 *   - no service promotion, pricing, or "free consultation" wording
 *   - no response-time or outcome commitment
 *   - no Korean `(광고)` subject prefix (this is not an advertisement)
 * Display duty per 律師推展業務規範 §2③: attorney name, firm name, address and
 * phone appear in the signature. Representative phone is the Taichung office
 * number (2026-09-17 owner decision: no Taipei number to publish).
 *
 * Source of the wording: docs/marketing/EMAIL-SEQUENCE-WELCOME-REENGAGE-2026-09-17.md §5 F0.
 * Status: NEEDS_LAWYER_REVIEW before the first real send.
 */

import type { SiteLocale } from '@/lib/locales';
import { CONSULTATION_EMAIL } from '@/lib/consultation/public-contact';

export const FIRM_POSTAL_ADDRESS = '103臺北市大同區承德路一段35號7樓之2';
/** Representative phone shown to the public: Taichung office. */
export const FIRM_REPRESENTATIVE_PHONE = '+886-4-2326-1862';

export interface ConsultationAcknowledgementInput {
  readonly locale: SiteLocale;
  readonly intakeId: string;
  /** Localized label for the classified matter type, when available. */
  readonly categoryLabel?: string;
  /** Localized label for the consultation language the person chose. */
  readonly languageLabel?: string;
}

export interface RenderedAcknowledgement {
  readonly subject: string;
  readonly text: string;
  readonly html: string;
}

interface AcknowledgementCopy {
  readonly subject: (intakeId: string) => string;
  readonly greeting: string;
  readonly received: string;
  readonly summaryHeading: string;
  readonly intakeIdLabel: string;
  readonly categoryLabel: string;
  readonly languageLabel: string;
  readonly prepareHeading: string;
  readonly prepareItems: readonly string[];
  readonly purpose: string;
  readonly signature: string;
  readonly officeLabel: string;
  readonly phoneLabel: string;
}

const COPY: Record<SiteLocale, AcknowledgementCopy> = {
  ko: {
    subject: (intakeId) => `[법무법인 호정] 문의가 접수되었습니다 (접수번호 ${intakeId})`,
    greeting: '안녕하세요. 법무법인 호정(昊鼎國際法律事務所)입니다.',
    received: '보내주신 문의가 접수되었습니다. 내용을 확인한 뒤 이 이메일 주소로 회신드립니다.',
    summaryHeading: '접수 내용',
    intakeIdLabel: '접수번호',
    categoryLabel: '문의 유형',
    languageLabel: '상담 언어',
    prepareHeading: '미리 준비해 두시면 도움이 되는 자료',
    prepareItems: [
      '계약서, 견적서, 공문, 이메일·메신저 대화 등 핵심 문서',
      '당사자 정보, 사건 발생일, 현재 진행 상태',
    ],
    purpose: '보내주신 내용은 상담 접수 목적으로만 처리됩니다. 급한 사안이면 이 메일에 회신해 알려 주세요.',
    signature: '법무법인 호정 · 증준외(曾雋崴) 변호사',
    officeLabel: '타이베이 사무소',
    phoneLabel: '대표 전화(타이중 사무소)',
  },
  'zh-hant': {
    subject: (intakeId) => `【昊鼎國際法律事務所】已收到您的諮詢（編號 ${intakeId}）`,
    greeting: '您好，這裡是昊鼎國際法律事務所。',
    received: '我們已收到您的諮詢。確認內容後，會回覆至這個電子郵件地址。',
    summaryHeading: '受理內容',
    intakeIdLabel: '受理編號',
    categoryLabel: '諮詢類型',
    languageLabel: '諮詢語言',
    prepareHeading: '事先整理會有幫助的資料',
    prepareItems: [
      '契約、報價單、公文、電子郵件與通訊軟體對話等主要文件',
      '當事人資訊、事件發生日、目前進度',
    ],
    purpose: '您提供的內容僅用於受理諮詢。若有急迫事項，請直接回覆本郵件告知。',
    signature: '昊鼎國際法律事務所 · 曾雋崴 律師',
    officeLabel: '台北所',
    phoneLabel: '代表電話（台中所）',
  },
  en: {
    subject: (intakeId) => `[Hovering International Law Firm] We received your enquiry (ref. ${intakeId})`,
    greeting: 'Hello, this is Hovering International Law Firm (昊鼎國際法律事務所).',
    received: 'Your enquiry has reached us. We will review it and reply to this email address.',
    summaryHeading: 'What we received',
    intakeIdLabel: 'Reference',
    categoryLabel: 'Matter type',
    languageLabel: 'Consultation language',
    prepareHeading: 'Useful to organise in the meantime',
    prepareItems: [
      'Contracts, quotations, official letters, and email or messenger threads',
      'The parties involved, the date the matter arose, and its current status',
    ],
    purpose: 'What you sent is handled only for intake of this enquiry. If the matter is urgent, reply to this email and say so.',
    signature: 'Hovering International Law Firm · Attorney Wei Tseng (曾雋崴)',
    officeLabel: 'Taipei office',
    phoneLabel: 'Main phone (Taichung office)',
  },
  ja: {
    subject: (intakeId) => `【昊鼎國際法律事務所】お問い合わせを受け付けました（受付番号 ${intakeId}）`,
    greeting: '昊鼎國際法律事務所です。',
    received: 'お問い合わせを受け付けました。内容を確認のうえ、このメールアドレスにご返信します。',
    summaryHeading: '受付内容',
    intakeIdLabel: '受付番号',
    categoryLabel: 'お問い合わせの種類',
    languageLabel: 'ご相談の言語',
    prepareHeading: '先に整理しておくと役立つ資料',
    prepareItems: [
      '契約書、見積書、公文書、メールやメッセンジャーのやり取りなどの主な書面',
      '当事者の情報、発生日、現在の進行状況',
    ],
    purpose: 'お送りいただいた内容は、この相談の受付のためにのみ取り扱います。お急ぎの場合は本メールにご返信ください。',
    signature: '昊鼎國際法律事務所 · 曾雋崴 弁護士',
    officeLabel: '台北事務所',
    phoneLabel: '代表電話（台中事務所）',
  },
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function getConsultationAcknowledgementCopy(locale: SiteLocale): AcknowledgementCopy {
  return COPY[locale] ?? COPY.ko;
}

export function renderConsultationAcknowledgement(
  input: ConsultationAcknowledgementInput,
): RenderedAcknowledgement {
  const copy = getConsultationAcknowledgementCopy(input.locale);
  const rows: Array<[string, string]> = [[copy.intakeIdLabel, input.intakeId]];
  if (input.languageLabel) rows.push([copy.languageLabel, input.languageLabel]);
  if (input.categoryLabel) rows.push([copy.categoryLabel, input.categoryLabel]);

  const signatureLines = [
    copy.signature,
    `${copy.officeLabel}: ${FIRM_POSTAL_ADDRESS}`,
    `${copy.phoneLabel}: ${FIRM_REPRESENTATIVE_PHONE}`,
    CONSULTATION_EMAIL,
  ];

  const text = [
    copy.greeting,
    '',
    copy.received,
    '',
    `${copy.summaryHeading}`,
    ...rows.map(([label, value]) => `- ${label}: ${value}`),
    '',
    copy.prepareHeading,
    ...copy.prepareItems.map((item) => `- ${item}`),
    '',
    copy.purpose,
    '',
    ...signatureLines,
  ].join('\n');

  const html = [
    '<div style="font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.7;color:#111">',
    `<p>${escapeHtml(copy.greeting)}</p>`,
    `<p>${escapeHtml(copy.received)}</p>`,
    `<p style="margin-bottom:4px"><strong>${escapeHtml(copy.summaryHeading)}</strong></p>`,
    '<ul style="margin-top:0">',
    ...rows.map(([label, value]) => `<li>${escapeHtml(label)}: ${escapeHtml(value)}</li>`),
    '</ul>',
    `<p style="margin-bottom:4px"><strong>${escapeHtml(copy.prepareHeading)}</strong></p>`,
    '<ul style="margin-top:0">',
    ...copy.prepareItems.map((item) => `<li>${escapeHtml(item)}</li>`),
    '</ul>',
    `<p>${escapeHtml(copy.purpose)}</p>`,
    `<hr style="border:0;border-top:1px solid #e2e8f0;margin:20px 0" />`,
    `<p style="font-size:12px;color:#475569">${signatureLines.map(escapeHtml).join('<br />')}</p>`,
    '</div>',
  ].join('');

  return { subject: copy.subject(input.intakeId), text, html };
}
