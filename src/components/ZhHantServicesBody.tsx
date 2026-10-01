import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import ZhHantServiceGroups from '@/components/zh-hant-home/ZhHantServiceGroups';
import { pageCopy } from '@/data/page-copy';
import { siteContent } from '@/data/site-content';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import { getConsultationPublicEmail, getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import styles from './ZhHantServices.module.css';

export default function ZhHantServicesBody({ showHero, showRepeater }: { showHero: boolean; showRepeater: boolean }) {
  const copy = pageCopy['zh-hant'].services;
  const { services, homeContactCta } = siteContent['zh-hant'];
  const attorney = getAttorneyProfile('zh-hant', primaryAttorneySlug);
  return (
    <div className={styles.root} id="zh-hant-services" data-zh-hant-design="services">
      {showHero ? (
        <PageHeader locale="zh-hant" label={copy.label} title={copy.title} description={copy.description}>
          <div className={styles.heroVisual}>
            <Image src="/images/editorial/taichung-courthouse-civic-daylight-v2.webp" alt="" width={960} height={640} sizes="(max-width: 767px) 100vw, 42vw" priority />
          </div>
          <div className={styles.heroActions}>
            <a href={getConsultationPublicMailto('zh-hant')} className="button">申請電子郵件諮詢 <span aria-hidden>↗</span></a>
            {attorney ? <Link href={`/zh-hant/lawyers/${attorney.slug}`}>{attorney.name} · {attorney.role}</Link> : null}
          </div>
        </PageHeader>
      ) : null}
      {showRepeater ? (
        <>
          <nav className={styles.practiceNav} aria-label={services.title}>
            {services.items.map((item) => <a key={item.href} href={`#${item.href.split('#')[1]}`}>{item.title}</a>)}
          </nav>
          <ZhHantServiceGroups showTitle={!showHero} />
          <section className={styles.contact}>
            <div>
              <h2>{homeContactCta.title}</h2>
              <p>{homeContactCta.description}</p>
              <p className={styles.contactEmail}><a href={getConsultationPublicMailto('zh-hant')}>{getConsultationPublicEmail()}</a></p>
            </div>
            <a href={getConsultationPublicMailto('zh-hant')} className="button">申請電子郵件諮詢 <span aria-hidden>↗</span></a>
          </section>
        </>
      ) : null}
    </div>
  );
}
