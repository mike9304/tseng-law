import Link from 'next/link';
import { ATTORNEY_CREDENTIAL_SOURCE_URL, zhAttorneyCredentials } from '@/data/attorney-credentials';
import styles from './AttorneyCredentialCard.module.css';

export default function AttorneyCredentialCard({ profileLink = false }: { profileLink?: boolean }) {
  return (
    <section className={styles.root} aria-labelledby="attorney-credentials-heading" data-attorney-credentials="zh-hant">
      <h2 id="attorney-credentials-heading">律師資格與語言能力</h2>
      <dl className={styles.list}>
        {zhAttorneyCredentials.map(item => (
          <div className={styles.row} key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>
        ))}
      </dl>
      <p className={styles.source}>
        <a href={ATTORNEY_CREDENTIAL_SOURCE_URL}>昊鼎官方律師簡介：執業與語言資料</a>
      </p>
      <p className={styles.source}>
        {profileLink
          ? <Link href="/zh-hant/lawyers/wei-tseng">曾雋崴律師學經歷與服務領域</Link>
          : <Link href="/zh-hant/korean-lawyer-in-taiwan">韓文法律諮詢：服務範圍與聯絡方式</Link>}
      </p>
    </section>
  );
}
