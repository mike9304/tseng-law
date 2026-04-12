import type { BuilderDynamicTemplateId } from '@/lib/builder/dynamic-templates';
import type { BuilderPageKey } from '@/lib/builder/types';
import { normalizeLocale } from '@/lib/locales';

export const builderStarterTemplateIds = [
  'home-editorial',
  'about-firm',
  'contact-intake',
  'columns-list',
  'column-detail',
  'services-list',
  'service-detail',
  'lawyers-list',
  'lawyer-detail',
] as const;

export type BuilderStarterTemplateId = (typeof builderStarterTemplateIds)[number];
export type BuilderStarterTemplateCategory =
  | 'landing'
  | 'firm'
  | 'contact'
  | 'content'
  | 'service'
  | 'team';
export type BuilderStarterTemplateSupport =
  | 'editable-now'
  | 'preview-now'
  | 'ownership-only';
export type BuilderStarterTemplateEntryKind = 'builder-page' | 'dynamic-template';

export interface BuilderStarterTemplateSummary {
  templateId: BuilderStarterTemplateId;
  title: string;
  category: BuilderStarterTemplateCategory;
  description: string;
  support: BuilderStarterTemplateSupport;
  entryKind: BuilderStarterTemplateEntryKind;
  pageKey: BuilderPageKey | null;
  dynamicTemplateId: BuilderDynamicTemplateId | null;
  livePath: string;
  focus: string;
}

export interface BuilderStarterTemplateDetail extends BuilderStarterTemplateSummary {
  capabilities: string[];
  exclusions: string[];
}

export interface BuilderSiteStarterTemplateEntry {
  templateId: BuilderStarterTemplateId;
  category: BuilderStarterTemplateCategory;
  support: BuilderStarterTemplateSupport;
  entryKind: BuilderStarterTemplateEntryKind;
  pageKey: BuilderPageKey | null;
  dynamicTemplateId: BuilderDynamicTemplateId | null;
  livePath: string;
}

type BuilderStarterTemplateDefinition = {
  templateId: BuilderStarterTemplateId;
  title: string;
  category: BuilderStarterTemplateCategory;
  description: string;
  support: BuilderStarterTemplateSupport;
  entryKind: BuilderStarterTemplateEntryKind;
  pageKey: BuilderPageKey | null;
  dynamicTemplateId: BuilderDynamicTemplateId | null;
  livePath: string;
  focus: string;
  capabilities: string[];
  exclusions: string[];
};

const builderStarterTemplateDefinitions: readonly BuilderStarterTemplateDefinition[] = [
  {
    templateId: 'home-editorial',
    title: 'Home editorial starter',
    category: 'landing',
    description: 'Hero, services, authority, FAQ, and CTA composition for the main landing page.',
    support: 'editable-now',
    entryKind: 'builder-page',
    pageKey: 'home',
    dynamicTemplateId: null,
    livePath: '/',
    focus: 'Best current builder surface for direct confirmation.',
    capabilities: [
      'Open in builder edit mode immediately.',
      'Supports section editing, visibility, lock, dataset limit seam, and responsive section layout.',
      'Shares the real draft/publish and revision pipeline.',
    ],
    exclusions: [
      'Still section/document-oriented rather than freeform canvas parity.',
      'Does not yet support arbitrary element drag geometry or complete Wix Studio controls.',
    ],
  },
  {
    templateId: 'about-firm',
    title: 'About firm starter',
    category: 'firm',
    description: 'Firm story, introduction, attorney profile, and office credibility composition.',
    support: 'preview-now',
    entryKind: 'builder-page',
    pageKey: 'about',
    dynamicTemplateId: null,
    livePath: '/about',
    focus: 'Ready for preview confirmation, not interactive editing.',
    capabilities: [
      'Open in builder preview mode.',
      'Uses the same builder-owned static page foundation and published snapshot parity path.',
    ],
    exclusions: [
      'No interactive editor yet.',
      'No template instantiation flow yet.',
    ],
  },
  {
    templateId: 'contact-intake',
    title: 'Contact intake starter',
    category: 'contact',
    description: 'Consultation CTA, office blocks, guide content, and contact conversion layout.',
    support: 'preview-now',
    entryKind: 'builder-page',
    pageKey: 'contact',
    dynamicTemplateId: null,
    livePath: '/contact',
    focus: 'Ready for preview confirmation, not interactive editing.',
    capabilities: [
      'Open in builder preview mode.',
      'Uses the same builder-owned static page foundation and published snapshot parity path.',
    ],
    exclusions: [
      'No interactive editor yet.',
      'No template instantiation flow yet.',
    ],
  },
  {
    templateId: 'columns-list',
    title: 'Columns list starter',
    category: 'content',
    description: 'Content feed page starter backed by the columns collection route.',
    support: 'ownership-only',
    entryKind: 'dynamic-template',
    pageKey: null,
    dynamicTemplateId: 'columns.list-template',
    livePath: '/columns',
    focus: 'Route and template ownership are explicit; editing is deferred.',
    capabilities: [
      'Open template ownership detail.',
      'Open live route for visual confirmation.',
    ],
    exclusions: [
      'No list template editor.',
      'No dataset-driven list page document yet.',
    ],
  },
  {
    templateId: 'column-detail',
    title: 'Column detail starter',
    category: 'content',
    description: 'Article detail starter backed by the columns item route.',
    support: 'ownership-only',
    entryKind: 'dynamic-template',
    pageKey: null,
    dynamicTemplateId: 'columns.item-template',
    livePath: '/columns/taiwan-company-establishment-basics',
    focus: 'Ownership is explicit; record-scoped preview is deferred.',
    capabilities: [
      'Open template ownership detail.',
      'Open a real live article route.',
    ],
    exclusions: [
      'No record-scoped builder preview renderer.',
      'No item template editor.',
    ],
  },
  {
    templateId: 'services-list',
    title: 'Services list starter',
    category: 'service',
    description: 'Practice-area overview starter backed by the service areas list route.',
    support: 'ownership-only',
    entryKind: 'dynamic-template',
    pageKey: null,
    dynamicTemplateId: 'service-areas.list-template',
    livePath: '/services',
    focus: 'Service vertical starter is cataloged, not yet builder-editable.',
    capabilities: [
      'Open template ownership detail.',
      'Open live route for visual confirmation.',
    ],
    exclusions: [
      'No list template editor.',
      'No starter duplication or instantiation flow yet.',
    ],
  },
  {
    templateId: 'service-detail',
    title: 'Service detail starter',
    category: 'service',
    description: 'Practice-area detail starter with related content and authority composition.',
    support: 'ownership-only',
    entryKind: 'dynamic-template',
    pageKey: null,
    dynamicTemplateId: 'service-areas.item-template',
    livePath: '/services/investment',
    focus: 'Detail template ownership is explicit; record-scoped editing is deferred.',
    capabilities: [
      'Open template ownership detail.',
      'Open a real live service detail route.',
    ],
    exclusions: [
      'No record-scoped builder preview renderer.',
      'No item template editor.',
    ],
  },
  {
    templateId: 'lawyers-list',
    title: 'Lawyers list starter',
    category: 'team',
    description: 'Team overview starter backed by the attorney profiles list route.',
    support: 'ownership-only',
    entryKind: 'dynamic-template',
    pageKey: null,
    dynamicTemplateId: 'attorney-profiles.list-template',
    livePath: '/lawyers',
    focus: 'Team starter is cataloged and reviewable.',
    capabilities: [
      'Open template ownership detail.',
      'Open live route for visual confirmation.',
    ],
    exclusions: [
      'No list template editor.',
      'No member/profile integration beyond current site runtime.',
    ],
  },
  {
    templateId: 'lawyer-detail',
    title: 'Lawyer detail starter',
    category: 'team',
    description: 'Attorney profile detail starter with FAQ, proof, and conversion structure.',
    support: 'ownership-only',
    entryKind: 'dynamic-template',
    pageKey: null,
    dynamicTemplateId: 'attorney-profiles.item-template',
    livePath: '/lawyers/wei-tseng',
    focus: 'Detail ownership is explicit; editor parity is deferred.',
    capabilities: [
      'Open template ownership detail.',
      'Open a real live lawyer profile route.',
    ],
    exclusions: [
      'No record-scoped builder preview renderer.',
      'No item template editor.',
    ],
  },
];

