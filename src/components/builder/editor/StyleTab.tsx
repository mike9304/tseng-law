'use client';

import { useEffect, useState } from 'react';
import type {
  BuilderCanvasNode,
  BuilderCanvasNodeStyle,
  BuilderHoverStyle,
} from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import BackgroundEditor from '@/components/builder/editor/BackgroundEditor';
import ColorPicker from '@/components/builder/editor/ColorPicker';
import { useBuilderTheme } from '@/components/builder/editor/BuilderThemeContext';
import { getStyleTabCopy, type StyleTabCopy } from '@/components/builder/editor/style-tab-copy';
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
  type ThemeBindingIndicator,
} from '@/lib/builder/site/theme-bindings';
import StyleOriginChip, { resolveColorValueToString } from '@/components/builder/editor/StyleOriginChip';
import ThemeBindingBadge from '@/components/builder/editor/ThemeBindingBadge';
import { classifyStyleOrigin } from '@/lib/builder/site/style-origin';
import {
  AdvancedDisclosure,
  LabeledRow,
  NumberStepper,
  SliderRow,
  ToggleRow,
} from '@/components/builder/canvas/InspectorControls';
import styles from '@/components/builder/canvas/SandboxPage.module.css';
import tabStyles from './StyleTab.module.css';

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function NumberField({
  label,
  value,
  min,
  max,
  step = 1,
  ariaLabel,
  onCommit,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  ariaLabel?: string;
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
        ariaLabel={ariaLabel ?? label}
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
  copy,
  locale,
}: {
  row: {
    id: string;
    label: string;
    value: unknown;
    variantKey?: string;
    manualOverride?: boolean;
  };
  theme: ReturnType<typeof useBuilderTheme>;
  copy: StyleTabCopy;
  locale: Locale;
}) {
  const origin = classifyStyleOrigin({
    value: row.value,
    theme,
    variantKey: row.variantKey,
    manualOverride: row.manualOverride,
  });
  const originHint = copy.originHint(origin.hint);

  return (
    <div
      className={tabStyles.styleSourceRow}
      data-builder-style-source-row={row.id}
    >
      <span className={tabStyles.styleSourceLabelStack}>
        <span className={tabStyles.styleSourceLabel}>{row.label}</span>
        <span
          className={tabStyles.styleSourceHint}
          title={originHint}
          data-builder-style-source-hint={row.id}
        >
          {originHint}
        </span>
      </span>
      <StyleOriginChip
        value={row.value}
        theme={theme}
        variantKey={row.variantKey}
        manualOverride={row.manualOverride}
        locale={locale}
      />
    </div>
  );
}

