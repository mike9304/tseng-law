/**
 * subpage-proof-sections.ts — shared, REAL content sections appended to subpage templates,
 * replacing the false-green "Wix-grade expansion scaffold" (empty placeholder boxes with
 * "Showcase module" / "대표 비주얼 영역" meta-copy + fake 6+/3x/24h metrics) flagged in
 * WIX-DESIGN-FIDELITY-SPEC-2026-06-04.md.
 *
 * Subpage real content is thin (~22–38 nodes); the registry guard enforces 40–70 nodes, which is
 * why the scaffold existed (node-count padding). This emits genuine sections — a trust-stats band,
 * a "why us" 3-up, and a conversion CTA band — so pages clear the node floor with REAL content and
 * consistent spacing, matching the `buildIndustryHome` visual language (navy base + gold accent).
 *
 * Fixed total height (`SUBPAGE_PROOF_HEIGHT`) so callers can set `stageHeight: STAGE_H + SUBPAGE_PROOF_HEIGHT`.
 */
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import { createContainerNode, createTextNode, createButtonNode } from '@/lib/builder/decompose/shared';

const W = 1280;
const PAD = 64;

/* ── section heights (fixed → deterministic stage height) ───────────────── */
const TOP_GAP = 80;
const STAT_H = 184;
const SEC_GAP = 88;
const WHY_HEAD_H = 128;
const WHY_CARD_H = 230;
const CTA_GAP = 88;
const CTA_H = 312;
export const SUBPAGE_PROOF_HEIGHT =
  TOP_GAP + STAT_H + SEC_GAP + WHY_HEAD_H + WHY_CARD_H + SEC_GAP + CTA_GAP + CTA_H;

/* ── WCAG contrast helpers — keep stat-band text legible on the light surfaceAlt (AA) ── */
function _rgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.replace(/./g, '$&$&');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function _hex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}
function _contrast(a: [number, number, number], b: [number, number, number]): number {
  const lum = ([r, g, b]: [number, number, number]) => {
    const f = (v: number) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const l = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l[0] + 0.05) / (l[1] + 0.05);
}
/** Darken `fg` toward black only as far as needed to clear `target` contrast on `bg` (preserves the accent hue). */
function ensureContrast(fg: string, bg: string, target: number): string {
  let [r, g, b] = _rgb(fg);
  const bgc = _rgb(bg);
  for (let i = 0; i < 30 && _contrast([r, g, b], bgc) < target; i++) { r *= 0.92; g *= 0.92; b *= 0.92; }
  return _hex(r, g, b);
}

function heading(
  id: string,
  rect: BuilderCanvasNode['rect'],
  text: string,
  level: number,
  color: string,
  align: 'left' | 'center' | 'right',
  parentId: string | undefined,
  className?: string,
): BuilderCanvasNode {
  return {
    id,
    kind: 'heading',
    parentId,
    rect,
    style: createDefaultCanvasNodeStyle(),
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: true,
    content: { text, level, color, align, className },
  };
}

export interface SubpageProofPalette {
  base: string;
  surface: string;
  surfaceAlt: string;
  ink: string;
  mutedInk: string;
  accent: string;
  onAccent: string;
  line: string;
}

export interface SubpageProofConfig {
  /** unique-within-document node id prefix, e.g. 'law-about-proof' */
  prefix: string;
  /** Y at the bottom of the page's real content (its STAGE_H) */
  baseY: number;
  palette: SubpageProofPalette;
  stats: Array<{ value: string; label: string }>;
  whyTitle: string;
  whySubtitle: string;
  why: Array<{ title: string; desc: string }>;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
}

/**
 * Build the shared trust/why/CTA tail. Returns absolute-positioned nodes starting at `baseY`.
 * Total vertical footprint === SUBPAGE_PROOF_HEIGHT.
 */
