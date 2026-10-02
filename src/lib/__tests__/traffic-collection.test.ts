import { describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getAllColumnPosts, getAllIssuePosts, getColumnPost } from '../columns';
import type { ColumnPost } from '../column-post';
import { normalizeColumnTags } from '../column-tags';
import { siteLocales, type SiteLocale } from '../locales';
import { TRAFFIC_DIAGRAMS } from '@/data/traffic-diagrams';
import {
  LEGACY_TRAFFIC_SUBJECT_BY_SLUG,
  TRAFFIC_QUERY_MAX_LENGTH,
  buildTrafficBoardHref,
  buildTrafficCollection,
  countTrafficSubjects,
  filterTrafficBoardItems,
  isTrafficVideoDiagram,
  parseTrafficBoardQuery,
  resolveTrafficSubject,
  toTrafficBoardItem,
  type TrafficBoardItem,
} from '../traffic-collection';
import { loadTrafficCollection, type TrafficCollectionSources } from '../traffic-collection-server';

/** File-only sources: deterministic in tests (no builder storage or Blob). */
const fileSources: TrafficCollectionSources = {
  filePosts: (locale) => getAllColumnPosts(locale),
  mergedPosts: async (locale) => getAllColumnPosts(locale),
  issuePosts: (locale) => getAllIssuePosts(locale),
};

function post(overrides: Partial<ColumnPost> & { slug: string }): ColumnPost {
  return {
    title: overrides.slug,
    date: '',
    dateDisplay: '',
    readTime: '',
    category: 'legal',
    categoryLabel: '',
    featuredImage: '',
    content: '',
    summary: '',
    ...overrides,
  };
}

const EXPECTED_ORDER: Record<SiteLocale, string[]> = {
  'zh-hant': [
    'taiwan-racing-no-contact-joint-tort-liability',
    'taiwan-retaliatory-driving-rear-ended-intentional-injury',
    'taiwan-car-repair-rental-cost-repair-period-evidence',
    'taiwan-accident-family-care-necessity-period',
    'taiwan-car-accident-work-loss-rest-note',
    'taiwan-accident-assessment-secondary-cause-compensation-ratio',
    'taiwan-mediation-delayed-injury-rescission',
    'taiwan-car-repair-cost-estimate-parts-depreciation',
    'taiwan-borrowed-car-owner-driver-key-custody-liability',
    'taiwan-accident-stop-dialogue-hit-and-run-evidence',
    'taiwan-bus-sudden-braking-passenger-carrier-liability',
    'taiwan-chain-rear-end-first-impact-evidence',
    'taiwan-roadside-starting-parking-exit-liability',
    'taiwan-car-door-opening-motorcycle-liability',
    'taiwan-flashing-red-yellow-intersection-liability',
    'taiwan-right-turn-car-straight-motorcycle-evidence',
    'taiwan-lane-change-side-rear-collision-liability',
    'taiwan-left-turn-vs-straight-motorcycle',
    'taiwan-accident-police-records',
    'taiwan-overtaking-accident-liability',
    'taiwan-traffic-accident-procedure',
  ],
  ko: ['taiwan-left-turn-vs-straight-motorcycle', 'taiwan-accident-police-records', 'taiwan-overtaking-accident-liability', 'taiwan-traffic-accident-procedure'],
  en: ['taiwan-left-turn-vs-straight-motorcycle', 'taiwan-accident-police-records', 'taiwan-overtaking-accident-liability', 'taiwan-traffic-accident-procedure'],
  ja: ['taiwan-accident-police-records', 'taiwan-overtaking-accident-liability', 'taiwan-traffic-accident-procedure'],
};

describe('normalizeColumnTags', () => {
  it('trims, lowercases and dedupes string arrays', () => {
    expect(normalizeColumnTags([' Traffic-Accidents ', 'traffic-accidents', 'TRAFFIC-EVIDENCE', '  '])).toEqual(['traffic-accidents', 'traffic-evidence']);
  });

  it('never throws on malformed input and drops non-strings and overlong values', () => {
    for (const raw of [undefined, null, 42, 'traffic-accidents', { 0: 'traffic-accidents' }, true]) {
      expect(normalizeColumnTags(raw)).toEqual([]);
    }
    expect(normalizeColumnTags([1, null, {}, ['traffic-accidents'], 'x'.repeat(65), 'ok'])).toEqual(['ok']);
    expect(normalizeColumnTags(['a\u0000b', 'c\n  d'])).toEqual(['ab', 'c d']);
    expect(normalizeColumnTags(Array.from({ length: 100 }, (_, i) => `t${i}`))).toHaveLength(32);
  });
});

