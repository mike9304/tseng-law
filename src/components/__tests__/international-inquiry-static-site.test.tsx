import { getLocalizedConsultationMailto } from '@/lib/consultation/localized-mailto';
import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

vi.mock('@/lib/static-site', () => ({ IS_STATIC_SITE: true }));

describe('InternationalInquiryForm on the static site', () => {
  it('renders the email call to action instead of the API form', async () => {
    const { default: InternationalInquiryForm } = await import('../InternationalInquiryForm');
    const html = renderToStaticMarkup(<InternationalInquiryForm locale="ko" />);
    expect(html).not.toContain('<form');
    expect(html).toContain('data-inquiry-mode="email"');
    expect(html).toContain('상담 문의 보내기');
    expect(html).toContain('href="mailto:wei@hoveringlaw.com.tw?subject=');
  });

  it('opens a localized draft for guidance locales', async () => {
    const { default: InternationalInquiryForm } = await import('../InternationalInquiryForm');
    const html = renderToStaticMarkup(<InternationalInquiryForm locale="vi" />);
    expect(html).toContain(`href="${getLocalizedConsultationMailto('vi').replace(/&/g, '&amp;')}"`);
    expect(html).not.toContain('href="mailto:wei@hoveringlaw.com.tw"');
  });
});
