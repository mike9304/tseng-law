import { readFileSync } from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import formRadioInspector from '../../formRadio/Inspector';
import formRadioElement from '../../formRadio/Element';
import formDateInspector from '../../formDate/Inspector';
import formFileInspector from '../../formFile/Inspector';
import formSubmitInspector from '../../formSubmit/Inspector';
import formCheckboxInspector from '../../formCheckbox/Inspector';
import formCheckboxElement from '../../formCheckbox/Element';
import {
  FORM_CHECKBOX_KO_DEFAULTS,
  FORM_DATE_KO_DEFAULTS,
  FORM_FILE_KO_DEFAULTS,
  FORM_RADIO_KO_DEFAULTS,
  FORM_SUBMIT_KO_DEFAULTS,
} from '../form-controls-copy';

const root = process.cwd();

function read(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

const commonInspectorProps = {
  onUpdate: () => undefined,
  disabled: false,
} as const;

describe('form field inspector localization', () => {
  it('renders localized labels in zh-hant', () => {
    const Radio = formRadioInspector as React.ComponentType<{ node: unknown; locale?: 'ko' | 'zh-hant' | 'en'; onUpdate: (props: Record<string, unknown>) => void; disabled?: boolean }>;
    const DateInspector = formDateInspector as React.ComponentType<{ node: unknown; locale?: 'ko' | 'zh-hant' | 'en'; onUpdate: (props: Record<string, unknown>) => void; disabled?: boolean }>;
    const FileInspector = formFileInspector as React.ComponentType<{ node: unknown; locale?: 'ko' | 'zh-hant' | 'en'; onUpdate: (props: Record<string, unknown>) => void; disabled?: boolean }>;
    const SubmitInspector = formSubmitInspector as React.ComponentType<{ node: unknown; locale?: 'ko' | 'zh-hant' | 'en'; onUpdate: (props: Record<string, unknown>) => void; disabled?: boolean }>;
    const CheckboxInspector = formCheckboxInspector as React.ComponentType<{ node: unknown; locale?: 'ko' | 'zh-hant' | 'en'; onUpdate: (props: Record<string, unknown>) => void; disabled?: boolean }>;

    const radioNode = {
      content: {
        name: 'choice',
        label: 'Choice',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
        defaultValue: 'yes',
        layout: 'horizontal',
        required: true,
        showIf: { fieldName: 'caseType', operator: 'equals', value: 'new' },
        errorMessage: '',
      },
    } as unknown as Record<string, unknown>;

    const dateNode = {
      content: {
        name: 'date',
        label: 'Date',
        type: 'datetime-local',
        variant: 'filled',
        defaultValue: '',
        min: '',
        max: '',
        required: true,
        showIf: { fieldName: 'caseType', operator: 'equals', value: 'new' },
        errorMessage: '',
      },
    } as unknown as Record<string, unknown>;

    const fileNode = {
      content: {
        name: 'photo',
        label: 'Photo',
        variant: 'underline',
        accept: 'image/png',
        maxSizeMb: 5,
        multiple: false,
        required: false,
        showIf: { fieldName: 'caseType', operator: 'equals', value: 'new' },
        errorMessage: '',
      },
    } as unknown as Record<string, unknown>;

    const submitNode = {
      content: {
        label: 'Submit',
        style: 'ghost',
        loadingLabel: 'Submitting...',
        fullWidth: true,
      },
    } as unknown as Record<string, unknown>;

    const checkboxNode = {
      content: {
        name: 'agree',
        label: 'Agree',
        options: [{ value: 'yes', label: 'Yes' }],
        required: true,
        defaultChecked: false,
        showIf: { fieldName: 'caseType', operator: 'equals', value: 'new' },
        errorMessage: '',
      },
    } as unknown as Record<string, unknown>;

    const radioHtml = renderToStaticMarkup(
      <Radio node={radioNode} locale="zh-hant" {...commonInspectorProps} />,
    );
    expect(radioHtml).toContain('data-builder-form-field-inspector="radio"');
    expect(radioHtml).toContain('欄位名稱');
    expect(radioHtml).toContain('選項（每行 value|label）');
    expect(radioHtml).toContain('版面');
    expect(radioHtml).toContain('橫向');
    expect(radioHtml).toContain('直向');

    const radioFallbackHtml = renderToStaticMarkup(
      <Radio
        node={{
          content: {
            name: 'choice',
            label: 'Choice',
            options: [],
            defaultValue: 'yes',
            layout: 'horizontal',
            required: true,
            showIf: { fieldName: 'caseType', operator: 'equals', value: 'new' },
            errorMessage: '',
          },
        }}
        locale="zh-hant"
        {...commonInspectorProps}
      />,
    );
    expect(radioFallbackHtml).toContain('是');
    expect(radioFallbackHtml).toContain('否');

    const dateHtml = renderToStaticMarkup(
      <DateInspector node={dateNode} locale="zh-hant" {...commonInspectorProps} />,
    );
    expect(dateHtml).toContain('data-builder-form-field-inspector="date"');
    expect(dateHtml).toContain('日期與時間');
    expect(dateHtml).toContain('預設值');
    expect(dateHtml).toContain('最小值');
    expect(dateHtml).toContain('最大值');

    const fileHtml = renderToStaticMarkup(
      <FileInspector node={fileNode} locale="zh-hant" {...commonInspectorProps} />,
    );
    expect(fileHtml).toContain('data-builder-form-field-inspector="file"');
    expect(fileHtml).toContain('接受格式');
    expect(fileHtml).toContain('最大大小 MB');
    expect(fileHtml).toContain('可多選');

    const submitHtml = renderToStaticMarkup(
      <SubmitInspector node={submitNode} locale="zh-hant" {...commonInspectorProps} />,
    );
    expect(submitHtml).toContain('標籤');
    expect(submitHtml).toContain('樣式');
    expect(submitHtml).toContain('載入標籤');
    expect(submitHtml).toContain('全寬');

    const checkboxHtml = renderToStaticMarkup(
      <CheckboxInspector node={checkboxNode} locale="zh-hant" {...commonInspectorProps} />,
    );
    expect(checkboxHtml).toContain('data-builder-form-field-inspector="checkbox"');
    expect(checkboxHtml).toContain('欄位名稱');
    expect(checkboxHtml).toContain('選項（選填，每行 value|label）');
    expect(checkboxHtml).toContain('預設勾選');
    expect(checkboxHtml).toContain('條件值');
  });

  it('keeps compact field inspectors on the shared CSS module without inline select styles', () => {
    const css = read('src/lib/builder/components/form/FormControlInspector.module.css');
    const fieldInspectorPaths = [
      'src/lib/builder/components/formCheckbox/Inspector.tsx',
      'src/lib/builder/components/formRadio/Inspector.tsx',
      'src/lib/builder/components/formDate/Inspector.tsx',
      'src/lib/builder/components/formFile/Inspector.tsx',
    ];

    for (const relativePath of fieldInspectorPaths) {
      const inspector = read(relativePath);
      expect(inspector).toContain("import styles from '../form/FormControlInspector.module.css';");
      expect(inspector).toContain('className={styles.root}');
      expect(inspector).toContain('data-builder-form-field-inspector=');
      for (const removedInlineStyle of [
        'React.CSSProperties',
        'const selectStyle',
        'style=',
        'import React',
      ]) {
        expect(inspector).not.toContain(removedInlineStyle);
      }
    }
    expect(css).toContain(".root input:not([type='checkbox'])");
    expect(css).toContain(".root input[type='checkbox']:focus-visible");
  });

  it('renders localized radio and checkbox legacy defaults in zh-hant runtime', () => {
    const RadioElement = formRadioElement as React.ComponentType<{
      node: unknown;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const CheckboxElement = formCheckboxElement as React.ComponentType<{
      node: unknown;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;

    const radioHtml = renderToStaticMarkup(
      <RadioElement
        node={{
          id: 'radio-1',
          kind: 'form-radio',
          content: {
            ...FORM_RADIO_KO_DEFAULTS,
            name: 'choice',
            required: false,
            options: [
              { value: 'option-1', label: '옵션 1' },
              { value: 'option-2', label: '옵션 2' },
            ],
            defaultValue: '',
            layout: 'vertical',
            errorMessage: '',
            showIf: undefined,
          },
        }}
        locale="zh-hant"
        mode="preview"
      />,
    );
    expect(radioHtml).toContain('選擇');
    expect(radioHtml).toContain('選項 1');
    expect(radioHtml).toContain('選項 2');
    expect(radioHtml).not.toContain('옵션 1');

    const checkboxHtml = renderToStaticMarkup(
      <CheckboxElement
        node={{
          id: 'checkbox-1',
          kind: 'form-checkbox',
          content: {
            ...FORM_CHECKBOX_KO_DEFAULTS,
            name: 'consent',
            required: false,
            defaultChecked: false,
            options: undefined,
            errorMessage: '',
            showIf: undefined,
          },
        }}
        locale="zh-hant"
        mode="preview"
      />,
    );
    expect(checkboxHtml).toContain('我同意');
    expect(checkboxHtml).not.toContain('동의합니다');
  });

  it('renders localized legacy default advanced field values in zh-hant inspectors', () => {
    const Radio = formRadioInspector as React.ComponentType<{ node: unknown; locale?: 'ko' | 'zh-hant' | 'en'; onUpdate: (props: Record<string, unknown>) => void; disabled?: boolean }>;
    const DateInspector = formDateInspector as React.ComponentType<{ node: unknown; locale?: 'ko' | 'zh-hant' | 'en'; onUpdate: (props: Record<string, unknown>) => void; disabled?: boolean }>;
    const FileInspector = formFileInspector as React.ComponentType<{ node: unknown; locale?: 'ko' | 'zh-hant' | 'en'; onUpdate: (props: Record<string, unknown>) => void; disabled?: boolean }>;
    const SubmitInspector = formSubmitInspector as React.ComponentType<{ node: unknown; locale?: 'ko' | 'zh-hant' | 'en'; onUpdate: (props: Record<string, unknown>) => void; disabled?: boolean }>;
    const CheckboxInspector = formCheckboxInspector as React.ComponentType<{ node: unknown; locale?: 'ko' | 'zh-hant' | 'en'; onUpdate: (props: Record<string, unknown>) => void; disabled?: boolean }>;

    const radioHtml = renderToStaticMarkup(
      <Radio
        node={{
          content: {
            ...FORM_RADIO_KO_DEFAULTS,
            name: 'choice',
            options: [
              { value: 'option-1', label: '옵션 1' },
              { value: 'option-2', label: '옵션 2' },
            ],
            defaultValue: '',
            layout: 'vertical',
            required: false,
            showIf: undefined,
            errorMessage: '',
          },
        }}
        locale="zh-hant"
        {...commonInspectorProps}
      />,
    );
    expect(radioHtml).toContain('value="選擇"');
    expect(radioHtml).toContain('option-1|選項 1');
    expect(radioHtml).not.toContain('value="선택"');
    expect(radioHtml).not.toContain('옵션 1');

    const dateHtml = renderToStaticMarkup(
      <DateInspector
        node={{
          content: {
            ...FORM_DATE_KO_DEFAULTS,
            name: 'date',
            type: 'date',
            variant: 'default',
            defaultValue: '',
            min: '',
            max: '',
            required: false,
            showIf: undefined,
            errorMessage: '',
          },
        }}
        locale="zh-hant"
        {...commonInspectorProps}
      />,
    );
    expect(dateHtml).toContain('value="日期"');
    expect(dateHtml).not.toContain('value="날짜"');

    const fileHtml = renderToStaticMarkup(
      <FileInspector
        node={{
          content: {
            ...FORM_FILE_KO_DEFAULTS,
            name: 'attachment',
            variant: 'default',
            accept: 'image/*,application/pdf',
            maxSizeMb: 10,
            multiple: false,
            required: false,
            showIf: undefined,
            errorMessage: '',
          },
        }}
        locale="zh-hant"
        {...commonInspectorProps}
      />,
    );
    expect(fileHtml).toContain('value="附件檔案"');
    expect(fileHtml).not.toContain('value="첨부 파일"');

    const submitHtml = renderToStaticMarkup(
      <SubmitInspector
        node={{
          content: {
            ...FORM_SUBMIT_KO_DEFAULTS,
            style: 'primary',
            fullWidth: false,
          },
        }}
        locale="zh-hant"
        {...commonInspectorProps}
      />,
    );
    expect(submitHtml).toContain('value="送出"');
    expect(submitHtml).toContain('value="送出中..."');
    expect(submitHtml).not.toContain('value="제출"');

    const checkboxHtml = renderToStaticMarkup(
      <CheckboxInspector
        node={{
          content: {
            ...FORM_CHECKBOX_KO_DEFAULTS,
            name: 'consent',
            required: false,
            defaultChecked: false,
            options: undefined,
            errorMessage: '',
            showIf: undefined,
          },
        }}
        locale="zh-hant"
        {...commonInspectorProps}
      />,
    );
    expect(checkboxHtml).toContain('value="我同意"');
    expect(checkboxHtml).not.toContain('value="동의합니다"');
  });
});
