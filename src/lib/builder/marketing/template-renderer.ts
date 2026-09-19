import type { Campaign } from './campaign-types';
import type { Subscriber } from './subscriber-types';
import type { Locale } from '@/lib/locales';
import { asLocaleKey } from './campaign-types';
import {
  createMarketingClickSignature,
  resolveMarketingTrackingSecret,
} from './marketing-click-signature';

interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
  preheader?: string;
  /** RFC 5322 headers the provider must set (one-click unsubscribe). */
  headers: Record<string, string>;
}

interface RenderContext {
  campaign: Campaign;
  subscriber: Subscriber;
  trackingToken: string;
  baseUrl: string;
}

const UNSUB_LABEL_BY_LOCALE: Record<Locale, string> = {
  ko: '구독 해지 / Unsubscribe',
  'zh-hant': '取消訂閱',
  en: 'Unsubscribe',
};

/**
 * Legal display block for marketing mail.
 *
 * 律師推展業務規範 §2③ requires the attorney name, firm name, address and phone
 * on business-development material, and §2④ requires an advertisement label on
 * anything that is not the firm's own website. Korean recipients additionally
 * need the sender's name, address, phone and a Korean+English unsubscribe
 * notice (정보통신망법 별표 6), plus the name of the attorney responsible for
 * the advertisement (변협 광고규정 3조② 준용).
 *
 * Owner decisions 2026-09-17: representative phone is the Taichung office
 * number (no Taipei number to publish); responsible attorney is 증준외(曾雋崴).
 * Wording source: docs/marketing/EMAIL-SEQUENCE-WELCOME-REENGAGE-2026-09-17.md §3.
 * Status: NEEDS_LAWYER_REVIEW before the first campaign send.
 */
export const MARKETING_AD_LABEL_BY_LOCALE: Record<Locale, string> = {
  ko: '廣告',
  'zh-hant': '廣告',
  en: 'Advertisement (廣告)',
};

/** Korean advertising mail must start its subject with this exact prefix. */
export const KOREAN_AD_SUBJECT_PREFIX = '(광고) ';

/** Campaign ids with this prefix are transactional (opt-in confirmation etc.). */
export const TRANSACTIONAL_CAMPAIGN_PREFIX = 'system-';

const FIRM_LEGAL_BLOCK_BY_LOCALE: Record<Locale, readonly string[]> = {
  ko: [
    '본 메일은 수신에 동의하신 분께 법무법인 호정(昊鼎國際法律事務所)이 보냅니다.',
    '변호사 증준외(曾雋崴) · 광고책임변호사: 증준외(曾雋崴)',
    '타이베이 사무소: 103臺北市大同區承德路一段35號7樓之2 · 대표 전화(타이중 사무소): +886-4-2326-1862',
    '이메일: wei@hoveringlaw.com.tw',
    '수신거부는 아래 링크에서 즉시 처리되며, 처리 결과를 14일 이내에 알려드립니다. / To unsubscribe, use the link below.',
  ],
  'zh-hant': [
    '本郵件由昊鼎國際法律事務所寄送給已同意訂閱之收件人。',
    '曾雋崴 律師 · 廣告責任律師：曾雋崴',
    '台北所：103臺北市大同區承德路一段35號7樓之2 · 代表電話（台中所）：+886-4-2326-1862',
    'wei@hoveringlaw.com.tw',
  ],
  en: [
    'Sent by Hovering International Law Firm (昊鼎國際法律事務所) to subscribers who opted in.',
    'Attorney Wei Tseng (曾雋崴) · Attorney responsible for this advertisement: Wei Tseng (曾雋崴)',
    'Taipei office: 103臺北市大同區承德路一段35號7樓之2 · Main phone (Taichung office): +886-4-2326-1862',
    'wei@hoveringlaw.com.tw',
  ],
};

export function isTransactionalCampaign(campaignId: string): boolean {
  return campaignId.startsWith(TRANSACTIONAL_CAMPAIGN_PREFIX);
}

/** Subject with the Korean advertisement prefix applied where required. */
export function applyAdSubjectPrefix(
  subject: string,
  locale: Locale,
  campaignId: string,
): string {
  if (locale !== 'ko') return subject;
  if (isTransactionalCampaign(campaignId)) return subject;
  if (subject.startsWith(KOREAN_AD_SUBJECT_PREFIX.trim())) return subject;
  return `${KOREAN_AD_SUBJECT_PREFIX}${subject}`;
}

