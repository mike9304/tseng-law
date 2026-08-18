import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Footer from '@/components/Footer';
import {
  copyFooterEmailAndGetNotice,
} from '@/components/FooterEmailCopyButton';
import {
  CONSULTATION_EMAIL,
  getConsultationCtaLabel,
  getConsultationPublicMailto,
  getCopyEmailLabel,
  getEmailCopiedMessage,
  getOfficialConsultationEmailLabel,
} from '@/lib/consultation/public-contact';
import type { SiteLocale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';

const navigationState = vi.hoisted(() => ({
  pathname: '/ko',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationState.pathname,
}));

const localeExpectations = [
  { locale: 'ko', quickLinksLabel: '사무소 위치 바로가기' },
  { locale: 'zh-hant', quickLinksLabel: '事務所據點快速連結' },
  { locale: 'en', quickLinksLabel: 'Quick links to office locations' },
  { locale: 'ja', quickLinksLabel: '事務所所在地へのクイックリンク' },
] as const satisfies ReadonlyArray<{ locale: SiteLocale; quickLinksLabel: string }>;

function renderFooter(locale: SiteLocale): string {
  navigationState.pathname = `/${locale}`;
  return renderToStaticMarkup(<Footer locale={locale} />);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('footer office and consultation contact', () => {
  it.each(localeExpectations)(
    'publishes all four offices and the official email in $locale',
    ({ locale, quickLinksLabel }) => {
      const html = renderFooter(locale);
      const officeHref = `/${locale}/contact#offices`;

      expect(html.match(new RegExp(`href="${officeHref}"`, 'g'))).toHaveLength(4);
      expect(html).toContain(`aria-label="${quickLinksLabel}"`);
      for (const office of siteContent[locale].contact.locations) {
        expect(html).toContain(`<span class="office-link-name">${office.title}</span>`);
        expect(html).toContain(`<span class="office-link-address">${office.details[0]}</span>`);
      }
      expect(html).toContain(getOfficialConsultationEmailLabel(locale));
      expect(html).toContain(`href="${getConsultationPublicMailto(locale).replace(/&/g, '&amp;')}"`);
      expect(html).toContain(`>${CONSULTATION_EMAIL}</a>`);
      expect(html).toContain(
        `aria-label="${getConsultationCtaLabel(locale)}: ${CONSULTATION_EMAIL}"`,
      );
      expect(html).toContain(`aria-label="${getCopyEmailLabel(locale)}"`);
      expect(html).toContain('role="status"');
      expect(html).toContain('aria-live="polite"');
      expect(html).toContain('aria-atomic="true"');
    },
  );

  it.each(localeExpectations)(
    'announces a localized successful clipboard copy in $locale',
    async ({ locale }) => {
      const writeText = vi.fn(async () => undefined);
      vi.stubGlobal('navigator', { clipboard: { writeText } });

      await expect(copyFooterEmailAndGetNotice(locale)).resolves.toBe(
        getEmailCopiedMessage(locale),
      );
      expect(writeText).toHaveBeenCalledOnce();
      expect(writeText).toHaveBeenCalledWith(CONSULTATION_EMAIL);
    },
  );

  it.each(localeExpectations)(
    'does not expose stale phone or messenger consultation channels in $locale',
    ({ locale }) => {
      const html = renderFooter(locale);

      expect(html).not.toMatch(/href="tel:/i);
      expect(html).not.toMatch(/kakao|카카오|line\.me|lin.ee|라인|ライン/i);
      expect(html).not.toContain('010-2992-9304');
    },
  );
});
