import {
  homeSectionRegistry,
  isDeclaredHomeButtonSurfaceId,
  isDeclaredHomeImageSurfaceId,
  isDeclaredHomeTextSurfaceId,
} from '@/lib/builder/registry';
import {
  parseBuilderAssetUrl,
  readBuilderImageAsset,
  type BuilderAssetUrlReference,
} from '@/lib/builder/assets';
import type {
  BuilderHomeDocumentState,
  BuilderPageState,
  BuilderPageSnapshot,
  BuilderSurfaceOverride,
} from '@/lib/builder/types';

export type BuilderPublishValidationIssueCode =
  | 'invalid_override_key'
  | 'unregistered_image_surface'
  | 'unregistered_text_surface'
  | 'unregistered_button_surface'
  | 'invalid_builder_asset_url'
  | 'builder_asset_locale_mismatch'
  | 'builder_asset_not_found';

export interface BuilderPublishValidationIssue {
  code: BuilderPublishValidationIssueCode;
  message: string;
  sectionId: string;
  sectionKey: string;
  sectionTitle: string;
  surfaceId: string;
  src: string;
  asset?: BuilderAssetUrlReference;
}

export class BuilderPublishValidationError extends Error {
  readonly issues: BuilderPublishValidationIssue[];

  constructor(issues: BuilderPublishValidationIssue[]) {
    super('Builder publish validation failed');
    this.name = 'BuilderPublishValidationError';
    this.issues = issues;
  }
}

export async function validateBuilderSnapshotForPublish(
  snapshot: BuilderPageSnapshot<BuilderPageState>
): Promise<void> {
  switch (snapshot.pageKey) {
    case 'home':
      await validateBuilderHomeSnapshotForPublish(snapshot as BuilderPageSnapshot<BuilderHomeDocumentState>);
      return;
    case 'about':
    case 'contact':
      return;
    default:
      return;
  }
}

export async function validateBuilderHomeSnapshotForPublish(
  snapshot: BuilderPageSnapshot<BuilderHomeDocumentState>
): Promise<void> {
  const issues = await collectBuilderHomePublishIssues(snapshot);
  if (issues.length > 0) {
    throw new BuilderPublishValidationError(issues);
  }
}

async function collectBuilderHomePublishIssues(
  snapshot: BuilderPageSnapshot<BuilderHomeDocumentState>
): Promise<BuilderPublishValidationIssue[]> {
  const sectionById = new Map(
    snapshot.document.root.children.map((section) => [section.id, section] as const)
  );
  const assetCache = new Map<string, boolean>();
  const issues: BuilderPublishValidationIssue[] = [];

  for (const [rawKey, override] of Object.entries(snapshot.state.overrides)) {
    if (!override) continue;

    const keyParts = rawKey.split(':');
    const sectionId = keyParts[0] || '';
    const surfaceId = keyParts.slice(1).join(':') || '';
    const section = sectionById.get(sectionId);
    const sectionKey = section?.sectionKey ?? 'unknown';
    const sectionTitle = section
      ? section.name || homeSectionRegistry[section.sectionKey].title
      : 'Unknown section';

    if (!section || !surfaceId) {
      issues.push({
        code: 'invalid_override_key',
        message: 'This edited image no longer matches a valid section in the current document.',
        sectionId,
        sectionKey,
        sectionTitle,
        surfaceId,
        src: normalizeImageSource(override),
      });
      continue;
    }

    if (override.kind === 'text' && !isDeclaredHomeTextSurfaceId(section.sectionKey, surfaceId)) {
      issues.push({
        code: 'unregistered_text_surface',
        message: `${sectionTitle} uses a text slot that is not registered for publishing yet.`,
        sectionId,
        sectionKey,
        sectionTitle,
        surfaceId,
        src: normalizeImageSource(override),
      });
      continue;
    }

    if (override.kind === 'button' && !isDeclaredHomeButtonSurfaceId(section.sectionKey, surfaceId)) {
      issues.push({
        code: 'unregistered_button_surface',
        message: `${sectionTitle} uses a button slot that is not registered for publishing yet.`,
        sectionId,
        sectionKey,
        sectionTitle,
        surfaceId,
        src: normalizeImageSource(override),
      });
      continue;
    }

    if (override.kind !== 'image') {
      continue;
    }

    if (!isDeclaredHomeImageSurfaceId(section.sectionKey, surfaceId)) {
      issues.push({
        code: 'unregistered_image_surface',
        message: `${sectionTitle} uses an image slot that is not registered for publishing yet.`,
        sectionId,
        sectionKey,
        sectionTitle,
        surfaceId,
        src: normalizeImageSource(override),
      });
      continue;
    }

    const src = normalizeImageSource(override);
    if (!src) continue;

    const parsed = parseBuilderAssetUrl(src);
    if (!parsed) {
      issues.push({
        code: 'invalid_builder_asset_url',
        message: `${sectionTitle} must use an image from builder-managed asset storage before publish.`,
        sectionId,
        sectionKey,
        sectionTitle,
        surfaceId,
        src,
      });
      continue;
    }

    if (parsed.locale !== snapshot.locale) {
      issues.push({
        code: 'builder_asset_locale_mismatch',
        message: `${sectionTitle} points to an asset from a different locale.`,
        sectionId,
        sectionKey,
        sectionTitle,
        surfaceId,
        src,
        asset: parsed,
      });
      continue;
    }

    const cacheKey = `${parsed.locale}:${parsed.filename}`;
    let exists = assetCache.get(cacheKey);
    if (exists === undefined) {
      exists = Boolean(
        await readBuilderImageAsset({
          locale: parsed.locale,
          assetPath: [parsed.filename],
        })
      );
      assetCache.set(cacheKey, exists);
    }

    if (!exists) {
      issues.push({
        code: 'builder_asset_not_found',
        message: `${sectionTitle} points to an image file that is missing from builder storage.`,
        sectionId,
        sectionKey,
        sectionTitle,
        surfaceId,
        src,
        asset: parsed,
      });
    }
  }

  return issues;
}

function normalizeImageSource(override: BuilderSurfaceOverride) {
  return typeof override.src === 'string' ? override.src.trim() : '';
}
