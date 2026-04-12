'use client';

import type { BuilderCanvasNode, BuilderCanvasNodeStyle } from '@/lib/builder/canvas/types';
import styles from '@/components/builder/canvas/SandboxPage.module.css';

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeHex(value: string): string {
  if (/^#[0-9a-f]{6}$/i.test(value)) return value;
  return '#0f172a';
}

function NumberField({
  label,
  value,
  min,
  max,
  onCommit,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onCommit: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <label className={styles.inspectorField}>
      <span className={styles.inspectorFieldLabel}>{label}</span>
      <input
        className={styles.inspectorInput}
        type="number"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(event) => onCommit(clampNumber(Math.round(Number(event.target.value)), min, max))}
      />
    </label>
  );
}

export default function StyleTab({
  node,
  disabled = false,
  onUpdateStyle,
}: {
  node: BuilderCanvasNode;
  disabled?: boolean;
  onUpdateStyle: (style: Partial<BuilderCanvasNodeStyle>) => void;
}) {
  return (
    <div className={styles.inspectorFormStack}>
      <div className={styles.inspectorFieldGrid}>
        <label className={styles.inspectorField}>
          <span className={styles.inspectorFieldLabel}>Background</span>
          <input
            className={styles.inspectorColorInput}
            type="color"
            value={normalizeHex(node.style.backgroundColor)}
            disabled={disabled}
            onChange={(event) => onUpdateStyle({ backgroundColor: event.target.value })}
          />
        </label>
        <label className={styles.inspectorField}>
          <span className={styles.inspectorFieldLabel}>Border color</span>
          <input
            className={styles.inspectorColorInput}
            type="color"
            value={normalizeHex(node.style.borderColor)}
            disabled={disabled}
            onChange={(event) => onUpdateStyle({ borderColor: event.target.value })}
          />
        </label>
      </div>

      <div className={styles.inspectorFieldGrid}>
        <NumberField
          label="Border width"
          value={node.style.borderWidth}
          min={0}
          max={12}
          disabled={disabled}
          onCommit={(value) => onUpdateStyle({ borderWidth: value })}
        />
        <label className={styles.inspectorField}>
          <span className={styles.inspectorFieldLabel}>Border style</span>
          <select
            className={styles.inspectorSelect}
            value={node.style.borderStyle}
            disabled={disabled}
            onChange={(event) => onUpdateStyle({ borderStyle: event.target.value as BuilderCanvasNodeStyle['borderStyle'] })}
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
          </select>
        </label>
      </div>

      <div className={styles.inspectorFieldGrid}>
        <NumberField
          label="Radius"
          value={node.style.borderRadius}
          min={0}
          max={64}
          disabled={disabled}
          onCommit={(value) => onUpdateStyle({ borderRadius: value })}
        />
        <label className={styles.inspectorField}>
          <span className={styles.inspectorFieldLabel}>Opacity</span>
          <div className={styles.inspectorRangeRow}>
            <input
              className={styles.inspectorRange}
              type="range"
              min={0}
              max={100}
              value={node.style.opacity}
              disabled={disabled}
              onChange={(event) => onUpdateStyle({ opacity: clampNumber(Number(event.target.value), 0, 100) })}
            />
            <input
              className={styles.inspectorInput}
              type="number"
              min={0}
              max={100}
              value={node.style.opacity}
              disabled={disabled}
              onChange={(event) => onUpdateStyle({ opacity: clampNumber(Number(event.target.value), 0, 100) })}
            />
          </div>
        </label>
      </div>

      <div className={styles.inspectorFieldGrid}>
        <NumberField
          label="Shadow X"
          value={node.style.shadowX}
          min={-96}
          max={96}
          disabled={disabled}
          onCommit={(value) => onUpdateStyle({ shadowX: value })}
        />
        <NumberField
          label="Shadow Y"
          value={node.style.shadowY}
          min={-96}
          max={96}
          disabled={disabled}
          onCommit={(value) => onUpdateStyle({ shadowY: value })}
        />
        <NumberField
          label="Blur"
          value={node.style.shadowBlur}
          min={0}
          max={160}
          disabled={disabled}
          onCommit={(value) => onUpdateStyle({ shadowBlur: value })}
        />
        <NumberField
          label="Spread"
          value={node.style.shadowSpread}
          min={-96}
          max={96}
          disabled={disabled}
          onCommit={(value) => onUpdateStyle({ shadowSpread: value })}
        />
      </div>

      <label className={styles.inspectorField}>
        <span className={styles.inspectorFieldLabel}>Shadow color</span>
        <input
          className={styles.inspectorColorInput}
          type="color"
          value={normalizeHex(node.style.shadowColor)}
          disabled={disabled}
          onChange={(event) => onUpdateStyle({ shadowColor: event.target.value })}
        />
      </label>
    </div>
  );
}
