import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';

export default function KeywordChips({ locale }: { locale: Locale }) {
  const hero = siteContent[locale].hero;
  return (
    <div>
      <div className="section-label">{hero.keywordsLabel}</div>
      <div className="chip-group">
        {hero.keywords.map((keyword) => (
          <Link key={keyword} href={`/${locale}/search?q=${encodeURIComponent(keyword)}`} className="chip">
            {keyword}
          </Link>
        ))}
      </div>
    </div>
  );
}
