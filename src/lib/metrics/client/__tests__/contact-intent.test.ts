import { describe, expect, it } from 'vitest';

import {
  CONSULTATION_EMAIL,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import {
  isOfficialConsultationMailtoHref,
  shouldTrackOfficialConsultationMailtoClick,
  toContactIntentPath,
} from '@/lib/metrics/client/contact-intent';

function anchor(href: string) {
  return {
    tagName: 'A',
    getAttribute: (name: string) => (name === 'href' ? href : null),
    parentElement: null,
  };
}

describe('isOfficialConsultationMailtoHref', () => {
  it('accepts the official mailbox, including case and percent-encoding', () => {
    expect(isOfficialConsultationMailtoHref(`mailto:${CONSULTATION_EMAIL}`)).toBe(true);
    expect(isOfficialConsultationMailtoHref(`MAILTO:${CONSULTATION_EMAIL.toUpperCase()}`)).toBe(true);
    expect(isOfficialConsultationMailtoHref(` mailto:${CONSULTATION_EMAIL} `)).toBe(true);
    expect(
      isOfficialConsultationMailtoHref(`mailto:${encodeURIComponent(CONSULTATION_EMAIL)}`),
    ).toBe(true);
  });

  it('accepts official subject/body query variants used on the public site', () => {
    expect(isOfficialConsultationMailtoHref(getConsultationPublicMailto('ko'))).toBe(true);
    expect(isOfficialConsultationMailtoHref(getConsultationPublicMailto('ja'))).toBe(true);
    expect(isOfficialConsultationMailtoHref(getConsultationPublicMailto('en'))).toBe(true);
    expect(isOfficialConsultationMailtoHref(getConsultationPublicMailto('zh-hant'))).toBe(true);
    expect(
      isOfficialConsultationMailtoHref(
        `mailto:${CONSULTATION_EMAIL}?subject=Hello&body=Inquiry`,
      ),
    ).toBe(true);
  });

  it.each([
    ['other recipient', 'mailto:office@example.com'],
    ['multiple comma recipients', `mailto:${CONSULTATION_EMAIL},other@example.com`],
    ['multiple semicolon recipients', `mailto:${CONSULTATION_EMAIL};other@example.com`],
    ['encoded extra recipient', `mailto:${CONSULTATION_EMAIL}%2Cother@example.com`],
    ['cc header', `mailto:${CONSULTATION_EMAIL}?cc=other@example.com`],
    ['bcc header', `mailto:${CONSULTATION_EMAIL}?bcc=other@example.com`],
    ['to header', `mailto:?to=${CONSULTATION_EMAIL}`],
    ['invalid href', 'mailto:'],
    ['protocol-relative mailbox', `mailto://${CONSULTATION_EMAIL}`],
    ['http url', 'https://tseng-law.com/ko/contact'],
    ['contact navigation', '/ko/contact'],
    ['tel', 'tel:+886'],
    ['broken percent encoding', 'mailto:wei%ZZ@hoveringlaw.com.tw'],
  ])('rejects %s', (_case, href) => {
    expect(isOfficialConsultationMailtoHref(href)).toBe(false);
  });
});

describe('shouldTrackOfficialConsultationMailtoClick', () => {
  it('tracks nested span and svg clicks on the official mailto anchor', () => {
    const official = anchor(`mailto:${CONSULTATION_EMAIL}?subject=Hi`);
    const span = { tagName: 'SPAN', getAttribute: () => null, parentElement: official };
    const svg = { tagName: 'svg', getAttribute: () => null, parentElement: official };
    const textNode = { nodeType: 3, parentElement: span };

    expect(shouldTrackOfficialConsultationMailtoClick(official)).toBe(true);
    expect(shouldTrackOfficialConsultationMailtoClick(span)).toBe(true);
    expect(shouldTrackOfficialConsultationMailtoClick(svg)).toBe(true);
    expect(shouldTrackOfficialConsultationMailtoClick(textNode)).toBe(true);
  });

  it('tracks svg xlink:href official mailto anchors', () => {
    const svgAnchor = {
      tagName: 'a',
      getAttribute: (name: string) => (
        name === 'xlink:href' ? `mailto:${CONSULTATION_EMAIL}` : null
      ),
      parentElement: null,
    };
    expect(shouldTrackOfficialConsultationMailtoClick(svgAnchor)).toBe(true);
  });

  it('does not treat copy buttons or contact navigation as email compose', () => {
    const copyButton = {
      tagName: 'BUTTON',
      getAttribute: () => null,
      parentElement: null,
      closest: () => null,
    };
    const contactNav = anchor('/ko/contact');
    const otherMail = anchor('mailto:other@example.com');

    expect(shouldTrackOfficialConsultationMailtoClick(copyButton)).toBe(false);
    expect(shouldTrackOfficialConsultationMailtoClick(contactNav)).toBe(false);
    expect(shouldTrackOfficialConsultationMailtoClick(otherMail)).toBe(false);
    expect(shouldTrackOfficialConsultationMailtoClick(null)).toBe(false);
  });
});

describe('toContactIntentPath', () => {
  it('strips query/hash and rejects admin or protocol-relative paths', () => {
    expect(toContactIntentPath('/ko/contact?x=1#write')).toBe('/ko/contact');
    expect(toContactIntentPath('/ja')).toBe('/ja');
    expect(toContactIntentPath('//example.com')).toBeNull();
    expect(toContactIntentPath('/ko/admin-builder')).toBeNull();
    expect(toContactIntentPath('/admin-consultation')).toBeNull();
    expect(toContactIntentPath(null)).toBeNull();
  });
});
