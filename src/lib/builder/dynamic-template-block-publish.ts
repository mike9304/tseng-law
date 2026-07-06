import {
  readBuilderDynamicTemplateDetail,
  type BuilderDynamicTemplateId,
} from '@/lib/builder/dynamic-templates';
import {
  BuilderDynamicTemplateDraftMissingError,
  publishBuilderDynamicTemplateDraft,
  readBuilderDynamicTemplateDraft,
  readBuilderDynamicTemplatePublished,
  type BuilderDynamicTemplateDraftReadResult,
  type BuilderDynamicTemplateDraftSnapshot,
} from '@/lib/builder/dynamic-template-drafts';
import {
  publishAtomic,
  type AtomicPublishOutcome,
} from '@/lib/builder/publish-gate/atomic-publish-orchestrator';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';

export type PublishDynamicTemplateBlockStatus = 'published' | 'cms-publish-failed';

export interface PublishDynamicTemplateBlockInput {
  siteId: string;
  templateId: BuilderDynamicTemplateId;
  locale: Locale;
  updatedBy: string;
}

export interface PublishDynamicTemplateBlockOutcome {
  status: PublishDynamicTemplateBlockStatus;
  templateCollectionId: string;
  referencedCollectionIds: string[];
  cmsPublish: AtomicPublishOutcome | null;
  draft: BuilderDynamicTemplateDraftReadResult;
  published: BuilderDynamicTemplateDraftReadResult;
  snapshot: BuilderDynamicTemplateDraftSnapshot;
}

export async function publishDynamicTemplateBlockDraft(
  input: PublishDynamicTemplateBlockInput,
): Promise<PublishDynamicTemplateBlockOutcome> {
  const detail = readBuilderDynamicTemplateDetail(input.templateId, input.locale);
  const draft = await readBuilderDynamicTemplateDraft(input.templateId, input.locale);
  if (!draft.persisted) {
    throw new BuilderDynamicTemplateDraftMissingError(input.templateId, input.locale);
  }

  const currentPublished = await readBuilderDynamicTemplatePublished(input.templateId, input.locale);
  const referencedCollectionIds = await resolveSiteOwnedTemplateCollections(
    input.siteId,
    input.locale,
    detail.collectionId,
  );

  if (referencedCollectionIds.length > 0) {
    const cmsPublish = await publishAtomic({
      siteId: input.siteId,
      locale: input.locale,
      pageIds: [],
      cmsCollectionIds: referencedCollectionIds,
    });
    if (!cmsPublish.ok) {
      return {
        status: 'cms-publish-failed',
        templateCollectionId: detail.collectionId,
        referencedCollectionIds,
        cmsPublish,
        draft,
        published: currentPublished,
        snapshot: currentPublished.snapshot,
      };
    }

    return publishTemplateSnapshot(input, draft, detail.collectionId, referencedCollectionIds, cmsPublish);
  }

  return publishTemplateSnapshot(input, draft, detail.collectionId, referencedCollectionIds, null);
}

async function publishTemplateSnapshot(
  input: PublishDynamicTemplateBlockInput,
  draft: BuilderDynamicTemplateDraftReadResult,
  templateCollectionId: string,
  referencedCollectionIds: string[],
  cmsPublish: AtomicPublishOutcome | null,
): Promise<PublishDynamicTemplateBlockOutcome> {
  const published = await publishBuilderDynamicTemplateDraft({
    templateId: input.templateId,
    locale: input.locale,
    updatedBy: input.updatedBy,
  });
  const nextPublished = await readBuilderDynamicTemplatePublished(input.templateId, input.locale);
  return {
    status: 'published',
    templateCollectionId,
    referencedCollectionIds,
    cmsPublish,
    draft,
    published: nextPublished,
    snapshot: published.snapshot,
  };
}

async function resolveSiteOwnedTemplateCollections(
  siteId: string,
  locale: Locale,
  templateCollectionId: string,
): Promise<string[]> {
  const site = await readSiteDocument(siteId, locale);
  return hasCmsCollection(site, templateCollectionId) ? [templateCollectionId] : [];
}

function hasCmsCollection(site: BuilderSiteDocument, collectionId: string): boolean {
  return site.cmsCollections?.some((collection) => collection.collectionId === collectionId) ?? false;
}
