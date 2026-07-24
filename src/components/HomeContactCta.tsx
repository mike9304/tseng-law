import type { SiteLocale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import SmartLink from '@/components/SmartLink';
import {
  homeContactButtonSurfaceIds,
  homeContactTextSurfaceIds,
} from '@/lib/builder/registry';
import { SurfaceText } from '@/lib/builder/surface-context';

export default function HomeContactCta({ locale }: { locale: SiteLocale }) {
  const content = siteContent[locale];
  const contact = content.contact;
  const representativeTel = content.quickContact.actions.find((action) => action.href.startsWith('tel:'));
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
          <SmartLink
            className="button ghost"
            href={`/${locale}/contact`}
            data-builder-surface-key={homeContactButtonSurfaceIds[0]}
          >
            <SurfaceText surfaceKey={homeContactButtonSurfaceIds[0]}>{contact.cta.label}</SurfaceText>
          </SmartLink>
          {representativeTel ? (
            <a
              className="button secondary"
              href={representativeTel.href}
              data-builder-surface-key={homeContactButtonSurfaceIds[1]}
            >
              <SurfaceText surfaceKey={homeContactButtonSurfaceIds[1]}>{representativeTel.value}</SurfaceText>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
