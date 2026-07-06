import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderMapCanvasNode } from '@/lib/builder/canvas/types';
import { getLocationWidgetsCopy } from '../location-widgets-copy';
import styles from './MapInspector.module.css';

export default function MapInspector({ node, locale = 'ko', onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const mapNode = node as BuilderMapCanvasNode;
  const copy = getLocationWidgetsCopy(locale).map;
  return (
    <div className={styles.root} data-builder-map-inspector="true">
      <div className={styles.field}>
        <span className={styles.label}>{copy.officePresets}</span>
        <div className={styles.presetGrid}>
          {copy.presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              disabled={disabled}
              className={styles.presetButton}
              aria-label={copy.presetAria(preset.label)}
              onClick={() => onUpdate({ address: preset.address })}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
      <label className={styles.field}>
        <span className={styles.label}>{copy.address}</span>
        <textarea
          rows={2}
          value={mapNode.content.address}
          disabled={disabled}
          className={`${styles.control} ${styles.textarea}`}
          aria-label={copy.addressAria}
          placeholder={copy.addressPlaceholder}
          onChange={(e) => onUpdate({ address: e.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.zoomLevel(mapNode.content.zoom)}</span>
        <div className={styles.zoomRow}>
          <button
            type="button"
            disabled={disabled || mapNode.content.zoom <= 1}
            className={styles.zoomButton}
            aria-label={copy.decreaseZoomAria}
            onClick={() => onUpdate({ zoom: Math.max(1, mapNode.content.zoom - 1) })}
          >
            -
          </button>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={mapNode.content.zoom}
            disabled={disabled}
            className={styles.range}
            aria-label={copy.zoomAria}
            onChange={(e) => onUpdate({ zoom: Number(e.target.value) })}
          />
          <button
            type="button"
            disabled={disabled || mapNode.content.zoom >= 20}
            className={styles.zoomButton}
            aria-label={copy.increaseZoomAria}
            onClick={() => onUpdate({ zoom: Math.min(20, mapNode.content.zoom + 1) })}
          >
            +
          </button>
        </div>
      </label>
    </div>
  );
}
