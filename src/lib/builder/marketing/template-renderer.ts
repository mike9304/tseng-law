import type { Campaign } from './campaign-types';
import type { Subscriber } from './subscriber-types';
import type { Locale } from '@/lib/locales';
import { asLocaleKey } from './campaign-types';

interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
  preheader?: string;
}

interface RenderContext {
  campaign: Campaign;
  subscriber: Subscriber;
  trackingToken: string;
  baseUrl: string;
}

const UNSUB_LABEL_BY_LOCALE: Record<Locale, string> = {
  ko: '구독 해지',
  'zh-hant': '取消訂閱',
  en: 'Unsubscribe',
};

const FOOTER_BY_LOCALE: Record<Locale, string> = {
  ko: '본 메일은 호정국제법률사무소에서 발송되었습니다. 본인 의사에 반하는 수신을 거부합니다.',
  'zh-hant': '本郵件由 Hoyering International Law Firm 寄送。如不希望繼續接收，請點選下方連結取消訂閱。',
  en: 'This message was sent by Hoyering International Law Firm. You may unsubscribe at any time.',
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function rewriteAnchors(html: string, baseUrl: string, trackingToken: string): string {
  return html.replace(/<a\s+([^>]*?)href=("|')([^"']+)("|')/gi, (match, pre, q1, href, q2) => {
    if (/^(mailto:|tel:|#|javascript:)/i.test(href)) return match;
    if (href.includes('/api/marketing/unsubscribe')) return match;
    const target = `${baseUrl.replace(/\/+$/, '')}/api/marketing/track?token=${encodeURIComponent(
      trackingToken,
    )}&u=${encodeURIComponent(href)}`;
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

  const footer = `
    <hr style="border:0;border-top:1px solid #e2e8f0;margin:24px 0" />
    <p style="font-size:12px;color:#64748b;line-height:1.5">
      ${escapeHtml(FOOTER_BY_LOCALE[locale])}
      <br />
      <a href="${escapeHtml(unsubUrl)}" style="color:#64748b;text-decoration:underline">${escapeHtml(
        UNSUB_LABEL_BY_LOCALE[locale],
      )}</a>
    </p>
    ${openPixel}
  `;

  html = rewriteAnchors(html, ctx.baseUrl, ctx.trackingToken);
  html = `${preheader ? `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">${escapeHtml(preheader)}</div>` : ''}${html}${footer}`;

  const plainTextWithUnsub = `${text}\n\n— ${FOOTER_BY_LOCALE[locale]}\n${UNSUB_LABEL_BY_LOCALE[locale]}: ${unsubUrl}`;

  return {
    subject,
    html,
    text: plainTextWithUnsub,
    preheader,
  };
}
