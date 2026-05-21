import { expect, test, type APIRequestContext } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'collab-comments';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

interface CollabCommentRow {
  id: string;
  body: string;
  resolvedAt?: string;
  nodeId?: string;
}

async function createComment(
  request: APIRequestContext,
  scope: string,
  payload: { siteId: string; pageId: string; body: string; nodeId?: string },
): Promise<CollabCommentRow> {
  const res = await request.post('/api/builder/collab/comments', {
    data: payload,
    headers: mutationHeaders(scope),
  });
  expect(res.status(), `create comment failed: ${res.status()}`).toBe(200);
  const json = (await res.json()) as { ok: boolean; comment: CollabCommentRow };
  expect(json.ok).toBe(true);
  return json.comment;
}

async function listComments(
  request: APIRequestContext,
  siteId: string,
  pageId: string,
  includeResolved = false,
): Promise<CollabCommentRow[]> {
  const params = new URLSearchParams({ siteId, pageId });
  if (includeResolved) params.set('includeResolved', '1');
  const res = await request.get(`/api/builder/collab/comments?${params.toString()}`);
  expect(res.status()).toBe(200);
  const json = (await res.json()) as { comments: CollabCommentRow[] };
  return json.comments;
}

test.describe('collab comments smoke', () => {
  test('create, list, resolve, reopen, delete', async ({ request }) => {
    const token = Date.now().toString(36);
    const pageId = `cmt-page-${token}`;
    const siteId = 'default';

    const first = await createComment(request, `cmt-${token}-a`, {
      siteId,
      pageId,
      body: 'Looks great so far',
    });
    const second = await createComment(request, `cmt-${token}-b`, {
      siteId,
      pageId,
      body: 'Move this hero up please',
      nodeId: 'node-x',
    });

    const open = await listComments(request, siteId, pageId);
    const openIds = open.map((c) => c.id);
    expect(openIds).toEqual(expect.arrayContaining([first.id, second.id]));
    const attached = open.find((c) => c.id === second.id);
    expect(attached?.nodeId).toBe('node-x');

    // Resolve the first comment.
    const resolveRes = await request.patch(
      `/api/builder/collab/comments/${encodeURIComponent(first.id)}?siteId=${siteId}&pageId=${encodeURIComponent(pageId)}`,
      {
        data: { action: 'resolve' },
        headers: mutationHeaders(`cmt-${token}-resolve`),
      },
    );
    expect(resolveRes.status()).toBe(200);

    const afterResolve = await listComments(request, siteId, pageId);
    expect(afterResolve.map((c) => c.id)).not.toContain(first.id);

    const withResolved = await listComments(request, siteId, pageId, true);
    const resolvedRow = withResolved.find((c) => c.id === first.id);
    expect(resolvedRow?.resolvedAt).toBeTruthy();

    // Reopen and delete.
    const reopenRes = await request.patch(
      `/api/builder/collab/comments/${encodeURIComponent(first.id)}?siteId=${siteId}&pageId=${encodeURIComponent(pageId)}`,
      {
        data: { action: 'reopen' },
        headers: mutationHeaders(`cmt-${token}-reopen`),
      },
    );
    expect(reopenRes.status()).toBe(200);

    const deleteRes = await request.delete(
      `/api/builder/collab/comments/${encodeURIComponent(first.id)}?siteId=${siteId}&pageId=${encodeURIComponent(pageId)}`,
      { headers: mutationHeaders(`cmt-${token}-del`) },
    );
    expect(deleteRes.status()).toBe(200);

    const finalList = await listComments(request, siteId, pageId, true);
    expect(finalList.map((c) => c.id)).not.toContain(first.id);
    expect(finalList.map((c) => c.id)).toContain(second.id);

    // Cleanup the remaining comment so reruns stay clean.
    await request.delete(
      `/api/builder/collab/comments/${encodeURIComponent(second.id)}?siteId=${siteId}&pageId=${encodeURIComponent(pageId)}`,
      { headers: mutationHeaders(`cmt-${token}-cleanup`), failOnStatusCode: false },
    );
  });
});