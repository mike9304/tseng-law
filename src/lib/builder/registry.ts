import {
  builderAboutSectionKeys,
  builderContactSectionKeys,
  type BuilderDatasetTargetId,
  builderHomeSectionKeys,
  type BuilderAboutSectionKey,
  type BuilderContactSectionKey,
  type BuilderEditableTargetKind,
  type BuilderHomeSectionKey,
  type BuilderPageKey,
  type BuilderSectionKey,
} from '@/lib/builder/types';

export interface BuilderSectionDefinition {
  sectionKey: BuilderSectionKey;
  title: string;
  componentName: string;
  description: string;
  supportedTargets: BuilderEditableTargetKind[];
  contentGroups?: readonly BuilderSectionContentGroupDefinition[];
  imageSurfaceIds?: readonly string[];
  textSurfaceIds?: readonly string[];
  buttonSurfaceIds?: readonly string[];
}

export interface BuilderSectionContentGroupDefinition {
  groupKey: string;
  label: string;
  surfaceIds?: readonly string[];
  datasetTargetIds?: readonly BuilderDatasetTargetId[];
}

export const homeInsightsImageSurfaceIds = [
  'featured-image',
  'list-image-01',
  'list-image-02',
  'list-image-03',
] as const;
export const homeHeroTextSurfaceIds = ['section-label', 'headline', 'subtitle'] as const;
export const homeHeroButtonSurfaceIds = ['columns-link'] as const;
export const homeInsightsTextSurfaceIds = ['section-label', 'headline', 'description'] as const;
export const homeInsightsButtonSurfaceIds = ['view-all-link'] as const;
export const homeServicesTextSurfaceIds = ['section-label', 'headline', 'description'] as const;
export const homeStatsTextSurfaceIds = ['section-label', 'headline', 'description'] as const;
export const homeFaqTextSurfaceIds = ['section-label', 'headline'] as const;
export const homeOfficesTextSurfaceIds = ['section-label', 'headline'] as const;
export const homeAttorneyImageSurfaceIds = ['lead-photo'] as const;
export const homeAttorneyTextSurfaceIds = [
  'section-label',
  'headline',
  'intro-primary',
  'intro-secondary',
  'summary',
  'contact-line',
] as const;
export const homeAttorneyButtonSurfaceIds = ['profile-link'] as const;
export const homeResultsTextSurfaceIds = [
  'section-label',
  'headline',
  'case-description',
  'case-summary',
] as const;
export const homeResultsButtonSurfaceIds = ['results-link'] as const;
export const homeContactTextSurfaceIds = ['section-label', 'headline', 'description'] as const;
export const homeContactButtonSurfaceIds = ['contact-link', 'phone-link'] as const;
export const homeHeroContentGroups = [
  {
    groupKey: 'copy',
    label: 'Hero copy',
    surfaceIds: [...homeHeroTextSurfaceIds, ...homeHeroButtonSurfaceIds],
  },
  {
    groupKey: 'search',
    label: 'Hero search',
  },
] as const satisfies readonly BuilderSectionContentGroupDefinition[];
export const homeInsightsContentGroups = [
  {
    groupKey: 'header',
    label: 'Insights header',
    surfaceIds: [...homeInsightsTextSurfaceIds],
  },
  {
    groupKey: 'feed',
    label: 'Insights feed',
    surfaceIds: [...homeInsightsImageSurfaceIds],
    datasetTargetIds: ['home.insights.feed'],
  },
  {
    groupKey: 'footer',
    label: 'Insights footer',
    surfaceIds: [...homeInsightsButtonSurfaceIds],
  },
] as const satisfies readonly BuilderSectionContentGroupDefinition[];
export const homeAttorneyContentGroups = [
  {
    groupKey: 'media',
    label: 'Attorney media',
    surfaceIds: [...homeAttorneyImageSurfaceIds],
  },
  {
    groupKey: 'copy',
    label: 'Attorney copy',
    surfaceIds: [...homeAttorneyTextSurfaceIds, ...homeAttorneyButtonSurfaceIds],
  },
] as const satisfies readonly BuilderSectionContentGroupDefinition[];
export const homeResultsContentGroups = [
  {
    groupKey: 'copy',
    label: 'Results copy',
    surfaceIds: [...homeResultsTextSurfaceIds, ...homeResultsButtonSurfaceIds],
  },
] as const satisfies readonly BuilderSectionContentGroupDefinition[];
export const homeContactContentGroups = [
  {
    groupKey: 'copy',
    label: 'Contact copy',
    surfaceIds: [...homeContactTextSurfaceIds],
  },
  {
    groupKey: 'actions',
    label: 'Contact actions',
    surfaceIds: [...homeContactButtonSurfaceIds],
  },
] as const satisfies readonly BuilderSectionContentGroupDefinition[];