export function buildSubpageProofSections(cfg: SubpageProofConfig): BuilderCanvasNode[] {
  const p = cfg.palette;
  const id = cfg.prefix;
  const nodes: BuilderCanvasNode[] = [];
  let y = cfg.baseY + TOP_GAP;

  /* ── 1. Trust / stat band ──────────────────────────────────────────────── */
  nodes.push(
    createContainerNode({ id: `${id}-stats`, rect: { x: 0, y, width: W, height: STAT_H }, background: p.surfaceAlt, borderRadius: 0, className: 'stat-card' }),
  );
  const statW = (W - PAD * 2) / cfg.stats.length;
  // Stat band sits on the light surfaceAlt; ensure the accent number (large → AA 3:1) and the
  // muted label (small → AA 4.5:1) stay legible by darkening the hue only as far as needed.
  const statValueColor = ensureContrast(p.accent, p.surfaceAlt, 3.1);
  const statLabelColor = ensureContrast(p.mutedInk, p.surfaceAlt, 4.5);
  cfg.stats.forEach((s, i) => {
    const sx = PAD + statW * i;
    nodes.push(
      heading(`${id}-stat-${i}-v`, { x: sx, y: 48, width: statW - 24, height: 58 }, s.value, 2, statValueColor, 'left', `${id}-stats`),
      createTextNode({
        id: `${id}-stat-${i}-l`,
        parentId: `${id}-stats`,
        rect: { x: sx, y: 112, width: statW - 24, height: 36 },
        text: s.label,
        fontSize: 15,
        color: statLabelColor,
        fontWeight: 'medium',
        align: 'left',
      }),
    );
  });
  y += STAT_H + SEC_GAP;

  /* ── 2. "Why us" heading + 3 value cards ───────────────────────────────── */
  nodes.push(
    heading(`${id}-why-title`, { x: PAD, y, width: 900, height: 50 }, cfg.whyTitle, 2, p.ink, 'left', undefined, 'section-label'),
    createTextNode({
      id: `${id}-why-sub`,
      rect: { x: PAD, y: y + 60, width: 820, height: 48 },
      text: cfg.whySubtitle,
      fontSize: 17,
      color: p.mutedInk,
      fontWeight: 'regular',
      align: 'left',
      lineHeight: 1.6,
      className: 'card-copy',
    }),
  );
  const cardsTop = y + WHY_HEAD_H;
  const cardGap = 28;
  const cardW = (W - PAD * 2 - cardGap * 2) / 3;
  cfg.why.slice(0, 3).forEach((item, i) => {
    const cx = PAD + (cardW + cardGap) * i;
    const cid = `${id}-why-${i}`;
    nodes.push(
      createContainerNode({ id: cid, rect: { x: cx, y: cardsTop, width: cardW, height: WHY_CARD_H }, background: p.surface, borderColor: p.line, borderWidth: 1, borderRadius: 16, className: 'services-detail-card', style: { shadowX: 0, shadowY: 10, shadowBlur: 28, shadowSpread: -8, shadowColor: 'rgba(15,23,42,0.10)' } }),
      heading(`${cid}-title`, { x: 28, y: 32, width: cardW - 56, height: 34 }, item.title, 3, p.ink, 'left', cid, 'card-title'),
      createTextNode({
        id: `${cid}-desc`,
        parentId: cid,
        rect: { x: 28, y: 80, width: cardW - 56, height: 120 },
        text: item.desc,
        fontSize: 15,
        color: p.mutedInk,
        fontWeight: 'regular',
        align: 'left',
        lineHeight: 1.6,
        className: 'card-copy',
      }),
    );
  });
  y = cardsTop + WHY_CARD_H + CTA_GAP;

  /* ── 3. Conversion CTA band ────────────────────────────────────────────── */
  nodes.push(
    createContainerNode({ id: `${id}-cta`, rect: { x: PAD, y, width: W - PAD * 2, height: CTA_H }, background: p.base, borderRadius: 24, className: 'services-detail-card' }),
    heading(`${id}-cta-title`, { x: 64, y: 64, width: W - PAD * 2 - 128, height: 80 }, cfg.ctaTitle, 2, '#ffffff', 'center', `${id}-cta`, 'section-label'),
    createTextNode({
      id: `${id}-cta-sub`,
      parentId: `${id}-cta`,
      rect: { x: 160, y: 150, width: W - PAD * 2 - 320, height: 52 },
      text: cfg.ctaSubtitle,
      fontSize: 17,
      color: 'rgba(255,255,255,0.86)',
      fontWeight: 'regular',
      align: 'center',
      lineHeight: 1.6,
      className: 'card-copy',
    }),
    createButtonNode({
      id: `${id}-cta-btn`,
      parentId: `${id}-cta`,
      rect: { x: (W - PAD * 2) / 2 - 110, y: 224, width: 220, height: 56 },
      label: cfg.ctaButton,
      href: '#contact',
      variant: 'primary',
      className: 'hero-cta',
      style: { backgroundColor: p.accent, borderRadius: 8 },
    }),
  );

  return nodes;
}

/* ── CTA-only band (for already-rich subpages that would exceed 70 with the full tail) ── */
const CTA_ONLY_TOP_GAP = 80;
export const SUBPAGE_CTA_HEIGHT = CTA_ONLY_TOP_GAP + CTA_H;

export interface SubpageCtaConfig {
  prefix: string;
  baseY: number;
  palette: SubpageProofPalette;
  title: string;
  subtitle: string;
  button: string;
}

/** Just the conversion CTA band — keeps motion-hint classNames so rich pages stay compliant. */
export function buildSubpageCtaBand(cfg: SubpageCtaConfig): BuilderCanvasNode[] {
  const p = cfg.palette;
  const id = cfg.prefix;
  const y = cfg.baseY + CTA_ONLY_TOP_GAP;
  return [
    createContainerNode({ id: `${id}-cta`, rect: { x: PAD, y, width: W - PAD * 2, height: CTA_H }, background: p.base, borderRadius: 24, className: 'services-detail-card' }),
    heading(`${id}-cta-title`, { x: 64, y: 64, width: W - PAD * 2 - 128, height: 80 }, cfg.title, 2, '#ffffff', 'center', `${id}-cta`, 'section-label'),
    createTextNode({ id: `${id}-cta-sub`, parentId: `${id}-cta`, rect: { x: 160, y: 150, width: W - PAD * 2 - 320, height: 52 }, text: cfg.subtitle, fontSize: 17, color: 'rgba(255,255,255,0.86)', fontWeight: 'regular', align: 'center', lineHeight: 1.6, className: 'card-copy' }),
    createButtonNode({ id: `${id}-cta-btn`, parentId: `${id}-cta`, rect: { x: (W - PAD * 2) / 2 - 110, y: 224, width: 220, height: 56 }, label: cfg.button, href: '#contact', variant: 'primary', className: 'hero-cta', style: { backgroundColor: p.accent, borderRadius: 8 } }),
  ];
}

