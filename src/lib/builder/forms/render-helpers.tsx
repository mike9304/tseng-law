'use client';

import { useEffect, useRef } from 'react';
import { evaluateFormFieldCondition, type FormFieldCondition } from './conditional';
import { useBuilderFormRuntime } from './runtime-context';

export function useFormFieldRuntime({
  nodeId,
  name,
  showIf,
}: {
  nodeId: string;
  name: string;
  showIf?: FormFieldCondition;
}) {
  const runtime = useBuilderFormRuntime();
  const rootRef = useRef<HTMLDivElement>(null);
  const conditionVisible = evaluateFormFieldCondition(showIf, runtime?.values ?? {});
  const stepVisible = runtime?.activeFieldIds ? runtime.activeFieldIds.has(nodeId) : true;
  const visible = runtime?.mode === 'published' ? conditionVisible && stepVisible : true;
  const error = runtime?.errors[name];

  useEffect(() => {
    if (runtime?.mode !== 'published') return;
    const wrapper = rootRef.current?.closest<HTMLElement>('.builder-pub-node');
    if (!wrapper) return;
    wrapper.style.display = visible ? '' : 'none';
  }, [runtime?.mode, visible]);

  return {
    rootRef,
    visible,
    error,
    onValueChange: (value: string | string[] | undefined) => {
      runtime?.updateValue(name, value);
      runtime?.clearError(name);
    },
  };
}

interface ValidationMessageCopy {
  requiredError: string;
  emailTypeError: string;
  tooShortError: (minLength: number) => string;
  patternError: string;
  fallbackFieldLabel: string;
  fallbackInvalidError: (label: string) => string;
}

const koValidationCopy: ValidationMessageCopy = {
  requiredError: '필수 입력 항목입니다.',
  emailTypeError: '유효한 이메일 형식이 아닙니다.',
  tooShortError: (minLength) => `최소 ${minLength}자 이상 입력하세요.`,
  patternError: '입력 형식이 올바르지 않습니다.',
  fallbackFieldLabel: '필드',
  fallbackInvalidError: (label) => `${label} 입력값을 확인해 주세요.`,
};

export function getDefaultValidationMessage(
  input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  copy: ValidationMessageCopy = koValidationCopy,
): string {
  const label = input.getAttribute('data-builder-field-label') || copy.fallbackFieldLabel;
  if (input.validity.valueMissing) return copy.requiredError;
  if (input.validity.typeMismatch && input.getAttribute('type') === 'email') {
    return copy.emailTypeError;
  }
  if (input.validity.tooShort) {
    const minLength = 'minLength' in input ? input.minLength : Number(input.getAttribute('minlength') || 0);
    return copy.tooShortError(minLength);
  }
  if (input.validity.patternMismatch) {
    return input.getAttribute('data-builder-error-message') || copy.patternError;
  }
  return input.validationMessage || copy.fallbackInvalidError(label);
}
