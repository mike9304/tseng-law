/**
 * industry-home.ts — shared, parameterized "industry home page" template builder.
 *
 * Why this exists: 13 Track-C industries (agency/saas/nonprofit/conference/podcast/
 * magazine/dental/yoga/portfolio/freelancer/wedding/carrental/eventplanner) shipped as
 * byte-identical 714-line lorem skeletons with ZERO image nodes — every one rendered as
 * the same gray-card wireframe in the template gallery (the "start a Wix site" surface).
 * See WIX-PERFECT-PLAN-2026-05-29.md backlog #7 + #18.
 *
 * This builder produces a genuinely Wix-grade home layout (hero with real imagery + overlay,
 * trust/stat band, image-backed service cards, feature split, testimonial, CTA) from a small
 * per-industry CONFIG (palette + real images + copy). Layout/spacing is fixed and proven
 * (modeled on the hand-designed law-home), so each industry is distinct in palette/imagery/
 * copy while guaranteed consistent, image-rich, and within the registry's 40–70 node budget.
 *
 * Each generated home has 11 distinct section types and ~50 nodes.
 */
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import { responsivizeMobile } from './responsivize';
import {
  createContainerNode,
  createTextNode,
  createButtonNode,
  createImageNode,
  assignCanvasNodeZIndices,
  resolveHeadingFontFamily,
  resolveBodyFontFamily,
} from '@/lib/builder/decompose/shared';
import type { PageTemplate } from '../types';

const W = 1280;
const PAD = 80; // page side padding
const GAP = 88; // vertical gap between sections

/** Resolved color set for one industry. All on-canvas hex (templates render with literal colors). */
export interface IndustryPalette {
  /** page background / hero base */
  base: string;
  /** light section surface */
  surface: string;
  /** alternate (tinted) section surface */
  surfaceAlt: string;
  /** primary ink (headings/body on light) */
  ink: string;
  /** muted ink (secondary text on light) */
  mutedInk: string;
  /** accent (CTAs, eyebrows, numerals) */
  accent: string;
  /** ink that sits ON the accent color (button label) */
  onAccent: string;
  /** hairline / border color */
  line: string;
}

export interface IndustryHomeConfig {
  id: string;
  name: string;
  category: PageTemplate['category'];
  description: string;
  palette: IndustryPalette;
  /** hero full-bleed background image (/images/...) */
  heroImage: string;
  heroImageAlt: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  /** 3 trust stats */
  stats: Array<{ value: string; label: string }>;
  servicesTitle: string;
  servicesSubtitle: string;
  /** exactly 3 service cards, each with a real image */
  services: Array<{ title: string; desc: string; image: string; imageAlt: string }>;
  featureTitle: string;
  featureBody: string;
  /** 3 short feature bullets */
  featureBullets: string[];
  featureImage: string;
  featureImageAlt: string;
  processTitle: string;
  /** exactly 3 numbered process steps */
  process: Array<{ step: string; title: string; desc: string }>;
  testimonialQuote: string;
  testimonialAuthor: string;
  testimonialRole: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
}

