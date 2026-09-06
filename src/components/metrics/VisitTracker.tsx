'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

import {
  shouldTrackOfficialConsultationMailtoClick,
  toContactIntentPath,
} from '@/lib/metrics/client/contact-intent';
import { createDwellTracker, type DwellFlush } from '@/lib/metrics/client/dwell-tracker';
import type {
  ContactIntentEvent,
  EngagementEvent,
  PageviewEvent,
  VisitEvent,
  VisitUtm,
} from '@/lib/metrics/visit-schema';

const COLLECT_ENDPOINT = '/api/metrics/collect';
const SESSION_STORAGE_KEY = 'tl_vm_sid';
const FALLBACK_ID_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const TRACKED_LOCALES = new Set<PageviewEvent['locale']>(['ko', 'zh-hant', 'en', 'ja']);

let memorySessionId: string | undefined;

type ActiveRuntime = {
  disabled: false;
  sid: string;
  tracker: ReturnType<typeof createDwellTracker>;
  activePath: string | null;
};

type TrackerRuntime = ActiveRuntime | { disabled: true };

function isExcludedPath(path: string): boolean {
  return path.includes('/admin-builder') || path.includes('/admin-consultation');
}

function localeForPath(path: string, fallback: string): PageviewEvent['locale'] {
  const firstSegment = path.split('/')[1];
  return TRACKED_LOCALES.has(firstSegment as PageviewEvent['locale'])
    ? firstSegment as PageviewEvent['locale']
    : fallback as PageviewEvent['locale'];
}

