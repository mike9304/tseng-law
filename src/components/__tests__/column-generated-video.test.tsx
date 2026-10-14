import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ColumnGeneratedVideo from '@/components/ColumnGeneratedVideo';
import { getColumnGeneratedVideo } from '@/data/column-generated-videos';
import generalAccidentCaptions from '@/data/general-accident-video-captions.json';
import overtakingCaptions from '@/data/overtaking-video-captions.json';
import businessPremisesCaptions from '@/data/business-premises-video-captions.json';
import logisticsCaptions from '@/data/logistics-video-captions.json';
import cosmeticsCheckCaptions from '@/data/cosmetics-check-video-captions.json';

describe('reviewed column scenes', () => {
  it.each([
    ['ko', '실제 사고 기록이 아닙니다'],
    ['en', 'not actual accident footage'],
    ['ja', '実際の事故映像ではありません'],
    ['zh-hant', '非真實事故影像'],
    ['fr', 'Scène fictive générée par IA'],
    ['de', 'Fiktive, KI-generierte Szene'],
    ['es', 'Escena ficticia generada con IA'],
    ['pt', 'Cena fictícia gerada por IA'],
    ['it', 'Scena fittizia generata con IA'],
  ])('keeps the native collision asset and AI disclosure in %s', (locale, disclosure) => {
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale={locale} slug="taiwan-traffic-accident-procedure" autoPlay />);
    expect(html.match(/<video\b/g)).toHaveLength(1);
    expect(html).toContain(`/videos/columns/rear-end-simulation-v3-${locale}.mp4`);
    expect(html).toContain(disclosure);
    expect(html).toContain('preload="metadata"');
    expect(html).toContain('muted=""');
    expect(html).not.toContain('data-column-video-chapter');
  });

  it.each(['ko', 'en', 'ja', 'zh-hant'])('keeps both reviewed chase scenes accessible in %s', locale => {
    const slug = 'taiwan-road-rage-freeway-chase-own-dashcam-too';
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale={locale} slug={slug} />);
    expect(html.match(/<video\b/g)).toHaveLength(2);
    for (const id of [`road-rage-freeway-chase-own-dashcam-too-v3-${locale}`, `own-dashcam-cut-in-v2-${locale}`]) {
      expect(html).toContain(`/videos/columns/${id}.mp4`);
      expect(html).toContain(`aria-describedby="column-video-${id}-caption"`);
      expect(html).toContain(`id="column-video-${id}-caption"`);
    }
    expect(html).not.toMatch(/autoplay/i);
    expect(renderToStaticMarkup(<ColumnGeneratedVideo locale="fr" slug={slug} />)).toBe('');
    expect(renderToStaticMarkup(<ColumnGeneratedVideo locale={locale} slug={slug} source="issue" />)).toBe('');
  });

  it.each([
    ['ko', '판결이나 비접촉 사고를 재현한 영상이 아닙니다'],
    ['en', 'not a reconstruction of any judgment'],
    ['zh-hant', '未重現本文任何判決'],
  ])('keeps the left-turn scene separate from the cited cases in %s', (locale, disclosure) => {
    const slug = 'taiwan-left-turn-vs-straight-motorcycle';
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale={locale} slug={slug} />);
    expect(html).toContain(`/videos/columns/left-turn-scooter-v1-${locale}.mp4`);
    expect(html).toContain(disclosure);
    expect(getColumnGeneratedVideo('ja', slug)).toBeNull();
    expect(getColumnGeneratedVideo(locale, slug, 'issue')).toBeNull();
  });

  it.each([
    ['taiwan-bus-stop-illegal-parking-no-contact-criminal-causation', 'bus-stop-v2-zh-hant'],
    ['taiwan-motorway-blocking-no-collision-public-danger', 'motorway-brake-v2-zh-hant'],
    ['taiwan-ambulance-red-light-emergency-priority-negligence', 'ambulance-scooter-v6-zh-hant'],
    ['taiwan-bus-sudden-braking-passenger-carrier-liability', 'bus-braking-v4-zh-hant'],
    ['taiwan-retaliatory-driving-rear-ended-intentional-injury', 'braking-scooter-v2-zh-hant'],
    ['taiwan-parking-wheelstop-latch-service-safety-causation', 'parking-contact-v1-zh-hant'],
    ['taiwan-lane-change-side-rear-collision-liability', 'lane-change-v3-zh-hant'],
    ['taiwan-lowered-height-gantry-state-compensation-driver-fault', 'gantry-impact-v1-zh-hant'],
    ['taiwan-flying-object-truck-origin-dashcam-evidence', 'flying-metal-v4-zh-hant'],
    ['taiwan-chain-rear-end-first-impact-evidence', 'chain-rear-end-v2-zh-hant'],
    ['taiwan-roadside-starting-parking-exit-liability', 'roadside-start-v3-zh-hant'],
    ['taiwan-right-turn-car-straight-motorcycle-evidence', 'right-turn-scooter-v2-zh-hant'],
    ['taiwan-car-repair-cost-estimate-parts-depreciation', 'repair-workshop-v1-zh-hant'],
    ['taiwan-car-repair-rental-cost-repair-period-evidence', 'repair-workshop-v1-zh-hant'],
    ['taiwan-borrowed-car-owner-driver-key-custody-liability', 'key-custody-v1-zh-hant'],
    ['taiwan-motorcycle-passenger-compulsory-insurance-unlicensed-recourse', 'passenger-skid-v4-zh-hant'],
    ['taiwan-uninsured-settlement-excludes-compulsory-insurance-fund-deduction', 'settlement-records-v1-zh-hant'],
    ['taiwan-accident-stop-dialogue-hit-and-run-evidence', 'stop-dialogue-v1-zh-hant'],
    ['taiwan-truck-blocking-multiple-dashcam-evidence', 'truck-blocking-v2-zh-hant'],
    ['taiwan-car-door-opening-motorcycle-liability', 'car-door-v2-zh-hant'],
    ['taiwan-gas-station-tanker-reversing-beeper-liability', 'tanker-reversing-v1-zh-hant'],
    ['green-light-red-light-pedestrian-third-person', 'pedestrian-third-person-v1-zh-hant'],
    ['taiwan-flashing-red-yellow-intersection-liability', 'flashing-intersection-v1-zh-hant'],
  ])('retains the reviewed scene only on its native article: %s', (slug, id) => {
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale="zh-hant" slug={slug} />);
    expect(html.match(/<video\b/g)).toHaveLength(1);
    expect(html).toContain(`/videos/columns/${id}.mp4`);
    expect(html).toContain('data-column-video-disclosure');
    expect(getColumnGeneratedVideo('en', slug)).toBeNull();
    expect(getColumnGeneratedVideo('zh-hant', slug, 'issue')).toBeNull();
  });

  it.each([
    'taiwan-repaired-car-diminished-value-appraisal-evidence',
    'taiwan-mediation-delayed-injury-rescission',
    'taiwan-accident-assessment-secondary-cause-compensation-ratio',
  ])('does not substitute an unrelated scene after retiring the summary of %s', slug => {
    expect(getColumnGeneratedVideo('zh-hant', slug)).toBeNull();
    expect(renderToStaticMarkup(<ColumnGeneratedVideo locale="zh-hant" slug={slug} />)).toBe('');
  });
  it.each(Object.entries(cosmeticsCheckCaptions))('keeps the cosmetics scene and %s caption on the reviewed cosmetics column', (locale, caption) => {
    const slug = 'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide';
    const assetLocale = ['ko', 'en', 'zh-hant', 'ja'].includes(locale) ? locale : 'en';
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale={locale} slug={slug} />);
    expect(html).toContain(`cosmetics-check-v1-${assetLocale}.mp4`);
    for (const value of Object.values(caption)) expect(html).toContain(renderToStaticMarkup(<>{value}</>));
    expect(html).toContain('controls=""');
    expect(html).not.toMatch(/autoplay|loop=/i);
    expect(getColumnGeneratedVideo(locale, slug, 'issue')).toBeNull();
    expect(getColumnGeneratedVideo('eo', slug)).toBeNull();
  });


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
    expect(html).toContain('src="/videos/columns/rear-end-simulation-v3-ko.mp4"');
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


  it.each(Object.entries(overtakingCaptions))('renders the overtaking illustration with its %s caption without applying it to other content', (locale, caption) => {
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

});
