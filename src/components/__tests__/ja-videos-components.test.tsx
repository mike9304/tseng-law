import { readFileSync } from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import AttorneyMediaHubView from '@/components/AttorneyMediaHubView';
import HomeAttorneySplit from '@/components/HomeAttorneySplit';
import VideoChannel from '@/components/VideoChannel';
import { attorneyProfiles } from '@/data/attorney-profiles';
import { pageCopy } from '@/data/page-copy';
import { siteContent } from '@/data/site-content';
import type { Locale } from '@/lib/locales';

describe('WO-I18N-P02 Japanese videos components', () => {
  it('renders the complete Japanese attorney media hub with localized links and all profile content', () => {
    const profile = attorneyProfiles.ja['wei-tseng'];
    const html = renderToStaticMarkup(
      <AttorneyMediaHubView locale="ja" columnCount={17} />,
    );

    expect(html).toContain('公開プロフィール');
    expect(html).toContain('曾雋崴弁護士のプロフィールと公開チャンネル');
    expect(html).toContain('対応言語');
    expect(html).toContain('主な取扱分野');
    expect(html).toContain('公開コラム');
    expect(html).toContain('公式・外部チャンネル');
    expect(html).toContain('公式プロフィール・チャンネル');
    expect(html).toContain('主な解説テーマ');
    expect(html).toContain('主な取扱実績');
    expect(html).toContain('曾雋崴弁護士のプロフィールを見る');
    expect(html).toContain('メディア取材・法律相談のお問い合わせ');
    expect(html).toContain('>17<');
    expect(html).toContain('href="/ja/lawyers/wei-tseng"');
    expect(html).toContain('href="mailto:wei@hoveringlaw.com.tw?subject=');

    for (const item of profile.externalProfiles) {
      expect(html).toContain(item.label);
      expect(html).toContain(`href="${item.href}"`);
    }
    for (const item of profile.practiceAreas) {
      expect(html).toContain(item);
    }
    for (const item of profile.notableMatters) {
      expect(html).toContain(item);
    }
  });

  it('renders every Japanese public channel from site content, including the localized contact link', () => {
    const videos = siteContent.ja.videos;
    const html = renderToStaticMarkup(<VideoChannel locale="ja" />);

    expect(html).toContain(videos.label);
    expect(html).toContain(videos.title);
    expect(html).toContain(videos.description);
    expect(html).toContain(videos.featured.title);
    expect(html).toContain(`href="${videos.featured.href}"`);
    expect(html).toContain(videos.cta.label);
    expect(html).toContain(encodeURIComponent('/images/editorial/pingtung-court-daylight.webp'));
    expect(html).toContain('台湾の裁判所建築に着想を得た、明るい屏東の都市風景');
    expect(html).toContain(encodeURIComponent('/images/editorial/taiwan-courtroom-daylight.webp'));
    expect(html).toContain('台湾の法廷空間に着想を得て演出した、明るい室内風景');
    expect(html).toContain('data-video-mounted="false"');
    expect(html).not.toContain('<video');

    for (const item of videos.items) {
      expect(html).toContain(item.title);
      expect(html).toContain(`href="${item.href}"`);
    }
    expect(html).toContain('href="/ja/contact"');
  });

  it.each([
    ['ko', '증준외 변호사 프로필과 공개 채널'],
    ['zh-hant', '曾雋崴律師公開簡介與頻道'],
    ['en', 'Attorney Wei Tseng profile, channels, and focus topics'],
  ] as const)('preserves the %s media hub and video copy', (locale, mediaTitle) => {
    const mediaHtml = renderToStaticMarkup(
      <AttorneyMediaHubView locale={locale} columnCount={17} />,
    );
    const videoHtml = renderToStaticMarkup(<VideoChannel locale={locale} />);

    expect(mediaHtml).toContain(mediaTitle);
    expect(videoHtml).toContain(siteContent[locale].videos.title);
    expect(videoHtml).toContain(siteContent[locale].videos.featured.title);
    expect(mediaHtml).toContain(`href="/${locale}/lawyers/wei-tseng"`);
    expect(mediaHtml).toContain('href="mailto:wei@hoveringlaw.com.tw?subject=');
  });

  it('keeps the canonical public name across home, media, and video copy without changing KO or EN titles', () => {
    const japaneseHome = renderToStaticMarkup(<HomeAttorneySplit locale="ja" />);
    const traditionalChineseHome = renderToStaticMarkup(<HomeAttorneySplit locale="zh-hant" />);
    const publicCopySources = [
      'src/data/site-content.ts',
      'src/data/page-copy.ts',
      'src/components/HomeAttorneySplit.tsx',
      'src/components/AttorneyMediaHubView.tsx',
      'src/app/[locale]/videos/page.tsx',
    ].map((file) => readFileSync(path.join(process.cwd(), file), 'utf8'));

    expect(japaneseHome).toContain('曾雋崴弁護士 — 韓国のお客様のための台湾法務パートナー');
    expect(traditionalChineseHome).toContain('曾雋崴律師，專注服務韓國客戶的台灣法律夥伴');
    expect(JSON.stringify(siteContent)).not.toContain('曾俊瑋');
    expect(JSON.stringify(pageCopy)).not.toContain('曾俊瑋');
    for (const source of publicCopySources) {
      expect(source).not.toContain('曾俊瑋');
    }
    expect(pageCopy.ko.videos.title).toBe('증준외 변호사 미디어·채널');
    expect(pageCopy.en.videos.title).toBe('Attorney Wei Tseng Media / Channels');
  });

  it('keeps established builder locales assignable to both public components', () => {
    const locale: Locale = 'ko';

    expect(renderToStaticMarkup(<AttorneyMediaHubView locale={locale} columnCount={17} />))
      .toContain('증준외 변호사 프로필과 공개 채널');
    expect(renderToStaticMarkup(<VideoChannel locale={locale} />))
      .toContain(siteContent.ko.videos.title);
  });
});
