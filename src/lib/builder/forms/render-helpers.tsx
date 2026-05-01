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

export function getDefaultValidationMessage(input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): string {
  const label = input.getAttribute('data-builder-field-label') || '필드';
  if (input.validity.valueMissing) return '필수 입력 항목입니다.';
  if (input.validity.typeMismatch && input.getAttribute('type') === 'email') {
    return '유효한 이메일 형식이 아닙니다.';
  }
  if (input.validity.tooShort) {
    const minLength = 'minLength' in input ? input.minLength : Number(input.getAttribute('minlength') || 0);
    return `최소 ${minLength}자 이상 입력하세요.`;
  }
  if (input.validity.patternMismatch) {
    return input.getAttribute('data-builder-error-message') || '입력 형식이 올바르지 않습니다.';
  }
  return input.validationMessage || `${label} 입력값을 확인해 주세요.`;
}
