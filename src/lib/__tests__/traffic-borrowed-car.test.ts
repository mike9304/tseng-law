import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { getColumnPost, getAllColumnPosts } from '../columns';
import { buildTrafficCollection, filterTrafficBoardItems } from '../traffic-collection';
import { getColumnGeneratedVideo } from '@/data/column-generated-videos';

const slug = 'taiwan-borrowed-car-owner-driver-key-custody-liability';

describe('reviewed borrowed-car liability column', () => {
  it('preserves the exact reviewed body including factual and legal qualifications', () => {
    const file = fs.readFileSync(`src/content/columns-zh/080-${slug}.md`, 'utf8');
    const body = file.slice(file.indexOf('\n---\n') + 5);
    // Undo only the exact AI attribution removal approved on 2026-10-03;
    // the original reviewed-body hash still protects every other byte.
    const approvedAttributionChanges = [
      [
        "本文依公開法規與裁判整理，提供一般法律資訊；個別案件仍須依其事實、證據及適用法規判斷。",
        "本文依公開法規與裁判整理，由法律AI助理撰寫，提供一般法律資訊；個別案件仍須依其事實、證據及適用法規判斷。",
      ],
    ] as const;
    let reviewedBody = body;
    for (const [approvedText, reviewedText] of approvedAttributionChanges) {
      expect(body.split(approvedText)).toHaveLength(2);
      expect(body).not.toContain(reviewedText);
      reviewedBody = reviewedBody.replace(approvedText, reviewedText);
    }
    expect(createHash('sha256').update(reviewedBody).digest('hex')).toBe('53052322e19d5345c3de5cf6633995e673f2d9719a34e2a89dd367fd1cfd8d54');
    expect(body).toContain('未確認是否確定');
    expect(body).toContain('施行日期由行政院另定');
  });

  it('includes the reviewed key-storage video only on the native liability article', () => {
    const matches = buildTrafficCollection('zh-hant', { columns: getAllColumnPosts('zh-hant'), issues: [] }).filter(p => p.slug === slug);
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({ subject: 'liability', hasVideo: true, columnNumber: 80, aiAuthored: true });
    expect(filterTrafficBoardItems(matches, { q: '', subject: 'liability', video: true })).toHaveLength(1);
    expect(getColumnGeneratedVideo('zh-hant', slug)?.id).toBe('key-custody-v1-zh-hant');
    expect(getColumnGeneratedVideo('zh-hant', slug, 'issue')).toBeNull();
    const post = getColumnPost(slug, 'zh-hant')!;
    expect(post.diagramVideo).toBeUndefined();
    expect(post.featuredImage).toBe('/images/columns/20261002/borrowed-car-liability-hero-1600x900.webp');
    for (const locale of ['ko', 'en', 'ja'] as const) {
      expect(getAllColumnPosts(locale).some(p => p.slug === slug)).toBe(false);
      expect(getColumnGeneratedVideo(locale, slug)).toBeNull();
    }
  });
});