export const aboutHeaderTextSurfaceIds = ['section-label', 'headline', 'description'] as const;
export const aboutIntroductionImageSurfaceIds = ['logo'] as const;
export const aboutIntroductionTextSurfaceIds = [
  'section-label',
  'headline',
  'subtitle',
] as const;
export const aboutIntroductionButtonSurfaceIds = ['source-link'] as const;
export const aboutAttorneyTextSurfaceIds = ['section-label', 'headline', 'description'] as const;
export const aboutContactTextSurfaceIds = [
  'section-label',
  'headline',
  'description',
  'inquiries-label',
  'locations-label',
] as const;
export const aboutContactButtonSurfaceIds = ['cta-link'] as const;

export const contactHeroTextSurfaceIds = ['section-label', 'headline', 'description'] as const;
export const contactGuideTextSurfaceIds = ['section-label', 'headline', 'description'] as const;
export const contactBlocksTextSurfaceIds = ['inquiries-label', 'locations-label'] as const;
export const contactBlocksButtonSurfaceIds = ['cta-link'] as const;
export const contactOfficesTextSurfaceIds = ['section-label', 'headline'] as const;

export const homeSectionDefinitions: BuilderSectionDefinition[] = [
  {
    sectionKey: 'home.hero',
    title: 'Hero',
    componentName: 'HeroSearch',
    description: '메인 검색형 히어로 섹션',
    supportedTargets: ['text', 'button', 'image'],
    contentGroups: homeHeroContentGroups,
    textSurfaceIds: homeHeroTextSurfaceIds,
    buttonSurfaceIds: homeHeroButtonSurfaceIds,
  },
  {
    sectionKey: 'home.insights',
    title: 'Insights',
    componentName: 'InsightsArchiveSection',
    description: '칼럼 아카이브 소개 섹션',
    supportedTargets: ['text', 'button', 'image'],
    contentGroups: homeInsightsContentGroups,
    imageSurfaceIds: homeInsightsImageSurfaceIds,
    textSurfaceIds: homeInsightsTextSurfaceIds,
    buttonSurfaceIds: homeInsightsButtonSurfaceIds,
  },
  {
    sectionKey: 'home.services',
    title: 'Services',
    componentName: 'ServicesBento',
    description: '업무 분야 카드 섹션',
    supportedTargets: ['text', 'button'],
    textSurfaceIds: homeServicesTextSurfaceIds,
  },
  {
    sectionKey: 'home.attorney',
    title: 'Attorney',
    componentName: 'HomeAttorneySplit',
    description: '대표 변호사 소개 섹션',
    supportedTargets: ['text', 'button', 'image'],
    contentGroups: homeAttorneyContentGroups,
    imageSurfaceIds: homeAttorneyImageSurfaceIds,
    textSurfaceIds: homeAttorneyTextSurfaceIds,
    buttonSurfaceIds: homeAttorneyButtonSurfaceIds,
  },
  {
    sectionKey: 'home.results',
    title: 'Results',
    componentName: 'HomeCaseResultsSplit',
    description: '사례/성과 섹션',
    supportedTargets: ['text', 'button', 'image'],
    contentGroups: homeResultsContentGroups,
    textSurfaceIds: homeResultsTextSurfaceIds,
    buttonSurfaceIds: homeResultsButtonSurfaceIds,
  },
  {
    sectionKey: 'home.stats',
    title: 'Stats',
    componentName: 'HomeStatsSection',
    description: '숫자 지표 섹션',
    supportedTargets: ['text'],
    textSurfaceIds: homeStatsTextSurfaceIds,
  },
  {
    sectionKey: 'home.faq',
    title: 'FAQ',
    componentName: 'FAQAccordion',
    description: '자주 묻는 질문 섹션',
    supportedTargets: ['text', 'button'],
    textSurfaceIds: homeFaqTextSurfaceIds,
  },
  {
    sectionKey: 'home.offices',
    title: 'Offices',
    componentName: 'OfficeMapTabs',
    description: '사무소 지도/연락처 섹션',
    supportedTargets: ['text', 'button', 'image'],
    textSurfaceIds: homeOfficesTextSurfaceIds,
  },
  {
    sectionKey: 'home.contact',
    title: 'Contact',
    componentName: 'HomeContactCta',
    description: '홈 하단 CTA 섹션',
    supportedTargets: ['text', 'button'],
    contentGroups: homeContactContentGroups,
    textSurfaceIds: homeContactTextSurfaceIds,
    buttonSurfaceIds: homeContactButtonSurfaceIds,
  },
];

export const aboutSectionDefinitions: BuilderSectionDefinition[] = [
  {
    sectionKey: 'about.header',
    title: 'About Header',
    componentName: 'PageHeader',
    description: '소개 페이지 헤더 섹션',
    supportedTargets: ['text'],
    textSurfaceIds: aboutHeaderTextSurfaceIds,
  },
  {
    sectionKey: 'about.introduction',
    title: 'Firm Introduction',
    componentName: 'FirmIntroductionSection',
    description: '법인 소개 카드 섹션',
    supportedTargets: ['text', 'button', 'image'],
    imageSurfaceIds: aboutIntroductionImageSurfaceIds,
    textSurfaceIds: aboutIntroductionTextSurfaceIds,
    buttonSurfaceIds: aboutIntroductionButtonSurfaceIds,
  },
  {
    sectionKey: 'about.attorney',
    title: 'Attorney Profiles',
    componentName: 'AttorneyProfileSection',
    description: '변호사 및 팀 소개 섹션',
    supportedTargets: ['text'],
    textSurfaceIds: aboutAttorneyTextSurfaceIds,
  },
  {
    sectionKey: 'about.contact',
    title: 'Contact Blocks',
    componentName: 'ContactBlocks',
    description: '문의 및 위치 안내 섹션',
    supportedTargets: ['text', 'button'],
    textSurfaceIds: aboutContactTextSurfaceIds,
    buttonSurfaceIds: aboutContactButtonSurfaceIds,
  },
];

