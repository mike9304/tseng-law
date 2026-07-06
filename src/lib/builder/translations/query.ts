import type { Locale } from '@/lib/locales';
import type {
  TranslationPublishWarning,
  TranslationPublishWarningKind,
} from './publish-warning-types';

export interface TranslationManagerQueryState {
  category?: string;
  search?: string;
  status?: string;
  target?: string;
  targets?: string;
  sourceLocale?: string;
}

export function parseTranslationTargetLocales(
  rawValue: string | undefined,
  allowedLocales: Locale[],
): Locale[] {
  if (!rawValue) return allowedLocales;
  const requested = rawValue
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean) as Locale[];
  const requestedSet = new Set(requested);
  const next = allowedLocales.filter((locale) => requestedSet.has(locale));
  return next.length > 0 ? next : allowedLocales;
}

export function buildTranslationManagerQuery(
  state: {
    sourceLocale: Locale;
    selectedCategory: string;
    search: string;
    statusFilter: string;
    visibleTargets: Locale[];
    allTargetLocales: Locale[];
    targetLocale?: Locale;
  },
): string {
  const params = new URLSearchParams();
  params.set('sourceLocale', state.sourceLocale);
  if (state.selectedCategory !== 'all') params.set('category', state.selectedCategory);
  if (state.search.trim()) params.set('search', state.search.trim());
  if (state.statusFilter !== 'all') params.set('status', state.statusFilter);
  if (state.targetLocale) {
    params.set('target', state.targetLocale);
    return params.toString();
  }

  const visibleTargetCount = state.visibleTargets.length;
  if (visibleTargetCount === 1) {
    params.set('target', state.visibleTargets[0]);
  } else if (visibleTargetCount > 0 && visibleTargetCount < state.allTargetLocales.length) {
    params.set('targets', state.visibleTargets.join(','));
  }

  return params.toString();
}

export function buildTranslationManagerReviewQuery(
  state: {
    sourceLocale: Locale;
    targetLocale: Locale;
    statusFilter: 'missing' | 'outdated' | 'all';
    selectedCategory?: string;
    search?: string;
  },
): string {
  return buildTranslationManagerQuery({
    sourceLocale: state.sourceLocale,
    selectedCategory: state.selectedCategory ?? 'all',
    search: state.search ?? '',
    statusFilter: state.statusFilter,
    visibleTargets: [state.targetLocale],
    allTargetLocales: [state.targetLocale],
    targetLocale: state.targetLocale,
  });
}

function reviewStatusForPublishWarning(
  kind: TranslationPublishWarningKind,
): 'missing' | 'outdated' | 'all' {
  if (kind === 'untranslated') return 'missing';
  if (kind === 'outdated') return 'outdated';
  return 'all';
}

export function buildTranslationPublishWarningReviewQuery(
  warning: Pick<TranslationPublishWarning, 'kind' | 'pageId' | 'locale'>,
  sourceLocale: Locale,
): string {
  return buildTranslationManagerReviewQuery({
    sourceLocale,
    targetLocale: warning.locale,
    statusFilter: reviewStatusForPublishWarning(warning.kind),
    selectedCategory: 'pages',
    search: warning.pageId,
  });
}
