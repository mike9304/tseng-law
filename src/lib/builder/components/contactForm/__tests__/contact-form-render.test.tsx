import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { BuilderContactFormCanvasNode } from '@/lib/builder/canvas/types';
import { CONTACT_FORM_LEGACY_DEFAULTS } from '../../conversion-widgets-copy';
import contactFormComponent from '../index';
import ContactFormInspector from '../Inspector';

const Render = contactFormComponent.Render as React.ComponentType<{
  node: BuilderContactFormCanvasNode;
  locale?: string;
  mode?: 'edit' | 'preview' | 'published';
}>;

function node(content: Partial<BuilderContactFormCanvasNode['content']> = {}): BuilderContactFormCanvasNode {
  return {
    id: 'contact-1',
    kind: 'contactForm',
    content: {
      fields: [...CONTACT_FORM_LEGACY_DEFAULTS.fields],
      submitLabel: CONTACT_FORM_LEGACY_DEFAULTS.submitLabel,
      action: CONTACT_FORM_LEGACY_DEFAULTS.action,
      ...content,
    },
  } as unknown as BuilderContactFormCanvasNode;
}

describe('contact form render contracts', () => {
  it('shows an unchecked consent control only for the default consultation action', () => {
    const defaultHtml = renderToStaticMarkup(<Render node={node()} locale="ko" mode="published" />);
    expect(defaultHtml).toContain('name="consent"');
    expect(defaultHtml).not.toContain('checked');
    expect(defaultHtml).toContain('name="name"');
    expect(defaultHtml).toContain('required');

    const customHtml = renderToStaticMarkup(
      <Render node={node({ action: 'https://example.test/hook' })} locale="ko" mode="published" />,
    );
    expect(customHtml).not.toContain('name="consent"');
    expect(customHtml).not.toContain('required=""');
    expect(customHtml).not.toContain(' required');
  });

  it('shows unsupported guidance instead of a form when runtime locale is ja', () => {
    const html = renderToStaticMarkup(<Render node={node()} locale="ja" mode="published" />);
    expect(html).not.toContain('<form');
    expect(html).not.toContain('name="consent"');
    expect(html).toContain('wei@hoveringlaw.com.tw');
  });

  it('explains missing required fields without hiding a healthy default form', () => {
    const healthy = renderToStaticMarkup(<Render node={node()} locale="ko" />);
    expect(healthy).toContain('<form');

    const broken = renderToStaticMarkup(<Render node={node({ fields: ['phone'] })} locale="ko" />);
    expect(broken).not.toContain('<form');
    expect(broken).toContain('data-contact-form-config-notice="true"');
  });

  it('shows inspector notice for default action missing required fields but still allows editing', () => {
    const html = renderToStaticMarkup(
      <ContactFormInspector
        node={node({ fields: ['phone'] })}
        locale="ko"
        onUpdate={() => undefined}
      />,
    );
    expect(html).toContain('data-builder-contact-form-inspector="true"');
    expect(html).toContain('data-contact-form-config-notice="true"');
    expect(html).toContain('value="/api/consultation/submit"');
  });
});
