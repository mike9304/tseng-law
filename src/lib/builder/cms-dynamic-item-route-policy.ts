import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import {
  normalizeBuilderCmsDynamicItemRoutePolicies,
  type BuilderCmsDynamicItemRoutePolicy,
} from '@/lib/builder/cms-dynamic-item-route-policy-types';
import { normalizeOptionalSlugConflictRule } from '@/lib/builder/cms-slug-conflict-rule';
import { normalizeOptionalSlugPattern } from '@/lib/builder/cms-slug-pattern';
import { normalizeOptionalSlugSourceFieldKey } from '@/lib/builder/cms-slug-source-fields';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';
import { normalizeLocale } from '@/lib/locales';

export type SaveBuilderCmsDynamicItemRoutePolicyOptionsInput = {
  readonly policyName?: unknown;
  readonly sourceFieldKey?: unknown;
  readonly slugPattern?: unknown;
  readonly slugConflictRule?: unknown;
};

export type SaveBuilderCmsDynamicItemRoutePolicyInput = {
  readonly siteId: string;
  readonly localeInput: string | null | undefined;
  readonly collectionId: string;
  readonly pageId: string;
  readonly options: SaveBuilderCmsDynamicItemRoutePolicyOptionsInput;
  readonly actorLabel?: string;
};

export type DeleteBuilderCmsDynamicItemRoutePolicyInput = {
  readonly siteId: string;
  readonly localeInput: string | null | undefined;
  readonly collectionId: string;
  readonly pageId: string;
};

export async function readBuilderCmsDynamicItemRoutePoliciesForCollection(
  siteId: string,
  localeInput: string | null | undefined,
  collectionId: string,
): Promise<BuilderCmsDynamicItemRoutePolicy[]> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  return readBuilderCmsDynamicItemRoutePoliciesForCollectionFromSite(site, collectionId);
}

export function readBuilderCmsDynamicItemRoutePoliciesForCollectionFromSite(
  site: Pick<BuilderSiteDocument, 'dynamicItemRoutePolicies'>,
  collectionId: string,
): BuilderCmsDynamicItemRoutePolicy[] {
  return normalizeBuilderCmsDynamicItemRoutePolicies(site.dynamicItemRoutePolicies)
    .filter((policy) => policy.collectionId === collectionId);
}

export async function saveBuilderCmsDynamicItemRoutePolicyOptions({
  siteId,
  localeInput,
  collectionId,
  pageId,
  options,
  actorLabel,
}: SaveBuilderCmsDynamicItemRoutePolicyInput): Promise<BuilderCmsDynamicItemRoutePolicy | null> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const collection = findCollection(site, collectionId);
  const page = site.pages.find((candidate) => candidate.pageId === pageId);
  if (!collection || !page?.dynamicItem) return null;

  const dynamicCollectionId = page.dynamicItem.cmsCollectionId ?? page.dynamicItem.collectionId;
  if (dynamicCollectionId !== collectionId) return null;

  const now = new Date().toISOString();
  const policy: BuilderCmsDynamicItemRoutePolicy = {
    collectionId,
    pageId,
    policyName: normalizePolicyName(options.policyName),
    sourceFieldKey: normalizeOptionalSlugSourceFieldKey(
      options.sourceFieldKey,
      collection,
      page.dynamicItem.slugField,
    ) ?? '',
    slugPattern: normalizeOptionalSlugPattern(
      options.slugPattern,
      collection,
      page.dynamicItem.slugField,
    ) ?? '',
    slugConflictRule: normalizeOptionalSlugConflictRule(options.slugConflictRule) ?? 'next-available',
    updatedAt: now,
    updatedBy: normalizeActorLabel(actorLabel),
  };

  const policies = normalizeBuilderCmsDynamicItemRoutePolicies(site.dynamicItemRoutePolicies);
  site.dynamicItemRoutePolicies = [
    policy,
    ...policies.filter((candidate) => (
      candidate.collectionId !== collectionId || candidate.pageId !== pageId
    )),
  ];
  site.updatedAt = now;
  await writeSiteDocument(site);
  return policy;
}

export async function deleteBuilderCmsDynamicItemRoutePolicy({
  siteId,
  localeInput,
  collectionId,
  pageId,
}: DeleteBuilderCmsDynamicItemRoutePolicyInput): Promise<BuilderCmsDynamicItemRoutePolicy | null> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const collection = findCollection(site, collectionId);
  const page = site.pages.find((candidate) => candidate.pageId === pageId);
  if (!collection || !page?.dynamicItem) return null;

  const dynamicCollectionId = page.dynamicItem.cmsCollectionId ?? page.dynamicItem.collectionId;
  if (dynamicCollectionId !== collectionId) return null;

  const policies = normalizeBuilderCmsDynamicItemRoutePolicies(site.dynamicItemRoutePolicies);
  const deletedPolicy = policies.find((candidate) => (
    candidate.collectionId === collectionId && candidate.pageId === pageId
  ));
  if (!deletedPolicy) return null;

  const now = new Date().toISOString();
  site.dynamicItemRoutePolicies = policies.filter((candidate) => (
    candidate.collectionId !== collectionId || candidate.pageId !== pageId
  ));
  site.updatedAt = now;
  await writeSiteDocument(site);
  return deletedPolicy;
}

function findCollection(
  site: Pick<BuilderSiteDocument, 'cmsCollections'>,
  collectionId: string,
): BuilderCmsCollection | null {
  return site.cmsCollections?.find((collection) => collection.collectionId === collectionId) ?? null;
}

function normalizeActorLabel(input: string | undefined): string {
  return input?.trim().slice(0, 120) || 'admin';
}

function normalizePolicyName(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, 80);
}
