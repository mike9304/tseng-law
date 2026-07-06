'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/locales';
import { siteContent, type SiteContent } from '@/data/site-content';
import FloatingAiChat from '@/components/FloatingAiChat';

const STORAGE_KEY = 'hojeong-ai-chat-collapsed';

export default function QuickContactWidget({
  locale,
  content,
  previewCollapsed = false,
}: {
  locale: Locale;
  content?: SiteContent['quickContact'];
  previewCollapsed?: boolean;
}) {
  const pathname = usePathname();
  const isUtilityPage = Boolean(
    pathname?.includes('/bookings/manage/')
    || pathname?.match(/^\/(?:ko|zh-hant|en)\/(?:login|account)(?:\/|$)/)
    || pathname?.match(/^\/(?:ko|zh-hant|en)\/store\/checkout(?:\/|$)/),
  );
  const hiddenByUtilityPage = isUtilityPage && !previewCollapsed;
  const resolvedContent = content ?? siteContent[locale].quickContact;
  // Start closed to match SSR, then sync with localStorage on mount
  const [chatOpen, setChatOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const restoreToggleOnCloseRef = useRef(false);
  const toggleText =
    locale === 'ko' ? 'AI 상담' : locale === 'zh-hant' ? 'AI 諮詢' : 'AI Chat';

  useEffect(() => {
    if (previewCollapsed) {
      setChatOpen(false);
      setHydrated(true);
      return;
    }
    if (hiddenByUtilityPage) {
      setChatOpen(false);
      setHydrated(true);
      return;
    }
    try {
      const collapsed = window.localStorage.getItem(STORAGE_KEY);
      // A first-time visitor (no stored preference) should never have the
      // chat cover primary page controls on any viewport. Once the visitor
      // opens/closes the widget, honor that stored state.
      if (collapsed == null) {
        setChatOpen(false);
      } else {
        setChatOpen(collapsed !== 'true');
      }
    } catch {
      setChatOpen(false);
    }
    setHydrated(true);
  }, [hiddenByUtilityPage, previewCollapsed]);

  const handleClose = () => {
    restoreToggleOnCloseRef.current = true;
    setChatOpen(false);
    if (!previewCollapsed) {
      try {
        window.localStorage.setItem(STORAGE_KEY, 'true');
      } catch {
        /* ignore */
      }
    }
  };

  const handleOpen = () => {
    restoreToggleOnCloseRef.current = false;
    setChatOpen(true);
    if (!previewCollapsed) {
      try {
        window.localStorage.setItem(STORAGE_KEY, 'false');
      } catch {
        /* ignore */
      }
    }
  };

  useEffect(() => {
    if (chatOpen || !restoreToggleOnCloseRef.current) return undefined;
    restoreToggleOnCloseRef.current = false;
    const frame = window.requestAnimationFrame(() => {
      toggleRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [chatOpen]);

  // Avoid flashing the toggle button before hydration determines state.
  if (!hydrated) {
    return null;
  }

  if (hiddenByUtilityPage) {
    return null;
  }

  return (
    <>
      {!chatOpen && (
        <div className="quick-contact" data-visible="true">
          <button
            ref={toggleRef}
            type="button"
            className="quick-contact-toggle"
            aria-label={`${toggleText} ${resolvedContent.buttonLabel}`}
            aria-expanded={chatOpen}
            aria-pressed={chatOpen}
            onClick={handleOpen}
          >
            {toggleText}
          </button>
        </div>
      )}
      <FloatingAiChat
        locale={locale}
        open={chatOpen}
        onClose={handleClose}
      />
    </>
  );
}
