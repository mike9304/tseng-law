import { internationalInquiryCopy } from '@/data/international-inquiry-copy';
import { getLocalizedConsultationMailto } from '@/lib/consultation/localized-mailto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

const staticSiteFlag = vi.hoisted(() => ({ isStatic: true }));

vi.mock('@/lib/static-site', () => ({
  get IS_STATIC_SITE() {
    return staticSiteFlag.isStatic;
  },
}));

describe('InternationalInquiryForm on the static site', () => {
  afterEach(() => {
    staticSiteFlag.isStatic = true;
    vi.resetModules();
  });

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

  it('omits form-dropdown and site-storage notices from InternationalInquiryNotice', async () => {
    const { InternationalInquiryNotice } = await import('../InternationalInquiryForm');
    const copy = internationalInquiryCopy.ko;
    const html = renderToStaticMarkup(<InternationalInquiryNotice locale="ko" />);
    expect(html).toContain(copy.guidanceNotice);
    expect(html).toContain(copy.consultationNotice);
    expect(html).not.toContain(copy.methodConfirmationNotice);
    expect(html).not.toContain(copy.preparationNotice);
  });

  it('still renders method and preparation notices when the site is not static', async () => {
    staticSiteFlag.isStatic = false;
    vi.resetModules();
    const { InternationalInquiryNotice } = await import('../InternationalInquiryForm');
    const copy = internationalInquiryCopy.ko;
    const html = renderToStaticMarkup(<InternationalInquiryNotice locale="ko" />);
    expect(html).toContain(copy.methodConfirmationNotice);
    expect(html).toContain(copy.preparationNotice);
  });
});
