import type { Locale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import SmartLink from '@/components/SmartLink';

export default function HomeContactCta({ locale }: { locale: Locale }) {
  const content = siteContent[locale];
  const contact = content.contact;
  const representativeTel = content.quickContact.actions.find((action) => action.href.startsWith('tel:'));
  const title =
    locale === 'ko' ? '대만 법률 이슈, 지금 바로 상담하세요.' : locale === 'zh-hant' ? '台灣法律議題，立即諮詢。' : 'Talk to us now about your Taiwan legal issue.';
  const description =
    locale === 'ko'
      ? '사업·소송·법인설립 문의를 유형별로 빠르게 연결해드립니다.'
      : locale === 'zh-hant'
        ? '依案件類型安排投資、訴訟與公司設立諮詢流程。'
        : 'We quickly route business, litigation, and incorporation inquiries by case type.';

  return (
    <section className="section section--dark home-contact-cta" id="contact" data-tone="dark">
      <div className="container">
        <div className="section-label">{contact.label}</div>
        <h2 className="section-title">{title}</h2>
        <p className="section-lede">{description}</p>
        <div className="home-contact-actions">
          <SmartLink className="button ghost" href={`/${locale}/contact`}>
            {contact.cta.label}
          </SmartLink>
          {representativeTel ? <a className="button secondary" href={representativeTel.href}>{representativeTel.value}</a> : null}
        </div>
      </div>
    </section>
  );
}
