import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import type { SiteLocale } from '@/lib/locales';

export type PublicUnavailableModuleKind =
  | 'events'
  | 'portfolio'
  | 'store'
  | 'checkout'
  | 'billing'
  | 'booking';

type UnavailableCopy = {
  label: string;
  title: string;
  description: string;
  home: string;
  contact: string;
};

const JA_MODULE_COPY: Record<PublicUnavailableModuleKind, Pick<UnavailableCopy, 'label' | 'title' | 'description'>> = {
  events: {
    label: 'イベント',
    title: 'イベントは日本語では公開していません',
    description: 'セミナー・ウェビナー・相談会の日本語案内は現在用意していません。ホームまたはお問い合わせからご相談ください。',
  },
  portfolio: {
    label: 'ポートフォリオ',
    title: 'ポートフォリオは日本語では公開していません',
    description: '日本語の事例紹介は現在用意していません。ご相談はお問い合わせをご利用ください。',
  },
  store: {
    label: 'ストア',
    title: 'ストアは日本語では公開していません',
    description: '日本語の商品案内は現在用意していません。ご相談はお問い合わせをご利用ください。',
  },
  checkout: {
    label: 'チェックアウト',
    title: 'チェックアウトは日本語ではご利用いただけません',
    description: '日本語の決済手続きは現在提供していません。',
  },
  billing: {
    label: '請求',
    title: '請求ポータルは日本語ではご利用いただけません',
    description: '日本語の請求ポータルは現在提供していません。',
  },
  booking: {
    label: '予約',
    title: '予約管理は日本語ではご利用いただけません',
    description: '日本語の予約管理は現在提供していません。',
  },
};

const GENERIC_MODULE_COPY: Record<Exclude<SiteLocale, 'ja'>, Pick<UnavailableCopy, 'label' | 'title' | 'description'>> = {
  ko: {
    label: '이용 안내',
    title: '현재 이 언어로 이용할 수 없습니다',
    description: '이 언어로 제공되는 콘텐츠나 기능이 아직 없습니다. 도움이 필요하시면 문의해 주세요.',
  },
  'zh-hant': {
    label: '使用說明',
    title: '目前尚未提供此語言版本',
    description: '此內容或功能目前尚未提供此語言版本。如需協助，請與我們聯絡。',
  },
  en: {
    label: 'Availability',
    title: 'Currently unavailable in this language',
    description: 'This content or feature is not available in this language. Please contact us if you need help.',
  },
};

function recoveryLabels(locale: SiteLocale): Pick<UnavailableCopy, 'home' | 'contact'> {
  if (locale === 'ja') return { home: 'ホーム', contact: 'お問い合わせ' };
  if (locale === 'ko') return { home: '홈', contact: '문의하기' };
  if (locale === 'zh-hant') return { home: '首頁', contact: '聯絡我們' };
  return { home: 'Home', contact: 'Contact' };
}

export function publicUnavailableCopy(
  locale: SiteLocale,
  kind: PublicUnavailableModuleKind,
): UnavailableCopy {
  const moduleCopy = locale === 'ja' ? JA_MODULE_COPY[kind] : GENERIC_MODULE_COPY[locale];
  return { ...moduleCopy, ...recoveryLabels(locale) };
}

export function publicUnavailableMetadata(
  locale: SiteLocale,
  kind: PublicUnavailableModuleKind,
): Metadata {
  const copy = publicUnavailableCopy(locale, kind);
  return {
    title: copy.title,
    description: copy.description,
    robots: { index: false, follow: true },
  };
}

export default function PublicUnavailableState({
  locale,
  kind,
}: {
  locale: SiteLocale;
  kind: PublicUnavailableModuleKind;
}) {
  const copy = publicUnavailableCopy(locale, kind);
  return (
    <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description}>
      <div data-public-unavailable={kind} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        <Link className="button" href={`/${locale}`}>
          {copy.home}
        </Link>
        <Link className="button button--outline" href={`/${locale}/contact`}>
          {copy.contact}
        </Link>
      </div>
    </PageHeader>
  );
}
