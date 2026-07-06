'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import {
  describeLinkScheme,
  isLinkSafe,
  sanitizeLinkValue,
  type LinkValue,
} from '@/lib/builder/links';
import type { Locale } from '@/lib/locales';
import { getLinkPickerCopy } from './link-picker-copy';
import styles from './LinkPicker.module.css';

export interface LinkPickerContext {
  siteAnchors?: string[];
  siteLightboxes?: { id: string; slug: string; name: string }[];
  sitePopups?: { id: string; slug: string; name: string }[];
  /**
   * 현재 사이트의 페이지 path 자동완성. `/`로 시작하는 href 입력 시 datalist로 노출.
   * 형식: { path: '/about', title: 'About', slug?: 'about' }.
   */
  sitePages?: { path: string; title?: string; slug?: string }[];
}

const EMPTY_SITE_ANCHORS: NonNullable<LinkPickerContext['siteAnchors']> = [];
const EMPTY_SITE_LIGHTBOXES: NonNullable<LinkPickerContext['siteLightboxes']> = [];
const EMPTY_SITE_PAGES: NonNullable<LinkPickerContext['sitePages']> = [];
const EMPTY_SITE_POPUPS: NonNullable<LinkPickerContext['sitePopups']> = [];

interface LinkPickerProps {
  value: LinkValue | null;
  onChange: (value: LinkValue | null) => void;
  context?: LinkPickerContext;
  disabled?: boolean;
  locale?: Locale;
}

