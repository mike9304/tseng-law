import {
  getMarketingEmailProviderStatus,
  type MarketingEmailEnv,
  type MarketingEmailProvider,
} from './email-provider';

export const DEFAULT_DELIVERABILITY_FROM_ADDRESS = 'bookings@hoveringlaw.com.tw';

export type MarketingDeliverabilityCheckId =
  | 'production_provider'
  | 'provider_secret'
  | 'site_url'
  | 'https_site_url'
  | 'sender_domain_alignment';

export type MarketingDeliverabilityCheckStatus = 'pass' | 'warn' | 'fail';

export interface MarketingDeliverabilityCheck {
  readonly id: MarketingDeliverabilityCheckId;
  readonly status: MarketingDeliverabilityCheckStatus;
  readonly label: string;
  readonly detail: string;
}

export interface MarketingDeliverabilityReport {
  readonly ok: boolean;
  readonly provider: MarketingEmailProvider;
  readonly production: boolean;
  readonly siteUrl?: string;
  readonly siteDomain?: string;
  readonly fromAddress: string;
  readonly fromDomain: string;
  readonly checks: readonly MarketingDeliverabilityCheck[];
}

export interface MarketingDeliverabilityInput {
  readonly env?: MarketingEmailEnv;
  readonly fromAddress?: string;
}

function firstConfiguredSiteUrl(env: MarketingEmailEnv): string {
  return env.SITE_URL?.trim() || env.NEXT_PUBLIC_SITE_URL?.trim() || '';
}

function parseSiteDomain(siteUrl: string): string | undefined {
  if (!siteUrl) return undefined;
  try {
    const domain = new URL(siteUrl).hostname.trim().toLowerCase();
    return domain || undefined;
  } catch (error) {
    if (error instanceof Error) return undefined;
    throw error;
  }
}

function parseSenderDomain(fromAddress: string): string {
  const domain = fromAddress.split('@')[1]?.trim().toLowerCase();
  return domain || 'unknown';
}

function alignedDomains(siteDomain: string | undefined, fromDomain: string): boolean {
  if (!siteDomain || fromDomain === 'unknown') return false;
  return siteDomain === fromDomain || siteDomain.endsWith(`.${fromDomain}`) || fromDomain.endsWith(`.${siteDomain}`);
}

function providerChecks(
  provider: MarketingEmailProvider,
  configured: boolean,
  production: boolean,
): readonly MarketingDeliverabilityCheck[] {
  if (provider === 'stub') {
    return [
      {
        id: 'production_provider',
        status: production ? 'fail' : 'warn',
        label: 'Production provider',
        detail: production
          ? 'No production email provider is configured.'
          : 'Development stub is active; real recipients will not receive provider email.',
      },
      {
        id: 'provider_secret',
        status: production ? 'fail' : 'warn',
        label: 'Provider secret',
        detail: production
          ? 'Set RESEND_API_KEY or MAILCHIMP_TRANSACTIONAL_API_KEY before production delivery.'
          : 'Provider secret is optional while using the development stub.',
      },
    ];
  }
  return [
    {
      id: 'production_provider',
      status: 'pass',
      label: 'Production provider',
      detail: `${provider} is selected for marketing delivery.`,
    },
    {
      id: 'provider_secret',
      status: configured ? 'pass' : 'fail',
      label: 'Provider secret',
      detail: configured ? 'Required provider secret is present.' : `Missing secret for ${provider}.`,
    },
  ];
}

function siteUrlChecks(
  siteUrl: string,
  siteDomain: string | undefined,
  production: boolean,
): readonly MarketingDeliverabilityCheck[] {
  if (!siteUrl || !siteDomain) {
    return [
      {
        id: 'site_url',
        status: production ? 'fail' : 'warn',
        label: 'Site URL',
        detail: production
          ? 'Set SITE_URL or NEXT_PUBLIC_SITE_URL so tracking and unsubscribe links use the production domain.'
          : 'Set a site URL to verify tracking and unsubscribe links.',
      },
      {
        id: 'https_site_url',
        status: production ? 'fail' : 'warn',
        label: 'HTTPS site URL',
        detail: 'A valid HTTPS site URL is required for production deliverability checks.',
      },
    ];
  }
  const https = siteUrl.startsWith('https://');
  return [
    {
      id: 'site_url',
      status: 'pass',
      label: 'Site URL',
      detail: `Marketing links resolve against ${siteDomain}.`,
    },
    {
      id: 'https_site_url',
      status: https ? 'pass' : production ? 'fail' : 'warn',
      label: 'HTTPS site URL',
      detail: https ? 'Configured site URL uses HTTPS.' : 'Configured site URL is not HTTPS.',
    },
  ];
}

function senderDomainCheck(
  siteDomain: string | undefined,
  fromDomain: string,
): MarketingDeliverabilityCheck {
  if (alignedDomains(siteDomain, fromDomain)) {
    return {
      id: 'sender_domain_alignment',
      status: 'pass',
      label: 'Sender domain',
      detail: `Sender domain matches ${siteDomain}.`,
    };
  }
  return {
    id: 'sender_domain_alignment',
    status: 'warn',
    label: 'Sender domain',
    detail: siteDomain
      ? `Sender domain ${fromDomain} differs from site domain ${siteDomain}; confirm SPF/DKIM/DMARC alignment with the provider.`
      : `Sender domain ${fromDomain} could not be compared with the site domain.`,
  };
}

export function buildMarketingDeliverabilityReport(
  input: MarketingDeliverabilityInput = {},
): MarketingDeliverabilityReport {
  const env = input.env ?? process.env;
  const providerStatus = getMarketingEmailProviderStatus(env);
  const production = env.NODE_ENV === 'production';
  const siteUrl = firstConfiguredSiteUrl(env);
  const siteDomain = parseSiteDomain(siteUrl);
  const fromAddress = input.fromAddress ?? DEFAULT_DELIVERABILITY_FROM_ADDRESS;
  const fromDomain = parseSenderDomain(fromAddress);
  const checks = [
    ...providerChecks(providerStatus.provider, providerStatus.configured, production),
    ...siteUrlChecks(siteUrl, siteDomain, production),
    senderDomainCheck(siteDomain, fromDomain),
  ];
  const ok = checks.every((check) => check.status !== 'fail');

  return {
    ok,
    provider: providerStatus.provider,
    production,
    ...(siteUrl ? { siteUrl } : {}),
    ...(siteDomain ? { siteDomain } : {}),
    fromAddress,
    fromDomain,
    checks,
  };
}
