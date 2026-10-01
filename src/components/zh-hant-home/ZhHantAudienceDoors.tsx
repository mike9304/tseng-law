import Link from 'next/link';
import styles from '../ZhHantDesign.module.css';

/**
 * zh-hant home: entry points by reader type, placed under the hero CTA.
 * Navigation only — every line restates existing services, routes and the
 * firm's consultation languages; no new claims.
 */
const DOORS = [
  {
    title: '公司與投資',
    text: '在台設立公司、外國人投資審查，以及商業契約與爭議。',
    links: [
      { label: '公司設立指南', href: '/zh-hant/guides/taiwan-company-setup' },
      { label: '投資與公司設立', href: '/zh-hant/services/investment' },
    ],
  },
  {
    title: '個人與家庭',
    text: '車禍與損害賠償、離婚與繼承、刑事案件。',
    links: [
      { label: '車禍處理', href: '/zh-hant/traffic-accidents' },
      { label: '家事事件', href: '/zh-hant/services/family' },
      { label: '刑事訴訟', href: '/zh-hant/services/criminal' },
    ],
  },
  {
    title: '在台外國人與韓國客戶',
    text: '可用中文、韓文、日文或英文溝通，處理在台法律程序。',
    links: [
      { label: '會說韓文的台灣律師', href: '/zh-hant/korean-lawyer-in-taiwan' },
      { label: '聯絡方式', href: '/zh-hant/contact' },
    ],
  },
] as const;

export default function ZhHantAudienceDoors() {
  return (
    <nav className={styles.doors} aria-label="依需求選擇服務">
      <p className={styles.doorsLabel}>依需求選擇</p>
      <ul className={styles.doorList}>
        {DOORS.map((door) => (
          <li key={door.title} className={styles.door}>
            <p className={styles.doorTitle}>{door.title}</p>
            <p className={styles.doorText}>{door.text}</p>
            <p className={styles.doorLinks}>
              {door.links.map((link) => (
                <Link key={link.href} href={link.href}>{link.label}</Link>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </nav>
  );
}
