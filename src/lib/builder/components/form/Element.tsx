'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { BuilderFormCanvasNode } from '@/lib/builder/canvas/types';
import {
  flexToCSS,
  gridToCSS,
  DEFAULT_FLEX,
  DEFAULT_GRID,
} from '@/lib/builder/canvas/layout-modes';
import type { Locale } from '@/lib/locales';
import { BuilderFormRuntimeProvider } from '@/lib/builder/forms/runtime-context';
import type { FormValues } from '@/lib/builder/forms/conditional';
import { getDefaultValidationMessage } from '@/lib/builder/forms/render-helpers';
import type { FormSubmissionFile } from '@/lib/builder/forms/form-engine';
import { FORM_KO_DEFAULTS, getFormControlsCopy, localizedFormControlText } from './form-controls-copy';

interface FormElementProps {
  node: BuilderFormCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
  children?: ReactNode;
}

type SubmitErrorResponse = {
  error?: string;
  validationErrors?: Array<{ fieldId?: unknown; message?: unknown }>;
  cmsIssues?: string[];
};

export default function FormElement({ node, mode = 'edit', locale = 'ko', children }: FormElementProps) {
  const content = node.content;
  const copy = getFormControlsCopy(locale);
  const successMessage = localizedFormControlText(
    content.successMessage,
    copy.formDefaults.successMessage,
    FORM_KO_DEFAULTS.successMessage,
  );
  const layoutMode = content.layoutMode ?? 'absolute';
  const loadedAtRef = useRef<number>(Date.now());
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});
  const [values, setValues] = useState<FormValues>({});
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const steps = content.steps?.filter((step) => step.fieldNodeIds.length > 0) ?? [];
  const hasSteps = steps.length > 0;
  const activeStep = hasSteps ? steps[Math.min(activeStepIndex, steps.length - 1)] : undefined;
  const activeFieldIds = useMemo(
    () => (activeStep ? new Set(activeStep.fieldNodeIds) : undefined),
    [activeStep],
  );
  const isLastStep = !hasSteps || activeStepIndex >= steps.length - 1;
  const captchaSiteKey =
    content.captcha === 'hcaptcha'
      ? process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY
      : content.captcha === 'turnstile'
        ? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
        : undefined;

  useEffect(() => {
    loadedAtRef.current = Date.now();
  }, []);

  let layoutCSS: Record<string, string> = {};
  if (layoutMode === 'flex') {
    layoutCSS = flexToCSS(content.flexConfig ?? DEFAULT_FLEX);
  } else if (layoutMode === 'grid') {
    layoutCSS = gridToCSS(content.gridConfig ?? DEFAULT_GRID);
  }

  const baseStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    position: 'relative',
    ...(layoutMode !== 'absolute' ? layoutCSS : {}),
  };

  const runtimeValue = useMemo(
    () => ({
      mode,
      values,
      errors: fieldErrors,
      activeFieldIds,
      isLastStep,
      updateValue: (name: string, value: string | string[] | undefined) => {
        setValues((current) => ({ ...current, [name]: value }));
      },
      clearError: (name: string) => {
        setFieldErrors((current) => {
          if (!current[name]) return current;
          const next = { ...current };
          delete next[name];
          return next;
        });
      },
    }),
    [activeFieldIds, fieldErrors, isLastStep, mode, values],
  );

  function renderStepControls() {
    if (!hasSteps) return null;
    const current = Math.min(activeStepIndex, steps.length - 1);
    return (
      <div
        data-builder-form-steps="true"
        style={{
          position: layoutMode === 'absolute' ? 'absolute' : 'relative',
          left: layoutMode === 'absolute' ? 12 : undefined,
          right: layoutMode === 'absolute' ? 12 : undefined,
          bottom: layoutMode === 'absolute' ? 12 : undefined,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '8px 0',
          pointerEvents: mode === 'edit' ? 'none' : undefined,
        }}
      >
        <button
          type="button"
          disabled={current === 0}
          onClick={() => setActiveStepIndex((step) => Math.max(0, step - 1))}
          style={stepButtonStyle(current === 0)}
        >
          {copy.formRuntime.previousLabel}
        </button>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
          {steps.map((step, index) => (
            <span
              key={step.id}
              title={step.title}
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: index === current ? '#123b63' : '#cbd5e1',
              }}
            />
          ))}
          {current + 1}/{steps.length}
        </span>
        <button
          type="button"
          disabled={current >= steps.length - 1}
          onClick={() => setActiveStepIndex((step) => Math.min(steps.length - 1, step + 1))}
          style={stepButtonStyle(current >= steps.length - 1)}
        >
          {copy.formRuntime.nextLabel}
        </button>
      </div>
    );
  }

  // In edit/preview modes, don't actually submit — just render children.
  if (mode !== 'published') {
    const childArray = Array.isArray(children) ? children : children ? [children] : [];
    const isEmpty = childArray.length === 0;
    return (
      <BuilderFormRuntimeProvider value={runtimeValue}>
        <form
          // prevent native submission inside builder
          onSubmit={(event) => event.preventDefault()}
          style={baseStyle}
          data-builder-form-name={content.name}
          noValidate
        >
          {children}
          {renderStepControls()}
          {isEmpty && mode === 'edit' ? (
            <div
              style={{
                position: 'absolute',
                top: 8,
                left: 8,
                color: '#94a3b8',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                pointerEvents: 'none',
              }}
            >
              {copy.formRuntime.emptyBadgeLabel} · {content.name}
            </div>
          ) : null}
        </form>
      </BuilderFormRuntimeProvider>
    );
  }

  if (status === 'success') {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: 'rgba(34, 197, 94, 0.1)',
          color: 'var(--builder-color-text)',
          borderRadius: 12,
          fontSize: 15,
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        {successMessage}
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMsg(null);
    if (status === 'submitting') return;

    const elapsed = Date.now() - loadedAtRef.current;
    if (elapsed < 3000) {
      setErrorMsg(copy.formRuntime.slowSubmissionError);
      return;
    }

    const formEl = event.currentTarget;
    const validationErrors = validateVisibleFields(formEl);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      focusFirstFieldError(formEl, validationErrors);
      setStatus('error');
      return;
    }
    setFieldErrors({});

    if (content.captcha && content.captcha !== 'none' && !captchaSiteKey) {
      setErrorMsg(copy.formRuntime.captchaMissingError);
      setStatus('error');
      return;
    }

    const formData = new FormData(formEl);
    // Honeypot check: any input named `website` should be empty
    const honeypot = formData.get('website');
    if (typeof honeypot === 'string' && honeypot.length > 0) {
      // Pretend success silently
      setStatus('success');
      return;
    }

    const fields: Record<string, string> = {};
    const seen = new Set<string>();
    formData.forEach((_value, key) => {
      if (key === 'website') return;
      if (seen.has(key)) return;
      seen.add(key);
      const valuesForKey = formData.getAll(key)
        .map((value) => (typeof value === 'string' ? value : value.name))
        .filter(Boolean);
      fields[key] = valuesForKey.join(', ');
    });

    setStatus('submitting');
    try {
      const uploadLocale = typeof window !== 'undefined'
        ? window.location.pathname.split('/').filter(Boolean)[0] || 'ko'
        : 'ko';
      const files = await uploadFormFiles(
        formEl,
        content.name,
        uploadLocale,
        copy.formRuntime.fileUploadFailedError,
      );
      const res = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: content.name,
          formName: content.name,
          submitTo: content.submitTo,
          targetEmail: content.targetEmail,
          webhookUrl: content.webhookUrl,
          fields,
          files,
          loadedAt: loadedAtRef.current,
          submittedAt: Date.now(),
          pageSlug: typeof window !== 'undefined' ? window.location.pathname : '',
          captchaProvider: content.captcha,
          captchaToken: formData.get('captchaToken'),
          autoReplyEnabled: content.autoReplyEnabled,
          autoReplyTemplate: content.autoReplyTemplate,
        }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as SubmitErrorResponse;
        const serverFieldErrors = normalizeServerValidationErrors(err.validationErrors);
        if (Object.keys(serverFieldErrors).length > 0) {
          setFieldErrors(serverFieldErrors);
          focusFirstFieldError(formEl, serverFieldErrors);
        }
        const cmsIssueText = err.cmsIssues?.length ? ` ${err.cmsIssues.join(' ')}` : '';
        setErrorMsg((err.error || copy.formRuntime.submitFailedError) + cmsIssueText);
        setStatus('error');
        return;
      }
      setStatus('success');
      if (content.redirectUrl && typeof window !== 'undefined') {
        window.location.href = content.redirectUrl;
      }
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : copy.formRuntime.networkError);
      setStatus('error');
    }
  }

  return (
    <BuilderFormRuntimeProvider value={runtimeValue}>
      <form
        onSubmit={handleSubmit}
        method="POST"
        style={baseStyle}
        data-builder-form-name={content.name}
        noValidate
      >
      {/* Honeypot — hidden via inline style, bots fill it */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
        aria-hidden="true"
      />
        {children}
        {content.captcha && content.captcha !== 'none' ? (
          <div
            style={{
              position: layoutMode === 'absolute' ? 'absolute' : 'relative',
              left: layoutMode === 'absolute' ? 12 : undefined,
              right: layoutMode === 'absolute' ? 12 : undefined,
              bottom: layoutMode === 'absolute' ? (hasSteps ? 58 : 12) : undefined,
              padding: '8px 10px',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              color: '#475569',
              background: 'rgba(248, 250, 252, 0.9)',
              fontSize: 12,
            }}
            data-builder-captcha={content.captcha}
            data-sitekey={captchaSiteKey}
          >
            {captchaSiteKey
              ? copy.formRuntime.captchaPlaceholder(content.captcha)
              : copy.formRuntime.captchaNotConfigured(content.captcha)}
          </div>
        ) : null}
        {renderStepControls()}
        {errorMsg ? (
          <div
            role="alert"
            style={{
              position: 'absolute',
              bottom: hasSteps ? 54 : 8,
              left: 8,
              right: 8,
              padding: '8px 12px',
              background: 'rgba(220, 38, 38, 0.1)',
              color: '#dc2626',
              borderRadius: 6,
              fontSize: 13,
              textAlign: 'center',
            }}
          >
            {errorMsg}
          </div>
        ) : null}
      </form>
    </BuilderFormRuntimeProvider>
  );

  function validateVisibleFields(formEl: HTMLFormElement): Record<string, string> {
    const errors: Record<string, string> = {};
    const controls = Array.from(
      formEl.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
        'input[name], textarea[name], select[name]',
      ),
    );
    const checkedGroups = new Set<string>();

    for (const control of controls) {
      const name = control.name;
      if (!name || name === 'website' || control.disabled) continue;
      const wrapper = control.closest<HTMLElement>('.builder-pub-node');
      if (wrapper && wrapper.style.display === 'none') continue;
      const customMessage = control.getAttribute('data-builder-error-message') || undefined;

      if (control instanceof HTMLInputElement && (control.type === 'radio' || control.type === 'checkbox')) {
        if (checkedGroups.has(name)) continue;
        checkedGroups.add(name);
        const group = controls.filter(
          (candidate): candidate is HTMLInputElement =>
            candidate instanceof HTMLInputElement && candidate.name === name,
        );
        const required = group.some((candidate) => candidate.required);
        if (required && !group.some((candidate) => candidate.checked)) {
          errors[name] = customMessage || copy.formRuntime.requiredError;
        }
        continue;
      }

      if (control instanceof HTMLInputElement && control.type === 'file') {
        if (control.required && (!control.files || control.files.length === 0)) {
          errors[name] = customMessage || copy.formRuntime.requiredError;
          continue;
        }
        const maxSizeMb = Number(control.getAttribute('data-builder-max-size-mb') || '0');
        if (maxSizeMb > 0 && control.files) {
          const tooLarge = Array.from(control.files).some((file) => file.size > maxSizeMb * 1024 * 1024);
          if (tooLarge) {
            errors[name] = customMessage || copy.formRuntime.fileTooLargeError(maxSizeMb);
          }
        }
        continue;
      }

      if (!control.checkValidity()) {
        errors[name] = customMessage || getDefaultValidationMessage(control, copy.formRuntime);
      }
    }

    const signatureFields = Array.from(
      formEl.querySelectorAll<HTMLElement>('[data-builder-form-widget="signature"][data-builder-form-name]'),
    );
    for (const signature of signatureFields) {
      const name = signature.getAttribute('data-builder-form-name') ?? '';
      const required = signature.getAttribute('aria-required') === 'true';
      const hidden = signature.closest<HTMLElement>('.builder-pub-node')?.style.display === 'none';
      const hasInk = signature.getAttribute('data-builder-signature-has-ink') === 'true';
      if (name && required && !hidden && !hasInk) {
        errors[name] = copy.formRuntime.requiredError;
      }
    }

    return errors;
  }
}

