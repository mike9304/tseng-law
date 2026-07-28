import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  createDefaultCanvasNodeStyle,
  type BuilderContainerCanvasNode,
} from '@/lib/builder/canvas/types';
import ContainerElement from '../Element';

function makeContainerNode(
  id: string,
  as: 'main' | 'section' | 'div' = 'main',
): BuilderContainerCanvasNode {
  return {
    id,
    kind: 'container',
    rect: { x: 0, y: 0, width: 1280, height: 720 },
    style: createDefaultCanvasNodeStyle(),
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      label: id,
      layoutMode: 'absolute',
      as,
      padding: 0,
      background: 'transparent',
      borderWidth: 0,
      borderStyle: 'solid',
      borderColor: '#000000',
      borderRadius: 0,
    },
  } as BuilderContainerCanvasNode;
}

describe('ContainerElement published <main> demotion (WO#5)', () => {
  it('published mode demotes as:"main" containers to <div> so the layout owns the only <main>', () => {
    const markup = renderToStaticMarkup(
      <ContainerElement node={makeContainerNode('about-page-root')} mode="published">
        <span>child</span>
      </ContainerElement>,
    );
    expect(markup).not.toContain('<main');
    // class/style hooks stay intact — CSS and parity tooling key off them
    expect(markup).toContain('class="builder-layout-absolute"');
    expect(markup).toContain('data-builder-layout-mode="absolute"');
    expect(markup.startsWith('<div')).toBe(true);
  });

  it('published mode demotes nested as:"main" containers at every depth', () => {
    const markup = renderToStaticMarkup(
      <ContainerElement node={makeContainerNode('page-root')} mode="published">
        <ContainerElement node={makeContainerNode('inner-root')} mode="published">
          <span>child</span>
        </ContainerElement>
      </ContainerElement>,
    );
    expect(markup).not.toContain('<main');
  });

  it('edit mode keeps the authored <main> tag so the editor canvas render is unchanged', () => {
    const markup = renderToStaticMarkup(
      <ContainerElement node={makeContainerNode('about-page-root')} mode="edit">
        <span>child</span>
      </ContainerElement>,
    );
    expect(markup.startsWith('<main')).toBe(true);
  });

  it('non-main tags are untouched in published mode', () => {
    const markup = renderToStaticMarkup(
      <ContainerElement node={makeContainerNode('section-root', 'section')} mode="published">
        <span>child</span>
      </ContainerElement>,
    );
    expect(markup.startsWith('<section')).toBe(true);
  });
});