function heading(
  id: string,
  rect: BuilderCanvasNode['rect'],
  text: string,
  level: number,
  color: string,
  align: 'left' | 'center' | 'right' = 'left',
  parentId?: string,
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

/* ── WCAG contrast helpers — keep accent/muted text legible on light tints (AA) ── */
function _rgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.replace(/./g, '$&$&');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function _hexColor(r: number, g: number, b: number): string {
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
/** Darken `fg` toward black only as far as needed to clear `target` contrast on `bg`. */
function ensureContrast(fg: string, bg: string, target: number): string {
  let [r, g, b] = _rgb(fg);
  const bgc = _rgb(bg);
  for (let i = 0; i < 30 && _contrast([r, g, b], bgc) < target; i++) { r *= 0.92; g *= 0.92; b *= 0.92; }
  return _hexColor(r, g, b);
}

/**
 * Build a complete, image-rich industry home page as a PageTemplate.
 * Layout uses a running Y cursor so section order/heights stay consistent and STAGE_H is exact.
 */
export function buildIndustryHome(cfg: IndustryHomeConfig): PageTemplate {
  const p = cfg.palette;
  // Contrast-safe text colors for the light-tint bands (stat/feature on surfaceAlt, process number on surface).
  // Stat value & process number render large (≥24px) → AA 3:1; the muted labels are small → AA 4.5:1.
  const statValueColor = ensureContrast(p.accent, p.surfaceAlt, 3.1);
  const onSurfaceAltMuted = ensureContrast(p.mutedInk, p.surfaceAlt, 4.5);
  const procNumColor = ensureContrast(p.accent, p.surface, 3.1);
  // Serif display headings + sans body — matches the 호정 public-site bar (helpers existed, builder never used them → system-ui).
  const headFont = resolveHeadingFontFamily('ko');
  const bodyFont = resolveBodyFontFamily('ko');
  const nodes: BuilderCanvasNode[] = [];
  let y = 0;

  /* ── 1. Hero (full-bleed image + dark overlay + copy + 2 CTAs) ───────── */
  const HERO_H = 620;
  nodes.push(
    createContainerNode({ id: `${cfg.id}-hero`, rect: { x: 0, y, width: W, height: HERO_H }, background: p.base, borderRadius: 0 }),
    createImageNode({
      id: `${cfg.id}-hero-bg`,
      parentId: `${cfg.id}-hero`,
      rect: { x: 0, y: 0, width: W, height: HERO_H },
      src: cfg.heroImage,
      alt: cfg.heroImageAlt,
      style: { opacity: 65, borderRadius: 0 },
    }),
    // Gradient scrim (호정 ~100° ramp): dark where the left-aligned copy sits → transparent right.
    // Guarantees AA legibility over ANY photo, adds premium depth. (No official way to measure
    // contrast over a photo → engineer it — verified via deep research, W3C 1.4.3.)
    createContainerNode({
      id: `${cfg.id}-hero-scrim`,
      parentId: `${cfg.id}-hero`,
      rect: { x: 0, y: 0, width: W, height: HERO_H },
      background: `linear-gradient(100deg,${p.base}f0,${p.base}1a 75%)`,
      borderRadius: 0,
    }),
    createTextNode({
      id: `${cfg.id}-hero-eyebrow`,
      parentId: `${cfg.id}-hero`,
      rect: { x: PAD, y: 150, width: 700, height: 28 },
      text: cfg.heroEyebrow,
      fontSize: 15,
      color: '#ffffff',
      fontWeight: 'bold',
      align: 'left',
      className: 'hero-eyebrow',
    }),
    heading(`${cfg.id}-hero-title`, { x: PAD, y: 192, width: 760, height: 168 }, cfg.heroTitle, 1, '#ffffff', 'left', `${cfg.id}-hero`, 'hero-title'),
    createTextNode({
      id: `${cfg.id}-hero-sub`,
      parentId: `${cfg.id}-hero`,
      rect: { x: PAD, y: 384, width: 600, height: 84 },
      text: cfg.heroSubtitle,
      fontSize: 19,
      color: 'rgba(255,255,255,0.88)',
      fontWeight: 'regular',
      align: 'left',
      lineHeight: 1.6,
      className: 'hero-subtitle',
    }),
    createButtonNode({
      id: `${cfg.id}-hero-cta1`,
      parentId: `${cfg.id}-hero`,
      rect: { x: PAD, y: 492, width: 210, height: 56 },
      label: cfg.heroPrimaryCta,
      href: '#contact',
      variant: 'primary',
      className: 'hero-cta',
      style: { backgroundColor: p.accent, borderRadius: 8 },
    }),
    createButtonNode({
      id: `${cfg.id}-hero-cta2`,
      parentId: `${cfg.id}-hero`,
      rect: { x: PAD + 230, y: 492, width: 190, height: 56 },
      label: cfg.heroSecondaryCta,
      href: '#services',
      variant: 'secondary',
      style: { backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 8 },
    }),
  );
  y += HERO_H;

  /* ── 2. Trust / stat band ────────────────────────────────────────────── */
  const STAT_H = 168;
  nodes.push(
    createContainerNode({ id: `${cfg.id}-stats`, rect: { x: 0, y, width: W, height: STAT_H }, background: p.surfaceAlt, borderRadius: 0, className: 'stat-card' }),
  );
  const statW = (W - PAD * 2) / cfg.stats.length;
  cfg.stats.forEach((s, i) => {
    const sx = PAD + statW * i;
    nodes.push(
      heading(`${cfg.id}-stat-${i}-v`, { x: sx, y: 44, width: statW - 24, height: 56 }, s.value, 2, statValueColor, 'left', `${cfg.id}-stats`),
      createTextNode({
        id: `${cfg.id}-stat-${i}-l`,
        parentId: `${cfg.id}-stats`,
        rect: { x: sx, y: 104, width: statW - 24, height: 36 },
        text: s.label,
        fontSize: 15,
        color: onSurfaceAltMuted,
        fontWeight: 'medium',
        align: 'left',
      }),
    );
  });
  y += STAT_H;

  /* ── 3. Services (heading + 3 image cards) ───────────────────────────── */
  y += GAP;
  nodes.push(
    heading(`${cfg.id}-svc-title`, { x: PAD, y, width: 760, height: 52 }, cfg.servicesTitle, 2, p.ink, 'left', undefined, 'section-label'),
    createTextNode({
      id: `${cfg.id}-svc-sub`,
      rect: { x: PAD, y: y + 60, width: 720, height: 56 },
      text: cfg.servicesSubtitle,
      fontSize: 17,
      color: p.mutedInk,
      fontWeight: 'regular',
      align: 'left',
      lineHeight: 1.6,
      className: 'card-copy',
    }),
  );
  const cardsTop = y + 148;
  const cardGap = 28;
  const cardW = (W - PAD * 2 - cardGap * 2) / 3;
  const cardH = 380;
  cfg.services.slice(0, 3).forEach((svc, i) => {
    const cx = PAD + (cardW + cardGap) * i;
    const cid = `${cfg.id}-card-${i}`;
    nodes.push(
      createContainerNode({ id: cid, rect: { x: cx, y: cardsTop, width: cardW, height: cardH }, background: p.surface, borderColor: p.line, borderWidth: 1, borderRadius: 16, className: 'services-detail-card', style: { shadowX: 0, shadowY: 10, shadowBlur: 28, shadowSpread: -8, shadowColor: 'rgba(15,23,42,0.10)' } }),
      createImageNode({
        id: `${cid}-img`,
        parentId: cid,
        rect: { x: 0, y: 0, width: cardW, height: 188 },
        src: svc.image,
        alt: svc.imageAlt,
        style: { opacity: 100, borderRadius: 16 },
      }),
      heading(`${cid}-title`, { x: 24, y: 212, width: cardW - 48, height: 34 }, svc.title, 3, p.ink, 'left', cid, 'card-title'),
      createTextNode({
        id: `${cid}-desc`,
        parentId: cid,
        rect: { x: 24, y: 256, width: cardW - 48, height: 104 },
        text: svc.desc,
        fontSize: 15,
        color: p.mutedInk,
        fontWeight: 'regular',
        align: 'left',
        lineHeight: 1.6,
        className: 'card-copy',
      }),
    );
  });
  y = cardsTop + cardH;

  /* ── 4. Feature split (image left, copy + bullets right) ─────────────── */
  y += GAP;
  const FEAT_H = 420;
  const featImgW = 560;
  nodes.push(
    createContainerNode({ id: `${cfg.id}-feat`, rect: { x: 0, y, width: W, height: FEAT_H }, background: p.surfaceAlt, borderRadius: 0, className: 'split-text' }),
    createImageNode({
      id: `${cfg.id}-feat-img`,
      parentId: `${cfg.id}-feat`,
      rect: { x: PAD, y: 40, width: featImgW, height: FEAT_H - 80 },
      src: cfg.featureImage,
      alt: cfg.featureImageAlt,
      style: { opacity: 100, borderRadius: 16, shadowX: 0, shadowY: 12, shadowBlur: 32, shadowSpread: -8, shadowColor: 'rgba(15,23,42,0.12)' },
    }),
    heading(`${cfg.id}-feat-title`, { x: PAD + featImgW + 56, y: 72, width: W - (PAD + featImgW + 56) - PAD, height: 96 }, cfg.featureTitle, 2, p.ink, 'left', `${cfg.id}-feat`),
    createTextNode({
      id: `${cfg.id}-feat-body`,
      parentId: `${cfg.id}-feat`,
      rect: { x: PAD + featImgW + 56, y: 176, width: W - (PAD + featImgW + 56) - PAD, height: 96 },
      text: cfg.featureBody,
      fontSize: 17,
      color: onSurfaceAltMuted,
      fontWeight: 'regular',
      align: 'left',
      lineHeight: 1.7,
    }),
  );
  cfg.featureBullets.slice(0, 3).forEach((b, i) => {
    nodes.push(
      createTextNode({
        id: `${cfg.id}-feat-b-${i}`,
        parentId: `${cfg.id}-feat`,
        rect: { x: PAD + featImgW + 56, y: 288 + i * 38, width: W - (PAD + featImgW + 56) - PAD, height: 32 },
        text: `— ${b}`,
        fontSize: 16,
        color: p.ink,
        fontWeight: 'medium',
        align: 'left',
      }),
    );
  });
  y += FEAT_H;

  /* ── 4b. Process / how it works (numbered 3-step band) ───────────────── */
  y += GAP;
  const PROC_H = 300;
  nodes.push(
    createContainerNode({ id: `${cfg.id}-proc`, rect: { x: 0, y, width: W, height: PROC_H }, background: p.surface, borderRadius: 0 }),
    heading(`${cfg.id}-proc-title`, { x: PAD, y: 48, width: W - PAD * 2, height: 48 }, cfg.processTitle, 2, p.ink, 'center', `${cfg.id}-proc`),
  );
  const stepGap = 28;
  const stepW = (W - PAD * 2 - stepGap * 2) / 3;
  cfg.process.slice(0, 3).forEach((st, i) => {
    const sx = PAD + (stepW + stepGap) * i;
    nodes.push(
      heading(`${cfg.id}-proc-${i}-n`, { x: sx, y: 132, width: stepW, height: 48 }, st.step, 3, procNumColor, 'left', `${cfg.id}-proc`),
      heading(`${cfg.id}-proc-${i}-t`, { x: sx, y: 184, width: stepW, height: 34 }, st.title, 4, p.ink, 'left', `${cfg.id}-proc`),
      createTextNode({
        id: `${cfg.id}-proc-${i}-d`,
        parentId: `${cfg.id}-proc`,
        rect: { x: sx, y: 224, width: stepW, height: 64 },
        text: st.desc,
        fontSize: 14,
        color: p.mutedInk,
        fontWeight: 'regular',
        align: 'left',
        lineHeight: 1.55,
      }),
    );
  });
  y += PROC_H;

  /* ── 5. Testimonial band ─────────────────────────────────────────────── */
  y += GAP;
  const TEST_H = 300;
  nodes.push(
    createContainerNode({ id: `${cfg.id}-test`, rect: { x: 0, y, width: W, height: TEST_H }, background: p.base, borderRadius: 0 }),
    heading(`${cfg.id}-test-quote`, { x: PAD, y: 64, width: W - PAD * 2, height: 120 }, `“${cfg.testimonialQuote}”`, 3, '#ffffff', 'center', `${cfg.id}-test`),
    createTextNode({
      id: `${cfg.id}-test-author`,
      parentId: `${cfg.id}-test`,
      rect: { x: PAD, y: 200, width: W - PAD * 2, height: 28 },
      text: cfg.testimonialAuthor,
      fontSize: 17,
      color: '#ffffff',
      fontWeight: 'bold',
      align: 'center',
    }),
    createTextNode({
      id: `${cfg.id}-test-role`,
      parentId: `${cfg.id}-test`,
      rect: { x: PAD, y: 230, width: W - PAD * 2, height: 26 },
      text: cfg.testimonialRole,
      fontSize: 15,
      color: 'rgba(255,255,255,0.75)',
      fontWeight: 'regular',
      align: 'center',
    }),
  );
  y += TEST_H;

  /* ── 6. Closing CTA band ─────────────────────────────────────────────── */
  y += GAP;
  const CTA_H = 260;
  nodes.push(
    createContainerNode({ id: `${cfg.id}-cta`, rect: { x: 0, y, width: W, height: CTA_H }, background: p.surface, borderRadius: 0 }),
    heading(`${cfg.id}-cta-title`, { x: PAD, y: 56, width: W - PAD * 2, height: 60 }, cfg.ctaTitle, 2, p.ink, 'center', `${cfg.id}-cta`),
    createTextNode({
      id: `${cfg.id}-cta-sub`,
      parentId: `${cfg.id}-cta`,
      rect: { x: W / 2 - 320, y: 124, width: 640, height: 56 },
      text: cfg.ctaSubtitle,
      fontSize: 17,
      color: p.mutedInk,
      fontWeight: 'regular',
      align: 'center',
      lineHeight: 1.6,
    }),
    createButtonNode({
      id: `${cfg.id}-cta-btn`,
      parentId: `${cfg.id}-cta`,
      rect: { x: W / 2 - 120, y: 192, width: 240, height: 56 },
      label: cfg.ctaButton,
      href: '#contact',
      variant: 'primary',
      style: { backgroundColor: p.accent, borderRadius: 8 },
    }),
  );
  y += CTA_H;

  const STAGE_H = y;

  // Inject the serif/sans pairing onto every heading/text node (node-count-neutral).
  const withFonts = nodes.map((n) => {
    if (n.kind === 'heading' || n.kind === 'text') {
      const c = n.content as { fontFamily?: string } & Record<string, unknown>;
      return { ...n, content: { ...c, fontFamily: c.fontFamily ?? (n.kind === 'heading' ? headFont : bodyFont) } } as BuilderCanvasNode;
    }
    return n;
  });

  const finalNodes = assignCanvasNodeZIndices(withFonts);
  // Populate responsive.mobile overrides so the home reflows to a single column on phones
  // instead of keeping the 1280px desktop layout (the audit's "Responsive 2/5").
  responsivizeMobile(finalNodes);

  return {
    id: cfg.id,
    name: cfg.name,
    category: cfg.category,
    subcategory: 'home',
    description: cfg.description,
    thumbnail: { type: 'auto' },
    document: {
      version: 1,
      locale: 'ko',
      updatedAt: '2026-05-29T00:00:00+09:00',
      updatedBy: 'template-system',
      stageWidth: W,
      stageHeight: STAGE_H,
      nodes: finalNodes,
    },
  };
}
