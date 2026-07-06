'use client';

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import type { BuilderColorValue, ThemeColorToken } from '@/lib/builder/site/theme';
import { isThemeColorReference } from '@/lib/builder/site/theme';
import {
  getColorBindingIndicator,
  type ThemeBindingIndicator,
} from '@/lib/builder/site/theme-bindings';
import { contrastRatio, normalizeHexColor, wcagLevel } from '@/lib/builder/site/theme/contrast';
import { pushRecentColor, readRecentColors, writeRecentColors } from '@/lib/builder/site/theme/recent-colors';
import type { Locale } from '@/lib/locales';
import { getColorPickerCopy, type ColorPickerCopy } from '@/components/builder/editor/color-picker-copy';
import ThemeBindingBadge from '@/components/builder/editor/ThemeBindingBadge';
import styles from './ColorPickerAdvanced.module.css';

export interface ThemeSwatch {
  token: ThemeColorToken;
  label?: string;
  color: string;
}

export interface ColorPickerProps {
  value?: BuilderColorValue;
  onChange: (value: BuilderColorValue) => void;
  palette?: string[];
  paletteTokens?: ThemeSwatch[];
  disabled?: boolean;
  enableContrast?: boolean;
  locale?: Locale;
}

type EyeDropperConstructor = new () => {
  open: () => Promise<{ sRGBHex: string }>;
};

type ColorPickerStyleVars = CSSProperties & {
  '--color-picker-current'?: string;
  '--color-picker-swatch'?: string;
};

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function normalizeCustomValue(value: string): string {
  const trimmed = value.trim();
  const hex = normalizeHexColor(trimmed);
  return hex ?? trimmed;
}

function isSupportedColorText(value: string): boolean {
  const trimmed = value.trim();
  return (
    Boolean(normalizeHexColor(trimmed)) ||
    /^hsla?\([\d\s.,%+-]+\)$/i.test(trimmed) ||
    /^rgba?\([\d\s.,%+-]+\)$/i.test(trimmed) ||
    trimmed === 'transparent'
  );
}

function colorToText(value: BuilderColorValue | undefined): string {
  if (isThemeColorReference(value)) return `token:${value.token}`;
  return typeof value === 'string' ? value : '';
}

function resolveCurrentColor(value: BuilderColorValue | undefined, paletteTokens: ThemeSwatch[]): string {
  if (isThemeColorReference(value)) {
    return paletteTokens.find((item) => item.token === value.token)?.color ?? '#0f172a';
  }
  return typeof value === 'string' && value.trim() ? value : '#0f172a';
}

function normalizeFallbackPalette(palette: string[] | undefined): string[] {
  return [...new Set((palette ?? []).map((color) => normalizeHexColor(color) ?? color.trim()).filter(Boolean))];
}

function getEyeDropper(): EyeDropperConstructor | null {
  if (typeof window === 'undefined') return null;
  const candidate = (window as unknown as { EyeDropper?: EyeDropperConstructor }).EyeDropper;
  return candidate ?? null;
}

function localizeColorBindingIndicator(
  indicator: ThemeBindingIndicator,
  value: BuilderColorValue | undefined,
  copy: ColorPickerCopy,
): ThemeBindingIndicator {
  if (isThemeColorReference(value)) {
    const tokenLabel = copy.themeColorLabels[value.token];
    return {
      label: copy.colorBindingBadge.linked.label,
      tone: indicator.tone,
      title: copy.colorBindingBadge.linked.title(tokenLabel),
    };
  }

  return {
    label: copy.colorBindingBadge.detached.label,
    tone: indicator.tone,
    title: copy.colorBindingBadge.detached.title(),
  };
}

function colorSwatchStyle(color: string): ColorPickerStyleVars {
  return {
    '--color-picker-swatch': color,
  };
}

function currentColorStyle(color: string): ColorPickerStyleVars {
  return {
    '--color-picker-current': color,
  };
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((element) => (
    !element.hidden &&
    !element.closest('[hidden]') &&
    element.getAttribute('aria-hidden') !== 'true' &&
    element.getClientRects().length > 0
  ));
}

