import type { TranslationRowStatus } from './dashboard-model';

export type TranslationDashboardStatusFilter = 'all' | TranslationRowStatus;

const DASHBOARD_ROW_STATUS_FILTERS = [
  'untranslated',
  'draft',
  'outdated',
  'published',
] satisfies readonly TranslationRowStatus[];

function isTranslationRowStatusFilter(rawValue: string): rawValue is TranslationRowStatus {
  return DASHBOARD_ROW_STATUS_FILTERS.some((status) => status === rawValue);
}

export function parseTranslationDashboardStatusFilter(rawValue?: string): TranslationDashboardStatusFilter {
  if (!rawValue || rawValue === 'all') return 'all';
  if (rawValue === 'missing') return 'untranslated';
  return isTranslationRowStatusFilter(rawValue) ? rawValue : 'all';
}

export function buildTranslationDashboardQuery({
  sourceLocale,
  statusFilter,
}: {
  sourceLocale: string;
  statusFilter: TranslationDashboardStatusFilter;
}): string {
  const params = new URLSearchParams();
  params.set('sourceLocale', sourceLocale);
  if (statusFilter !== 'all') params.set('status', statusFilter);
  return params.toString();
}