/** One-click unsubscribe headers (RFC 8058) for a rendered marketing mail. */
export function buildUnsubscribeHeaders(unsubUrl: string): Record<string, string> {
  return {
    'List-Unsubscribe': `<${unsubUrl}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function resolveTrackableDestination(href: string, baseUrl: string): string | null {
  try {
    const resolved = new URL(href, `${baseUrl.replace(/\/+$/, '')}/`);
    if (resolved.protocol !== 'http:' && resolved.protocol !== 'https:') return null;
    return resolved.toString();
  } catch {
    return null;
  }
}

function rewriteAnchors(
  html: string,
  baseUrl: string,
  trackingToken: string,
  trackingSecret: string | null,
): string {
  if (!trackingSecret) return html;
  return html.replace(/<a\s+([^>]*?)href=("|')([^"']+)("|')/gi, (match, pre, q1, href, q2) => {
    if (/^(mailto:|tel:|#)/i.test(href)) return match;
    if (href.includes('/api/marketing/unsubscribe')) return match;
    const destination = resolveTrackableDestination(href, baseUrl);
    if (!destination) return match;
    const signature = createMarketingClickSignature(trackingToken, destination, trackingSecret);
    const target = `${baseUrl.replace(/\/+$/, '')}/api/marketing/track?token=${encodeURIComponent(
      trackingToken,
    )}&u=${encodeURIComponent(destination)}&sig=${encodeURIComponent(signature)}`;
    return `<a ${pre}href=${q1}${escapeHtml(target)}${q2}`;
  });
}

function applyVariables(
  template: string,
  subscriber: Subscriber,
  campaign: Campaign,
): string {
  return template
    .replace(/\{\{\s*email\s*\}\}/g, escapeHtml(subscriber.email))
    .replace(/\{\{\s*locale\s*\}\}/g, escapeHtml(subscriber.preferredLocale))
    .replace(/\{\{\s*campaign_name\s*\}\}/g, escapeHtml(campaign.name))
    .replace(/\{\{\s*from_name\s*\}\}/g, escapeHtml(campaign.fromName));
}

export function renderCampaignForSubscriber(ctx: RenderContext): RenderedEmail {
  const locale = ctx.subscriber.preferredLocale;
  const key = asLocaleKey(locale);

  const subject = applyVariables(ctx.campaign.subject[key] ?? ctx.campaign.subject.ko, ctx.subscriber, ctx.campaign);
  let html = applyVariables(ctx.campaign.bodyHtml[key] ?? ctx.campaign.bodyHtml.ko, ctx.subscriber, ctx.campaign);
  const text = applyVariables(ctx.campaign.bodyText[key] ?? ctx.campaign.bodyText.ko, ctx.subscriber, ctx.campaign);
  const preheader = ctx.campaign.preheader
    ? applyVariables(ctx.campaign.preheader[key] ?? '', ctx.subscriber, ctx.campaign)
    : undefined;

  const unsubUrl = `${ctx.baseUrl.replace(/\/+$/, '')}/api/marketing/unsubscribe?token=${encodeURIComponent(
    ctx.subscriber.unsubscribeToken,
  )}`;
  const openPixel = `<img src="${ctx.baseUrl.replace(/\/+$/, '')}/api/marketing/track/pixel?token=${encodeURIComponent(
    ctx.trackingToken,
  )}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;border:0" />`;

  const transactional = isTransactionalCampaign(ctx.campaign.campaignId);
  const legalLines = FIRM_LEGAL_BLOCK_BY_LOCALE[locale];
  const adLabelLine = transactional ? '' : MARKETING_AD_LABEL_BY_LOCALE[locale];
  const footerLines = adLabelLine ? [adLabelLine, ...legalLines] : [...legalLines];

  const footer = `
    <hr style="border:0;border-top:1px solid #e2e8f0;margin:24px 0" />
    <p style="font-size:12px;color:#64748b;line-height:1.5">
      ${footerLines.map((line) => escapeHtml(line)).join('<br />')}
      <br />
      <a href="${escapeHtml(unsubUrl)}" style="color:#64748b;text-decoration:underline">${escapeHtml(
        UNSUB_LABEL_BY_LOCALE[locale],
      )}</a>
    </p>
    ${openPixel}
  `;

  html = rewriteAnchors(
    html,
    ctx.baseUrl,
    ctx.trackingToken,
    resolveMarketingTrackingSecret(),
  );
  html = `${preheader ? `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">${escapeHtml(preheader)}</div>` : ''}${html}${footer}`;

  const plainTextWithUnsub = [
    text,
    '',
    ...footerLines.map((line) => `— ${line}`),
    `${UNSUB_LABEL_BY_LOCALE[locale]}: ${unsubUrl}`,
  ].join('\n');

  return {
    subject: applyAdSubjectPrefix(subject, locale, ctx.campaign.campaignId),
    html,
    text: plainTextWithUnsub,
    preheader,
    headers: buildUnsubscribeHeaders(unsubUrl),
  };
}
