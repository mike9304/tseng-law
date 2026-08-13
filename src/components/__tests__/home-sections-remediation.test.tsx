import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import FAQAccordion from '@/components/FAQAccordion';
import ServicesBento from '@/components/ServicesBento';
import { faqContent } from '@/data/faq-content';

describe('homepage section remediation', () => {
  it('renders services as six static cards with summaries and detail links', () => {
    const html = renderToStaticMarkup(<ServicesBento locale="ko" id="practice" />);

    expect(html.match(/class="services-detail-card services-card"/g)).toHaveLength(6);
    expect(html.match(/class="services-detail-desc services-card-summary"/g)).toHaveLength(6);
    expect(html.match(/class="services-detail-more services-card-link"/g)).toHaveLength(6);
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
});