export default function LinkPicker({
  value,
  onChange,
  context,
  disabled = false,
  locale,
}: LinkPickerProps) {
  const anchorListId = useId();
  const pageListId = useId();
  const [draft, setDraft] = useState<LinkValue>(() => value ?? { href: '', target: '_self' });
  const [advancedOpen, setAdvancedOpen] = useState(false);

  useEffect(() => {
    setDraft(value ?? { href: '', target: '_self' });
  }, [value]);

  const href = draft.href ?? '';
  const trimmedHref = href.trim();
  const hasHref = trimmedHref.length > 0;
  const isSafe = hasHref ? isLinkSafe(trimmedHref) : true;
  const scheme = hasHref ? describeLinkScheme(trimmedHref) : 'invalid';
  const lightboxes = context?.siteLightboxes ?? EMPTY_SITE_LIGHTBOXES;
  const popups = context?.sitePopups ?? EMPTY_SITE_POPUPS;
  const anchors = context?.siteAnchors ?? EMPTY_SITE_ANCHORS;
  const sitePages = context?.sitePages ?? EMPTY_SITE_PAGES;
  const anchorOptions = useMemo(() => {
    const seen = new Set<string>();
    const options: string[] = [];
    for (const anchor of anchors) {
      const nextAnchor = anchor.trim();
      if (!nextAnchor || seen.has(nextAnchor)) continue;
      seen.add(nextAnchor);
      options.push(nextAnchor);
    }
    return options;
  }, [anchors]);
  const pageOptions = useMemo(() => {
    const seen = new Set<string>();
    const options: Array<{ path: string; label?: string }> = [];
    for (const page of sitePages) {
      const path = page.path.trim();
      if (!path || seen.has(path)) continue;
      seen.add(path);
      options.push({ path, label: page.title || page.slug });
    }
    return options;
  }, [sitePages]);
  const showLightboxSelect = trimmedHref.startsWith('lightbox:') && lightboxes.length > 0;
  const showPopupSelect = trimmedHref.startsWith('popup:') && popups.length > 0;
  const showPageList = trimmedHref.startsWith('/') && pageOptions.length > 0;
  const copy = getLinkPickerCopy(locale);

  const lightboxSlug = useMemo(() => {
    return trimmedHref.startsWith('lightbox:')
      ? trimmedHref.slice('lightbox:'.length).trim()
      : '';
  }, [trimmedHref]);
  const popupSlug = useMemo(() => {
    return trimmedHref.startsWith('popup:')
      ? trimmedHref.slice('popup:'.length).trim()
      : '';
  }, [trimmedHref]);

  function commit(next: LinkValue) {
    setDraft(next);
    if (!next.href.trim()) {
      onChange(null);
      return;
    }
    const sanitized = sanitizeLinkValue(next);
    if (sanitized) {
      onChange(sanitized);
    }
  }

  function patch(partial: Partial<LinkValue>) {
    const next = { ...draft, ...partial };
    commit(next);
  }

  function handleTargetChange(nextTarget: '_self' | '_blank') {
    const next: LinkValue = { ...draft, target: nextTarget };
    if (nextTarget === '_blank') {
      next.rel = sanitizeLinkValue({ href: draft.href || '/', target: '_blank', rel: draft.rel })?.rel;
    }
    commit(next);
  }

  return (
    <div className={styles.root} data-builder-link-picker="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.link.label}</span>
        <input
          className={styles.control}
          type="text"
          value={href}
          disabled={disabled}
          placeholder={copy.link.placeholder}
          data-invalid={!isSafe ? 'true' : undefined}
          list={
            showPageList
              ? pageListId
              : trimmedHref.startsWith('#') && anchorOptions.length > 0
                ? anchorListId
                : undefined
          }
          data-builder-href-input="true"
          onChange={(event) => patch({ href: event.target.value })}
        />
        {anchorOptions.length > 0 ? (
          <datalist id={anchorListId}>
            {anchorOptions.map((anchor) => (
              <option key={anchor} value={`#${anchor}`} />
            ))}
          </datalist>
        ) : null}
        {pageOptions.length > 0 ? (
          <datalist id={pageListId}>
            {pageOptions.map((page) => (
              <option key={page.path} value={page.path} label={page.label} />
            ))}
          </datalist>
        ) : null}
        {!isSafe ? (
          <span className={styles.errorText}>{copy.link.blockedLink}</span>
        ) : hasHref ? (
          <span className={styles.helpText}>
            {copy.link.detectedScheme}: {scheme}
          </span>
        ) : (
          <span className={styles.helpText}>{copy.link.emptyLink}</span>
        )}
      </label>

      {showLightboxSelect ? (
        <label className={styles.field}>
          <span className={styles.label}>{copy.link.lightboxLabel}</span>
          <select
            className={styles.control}
            value={lightboxSlug}
            disabled={disabled}
            onChange={(event) => patch({ href: event.target.value ? `lightbox:${event.target.value}` : '' })}
          >
            <option value="">{copy.link.lightboxPlaceholder}</option>
            {lightboxes.map((lightbox) => (
              <option key={lightbox.id} value={lightbox.slug}>
                {lightbox.name} ({lightbox.slug})
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {showPopupSelect ? (
        <label className={styles.field}>
          <span className={styles.label}>{copy.link.popupLabel}</span>
          <select
            className={styles.control}
            value={popupSlug}
            disabled={disabled}
            onChange={(event) => patch({ href: event.target.value ? `popup:${event.target.value}` : '' })}
          >
            <option value="">{copy.link.popupPlaceholder}</option>
            {popups.map((popup) => (
              <option key={popup.id} value={popup.slug}>
                {popup.name} ({popup.slug})
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <label className={styles.field}>
        <span className={styles.label}>{copy.link.targetLabel}</span>
        <select
          className={styles.control}
          value={draft.target ?? '_self'}
          disabled={disabled}
          onChange={(event) => handleTargetChange(event.target.value as '_self' | '_blank')}
        >
          <option value="_self">{copy.link.targetSelf}</option>
          <option value="_blank">{copy.link.targetBlank}</option>
        </select>
      </label>

      <button
        type="button"
        className={styles.secondaryButton}
        disabled={disabled}
        onClick={() => setAdvancedOpen((current) => !current)}
      >
        {advancedOpen ? copy.link.advancedHide : copy.link.advancedShow}
      </button>

      {advancedOpen ? (
        <div className={styles.advancedFields}>
          <label className={styles.field}>
            <span className={styles.label}>{copy.link.relLabel}</span>
            <input
              className={styles.control}
              type="text"
              value={draft.rel ?? ''}
              disabled={disabled}
              placeholder="noopener noreferrer"
              onChange={(event) => patch({ rel: event.target.value || undefined })}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>{copy.link.titleLabel}</span>
            <input
              className={styles.control}
              type="text"
              value={draft.title ?? ''}
              disabled={disabled}
              maxLength={200}
              onChange={(event) => patch({ title: event.target.value || undefined })}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>{copy.link.ariaLabelLabel}</span>
            <input
              className={styles.control}
              type="text"
              value={draft.ariaLabel ?? ''}
              disabled={disabled}
              maxLength={200}
              onChange={(event) => patch({ ariaLabel: event.target.value || undefined })}
            />
          </label>
        </div>
      ) : null}

      <button
        type="button"
        className={styles.dangerButton}
        disabled={disabled}
        onClick={() => {
          setDraft({ href: '', target: '_self' });
          onChange(null);
        }}
      >
        {copy.link.clearLink}
      </button>
    </div>
  );
}
