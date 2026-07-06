import { readFileSync } from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type {
  BuilderContactFormCanvasNode,
  BuilderCtaBannerCanvasNode,
  BuilderCustomEmbedCanvasNode,
} from '@/lib/builder/canvas/types';
import contactFormComponent from '../contactForm';
import {
  CONTACT_FORM_LEGACY_DEFAULTS,
  getConversionWidgetsCopy,
  localizedContactFormSubmitLabel,
} from '../conversion-widgets-copy';
import ctaBannerComponent from '../ctaBanner';
import customEmbedComponent from '../customEmbed';

const root = process.cwd();

function read(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

describe('conversion widget localization', () => {
  it('returns localized helper copy in zh-hant', () => {
    const copy = getConversionWidgetsCopy('zh-hant');

    expect(copy.contactForm).toMatchObject({
      defaultSubmitLabel: '送出',
      submittingLabel: '送出中...',
      successMessage: '謝謝！您的訊息已送出。',
      errorMessage: '送出失敗，請再試一次。',
    });
    expect(copy.contactForm.fieldsLabel(3)).toBe('欄位 (3)');
    expect(copy.contactForm.fieldLabels).toMatchObject({
      name: '姓名',
      message: '訊息',
      preference: '偏好',
    });
    expect(copy.ctaBanner.inspector).toMatchObject({
      title: '標題',
      buttonText: '按鈕文字',
      buttonLinkPlaceholder: '/zh-hant/contact',
      backgroundColor: '背景色',
    });
    expect(copy.customEmbed).toMatchObject({
      empty: '自訂嵌入',
      iframeTitle: '自訂嵌入',
    });
    expect(copy.customEmbed.inspector.htmlPlaceholder).toBe('<iframe src="..." />');
    expect(localizedContactFormSubmitLabel(CONTACT_FORM_LEGACY_DEFAULTS.submitLabel, copy.contactForm.defaultSubmitLabel)).toBe('送出');
  });

  it('seeds contact form default content from legacy defaults', () => {
    expect(contactFormComponent.defaultContent).toMatchObject({
      fields: CONTACT_FORM_LEGACY_DEFAULTS.fields,
      submitLabel: CONTACT_FORM_LEGACY_DEFAULTS.submitLabel,
      action: CONTACT_FORM_LEGACY_DEFAULTS.action,
    });
  });

  it('renders localized contact form runtime and inspector chrome in zh-hant', () => {
    const ContactRender = contactFormComponent.Render as React.ComponentType<{
      node: BuilderContactFormCanvasNode;
      mode?: 'edit' | 'preview' | 'published';
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const ContactInspector = contactFormComponent.Inspector as React.ComponentType<{
      node: BuilderContactFormCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;

    const contactNode = {
      id: 'contact-1',
      kind: 'contactForm',
      content: {
        fields: ['name', 'email', 'message', 'preference'],
        submitLabel: CONTACT_FORM_LEGACY_DEFAULTS.submitLabel,
        action: CONTACT_FORM_LEGACY_DEFAULTS.action,
      },
    } as unknown as BuilderContactFormCanvasNode;

    const runtimeHtml = renderToStaticMarkup(
      <ContactRender node={contactNode} mode="preview" locale="zh-hant" />,
    );
    expect(runtimeHtml).toContain('姓名');
    expect(runtimeHtml).toContain('電子郵件');
    expect(runtimeHtml).toContain('訊息');
    expect(runtimeHtml).toContain('偏好');
    expect(runtimeHtml).toContain('送出');
    expect(runtimeHtml).not.toContain('Submit');

    const inspectorHtml = renderToStaticMarkup(
      <ContactInspector node={contactNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(inspectorHtml).toContain('欄位 (4)');
    expect(inspectorHtml).toContain('公司');
    expect(inspectorHtml).toContain('送出按鈕標籤');
    expect(inspectorHtml).toContain('value="送出"');
    expect(inspectorHtml).not.toContain('value="Submit"');
    expect(inspectorHtml).toContain('動作 URL');
    expect(inspectorHtml).not.toContain('Action URL');
    expect(inspectorHtml).toContain(`placeholder="${CONTACT_FORM_LEGACY_DEFAULTS.action}"`);
    expect(inspectorHtml).toContain('data-builder-contact-form-inspector="true"');
    expect(inspectorHtml).toContain('aria-pressed="true"');
  });

  it('keeps the contact form inspector on CSS modules without inline style chrome', () => {
    const inspector = read('src/lib/builder/components/contactForm/Inspector.tsx');
    const css = read('src/lib/builder/components/contactForm/ContactFormInspector.module.css');

    expect(inspector).toContain("import styles from './ContactFormInspector.module.css';");
    expect(inspector).toContain('data-builder-contact-form-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.fieldChipList}',
      "className={`${styles.fieldChip} ${selected ? styles.fieldChipActive : ''}`}",
      'className={styles.control}',
    ]) {
      expect(inspector).toContain(classUsage);
    }
    for (const removedInlineStyle of [
      'React.CSSProperties',
      'const fieldStyle',
      'const inputStyle',
      'const labelStyle',
      'style=',
    ]) {
      expect(inspector).not.toContain(removedInlineStyle);
    }
    expect(css).toContain('.root {');
    expect(css).toContain('.fieldChipActive {');
    expect(css).toContain('.control:focus-visible');
  });

  it('renders localized CTA and custom embed chrome in zh-hant', () => {
    const CtaRender = ctaBannerComponent.Render as React.ComponentType<{
      node: BuilderCtaBannerCanvasNode;
      mode?: 'edit' | 'preview' | 'published';
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const CtaInspector = ctaBannerComponent.Inspector as React.ComponentType<{
      node: BuilderCtaBannerCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const EmbedRender = customEmbedComponent.Render as React.ComponentType<{
      node: BuilderCustomEmbedCanvasNode;
      mode?: 'edit' | 'preview' | 'published';
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const EmbedInspector = customEmbedComponent.Inspector as React.ComponentType<{
      node: BuilderCustomEmbedCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;

    const emptyCtaNode = {
      id: 'cta-1',
      kind: 'ctaBanner',
      content: {
        title: '',
        description: '',
        buttonLabel: '',
        buttonHref: '#',
        backgroundColor: '#0b3b2e',
      },
    } as unknown as BuilderCtaBannerCanvasNode;
    const embedNode = {
      id: 'embed-1',
      kind: 'customEmbed',
      content: {
        html: '<strong>Hi</strong>',
      },
    } as unknown as BuilderCustomEmbedCanvasNode;
    const emptyEmbedNode = {
      ...embedNode,
      content: { html: '' },
    } as BuilderCustomEmbedCanvasNode;

    const emptyCtaHtml = renderToStaticMarkup(
      <CtaRender node={emptyCtaNode} mode="preview" locale="zh-hant" />,
    );
    expect(emptyCtaHtml).toContain('CTA 橫幅');

    const ctaInspectorHtml = renderToStaticMarkup(
      <CtaInspector node={emptyCtaNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(ctaInspectorHtml).toContain('標題');
    expect(ctaInspectorHtml).toContain('按鈕連結');
    expect(ctaInspectorHtml).toContain('placeholder="/zh-hant/contact"');
    expect(ctaInspectorHtml).not.toContain('placeholder="/ko/contact"');
    expect(ctaInspectorHtml).toContain('#0b3b2e 或 linear-gradient(...)');

    const embedHtml = renderToStaticMarkup(
      <EmbedRender node={embedNode} mode="preview" locale="zh-hant" />,
    );
    expect(embedHtml).toContain('title="自訂嵌入"');

    const emptyEmbedHtml = renderToStaticMarkup(
      <EmbedRender node={emptyEmbedNode} mode="preview" locale="zh-hant" />,
    );
    expect(emptyEmbedHtml).toContain('自訂嵌入');

    const embedInspectorHtml = renderToStaticMarkup(
      <EmbedInspector node={embedNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(embedInspectorHtml).toContain('HTML（沙盒）');
    expect(embedInspectorHtml).toContain('placeholder="&lt;iframe src=&quot;...&quot; /&gt;"');
    expect(embedInspectorHtml).toContain('會以 iframe sandbox 方式呈現。');
  });

  it('keeps CTA and custom embed inspectors on CSS modules', () => {
    const ctaInspector = read('src/lib/builder/components/ctaBanner/Inspector.tsx');
    const ctaCss = read('src/lib/builder/components/ctaBanner/CtaBannerInspector.module.css');
    const embedInspector = read('src/lib/builder/components/customEmbed/Inspector.tsx');
    const embedCss = read('src/lib/builder/components/customEmbed/CustomEmbedInspector.module.css');

    expect(ctaInspector).toContain("import styles from './CtaBannerInspector.module.css';");
    expect(ctaInspector).toContain('data-builder-cta-banner-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={`${styles.control} ${styles.textarea}`}',
      'className={styles.backgroundPreview}',
    ]) {
      expect(ctaInspector).toContain(classUsage);
    }
    for (const removedInlineStyle of [
      'React.CSSProperties',
      'const fieldStyle',
      'const inputStyle',
      'const labelStyle',
      'style={{ display:',
      'style={inputStyle}',
      'style={{ ...inputStyle',
    ]) {
      expect(ctaInspector).not.toContain(removedInlineStyle);
    }
    expect(ctaInspector).toContain('style={{ background: ctaNode.content.backgroundColor }}');
    expect(ctaCss).toContain('.backgroundPreview {');
    expect(ctaCss).toContain('.control:focus-visible');

    expect(embedInspector).toContain("import styles from './CustomEmbedInspector.module.css';");
    expect(embedInspector).toContain('data-builder-custom-embed-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.codeInput}',
      'className={styles.helper}',
    ]) {
      expect(embedInspector).toContain(classUsage);
    }
    for (const removedInlineStyle of [
      'React.CSSProperties',
      'const fieldStyle',
      'const labelStyle',
      'style=',
    ]) {
      expect(embedInspector).not.toContain(removedInlineStyle);
    }
    expect(embedCss).toContain('.codeInput:focus-visible');
    expect(embedCss).toContain('.helper {');
  });
});