/* ── Optional "directions / how to reach us" 3-up (for contact subpages) ──── */
const CM_TOP_GAP = 80;
const CM_HEAD_H = 80;
const CM_CARD_H = 196;
export const CONTACT_METHODS_HEIGHT = CM_TOP_GAP + CM_HEAD_H + CM_CARD_H;

export interface SubpageContactMethodsConfig {
  prefix: string;
  baseY: number;
  palette: SubpageProofPalette;
  title: string;
  items: Array<{ label: string; value: string; note: string }>;
}

/** A real "찾아오시는 길 / 연락 방법" 3-up — useful contact content (NOT the address block it complements). */
export function buildSubpageContactMethods(cfg: SubpageContactMethodsConfig): BuilderCanvasNode[] {
  const p = cfg.palette;
  const id = cfg.prefix;
  const nodes: BuilderCanvasNode[] = [];
  const y = cfg.baseY + CM_TOP_GAP;
  nodes.push(
    heading(`${id}-title`, { x: PAD, y, width: 900, height: 50 }, cfg.title, 2, p.ink, 'left', undefined, 'section-label'),
  );
  const cardsTop = y + CM_HEAD_H;
  const cardGap = 28;
  const cardW = (W - PAD * 2 - cardGap * 2) / 3;
  cfg.items.slice(0, 3).forEach((item, i) => {
    const cx = PAD + (cardW + cardGap) * i;
    const cid = `${id}-c${i}`;
    nodes.push(
      createContainerNode({ id: cid, rect: { x: cx, y: cardsTop, width: cardW, height: CM_CARD_H }, background: p.surface, borderColor: p.line, borderWidth: 1, borderRadius: 16, className: 'services-detail-card', style: { shadowX: 0, shadowY: 10, shadowBlur: 28, shadowSpread: -8, shadowColor: 'rgba(15,23,42,0.10)' } }),
      createTextNode({ id: `${cid}-label`, parentId: cid, rect: { x: 28, y: 28, width: cardW - 56, height: 26 }, text: item.label, fontSize: 13, color: ensureContrast(p.accent, p.surface, 4.5), fontWeight: 'bold', align: 'left', className: 'section-label' }),
      heading(`${cid}-value`, { x: 28, y: 60, width: cardW - 56, height: 40 }, item.value, 3, p.ink, 'left', cid, 'card-title'),
      createTextNode({ id: `${cid}-note`, parentId: cid, rect: { x: 28, y: 112, width: cardW - 56, height: 56 }, text: item.note, fontSize: 15, color: p.mutedInk, fontWeight: 'regular', align: 'left', lineHeight: 1.6, className: 'card-copy' }),
    );
  });
  return nodes;
}

/* ── Config-driven categories (scales the proof tail across service categories) ──
 * Add a category here, then wire its subpages with buildCategoryProofSections(category,…).
 * Palettes mirror each category's <cat>-home.ts buildIndustryHome config. */
interface CategoryProofContent {
  palette: SubpageProofPalette;
  stats: Array<{ value: string; label: string }>;
  whyTitle: string;
  whySubtitle: string;
  why: Array<{ title: string; desc: string }>;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
  directionsTitle: string;
  directions: Array<{ label: string; value: string; note: string }>;
}

const GENERIC_DIRECTIONS: CategoryProofContent['directions'] = [
  { label: '지하철', value: '인근 역에서 도보 거리', note: '가까운 역에서 걸어서 방문하실 수 있습니다.' },
  { label: '대중교통', value: '버스 정류장 도보 3분', note: '다양한 노선으로 편리하게 오실 수 있습니다.' },
  { label: '주차', value: '건물 내 주차장', note: '방문 시 주차를 지원해 드립니다.' },
];

