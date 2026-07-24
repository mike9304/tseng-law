import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getAllColumnPosts, getColumnPost } from '@/lib/columns';

const HANGUL = /[\uac00-\ud7af]/;
const root = process.cwd();
const koDir = path.join(root, 'src/content/columns');
const enDir = path.join(root, 'src/content/columns-en');
const gymColumnPath = path.join(enDir, '010-taiwan-gym-injury-lawsuit.md');
const CJK_SCRIPTS = /[\p{Script=Han}\p{Script=Hangul}\p{Script=Hiragana}\p{Script=Katakana}]/u;

const countOccurrences = (value: string, needle: string) => value.split(needle).length - 1;

const koFiles = fs
  .readdirSync(koDir)
  .filter((name) => name.endsWith('.md'))
  .sort();

describe('English full column corpus', () => {
  it('has one EN file per KO file with identical filenames', () => {
    expect(fs.existsSync(enDir)).toBe(true);
    const enFiles = fs.readdirSync(enDir).filter((name) => name.endsWith('.md')).sort();
    expect(enFiles).toEqual(koFiles);
  });

  it('loads 17 English posts with full bodies (not Overview stubs only)', () => {
    const posts = getAllColumnPosts('en');
    expect(posts).toHaveLength(17);

    for (const post of posts) {
      expect(post.title.trim().length).toBeGreaterThan(8);
      expect(post.content.length).toBeGreaterThan(800);
      expect(post.content).not.toMatch(/^## Overview\n[\s\S]*## Key Focus Areas\n[\s\S]*## Consultation\nFor a case-specific/);
      expect(HANGUL.test(post.title)).toBe(false);
      expect(HANGUL.test(post.content)).toBe(false);
      expect(post.dateDisplay).not.toMatch(/Date pending/i);
      expect(post.date).toBeTruthy();
      if (post.faq?.length) {
        for (const item of post.faq) {
          expect(HANGUL.test(item.q)).toBe(false);
          expect(HANGUL.test(item.a)).toBe(false);
        }
      }
    }
  });

  it('preserves FAQ count for known FAQ sources', () => {
    const faqSlugs = [
      'taiwan-company-establishment-basics',
      'withdraw-capital-taiwan-company',
      'taiwan-company-subsidiary-vs-branch',
      'taiwan-labor-severance-law',
      'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
    ];
    for (const slug of faqSlugs) {
      const ko = getColumnPost(slug, 'ko');
      const en = getColumnPost(slug, 'en');
      expect(en?.faq?.length ?? 0).toBe(ko?.faq?.length ?? 0);
      expect((en?.faq?.length ?? 0) > 0).toBe(true);
    }
  });

  it('EN body is not dramatically shorter than KO for each slug', () => {
    for (const file of koFiles) {
      const slug = file.replace(/\.md$/, '').replace(/^\d{3}-/, '');
      const ko = getColumnPost(slug, 'ko');
      const en = getColumnPost(slug, 'en');
      expect(ko).toBeTruthy();
      expect(en).toBeTruthy();
      // Allow EN to be shorter, but not stub-level (< 35% of KO cleaned body)
      expect(en!.content.length).toBeGreaterThan(Math.floor(ko!.content.length * 0.35));
    }
  });

  it('keeps column 010 fully English, legally qualified, and source-link complete', () => {
    const raw = fs.readFileSync(gymColumnPath, 'utf8');
    const post = getColumnPost('taiwan-gym-injury-lawsuit', 'en');
    expect(post).toBeTruthy();

    const loadedPublicContent = `${post!.title}\n${post!.content}`;
    expect(raw).not.toMatch(CJK_SCRIPTS);
    expect(loadedPublicContent).not.toMatch(CJK_SCRIPTS);

    const mediaRecords = [
      {
        image: 'img-02.jpg',
        caption:
          'Male university student suffers a ruptured disc after deadlifting 90 kg and seeks damages from gym',
        url: 'https://tw.news.yahoo.com/%E7%94%B7%E5%A4%A7%E7%94%9F%E7%A1%AC%E8%88%8990%E5%85%AC%E6%96%A4-%E6%A4%8E%E9%96%93%E7%9B%A4%E7%A0%B4%E8%A3%82-%E6%80%92%E5%91%8A%E5%81%A5%E8%BA%AB%E6%88%BF%E6%B1%82%E5%84%9F-095800997.html',
      },
      {
        image: 'img-03.jpg',
        caption:
          'Korean male university student ruptures a disc while deadlifting 90 kg and is awarded TWD 1.57 million at first instance; Fitness Factory confirms settlement on appeal',
        url: 'https://www.ettoday.net/amp/amp_news.php7?news_id=2475272&ref=mw&from=google.com',
      },
      {
        image: 'img-04.jpg',
        caption:
          'Korean male university student injured while deadlifting 90 kg is awarded TWD 1.57 million at first instance; Fitness Factory settles on appeal',
        url: 'https://tw.news.yahoo.com/%E9%9F%93%E7%94%B7%E5%A4%A7%E7%94%9F-%E7%A1%AC%E8%88%8990%E5%85%AC%E6%96%A4-%E9%87%80%E5%82%B7%E7%8D%B2%E8%B3%A0157%E8%90%AC-%E5%81%A5%E8%BA%AB%E5%B7%A5%E5%BB%A0%E4%BA%8C%E5%AF%A9%E4%BD%8E%E8%AA%BF%E5%92%8C%E8%A7%A3-013448072.html',
      },
      {
        image: 'img-05.jpg',
        caption:
          'Male university student suffers a ruptured disc after deadlifting 90 kg and seeks damages from gym',
        url: 'https://news.ebc.net.tw/news/living/362075',
      },
      {
        image: 'img-06.jpg',
        caption:
          'PTT news: Korean male university student ruptures a disc while deadlifting 90 kg; Fitness Factory ordered to pay TWD 1.57 million at first instance',
        url: 'https://www.ptt.cc/bbs/MuscleBeach/M.1680935985.A.BF6.html',
      },
      {
        image: 'img-07.jpg',
        caption:
          "Blog: A 70 kg Korean male university student deadlifts 90 kg and ruptures a disc—more than TWD 1 million in damages? Was the gym at fault? What was the exerciser's mindset?",
        url: 'https://blog.udn.com/blackjack/179081715',
      },
      {
        image: 'img-08.jpg',
        caption:
          'Legal commentary: Male university student ruptures a disc while deadlifting; well-known gym ordered to pay TWD 1.57 million at first instance',
        url: 'https://lawdb.tw/2023/04/12/%E7%94%B7%E5%A4%A7%E7%94%9F%E7%B7%B4%E7%A1%AC%E8%88%89%E6%A4%8E%E9%96%93%E7%9B%A4%E7%A0%B4%E8%A3%82%EF%BC%8C%E7%9F%A5%E5%90%8D%E5%81%A5%E8%BA%AB%E6%88%BF%E5%88%A4%E8%B3%A0%EF%BC%91%EF%BC%95%EF%BC%97/',
      },
      {
        image: 'img-09.jpg',
        caption: 'Judgment review: Gym beginner asked to deadlift 90 kg, resulting in an acute disc rupture',
        url: 'https://www.instagram.com/p/Crp4vJag7v3/',
      },
      {
        image: 'img-10.jpg',
        caption:
          'Did a Korean male university student rupture a disc after deadlifting 90 kg during a personal-training session?',
      },
    ];
    const expectedCaptionOccurrences = new Map<string, number>();
    for (const { image, caption, url } of mediaRecords) {
      const imageMarkup = `![${caption}](../images/010-taiwan-gym-injury-lawsuit/${image})`;
      const mediaBlock = url
        ? `${imageMarkup}\n\n[${caption}](${url})`
        : `${imageMarkup}\n\n**${caption}**`;
      expect(raw).toContain(mediaBlock);
      if (url) {
        expect(loadedPublicContent).toContain(`[${caption}](${url})`);
      }
      expectedCaptionOccurrences.set(
        caption,
        (expectedCaptionOccurrences.get(caption) ?? 0) + 2,
      );
    }
    for (const [caption, occurrences] of expectedCaptionOccurrences) {
      expect(countOccurrences(raw, caption)).toBe(occurrences);
    }

    expect(countOccurrences(raw, 'featured-01.jpg')).toBe(2);
    for (let imageNumber = 1; imageNumber <= 10; imageNumber += 1) {
      expect(countOccurrences(raw, `img-${String(imageNumber).padStart(2, '0')}.jpg`)).toBe(1);
    }

    const preservedLinks = [
      'https://tw.news.yahoo.com/%E7%94%B7%E5%A4%A7%E7%94%9F%E7%A1%AC%E8%88%8990%E5%85%AC%E6%96%A4-%E6%A4%8E%E9%96%93%E7%9B%A4%E7%A0%B4%E8%A3%82-%E6%80%92%E5%91%8A%E5%81%A5%E8%BA%AB%E6%88%BF%E6%B1%82%E5%84%9F-095800997.html',
      'https://www.ettoday.net/amp/amp_news.php7?news_id=2475272&ref=mw&from=google.com',
      'https://tw.news.yahoo.com/%E9%9F%93%E7%94%B7%E5%A4%A7%E7%94%9F-%E7%A1%AC%E8%88%8990%E5%85%AC%E6%96%A4-%E9%87%80%E5%82%B7%E7%8D%B2%E8%B3%A0157%E8%90%AC-%E5%81%A5%E8%BA%AB%E5%B7%A5%E5%BB%A0%E4%BA%8C%E5%AF%A9%E4%BD%8E%E8%AA%BF%E5%92%8C%E8%A7%A3-013448072.html',
      'https://news.ebc.net.tw/news/living/362075',
      'https://www.ptt.cc/bbs/MuscleBeach/M.1680935985.A.BF6.html',
      'https://blog.udn.com/blackjack/179081715',
      'https://lawdb.tw/2023/04/12/%E7%94%B7%E5%A4%A7%E7%94%9F%E7%B7%B4%E7%A1%AC%E8%88%89%E6%A4%8E%E9%96%93%E7%9B%A4%E7%A0%B4%E8%A3%82%EF%BC%8C%E7%9F%A5%E5%90%8D%E5%81%A5%E8%BA%AB%E6%88%BF%E5%88%A4%E8%B3%A0%EF%BC%91%EF%BC%95%EF%BC%97/',
      'https://www.instagram.com/p/Crp4vJag7v3/',
      '/en/taiwan-litigation-lawyer',
      '/en/korean-lawyer-in-taiwan',
      '/en/taiwan-lawyer',
    ];
    for (const link of preservedLinks) {
      expect(countOccurrences(raw, link)).toBe(1);
    }
    expect(raw).not.toContain('[![');
    expect(loadedPublicContent).not.toMatch(/\[https?:\/\/[^\]]+\]\(https?:\/\/[^)]+\)/i);

    expect(raw).toContain(
      'The first-instance court awarded TWD 1,570,000 in damages. The parties later reached a settlement on appeal.',
    );
    expect(raw).toContain(
      'It is a case in which **a Korean university student sought damages from a fitness chain operated by a publicly listed company in Taiwan**.',
    );
    expect(raw).not.toMatch(/\bsettlement (?:amount|of|for)\b[^\n]*\bTWD\b/i);

    const officialLawLinks = [
      'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=287&pcode=C0000001',
      'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=237&pcode=C0010001',
      'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=197&pcode=B0000001',
      'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=51&pcode=J0170001',
    ];
    for (const link of officialLawLinks) {
      expect(countOccurrences(raw, link)).toBe(1);
    }
    expect(raw).toContain("within six months after learning the offender's identity");
    expect(raw).toContain(
      'within two years after the claimant learns of both the injury and the person liable',
    );
    expect(raw).toContain('A ten-year longstop runs from the wrongful act.');

    expect(raw.match(/^read_time:\s*"([^"]+)"$/m)?.[1]).toBe('6 min read');
    expect(raw).not.toContain('Civil Code Article 198');
    expect(raw).not.toMatch(/\b(?:win|won|victory|guarantee)\b/i);

    const forbiddenClaims = [
      'Koreans are very fond',
      'Taiwanese consumers often have a weaker',
      'almost impossible',
      'gym will refuse',
      'prevent the gym from destroying',
      'police can obtain',
      "until the plaintiff's retirement",
      'Taiwan gyms are usually insured',
      'insurers are often unwilling',
      'Be sure to pursue litigation',
    ];
    for (const claim of forbiddenClaims) {
      expect(raw).not.toContain(claim);
    }
  });
});
