import { describe, expect, it } from 'vitest';
import { resolveSandboxPreviewUrl } from '../SandboxModalsRoot.helpers';

describe('resolveSandboxPreviewUrl', () => {
  it('uses builder draft-preview routes for standard builder pages', () => {
    expect(resolveSandboxPreviewUrl({
      activePageId: 'home-page',
      currentSlug: '',
      locale: 'ko',
      sitePages: [{ pageId: 'home-page', slug: '', isHomePage: true }],
    })).toBe('/ko/builder/home?mode=preview');

    expect(resolveSandboxPreviewUrl({
      activePageId: 'about-page',
      currentSlug: 'about',
      locale: 'ko',
      sitePages: [{ pageId: 'about-page', slug: 'about' }],
    })).toBe('/ko/builder/about?mode=preview');

    expect(resolveSandboxPreviewUrl({
      activePageId: 'contact-page',
      currentSlug: 'contact',
      locale: 'zh-hant',
      sitePages: [{ pageId: 'contact-page', slug: 'contact' }],
    })).toBe('/zh-hant/builder/contact?mode=preview');
  });

  it('keeps public preview fallback for custom site pages', () => {
    expect(resolveSandboxPreviewUrl({
      activePageId: 'custom-page',
      currentSlug: 'custom-landing',
      locale: 'ko',
      sitePages: [{ pageId: 'custom-page', slug: 'custom-landing' }],
    })).toBe('/ko/custom-landing');
  });
});
