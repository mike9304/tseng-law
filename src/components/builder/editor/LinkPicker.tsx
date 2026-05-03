'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import {
  describeLinkScheme,
  isLinkSafe,
  sanitizeLinkValue,
  type LinkValue,
} from '@/lib/builder/links';

export interface LinkPickerContext {
  siteAnchors?: string[];
  siteLightboxes?: { id: string; slug: string; name: string }[];
  /**
   * 현재 사이트의 페이지 path 자동완성. `/`로 시작하는 href 입력 시 datalist로 노출.
   * 형식: { path: '/about', title: 'About', slug?: 'about' }.
   */
  sitePages?: { path: string; title?: string; slug?: string }[];
}

interface LinkPickerProps {
  value: LinkValue | null;
  onChange: (value: LinkValue | null) => void;
  context?: LinkPickerContext;
  disabled?: boolean;
}

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  fontSize: '0.78rem',
  color: '#334155',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: 700,
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '6px 10px',
  border: '1px solid #dbe3ec',
  borderRadius: 8,
  fontSize: '0.82rem',
  color: '#0f172a',
  outline: 'none',
  background: '#fff',
};

const helpStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  color: '#64748b',
  lineHeight: 1.35,
};

const errorStyle: React.CSSProperties = {
  ...helpStyle,
  color: '#dc2626',
  fontWeight: 700,
};

const clearButtonStyle: React.CSSProperties = {
  alignSelf: 'flex-start',
  border: '1px solid #fecaca',
  borderRadius: 8,
  background: '#fff7f7',
  color: '#b91c1c',
  cursor: 'pointer',
  fontSize: '0.74rem',
  fontWeight: 700,
  padding: '5px 9px',
};

const toggleButtonStyle: React.CSSProperties = {
  alignSelf: 'flex-start',
  border: '1px solid #dbe3ec',
  borderRadius: 8,
  background: '#f8fafc',
  color: '#334155',
  cursor: 'pointer',
  fontSize: '0.74rem',
  fontWeight: 700,
  padding: '5px 9px',
};

export default function LinkPicker({
  value,
  onChange,
  context,
  disabled = false,
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
  const lightboxes = context?.siteLightboxes ?? [];
  const anchors = context?.siteAnchors ?? [];
  const sitePages = context?.sitePages ?? [];
  const showLightboxSelect = trimmedHref.startsWith('lightbox:') && lightboxes.length > 0;
  const showPageList = trimmedHref.startsWith('/') && sitePages.length > 0;

  const lightboxSlug = useMemo(() => {
    return trimmedHref.startsWith('lightbox:')
      ? trimmedHref.slice('lightbox:'.length).trim()
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <label style={fieldStyle}>
        <span style={labelStyle}>Link</span>
        <input
          type="text"
          value={href}
          disabled={disabled}
          placeholder="/ko/contact, #contact, lightbox:demo, https://..."
          style={{
            ...inputStyle,
            borderColor: !isSafe ? '#ef4444' : '#dbe3ec',
          }}
          list={
            showPageList
              ? pageListId
              : trimmedHref.startsWith('#') && anchors.length > 0
                ? anchorListId
                : undefined
          }
          data-builder-href-input="true"
          onChange={(event) => patch({ href: event.target.value })}
        />
        {anchors.length > 0 ? (
          <datalist id={anchorListId}>
            {anchors.map((anchor) => (
              <option key={anchor} value={`#${anchor}`} />
            ))}
          </datalist>
        ) : null}
        {sitePages.length > 0 ? (
          <datalist id={pageListId}>
            {sitePages.map((page) => (
              <option key={page.path} value={page.path} label={page.title || page.slug} />
            ))}
          </datalist>
        ) : null}
        {!isSafe ? (
          <span style={errorStyle}>
            차단된 링크입니다. `/`, `#`, `lightbox:`, `https:`, `http:`, `mailto:`, `tel:` 만 허용됩니다.
          </span>
        ) : hasHref ? (
          <span style={helpStyle}>감지된 링크 유형: {scheme}</span>
        ) : (
          <span style={helpStyle}>비워두면 링크가 제거됩니다.</span>
        )}
      </label>

      {showLightboxSelect ? (
        <label style={fieldStyle}>
          <span style={labelStyle}>Lightbox</span>
          <select
            value={lightboxSlug}
            disabled={disabled}
            style={inputStyle}
            onChange={(event) => patch({ href: event.target.value ? `lightbox:${event.target.value}` : '' })}
          >
            <option value="">Lightbox 선택</option>
            {lightboxes.map((lightbox) => (
              <option key={lightbox.id} value={lightbox.slug}>
                {lightbox.name} ({lightbox.slug})
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <label style={fieldStyle}>
        <span style={labelStyle}>Target</span>
        <select
          value={draft.target ?? '_self'}
          disabled={disabled}
          style={inputStyle}
          onChange={(event) => handleTargetChange(event.target.value as '_self' | '_blank')}
        >
          <option value="_self">같은 창</option>
          <option value="_blank">새 창 (_blank)</option>
        </select>
      </label>

      <button
        type="button"
        style={toggleButtonStyle}
        disabled={disabled}
        onClick={() => setAdvancedOpen((current) => !current)}
      >
        {advancedOpen ? 'Hide advanced' : 'Advanced'}
      </button>

      {advancedOpen ? (
        <>
          <label style={fieldStyle}>
            <span style={labelStyle}>Rel</span>
            <input
              type="text"
              value={draft.rel ?? ''}
              disabled={disabled}
              style={inputStyle}
              placeholder="noopener noreferrer"
              onChange={(event) => patch({ rel: event.target.value || undefined })}
            />
          </label>
          <label style={fieldStyle}>
            <span style={labelStyle}>Title</span>
            <input
              type="text"
              value={draft.title ?? ''}
              disabled={disabled}
              style={inputStyle}
              maxLength={200}
              onChange={(event) => patch({ title: event.target.value || undefined })}
            />
          </label>
          <label style={fieldStyle}>
            <span style={labelStyle}>Aria label</span>
            <input
              type="text"
              value={draft.ariaLabel ?? ''}
              disabled={disabled}
              style={inputStyle}
              maxLength={200}
              onChange={(event) => patch({ ariaLabel: event.target.value || undefined })}
            />
          </label>
        </>
      ) : null}

      <button
        type="button"
        style={clearButtonStyle}
        disabled={disabled}
        onClick={() => {
          setDraft({ href: '', target: '_self' });
          onChange(null);
        }}
      >
        Clear link
      </button>
    </div>
  );
}
