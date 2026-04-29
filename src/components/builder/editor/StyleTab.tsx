'use client';

import { useEffect, useState } from 'react';
import type {
  BuilderCanvasNode,
  BuilderCanvasNodeStyle,
  BuilderHoverStyle,
} from '@/lib/builder/canvas/types';
import BackgroundEditor from '@/components/builder/editor/BackgroundEditor';
import ColorPicker from '@/components/builder/editor/ColorPicker';
import { useBuilderTheme } from '@/components/builder/editor/BuilderThemeContext';
import {
  THEME_COLOR_LABELS,
  THEME_COLOR_TOKENS,
  type BuilderBackgroundValue,
  type BuilderColorValue,
  isGradientBackgroundValue,
  isImageBackgroundValue,
} from '@/lib/builder/site/theme';
import styles from '@/components/builder/canvas/SandboxPage.module.css';

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function NumberField({
  label,
  value,
  min,
  max,
  step = 1,
  onCommit,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
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
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onCommit(clampNumber(Number(event.target.value), min, max))}
      />
    </label>
  );
}

function colorValueOrFallback(
  value: BuilderBackgroundValue | BuilderColorValue | undefined,
  fallback: BuilderColorValue,
): BuilderColorValue {
  if (isGradientBackgroundValue(value) || isImageBackgroundValue(value)) return fallback;
  return value ?? fallback;
}

const sectionDividerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  paddingTop: 10,
  borderTop: '1px solid #e2e8f0',
};

const sectionHeadingStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#64748b',
};

const toggleStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: '0.76rem',
  fontWeight: 700,
  color: '#334155',
};

const collapseButtonStyle: React.CSSProperties = {
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  background: '#fff',
  color: '#475569',
  fontSize: '0.72rem',
  fontWeight: 700,
  padding: '3px 8px',
  cursor: 'pointer',
};

