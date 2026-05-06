import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

const builderAuthHeader = `Basic ${Buffer.from(
  `${process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin'}:${process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!'}`,
).toString('base64')}`;

type TestDocument = {
  version: 1;
  locale: 'ko';
  updatedAt: string;
  updatedBy: string;
  stageWidth: number;
  stageHeight: number;
  nodes: Array<Record<string, unknown>>;
};

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

function makeDocument(options: {
  token: string;
  titleText: string;
  imageAlt?: string;
  buttonHref?: string;
}): TestDocument {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `w26-w28-${options.token}`,
    stageWidth: 1280,
    stageHeight: 760,
    nodes: [
      {
        id: `root-${options.token}`,
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 760 },
        style: baseStyle,
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'W26-W28 test root',
          background: '#ffffff',
          borderColor: 'transparent',
          borderStyle: 'solid',
          borderWidth: 0,
          borderRadius: 0,
          padding: 0,
          layoutMode: 'absolute',
          as: 'main',
        },
      },
      {
        id: `title-${options.token}`,
        kind: 'text',
        parentId: `root-${options.token}`,
        rect: { x: 80, y: 72, width: 760, height: 92 },
        style: { ...baseStyle, borderRadius: 14 },
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: options.titleText,
          fontSize: 42,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.2,
          letterSpacing: 0,
          fontFamily: 'system-ui',
          verticalAlign: 'top',
          textTransform: 'none',
          as: 'h1',
        },
      },
      {
        id: `image-${options.token}`,
        kind: 'image',
        parentId: `root-${options.token}`,
        rect: { x: 80, y: 210, width: 360, height: 220 },
        style: { ...baseStyle, borderRadius: 12 },
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          src: '/images/blog/001-taiwan-company-establishment-basics/featured-01.jpg',
          alt: options.imageAlt ?? `SEO publish image ${options.token}`,
          fit: 'cover',
        },
      },
      {
        id: `button-${options.token}`,
        kind: 'button',
        parentId: `root-${options.token}`,
        rect: { x: 80, y: 476, width: 180, height: 48 },
        style: { ...baseStyle, borderRadius: 8 },
        zIndex: 3,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: '문의하기',
          href: options.buttonHref ?? '/ko/contact',
          style: 'primary',
          as: 'a',
        },
      },
    ],
  };
}

