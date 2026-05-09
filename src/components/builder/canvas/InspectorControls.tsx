'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import {
  getThemeBindingBadgeStyle,
  type ThemeBindingTone,
} from '@/lib/builder/site/theme-bindings';
import styles from './SandboxPage.module.css';

export type InspectorMixed = boolean;

export interface InspectorTokenBinding {
  token?: string;
  tone?: ThemeBindingTone;
  onToggleLink?: () => void;
}

interface BaseControlProps {
  disabled?: boolean;
  mixed?: boolean;
  hasOverride?: boolean;
}

export function MixedValueIndicator({ label = 'Mixed' }: { label?: string }) {
  return (
    <span
      role="status"
      aria-label="Mixed values"
      title="Multiple selected values differ. Entering a new value applies it to all selected elements."
      className={styles.mixedValueBadge}
    >
      <span aria-hidden>--</span>
      {label}
    </span>
  );
}

export interface LabeledRowProps {
  label: string;
  hint?: string;
  binding?: InspectorTokenBinding;
  dense?: boolean;
  children: ReactNode;
  hasOverride?: boolean;
  id?: string;
  title?: string;
  helper?: ReactNode;
}

export function LabeledRow({
  label,
  hint,
  binding,
  dense = false,
  children,
  hasOverride = false,
  id,
  title,
  helper,
}: LabeledRowProps) {
  return (
    <div
      id={id}
      className="insp-row"
      data-dense={dense ? 'true' : undefined}
      data-has-override={hasOverride ? 'true' : undefined}
    >
      <div className="insp-row-label">
        <span title={title ?? label}>{label}</span>
        {hint ? <small>{hint}</small> : null}
        {binding?.tone ? (
          <button
            type="button"
            onClick={binding.onToggleLink}
            disabled={!binding.onToggleLink}
            title={
              binding.token
                ? `Bound to ${binding.token}${binding.onToggleLink ? '. Click to change.' : ''}`
                : 'Theme binding'
            }
            style={{
              ...getThemeBindingBadgeStyle(binding.tone),
              border: 'none',
              cursor: binding.onToggleLink ? 'pointer' : 'default',
            }}
          >
            <span
              aria-hidden
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: 'currentColor',
                marginRight: 4,
              }}
            />
            {binding.tone === 'linked' ? 'Linked' : binding.tone === 'detached' ? 'Detached' : 'Custom'}
          </button>
        ) : null}
        {hasOverride ? <span className="insp-row-override-dot" aria-hidden title="Viewport override" /> : null}
      </div>
      <div className="insp-row-control">{children}</div>
      {helper ? <div className="insp-row-helper">{helper}</div> : null}
    </div>
  );
}

export interface NumberStepperProps extends BaseControlProps {
  value: number | null;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  width?: number;
  fineStep?: number;
  ariaLabel?: string;
}

export const NumberStepper = forwardRef<HTMLInputElement, NumberStepperProps>(function NumberStepper(
  { value, onChange, min, max, step = 1, suffix, width = 96, fineStep, mixed, disabled, ariaLabel },
  ref,
) {
  const [draft, setDraft] = useState(value === null ? '' : String(value));

  useEffect(() => {
    setDraft(value === null ? '' : String(value));
  }, [value]);

  const clamp = useCallback(
    (next: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, next)),
    [max, min],
  );

  const commit = useCallback(
    (raw: string) => {
      const parsed = Number(raw.trim());
      if (!Number.isFinite(parsed)) {
        setDraft(value === null ? '' : String(value));
        return;
      }
      onChange(clamp(parsed));
    },
    [clamp, onChange, value],
  );

  const stepBy = useCallback(
    (multiplier: number) => {
      const delta = (fineStep ?? step) * multiplier;
      onChange(clamp((value ?? 0) + delta));
    },
    [clamp, fineStep, onChange, step, value],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.currentTarget.blur();
        return;
      }
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
      event.preventDefault();
      const direction = event.key === 'ArrowUp' ? 1 : -1;
      const multiplier = event.shiftKey ? 10 : event.altKey ? 0.1 : 1;
      stepBy(direction * multiplier);
    },
    [stepBy],
  );

  if (mixed) return <MixedValueIndicator />;

  return (
    <div className="insp-number-stepper" style={{ width }}>
      <button type="button" aria-label="Decrease" disabled={disabled} onClick={() => stepBy(-1)}>
        -
      </button>
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        aria-label={ariaLabel}
        disabled={disabled}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={(event) => commit(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      {suffix ? <span>{suffix}</span> : null}
      <button type="button" aria-label="Increase" disabled={disabled} onClick={() => stepBy(1)}>
        +
      </button>
    </div>
  );
});

export interface SegmentedOption<T extends string> {
  value: T;
  label?: string;
  icon?: ReactNode;
  title?: string;
}

