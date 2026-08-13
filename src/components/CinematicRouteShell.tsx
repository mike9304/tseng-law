'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import type { SiteLocale } from '@/lib/locales';
import CinematicOpening from '@/components/CinematicOpening';

export const CINEMATIC_CHROME_ATTRIBUTE = 'data-cinematic-chrome';

export function isCinematicHomepagePath(
  pathname: string | null,
  locale: SiteLocale,
): boolean {
  if (!pathname) return false;
  const localeRoot = `/${locale}`;
  return pathname === localeRoot || pathname === `${localeRoot}/`;
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
  locale: SiteLocale;
  header: ReactNode;
  footer: ReactNode;
  quickContact?: ReactNode;
  scrollTop: ReactNode;
  eventPopup?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const showCinematicOpening = isCinematicHomepagePath(pathname, locale);

  return (
    <div
      className="site"
      data-locale={locale}
      data-theme="parity"
      data-cinematic-home={showCinematicOpening ? 'true' : undefined}
      data-cinematic-intro-visible={showCinematicOpening ? 'true' : undefined}
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
            aria-hidden="true"
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
