'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/locales';
import { siteContent, type SiteContent } from '@/data/site-content';
import FloatingAiChat from '@/components/FloatingAiChat';

const STORAGE_KEY = 'hojeong-ai-chat-collapsed';

export default function QuickContactWidget({
  locale,
  content,
}: {
  locale: Locale;
  content?: SiteContent['quickContact'];
}) {
  const pathname = usePathname();
  const isUtilityPage = pathname?.includes('/bookings/manage/') ?? false;
  const resolvedContent = content ?? siteContent[locale].quickContact;
  // Start closed to match SSR, then sync with localStorage on mount
  const [chatOpen, setChatOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const toggleText =
    locale === 'ko' ? 'AI 상담' : locale === 'zh-hant' ? 'AI 諮詢' : 'AI Chat';

  useEffect(() => {
    if (isUtilityPage) {
      setChatOpen(false);
      setHydrated(true);
      return;
    }
    try {
      const collapsed = window.localStorage.getItem(STORAGE_KEY);
      // First visit (no key) → open by default. Otherwise honor stored state.
      setChatOpen(collapsed !== 'true');
    } catch {
      setChatOpen(true);
    }
    setHydrated(true);
  }, [isUtilityPage]);

  const handleClose = () => {
    setChatOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      /* ignore */
    }
  };

  const handleOpen = () => {
    setChatOpen(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, 'false');
    } catch {
      /* ignore */
    }
  };

  // Avoid flashing the toggle button before hydration determines state.
  if (!hydrated) {
    return null;
  }

  if (isUtilityPage) {
    return null;
  }

  return (
    <>
      {!chatOpen && (
        <div className="quick-contact" data-visible="true">
          <button
            type="button"
            className="quick-contact-toggle"
            aria-label={resolvedContent.buttonLabel}
            aria-expanded={chatOpen}
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
