import PageHeader from '@/components/PageHeader';
import ContactEmailActions from '@/components/ContactEmailActions';
import InternationalInquiryForm from '@/components/InternationalInquiryForm';
import ConsultationGuideSection from '@/components/ConsultationGuideSection';
import MessengerChatSection from '@/components/MessengerChatSection';
import ContactBlocks from '@/components/ContactBlocks';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import { pageCopy } from '@/data/page-copy';
import { appleDesignRootProps, type AppleDesignLocale } from '@/lib/apple-design-locales';
import styles from './ZhHantContact.module.css';

/**
 * zh-hant contact page, second pass (son7-87 / Opus 5.5, 2026-10-01): the same blocks as
 * ContactLegacyPageBody in a new arrangement — green header with the email actions, the
 * inquiry form beside the preparation guide, then email/AI options, inquiry types and offices.
 * ko shares it since 2026-10-06 (`locale="ko"`): the same six ko blocks in this arrangement.
 */
export default function ZhHantContactBody({ locale = 'zh-hant' }: { locale?: AppleDesignLocale } = {}) {
  const copy = pageCopy[locale].contact;
  return (
    <div className={styles.root} {...appleDesignRootProps(locale, 'contact')}>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description}>
        <ContactEmailActions locale={locale} />
      </PageHeader>
      <section className={`section ${styles.main}`}>
        <div className={`container ${styles.mainGrid}`}>
          <div className={styles.formCol}>
            <InternationalInquiryForm locale={locale} />
          </div>
          <aside className={styles.guideCol}>
            <ConsultationGuideSection locale={locale} />
          </aside>
        </div>
      </section>
      <MessengerChatSection locale={locale} />
      <ContactBlocks locale={locale} showMainHeader={false} showEmailActions={false} />
      <OfficeMapTabs locale={locale} />
    </div>
  );
}
