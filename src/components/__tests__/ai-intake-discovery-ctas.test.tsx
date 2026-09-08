import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ContactBlocks from '@/components/ContactBlocks';
import HomeContactCta from '@/components/HomeContactCta';
import IntentLandingPage from '@/components/IntentLandingPage';
import BuilderContactSectionSurface from '@/components/builder/BuilderContactSectionSurface';
import { ContactLegacyPageBody } from '@/app/[locale]/(legacy)/legacy-page-bodies';
import KoreanLawyerInTaiwanPage from '@/app/[locale]/korean-lawyer-in-taiwan/page';
import { primaryAttorneySlug } from '@/data/attorney-profiles';
import { intentPageSlugs } from '@/data/intent-pages';
import {
  AI_INTAKE_DISCOVERY_ENV,
  getAiIntakeDiscovery,
} from '@/lib/ai-intake/discovery';
import type { BuilderSectionNode } from '@/lib/builder/types';
import {
  CONSULTATION_EMAIL,
  getConsultationPublicMailto,
  getCopyEmailLabel,
  getOfficialConsultationEmailLabel,
  getSensitiveInformationWarning,
} from '@/lib/consultation/public-contact';
import {
  isOfficialConsultationMailtoHref,
  shouldTrackOfficialConsultationMailtoClick,
} from '@/lib/metrics/client/contact-intent';
import { locales, siteLocales, type SiteLocale } from '@/lib/locales';

const FLAG_MODES = [
  { label: 'default/unset', value: undefined, enabled: true },
  { label: 'true', value: 'true', enabled: true },
  { label: 'false', value: 'false', enabled: false },
] as const;

const genericIntentCases = siteLocales.flatMap((locale) =>
  intentPageSlugs.map((slug) => [locale, slug] as const),
);

const UNRELATED_CONVERSION_PATHS = [
  'src/components/Header.tsx',
  'src/components/Footer.tsx',
  'src/app/[locale]/services/[slug]/page.tsx',
  'src/app/[locale]/columns/[slug]/page.tsx',
] as const;

const builderContactHeader = {
  label: 'Contact',
  title: 'Contact',
  description: 'Contact',
};

function escapedMailto(locale: SiteLocale): string {
  return getConsultationPublicMailto(locale).replace(/&/g, '&amp;');
}

function countNeedle(haystack: string, needle: string): number {
  return needle ? haystack.split(needle).length - 1 : 0;
}

function allAnchorTags(html: string): string[] {
  const tags: string[] = [];
  let from = 0;
  while (from < html.length) {
    const start = html.indexOf('<a', from);
    if (start === -1) {
      break;
    }
    const nextChar = html[start + 2];
    if (nextChar !== ' ' && nextChar !== '>' && nextChar !== '\n') {
      from = start + 2;
      continue;
    }
    const end = html.indexOf('>', start);
    if (end === -1) {
      break;
    }
    tags.push(html.slice(start, end + 1));
    from = end + 1;
  }
  return tags;
}

function attr(tag: string, name: string): string | null {
  const key = `${name}="`;
  const start = tag.indexOf(key);
  if (start === -1) {
    return null;
  }
  const from = start + key.length;
  const end = tag.indexOf('"', from);
  return end === -1 ? null : tag.slice(from, end);
}

function ctaAnchor(
  html: string,
  ctaId: 'home-ai-intake-entry' | 'contact-ai-intake-entry' | 'intent-ai-intake-entry',
): string | undefined {
  return allAnchorTags(html).find((candidate) => candidate.includes(`data-cta="${ctaId}"`));
}

function expectOriginalMailtosUntagged(html: string): void {
  for (const tag of allAnchorTags(html)) {
    const href = attr(tag, 'href');
    if (href && href.toLowerCase().startsWith('mailto:')) {
      expect(tag).not.toContain('data-cta');
    }
  }
}

function expectAiEntry(
  html: string,
  locale: SiteLocale,
  ctaId: 'home-ai-intake-entry' | 'contact-ai-intake-entry' | 'intent-ai-intake-entry',
): void {
  const discovery = getAiIntakeDiscovery(locale);
  const tag = ctaAnchor(html, ctaId);
  const href = tag ? attr(tag, 'href') : null;

  expect(discovery.enabled).toBe(true);
  expect(tag).toBeDefined();
  expect(href).toBe(discovery.href);
  expect(tag).toContain('data-cta-dest="ai-intake"');
  expect(href?.includes('?')).toBe(false);
  expect(href?.includes('#')).toBe(false);
  expect(tag).not.toContain('target=');
  expect(tag).not.toContain('rel="nofollow"');
  expect(html).toContain(discovery.label);
  expect(html).toContain(discovery.supportingCopy);
  expect(html).toContain(`href="${escapedMailto(locale)}"`);
  expectOriginalMailtosUntagged(html);
}