export default function StyleTab({
  node,
  disabled = false,
  onUpdateStyle,
  onUpdateHoverStyle,
}: {
  node: BuilderCanvasNode;
  disabled?: boolean;
  onUpdateStyle: (style: Partial<BuilderCanvasNodeStyle>) => void;
  onUpdateHoverStyle: (hoverStyle: BuilderHoverStyle) => void;
}) {
  const theme = useBuilderTheme();
  const [hoverOpen, setHoverOpen] = useState(Boolean(node.hoverStyle));
  const paletteTokens = THEME_COLOR_TOKENS.map((token) => ({
    token,
    label: THEME_COLOR_LABELS[token],
    color: theme.colors[token],
  }));
  const hoverStyle = node.hoverStyle ?? { transitionMs: 200 };
  const hoverEnabled = Boolean(node.hoverStyle);

  useEffect(() => {
    setHoverOpen(Boolean(node.hoverStyle));
  }, [node.id, node.hoverStyle]);

  const updateHover = (patch: Partial<NonNullable<BuilderHoverStyle>>) => {
    onUpdateHoverStyle({
      transitionMs: 200,
      ...(node.hoverStyle ?? {}),
      ...patch,
    });
  };

  return (
    <div className={styles.inspectorFormStack}>
      <div style={sectionDividerStyle}>
        <span style={sectionTitleStyle}>Background</span>
        <BackgroundEditor
          value={node.style.backgroundColor}
          paletteTokens={paletteTokens}
          disabled={disabled}
          onChange={(backgroundColor) => onUpdateStyle({ backgroundColor })}
        />
      </div>

      <div style={sectionDividerStyle}>
        <span style={sectionTitleStyle}>Border</span>
        <label className={styles.inspectorField}>
          <span className={styles.inspectorFieldLabel}>Border color</span>
          <ColorPicker
            value={node.style.borderColor}
            paletteTokens={paletteTokens}
            disabled={disabled}
            onChange={(color: BuilderColorValue) => onUpdateStyle({ borderColor: color })}
          />
        </label>

        <div className={styles.inspectorFieldGrid}>
          <NumberField
            label="Border width"
            value={node.style.borderWidth}
            min={0}
            max={12}
            disabled={disabled}
            onCommit={(value) => onUpdateStyle({ borderWidth: Math.round(value) })}
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
            onCommit={(value) => onUpdateStyle({ borderRadius: Math.round(value) })}
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
                onChange={(event) => onUpdateStyle({ opacity: Math.round(clampNumber(Number(event.target.value), 0, 100)) })}
              />
              <input
                className={styles.inspectorInput}
                type="number"
                min={0}
                max={100}
                value={node.style.opacity}
                disabled={disabled}
                onChange={(event) => onUpdateStyle({ opacity: Math.round(clampNumber(Number(event.target.value), 0, 100)) })}
              />
            </div>
          </label>
        </div>
      </div>

      <div style={sectionDividerStyle}>
        <span style={sectionTitleStyle}>Shadow</span>
        <div className={styles.inspectorFieldGrid}>
          <NumberField
            label="Shadow X"
            value={node.style.shadowX}
            min={-96}
            max={96}
            disabled={disabled}
            onCommit={(value) => onUpdateStyle({ shadowX: Math.round(value) })}
          />
          <NumberField
            label="Shadow Y"
            value={node.style.shadowY}
            min={-96}
            max={96}
            disabled={disabled}
            onCommit={(value) => onUpdateStyle({ shadowY: Math.round(value) })}
          />
          <NumberField
            label="Blur"
            value={node.style.shadowBlur}
            min={0}
            max={160}
            disabled={disabled}
            onCommit={(value) => onUpdateStyle({ shadowBlur: Math.round(value) })}
          />
          <NumberField
            label="Spread"
            value={node.style.shadowSpread}
            min={-96}
            max={96}
            disabled={disabled}
            onCommit={(value) => onUpdateStyle({ shadowSpread: Math.round(value) })}
          />
        </div>

        <label className={styles.inspectorField}>
          <span className={styles.inspectorFieldLabel}>Shadow color</span>
          <ColorPicker
            value={node.style.shadowColor}
            paletteTokens={paletteTokens}
            disabled={disabled}
            onChange={(color: BuilderColorValue) => onUpdateStyle({ shadowColor: color })}
          />
        </label>
      </div>

      <div style={sectionDividerStyle}>
        <div style={sectionHeadingStyle}>
          <label style={toggleStyle}>
            <input
              type="checkbox"
              checked={hoverEnabled}
              disabled={disabled}
              onChange={(event) => {
                if (event.target.checked) {
                  onUpdateHoverStyle({ transitionMs: 200 });
                  setHoverOpen(true);
                } else {
                  onUpdateHoverStyle(undefined);
                }
              }}
            />
            <span>Hover state</span>
          </label>
          <button
            type="button"
            style={collapseButtonStyle}
            disabled={!hoverEnabled}
            onClick={() => setHoverOpen((open) => !open)}
          >
            {hoverOpen ? 'Hide' : 'Show'}
          </button>
        </div>

        {hoverEnabled && hoverOpen ? (
          <>
            <label className={styles.inspectorField}>
              <span className={styles.inspectorFieldLabel}>Hover background</span>
              <ColorPicker
                value={colorValueOrFallback(hoverStyle.backgroundColor, colorValueOrFallback(node.style.backgroundColor, 'transparent'))}
                paletteTokens={paletteTokens}
                disabled={disabled}
                onChange={(color: BuilderColorValue) => updateHover({ backgroundColor: color })}
              />
            </label>

            <label className={styles.inspectorField}>
              <span className={styles.inspectorFieldLabel}>Hover border color</span>
              <ColorPicker
                value={hoverStyle.borderColor ?? node.style.borderColor}
                paletteTokens={paletteTokens}
                disabled={disabled}
                onChange={(color: BuilderColorValue) => updateHover({ borderColor: color })}
              />
            </label>

            <div className={styles.inspectorFieldGrid}>
              <NumberField
                label="Scale"
                value={hoverStyle.scale ?? 1}
                min={0.5}
                max={2}
                step={0.01}
                disabled={disabled}
                onCommit={(value) => updateHover({ scale: Number(value.toFixed(2)) })}
              />
              <NumberField
                label="Y move"
                value={hoverStyle.translateY ?? 0}
                min={-100}
                max={100}
                disabled={disabled}
                onCommit={(value) => updateHover({ translateY: Math.round(value) })}
              />
              <NumberField
                label="Blur"
                value={hoverStyle.shadowBlur ?? node.style.shadowBlur}
                min={0}
                max={160}
                disabled={disabled}
                onCommit={(value) => updateHover({ shadowBlur: Math.round(value) })}
              />
              <NumberField
                label="Spread"
                value={hoverStyle.shadowSpread ?? node.style.shadowSpread}
                min={-96}
                max={96}
                disabled={disabled}
                onCommit={(value) => updateHover({ shadowSpread: Math.round(value) })}
              />
            </div>

            <label className={styles.inspectorField}>
              <span className={styles.inspectorFieldLabel}>Hover shadow color</span>
              <ColorPicker
                value={hoverStyle.shadowColor ?? node.style.shadowColor}
                paletteTokens={paletteTokens}
                disabled={disabled}
                onChange={(color: BuilderColorValue) => updateHover({ shadowColor: color })}
              />
            </label>

            <NumberField
              label="Transition ms"
              value={hoverStyle.transitionMs ?? 200}
              min={0}
              max={2000}
              disabled={disabled}
              onCommit={(value) => updateHover({ transitionMs: Math.round(value) })}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
