'use client';

import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderAddressBlockCanvasNode } from '@/lib/builder/canvas/types';
import { getLocationWidgetsCopy, localizedAddressBlockContent, LOCATION_WIDGETS_LEGACY_DEFAULTS } from '../location-widgets-copy';
import styles from './AddressBlockInspector.module.css';

import AddressBlockRender from './Render';

function AddressBlockInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const aNode = node as BuilderAddressBlockCanvasNode;
  const locationCopy = getLocationWidgetsCopy(locale).addressBlock;
  const c = localizedAddressBlockContent(aNode.content, locationCopy.defaultContent);
  const copy = locationCopy.inspector;
  return (
    <div className={styles.root} data-builder-address-block-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.label}</span>
        <input type="text" value={c.label} disabled={disabled} className={styles.control} onChange={(event) => onUpdate({ label: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.line1}</span>
        <input type="text" value={c.line1} disabled={disabled} className={styles.control} onChange={(event) => onUpdate({ line1: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.line2}</span>
        <input type="text" value={c.line2} disabled={disabled} className={styles.control} onChange={(event) => onUpdate({ line2: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.cityRegion}</span>
        <input type="text" value={c.cityRegion} disabled={disabled} className={styles.control} onChange={(event) => onUpdate({ cityRegion: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.postalCode}</span>
        <input type="text" value={c.postalCode} disabled={disabled} className={styles.control} onChange={(event) => onUpdate({ postalCode: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.country}</span>
        <input type="text" value={c.country} disabled={disabled} className={styles.control} onChange={(event) => onUpdate({ country: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.phone}</span>
        <input type="text" value={c.phone} disabled={disabled} className={styles.control} onChange={(event) => onUpdate({ phone: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.directionsHref}</span>
        <input type="text" value={c.directionsHref} disabled={disabled} className={styles.control} onChange={(event) => onUpdate({ directionsHref: event.target.value })} />
      </label>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={c.showCopyButton} disabled={disabled} onChange={(event) => onUpdate({ showCopyButton: event.target.checked })} />
        <span>{copy.showCopyButton}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={c.showDirectionsLink} disabled={disabled} onChange={(event) => onUpdate({ showDirectionsLink: event.target.checked })} />
        <span>{copy.showDirectionsLink}</span>
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'address-block',
  displayName: '주소 블록',
  category: 'advanced',
  icon: '📍',
  defaultContent: { ...LOCATION_WIDGETS_LEGACY_DEFAULTS.addressBlock },
  defaultStyle: {},
  defaultRect: { width: 320, height: 220 },
  Render: AddressBlockRender,
  Inspector: AddressBlockInspector,
});
