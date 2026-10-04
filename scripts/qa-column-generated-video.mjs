import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from '@playwright/test';

const base = process.env.COLUMN_VIDEO_QA_BASE || 'http://127.0.0.1:4548';
const out = process.env.COLUMN_VIDEO_QA_OUT || '/tmp/column-generated-video-qa';
const generalAccidentCaptions = JSON.parse(await fs.readFile(new URL('../src/data/general-accident-video-captions.json', import.meta.url), 'utf8'));
const overtakingCaptions = JSON.parse(await fs.readFile(new URL('../src/data/overtaking-video-captions.json', import.meta.url), 'utf8'));
const businessPremisesCaptions = JSON.parse(await fs.readFile(new URL('../src/data/business-premises-video-captions.json', import.meta.url), 'utf8'));
const logisticsCaptions = JSON.parse(await fs.readFile(new URL('../src/data/logistics-video-captions.json', import.meta.url), 'utf8'));
const precisionPartsCaptions = JSON.parse(await fs.readFile(new URL('../src/data/precision-parts-video-captions.json', import.meta.url), 'utf8'));
const gymPauseCaptions = JSON.parse(await fs.readFile(new URL('../src/data/gym-pause-video-captions.json', import.meta.url), 'utf8'));
const formationDocumentsCaptions = JSON.parse(await fs.readFile(new URL('../src/data/formation-documents-video-captions.json', import.meta.url), 'utf8'));
const cosmeticsCheckCaptions = JSON.parse(await fs.readFile(new URL('../src/data/cosmetics-check-video-captions.json', import.meta.url), 'utf8'));
const branchModelsCaptions = JSON.parse(await fs.readFile(new URL('../src/data/branch-models-video-captions.json', import.meta.url), 'utf8'));
const familyCareCaptions = JSON.parse(await fs.readFile(new URL('../src/data/family-care-video-captions.json', import.meta.url), 'utf8'));
const workRecordsCaptions = JSON.parse(await fs.readFile(new URL('../src/data/work-records-video-captions.json', import.meta.url), 'utf8'));
const alleyBicycleCaptions = JSON.parse(await fs.readFile(new URL('../src/data/alley-bicycle-video-captions.json', import.meta.url), 'utf8'));
const potholeScooterCaptions = JSON.parse(await fs.readFile(new URL('../src/data/pothole-scooter-video-captions.json', import.meta.url), 'utf8'));
const passengerSkidCaptions = JSON.parse(await fs.readFile(new URL('../src/data/passenger-skid-video-captions.json', import.meta.url), 'utf8'));
const settlementRecordsCaptions = JSON.parse(await fs.readFile(new URL('../src/data/settlement-records-video-captions.json', import.meta.url), 'utf8'));
const stopDialogueCaptions = JSON.parse(await fs.readFile(new URL('../src/data/stop-dialogue-video-captions.json', import.meta.url), 'utf8'));
const keyCustodyCaptions = JSON.parse(await fs.readFile(new URL('../src/data/key-custody-video-captions.json', import.meta.url), 'utf8'));
const reverseDashcamCaptions = JSON.parse(await fs.readFile(new URL('../src/data/reverse-dashcam-video-captions.json', import.meta.url), 'utf8'));
const cutInDashcamCaptions = JSON.parse(await fs.readFile(new URL('../src/data/cut-in-dashcam-video-captions.json', import.meta.url), 'utf8'));
const batThreatLoopCaptions = JSON.parse(await fs.readFile(new URL('../src/data/bat-threat-loop-video-captions.json', import.meta.url), 'utf8'));
const laneBlockExitCaptions = JSON.parse(await fs.readFile(new URL('../src/data/lane-block-exit-video-captions.json', import.meta.url), 'utf8'));
const bridgeScooterBrakeCaptions = JSON.parse(await fs.readFile(new URL('../src/data/bridge-scooter-brake-video-captions.json', import.meta.url), 'utf8'));
const scooterLaneBlockCaptions = JSON.parse(await fs.readFile(new URL('../src/data/scooter-lane-block-video-captions.json', import.meta.url), 'utf8'));
const fastLaneStopCaptions = JSON.parse(await fs.readFile(new URL('../src/data/fast-lane-stop-video-captions.json', import.meta.url), 'utf8'));
const detachedTireImpactCaptions = JSON.parse(await fs.readFile(new URL('../src/data/detached-tire-impact-video-captions.json', import.meta.url), 'utf8'));
const warningTriangleRearEndCaptions = JSON.parse(await fs.readFile(new URL('../src/data/warning-triangle-rear-end-video-captions.json', import.meta.url), 'utf8'));
const ownDashcamCutInCaptions = JSON.parse(await fs.readFile(new URL('../src/data/own-dashcam-cut-in-video-captions.json', import.meta.url), 'utf8'));
const allCases = [
  // Preserve the original native looping clips beside the additional collision.
  {"locale": "ko", "slug": "taiwan-road-rage-freeway-chase-own-dashcam-too", "id": "road-rage-freeway-chase-own-dashcam-too-v3-ko", "duration": 15.041667, "contactTime": 7, "expectedDiagrams": 0, "loop": true, "disclosure": "AI"},
  {"locale": "en", "slug": "taiwan-road-rage-freeway-chase-own-dashcam-too", "id": "road-rage-freeway-chase-own-dashcam-too-v3-en", "duration": 15.041667, "contactTime": 7, "expectedDiagrams": 0, "loop": true, "disclosure": "AI"},
  {"locale": "ja", "slug": "taiwan-road-rage-freeway-chase-own-dashcam-too", "id": "road-rage-freeway-chase-own-dashcam-too-v3-ja", "duration": 15.041667, "contactTime": 7, "expectedDiagrams": 0, "loop": true, "disclosure": "AI"},
  {"locale": "zh-hant", "slug": "taiwan-road-rage-freeway-chase-own-dashcam-too", "id": "road-rage-freeway-chase-own-dashcam-too-v3-zh-hant", "duration": 15.041667, "contactTime": 7, "expectedDiagrams": 0, "loop": true, "disclosure": "AI"},
  ...Object.entries(ownDashcamCutInCaptions).map(([locale, caption]) => ({
    locale, slug: 'taiwan-road-rage-freeway-chase-own-dashcam-too',
    id: `own-dashcam-cut-in-v2-${locale}`,
    duration: 4.041667, contactTime: 0.666667, expectedDiagrams: 0,
    disclosure: caption.disclosure,
  })),
  { locale: 'zh-hant', slug: 'taiwan-freeway-warning-triangle-time-ability-evidence', id: 'warning-triangle-rear-end-v2-zh-hant', duration: 6.041667, contactTime: 1, expectedDiagrams: 0, disclosure: warningTriangleRearEndCaptions['zh-hant'].disclosure },
  { locale: 'zh-hant', slug: 'taiwan-detached-tire-delayed-treatment-criminal-injury-causation', id: 'detached-tire-impact-v3-zh-hant', duration: 6.041667, contactTime: 1, expectedDiagrams: 0, disclosure: detachedTireImpactCaptions['zh-hant'].disclosure },
  ...Object.entries(fastLaneStopCaptions).map(([locale, caption]) => ({
    locale, slug: 'taiwan-road-rage-driver-stopped-route-66s-fast-lane',
    id: `road-rage-driver-stopped-route-66s-fast-lane-v4-${locale}`,
    duration: 15.041667, contactTime: 10, expectedDiagrams: 0, loop: true,
    disclosure: caption.disclosure,
  })),
  ...Object.entries(scooterLaneBlockCaptions).map(([locale, caption]) => ({
    locale, slug: 'taiwan-road-rage-52-seconds-subtracted-case',
    id: `road-rage-52-seconds-subtracted-case-v4-${locale}`,
    duration: 15.041667, contactTime: 10, expectedDiagrams: 0, loop: true,
    disclosure: caption.disclosure,
  })),
  ...Object.entries(bridgeScooterBrakeCaptions).map(([locale, caption]) => ({
    locale, slug: 'taiwan-road-rage-two-second-stop-taipei-not-enough',
    id: `road-rage-two-second-stop-taipei-not-enough-v4-${locale}`,
    duration: 15.041667, contactTime: 10, expectedDiagrams: 0, loop: true,
    disclosure: caption.disclosure,
  })),
  ...Object.entries(laneBlockExitCaptions).map(([locale, caption]) => ({
    locale, slug: 'taiwan-road-rage-started-did-not-matter-driver-blocked',
    id: `road-rage-started-did-not-matter-driver-blocked-v4-${locale}`,
    duration: 15.041667, contactTime: 10, expectedDiagrams: 0, loop: true,
    disclosure: caption.disclosure,
  })),
  ...Object.entries(batThreatLoopCaptions).map(([locale, caption]) => ({
    locale, slug: 'taiwan-road-rage-baseball-bat-fracture-damages',
    id: `road-rage-baseball-bat-fracture-damages-v4-${locale}`,
    duration: 15.041667, contactTime: 4.5, expectedDiagrams: 0, loop: true,
    disclosure: caption.disclosure,
  })),
  ...Object.entries(cutInDashcamCaptions).map(([locale, caption]) => ({
    locale, slug: 'taiwan-road-rage-freeway-cut-in-sentence-reduced',
    id: `road-rage-freeway-cut-in-sentence-reduced-v4-${locale}`,
    duration: 15.041667, contactTime: 2, expectedDiagrams: 0, loop: true,
    disclosure: caption.disclosure,
  })),
  ...Object.entries(reverseDashcamCaptions).map(([locale, caption]) => ({
    locale, slug: 'taiwan-road-rage-reversing-into-tailgater-no-self-defense',
    id: `road-rage-reversing-into-tailgater-no-self-defense-v4-${locale}`,
    duration: 15.041667, contactTime: 26 / 24, expectedDiagrams: 0, loop: true,
    disclosure: caption.disclosure,
  })),
  { locale: 'zh-hant', slug: 'taiwan-accident-stop-dialogue-hit-and-run-evidence', id: 'stop-dialogue-v1-zh-hant', duration: 4, contactTime: 53 / 24, expectedDiagrams: 1, disclosure: stopDialogueCaptions['zh-hant'].disclosure },
  { locale: 'zh-hant', slug: 'taiwan-borrowed-car-owner-driver-key-custody-liability', id: 'key-custody-v1-zh-hant', duration: 4, contactTime: 65 / 24, expectedDiagrams: 0, disclosure: keyCustodyCaptions['zh-hant'].disclosure },
  { locale: 'zh-hant', slug: 'taiwan-motorcycle-passenger-compulsory-insurance-unlicensed-recourse', id: 'passenger-skid-v4-zh-hant', duration: 4, contactTime: 8 / 24, expectedDiagrams: 0, disclosure: passengerSkidCaptions['zh-hant'].disclosure },
  { locale: 'zh-hant', slug: 'taiwan-uninsured-settlement-excludes-compulsory-insurance-fund-deduction', id: 'settlement-records-v1-zh-hant', duration: 4, contactTime: 57 / 24, expectedDiagrams: 0, disclosure: settlementRecordsCaptions['zh-hant'].disclosure },
  { locale: 'zh-hant', slug: 'taiwan-video-timing-sidewalk-bicycle-alley-scooter-evidence', id: 'alley-bicycle-v2-zh-hant', duration: 4, contactTime: 7 / 24, expectedDiagrams: 0, disclosure: alleyBicycleCaptions['zh-hant'].disclosure },
  { locale: 'zh-hant', slug: 'taiwan-manhole-pothole-road-authority-utility-internal-recourse', id: 'pothole-scooter-v2-zh-hant', duration: 4, contactTime: 3 / 24, expectedDiagrams: 0, disclosure: potholeScooterCaptions['zh-hant'].disclosure },
  ...Object.entries(familyCareCaptions).map(([locale, caption]) => ({
    locale, slug: 'taiwan-accident-family-care-necessity-period', id: `family-care-v1-${locale}`,
    duration: 4, contactTime: 2.6, expectedDiagrams: 0, disclosure: caption.disclosure,
  })),
  ...Object.entries(workRecordsCaptions).map(([locale, caption]) => ({
    locale, slug: 'taiwan-car-accident-work-loss-rest-note', id: `work-records-v1-${locale}`,
    duration: 4, contactTime: 3.1, expectedDiagrams: 0, disclosure: caption.disclosure,
  })),
  ...Object.entries(branchModelsCaptions).map(([locale, caption]) => {
    const nativeLocale = ['ko', 'en', 'zh-hant', 'ja'].includes(locale);
    return {
      locale, slug: 'taiwan-company-subsidiary-vs-branch', id: `branch-models-v1-${nativeLocale ? locale : 'en'}`,
      evidenceStem: `branch-models-v1-${locale}`, duration: 6, contactTime: 4.5,
      traffic: false, trafficBoard: nativeLocale, minBodyImages: 3, disclosure: caption.disclosure,
    };
  }),
  { locale: 'zh-hant', slug: 'taiwan-motorway-blocking-no-collision-public-danger', id: 'motorway-brake-v2-zh-hant', duration: 4, contactTime: 0.9, expectedDiagrams: 0, disclosure: '不能用來判斷實際車速、距離、故意或刑事責任' },
  ...Object.entries(cosmeticsCheckCaptions).map(([locale, caption]) => {
    const nativeLocale = ['ko', 'en', 'zh-hant', 'ja'].includes(locale);
    return {
      locale, slug: 'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide', id: `cosmetics-check-v1-${nativeLocale ? locale : 'en'}`,
      evidenceStem: `cosmetics-check-v1-${locale}`, duration: 6, contactTime: 2.5,
      traffic: false, trafficBoard: nativeLocale, minBodyImages: 3, disclosure: caption.disclosure,
    };
  }),
  { locale: 'zh-hant', slug: 'taiwan-bus-stop-illegal-parking-no-contact-criminal-causation', id: 'bus-stop-v2-zh-hant', duration: 4, contactTime: 0.166667, expectedDiagrams: 0, disclosure: '不能據以認定違停、因果關係、刑責或賠償比例' },
  { locale: 'zh-hant', slug: 'taiwan-ambulance-red-light-emergency-priority-negligence', id: 'ambulance-scooter-v6-zh-hant', duration: 4, contactTime: 0.625, expectedDiagrams: 0, disclosure: '不能據以判斷優先通行權或肇事責任' },
  { locale: 'zh-hant', slug: 'taiwan-racing-no-contact-joint-tort-liability', id: 'adjacent-rear-end-v3-zh-hant', duration: 4, contactTime: 0.333333, expectedDiagrams: 0, disclosure: '不能用來認定競駛、因果關係或共同侵權責任' },
  ...Object.entries(formationDocumentsCaptions).map(([locale, caption]) => {
    const nativeLocale = ['ko', 'en', 'zh-hant', 'ja'].includes(locale);
    return {
      locale, slug: 'taiwan-company-establishment-basics', id: `formation-documents-v1-${nativeLocale ? locale : 'en'}`,
      evidenceStem: `formation-documents-v1-${locale}`, duration: 6, contactTime: 3.5,
      traffic: false, trafficBoard: nativeLocale, minBodyImages: 3, disclosure: caption.disclosure,
    };
  }),
  { locale: 'zh-hant', slug: 'taiwan-bus-sudden-braking-passenger-carrier-liability', id: 'bus-braking-v4-zh-hant', duration: 4, contactTime: 0.25, expectedDiagrams: 1, disclosure: '不能用來判斷傷勢、駕駛過失或客運公司的法律責任' },
  ...Object.entries(gymPauseCaptions).map(([locale, caption]) => {
    const nativeLocale = ['ko', 'en', 'zh-hant', 'ja'].includes(locale);
    return {
      locale, slug: 'taiwan-gym-injury-lawsuit', id: `gym-pause-v1-${nativeLocale ? locale : 'en'}`,
      evidenceStem: `gym-pause-v1-${locale}`, duration: 6, contactTime: 4.5,
      // The existing loader strips inline markdown images; this count covers
      // the three related-article images also present on the current public page.
      traffic: false, trafficBoard: nativeLocale, minBodyImages: 3, disclosure: caption.disclosure,
    };
  }),
  { locale: 'zh-hant', slug: 'taiwan-retaliatory-driving-rear-ended-intentional-injury', id: 'braking-scooter-v2-zh-hant', duration: 4, contactTime: 0.875, expectedDiagrams: 0, disclosure: '接觸與倒地動作不能用來認定故意、傷勢或責任比例' },
  ...Object.entries(precisionPartsCaptions).map(([locale, caption]) => {
    const nativeLocale = ['ko', 'en', 'zh-hant', 'ja'].includes(locale);
    return {
      locale, slug: 'taiwan-semiconductor-market-entry', id: `precision-parts-v1-${nativeLocale ? locale : 'en'}`,
      evidenceStem: `precision-parts-v1-${locale}`, duration: 6, contactTime: 4.5,
      traffic: false, trafficBoard: nativeLocale, minBodyImages: 2, disclosure: caption.disclosure,
    };
  }),
  { locale: 'zh-hant', slug: 'taiwan-parking-wheelstop-latch-service-safety-causation', id: 'parking-contact-v1-zh-hant', duration: 4, contactTime: 0.5, expectedDiagrams: 0, disclosure: '非本文先碰車輪擋、前移後再倒車的兩段操作重建' },
  ...Object.entries(logisticsCaptions).map(([locale, caption]) => {
    const nativeLocale = ['ko', 'en', 'zh-hant', 'ja'].includes(locale);
    return {
      locale, slug: 'taiwan-logistics-business-setup', id: `logistics-dock-v1-${nativeLocale ? locale : 'en'}`,
      evidenceStem: `logistics-dock-v1-${locale}`, duration: 6, contactTime: 4.6,
      traffic: false, trafficBoard: nativeLocale, minBodyImages: 2, disclosure: caption.disclosure,
    };
  }),
  { locale: 'zh-hant', slug: 'taiwan-flying-object-truck-origin-dashcam-evidence', id: 'flying-metal-v4-zh-hant', duration: 4, contactTime: 0.25, expectedDiagrams: 0, disclosure: '畫面未交代來源，也未呈現貨車掉落物品' },
  ...Object.entries(businessPremisesCaptions).map(([locale, caption]) => ({
    locale, slug: 'taiwan-company-setup-pitch-location', id: 'business-premises-v1-en',
    evidenceStem: `business-premises-v1-${locale}`, duration: 6, contactTime: 4.2,
    traffic: false, trafficBoard: false, disclosure: caption.disclosure,
  })),
  { locale: 'zh-hant', slug: 'taiwan-lowered-height-gantry-state-compensation-driver-fault', id: 'gantry-impact-v1-zh-hant', duration: 4, contactTime: 0.4, expectedDiagrams: 0, disclosure: '並非本文貨櫃車事故或現場設施的重建' },
  ...Object.entries(overtakingCaptions).map(([locale, caption]) => {
    const nativeLocale = ['ko', 'en', 'zh-hant', 'ja'].includes(locale);
    return {
      locale, slug: 'taiwan-overtaking-accident-liability',
      id: `overtaking-cutback-v2-${nativeLocale ? locale : 'en'}`,
      evidenceStem: `overtaking-cutback-v2-${locale}`, duration: 4, contactTime: 0.5,
      expectedDiagrams: nativeLocale ? 1 : 0, trafficBoard: nativeLocale,
      disclosure: caption.disclosure,
    };
  }),
  ...['ko', 'en', 'zh-hant', 'ja'].map(locale => ({
    locale, slug: 'taiwan-traffic-accident-procedure', id: `rear-end-simulation-v3-${locale}`,
    duration: 4, contactTime: 1.1,
    disclosure: { ko: 'AI로 만든 가상 장면', en: 'fictional AI-generated scene', 'zh-hant': 'AI生成的假想場景', ja: 'AIで作成した架空の場面' }[locale],
  })),
  ...['fr', 'de', 'es', 'pt', 'it'].map(locale => ({
    locale, slug: 'taiwan-traffic-accident-procedure', id: `rear-end-simulation-v3-${locale}`,
    duration: 4, contactTime: 1.1, expectedDiagrams: 0,
    // These file-backed column languages do not publish a traffic-board route.
    trafficBoard: false,
    disclosure: { fr: 'Scène fictive générée par IA', de: 'Fiktive, KI-generierte Szene', es: 'Escena ficticia generada con IA', pt: 'Cena fictícia gerada por IA', it: 'Scena fittizia generata con IA' }[locale],
  })),
  ...Object.entries(generalAccidentCaptions).map(([locale, caption]) => ({
    locale, slug: 'taiwan-traffic-accident-procedure', id: 'rear-end-simulation-v3-en',
    evidenceStem: `rear-end-v3-int-${locale}`, duration: 4, contactTime: 1.1,
    expectedDiagrams: 0, trafficBoard: false, disclosure: caption.disclosure,
  })),
  ...['ko', 'en', 'zh-hant'].map(locale => ({
    locale, slug: 'taiwan-left-turn-vs-straight-motorcycle', id: `left-turn-scooter-v1-${locale}`,
    duration: 4, contactTime: 1.2, expectedDiagrams: 1,
    disclosure: { ko: '비접촉 사고를 재현한 영상이 아닙니다', en: 'not a reconstruction of any judgment', 'zh-hant': '不是文中無接觸摔車案的重建' }[locale],
  })),
  { locale: 'zh-hant', slug: 'taiwan-flashing-red-yellow-intersection-liability', id: 'flashing-intersection-v1-zh-hant', duration: 4, contactTime: 1.2, expectedDiagrams: 1, disclosure: '與文內兩段式示意圖是不同設定' },
  { locale: 'zh-hant', slug: 'green-light-red-light-pedestrian-third-person', id: 'pedestrian-third-person-v1-zh-hant', duration: 4, contactTime: 1.15, expectedDiagrams: 0, disclosure: '非本文夜間事故或法院勘驗影像的重建' },
  { locale: 'zh-hant', slug: 'taiwan-gas-station-tanker-reversing-beeper-liability', id: 'tanker-reversing-v1-zh-hant', duration: 4, contactTime: 0.8, expectedDiagrams: 0, disclosure: '非本文凌晨事故或判決勘驗影像的重建' },
  { locale: 'zh-hant', slug: 'taiwan-lane-change-side-rear-collision-liability', id: 'lane-change-v3-zh-hant', duration: 4, contactTime: 0.85, disclosure: '非真實事故或本文判決的重建' },
  { locale: 'zh-hant', slug: 'taiwan-chain-rear-end-first-impact-evidence', id: 'chain-rear-end-v2-zh-hant', duration: 4, contactTime: 1.2, disclosure: '這只是「後車先碰中間車」的一種設定' },
  { locale: 'zh-hant', slug: 'taiwan-roadside-starting-parking-exit-liability', id: 'roadside-start-v3-zh-hant', duration: 4, contactTime: 0.6, disclosure: '非本文判決或真實事故的重建' },
  { locale: 'zh-hant', slug: 'taiwan-right-turn-car-straight-motorcycle-evidence', id: 'right-turn-scooter-v2-zh-hant', duration: 4, contactTime: 1.5, disclosure: '非真實事故或本文案件的重建' },
  { locale: 'zh-hant', slug: 'taiwan-car-repair-cost-estimate-parts-depreciation', id: 'repair-workshop-v1-zh-hant', evidenceStem: 'repair-cost-zh-hant', duration: 6, contactTime: 3, expectedDiagrams: 0, disclosure: '非本文判決車輛或真實受損紀錄' },
  { locale: 'zh-hant', slug: 'taiwan-car-repair-rental-cost-repair-period-evidence', id: 'repair-workshop-v1-zh-hant', evidenceStem: 'repair-period-zh-hant', duration: 6, contactTime: 3, expectedDiagrams: 0, disclosure: '非本文案件的車輛或維修紀錄' },
  { locale: 'zh-hant', slug: 'taiwan-truck-blocking-multiple-dashcam-evidence', id: 'truck-blocking-v2-zh-hant', duration: 4, contactTime: 0.6, expectedDiagrams: 0, disclosure: '非本文判決或四組原始影像的重建' },
  { locale: 'zh-hant', slug: 'taiwan-car-door-opening-motorcycle-liability', id: 'car-door-v2-zh-hant', duration: 4, contactTime: 1.6, disclosure: '非本文兩件判決的重建' },
  ...['ko', 'en', 'zh-hant', 'ja'].map(locale => ({
    locale, slug: 'taiwan-company-setup-pitch-location', id: `business-premises-v1-${locale}`,
    duration: 6, contactTime: 4.2, traffic: false,
    disclosure: { ko: '실제 임대 매물이 아닙니다', en: 'not an actual rental listing', 'zh-hant': '非實際出租物件', ja: '実際の賃貸物件ではありません' }[locale],
  })),
];
const selectedIds = new Set((process.env.COLUMN_VIDEO_QA_IDS || '').split(',').filter(Boolean));
for (const id of selectedIds) assert.ok(allCases.some(item => item.id === id), `Unknown video QA id: ${id}`);
const selectedLocales = new Set((process.env.COLUMN_VIDEO_QA_LOCALES || '').split(',').filter(Boolean));
for (const locale of selectedLocales) assert.ok(allCases.some(item => item.locale === locale), `Unknown video QA locale: ${locale}`);
const cases = allCases.filter(item => (!selectedIds.size || selectedIds.has(item.id)) && (!selectedLocales.size || selectedLocales.has(item.locale)));
assert.ok(cases.length > 0, 'No video QA cases selected');
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
const findings = [];