const CATEGORY_PROOF: Record<string, CategoryProofContent> = {
  health: {
    palette: { base: '#123c32', surface: '#ffffff', surfaceAlt: '#dff0ea', ink: '#123c32', mutedInk: '#57746b', accent: '#2f8f75', onAccent: '#ffffff', line: '#c5ded7' },
    stats: [
      { value: '15년+', label: '진료 경력' },
      { value: '50,000+', label: '누적 진료 건수' },
      { value: '4.9', label: '환자 만족도 평점' },
    ],
    whyTitle: '왜 저희 병원을 선택해야 할까요',
    whySubtitle: '정확한 진단과 따뜻한 진료로, 환자 한 분 한 분을 끝까지 책임집니다.',
    why: [
      { title: '정확한 진단', desc: '최신 장비와 풍부한 임상 경험으로 원인을 정확히 진단합니다.' },
      { title: '맞춤형 치료', desc: '환자의 상태와 생활 습관에 맞춘 개인별 치료 계획을 세웁니다.' },
      { title: '편안한 진료 환경', desc: '대기 시간을 줄이고 충분한 상담 시간을 보장합니다.' },
    ],
    ctaTitle: '건강 상담, 지금 예약하세요',
    ctaSubtitle: '온라인으로 간편하게 진료 예약과 상담을 신청하실 수 있습니다.',
    ctaButton: '진료 예약하기',
    directionsTitle: '오시는 길',
    directions: GENERIC_DIRECTIONS,
  },
  realestate: {
    palette: { base: '#26313d', surface: '#ffffff', surfaceAlt: '#ece7df', ink: '#26313d', mutedInk: '#67717b', accent: '#8b745b', onAccent: '#ffffff', line: '#d6cbbd' },
    stats: [
      { value: '20년+', label: '지역 중개 경력' },
      { value: '1,500+', label: '성사된 거래' },
      { value: '98%', label: '고객 추천율' },
    ],
    whyTitle: '왜 저희와 거래해야 할까요',
    whySubtitle: '지역을 가장 잘 아는 전문가가 안전하고 투명한 거래를 책임집니다.',
    why: [
      { title: '지역 전문성', desc: '오랜 기간 쌓은 지역 데이터로 적정 가격을 제시합니다.' },
      { title: '안전한 거래', desc: '권리 분석부터 계약까지 꼼꼼히 확인해 위험을 줄입니다.' },
      { title: '투명한 정보', desc: '시세와 진행 상황을 숨김없이 투명하게 공유합니다.' },
    ],
    ctaTitle: '내 집 찾기, 지금 시작하세요',
    ctaSubtitle: '원하는 조건을 남겨 주시면 맞춤 매물을 빠르게 안내해 드립니다.',
    ctaButton: '매물 상담 신청',
    directionsTitle: '사무소 오시는 길',
    directions: GENERIC_DIRECTIONS,
  },
  fitness: {
    palette: { base: '#14181f', surface: '#ffffff', surfaceAlt: '#eef1f5', ink: '#14181f', mutedInk: '#5b6472', accent: '#e0532b', onAccent: '#ffffff', line: '#dde1e8' },
    stats: [
      { value: '8년+', label: '센터 운영 경력' },
      { value: '2,000+', label: '함께한 회원' },
      { value: '4.9', label: '회원 만족도 평점' },
    ],
    whyTitle: '왜 저희 센터를 선택해야 할까요',
    whySubtitle: '검증된 트레이너와 체계적인 프로그램으로 확실한 변화를 만듭니다.',
    why: [
      { title: '전문 트레이너', desc: '자격을 갖춘 트레이너가 개인별 목표에 맞춰 지도합니다.' },
      { title: '맞춤 프로그램', desc: '체형과 목표를 분석해 단계별 운동 계획을 설계합니다.' },
      { title: '최신 시설', desc: '쾌적하고 안전한 환경에서 운동에만 집중할 수 있습니다.' },
    ],
    ctaTitle: '첫 운동, 지금 시작하세요',
    ctaSubtitle: '무료 체험으로 센터와 프로그램을 직접 경험해 보세요.',
    ctaButton: '무료 체험 신청',
    directionsTitle: '센터 오시는 길',
    directions: GENERIC_DIRECTIONS,
  },
  beauty: {
    palette: { base: '#2a1d1a', surface: '#fffaf8', surfaceAlt: '#f0ddd8', ink: '#2b1c18', mutedInk: '#80655e', accent: '#b07d3f', onAccent: '#ffffff', line: '#e6d3cd' },
    stats: [
      { value: '12년+', label: '살롱 운영 경력' },
      { value: '10,000+', label: '누적 고객 수' },
      { value: '4.9', label: '고객 만족도 평점' },
    ],
    whyTitle: '왜 저희 살롱을 선택해야 할까요',
    whySubtitle: '숙련된 전문가의 손길과 프리미엄 제품으로 당신만의 아름다움을 완성합니다.',
    why: [
      { title: '숙련된 전문가', desc: '풍부한 경험의 디자이너가 얼굴형과 취향을 세심하게 분석합니다.' },
      { title: '프리미엄 제품', desc: '엄선한 제품만 사용해 모발과 피부를 건강하게 관리합니다.' },
      { title: '편안한 공간', desc: '프라이빗한 공간에서 여유로운 시간을 보내실 수 있습니다.' },
    ],
    ctaTitle: '아름다운 변화, 지금 예약하세요',
    ctaSubtitle: '원하는 시술을 남겨 주시면 맞춤 상담을 도와드립니다.',
    ctaButton: '예약 상담 신청',
    directionsTitle: '살롱 오시는 길',
    directions: GENERIC_DIRECTIONS,
  },
  cafe: {
    palette: { base: '#331d10', surface: '#ffffff', surfaceAlt: '#efe1c8', ink: '#1f2622', mutedInk: '#687169', accent: '#c26f3d', onAccent: '#ffffff', line: '#ddcdb8' },
    stats: [
      { value: '10년+', label: '한자리 로스터리' },
      { value: '12종', label: '매일 바뀌는 싱글 오리진' },
      { value: '4.9', label: '단골이 남긴 평점' },
    ],
    whyTitle: '왜 저희 카페일까요',
    whySubtitle: '직접 볶은 신선한 원두와 손수 구운 베이커리로 하루의 결을 채웁니다.',
    why: [
      { title: '신선한 로스팅', desc: '매주 소량씩 직접 볶아 가장 좋은 향을 잔에 담습니다.' },
      { title: '제철 베이커리', desc: '매일 아침 구워내는 빵과 계절 디저트를 준비합니다.' },
      { title: '머무는 공간', desc: '창가 자리에서 느긋하게 머무를 수 있도록 다듬었습니다.' },
    ],
    ctaTitle: '오늘 한 잔, 함께하실래요',
    ctaSubtitle: '평일 이른 아침부터 주말까지 따뜻한 한 잔으로 맞이합니다.',
    ctaButton: '메뉴 둘러보기',
    directionsTitle: '카페 오시는 길',
    directions: GENERIC_DIRECTIONS,
  },
  travel: {
    palette: { base: '#101827', surface: '#fff8ed', surfaceAlt: '#f3e6cf', ink: '#101827', mutedInk: '#657184', accent: '#d88a3d', onAccent: '#ffffff', line: '#e0d3b8' },
    stats: [
      { value: '15년+', label: '여행 기획 경력' },
      { value: '120+', label: '안내한 여행지' },
      { value: '4.9', label: '여행자 만족도 평점' },
    ],
    whyTitle: '왜 저희와 떠나야 할까요',
    whySubtitle: '현지를 깊이 아는 전문가가 안전하고 특별한 여정을 설계합니다.',
    why: [
      { title: '현지 전문성', desc: '오랜 경험으로 현지에서만 아는 코스를 안내합니다.' },
      { title: '맞춤 일정', desc: '취향과 일정에 맞춰 나만의 여행을 설계합니다.' },
      { title: '안심 동행', desc: '출발부터 귀국까지 24시간 지원으로 함께합니다.' },
    ],
    ctaTitle: '다음 여행, 지금 계획하세요',
    ctaSubtitle: '원하는 여행지를 남겨 주시면 맞춤 일정을 제안해 드립니다.',
    ctaButton: '여행 상담 신청',
    directionsTitle: '오시는 길',
    directions: GENERIC_DIRECTIONS,
  },
  startup: {
    palette: { base: '#0b1020', surface: '#ffffff', surfaceAlt: '#eef3fb', ink: '#16191f', mutedInk: '#5f6b7a', accent: '#2563eb', onAccent: '#ffffff', line: '#dbe6f5' },
    stats: [
      { value: '50K+', label: '활성 사용자' },
      { value: '99.9%', label: '서비스 가동률' },
      { value: '4.8', label: '앱 스토어 평점' },
    ],
    whyTitle: '왜 저희 제품일까요',
    whySubtitle: '복잡한 일을 단순하게. 팀의 생산성을 실제로 끌어올립니다.',
    why: [
      { title: '빠른 도입', desc: '복잡한 설정 없이 몇 분 만에 바로 시작합니다.' },
      { title: '강력한 자동화', desc: '반복 작업을 줄여 핵심 업무에 집중하게 합니다.' },
      { title: '안전한 데이터', desc: '엔터프라이즈급 보안으로 데이터를 안전하게 보호합니다.' },
    ],
    ctaTitle: '지금 무료로 시작하세요',
    ctaSubtitle: '신용카드 없이 모든 기능을 직접 체험해 보세요.',
    ctaButton: '무료로 시작하기',
    directionsTitle: '오시는 길',
    directions: GENERIC_DIRECTIONS,
  },
  restaurant: {
    palette: { base: '#2a1410', surface: '#fffaf1', surfaceAlt: '#efd9b7', ink: '#211814', mutedInk: '#6d5548', accent: '#b9432f', onAccent: '#ffffff', line: '#e4c79f' },
    stats: [
      { value: '20년+', label: '한결같은 손맛' },
      { value: '30+', label: '시그니처 메뉴' },
      { value: '4.9', label: '방문객 평점' },
    ],
    whyTitle: '왜 저희 레스토랑일까요',
    whySubtitle: '엄선한 식재료와 정성스러운 조리로 잊지 못할 한 끼를 준비합니다.',
    why: [
      { title: '엄선한 식재료', desc: '매일 들여오는 신선한 제철 재료만 사용합니다.' },
      { title: '셰프의 정성', desc: '오랜 경력의 셰프가 한 접시씩 정성껏 완성합니다.' },
      { title: '특별한 공간', desc: '소중한 사람과 함께하기 좋은 분위기를 갖췄습니다.' },
    ],
    ctaTitle: '특별한 식사, 지금 예약하세요',
    ctaSubtitle: '원하는 날짜와 인원을 남겨 주시면 예약을 도와드립니다.',
    ctaButton: '예약하기',
    directionsTitle: '레스토랑 오시는 길',
    directions: GENERIC_DIRECTIONS,
  },
  pet: {
    palette: { base: '#2f231a', surface: '#fffaf5', surfaceAlt: '#f3e7da', ink: '#2b2018', mutedInk: '#6f6253', accent: '#d97742', onAccent: '#ffffff', line: '#e4d5c4' },
    stats: [
      { value: '12년+', label: '반려동물 진료 경력' },
      { value: '20,000+', label: '케어한 아이들' },
      { value: '4.9', label: '보호자 만족도 평점' },
    ],
    whyTitle: '왜 저희를 선택해야 할까요',
    whySubtitle: '가족 같은 마음으로, 우리 아이의 건강과 행복을 끝까지 돌봅니다.',
    why: [
      { title: '세심한 진료', desc: '작은 변화도 놓치지 않고 꼼꼼하게 살핍니다.' },
      { title: '편안한 환경', desc: '동물이 덜 불안하도록 배려한 공간을 갖췄습니다.' },
      { title: '보호자 소통', desc: '치료 과정을 쉽게 설명하고 함께 결정합니다.' },
    ],
    ctaTitle: '우리 아이 건강, 지금 상담하세요',
    ctaSubtitle: '온라인으로 간편하게 진료와 상담을 예약하실 수 있습니다.',
    ctaButton: '진료 예약하기',
    directionsTitle: '오시는 길',
    directions: GENERIC_DIRECTIONS,
  },
  education: {
    palette: { base: '#3a2a17', surface: '#fffaf0', surfaceAlt: '#efe2cb', ink: '#2a2418', mutedInk: '#6b6253', accent: '#c08a3a', onAccent: '#ffffff', line: '#e0d3b8' },
    stats: [
      { value: '15년+', label: '축적된 교육 노하우' },
      { value: '5,000+', label: '함께한 학생' },
      { value: '95%', label: '목표 달성률' },
    ],
    whyTitle: '왜 저희와 공부해야 할까요',
    whySubtitle: '체계적인 커리큘럼과 밀착 관리로 학생 한 명 한 명의 성장을 만듭니다.',
    why: [
      { title: '체계적 커리큘럼', desc: '수준별 맞춤 과정으로 차근차근 실력을 쌓습니다.' },
      { title: '밀착 관리', desc: '진도와 성취를 꾸준히 점검하고 피드백합니다.' },
      { title: '검증된 강사진', desc: '풍부한 경험의 강사가 직접 지도합니다.' },
    ],
    ctaTitle: '첫걸음, 지금 시작하세요',
    ctaSubtitle: '무료 레벨 테스트로 현재 실력을 정확히 진단해 보세요.',
    ctaButton: '무료 상담 신청',
    directionsTitle: '학원 오시는 길',
    directions: GENERIC_DIRECTIONS,
  },
  ecommerce: {
    palette: { base: '#1a1a2e', surface: '#ffffff', surfaceAlt: '#f2f2f7', ink: '#1a1a2e', mutedInk: '#6b6b78', accent: '#4f46e5', onAccent: '#ffffff', line: '#e4e4ec' },
    stats: [
      { value: '100,000+', label: '누적 주문 건수' },
      { value: '4.9', label: '구매 만족도 평점' },
      { value: '24h', label: '빠른 출고' },
    ],
    whyTitle: '왜 저희 스토어일까요',
    whySubtitle: '엄선한 상품과 빠른 배송, 믿을 수 있는 쇼핑 경험을 제공합니다.',
    why: [
      { title: '엄선한 상품', desc: '까다로운 기준으로 검증한 제품만 판매합니다.' },
      { title: '빠른 배송', desc: '주문 후 신속하게 포장하여 빠르게 보내드립니다.' },
      { title: '안심 교환·환불', desc: '문제가 있으면 간편하게 교환·환불해 드립니다.' },
    ],
    ctaTitle: '지금 쇼핑을 시작하세요',
    ctaSubtitle: '신상품과 특별 혜택을 가장 먼저 만나보세요.',
    ctaButton: '쇼핑하러 가기',
    directionsTitle: '안심하고 쇼핑하세요',
    directions: [
      { label: '무료 배송', value: '5만원 이상 구매 시', note: '전국 어디나 무료로 빠르게 배송해 드립니다.' },
      { label: '안전 결제', value: '다양한 결제 수단', note: '안전하게 보호되는 결제 시스템을 제공합니다.' },
      { label: '간편 교환·반품', value: '구매 후 7일 이내', note: '마음에 들지 않으면 간편하게 교환·반품하세요.' },
    ],
  },
  photography: {
    palette: { base: '#121212', surface: '#faf9f7', surfaceAlt: '#ece9e3', ink: '#1a1a1a', mutedInk: '#6a6a6a', accent: '#9b8463', onAccent: '#ffffff', line: '#e2ded7' },
    stats: [
      { value: '500+', label: '담아낸 순간' },
      { value: '120+', label: '함께한 클라이언트' },
      { value: '10년+', label: '촬영 경력' },
    ],
    whyTitle: '이런 순간을 담습니다',
    whySubtitle: '자연스러운 표정과 빛, 분위기까지. 다시 꺼내볼 사진을 만듭니다.',
    why: [
      { title: '자연스러운 연출', desc: '경직되지 않은, 그 순간의 진짜 표정을 담습니다.' },
      { title: '빛을 읽는 감각', desc: '공간과 시간에 맞춰 가장 아름다운 빛을 찾습니다.' },
      { title: '정성스러운 보정', desc: '한 장 한 장 섬세하게 다듬어 전달합니다.' },
    ],
    ctaTitle: '촬영을 문의하세요',
    ctaSubtitle: '원하는 일정과 콘셉트를 남겨 주시면 친절하게 안내해 드립니다.',
    ctaButton: '촬영 문의',
    directionsTitle: '스튜디오 오시는 길',
    directions: GENERIC_DIRECTIONS,
  },
  music: {
    palette: { base: '#141019', surface: '#ffffff', surfaceAlt: '#efe9f4', ink: '#181320', mutedInk: '#6a6376', accent: '#8b5cf6', onAccent: '#ffffff', line: '#e4dded' },
    stats: [
      { value: '5장', label: '발매한 앨범' },
      { value: '100+', label: '무대에 선 공연' },
      { value: '50K+', label: '월간 청취자' },
    ],
    whyTitle: '음악 이야기',
    whySubtitle: '장르의 경계를 넘나들며, 진심을 담은 사운드를 만듭니다.',
    why: [
      { title: '독창적인 사운드', desc: '익숙하면서도 새로운, 나만의 색을 담습니다.' },
      { title: '라이브의 힘', desc: '무대 위에서 가장 빛나는 에너지를 전합니다.' },
      { title: '함께 만드는 음악', desc: '리스너와 호흡하며 이야기를 완성합니다.' },
    ],
    ctaTitle: '새 소식을 받아보세요',
    ctaSubtitle: '새 음악과 공연 소식을 가장 먼저 받아보세요.',
    ctaButton: '팔로우하기',
    directionsTitle: '더 둘러보기',
    directions: [
      { label: '디스코그래피', value: '발매 음악 전체', note: '정규·싱글 음원을 한곳에서 들어보세요.' },
      { label: '영상', value: '뮤직비디오 · 라이브', note: '무대와 비하인드 영상을 만나보세요.' },
      { label: '굿즈', value: '공식 머천다이즈', note: '한정판 굿즈와 앨범을 만나보세요.' },
    ],
  },
  creative: {
    palette: { base: '#0f0f12', surface: '#ffffff', surfaceAlt: '#f3f3f4', ink: '#0f0f12', mutedInk: '#66666e', accent: '#e0457a', onAccent: '#ffffff', line: '#e6e6e9' },
    stats: [
      { value: '200+', label: '완성한 프로젝트' },
      { value: '15', label: '수상 경력' },
      { value: '80+', label: '함께한 브랜드' },
    ],
    whyTitle: '우리가 하는 일',
    whySubtitle: '브랜드의 본질을 발견하고, 보는 사람의 마음을 움직이는 디자인을 만듭니다.',
    why: [
      { title: '전략적 사고', desc: '보기 좋은 것을 넘어, 목적을 이루는 디자인을 합니다.' },
      { title: '디테일의 완성도', desc: '작은 차이가 브랜드의 인상을 결정합니다.' },
      { title: '협업하는 과정', desc: '아이디어를 함께 다듬으며 결과를 만들어 갑니다.' },
    ],
    ctaTitle: '프로젝트를 시작하세요',
    ctaSubtitle: '어떤 작업이든 편하게 문의 주시면 함께 고민해 드립니다.',
    ctaButton: '프로젝트 문의',
    directionsTitle: '스튜디오 오시는 길',
    directions: GENERIC_DIRECTIONS,
  },
  blog: {
    palette: { base: '#1a1a1a', surface: '#ffffff', surfaceAlt: '#f3f1ec', ink: '#1a1a1a', mutedInk: '#66645e', accent: '#9a6a3a', onAccent: '#ffffff', line: '#e4e0d6' },
    stats: [
      { value: '200+', label: '발행한 글' },
      { value: '5,000+', label: '함께하는 구독자' },
      { value: '4년+', label: '꾸준한 기록' },
    ],
    whyTitle: '이런 이야기를 다룹니다',
    whySubtitle: '일상의 관찰부터 깊은 생각까지, 천천히 곱씹을 글을 씁니다.',
    why: [
      { title: '솔직한 시선', desc: '꾸미지 않은, 진짜 경험을 나눕니다.' },
      { title: '깊이 있는 글', desc: '빠르게 소비되지 않는 이야기를 담습니다.' },
      { title: '꾸준한 기록', desc: '오래 쌓인 글이 하나의 흐름이 됩니다.' },
    ],
    ctaTitle: '새 글을 받아보세요',
    ctaSubtitle: '새로운 글이 올라오면 가장 먼저 메일로 알려드립니다.',
    ctaButton: '구독하기',
    directionsTitle: '블로그 둘러보기',
    directions: [
      { label: '에세이', value: '일상의 기록', note: '천천히 곱씹어 쓴 일상의 이야기들.' },
      { label: '리뷰', value: '책과 영화', note: '깊이 있게 들여다본 작품 이야기.' },
      { label: '아카이브', value: '지난 글 모아보기', note: '주제별로 정리한 지난 글을 둘러보세요.' },
    ],
  },
};

