import { describe, expect, it } from 'vitest';
import { listComponents } from '@/lib/builder/components/registry';
import type { BuilderComponentDefinition } from '@/lib/builder/components/define';
import { BUILT_IN_SECTIONS, BUILT_IN_SECTION_CATEGORIES } from '@/lib/builder/sections/templates';
import { SAVED_SECTION_CATEGORIES } from '@/lib/builder/site/types';
import type { PageTemplate } from '@/lib/builder/templates/types';
import type { Locale } from '@/lib/locales';
import {
  builtInSectionTemplateDisplayMatchesQuery,
  getBuiltInSectionsPanelCopy,
  getBuiltInSectionTemplateDisplayCopy,
  getSaveSectionModalCopy,
  getSavedSectionsPanelCopy,
} from '@/components/builder/sections/section-panel-copy';
import {
  DECORATIVE_WIDGET_PRESETS,
  DESIGNER_WIDGET_PRESETS,
  GALLERY_WIDGET_PRESETS,
  INTERACTIVE_WIDGET_PRESETS,
  LAYOUT_WIDGET_PRESETS,
  LOCATION_WIDGET_PRESETS,
  MEDIA_WIDGET_PRESETS,
  NAVIGATION_WIDGET_PRESETS,
  SOCIAL_WIDGET_PRESETS,
  TEXT_WIDGET_PRESETS,
  localizeDecorativeWidgetPreset,
  localizeDesignerWidgetPreset,
  localizeGalleryWidgetPreset,
  localizeInteractiveWidgetPreset,
  localizeLayoutWidgetPreset,
  localizeLocationWidgetPreset,
  localizeMediaWidgetPreset,
  localizeNavigationWidgetPreset,
  localizeSocialWidgetPreset,
  localizeTextWidgetPreset,
} from '../SandboxCatalogPanel.presets';
import {
  componentMatchesSearch,
  decorativeWidgetMatchesSearch,
  designerWidgetMatchesSearch,
  getPageTemplateCategoryDisplayLabel,
  getPageTemplateCtaGoalLabel,
  getPageTemplateDensityDisplayLabel,
  getCatalogCategoryCopy,
  getComponentCatalogDisplayName,
  getPageTemplateMeta,
  getPageTemplatePageTypeDisplayLabel,
  getPageTemplatePreviewDescription,
  getPageTemplatePreviewName,
  getPageTemplatePreviewTags,
  getPageTemplateQualityLabel,
  getPageTemplateQualityTierDisplayLabel,
  getPageTemplateSectionSummary,
  getPageTemplateStyleDisplayLabel,
  getSandboxCatalogPanelCopy,
  galleryWidgetMatchesSearch,
  interactiveWidgetMatchesSearch,
  layoutWidgetMatchesSearch,
  locationWidgetMatchesSearch,
  mediaWidgetMatchesSearch,
  navigationWidgetMatchesSearch,
  normalizeSearchTerm,
  pageTemplatePreviewMatchesSearch,
  socialWidgetMatchesSearch,
  textWidgetMatchesSearch,
} from '../SandboxCatalogPanel.helpers';
import { buildThumbnailKey } from '../template-thumbnail-cache';

const LOCALES: Locale[] = ['ko', 'zh-hant', 'en'];
const HANGUL = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/;
const CJK = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;
const LEGACY_RAW_DISPLAY_NAMES = new Set([
  'gallery',
  'video',
  'map',
  'customEmbed',
  'contactForm',
  'columnCard',
  'columnList',
  'faqList',
  'attorneyCard',
  'ctaBanner',
  'Booking Widget',
]);

function getComponent(kind: string): BuilderComponentDefinition {
  const component = listComponents().find((entry) => entry.kind === kind);
  if (!component) throw new Error(`Missing registered component: ${kind}`);
  return component;
}

