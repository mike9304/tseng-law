'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BLOG_ADMIN_AUTHORS,
  BLOG_ADMIN_CATEGORIES,
  getCategoryLabel,
  getColumnBlogCategory,
} from '@/components/builder/columns/blogAdminMeta';
import { getColumnEditCopy } from '@/components/builder/columns/column-edit-copy';
import type { Locale } from '@/lib/locales';
import type { ColumnFrontmatter, ColumnTypography, ColumnTypographyPresetId } from '@/lib/builder/columns/types';
import {
  defaultTypographyForLocale,
  listTypographyPresetsForLocale,
  resolveTypography,
} from '@/lib/builder/columns/typography';

interface ColumnFrontmatterPanelProps {
  slug: string;
  locale: Locale;
  initial: ColumnFrontmatter;
  hasPublished?: boolean;
  onSaveStatus?: (status: 'saving' | 'saved' | 'error') => void;
  onTypographyChange?: (typography: ColumnTypography) => void;
}

function roleFromPresetId(presetId: ColumnTypographyPresetId): keyof ReturnType<typeof getColumnEditCopy>['frontmatter']['presetLabels'] {
  if (presetId.endsWith('body-readable')) return 'body-readable';
  if (presetId.endsWith('display-serif')) return 'display-serif';
  if (presetId.endsWith('compact')) return 'compact';
  return 'body-sans';
}

const DEBOUNCE_MS = 1000;

function toDateValue(value?: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function toDateTimeValue(value?: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 16);
  return date.toISOString().slice(0, 16);
}

function fromDateTimeValue(value: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function normalizeColumnSlugDraft(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function uniqueTags(tags: string[]): string[] {
  return [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))].slice(0, 20);
}

