import type { BusinessHourRow, MultiLocation } from './types';

export function cloneRows(rows: readonly BusinessHourRow[]): BusinessHourRow[] {
  return rows.map((row) => ({ ...row }));
}

export function cloneLocations(locations: readonly MultiLocation[]): MultiLocation[] {
  return locations.map((location) => ({ ...location }));
}

export function sameRows(left: BusinessHourRow[], right: readonly BusinessHourRow[]): boolean {
  return left.length === right.length
    && left.every((row, index) => (
      row.day === right[index]?.day
      && row.hours === right[index]?.hours
      && row.closed === right[index]?.closed
    ));
}

export function sameLocations(left: MultiLocation[], right: readonly MultiLocation[]): boolean {
  return left.length === right.length
    && left.every((location, index) => (
      location.name === right[index]?.name
      && location.address === right[index]?.address
      && location.lat === right[index]?.lat
      && location.lng === right[index]?.lng
    ));
}
