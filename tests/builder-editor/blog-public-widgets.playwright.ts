import { expect, test, type APIRequestContext } from '@playwright/test';

const LOCALE = 'ko';
const APP_ID = 'native-blog';

const baseStyle = {
  backgroundColor: 'transparent',
  borderColor: '#cbd5e1',
  borderStyle: 'solid',
  borderWidth: 0,
  borderRadius: 0,
  shadowX: 0,
  shadowY: 0,
  shadowBlur: 0,
  shadowSpread: 0,
  shadowColor: 'rgba(15, 23, 42, 0.16)',
  opacity: 100,
};

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'blog-public-widgets';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function installBlogApp(request: APIRequestContext, token: string) {
  const response = await request.post(`/api/builder/apps/installations?locale=${LOCALE}`, {
    headers: mutationHeaders(`f44-install-${token}`),
    data: { appId: APP_ID },
  });
  expect([200, 201]).toContain(response.status());
}

async function uninstallBlogApp(request: APIRequestContext, token: string) {
  await request.delete(`/api/builder/apps/installations/${APP_ID}?locale=${LOCALE}`, {
    headers: mutationHeaders(`f44-uninstall-${token}`),
    failOnStatusCode: false,
  });
}

async function createPublishedColumn(request: APIRequestContext, token: string): Promise<string> {
  const slug = `f44-blog-widget-${token}`;
  const title = `F44 공개 블로그 위젯 ${token}`;
  const body = `F44 blog search body ${token} 대만 노동법 공개 위젯 검증`;
  const createResponse = await request.post(`/api/builder/columns?locale=${LOCALE}`, {
    headers: mutationHeaders(`f44-column-create-${token}`),
    data: {
      locale: LOCALE,
      slug,
      title,
      summary: `F44 공개 블로그 요약 ${token}`,
      bodyMarkdown: body,
      bodyHtml: `<p>${body}</p>`,
      frontmatter: {
        category: 'legal',
        blogCategory: 'labor-law',
        tags: ['f44-public-widget', token],
        author: {
          name: `F44 Blog Author ${token}`,
          title: 'Blog editor',
          bio: `F44 author bio ${token}`,
        },
        featured: true,
      },
    },
  });
  expect(createResponse.status()).toBe(201);

  const publishResponse = await request.post(`/api/builder/columns/${slug}/publish?locale=${LOCALE}&skipEmbeddings=1`, {
    headers: mutationHeaders(`f44-column-publish-${token}`),
  });
  expect(publishResponse.status()).toBe(200);
  return slug;
}

async function deleteColumn(request: APIRequestContext, slug: string, token: string) {
  await request.delete(`/api/builder/columns/${slug}?locale=${LOCALE}&includePublished=1`, {
    headers: mutationHeaders(`f44-column-delete-${token}`),
    failOnStatusCode: false,
  });
}

function widgetNode(
  id: string,
  kind: string,
  y: number,
  height: number,
  appWidget: { appId: string; widgetId: string },
  content: Record<string, unknown>,
) {
  return {
    id,
    kind,
    rect: { x: 80, y, width: 1120, height },
    style: baseStyle,
    zIndex: 1,
    rotation: 0,
    locked: false,
    visible: true,
    appWidget,
    content,
  };
}

function makePublishedBlogWidgetDocument(slug: string, token: string) {
  return {
    version: 1,
    locale: LOCALE,
    updatedAt: new Date().toISOString(),
    updatedBy: `f44-blog-widgets-${token}`,
    stageWidth: 1280,
    stageHeight: 2280,
    nodes: [
      widgetNode('f44-blog-feed', 'blog-feed', 40, 520, { appId: APP_ID, widgetId: 'blog-list' }, {
        layout: 'grid',
        postsPerPage: 6,
        showExcerpt: true,
        showAuthor: true,
        showDate: true,
        showReadingTime: true,
        showCategory: true,
        showTags: false,
        showFeaturedImage: true,
        sortBy: 'newest',
        columns: 3,
        gap: 20,
      }),
      widgetNode('f44-blog-post-card', 'blog-post-card', 620, 390, { appId: APP_ID, widgetId: 'blog-post-card' }, {
        postId: slug,
        showFeaturedImage: true,
        showCategory: true,
        showAuthor: true,
        showExcerpt: true,
        showDate: true,
        showReadingTime: true,
        cardStyle: 'elevated',
        variant: 'flat',
      }),
      widgetNode('f44-blog-categories', 'blog-categories', 1060, 110, { appId: APP_ID, widgetId: 'blog-categories' }, {
        layout: 'horizontal',
        showAll: true,
        showPostCount: true,
      }),
      widgetNode('f44-blog-author', 'blog-author', 1220, 340, { appId: APP_ID, widgetId: 'blog-author' }, {
        authorName: `F44 Blog Author ${token}`,
        layout: 'card',
        showBio: true,
        showPostCount: true,
        showRecentPosts: true,
        maxPosts: 3,
      }),
      widgetNode('f44-recent-posts', 'blog-recent-posts', 1610, 330, { appId: APP_ID, widgetId: 'recent-posts' }, {
        limit: 5,
        layout: 'list',
        showExcerpt: true,
        showAuthor: true,
        showDate: true,
        showCategory: true,
      }),
      widgetNode('f44-blog-search', 'site-search', 2000, 70, { appId: APP_ID, widgetId: 'blog-search' }, {
        placeholder: '블로그 검색',
        submitLabel: '검색',
        showResultsInline: true,
        kinds: ['blog'],
        locale: '',
        maxResults: 8,
      }),
    ],
  };
}

