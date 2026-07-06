import type { Locale } from '@/lib/locales';
import type { LocationWidgetsCopy } from './types';

export type { LocationWidgetsCopy } from './types';
export { LOCATION_WIDGETS_LEGACY_DEFAULTS } from './legacy-defaults';
export {
  localizedAddressBlockContent,
  localizedBusinessHourRows,
  localizedLocationWidgetText,
  localizedMultiLocations,
} from './localize';

import { zhHantCopy } from './locales/zh-hant';
import { enCopy } from './locales/en';
import { koCopy } from './locales/ko';

export function getLocationWidgetsCopy(locale: Locale): LocationWidgetsCopy {
  if (locale === 'zh-hant') {
    return zhHantCopy;
  }
  if (locale === 'en') {
    return enCopy;
  }
  return koCopy;
}
