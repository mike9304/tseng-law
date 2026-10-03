import PageHeader from '@/components/PageHeader';
import ContactBlocks from '@/components/ContactBlocks';
import ContactEmailActions from '@/components/ContactEmailActions';
import ConsultationGuideSection from '@/components/ConsultationGuideSection';
import MessengerChatSection from '@/components/MessengerChatSection';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import InternationalInquiryForm from '@/components/InternationalInquiryForm';
import { pageCopy } from '@/data/page-copy';
import EnPageShell, { EnPaper } from './EnPageShell';
import styles from './EnContact.module.css';

/**
 * en contact page (CONCEPT-V2 12.3, Clear Night): the title card carries the official email block on the right
 * (address in display type, the blue pill, "Copy email address", the existing notes); the rest reads on paper:
 * the inquiry form with the "Before You Contact Us" guide beside it from 1024 px, the email and AI section,
 * inquiry types and the offices. Same components and copy as before.
 */
export default function EnContactBody() {
  const copy = pageCopy.en.contact;
  return (
    <EnPageShell page="contact">
      <div className={styles.contact}>
        <PageHeader locale="en" label={copy.label} title={copy.title} description={copy.description}>
          <ContactEmailActions locale="en" />
        </PageHeader>
        <EnPaper className={styles.paper}>
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
        </EnPaper>
      </div>
    </EnPageShell>
  );
}