export default function ColumnFrontmatterPanel({
  slug,
  locale,
  initial,
  hasPublished = false,
  onSaveStatus,
  onTypographyChange,
}: ColumnFrontmatterPanelProps) {
  const copy = getColumnEditCopy(locale);
  const router = useRouter();
  const initialCategory = getColumnBlogCategory(initial);
  const resolvedInitialTypography = resolveTypography(locale, initial.typography);
  const [slugDraft, setSlugDraft] = useState(slug);
  const [slugStatus, setSlugStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [slugMessage, setSlugMessage] = useState<string | null>(null);
  const [lastmod, setLastmod] = useState(toDateValue(initial.lastmod));
  const [reviewStatus, setReviewStatus] = useState(initial.attorneyReviewStatus || 'pending');
  const [freshness, setFreshness] = useState(initial.freshness || 'unknown');
  const [blogCategory, setBlogCategory] = useState(initialCategory.slug);
  const [tags, setTags] = useState<string[]>(initial.tags ?? []);
  const [tagDraft, setTagDraft] = useState('');
  const [authorName, setAuthorName] = useState(initial.author?.name ?? BLOG_ADMIN_AUTHORS[0].name);
  const [authorTitle, setAuthorTitle] = useState(initial.author?.title ?? BLOG_ADMIN_AUTHORS[0].title);
  const [authorPhoto, setAuthorPhoto] = useState(initial.author?.photo ?? '');
  const [featured, setFeatured] = useState(Boolean(initial.featured));
  const [featuredImage, setFeaturedImage] = useState(initial.featuredImage ?? '');
  const [publishedAt, setPublishedAt] = useState(toDateTimeValue(initial.publishedAt));
  const [seoTitle, setSeoTitle] = useState(initial.seo?.title ?? '');
  const [seoDescription, setSeoDescription] = useState(initial.seo?.description ?? '');
  const [seoOgImage, setSeoOgImage] = useState(initial.seo?.ogImage ?? '');
  const [seoNoIndex, setSeoNoIndex] = useState(Boolean(initial.seo?.noIndex));
  const [typographyPresetId, setTypographyPresetId] = useState<ColumnTypographyPresetId>(
    resolvedInitialTypography.presetId,
  );
  const [bodySize, setBodySize] = useState<'sm' | 'md' | 'lg' | ''>(
    initial.typography?.bodySize ?? '',
  );
  const [lineHeight, setLineHeight] = useState<'tight' | 'normal' | 'relaxed' | ''>(
    initial.typography?.lineHeight ?? '',
  );
  const [headingWeight, setHeadingWeight] = useState<'500' | '600' | '700' | ''>(
    initial.typography?.headingWeight ?? '',
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef('');
  const hydratedRef = useRef(false);
  const localePresets = useMemo(() => listTypographyPresetsForLocale(locale), [locale]);

  const currentTypography = useMemo((): ColumnTypography => {
    const base = defaultTypographyForLocale(locale);
    return {
      presetId: typographyPresetId || base.presetId,
      ...(bodySize ? { bodySize } : {}),
      ...(lineHeight ? { lineHeight } : {}),
      ...(headingWeight ? { headingWeight } : {}),
    };
  }, [locale, typographyPresetId, bodySize, lineHeight, headingWeight]);

  useEffect(() => {
    onTypographyChange?.(currentTypography);
  }, [currentTypography, onTypographyChange]);

  const selectedCategory = useMemo(
    () => BLOG_ADMIN_CATEGORIES.find((category) => category.slug === blogCategory) ?? BLOG_ADMIN_CATEGORIES[6],
    [blogCategory],
  );
  const normalizedSlugDraft = useMemo(() => normalizeColumnSlugDraft(slugDraft), [slugDraft]);
  const slugChanged = Boolean(normalizedSlugDraft) && normalizedSlugDraft !== slug;

  useEffect(() => {
    setSlugDraft(slug);
    setSlugStatus('idle');
    setSlugMessage(null);
  }, [slug]);

  const buildPayload = useCallback(() => {
    const isoLastmod = lastmod
      ? new Date(`${lastmod}T00:00:00+09:00`).toISOString()
      : new Date().toISOString();
    const payload = {
      frontmatter: {
        lastmod: isoLastmod,
        attorneyReviewStatus: reviewStatus,
        freshness,
        category: selectedCategory.legacyCategory ?? 'legal',
        blogCategory,
        tags: uniqueTags(tags),
        author: {
          name: authorName.trim() || BLOG_ADMIN_AUTHORS[0].name,
          ...(authorTitle.trim() ? { title: authorTitle.trim() } : {}),
          ...(authorPhoto.trim() ? { photo: authorPhoto.trim() } : {}),
        },
        featured,
        featuredImage: featuredImage.trim() || null,
        publishedAt: fromDateTimeValue(publishedAt),
        seo: {
          ...(seoTitle.trim() ? { title: seoTitle.trim() } : {}),
          ...(seoDescription.trim() ? { description: seoDescription.trim() } : {}),
          ...(seoOgImage.trim() ? { ogImage: seoOgImage.trim() } : {}),
          noIndex: seoNoIndex,
        },
        typography: currentTypography,
      },
    };
    const serialized = JSON.stringify(payload);
    return { payload, serialized };
  }, [
    lastmod,
    reviewStatus,
    freshness,
    selectedCategory,
    blogCategory,
    tags,
    authorName,
    authorTitle,
    authorPhoto,
    featured,
    featuredImage,
    publishedAt,
    seoTitle,
    seoDescription,
    seoOgImage,
    seoNoIndex,
    currentTypography,
  ]);

  const save = useCallback(async () => {
    const { serialized } = buildPayload();
    if (!hydratedRef.current) {
      lastSavedRef.current = serialized;
      hydratedRef.current = true;
      return;
    }
    if (serialized === lastSavedRef.current) return;

    onSaveStatus?.('saving');
    try {
      const res = await fetch(
        `/api/builder/columns/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: serialized,
        },
      );
      if (res.ok) {
        lastSavedRef.current = serialized;
        onSaveStatus?.('saved');
      } else {
        onSaveStatus?.('error');
      }
    } catch {
      onSaveStatus?.('error');
    }
  }, [
    slug,
    locale,
    buildPayload,
    onSaveStatus,
  ]);

  const scheduleSave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, DEBOUNCE_MS);
  }, [save]);

  useEffect(() => {
    if (!hydratedRef.current) {
      lastSavedRef.current = buildPayload().serialized;
      hydratedRef.current = true;
      return undefined;
    }
    scheduleSave();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [buildPayload, scheduleSave]);

  function addTag(value: string) {
    const next = value.trim().replace(/^#/, '');
    if (!next) return;
    setTags((current) => uniqueTags([...current, next]));
    setTagDraft('');
  }

  async function saveSlug() {
    if (!normalizedSlugDraft) {
      setSlugStatus('error');
      setSlugMessage(copy.frontmatter.slugSaveError);
      return;
    }
    if (!slugChanged) {
      setSlugDraft(normalizedSlugDraft);
      setSlugMessage(copy.frontmatter.slugSame);
      return;
    }

    setSlugStatus('saving');
    setSlugMessage(null);
    onSaveStatus?.('saving');
    try {
      const res = await fetch(
        `/api/builder/columns/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ slug: normalizedSlugDraft }),
        },
      );
      const payload = await res.json().catch(() => ({})) as {
        ok?: boolean;
        error?: string;
        column?: { slug?: string };
        slugRedirect?: { status?: string; from?: string; to?: string };
      };
      if (!res.ok || !payload.ok || !payload.column?.slug) {
        throw new Error(payload.error ?? `${copy.frontmatter.slugSaveError} (${res.status}).`);
      }

      const nextSlug = payload.column.slug;
      setSlugDraft(nextSlug);
      setSlugStatus('saved');
      const redirectFrom = payload.slugRedirect?.from ?? '';
      const redirectTo = payload.slugRedirect?.to ?? '';
      setSlugMessage(
        payload.slugRedirect?.status === 'pending-publish'
          ? copy.frontmatter.slugSavedRedirect(redirectFrom, redirectTo)
          : copy.frontmatter.slugSaved,
      );
      onSaveStatus?.('saved');
      router.replace(`/${locale}/admin-builder/columns/${encodeURIComponent(nextSlug)}/edit`);
    } catch (error) {
      setSlugStatus('error');
      setSlugMessage(error instanceof Error ? error.message : copy.frontmatter.slugSaveError);
      onSaveStatus?.('error');
    }
  }

  return (
    <aside className="column-frontmatter-panel">
      <div className="column-panel-heading">
        <span>{copy.frontmatter.settings}</span>
        <h3>{copy.frontmatter.panelHeading}</h3>
      </div>

      <details className="column-panel-section column-panel-details" open>
        <summary>{copy.frontmatter.publish}</summary>
        <label className="column-toggle-row">
          <span>
            <strong>{copy.frontmatter.featuredTitle}</strong>
            <em>{copy.frontmatter.featuredDescription}</em>
          </span>
          <input
            type="checkbox"
            checked={featured}
            onChange={(event) => setFeatured(event.target.checked)}
          />
        </label>

        <label className="column-editor-field">
          <span>{copy.frontmatter.publishDate}</span>
          <input
            type="datetime-local"
            value={publishedAt}
            onChange={(event) => setPublishedAt(event.target.value)}
          />
        </label>

        <label className="column-editor-field">
          <span>{copy.frontmatter.lastModified}</span>
          <input type="date" value={lastmod} onChange={(event) => setLastmod(event.target.value)} />
        </label>

        <div className="column-editor-field column-slug-editor" data-column-slug-editor>
          <span>{copy.frontmatter.slugLabel}</span>
          <small>
            {copy.frontmatter.slugHint}
          </small>
          <div className="column-slug-row">
            <input
              type="text"
              value={slugDraft}
              aria-label={copy.frontmatter.slugInputAria}
              onChange={(event) => setSlugDraft(event.target.value)}
              onBlur={() => setSlugDraft(normalizedSlugDraft || slugDraft.trim())}
            />
            <button
              type="button"
              className="column-editor-btn-save"
              disabled={slugStatus === 'saving' || !slugChanged}
              onClick={() => void saveSlug()}
            >
              {slugStatus === 'saving' ? copy.frontmatter.saving : copy.frontmatter.saveSlug}
            </button>
          </div>
          <small className="column-slug-preview">
            /{locale}/columns/{normalizedSlugDraft || '{slug}'}
            {hasPublished ? copy.slugPreviewPublished : copy.slugPreviewDraft}
          </small>
          {slugMessage ? (
            <small
              className={`column-slug-status is-${slugStatus}`}
              role={slugStatus === 'error' ? 'alert' : 'status'}
            >
              {slugMessage}
            </small>
          ) : null}
        </div>
      </details>

      <details className="column-panel-section column-panel-details" open data-column-typography-panel>
        <summary>{copy.frontmatter.typography}</summary>
        <label className="column-editor-field">
          <span>{copy.frontmatter.typographyLabel}</span>
          <select
            value={typographyPresetId}
            aria-label={copy.frontmatter.typographyLabel}
            onChange={(event) => setTypographyPresetId(event.target.value as ColumnTypographyPresetId)}
          >
            {localePresets.map((presetId) => (
              <option key={presetId} value={presetId}>
                {copy.frontmatter.presetLabels[roleFromPresetId(presetId)]}
              </option>
            ))}
          </select>
          <small>{copy.frontmatter.typographyHelp}</small>
        </label>
        <label className="column-editor-field">
          <span>{copy.frontmatter.bodySizeLabel}</span>
          <select
            value={bodySize}
            onChange={(event) => setBodySize(event.target.value as 'sm' | 'md' | 'lg' | '')}
          >
            <option value="">{copy.frontmatter.sizeMd} (default)</option>
            <option value="sm">{copy.frontmatter.sizeSm}</option>
            <option value="md">{copy.frontmatter.sizeMd}</option>
            <option value="lg">{copy.frontmatter.sizeLg}</option>
          </select>
        </label>
        <label className="column-editor-field">
          <span>{copy.frontmatter.lineHeightLabel}</span>
          <select
            value={lineHeight}
            onChange={(event) => setLineHeight(event.target.value as 'tight' | 'normal' | 'relaxed' | '')}
          >
            <option value="">{copy.frontmatter.lineNormal} (default)</option>
            <option value="tight">{copy.frontmatter.lineTight}</option>
            <option value="normal">{copy.frontmatter.lineNormal}</option>
            <option value="relaxed">{copy.frontmatter.lineRelaxed}</option>
          </select>
        </label>
        <label className="column-editor-field">
          <span>{copy.frontmatter.headingWeightLabel}</span>
          <select
            value={headingWeight}
            onChange={(event) => setHeadingWeight(event.target.value as '500' | '600' | '700' | '')}
          >
            <option value="">600 (default)</option>
            <option value="500">500</option>
            <option value="600">600</option>
            <option value="700">700</option>
          </select>
        </label>
      </details>

      <details className="column-panel-section column-panel-details" open>
        <summary>{copy.frontmatter.category}</summary>
        <label className="column-editor-field">
          <span>{copy.frontmatter.category}</span>
          <select value={blogCategory} onChange={(event) => setBlogCategory(event.target.value)}>
            {BLOG_ADMIN_CATEGORIES.map((category) => (
              <option key={category.slug} value={category.slug}>
                {getCategoryLabel(category, locale)}
              </option>
            ))}
          </select>
        </label>

        <label className="column-editor-field">
          <span>{copy.frontmatter.tags}</span>
          <div className="column-tag-editor">
            <div>
              {tags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setTags((current) => current.filter((item) => item !== tag))}
                  aria-label={copy.frontmatter.tagRemove(tag)}
                >
                  #{tag}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={tagDraft}
              onChange={(event) => setTagDraft(event.target.value)}
              onBlur={(event) => addTag(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ',') {
                  event.preventDefault();
                  addTag(tagDraft);
                }
              }}
              placeholder={copy.frontmatter.tagPlaceholder}
            />
          </div>
        </label>
      </details>

      <details className="column-panel-section column-panel-details">
        <summary>{copy.frontmatter.author}</summary>
        <label className="column-editor-field">
          <span>{copy.frontmatter.authorPreset}</span>
          <select
            value={authorName}
            onChange={(event) => {
              const author = BLOG_ADMIN_AUTHORS.find((item) => item.name === event.target.value);
              setAuthorName(event.target.value);
              if (author) {
                setAuthorTitle(author.title);
                setAuthorPhoto(author.photo);
              }
            }}
          >
            {BLOG_ADMIN_AUTHORS.map((author) => (
              <option key={author.id} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </label>
        <label className="column-editor-field">
          <span>{copy.frontmatter.authorName}</span>
          <input value={authorName} onChange={(event) => setAuthorName(event.target.value)} />
        </label>
        <label className="column-editor-field">
          <span>{copy.frontmatter.authorTitle}</span>
          <input value={authorTitle} onChange={(event) => setAuthorTitle(event.target.value)} />
        </label>
        <label className="column-editor-field">
          <span>{copy.frontmatter.authorPhoto}</span>
          <input value={authorPhoto} onChange={(event) => setAuthorPhoto(event.target.value)} />
        </label>
      </details>

      <details className="column-panel-section column-panel-details">
        <summary>{copy.frontmatter.featuredImage}</summary>
        <label className="column-editor-field">
          <span>{copy.frontmatter.featuredImage}</span>
          <input
            value={featuredImage}
            onChange={(event) => setFeaturedImage(event.target.value)}
            placeholder={copy.frontmatter.featuredImagePlaceholder}
          />
        </label>
      </details>

      <details className="column-panel-section column-panel-details">
        <summary>{copy.frontmatter.seo}</summary>
        <label className="column-editor-field">
          <span>{copy.frontmatter.seoTitle}</span>
          <input value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} maxLength={200} />
        </label>
        <label className="column-editor-field">
          <span>{copy.frontmatter.seoDescription}</span>
          <textarea
            value={seoDescription}
            onChange={(event) => setSeoDescription(event.target.value)}
            rows={3}
            maxLength={500}
          />
        </label>
        <label className="column-editor-field">
          <span>{copy.frontmatter.seoOgImage}</span>
          <input value={seoOgImage} onChange={(event) => setSeoOgImage(event.target.value)} />
        </label>
        <label className="column-toggle-row">
          <span>
            <strong>{copy.frontmatter.noIndexTitle}</strong>
            <em>{copy.frontmatter.noIndexDescription}</em>
          </span>
          <input
            type="checkbox"
            checked={seoNoIndex}
            onChange={(event) => setSeoNoIndex(event.target.checked)}
          />
        </label>
      </details>

      <details className="column-panel-section column-panel-details" open>
        <summary>{copy.frontmatter.typography}</summary>
        <label className="column-editor-field">
          <span>{copy.frontmatter.typographyLabel}</span>
          <select
            value={typographyPresetId}
            onChange={(event) => setTypographyPresetId(event.target.value as ColumnTypographyPresetId)}
            aria-label={copy.frontmatter.typographyLabel}
          >
            {localePresets.map((id) => (
              <option key={id} value={id}>
                {copy.frontmatter.presetLabels[roleFromPresetId(id)] ?? id}
              </option>
            ))}
          </select>
          <small>{copy.frontmatter.typographyHelp}</small>
        </label>
        <label className="column-editor-field">
          <span>{copy.frontmatter.bodySizeLabel}</span>
          <select
            value={bodySize}
            onChange={(event) => setBodySize(event.target.value as 'sm' | 'md' | 'lg' | '')}
          >
            <option value="">{copy.frontmatter.sizeMd}</option>
            <option value="sm">{copy.frontmatter.sizeSm}</option>
            <option value="md">{copy.frontmatter.sizeMd}</option>
            <option value="lg">{copy.frontmatter.sizeLg}</option>
          </select>
        </label>
        <label className="column-editor-field">
          <span>{copy.frontmatter.lineHeightLabel}</span>
          <select
            value={lineHeight}
            onChange={(event) => setLineHeight(event.target.value as 'tight' | 'normal' | 'relaxed' | '')}
          >
            <option value="">{copy.frontmatter.lineNormal}</option>
            <option value="tight">{copy.frontmatter.lineTight}</option>
            <option value="normal">{copy.frontmatter.lineNormal}</option>
            <option value="relaxed">{copy.frontmatter.lineRelaxed}</option>
          </select>
        </label>
        <label className="column-editor-field">
          <span>{copy.frontmatter.headingWeightLabel}</span>
          <select
            value={headingWeight}
            onChange={(event) => setHeadingWeight(event.target.value as '500' | '600' | '700' | '')}
          >
            <option value="">600</option>
            <option value="500">500</option>
            <option value="600">600</option>
            <option value="700">700</option>
          </select>
        </label>
      </details>

      <details className="column-panel-section column-panel-details">
        <summary>{copy.frontmatter.review}</summary>
        <label className="column-editor-field">
          <span>{copy.frontmatter.reviewStatus}</span>
          <select
            value={reviewStatus}
            onChange={(event) => setReviewStatus(event.target.value as ColumnFrontmatter['attorneyReviewStatus'])}
          >
            <option value="pending">{copy.frontmatter.reviewPending}</option>
            <option value="reviewed">{copy.frontmatter.reviewReviewed}</option>
            <option value="needs-revision">{copy.frontmatter.reviewNeedsRevision}</option>
          </select>
        </label>

        <label className="column-editor-field">
          <span>{copy.frontmatter.freshness}</span>
          <select
            value={freshness}
            onChange={(event) => setFreshness(event.target.value as ColumnFrontmatter['freshness'])}
          >
            <option value="fresh">{copy.frontmatter.freshnessFresh}</option>
            <option value="review_needed">{copy.frontmatter.freshnessReviewNeeded}</option>
            <option value="unknown">{copy.frontmatter.freshnessUnknown}</option>
          </select>
        </label>
      </details>
    </aside>
  );
}
