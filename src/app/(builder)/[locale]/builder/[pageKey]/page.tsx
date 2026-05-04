import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import type { ColumnPost } from '@/lib/columns';
import { getAllColumnPostsIncludingBlob } from '@/lib/consultation/columns-blob-reader';
import { faqContent } from '@/data/faq-content';
import { pageCopy } from '@/data/page-copy';
import BuilderInteractiveHomePreview from '@/components/builder/BuilderInteractiveHomePreview';
import BuilderPublishedAboutRenderer from '@/components/builder/BuilderPublishedAboutRenderer';
import BuilderPublishedContactRenderer from '@/components/builder/BuilderPublishedContactRenderer';
import BuilderPageWorkspaceShell from '@/components/builder/BuilderPageWorkspaceShell';
import BuilderReadonlyHomePreview from '@/components/builder/BuilderReadonlyHomePreview';
import BuilderReadonlyPagePreview from '@/components/builder/BuilderReadonlyPagePreview';
import {
  readBuilderPageDatasetOverviews,
  resolveInsightsDatasetPosts,
} from '@/lib/builder/datasets';
import {
  buildBuilderPageHref,
  getBuilderPageConfig,
  isBuilderPageKey,
  readBuilderSiteOverview,
  readPreferredBuilderPreviewSnapshot,
  resolveBuilderEditorMode,
} from '@/lib/builder/site';
import {
  type BuilderHomeDocumentState,
  type BuilderPageDocument,
  type BuilderPageState,
  type BuilderStaticDocumentState,
} from '@/lib/builder/types';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

type BuilderPageProps = {
  params: { locale: Locale; pageKey: string };
  searchParams?: { mode?: string };
};

export function generateMetadata({ params }: { params: { locale: Locale; pageKey: string } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const pageKey = isBuilderPageKey(params.pageKey) ? params.pageKey : 'home';
  const config = getBuilderPageConfig(pageKey);

  return buildSeoMetadata({
    locale,
    title: `${config.title} Builder`,
    description: config.description,
    path: `/builder/${pageKey}`,
    noindex: true,
  });
}

export default async function BuilderPageRoute({ params, searchParams }: BuilderPageProps) {
  const locale = normalizeLocale(params.locale);

  if (!isBuilderPageKey(params.pageKey)) {
    notFound();
  }

  const pageKey = params.pageKey;
  const config = getBuilderPageConfig(pageKey);
  const requestedMode = resolveBuilderEditorMode(searchParams?.mode, {
    fallback: config.availableModes[0] ?? 'preview',
  });

  if (!config.availableModes.includes(requestedMode)) {
    redirect(buildBuilderPageHref(locale, pageKey, config.availableModes[0] ?? 'preview'));
  }

  const overview = await readBuilderSiteOverview(locale);
  const snapshot = await readPreferredBuilderPreviewSnapshot(pageKey, locale);
  const allPosts = pageKey === 'home' ? await getAllColumnPostsIncludingBlob(locale) : [];
  const resolvedPosts =
    pageKey === 'home' ? resolveInsightsDatasetPosts(snapshot.snapshot.document, allPosts) : [];
  const faqItems = pageKey === 'home' ? faqContent[locale] : null;
  const datasetOverviews = readBuilderPageDatasetOverviews(
    pageKey,
    snapshot.snapshot.document,
    locale,
    allPosts
  );
  const policyNotes = buildModePolicyNotes({ pageKey, requestedMode });

  return (
    <BuilderPageWorkspaceShell
      locale={locale}
      pageKey={pageKey}
      title={config.title}
      description={config.description}
      requestedMode={requestedMode}
      availableModes={config.availableModes}
      editable={config.editable}
      workspace={overview.workspace}
      site={overview.site}
      pages={overview.pages}
      datasetOverviews={datasetOverviews}
      snapshot={{
        persisted: snapshot.persisted,
        kind: snapshot.snapshot.kind,
        revision: snapshot.snapshot.revision,
        savedAt: snapshot.persisted ? snapshot.snapshot.savedAt : null,
      }}
      policyNotes={policyNotes}
    >
      {pageKey === 'home' && requestedMode === 'edit' && faqItems ? (
        <BuilderInteractiveHomePreview
          locale={locale}
          document={snapshot.snapshot.document}
          posts={resolvedPosts}
          faqItems={faqItems}
          presentation="embedded"
        />
      ) : (
        renderReadonlyPage({
          locale,
          pageKey,
          snapshotDocument: snapshot.snapshot.document,
          snapshotState: snapshot.snapshot.state,
          allPosts,
        })
      )}
    </BuilderPageWorkspaceShell>
  );
}

function renderReadonlyPage({
  locale,
  pageKey,
  snapshotDocument,
  snapshotState,
  allPosts,
}: {
  locale: Locale;
  pageKey: 'home' | 'about' | 'contact';
  snapshotDocument: BuilderPageDocument;
  snapshotState: BuilderPageState;
  allPosts: ColumnPost[];
}) {
  switch (pageKey) {
    case 'home': {
      const faqItems = faqContent[locale];

      return (
        <BuilderReadonlyHomePreview
          locale={locale}
          document={snapshotDocument}
          posts={resolveInsightsDatasetPosts(snapshotDocument, allPosts)}
          faqItems={faqItems}
          state={snapshotState as BuilderHomeDocumentState}
        />
      );
    }
    case 'about': {
      const copy = pageCopy[locale].about;

      return (
        <BuilderReadonlyPagePreview
          locale={locale}
          pageKey="about"
          title="About Builder Preview"
          description="Preview mode reads the latest persisted draft first, then falls back to published or default schema."
          document={snapshotDocument}
        >
          <BuilderPublishedAboutRenderer
            locale={locale}
            document={snapshotDocument}
            header={{
              label: copy.label,
              title: copy.title,
              description: copy.description,
            }}
            state={snapshotState as BuilderStaticDocumentState}
          />
        </BuilderReadonlyPagePreview>
      );
    }
    case 'contact': {
      const copy = pageCopy[locale].contact;

      return (
        <BuilderReadonlyPagePreview
          locale={locale}
          pageKey="contact"
          title="Contact Builder Preview"
          description="Preview mode reads the latest persisted draft first, then falls back to published or default schema."
          document={snapshotDocument}
        >
          <BuilderPublishedContactRenderer
            locale={locale}
            document={snapshotDocument}
            header={{
              label: copy.label,
              title: copy.title,
              description: copy.description,
            }}
            state={snapshotState as BuilderStaticDocumentState}
          />
        </BuilderReadonlyPagePreview>
      );
    }
    default:
      notFound();
  }
}

function buildModePolicyNotes({
  pageKey,
  requestedMode,
}: {
  pageKey: 'home' | 'about' | 'contact';
  requestedMode: 'edit' | 'preview' | 'publish-review';
}) {
  const sharedNotes = [
    'Home is the only editable page in WAVE-01.',
    'About and Contact remain preview-only foundation routes.',
    'Publish review is deferred until production operations wave.',
  ];

  if (pageKey === 'home' && requestedMode === 'edit') {
    return [
      'This route reuses the generic builder page shell while mounting the home-only interactive editor runtime.',
      ...sharedNotes,
    ];
  }

  return [
    'Preview-only pages stay inside the same builder shell, but they do not expose fake edit affordances.',
    ...sharedNotes,
  ];
}