async function createPublishedPage(request: APIRequestContext, slug: string, postSlug: string, token: string): Promise<string> {
  const createResponse = await request.post('/api/builder/site/pages', {
    headers: mutationHeaders(`f44-page-create-${token}`),
    data: {
      locale: LOCALE,
      slug,
      title: `F44 Blog Widgets ${token}`,
      document: makePublishedBlogWidgetDocument(postSlug, token),
    },
  });
  expect(createResponse.status()).toBe(200);
  const created = await createResponse.json() as { success?: boolean; pageId?: string; error?: string };
  expect(created.success, created.error).toBe(true);
  expect(created.pageId).toBeTruthy();

  const publishResponse = await request.post(`/api/builder/site/pages/${created.pageId}/publish?locale=${LOCALE}`, {
    headers: mutationHeaders(`f44-page-publish-${token}`),
  });
  expect(publishResponse.status()).toBe(200);
  const published = await publishResponse.json() as { ok?: boolean; error?: string };
  expect(published.ok, published.error).toBe(true);

  return created.pageId!;
}

test('native Blog app widgets publish list, post, category, author, recent, and search', async ({ page }) => {
  const token = Date.now().toString(36);
  const pageSlug = `f44-blog-widgets-${token}`;
  let pageId: string | null = null;
  let postSlug: string | null = null;

  await uninstallBlogApp(page.request, token);

  try {
    await installBlogApp(page.request, token);
    postSlug = await createPublishedColumn(page.request, token);
    const rebuildResponse = await page.request.post('/api/builder/search/rebuild', {
      headers: mutationHeaders(`f44-search-rebuild-${token}`),
    });
    expect(rebuildResponse.status()).toBe(200);
    pageId = await createPublishedPage(page.request, pageSlug, postSlug, token);

    await page.goto(`/${LOCALE}/${pageSlug}`, { waitUntil: 'domcontentloaded' });

    for (const nodeId of [
      'f44-blog-feed',
      'f44-blog-post-card',
      'f44-blog-categories',
      'f44-blog-author',
      'f44-recent-posts',
      'f44-blog-search',
    ]) {
      await expect(page.locator(`[data-node-id="${nodeId}"]`)).toHaveAttribute('data-builder-app-runtime-status', 'enabled');
    }

    await expect(page.locator('[data-builder-blog-feed="true"]')).toContainText(`F44 공개 블로그 위젯 ${token}`);
    await expect(page.locator('[data-builder-blog-card="true"]')).toContainText(`F44 공개 블로그 위젯 ${token}`);
    await expect(page.locator('[data-builder-blog-categories="true"] [data-builder-blog-category="labor-law"]')).toBeVisible();
    await expect(page.locator('[data-builder-blog-author="true"]')).toContainText(`F44 Blog Author ${token}`);
    await expect(page.locator('[data-builder-blog-recent-posts="true"]')).toContainText(`F44 공개 블로그 위젯 ${token}`);

    const categoryHref = await page.locator('[data-builder-blog-category="labor-law"]').getAttribute('href');
    expect(categoryHref).toBe(`/${LOCALE}/columns?category=labor-law`);
    const authorHref = await page.locator('[data-builder-blog-author="true"] a[href*="/columns?author="]').first().getAttribute('href');
    expect(authorHref).toBe(`/${LOCALE}/columns?author=${encodeURIComponent(`F44 Blog Author ${token}`)}`);

    const search = page.locator('[data-node-id="f44-blog-search"] [data-builder-site-search="true"]');
    await expect(search).toHaveAttribute('data-builder-site-search-kinds', 'blog');
    await search.locator('[data-builder-site-search-input="true"]').fill(token);
    await expect(search.locator('[data-builder-site-search-results="true"]')).toContainText(`F44 공개 블로그 위젯 ${token}`);
    await expect(search.locator('.builder-site-search-hit').first()).toHaveAttribute('href', `/${LOCALE}/columns/${postSlug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=${LOCALE}`, {
        headers: mutationHeaders(`f44-page-delete-${token}`),
        failOnStatusCode: false,
      });
    }
    if (postSlug) await deleteColumn(page.request, postSlug, token);
    await uninstallBlogApp(page.request, token);
  }
});
