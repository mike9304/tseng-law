import { mkdtemp, rm } from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  createFaqItem,
  deleteFaqItem,
  faqItemsToSchemaItems,
  listFaqItems,
  listFaqSearchDocs,
  loadFaqItem,
  saveFaqItem,
} from '@/lib/builder/faq/faq-engine';

let root = '';
const previousBackend = process.env.BUILDER_FAQ_BACKEND;
const previousRoot = process.env.BUILDER_FAQ_ROOT;

beforeEach(async () => {
  root = await mkdtemp(path.join(os.tmpdir(), 'builder-faq-test-'));
  process.env.BUILDER_FAQ_BACKEND = 'local';
  process.env.BUILDER_FAQ_ROOT = root;
});

afterEach(async () => {
  if (root) await rm(root, { recursive: true, force: true });
  if (previousBackend === undefined) delete process.env.BUILDER_FAQ_BACKEND;
  else process.env.BUILDER_FAQ_BACKEND = previousBackend;
  if (previousRoot === undefined) delete process.env.BUILDER_FAQ_ROOT;
  else process.env.BUILDER_FAQ_ROOT = previousRoot;
});

describe('native FAQ engine', () => {
  it('seeds localized published FAQ records with categories', async () => {
    const all = await listFaqItems({ locale: 'ko', status: 'published' });
    const company = await listFaqItems({ locale: 'ko', status: 'published', categoryId: 'company-setup' });
    const labor = await listFaqItems({ locale: 'ko', status: 'published', categoryId: 'labor-law' });

    expect(all.length).toBeGreaterThan(10);
    expect(company).toHaveLength(4);
    expect(labor).toHaveLength(2);
    expect(company[0]).toMatchObject({
      locale: 'ko',
      status: 'published',
      categoryId: 'company-setup',
      schemaEnabled: true,
    });
  });

  it('creates, updates, searches, and deletes FAQ records', async () => {
    const created = await createFaqItem({
      locale: 'ko',
      question: 'F47 테스트 질문은 공개되나요?',
      answer: '초안은 공개 목록에서 제외되고 공개 처리 후 검색됩니다.',
      categoryId: 'consultation',
      status: 'draft',
      tags: ['f47'],
      schemaEnabled: true,
      sortOrder: 7,
    });

    expect(await loadFaqItem(created.faqId)).toMatchObject({ status: 'draft', tags: ['f47'] });
    expect(await listFaqItems({ locale: 'ko', status: 'published', q: 'F47 테스트' })).toHaveLength(0);

    const published = await saveFaqItem({ ...created, status: 'published' });
    const publicMatches = await listFaqItems({ locale: 'ko', status: 'published', q: 'F47 테스트' });
    expect(publicMatches.map((item) => item.faqId)).toContain(published.faqId);
    expect(faqItemsToSchemaItems(publicMatches)).toContainEqual({
      question: 'F47 테스트 질문은 공개되나요?',
      answer: '초안은 공개 목록에서 제외되고 공개 처리 후 검색됩니다.',
    });

    await deleteFaqItem(created.faqId);
    expect(await loadFaqItem(created.faqId)).toBeNull();
  });

  it('emits FAQ search documents from published records only', async () => {
    await createFaqItem({
      locale: 'ko',
      question: 'FAQ 검색 색인 질문',
      answer: '검색 색인 본문에 들어가는 답변입니다.',
      categoryId: 'company-setup',
      status: 'published',
      tags: ['search'],
    });
    await createFaqItem({
      locale: 'ko',
      question: '비공개 FAQ 검색 색인 질문',
      answer: '초안 답변입니다.',
      categoryId: 'company-setup',
      status: 'draft',
    });

    const docs = await listFaqSearchDocs('ko');
    const hit = docs.find((doc) => doc.title === 'FAQ 검색 색인 질문');
    const draftHit = docs.find((doc) => doc.title === '비공개 FAQ 검색 색인 질문');

    expect(hit).toMatchObject({
      kind: 'faq',
      locale: 'ko',
      url: expect.stringContaining('/ko/faq?category=company-setup'),
      tags: expect.arrayContaining(['company-setup', 'search']),
    });
    expect(hit?.body).toContain('검색 색인 본문');
    expect(draftHit).toBeUndefined();
  });
});
