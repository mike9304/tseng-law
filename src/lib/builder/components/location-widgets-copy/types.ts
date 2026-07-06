import type {
  BuilderAddressBlockCanvasNode,
  BuilderBusinessHoursCanvasNode,
  BuilderMultiLocationMapCanvasNode,
} from '@/lib/builder/canvas/types';

export type AddressBlockContent = BuilderAddressBlockCanvasNode['content'];
export type BusinessHourRow = BuilderBusinessHoursCanvasNode['content']['rows'][number];
export type MultiLocation = BuilderMultiLocationMapCanvasNode['content']['locations'][number];

export interface LocationWidgetsCopy {
  addressBlock: {
    defaultContent: AddressBlockContent;
    copyButton: string;
    copiedButton: string;
    directionsLink: string;
    inspector: {
      label: string;
      line1: string;
      line2: string;
      cityRegion: string;
      postalCode: string;
      country: string;
      phone: string;
      directionsHref: string;
      showCopyButton: string;
      showDirectionsLink: string;
    };
  };
  businessHours: {
    defaultTitle: string;
    defaultTimezone: string;
    defaultRows: BusinessHourRow[];
    defaultNote: string;
    empty: string;
    closed: string;
    inspector: {
      title: string;
      timezone: string;
      rows: string;
      highlightToday: string;
      note: string;
    };
  };
  multiLocationMap: {
    defaultTitle: string;
    defaultLocations: MultiLocation[];
    count: (count: number) => string;
    empty: string;
    noActive: string;
    inspector: {
      title: string;
      locations: string;
      activeIndex: string;
      showList: string;
    };
  };
  map: {
    iframeTitle: string;
    editBadge: string;
    officePresets: string;
    address: string;
    addressPlaceholder: string;
    zoomLevel: (zoom: number) => string;
    addressAria: string;
    decreaseZoomAria: string;
    zoomAria: string;
    increaseZoomAria: string;
    presetAria: (label: string) => string;
    presets: Array<{ label: string; address: string }>;
    fallbackMessage: string;
    openInMaps: string;
  };
}