function StyleSourceVisualizer({
  node,
  theme,
  buttonVariantBinding,
  copy,
  locale,
}: {
  node: BuilderCanvasNode;
  theme: ReturnType<typeof useBuilderTheme>;
  buttonVariantBinding: ThemeBindingIndicator | null;
  copy: StyleTabCopy;
  locale: Locale;
}) {
  const variantKey = node.kind === 'button' ? node.content.style : undefined;
  const backgroundIsManual = typeof node.style.backgroundColor === 'string'
    && isNonTransparentColor(node.style.backgroundColor);
  const borderIsManual = typeof node.style.borderColor === 'string'
    && isNonTransparentColor(node.style.borderColor);
  const rows = [
    {
      id: 'background',
      label: copy.styleSourceRows.background,
      value: resolveColorValueToString(node.style.backgroundColor, theme),
      variantKey: buttonVariantBinding && !backgroundIsManual ? buttonVariantBinding.label : undefined,
      manualOverride: backgroundIsManual,
    },
    {
      id: 'border',
      label: copy.styleSourceRows.border,
      value: resolveColorValueToString(node.style.borderColor, theme),
      manualOverride: borderIsManual && node.style.borderWidth > 0,
    },
    {
      id: 'radius',
      label: copy.styleSourceRows.radius,
      value: node.style.borderRadius,
      manualOverride: hasManualRadiusOverride(node.style, theme),
    },
    {
      id: 'shadow',
      label: copy.styleSourceRows.shadow,
      value: node.style.shadowBlur,
      variantKey: buttonVariantBinding && !hasManualShadowOverride(node.style) ? buttonVariantBinding.label : undefined,
      manualOverride: hasManualShadowOverride(node.style),
    },
    {
      id: 'opacity',
      label: copy.styleSourceRows.opacity,
      value: node.style.opacity,
      manualOverride: node.style.opacity !== 100,
    },
    {
      id: 'hover',
      label: copy.styleSourceRows.hover,
      value: node.hoverStyle ? 'hover' : undefined,
      manualOverride: Boolean(node.hoverStyle),
    },
    ...(variantKey
      ? [{
        id: 'variant',
        label: copy.styleSourceRows.variant,
        value: variantKey,
        variantKey,
        manualOverride: false,
      }]
      : []),
  ];

  return (
    <div className={tabStyles.styleSourcePanel} data-builder-style-origin-visualizer="true">
      <div className={tabStyles.styleSourceHeader}>
        <span className={tabStyles.styleSectionTitle}>{copy.styleSourceTitle}</span>
        <span className={tabStyles.styleSourceLegend}>{copy.styleSourceLegend}</span>
      </div>
      <div className={tabStyles.styleSourceGrid}>
        {rows.map((row) => (
          <StyleSourceRow
            key={row.label}
            row={row}
            theme={theme}
            copy={copy}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}

export default function StyleTab({
  node,
  disabled = false,
  locale = 'ko',
  onUpdateStyle,
  onUpdateHoverStyle,
}: {
  node: BuilderCanvasNode;
  disabled?: boolean;
  locale?: Locale;
  onUpdateStyle: (style: Partial<BuilderCanvasNodeStyle>) => void;
  onUpdateHoverStyle: (hoverStyle: BuilderHoverStyle) => void;
}) {
  const theme = useBuilderTheme();
  const copy = getStyleTabCopy(locale);
  const [hoverOpen, setHoverOpen] = useState(Boolean(node.hoverStyle));
  const paletteTokens = THEME_COLOR_TOKENS.map((token) => ({
    token,
    label: THEME_COLOR_LABELS[token],
    color: theme.colors[token],
  }));
  const hoverStyle = node.hoverStyle ?? { transitionMs: 200 };
  const hoverEnabled = Boolean(node.hoverStyle);
  const buttonVariantBinding = getButtonVariantBindingIndicator(node);
  const buttonVariantBindingDisplay = buttonVariantBinding
    ? {
        ...buttonVariantBinding,
        ...copy.buttonVariantBadge[buttonVariantBinding.tone],
      }
    : null;

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
        buttonVariantBinding={buttonVariantBindingDisplay}
        copy={copy}
        locale={locale}
      />

      {buttonVariantBindingDisplay ? (
        <div className={tabStyles.bindingSummary}>
          <span className={tabStyles.styleSectionTitle}>{copy.buttonVariantLabel}</span>
          <ThemeBindingBadge indicator={buttonVariantBindingDisplay} />
        </div>
      ) : null}

      <div className={tabStyles.styleSection}>
        <div className={tabStyles.styleSectionHeader}>
          <span className={tabStyles.styleSectionTitle}>{copy.sections.background}</span>
          <StyleOriginChip
            value={resolveColorValueToString(node.style.backgroundColor, theme)}
            theme={theme}
            variantKey={buttonVariantBindingDisplay?.label}
            manualOverride={
              typeof node.style.backgroundColor === 'string' &&
              node.style.backgroundColor.length > 0
            }
            locale={locale}
          />
        </div>
        <BackgroundEditor
          value={node.style.backgroundColor}
          paletteTokens={paletteTokens}
          disabled={disabled}
          locale={locale}
          onChange={(backgroundColor) => onUpdateStyle({ backgroundColor })}
        />
      </div>

      <div className={tabStyles.styleSection}>
        <div className={tabStyles.styleSectionHeader}>
          <span className={tabStyles.styleSectionTitle}>{copy.sections.border}</span>
          <StyleOriginChip
            value={resolveColorValueToString(node.style.borderColor, theme)}
            theme={theme}
            manualOverride={
              typeof node.style.borderColor === 'string' && node.style.borderColor.length > 0
            }
            locale={locale}
          />
        </div>
        <LabeledRow label={copy.borderColorLabel}>
          <ColorPicker
            value={node.style.borderColor}
            paletteTokens={paletteTokens}
            disabled={disabled}
            locale={locale}
            onChange={(color: BuilderColorValue) => onUpdateStyle({ borderColor: color })}
          />
        </LabeledRow>

        <div className={styles.inspectorFieldGrid}>
          <NumberField
            label={copy.borderWidthLabel}
            ariaLabel={copy.numberValueAriaLabel(copy.borderWidthLabel)}
            value={node.style.borderWidth}
            min={0}
            max={12}
            disabled={disabled}
            onCommit={(value) => onUpdateStyle({ borderWidth: Math.round(value) })}
          />
          <LabeledRow label={copy.borderStyleLabel}>
            <select
              className={styles.inspectorSelect}
              value={node.style.borderStyle}
              disabled={disabled}
              onChange={(event) => onUpdateStyle({ borderStyle: event.target.value as BuilderCanvasNodeStyle['borderStyle'] })}
            >
              <option value="solid">{copy.borderStyleOptions.solid}</option>
              <option value="dashed">{copy.borderStyleOptions.dashed}</option>
            </select>
          </LabeledRow>
        </div>

        <div className={styles.inspectorFieldGrid}>
          <NumberField
            label={copy.radiusLabel}
            ariaLabel={copy.numberValueAriaLabel(copy.radiusLabel)}
            value={node.style.borderRadius}
            min={0}
            max={64}
            disabled={disabled}
            onCommit={(value) => onUpdateStyle({ borderRadius: Math.round(value) })}
          />
          <LabeledRow label={copy.opacityLabel} hint="%">
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

      <div className={tabStyles.styleSection}>
        <span className={tabStyles.styleSectionTitle}>{copy.sections.shadow}</span>
        <div className={styles.inspectorFieldGrid}>
          <NumberField
            label={copy.shadowXLabel}
            ariaLabel={copy.numberValueAriaLabel(copy.shadowXLabel)}
            value={node.style.shadowX}
            min={-96}
            max={96}
            disabled={disabled}
            onCommit={(value) => onUpdateStyle({ shadowX: Math.round(value) })}
          />
          <NumberField
            label={copy.shadowYLabel}
            ariaLabel={copy.numberValueAriaLabel(copy.shadowYLabel)}
            value={node.style.shadowY}
            min={-96}
            max={96}
            disabled={disabled}
            onCommit={(value) => onUpdateStyle({ shadowY: Math.round(value) })}
          />
          <NumberField
            label={copy.blurLabel}
            ariaLabel={copy.numberValueAriaLabel(copy.blurLabel)}
            value={node.style.shadowBlur}
            min={0}
            max={160}
            disabled={disabled}
            onCommit={(value) => onUpdateStyle({ shadowBlur: Math.round(value) })}
          />
          <NumberField
            label={copy.spreadLabel}
            ariaLabel={copy.numberValueAriaLabel(copy.spreadLabel)}
            value={node.style.shadowSpread}
            min={-96}
            max={96}
            disabled={disabled}
            onCommit={(value) => onUpdateStyle({ shadowSpread: Math.round(value) })}
          />
        </div>

        <LabeledRow label={copy.shadowColorLabel}>
          <ColorPicker
            value={node.style.shadowColor}
            paletteTokens={paletteTokens}
            disabled={disabled}
            locale={locale}
            onChange={(color: BuilderColorValue) => onUpdateStyle({ shadowColor: color })}
          />
        </LabeledRow>
      </div>

      <div className={tabStyles.styleSection}>
        <LabeledRow label={copy.hoverStateLabel}>
          <ToggleRow
            checked={hoverEnabled}
            disabled={disabled}
            ariaLabel={copy.hoverStateAriaLabel}
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
          <AdvancedDisclosure label={copy.hoverAdjustmentsLabel} open={hoverOpen} onOpenChange={setHoverOpen}>
            <LabeledRow label={copy.hoverBackgroundLabel}>
              <ColorPicker
                value={colorValueOrFallback(hoverStyle.backgroundColor, colorValueOrFallback(node.style.backgroundColor, 'transparent'))}
                paletteTokens={paletteTokens}
                disabled={disabled}
                locale={locale}
                onChange={(color: BuilderColorValue) => updateHover({ backgroundColor: color })}
              />
            </LabeledRow>

            <LabeledRow label={copy.hoverBorderColorLabel}>
              <ColorPicker
                value={hoverStyle.borderColor ?? node.style.borderColor}
                paletteTokens={paletteTokens}
                disabled={disabled}
                locale={locale}
                onChange={(color: BuilderColorValue) => updateHover({ borderColor: color })}
              />
            </LabeledRow>

            <div className={styles.inspectorFieldGrid}>
              <NumberField
                label={copy.scaleLabel}
                ariaLabel={copy.numberValueAriaLabel(copy.scaleLabel)}
                value={hoverStyle.scale ?? 1}
                min={0.5}
                max={2}
                step={0.01}
                disabled={disabled}
                onCommit={(value) => updateHover({ scale: Number(value.toFixed(2)) })}
              />
              <NumberField
                label={copy.yMoveLabel}
                ariaLabel={copy.numberValueAriaLabel(copy.yMoveLabel)}
                value={hoverStyle.translateY ?? 0}
                min={-100}
                max={100}
                disabled={disabled}
                onCommit={(value) => updateHover({ translateY: Math.round(value) })}
              />
              <NumberField
                label={copy.blurLabel}
                ariaLabel={copy.numberValueAriaLabel(copy.blurLabel)}
                value={hoverStyle.shadowBlur ?? node.style.shadowBlur}
                min={0}
                max={160}
                disabled={disabled}
                onCommit={(value) => updateHover({ shadowBlur: Math.round(value) })}
              />
              <NumberField
                label={copy.spreadLabel}
                ariaLabel={copy.numberValueAriaLabel(copy.spreadLabel)}
                value={hoverStyle.shadowSpread ?? node.style.shadowSpread}
                min={-96}
                max={96}
                disabled={disabled}
                onCommit={(value) => updateHover({ shadowSpread: Math.round(value) })}
              />
            </div>

            <LabeledRow label={copy.hoverShadowColorLabel}>
              <ColorPicker
                value={hoverStyle.shadowColor ?? node.style.shadowColor}
                paletteTokens={paletteTokens}
                disabled={disabled}
                locale={locale}
                onChange={(color: BuilderColorValue) => updateHover({ shadowColor: color })}
              />
            </LabeledRow>

            <NumberField
              label={copy.transitionMsLabel}
              ariaLabel={copy.numberValueAriaLabel(copy.transitionMsLabel)}
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
