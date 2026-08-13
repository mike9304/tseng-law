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
} from '@/lib/builder/datasets';
import {
  buildBuilderPageHref,
  getBuilderPageConfig,
  isBuilderPageKey,
  readBuilderSiteOverview,
  readBuilderPageSnapshotOverview,
  resolveBuilderEditorMode,
} from '@/lib/builder/site';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import {
  BuilderPublishValidationError,
  validateBuilderSnapshotForPublish,
  type BuilderPublishValidationIssue,
} from '@/lib/builder/validation';
import {
  type BuilderHomeDocumentState,
  type BuilderPageDocument,
  type BuilderPageState,
  type BuilderStaticDocumentState,
} from '@/lib/builder/types';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

type BuilderPageProps = {
  params: Promise<{ locale: Locale; pageKey: string }>;
  searchParams?: Promise<{ mode?: string }>;
};

export async function generateMetadata(props: { params: Promise<{ locale: Locale; pageKey: string }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const pageKey = isBuilderPageKey(params.pageKey) ? params.pageKey : 'home';
  const config = getBuilderPageConfig(pageKey);
  const previewCopy =
    pageKey === 'about' || pageKey === 'contact' ? getReadonlyPreviewRouteCopy(locale, pageKey) : null;

  return buildSeoMetadata({
    locale,
    title: previewCopy ? previewCopy.title : `${config.title} Builder`,
    description: previewCopy ? previewCopy.description : config.description,
    path: `/builder/${pageKey}`,
    alternateLocales: locales,
    noindex: true,
  });
}

export default async function BuilderPageRoute(props: BuilderPageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
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
  const snapshotOverview = await readBuilderPageSnapshotOverview(pageKey, locale);
  const siteDocument = await readSiteDocument('default', locale);
  const snapshot = snapshotOverview.preferred.snapshot;
  const allPosts = pageKey === 'home' ? await getAllColumnPostsIncludingBlob(locale) : [];
  const faqItems = pageKey === 'home' ? faqContent[locale] : null;
  const datasetOverviews = readBuilderPageDatasetOverviews(
    pageKey,
    snapshot.snapshot.document,
    locale,
    allPosts,
    { cmsCollections: siteDocument.cmsCollections },
  );
  let publishValidation: { passed: boolean; issues: BuilderPublishValidationIssue[] } = {
    passed: true,
    issues: [],
  };
  try {
    await validateBuilderSnapshotForPublish(snapshot.snapshot);
  } catch (error) {
    if (error instanceof BuilderPublishValidationError) {
      publishValidation = {
        passed: false,
        issues: error.issues,
      };
    } else {
      throw error;
    }
  }
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
      publishSnapshot={{
        draft: {
          persisted: snapshotOverview.draft.persisted,
          revision: snapshotOverview.draft.revision,
          savedAt: snapshotOverview.draft.savedAt,
        },
        published: {
          persisted: snapshotOverview.published.persisted,
          revision: snapshotOverview.published.revision,
          savedAt: snapshotOverview.published.savedAt,
        },
      }}
      publishValidation={publishValidation}
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
          posts={allPosts}
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
          posts={allPosts}
          faqItems={faqItems}
          state={snapshotState as BuilderHomeDocumentState}
        />
      );
    }
    case 'about': {
      const copy = pageCopy[locale].about;
      const previewCopy = getReadonlyPreviewRouteCopy(locale, 'about');

      return (
        <BuilderReadonlyPagePreview
          locale={locale}
          pageKey="about"
          title={previewCopy.title}
          description={previewCopy.description}
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
      const previewCopy = getReadonlyPreviewRouteCopy(locale, 'contact');

      return (
        <BuilderReadonlyPagePreview
          locale={locale}
          pageKey="contact"
          title={previewCopy.title}
          description={previewCopy.description}
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

function getReadonlyPreviewRouteCopy(locale: Locale, pageKey: 'about' | 'contact') {
  const titles = {
    about:
      locale === 'ko' ? '빌더 소개 미리보기' : locale === 'zh-hant' ? '建構器關於頁預覽' : 'About Builder Preview',
    contact:
      locale === 'ko' ? '빌더 문의 미리보기' : locale === 'zh-hant' ? '建構器聯絡頁預覽' : 'Contact Builder Preview',
  } as const;

  const descriptions = {
    about:
      locale === 'ko'
        ? '미리보기 모드는 최신 저장 초안을 먼저 읽고, 그다음 게시본 또는 기본 스키마로 돌아갑니다.'
        : locale === 'zh-hant'
          ? '預覽模式會先讀取最近保存的草稿，接著才回退到已發佈版本或預設結構。'
          : 'Preview mode reads the latest persisted draft first, then falls back to published or default schema.',
    contact:
      locale === 'ko'
        ? '미리보기 모드는 최신 저장 초안을 먼저 읽고, 그다음 게시본 또는 기본 스키마로 돌아갑니다.'
        : locale === 'zh-hant'
          ? '預覽模式會先讀取最近保存的草稿，接著才回退到已發佈版本或預設結構。'
          : 'Preview mode reads the latest persisted draft first, then falls back to published or default schema.',
  } as const;

  return {
    title: titles[pageKey],
    description: descriptions[pageKey],
  } as const;
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