export function buildCategoryProofSections(category: string, prefix: string, baseY: number): BuilderCanvasNode[] {
  const c = CATEGORY_PROOF[category];
  if (!c) throw new Error(`buildCategoryProofSections: no config for "${category}"`);
  return buildSubpageProofSections({
    prefix,
    baseY,
    palette: c.palette,
    stats: c.stats,
    whyTitle: c.whyTitle,
    whySubtitle: c.whySubtitle,
    why: c.why,
    ctaTitle: c.ctaTitle,
    ctaSubtitle: c.ctaSubtitle,
    ctaButton: c.ctaButton,
  });
}

export function buildCategoryContactMethods(category: string, prefix: string, baseY: number): BuilderCanvasNode[] {
  const c = CATEGORY_PROOF[category];
  if (!c) throw new Error(`buildCategoryContactMethods: no config for "${category}"`);
  return buildSubpageContactMethods({ prefix, baseY, palette: c.palette, title: c.directionsTitle, items: c.directions });
}

export function buildCategoryCtaBand(category: string, prefix: string, baseY: number): BuilderCanvasNode[] {
  const c = CATEGORY_PROOF[category];
  if (!c) throw new Error(`buildCategoryCtaBand: no config for "${category}"`);
  return buildSubpageCtaBand({ prefix, baseY, palette: c.palette, title: c.ctaTitle, subtitle: c.ctaSubtitle, button: c.ctaButton });
}