function expectGuideAbsent(html: string, locale: SiteLocale): void {
  const discovery = getAiIntakeDiscovery(locale);
  expect(discovery.enabled).toBe(false);
  expect(html).not.toContain(`href="${discovery.href}"`);
  expect(html).not.toContain('data-cta-dest="ai-intake"');
  expect(html).not.toContain('home-ai-intake-entry');
  expect(html).not.toContain('contact-ai-intake-entry');
  expect(html).not.toContain('intent-ai-intake-entry');
  expect(html).not.toContain(discovery.supportingCopy);
  expect(html).toContain(`href="${escapedMailto(locale)}"`);
  expectOriginalMailtosUntagged(html);
}

function emailAiGridStyleIndex(html: string): number {
  const compact = html.indexOf('margin-bottom:1.5rem');
  if (compact !== -1) {
    return compact;
  }
  return html.indexOf('margin-bottom: 1.5rem');
}

function hasOriginalEmailAiGrid(html: string): boolean {
  return emailAiGridStyleIndex(html) !== -1;
}

function originalEmailAiGrid(html: string): string {
  const styleIdx = emailAiGridStyleIndex(html);
  if (styleIdx === -1) {
    return '';
  }
  const divStart = html.lastIndexOf('<div', styleIdx);
  const noteIdx = html.indexOf('<p class="section-lede" role="note"', styleIdx);
  if (divStart === -1) {
    return '';
  }
  return html.slice(divStart, noteIdx === -1 ? html.length : noteIdx);
}

function bottomIntentCta(html: string): string {
  const start = [...html.matchAll(/<div\b[^>]*>/g)].find((match) =>
    attr(match[0], 'class')?.split(/\s+/).includes('intent-cta-card'),
  )?.index;
  if (start === undefined) throw new Error('Expected the bottom intent CTA card.');
  return html.slice(start);
}

function jsonLdRawBlocks(html: string): string[] {
  const blocks: string[] = [];
  const startToken = 'type="application/ld+json"';
  let from = 0;
  while (from < html.length) {
    const typeIdx = html.indexOf(startToken, from);
    if (typeIdx === -1) {
      break;
    }
    const openEnd = html.indexOf('>', typeIdx);
    const close = html.indexOf('</script>', openEnd);
    if (openEnd === -1 || close === -1) {
      break;
    }
    blocks.push(html.slice(openEnd + 1, close).trim());
    from = close + 9;
  }
  return blocks;
}

function parseJsonLd(html: string): unknown[] {
  const blocks = jsonLdRawBlocks(html);
  expect(blocks.length).toBeGreaterThan(0);
  return blocks.map((block) => {
    try {
      return JSON.parse(block);
    } catch {
      return JSON.parse(
        block
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>'),
      );
    }
  });
}

function expectJsonLdInvariant(enabledHtml: string, disabledHtml: string): void {
  const enabled = parseJsonLd(enabledHtml);
  const disabled = parseJsonLd(disabledHtml);
  expect(enabled.length).toBeGreaterThan(0);
  expect(disabled.length).toBeGreaterThan(0);
  expect(enabled).toEqual(disabled);
}

type StatusParagraph = {
  open: string;
  inner: string;
};

const STATUS_TAGS = ['div', 'p'] as const;

function isTagNameBoundary(character: string | undefined): boolean {
  return (
    character === undefined
    || character === ' '
    || character === '\n'
    || character === '\t'
    || character === '\r'
    || character === '/'
    || character === '>'
  );
}

function tagNameAt(html: string, start: number): string | null {
  if (html[start] !== '<') {
    return null;
  }
  let index = start + 1;
  if (html[index] === '/') {
    return null;
  }
  let name = '';
  while (index < html.length) {
    const character = html[index];
    if (
      (character >= 'a' && character <= 'z')
      || (character >= 'A' && character <= 'Z')
    ) {
      name += character.toLowerCase();
      index += 1;
      continue;
    }
    break;
  }
  return name || null;
}

