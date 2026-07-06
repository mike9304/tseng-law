import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { BuilderAnchorMenuCanvasNode } from '@/lib/builder/canvas/types';
import anchorMenuComponent from '..';
import {
  addAnchorMenuItem,
  mergeAnchorMenuItemsWithSiteAnchors,
  normalizeSiteAnchors,
  parseAnchorMenuItemsText,
} from '../anchor-menu-items';
import { getUtilityAdvancedWidgetsCopy } from '../../utility-advanced-widgets-copy';

const copy = getUtilityAdvancedWidgetsCopy('en').anchorMenu;

describe('anchor menu item helpers', () => {
  it('normalizes site anchors before showing them in the inspector', () => {
    expect(normalizeSiteAnchors([' intro ', '', 'contact', 'intro', 'contact'])).toEqual(['intro', 'contact']);
  });

  it('merges page anchors without losing custom labels', () => {
    const items = [
      { label: 'Firm profile', anchorId: 'about' },
      { label: 'External note', anchorId: 'manual-anchor' },
    ];

    expect(mergeAnchorMenuItemsWithSiteAnchors(items, ['services', 'about', 'contact'], copy)).toEqual([
      { label: 'Services', anchorId: 'services' },
      { label: 'Firm profile', anchorId: 'about' },
      { label: 'Contact', anchorId: 'contact' },
      { label: 'External note', anchorId: 'manual-anchor' },
    ]);
  });

  it('adds one missing site anchor at a time', () => {
    expect(addAnchorMenuItem([{ label: 'About', anchorId: 'about' }], 'contact-us', copy)).toEqual([
      { label: 'About', anchorId: 'about' },
      { label: 'Contact Us', anchorId: 'contact-us' },
    ]);
  });

  it('keeps manual textarea parsing bounded and trimmed', () => {
    const value = Array.from({ length: 4 }, () => ' About | about \nBad line').join('\n');

    expect(parseAnchorMenuItemsText(value)).toEqual([
      { label: 'About', anchorId: 'about' },
      { label: 'About', anchorId: 'about' },
      { label: 'About', anchorId: 'about' },
      { label: 'About', anchorId: 'about' },
    ]);
  });
});

describe('anchor menu rendering', () => {
  it('renders preview links with real hash hrefs', () => {
    const Render = anchorMenuComponent.Render as React.ComponentType<{
      node: BuilderAnchorMenuCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const node = {
      id: 'anchor-menu-1',
      kind: 'anchor-menu',
      content: {
        items: [
          { label: 'Intro', anchorId: 'intro' },
          { label: 'Contact', anchorId: 'contact' },
        ],
        sticky: true,
        offsetTopPx: 80,
        activeColor: '#0f172a',
      },
    } as unknown as BuilderAnchorMenuCanvasNode;

    const html = renderToStaticMarkup(<Render node={node} locale="en" mode="preview" />);

    expect(html).toContain('href="#intro"');
    expect(html).toContain('href="#contact"');
    expect(html).not.toContain('<button');
  });
});
