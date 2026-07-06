import type { CheckpointDefinition } from './types';
import { W02_selectionHandles } from './scenarios/W02-selection-handles';
import { W03_inlineTextEdit } from './scenarios/W03-inline-text-edit';
import { W04_addPanel } from './scenarios/W04-add-panel';
import { W07_resize } from './scenarios/W07-resize';
import { W08_rotation } from './scenarios/W08-rotation';
import { W09_deleteKey } from './scenarios/W09-delete-key';
import { W12_inspectorTabs } from './scenarios/W12-inspector-tabs';
import { W14_pagesCrudDeep } from './scenarios/W14-pages-crud-deep';
import { W15_newPageBlank } from './scenarios/W15-new-page-blank';
import { W17_mobileOverride } from './scenarios/W17-mobile-override';
import { W18_navMenuDeep } from './scenarios/W18-nav-menu-deep';
import { W19_globalHeaderDeep } from './scenarios/W19-global-header-deep';
import { W20_globalFooterDeep } from './scenarios/W20-global-footer-deep';
import { W21_siteSettings } from './scenarios/W21-site-settings';
import { W22_imageLibrary } from './scenarios/W22-image-library';
import { W23_imageCropFilterAlt } from './scenarios/W23-image-crop-filter-alt';
import { W26_versionHistory } from './scenarios/W26-version-history';
import { W27_pageSeoPanel } from './scenarios/W27-page-seo-panel';
import { W28_publishPreflight } from './scenarios/W28-publish-preflight';
import { W29_duplicate } from './scenarios/W29-duplicate';
import { W30_crossPagePaste } from './scenarios/W30-cross-page-paste';
import { W36_publicResponsive } from './scenarios/W36-public-responsive';
import { W159_expandIn } from './scenarios/W159-expand-in';
import { W160_exitAnim } from './scenarios/W160-exit-anim';
import { W161_parallax } from './scenarios/W161-parallax';
import { W167_scrub } from './scenarios/W167-scrub';
import { W168_hoverFx } from './scenarios/W168-hover-fx';
import { W170_loopPulse } from './scenarios/W170-loop-pulse';
import { W171_loopFloat } from './scenarios/W171-loop-float';
import { W172_pageTransition } from './scenarios/W172-page-transition';
import { W173_timelineEditor } from './scenarios/W173-timeline-editor';
import { W174_easing } from './scenarios/W174-easing';
import { W175_animParams } from './scenarios/W175-anim-params';
import { W178_themePreset } from './scenarios/W178-theme-preset';
import { W179_componentPreset } from './scenarios/W179-component-preset';
import { W181_tokenExportImport } from './scenarios/W181-token-export-import';
import { W182_brandAssets } from './scenarios/W182-brand-assets';
import { W183_cornerShadowPreset } from './scenarios/W183-corner-shadow-preset';
import { W184_typographyScale } from './scenarios/W184-typography-scale';
import { W185_styleOrigin } from './scenarios/W185-style-origin';
import { W186_sitemap } from './scenarios/W186-sitemap';
import { W187_robotsUi } from './scenarios/W187-robots-ui';
import { W188_redirectsUi } from './scenarios/W188-redirects-ui';
import { W189_scheduledPublish } from './scenarios/W189-scheduled-publish';
import { W190_historyRollback } from './scenarios/W190-history-rollback';
import { W191_jsonld } from './scenarios/W191-jsonld';
import { W192_ogPreview } from './scenarios/W192-og-preview';
import { W193_hreflang } from './scenarios/W193-hreflang';
import { W194_canonical } from './scenarios/W194-canonical';
import { W195_publishDiff } from './scenarios/W195-publish-diff';
import { checkpoint as W196_bookingServices } from './scenarios/W196-booking-services';
import { checkpoint as W197_bookingStaff } from './scenarios/W197-booking-staff';
import { checkpoint as W198_bookingStaffAvailability } from './scenarios/W198-booking-staff-availability';
import { checkpoint as W199_bookingBufferInterval } from './scenarios/W199-booking-buffer-interval';
import { checkpoint as W200_bookingWidget } from './scenarios/W200-booking-widget';
import { checkpoint as W201_bookingTimezone } from './scenarios/W201-booking-timezone';
import { checkpoint as W202_bookingCustomFields } from './scenarios/W202-booking-custom-fields';
import { checkpoint as W206_bookingCustomerManage } from './scenarios/W206-booking-customer-manage';
import { checkpoint as W207_bookingDashboard } from './scenarios/W207-booking-dashboard';
import { checkpoint as W208_bookingCalendar } from './scenarios/W208-booking-calendar';
import { checkpoint as W209_bookingStatus } from './scenarios/W209-booking-status';
import { checkpoint as W211_bookingWaitlist } from './scenarios/W211-booking-waitlist';
import { checkpoint as W212_bookingRecurringAvailability } from './scenarios/W212-booking-recurring-availability';
import { checkpoint as W213_bookingAnalytics } from './scenarios/W213-booking-analytics';
import { checkpoint as W214_bookingCustomerProfile } from './scenarios/W214-booking-customer-profile';
import { checkpoint as W215_bookingEmailTemplates } from './scenarios/W215-booking-email-templates';
import { W216_rulers } from './scenarios/W216-rulers';
import { W217_guides } from './scenarios/W217-guides';
import { W218_gridSnap } from './scenarios/W218-grid-snap';
import { W219_layersPanel } from './scenarios/W219-layers-panel';
import { W220_shortcutMap } from './scenarios/W220-shortcut-map';
import { W221_multiAlign } from './scenarios/W221-multi-align';
import { W222_distribute } from './scenarios/W222-distribute';
import { W223_pasteStyle } from './scenarios/W223-paste-style';
import { W224_zoomControls } from './scenarios/W224-zoom-controls';
import { W225_undoTimeline } from './scenarios/W225-undo-timeline';
import { checkpoint as W205_bookingMeetLink } from './scenarios/W205-booking-meet-link';
import { checkpoint as W210_bookingPaymentStub } from './scenarios/W210-booking-payment-stub';

