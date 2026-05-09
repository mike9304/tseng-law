import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,
    tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
    replaysSessionSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_REPLAY_SAMPLE_RATE ?? 0.05),
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    beforeSend(event) {
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
      if (pathname.includes('/admin-builder') || pathname === '/' || /^\/(?:ko|zh-hant|en)(?:\/|$)/.test(pathname)) {
        event.tags = { ...event.tags, builder_surface: pathname.includes('/admin-builder') ? 'editor' : 'public' };
      }
      return event;
    },
  });
}