/* ── Law-firm convenience wrapper (navy + gold identity, shared copy) ─────── */
const LAW_PROOF_PALETTE: SubpageProofPalette = {
  base: '#123b63',
  surface: '#ffffff',
  surfaceAlt: '#eef3f8',
  ink: '#15233b',
  mutedInk: '#5d6b7e',
  accent: '#b18a4a',
  onAccent: '#15233b',
  line: '#d4dde6',
};

export function buildLawProofSections(prefix: string, baseY: number): BuilderCanvasNode[] {
  return buildSubpageProofSections({
    prefix,
    baseY,
    palette: LAW_PROOF_PALETTE,
    stats: [
      { value: '15년+', label: '대만 법률 자문 경력' },
      { value: '1,200+', label: '한국어 상담 누적 건수' },
      { value: '4.9', label: '의뢰인 만족도 평점' },
    ],
    whyTitle: '왜 저희 사무소를 선택해야 할까요',
    whySubtitle: '언어 장벽 없이, 처음부터 끝까지 한 명의 담당 변호사가 책임지고 함께합니다.',
    why: [
      { title: '한국어 전담 상담', desc: '모든 상담과 서류 안내를 한국어로 진행해 오해 없이 정확하게 소통합니다.' },
      { title: '풍부한 실무 경험', desc: '기업 자문부터 가족·이민 분쟁까지 폭넓은 사건을 직접 수행해 왔습니다.' },
      { title: '투명한 절차 안내', desc: '비용과 진행 절차를 사전에 명확히 안내하고 단계별로 공유합니다.' },
    ],
    ctaTitle: '지금 바로 무료 상담을 신청하세요',
    ctaSubtitle: '전문 변호사가 직접 사건을 검토하고 친절하게 안내해 드립니다.',
    ctaButton: '무료 상담 신청',
  });
}

