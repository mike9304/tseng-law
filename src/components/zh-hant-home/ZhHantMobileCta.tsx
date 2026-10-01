import { getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import styles from '../ZhHantDesign.module.css';

/**
 * zh-hant home: a fixed consultation bar for narrow screens (CSS hides it above 640px).
 * The primary label is the locked hero CTA text 「申請電子郵件諮詢」.
 */
export default function ZhHantMobileCta() {
  return (
    <nav className={styles.mobileCta} aria-label="快速聯絡">
      <a className={styles.mobileCtaPrimary} href={getConsultationPublicMailto('zh-hant')}>申請電子郵件諮詢</a>
      <a className={styles.mobileCtaSecondary} href="#practice">服務領域</a>
    </nav>
  );
}
