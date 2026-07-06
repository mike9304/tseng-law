import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type {
  BuilderComparisonTableCanvasNode,
  BuilderPricingTableCanvasNode,
  BuilderTeamMemberCardCanvasNode,
  BuilderTestimonialCarouselCanvasNode,
} from '@/lib/builder/canvas/types';
import comparisonTableComponent from '../comparisonTable';
import {
  COMPARISON_TABLE_LEGACY_DEFAULT_COLUMNS,
  COMPARISON_TABLE_LEGACY_DEFAULT_ROWS,
  getMarketingWidgetsCopy,
  localizedTeamMemberContent,
  localizedTestimonialItems,
  PRICING_TABLE_LEGACY_DEFAULT_PLANS,
  TEAM_MEMBER_CARD_LEGACY_DEFAULTS,
  TESTIMONIAL_CAROUSEL_LEGACY_DEFAULT_ITEMS,
} from '../marketing-widgets-copy';
import pricingTableComponent from '../pricingTable';
import teamMemberCardComponent from '../teamMemberCard';
import testimonialCarouselComponent from '../testimonialCarousel';

const componentRoot = join(process.cwd(), 'src/lib/builder/components');

describe('marketing widget localization', () => {
  it('returns localized helper copy in zh-hant', () => {
    const copy = getMarketingWidgetsCopy('zh-hant');

    expect(copy.pricingTable).toMatchObject({
      empty: '請在檢查器新增方案',
      defaultCtaLabel: '選擇',
    });
    expect(copy.pricingTable.defaultPlans[0]).toMatchObject({
      name: '基礎',
      ctaHref: '/zh-hant/contact',
    });
    expect(copy.comparisonTable.empty).toBe('請在檢查器新增比較項目');
    expect(copy.comparisonTable.defaultColumns).toEqual(['基礎', '標準', '進階']);
    expect(copy.comparisonTable.defaultRows[0]).toMatchObject({
      feature: '每月諮詢件數',
      values: ['1 次', '5 次', '不限次數'],
    });
    expect(copy.teamMemberCard.inspector).toMatchObject({
      name: '姓名',
      role: '職稱',
      cardStyle: '卡片樣式',
    });
    expect(copy.teamMemberCard.defaultContent).toMatchObject({
      name: '王律師',
      role: '合夥律師 · 韓國與台灣資格',
      bio: '專精跨國企業顧問與韓台雙邊協商。',
    });
    expect(copy.teamMemberCard.inspector.cardVariants.glass).toBe('玻璃');
    expect(copy.testimonialCarousel.itemAriaLabel(2)).toBe('推薦 2');
    expect(copy.testimonialCarousel.defaultItems[0]).toMatchObject({
      name: '台灣科技公司',
      role: '法務主管',
      quote: '韓台雙邊法務風險被清楚拆解，內部決策更有依據。',
    });
  });

  it('localizes legacy default team member content in zh-hant without changing custom content', () => {
    const TeamRender = teamMemberCardComponent.Render as React.ComponentType<{
      node: BuilderTeamMemberCardCanvasNode;
      mode?: 'edit' | 'preview' | 'published';
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const TeamInspector = teamMemberCardComponent.Inspector as React.ComponentType<{
      node: BuilderTeamMemberCardCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const zhCopy = getMarketingWidgetsCopy('zh-hant');
    const legacyNode = {
      id: 'team-legacy',
      kind: 'team-member-card',
      content: {
        ...TEAM_MEMBER_CARD_LEGACY_DEFAULTS,
        socialLinks: TEAM_MEMBER_CARD_LEGACY_DEFAULTS.socialLinks.map((link) => ({ ...link })),
        variant: 'flat',
      },
    } as unknown as BuilderTeamMemberCardCanvasNode;
    const customNode = {
      ...legacyNode,
      content: {
        ...legacyNode.content,
        name: 'Custom attorney',
        role: 'Custom role',
        bio: 'Custom bio',
      },
    } as BuilderTeamMemberCardCanvasNode;

    expect(localizedTeamMemberContent(legacyNode.content, zhCopy.teamMemberCard.defaultContent)).toMatchObject({
      name: '王律師',
      role: '合夥律師 · 韓國與台灣資格',
      bio: '專精跨國企業顧問與韓台雙邊協商。',
    });
    expect(localizedTeamMemberContent(customNode.content, zhCopy.teamMemberCard.defaultContent)).toMatchObject({
      name: 'Custom attorney',
      role: 'Custom role',
      bio: 'Custom bio',
    });

    const legacyHtml = renderToStaticMarkup(
      <TeamRender node={legacyNode} mode="preview" locale="zh-hant" />,
    );
    expect(legacyHtml).toContain('王律師');
    expect(legacyHtml).toContain('合夥律師 · 韓國與台灣資格');
    expect(legacyHtml).toContain('專精跨國企業顧問與韓台雙邊協商。');
    expect(legacyHtml).not.toContain('김 변호사');
    expect(legacyHtml).not.toContain('대표 변호사');

    const legacyInspectorHtml = renderToStaticMarkup(
      <TeamInspector node={legacyNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(legacyInspectorHtml).toContain('data-builder-team-member-card-inspector="true"');
    expect(legacyInspectorHtml).toContain('value="王律師"');
    expect(legacyInspectorHtml).toContain('value="合夥律師 · 韓國與台灣資格"');
    expect(legacyInspectorHtml).toContain('專精跨國企業顧問與韓台雙邊協商。');

    const customHtml = renderToStaticMarkup(
      <TeamRender node={customNode} mode="preview" locale="zh-hant" />,
    );
    expect(customHtml).toContain('Custom attorney');
    expect(customHtml).toContain('Custom role');
    expect(customHtml).toContain('Custom bio');
    expect(customHtml).not.toContain('王律師');
  });

  it('localizes legacy default comparison table data in zh-hant without changing custom tables', () => {
    const ComparisonRender = comparisonTableComponent.Render as React.ComponentType<{
      node: BuilderComparisonTableCanvasNode;
      mode?: 'edit' | 'preview' | 'published';
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const ComparisonInspector = comparisonTableComponent.Inspector as React.ComponentType<{
      node: BuilderComparisonTableCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const legacyNode = {
      id: 'comparison-legacy',
      kind: 'comparison-table',
      content: {
        columns: COMPARISON_TABLE_LEGACY_DEFAULT_COLUMNS,
        rows: COMPARISON_TABLE_LEGACY_DEFAULT_ROWS,
      },
    } as unknown as BuilderComparisonTableCanvasNode;
    const customNode = {
      id: 'comparison-custom',
      kind: 'comparison-table',
      content: {
        columns: ['One', 'Two'],
        rows: [{ feature: 'Custom feature', values: ['A', 'B'] }],
      },
    } as unknown as BuilderComparisonTableCanvasNode;

    const legacyHtml = renderToStaticMarkup(
      <ComparisonRender node={legacyNode} mode="preview" locale="zh-hant" />,
    );
    expect(legacyHtml).toContain('基礎');
    expect(legacyHtml).toContain('進階');
    expect(legacyHtml).toContain('每月諮詢件數');
    expect(legacyHtml).toContain('不限次數');
    expect(legacyHtml).not.toContain('월 상담 건수');
    expect(legacyHtml).not.toContain('무제한');

    const legacyInspectorHtml = renderToStaticMarkup(
      <ComparisonInspector node={legacyNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(legacyInspectorHtml).toContain('data-builder-comparison-table-inspector="true"');
    expect(legacyInspectorHtml).toContain('基礎');
    expect(legacyInspectorHtml).toContain('每月諮詢件數 | 1 次 | 5 次 | 不限次數');

    const customHtml = renderToStaticMarkup(
      <ComparisonRender node={customNode} mode="preview" locale="zh-hant" />,
    );
    expect(customHtml).toContain('One');
    expect(customHtml).toContain('Custom feature');
  });

  it('localizes legacy default pricing plans in zh-hant without changing custom plans', () => {
    const PricingRender = pricingTableComponent.Render as React.ComponentType<{
      node: BuilderPricingTableCanvasNode;
      mode?: 'edit' | 'preview' | 'published';
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const PricingInspector = pricingTableComponent.Inspector as React.ComponentType<{
      node: BuilderPricingTableCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const legacyNode = {
      id: 'pricing-legacy',
      kind: 'pricing-table',
      content: {
        plans: PRICING_TABLE_LEGACY_DEFAULT_PLANS,
      },
    } as unknown as BuilderPricingTableCanvasNode;
    const customNode = {
      id: 'pricing-custom',
      kind: 'pricing-table',
      content: {
        plans: [
          {
            name: 'Custom',
            price: '$99',
            period: '/ mo',
            featured: false,
            ctaLabel: 'Buy',
            ctaHref: '/custom',
            features: ['Custom feature'],
          },
        ],
      },
    } as unknown as BuilderPricingTableCanvasNode;

    const legacyHtml = renderToStaticMarkup(
      <PricingRender node={legacyNode} mode="preview" locale="zh-hant" />,
    );
    expect(legacyHtml).toContain('基礎');
    expect(legacyHtml).toContain('NT$15,000');
    expect(legacyHtml).toContain('/zh-hant/contact');
    expect(legacyHtml).toContain('初次 1 小時諮詢');
    expect(legacyHtml).not.toContain('50만원');
    expect(legacyHtml).not.toContain('/ko/contact');

    const legacyInspectorHtml = renderToStaticMarkup(
      <PricingInspector node={legacyNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(legacyInspectorHtml).toContain('data-builder-pricing-table-inspector="true"');
    expect(legacyInspectorHtml).toContain('基礎 | NT$15,000');
    expect(legacyInspectorHtml).toContain('/zh-hant/contact');

    const customHtml = renderToStaticMarkup(
      <PricingRender node={customNode} mode="preview" locale="zh-hant" />,
    );
    expect(customHtml).toContain('Custom');
    expect(customHtml).toContain('$99');
    expect(customHtml).toContain('/custom');
  });

  it('renders localized pricing and comparison table chrome in zh-hant', () => {
    const PricingRender = pricingTableComponent.Render as React.ComponentType<{
      node: BuilderPricingTableCanvasNode;
      mode?: 'edit' | 'preview' | 'published';
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const PricingInspector = pricingTableComponent.Inspector as React.ComponentType<{
      node: BuilderPricingTableCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const ComparisonRender = comparisonTableComponent.Render as React.ComponentType<{
      node: BuilderComparisonTableCanvasNode;
      mode?: 'edit' | 'preview' | 'published';
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const ComparisonInspector = comparisonTableComponent.Inspector as React.ComponentType<{
      node: BuilderComparisonTableCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;

    const pricingNode = {
      id: 'pricing-1',
      kind: 'pricing-table',
      content: {
        plans: [],
      },
    } as unknown as BuilderPricingTableCanvasNode;
    const comparisonNode = {
      id: 'comparison-1',
      kind: 'comparison-table',
      content: {
        columns: ['基本', '進階'],
        rows: [],
      },
    } as unknown as BuilderComparisonTableCanvasNode;

    const pricingHtml = renderToStaticMarkup(
      <PricingRender node={pricingNode} mode="preview" locale="zh-hant" />,
    );
    expect(pricingHtml).toContain('請在檢查器新增方案');

    const pricingInspectorHtml = renderToStaticMarkup(
      <PricingInspector node={pricingNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(pricingInspectorHtml).toContain('data-builder-pricing-table-inspector="true"');
    expect(pricingInspectorHtml).toContain('方案（name | price | period | featured | ctaLabel | ctaHref | feature1; feature2）');

    const comparisonHtml = renderToStaticMarkup(
      <ComparisonRender node={comparisonNode} mode="preview" locale="zh-hant" />,
    );
    expect(comparisonHtml).toContain('請在檢查器新增比較項目');

    const comparisonInspectorHtml = renderToStaticMarkup(
      <ComparisonInspector node={comparisonNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(comparisonInspectorHtml).toContain('data-builder-comparison-table-inspector="true"');
    expect(comparisonInspectorHtml).toContain('欄位（每行一個）');
    expect(comparisonInspectorHtml).toContain('列（feature | value1 | value2 ...）');
  });

  it('keeps the comparison table inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'comparisonTable/index.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'comparisonTable/ComparisonTableInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './ComparisonTableInspector.module.css';");
    expect(source).toContain('data-builder-comparison-table-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={`${styles.control} ${styles.compactTextarea}`}',
    ]) {
      expect(source).toContain(classUsage);
    }
    for (const removedInlineStyle of [
      "style={{ fontFamily: 'inherit' }}",
      "style={{ fontFamily: 'inherit', fontSize: 11 }}",
      'style=',
      'React.CSSProperties',
    ]) {
      expect(source).not.toContain(removedInlineStyle);
    }
    expect(css).toContain('.control:focus-visible');
    expect(css).toContain('.compactTextarea');
  });

  it('keeps the pricing table inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'pricingTable/index.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'pricingTable/PricingTableInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './PricingTableInspector.module.css';");
    expect(source).toContain('data-builder-pricing-table-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={`${styles.control} ${styles.textarea}`}',
    ]) {
      expect(source).toContain(classUsage);
    }
    expect(source).not.toContain("style={{ fontFamily: 'inherit', resize: 'vertical', fontSize: 11 }}");
    expect(css).toContain('.textarea');
    expect(css).toContain('.control:focus-visible');
  });

  it('keeps the team member card inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'teamMemberCard/index.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'teamMemberCard/TeamMemberCardInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './TeamMemberCardInspector.module.css';");
    expect(source).toContain('data-builder-team-member-card-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={`${styles.control} ${styles.textarea}`}',
    ]) {
      expect(source).toContain(classUsage);
    }
    expect(source).not.toContain("style={{ fontFamily: 'inherit' }}");
    expect(css).toContain('.textarea');
    expect(css).toContain('.control:focus-visible');
  });

  it('renders localized team and testimonial controls in zh-hant', () => {
    const TeamInspector = teamMemberCardComponent.Inspector as React.ComponentType<{
      node: BuilderTeamMemberCardCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const TestimonialRender = testimonialCarouselComponent.Render as React.ComponentType<{
      node: BuilderTestimonialCarouselCanvasNode;
      mode?: 'edit' | 'preview' | 'published';
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const TestimonialInspector = testimonialCarouselComponent.Inspector as React.ComponentType<{
      node: BuilderTestimonialCarouselCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;

    const teamNode = {
      id: 'team-1',
      kind: 'team-member-card',
      content: {
        name: '王律師',
        role: '合夥人',
        bio: '跨境法律顧問',
        avatar: '',
        socialLinks: [{ label: 'LinkedIn', href: 'https://linkedin.com/' }],
        variant: 'glass',
      },
    } as unknown as BuilderTeamMemberCardCanvasNode;
    const testimonialNode = {
      id: 'testimonial-1',
      kind: 'testimonial-carousel',
      content: {
        items: [
          { name: '客戶 A', role: 'CEO', quote: '服務很可靠' },
          { name: '客戶 B', role: 'Founder', quote: '回覆很快' },
        ],
        autoplayMs: 6000,
        showStars: true,
      },
    } as unknown as BuilderTestimonialCarouselCanvasNode;
    const emptyTestimonialNode = {
      ...testimonialNode,
      content: { ...testimonialNode.content, items: [] },
    } as BuilderTestimonialCarouselCanvasNode;

    const teamInspectorHtml = renderToStaticMarkup(
      <TeamInspector node={teamNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(teamInspectorHtml).toContain('姓名');
    expect(teamInspectorHtml).toContain('頭像 URL');
    expect(teamInspectorHtml).toContain('社群（label | href）');
    expect(teamInspectorHtml).toContain('玻璃');

    const testimonialHtml = renderToStaticMarkup(
      <TestimonialRender node={testimonialNode} mode="preview" locale="zh-hant" />,
    );
    expect(testimonialHtml).toContain('aria-label="推薦 1"');
    expect(testimonialHtml).toContain('aria-label="推薦 2"');

    const emptyTestimonialHtml = renderToStaticMarkup(
      <TestimonialRender node={emptyTestimonialNode} mode="preview" locale="zh-hant" />,
    );
    expect(emptyTestimonialHtml).toContain('請在檢查器新增客戶推薦');

    const testimonialInspectorHtml = renderToStaticMarkup(
      <TestimonialInspector node={testimonialNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(testimonialInspectorHtml).toContain('data-builder-testimonial-carousel-inspector="true"');
    expect(testimonialInspectorHtml).toContain('推薦（name | role | quote）');
    expect(testimonialInspectorHtml).toContain('自動切換（ms，0 = 關閉）');
    expect(testimonialInspectorHtml).toContain('顯示星等');
  });

  it('keeps the testimonial carousel inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'testimonialCarousel/index.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'testimonialCarousel/TestimonialCarouselInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './TestimonialCarouselInspector.module.css';");
    expect(source).toContain('data-builder-testimonial-carousel-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={`${styles.control} ${styles.textarea}`}',
      'className={styles.checkboxRow}',
    ]) {
      expect(source).toContain(classUsage);
    }
    for (const removedInlineStyle of [
      "style={{ fontFamily: 'inherit', resize: 'vertical' }}",
      "label style={{ display: 'flex', alignItems: 'center', gap: 6 }}",
      'style=',
    ]) {
      expect(source).not.toContain(removedInlineStyle);
    }
    expect(css).toContain('.control:focus-visible');
    expect(css).toContain('.checkboxRow');
    expect(css).toContain('.textarea');
  });

  it('localizes legacy default testimonial items in zh-hant without changing custom items', () => {
    const TestimonialRender = testimonialCarouselComponent.Render as React.ComponentType<{
      node: BuilderTestimonialCarouselCanvasNode;
      mode?: 'edit' | 'preview' | 'published';
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const TestimonialInspector = testimonialCarouselComponent.Inspector as React.ComponentType<{
      node: BuilderTestimonialCarouselCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const zhCopy = getMarketingWidgetsCopy('zh-hant');
    const legacyNode = {
      id: 'testimonial-legacy',
      kind: 'testimonial-carousel',
      content: {
        items: TESTIMONIAL_CAROUSEL_LEGACY_DEFAULT_ITEMS,
        autoplayMs: 6000,
        showStars: true,
      },
    } as unknown as BuilderTestimonialCarouselCanvasNode;
    const customNode = {
      ...legacyNode,
      content: {
        ...legacyNode.content,
        items: [
          { name: 'Custom client', role: 'Custom role', quote: 'Custom quote' },
        ],
      },
    } as BuilderTestimonialCarouselCanvasNode;

    expect(localizedTestimonialItems(legacyNode.content.items, zhCopy.testimonialCarousel.defaultItems)[0]).toMatchObject({
      name: '台灣科技公司',
      role: '法務主管',
      quote: '韓台雙邊法務風險被清楚拆解，內部決策更有依據。',
    });
    expect(localizedTestimonialItems(customNode.content.items, zhCopy.testimonialCarousel.defaultItems)).toEqual(customNode.content.items);

    const legacyHtml = renderToStaticMarkup(
      <TestimonialRender node={legacyNode} mode="preview" locale="zh-hant" />,
    );
    expect(legacyHtml).toContain('台灣科技公司');
    expect(legacyHtml).toContain('法務主管');
    expect(legacyHtml).toContain('韓台雙邊法務風險被清楚拆解，內部決策更有依據。');
    expect(legacyHtml).not.toContain('김 OO');
    expect(legacyHtml).not.toContain('기업 의뢰인');

    const legacyInspectorHtml = renderToStaticMarkup(
      <TestimonialInspector node={legacyNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(legacyInspectorHtml).toContain('台灣科技公司 | 法務主管 | 韓台雙邊法務風險被清楚拆解，內部決策更有依據。');
    expect(legacyInspectorHtml).not.toContain('한·대 양국 법무');

    const customHtml = renderToStaticMarkup(
      <TestimonialRender node={customNode} mode="preview" locale="zh-hant" />,
    );
    expect(customHtml).toContain('Custom client');
    expect(customHtml).toContain('Custom role');
    expect(customHtml).toContain('Custom quote');
    expect(customHtml).not.toContain('台灣科技公司');
  });
});