describe('resolveTrafficSubject', () => {
  it('maps every reviewed legacy slug', () => {
    expect(LEGACY_TRAFFIC_SUBJECT_BY_SLUG).toEqual({
      'taiwan-traffic-accident-procedure': 'procedure',
      'taiwan-overtaking-accident-liability': 'liability',
      'taiwan-accident-police-records': 'evidence',
      'taiwan-left-turn-vs-straight-motorcycle': 'liability',
      'taiwan-lane-change-side-rear-collision-liability': 'liability',
      'taiwan-right-turn-car-straight-motorcycle-evidence': 'evidence',
      'taiwan-flashing-red-yellow-intersection-liability': 'liability',
      'taiwan-car-door-opening-motorcycle-liability': 'liability',
    });
    for (const [slug, subject] of Object.entries(LEGACY_TRAFFIC_SUBJECT_BY_SLUG)) {
      expect(resolveTrafficSubject({ slug })).toBe(subject);
    }
  });

  it('includes explicit tags; any subject tag implies inclusion; the collection tag alone is general', () => {
    expect(resolveTrafficSubject({ slug: 'new-post', tags: ['traffic-accidents'] })).toBe('general');
    expect(resolveTrafficSubject({ slug: 'new-post', tags: ['traffic-compensation'] })).toBe('compensation');
    expect(resolveTrafficSubject({ slug: 'new-post', tags: ['Traffic-Accidents', ' traffic-procedure '] })).toBe('procedure');
    // A reviewed legacy subject is more specific than the bare collection tag.
    expect(resolveTrafficSubject({ slug: 'taiwan-accident-police-records', tags: ['traffic-accidents'] })).toBe('evidence');
    // An explicit subject tag overrides the legacy map.
    expect(resolveTrafficSubject({ slug: 'taiwan-accident-police-records', tags: ['traffic-compensation'] })).toBe('compensation');
  });

  it('rejects malformed and look-alike tags without keyword matching', () => {
    for (const tags of [
      'traffic-accidents',
      ['traffic-accident'],
      ['traffic-accidents-2026'],
      ['not traffic-accidents'],
      ['traffic'],
      ['交通事故', '車禍'],
      ['__proto__', 'constructor', 'toString', 'hasOwnProperty'],
      [{ tag: 'traffic-accidents' }],
    ]) {
      expect(resolveTrafficSubject({ slug: 'unrelated-post', tags }), JSON.stringify(tags)).toBeNull();
    }
    expect(resolveTrafficSubject({ slug: '__proto__' })).toBeNull();
    expect(resolveTrafficSubject({ slug: 'constructor' })).toBeNull();
  });

  it('applies the legacy slug map to columns only, never to issue posts', () => {
    expect(resolveTrafficSubject({ slug: 'taiwan-accident-police-records' }, 'issue')).toBeNull();
    expect(resolveTrafficSubject({ slug: 'any-issue', tags: ['traffic-evidence'] }, 'issue')).toBe('evidence');
  });
});

describe('isTrafficVideoDiagram', () => {
  it('flags only registered playable videos, never stills or unknown ids', () => {
    expect(isTrafficVideoDiagram('passing-hypothetical')).toBe(true);
    expect(isTrafficVideoDiagram('left-turn-hypothetical')).toBe(true);
    expect(isTrafficVideoDiagram('police-documents-3d')).toBe(false);
    expect(isTrafficVideoDiagram('claim-records-3d')).toBe(false);
    expect(isTrafficVideoDiagram('passing-stages-3d')).toBe(false);
    expect(isTrafficVideoDiagram('not-a-diagram')).toBe(false);
    expect(isTrafficVideoDiagram(undefined)).toBe(false);
    expect(isTrafficVideoDiagram('__proto__')).toBe(false);
  });
});

