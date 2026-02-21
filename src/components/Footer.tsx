import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/locales';

export default function Footer({ locale }: { locale: Locale }) {
  const officeLabel = locale === 'ko' ? '사무소' : locale === 'zh-hant' ? '據點' : 'Offices';
  const offices =
    locale === 'ko'
      ? [
          { label: '타이베이', href: '/ko/contact#offices' },
          { label: '타이중', href: '/ko/contact#offices' },
          { label: '가오슝', href: '/ko/contact#offices' }
        ]
      : locale === 'zh-hant'
        ? [
          { label: '台北', href: '/zh-hant/contact#offices' },
          { label: '台中', href: '/zh-hant/contact#offices' },
          { label: '高雄', href: '/zh-hant/contact#offices' }
        ]
        : [
          { label: 'Taipei', href: '/en/contact#offices' },
          { label: 'Taichung', href: '/en/contact#offices' },
          { label: 'Kaohsiung', href: '/en/contact#offices' }
        ];
  const legalLinks =
    locale === 'ko'
      ? [
          { label: '개인정보처리방침', href: '/ko/contact' },
          { label: '면책공고', href: '/ko/faq' },
          { label: '웹접근성', href: '/ko/services' },
          { label: '사이트맵', href: '/sitemap.xml' }
        ]
      : locale === 'zh-hant'
        ? [
          { label: '隱私權政策', href: '/zh-hant/contact' },
          { label: '免責聲明', href: '/zh-hant/faq' },
          { label: '無障礙聲明', href: '/zh-hant/services' },
          { label: '網站地圖', href: '/sitemap.xml' }
        ]
        : [
          { label: 'Privacy Policy', href: '/en/contact' },
          { label: 'Disclaimer', href: '/en/faq' },
          { label: 'Accessibility', href: '/en/services' },
          { label: 'Sitemap', href: '/sitemap.xml' }
        ];

  return (
    <>
      <section className="footer-skyline" aria-hidden>
        <div className="skyline-image">
          <Image src="/images/footer-ground-skyline-v2.webp" alt="" width={2600} height={778} />
        </div>
      </section>
      <footer className="site-footer">
        <div className="footer-offices">
          <div className="container">
            <nav className="office-links" aria-label={officeLabel}>
              <span className="office-label">{officeLabel}</span>
              {offices.map((office) => (
                <Link key={office.label} href={office.href} className="office-link">
                  {office.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className="footer-bottom-bar">
          <div className="container footer-bottom-grid">
            <div className="footer-legal-links">
              {legalLinks.map((item) => (
                <Link key={item.label} href={item.href}>
                  {item.label}
                </Link>
              ))}
              <span className="footer-locale-switch">
                <Link href="/ko" aria-current={locale === 'ko' ? 'page' : undefined}>
                  KO
                </Link>
                <Link href="/zh-hant" aria-current={locale === 'zh-hant' ? 'page' : undefined}>
                  中文
                </Link>
                <Link href="/en" aria-current={locale === 'en' ? 'page' : undefined}>
                  EN
                </Link>
              </span>
            </div>
            <div className="footer-social">
              <span className="social-label">{locale === 'ko' ? '팔로우' : locale === 'zh-hant' ? '追蹤我們' : 'Follow'}</span>
              <div className="social-icons">
                <a className="social-icon" href="https://blog.naver.com/wei_lawyer/223461663913" aria-label="Blog" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M14 2.5l3.5 3.5L7 16.5l-4.5 1 1-4.5L14 2.5z" />
                    <path d="M12 5l3 3" />
                  </svg>
                </a>
                <a className="social-icon" href="https://www.youtube.com/@weilawyer" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="2" y="4" width="16" height="12" rx="3" />
                    <polygon points="8,7.5 13,10 8,12.5" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a className="social-icon" href="https://www.wei-wei-lawyer.com/" aria-label="Website" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <circle cx="10" cy="10" r="8" />
                    <ellipse cx="10" cy="10" rx="3.5" ry="8" />
                    <path d="M2.5 8h15M2.5 12h15" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="container">
            <p className="footer-copyright-row">Copyright HOVERING LAW INTERNATIONAL. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
