import Link from 'next/link';
import { siteContent } from '@/data/site-content';
import { getConsultationCtaLabel, getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import styles from '../ZhHantDesign.module.css';

/**
 * zh-hant home: how a Taiwanese reader goes from a first email to retaining the firm, beside the four
 * offices. Each step restates existing site facts — no new claims:
 * 1 public-contact.ts (first contact: case summary and contact details only; sensitive data later),
 * 2 PricingCards zh-hant (「確認案件內容後提供報價」, 一般法律諮詢 NT$ 3,000／1小時),
 * 3 PricingCards zh-hant disclaimer (「確切費用於初次諮詢後以書面報價」),
 * 4 team-members zh-hant description and the four consultation languages.
 */
const STEPS = [
  { title: '來信說明', text: '以電子郵件寄出案件或業務概要與聯絡方式；身分證字號、帳戶等敏感資料，請等律師指示後再提供。' },
  { title: '確認案件內容', text: '確認案件內容後提供報價。一般法律諮詢為 NT$ 3,000／1小時。' },
  { title: '書面報價', text: '確切費用於初次諮詢後以書面報價。' },
  { title: '律師承辦', text: '由曾雋崴律師帶領的團隊承辦，可用中文、韓文、日文或英文溝通。' },
] as const;

export default function ZhHantEngagement() {
  const { contact } = siteContent['zh-hant'];
  return (
    <section id="process" className={styles.engagement} aria-labelledby="zh-hant-process-title">
      <div className={`container ${styles.engagementGrid}`}>
        <div className={styles.engagementMain}>
          <h2 id="zh-hant-process-title" className={styles.engagementTitle}>委任流程</h2>
          <ol className={styles.engagementSteps}>
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <span className={styles.engagementNo} aria-hidden>{index + 1}</span>
                <span className={styles.engagementStepTitle}>{step.title}</span>
                <span className={styles.engagementStepText}>{step.text}</span>
              </li>
            ))}
          </ol>
          <div className={styles.engagementActions}>
            <a href={getConsultationPublicMailto('zh-hant')} className="button" aria-label={`申請電子郵件諮詢 — ${getConsultationCtaLabel('zh-hant')}`}>
              申請電子郵件諮詢
            </a>
            <Link href="/zh-hant/pricing" className={styles.engagementMore}>收費標準 <span aria-hidden>→</span></Link>
          </div>
        </div>
        <div className={styles.engagementOffices}>
          <p className={styles.engagementOfficesLabel}>{contact.locationsLabel}</p>
          <ul>
            {contact.locations.map((office) => (
              <li key={office.title}>
                <span className={styles.engagementOfficeName}>{office.title}</span>
                <span className={styles.engagementOfficeAddress}>{office.details[0]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
