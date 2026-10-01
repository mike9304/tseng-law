import PageHeader from '@/components/PageHeader';
import ContactEmailActions from '@/components/ContactEmailActions';
import InternationalInquiryForm from '@/components/InternationalInquiryForm';
import ConsultationGuideSection from '@/components/ConsultationGuideSection';
import MessengerChatSection from '@/components/MessengerChatSection';
import ContactBlocks from '@/components/ContactBlocks';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import { pageCopy } from '@/data/page-copy';
import styles from './ZhHantContact.module.css';

/**
 * zh-hant contact page, second pass (son7-87 / Opus 5.5, 2026-10-01): the same blocks as
 * ContactLegacyPageBody in a new arrangement — green header with the email actions, the
 * inquiry form beside the preparation guide, then email/AI options, inquiry types and offices.
 */
export default function ZhHantContactBody() {
  const copy = pageCopy['zh-hant'].contact;
  return (
    <div className={styles.root} id="zh-hant-contact" data-zh-hant-design="contact">
      <PageHeader locale="zh-hant" label={copy.label} title={copy.title} description={copy.description}>
        <ContactEmailActions locale="zh-hant" />
      </PageHeader>
      <section className={`section ${styles.main}`}>
        <div className={`container ${styles.mainGrid}`}>
          <div className={styles.formCol}>
            <InternationalInquiryForm locale="zh-hant" />
          </div>
          <aside className={styles.guideCol}>
            <ConsultationGuideSection locale="zh-hant" />
          </aside>
        </div>
      </section>
      <MessengerChatSection locale="zh-hant" />
      <ContactBlocks locale="zh-hant" showMainHeader={false} showEmailActions={false} />
      <OfficeMapTabs locale="zh-hant" />
    </div>
  );
}