export interface SegmentedControlProps<T extends string> extends BaseControlProps {
  options: SegmentedOption<T>[];
  value: T | null;
  onChange: (next: T) => void;
  size?: 'sm' | 'md';
  ariaLabel?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'sm',
  mixed,
  disabled,
  ariaLabel,
}: SegmentedControlProps<T>) {
  if (mixed) return <MixedValueIndicator />;

  return (
    <div className="insp-segmented-control" data-size={size} role="radiogroup" aria-label={ariaLabel}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            title={option.title}
            data-active={active ? 'true' : undefined}
            onClick={() => onChange(option.value)}
          >
            {option.icon}
            {option.label ? <span>{option.label}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

export interface SwatchRowProps extends BaseControlProps {
  cssValue: string | null;
  onClick: () => void;
  linkedToken?: string;
  detached?: boolean;
  ariaLabel?: string;
  size?: number;
}

export function SwatchRow({
  cssValue,
  onClick,
  linkedToken,
  detached = false,
  mixed,
  disabled,
  ariaLabel,
  size = 24,
}: SwatchRowProps) {
  if (mixed) return <MixedValueIndicator />;
  const tone: ThemeBindingTone = linkedToken ? 'linked' : detached ? 'detached' : 'custom';

  return (
    <button
      type="button"
      className="insp-swatch-row"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel ?? 'Open color picker'}
      title={linkedToken ? `Bound to ${linkedToken}` : detached ? 'Detached color' : 'Custom color'}
    >
      <span className="insp-swatch" style={{ width: size, height: size }}>
        <span style={{ background: cssValue ?? 'transparent' }} />
      </span>
      <span style={getThemeBindingBadgeStyle(tone)}>
        <span
          aria-hidden
          style={{ width: 6, height: 6, borderRadius: 999, background: 'currentColor', marginRight: 4 }}
        />
        {tone === 'linked' ? 'Linked' : tone === 'detached' ? 'Detached' : 'Custom'}
      </span>
    </button>
  );
}

export interface SliderRowProps extends BaseControlProps {
  value: number | null;
  onChange: (next: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  ariaLabel?: string;
}

export function SliderRow({
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
  mixed,
  disabled,
  ariaLabel,
}: SliderRowProps) {
  if (mixed) return <MixedValueIndicator />;
  const resolved = value ?? min;

  return (
    <div className="insp-slider-row">
      <input
        type="range"
        aria-label={ariaLabel ?? 'Adjust value'}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        value={resolved}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span>
        {resolved}
        {suffix ? <small>{suffix}</small> : null}
      </span>
    </div>
  );
}

export interface ToggleRowProps extends BaseControlProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  ariaLabel?: string;
}

export function ToggleRow({ checked, onChange, mixed, disabled, ariaLabel }: ToggleRowProps) {
  if (mixed) return <MixedValueIndicator />;

  return (
    <button
      type="button"
      className="insp-toggle-row"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel ?? (checked ? 'Disable setting' : 'Enable setting')}
      title={ariaLabel ?? (checked ? 'Disable setting' : 'Enable setting')}
      disabled={disabled}
      data-checked={checked ? 'true' : undefined}
      onClick={() => onChange(!checked)}
    >
      <span aria-hidden />
    </button>
  );
}

export interface AdvancedDisclosureProps {
  label?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (next: boolean) => void;
  children: ReactNode;
}

export function AdvancedDisclosure({
  label = 'Advanced',
  defaultOpen = false,
  open,
  onOpenChange,
  children,
}: AdvancedDisclosureProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open ?? internalOpen;

  return (
    <div className="insp-advanced-disclosure">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => {
          const next = !isOpen;
          setInternalOpen(next);
          onOpenChange?.(next);
        }}
      >
        <span aria-hidden data-open={isOpen ? 'true' : undefined}>▶</span>
        {label}
      </button>
      <div hidden={!isOpen}>{children}</div>
    </div>
  );
}

export function InspectorNotice({
  tone = 'neutral',
  children,
}: {
  tone?: 'neutral' | 'linked' | 'detached' | 'mixed';
  children: ReactNode;
}) {
  return (
    <div className={styles.inspectorNotice} data-tone={tone}>
      {children}
    </div>
  );
}

export function InspectorSection({
  label,
  title,
  children,
  defaultOpen = true,
}: {
  label?: string;
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={styles.panelSection}>
      <header className={styles.panelSectionHeader}>
        <span>{label ?? title}</span>
        <strong>{title}</strong>
        <button
          type="button"
          className={styles.panelHeaderButton}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? 'Hide' : 'Show'}
        </button>
      </header>
      {open ? children : null}
    </section>
  );
}

export function MixedValueBadge({ label = 'Mixed' }: { label?: string }) {
  return <MixedValueIndicator label={label} />;
}