export default function ColorPickerAdvanced({
  value,
  onChange,
  palette,
  paletteTokens,
  disabled = false,
  enableContrast = true,
  locale = 'ko',
}: ColorPickerProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const textInputRef = useRef<HTMLInputElement | null>(null);
  const closingRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [textValue, setTextValue] = useState(colorToText(value));
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [eyeDropperError, setEyeDropperError] = useState<string | null>(null);
  const copy = getColorPickerCopy(locale);
  const normalizedTokens = useMemo(() => paletteTokens ?? [], [paletteTokens]);
  const fallbackPaletteColors = useMemo(() => normalizeFallbackPalette(palette), [palette]);
  const currentColor = resolveCurrentColor(value, normalizedTokens);
  const currentHex = normalizeHexColor(currentColor) ?? '#0f172a';
  const backgroundHex =
    normalizedTokens.find((item) => item.token === 'background')?.color ??
    fallbackPaletteColors[0] ??
    '#ffffff';
  const ratio = enableContrast ? contrastRatio(currentHex, backgroundHex) : null;
  const level = wcagLevel(ratio);
  const activeToken = isThemeColorReference(value) ? value.token : null;
  const bindingIndicator = getColorBindingIndicator(value);
  const bindingIndicatorDisplay = localizeColorBindingIndicator(bindingIndicator, value, copy);
  const EyeDropper = getEyeDropper();

  const closePopover = () => {
    closingRef.current = true;
    setOpen(false);
  };

  useEffect(() => {
    setTextValue(colorToText(value));
  }, [value]);

  useEffect(() => {
    setRecentColors(readRecentColors());
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const handleWindowClick = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('click', handleWindowClick, true);
    return () => window.removeEventListener('click', handleWindowClick, true);
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return undefined;
    closingRef.current = false;
    const panel = panelRef.current;
    if (!panel) return undefined;

    const trigger = triggerRef.current;
    const focusFrame = window.requestAnimationFrame(() => {
      (textInputRef.current ?? getFocusableElements(panel)[0] ?? panel).focus({ preventScroll: true });
    });
    const handleFocusIn = (event: FocusEvent) => {
      if (wrapperRef.current?.contains(event.target as Node | null)) return;
      (textInputRef.current ?? getFocusableElements(panel)[0] ?? panel).focus({ preventScroll: true });
    };

    document.addEventListener('focusin', handleFocusIn);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('focusin', handleFocusIn);
      if (!closingRef.current) return;
      window.setTimeout(() => {
        if (trigger?.isConnected) trigger.focus({ preventScroll: true });
        closingRef.current = false;
      }, 0);
    };
  }, [open]);

  const handlePanelKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closePopover();
      return;
    }
    if (event.key !== 'Tab') return;

    const panel = panelRef.current;
    if (!panel) return;
    const focusable = getFocusableElements(panel);
    if (focusable.length === 0) {
      event.preventDefault();
      panel.focus({ preventScroll: true });
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus({ preventScroll: true });
      return;
    }
    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  };

  const pushRecent = (nextColor: string) => {
    setRecentColors((current) => {
      const next = pushRecentColor(current, nextColor);
      writeRecentColors(next);
      return next;
    });
  };

  const commitCustomColor = (nextValue: string) => {
    if (!isSupportedColorText(nextValue)) return;
    const normalized = normalizeCustomValue(nextValue);
    setTextValue(normalized);
    pushRecent(normalized);
    onChange(normalized);
  };

  const pickEyeDropper = async () => {
    if (!EyeDropper || disabled) return;
    try {
      const result = await new EyeDropper().open();
      commitCustomColor(result.sRGBHex);
      setEyeDropperError(null);
    } catch {
      setEyeDropperError(copy.eyeDropperError);
    }
  };

  const renderSwatches = (items: Array<{ key: string; label: string; color: string; token?: ThemeColorToken }>) => (
    <div className={styles.swatchGrid}>
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          className={styles.swatchButton}
          title={`${item.label} · ${item.color}`}
          disabled={disabled}
          data-active={(item.token ? activeToken === item.token : item.color === currentHex) ? 'true' : undefined}
          style={colorSwatchStyle(item.color)}
          onClick={() => {
            if (item.token) {
              onChange({ kind: 'token', token: item.token });
              return;
            }
            commitCustomColor(item.color);
          }}
        />
      ))}
    </div>
  );

  return (
    <div ref={wrapperRef} className={styles.root} data-color-picker-advanced>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        className={styles.trigger}
        onClick={() => {
          if (open) {
            closePopover();
            return;
          }
          setOpen(true);
        }}
      >
        <span className={styles.triggerSwatch} style={currentColorStyle(currentColor)} />
        <span className={styles.triggerValue}>
          {colorToText(value) || currentColor}
        </span>
        <ThemeBindingBadge indicator={bindingIndicatorDisplay} />
      </button>

      {open ? (
        <div
          ref={panelRef}
          className={styles.panel}
          role="dialog"
          aria-label={copy.dialogAriaLabel}
          tabIndex={-1}
          data-builder-color-picker-dialog="true"
          data-builder-popover-dialog="true"
          onKeyDownCapture={handlePanelKeyDown}
        >
          <div className={styles.panelHeader}>
            <div className={styles.panelTitleStack}>
              <strong className={styles.panelTitle}>{copy.title}</strong>
              <span className={styles.panelDescription}>{copy.description}</span>
            </div>
            <ThemeBindingBadge indicator={bindingIndicatorDisplay} />
          </div>

          {normalizedTokens.length > 0 ? (
            <div className={styles.section}>
              <span className={styles.sectionLabel}>{copy.themePaletteLabel}</span>
              {renderSwatches(normalizedTokens.map((item) => ({
                key: item.token,
                token: item.token,
                color: item.color,
                label: copy.themeColorLabels[item.token] ?? item.label ?? item.token,
              })))}
            </div>
          ) : fallbackPaletteColors.length > 0 ? (
            <div className={styles.section}>
              <span className={styles.sectionLabel}>{copy.paletteLabel}</span>
              {renderSwatches(fallbackPaletteColors.map((color) => ({ key: color, color, label: color })))}
            </div>
          ) : null}

          {recentColors.length > 0 ? (
            <div className={styles.section}>
              <span className={styles.sectionLabel}>{copy.recentLabel}</span>
              {renderSwatches(recentColors.map((color) => ({ key: color, color, label: color })))}
            </div>
          ) : null}

          <div className={styles.colorInputRow}>
            <input
              aria-label={copy.nativeColorAriaLabel}
              type="color"
              value={currentHex}
              disabled={disabled}
              className={styles.nativeColorInput}
              onChange={(event) => commitCustomColor(event.target.value)}
            />
            <input
              ref={textInputRef}
              type="text"
              value={textValue}
              disabled={disabled}
              placeholder={copy.customColorPlaceholder}
              className={styles.textInput}
              onChange={(event) => {
                const nextValue = event.target.value;
                setTextValue(nextValue);
                if (isSupportedColorText(nextValue)) onChange(normalizeCustomValue(nextValue));
              }}
              onBlur={() => {
                if (isSupportedColorText(textValue)) {
                  commitCustomColor(textValue);
                } else {
                  setTextValue(colorToText(value));
                }
              }}
            />
          </div>

          <div className={styles.actionRow}>
            <button
              type="button"
              disabled={!EyeDropper || disabled}
              title={EyeDropper ? copy.eyeDropperPickTitle : copy.eyeDropperUnavailableTitle}
              className={styles.eyeDropperButton}
              onClick={pickEyeDropper}
            >
              {copy.eyeDropperLabel}
            </button>
            {enableContrast ? (
              <ThemeBindingBadge
                textCase="normal"
                indicator={{
                  label: ratio ? `${ratio.toFixed(2)}:1 ${copy.wcagLevelLabels[level]}` : copy.contrastUnavailableLabel,
                  tone: level === 'fail' ? 'custom' : 'linked',
                  title: copy.contrastAgainstTitle(backgroundHex),
                }}
              />
            ) : null}
          </div>
          {eyeDropperError ? <span className={styles.errorText}>{eyeDropperError}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
