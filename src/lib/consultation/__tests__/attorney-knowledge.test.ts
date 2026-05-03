import { mkdtemp, rm } from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  archiveAttorneyKnowledgeEntry,
  findAttorneyKnowledgeForQuery,
  readAttorneyKnowledgeEntries,
  saveAttorneyKnowledgeEntry,
} from '@/lib/consultation/attorney-knowledge';

const ORIGINAL_LOG_DIR = process.env.CONSULTATION_LOG_DIR;
const ORIGINAL_BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const ORIGINAL_LOG_BACKEND = process.env.CONSULTATION_LOG_BACKEND;

let tempDir: string;

describe('attorney-reviewed consultation knowledge', () => {
  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), 'consultation-knowledge-'));
    process.env.CONSULTATION_LOG_DIR = tempDir;
    process.env.CONSULTATION_LOG_BACKEND = 'local';
    delete process.env.BLOB_READ_WRITE_TOKEN;
  });

  afterEach(async () => {
    if (ORIGINAL_LOG_DIR) process.env.CONSULTATION_LOG_DIR = ORIGINAL_LOG_DIR;
    else delete process.env.CONSULTATION_LOG_DIR;
    if (ORIGINAL_BLOB_TOKEN) process.env.BLOB_READ_WRITE_TOKEN = ORIGINAL_BLOB_TOKEN;
    else delete process.env.BLOB_READ_WRITE_TOKEN;
    if (ORIGINAL_LOG_BACKEND) process.env.CONSULTATION_LOG_BACKEND = ORIGINAL_LOG_BACKEND;
    else delete process.env.CONSULTATION_LOG_BACKEND;
    await rm(tempDir, { recursive: true, force: true });
  });

  it('saves, updates, searches, and archives attorney answers', async () => {
    const first = await saveAttorneyKnowledgeEntry({
      locale: 'ko',
      category: 'general',
      question: '상담료는 얼마이고 상담은 어떻게 예약하나요?',
      answer: '상담 예약은 이메일로 접수합니다.',
      keywords: ['상담료', '예약', '상담'],
      reviewedBy: 'attorney-a',
    });

    await saveAttorneyKnowledgeEntry({
      id: first.id,
      locale: 'ko',
      category: 'general',
      question: first.question,
      answer: '상담 예약은 이메일 또는 전화로 접수합니다.',
      keywords: ['상담료', '예약', '전화'],
      reviewedBy: 'attorney-b',
    });

    const entries = await readAttorneyKnowledgeEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0]?.id).toBe(first.id);
    expect(entries[0]?.answer).toContain('전화');

    const matches = await findAttorneyKnowledgeForQuery(
      '상담료와 예약 방법을 알려주세요',
      'general',
      'ko',
    );
    expect(matches.map((entry) => entry.id)).toContain(first.id);

    await archiveAttorneyKnowledgeEntry(first.id);
    expect(await readAttorneyKnowledgeEntries()).toHaveLength(0);
  });
});