export default function VisitTracker({ locale }: { locale: string }) {
  const pathname = usePathname();
  const runtimeRef = useRef<TrackerRuntime | null>(null);

  useEffect(() => {
    const currentPath = pathname || window.location.pathname || '/';

    const postWithFetch = (event: VisitEvent) => {
      void window.fetch(COLLECT_ENDPOINT, {
        method: 'POST',
        keepalive: true,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ events: [event] }),
      }).catch(() => {});
    };

    const readUtm = (): VisitUtm | undefined => {
      const params = new URLSearchParams(window.location.search);
      const source = params.get('utm_source')?.slice(0, 120);
      const medium = params.get('utm_medium')?.slice(0, 120);
      const campaign = params.get('utm_campaign')?.slice(0, 120);
      const utm = {
        ...(source ? { source } : {}),
        ...(medium ? { medium } : {}),
        ...(campaign ? { campaign } : {}),
      };

      return Object.keys(utm).length > 0 ? utm : undefined;
    };

    const createSessionId = () => {
      if (typeof window.crypto?.randomUUID === 'function') {
        return window.crypto.randomUUID();
      }

      return Array.from(
        { length: 22 },
        () => FALLBACK_ID_ALPHABET[Math.floor(Math.random() * FALLBACK_ID_ALPHABET.length)],
      ).join('');
    };

    const getSessionId = () => {
      try {
        const stored = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (stored) {
          memorySessionId = stored;
          return stored;
        }
      } catch {
        if (memorySessionId) return memorySessionId;
      }

      const sid = memorySessionId ?? createSessionId();
      memorySessionId = sid;
      try {
        window.sessionStorage.setItem(SESSION_STORAGE_KEY, sid);
      } catch {
        // The module-scoped value keeps the session stable when storage is blocked.
      }
      return sid;
    };

    const sendPageview = (runtime: ActiveRuntime, path: string, firstLoad: boolean) => {
      const utm = readUtm();
      const event: PageviewEvent = {
        v: 1,
        sid: runtime.sid,
        ts: new Date().toISOString(),
        type: 'pageview',
        path,
        locale: localeForPath(path, locale),
        ...(firstLoad ? { ref: document.referrer.slice(0, 512) } : {}),
        ...(utm ? { utm } : {}),
        lang: navigator.language.slice(0, 16),
        vw: window.innerWidth,
        firstLoad,
        contactTracking: 1,
      };
      postWithFetch(event);
    };

    const sendContactIntent = (runtime: ActiveRuntime) => {
      const path = toContactIntentPath(runtime.activePath);
      if (!path) return;

      const event: ContactIntentEvent = {
        v: 1,
        sid: runtime.sid,
        ts: new Date().toISOString(),
        type: 'contact_intent',
        action: 'email_compose',
        path,
        locale: localeForPath(path, locale),
      };
      postWithFetch(event);
    };

    const sendEngagement = (runtime: ActiveRuntime, flushed: DwellFlush | null) => {
      if (!flushed || flushed.dwellMs <= 0) return;

      const event: EngagementEvent = {
        v: 1,
        sid: runtime.sid,
        ts: new Date().toISOString(),
        type: 'engagement',
        path: flushed.path,
        dwellMs: flushed.dwellMs,
        ...(flushed.scrollPct === undefined ? {} : { scrollPct: flushed.scrollPct }),
      };
      const body = JSON.stringify({ events: [event] });

      try {
        if (typeof navigator.sendBeacon === 'function' && navigator.sendBeacon(COLLECT_ENDPOINT, body)) {
          return;
        }
      } catch {
        // Fall through to keepalive fetch when Beacon is unavailable or rejected.
      }

      postWithFetch(event);
    };

    if (runtimeRef.current === null) {
      if (
        isExcludedPath(currentPath)
        || navigator.webdriver === true
        || navigator.doNotTrack === '1'
      ) {
        runtimeRef.current = { disabled: true };
        return;
      }

      const tracker = createDwellTracker({});
      tracker.start(currentPath);
      tracker.setVisible(document.visibilityState === 'visible');
      const runtime: ActiveRuntime = {
        disabled: false,
        sid: getSessionId(),
        tracker,
        activePath: currentPath,
      };
      runtimeRef.current = runtime;
      sendPageview(runtime, currentPath, true);
    }

    const runtime = runtimeRef.current;
    if (!runtime || runtime.disabled) return;

    if (runtime.activePath !== currentPath) {
      if (isExcludedPath(currentPath)) {
        sendEngagement(runtime, runtime.tracker.flush());
        runtime.tracker.start(currentPath);
        runtime.tracker.setVisible(false);
        runtime.activePath = null;
      } else {
        const flushed = runtime.activePath === null
          ? null
          : runtime.tracker.switchPath(currentPath);
        if (runtime.activePath === null) runtime.tracker.start(currentPath);
        runtime.tracker.setVisible(document.visibilityState === 'visible');
        runtime.activePath = currentPath;
        sendEngagement(runtime, flushed);
        sendPageview(runtime, currentPath, false);
      }
    }

    let scrollTimer: number | null = null;
    const handleVisibilityChange = () => {
      runtime.tracker.setVisible(
        runtime.activePath !== null && document.visibilityState === 'visible',
      );
    };
    const handleScroll = () => {
      if (runtime.activePath === null || scrollTimer !== null) return;

      scrollTimer = window.setTimeout(() => {
        scrollTimer = null;
        if (runtime.activePath === null) return;

        const scrollHeight = Math.max(
          document.documentElement.scrollHeight,
          document.body?.scrollHeight ?? 0,
        );
        const scrollRange = Math.max(0, scrollHeight - window.innerHeight);
        const scrollPct = scrollRange === 0
          ? 100
          : Math.round((window.scrollY / scrollRange) * 100);
        runtime.tracker.noteScrollPct(scrollPct);
      }, 200);
    };
    const handlePageHide = () => {
      if (runtime.activePath !== null) {
        sendEngagement(runtime, runtime.tracker.flush());
      }
    };
    const handleDocumentClick = (event: MouseEvent) => {
      if (runtime.activePath === null) return;
      if (!shouldTrackOfficialConsultationMailtoClick(event.target)) return;
      sendContactIntent(runtime);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pagehide', handlePageHide);
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pagehide', handlePageHide);
      document.removeEventListener('click', handleDocumentClick);
      if (scrollTimer !== null) window.clearTimeout(scrollTimer);
    };
  }, [locale, pathname]);

  return null;
}
