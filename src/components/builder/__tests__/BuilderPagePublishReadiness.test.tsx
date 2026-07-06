import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import BuilderPagePublishReadiness from '../BuilderPagePublishReadiness';

describe('BuilderPagePublishReadiness', () => {
  it('renders the initial publish validation summary', () => {
    const html = renderToStaticMarkup(
      React.createElement(BuilderPagePublishReadiness, {
        locale: 'ko',
        siteId: 'default',
        pageKey: 'home',
        initialResult: {
          passed: false,
          checkedAt: '2026-05-29T10:00:00.000Z',
          issues: [
            {
              code: 'invalid_override_key',
              message: 'Hero section needs a valid snapshot.',
              sectionId: 'home-hero',
              sectionKey: 'home.hero',
              sectionTitle: 'Hero',
              surfaceId: 'title',
              src: '',
            },
          ],
        },
        publishSnapshot: {
          draft: { persisted: true, revision: 7, savedAt: '2026-05-29T09:55:00.000Z' },
          published: { persisted: true, revision: 6, savedAt: '2026-05-28T09:55:00.000Z' },
        },
      }),
    );

    expect(html).toContain('게시 차단');
    expect(html).toContain('이슈 1건');
    expect(html).toContain('Hero section needs a valid snapshot.');
    expect(html).toContain('게시 검사 실행');
    expect(html).toContain('페이지 게시');
  });

  it('disables refresh checks when a page has no saved draft', () => {
    const html = renderToStaticMarkup(
      React.createElement(BuilderPagePublishReadiness, {
        locale: 'ko',
        siteId: 'default',
        pageKey: 'contact',
        initialResult: {
          passed: true,
          issues: [],
        },
        publishSnapshot: {
          draft: { persisted: false, revision: 0, savedAt: null },
          published: { persisted: false, revision: 0, savedAt: null },
        },
      }),
    );

    expect(html).toContain('저장된 초안 필요');
    expect(html).toContain('저장된 초안이 있어야 게시 검사를 다시 실행할 수 있습니다.');
    expect(html).toContain('게시 가능 여부는 저장된 초안이 있어야 확정할 수 있습니다.');
    expect(html).not.toContain('게시 검사 실행');
    expect(html).not.toContain('Publish ready');
  });
});
