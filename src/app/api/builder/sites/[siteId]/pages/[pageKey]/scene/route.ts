import { NextResponse } from 'next/server';
import { buildBuilderSceneDocument, summarizeBuilderSceneDocument } from '@/lib/builder/scene';
import {
  isBuilderPageKey,
  isDefaultBuilderSiteId,
  readBuilderPageSnapshotOverview,
} from '@/lib/builder/site';
import { normalizeLocale } from '@/lib/locales';

type BuilderPageSceneRouteContext = {
  params: Promise<{
    siteId: string;
    pageKey: string;
  }>;
};

export async function GET(request: Request, context: BuilderPageSceneRouteContext) {
  const { siteId, pageKey } = await context.params;
  const locale = normalizeLocale(new URL(request.url).searchParams.get('locale') ?? undefined);

  if (!isDefaultBuilderSiteId(siteId)) {
    return NextResponse.json({ error: `Unknown builder site: ${siteId}` }, { status: 404 });
  }

  if (!isBuilderPageKey(pageKey)) {
    return NextResponse.json({ error: `Unknown builder page: ${pageKey}` }, { status: 404 });
  }

  const overview = await readBuilderPageSnapshotOverview(pageKey, locale);
  const scene = buildBuilderSceneDocument(overview.preferred.snapshot.snapshot.document);
  const summary = summarizeBuilderSceneDocument(scene);

  return NextResponse.json({
    workspace: overview.workspace,
    site: overview.site,
    page: overview.page,
    snapshot: {
      source: overview.preferred.source,
      kind: overview.preferred.snapshot.kind,
      revision: overview.preferred.snapshot.revision,
      savedAt: overview.preferred.snapshot.savedAt,
    },
    summary,
    scene,
  });
}