export const contactSectionDefinitions: BuilderSectionDefinition[] = [
  {
    sectionKey: 'contact.hero',
    title: 'Contact Header',
    componentName: 'PageHeader',
    description: '연락처 페이지 헤더 섹션',
    supportedTargets: ['text'],
    textSurfaceIds: contactHeroTextSurfaceIds,
  },
  {
    sectionKey: 'contact.consultation-guide',
    title: 'Consultation Guide',
    componentName: 'ConsultationGuideSection',
    description: '상담 안내 카드 섹션',
    supportedTargets: ['text'],
    textSurfaceIds: contactGuideTextSurfaceIds,
  },
  {
    sectionKey: 'contact.contact-blocks',
    title: 'Contact Blocks',
    componentName: 'ContactBlocks',
    description: '문의 채널과 위치 카드 섹션',
    supportedTargets: ['text', 'button'],
    textSurfaceIds: contactBlocksTextSurfaceIds,
    buttonSurfaceIds: contactBlocksButtonSurfaceIds,
  },
  {
    sectionKey: 'contact.offices',
    title: 'Office Map Tabs',
    componentName: 'OfficeMapTabs',
    description: '사무소 탭 및 지도 섹션',
    supportedTargets: ['text'],
    textSurfaceIds: contactOfficesTextSurfaceIds,
  },
];

export const homeSectionRegistry = createSectionRegistry(homeSectionDefinitions);
export const aboutSectionRegistry = createSectionRegistry(aboutSectionDefinitions);
export const contactSectionRegistry = createSectionRegistry(contactSectionDefinitions);

export const builderSectionDefinitionsByPage = {
  home: homeSectionDefinitions,
  about: aboutSectionDefinitions,
  contact: contactSectionDefinitions,
} as const satisfies Record<BuilderPageKey, BuilderSectionDefinition[]>;

export const builderSectionRegistry = {
  ...homeSectionRegistry,
  ...aboutSectionRegistry,
  ...contactSectionRegistry,
} as const;

export function getBuilderSectionDefinitions(pageKey: BuilderPageKey): BuilderSectionDefinition[] {
  return builderSectionDefinitionsByPage[pageKey];
}

export function getBuilderSectionDefinition(sectionKey: BuilderSectionKey): BuilderSectionDefinition {
  return builderSectionRegistry[sectionKey];
}

export function isRegisteredHomeSectionKey(value: string): value is BuilderHomeSectionKey {
  return builderHomeSectionKeys.includes(value as BuilderHomeSectionKey);
}

export function isRegisteredAboutSectionKey(value: string): value is BuilderAboutSectionKey {
  return builderAboutSectionKeys.includes(value as BuilderAboutSectionKey);
}

export function isRegisteredContactSectionKey(value: string): value is BuilderContactSectionKey {
  return builderContactSectionKeys.includes(value as BuilderContactSectionKey);
}

export function isDeclaredHomeImageSurfaceId(sectionKey: BuilderSectionKey, surfaceId: string) {
  return homeSectionRegistry[sectionKey as BuilderHomeSectionKey]?.imageSurfaceIds?.includes(surfaceId) ?? false;
}

export function isDeclaredHomeTextSurfaceId(sectionKey: BuilderSectionKey, surfaceId: string) {
  return homeSectionRegistry[sectionKey as BuilderHomeSectionKey]?.textSurfaceIds?.includes(surfaceId) ?? false;
}

export function isDeclaredHomeButtonSurfaceId(sectionKey: BuilderSectionKey, surfaceId: string) {
  return homeSectionRegistry[sectionKey as BuilderHomeSectionKey]?.buttonSurfaceIds?.includes(surfaceId) ?? false;
}

export function getBuilderSectionContentGroups(sectionKey: BuilderSectionKey) {
  return builderSectionRegistry[sectionKey]?.contentGroups ?? [];
}

export function buildBuilderContentGroupNodeId(sectionKey: BuilderSectionKey, groupKey: string) {
  return `${sectionKey}:group:${groupKey}`;
}

function createSectionRegistry<TSectionKey extends BuilderSectionKey>(
  definitions: readonly BuilderSectionDefinition[]
): Record<TSectionKey, BuilderSectionDefinition> {
  return Object.fromEntries(
    definitions.map((definition) => [definition.sectionKey, definition])
  ) as Record<TSectionKey, BuilderSectionDefinition>;
}
