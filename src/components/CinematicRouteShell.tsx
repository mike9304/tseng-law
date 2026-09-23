'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import {
  PUBLIC_GUIDANCE_INTERNAL_PAGE_SEGMENT,
  PUBLIC_GUIDANCE_INTERNAL_UNAVAILABLE_SEGMENT,
  type PublicLocale8,
} from '@/lib/public-guidance';
import CinematicOpening from '@/components/CinematicOpening';

export const CINEMATIC_CHROME_ATTRIBUTE = 'data-cinematic-chrome';

export function isCinematicHomepagePath(
  pathname: string | null,
  locale: PublicLocale8,
): boolean {
  if (!pathname) return false;
  const localeRoot = `/${locale}`;
  return pathname === localeRoot || pathname === `${localeRoot}/`;
}

/** The guidance rewrite is only the render path. Map it back to the public
 * URL so the server opening matches the browser path. */
export function visibleCinematicPathname(pathname: string | null): string | null {
  if (!pathname) return pathname;
  for (const segment of [PUBLIC_GUIDANCE_INTERNAL_PAGE_SEGMENT, PUBLIC_GUIDANCE_INTERNAL_UNAVAILABLE_SEGMENT]) {
    const token = `/${segment}`;
    const index = pathname.indexOf(token);
    if (index < 0) continue;
    const locale = pathname.slice(0, index);
    const rest = pathname.slice(index + token.length);
    return `${locale}${rest}` || locale;
  }
  return pathname;
}

export default function CinematicRouteShell({
  locale,
  header,
  footer,
  quickContact,
  scrollTop,
  eventPopup,
  children,
}: {
  locale: PublicLocale8;
  header: ReactNode;
  footer: ReactNode;
  quickContact?: ReactNode;
  scrollTop: ReactNode;
  eventPopup?: ReactNode;
  children: ReactNode;
}) {
  const pathname = visibleCinematicPathname(usePathname());
  // WO-O22 B: CINEMATIC_OPENING_COPY now covers all eight public languages, so
  // vi/id/th/fil play the same opening as ko/zh-hant/en/ja instead of dropping
  // straight onto the hero.
  const showCinematicOpening = isCinematicHomepagePath(pathname, locale);

  return (
    <div
      className="site"
      data-locale={locale}
      data-theme="parity"
      data-cinematic-home={showCinematicOpening ? 'true' : undefined}
      data-cinematic-intro-visible={showCinematicOpening ? 'true' : undefined}
      // WI-11: the opening's inline pre-hydration script flips this attribute
      // to "false" for returning visitors before React hydrates; the value is
      // owned by the DOM (CinematicOpening writes it via dataset), so a
      // server/client difference here is expected, never patched.
      suppressHydrationWarning
    >
      <div data-legacy-chrome data-cinematic-chrome="header">
        {header}
      </div>
      {showCinematicOpening ? (
        <>
          <noscript>
            <style>{`
              .site[data-cinematic-home='true']
                :is(
                  [data-cinematic-chrome],
                  [data-builder-global-section='header'],
                  .builder-site-header,
                  .builder-mobile-bottom-bar,
                  .builder-mobile-bottom-bar-spacer
                ),
              .site[data-cinematic-home='true'] .year-end-popup-backdrop,
              .site[data-cinematic-home='true'] .year-end-popup-minimized {
                visibility: visible !important;
                opacity: 1 !important;
                pointer-events: auto !important;
              }
              .site[data-cinematic-home='true']
                > :is(main, [data-legacy-chrome]) {
                content-visibility: visible !important;
              }
            `}</style>
          </noscript>
          <CinematicOpening locale={locale} deferredContent={eventPopup} />
        </>
      ) : null}
      <main id="main">
        {showCinematicOpening ? (
          <div
            id="cinematic-home-content"
            className="cinematic-opening__target"
            tabIndex={-1}
          />
        ) : null}
        {children}
      </main>
      <div data-legacy-chrome>{footer}</div>
      {quickContact ? (
        <div data-legacy-chrome data-cinematic-chrome="quick-contact">
          {quickContact}
        </div>
      ) : null}
      <div data-legacy-chrome data-cinematic-chrome="scroll-top">
        {scrollTop}
      </div>
      {!showCinematicOpening ? eventPopup : null}
    </div>
  );
}
