'use client';

import { useEffect, useRef, useState } from 'react';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderAddressBlockCanvasNode } from '@/lib/builder/canvas/types';

function buildAddressString(c: BuilderAddressBlockCanvasNode['content']): string {
  return [c.line1, c.line2, c.cityRegion, c.postalCode, c.country].filter(Boolean).join(', ');
}

function AddressBlockRender({
  node,
  mode = 'edit',
}: {
  node: BuilderAddressBlockCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const [copied, setCopied] = useState(false);
  const copiedTimerRef = useRef<number | null>(null);
  const address = buildAddressString(c);
  const directionsHref = c.directionsHref || (address ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}` : '');

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
            {copied ? '복사됨' : '주소 복사'}
          </button>
        ) : null}
        {c.showDirectionsLink && directionsHref ? (
          <a href={directionsHref} target="_blank" rel="noopener noreferrer">
            길찾기
          </a>
        ) : null}
      </div>
    </address>
  );
}

function AddressBlockInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const aNode = node as BuilderAddressBlockCanvasNode;
  const c = aNode.content;
  return (
    <>
      <label>
        <span>라벨</span>
        <input type="text" value={c.label} disabled={disabled} onChange={(event) => onUpdate({ label: event.target.value })} />
      </label>
      <label>
        <span>1행</span>
        <input type="text" value={c.line1} disabled={disabled} onChange={(event) => onUpdate({ line1: event.target.value })} />
      </label>
      <label>
        <span>2행</span>
        <input type="text" value={c.line2} disabled={disabled} onChange={(event) => onUpdate({ line2: event.target.value })} />
      </label>
      <label>
        <span>도시/지역</span>
        <input type="text" value={c.cityRegion} disabled={disabled} onChange={(event) => onUpdate({ cityRegion: event.target.value })} />
      </label>
      <label>
        <span>우편번호</span>
        <input type="text" value={c.postalCode} disabled={disabled} onChange={(event) => onUpdate({ postalCode: event.target.value })} />
      </label>
      <label>
        <span>국가</span>
        <input type="text" value={c.country} disabled={disabled} onChange={(event) => onUpdate({ country: event.target.value })} />
      </label>
      <label>
        <span>전화</span>
        <input type="text" value={c.phone} disabled={disabled} onChange={(event) => onUpdate({ phone: event.target.value })} />
      </label>
      <label>
        <span>길찾기 URL (자동 생성 override)</span>
        <input type="text" value={c.directionsHref} disabled={disabled} onChange={(event) => onUpdate({ directionsHref: event.target.value })} />
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input type="checkbox" checked={c.showCopyButton} disabled={disabled} onChange={(event) => onUpdate({ showCopyButton: event.target.checked })} />
        <span>복사 버튼</span>
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input type="checkbox" checked={c.showDirectionsLink} disabled={disabled} onChange={(event) => onUpdate({ showDirectionsLink: event.target.checked })} />
        <span>길찾기 링크</span>
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'address-block',
  displayName: '주소 블록',
  category: 'advanced',
  icon: '📍',
  defaultContent: {
    label: '본 사무소',
    line1: '서울특별시 강남구',
    line2: '테헤란로 152',
    cityRegion: '강남구',
    postalCode: '06236',
    country: '대한민국',
    phone: '+82 2-0000-0000',
    showCopyButton: true,
    showDirectionsLink: true,
    directionsHref: '',
  },
  defaultStyle: {},
  defaultRect: { width: 320, height: 220 },
  Render: AddressBlockRender,
  Inspector: AddressBlockInspector,
});
