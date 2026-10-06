import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import ZhHantServiceGroups, { KO_SERVICE_ORDER } from '@/components/zh-hant-home/ZhHantServiceGroups';
import ZhHantSnapRowFocus from '@/components/zh-hant-home/ZhHantSnapRowFocus';
import { ZH_HANT_DOMESTIC_SERVICE_ORDER } from '@/components/zh-hant-home/zh-hant-service-scenarios';
import { getServiceSlugs } from '@/data/service-details';
import { pageCopy } from '@/data/page-copy';
import { siteContent } from '@/data/site-content';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import { getConsultationPublicEmail, getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import { appleDesignRootProps, type AppleDesignLocale } from '@/lib/apple-design-locales';
import styles from './ZhHantServices.module.css';

/** The email action label: the hero CTA of each locale. */
const EMAIL_ACTION: Record<AppleDesignLocale, string> = { 'zh-hant': '申請電子郵件諮詢', ko: '이메일 상담 신청' };

/** zh-hant services page; ko shares it since 2026-10-06 (`locale="ko"`, ko copy and grouping). */
export default function ZhHantServicesBody({ showHero, showRepeater, locale = 'zh-hant' }: { showHero: boolean; showRepeater: boolean; locale?: AppleDesignLocale }) {
  const copy = pageCopy[locale].services;
  const { services, homeContactCta } = siteContent[locale];
  const attorney = getAttorneyProfile(locale, primaryAttorneySlug);
  const root = appleDesignRootProps(locale, 'services');
  const order: readonly string[] = locale === 'ko' ? KO_SERVICE_ORDER : ZH_HANT_DOMESTIC_SERVICE_ORDER;
  return (
    <div className={styles.root} {...root}>
      {showHero ? (
        <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description}>
          <div className={styles.heroVisual}>
            <Image src="/images/editorial/taichung-courthouse-civic-daylight-v2.webp" alt="" width={960} height={640} sizes="(max-width: 767px) 100vw, 42vw" priority />
          </div>
          {/* The practice chip bar sits at the foot of the first screen; the language hint waits until this row has scrolled away. */}
          <div className={styles.heroActions} data-locale-hint-after="">
            <a href={getConsultationPublicMailto(locale)} className="button">{EMAIL_ACTION[locale]} <span aria-hidden>↗</span></a>
            {attorney ? <Link href={`/${locale}/lawyers/${attorney.slug}`}>{attorney.name} · {attorney.role}</Link> : null}
          </div>
        </PageHeader>
      ) : null}
      {showRepeater ? (
        <>
          <nav className={styles.practiceNav} aria-label={services.title}>
            {[...services.items]
              .map((item, index) => ({ item, slug: getServiceSlugs()[index] ?? '' }))
              .sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug))
              .map(({ item }) => <a key={item.href} href={`#${item.href.split('#')[1]}`}>{item.title}</a>)}
          </nav>
          <ZhHantServiceGroups showTitle={!showHero} locale={locale} />
          <section className={styles.contact}>
            <div>
              <h2>{homeContactCta.title}</h2>
              <p>{homeContactCta.description}</p>
              <p className={styles.contactEmail}><a href={getConsultationPublicMailto(locale)}>{getConsultationPublicEmail()}</a></p>
            </div>
            <a href={getConsultationPublicMailto(locale)} className="button">{EMAIL_ACTION[locale]} <span aria-hidden>↗</span></a>
          </section>
        </>
      ) : null}
      <ZhHantSnapRowFocus rootSelector={`#${root.id}`} />
    </div>
  );
}
