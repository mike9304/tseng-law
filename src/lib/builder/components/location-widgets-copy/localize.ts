import type { AddressBlockContent, BusinessHourRow, MultiLocation } from './types';
import { LOCATION_WIDGETS_LEGACY_DEFAULTS } from './legacy-defaults';
import { sameLocations, sameRows } from './helpers';

export function localizedLocationWidgetText(
  value: string | undefined,
  localized: string,
  legacyDefault: string,
): string {
  const current = value ?? '';
  return current === legacyDefault ? localized : current;
}

export function localizedAddressBlockContent(
  content: AddressBlockContent,
  localized: AddressBlockContent,
): AddressBlockContent {
  const legacy = LOCATION_WIDGETS_LEGACY_DEFAULTS.addressBlock;
  return {
    ...content,
    label: localizedLocationWidgetText(content.label, localized.label, legacy.label),
    line1: localizedLocationWidgetText(content.line1, localized.line1, legacy.line1),
    line2: localizedLocationWidgetText(content.line2, localized.line2, legacy.line2),
    cityRegion: localizedLocationWidgetText(content.cityRegion, localized.cityRegion, legacy.cityRegion),
    postalCode: localizedLocationWidgetText(content.postalCode, localized.postalCode, legacy.postalCode),
    country: localizedLocationWidgetText(content.country, localized.country, legacy.country),
    phone: localizedLocationWidgetText(content.phone, localized.phone, legacy.phone),
  };
}

export function localizedBusinessHourRows(
  rows: BusinessHourRow[],
  localized: BusinessHourRow[],
): BusinessHourRow[] {
  return sameRows(rows, LOCATION_WIDGETS_LEGACY_DEFAULTS.businessHours.rows) ? localized : rows;
}

export function localizedMultiLocations(
  locations: MultiLocation[],
  localized: MultiLocation[],
): MultiLocation[] {
  return sameLocations(locations, LOCATION_WIDGETS_LEGACY_DEFAULTS.multiLocationMap.locations) ? localized : locations;
}
