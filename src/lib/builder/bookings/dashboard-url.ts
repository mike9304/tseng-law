export type BookingDashboardActionFilter = 'today' | 'pending' | 'unpaid' | 'waitlist' | 'no-show' | 'documents';

const ACTION_FILTERS: BookingDashboardActionFilter[] = ['today', 'pending', 'unpaid', 'waitlist', 'no-show', 'documents'];

export function normalizeBookingDashboardActionFilter(value?: string | null): BookingDashboardActionFilter {
  if (value && ACTION_FILTERS.includes(value as BookingDashboardActionFilter)) {
    return value as BookingDashboardActionFilter;
  }
  return 'today';
}

export function normalizeBookingDashboardQuery(value?: string | null): string {
  return value?.trim() ?? '';
}
