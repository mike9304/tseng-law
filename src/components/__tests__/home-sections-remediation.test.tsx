import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import FAQAccordion from '@/components/FAQAccordion';
import ServicesBento from '@/components/ServicesBento';
import { faqContent } from '@/data/faq-content';
import { siteContent } from '@/data/site-content';
import { getServiceSlugs } from '@/data/service-details';
import { homeServicesTextSurfaceIds } from '@/lib/builder/registry';

describe('homepage section remediation', () => {
  it('renders services as six static cards with summaries and detail links', () => {
    const html = renderToStaticMarkup(<ServicesBento locale="ko" id="practice" />);

    expect(html.match(/class="services-detail-card services-card"/g)).toHaveLength(6);
    expect(html.match(/class="services-detail-desc services-card-summary"/g)).toHaveLength(6);
    expect(html.match(/class="services-detail-more services-card-link"/g)).toHaveLength(6);
    expect(html).toContain('services-bento');
    expect(html).toContain('id="practice"');
    expect(html).not.toContain('services-detail-toggle');
    expect(html).not.toContain('services-detail-chevron');
    expect(html).not.toContain('aria-expanded');
  });

  it('renders the Korean FAQ heading once, with FAQ as the eyebrow label', () => {
    const html = renderToStaticMarkup(
      <FAQAccordion locale="ko" items={faqContent.ko} id="faq" />,
    );

    expect(html.match(/자주 묻는 질문/g)).toHaveLength(1);
    expect(html).toContain('>FAQ<');
  });

  it('compact services omit the repeated heading but keep six summaries, locale detail links, and an accessible section name', () => {
    const slugs = getServiceSlugs().slice(0, 6);
    expect(slugs).toHaveLength(6);

    for (const locale of ['ko', 'en', 'zh-hant', 'ja'] as const) {
      const html = renderToStaticMarkup(
        <ServicesBento locale={locale} showHeader={false} />,
      );
      const title = siteContent[locale].services.title;

      expect(html).toContain('services-bento');
      expect(html).not.toContain('id="practice"');
      expect(html).toContain(`aria-label="${title}"`);
      expect(html.match(/<h2 class="services-detail-title"/g)).toHaveLength(6);
      expect(html).not.toContain('<h3');
      expect(html).not.toContain('class="section-title"');
      expect(html).not.toContain('class="section-lede"');
      expect(html).not.toContain(`data-builder-surface-key="${homeServicesTextSurfaceIds[0]}"`);
      expect(html).not.toContain(`data-builder-surface-key="${homeServicesTextSurfaceIds[1]}"`);
      expect(html).not.toContain(`data-builder-surface-key="${homeServicesTextSurfaceIds[2]}"`);
      expect(html.match(/class="services-detail-desc services-card-summary"/g)).toHaveLength(6);
      expect(html.match(/class="services-detail-more services-card-link"/g)).toHaveLength(6);
      expect(html.match(new RegExp(`href="/${locale}/services/[^"]+"`, 'g'))).toHaveLength(6);
      for (const slug of slugs) {
        expect(html).toContain(`href="/${locale}/services/${slug}"`);
      }
      expect(html).not.toContain('services-detail-toggle');
      expect(html).not.toContain('services-detail-chevron');
    }
  });

  it('default and hero-hidden services keep header edit surfaces and six service cards', () => {
    const defaultHtml = renderToStaticMarkup(<ServicesBento locale="ko" id="practice" />);
    const heroHiddenHtml = renderToStaticMarkup(<ServicesBento locale="ko" />);

    expect(defaultHtml).toContain('id="practice"');
    expect(heroHiddenHtml).not.toContain('id="practice"');

    for (const html of [defaultHtml, heroHiddenHtml]) {
      expect(html).toContain('services-bento');
      expect(html.match(/<h2 class="section-title"/g)).toHaveLength(1);
      expect(html.match(/<h3 class="services-detail-title"/g)).toHaveLength(6);
      expect(html).toContain('class="section-title"');
      expect(html).toContain(siteContent.ko.services.title);
      expect(html).toContain(`data-builder-surface-key="${homeServicesTextSurfaceIds[0]}"`);
      expect(html).toContain(`data-builder-surface-key="${homeServicesTextSurfaceIds[1]}"`);
      expect(html).toContain(`data-builder-surface-key="${homeServicesTextSurfaceIds[2]}"`);
      expect(html).not.toContain(`aria-label="${siteContent.ko.services.title}"`);
      expect(html.match(/class="services-detail-desc services-card-summary"/g)).toHaveLength(6);
      expect(html.match(/class="services-detail-more services-card-link"/g)).toHaveLength(6);
      expect(html.match(/class="services-detail-card services-card"/g)).toHaveLength(6);
    }
  });
});
