import type { SiteLocale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import {
  homeContactButtonSurfaceIds,
  homeContactTextSurfaceIds,
} from '@/lib/builder/registry';
import { SurfaceText } from '@/lib/builder/surface-context';
import {
  getConsultationCtaLabel,
  getConsultationPublicEmail,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';

const emailConsultationLabels: Record<SiteLocale, string> = {
  ko: '이메일 상담',
  'zh-hant': '電子郵件諮詢',
  en: 'Email consultation',
  ja: 'メール相談',
};

export default function HomeContactCta({ locale }: { locale: SiteLocale }) {
  const content = siteContent[locale];
  const contact = content.contact;
  const consultationEmail = getConsultationPublicEmail();
  const consultationEmailHref = getConsultationPublicMailto(locale);
  const consultationAriaLabel = getConsultationCtaLabel(locale);
  const { title, description } = content.homeContactCta;

  return (
    <section className="section section--dark home-contact-cta" id="contact" data-tone="dark">
      <div className="container">
        <div data-builder-node-key="copy">
          <div className="section-label" data-builder-surface-key={homeContactTextSurfaceIds[0]}>
            <SurfaceText surfaceKey={homeContactTextSurfaceIds[0]}>{contact.label}</SurfaceText>
          </div>
          <h2 className="section-title" data-builder-surface-key={homeContactTextSurfaceIds[1]}>
            <SurfaceText surfaceKey={homeContactTextSurfaceIds[1]}>{title}</SurfaceText>
          </h2>
          <p className="section-lede" data-builder-surface-key={homeContactTextSurfaceIds[2]}>
            <SurfaceText surfaceKey={homeContactTextSurfaceIds[2]}>{description}</SurfaceText>
          </p>
        </div>
        <div className="home-contact-actions" data-builder-node-key="actions">
          <a
            className="button ghost"
            href={consultationEmailHref}
            aria-label={`${contact.cta.label} — ${consultationAriaLabel}`}
            data-builder-surface-key={homeContactButtonSurfaceIds[0]}
          >
            <SurfaceText surfaceKey={homeContactButtonSurfaceIds[0]}>{contact.cta.label}</SurfaceText>
          </a>
          <a
            className="button secondary"
            href={consultationEmailHref}
            aria-label={`${emailConsultationLabels[locale]}: ${consultationEmail} — ${consultationAriaLabel}`}
            data-builder-surface-key={homeContactButtonSurfaceIds[1]}
          >
            <SurfaceText surfaceKey={homeContactButtonSurfaceIds[1]}>
              {emailConsultationLabels[locale]}: {consultationEmail}
            </SurfaceText>
          </a>
        </div>
      </div>
    </section>
  );
}
