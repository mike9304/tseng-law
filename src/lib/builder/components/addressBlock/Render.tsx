'use client';

import { useEffect, useRef, useState } from 'react';
import type { BuilderAddressBlockCanvasNode } from '@/lib/builder/canvas/types';
import { safeHref } from '@/lib/builder/links';
import type { Locale } from '@/lib/locales';
import { getLocationWidgetsCopy, localizedAddressBlockContent } from '../location-widgets-copy';

function buildAddressString(c: BuilderAddressBlockCanvasNode['content']): string {
  return [c.line1, c.line2, c.cityRegion, c.postalCode, c.country].filter(Boolean).join(', ');
}

function AddressBlockRender({
  node,
  mode = 'edit',
  locale = 'ko',
}: {
  node: BuilderAddressBlockCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}) {
  const copy = getLocationWidgetsCopy(locale);
  const c = localizedAddressBlockContent(node.content, copy.addressBlock.defaultContent);
  const [copied, setCopied] = useState(false);
  const copiedTimerRef = useRef<number | null>(null);
  const address = buildAddressString(c);
  const directionsHref = safeHref(
    c.directionsHref || (address ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}` : undefined),
  );

  useEffect(() => () => {
    if (copiedTimerRef.current !== null) window.clearTimeout(copiedTimerRef.current);
  }, []);

  async function copyAddress() {
    if (mode === 'edit') return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      if (copiedTimerRef.current !== null) window.clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <address
      className="builder-location-address"
      data-builder-location-widget="address-block"
    >
      <strong>{c.label}</strong>
      <span>{c.line1}</span>
      {c.line2 ? <span>{c.line2}</span> : null}
      {c.cityRegion ? <span>{c.cityRegion}</span> : null}
      {c.postalCode || c.country ? (
        <span>{[c.postalCode, c.country].filter(Boolean).join(' · ')}</span>
      ) : null}
      {c.phone ? <span data-builder-location-phone="true">{c.phone}</span> : null}
      <div className="builder-location-address-actions">
        {c.showCopyButton ? (
          <button type="button" onClick={() => void copyAddress()}>
            {copied ? copy.addressBlock.copiedButton : copy.addressBlock.copyButton}
          </button>
        ) : null}
        {c.showDirectionsLink && directionsHref ? (
          <a href={directionsHref} target="_blank" rel="noopener noreferrer">
            {copy.addressBlock.directionsLink}
          </a>
        ) : null}
      </div>
    </address>
  );
}

export default AddressBlockRender;