function normalizeServerValidationErrors(
  validationErrors: SubmitErrorResponse['validationErrors'],
): Record<string, string> {
  if (!Array.isArray(validationErrors)) return {};
  return validationErrors.reduce<Record<string, string>>((acc, item) => {
    const fieldId = typeof item.fieldId === 'string' ? item.fieldId.trim() : '';
    const message = typeof item.message === 'string' ? item.message.trim() : '';
    if (fieldId && message && !acc[fieldId]) acc[fieldId] = message;
    return acc;
  }, {});
}

function focusFirstFieldError(formEl: HTMLFormElement, errors: Record<string, string | undefined>): void {
  const firstName = Object.keys(errors).find((name) => Boolean(errors[name]));
  if (!firstName) return;
  const control = formEl.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    `[name="${CSS.escape(firstName)}"]`,
  );
  control?.focus({ preventScroll: false });
}

async function uploadFormFiles(
  formEl: HTMLFormElement,
  formId: string,
  locale: string,
  fallbackError: string,
): Promise<FormSubmissionFile[]> {
  const uploads: FormSubmissionFile[] = [];
  const inputs = Array.from(formEl.querySelectorAll<HTMLInputElement>('input[type="file"][name]'));

  for (const input of inputs) {
    const wrapper = input.closest<HTMLElement>('.builder-pub-node');
    if (wrapper && wrapper.style.display === 'none') continue;
    for (const file of Array.from(input.files ?? [])) {
      if (file.size <= 0) continue;
      const body = new FormData();
      body.set('formId', formId);
      body.set('fieldId', input.name);
      body.set('locale', locale);
      body.set('file', file);
      const response = await fetch('/api/forms/uploads', {
        method: 'POST',
        body,
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        file?: FormSubmissionFile;
      };
      if (!response.ok || !payload.file) {
        throw new Error(payload.error || fallbackError);
      }
      uploads.push(payload.file);
    }
  }

  return uploads;
}

function stepButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: '7px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    background: disabled ? '#f1f5f9' : '#ffffff',
    color: disabled ? '#94a3b8' : '#123b63',
    fontSize: 12,
    fontWeight: 700,
    cursor: disabled ? 'default' : 'pointer',
  };
}
