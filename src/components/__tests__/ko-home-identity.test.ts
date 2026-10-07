import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { KO_PRETENDARD_STYLESHEET } from '@/app/fonts';
import KoHero from '@/components/ko-home/KoHero';
import { KoColumns } from '@/components/ko-home/KoSections';
import { KO_LEDGER, KO_PROCESS, KO_SITUATIONS } from '@/components/ko-home/ko-home-content';
import { siteContent } from '@/data/site-content';

// ko home, Korean identity (2026-10-06). The site is advertising-sensitive: every visible line on the new ko home
// restates existing ko copy. These pins catch drift (review of 1ce4a31d: 「…로 진행합니다」 widened 「…로 상담/소통」).

function read(relative: string): string {
  return readFileSync(path.join(process.cwd(), relative), 'utf8');
}

describe('ko home copy provenance', () => {
  const koColumns = readdirSync(path.join(process.cwd(), 'src/content/columns'))
    .filter((name) => name.endsWith('.md'))
    .map((name) => read(`src/content/columns/${name}`))
    .join('\n');

  test.each(KO_LEDGER.map((row) => [row.ko, row.han]))('glossary pair %s(%s) is printed by a ko column', (ko, han) => {
    expect(koColumns).toContain(`${ko}(${han})`);
  });

  test('the consultation steps restate the contact, pricing, legal and hero copy', () => {
    // The copy keeps 「NT$ 3,000」 together with a no-break space; compare as plain spaces.
    const [inquiry, review, quote, retainer] = KO_PROCESS.map((step) => step.text.replace(/\u00a0/g, ' '));
    const contact = read('src/lib/consultation/public-contact.ts');
    const pricing = read('src/components/PricingCards.tsx');
    const legal = read('src/data/legal-pages.ts');
    const site = read('src/data/site-content.ts');

    expect(contact).toContain('사건 또는 업무의 개요와 연락처');
    expect(inquiry).toContain('사건 또는 업무의 개요와 연락처');
    expect(contact).toContain('담당 변호사의 별도 안내 후');
    expect(inquiry).toContain('담당 변호사의 별도 안내 후');

    for (const fragment of ['사건 내용을 확인한 후 견적을 안내드립니다', '사건의 특성·복합성·긴급도에 따라 변동될 수 있습니다']) {
      expect(pricing).toContain(fragment);
      expect(review).toContain(fragment);
    }
    expect(pricing).toMatch(/price: 'NT\$ 3,000',\s*unit: '\/ 1시간'/);
    expect(review).toContain('NT$ 3,000 / 1시간');

    expect(pricing).toContain('정확한 비용은 초기 상담 후 서면 견적으로 안내드립니다');
    expect(quote).toBe('정확한 비용은 초기 상담 후 서면 견적으로 안내드립니다.');

    expect(legal).toContain('정식 자문 또는 수임은 별도의 검토와 동의 절차가 완료된 경우에만 성립합니다.');
    expect(retainer).toContain('정식 자문 또는 수임은 별도의 검토와 동의 절차가 완료된 경우에만 성립합니다.');
    // Languages are for consultation and communication (hero subtitle), never a promise about how a matter is run.
    expect(site).toContain('한국어·중국어·일본어·영어로 소통하며');
    expect(retainer).toContain('한국어·중국어·일본어·영어로 소통합니다');
    expect(retainer).not.toMatch(/로 진행합니다/);
  });
});

describe('ko home first screen and situations', () => {
  test('the h1 is the ko hero title (only the line break is the design)', () => {
    const markup = renderToStaticMarkup(KoHero());
    const h1 = /<h1\b[^>]*>([\s\S]*?)<\/h1>/.exec(markup)?.[1] ?? '';
    expect(h1.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()).toBe(siteContent.ko.hero.title);
  });

  test('each situation names only matters the ko service descriptions name', () => {
    const services = siteContent.ko.services.items.map((item) => item.description).join('\n');
    const terms = [
      ['법인 형태 선택', '투자심의위원회 승인', '업종별 인허가', '상표 선등록 확인'],
      ['계약 분쟁', '손해배상', '소비자 피해', '수사 대응'],
      ['이혼', '재산분할', '친권', '상속'],
    ];
    KO_SITUATIONS.forEach((situation, index) => {
      for (const term of terms[index]) {
        expect(situation.text).toContain(term);
        expect(services).toContain(term);
      }
    });
    // Pinned verbatim: a word added to a situation must come through review here, next to its source terms above.
    expect(KO_SITUATIONS.map((situation) => situation.text)).toEqual([
      '법인 형태 선택부터 투자심의위원회 승인, 업종별 인허가, 상표 선등록 확인까지.',
      '계약 분쟁과 손해배상, 소비자 피해, 형사 절차의 수사 대응.',
      '이혼과 재산분할, 친권, 상속.',
    ]);
  });
});