function indexOfOpenTag(html: string, tagName: string, from: number): number {
  const token = `<${tagName}`;
  let index = from;
  while (index < html.length) {
    const start = html.indexOf(token, index);
    if (start === -1) {
      return -1;
    }
    if (isTagNameBoundary(html[start + token.length])) {
      return start;
    }
    index = start + token.length;
  }
  return -1;
}

function findMatchingClose(html: string, openStart: number, tagName: string): number {
  const openEnd = html.indexOf('>', openStart);
  if (openEnd === -1) {
    return -1;
  }
  const closeToken = `</${tagName}>`;
  let depth = 1;
  let index = openEnd + 1;
  while (index < html.length && depth > 0) {
    const nextOpen = indexOfOpenTag(html, tagName, index);
    const nextClose = html.indexOf(closeToken, index);
    if (nextClose === -1) {
      return -1;
    }
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth += 1;
      index = nextOpen + 1;
      continue;
    }
    depth -= 1;
    if (depth === 0) {
      return nextClose;
    }
    index = nextClose + closeToken.length;
  }
  return -1;
}

function statusParagraphs(html: string): StatusParagraph[] {
  const paragraphs: StatusParagraph[] = [];
  let from = 0;
  while (from < html.length) {
    const roleIdx = html.indexOf('role="status"', from);
    if (roleIdx === -1) {
      break;
    }
    const tagStart = html.lastIndexOf('<', roleIdx);
    const tag = tagNameAt(html, tagStart);
    const openEnd = tagStart === -1 ? -1 : html.indexOf('>', tagStart);
    if (
      tagStart === -1
      || !tag
      || !(STATUS_TAGS as readonly string[]).includes(tag)
      || openEnd === -1
      || openEnd < roleIdx
    ) {
      from = roleIdx + 13;
      continue;
    }
    const closeStart = findMatchingClose(html, tagStart, tag);
    if (closeStart === -1) {
      from = roleIdx + 13;
      continue;
    }
    paragraphs.push({
      open: html.slice(tagStart, openEnd + 1),
      inner: html.slice(openEnd + 1, closeStart).trim(),
    });
    from = closeStart + tag.length + 3;
  }
  return paragraphs;
}

function isEmptyPoliteLiveStatus(paragraph: StatusParagraph | undefined): boolean {
  if (!paragraph) {
    return false;
  }
  return (
    paragraph.inner === '' &&
    paragraph.open.includes('role="status"') &&
    paragraph.open.includes('aria-live="polite"') &&
    paragraph.open.includes('aria-atomic="true"')
  );
}

function hasEmptyLiveStatus(html: string): boolean {
  return isEmptyPoliteLiveStatus(statusParagraphs(html)[0]);
}

function emailCopyStatusParagraph(html: string): StatusParagraph | undefined {
  return statusParagraphs(html).find((paragraph) =>
    paragraph.open.includes('contact-email-actions__status'),
  );
}

function inquiryFormStatusParagraph(html: string): StatusParagraph | undefined {
  return statusParagraphs(html).find((paragraph) =>
    paragraph.open.includes('tabindex="-1"'),
  );
}

function expectEmailCopyAndInquiryFormStatuses(html: string): void {
  const emailStatus = emailCopyStatusParagraph(html);
  const formStatus = inquiryFormStatusParagraph(html);

  expect(countNeedle(html, 'role="status"')).toBe(2);
  expect(countNeedle(html, 'contact-email-actions__status')).toBe(1);
  expect(emailStatus).toBeDefined();
  expect(formStatus).toBeDefined();
  expect(emailStatus).not.toEqual(formStatus);
  expect(isEmptyPoliteLiveStatus(emailStatus)).toBe(true);
  expect(isEmptyPoliteLiveStatus(formStatus)).toBe(true);
}

function builderSection(sectionKey: 'contact.hero' | 'contact.contact-blocks'): BuilderSectionNode {
  return {
    id: sectionKey,
    type: 'section',
    name: sectionKey,
    sectionKey,
  };
}

function renderBuilderContactSurfaces(locale: (typeof locales)[number]): string {
  return (
    renderToStaticMarkup(
      <BuilderContactSectionSurface
        locale={locale}
        section={builderSection('contact.hero')}
        header={builderContactHeader}
      />,
    ) +
    renderToStaticMarkup(
      <BuilderContactSectionSurface
        locale={locale}
        section={builderSection('contact.contact-blocks')}
        header={builderContactHeader}
      />,
    )
  );
}

