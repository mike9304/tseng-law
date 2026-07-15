import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  builderCanvasDocumentSchema,
  isContainerLikeKind,
} from '@/lib/builder/canvas/types';
import { getHomeSectionTemplateMetadata } from '@/lib/builder/canvas/section-templates';
import {
  draftToCanvasNodes,
  draftToSitemapPageCanvasNodes,
  draftToSavedSectionSnapshots,
} from '@/lib/builder/ai-generator/canvas-import';
import { generateSiteDraft } from '@/lib/builder/ai-generator/orchestrator';

describe('AI canvas importer', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('AI_BUILDER_ALLOW_LOCAL_DEMO', 'true');
  });
  it('creates schema-valid container sections whose children can render', async () => {
    const draft = await generateSiteDraft({
      industry: 'law',
      companyName: '호정국제법률사무소',
      audience: '대만 진출을 준비하는 한국 기업',
      goals: ['상담 문의 증가', '칼럼 검색 유입 확보', '한국어 상담 노출'],
      desiredPages: ['홈', '업무분야', '칼럼', '문의'],
      brandKeywords: ['대만 법률', '한국어 상담', '기업 자문'],
      constraints: '모바일 CTA를 우선 노출',
      tone: 'authoritative',
      colorPreference: 'cool',
      locale: 'ko',
    });
    const nodes = draftToCanvasNodes({ draft, locale: 'ko', pageId: 'page-ai-test' });
    const byId = new Map(nodes.map((node) => [node.id, node]));

    expect(nodes.some((node) => node.kind === 'section')).toBe(false);
    expect(nodes.filter((node) => !node.parentId).length).toBeGreaterThanOrEqual(4);

    for (const root of nodes.filter((node) => !node.parentId)) {
      expect(root.kind).toBe('container');
      expect(root.kind === 'container' ? root.content.as : undefined).toBe('section');
      expect(root.kind === 'container' ? root.content.className : undefined).toBe('ai-generated-section');
    }
    const sectionTemplates = nodes
      .filter((node) => !node.parentId)
      .map((node) => getHomeSectionTemplateMetadata(node))
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
    expect(sectionTemplates.map((item) => item.id)).toEqual(
      expect.arrayContaining(['services', 'faq', 'offices']),
    );
    expect(nodes.some((node) => (
      node.kind === 'container'
      && !node.parentId
      && node.content.sectionTemplateId === 'services'
      && node.content.aiSectionTemplateKind === 'services'
    ))).toBe(true);

    for (const node of nodes.filter((candidate) => candidate.parentId)) {
      const parent = byId.get(node.parentId!);
      expect(parent, `${node.id} parent exists`).toBeTruthy();
      expect(isContainerLikeKind(parent!.kind), `${node.id} parent can render children`).toBe(true);
    }

    const parse = builderCanvasDocumentSchema.safeParse({
      version: 1,
      locale: 'ko',
      updatedAt: new Date().toISOString(),
      updatedBy: 'ai-generator-test',
      stageWidth: 1280,
      stageHeight: Math.max(...nodes.map((node) => node.rect.y + node.rect.height)),
      nodes,
    });
    expect(parse.success, parse.success ? '' : parse.error.issues[0]?.message).toBe(true);
  });

  it('adds professional layout primitives instead of plain text stacks', async () => {
    const draft = await generateSiteDraft({
      industry: 'law',
      companyName: '호정국제법률사무소',
      goals: ['상담 문의 증가', '칼럼 검색 유입 확보'],
      brandKeywords: ['대만 법률', '한국어 상담'],
      visualDirection: '타이베이 스카이라인, 인물 없는 고급 법률 상담 이미지',
      tone: 'professional',
      colorPreference: 'cool',
      locale: 'ko',
    });
    const nodes = draftToCanvasNodes({ draft, locale: 'ko', pageId: 'page-ai-design' });
    const cardNodes = nodes.filter(
      (node) => node.kind === 'container' && node.content.className?.includes('ai-generated-card'),
    );
    const proofCards = nodes.filter(
      (node) => node.kind === 'container' && node.content.className?.includes('ai-generated-proof-card'),
    );
    const mobileOverrides = nodes.filter((node) => node.responsive?.mobile?.rect);
    const visualCard = nodes.find(
      (node) => node.kind === 'container' && node.content.className?.includes('ai-generated-visual-card'),
    );
    const heroMedia = nodes.find((node) => node.kind === 'image' && node.id.endsWith('-hero-media'));
    const mediaBadge = nodes.find(
      (node) => node.kind === 'container' && node.content.className?.includes('ai-generated-media-badge'),
    );
    const promptChip = nodes.find(
      (node) => node.kind === 'container' && node.content.className?.includes('ai-generated-prompt-chip'),
    );
    const promptChipText = nodes.find((node) => node.id === 'ai-page-ai-design-0-prompt-chip-text');
    const paletteSwatches = nodes.filter(
      (node) => node.kind === 'container' && node.content.className?.includes('ai-generated-palette-swatch'),
    );
    const sectionAccentRails = nodes.filter(
      (node) => node.kind === 'container' && node.content.className?.includes('ai-generated-section-accent-rail'),
    );
    const sectionNumberPills = nodes.filter(
      (node) => node.kind === 'container' && node.content.className?.includes('ai-generated-section-number-pill'),
    );
    const firstSectionNumberText = nodes.find((node) => node.id === 'ai-page-ai-design-1-section-number-text');
    const ctaTrustStrip = nodes.find(
      (node) => node.kind === 'container' && node.content.className?.includes('ai-generated-cta-trust-strip'),
    );
    const ctaTrustStripText = nodes.find(
      (node) => node.kind === 'text' && node.content.className === 'ai-generated-cta-trust-strip-text',
    );
    const visualFrame = nodes.find(
      (node) => node.kind === 'container' && node.content.className?.includes('ai-generated-visual-frame'),
    );
    const variants = new Set(cardNodes.map((node) => node.kind === 'container' ? node.content.variant : undefined));
    const heroRoot = nodes.find((node) => node.id === 'ai-page-ai-design-0-section');
    const heroVisualMobileRect = visualCard?.responsive?.mobile?.rect;
    const visualFrameMobileRect = visualFrame?.responsive?.mobile?.rect;
    const proofMobileRects = proofCards.map((node) => node.responsive?.mobile?.rect);
    const proofCopyMobileRects = nodes
      .filter((node) => node.id.includes('-proof-copy-'))
      .map((node) => node.responsive?.mobile?.rect);

    expect(visualCard).toBeTruthy();
    expect(heroMedia).toBeTruthy();
    expect(heroMedia?.kind === 'image' ? heroMedia.content.src : '').toContain('/images/');
    expect(heroMedia?.kind === 'image' ? heroMedia.content.alt : '').toContain('타이베이 스카이라인');
    expect(heroMedia?.kind === 'image' ? heroMedia.content.generationPrompt : '').toContain('No readable text');
    expect(heroMedia?.kind === 'image' ? heroMedia.content.visualDirection : '').toContain('고급 법률 상담');
    expect(heroMedia?.kind === 'image' ? heroMedia.content.filters?.contrast : 0).toBeGreaterThanOrEqual(100);
    expect(mediaBadge).toBeTruthy();
    expect(promptChip).toBeTruthy();
    expect(promptChip?.responsive?.mobile?.rect).toMatchObject({ x: 240, y: 274, width: 150 });
    expect(promptChipText?.kind === 'text' ? promptChipText.content.text : '').toContain('텍스트 없는 이미지');
    expect(paletteSwatches).toHaveLength(3);
    expect(paletteSwatches.map((node) => node.kind === 'container' ? node.content.background : undefined)).toEqual([
      draft.palette.primary,
      draft.palette.accent,
      draft.palette.background,
    ]);
    expect(paletteSwatches.every((node) => node.responsive?.mobile?.rect?.y === 332)).toBe(true);
    expect(sectionAccentRails.length).toBeGreaterThanOrEqual(3);
    expect(sectionAccentRails.every((node) => node.responsive?.mobile?.rect?.height === 6)).toBe(true);
    expect(sectionNumberPills.length).toBeGreaterThanOrEqual(3);
    expect(sectionNumberPills[0]?.responsive?.mobile?.rect).toMatchObject({ x: 958, y: 58, width: 120 });
    expect(firstSectionNumberText?.kind === 'text' ? firstSectionNumberText.content.text : '').toBe('S-01');
    expect(ctaTrustStrip).toBeTruthy();
    expect(ctaTrustStrip?.responsive?.mobile?.rect).toMatchObject({ x: 48, y: 400, width: 1040, height: 30 });
    expect(ctaTrustStripText?.kind === 'text' ? ctaTrustStripText.content.text : '').toContain('모바일 안전 CTA');
    expect(visualFrame).toBeTruthy();
    expect(visualFrameMobileRect?.x).toBe(18);
    expect((visualFrameMobileRect?.width ?? 0)).toBeGreaterThanOrEqual(400);
    expect(proofCards).toHaveLength(3);
    expect(proofMobileRects.every((rect) => rect?.x === 48 && (rect.width ?? 0) >= 900)).toBe(true);
    expect((proofMobileRects[1]?.y ?? 0)).toBeGreaterThan(proofMobileRects[0]?.y ?? 0);
    expect((proofMobileRects[2]?.y ?? 0)).toBeGreaterThan(proofMobileRects[1]?.y ?? 0);
    expect(proofCopyMobileRects.every((rect) => (rect?.width ?? 0) >= 800)).toBe(true);
    expect(heroVisualMobileRect?.y ?? 0).toBeGreaterThan(
      (proofMobileRects.at(-1)?.y ?? 0) + (proofMobileRects.at(-1)?.height ?? 0),
    );
    expect(heroRoot?.responsive?.mobile?.rect?.height ?? 0).toBeGreaterThan(
      (heroVisualMobileRect?.y ?? 0) + (heroVisualMobileRect?.height ?? 0),
    );
    expect(cardNodes.length).toBeGreaterThanOrEqual(4);
    expect(cardNodes.some((node) => node.kind === 'container' && node.content.className?.includes('services-detail-card'))).toBe(true);
    expect(cardNodes.some((node) => node.kind === 'container' && node.content.className?.includes('faq-item'))).toBe(true);
    expect(nodes.some((node) => node.kind === 'button' && node.content.style === 'cta-shadow')).toBe(true);
    expect(nodes.some((node) => node.kind === 'button' && node.content.style === 'primary-outline')).toBe(true);
    expect(variants.size).toBeGreaterThanOrEqual(3);
    expect(mobileOverrides.length).toBeGreaterThanOrEqual(8);
    expect(nodes.every((node) => node.rect.width <= 1200)).toBe(true);
  });

  it('uses a selected uploaded builder asset as the hero media source', async () => {
    const draft = await generateSiteDraft({
      industry: 'law',
      companyName: '호정국제법률사무소',
      goals: ['상담 문의 증가', '칼럼 검색 유입 확보'],
      brandKeywords: ['대만 법률', '한국어 상담'],
      visualDirection: '전문적인 사무실 상담 이미지',
      heroImageAsset: {
        assetId: 'builder/assets/ko/uploaded-office-hero.webp',
        filename: 'uploaded-office-hero.webp',
        alt: '업로드된 사무실 히어로 이미지',
      },
      tone: 'professional',
      colorPreference: 'cool',
      locale: 'ko',
    });
    const nodes = draftToCanvasNodes({ draft, locale: 'ko', pageId: 'page-ai-asset' });
    const heroMedia = nodes.find((node) => node.kind === 'image' && node.id.endsWith('-hero-media'));

    expect(heroMedia?.kind).toBe('image');
    if (heroMedia?.kind !== 'image') throw new Error('hero media missing');
    expect(heroMedia.content.src).toBe('/api/builder/assets/ko/uploaded-office-hero.webp');
    expect(heroMedia.content.alt).toBe('업로드된 사무실 히어로 이미지');
    expect(heroMedia.content.generationPrompt).toContain('No readable text');
    expect(heroMedia.content.visualDirection).toContain('전문적인 사무실 상담 이미지');
    expect(heroMedia.content.filters?.contrast).toBeGreaterThanOrEqual(100);
  });

  it('exports generated root sections as reusable saved-section snapshots', async () => {
    const draft = await generateSiteDraft({
      industry: 'law',
      companyName: '호정국제법률사무소',
      goals: ['상담 문의 증가', '칼럼 검색 유입 확보'],
      brandKeywords: ['대만 법률', '한국어 상담'],
      tone: 'professional',
      colorPreference: 'cool',
      locale: 'ko',
    });
    const snapshots = draftToSavedSectionSnapshots({ draft, locale: 'ko', pageId: 'page-ai-section' });
    const services = snapshots.find((snapshot) => snapshot.sectionTemplateId === 'services');

    expect(snapshots.length).toBeGreaterThanOrEqual(4);
    expect(snapshots[0]?.category).toBe('hero');
    expect(snapshots.at(-1)?.category).toBe('cta');
    expect(services).toBeTruthy();
    if (!services) throw new Error('services snapshot missing');
    expect(services?.nodes[0]).toMatchObject({
      id: services.rootNodeId,
      parentId: undefined,
      rect: expect.objectContaining({ x: 0, y: 0 }),
    });
    expect(services?.nodes.some((node) => (
      node.kind === 'container'
      && node.content.className?.includes('services-detail-card')
    ))).toBe(true);
    expect(services?.nodes.some((node) => Boolean(node.responsive?.mobile?.rect))).toBe(true);
  });

  it('keeps mobile section CTA between copy and cards', async () => {
    const draft = await generateSiteDraft({
      industry: 'law',
      companyName: '호정국제법률사무소',
      goals: ['상담 문의 증가', '칼럼 검색 유입 확보'],
      brandKeywords: ['대만 법률', '한국어 상담'],
      tone: 'professional',
      colorPreference: 'cool',
      locale: 'ko',
    });
    draft.content.sections.unshift({
      sectionId: 'gallery',
      headline: '대표 사례',
      body: '모바일에서도 CTA와 카드가 서로 겹치지 않아야 합니다.',
      ctaLabel: '사례 더 보기',
      bullets: ['사례 1', '사례 2', '사례 3'],
    });

    const nodes = draftToCanvasNodes({ draft, locale: 'ko', pageId: 'page-ai-mobile' });
    const body = nodes.find((node) => node.id === 'ai-page-ai-mobile-1-body');
    const cta = nodes.find((node) => node.id === 'ai-page-ai-mobile-1-cta');
    const firstCard = nodes.find((node) => node.id === 'ai-page-ai-mobile-1-card-0');
    const root = nodes.find((node) => node.id === 'ai-page-ai-mobile-1-section');

    const bodyRect = body?.responsive?.mobile?.rect;
    const ctaRect = cta?.responsive?.mobile?.rect;
    const cardRect = firstCard?.responsive?.mobile?.rect;
    expect(bodyRect?.y).toBe(228);
    expect(ctaRect).toMatchObject({ x: 48, y: 360, width: 1040, height: 56 });
    expect(cardRect?.y).toBeGreaterThan((ctaRect?.y ?? 0) + (ctaRect?.height ?? 0));
    expect(root?.responsive?.mobile?.rect?.height).toBeGreaterThan((cardRect?.y ?? 0) + 152);
  });

  it('adds editable designer primitives to generated sitemap helper pages', async () => {
    const draft = await generateSiteDraft({
      industry: 'law',
      companyName: '호정국제법률사무소',
      goals: ['상담 문의 증가', '칼럼 검색 유입 확보'],
      brandKeywords: ['대만 법률', '한국어 상담'],
      desiredPages: ['홈', '칼럼'],
      tone: 'professional',
      colorPreference: 'cool',
      locale: 'ko',
    });
    const page = {
      title: '대만 법률 칼럼',
      slug: '/columns',
      purpose: '대만 진출과 국제법무 이슈를 검색 유입으로 연결하는 칼럼 허브입니다.',
      sections: ['overview', 'columns', 'faq'],
    };
    const nodes = draftToSitemapPageCanvasNodes({ draft, locale: 'ko', pageId: 'page-ai-sitemap', page });
    const frame = nodes.find(
      (node) => node.kind === 'container' && node.content.className?.includes('ai-generated-sitemap-page-frame'),
    );
    const accentBand = nodes.find(
      (node) => node.kind === 'container' && node.content.className?.includes('ai-generated-sitemap-accent-band'),
    );
    const pagePill = nodes.find(
      (node) => node.kind === 'container' && node.content.className?.includes('ai-generated-sitemap-page-pill'),
    );
    const pagePillText = nodes.find((node) => node.id === 'ai-page-ai-sitemap-0-sitemap-page-pill-text');
    const planStrip = nodes.find(
      (node) => node.kind === 'container' && node.content.className?.includes('ai-generated-sitemap-plan-strip'),
    );
    const planStripText = nodes.find((node) => node.id === 'ai-page-ai-sitemap-0-sitemap-plan-strip-text');
    const firstCard = nodes.find((node) => node.id === 'ai-page-ai-sitemap-0-section-card-0');

    expect(frame).toBeTruthy();
    expect(frame?.responsive?.mobile?.rect).toMatchObject({ x: 24, y: 52, width: 1092, height: 412 });
    expect(accentBand?.responsive?.mobile?.rect).toMatchObject({ x: 48, y: 82, width: 112, height: 6 });
    expect(pagePill?.responsive?.mobile?.rect).toMatchObject({ x: 920, y: 58, width: 148, height: 36 });
    expect(pagePillText?.kind === 'text' ? pagePillText.content.text : '').toBe('AI 페이지');
    expect(planStrip?.responsive?.mobile?.rect).toMatchObject({ x: 48, y: 426, width: 1040, height: 30 });
    expect(planStripText?.kind === 'text' ? planStripText.content.text : '').toContain('섹션 3개');
    expect(firstCard?.responsive?.mobile?.rect?.y ?? 0).toBeGreaterThan(
      (planStrip?.responsive?.mobile?.rect?.y ?? 0) + (planStrip?.responsive?.mobile?.rect?.height ?? 0),
    );
  });
});
