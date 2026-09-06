import { getServiceArea } from '@/data/service-details';
import type { SiteLocale } from '@/lib/locales';

export type LocalizedServiceCopy = {
  slug: string;
  title: string;
  subtitle: string;
  intro: string;
  keyPoints: string[];
  columnSlugs: string[];
};

/** Previous EN defaults still stored in some builder source records. */
export const PREVIOUS_EN_SERVICE_DEFAULTS = {
  investment: {
    subtitle: 'End-to-end legal support for Korean companies expanding into Taiwan',
    intro:
      'Hovering supports Korean businesses across the full market-entry process in Taiwan, including entity structuring, investment approval, capital remittance, bank setup, business premises review, and industry-specific licensing.',
    keyPoints: [
      'Entity options include subsidiary, branch, and representative office, with different implications for tax, liability, and operations.',
      'Typical setup includes around 10 steps over roughly 3 months: name reservation, POA notarization, investment review filing, banking, capital remittance, company registration, and tax registration.',
      'For a single shareholder work permit case, practical minimum capital is often TWD 500,000, and maintaining work authorization may require annual revenue over TWD 3M.',
      'Capital remittance usually requires in-person processing by the investor at the Korean bank branch, together with outbound investment reporting.',
      'Business address compliance should be checked in advance through local zoning and use regulations.',
      'For cosmetics sales, PIF registration is mandatory, and advertising violations can trigger fines up to TWD 5M.',
      'Logistics licensing may require TWD 25M capital and vehicle requirements; acquisition or outsourcing can be alternatives.',
      'When closing operations, dissolution and liquidation are mandatory. Illegal capital withdrawal can lead to serious criminal penalties.',
    ],
  },
  labor: {
    intro:
      'Taiwan’s severance rules differ from Korea’s in both qualifying grounds and calculation methods. The legal basis for ending the contract, service under the new and old systems, notice requirements, and statutory time limits must be reviewed separately. We advise Korean employers and employees on dismissal, severance, and employment-contract disputes in Taiwan.',
  },
  ip: {
    intro:
      'We support brand protection and IP management for Korean businesses entering Taiwan, as well as disputes involving financial products and investment contracts.',
  },
} as const;

function sameStringArray(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}

function currentEnglishField(
  slug: string,
  field: 'subtitle' | 'intro',
): string | undefined {
  return getServiceArea(slug)?.[field].en;
}

function currentEnglishKeyPoints(slug: string): string[] | undefined {
  const points = getServiceArea(slug)?.keyPoints.en;
  return points ? [...points] : undefined;
}

/**
 * Replaces only EN investment/labor/ip fields that still match the previous
 * default. Custom builder values and other locales are left unchanged.
 */
export function projectInternationalPublicCopy(
  locale: SiteLocale,
  record: LocalizedServiceCopy,
): LocalizedServiceCopy {
  if (locale !== 'en') {
    return record;
  }

  if (record.slug === 'investment') {
    const previous = PREVIOUS_EN_SERVICE_DEFAULTS.investment;
    const nextSubtitle = sameString(record.subtitle, previous.subtitle)
      ? currentEnglishField('investment', 'subtitle')
      : undefined;
    const nextIntro = sameString(record.intro, previous.intro)
      ? currentEnglishField('investment', 'intro')
      : undefined;
    const nextKeyPoints = sameStringArray(record.keyPoints, previous.keyPoints)
      ? currentEnglishKeyPoints('investment')
      : undefined;
    if (nextSubtitle === undefined && nextIntro === undefined && nextKeyPoints === undefined) {
      return record;
    }
    return {
      ...record,
      subtitle: nextSubtitle ?? record.subtitle,
      intro: nextIntro ?? record.intro,
      keyPoints: nextKeyPoints ?? record.keyPoints,
    };
  }

  if (record.slug === 'labor') {
    if (!sameString(record.intro, PREVIOUS_EN_SERVICE_DEFAULTS.labor.intro)) {
      return record;
    }
    const nextIntro = currentEnglishField('labor', 'intro');
    if (nextIntro === undefined) {
      return record;
    }
    return { ...record, intro: nextIntro };
  }

  if (record.slug === 'ip') {
    if (!sameString(record.intro, PREVIOUS_EN_SERVICE_DEFAULTS.ip.intro)) {
      return record;
    }
    const nextIntro = currentEnglishField('ip', 'intro');
    if (nextIntro === undefined) {
      return record;
    }
    return { ...record, intro: nextIntro };
  }

  return record;
}

function sameString(left: string, right: string): boolean {
  return left === right;
}
