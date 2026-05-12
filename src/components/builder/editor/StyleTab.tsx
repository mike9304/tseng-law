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
import {
  getButtonVariantBindingIndicator,
  getThemeBindingBadgeStyle,
  type ThemeBindingIndicator,
} from '@/lib/builder/site/theme-bindings';
import StyleOriginChip, { resolveColorValueToString } from '@/components/builder/editor/StyleOriginChip';
import { classifyStyleOrigin } from '@/lib/builder/site/style-origin';
import {
  AdvancedDisclosure,
  LabeledRow,
  NumberStepper,
  SliderRow,
  ToggleRow,
} from '@/components/builder/canvas/InspectorControls';
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
    <LabeledRow label={label}>
      <NumberStepper
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        ariaLabel={`${label} value`}
        onChange={(nextValue) => onCommit(clampNumber(nextValue, min, max))}
      />
    </LabeledRow>
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

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#64748b',
};

const bindingSummaryStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  padding: '8px 10px',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  background: '#f8fafc',
};

const styleSourcePanelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: '10px',
  border: '1px solid #dbeafe',
  borderRadius: 8,
  background: '#f8fbff',
};

const styleSourceGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 6,
};

const styleSourceRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  minHeight: 28,
  padding: '5px 7px',
  border: '1px solid #e2e8f0',
  borderRadius: 7,
  background: '#ffffff',
};

const styleSourceLabelStackStyle: React.CSSProperties = {
  display: 'flex',
  minWidth: 0,
  flexDirection: 'column',
  gap: 2,
};

const styleSourceHintStyle: React.CSSProperties = {
  minWidth: 0,
  maxWidth: 112,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: '#64748b',
  fontSize: 10,
  fontWeight: 600,
};

function ThemeBindingBadge({ indicator }: { indicator: ThemeBindingIndicator }) {
  return (
    <span title={indicator.title} style={getThemeBindingBadgeStyle(indicator.tone)}>
      {indicator.label}
    </span>
  );
}

function isNonTransparentColor(value: BuilderColorValue | BuilderBackgroundValue | undefined): boolean {
  if (!value) return false;
  if (typeof value !== 'string') return true;
  const normalized = value.trim().toLowerCase().replace(/\s+/g, '');
  return (
    normalized.length > 0
    && normalized !== 'transparent'
    && normalized !== 'rgba(0,0,0,0)'
    && normalized !== 'hsla(0,0%,0%,0)'
  );
}

function hasManualRadiusOverride(style: BuilderCanvasNodeStyle, theme: ReturnType<typeof useBuilderTheme>): boolean {
  const radius = style.borderRadius;
  if (radius === 14) return false;
  return radius !== theme.radii.sm && radius !== theme.radii.md && radius !== theme.radii.lg;
}

function hasManualShadowOverride(style: BuilderCanvasNodeStyle): boolean {
  return (
    style.shadowX !== 0
    || style.shadowY !== 0
    || style.shadowBlur !== 0
    || style.shadowSpread !== 0
  );
}

function StyleSourceRow({
  row,
  theme,
}: {
  row: {
    label: string;
    value: unknown;
    variantKey?: string;
    manualOverride?: boolean;
  };
  theme: ReturnType<typeof useBuilderTheme>;
}) {
  const origin = classifyStyleOrigin({
    value: row.value,
    theme,
    variantKey: row.variantKey,
    manualOverride: row.manualOverride,
  });

  return (
    <div
      style={styleSourceRowStyle}
      data-builder-style-source-row={row.label.toLowerCase()}
    >
      <span style={styleSourceLabelStackStyle}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#334155' }}>{row.label}</span>
        <span
          style={styleSourceHintStyle}
          title={origin.hint}
          data-builder-style-source-hint={row.label.toLowerCase()}
        >
          {origin.hint}
        </span>
      </span>
      <StyleOriginChip
        value={row.value}
        theme={theme}
        variantKey={row.variantKey}
        manualOverride={row.manualOverride}
      />
    </div>
  );
}