describe('reviewed column videos in the traffic board', () => {
  it('includes the native video in its reviewed language and source only', () => {
    const article = post({ slug: 'taiwan-traffic-accident-procedure', tags: ['traffic-procedure'] });
    expect(toTrafficBoardItem(article, 'ko', 'column')?.hasVideo).toBe(true);
    expect(toTrafficBoardItem(article, 'en', 'column')?.hasVideo).toBe(false);
    expect(toTrafficBoardItem(article, 'ko', 'issue')?.hasVideo).toBe(false);
    const items = buildTrafficCollection('ko', { columns: [article], issues: [] });
    expect(filterTrafficBoardItems(items, { q: '', subject: null, video: true })).toHaveLength(1);
  });
});

describe('loadTrafficCollection (published files)', () => {
  it('lists 21 zh-hant / 4 ko / 4 en / 3 ja articles, newest first, without another language fallback', async () => {
    for (const locale of siteLocales) {
      const items = await loadTrafficCollection(locale, fileSources);
      expect(items.map((item) => item.slug), locale).toEqual(EXPECTED_ORDER[locale]);
      for (const item of items) {
        const localized = getColumnPost(item.slug, locale)!;
        expect(localized, `${locale}/${item.slug}`).toBeTruthy();
        expect(item.title).toBe(localized.title);
        expect(item.href).toBe(`/${locale}/columns/${item.slug}`);
        expect(item.source).toBe('column');
      }
    }
    expect((await loadTrafficCollection('ja', fileSources)).map((item) => item.slug)).not.toContain('taiwan-left-turn-vs-straight-motorcycle');
    expect((await loadTrafficCollection('ko', fileSources)).map((item) => item.slug)).not.toContain('taiwan-car-door-opening-motorcycle-liability');
  });

  it('carries subject, date, read time, AI label and true video flags without article bodies', async () => {
    const items = await loadTrafficCollection('zh-hant', fileSources);
    const bySlug = new Map(items.map((item) => [item.slug, item]));
    expect(bySlug.get('taiwan-traffic-accident-procedure')?.subject).toBe('procedure');
    expect(bySlug.get('taiwan-right-turn-car-straight-motorcycle-evidence')?.subject).toBe('evidence');
    expect(bySlug.get('taiwan-car-door-opening-motorcycle-liability')?.subject).toBe('liability');
    expect(bySlug.get('taiwan-car-door-opening-motorcycle-liability')?.publicationDate).toBe('2026-10-02');
    expect(bySlug.get('taiwan-car-door-opening-motorcycle-liability')?.readTime).toBe('約7分鐘閱讀');
    expect(bySlug.get('taiwan-car-door-opening-motorcycle-liability')?.aiAuthored).toBe(true);
    expect(bySlug.get('taiwan-overtaking-accident-liability')?.aiAuthored).toBe(false);
    expect(bySlug.get('taiwan-overtaking-accident-liability')?.hasVideo).toBe(true);
    expect(bySlug.get('taiwan-accident-police-records')?.hasVideo).toBe(false);
    expect(bySlug.get('taiwan-traffic-accident-procedure')?.hasVideo).toBe(false);
    for (const item of items) {
      const diagramId = getColumnPost(item.slug, 'zh-hant')?.diagramVideo?.id;
      const diagram = diagramId ? (TRAFFIC_DIAGRAMS as Record<string, { kind?: string }>)[diagramId] : undefined;
      expect(item.hasVideo, item.slug).toBe(Boolean(diagram && diagram.kind !== 'still'));
      expect(item).not.toHaveProperty('content');
    }
  });

  it('reads Japanese from files only and the other locales through the CMS-aware reader', async () => {
    const sources: TrafficCollectionSources = {
      filePosts: vi.fn(() => []),
      mergedPosts: vi.fn(async () => []),
      issuePosts: vi.fn(() => []),
    };
    await loadTrafficCollection('ja', sources);
    expect(sources.filePosts).toHaveBeenCalledWith('ja');
    expect(sources.mergedPosts).not.toHaveBeenCalled();
    await loadTrafficCollection('zh-hant', sources);
    expect(sources.mergedPosts).toHaveBeenCalledWith('zh-hant');
    expect(sources.issuePosts).toHaveBeenCalledWith('zh-hant');
  });
});