function elementLikeAnchor(href: string) {
  return {
    tagName: 'A',
    getAttribute: (name: string) => (name === 'href' ? href : null),
    parentElement: null,
  };
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('AI-intake discovery CTAs', () => {
  it.each(siteLocales)('applies the unset/true/false flag matrix on all four surfaces for %s', async (locale) => {
    for (const mode of FLAG_MODES) {
      vi.stubEnv(AI_INTAKE_DISCOVERY_ENV, mode.value);

      const home = renderToStaticMarkup(<HomeContactCta locale={locale} />);
      const contact = renderToStaticMarkup(<ContactBlocks locale={locale} />);
      const intent = renderToStaticMarkup(<IntentLandingPage locale={locale} slug="taiwan-lawyer" />);
      const special = renderToStaticMarkup(
        await KoreanLawyerInTaiwanPage({ params: Promise.resolve({ locale }) }),
      );

      expect(countNeedle(home, `href="${escapedMailto(locale)}"`)).toBe(2);

      if (mode.enabled) {
        const discovery = getAiIntakeDiscovery(locale);
        expectAiEntry(home, locale, 'home-ai-intake-entry');
        expect(home.indexOf('home-contact-actions')).toBeLessThan(home.indexOf(discovery.supportingCopy));
        expectAiEntry(contact, locale, 'contact-ai-intake-entry');
        expectAiEntry(intent, locale, 'intent-ai-intake-entry');
        expectAiEntry(special, locale, 'intent-ai-intake-entry');

        const cta = bottomIntentCta(intent);
        const guideIdx = cta.indexOf('data-cta="intent-ai-intake-entry"');
        expect(cta.indexOf(`href="${escapedMailto(locale)}"`)).toBeLessThan(guideIdx);
        expect(guideIdx).toBeLessThan(cta.indexOf(`href="/${locale}/pricing"`));
        expect(cta.indexOf(`href="/${locale}/pricing"`)).toBeLessThan(
          cta.indexOf(`href="/${locale}/lawyers/${primaryAttorneySlug}"`),
        );
        expect(special).toContain(`: ${CONSULTATION_EMAIL}`);
      } else {
        expectGuideAbsent(home, locale);
        expectGuideAbsent(contact, locale);
        expectGuideAbsent(intent, locale);
        expectGuideAbsent(special, locale);
        expect(bottomIntentCta(intent)).toContain(`href="/${locale}/pricing"`);
        expect(bottomIntentCta(intent)).toContain(`href="/${locale}/lawyers/${primaryAttorneySlug}"`);
        expect(special).toContain(`: ${CONSULTATION_EMAIL}`);
      }
    }
  });

  it.each(genericIntentCases)(
    'keeps generic /%s/%s guide, mailto, pricing, profile, and JSON-LD under the flag',
    (locale, slug) => {
      const htmlByFlag: { enabled: boolean; html: string }[] = [];

      for (const mode of FLAG_MODES) {
        vi.stubEnv(AI_INTAKE_DISCOVERY_ENV, mode.value);
        const html = renderToStaticMarkup(<IntentLandingPage locale={locale} slug={slug} />);
        htmlByFlag.push({ enabled: mode.enabled, html });

        const cta = bottomIntentCta(html);
        expect(cta).toContain(`href="${escapedMailto(locale)}"`);
        expect(cta).toContain(`href="/${locale}/pricing"`);
        expect(cta).toContain(`href="/${locale}/lawyers/${primaryAttorneySlug}"`);

        if (mode.enabled) {
          expectAiEntry(html, locale, 'intent-ai-intake-entry');
          const guideIdx = cta.indexOf('data-cta="intent-ai-intake-entry"');
          expect(cta.indexOf(`href="${escapedMailto(locale)}"`)).toBeLessThan(guideIdx);
          expect(guideIdx).toBeLessThan(cta.indexOf(`href="/${locale}/pricing"`));
          expect(cta.indexOf(`href="/${locale}/pricing"`)).toBeLessThan(
            cta.indexOf(`href="/${locale}/lawyers/${primaryAttorneySlug}"`),
          );
        } else {
          expectGuideAbsent(html, locale);
        }
      }

      const enabledHtmls = htmlByFlag.filter((entry) => entry.enabled).map((entry) => entry.html);
      const disabledHtml = htmlByFlag.find((entry) => !entry.enabled)?.html;
      expect(enabledHtmls.length).toBeGreaterThan(1);
      expect(disabledHtml).toBeDefined();
      expect(parseJsonLd(enabledHtmls[0])).toEqual(parseJsonLd(enabledHtmls[1]));
      expectJsonLdInvariant(enabledHtmls[0], disabledHtml as string);
    },
  );

  it.each(siteLocales)('keeps the special %s korean-lawyer page guide/JSON-LD contract', async (locale) => {
    const htmlByFlag: { enabled: boolean; html: string }[] = [];

    for (const mode of FLAG_MODES) {
      vi.stubEnv(AI_INTAKE_DISCOVERY_ENV, mode.value);
      const html = renderToStaticMarkup(
        await KoreanLawyerInTaiwanPage({ params: Promise.resolve({ locale }) }),
      );
      htmlByFlag.push({ enabled: mode.enabled, html });
      expect(html).toContain(`href="${escapedMailto(locale)}"`);
      expect(html).toContain(`: ${CONSULTATION_EMAIL}`);

      if (mode.enabled) {
        expectAiEntry(html, locale, 'intent-ai-intake-entry');
      } else {
        expectGuideAbsent(html, locale);
      }
    }

    const enabledHtmls = htmlByFlag.filter((entry) => entry.enabled).map((entry) => entry.html);
    const disabledHtml = htmlByFlag.find((entry) => !entry.enabled)?.html;
    expect(enabledHtmls.length).toBeGreaterThan(1);
    expect(disabledHtml).toBeDefined();
    expect(parseJsonLd(enabledHtmls[0])).toEqual(parseJsonLd(enabledHtmls[1]));
    expectJsonLdInvariant(enabledHtmls[0], disabledHtml as string);
  });

  it.each(siteLocales)('keeps ContactBlocks email/AI grid independent of showEmailActions for %s', (locale) => {
    const officialLabel = getOfficialConsultationEmailLabel(locale);
    const copyLabel = getCopyEmailLabel(locale);
    const warning = getSensitiveInformationWarning(locale);

    for (const mode of FLAG_MODES) {
      vi.stubEnv(AI_INTAKE_DISCOVERY_ENV, mode.value);

      for (const showEmailActions of [true, false]) {
        const html = renderToStaticMarkup(
          <ContactBlocks locale={locale} showEmailActions={showEmailActions} />,
        );
        const grid = originalEmailAiGrid(html);
        const gridExpected = showEmailActions || mode.enabled;

        expect(hasOriginalEmailAiGrid(html)).toBe(gridExpected);
        expect(grid.length > 0).toBe(gridExpected);
        expect(html).toContain(warning);
        expect(html).toContain('role="note"');
        expect(html).toContain('data-builder-surface-key="cta-link"');
        expect(html).toContain(`href="${escapedMailto(locale)}"`);
        expect(countNeedle(html, 'grid-bento contact-grid')).toBe(gridExpected ? 3 : 2);

        if (showEmailActions) {
          expect(countNeedle(html, officialLabel)).toBe(1);
          expect(countNeedle(html, copyLabel)).toBe(2);
          expect(countNeedle(html, 'role="status"')).toBe(1);
          expect(hasEmptyLiveStatus(grid)).toBe(true);
        } else {
          expect(html).not.toContain(officialLabel);
          expect(html).not.toContain(copyLabel);
          expect(html).not.toContain('role="status"');
        }

        if (mode.enabled) {
          expectAiEntry(html, locale, 'contact-ai-intake-entry');
          expect(grid).toContain('data-cta="contact-ai-intake-entry"');
        } else {
          expect(html).not.toContain('data-cta="contact-ai-intake-entry"');
          expect(html).not.toContain(`href="${getAiIntakeDiscovery(locale).href}"`);
        }
      }
    }
  });

  it.each(siteLocales)('renders ContactLegacyPageBody with a single top email/copy and optional guide for %s', (locale) => {
    const officialLabel = getOfficialConsultationEmailLabel(locale);
    const copyLabel = getCopyEmailLabel(locale);

    for (const mode of FLAG_MODES) {
      vi.stubEnv(AI_INTAKE_DISCOVERY_ENV, mode.value);
      const html = renderToStaticMarkup(<ContactLegacyPageBody locale={locale} />);

      expect(countNeedle(html, `<p class="contact-email-actions__label">${officialLabel}</p>`)).toBe(1);
      expect(countNeedle(html, 'class="contact-email-actions"')).toBe(1);
      expect(originalEmailAiGrid(html)).not.toContain(officialLabel);
      expect(countNeedle(html, copyLabel)).toBe(2);
      expectEmailCopyAndInquiryFormStatuses(html);
      expect(html).toContain(getSensitiveInformationWarning(locale));
      expect(html).toContain('data-builder-surface-key="cta-link"');
      expect(html).toContain(`href="${escapedMailto(locale)}"`);

      if (mode.enabled) {
        expectAiEntry(html, locale, 'contact-ai-intake-entry');
        expect(html.indexOf(officialLabel)).toBeLessThan(html.indexOf('data-cta="contact-ai-intake-entry"'));
      } else {
        expectGuideAbsent(html, locale);
        expect(hasOriginalEmailAiGrid(html)).toBe(false);
      }
    }
  });

  it.each(locales)('renders builder contact.hero + contact.contact-blocks for %s without duplicating email/copy', (locale) => {
    const officialLabel = getOfficialConsultationEmailLabel(locale);
    const copyLabel = getCopyEmailLabel(locale);

    for (const mode of FLAG_MODES) {
      vi.stubEnv(AI_INTAKE_DISCOVERY_ENV, mode.value);
      const html = renderBuilderContactSurfaces(locale);

      expect(countNeedle(html, officialLabel)).toBe(1);
      expect(countNeedle(html, copyLabel)).toBe(2);
      expectEmailCopyAndInquiryFormStatuses(html);
      expect(html).toContain(`href="${escapedMailto(locale)}"`);

      if (mode.enabled) {
        expectAiEntry(html, locale, 'contact-ai-intake-entry');
        expect(html.indexOf(officialLabel)).toBeLessThan(html.indexOf('data-cta="contact-ai-intake-entry"'));
      } else {
        expectGuideAbsent(html, locale);
        expect(hasOriginalEmailAiGrid(html)).toBe(false);
      }
    }
  });

  it('exposes initial empty copy status attributes on ContactBlocks SSR without claiming clipboard behavior', () => {
    vi.stubEnv(AI_INTAKE_DISCOVERY_ENV, 'true');
    const html = renderToStaticMarkup(<ContactBlocks locale="en" showEmailActions={true} />);
    expect(hasEmptyLiveStatus(originalEmailAiGrid(html))).toBe(true);
    expect(html).not.toContain('Email address copied.');
    expect(html).not.toContain('Copy failed.');
  });

  it.each(siteLocales)('does not treat the AI-intake guide href as official consultation mailto tracking for %s', (locale) => {
    const discovery = getAiIntakeDiscovery(locale);
    const mailto = getConsultationPublicMailto(locale);
    const guide = elementLikeAnchor(discovery.href);
    const guideChild = { tagName: 'SPAN', getAttribute: () => null, parentElement: guide };
    const mail = elementLikeAnchor(mailto);
    const mailChild = { tagName: 'SPAN', getAttribute: () => null, parentElement: mail };

    expect(discovery.href.startsWith('mailto:')).toBe(false);
    expect(isOfficialConsultationMailtoHref(discovery.href)).toBe(false);
    expect(shouldTrackOfficialConsultationMailtoClick(guide)).toBe(false);
    expect(shouldTrackOfficialConsultationMailtoClick(guideChild)).toBe(false);
    expect(isOfficialConsultationMailtoHref(mailto)).toBe(true);
    expect(shouldTrackOfficialConsultationMailtoClick(mail)).toBe(true);
    expect(shouldTrackOfficialConsultationMailtoClick(mailChild)).toBe(true);
  });

  it('keeps ContactBlocks copy-email success/failure wiring in source (not a runtime clipboard proof)', () => {
    const source = readFileSync(path.join(process.cwd(), 'src/components/ContactBlocks.tsx'), 'utf8');
    expect(source).toContain('async function handleCopyEmail()');
    expect(source).toContain('const copied = await copyEmailAddress(CONSULTATION_EMAIL)');
    expect(source).toContain('copied ? getEmailCopiedMessage(locale) : getCopyEmailFailureMessage(locale)');
    expect(source).toContain('} catch {');
    expect(source).toContain('setCopyNotice(getCopyEmailFailureMessage(locale));');
  });

  it('does not add the discovery path to frozen unrelated conversion surfaces (static source literal check, not sitewide runtime proof)', () => {
    for (const relativePath of UNRELATED_CONVERSION_PATHS) {
      expect(readFileSync(path.join(process.cwd(), relativePath), 'utf8')).not.toContain('/ai-intake');
    }
  });
});
