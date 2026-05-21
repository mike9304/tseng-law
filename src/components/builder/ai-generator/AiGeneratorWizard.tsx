'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  COLOR_PREFERENCES,
  INDUSTRIES,
  TONES,
  type ColorPreference,
  type Industry,
  type SiteSpec,
  type Tone,
} from '@/lib/builder/ai-generator/site-spec';
import type { GeneratedSiteDraft } from '@/lib/builder/ai-generator/orchestrator';
import {
  AI_GENERATOR_PROMPT_CHANGELOG,
  AI_GENERATOR_PROMPT_VERSION,
} from '@/lib/builder/ai-generator/prompt-versions';
import {
  draftToSavedSectionSnapshots,
  type GeneratedSectionSnapshot,
} from '@/lib/builder/ai-generator/canvas-import';
import type { BuilderAssetListItem } from '@/lib/builder/assets';
import type { Locale } from '@/lib/locales';
import styles from './AiGeneratorWizard.module.css';

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;
type DraftCore = Pick<
  GeneratedSiteDraft,
  'spec' | 'blueprint' | 'palette' | 'content' | 'plan'
>;
type DraftVersionMetadata = Partial<Pick<
  GeneratedSiteDraft,
  'generatedAt' | 'promptVersion' | 'blueprintVersion' | 'contentVersion' | 'promptChangelog'
>>;
type Draft = DraftCore & DraftVersionMetadata;
type DraftPreviewFrame = 'desktop' | 'mobile';

interface PromptHistoryEntry {
  id: string;
  createdAt: string;
  spec: SiteSpec;
  draft: Draft;
}

interface DraftResponse {
  ok?: boolean;
  cached?: boolean;
  draft?: Draft;
  error?: string;
  message?: string;
}

interface ApplyResponse {
  ok?: boolean;
  scope?: 'single' | 'sitemap';
  pageId?: string;
  slug?: string;
  pages?: ApplyCreatedPage[];
  skippedPages?: ApplySkippedPage[];
  navigationAdded?: string[];
  error?: string;
  message?: string;
}

interface ApplyCreatedPage {
  pageId: string;
  slug: string;
  title?: string;
  nodeCount?: number;
}

interface ApplySkippedPage {
  title: string;
  slug: string;
  reason: string;
}

interface SaveSectionResponse {
  ok?: boolean;
  section?: {
    sectionId: string;
    name: string;
  };
  error?: string;
  message?: string;
}

interface AssetsResponse {
  ok?: boolean;
  assets?: BuilderAssetListItem[];
  error?: string;
  message?: string;
}

interface ImageGenerationResponse {
  ok?: boolean;
  model?: string;
  asset?: BuilderAssetListItem;
  error?: string;
  message?: string;
}

interface HeroAssetSelection {
  assetId?: string;
  url: string;
  filename: string;
  contentType?: string;
  uploadedAt?: string;
  locale?: Locale;
  pathname?: string;
  alt?: string;
}

interface Props {
  locale: Locale;
}

const STEPS: Array<{ id: WizardStep; label: string; kicker: string }> = [
  { id: 1, label: '업종', kicker: 'Industry' },
  { id: 2, label: '브랜드', kicker: 'Brand' },
  { id: 3, label: '목표·페이지', kicker: 'Plan' },
  { id: 4, label: '제약', kicker: 'Rules' },
  { id: 5, label: '스타일', kicker: 'Design' },
  { id: 6, label: '생성안', kicker: 'Draft' },
];

const COLOR_SWATCHES: Record<ColorPreference, string[]> = {
  cool: ['#0f172a', '#2563eb', '#f8fafc'],
  warm: ['#7c2d12', '#d97706', '#fefce8'],
  neutral: ['#111827', '#64748b', '#ffffff'],
  'high-contrast': ['#000000', '#dc2626', '#ffffff'],
  pastel: ['#5b21b6', '#a78bfa', '#faf5ff'],
};

function aiGeneratorHistoryKey(locale: Locale): string {
  return `builder-ai-generator-history:${locale}`;
}

function isPromptHistoryEntry(value: unknown): value is PromptHistoryEntry {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Partial<PromptHistoryEntry>;
  return typeof entry.id === 'string'
    && typeof entry.createdAt === 'string'
    && Boolean(entry.spec)
    && Boolean(entry.draft?.blueprint?.heroHeadlineHint)
    && Boolean(entry.draft?.content?.hero?.headline)
    && Array.isArray(entry.draft?.plan?.sitemap);
}

function splitList(value: string): string[] | undefined {
  const items = value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 10);
  return items.length > 0 ? items : undefined;
}

function suggestDraftSlug(): string {
  return `ai-site-${Date.now().toString(36)}`;
}

function validateDraftSlug(slug: string): string {
  const normalized = slug.trim().replace(/^\/+|\/+$/g, '');
  if (!normalized) return 'slug를 입력해 주세요.';
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
    return '소문자 영문, 숫자, 하이픈만 사용할 수 있습니다.';
  }
  if (['admin', 'admin-builder', 'api', 'builder', 'home'].includes(normalized)) {
    return '예약된 slug는 사용할 수 없습니다.';
  }
  return '';
}

function normalizePlanSlug(slug: string): string {
  const normalized = slug.trim().replace(/^\/+|\/+$/g, '');
  return normalized || '/';
}

function displayPlanPath(slug: string): string {
  const normalized = normalizePlanSlug(slug);
  return normalized === '/' ? '/' : `/${normalized}`;
}

function selectableSitemapSlugs(draft: Draft): string[] {
  return draft.plan.sitemap
    .map((page) => normalizePlanSlug(page.slug))
    .filter((slug) => slug !== '/');
}

function formatPageStatusLabel(status: string): string {
  if (status === 'created') return 'Created';
  if (status === 'planned') return 'Ready';
  if (status === 'not_selected') return 'Skipped';
  if (status === 'home') return 'Home';
  if (status === 'duplicate_slug') return 'Exists';
  if (status === 'invalid_slug') return 'Invalid';
  if (status === 'reserved_slug') return 'Reserved';
  return status.replace(/_/g, ' ');
}

function formatHistoryDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function visualBriefForUi(draft: Draft) {
  return draft.plan.visualBrief ?? {
    direction: draft.spec.visualDirection ?? draft.plan.brandBrief.constraints,
    imagePrompt: `Create a polished website hero image for ${draft.spec.companyName}. ${draft.spec.visualDirection ?? draft.spec.industry}`,
    treatment: 'professional split hero with layered media card, proof cards, and accent chips',
    composition: 'mobile-safe stacked hero with reusable content cards',
  };
}

function assetAltFromFilename(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .trim()
    .slice(0, 120) || 'Selected hero image';
}

function builderAssetIdFromUrl(url: string): string {
  const match = /^\/api\/builder\/assets\/(ko|en|zh-hant)\/([A-Za-z0-9._-]+\.(?:jpe?g|png|webp|gif|svg))$/i.exec(url.trim());
  return match ? `builder/assets/${match[1]}/${match[2]}` : '';
}

function builderAssetUrlFromId(assetId: string): string {
  const match = /^builder\/assets\/(ko|en|zh-hant)\/([A-Za-z0-9._-]+\.(?:jpe?g|png|webp|gif|svg))$/i.exec(assetId.trim());
  return match ? `/api/builder/assets/${match[1]}/${match[2]}` : '';
}