export function isBuilderStarterTemplateId(
  value: string | null | undefined
): value is BuilderStarterTemplateId {
  return builderStarterTemplateIds.includes(value as BuilderStarterTemplateId);
}

export function decodeBuilderStarterTemplateParam(
  value: string
): BuilderStarterTemplateId | null {
  try {
    const decoded = decodeURIComponent(value);
    return isBuilderStarterTemplateId(decoded) ? decoded : null;
  } catch {
    return null;
  }
}

export function readBuilderStarterTemplateSummaries(
  localeInput: string | null | undefined
): BuilderStarterTemplateSummary[] {
  const locale = normalizeLocale(localeInput ?? undefined);

  return builderStarterTemplateDefinitions.map((template) => ({
    templateId: template.templateId,
    title: template.title,
    category: template.category,
    description: template.description,
    support: template.support,
    entryKind: template.entryKind,
    pageKey: template.pageKey,
    dynamicTemplateId: template.dynamicTemplateId,
    livePath: `/${locale}${template.livePath === '/' ? '' : template.livePath}`,
    focus: template.focus,
  }));
}

export function readBuilderStarterTemplateDetail(
  templateId: BuilderStarterTemplateId,
  localeInput: string | null | undefined
): BuilderStarterTemplateDetail {
  const locale = normalizeLocale(localeInput ?? undefined);
  const template = builderStarterTemplateDefinitions.find((candidate) => candidate.templateId === templateId);

  if (!template) {
    throw new Error(`Unknown builder starter template detail: ${templateId}`);
  }

  return {
    templateId: template.templateId,
    title: template.title,
    category: template.category,
    description: template.description,
    support: template.support,
    entryKind: template.entryKind,
    pageKey: template.pageKey,
    dynamicTemplateId: template.dynamicTemplateId,
    livePath: `/${locale}${template.livePath === '/' ? '' : template.livePath}`,
    focus: template.focus,
    capabilities: [...template.capabilities],
    exclusions: [...template.exclusions],
  };
}

export function readBuilderStarterTemplateEntries(
  localeInput: string | null | undefined
): BuilderSiteStarterTemplateEntry[] {
  return readBuilderStarterTemplateSummaries(localeInput).map((template) => ({
    templateId: template.templateId,
    category: template.category,
    support: template.support,
    entryKind: template.entryKind,
    pageKey: template.pageKey,
    dynamicTemplateId: template.dynamicTemplateId,
    livePath: template.livePath,
  }));
}
