'use client';

import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderAnchorMenuCanvasNode } from '@/lib/builder/canvas/types';
import { ANCHOR_MENU_LEGACY_LABELS, getUtilityAdvancedWidgetsCopy } from '../utility-advanced-widgets-copy';
import { addAnchorMenuItem, itemsToText, labelForAnchorId, mergeAnchorMenuItemsWithSiteAnchors, normalizeSiteAnchors, parseAnchorMenuItemsText } from './anchor-menu-items';
import styles from './AnchorMenuInspector.module.css';

import AnchorMenuRender from './Render';

function AnchorMenuInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
  linkPickerContext,
}: BuilderComponentInspectorProps) {
  const anchorNode = node as BuilderAnchorMenuCanvasNode;
  const c = anchorNode.content;
  const copy = getUtilityAdvancedWidgetsCopy(locale).anchorMenu;
  const siteAnchors = normalizeSiteAnchors(linkPickerContext?.siteAnchors);
  const itemAnchors = new Set(c.items.map((item) => item.anchorId));
  return (
    <div className={styles.root} data-builder-anchor-menu-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.items}</span>
        <textarea
          rows={5}
          className={`${styles.control} ${styles.textarea}`}
          value={itemsToText(c.items, copy)}
          disabled={disabled}
          onChange={(event) => onUpdate({ items: parseAnchorMenuItemsText(event.target.value) })}
        />
      </label>
      {siteAnchors.length > 0 ? (
        <section className={styles.siteAnchors} data-builder-anchor-menu-site-anchors="true">
          <div className={styles.siteAnchorHeader}>
            <span className={styles.label}>{copy.inspector.siteAnchors}</span>
            <button
              type="button"
              className={styles.secondaryButton}
              disabled={disabled}
              data-builder-anchor-menu-sync="true"
              onClick={() => onUpdate({ items: mergeAnchorMenuItemsWithSiteAnchors(c.items, siteAnchors, copy) })}
            >
              {copy.inspector.syncAnchors}
            </button>
          </div>
          <div className={styles.anchorChips} aria-label={copy.inspector.siteAnchors}>
            {siteAnchors.map((anchorId) => {
              const label = labelForAnchorId(anchorId, copy);
              const isConnected = itemAnchors.has(anchorId);
              return (
                <button
                  key={anchorId}
                  type="button"
                  className={styles.anchorChip}
                  disabled={disabled || isConnected}
                  data-builder-anchor-menu-anchor={anchorId}
                  data-builder-anchor-connected={isConnected ? 'true' : 'false'}
                  onClick={() => onUpdate({ items: addAnchorMenuItem(c.items, anchorId, copy) })}
                >
                  {isConnected ? copy.inspector.addedAnchor(label) : copy.inspector.addAnchor(label)}
                </button>
              );
            })}
          </div>
        </section>
      ) : (
        <p className={styles.hint} data-builder-anchor-menu-no-site-anchors="true">
          {copy.inspector.noSiteAnchors}
        </p>
      )}
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={c.sticky}
          disabled={disabled}
          onChange={(event) => onUpdate({ sticky: event.target.checked })}
        />
        <span>{copy.inspector.sticky}</span>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.offsetTop}</span>
        <input
          type="number"
          min={0}
          max={400}
          value={c.offsetTopPx}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ offsetTopPx: Number(event.target.value) })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.activeColor}</span>
        <input
          type="text"
          value={c.activeColor}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ activeColor: event.target.value })}
        />
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'anchor-menu',
  displayName: '앵커 메뉴',
  category: 'advanced',
  icon: '⚓',
  defaultContent: {
    items: [
      { label: ANCHOR_MENU_LEGACY_LABELS.about, anchorId: 'about' },
      { label: ANCHOR_MENU_LEGACY_LABELS.services, anchorId: 'services' },
      { label: ANCHOR_MENU_LEGACY_LABELS.contact, anchorId: 'contact' },
    ],
    sticky: true,
    offsetTopPx: 80,
    activeColor: '#0f172a',
  },
  defaultStyle: {},
  defaultRect: { width: 360, height: 48 },
  Render: AnchorMenuRender,
  Inspector: AnchorMenuInspector,
});
