import Image from 'next/image';
import Link from 'next/link';
import ZhHantMonoIcon from '@/components/zh-hant-icons/ZhHantMonoIcon';
import styles from '../ZhHantDesign.module.css';

/**
 * ko home: entry points by reader situation, directly under the hero (the zh-hant bento, 2026-10-06).
 * Navigation only — titles and lines restate the ko services (site-content ko services.items), the
 * company-setup / dispute paths the old hero carried (multilingual-international-v2 ko), the traffic
 * accident board and the 「한국어 가능한 대만 변호사」 landing (site-content ko); no new claims.
 * Two tiles carry decorative editorial photographs (a civic building in daylight; the sanheyuan the zh-hant home uses).
 */
const DOORS = [
  {
    title: '대만 진출 기업',
    image: '/images/editorial/taichung-courthouse-civic-daylight-v2.webp',
    text: '법인 형태 선택부터 투자심의위원회 승인, 업종별 인허가, 상표 선등록 확인까지.',
    links: [
      { label: '대만 회사설립 상담하기', href: '/ko/taiwan-company-setup-lawyer' },
      { label: '대만 회사설립 가이드 읽기', href: '/ko/guides/taiwan-company-setup' },
      { label: '노동법·고용분쟁', href: '/ko/services/labor' },
      { label: '지적재산·금융분쟁', href: '/ko/services/ip' },
    ],
  },
  {
    title: '분쟁과 소송',
    text: '계약 분쟁과 손해배상, 교통사고, 형사 절차의 수사 대응.',
    links: [
      { label: '대만 분쟁 상담하기', href: '/ko/taiwan-litigation-lawyer' },
      { label: '민사소송·손해배상', href: '/ko/services/civil' },
      { label: '교통사고', href: '/ko/traffic-accidents' },
      { label: '형사소송', href: '/ko/services/criminal' },
    ],
  },
  {
    title: '대만의 가족과 생활',
    image: '/images/editorial/taiwan-sanheyuan-modern-daylight-v2.webp',
    text: '이혼과 재산분할, 친권, 상속.',
    links: [
      { label: '가사소송', href: '/ko/services/family' },
      { label: '한국어 가능한 대만 변호사', href: '/ko/korean-lawyer-in-taiwan' },
    ],
  },
] as const satisfies ReadonlyArray<{ title: string; text: string; image?: string; links: ReadonlyArray<{ label: string; href: string }> }>;

export default function KoAudienceDoors() {
  return (
    <nav className={styles.doors} aria-label="상황별로 찾기">
      <div className={`container ${styles.doorsInner}`}>
        <p className={styles.doorsLabel}>상황별로 찾기</p>
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