describe('automatic inclusion', () => {
  it('includes a tagged markdown file with an arbitrary slug through the file loader', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'traffic-tags-'));
    try {
      fs.writeFileSync(path.join(dir, '099-some-new-crash-article.md'), [
        '---',
        'title: "新文章"',
        'summary: "摘要"',
        'published: "2026-10-05"',
        'read_time: "約3分鐘閱讀"',
        'tags: [" Traffic-Accidents ", "traffic-compensation", 7, "traffic-compensation"]',
        '---',
        '',
        '內文。',
      ].join('\n'));
      fs.writeFileSync(path.join(dir, '098-unrelated-car-words.md'), [
        '---',
        'title: "車禍 交通事故 traffic accident"',
        'summary: "traffic-accidents 車禍"',
        'published: "2026-10-06"',
        'tags: "traffic-accidents"',
        '---',
        '',
        'traffic-accidents traffic-liability 車禍',
      ].join('\n'));
      const filePosts = getAllColumnPosts('zh-hant', { columnsDir: dir });
      expect(filePosts.find((p) => p.slug === 'some-new-crash-article')?.tags).toEqual(['traffic-accidents', 'traffic-compensation']);
      expect(filePosts.find((p) => p.slug === 'unrelated-car-words')?.tags).toEqual([]);
      const items = await loadTrafficCollection('zh-hant', {
        filePosts: () => filePosts,
        mergedPosts: async () => filePosts,
        issuePosts: () => [],
      });
      expect(items.map((item) => [item.slug, item.subject])).toEqual([['some-new-crash-article', 'compensation']]);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('includes a tagged CMS post and a tagged issue post with its original issue URL', () => {
    const items = buildTrafficCollection('en', {
      columns: [
        post({ slug: 'cms-scooter-claim', title: 'Scooter claim', publicationDate: '2026-10-03', tags: ['traffic-accidents'] }),
        post({ slug: 'cms-unrelated', title: 'Traffic accident liability in Taiwan', summary: 'traffic accidents', content: 'traffic-accidents' }),
      ],
      issues: [
        post({ slug: 'new-road-rule', publicationDate: '2026-10-04', tags: ['traffic-procedure'] }),
        post({ slug: 'taiwan-accident-police-records', publicationDate: '2026-10-04' }),
      ],
    });
    expect(items.map((item) => [item.slug, item.source, item.href])).toEqual([
      ['new-road-rule', 'issue', '/en/columns/issues/new-road-rule'],
      ['cms-scooter-claim', 'column', '/en/columns/cms-scooter-claim'],
    ]);
  });

  it('excludes internal test records, dedupes by slug and sorts by date then column number', () => {
    const items = buildTrafficCollection('zh-hant', {
      columns: [
        post({ slug: 'visual-load-more-1', publicationDate: '2026-12-01', tags: ['traffic-accidents'] }),
        post({ slug: 'undated', tags: ['traffic-accidents'] }),
        post({ slug: 'a-72', publicationDate: '2026-10-02', columnNumber: 72, tags: ['traffic-accidents'], title: 'CMS copy' }),
        post({ slug: 'a-72', publicationDate: '2026-10-02', columnNumber: 72, tags: ['traffic-accidents'], title: 'file copy' }),
        post({ slug: 'a-75', publicationDate: '2026-10-02', columnNumber: 75, tags: ['traffic-accidents'] }),
        post({ slug: 'older', publicationDate: '2025-01-01', columnNumber: 99, tags: ['traffic-accidents'] }),
        post({ slug: 'g-editor', title: 'G-Editor UI test', publicationDate: '2026-12-01', tags: ['traffic-accidents'] }),
      ],
      issues: [post({ slug: 'a-75', publicationDate: '2026-10-02', tags: ['traffic-accidents'] })],
    });
    expect(items.map((item) => item.slug)).toEqual(['a-75', 'a-72', 'older', 'undated']);
    expect(items.find((item) => item.slug === 'a-72')?.title).toBe('CMS copy');
    expect(items.find((item) => item.slug === 'a-75')?.source).toBe('column');
  });

  it('never emits unsafe image URLs', () => {
    const [item] = buildTrafficCollection('en', {
      columns: [post({ slug: 'x', tags: ['traffic-accidents'], featuredImage: 'javascript:alert(1)' })],
      issues: [],
    });
    expect(item.image).toBe('');
  });
});

