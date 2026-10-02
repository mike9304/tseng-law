import Image from 'next/image';
import Link from 'next/link';
import ZhHantMonoIcon from '@/components/zh-hant-icons/ZhHantMonoIcon';
import styles from '../ZhHantDesign.module.css';

/**
 * zh-hant home: entry points by reader type, as their own band directly under the hero. Taiwanese readers'
 * everyday disputes come first; company setup sits with foreign clients (2026-10-01 direction).
 * Navigation only — every line restates existing services, routes and the firm's consultation
 * languages; no new claims. Apple pass: a bento of three tiles; two carry decorative editorial photographs.
 */
const DOORS = [
  {
    title: '個人與家庭',
    image: '/images/editorial/taiwan-sanheyuan-modern-daylight-v2.webp',
    text: '車禍與損害賠償、離婚與繼承、刑事案件。',
    links: [
      { label: '車禍處理', href: '/zh-hant/traffic-accidents' },
      { label: '家事事件', href: '/zh-hant/services/family' },
      { label: '刑事訴訟', href: '/zh-hant/services/criminal' },
    ],
  },
  {
    title: '工作與契約糾紛',
    text: '解僱與資遣費、契約糾紛與損害賠償、商標與著作權。',
    links: [
      { label: '勞動與僱傭爭議', href: '/zh-hant/services/labor' },
      { label: '民事訴訟與損害賠償', href: '/zh-hant/services/civil' },
      { label: '智慧財產與金融爭議', href: '/zh-hant/services/ip' },
    ],
  },
  {
    title: '在台外國人與外國企業',
    image: '/images/editorial/light-of-qilou-opening.webp',
    text: '在台設立公司與投資審查，可用中文、韓文、日文或英文溝通。',
    links: [
      { label: '投資與公司設立', href: '/zh-hant/services/investment' },
      { label: '會說韓文的台灣律師', href: '/zh-hant/korean-lawyer-in-taiwan' },
    ],
  },
] as const satisfies ReadonlyArray<{ title: string; text: string; image?: string; links: ReadonlyArray<{ label: string; href: string }> }>;

export default function ZhHantAudienceDoors() {
  return (
    <nav className={styles.doors} aria-label="依需求選擇服務">
      <div className={`container ${styles.doorsInner}`}>
      <p className={styles.doorsLabel}>依需求選擇</p>
      <ul className={styles.doorList}>
        {DOORS.map((door) => (
          <li key={door.title} className={`${styles.door} ${'image' in door ? styles.doorDark : styles.doorLight}`}>
            {'image' in door ? (
              <span className={styles.doorMedia} aria-hidden>
                <Image src={door.image} alt="" fill sizes="(max-width: 767px) 100vw, 50vw" />
              </span>
            ) : null}
            <p className={styles.doorTitle}>{door.title}</p>
            <p className={styles.doorText}>{door.text}</p>
            <p className={styles.doorLinks}>
              {door.links.map((link) => (
                <Link key={link.href} href={link.href}>{link.label}<ZhHantMonoIcon name="chevron-right" size={14} strokePx={1.75} className={styles.trail} /></Link>
              ))}
            </p>
          </li>
        ))}
      </ul>
      </div>
    </nav>
  );
}