describe('component catalog copy', () => {
  it('localizes registered component card names for every builder locale', () => {
    for (const component of listComponents()) {
      for (const locale of LOCALES) {
        expect(getComponentCatalogDisplayName(component, locale), `${component.kind}/${locale}`).toBeTruthy();
      }

      expect(getComponentCatalogDisplayName(component, 'zh-hant'), component.kind).not.toMatch(HANGUL);
      expect(getComponentCatalogDisplayName(component, 'en'), component.kind).not.toMatch(CJK);
    }
  });

  it('replaces legacy English and camelCase display names in localized catalog surfaces', () => {
    for (const component of listComponents()) {
      if (!LEGACY_RAW_DISPLAY_NAMES.has(component.displayName)) continue;

      expect(getComponentCatalogDisplayName(component, 'ko')).not.toBe(component.displayName);
      expect(getComponentCatalogDisplayName(component, 'zh-hant')).not.toBe(component.displayName);
    }

    expect(getComponentCatalogDisplayName(getComponent('booking-widget'), 'ko')).toBe('예약 위젯');
    expect(getComponentCatalogDisplayName(getComponent('booking-widget'), 'zh-hant')).toBe('預約小工具');
    expect(getComponentCatalogDisplayName(getComponent('gallery'), 'zh-hant')).toBe('圖庫');
    expect(getComponentCatalogDisplayName(getComponent('customEmbed'), 'en')).toBe('Custom embed');
  });

  it('matches localized names while preserving kind and legacy display name search', () => {
    const bookingWidget = getComponent('booking-widget');
    const customEmbed = getComponent('customEmbed');

    expect(componentMatchesSearch(bookingWidget, normalizeSearchTerm('예약'), 'ko')).toBe(true);
    expect(componentMatchesSearch(bookingWidget, normalizeSearchTerm('預約'), 'zh-hant')).toBe(true);
    expect(componentMatchesSearch(bookingWidget, normalizeSearchTerm('booking'), 'en')).toBe(true);
    expect(componentMatchesSearch(customEmbed, normalizeSearchTerm('customEmbed'), 'zh-hant')).toBe(true);
  });

  it('localizes add-panel category and chrome copy', () => {
    expect(getCatalogCategoryCopy('basic', 'ko')).toMatchObject({
      label: '기본',
      sublabel: '텍스트, 버튼, 헤딩',
    });
    expect(getCatalogCategoryCopy('basic', 'zh-hant')).toMatchObject({
      label: '基本',
      sublabel: '文字、按鈕、標題',
    });
    expect(getCatalogCategoryCopy('basic', 'en')).toMatchObject({
      label: 'Basic',
      sublabel: 'Text, button, heading',
    });

    const koCopy = getSandboxCatalogPanelCopy('ko');
    expect(koCopy.title).toBe('카탈로그');
    expect(koCopy.searchLabel).toBe('요소 검색');
    expect(koCopy.openPageTemplates(261)).toBe('전체 페이지 템플릿 261개 보기');
    expect(koCopy.dragTitle('이미지')).toBe('이미지 캔버스로 드래그하여 추가');
    expect(koCopy.quickAdd).toBe('빠른 추가');
    expect(koCopy.emptyTitle).toBe('일치하는 요소 없음');

    const zhCopy = getSandboxCatalogPanelCopy('zh-hant');
    expect(zhCopy.title).toBe('目錄');
    expect(zhCopy.searchLabel).toBe('搜尋元素');
    expect(zhCopy.resultSummary(3, '圖片')).toBe('顯示 3 個「圖片」結果');
    expect(zhCopy.widgetSections.media.name).toBe('媒體小工具套件');
    expect(zhCopy.runtimeUnavailable).toBe('執行階段不可用');

    const enCopy = getSandboxCatalogPanelCopy('en');
    expect(enCopy.countLabel(4, 12, true)).toBe('4/12 items');
    expect(enCopy.resultSummary(1, 'image')).toBe('Showing 1 result for "image"');
    expect(enCopy.quickAddTitle('Image')).toBe('Add Image to the center of the canvas');
  });

  it('localizes built-in section panel chrome and add labels', () => {
    for (const locale of LOCALES) {
      const copy = getBuiltInSectionsPanelCopy(locale);
      expect(copy.marketEyebrow, locale).toBeTruthy();
      expect(copy.marketName, locale).toBeTruthy();
      expect(copy.categoryFilterAriaLabel, locale).toBeTruthy();
      expect(copy.allPacks, locale).toBeTruthy();
      expect(copy.emptyState, locale).toBeTruthy();
      for (const category of BUILT_IN_SECTION_CATEGORIES) {
        expect(copy.categoryLabels[category], `${category}/${locale}`).toBeTruthy();
      }
    }

    const koCopy = getBuiltInSectionsPanelCopy('ko');
    expect(koCopy.marketEyebrow).toBe('디자인 팩');
    expect(koCopy.marketName).toBe('섹션 템플릿 마켓');
    expect(koCopy.categoryLabels.hero).toBe('히어로');
    expect(koCopy.addTemplateTitle('Hero Split')).toBe('Hero Split 섹션 추가');

    const zhCopy = getBuiltInSectionsPanelCopy('zh-hant');
    expect(zhCopy.marketEyebrow).toBe('設計套件');
    expect(zhCopy.marketName).toBe('區段範本市集');
    expect(zhCopy.categoryLabels.contact).toBe('聯絡');
    expect(zhCopy.addTemplateTitle('Hero Split')).toBe('新增 Hero Split 區段');
    expect(zhCopy.emptyState).not.toMatch(HANGUL);

    const enCopy = getBuiltInSectionsPanelCopy('en');
    expect(enCopy.emptyState).toBe('No section templates match your search.');
    expect(enCopy.addTemplateTitle('Hero Split')).toBe('Add Hero Split section');
    expect(enCopy.emptyState).not.toMatch(CJK);
  });

  it('localizes built-in section template card display copy while preserving legacy search', () => {
    for (const template of BUILT_IN_SECTIONS) {
      for (const locale of LOCALES) {
        const copy = getBuiltInSectionTemplateDisplayCopy(template, locale);
        expect(copy.name, `${template.id}/${locale}`).toBeTruthy();
        expect(copy.description, `${template.id}/${locale}`).toBeTruthy();
        expect(copy.thumbnailHint, `${template.id}/${locale}`).toBeTruthy();
      }

      expect(getBuiltInSectionTemplateDisplayCopy(template, 'zh-hant').description, template.id).not.toMatch(HANGUL);
      expect(getBuiltInSectionTemplateDisplayCopy(template, 'en').name, template.id).not.toMatch(CJK);
      expect(getBuiltInSectionTemplateDisplayCopy(template, 'en').description, template.id).not.toMatch(CJK);
    }

    const videoHero = BUILT_IN_SECTIONS.find((template) => template.id === 'hero-video-background');
    const contactForm = BUILT_IN_SECTIONS.find((template) => template.id === 'contact-form-with-info');
    if (!videoHero || !contactForm) throw new Error('Missing expected built-in section templates');

    expect(getBuiltInSectionTemplateDisplayCopy(videoHero, 'ko')).toMatchObject({
      name: '비디오 배경 히어로',
      description: '미디어 배경을 암시하는 대형 비주얼 히어로',
      thumbnailHint: '히어로',
      searchKeywords: expect.arrayContaining(['Video Background Hero']),
    });
    expect(getBuiltInSectionTemplateDisplayCopy(contactForm, 'zh-hant')).toMatchObject({
      name: '聯絡表單搭配資訊',
      description: '聯絡表單搭配資訊區段版面，適合聯絡內容。',
      thumbnailHint: '聯絡',
      searchKeywords: expect.arrayContaining(['Contact Form With Info']),
    });
    expect(builtInSectionTemplateDisplayMatchesQuery(videoHero, 'zh-hant', normalizeSearchTerm('影片'))).toBe(true);
    expect(builtInSectionTemplateDisplayMatchesQuery(contactForm, 'zh-hant', normalizeSearchTerm('Contact Form'))).toBe(true);
  });

  it('localizes saved section panel chrome, actions, and state copy', () => {
    for (const locale of LOCALES) {
      const copy = getSavedSectionsPanelCopy(locale);
      expect(copy.title(3), locale).toBeTruthy();
      expect(copy.refresh, locale).toBeTruthy();
      expect(copy.loadListFailed, locale).toBeTruthy();
      expect(copy.deleteConfirm('Hero'), locale).toBeTruthy();
      expect(copy.cardTitle('Reusable Hero'), locale).toBeTruthy();
      expect(copy.usage(2), locale).toBeTruthy();
      for (const category of SAVED_SECTION_CATEGORIES) {
        expect(copy.categoryLabels[category], `${category}/${locale}`).toBeTruthy();
      }
    }

    const koCopy = getSavedSectionsPanelCopy('ko');
    expect(koCopy.title(2)).toBe('저장한 섹션 (2)');
    expect(koCopy.refresh).toBe('새로고침');
    expect(koCopy.categoryLabels.custom).toBe('사용자 지정');
    expect(koCopy.deleteConfirm('Hero')).toBe('"Hero" 섹션을 삭제하시겠습니까?');
    expect(koCopy.usage(4)).toBe('사용 4회');

    const zhCopy = getSavedSectionsPanelCopy('zh-hant');
    expect(zhCopy.title(2)).toBe('已儲存區段 (2)');
    expect(zhCopy.refresh).toBe('重新整理');
    expect(zhCopy.categoryLabels.custom).toBe('自訂');
    expect(zhCopy.deleteConfirm('Hero')).toBe('確定要刪除「Hero」區段嗎？');
    expect(zhCopy.emptyTitle).not.toMatch(HANGUL);

    const enCopy = getSavedSectionsPanelCopy('en');
    expect(enCopy.title(2)).toBe('Saved sections (2)');
    expect(enCopy.refresh).toBe('Refresh');
    expect(enCopy.cardTitle('Reusable Hero')).toBe('Reusable Hero - drag to canvas, double-click to insert');
    expect(enCopy.emptyHint).not.toMatch(CJK);
  });

  it('localizes save section modal chrome, form labels, and category labels', () => {
    for (const locale of LOCALES) {
      const copy = getSaveSectionModalCopy(locale);
      expect(copy.title, locale).toBeTruthy();
      expect(copy.closeAriaLabel, locale).toBeTruthy();
      expect(copy.intro, locale).toBeTruthy();
      expect(copy.nameRequired, locale).toBeTruthy();
      expect(copy.invalidSectionData, locale).toBeTruthy();
      for (const category of SAVED_SECTION_CATEGORIES) {
        expect(copy.categoryLabels[category], `${category}/${locale}`).toBeTruthy();
      }
    }

    const koCopy = getSaveSectionModalCopy('ko');
    expect(koCopy.title).toBe('섹션으로 저장');
    expect(koCopy.namePlaceholder).toBe('예) 호정 히어로 섹션');
    expect(koCopy.categoryLabels.custom).toBe('사용자 지정');

    const zhCopy = getSaveSectionModalCopy('zh-hant');
    expect(zhCopy.title).toBe('儲存為區段');
    expect(zhCopy.descriptionLabel).toBe('說明（選填）');
    expect(zhCopy.categoryLabels.hero).toBe('主視覺');
    expect(zhCopy.intro).not.toMatch(HANGUL);

    const enCopy = getSaveSectionModalCopy('en');
    expect(enCopy.title).toBe('Save as section');
    expect(enCopy.nameRequired).toBe('Enter a name.');
    expect(enCopy.categoryLabels.footer).toBe('Footer');
    expect(enCopy.intro).not.toMatch(CJK);
  });

  it('localizes page template preview meta and quality labels', () => {
    const template = {
      id: 'test-template',
      name: 'Test template',
      category: 'law',
      subcategory: 'homepage',
      description: 'Preview template',
      pageType: 'home',
      visualStyle: 'editorial',
      qualityTier: 'premium',
      sections: ['hero', 'cta'],
      document: { nodes: [] },
    } as unknown as PageTemplate;

    expect(getPageTemplateMeta(template, 'ko')).toBe('홈 · 에디토리얼 · 2개 섹션');
    expect(getPageTemplateQualityLabel(template, 'ko')).toBe('프리미엄');

    expect(getPageTemplateMeta(template, 'zh-hant')).toBe('首頁 · 編輯風 · 2 個區段');
    expect(getPageTemplateQualityLabel(template, 'zh-hant')).toBe('精選');
    expect(getPageTemplateMeta(template, 'zh-hant')).not.toMatch(HANGUL);

    expect(getPageTemplateMeta(template, 'en')).toBe('Home · Editorial · 2 sections');
    expect(getPageTemplateQualityLabel(template, 'en')).toBe('Premium');
    expect(getPageTemplateMeta(template, 'en')).not.toMatch(CJK);

    const fallbackTemplate = {
      ...template,
      pageType: undefined,
      visualStyle: undefined,
      qualityTier: undefined,
      sections: ['hero'],
    } as unknown as PageTemplate;
    expect(getPageTemplateMeta(fallbackTemplate, 'en')).toBe('Page · Standard · 1 section');
    expect(getPageTemplateQualityLabel(fallbackTemplate, 'zh-hant')).toBe('標準');
  });

  it('localizes page template preview names and tags while preserving raw search', () => {
    const saasTemplate = {
      id: 'saas-features-preview',
      name: 'SaaS Features',
      category: 'saas',
      subcategory: 'features',
      description: 'Preview template',
      pageType: undefined,
      tags: ['프리미엄', 'SaaS', '제품', '무료체험'],
      document: { nodes: [] },
    } as unknown as PageTemplate;

    expect(getPageTemplatePreviewName(saasTemplate, 'ko')).toBe('SaaS 기능');
    expect(getPageTemplatePreviewTags(saasTemplate, 'ko')).toEqual(['프리미엄', 'SaaS', '제품', '무료체험']);
    expect(getPageTemplatePreviewName(saasTemplate, 'zh-hant')).toBe('SaaS 功能');
    expect(getPageTemplatePreviewTags(saasTemplate, 'zh-hant')).toEqual(['精選', 'SaaS', '產品', '免費試用']);
    expect(getPageTemplatePreviewName(saasTemplate, 'en')).toBe('SaaS Features');
    expect(getPageTemplatePreviewTags(saasTemplate, 'en')).toEqual(['Premium', 'SaaS', 'Product', 'Free trial']);
    expect(getPageTemplatePreviewName(saasTemplate, 'en')).not.toMatch(CJK);
    expect(getPageTemplatePreviewTags(saasTemplate, 'en').join(' ')).not.toMatch(CJK);

    const dentalTemplate = {
      id: 'dental-contact-preview',
      name: '치과 Contact',
      category: 'dental',
      subcategory: 'contact',
      description: 'Preview template',
      pageType: 'contact',
      tags: ['치과', '진료', '예약'],
      document: { nodes: [] },
    } as unknown as PageTemplate;

    expect(getPageTemplatePreviewName(dentalTemplate, 'zh-hant')).toBe('牙科 聯絡');
    expect(getPageTemplatePreviewTags(dentalTemplate, 'en')).toEqual(['Dental', 'Care', 'Booking']);
    expect(pageTemplatePreviewMatchesSearch(saasTemplate, 'zh-hant', normalizeSearchTerm('功能'))).toBe(true);
    expect(pageTemplatePreviewMatchesSearch(saasTemplate, 'zh-hant', normalizeSearchTerm('SaaS Features'))).toBe(true);
    expect(pageTemplatePreviewMatchesSearch(dentalTemplate, 'en', normalizeSearchTerm('치과 Contact'))).toBe(true);
  });

  it('localizes page template gallery labels, descriptions, CTA goals, and filter labels', () => {
    const template = {
      id: 'saas-gallery-preview',
      name: 'SaaS Features',
      category: 'saas',
      subcategory: 'features',
      description: 'SaaS Features 페이지용 4섹션 Wix-grade 템플릿',
      visualStyle: 'conversion',
      density: 'commercial',
      qualityTier: 'premium',
      ctaGoal: '무료 체험 시작',
      sections: ['hero', 'proof', 'cta'],
      tags: ['프리미엄', 'SaaS', '제품', '무료체험'],
      document: { nodes: [] },
    } as unknown as PageTemplate;

    expect(getPageTemplateCategoryDisplayLabel('saas', 'zh-hant')).toBe('SaaS');
    expect(getPageTemplateStyleDisplayLabel('conversion', 'zh-hant')).toBe('轉換導向');
    expect(getPageTemplateDensityDisplayLabel('commercial', 'zh-hant')).toBe('商業型');
    expect(getPageTemplatePageTypeDisplayLabel('contact', 'en')).toBe('Contact');
    expect(getPageTemplateQualityTierDisplayLabel('under-review', 'zh-hant')).toBe('審核中');
    expect(getPageTemplateCtaGoalLabel(template, 'zh-hant')).toBe('開始免費試用');
    expect(getPageTemplateCtaGoalLabel(template, 'en')).toBe('Start free trial');
    expect(getPageTemplateSectionSummary(template, 'zh-hant')).toBe('3 個區段');
    expect(getPageTemplateSectionSummary(template, 'en')).toBe('3 sections');

    expect(getPageTemplatePreviewDescription(template, 'zh-hant')).toBe('適合快速建立「SaaS 功能」頁面的 3 個區段範本。');
    expect(getPageTemplatePreviewDescription(template, 'zh-hant')).not.toMatch(HANGUL);
    expect(getPageTemplatePreviewDescription(template, 'en')).toBe('A SaaS Features page template with 3 sections for a fast start.');
    expect(getPageTemplatePreviewDescription(template, 'en')).not.toMatch(CJK);
    expect(pageTemplatePreviewMatchesSearch(template, 'zh-hant', normalizeSearchTerm('免費試用'))).toBe(true);
    expect(pageTemplatePreviewMatchesSearch(template, 'en', normalizeSearchTerm('fast start'))).toBe(true);
  });

  it('keeps page template thumbnail cache entries locale-aware', () => {
    expect(buildThumbnailKey(320, 190, 'light', 'ko')).toBe('320x190@light:ko');
    expect(buildThumbnailKey(320, 190, 'light', 'zh-hant')).toBe('320x190@light:zh-hant');
    expect(buildThumbnailKey(320, 190, 'light', 'en')).toBe('320x190@light:en');
    expect(buildThumbnailKey(320, 190, 'light', 'ko')).not.toBe(buildThumbnailKey(320, 190, 'light', 'en'));
  });

  it('localizes text widget preset cards while preserving legacy search labels', () => {
    for (const preset of TEXT_WIDGET_PRESETS) {
      for (const locale of LOCALES) {
        const localized = localizeTextWidgetPreset(preset, locale);
        expect(localized.label, `${preset.id}/${locale}`).toBeTruthy();
        expect(localized.description, `${preset.id}/${locale}`).toBeTruthy();
      }

      expect(localizeTextWidgetPreset(preset, 'zh-hant').description, preset.id).not.toMatch(HANGUL);
      expect(localizeTextWidgetPreset(preset, 'en').label, preset.id).not.toMatch(CJK);
      expect(localizeTextWidgetPreset(preset, 'en').description, preset.id).not.toMatch(CJK);
    }

    const heading = TEXT_WIDGET_PRESETS.find((preset) => preset.id === 'heading-h1-h6');
    const inspector = TEXT_WIDGET_PRESETS.find((preset) => preset.id === 'inspector-rte');
    if (!heading || !inspector) throw new Error('Missing expected text widget presets');

    expect(localizeTextWidgetPreset(heading, 'ko')).toMatchObject({
      label: '제목 H1-H6',
      description: '레벨 전환 가능한 대제목',
      searchKeywords: expect.arrayContaining(['Heading H1-H6']),
    });
    expect(localizeTextWidgetPreset(inspector, 'zh-hant')).toMatchObject({
      label: '側欄富文字',
      description: '在側邊面板切換文字格式',
      searchKeywords: expect.arrayContaining(['Inspector RTE']),
    });
    expect(textWidgetMatchesSearch(localizeTextWidgetPreset(inspector, 'zh-hant'), normalizeSearchTerm('Inspector'))).toBe(true);
    expect(textWidgetMatchesSearch(localizeTextWidgetPreset(heading, 'zh-hant'), normalizeSearchTerm('標題'))).toBe(true);
  });

  it('localizes media widget preset cards while preserving legacy search labels', () => {
    for (const preset of MEDIA_WIDGET_PRESETS) {
      for (const locale of LOCALES) {
        const localized = localizeMediaWidgetPreset(preset, locale);
        expect(localized.label, `${preset.id}/${locale}`).toBeTruthy();
        expect(localized.description, `${preset.id}/${locale}`).toBeTruthy();
      }

      expect(localizeMediaWidgetPreset(preset, 'zh-hant').description, preset.id).not.toMatch(HANGUL);
      expect(localizeMediaWidgetPreset(preset, 'en').label, preset.id).not.toMatch(CJK);
      expect(localizeMediaWidgetPreset(preset, 'en').description, preset.id).not.toMatch(CJK);
    }

    const lightbox = MEDIA_WIDGET_PRESETS.find((preset) => preset.id === 'lightbox-trigger');
    const lottie = MEDIA_WIDGET_PRESETS.find((preset) => preset.id === 'lottie-animation');
    if (!lightbox || !lottie) throw new Error('Missing expected media widget presets');

    expect(localizeMediaWidgetPreset(lightbox, 'ko')).toMatchObject({
      label: '라이트박스 이미지',
      description: '클릭하면 전체 화면 이미지',
      searchKeywords: expect.arrayContaining(['Lightbox image']),
    });
    expect(localizeMediaWidgetPreset(lottie, 'zh-hant')).toMatchObject({
      label: 'Lottie 動畫',
      description: 'Lottie 網址、速度與循環',
      searchKeywords: expect.arrayContaining(['Lottie animation']),
    });
    expect(mediaWidgetMatchesSearch(localizeMediaWidgetPreset(lottie, 'zh-hant'), normalizeSearchTerm('Lottie'))).toBe(true);
    expect(mediaWidgetMatchesSearch(localizeMediaWidgetPreset(lightbox, 'zh-hant'), normalizeSearchTerm('燈箱'))).toBe(true);
  });

  it('localizes gallery widget preset cards while preserving legacy search labels', () => {
    for (const preset of GALLERY_WIDGET_PRESETS) {
      for (const locale of LOCALES) {
        const localized = localizeGalleryWidgetPreset(preset, locale);
        expect(localized.label, `${preset.id}/${locale}`).toBeTruthy();
        expect(localized.description, `${preset.id}/${locale}`).toBeTruthy();
      }

      expect(localizeGalleryWidgetPreset(preset, 'zh-hant').description, preset.id).not.toMatch(HANGUL);
      expect(localizeGalleryWidgetPreset(preset, 'en').label, preset.id).not.toMatch(CJK);
      expect(localizeGalleryWidgetPreset(preset, 'en').description, preset.id).not.toMatch(CJK);
    }

    const grid = GALLERY_WIDGET_PRESETS.find((preset) => preset.id === 'gallery-grid');
    const filter = GALLERY_WIDGET_PRESETS.find((preset) => preset.id === 'gallery-filter');
    if (!grid || !filter) throw new Error('Missing expected gallery widget presets');

    expect(localizeGalleryWidgetPreset(grid, 'ko')).toMatchObject({
      label: '그리드 갤러리',
      description: '균일 이미지 격자',
      searchKeywords: expect.arrayContaining(['Grid gallery']),
    });
    expect(localizeGalleryWidgetPreset(filter, 'zh-hant')).toMatchObject({
      label: '篩選圖庫',
      description: '顯示標籤篩選膠囊',
      searchKeywords: expect.arrayContaining(['Filtered gallery']),
    });
    expect(galleryWidgetMatchesSearch(localizeGalleryWidgetPreset(filter, 'zh-hant'), normalizeSearchTerm('Filtered'))).toBe(true);
    expect(galleryWidgetMatchesSearch(localizeGalleryWidgetPreset(grid, 'zh-hant'), normalizeSearchTerm('圖庫'))).toBe(true);
  });

  it('localizes layout widget preset cards while preserving legacy search labels', () => {
    for (const preset of LAYOUT_WIDGET_PRESETS) {
      for (const locale of LOCALES) {
        const localized = localizeLayoutWidgetPreset(preset, locale);
        expect(localized.label, `${preset.id}/${locale}`).toBeTruthy();
        expect(localized.description, `${preset.id}/${locale}`).toBeTruthy();
      }

      expect(localizeLayoutWidgetPreset(preset, 'zh-hant').description, preset.id).not.toMatch(HANGUL);
      expect(localizeLayoutWidgetPreset(preset, 'en').label, preset.id).not.toMatch(CJK);
      expect(localizeLayoutWidgetPreset(preset, 'en').description, preset.id).not.toMatch(CJK);
    }

    const strip = LAYOUT_WIDGET_PRESETS.find((preset) => preset.id === 'layout-strip');
    const story = LAYOUT_WIDGET_PRESETS.find((preset) => preset.id === 'designer-story-slideshow');
    if (!strip || !story) throw new Error('Missing expected layout widget presets');

    expect(localizeLayoutWidgetPreset(strip, 'ko')).toMatchObject({
      label: '스트립',
      description: '전폭 섹션 밴드',
      searchKeywords: expect.arrayContaining(['Strip']),
    });
    expect(localizeLayoutWidgetPreset(story, 'zh-hant')).toMatchObject({
      label: '故事幻燈片',
      description: '圖片覆蓋故事版面',
      searchKeywords: expect.arrayContaining(['Story slideshow']),
    });
    expect(layoutWidgetMatchesSearch(localizeLayoutWidgetPreset(story, 'zh-hant'), normalizeSearchTerm('Story'))).toBe(true);
    expect(layoutWidgetMatchesSearch(localizeLayoutWidgetPreset(strip, 'zh-hant'), normalizeSearchTerm('長條'))).toBe(true);
  });

  it('localizes interactive widget preset cards while preserving legacy search labels', () => {
    for (const preset of INTERACTIVE_WIDGET_PRESETS) {
      for (const locale of LOCALES) {
        const localized = localizeInteractiveWidgetPreset(preset, locale);
        expect(localized.label, `${preset.id}/${locale}`).toBeTruthy();
        expect(localized.description, `${preset.id}/${locale}`).toBeTruthy();
      }

      expect(localizeInteractiveWidgetPreset(preset, 'zh-hant').description, preset.id).not.toMatch(HANGUL);
      expect(localizeInteractiveWidgetPreset(preset, 'en').label, preset.id).not.toMatch(CJK);
      expect(localizeInteractiveWidgetPreset(preset, 'en').description, preset.id).not.toMatch(CJK);
    }

    const countdown = INTERACTIVE_WIDGET_PRESETS.find((preset) => preset.id === 'interactive-countdown-card');
    const lightbox = INTERACTIVE_WIDGET_PRESETS.find((preset) => preset.id === 'interactive-lightbox-trigger');
    if (!countdown || !lightbox) throw new Error('Missing expected interactive widget presets');

    expect(localizeInteractiveWidgetPreset(countdown, 'ko')).toMatchObject({
      label: '카드형 카운트다운',
      description: '카드형 카운트다운',
      searchKeywords: expect.arrayContaining(['Countdown card']),
    });
    expect(localizeInteractiveWidgetPreset(lightbox, 'zh-hant')).toMatchObject({
      label: '燈箱觸發器',
      description: 'lightbox:slug 觸發按鈕',
      searchKeywords: expect.arrayContaining(['Lightbox trigger']),
    });
    expect(interactiveWidgetMatchesSearch(localizeInteractiveWidgetPreset(lightbox, 'zh-hant'), normalizeSearchTerm('Lightbox'))).toBe(true);
    expect(interactiveWidgetMatchesSearch(localizeInteractiveWidgetPreset(countdown, 'zh-hant'), normalizeSearchTerm('倒數'))).toBe(true);
  });

  it('localizes navigation widget preset cards while preserving legacy search labels', () => {
    for (const preset of NAVIGATION_WIDGET_PRESETS) {
      for (const locale of LOCALES) {
        const localized = localizeNavigationWidgetPreset(preset, locale);
        expect(localized.label, `${preset.id}/${locale}`).toBeTruthy();
        expect(localized.description, `${preset.id}/${locale}`).toBeTruthy();
      }

      expect(localizeNavigationWidgetPreset(preset, 'zh-hant').description, preset.id).not.toMatch(HANGUL);
      expect(localizeNavigationWidgetPreset(preset, 'en').label, preset.id).not.toMatch(CJK);
      expect(localizeNavigationWidgetPreset(preset, 'en').description, preset.id).not.toMatch(CJK);
    }

    const dropdown = NAVIGATION_WIDGET_PRESETS.find((preset) => preset.id === 'nav-menu-dropdown');
    const slash = NAVIGATION_WIDGET_PRESETS.find((preset) => preset.id === 'nav-breadcrumbs-slash');
    if (!dropdown || !slash) throw new Error('Missing expected navigation widget presets');

    expect(localizeNavigationWidgetPreset(dropdown, 'ko')).toMatchObject({
      label: '드롭다운 메뉴',
      description: '드롭다운 계층',
      searchKeywords: expect.arrayContaining(['Dropdown menu']),
    });
    expect(localizeNavigationWidgetPreset(slash, 'zh-hant')).toMatchObject({
      label: '斜線麵包屑',
      description: '/ 分隔符',
      searchKeywords: expect.arrayContaining(['Breadcrumbs (slash)']),
    });
    expect(navigationWidgetMatchesSearch(localizeNavigationWidgetPreset(dropdown, 'zh-hant'), normalizeSearchTerm('Dropdown'))).toBe(true);
    expect(navigationWidgetMatchesSearch(localizeNavigationWidgetPreset(slash, 'zh-hant'), normalizeSearchTerm('麵包屑'))).toBe(true);
  });

  it('localizes social widget preset cards while preserving legacy search labels', () => {
    for (const preset of SOCIAL_WIDGET_PRESETS) {
      for (const locale of LOCALES) {
        const localized = localizeSocialWidgetPreset(preset, locale);
        expect(localized.label, `${preset.id}/${locale}`).toBeTruthy();
        expect(localized.description, `${preset.id}/${locale}`).toBeTruthy();
      }

      expect(localizeSocialWidgetPreset(preset, 'zh-hant').description, preset.id).not.toMatch(HANGUL);
      expect(localizeSocialWidgetPreset(preset, 'en').label, preset.id).not.toMatch(CJK);
      expect(localizeSocialWidgetPreset(preset, 'en').description, preset.id).not.toMatch(CJK);
    }

    const share = SOCIAL_WIDGET_PRESETS.find((preset) => preset.id === 'social-share');
    const kakao = SOCIAL_WIDGET_PRESETS.find((preset) => preset.id === 'social-floating-kakao');
    if (!share || !kakao) throw new Error('Missing expected social widget presets');

    expect(localizeSocialWidgetPreset(share, 'ko')).toMatchObject({
      label: '공유 버튼',
      description: '페이지 공유 4종',
      searchKeywords: expect.arrayContaining(['Share buttons']),
    });
    expect(localizeSocialWidgetPreset(kakao, 'zh-hant')).toMatchObject({
      label: 'Kakao 浮動聊天',
      description: 'Kakao 浮動按鈕',
      searchKeywords: expect.arrayContaining(['Kakao floating']),
    });
    expect(socialWidgetMatchesSearch(localizeSocialWidgetPreset(kakao, 'zh-hant'), normalizeSearchTerm('Kakao'))).toBe(true);
    expect(socialWidgetMatchesSearch(localizeSocialWidgetPreset(share, 'zh-hant'), normalizeSearchTerm('分享'))).toBe(true);
  });

  it('localizes location widget preset cards while preserving legacy search labels', () => {
    for (const preset of LOCATION_WIDGET_PRESETS) {
      for (const locale of LOCALES) {
        const localized = localizeLocationWidgetPreset(preset, locale);
        expect(localized.label, `${preset.id}/${locale}`).toBeTruthy();
        expect(localized.description, `${preset.id}/${locale}`).toBeTruthy();
      }

      expect(localizeLocationWidgetPreset(preset, 'zh-hant').description, preset.id).not.toMatch(HANGUL);
      expect(localizeLocationWidgetPreset(preset, 'en').label, preset.id).not.toMatch(CJK);
      expect(localizeLocationWidgetPreset(preset, 'en').description, preset.id).not.toMatch(CJK);
    }

    const address = LOCATION_WIDGET_PRESETS.find((preset) => preset.id === 'location-address-block');
    const multiMap = LOCATION_WIDGET_PRESETS.find((preset) => preset.id === 'location-multi-map');
    if (!address || !multiMap) throw new Error('Missing expected location widget presets');

    expect(localizeLocationWidgetPreset(address, 'ko')).toMatchObject({
      label: '주소 블록',
      description: '주소 + 길찾기',
      searchKeywords: expect.arrayContaining(['Address block']),
    });
    expect(localizeLocationWidgetPreset(multiMap, 'zh-hant')).toMatchObject({
      label: '多地點地圖',
      description: '多個地點',
      searchKeywords: expect.arrayContaining(['Multi-location map']),
    });
    expect(locationWidgetMatchesSearch(localizeLocationWidgetPreset(multiMap, 'zh-hant'), normalizeSearchTerm('Multi-location'))).toBe(true);
    expect(locationWidgetMatchesSearch(localizeLocationWidgetPreset(address, 'zh-hant'), normalizeSearchTerm('地址'))).toBe(true);
  });

  it('localizes decorative widget preset cards while preserving legacy search labels', () => {
    for (const preset of DECORATIVE_WIDGET_PRESETS) {
      for (const locale of LOCALES) {
        const localized = localizeDecorativeWidgetPreset(preset, locale);
        expect(localized.label, `${preset.id}/${locale}`).toBeTruthy();
        expect(localized.description, `${preset.id}/${locale}`).toBeTruthy();
      }

      expect(localizeDecorativeWidgetPreset(preset, 'zh-hant').description, preset.id).not.toMatch(HANGUL);
      expect(localizeDecorativeWidgetPreset(preset, 'en').label, preset.id).not.toMatch(CJK);
      expect(localizeDecorativeWidgetPreset(preset, 'en').description, preset.id).not.toMatch(CJK);
    }

    const blob = DECORATIVE_WIDGET_PRESETS.find((preset) => preset.id === 'decorative-shape-blob');
    const premiumTag = DECORATIVE_WIDGET_PRESETS.find((preset) => preset.id === 'decorative-designer-premium-tag');
    if (!blob || !premiumTag) throw new Error('Missing expected decorative widget presets');

    expect(localizeDecorativeWidgetPreset(blob, 'ko')).toMatchObject({
      label: '블롭 도형',
      description: '유기적인 블롭 도형',
      searchKeywords: expect.arrayContaining(['Blob shape']),
    });
    expect(localizeDecorativeWidgetPreset(premiumTag, 'zh-hant')).toMatchObject({
      label: '精選標籤',
      description: '小型重點徽章',
      searchKeywords: expect.arrayContaining(['Premium tag']),
    });
    expect(decorativeWidgetMatchesSearch(localizeDecorativeWidgetPreset(premiumTag, 'zh-hant'), normalizeSearchTerm('Premium'))).toBe(true);
    expect(decorativeWidgetMatchesSearch(localizeDecorativeWidgetPreset(blob, 'zh-hant'), normalizeSearchTerm('不規則'))).toBe(true);
  });

  it('localizes designer widget preset cards while preserving legacy search labels', () => {
    for (const preset of DESIGNER_WIDGET_PRESETS) {
      for (const locale of LOCALES) {
        const localized = localizeDesignerWidgetPreset(preset, locale);
        expect(localized.label, `${preset.id}/${locale}`).toBeTruthy();
        expect(localized.description, `${preset.id}/${locale}`).toBeTruthy();
      }

      expect(localizeDesignerWidgetPreset(preset, 'zh-hant').description, preset.id).not.toMatch(HANGUL);
      expect(localizeDesignerWidgetPreset(preset, 'en').label, preset.id).not.toMatch(CJK);
      expect(localizeDesignerWidgetPreset(preset, 'en').description, preset.id).not.toMatch(CJK);
    }

    const counter = DESIGNER_WIDGET_PRESETS.find((preset) => preset.id === 'designer-proof-counter');
    const timeline = DESIGNER_WIDGET_PRESETS.find((preset) => preset.id === 'designer-timeline-roadmap');
    if (!counter || !timeline) throw new Error('Missing expected designer widget presets');

    expect(localizeDesignerWidgetPreset(counter, 'ko')).toMatchObject({
      label: '성과 카운터',
      description: '성과 숫자 강조',
      searchKeywords: expect.arrayContaining(['Proof counter']),
    });
    expect(localizeDesignerWidgetPreset(timeline, 'zh-hant')).toMatchObject({
      label: '案件時間軸',
      description: '案件進度時間軸',
      searchKeywords: expect.arrayContaining(['Case timeline']),
    });
    expect(designerWidgetMatchesSearch(localizeDesignerWidgetPreset(timeline, 'zh-hant'), normalizeSearchTerm('Case timeline'))).toBe(true);
    expect(designerWidgetMatchesSearch(localizeDesignerWidgetPreset(counter, 'zh-hant'), normalizeSearchTerm('成果'))).toBe(true);
  });
});