function StyleSourceVisualizer({
  node,
  theme,
  buttonVariantBinding,
}: {
  node: BuilderCanvasNode;
  theme: ReturnType<typeof useBuilderTheme>;
  buttonVariantBinding: ThemeBindingIndicator | null;
}) {
  const variantKey = node.kind === 'button' ? node.content.style : undefined;
  const backgroundIsManual = typeof node.style.backgroundColor === 'string'
    && isNonTransparentColor(node.style.backgroundColor);
  const borderIsManual = typeof node.style.borderColor === 'string'
    && isNonTransparentColor(node.style.borderColor);
  const rows = [
    {
      label: 'Background',
      value: resolveColorValueToString(node.style.backgroundColor, theme),
      variantKey: buttonVariantBinding && !backgroundIsManual ? buttonVariantBinding.label : undefined,
      manualOverride: backgroundIsManual,
    },
    {
      label: 'Border',
      value: resolveColorValueToString(node.style.borderColor, theme),
      manualOverride: borderIsManual && node.style.borderWidth > 0,
    },
    {
      label: 'Radius',
      value: node.style.borderRadius,
      manualOverride: hasManualRadiusOverride(node.style, theme),
    },
    {
      label: 'Shadow',
      value: node.style.shadowBlur,
      variantKey: buttonVariantBinding && !hasManualShadowOverride(node.style) ? buttonVariantBinding.label : undefined,
      manualOverride: hasManualShadowOverride(node.style),
    },
    {
      label: 'Opacity',
      value: node.style.opacity,
      manualOverride: node.style.opacity !== 100,
    },
    {
      label: 'Hover',
      value: node.hoverStyle ? 'hover' : undefined,
      manualOverride: Boolean(node.hoverStyle),
    },
    ...(variantKey
      ? [{
        label: 'Variant',
        value: variantKey,
        variantKey,
        manualOverride: false,
      }]
      : []),
  ];

  return (
    <div style={styleSourcePanelStyle} data-builder-style-origin-visualizer="true">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={sectionTitleStyle}>Style sources</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b' }}>Theme / Variant / Manual</span>
      </div>
      <div style={styleSourceGridStyle}>
        {rows.map((row) => (
          <StyleSourceRow
            key={row.label}
            row={row}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
}

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
  const buttonVariantBinding = getButtonVariantBindingIndicator(node);

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
      <StyleSourceVisualizer
        node={node}
        theme={theme}
        buttonVariantBinding={buttonVariantBinding}
      />

      {buttonVariantBinding ? (
        <div style={bindingSummaryStyle}>
          <span style={sectionTitleStyle}>Button variant</span>
          <ThemeBindingBadge indicator={buttonVariantBinding} />
        </div>
      ) : null}

      <div style={sectionDividerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={sectionTitleStyle}>Background</span>
          <StyleOriginChip
            value={resolveColorValueToString(node.style.backgroundColor, theme)}
            theme={theme}
            variantKey={buttonVariantBinding?.label}
            manualOverride={
              typeof node.style.backgroundColor === 'string' &&
              node.style.backgroundColor.length > 0
            }
          />
        </div>
        <BackgroundEditor
          value={node.style.backgroundColor}
          paletteTokens={paletteTokens}
          disabled={disabled}
          onChange={(backgroundColor) => onUpdateStyle({ backgroundColor })}
        />
      </div>

      <div style={sectionDividerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={sectionTitleStyle}>Border</span>
          <StyleOriginChip
            value={resolveColorValueToString(node.style.borderColor, theme)}
            theme={theme}
            manualOverride={
              typeof node.style.borderColor === 'string' && node.style.borderColor.length > 0
            }
          />
        </div>
        <LabeledRow label="Border color">
          <ColorPicker
            value={node.style.borderColor}
            paletteTokens={paletteTokens}
            disabled={disabled}
            onChange={(color: BuilderColorValue) => onUpdateStyle({ borderColor: color })}
          />
        </LabeledRow>

        <div className={styles.inspectorFieldGrid}>
          <NumberField
            label="Border width"
            value={node.style.borderWidth}
            min={0}
            max={12}
            disabled={disabled}
            onCommit={(value) => onUpdateStyle({ borderWidth: Math.round(value) })}
          />
          <LabeledRow label="Border style">
            <select
              className={styles.inspectorSelect}
              value={node.style.borderStyle}
              disabled={disabled}
              onChange={(event) => onUpdateStyle({ borderStyle: event.target.value as BuilderCanvasNodeStyle['borderStyle'] })}
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
            </select>
          </LabeledRow>
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
          <LabeledRow label="Opacity" hint="%">
            <SliderRow
              value={node.style.opacity}
              min={0}
              max={100}
              suffix="%"
              disabled={disabled}
              onChange={(value) => onUpdateStyle({ opacity: Math.round(clampNumber(value, 0, 100)) })}
            />
          </LabeledRow>
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

        <LabeledRow label="Shadow color">
          <ColorPicker
            value={node.style.shadowColor}
            paletteTokens={paletteTokens}
            disabled={disabled}
            onChange={(color: BuilderColorValue) => onUpdateStyle({ shadowColor: color })}
          />
        </LabeledRow>
      </div>

      <div style={sectionDividerStyle}>
        <LabeledRow label="Hover state">
          <ToggleRow
            checked={hoverEnabled}
            disabled={disabled}
            ariaLabel="Hover state"
            onChange={(checked) => {
              if (checked) {
                onUpdateHoverStyle({ transitionMs: 200 });
                setHoverOpen(true);
              } else {
                onUpdateHoverStyle(undefined);
              }
            }}
          />
        </LabeledRow>

        {hoverEnabled && hoverOpen ? (
          <AdvancedDisclosure label="Hover adjustments" open={hoverOpen} onOpenChange={setHoverOpen}>
            <LabeledRow label="Hover background">
              <ColorPicker
                value={colorValueOrFallback(hoverStyle.backgroundColor, colorValueOrFallback(node.style.backgroundColor, 'transparent'))}
                paletteTokens={paletteTokens}
                disabled={disabled}
                onChange={(color: BuilderColorValue) => updateHover({ backgroundColor: color })}
              />
            </LabeledRow>

            <LabeledRow label="Hover border color">
              <ColorPicker
                value={hoverStyle.borderColor ?? node.style.borderColor}
                paletteTokens={paletteTokens}
                disabled={disabled}
                onChange={(color: BuilderColorValue) => updateHover({ borderColor: color })}
              />
            </LabeledRow>

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

            <LabeledRow label="Hover shadow color">
              <ColorPicker
                value={hoverStyle.shadowColor ?? node.style.shadowColor}
                paletteTokens={paletteTokens}
                disabled={disabled}
                onChange={(color: BuilderColorValue) => updateHover({ shadowColor: color })}
              />
            </LabeledRow>

            <NumberField
              label="Transition ms"
              value={hoverStyle.transitionMs ?? 200}
              min={0}
              max={2000}
              disabled={disabled}
              onCommit={(value) => updateHover({ transitionMs: Math.round(value) })}
            />
          </AdvancedDisclosure>
        ) : null}
      </div>
    </div>
  );
}