try {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', error => findings.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error' && /hydration|Minified React|unique.*key/i.test(message.text())) findings.push(message.text());
    });
    for (const item of cases) {
      const evidenceStem = item.evidenceStem || item.id;
      const article = `/${item.locale}/columns/${item.slug}`;
      const response = await page.goto(`${base}${article}`, { waitUntil: 'load' });
      assert.equal(response?.status(), 200);
      const heading = await page.locator('h1').innerText();
      const figure = page.locator(`[data-column-generated-video="${item.id}"]`);
      const video = figure.locator('video');
      await figure.scrollIntoViewIfNeeded();
      // Let the browser's native controls finish their initial loading animation.
      await page.waitForTimeout(5000);
      assert.equal(await figure.count(), 1);
      const initial = await video.evaluate(element => ({
        paused: element.paused, currentTime: element.currentTime, controls: element.controls,
        autoplay: element.autoplay, loop: element.loop, preload: element.preload,
        playsInline: element.playsInline, poster: element.poster, src: element.src,
        playbackRate: element.playbackRate,
      }));
      assert.equal(initial.paused, true);
      assert.equal(initial.currentTime, 0);
      assert.equal(initial.controls, true);
      assert.equal(initial.autoplay, false);
      assert.equal(initial.loop, item.loop === true);
      assert.equal(initial.preload, item.traffic === false ? 'none' : 'metadata');
      assert.equal(initial.playsInline, true);
      assert.equal(initial.playbackRate, 1);
      assert.equal(new URL(initial.src).origin, new URL(base).origin);
      assert.equal(new URL(initial.src).pathname, `/videos/columns/${item.id}.mp4`);
      assert.ok((await figure.innerText()).includes(item.disclosure));
      const poster = await page.request.get(initial.poster);
      assert.equal(poster.status(), 200);
      assert.match(poster.headers()['content-type'], /image\/jpeg/);
      await page.screenshot({ path: `${out}/${evidenceStem}-poster-${viewport.width}.png` });

      // Exercise the browser's native keyboard control, including reduced-motion mode.
      await video.focus();
      await video.press('Space');
      await page.waitForFunction(id => {
        const element = document.querySelector(`[data-column-generated-video="${id}"] video`);
        return element && !element.paused && element.currentTime > 0.7;
      }, item.id, { timeout: 20000 });
      const playing = await video.evaluate(element => ({
        currentTime: element.currentTime, duration: element.duration, paused: element.paused,
        width: element.videoWidth, height: element.videoHeight, error: element.error?.message || null,
      }));
      assert.equal(playing.error, null);
      assert.equal(playing.width, 1280);
      assert.equal(playing.height, 720);
      assert.ok(playing.duration >= item.duration && playing.duration < item.duration + 0.2);
      await video.press('Space');
      assert.equal(await video.evaluate(element => element.paused), true);
      await video.evaluate((element, seconds) => { element.currentTime = seconds; }, item.contactTime);
      await page.waitForFunction(({ id, seconds }) => {
        const element = document.querySelector(`[data-column-generated-video="${id}"] video`);
        return element && !element.seeking && element.readyState >= 2 && element.currentTime >= seconds - 0.1;
      }, { id: item.id, seconds: item.contactTime });
      // Close the existing language suggestion and center the entire figure so
      // the visual review can read the caption as well as the player.
      const languageHintClose = page.locator('[data-locale-suggestion] button');
      if (await languageHintClose.isVisible()) await languageHintClose.click();
      await figure.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.screenshot({ path: `${out}/${evidenceStem}-contact-${viewport.width}.png` });
      await figure.screenshot({ path: `${out}/${evidenceStem}-figure-${viewport.width}.png` });
      const layout = await page.evaluate(id => ({
        width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
        frameWidth: document.querySelector(`[data-column-generated-video="${id}"]`).getBoundingClientRect().width,
        bodyTextLength: document.querySelector('.blog-body')?.innerText.length || 0,
        diagramCount: document.querySelectorAll('[data-traffic-diagram]').length,
        bodyImageCount: document.querySelectorAll('.blog-body img').length,
        documentLanguage: document.documentElement.lang,
        textDirection: getComputedStyle(document.querySelector(`[data-column-generated-video="${id}"]`)).direction,
      }), item.id);
      assert.ok(layout.scrollWidth <= layout.width + 1, `Horizontal overflow: ${JSON.stringify(layout)}`);
      assert.ok(layout.frameWidth <= layout.width);
      assert.ok(layout.bodyTextLength > 500);
      assert.equal(layout.documentLanguage.toLowerCase(), item.locale.toLowerCase());
      assert.equal(layout.textDirection, ['ar', 'fa', 'he', 'ur'].includes(item.locale) ? 'rtl' : 'ltr');
      if (item.traffic === false) {
        assert.equal(layout.diagramCount, 0);
        assert.ok(layout.bodyImageCount >= (item.minBodyImages ?? 3), 'Existing article images were removed');
      } else if (item.expectedDiagrams !== undefined) {
        assert.equal(layout.diagramCount, item.expectedDiagrams);
      } else {
        assert.ok(layout.diagramCount >= 1);
      }
      // Replay the entire clip at its native rate so motion revisions are exercised in real time.
      await video.evaluate(element => { element.currentTime = 0; });
      await page.waitForFunction(id => {
        const element = document.querySelector(`[data-column-generated-video="${id}"] video`);
        return element && !element.seeking && element.currentTime < 0.1;
      }, item.id);
      if (item.loop) {
        // A looping player never emits `ended`. Observe the real time wrap
        // without disabling the product's loop setting or changing its speed.
        await video.evaluate(element => {
          element.dataset.qaLoopObserved = 'false';
          let previousTime = 0;
          const observeLoop = () => {
            if (previousTime > element.duration - 0.6 && element.currentTime < 0.6) {
              element.dataset.qaLoopObserved = 'true';
              element.removeEventListener('timeupdate', observeLoop);
            }
            previousTime = element.currentTime;
          };
          element.addEventListener('timeupdate', observeLoop);
        });
      }
      const replayStartedAt = performance.now();
      await video.press('Space');
      await page.waitForFunction(({ id, loop }) => {
        const element = document.querySelector(`[data-column-generated-video="${id}"] video`);
        return loop ? element?.dataset.qaLoopObserved === 'true' : element?.ended;
      }, { id: item.id, loop: item.loop === true }, { timeout: (item.duration + 8) * 1000 });
      const replaySeconds = (performance.now() - replayStartedAt) / 1000;
      assert.ok(replaySeconds >= item.duration - 0.2, 'The clip did not play through at its native rate');
      assert.equal(await video.evaluate(element => element.playbackRate), 1);
      assert.equal(await video.evaluate(element => element.loop), item.loop === true);
      if (item.loop) {
        await video.press('Space');
        assert.equal(await video.evaluate(element => element.paused), true);
      }

      if (process.env.COLUMN_VIDEO_QA_SKIP_BOARD !== '1' && item.trafficBoard !== false) {
        const board = await page.goto(`${base}/${item.locale}/traffic-accidents?video=1&q=${encodeURIComponent(heading.slice(0, 60))}`, { waitUntil: 'load' });
        assert.equal(board?.status(), 200);
        const count = await page.locator(`a[href="${article}"]`).count();
        if (item.traffic === false) assert.equal(count, 0, 'Non-traffic video entered the traffic collection');
        else assert.ok(count > 0, 'Video filter omitted the new native video');
      }
      results.push({ viewport, article, locale: item.locale, id: item.id, evidenceStem, initial, playing, layout, nativeKeyboardControls: true, reachedEnd: item.loop !== true, loopWrapped: item.loop === true, completedNativeCycle: true, fullReplayAtNativeRate: true, replaySeconds, trafficBoard: item.trafficBoard === false ? 'not-published-for-this-locale' : process.env.COLUMN_VIDEO_QA_SKIP_BOARD === '1' ? 'skipped' : 'checked' });
    }
    const unreviewed = await page.goto(`${base}/ko/columns/taiwan-company-establishment-advanced-1`, { waitUntil: 'load' });
    assert.equal(unreviewed?.status(), 200);
    assert.equal(await page.locator('[data-column-generated-video]').count(), 0, 'Unreviewed article inherited video');
    await context.close();
  }
  const ranges = [];
  for (const item of new Map(cases.map(item => [item.id, item])).values()) {
    const mp4 = await fetch(`${base}/videos/columns/${item.id}.mp4`, { headers: { Range: 'bytes=0-1023' } });
    assert.equal(mp4.status, 206);
    assert.match(mp4.headers.get('content-type') || '', /video\/mp4/);
    assert.equal((await mp4.arrayBuffer()).byteLength, 1024);
    ranges.push({ id: item.id, status: mp4.status });
  }
  assert.equal(findings.length, 0, findings.join('\n'));
  await fs.writeFile(`${out}/report.json`, JSON.stringify({ ok: true, base, checkedAt: new Date().toISOString(), findings, results, ranges, unreviewedLocaleExcluded: true, unreviewedArticleLanguagePage: '/ko/columns/taiwan-company-establishment-advanced-1' }, null, 2));
  console.log(JSON.stringify({ ok: true, base, out, journeys: results.length, assets: ranges.length }));
} catch (error) {
  await fs.writeFile(`${out}/report.json`, JSON.stringify({ ok: false, base, error: String(error), findings, results }, null, 2));
  throw error;
} finally {
  await browser.close();
}