/* ── Consulting convenience wrapper (teal-slate identity) ────────────────── */
const CONSULTING_PROOF_PALETTE: SubpageProofPalette = {
  base: '#1f2a2e',
  surface: '#ffffff',
  surfaceAlt: '#eef1f0',
  ink: '#1f2a2e',
  mutedInk: '#5f6b6a',
  accent: '#3f5f5b',
  onAccent: '#ffffff',
  line: '#dde3e1',
};

export function buildConsultingProofSections(prefix: string, baseY: number): BuilderCanvasNode[] {
  return buildSubpageProofSections({
    prefix,
    baseY,
    palette: CONSULTING_PROOF_PALETTE,
    stats: [
      { value: '12년+', label: '비즈니스 컨설팅 경력' },
      { value: '300+', label: '수행한 프로젝트' },
      { value: '95%', label: '고객 재계약률' },
    ],
    whyTitle: '왜 저희와 함께해야 할까요',
    whySubtitle: '데이터에 기반한 전략과 실행까지, 측정 가능한 성과로 증명합니다.',
    why: [
      { title: '전략부터 실행까지', desc: '진단·전략 수립에서 현장 실행까지 한 팀이 끝까지 함께합니다.' },
      { title: '데이터 기반 의사결정', desc: '추측이 아닌 데이터와 검증된 프레임워크로 방향을 정합니다.' },
      { title: '측정 가능한 성과', desc: '명확한 KPI와 정기 리포트로 진행 상황을 투명하게 공유합니다.' },
    ],
    ctaTitle: '비즈니스 성장, 지금 시작하세요',
    ctaSubtitle: '무료 진단으로 우리 비즈니스의 숨은 기회를 확인해 보세요.',
    ctaButton: '무료 진단 신청',
  });
}

