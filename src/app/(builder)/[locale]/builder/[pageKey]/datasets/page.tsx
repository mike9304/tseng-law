import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BuilderDatasetBindingEditor from "@/components/builder/datasets/BuilderDatasetBindingEditor";
import { readBuilderCollectionSummaries } from "@/lib/builder/cms";
import { getAllColumnPostsIncludingBlob } from "@/lib/consultation/columns-blob-reader";
import { faqContent } from "@/data/faq-content";
import {
  isBuilderPageKey,
  readBuilderPageSnapshotOverview,
  readBuilderSiteOverview,
} from "@/lib/builder/site";
import { readBuilderPageDatasetOverviews } from "@/lib/builder/datasets";
import { listCmsCollectionBindableTargets } from "@/lib/builder/cms-collection-datasets";
import { readSiteDocument } from "@/lib/builder/site/persistence";
import { locales, normalizeLocale, type Locale } from "@/lib/locales";
import { buildSeoMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

const datasetCopy: Record<
  Locale,
  {
    title: string;
    heading: (pageKey: string) => string;
    description: string;
    label: string;
    helper: string;
  }
> = {
  ko: {
    title: "빌더 데이터셋 바인딩",
    heading: (pageKey: string) => `${pageKey} 데이터셋 바인딩`,
    description: "현재 페이지의 라이브 빌더 타깃 데이터셋 연결을 편집합니다.",
    label: "빌더 데이터셋",
    helper:
      "이 페이지는 홈 편집기 미리보기와 게시된 런타임에서 같은 데이터셋 레지스트리를 사용합니다.",
  },
  "zh-hant": {
    title: "建構器資料集綁定",
    heading: (pageKey: string) => `${pageKey} 資料集綁定`,
    description: "編輯目前頁面的即時建構器目標資料集綁定。",
    label: "建構器資料集",
    helper: "此頁面使用與首頁編輯器預覽和已發佈 runtime 相同的資料集登錄。",
  },
  en: {
    title: "Builder dataset bindings",
    heading: (pageKey: string) => `${pageKey} dataset bindings`,
    description: "Edit page dataset bindings for live builder targets.",
    label: "Builder datasets",
    helper:
      "This page uses the same dataset registry as the home editor preview and published runtime.",
  },
};

export function generateMetadata({
  params,
}: {
  params: { locale: Locale; pageKey: string };
}): Metadata {
  const locale = normalizeLocale(params.locale);
  const pageKey = isBuilderPageKey(params.pageKey) ? params.pageKey : "home";
  const copy = datasetCopy[locale];
  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: `/builder/${pageKey}/datasets`,
    alternateLocales: locales,
    noindex: true,
  });
}

export default async function BuilderPageDatasetsPage({
  params,
  searchParams,
}: {
  params: { locale: Locale; pageKey: string };
  searchParams?: { targetId?: string };
}) {
  const locale = normalizeLocale(params.locale);
  const copy = datasetCopy[locale];
  if (!isBuilderPageKey(params.pageKey)) {
    notFound();
  }

  const pageKey = params.pageKey;
  const overview = await readBuilderSiteOverview(locale);
  const snapshotOverview = await readBuilderPageSnapshotOverview(
    pageKey,
    locale,
  );
  const draftSnapshot = snapshotOverview.draft.snapshot;
  const posts =
    pageKey === "home" ? await getAllColumnPostsIncludingBlob(locale) : [];
  // WIX-PERFECT #6 Slice 3: user-created CMS collections that can be bound to repeaters.
  const siteDocument = await readSiteDocument("default", locale);
  const targets = readBuilderPageDatasetOverviews(
    pageKey,
    draftSnapshot.document,
    locale,
    posts,
    { cmsCollections: siteDocument.cmsCollections },
  );
  const collections = readBuilderCollectionSummaries(locale);
  const cmsBindableTargets = listCmsCollectionBindableTargets(siteDocument);

  return (
    <main className="builder-dataset-page">
      <header className="builder-dataset-page-header">
        <p className="builder-dataset-page-label">{copy.label}</p>
        <h1 className="builder-dataset-page-title">{copy.heading(pageKey)}</h1>
        <p className="builder-dataset-page-description">
          {copy.description} Locale {locale} · Site {overview.site.id}
        </p>
      </header>

      <BuilderDatasetBindingEditor
        locale={locale}
        siteId={overview.site.id}
        pageKey={pageKey}
        initialRevision={draftSnapshot.revision}
        initialTargets={targets}
        collections={collections}
        cmsBindableTargets={cmsBindableTargets}
        initialTargetId={searchParams?.targetId}
      />

      {pageKey === "home" && faqContent[locale] ? (
        <section className="builder-dataset-page-note">
          <p>{copy.helper}</p>
        </section>
      ) : null}
    </main>
  );
}