function builderAssetIdForSelection(asset: HeroAssetSelection): string {
  if (asset.assetId?.startsWith('builder/assets/')) return asset.assetId;
  if (asset.pathname?.startsWith('builder/assets/')) return asset.pathname;
  return builderAssetIdFromUrl(asset.url);
}

function draftHistorySignature(value: Draft): string {
  return [
    value.spec.companyName,
    value.content.hero.headline,
    value.plan.sitemap.map((page) => page.slug).join('|'),
  ].join('::');
}

export default function AiGeneratorWizard({ locale }: Props) {
  const [step, setStep] = useState<WizardStep>(1);
  const [industry, setIndustry] = useState<Industry>('law');
  const [companyName, setCompanyName] = useState('호정국제법률사무소');
  const [slogan, setSlogan] = useState('');
  const [audience, setAudience] = useState('대만 진출을 준비하는 한국 기업과 개인 고객');
  const [goalsText, setGoalsText] = useState('상담 문의 증가\n전문성 신뢰 확보\n칼럼 기반 검색 유입');
  const [pagesText, setPagesText] = useState('홈\n업무분야\n변호사\n칼럼\nFAQ\n문의');
  const [brandKeywordsText, setBrandKeywordsText] = useState('대만 법률\n한국어 상담\n국제 사건');
  const [constraints, setConstraints] = useState('모바일에서 상담 CTA와 전화 문의 동선이 먼저 보여야 함');
  const [visualDirection, setVisualDirection] = useState('타이베이 도시감, 차분한 법률 사무소, 선명한 인물 없는 상담 장면, 신뢰 중심의 편집형 히어로');
  const [tone, setTone] = useState<Tone>('professional');
  const [colorPreference, setColorPreference] = useState<ColorPreference>('cool');
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [appliedPageId, setAppliedPageId] = useState<string | null>(null);
  const [appliedSlug, setAppliedSlug] = useState<string | null>(null);
  const [appliedPages, setAppliedPages] = useState<ApplyCreatedPage[]>([]);
  const [skippedApplyPages, setSkippedApplyPages] = useState<ApplySkippedPage[]>([]);
  const [applyScope, setApplyScope] = useState<'single' | 'sitemap'>('single');
  const [selectedSitemapPageSlugs, setSelectedSitemapPageSlugs] = useState<string[]>([]);
  const [includeNavigation, setIncludeNavigation] = useState(false);
  const [navigationAddedSlugs, setNavigationAddedSlugs] = useState<string[]>([]);
  const [discarding, setDiscarding] = useState(false);
  const [discardNotice, setDiscardNotice] = useState('');
  const [savingSectionRootId, setSavingSectionRootId] = useState<string | null>(null);
  const [savedSectionIds, setSavedSectionIds] = useState<Record<string, string>>({});
  const [sectionSaveNotice, setSectionSaveNotice] = useState('');
  const [draftSlug, setDraftSlug] = useState(suggestDraftSlug);
  const [history, setHistory] = useState<PromptHistoryEntry[]>([]);
  const [historyNotice, setHistoryNotice] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [assetLibrary, setAssetLibrary] = useState<HeroAssetSelection[]>([]);
  const [assetLoading, setAssetLoading] = useState(false);
  const [assetError, setAssetError] = useState('');
  const [selectedHeroAsset, setSelectedHeroAsset] = useState<HeroAssetSelection | null>(null);
  const [imageGenerating, setImageGenerating] = useState(false);
  const [imageGenerationNotice, setImageGenerationNotice] = useState('');
  const [draftPreviewFrame, setDraftPreviewFrame] = useState<DraftPreviewFrame>('desktop');
  const [selectedPromptVersion, setSelectedPromptVersion] = useState(AI_GENERATOR_PROMPT_VERSION);

  useEffect(() => {
    setHydrated(true);
    try {
      const stored = window.localStorage.getItem(aiGeneratorHistoryKey(locale));
      const parsed = stored ? JSON.parse(stored) : [];
      setHistory(Array.isArray(parsed) ? parsed.filter(isPromptHistoryEntry).slice(0, 6) : []);
    } catch {
      setHistory([]);
    }
  }, [locale]);

  useEffect(() => {
    let active = true;
    setAssetLoading(true);
    setAssetError('');
    fetch(`/api/builder/assets?locale=${encodeURIComponent(locale)}&limit=8`, {
      credentials: 'same-origin',
    })
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as AssetsResponse;
        if (!active) return;
        if (!response.ok || !payload.ok || !Array.isArray(payload.assets)) {
          setAssetLibrary([]);
          setAssetError(payload.message ?? payload.error ?? '이미지 에셋을 불러오지 못했습니다.');
          return;
        }
        setAssetLibrary(payload.assets.map((asset) => ({
          assetId: asset.pathname,
          url: asset.url,
          filename: asset.filename,
          contentType: asset.contentType,
          uploadedAt: asset.uploadedAt,
          locale: asset.locale,
          pathname: asset.pathname,
        })));
      })
      .catch(() => {
        if (!active) return;
        setAssetLibrary([]);
        setAssetError('이미지 에셋을 불러오지 못했습니다.');
      })
      .finally(() => {
        if (active) setAssetLoading(false);
      });
    return () => {
      active = false;
    };
  }, [locale]);

  function buildSpec(): SiteSpec {
    const heroAssetId = selectedHeroAsset ? builderAssetIdForSelection(selectedHeroAsset) : '';
    return {
      industry,
      companyName: companyName.trim(),
      slogan: slogan.trim() || undefined,
      audience: audience.trim() || undefined,
      goals: splitList(goalsText),
      desiredPages: splitList(pagesText),
      brandKeywords: splitList(brandKeywordsText),
      constraints: constraints.trim() || undefined,
      visualDirection: visualDirection.trim() || undefined,
      heroImageAsset: selectedHeroAsset && heroAssetId
        ? {
            assetId: heroAssetId,
            filename: selectedHeroAsset.filename,
            alt: selectedHeroAsset.alt || assetAltFromFilename(selectedHeroAsset.filename),
          }
        : undefined,
      tone,
      colorPreference,
      locale,
    };
  }

  async function apply() {
    if (!draft) return;
    const slug = draftSlug.trim().replace(/^\/+|\/+$/g, '');
    const slugError = applyScope === 'single' ? validateDraftSlug(slug) : '';
    if (slugError) {
      setError(slugError);
      return;
    }
    if (applyScope === 'sitemap' && selectedSitemapPageSlugs.length === 0) {
      setError('생성할 sitemap page를 하나 이상 선택해 주세요.');
      return;
    }
    setApplying(true);
    setError('');
    setAppliedPageId(null);
    setAppliedSlug(null);
    setAppliedPages([]);
    setSkippedApplyPages([]);
    setNavigationAddedSlugs([]);
    setDiscardNotice('');
    try {
      const res = await fetch('/api/builder/ai-generator/apply', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spec: draft.spec,
          scope: applyScope,
          slug: applyScope === 'single' ? slug : undefined,
          pageSlugs: applyScope === 'sitemap' ? selectedSitemapPageSlugs : undefined,
          addToNavigation: applyScope === 'sitemap' ? includeNavigation : false,
          promptVersion: draft.promptVersion,
          title: companyName.trim(),
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as ApplyResponse;
      const nextPages = payload.pages && payload.pages.length > 0
        ? payload.pages
        : payload.pageId
          ? [{ pageId: payload.pageId, slug: payload.slug ?? slug, title: companyName.trim() }]
          : [];
      if (!res.ok || nextPages.length === 0) {
        setError(payload.message ?? payload.error ?? '적용 실패');
        setSkippedApplyPages(payload.skippedPages ?? []);
        return;
      }
      setAppliedPages(nextPages);
      setSkippedApplyPages(payload.skippedPages ?? []);
      setNavigationAddedSlugs(payload.navigationAdded ?? []);
      setAppliedPageId(nextPages[0]?.pageId ?? null);
      setAppliedSlug(nextPages[0]?.slug ?? null);
      setDiscardNotice('');
      if (applyScope === 'single') setDraftSlug(suggestDraftSlug());
    } finally {
      setApplying(false);
    }
  }

  async function discardAppliedDraft() {
    const pagesToDiscard = appliedPages.length > 0
      ? appliedPages
      : appliedPageId
        ? [{ pageId: appliedPageId, slug: appliedSlug ?? '' }]
        : [];
    if (pagesToDiscard.length === 0) return;
    setDiscarding(true);
    setError('');
    setDiscardNotice('');
    try {
      const results = await Promise.all(pagesToDiscard.map(async (pageEntry) => {
        const res = await fetch(`/api/builder/site/pages/${encodeURIComponent(pageEntry.pageId)}?locale=${locale}`, {
          method: 'DELETE',
          credentials: 'same-origin',
        });
        return { res, pageEntry };
      }));
      const failed = results.find((result) => !result.res.ok && result.res.status !== 404);
      if (failed) {
        const payload = (await failed.res.json().catch(() => ({}))) as ApplyResponse;
        setError(payload.message ?? payload.error ?? `${failed.pageEntry.slug || failed.pageEntry.pageId} draft 폐기 실패`);
        return;
      }
      setAppliedPageId(null);
      setAppliedSlug(null);
      setAppliedPages([]);
      setSkippedApplyPages([]);
      setNavigationAddedSlugs([]);
      const hadMissing = results.some((result) => result.res.status === 404);
      setDiscardNotice(hadMissing
        ? '이미 삭제된 draft로 표시를 정리했습니다.'
        : `${pagesToDiscard.length}개 draft를 폐기했습니다.`);
    } finally {
      setDiscarding(false);
    }
  }

  function rememberDraft(nextDraft: Draft) {
    const entry: PromptHistoryEntry = {
      id: `history-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      spec: nextDraft.spec,
      draft: nextDraft,
    };
    setHistory((current) => {
      const next = [entry, ...current].slice(0, 6);
      try {
        window.localStorage.setItem(aiGeneratorHistoryKey(locale), JSON.stringify(next));
      } catch {
        /* local history is a convenience only. */
      }
      return next;
    });
    setHistoryNotice('생성 기록에 저장했습니다.');
  }

  function updateStoredDraftHistory(previousDraft: Draft, nextDraft: Draft) {
    const previousSignature = draftHistorySignature(previousDraft);
    setHistory((current) => {
      const next = current.map((entry) => (
        entry.draft === previousDraft || draftHistorySignature(entry.draft) === previousSignature
          ? { ...entry, spec: nextDraft.spec, draft: nextDraft }
          : entry
      ));
      try {
        window.localStorage.setItem(aiGeneratorHistoryKey(locale), JSON.stringify(next));
      } catch {
        /* local history is a convenience only. */
      }
      return next;
    });
  }

  function restoreHistory(entry: PromptHistoryEntry) {
    setIndustry(entry.spec.industry);
    setCompanyName(entry.spec.companyName);
    setSlogan(entry.spec.slogan ?? '');
    setAudience(entry.spec.audience ?? '');
    setGoalsText((entry.spec.goals ?? []).join('\n'));
    setPagesText((entry.spec.desiredPages ?? []).join('\n'));
    setBrandKeywordsText((entry.spec.brandKeywords ?? []).join('\n'));
    setConstraints(entry.spec.constraints ?? '');
    setVisualDirection(entry.spec.visualDirection ?? '');
    setSelectedHeroAsset(entry.spec.heroImageAsset
      ? {
          assetId: entry.spec.heroImageAsset.assetId,
          url: builderAssetUrlFromId(entry.spec.heroImageAsset.assetId),
          filename: entry.spec.heroImageAsset.filename,
          alt: entry.spec.heroImageAsset.alt,
        }
      : null);
    setTone(entry.spec.tone);
    setColorPreference(entry.spec.colorPreference);
    setSelectedPromptVersion(entry.draft.promptVersion ?? AI_GENERATOR_PROMPT_VERSION);
    setDraft(entry.draft);
    setAppliedPageId(null);
    setAppliedSlug(null);
    setAppliedPages([]);
    setSkippedApplyPages([]);
    setNavigationAddedSlugs([]);
    setSelectedSitemapPageSlugs(selectableSitemapSlugs(entry.draft));
    setDiscardNotice('');
    setSavedSectionIds({});
    setSectionSaveNotice('');
    setDraftSlug(suggestDraftSlug());
    setDraftPreviewFrame('desktop');
    setError('');
    setHistoryNotice('이전 생성안을 복원했습니다.');
    setStep(6);
  }

  function removeHistoryEntry(entryId: string) {
    setHistory((current) => {
      const next = current.filter((entry) => entry.id !== entryId);
      try {
        window.localStorage.setItem(aiGeneratorHistoryKey(locale), JSON.stringify(next));
      } catch {
        /* local history is a convenience only. */
      }
      return next;
    });
    setHistoryNotice('생성 기록을 삭제했습니다.');
  }

  async function generate() {
    if (!companyName.trim()) {
      setError('회사명을 입력해 주세요.');
      setStep(2);
      return;
    }
    setBusy(true);
    setError('');
    setAppliedPageId(null);
    setAppliedSlug(null);
    setAppliedPages([]);
    setSkippedApplyPages([]);
    setNavigationAddedSlugs([]);
    setDiscardNotice('');
    setSavedSectionIds({});
    setSectionSaveNotice('');
    try {
      const res = await fetch('/api/builder/ai-generator', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spec: buildSpec(),
          promptVersion: selectedPromptVersion,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as DraftResponse;
      if (!res.ok || !payload.draft) {
        setError(payload.message ?? payload.error ?? '생성 실패');
        return;
      }
      setDraft(payload.draft);
      setSelectedSitemapPageSlugs(selectableSitemapSlugs(payload.draft));
      rememberDraft(payload.draft);
      setDraftSlug(suggestDraftSlug());
      setDraftPreviewFrame('desktop');
      setStep(6);
    } finally {
      setBusy(false);
    }
  }

  async function saveGeneratedSection(snapshot: GeneratedSectionSnapshot) {
    setSavingSectionRootId(snapshot.rootNodeId);
    setError('');
    setSectionSaveNotice('');
    try {
      const res = await fetch('/api/builder/site/section-library', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: snapshot.name,
          description: snapshot.description,
          category: snapshot.category,
          rootNodeId: snapshot.rootNodeId,
          nodes: snapshot.nodes,
          locale,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as SaveSectionResponse;
      if (!res.ok || !payload.section) {
        setError(payload.message ?? payload.error ?? '섹션 저장 실패');
        return;
      }
      setSavedSectionIds((current) => ({
        ...current,
        [snapshot.rootNodeId]: payload.section!.sectionId,
      }));
      setSectionSaveNotice(`Saved Sections에 추가됨: ${payload.section.name}`);
      window.dispatchEvent(new CustomEvent('builder:saved-section-changed'));
    } finally {
      setSavingSectionRootId(null);
    }
  }

  async function generateHeroImageForDraft() {
    if (!draft) return;
    const visualBrief = visualBriefForUi(draft);
    setImageGenerating(true);
    setImageGenerationNotice('');
    setError('');
    try {
      const res = await fetch('/api/builder/ai-generator/image', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          prompt: visualBrief.imagePrompt,
          size: '1536x1024',
          quality: 'medium',
          outputFormat: 'webp',
          outputCompression: 82,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as ImageGenerationResponse;
      if (!res.ok || !payload.ok || !payload.asset) {
        setError(payload.message ?? payload.error ?? 'Image 2.0 생성 실패');
        return;
      }
      const asset: HeroAssetSelection = {
        assetId: payload.asset.pathname,
        url: payload.asset.url,
        filename: payload.asset.filename,
        contentType: payload.asset.contentType,
        uploadedAt: payload.asset.uploadedAt,
        locale: payload.asset.locale,
        pathname: payload.asset.pathname,
        alt: `${draft.spec.companyName} AI hero image`,
      };
      const nextDraft: Draft = {
        ...draft,
        spec: {
          ...draft.spec,
          heroImageAsset: {
            assetId: payload.asset.pathname,
            filename: payload.asset.filename,
            alt: asset.alt,
          },
        },
      };
      setSelectedHeroAsset(asset);
      setDraft(nextDraft);
      updateStoredDraftHistory(draft, nextDraft);
      setAssetLibrary((current) => {
        if (current.some((item) => item.url === asset.url)) return current;
        return [asset, ...current].slice(0, 8);
      });
      setImageGenerationNotice(`Image 2.0 생성됨: ${payload.asset.filename}`);
    } finally {
      setImageGenerating(false);
    }
  }

  const goalList = splitList(goalsText) ?? [];
  const pageList = splitList(pagesText) ?? [];
  const keywordList = splitList(brandKeywordsText) ?? [];
  const draftSlugError = validateDraftSlug(draftSlug);
  const activeDraftSlugError = applyScope === 'single' ? draftSlugError : '';
  const sitemapDraftCount = draft?.plan.sitemap.filter((page) => page.slug !== '/').length ?? 0;
  const selectedSitemapCount = selectedSitemapPageSlugs.length;
  const selectedSitemapPageSlugSet = useMemo(
    () => new Set(selectedSitemapPageSlugs),
    [selectedSitemapPageSlugs],
  );
  const appliedPageSlugs = useMemo(
    () => new Set(appliedPages.map((page) => normalizePlanSlug(page.slug))),
    [appliedPages],
  );
  const skippedPageReasons = useMemo(
    () => new Map(skippedApplyPages.map((page) => [normalizePlanSlug(page.slug), page.reason])),
    [skippedApplyPages],
  );
  const navigationAddedSlugSet = useMemo(
    () => new Set(navigationAddedSlugs.map((slug) => normalizePlanSlug(slug))),
    [navigationAddedSlugs],
  );
  const generatedSectionSnapshots = useMemo(
    () => (draft
      ? draftToSavedSectionSnapshots({ draft, locale, pageId: 'ai-section-library-preview' })
      : []),
    [draft, locale],
  );
  const activeVisualBrief = draft ? visualBriefForUi(draft) : null;
  const activePromptVersion = draft?.promptVersion ?? 'legacy-local-draft';
  const activeBlueprintVersion = draft?.blueprintVersion ?? 'unknown-blueprint';
  const activePromptChange = draft?.promptChangelog?.find((entry) => entry.version === activePromptVersion)
    ?? draft?.promptChangelog?.[0]
    ?? null;
  const applyReviewPages = useMemo(() => {
    if (!draft) return [];
    if (applyScope === 'single') {
      const slug = normalizePlanSlug(draftSlug);
      return [{
        title: `${draft.spec.companyName || companyName || 'AI site'} draft`,
        slug,
        sections: ['hero', ...draft.content.sections.map((section) => section.sectionId)],
      }];
    }
    return draft.plan.sitemap
      .filter((page) => {
        const slug = normalizePlanSlug(page.slug);
        return slug !== '/' && selectedSitemapPageSlugSet.has(slug);
      })
      .map((page) => ({
        title: page.title,
        slug: normalizePlanSlug(page.slug),
        sections: page.sections,
      }));
  }, [applyScope, companyName, draft, draftSlug, selectedSitemapPageSlugSet]);
  const applyReviewSectionCount = useMemo(
    () => applyReviewPages.reduce((total, page) => total + page.sections.length, 0),
    [applyReviewPages],
  );

  return (
    <div className={styles.shell} data-ai-generator data-ai-generator-ready={hydrated ? 'true' : 'false'}>
      <aside className={styles.rail} aria-label="AI generator steps">
        <div className={styles.railHeader}>
          <span>AI Site Builder</span>
          <strong>{companyName || 'Untitled'}</strong>
        </div>
        <nav className={styles.stepList}>
          {STEPS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStep(item.id)}
              disabled={!hydrated || (item.id === 6 && !draft)}
              className={`${styles.stepButton} ${step === item.id ? styles.stepButtonActive : ''}`}
            >
              <span>{item.kicker}</span>
              <strong>{item.label}</strong>
            </button>
          ))}
        </nav>
        <div className={styles.briefCard}>
          <span className={styles.eyebrow}>Brief</span>
          <dl>
            <div>
              <dt>업종</dt>
              <dd>{industry}</dd>
            </div>
            <div>
              <dt>톤</dt>
              <dd>{tone}</dd>
            </div>
            <div>
              <dt>페이지</dt>
              <dd>{pageList.length || 0}</dd>
            </div>
            <div>
              <dt>키워드</dt>
              <dd>{keywordList.length || 0}</dd>
            </div>
          </dl>
        </div>
        <div className={styles.historyCard} data-ai-generator-history>
          <div className={styles.historyHeader}>
            <span className={styles.eyebrow}>Prompt History</span>
            <strong>{history.length} saved</strong>
          </div>
          {historyNotice ? <p className={styles.noticeText}>{historyNotice}</p> : null}
          {history.length > 0 ? (
            <div className={styles.historyList}>
              {history.map((entry) => (
                <article key={entry.id} className={styles.historyItem}>
                  <div className={styles.historyItemMeta}>
                    <strong>{entry.spec.companyName}</strong>
                    <span>{formatHistoryDate(entry.createdAt)} · {entry.spec.tone}</span>
                    <small>{entry.draft.plan.sitemap.length} pages · {entry.draft.content.hero.headline}</small>
                  </div>
                  <div className={styles.historyItemActions}>
                    <button
                      type="button"
                      className={styles.ghostButton}
                      onClick={() => restoreHistory(entry)}
                      data-ai-generator-history-restore
                    >
                      복원
                    </button>
                    <button
                      type="button"
                      className={styles.dangerButton}
                      onClick={() => removeHistoryEntry(entry.id)}
                      aria-label={`${entry.spec.companyName} 생성 기록 삭제`}
                    >
                      삭제
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className={styles.historyEmpty}>생성하면 최근 6개 프롬프트와 드래프트가 여기에 저장됩니다.</p>
          )}
        </div>
      </aside>

      <section className={styles.workspace}>
        {step === 1 ? (
          <Panel
            kicker="Industry"
            title="업종 선택"
            description="생성할 사이트의 기본 정보 구조와 섹션 조합을 결정합니다."
            footer={<StepFooter next={() => setStep(2)} />}
          >
            <div className={styles.industryGrid}>
              {INDUSTRIES.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setIndustry(value)}
                  className={`${styles.choiceButton} ${industry === value ? styles.choiceButtonActive : ''}`}
                >
                  {value}
                </button>
              ))}
            </div>
          </Panel>
        ) : null}

        {step === 2 ? (
          <Panel
            kicker="Brand"
            title="브랜드 기본값"
            description="회사명, 한 줄 포지셔닝, 주요 고객군을 생성 프롬프트에 반영합니다."
            footer={<StepFooter previous={() => setStep(1)} next={() => setStep(3)} nextDisabled={!companyName.trim()} />}
          >
            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span>회사명</span>
                <input value={companyName} onChange={(event) => setCompanyName(event.target.value)} placeholder="회사명" />
              </label>
              <label className={styles.field}>
                <span>슬로건</span>
                <input value={slogan} onChange={(event) => setSlogan(event.target.value)} placeholder="선택 입력" />
              </label>
              <label className={`${styles.field} ${styles.fieldWide}`}>
                <span>주요 고객</span>
                <input
                  value={audience}
                  onChange={(event) => setAudience(event.target.value)}
                  placeholder="예: 대만 진출을 준비하는 한국 기업"
                />
              </label>
            </div>
          </Panel>
        ) : null}

        {step === 3 ? (
          <Panel
            kicker="Plan"
            title="목표와 페이지"
            description="Wix처럼 페이지 트리와 초기 콘텐츠 계획을 먼저 만든 뒤 드래프트를 생성합니다."
            footer={<StepFooter previous={() => setStep(2)} next={() => setStep(4)} />}
          >
            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span>비즈니스 목표</span>
                <textarea
                  data-ai-generator-goals
                  rows={7}
                  value={goalsText}
                  onChange={(event) => setGoalsText(event.target.value)}
                />
              </label>
              <label className={styles.field}>
                <span>필요 페이지</span>
                <textarea
                  data-ai-generator-pages
                  rows={7}
                  value={pagesText}
                  onChange={(event) => setPagesText(event.target.value)}
                />
              </label>
            </div>
            <div className={styles.tokenRow}>
              {goalList.map((goal) => (
                <span key={goal}>{goal}</span>
              ))}
            </div>
          </Panel>
        ) : null}

        {step === 4 ? (
          <Panel
            kicker="Rules"
            title="브랜드 키워드와 제약"
            description="디자이너가 놓치면 안 되는 언어, 법적 고지, 모바일 우선 조건을 고정합니다."
            footer={<StepFooter previous={() => setStep(3)} next={() => setStep(5)} />}
          >
            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span>브랜드 키워드</span>
                <textarea
                  data-ai-generator-brand-keywords
                  rows={7}
                  value={brandKeywordsText}
                  onChange={(event) => setBrandKeywordsText(event.target.value)}
                />
              </label>
              <label className={styles.field}>
                <span>제약 / 필수 조건</span>
                <textarea
                  data-ai-generator-constraints
                  rows={7}
                  value={constraints}
                  onChange={(event) => setConstraints(event.target.value)}
                />
              </label>
            </div>
          </Panel>
        ) : null}

        {step === 5 ? (
          <Panel
            kicker="Design"
            title="톤과 컬러"
            description="산업 템플릿, 카피 톤, 팔레트가 함께 적용됩니다."
            footer={
              <StepFooter
                previous={() => setStep(4)}
                primaryLabel={busy ? 'AI 생성 중...' : '생성하기'}
                next={generate}
                nextDisabled={busy}
                nextDataAttr="data-ai-generator-generate"
              />
            }
          >
            <div className={styles.selectorBlock}>
              <span className={styles.selectorLabel}>톤</span>
              <div className={styles.segmented}>
                {TONES.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTone(value)}
                    className={`${styles.segmentButton} ${tone === value ? styles.segmentButtonActive : ''}`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.paletteGrid}>
              {COLOR_PREFERENCES.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setColorPreference(value)}
                  className={`${styles.paletteCard} ${colorPreference === value ? styles.paletteCardActive : ''}`}
                >
                  <span>{value}</span>
                  <strong>
                    {COLOR_SWATCHES[value].map((color) => (
                      <i key={color} style={{ background: color }} />
                    ))}
                  </strong>
                </button>
              ))}
            </div>
            <label className={`${styles.field} ${styles.visualDirectionBlock}`}>
              <span>이미지 / 비주얼 방향</span>
              <textarea
                data-ai-generator-visual-direction
                rows={5}
                value={visualDirection}
                onChange={(event) => setVisualDirection(event.target.value)}
                placeholder="예: 타이베이 도시감, 전문적인 법률 사무소, 인물 없는 상담 장면"
              />
            </label>
            <div className={styles.promptSelectorBlock} data-ai-generator-prompt-selector>
              <div className={styles.promptSelectorHead}>
                <span>Prompt version</span>
                <p>생성 전 프롬프트 프로필을 선택해 새 draft와 캐시를 분리합니다.</p>
              </div>
              <div className={styles.promptSelectorList}>
                {AI_GENERATOR_PROMPT_CHANGELOG.map((entry) => {
                  const selected = selectedPromptVersion === entry.version;
                  return (
                    <button
                      key={entry.version}
                      type="button"
                      className={selected ? styles.promptSelectorOptionActive : styles.promptSelectorOption}
                      onClick={() => setSelectedPromptVersion(entry.version)}
                      data-ai-generator-prompt-option={entry.version}
                      data-ai-generator-prompt-selected={selected ? 'true' : 'false'}
                    >
                      <strong>{entry.label}</strong>
                      <small>{entry.version}</small>
                      <p>{entry.summary}</p>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className={styles.assetPickerBlock} data-ai-generator-asset-picker>
              <div className={styles.assetPickerHead}>
                <div>
                  <span>Hero 이미지 에셋</span>
                  <p>이미 업로드한 이미지를 선택하면 AI 드래프트의 히어로 이미지로 바로 적용됩니다.</p>
                </div>
                {selectedHeroAsset ? (
                  <button
                    type="button"
                    className={styles.ghostButton}
                    onClick={() => setSelectedHeroAsset(null)}
                    data-ai-generator-clear-hero-asset
                  >
                    선택 해제
                  </button>
                ) : null}
              </div>
              {assetLoading ? <p className={styles.assetEmpty}>이미지 에셋을 불러오는 중입니다.</p> : null}
              {!assetLoading && assetLibrary.length > 0 ? (
                <div className={styles.assetGrid}>
                  <button
                    type="button"
                    className={`${styles.assetCard} ${!selectedHeroAsset ? styles.assetCardActive : ''}`}
                    onClick={() => setSelectedHeroAsset(null)}
                    data-ai-generator-use-auto-image
                    data-ai-generator-asset-selected={!selectedHeroAsset ? 'true' : 'false'}
                  >
                    <i className={styles.assetAutoThumb}>AI</i>
                    <span>
                      <strong data-ai-generator-asset-name>Image 2.0 방향 사용</strong>
                      <small>{!selectedHeroAsset ? '선택됨' : '자동 이미지'}</small>
                    </span>
                  </button>
                  {assetLibrary.map((asset) => {
                    const selected = selectedHeroAsset?.url === asset.url;
                    const assetId = builderAssetIdForSelection(asset);
                    return (
                      <button
                        key={asset.url}
                        type="button"
                        className={`${styles.assetCard} ${selected ? styles.assetCardActive : ''}`}
                        onClick={() => setSelectedHeroAsset(asset)}
                        data-ai-generator-asset-card
                        data-ai-generator-asset-id={assetId}
                        data-ai-generator-asset-option={asset.filename}
                        data-ai-generator-asset-selected={selected ? 'true' : 'false'}
                      >
                        <img src={asset.url} alt="" data-ai-generator-asset-thumbnail />
                        <span>
                          <strong data-ai-generator-asset-name>{asset.filename}</strong>
                          <small>{selected ? '선택됨' : asset.contentType ?? 'image'}</small>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
              {!assetLoading && assetLibrary.length === 0 ? (
                <p className={styles.assetEmpty} data-ai-generator-asset-empty>
                  업로드된 이미지가 없습니다. 기본 히어로 이미지를 사용합니다.
                </p>
              ) : null}
              {assetError ? <p className={styles.assetError}>{assetError}</p> : null}
            </div>
            {error ? <p className={styles.errorText}>{error}</p> : null}
          </Panel>
        ) : null}

        {step === 6 && draft ? (
          <div className={styles.resultGrid}>
            <section className={styles.previewPanel}>
              <div className={styles.panelHead}>
                <span className={styles.eyebrow}>Draft</span>
                <h2>{draft.content.hero.headline}</h2>
                <p>{draft.content.hero.body}</p>
              </div>
              <div className={styles.swatchRow}>
                {(['primary', 'secondary', 'accent', 'background'] as const).map((key) => (
                  <span key={key}>
                    <i style={{ background: draft.palette[key] }} />
                    {draft.palette[key]}
                  </span>
                ))}
              </div>
              {activeVisualBrief ? (
                <div className={styles.visualBriefCard} data-ai-generator-visual-brief>
                  <span className={styles.eyebrow}>Visual Brief</span>
                  <strong data-ai-generator-design-treatment>{activeVisualBrief.treatment}</strong>
                  <p data-ai-generator-image-prompt>{activeVisualBrief.imagePrompt}</p>
                  <small data-ai-generator-prompt-version>
                    Prompt version: {activePromptVersion} · {activeBlueprintVersion}
                  </small>
                  {activePromptChange ? (
                    <div className={styles.promptVersionCard} data-ai-generator-prompt-changelog>
                      <strong>{activePromptChange.label}</strong>
                      <p>{activePromptChange.summary}</p>
                      <div>
                        {activePromptChange.changes.slice(0, 3).map((change) => (
                          <span key={change}>{change}</span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {draft.spec.heroImageAsset ? (
                    <small data-ai-generator-selected-hero-asset>
                      Hero asset: {draft.spec.heroImageAsset.filename}
                    </small>
                  ) : null}
                  <div className={styles.visualBriefActions}>
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      disabled={imageGenerating}
                      onClick={() => { void generateHeroImageForDraft(); }}
                      data-ai-generator-generate-hero-image
                    >
                      {imageGenerating ? 'Image 2.0 생성 중...' : 'Image 2.0 hero 생성'}
                    </button>
                    <span>1536x1024 · medium · WebP asset</span>
                  </div>
                  {imageGenerationNotice ? (
                    <small data-ai-generator-image-generation-status>{imageGenerationNotice}</small>
                  ) : null}
                </div>
              ) : null}
              <div className={styles.draftPreviewControls} data-ai-generator-draft-preview-controls>
                <span>Preview frame</span>
                <div aria-label="AI generated draft preview frame">
                  {(['desktop', 'mobile'] as DraftPreviewFrame[]).map((frame) => (
                    <button
                      key={frame}
                      type="button"
                      className={draftPreviewFrame === frame ? styles.previewFrameButtonActive : styles.previewFrameButton}
                      data-ai-generator-draft-preview-mode-button={frame}
                      onClick={() => setDraftPreviewFrame(frame)}
                    >
                      {frame === 'desktop' ? 'Desktop' : 'Mobile'}
                    </button>
                  ))}
                </div>
              </div>
              <div
                className={`${styles.canvasPreview} ${draftPreviewFrame === 'mobile' ? styles.canvasPreviewMobile : ''}`}
                style={{ background: draft.palette.background }}
                data-ai-generator-draft-preview-mode={draftPreviewFrame}
              >
                <div className={styles.previewBrowser}>
                  <div className={styles.previewHero}>
                    <span style={{ color: draft.palette.accent }}>{draft.spec.industry}</span>
                    <h3 style={{ color: draft.palette.primary }}>{draft.content.hero.headline}</h3>
                    <p>{draft.content.hero.body}</p>
                    {draft.content.hero.ctaLabel ? (
                      <button type="button" style={{ background: draft.palette.accent }}>
                        {draft.content.hero.ctaLabel}
                      </button>
                    ) : null}
                  </div>
                  <div className={styles.previewSections}>
                    {draft.content.sections.slice(0, 4).map((section) => (
                      <article key={section.sectionId}>
                        <strong style={{ color: draft.palette.secondary }}>{section.headline}</strong>
                        <p>{section.body}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.applyPanel} data-ai-generator-apply-panel>
                <div className={styles.scopeGroup} data-ai-generator-page-scope>
                  <label className={applyScope === 'single' ? styles.scopeOptionActive : styles.scopeOption}>
                    <input
                      type="radio"
                      name="ai-generator-apply-scope"
                      value="single"
	                      checked={applyScope === 'single'}
	                      onChange={() => {
	                        setApplyScope('single');
	                        setNavigationAddedSlugs([]);
	                        setError('');
	                      }}
                      data-ai-generator-page-option="single"
                    />
                    <span>
                      <strong>Home draft만 생성</strong>
                      <small>slug 하나로 편집 가능한 단일 draft page를 생성</small>
                    </span>
                  </label>
                  <label className={applyScope === 'sitemap' ? styles.scopeOptionActive : styles.scopeOption}>
                    <input
                      type="radio"
                      name="ai-generator-apply-scope"
                      value="sitemap"
	                      checked={applyScope === 'sitemap'}
	                      onChange={() => {
	                        setApplyScope('sitemap');
	                        setNavigationAddedSlugs([]);
	                        setError('');
	                      }}
                      data-ai-generator-page-option="sitemap"
                    />
                    <span>
                      <strong>전체 sitemap draft 생성</strong>
                      <small>{selectedSitemapCount}/{sitemapDraftCount}개 보조 페이지 선택 · 기존 slug는 건너뜀</small>
                    </span>
                  </label>
                </div>
                <label className={styles.slugField}>
                  <span>Draft page slug</span>
                  <input
                    data-ai-generator-slug
                    value={draftSlug}
                    disabled={applyScope === 'sitemap'}
                    onChange={(event) => {
                      setDraftSlug(event.target.value);
                      setError('');
                    }}
                    placeholder="ai-site-draft"
                    autoCapitalize="none"
                    spellCheck={false}
                  />
                </label>
                <p className={activeDraftSlugError ? styles.slugHintError : styles.slugHint}>
                  {activeDraftSlugError || (applyScope === 'sitemap'
                    ? '선택한 sitemap slug만 draft pages로 생성합니다. 공개 반영은 각 페이지 publish 후 진행됩니다.'
                    : `생성 위치: /${locale}/admin-builder?pageId=(new) · 공개 반영은 별도 publish 후 진행`)}
                </p>
	                {applyScope === 'sitemap' && draft ? (
	                  <div className={styles.sitemapSelectPanel} data-ai-generator-sitemap-select-panel>
                    <div>
                      <span>Pages to create</span>
                      <strong data-ai-generator-selected-count>{selectedSitemapCount}/{sitemapDraftCount}</strong>
                    </div>
                    <div className={styles.sitemapSelectActions}>
                      <button
                        type="button"
                        className={styles.ghostButton}
                        onClick={() => {
                          setSelectedSitemapPageSlugs(selectableSitemapSlugs(draft));
                          setError('');
                        }}
                        data-ai-generator-select-all-pages
                      >
                        전체 선택
                      </button>
                      <button
                        type="button"
                        className={styles.ghostButton}
                        onClick={() => {
                          setSelectedSitemapPageSlugs([]);
                          setError('');
                        }}
                        data-ai-generator-clear-selected-pages
                      >
                        선택 해제
                      </button>
                    </div>
	                  </div>
	                ) : null}
	                {applyScope === 'sitemap' ? (
	                  <label
	                    className={includeNavigation ? styles.navigationOptionActive : styles.navigationOption}
	                    data-ai-generator-include-navigation
	                    data-ai-generator-navigation-status={includeNavigation ? 'enabled' : 'disabled'}
	                  >
	                    <input
	                      type="checkbox"
	                      checked={includeNavigation}
	                      onChange={(event) => {
	                        setIncludeNavigation(event.target.checked);
	                        setNavigationAddedSlugs([]);
	                        setError('');
	                      }}
	                      data-ai-generator-include-navigation-toggle
	                    />
	                    <span>
	                      <strong>Navigation에 추가</strong>
	                      <small data-ai-generator-navigation-helper>
	                        {includeNavigation
	                          ? '선택한 draft pages를 메뉴 끝에 추가합니다. 미공개 page는 공개 header에서 숨깁니다.'
	                          : '페이지 draft만 만들고 메뉴 구조는 건드리지 않습니다.'}
	                      </small>
	                    </span>
	                    <em>{includeNavigation ? 'Nav on' : 'Draft only'}</em>
	                  </label>
	                ) : null}
                <div
                  className={styles.applyReviewCard}
                  data-ai-generator-apply-review
                  data-ai-generator-apply-review-scope={applyScope}
                  data-ai-generator-apply-review-page-count={applyReviewPages.length}
                  data-ai-generator-apply-review-section-count={applyReviewSectionCount}
                  data-ai-generator-apply-review-navigation={applyScope === 'sitemap' && includeNavigation ? 'enabled' : 'disabled'}
                >
                  <div className={styles.applyReviewHeader}>
                    <span>Apply review</span>
                    <strong>
                      {applyScope === 'sitemap'
                        ? `${applyReviewPages.length} draft pages`
                        : `${displayPlanPath(draftSlug)} draft`}
                    </strong>
                  </div>
                  <div className={styles.applyReviewStats}>
                    <span>
                      <strong>{applyReviewPages.length}</strong>
                      Pages
                    </span>
                    <span>
                      <strong>{applyReviewSectionCount}</strong>
                      Sections
                    </span>
                    <span>
                      <strong>{applyScope === 'sitemap' && includeNavigation ? 'On' : 'Off'}</strong>
                      Navigation
                    </span>
                  </div>
                  {applyReviewPages.length > 0 ? (
                    <div className={styles.applyReviewPageList}>
                      {applyReviewPages.slice(0, 4).map((page) => (
                        <span
                          key={page.slug}
                          data-ai-generator-apply-review-page
                          data-ai-generator-apply-review-page-slug={page.slug}
                        >
                          <strong>{page.title}</strong>
                          <small>{displayPlanPath(page.slug)} · {page.sections.slice(0, 4).join(' / ')}</small>
                        </span>
                      ))}
                      {applyReviewPages.length > 4 ? (
                        <em>+{applyReviewPages.length - 4} more</em>
                      ) : null}
                    </div>
                  ) : (
                    <p>선택된 생성 대상이 없습니다.</p>
                  )}
                  <p>
                    {applyScope === 'sitemap'
                      ? '선택한 slug만 draft로 생성하고, 기존 slug는 서버 검증 후 건너뜁니다.'
                      : '현재 사이트를 덮어쓰지 않고 새 draft page로 생성합니다.'}
                  </p>
                </div>
                <div className={styles.actionRowCompact}>
                  <button type="button" className={styles.secondaryButton} onClick={() => setStep(5)}>
                    다시 생성
                  </button>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    disabled={applying || Boolean(activeDraftSlugError) || (applyScope === 'sitemap' && selectedSitemapCount === 0)}
                    onClick={apply}
                    data-ai-generator-create-draft
                    data-ai-generator-create-selected-drafts
                  >
                    {applying
                      ? '생성 중...'
                      : applyScope === 'sitemap'
                        ? `선택한 ${selectedSitemapCount}개 draft 생성`
                        : 'Draft page 생성'}
                  </button>
                </div>
                {error ? <p className={styles.errorText}>{error}</p> : null}
                {skippedApplyPages.length > 0 ? (
                  <div className={styles.skippedList} data-ai-generator-skipped-pages>
                    {skippedApplyPages.map((page) => (
                      <span key={`${page.slug}-${page.reason}`}>
                        {page.title} · {page.slug} · {page.reason}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              {appliedPageId ? (
                <div
                  className={styles.successCard}
                  data-ai-generator-created-page
                  data-ai-generator-created-page-id={appliedPageId}
                  data-ai-generator-created-page-slug={appliedSlug ?? ''}
                  data-ai-generator-created-page-count={appliedPages.length || 1}
                >
	                  <p className={styles.successText}>
	                    새 draft page {appliedPages.length || 1}개 생성됨
	                  </p>
	                  {applyScope === 'sitemap' ? (
	                    <p
	                      className={styles.navigationResultText}
	                      data-ai-generator-created-navigation-status
	                    >
	                      {navigationAddedSlugs.length > 0
	                        ? `Navigation updated · ${navigationAddedSlugs.length} pages added`
	                        : 'Navigation skipped · draft only'}
	                    </p>
	                  ) : null}
	                  <div className={styles.createdPageList} data-ai-generator-created-page-list>
                    {(appliedPages.length > 0 ? appliedPages : [{ pageId: appliedPageId, slug: appliedSlug ?? '' }]).map((pageEntry) => (
                      <a
                        key={pageEntry.pageId}
                        href={`/${locale}/admin-builder?pageId=${encodeURIComponent(pageEntry.pageId)}`}
                        data-ai-generator-created-page-link
                        data-ai-generator-created-page-link-id={pageEntry.pageId}
                        data-ai-generator-created-page-link-slug={pageEntry.slug}
                      >
                        <strong>{pageEntry.title ?? pageEntry.slug}</strong>
                        <span>/{pageEntry.slug}</span>
                      </a>
                    ))}
                  </div>
                  <div className={styles.successActions}>
                    <a href={`/${locale}/admin-builder?pageId=${encodeURIComponent(appliedPageId)}`}>
                      첫 페이지 열기
                    </a>
                    <button
                      type="button"
                      className={styles.dangerButton}
                      disabled={discarding}
                      onClick={discardAppliedDraft}
                      data-ai-generator-discard-draft
                    >
                      {discarding ? '폐기 중...' : 'Draft 폐기'}
                    </button>
                  </div>
                </div>
              ) : null}
              {discardNotice ? (
                <p className={styles.successText} data-ai-generator-discard-notice>
                  {discardNotice}
                </p>
              ) : null}
            </section>

            <aside className={styles.planPanel}>
              <section className={styles.planSection} data-ai-generator-sitemap>
                <span className={styles.eyebrow}>Sitemap</span>
                <div className={styles.sitemapList}>
                  {draft.plan.sitemap.map((page) => {
                    const planSlug = normalizePlanSlug(page.slug);
	                    const skippedReason = skippedPageReasons.get(planSlug);
	                    const isCreated = appliedPageSlugs.has(planSlug);
	                    const isNavigationAdded = navigationAddedSlugSet.has(planSlug);
	                    const isHomePage = planSlug === '/';
                    const isSelected = selectedSitemapPageSlugSet.has(planSlug);
                    const status = isCreated
                      ? 'created'
                      : skippedReason
                        ? skippedReason
                        : isHomePage
                          ? 'home'
                          : !isSelected
                            ? 'not_selected'
                          : 'planned';
                    const statusClassName = [
                      styles.pageStatus,
                      isCreated
                        ? styles.pageStatusCreated
                        : skippedReason
                          ? styles.pageStatusSkipped
                          : styles.pageStatusPlanned,
                    ].join(' ');
                    return (
                      <article
                        key={page.slug}
                        data-ai-generator-sitemap-page
                        data-ai-generator-sitemap-page-slug={planSlug}
                      >
                        <div className={styles.sitemapCardTop}>
                          <label className={styles.sitemapSelectRow}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={isHomePage || isCreated || applying}
                              onChange={(event) => {
                                const checked = event.target.checked;
                                setSelectedSitemapPageSlugs((current) => {
                                  if (checked) return Array.from(new Set([...current, planSlug]));
                                  return current.filter((slug) => slug !== planSlug);
                                });
                                setError('');
                              }}
                              data-ai-generator-sitemap-page-checkbox={planSlug}
                            />
                            <span className={styles.sitemapCardTitle}>
                              <strong>{page.title}</strong>
                              <span className={styles.pageSlug}>{page.slug}</span>
                            </span>
                          </label>
	                          <span className={statusClassName} data-ai-generator-page-status={status}>
	                            {formatPageStatusLabel(status)}
	                          </span>
	                        </div>
	                        {isNavigationAdded ? (
	                          <span
	                            className={styles.navigationStatusChip}
	                            data-ai-generator-sitemap-navigation-status="added"
	                          >
	                            Navigation added
	                          </span>
	                        ) : null}
	                        <p>{page.purpose}</p>
                        <small>{page.sections.join(' / ')}</small>
                      </article>
                    );
                  })}
                </div>
              </section>

              <section className={styles.planSection} data-ai-generator-section-library>
                <span className={styles.eyebrow}>Reusable Sections</span>
                <div className={styles.generatedSectionList}>
                  {generatedSectionSnapshots.slice(0, 6).map((snapshot) => {
                    const savedSectionId = savedSectionIds[snapshot.rootNodeId] ?? '';
                    const saving = savingSectionRootId === snapshot.rootNodeId;
                    return (
                      <article
                        key={snapshot.sectionKey}
                        className={styles.generatedSectionCard}
                        data-ai-generator-section-card
                        data-ai-generator-section-root-id={snapshot.rootNodeId}
                        data-ai-generator-saved-section-id={savedSectionId}
                      >
                        <div>
                          <strong>{snapshot.name.replace(/^AI\s+/, '')}</strong>
                          <span>{snapshot.category}</span>
                        </div>
                        <p>{snapshot.description}</p>
                        <button
                          type="button"
                          className={styles.secondaryButton}
                          disabled={saving || Boolean(savedSectionId)}
                          onClick={() => { void saveGeneratedSection(snapshot); }}
                          data-ai-generator-save-section
                        >
                          {savedSectionId ? '저장됨' : saving ? '저장 중...' : 'Saved Sections에 저장'}
                        </button>
                      </article>
                    );
                  })}
                </div>
                {sectionSaveNotice ? (
                  <p className={styles.successText} data-ai-generator-section-save-notice>
                    {sectionSaveNotice}
                  </p>
                ) : null}
              </section>

              <section className={styles.planSection} data-ai-generator-content-plan>
                <span className={styles.eyebrow}>Content Plan</span>
                <div className={styles.contentPlanList}>
                  {draft.plan.contentPlan.map((item) => (
                    <article key={item.sectionId}>
                      <strong>{item.title}</strong>
                      <span>{item.intent}</span>
                    </article>
                  ))}
                </div>
              </section>

              <section className={styles.planSection}>
                <span className={styles.eyebrow}>Brand Brief</span>
                <dl className={styles.brandBrief}>
                  <div>
                    <dt>고객</dt>
                    <dd>{draft.plan.brandBrief.audience}</dd>
                  </div>
                  <div>
                    <dt>목표</dt>
                    <dd>{draft.plan.brandBrief.goals.join(', ')}</dd>
                  </div>
                  <div>
                    <dt>키워드</dt>
                    <dd>{draft.plan.brandBrief.keywords.join(', ')}</dd>
                  </div>
                  <div>
                    <dt>제약</dt>
                    <dd>{draft.plan.brandBrief.constraints}</dd>
                  </div>
                </dl>
              </section>
            </aside>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function Panel({
  kicker,
  title,
  description,
  children,
  footer,
}: {
  kicker: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <article className={styles.panel}>
      <div className={styles.panelHead}>
        <span className={styles.eyebrow}>{kicker}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className={styles.panelBody}>{children}</div>
      {footer}
    </article>
  );
}

function StepFooter({
  previous,
  next,
  primaryLabel = '다음',
  nextDisabled,
  nextDataAttr,
}: {
  previous?: () => void;
  next?: () => void;
  primaryLabel?: string;
  nextDisabled?: boolean;
  nextDataAttr?: string;
}) {
  const dataAttrs = nextDataAttr ? { [nextDataAttr]: true } : {};
  return (
    <div className={styles.actionRow}>
      {previous ? (
        <button type="button" className={styles.secondaryButton} onClick={previous}>
          이전
        </button>
      ) : <span />}
      <button
        type="button"
        className={styles.primaryButton}
        disabled={nextDisabled}
        onClick={next}
        {...dataAttrs}
      >
        {primaryLabel}
      </button>
    </div>
  );
}
