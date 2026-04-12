/**
 * Phase 9 P9-08 — Analytics integration config.
 *
 * Supports Google Analytics, Plausible, and Vercel Analytics.
 * The config is stored in the site document; the published renderer
 * injects the appropriate script tags.
 */

export type AnalyticsProvider = 'google-analytics' | 'plausible' | 'vercel' | 'custom';

export interface AnalyticsConfig {
  provider: AnalyticsProvider;
  enabled: boolean;
  trackingId?: string;
  domain?: string;
  customScript?: string;
}

export const DEFAULT_ANALYTICS: AnalyticsConfig[] = [];

export function generateAnalyticsScripts(configs: AnalyticsConfig[]): string[] {
  return configs
    .filter((c) => c.enabled)
    .map((config) => {
      switch (config.provider) {
        case 'google-analytics':
          if (!config.trackingId) return '';
          return `<script async src="https://www.googletagmanager.com/gtag/js?id=${config.trackingId}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${config.trackingId}');</script>`;
        case 'plausible':
          return `<script defer data-domain="${config.domain || 'tseng-law.com'}" src="https://plausible.io/js/script.js"></script>`;
        case 'vercel':
          return `<script defer src="/_vercel/insights/script.js"></script>`;
        case 'custom':
          return config.customScript || '';
        default:
          return '';
      }
    })
    .filter(Boolean);
}

export function generateCookieConsentCheck(scripts: string[]): string {
  if (scripts.length === 0) return '';
  return `<script>
(function(){
  var consent = localStorage.getItem('cookie-consent');
  if (consent === 'accepted') {
    ${scripts.map((s) => `document.head.insertAdjacentHTML('beforeend', ${JSON.stringify(s)});`).join('\n    ')}
  }
})();
</script>`;
}