describe('board query, filters and URLs', () => {
  const items: TrafficBoardItem[] = buildTrafficCollection('zh-hant', {
    columns: [
      post({ slug: 'door', title: '開車門撞到機車', summary: '停車格', publicationDate: '2026-10-02', tags: ['traffic-liability'], diagramVideo: { id: 'passing-hypothetical' } }),
      post({ slug: 'records', title: '警方資料怎麼申請', summary: '初步分析研判表', publicationDate: '2026-09-30', tags: ['traffic-evidence'], diagramVideo: { id: 'police-documents-3d' } }),
      post({ slug: 'turn', title: '右轉與直行機車', summary: '連續影像', publicationDate: '2026-10-01', tags: ['traffic-evidence'], diagramVideo: { id: 'left-turn-hypothetical' } }),
    ],
    issues: [],
  });

  it('normalizes blank, repeated, oversized and unknown inputs harmlessly', () => {
    expect(parseTrafficBoardQuery(undefined)).toEqual({ q: '', subject: null, video: false });
    expect(parseTrafficBoardQuery({ q: '   ', subject: '', video: '' })).toEqual({ q: '', subject: null, video: false });
    expect(parseTrafficBoardQuery({ q: ['  機車\u0000  影像 ', 'x'], subject: ['EVIDENCE', 'liability'], video: '1' }))
      .toEqual({ q: '機車 影像', subject: 'evidence', video: true });
    expect(parseTrafficBoardQuery({ subject: 'constructor', video: 'yes please', page: '9' })).toEqual({ q: '', subject: null, video: false });
    expect(Array.from(parseTrafficBoardQuery({ q: '車'.repeat(500) }).q)).toHaveLength(TRAFFIC_QUERY_MAX_LENGTH);
  });

  it('combines search, subject and video filters', () => {
    expect(filterTrafficBoardItems(items, parseTrafficBoardQuery({})).map((item) => item.slug)).toEqual(['door', 'turn', 'records']);
    expect(filterTrafficBoardItems(items, parseTrafficBoardQuery({ subject: 'evidence' })).map((item) => item.slug)).toEqual(['turn', 'records']);
    expect(filterTrafficBoardItems(items, parseTrafficBoardQuery({ subject: 'evidence', video: '1' })).map((item) => item.slug)).toEqual(['turn']);
    expect(filterTrafficBoardItems(items, parseTrafficBoardQuery({ q: '機車 影像' })).map((item) => item.slug)).toEqual(['turn']);
    expect(filterTrafficBoardItems(items, parseTrafficBoardQuery({ q: '機車', subject: 'liability', video: '1' })).map((item) => item.slug)).toEqual(['door']);
    expect(filterTrafficBoardItems(items, parseTrafficBoardQuery({ q: '不存在' }))).toEqual([]);
  });

  it('counts subjects under the current search and video filters', () => {
    const counts = countTrafficSubjects(items, parseTrafficBoardQuery({ subject: 'liability', video: '1' }));
    expect(counts.get('evidence')).toBe(1);
    expect(counts.get('liability')).toBe(1);
    expect(counts.get('procedure') ?? 0).toBe(0);
  });

  it('builds encoded, shareable hub URLs that land on #articles', () => {
    expect(buildTrafficBoardHref('zh-hant', {})).toBe('/zh-hant/traffic-accidents#articles');
    expect(buildTrafficBoardHref('zh-hant', { q: '機車 & 影像', subject: 'evidence', video: true }))
      .toBe('/zh-hant/traffic-accidents?q=%E6%A9%9F%E8%BB%8A+%26+%E5%BD%B1%E5%83%8F&subject=evidence&video=1#articles');
    const roundTrip = parseTrafficBoardQuery(Object.fromEntries(new URLSearchParams('q=%E6%A9%9F%E8%BB%8A+%26+%E5%BD%B1%E5%83%8F&subject=evidence&video=1')));
    expect(roundTrip).toEqual({ q: '機車 & 影像', subject: 'evidence', video: true });
  });
});
