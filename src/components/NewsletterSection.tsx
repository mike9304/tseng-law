import type { Locale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import EditorialSection from '@/components/EditorialSection';
import ListModule from '@/components/ListModule';
import SmartLink from '@/components/SmartLink';

export default function NewsletterSection({ locale }: { locale: Locale }) {
  const { newsletters } = siteContent[locale];

  return (
    <EditorialSection label={newsletters.label} title={newsletters.title}>
      <ListModule className="newsletter-list reveal-stagger">
        {newsletters.items.map((item) => (
          <div key={item.title} className="newsletter-item">
            <div className="newsletter-meta">{item.date}</div>
            <div>
              <SmartLink className="link-underline" href={item.href}>
                {item.title}
              </SmartLink>
              {item.summary ? <p className="newsletter-summary">{item.summary}</p> : null}
            </div>
          </div>
        ))}
      </ListModule>
    </EditorialSection>
  );
}
