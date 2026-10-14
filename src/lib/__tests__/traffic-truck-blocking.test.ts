import { describe, expect, it } from 'vitest';
import { getColumnGeneratedVideo } from '@/data/column-generated-videos';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { getColumnPost, getAllColumnPosts } from '../columns';
import { buildTrafficCollection, filterTrafficBoardItems, parseTrafficBoardQuery } from '../traffic-collection';
import pendingEmbeddings from '@/content/column-embeddings-pending.json';

const slug = 'taiwan-truck-blocking-multiple-dashcam-evidence';

describe('reviewed multi-camera evidence column', () => {
  it('preserves the exact reviewed body, case amounts and qualifications', () => {
    const file = fs.readFileSync(`src/content/columns-zh/089-${slug}.md`, 'utf8');
    const body = file.slice(file.indexOf('\n---\n') + 5);
    // Undo only the exact AI attribution removal approved on 2026-10-03;
    // the original reviewed-body hash still protects every other byte.
    const approvedAttributionChanges = [
      [
        "本文依公開判決與官方法規整理，僅供一般資訊參考。查核日：2026-10-03（臺灣）；法規資料庫所示整編截止日：2026-09-24。",
        "撰文：法律AI助理。本文依公開判決與官方法規整理，僅供一般資訊參考。查核日：2026-10-03（臺灣）；法規資料庫所示整編截止日：2026-09-24。",
      ],
    ] as const;
    let reviewedBody = body;
    for (const [approvedText, reviewedText] of approvedAttributionChanges) {
      expect(body.split(approvedText)).toHaveLength(2);
      expect(body).not.toContain(reviewedText);
      reviewedBody = reviewedBody.replace(approvedText, reviewedText);
    }
    expect(createHash('sha256').update(reviewedBody).digest('hex')).toBe('15dac09279a6a073a6bababfb5a6b485c53a070df084ecfad113bb4c98273822');
    expect(body).toContain('未確認後續上訴及確定狀態');
    expect(body).toContain('這是交通裁罰的行政訴訟，不是刑事傷害罪判決，也沒有分配兩車的民事賠償比例');
  });

  it('automatically joins the evidence collection with its reviewed video and no language copy', () => {
    const collection = buildTrafficCollection('zh-hant', { columns: getAllColumnPosts('zh-hant'), issues: [] });
    const matches = collection.filter(p => p.slug === slug);
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({ subject: 'evidence', hasVideo: true, columnNumber: 89, aiAuthored: true });
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'evidence', q: '四組行車紀錄器' })).map(p => p.slug)).toEqual([slug]);
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'evidence', video: '1' })).some(p => p.slug === slug)).toBe(true);
    // 2026-10-03: reviewed generated video; no diagram frontmatter.
    expect(getColumnGeneratedVideo('zh-hant', slug)?.id).toBe('truck-blocking-v2-zh-hant');
    expect(getColumnPost(slug, 'zh-hant')!.diagramVideo).toBeUndefined();
    expect(pendingEmbeddings.columns.filter(p => p.slug === slug)).toEqual([{ locale: 'zh-hant', slug }]);
    for (const locale of ['ko', 'en', 'ja'] as const) expect(getAllColumnPosts(locale).some(p => p.slug === slug)).toBe(false);
  });
});
