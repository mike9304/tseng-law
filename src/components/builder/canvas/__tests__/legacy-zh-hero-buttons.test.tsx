import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { BuilderButtonCanvasNode } from '@/lib/builder/canvas/types';
import ButtonElement from '../elements/ButtonElement';

const SEARCH = {"id":"home-hero-search-button","kind":"button","parentId":"home-hero-search-bar","rect":{"x":700,"y":0,"width":60,"height":62},"style":{"backgroundColor":"transparent","borderColor":"#cbd5e1","borderStyle":"solid","borderWidth":0,"borderRadius":0,"shadowX":0,"shadowY":0,"shadowBlur":0,"shadowSpread":0,"shadowColor":"rgba(15, 23, 42, 0.16)","opacity":100},"zIndex":163,"rotation":0,"locked":false,"visible":true,"content":{"label":"⌕","href":"/zh-hant/search","style":"ghost","className":"hero-search-btn","as":"button","buttonType":"submit","ariaLabel":"搜尋"}} as BuilderButtonCanvasNode;
const SCROLL = {"id":"home-hero-scroll-arrow","kind":"button","parentId":"home-hero-root","rect":{"x":1216,"y":700,"width":48,"height":48},"style":{"backgroundColor":"transparent","borderColor":"#cbd5e1","borderStyle":"solid","borderWidth":0,"borderRadius":0,"shadowX":0,"shadowY":0,"shadowBlur":0,"shadowSpread":0,"shadowColor":"rgba(15, 23, 42, 0.16)","opacity":100},"zIndex":330,"rotation":0,"locked":false,"visible":true,"responsive":{"tablet":{"rect":{"x":32,"y":338,"width":704,"height":48}},"mobile":{"rect":{"x":20,"y":345,"width":335,"height":48}}},"content":{"label":"⌄","href":"#insights","style":"ghost","className":"hero-scroll-arrow","as":"a"}} as BuilderButtonCanvasNode;

describe('saved ZH home button presentation', () => {
  it('retains a submit button and accessible search name with the shared SVG', () => {
    const html = renderToStaticMarkup(<ButtonElement node={SEARCH} mode="published" locale="zh-hant" />);
    expect(html).toContain('type="submit"');
    expect(html).toContain('aria-label="搜尋"');
    expect(html).toContain('<circle cx="11" cy="11" r="8"');
    expect(html).not.toContain('⌕');
  });
  it('retains the original scroll destination and provides a localized name', () => {
    const html = renderToStaticMarkup(<ButtonElement node={SCROLL} mode="published" locale="zh-hant" />);
    expect(html).toContain('href="#insights"');
    expect(html).toContain('aria-label="向下滾動"');
    expect(html).toContain('pointer-events:auto');
    expect(html).toContain('<polyline points="6,10 14,18 22,10"');
  });
  it('shows the same icon in the editor while keeping navigation disabled', () => {
    const html = renderToStaticMarkup(<ButtonElement node={SCROLL} mode="edit" locale="zh-hant" />);
    expect(html).toContain('<svg');
    expect(html).toContain('pointer-events:none');
    expect(html).not.toContain('href=');
  });
  it('leaves custom glyph labels, destinations and other locales alone', () => {
    const custom = { ...SEARCH, content: { ...SEARCH.content, label: '作者搜尋' } };
    expect(renderToStaticMarkup(<ButtonElement node={custom} mode="published" locale="zh-hant" />)).toContain('作者搜尋');
    expect(renderToStaticMarkup(<ButtonElement node={custom} mode="published" locale="zh-hant" />)).not.toContain('<svg');
    expect(renderToStaticMarkup(<ButtonElement node={SEARCH} mode="published" locale="en" />)).toContain('⌕');
    const customScroll = { ...SCROLL, content: { ...SCROLL.content, href: '#author' } };
    expect(renderToStaticMarkup(<ButtonElement node={customScroll} mode="published" locale="zh-hant" />)).toContain('href="#author"');
    expect(renderToStaticMarkup(<ButtonElement node={customScroll} mode="published" locale="zh-hant" />)).not.toContain('<svg');
  });
});
