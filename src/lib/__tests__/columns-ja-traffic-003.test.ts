import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/003-taiwan-traffic-accident-procedure.md',
);
const rawBytes = fs.readFileSync(columnPath);
const raw = rawBytes.toString('utf8');

const q1Marker =
  'Q1. 事故発生後、どのような状況なら現場を離れてもひき逃げとみなされないのでしょうか？';
const q1ByteIndex = rawBytes.indexOf(Buffer.from(q1Marker, 'utf8'));
const localizedPrefixBytes =
  q1ByteIndex === -1 ? Buffer.alloc(0) : rawBytes.subarray(0, q1ByteIndex);
const localizedPrefix = localizedPrefixBytes.toString('utf8');
const immutableTail =
  q1ByteIndex === -1 ? Buffer.alloc(0) : rawBytes.subarray(q1ByteIndex);
const parsedPrefix = matter(localizedPrefix);
const bodyPrefix = parsedPrefix.content;

const expectedTitle =
  '台湾交通事故対応Q&A：現場対応・過失・示談・損害賠償';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-traffic-accident-procedure';
const featuredImage =
  '../images/003-taiwan-traffic-accident-procedure/featured-01.jpg';
const incidentImage =
  '../images/003-taiwan-traffic-accident-procedure/img-01.jpg';
const immutableTailBytes = 18_103;
const immutableTailSha256 =
  'f3c149195c4ccae60f936a725c16ecb7c0930c996b5d0870c7fc258d7cb2e3a0';

const imageNodes = Array.from(
  bodyPrefix.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g),
  (match) => ({ alt: match[1], src: match[2] }),
);
const visiblePrefixProse = bodyPrefix.replace(
  /!\[[^\]]*\]\([^)]+\)/g,
  '',
);
const secondImageNode = imageNodes[1]
  ? `![${imageNodes[1].alt}](${imageNodes[1].src})`
  : '';
const secondImageEnd =
  secondImageNode === '' ? -1 : bodyPrefix.indexOf(secondImageNode);
const introduction =
  secondImageEnd === -1
    ? ''
    : bodyPrefix.slice(secondImageEnd + secondImageNode.length);

const prohibitedStaleCopy = [
  'こんにちは',
  '台湾弁護士の曾雋崴',
  '多くの交通事故事件を扱った経験',
  '知見を共有したい',
  '本日は',
  'Q&A形式',
  '効率的に',
] as const;

function countOccurrences(value: string, needle: string) {
  return value.split(needle).length - 1;
}

describe('Japanese traffic column 003 — metadata and introduction localization boundary', () => {
  it('preserves the exact legacy Q1-to-EOF tail byte-for-byte', () => {
    expect(q1ByteIndex).toBeGreaterThanOrEqual(0);
    expect(immutableTail.toString('utf8').startsWith(q1Marker)).toBe(true);
    expect(immutableTail.byteLength).toBe(immutableTailBytes);
    expect(
      crypto.createHash('sha256').update(immutableTail).digest('hex'),
    ).toBe(immutableTailSha256);
  });

  it('ends the localized prefix at the exact blank-line boundary before Q1', () => {
    expect(localizedPrefixBytes.byteLength).toBeGreaterThan(0);
    expect(localizedPrefix.endsWith('\n\n')).toBe(true);
    expect(localizedPrefix.endsWith('\n\n\n')).toBe(false);
    expect(rawBytes.subarray(q1ByteIndex).toString('utf8')).toMatch(
      /^Q1\. 事故発生後、/,
    );
  });

  it('uses the exact contracted frontmatter and one matching H1', () => {
    expect(parsedPrefix.data).toEqual({
      title: expectedTitle,
      url: sourceUrl,
      lastmod: '2026-07-26',
      date_display: '2025年9月13日',
      read_time: '約8分',
      categories: ['台湾法律情報'],
      featured_image: featuredImage,
    });
    expect(
      Array.from(bodyPrefix.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([expectedTitle]);
  });

  it('uses exactly two descriptive image nodes with the contracted paths', () => {
    expect(imageNodes.map(({ src }) => src)).toEqual([
      featuredImage,
      incidentImage,
    ]);
    expect(imageNodes[0]?.alt).toMatch(
      /台湾.{0,20}交通事故.{0,20}(?:直後|発生後).{0,30}(?:現場の)?安全.{0,40}証拠.{0,15}(?:保全|保存)/u,
    );
    expect(imageNodes[1]?.alt).toMatch(
      /事故現場.{0,30}車両.{0,15}位置.{0,30}(?:道路|路面).{0,15}(?:痕跡|形跡)/u,
    );
    expect(countOccurrences(raw, featuredImage)).toBe(2);
    expect(countOccurrences(raw, incidentImage)).toBe(1);
  });

  it('states the contracted response sequence and fact-dependent caveat', () => {
    expect(introduction).toMatch(
      /まず.{0,50}安全.{0,50}(?:適切な)?(?:通報|届出|連絡).{0,50}証拠.{0,15}(?:保全|保存)/su,
    );

    const followUpSequence = [
      /(?:その後|次に)/u,
      /(?:請求|申立て).{0,12}(?:期限|期間|時効)/u,
      /過失/u,
      /示談.{0,10}(?:範囲|対象|内容)|(?:範囲|対象|内容).{0,10}示談/u,
    ];
    const positions = followUpSequence.map((pattern) =>
      introduction.search(pattern),
    );
    for (const position of positions) {
      expect(position).toBeGreaterThanOrEqual(0);
    }
    expect(positions).toEqual([...positions].sort((a, b) => a - b));

    expect(introduction).toMatch(
      /台湾法.{0,40}(?:公的機関|行政機関|関係機関|政府).{0,25}(?:案内|指針|情報).{0,50}(?:一般的|基本的).{0,15}(?:流れ|手順|順序)/su,
    );
    expect(introduction).toMatch(
      /(?:具体的な)?(?:責任|責任関係).{0,30}(?:手続|対応).{0,50}(?:事故|事案).{0,20}(?:事実関係|事情|状況).{0,30}(?:異な|変わ)/su,
    );
  });

  it('removes stale personal copy, first-person prose, Hangul, and spacer-only lines', () => {
    for (const phrase of prohibitedStaleCopy) {
      expect(bodyPrefix).not.toContain(phrase);
    }
    expect(bodyPrefix).not.toMatch(/\p{Script=Hangul}/u);
    expect(bodyPrefix).not.toMatch(/^[\t ]*\u200b+[\t ]*$/mu);
    expect(visiblePrefixProse).not.toMatch(
      /(?:私たち|我々|当事務所|私)/u,
    );
  });
});
