import { describe, expect, it, vi } from 'vitest';
import type { MouseEvent, ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import StaticLink, { formatStaticHref } from '../StaticLink';

type AnchorProps = { href: string; onClick: (event: MouseEvent<HTMLAnchorElement>) => void };

function renderAnchor(props: Parameters<typeof StaticLink>[0]): ReactElement<AnchorProps> {
  const render = (StaticLink as unknown as { render: (p: unknown, ref: unknown) => ReactElement<AnchorProps> }).render;
  return render(props, null);
}

function clickEvent(overrides: Partial<MouseEvent<HTMLAnchorElement>> = {}) {
  let prevented = false;
  const event = {
    button: 0,
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    get defaultPrevented() {
      return prevented;
    },
    preventDefault: () => {
      prevented = true;
    },
    ...overrides,
  } as unknown as MouseEvent<HTMLAnchorElement>;
  return { event, prevented: () => prevented };
}

describe('StaticLink (static-site next/link replacement)', () => {
  it('renders a plain anchor without router-only props', () => {
    const html = renderToStaticMarkup(
      <StaticLink href="/ko/about" className="nav" prefetch={false} scroll={false} replace>
        About
      </StaticLink>,
    );
    expect(html).toBe('<a href="/ko/about" class="nav">About</a>');
  });

  it('formats URL objects like next/link', () => {
    expect(formatStaticHref({ pathname: '/ko/search', query: { q: '회사 설립', tab: ['blog', 'faq'] }, hash: 'top' }))
      .toBe('/ko/search?q=%ED%9A%8C%EC%82%AC+%EC%84%A4%EB%A6%BD&tab=blog&tab=faq#top');
    expect(formatStaticHref({ pathname: '/ko', search: '?x=1' })).toBe('/ko?x=1');
  });

  it('runs onNavigate for a plain click and lets it cancel navigation', () => {
    const onNavigate = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    const anchor = renderAnchor({ href: '/ko', onNavigate });
    const { event, prevented } = clickEvent();
    anchor.props.onClick(event);
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(prevented()).toBe(true);
  });

  it('skips onNavigate for modified clicks and new-tab targets', () => {
    const onNavigate = vi.fn();
    renderAnchor({ href: '/ko', onNavigate }).props.onClick(clickEvent({ metaKey: true }).event);
    renderAnchor({ href: '/ko', onNavigate, target: '_blank' }).props.onClick(clickEvent().event);
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('calls the caller onClick first and respects its preventDefault', () => {
    const onNavigate = vi.fn();
    const onClick = vi.fn((event: MouseEvent<HTMLAnchorElement>) => event.preventDefault());
    renderAnchor({ href: '/ko', onClick, onNavigate }).props.onClick(clickEvent().event);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onNavigate).not.toHaveBeenCalled();
  });
});