export const ALL_CHECKPOINTS: readonly CheckpointDefinition[] = [
  W02_selectionHandles,
  W03_inlineTextEdit,
  W04_addPanel,
  W07_resize,
  W08_rotation,
  W09_deleteKey,
  W12_inspectorTabs,
  W14_pagesCrudDeep,
  W15_newPageBlank,
  W17_mobileOverride,
  W18_navMenuDeep,
  W19_globalHeaderDeep,
  W20_globalFooterDeep,
  W21_siteSettings,
  W22_imageLibrary,
  W23_imageCropFilterAlt,
  W26_versionHistory,
  W27_pageSeoPanel,
  W28_publishPreflight,
  W29_duplicate,
  W30_crossPagePaste,
  W36_publicResponsive,
  W159_expandIn,
  W160_exitAnim,
  W161_parallax,
  W167_scrub,
  W168_hoverFx,
  W170_loopPulse,
  W171_loopFloat,
  W172_pageTransition,
  W173_timelineEditor,
  W174_easing,
  W175_animParams,
  W178_themePreset,
  W179_componentPreset,
  W181_tokenExportImport,
  W182_brandAssets,
  W183_cornerShadowPreset,
  W184_typographyScale,
  W185_styleOrigin,
  W186_sitemap,
  W187_robotsUi,
  W188_redirectsUi,
  W189_scheduledPublish,
  W190_historyRollback,
  W191_jsonld,
  W192_ogPreview,
  W193_hreflang,
  W194_canonical,
  W195_publishDiff,
  W196_bookingServices,
  W197_bookingStaff,
  W198_bookingStaffAvailability,
  W199_bookingBufferInterval,
  W200_bookingWidget,
  W201_bookingTimezone,
  W202_bookingCustomFields,
  W206_bookingCustomerManage,
  W207_bookingDashboard,
  W208_bookingCalendar,
  W209_bookingStatus,
  W211_bookingWaitlist,
  W212_bookingRecurringAvailability,
  W213_bookingAnalytics,
  W214_bookingCustomerProfile,
  W215_bookingEmailTemplates,
  W216_rulers,
  W217_guides,
  W218_gridSnap,
  W219_layersPanel,
  W220_shortcutMap,
  W221_multiAlign,
  W222_distribute,
  W223_pasteStyle,
  W224_zoomControls,
  W225_undoTimeline,
  W205_bookingMeetLink,
  W210_bookingPaymentStub,
];
