import Image from 'next/image';
import Link from 'next/link';
import type { SiteLocale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import { getPublishedBaseFooterColumns } from '@/components/footer-link-policy';
import LocaleFlagSwitcher from '@/components/LocaleFlagSwitcher';

export type FooterLink = {
  readonly label: string;
  readonly href: string;
};

export type FooterLinkColumn = {
  readonly title: string;
  readonly links: readonly FooterLink[];
};

export default function Footer({
  locale,
  extraColumns = [],
}: {
  locale: SiteLocale;
  extraColumns?: readonly FooterLinkColumn[];
}) {
  const footerContent = siteContent[locale].footer;
  const publishedBaseColumns = getPublishedBaseFooterColumns(footerContent.columns);
  const brandName =
    locale === 'ko'
      ? '법무법인 호정'
      : locale === 'zh-hant'
        ? '昊鼎國際法律事務所'
        : locale === 'ja'
          ? '昊鼎国際法律事務所'
          : 'Hovering International Law Firm';
  const officeLabel =
    locale === 'ko' ? '사무소' : locale === 'zh-hant' ? '據點' : locale === 'ja' ? '事務所' : 'Offices';
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
        : locale === 'ja'
          ? [
          { label: '台北', href: '/ja/contact#offices' },
          { label: '台中', href: '/ja/contact#offices' },
          { label: '高雄', href: '/ja/contact#offices' }
        ]
        : [
          { label: 'Taipei', href: '/en/contact#offices' },
          { label: 'Taichung', href: '/en/contact#offices' },
          { label: 'Kaohsiung', href: '/en/contact#offices' }
        ];
  const legalLinks =
    locale === 'ko'
      ? [
          { label: '개인정보처리방침', href: '/ko/privacy' },
          { label: '면책 고지', href: '/ko/disclaimer' },
          { label: '웹접근성', href: '/ko/accessibility' },
          { label: '사이트맵', href: '/sitemap.xml' }
        ]
      : locale === 'zh-hant'
        ? [
          { label: '隱私權政策', href: '/zh-hant/privacy' },
          { label: '免責聲明', href: '/zh-hant/disclaimer' },
          { label: '無障礙聲明', href: '/zh-hant/accessibility' },
          { label: '網站地圖', href: '/sitemap.xml' }
        ]
        : locale === 'ja'
          ? [
          { label: 'プライバシーポリシー', href: '/ja/privacy' },
          { label: '免責事項', href: '/ja/disclaimer' },
          { label: 'アクセシビリティ', href: '/ja/accessibility' },
          { label: 'サイトマップ', href: '/sitemap.xml' }
        ]
        : [
          { label: 'Privacy Policy', href: '/en/privacy' },
          { label: 'Disclaimer', href: '/en/disclaimer' },
          { label: 'Accessibility', href: '/en/accessibility' },
          { label: 'Sitemap', href: '/sitemap.xml' }
        ];
  const socialLabels =
    locale === 'ko'
      ? { blog: '블로그', youtube: '유튜브', website: '공식 사이트' }
      : locale === 'zh-hant'
        ? { blog: '部落格', youtube: 'YouTube', website: '官方網站' }
        : locale === 'ja'
          ? { blog: 'ブログ', youtube: 'YouTube', website: '公式サイト' }
        : { blog: 'Blog', youtube: 'YouTube', website: 'Website' };

  return (
    <>
      <section className="footer-skyline" aria-hidden>
        <div className="skyline-image">
          <Image
            src="/images/footer-ground-skyline-v2.webp"
            alt=""
            width={2600}
            height={778}
            loading="eager"
            fetchPriority="low"
            sizes="100vw"
          />
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
        <div className="footer-main">
          <div className="container footer-main-grid">
            <div className="footer-main-intro">
              <p className="footer-main-brand">{brandName}</p>
              <p className="footer-main-note">{footerContent.note}</p>
            </div>
            {[...publishedBaseColumns, ...extraColumns].map((column) => (
              <nav key={column.title} className="footer-link-column" aria-label={column.title}>
                <p className="footer-link-title">{column.title}</p>
                <div className="footer-link-list">
                  {column.links.map((link) => (
                    link.href.startsWith('http') || link.href.startsWith('#') ? (
                      <a key={link.href} href={link.href}>
                        {link.label}
                      </a>
                    ) : (
                      <Link key={link.href} href={link.href}>
                        {link.label}
                      </Link>
                    )
                  ))}
                </div>
              </nav>
            ))}
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
              <LocaleFlagSwitcher locale={locale} className="footer-locale-switch" />
            </div>
            <div className="footer-social">
              <span className="social-label">{locale === 'ko' ? '팔로우' : locale === 'zh-hant' ? '追蹤我們' : 'Follow'}</span>
              <div className="social-icons">
                <a className="social-icon" href="https://blog.naver.com/wei_lawyer/223461663913" aria-label={socialLabels.blog} target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M14 2.5l3.5 3.5L7 16.5l-4.5 1 1-4.5L14 2.5z" />
                    <path d="M12 5l3 3" />
                  </svg>
                </a>
                <a className="social-icon" href="https://www.youtube.com/@weilawyer" aria-label={socialLabels.youtube} target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="2" y="4" width="16" height="12" rx="3" />
                    <polygon points="8,7.5 13,10 8,12.5" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a className="social-icon" href="https://tseng-law.com/" aria-label={socialLabels.website} target="_blank" rel="noopener noreferrer">
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
            <p className="footer-copyright-row">{footerContent.legal}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
