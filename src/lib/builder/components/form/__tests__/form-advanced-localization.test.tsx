import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type {
  BuilderFormCanvasNode,
  BuilderFormPaymentCanvasNode,
  BuilderFormSignatureCanvasNode,
} from '@/lib/builder/canvas/types';
import FormElement from '../Element';
import { FORM_PAYMENT_KO_DEFAULTS, FORM_SIGNATURE_KO_DEFAULTS, getFormControlsCopy } from '../form-controls-copy';
import formPaymentComponent from '../../formPayment';
import formSignatureComponent from '../../formSignature';

const componentRoot = join(process.cwd(), 'src/lib/builder/components');

describe('form advanced widget localization', () => {
  it('returns localized runtime and advanced-widget helper copy in zh-hant', () => {
    const copy = getFormControlsCopy('zh-hant');

    expect(copy.formRuntime).toMatchObject({
      previousLabel: '上一步',
      nextLabel: '下一步',
      emptyBadgeLabel: '表單',
      captchaMissingError: '已啟用 Captcha，但尚未設定網站金鑰。',
      requiredError: '此欄位為必填。',
      fileUploadFailedError: '檔案上傳失敗。',
    });
    expect(copy.formRuntime.tooShortError(3)).toBe('請至少輸入 3 個字元。');
    expect(copy.formRuntime.fileTooLargeError(8)).toBe('檔案大小不可超過 8MB。');
    expect(copy.paymentWidget.inspector).toMatchObject({
      providerLabel: '供應商',
      amountLabel: '金額（最小單位）',
      manualProviderLabel: '匯款資訊（手動）',
    });
    expect(copy.paymentWidget.defaults).toMatchObject({
      label: '付款',
      description: '諮詢費',
    });
    expect(copy.signatureWidget.inspector).toMatchObject({
      strokeColorLabel: '筆跡顏色',
      showClearButtonLabel: '顯示清除按鈕',
    });
    expect(copy.signatureWidget.defaults).toMatchObject({
      label: '簽名',
      helpText: '請在框內簽名',
    });
  });

  it('renders localized form runtime chrome in zh-hant', () => {
    const formNode = {
      id: 'form-1',
      kind: 'form',
      content: {
        name: 'contact-form',
        submitTo: 'storage',
        successMessage: '謝謝',
        captcha: 'hcaptcha',
        steps: [
          { id: 'step-1', title: '第一步', fieldNodeIds: ['field-1'] },
          { id: 'step-2', title: '第二步', fieldNodeIds: ['field-2'] },
        ],
      },
    } as unknown as BuilderFormCanvasNode;

    const editHtml = renderToStaticMarkup(
      <FormElement node={formNode} mode="edit" locale="zh-hant" />,
    );

    expect(editHtml).toContain('上一步');
    expect(editHtml).toContain('下一步');
    expect(editHtml).toContain('表單 · contact-form');

    const publishedHtml = renderToStaticMarkup(
      <FormElement node={formNode} mode="published" locale="zh-hant" />,
    );

    expect(publishedHtml).toContain('hcaptcha 驗證碼尚未設定');
  });

  it('renders localized payment and signature widget chrome in zh-hant', () => {
    const PaymentRender = formPaymentComponent.Render as React.ComponentType<{
      node: BuilderFormPaymentCanvasNode;
      mode?: 'edit' | 'preview' | 'published';
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const PaymentInspector = formPaymentComponent.Inspector as React.ComponentType<{
      node: BuilderFormPaymentCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const SignatureRender = formSignatureComponent.Render as React.ComponentType<{
      node: BuilderFormSignatureCanvasNode;
      mode?: 'edit' | 'preview' | 'published';
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const SignatureInspector = formSignatureComponent.Inspector as React.ComponentType<{
      node: BuilderFormSignatureCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;

    const paymentNode = {
      id: 'payment-1',
      kind: 'form-payment',
      content: {
        name: 'payment',
        label: '付款',
        provider: 'manual',
        amountCents: 120000,
        currency: 'TWD',
        description: '諮詢費',
        successUrl: '',
        cancelUrl: '',
        showSecurityNote: true,
      },
    } as unknown as BuilderFormPaymentCanvasNode;
    const signatureNode = {
      id: 'signature-1',
      kind: 'form-signature',
      content: {
        name: 'signature',
        label: '簽名',
        required: true,
        helpText: '請在框內簽名',
        strokeColor: '#0f172a',
        strokeWidth: 2,
        showClearButton: true,
      },
    } as unknown as BuilderFormSignatureCanvasNode;

    const paymentHtml = renderToStaticMarkup(
      <PaymentRender node={paymentNode} mode="preview" locale="zh-hant" />,
    );
    expect(paymentHtml).toContain('查看匯款資訊');
    expect(paymentHtml).toContain('付款會在外部付款服務 Stripe 中安全處理。');

    const paymentInspectorHtml = renderToStaticMarkup(
      <PaymentInspector node={paymentNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(paymentInspectorHtml).toContain('data-builder-form-advanced-inspector="payment"');
    expect(paymentInspectorHtml).toContain('供應商');
    expect(paymentInspectorHtml).toContain('金額（最小單位）');
    expect(paymentInspectorHtml).toContain('匯款資訊（手動）');
    expect(paymentInspectorHtml).toContain('TWD (NT$)');

    const signatureHtml = renderToStaticMarkup(
      <SignatureRender node={signatureNode} mode="preview" locale="zh-hant" />,
    );
    expect(signatureHtml).toContain('清除');

    const signatureInspectorHtml = renderToStaticMarkup(
      <SignatureInspector node={signatureNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(signatureInspectorHtml).toContain('data-builder-form-advanced-inspector="signature"');
    expect(signatureInspectorHtml).toContain('筆跡顏色');
    expect(signatureInspectorHtml).toContain('筆跡粗細');
    expect(signatureInspectorHtml).toContain('顯示清除按鈕');
  });

  it('keeps payment and signature inspectors on the shared CSS module chrome', () => {
    const paymentSource = readFileSync(join(componentRoot, 'formPayment/index.tsx'), 'utf8');
    const signatureSource = readFileSync(join(componentRoot, 'formSignature/index.tsx'), 'utf8');

    for (const source of [paymentSource, signatureSource]) {
      expect(source).toContain("import inspectorStyles from '../form/FormControlInspector.module.css';");
      expect(source).toContain('className={inspectorStyles.root}');
      expect(source).not.toContain("style={{ display: 'flex', alignItems: 'center', gap: 6 }}");
    }

    expect(paymentSource).toContain('data-builder-form-advanced-inspector="payment"');
    expect(signatureSource).toContain('data-builder-form-advanced-inspector="signature"');
  });

  it('localizes legacy default payment label and description in zh-hant without changing custom content', () => {
    const PaymentRender = formPaymentComponent.Render as React.ComponentType<{
      node: BuilderFormPaymentCanvasNode;
      mode?: 'edit' | 'preview' | 'published';
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const PaymentInspector = formPaymentComponent.Inspector as React.ComponentType<{
      node: BuilderFormPaymentCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const legacyNode = {
      id: 'payment-legacy',
      kind: 'form-payment',
      content: {
        name: 'payment',
        label: FORM_PAYMENT_KO_DEFAULTS.label,
        provider: 'stripe-checkout',
        amountCents: 100000,
        currency: 'KRW',
        description: FORM_PAYMENT_KO_DEFAULTS.description,
        successUrl: '',
        cancelUrl: '',
        showSecurityNote: true,
      },
    } as unknown as BuilderFormPaymentCanvasNode;
    const customNode = {
      ...legacyNode,
      content: {
        ...legacyNode.content,
        label: 'Custom payment',
        description: 'Custom description',
      },
    } as BuilderFormPaymentCanvasNode;

    const legacyHtml = renderToStaticMarkup(
      <PaymentRender node={legacyNode} mode="preview" locale="zh-hant" />,
    );
    expect(legacyHtml).toContain('<legend>付款</legend>');
    expect(legacyHtml).toContain('諮詢費');
    expect(legacyHtml).not.toContain('결제');
    expect(legacyHtml).not.toContain('상담 비용');

    const legacyInspectorHtml = renderToStaticMarkup(
      <PaymentInspector node={legacyNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(legacyInspectorHtml).toContain('value="付款"');
    expect(legacyInspectorHtml).toContain('諮詢費');
    expect(legacyInspectorHtml).not.toContain('value="결제"');

    const customHtml = renderToStaticMarkup(
      <PaymentRender node={customNode} mode="preview" locale="zh-hant" />,
    );
    expect(customHtml).toContain('Custom payment');
    expect(customHtml).toContain('Custom description');
    expect(customHtml).not.toContain('<legend>付款</legend>');
  });

  it('localizes legacy default signature label and help text in zh-hant without changing custom content', () => {
    const SignatureRender = formSignatureComponent.Render as React.ComponentType<{
      node: BuilderFormSignatureCanvasNode;
      mode?: 'edit' | 'preview' | 'published';
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const SignatureInspector = formSignatureComponent.Inspector as React.ComponentType<{
      node: BuilderFormSignatureCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const legacyNode = {
      id: 'signature-legacy',
      kind: 'form-signature',
      content: {
        name: 'signature',
        label: FORM_SIGNATURE_KO_DEFAULTS.label,
        required: true,
        helpText: FORM_SIGNATURE_KO_DEFAULTS.helpText,
        strokeColor: '#0f172a',
        strokeWidth: 2,
        showClearButton: true,
      },
    } as unknown as BuilderFormSignatureCanvasNode;
    const customNode = {
      ...legacyNode,
      content: {
        ...legacyNode.content,
        label: 'Custom signature',
        helpText: 'Custom help text',
      },
    } as BuilderFormSignatureCanvasNode;

    const legacyHtml = renderToStaticMarkup(
      <SignatureRender node={legacyNode} mode="preview" locale="zh-hant" />,
    );
    expect(legacyHtml).toContain('<legend>簽名 *</legend>');
    expect(legacyHtml).toContain('請在框內簽名');
    expect(legacyHtml).not.toContain('박스 안에 서명해 주세요');

    const legacyInspectorHtml = renderToStaticMarkup(
      <SignatureInspector node={legacyNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(legacyInspectorHtml).toContain('value="簽名"');
    expect(legacyInspectorHtml).toContain('請在框內簽名');
    expect(legacyInspectorHtml).not.toContain('value="서명"');

    const customHtml = renderToStaticMarkup(
      <SignatureRender node={customNode} mode="preview" locale="zh-hant" />,
    );
    expect(customHtml).toContain('Custom signature');
    expect(customHtml).toContain('Custom help text');
    expect(customHtml).not.toContain('<legend>簽名 *</legend>');
  });
});