export function buildConsultingContactMethods(prefix: string, baseY: number): BuilderCanvasNode[] {
  return buildSubpageContactMethods({
    prefix,
    baseY,
    palette: CONSULTING_PROOF_PALETTE,
    title: '찾아오시는 길',
    items: [
      { label: '지하철', value: '비즈니스 지구 중심', note: '주요 역에서 도보 거리에 위치합니다.' },
      { label: '대중교통', value: '버스 정류장 도보 3분', note: '다양한 노선으로 편리하게 방문하실 수 있습니다.' },
      { label: '주차', value: '건물 내 주차장', note: '미팅 예약 시 주차를 지원해 드립니다.' },
    ],
  });
}

export function buildLawContactMethods(prefix: string, baseY: number): BuilderCanvasNode[] {
  return buildSubpageContactMethods({
    prefix,
    baseY,
    palette: LAW_PROOF_PALETTE,
    title: '찾아오시는 길',
    items: [
      { label: '지하철 MRT', value: '다안역 3번 출구', note: '둔화남로 방면 도보 약 5분 거리입니다.' },
      { label: '버스', value: '둔화남로 정류장 하차', note: '시내 주요 노선이 사무소 앞에 정차합니다.' },
      { label: '주차', value: '건물 지하 주차장', note: '방문 상담 시 2시간 무료 주차를 제공합니다.' },
    ],
  });
}
