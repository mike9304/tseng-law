import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-en/003-taiwan-traffic-accident-procedure.md',
);
const rawBytes = fs.readFileSync(columnPath);
const raw = rawBytes.toString('utf8');
const parsed = matter(raw);

const title =
  'Taiwan Traffic Accident Q&A: Scene Safety, Fault, Settlement, and Compensation';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-traffic-accident-procedure';
const featuredImage =
  '../images/003-taiwan-traffic-accident-procedure/featured-01.jpg';
const incidentImage =
  '../images/003-taiwan-traffic-accident-procedure/img-01.jpg';
const q1Marker =
  'Q1. In what situations after an accident can you leave the scene without being treated as a hit-and-run?';
const immutableTailBytes = 17_650;
const immutableTailSha256 =
  '033d0f355302b1038d965d3ca35b340d15c388e29a0c9e6f5b8eb9f4cebe37df';

const prohibitedStaleCopy = [
  'Hello',
  'I am Wei Tseng',
  'I have handled many',
  'share my views',
  'Today I would like',
  'Q&A format',
  'efficiently',
] as const;

function countOccurrences(value: string, needle: string) {
  return value.split(needle).length - 1;
}

const q1MarkerBytes = Buffer.from(q1Marker, 'utf8');
const q1ByteIndex = rawBytes.indexOf(q1MarkerBytes);
const q1CharacterIndex = parsed.content.indexOf(q1Marker);
const bodyPrefix =
  q1CharacterIndex === -1
    ? parsed.content
    : parsed.content.slice(0, q1CharacterIndex);
const rawPrefix =
  q1ByteIndex === -1 ? raw : rawBytes.subarray(0, q1ByteIndex).toString('utf8');
const imageNodes = Array.from(
  bodyPrefix.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g),
  (match) => ({ alt: match[1], src: match[2] }),
);
const visiblePrefixProse = bodyPrefix
  .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
  .replace(/^#{1,6}\s+.*$/gm, '');
const secondImageEnd = bodyPrefix.indexOf(
  imageNodes[1] ? `![${imageNodes[1].alt}](${imageNodes[1].src})` : '',
);
const introduction =
  imageNodes.length !== 2 || secondImageEnd === -1
    ? ''
    : bodyPrefix.slice(
        secondImageEnd +
          `![${imageNodes[1].alt}](${imageNodes[1].src})`.length,
      );

describe('English traffic column 003 — metadata and introduction localization boundary', () => {
  it('preserves the immutable Q1-to-end tail byte-for-byte', () => {
    expect(q1ByteIndex).toBeGreaterThan(0);

    const immutableTail = rawBytes.subarray(q1ByteIndex);
    expect(immutableTail.toString('utf8').startsWith(q1Marker)).toBe(true);
    expect(immutableTail.byteLength).toBe(immutableTailBytes);
    expect(
      crypto.createHash('sha256').update(immutableTail).digest('hex'),
    ).toBe(immutableTailSha256);
  });

  it('ends the localized prefix with exactly the required blank-line boundary', () => {
    expect(q1CharacterIndex).toBeGreaterThan(0);
    expect(rawPrefix.endsWith('\n\n')).toBe(true);
    expect(bodyPrefix.endsWith('\n\n')).toBe(true);
  });

  it('uses the exact contracted frontmatter and sole matching H1', () => {
    expect(parsed.data).toEqual({
      title,
      url: sourceUrl,
      lastmod: '2026-07-26',
      date_display: 'September 13, 2025',
      read_time: '8 min read',
      categories: ['Taiwan Legal Information'],
      featured_image: featuredImage,
    });
    expect(
      Array.from(bodyPrefix.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
  });

  it('uses exactly two descriptive prefix images with the contracted paths', () => {
    expect(imageNodes.map(({ src }) => src)).toEqual([
      featuredImage,
      incidentImage,
    ]);
    expect(imageNodes[0]?.alt).toMatch(
      /(?:scene|site).{0,30}safety.{0,50}(?:evidence|proof).{0,20}(?:preservation|preserving)/i,
    );
    expect(imageNodes[0]?.alt).toMatch(/Taiwan.{0,20}traffic accident/i);
    expect(imageNodes[1]?.alt).toMatch(
      /(?:recording|documenting).{0,30}(?:vehicle|car).{0,20}positions?/i,
    );
    expect(imageNodes[1]?.alt).toMatch(
      /(?:road|scene).{0,20}(?:evidence|marks?|traces?)/i,
    );
    expect(countOccurrences(raw, featuredImage)).toBe(2);
    expect(countOccurrences(raw, incidentImage)).toBe(1);
  });

  it('introduces the contracted response sequence and fact-dependent caveat', () => {
    expect(introduction).toMatch(
      /(?:first|initially).{0,60}(?:secure|ensure|protect).{0,20}safety/is,
    );
    expect(introduction).toMatch(
      /(?:report|notification|notify).{0,80}(?:preserve|document|record).{0,25}evidence/is,
    );

    const sequence = [
      /(?:claim|filing).{0,20}(?:deadline|time limit|limitation)/i,
      /fault/i,
      /(?:scope|terms|extent).{0,20}(?:settlement|settling)|settlement.{0,20}(?:scope|terms|extent)/i,
    ];
    const positions = sequence.map((pattern) => introduction.search(pattern));
    for (const position of positions) {
      expect(position).toBeGreaterThanOrEqual(0);
    }
    expect(positions).toEqual([...positions].sort((a, b) => a - b));

    expect(introduction).toMatch(
      /(?:general|overall).{0,30}(?:sequence|order|steps|process).{0,50}Taiwan(?:ese)?.{0,10}law.{0,50}(?:official|government|public).{0,20}(?:guidance|information)/is,
    );
    expect(introduction).toMatch(
      /(?:responsibility|liability).{0,30}(?:procedure|process).{0,60}(?:depend|vary).{0,30}(?:facts|circumstances)/is,
    );
  });

  it('removes stale personal copy, foreign scripts, first-person prose, and invisible spacer lines', () => {
    for (const phrase of prohibitedStaleCopy) {
      expect(bodyPrefix).not.toContain(phrase);
    }
    expect(bodyPrefix).not.toMatch(/\p{Script=Hangul}/u);
    expect(bodyPrefix).not.toMatch(/\p{Script=Han}/u);
    expect(bodyPrefix).not.toMatch(
      /[\p{Script=Hiragana}\p{Script=Katakana}]/u,
    );
    expect(bodyPrefix).not.toMatch(/^[\t ]*\u200b+[\t ]*$/m);
    expect(visiblePrefixProse).not.toMatch(
      /\b(?:I|me|my|mine|myself)\b/i,
    );
  });
});
