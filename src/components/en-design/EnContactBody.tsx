import PageHeader from '@/components/PageHeader';
import ContactBlocks from '@/components/ContactBlocks';
import ContactEmailActions from '@/components/ContactEmailActions';
import ConsultationGuideSection from '@/components/ConsultationGuideSection';
import MessengerChatSection from '@/components/MessengerChatSection';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import InternationalInquiryForm from '@/components/InternationalInquiryForm';
import { pageCopy } from '@/data/page-copy';
import EnPageShell from './EnPageShell';
import styles from './EnContact.module.css';

/**
 * en contact page (Opus 5.5 en lane, 2026-10-01): email panel beside the H1, then the inquiry
 * form with the "Before You Contact Us" checklist beside it, the email/AI section, inquiry
 * types and offices. Same components and copy as before, rearranged for scanning.
 */
export default function EnContactBody() {
  const copy = pageCopy.en.contact;
  return (
    <EnPageShell page="contact">
      <div className={styles.contact}>
        <PageHeader locale="en" label={copy.label} title={copy.title} description={copy.description}>
          <ContactEmailActions locale="en" />
        </PageHeader>
        <div className={`container ${styles.split}`}>
          <section className={styles.formCol} aria-label={copy.title}>
            <InternationalInquiryForm locale="en" />
          </section>
          <div className={styles.guideCol}>
            <ConsultationGuideSection locale="en" />
          </div>
        </div>
        <MessengerChatSection locale="en" />
        <ContactBlocks locale="en" showMainHeader={false} showEmailActions={false} />
        <OfficeMapTabs locale="en" />
      </div>
    </EnPageShell>
  );
}
