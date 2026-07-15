'use client';

import {
  type MouseEvent as ReactMouseEvent,
} from 'react';
import QuickContactWidget from '@/components/QuickContactWidget';
import ScrollTopButton from '@/components/ScrollTopButton';
import type { Locale } from '@/lib/locales';
import styles from './SandboxPage.module.css';

export type PublicChromeCopy = {
  readonly label: string;
};

type SandboxPublicChromePreviewProps = {
  readonly locale: Locale;
  readonly activeDrawer: boolean;
  readonly copy: PublicChromeCopy;
  readonly onFooterLinkActivation: (event: {
    target: EventTarget | null;
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => void;
};

export default function SandboxPublicChromePreview({
  locale,
  activeDrawer,
  copy,
  onFooterLinkActivation,
}: SandboxPublicChromePreviewProps) {
  const handlePublicChromeClickCapture = (event: ReactMouseEvent<HTMLElement>) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const footerLink = Array.from(globalThis.document.elementsFromPoint(event.clientX, event.clientY))
      .reduce<HTMLAnchorElement | null>((foundLink, node) => {
        if (foundLink || !(node instanceof HTMLElement)) return foundLink;
        if (node.closest('[data-builder-public-chrome="true"]')) return foundLink;
        return node.closest<HTMLAnchorElement>('footer a[href]');
      }, null);

    if (target.closest('[data-builder-public-chrome-control="true"], .scroll-top')) return;

    if (!footerLink) {
      if (target.closest('.quick-contact, .floating-ai-chat')) return;
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    onFooterLinkActivation({
      target: footerLink,
      preventDefault: () => undefined,
      stopPropagation: () => undefined,
    });
  };

  return (
    <div
      className={styles.publicChromePreview}
      data-builder-mobile-drawer-open={activeDrawer ? 'true' : undefined}
      data-builder-public-chrome="true"
      aria-label={copy.label}
      onClickCapture={handlePublicChromeClickCapture}
      onClick={(event) => event.stopPropagation()}
    >
      <QuickContactWidget locale={locale} previewCollapsed />
      <ScrollTopButton locale={locale} />
    </div>
  );
}
