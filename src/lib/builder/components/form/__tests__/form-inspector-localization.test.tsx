import { readFileSync } from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import formInspector from '../Inspector';
import formInputInspector from '../../formInput/Inspector';
import formInputElement from '../../formInput/Element';
import formSelectInspector from '../../formSelect/Inspector';
import formSelectElement from '../../formSelect/Element';
import formTextareaInspector from '../../formTextarea/Inspector';
import formTextareaElement from '../../formTextarea/Element';
import formSubmitInspector from '../../formSubmit/Inspector';
import formSubmitElement from '../../formSubmit/Element';
import formDateElement from '../../formDate/Element';
import formFileElement from '../../formFile/Element';
import {
  FORM_DATE_KO_DEFAULTS,
  FORM_FILE_KO_DEFAULTS,
  FORM_KO_DEFAULTS,
  FORM_INPUT_KO_DEFAULTS,
  FORM_SELECT_KO_DEFAULTS,
  FORM_SUBMIT_KO_DEFAULTS,
  FORM_TEXTAREA_KO_DEFAULTS,
  getFormControlsCopy,
} from '../form-controls-copy';

const root = process.cwd();

function read(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

describe('form inspector localization', () => {
  it('returns localized helper copy in zh-hant', () => {
    const copy = getFormControlsCopy('zh-hant');
    expect(copy.formInspector).toMatchObject({
      formNameLabel: '表單名稱（識別碼）',
      formNamePlaceholder: 'contact-form',
      submitToLabel: '提交到',
      targetEmailPlaceholder: 'contact@example.com',
      webhookUrlPlaceholder: 'https://example.com/webhook',
      redirectUrlPlaceholder: '/thank-you',
      stepsJsonPlaceholder: '[{"id":"step-1","title":"步驟 1","fieldNodeIds":["form-input-abc"]}]',
      layoutModeLabel: '版面模式',
      flexSettingsLabel: '彈性設定',
      rowLabel: '橫向',
      columnLabel: '直向',
    });
    expect(copy.formDefaults).toMatchObject({
      successMessage: '謝謝。我們會盡快與您聯絡。',
      autoReplyTemplatePlaceholder: '您的詢問已收到。我們會盡快與您聯絡。',
    });
    expect(copy.fieldInspector).toMatchObject({
      fieldNameLabel: '欄位名稱',
      fieldNamePlaceholder: 'email',
      labelLabel: '標籤',
      inputLabelPlaceholder: '電子郵件',
      textareaLabelPlaceholder: '詢問內容',
      inputVariantLabel: '輸入樣式',
      rowsLabel: '列數',
      conditionalFieldPlaceholder: 'caseType',
      selectFallbackOptionLabel: '選項 1',
      conditionOptions: {
        equals: '等於',
        notEquals: '不等於',
        contains: '包含',
        isEmpty: '為空',
        isNotEmpty: '非空',
      },
    });
    expect(copy.submitInspector).toMatchObject({
      labelPlaceholder: '送出',
      loadingLabelPlaceholder: '送出中...',
    });
    expect(copy.fieldDefaults.selectOptionLabel(2)).toBe('選項 2');
  });

  it('renders localized form and field inspector labels in zh-hant', () => {
    const FormInspector = formInspector as React.ComponentType<{
      node: unknown;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const FormInputInspector = formInputInspector as React.ComponentType<{
      node: unknown;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const FormSelectInspector = formSelectInspector as React.ComponentType<{
      node: unknown;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const FormTextareaInspector = formTextareaInspector as React.ComponentType<{
      node: unknown;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const FormSubmitInspector = formSubmitInspector as React.ComponentType<{
      node: unknown;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;

    const formNode = {
      kind: 'form',
      content: {
        name: 'contact-form',
        submitTo: 'webhook',
        targetEmail: 'contact@example.com',
        webhookUrl: 'https://example.com/webhook',
        successMessage: '謝謝',
        redirectUrl: '/thanks',
        captcha: 'none',
        steps: [{ id: 'step-1', title: 'Step 1', fieldNodeIds: ['field-1'] }],
        autoReplyEnabled: true,
        autoReplyTemplate: '收到您的訊息',
        layoutMode: 'flex',
        flexConfig: { direction: 'row', gap: 12 },
        gridConfig: { columns: 2, rowGap: 8 },
      },
    } as unknown as Record<string, unknown>;

    const inputNode = {
      kind: 'form-input',
      content: {
        name: 'email',
        label: 'Email',
        type: 'number',
        variant: 'underline',
        placeholder: '請輸入電子郵件',
        defaultValue: '',
        required: true,
        minLength: 3,
        maxLength: 50,
        pattern: '',
        numericMin: undefined,
        numericMax: undefined,
        numericStep: undefined,
        allowDecimals: false,
        showIf: { fieldName: 'caseType', operator: 'equals', value: 'new' },
        errorMessage: '',
      },
    } as unknown as Record<string, unknown>;

    const selectNode = {
      kind: 'form-select',
      content: {
        name: 'caseType',
        label: '案件類型',
        variant: 'filled',
        placeholder: '請選擇',
        options: [
          { value: 'civil', label: '民事' },
          { value: 'criminal', label: '刑事' },
        ],
        defaultValue: '',
        required: true,
        multiple: false,
        showIf: undefined,
        errorMessage: '',
      },
    } as unknown as Record<string, unknown>;

    const textareaNode = {
      kind: 'form-textarea',
      content: {
        name: 'message',
        label: '訊息',
        variant: 'default',
        placeholder: '請輸入訊息',
        defaultValue: '',
        rows: 4,
        required: false,
        minLength: 10,
        maxLength: 200,
        showIf: undefined,
        errorMessage: '',
      },
    } as unknown as Record<string, unknown>;
    const submitNode = {
      kind: 'form-submit',
      content: {
        ...FORM_SUBMIT_KO_DEFAULTS,
        style: 'primary',
        fullWidth: true,
      },
    } as unknown as Record<string, unknown>;

    const formHtml = renderToStaticMarkup(
      <FormInspector node={formNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(formHtml).toContain('表單名稱（識別碼）');
    expect(formHtml).toContain('提交到');
    expect(formHtml).toContain('Webhook');
    expect(formHtml).toContain('成功訊息');
    expect(formHtml).toContain('版面模式');
    expect(formHtml).toContain('彈性設定');
    expect(formHtml).toContain('橫向');
    expect(formHtml).toContain('直向');
    expect(formHtml).toContain('data-builder-form-inspector="true"');
    expect(formHtml).toContain('placeholder="https://example.com/webhook"');
    expect(formHtml).toContain('placeholder="/thank-you"');
    expect(formHtml).toContain('placeholder="[{&quot;id&quot;:&quot;step-1&quot;,&quot;title&quot;:&quot;步驟 1&quot;,&quot;fieldNodeIds&quot;:[&quot;form-input-abc&quot;]}]"');
    expect(formHtml).not.toContain('&quot;title&quot;:&quot;Step 1&quot;');

    const inputHtml = renderToStaticMarkup(
      <FormInputInspector node={inputNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(inputHtml).toContain('data-builder-form-field-inspector="input"');
    expect(inputHtml).toContain('欄位名稱');
    expect(inputHtml).toContain('標籤');
    expect(inputHtml).toContain('輸入樣式');
    expect(inputHtml).toContain('預留文字');
    expect(inputHtml).toContain('placeholder="電子郵件"');
    expect(inputHtml).toContain('允許小數');
    expect(inputHtml).toContain('條件');
    expect(inputHtml).toContain('條件值');

    const selectHtml = renderToStaticMarkup(
      <FormSelectInspector node={selectNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(selectHtml).toContain('data-builder-form-field-inspector="select"');
    expect(selectHtml).toContain('選項（每行 value|label）');
    expect(selectHtml).toContain('可多選');
    expect(selectHtml).toContain('自訂錯誤');

    const textareaHtml = renderToStaticMarkup(
      <FormTextareaInspector node={textareaNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(textareaHtml).toContain('data-builder-form-field-inspector="textarea"');
    expect(textareaHtml).toContain('列數');
    expect(textareaHtml).toContain('預留文字');
    expect(textareaHtml).toContain('placeholder="詢問內容"');
    expect(textareaHtml).toContain('自訂錯誤');

    const submitInspectorHtml = renderToStaticMarkup(
      <FormSubmitInspector node={submitNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(submitInspectorHtml).toContain('data-builder-form-submit-inspector="true"');
    expect(submitInspectorHtml).toContain('value="送出"');
    expect(submitInspectorHtml).toContain('主要');
    expect(submitInspectorHtml).toContain('載入標籤');
    expect(submitInspectorHtml).toContain('value="送出中..."');
    expect(submitInspectorHtml).toContain('全寬');
    expect(submitInspectorHtml).not.toContain('제출');
  });

  it('keeps the root form inspector on CSS modules without inline select styles', () => {
    const inspector = read('src/lib/builder/components/form/Inspector.tsx');
    const css = read('src/lib/builder/components/form/FormInspector.module.css');

    expect(inspector).toContain("import styles from './FormInspector.module.css';");
    expect(inspector).toContain('data-builder-form-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={`${styles.control} ${styles.textarea}`}',
      'className={styles.checkboxRow}',
      'className={styles.sectionLabel}',
    ]) {
      expect(inspector).toContain(classUsage);
    }
    for (const removedInlineStyle of [
      'React.CSSProperties',
      'const sectionLabelStyle',
      'const selectStyle',
      'style=',
      'import React',
    ]) {
      expect(inspector).not.toContain(removedInlineStyle);
    }
    expect(css).toContain('.control:focus-visible');
    expect(css).toContain('.checkboxRow');
    expect(css).toContain('.sectionLabel');
  });

  it('keeps the form submit inspector on CSS modules without inline select styles', () => {
    const inspector = read('src/lib/builder/components/formSubmit/Inspector.tsx');
    const css = read('src/lib/builder/components/formSubmit/FormSubmitInspector.module.css');

    expect(inspector).toContain("import styles from './FormSubmitInspector.module.css';");
    expect(inspector).toContain('data-builder-form-submit-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={styles.checkboxField}',
      'className={styles.checkbox}',
    ]) {
      expect(inspector).toContain(classUsage);
    }
    for (const removedInlineStyle of [
      'React.CSSProperties',
      'const selectStyle',
      'style=',
      'import React',
    ]) {
      expect(inspector).not.toContain(removedInlineStyle);
    }
    expect(css).toContain('.control:focus-visible');
    expect(css).toContain('.checkboxField');
    expect(css).toContain('.checkbox:focus-visible');
  });

  it('keeps common text/select/textarea field inspectors on the shared CSS module', () => {
    const css = read('src/lib/builder/components/form/FormControlInspector.module.css');
    const fieldInspectorPaths = [
      'src/lib/builder/components/formInput/Inspector.tsx',
      'src/lib/builder/components/formSelect/Inspector.tsx',
      'src/lib/builder/components/formTextarea/Inspector.tsx',
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
    expect(css).toContain('.root label {');
    expect(css).toContain(".root label:has(input[type='checkbox'])");
    expect(css).toContain('.root select:focus-visible');
    expect(css).toContain('.root textarea');
  });

  it('localizes legacy default form success message in zh-hant without changing custom messages', () => {
    const FormInspector = formInspector as React.ComponentType<{
      node: unknown;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const legacyNode = {
      kind: 'form',
      content: {
        name: 'contact-form',
        submitTo: 'storage',
        successMessage: FORM_KO_DEFAULTS.successMessage,
        redirectUrl: '',
        captcha: 'none',
        steps: undefined,
        autoReplyEnabled: false,
        autoReplyTemplate: '',
        layoutMode: 'absolute',
        flexConfig: undefined,
        gridConfig: undefined,
      },
    };
    const customNode = {
      ...legacyNode,
      content: {
        ...legacyNode.content,
        successMessage: 'Custom thanks',
      },
    };

    const legacyHtml = renderToStaticMarkup(
      <FormInspector node={legacyNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(legacyHtml).toContain('謝謝。我們會盡快與您聯絡。');
    expect(legacyHtml).toContain('placeholder="您的詢問已收到。我們會盡快與您聯絡。"');
    expect(legacyHtml).not.toContain('감사합니다. 곧 연락드리겠습니다.');
    expect(legacyHtml).not.toContain('문의가 접수되었습니다. 곧 연락드리겠습니다.');

    const customHtml = renderToStaticMarkup(
      <FormInspector node={customNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(customHtml).toContain('Custom thanks');
    expect(customHtml).not.toContain('謝謝。我們會盡快與您聯絡。');
  });

  it('renders localized legacy default field values in zh-hant inspectors', () => {
    const FormInputInspector = formInputInspector as React.ComponentType<{
      node: unknown;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const FormSelectInspector = formSelectInspector as React.ComponentType<{
      node: unknown;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const FormTextareaInspector = formTextareaInspector as React.ComponentType<{
      node: unknown;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;

    const inputHtml = renderToStaticMarkup(
      <FormInputInspector
        node={{
          kind: 'form-input',
          content: {
            ...FORM_INPUT_KO_DEFAULTS,
            name: 'field-1',
            type: 'text',
            variant: 'default',
            placeholder: '',
            defaultValue: '',
            required: false,
            minLength: undefined,
            maxLength: undefined,
            pattern: undefined,
            errorMessage: '',
            showIf: undefined,
          },
        }}
        locale="zh-hant"
        onUpdate={() => undefined}
        disabled={false}
      />,
    );
    expect(inputHtml).toContain('value="欄位"');
    expect(inputHtml).not.toContain('value="필드"');

    const textareaHtml = renderToStaticMarkup(
      <FormTextareaInspector
        node={{
          kind: 'form-textarea',
          content: {
            ...FORM_TEXTAREA_KO_DEFAULTS,
            name: 'message',
            variant: 'default',
            placeholder: '',
            defaultValue: '',
            rows: 4,
            required: false,
            minLength: undefined,
            maxLength: undefined,
            errorMessage: '',
            showIf: undefined,
          },
        }}
        locale="zh-hant"
        onUpdate={() => undefined}
        disabled={false}
      />,
    );
    expect(textareaHtml).toContain('value="訊息"');
    expect(textareaHtml).not.toContain('value="메시지"');

    const selectHtml = renderToStaticMarkup(
      <FormSelectInspector
        node={{
          kind: 'form-select',
          content: {
            ...FORM_SELECT_KO_DEFAULTS,
            name: 'select-1',
            required: false,
            options: [
              { value: 'option-1', label: '옵션 1' },
              { value: 'option-2', label: '옵션 2' },
            ],
            defaultValue: '',
            multiple: false,
            errorMessage: '',
            showIf: undefined,
            variant: 'default',
          },
        }}
        locale="zh-hant"
        onUpdate={() => undefined}
        disabled={false}
      />,
    );
    expect(selectHtml).toContain('value="選擇"');
    expect(selectHtml).toContain('value="請選擇"');
    expect(selectHtml).toContain('option-1|選項 1');
    expect(selectHtml).not.toContain('value="선택"');
    expect(selectHtml).not.toContain('옵션 1');
  });

  it('renders localized legacy default field values in zh-hant runtime', () => {
    const InputElement = formInputElement as React.ComponentType<{
      node: unknown;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const SelectElement = formSelectElement as React.ComponentType<{
      node: unknown;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const TextareaElement = formTextareaElement as React.ComponentType<{
      node: unknown;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const SubmitElement = formSubmitElement as React.ComponentType<{
      node: unknown;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const DateElement = formDateElement as React.ComponentType<{
      node: unknown;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const FileElement = formFileElement as React.ComponentType<{
      node: unknown;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;

    const inputHtml = renderToStaticMarkup(
      <InputElement
        node={{
          id: 'field-1',
          kind: 'form-input',
          content: {
            ...FORM_INPUT_KO_DEFAULTS,
            name: 'field-1',
            placeholder: '',
            type: 'text',
            required: false,
            minLength: undefined,
            maxLength: undefined,
            pattern: undefined,
            defaultValue: '',
            errorMessage: '',
            showIf: undefined,
            variant: 'default',
          },
        }}
        locale="zh-hant"
        mode="preview"
      />,
    );
    expect(inputHtml).toContain('欄位');
    expect(inputHtml).not.toContain('필드');

    const textareaHtml = renderToStaticMarkup(
      <TextareaElement
        node={{
          id: 'textarea-1',
          kind: 'form-textarea',
          content: {
            ...FORM_TEXTAREA_KO_DEFAULTS,
            name: 'message',
            placeholder: '',
            rows: 4,
            required: false,
            minLength: undefined,
            maxLength: undefined,
            defaultValue: '',
            errorMessage: '',
            showIf: undefined,
            variant: 'default',
          },
        }}
        locale="zh-hant"
        mode="preview"
      />,
    );
    expect(textareaHtml).toContain('訊息');
    expect(textareaHtml).not.toContain('메시지');

    const selectHtml = renderToStaticMarkup(
      <SelectElement
        node={{
          id: 'select-1',
          kind: 'form-select',
          content: {
            ...FORM_SELECT_KO_DEFAULTS,
            name: 'select-1',
            required: false,
            options: [
              { value: 'option-1', label: '옵션 1' },
              { value: 'option-2', label: '옵션 2' },
            ],
            defaultValue: '',
            multiple: false,
            errorMessage: '',
            showIf: undefined,
            variant: 'default',
          },
        }}
        locale="zh-hant"
        mode="preview"
      />,
    );
    expect(selectHtml).toContain('選擇');
    expect(selectHtml).toContain('請選擇');
    expect(selectHtml).toContain('選項 1');
    expect(selectHtml).toContain('選項 2');
    expect(selectHtml).not.toContain('옵션 1');

    const submitHtml = renderToStaticMarkup(
      <SubmitElement
        node={{
          id: 'submit-1',
          kind: 'form-submit',
          content: {
            ...FORM_SUBMIT_KO_DEFAULTS,
            style: 'primary',
            fullWidth: false,
          },
        }}
        locale="zh-hant"
        mode="preview"
      />,
    );
    expect(submitHtml).toContain('data-loading-label="送出中..."');
    expect(submitHtml).toContain('送出');
    expect(submitHtml).not.toContain('제출');

    const dateHtml = renderToStaticMarkup(
      <DateElement
        node={{
          id: 'date-1',
          kind: 'form-date',
          content: {
            ...FORM_DATE_KO_DEFAULTS,
            name: 'date',
            required: false,
            type: 'date',
            min: undefined,
            max: undefined,
            defaultValue: '',
            errorMessage: '',
            showIf: undefined,
            variant: 'default',
          },
        }}
        locale="zh-hant"
        mode="preview"
      />,
    );
    expect(dateHtml).toContain('日期');
    expect(dateHtml).not.toContain('날짜');

    const fileHtml = renderToStaticMarkup(
      <FileElement
        node={{
          id: 'file-1',
          kind: 'form-file',
          content: {
            ...FORM_FILE_KO_DEFAULTS,
            name: 'attachment',
            required: false,
            accept: 'image/*,application/pdf',
            maxSizeMb: 10,
            multiple: false,
            errorMessage: '',
            showIf: undefined,
            variant: 'default',
          },
        }}
        locale="zh-hant"
        mode="preview"
      />,
    );
    expect(fileHtml).toContain('附件檔案');
    expect(fileHtml).not.toContain('첨부 파일');
  });
});