async function currentDraftRevision(request: APIRequestContext, pageId: string): Promise<number> {
  const response = await request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`);
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { draft?: { revision?: number } };
  expect(typeof payload.draft?.revision).toBe('number');
  return payload.draft!.revision!;
}

async function putDraft(
  request: APIRequestContext,
  pageId: string,
  expectedRevision: number,
  document: TestDocument,
): Promise<number> {
  const response = await request.put(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
    data: { expectedRevision, document },
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { ok?: boolean; draft?: { revision?: number }; error?: string };
  expect(payload.ok, payload.error).toBe(true);
  expect(typeof payload.draft?.revision).toBe('number');
  return payload.draft!.revision!;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function openBuilderPageFromPagesPanel(page: Page, pageTitle: string): Promise<void> {
  await page.goto('/ko/admin-builder', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
  await page.getByRole('button', { name: 'Pages', exact: true }).click();
  const pagesDrawer = page.locator('[aria-hidden="false"]').first();
  const pageButton = pagesDrawer
    .getByRole('button', { name: new RegExp(escapeRegex(pageTitle)) })
    .first();
  await expect(pageButton).toBeVisible();
  await pageButton.click();
  await expect(page.getByText(/Loaded page:/)).toBeVisible();
}

test.describe('/ko/admin-builder SEO, publish, and history end-to-end', () => {
  test('covers W26 rollback, W27 public head, and W28 publish blockers', async ({ page }) => {
    test.setTimeout(120_000);

    const token = `w26w28-${Date.now().toString(36)}`;
    const slug = `g-editor-${token}`;
    const originalTitle = `Original revision ${token}`;
    const cleanDoc = makeDocument({ token, titleText: originalTitle });
    let pageId: string | null = null;

    try {
      const createResponse = await page.request.post('/api/builder/site/pages', {
        data: {
          locale: 'ko',
          slug,
          title: `G Editor ${token}`,
          document: cleanDoc,
        },
      });
      expect(createResponse.status()).toBe(200);
      const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
      expect(created.success, created.error).toBe(true);
      expect(created.pageId).toBeTruthy();
      pageId = created.pageId!;

      const snapshotResponse = await page.request.post(`/api/builder/site/pages/${pageId}/revisions`, {
        data: { source: 'manual', document: cleanDoc },
      });
      expect(snapshotResponse.status()).toBe(200);
      const snapshot = (await snapshotResponse.json()) as { ok?: boolean; revisionId?: string };
      expect(snapshot.ok).toBe(true);
      expect(snapshot.revisionId).toBeTruthy();

      let revision = await currentDraftRevision(page.request, pageId);
      const changedDoc = makeDocument({ token, titleText: `Changed draft ${token}` });
      revision = await putDraft(page.request, pageId, revision, changedDoc);

      const rollbackResponse = await page.request.post(
        `/api/builder/site/pages/${pageId}/revisions/rollback`,
        { data: { revisionId: snapshot.revisionId } },
      );
      expect(rollbackResponse.status()).toBe(200);
      const rollback = (await rollbackResponse.json()) as { ok?: boolean; document?: TestDocument; backupRevisionId?: string };
      expect(rollback.ok).toBe(true);
      expect(rollback.backupRevisionId).toBeTruthy();
      expect(JSON.stringify(rollback.document)).toContain(originalTitle);

      revision = await currentDraftRevision(page.request, pageId);
      const badDoc = makeDocument({
        token,
        titleText: originalTitle,
        imageAlt: '',
        buttonHref: 'javascript:alert(1)',
      });
      revision = await putDraft(page.request, pageId, revision, badDoc);

      const checksResponse = await page.request.post('/api/builder/site/publish-checks', {
        data: { siteId: 'default', pageId, locale: 'ko', document: badDoc },
      });
      expect(checksResponse.status()).toBe(200);
      const checks = (await checksResponse.json()) as {
        ok?: boolean;
        suite?: {
          hasBlocker?: boolean;
          blockerCount?: number;
          warningCount?: number;
          results?: Array<{ id: string; severity: string; message: string }>;
        };
      };
      expect(checks.ok).toBe(true);
      expect(checks.suite?.hasBlocker).toBe(true);
      expect(checks.suite?.blockerCount ?? 0).toBeGreaterThan(0);
      expect(checks.suite?.warningCount ?? 0).toBeGreaterThan(0);
      expect(checks.suite?.results ?? []).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: `unsafe-link-button-${token}`, severity: 'blocker' }),
          expect.objectContaining({ id: `image-no-alt-image-${token}`, severity: 'warning' }),
        ]),
      );

      const blockedPublishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish`, {
        data: { expectedDraftRevision: revision },
        failOnStatusCode: false,
      });
      expect(blockedPublishResponse.status()).toBe(422);
      const blockedPublish = (await blockedPublishResponse.json()) as { ok?: boolean; error?: string; blockers?: unknown[] };
      expect(blockedPublish.ok).toBe(false);
      expect(blockedPublish.error).toBe('publish_blocked');
      expect(blockedPublish.blockers?.length ?? 0).toBeGreaterThan(0);

      const publishedTitle = `Published revision ${token}`;
      const publishedDoc = makeDocument({ token, titleText: publishedTitle });
      revision = await putDraft(page.request, pageId, revision, publishedDoc);

      const seoTitle = `W27 SEO title ${token}`;
      const seoDescription = `W27 SEO description ${token} proves that the saved page SEO reaches the public head.`;
      const canonical = `https://tseng-law.com/ko/${slug}`;
      const seoResponse = await page.request.patch(`/api/builder/site/pages/${pageId}/seo?locale=ko`, {
        data: {
          seo: {
            title: seoTitle,
            description: seoDescription,
            ogImage: '/images/header-skyline-ratio.webp',
            canonical,
            twitterCard: 'summary_large_image',
          },
        },
      });
      expect(seoResponse.status()).toBe(200);
      const seoPayload = (await seoResponse.json()) as { ok?: boolean; seo?: { title?: string; canonical?: string }; error?: string };
      expect(seoPayload.ok, seoPayload.error).toBe(true);
      expect(seoPayload.seo?.title).toBe(seoTitle);
      expect(seoPayload.seo?.canonical).toBe(canonical);

      const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish`, {
        data: { expectedDraftRevision: revision },
      });
      expect(publishResponse.status()).toBe(200);
      const published = (await publishResponse.json()) as {
        ok?: boolean;
        publishedRevisionId?: string;
        publishedRevision?: number;
        slug?: string;
      };
      expect(published.ok).toBe(true);
      expect(published.publishedRevisionId).toBeTruthy();
      expect(published.slug).toBe(slug);

      const publicResponse = await page.request.get(`/ko/${slug}`);
      expect(publicResponse.status()).toBe(200);
      const publicHtml = await publicResponse.text();
      expect(publicHtml).toContain(`<title>${seoTitle}</title>`);
      expect(publicHtml).toContain(`content="${seoDescription}"`);
      expect(publicHtml).toContain(`rel="canonical" href="${canonical}"`);
      expect(publicHtml).toMatch(
        /property="og:image" content="https?:\/\/[^"]+\/images\/header-skyline-ratio\.webp"/,
      );
      expect(publicHtml).toContain(publishedTitle);
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          failOnStatusCode: false,
        });
      }
    }
  });

  test('covers W26-W28 through actual editor UI clicks', async ({ page }) => {
    test.setTimeout(120_000);

    const token = `w26w28ui-${Date.now().toString(36)}`;
    const slug = `g-editor-${token}`;
    const pageTitle = `G Editor UI ${token}`;
    const originalTitle = `UI original revision ${token}`;
    const changedTitle = `UI changed draft ${token}`;
    const cleanDoc = makeDocument({ token, titleText: originalTitle });
    let pageId: string | null = null;

    try {
      const createResponse = await page.request.post('/api/builder/site/pages', {
        data: {
          locale: 'ko',
          slug,
          title: pageTitle,
          document: cleanDoc,
        },
      });
      expect(createResponse.status()).toBe(200);
      const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
      expect(created.success, created.error).toBe(true);
      pageId = created.pageId ?? null;
      expect(pageId).toBeTruthy();

      const snapshotResponse = await page.request.post(`/api/builder/site/pages/${pageId}/revisions`, {
        data: { source: 'manual', document: cleanDoc },
      });
      expect(snapshotResponse.status()).toBe(200);
      const snapshot = (await snapshotResponse.json()) as { ok?: boolean; revisionId?: string };
      expect(snapshot.ok).toBe(true);
      expect(snapshot.revisionId).toBeTruthy();

      let revision = await currentDraftRevision(page.request, pageId!);
      revision = await putDraft(
        page.request,
        pageId!,
        revision,
        makeDocument({ token, titleText: changedTitle }),
      );
      expect(revision).toBeGreaterThan(0);

      await openBuilderPageFromPagesPanel(page, pageTitle);
      const titleNode = page.locator(`[data-node-id="title-${token}"]`).first();
      await expect(titleNode).toContainText(changedTitle);

      await page.getByTitle('버전 히스토리').click();
      await expect(page.getByText('버전 히스토리')).toBeVisible();
      const manualRevisionCard = page.getByRole('button', { name: /manual/ }).first();
      await expect(manualRevisionCard).toBeVisible();
      await manualRevisionCard.hover();
      await expect(page.getByText(/\+\d+ \/ -\d+ \/ ~\d+|현재 draft 와 동일|Diff preview/).first()).toBeVisible();
      await manualRevisionCard.click();
      await page.getByRole('button', { name: '이 버전으로 복원' }).click();
      await page.getByRole('button', { name: '복원', exact: true }).first().click();
      await expect(page.getByText('버전 히스토리')).not.toBeVisible();
      await expect(titleNode).toContainText(originalTitle);
      await expect.poll(async () => {
        const response = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`);
        const payload = (await response.json()) as { document?: TestDocument };
        return JSON.stringify(payload.document ?? {});
      }).toContain(originalTitle);

      const seoTitle = `W27 UI SEO ${token}`;
      const seoDescription = `W27 UI SEO description ${token} saved through the editor panel.`;
      const canonical = `https://tseng-law.com/ko/${slug}`;
      await page.getByTitle('현재 페이지 SEO').click();
      const seoDialog = page.getByRole('dialog', { name: '페이지 SEO' });
      await expect(seoDialog).toBeVisible();
      await seoDialog.getByLabel('SEO title').fill(seoTitle);
      await seoDialog.getByLabel('Meta description').fill(seoDescription);
      await seoDialog.getByLabel('Canonical URL').fill(canonical);
      await expect(seoDialog.getByText('Google preview')).toBeVisible();
      await seoDialog.getByRole('button', { name: 'Social share' }).click();
      await seoDialog.getByLabel('OG image URL').fill('/images/header-skyline-ratio.webp');
      await expect(seoDialog.getByText('OG image preview')).toBeVisible();
      const seoSaveResponsePromise = page.waitForResponse((response) => (
        response.request().method() === 'PATCH' &&
        response.url().includes(`/api/builder/site/pages/${pageId}/seo`)
      ));
      await seoDialog.getByRole('button', { name: '저장' }).click();
      const seoSaveResponse = await seoSaveResponsePromise;
      expect(seoSaveResponse.status()).toBe(200);
      const seoSavePayload = (await seoSaveResponse.json()) as { seo?: { title?: string; canonical?: string } };
      expect(`${seoSavePayload.seo?.title ?? ''}|${seoSavePayload.seo?.canonical ?? ''}`).toBe(`${seoTitle}|${canonical}`);
      await expect(seoDialog).not.toBeVisible();
      await expect.poll(async () => {
        const response = await page.request.get(`/api/builder/site/pages/${pageId}/seo?locale=ko`, {
          headers: { Authorization: builderAuthHeader },
        });
        if (!response.ok()) return `status:${response.status()}`;
        const payload = (await response.json()) as { seo?: { title?: string; canonical?: string } };
        return `${payload.seo?.title ?? ''}|${payload.seo?.canonical ?? ''}`;
      }).toBe(`${seoTitle}|${canonical}`);

      await page.getByTitle('사이트 발행').click();
      const publishDialog = page.getByRole('dialog', { name: 'Publish Page' });
      await expect(publishDialog).toBeVisible();
      await expect(publishDialog.getByText('Automatic preflight checklist')).toBeVisible();
      await expect(publishDialog.getByText('Images', { exact: true })).toBeVisible();
      await expect(publishDialog.getByText('Links', { exact: true })).toBeVisible();
      await expect(publishDialog.getByText('SEO', { exact: true })).toBeVisible();
      await expect(publishDialog.getByText('Forms', { exact: true })).toBeVisible();
      const warningOverrideButton = publishDialog.getByRole('button', { name: '경고 무시하고 발행' });
      if (await warningOverrideButton.isVisible().catch(() => false)) {
        await warningOverrideButton.click();
      }
      const modalPublishButton = publishDialog.getByRole('button', { name: '발행' }).last();
      await expect(modalPublishButton).toBeEnabled();
      await modalPublishButton.click();
      await expect(page.getByText('발행 완료').first()).toBeVisible({ timeout: 15_000 });
      await expect.poll(async () => {
        const response = await page.request.get(`/api/builder/site/pages/${pageId}/seo?locale=ko`, {
          headers: { Authorization: builderAuthHeader },
        });
        if (!response.ok()) return `status:${response.status()}`;
        const payload = (await response.json()) as { seo?: { title?: string; canonical?: string } };
        return `${payload.seo?.title ?? ''}|${payload.seo?.canonical ?? ''}`;
      }).toBe(`${seoTitle}|${canonical}`);

      const publicResponse = await page.request.get(`/ko/${slug}`);
      expect(publicResponse.status()).toBe(200);
      const publicHtml = await publicResponse.text();
      expect(publicHtml).toContain(`<title>${seoTitle}</title>`);
      expect(publicHtml).toContain(`content="${seoDescription}"`);
      expect(publicHtml).toContain(`rel="canonical" href="${canonical}"`);
      expect(publicHtml).toContain(originalTitle);
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          failOnStatusCode: false,
        });
      }
    }
  });
});