describe('ko home columns grid and hero photo', () => {
  const post = (slug: string, publicationDate: string, lastmod: string, audience?: string[]) => ({
    slug,
    title: `제목 ${slug}·부제`,
    date: lastmod,
    publicationDate,
    dateDisplay: `표시 ${publicationDate}`,
    readTime: '3분',
    categoryLabel: '법률정보',
    featuredImage: '/images/example.webp',
    summary: '요약',
    ...(audience ? { audience } : {}),
  });

  test('six columns: recommended to Korean readers first, then newest by publication date (not lastmod)', () => {
    const posts = [
      post('old-but-touched', '2026-09-01', '2026-10-07'),
      post('n1', '2026-10-06', '2026-10-06'),
      post('n2', '2026-10-05', '2026-10-05'),
      post('n3', '2026-10-04', '2026-10-04'),
      post('n4', '2026-10-03', '2026-10-03'),
      post('n5', '2026-10-02', '2026-10-02'),
      post('n6', '2026-10-01', '2026-10-01'),
      post('ko-pick', '2026-08-01', '2026-08-01', ['ko']),
    ];
    const markup = renderToStaticMarkup(KoColumns({ posts }));
    const slugs = [...markup.matchAll(/href="\/ko\/columns\/([^"]+)"/g)].map((match) => match[1]);
    expect(slugs).toEqual(['ko-pick', 'n1', 'n2', 'n3', 'n4', 'n5']);
    expect(markup).toContain('id="insights"');
    // The machine date is the publication date the tile shows, not the last-modified date.
    expect(markup).toContain('dateTime="2026-10-06">표시 2026-10-06</time>');
    expect(markup).not.toContain('dateTime="2026-10-07"');
    // Titles are typeset (the 「X·」 pair kept together), like the archive cards.
    expect(markup).toMatch(/<span[^>]*white-space:\s*nowrap[^>]*>[^<]*·<\/span>/);
  });

  test('no columns, no section (and no #insights landmark)', () => {
    expect(KoColumns({ posts: [] })).toBeNull();
  });

  test('the hero photograph is loaded first (next/image priority), not lazily', () => {
    const markup = renderToStaticMarkup(KoHero());
    const img = /<img[^>]*hero-taipei-101-blue-hour[^>]*>/.exec(markup)?.[0] ?? '';
    expect(img).not.toBe('');
    // Without `priority` next/image renders loading="lazy" (and no preload); the test renderer (React 18) prints no
    // fetchpriority, so the lazy flag is the guard.
    expect(img).not.toContain('loading="lazy"');
  });
});

describe('ko identity stays out of zh-hant', () => {
  test('the zh-hant home module no longer styles the ko home', () => {
    expect(read('src/components/ZhHantDesign.module.css')).not.toContain('ko-home');
  });
});

describe('ko Pretendard sheet', () => {
  const file = path.join(process.cwd(), 'public', KO_PRETENDARD_STYLESHEET);
  const css = readFileSync(file, 'utf8');

  test('is content-hashed (/fonts is served immutable)', () => {
    const hash = /pretendard-([0-9a-f]{12})\.css$/.exec(KO_PRETENDARD_STYLESHEET)?.[1];
    expect(hash).toBe(createHash('sha256').update(css).digest('hex').slice(0, 12));
  });

  test('references only woff2 slices that ship in the same versioned folder', () => {
    const urls = [...css.matchAll(/url\(([^)]+)\)/g)].map((match) => match[1]);
    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) {
      expect(url.startsWith('/fonts/pretendard-1.3.9/')).toBe(true);
      expect(existsSync(path.join(process.cwd(), 'public', url))).toBe(true);
    }
  });

  test('declares no CJK ideograph ranges, so a 漢字 word is never split across two faces', () => {
    const ideographs = [[0x2e80, 0x2fdf], [0x3400, 0x4dbf], [0x4e00, 0x9fff], [0xf900, 0xfaff], [0x20000, 0x3ffff]];
    for (const match of css.matchAll(/unicode-range:\s*([^;]+);/g)) {
      for (const part of match[1].split(',')) {
        const [lo, hi = lo] = part.trim().slice(2).split('-').map((hex) => parseInt(hex, 16));
        for (const [a, b] of ideographs) expect(hi < a || lo > b).toBe(true);
      }
    }
  });
});
