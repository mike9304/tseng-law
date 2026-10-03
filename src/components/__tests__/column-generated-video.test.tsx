import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ColumnGeneratedVideo from '@/components/ColumnGeneratedVideo';
import { getColumnGeneratedVideo } from '@/data/column-generated-videos';
import generalAccidentCaptions from '@/data/general-accident-video-captions.json';
import overtakingCaptions from '@/data/overtaking-video-captions.json';
import businessPremisesCaptions from '@/data/business-premises-video-captions.json';
import logisticsCaptions from '@/data/logistics-video-captions.json';

describe('reviewed column videos', () => {
  it.each(Object.entries(logisticsCaptions))('keeps the logistics scene and %s caption on the reviewed logistics column', (locale, caption) => {
    const slug = 'taiwan-logistics-business-setup';
    const assetLocale = ['ko', 'en', 'zh-hant', 'ja'].includes(locale) ? locale : 'en';
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale={locale} slug={slug} />);
    expect(html).toContain(`logistics-dock-v1-${assetLocale}.mp4`);
    for (const value of Object.values(caption)) expect(html).toContain(renderToStaticMarkup(<>{value}</>));
    expect(html).toContain('controls=""');
    expect(html).not.toMatch(/autoplay|loop=/i);
    expect(getColumnGeneratedVideo(locale, slug, 'issue')).toBeNull();
    expect(getColumnGeneratedVideo('eo', slug)).toBeNull();
  });
  it('renders the reviewed local clip with controls, description and an AI disclosure', () => {
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale="ko" slug="taiwan-traffic-accident-procedure" />);
    expect(html).toContain('<video');
    expect(html).toContain('controls=""');
    expect(html).toContain('playsinline=""');
    expect(html).not.toMatch(/autoplay/i);
    expect(html).not.toContain('loop=');
    expect(html).toContain('preload="none"');
    expect(html).toContain('src="/videos/columns/traffic-procedure-film-v1-ko.mp4"');
    expect(html).not.toContain('<iframe');
    expect(html).toContain('실제 사고 기록이 아닙니다');
    const describedBy = html.match(/aria-describedby="([^"]+)"/)![1];
    expect(html).toContain(`id="${describedBy}"`);
  });

  it('does not attach a video to an unreviewed language, article or issue with the same slug', () => {
    expect(getColumnGeneratedVideo('eo', 'taiwan-traffic-accident-procedure')).toBeNull();
    expect(getColumnGeneratedVideo('eo', 'taiwan-accident-police-records')).toBeNull();
    expect(getColumnGeneratedVideo('ko', 'taiwan-traffic-accident-procedure', 'issue')).toBeNull();
    expect(renderToStaticMarkup(<ColumnGeneratedVideo locale="ko" slug="unrelated-article" />)).toBe('');
  });

  it.each(Object.entries(generalAccidentCaptions))('serves the reviewed shared scene with the %s caption only on the general article', (locale, caption) => {
    const slug = 'taiwan-traffic-accident-procedure';
    const asset = getColumnGeneratedVideo(locale, slug);
    expect(asset?.src).toBe('/videos/columns/rear-end-simulation-v3-en.mp4');
    expect(asset?.title).toBe(caption.title);
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale={locale} slug={slug} />);
    expect(html).toContain('data-column-video-disclosure');
    expect(html).not.toMatch(/autoplay|loop=/i);
    expect(html).toContain('aria-describedby="column-video-rear-end-simulation-v3-en-caption"');
    expect(html).not.toContain('This is a fictional AI-generated scene');
    expect(getColumnGeneratedVideo(locale, slug, 'issue')).toBeNull();
    expect(getColumnGeneratedVideo(locale, 'taiwan-accident-police-records')?.src).not.toBe(asset?.src);
  });

  it.each(Object.entries(overtakingCaptions).filter(([locale]) => !['ko', 'en', 'zh-hant', 'ja'].includes(locale)))('renders the overtaking illustration with its %s caption without applying it to other content', (locale, caption) => {
    const slug = 'taiwan-overtaking-accident-liability';
    const assetLocale = ['ko', 'en', 'zh-hant', 'ja'].includes(locale) ? locale : 'en';
    const asset = getColumnGeneratedVideo(locale, slug);
    expect(asset?.src).toBe(`/videos/columns/overtaking-cutback-v2-${assetLocale}.mp4`);
    expect(asset?.disclosure).toBe(caption.disclosure);
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale={locale} slug={slug} />);
    expect(html).toContain(renderToStaticMarkup(<>{caption.title}</>));
    expect(html).toContain(renderToStaticMarkup(<>{caption.description}</>));
    expect(html).toContain(renderToStaticMarkup(<>{caption.disclosure}</>));
    expect(html).toContain('controls=""');
    expect(html).not.toMatch(/autoplay|loop=/i);
    expect(getColumnGeneratedVideo(locale, slug, 'issue')).toBeNull();
    expect(getColumnGeneratedVideo(locale, 'taiwan-accident-police-records')?.src).not.toBe(asset?.src);
    expect(getColumnGeneratedVideo('eo', slug)).toBeNull();
  });

  it.each([
    ['ko', '익명 오토바이 사고와 별개'],
    ['en', 'separate from the anonymous motorcycle case'],
    ['ja', '匿名のオートバイ事故とは別'],
    ['zh-hant', '並非重現本文匿名機車事故'],
  ])('serves one 100-second overtaking film with case boundaries and ten chapters in %s', (locale, disclosure) => {
    const slug = 'taiwan-overtaking-accident-liability';
    const asset = getColumnGeneratedVideo(locale, slug);
    expect(asset?.src).toBe(`/videos/columns/overtaking-evidence-film-v1-${locale}.mp4`);
    expect(asset?.durationSeconds).toBe(100);
    expect(asset?.sceneCount).toBe(10);
    expect(asset?.chapters?.map(chapter => chapter.start)).toEqual([0, 10, 20, 30, 40, 50, 60, 70, 80, 90]);
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale={locale} slug={slug} autoPlay />);
    expect(html.match(/<video/g)).toHaveLength(1);
    expect(html).toContain('controls=""');
    expect(html).toContain('muted=""');
    expect(html).toContain('data-column-video-chapter="1"');
    expect(html).toContain(disclosure);
    expect(html).not.toContain('loop=');
    expect(getColumnGeneratedVideo(locale, slug, 'issue')).toBeNull();
  });

  it.each([
    ['en', 'not actual accident footage'],
    ['zh-hant', '非真實事故影像'],
    ['ja', '実際の事故映像ではありません'],
    ['fr', 'Scène fictive générée par IA'],
    ['de', 'Fiktive, KI-generierte Szene'],
    ['es', 'Escena ficticia generada con IA'],
    ['pt', 'Cena fictícia gerada por IA'],
    ['it', 'Scena fittizia generata con IA'],
  ])('uses a reviewed %s label and caption on the general accident article', (locale, disclosure) => {
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale={locale} slug="taiwan-traffic-accident-procedure" />);
    const id = ['en', 'zh-hant', 'ja'].includes(locale) ? 'traffic-procedure-film-v1' : 'rear-end-simulation-v3';
    expect(html).toContain(`${id}-${locale}.mp4`);
    expect(html).toContain(disclosure);
    expect(html).not.toContain('실제 사고 기록');
  });

  it.each(['ko', 'en', 'zh-hant', 'ja'])('serves one assembled 80-second film with eight scenes in %s', locale => {
    const asset = getColumnGeneratedVideo(locale, 'taiwan-traffic-accident-procedure');
    expect(asset?.durationSeconds).toBe(80);
    expect(asset?.sceneCount).toBe(8);
    expect(asset?.src).toBe(`/videos/columns/traffic-procedure-film-v1-${locale}.mp4`);
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale={locale} slug="taiwan-traffic-accident-procedure" autoPlay />);
    expect(html.match(/<video/g)).toHaveLength(1);
    expect(html).toContain('preload="metadata"');
    expect(html).toContain('muted=""');
    expect(html).toContain('controls=""');
    expect(html).not.toContain('loop=');
    expect(html).toContain('data-column-video-chapter="1"');
    expect(html).toContain(asset?.chapters?.[0].title);
  });

  it.each([
    ['ko', '신베이 사건에서 두 차량이 접촉했다는 뜻이 아닙니다'],
    ['en', 'not court exhibits or reconstructions'],
    ['zh-hant', '不代表三重案曾發生兩車碰撞'],
  ])('keeps the left-turn collision separate from cited cases in %s', (locale, disclosure) => {
    const slug = 'taiwan-left-turn-vs-straight-motorcycle';
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale={locale} slug={slug} />);
    expect(html).toContain(`left-turn-film-v1-${locale}.mp4`);
    expect(html).toContain(disclosure);
    expect(getColumnGeneratedVideo('ja', slug)).toBeNull();
    expect(getColumnGeneratedVideo(locale, slug, 'issue')).toBeNull();
  });

  it.each([
    ['taiwan-bus-sudden-braking-passenger-carrier-liability', 'bus-passenger-film-v1-zh-hant', '未呈現車外原因或完整煞車過程'],
    ['taiwan-retaliatory-driving-rear-ended-intentional-injury', 'braking-scooter-v2-zh-hant', '不能用來認定故意、傷勢或責任比例'],
    ['taiwan-parking-wheelstop-latch-service-safety-causation', 'parking-facility-film-v1-zh-hant', '畫面中的車輪擋未被碰到'],
    ['taiwan-lane-change-side-rear-collision-liability', 'lane-change-film-v1-zh-hant', '橙色車'],
    ['taiwan-lowered-height-gantry-state-compensation-driver-fault', 'gantry-height-film-v1-zh-hant', '畫面未呈現事故前的高度調整或警示過程'],
    ['taiwan-flying-object-truck-origin-dashcam-evidence', 'flying-object-film-v1-zh-hant', '畫面未交代來源，也未呈現貨車掉落物品'],
    ['taiwan-chain-rear-end-first-impact-evidence', 'chain-rear-end-film-v1-zh-hant', '銀色中間車'],
    ['taiwan-roadside-starting-parking-exit-liability', 'roadside-start-film-v1-zh-hant', '橙色車'],
    ['taiwan-right-turn-car-straight-motorcycle-evidence', 'right-turn-film-v1-zh-hant', '機車'],
    ['taiwan-car-repair-cost-estimate-parts-depreciation', 'repair-cost-film-v1-zh-hant', '零件比較只是示意'],
    ['taiwan-car-repair-rental-cost-repair-period-evidence', 'rental-period-film-v1-zh-hant', '代步需要'],
    ['taiwan-mediation-delayed-injury-rescission', 'mediation-injury-film-v1-zh-hant', '新診斷不會讓已成立的調解自動失效'],
    ['taiwan-accident-assessment-secondary-cause-compensation-ratio', 'assessment-evidence-film-v1-zh-hant', '不能拿來估速'],
    ['taiwan-borrowed-car-owner-driver-key-custody-liability', 'borrowed-car-film-v1-zh-hant', '鎖櫃只是保管方式的示意，不是免責保證'],
    ['taiwan-motorcycle-passenger-compulsory-insurance-unlicensed-recourse', 'passenger-insurance-film-v1-zh-hant', '並非本文雨夜自摔事故的重建或原始證據'],
    ['taiwan-uninsured-settlement-excludes-compulsory-insurance-fund-deduction', 'uninsured-fund-film-v1-zh-hant', '約定金額不等於實際收款'],
    ['taiwan-accident-stop-dialogue-hit-and-run-evidence', 'stop-dialogue-film-v1-zh-hant', '不能證明沒有人受傷、已同意離場或已履行全部法定義務'],
    ['taiwan-truck-blocking-multiple-dashcam-evidence', 'truck-blocking-v2-zh-hant', '四組原始影像'],
    ['taiwan-car-door-opening-motorcycle-liability', 'door-opening-film-v1-zh-hant', '騎士失去平衡'],
    ['taiwan-gas-station-tanker-reversing-beeper-liability', 'tanker-reversing-film-v1-zh-hant', '非本文凌晨事故'],
    ['green-light-red-light-pedestrian-third-person', 'pedestrian-third-person-film-v1-zh-hant', '非本文夜間事故'],
    ['taiwan-flashing-red-yellow-intersection-liability', 'flashing-intersection-film-v1-zh-hant', '與文內兩段式示意圖是不同設定'],
  ])('keeps the scenario for %s on its reviewed article and language', (slug, id, detail) => {
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale="zh-hant" slug={slug} />);
    expect(html).toContain(`${id}.mp4`);
    expect(html).toContain(detail);
    expect(getColumnGeneratedVideo('en', slug)).toBeNull();
    expect(getColumnGeneratedVideo('zh-hant', slug, 'issue')).toBeNull();
  });

  it('keeps the short bus event followed by nine full explanatory scenes in one 94-second film', () => {
    const asset = getColumnGeneratedVideo('zh-hant', 'taiwan-bus-sudden-braking-passenger-carrier-liability');
    expect(asset?.durationSeconds).toBe(94);
    expect(asset?.sceneCount).toBe(10);
    expect(asset?.chapters?.map(chapter => chapter.start)).toEqual([0, 4, 14, 24, 34, 44, 54, 64, 74, 84]);
  });

  it.each(Object.entries(businessPremisesCaptions))('keeps the shared shop illustration and %s caption on the reviewed premises article', (locale, caption) => {
    const slug = 'taiwan-company-setup-pitch-location';
    const asset = getColumnGeneratedVideo(locale, slug);
    expect(asset?.src).toBe('/videos/columns/business-premises-v1-en.mp4');
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale={locale} slug={slug} />);
    for (const value of Object.values(caption)) expect(html).toContain(renderToStaticMarkup(<>{value}</>));
    expect(html).toContain('controls=""');
    expect(html).not.toMatch(/autoplay|loop=/i);
    expect(getColumnGeneratedVideo(locale, slug, 'issue')).toBeNull();
    expect(getColumnGeneratedVideo(locale, 'taiwan-accident-police-records')?.src).not.toBe(asset?.src);
    expect(getColumnGeneratedVideo('eo', slug)).toBeNull();
  });

  it.each([
    ['ko', '실제 임대 매물이 아닙니다'],
    ['en', 'not an actual rental listing'],
    ['zh-hant', '非實際出租物件'],
    ['ja', '実際の賃貸物件ではありません'],
  ])('labels the business-premises illustration correctly in %s', (locale, disclosure) => {
    const slug = 'taiwan-company-setup-pitch-location';
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale={locale} slug={slug} />);
    expect(html).toContain(`business-premises-v1-${locale}.mp4`);
    expect(html).toContain(disclosure);
    expect(html).not.toContain('accident footage');
    expect(getColumnGeneratedVideo('eo', slug)).toBeNull();
    expect(getColumnGeneratedVideo(locale, slug, 'issue')).toBeNull();
  });

  it.each(['ko', 'ja', 'en', 'zh-hant'])('preserves native looping and the manual component default for road-rage videos (%s)', (locale) => {
    const slug = 'taiwan-road-rage-freeway-cut-in-sentence-reduced';
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale={locale} slug={slug} />);
    expect(html).toContain(`road-rage-freeway-cut-in-sentence-reduced-v3-${locale}.mp4`);
    expect(html).toContain('loop=""');
    expect(html).toContain('controls=""');
    expect(html).toContain('preload="none"');
    expect(html).not.toMatch(/autoplay/i);
    expect(html).toContain('data-column-video-disclosure');
    expect(getColumnGeneratedVideo(locale, slug, 'issue')).toBeNull();
  });

  it.each(['ko', 'en', 'zh-hant', 'ja'])('serves a distinct 80-second police-records film in %s', locale => {
    const slug = 'taiwan-accident-police-records';
    const asset = getColumnGeneratedVideo(locale, slug);
    expect(asset?.src).toBe(`/videos/columns/police-records-film-v1-${locale}.mp4`);
    expect(asset?.durationSeconds).toBe(80);
    expect(asset?.chapters).toHaveLength(8);
    expect(asset?.chapters?.[7].start).toBe(70);
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale={locale} slug={slug} autoPlay />);
    expect(html.match(/<video/g)).toHaveLength(1);
    expect(html).toContain('data-column-video-chapter="1"');
    expect(html).toContain('data-column-video-disclosure');
    expect(getColumnGeneratedVideo(locale, slug, 'issue')).toBeNull();
    expect(getColumnGeneratedVideo('fr', slug)).toBeNull();
  });
});
