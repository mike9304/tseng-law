import { z } from 'zod';
import { locales, type Locale } from '@/lib/locales';
import {
  THEME_COLOR_TOKENS,
  THEME_TEXT_PRESET_KEYS,
  type BuilderBackgroundValue,
} from '@/lib/builder/site/theme';
import {
  BUTTON_STYLE_KEYS,
  CARD_VARIANT_KEYS,
  FORM_INPUT_VARIANT_KEYS,
} from '@/lib/builder/site/component-variants';
import {
  ANIMATION_EASING_KEYS,
  ENTRANCE_PRESET_KEYS,
  HOVER_ANIMATION_PRESET_KEYS,
  SCROLL_EFFECT_KEYS,
} from '@/lib/builder/animations/presets';
import { linkValueSchema } from '@/lib/builder/links';
import { createBuilderRichTextSchema } from '@/lib/builder/rich-text/types';
const imageFiltersSchema = z.object({
  brightness: z.number().min(0).max(200),
  contrast: z.number().min(0).max(200),
  saturation: z.number().min(0).max(200),
  blur: z.number().min(0).max(20),
  grayscale: z.number().min(0).max(100),
  sepia: z.number().min(0).max(100),
}).optional();

export const sandboxLocaleSchema = z.enum(locales);

export const builderCanvasNodeKinds = [
  'text',
  'image',
  'button',
  'heading',
  'container',
  'section',
  'composite',
  'divider',
  'spacer',
  'icon',
  'video',
  'video-embed',
  'audio',
  'lottie',
  'form',
  'form-input',
  'form-textarea',
  'form-submit',
  'form-select',
  'form-checkbox',
  'form-radio',
  'form-file',
  'form-date',
  // Phase 21 — Forms 후반
  'form-signature',
  'form-payment',
  // Phase 14 — Blog widgets
  'blog-feed',
  'blog-post-card',
  'blog-categories',
  'blog-archive',
  'featured-posts',
  // Phase 7 — Media / Domain widgets
  'gallery',
  'map',
  'customEmbed',
  'columnCard',
  'columnList',
  'attorneyCard',
  'faqList',
  'contactForm',
  'ctaBanner',
  'booking-widget',
  // Phase 15 — Interactive widgets
  'countdown',
  'progress',
  'rating',
  'notification-bar',
  'back-to-top',
  // Phase 16 — Navigation widgets
  'menu-bar',
  'anchor-menu',
  'breadcrumbs',
  // Phase 17 — Social widgets
  'social-bar',
  'share-buttons',
  'social-embed',
  'floating-chat',
  // Phase 18 — Maps & Location
  'address-block',
  'business-hours',
  'multi-location-map',
  // Phase 19 — Decorative widgets
  'shape',
  'pattern',
  'parallax-bg',
  'frame',
  'sticker',
  // Phase 20 — Data Display widgets
  'bar-chart',
  'line-chart',
  'pie-chart',
  'counter',
  'testimonial-carousel',
  'pricing-table',
  'comparison-table',
  'timeline',
  'team-member-card',
  'service-feature-card',
] as const;

/**
 * Helper for kinds that can hold child nodes (parentId targets).
 * `container` is the canonical container; `form` behaves the same way for
 * Forms widget — children include FormInput/FormTextarea/FormSubmit.
 */
export function isContainerLikeKind(kind: string): boolean {
  return kind === 'container' || kind === 'form';
}

export const compositeComponentKeys = [
  'hero-search',
  'services-bento',
  'home-contact-cta',
  'insights-archive',
  'home-attorney',
  'home-case-results',
  'home-stats',
  'faq-accordion',
  'office-map-tabs',
  'legacy-page-about',
  'legacy-page-services',
  'legacy-page-contact',
  'legacy-page-lawyers',
  'legacy-page-faq',
  'legacy-page-pricing',
  'legacy-page-reviews',
  'legacy-page-privacy',
  'legacy-page-disclaimer',
] as const;

export type CompositeComponentKey = (typeof compositeComponentKeys)[number];

export const canvasNodeKindSchema = z.enum(builderCanvasNodeKinds);
export type BuilderCanvasNodeKind = z.infer<typeof canvasNodeKindSchema>;

export const canvasRectSchema = z.object({
  x: z.number().finite(),
  y: z.number().finite(),
  width: z.number().positive(),
  height: z.number().positive(),
});

const canvasNodeStyleDefaults = {
  backgroundColor: 'transparent',
  borderColor: '#cbd5e1',
  borderStyle: 'solid' as const,
  borderWidth: 0,
  borderRadius: 14,
  shadowX: 0,
  shadowY: 0,
  shadowBlur: 0,
  shadowSpread: 0,
  shadowColor: 'rgba(15, 23, 42, 0.16)',
  opacity: 100,
};

export const themeColorTokenSchema = z.enum(THEME_COLOR_TOKENS);
export const themeTextPresetKeySchema = z.enum(THEME_TEXT_PRESET_KEYS);
export const cardVariantKeySchema = z.enum(CARD_VARIANT_KEYS);
export const formInputVariantKeySchema = z.enum(FORM_INPUT_VARIANT_KEYS);

export const builderColorValueSchema = z.union([
  z.string().max(2000),
  z.object({
    kind: z.literal('token').optional(),
    token: themeColorTokenSchema,
  }).strict(),
]);

const backgroundImagePositionSchema = z.enum([
  'center',
  'top',
  'bottom',
  'left',
  'right',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
]);

export const backgroundValueSchema: z.ZodType<BuilderBackgroundValue> = z.union([
  builderColorValueSchema,
  z.object({
    kind: z.literal('gradient'),
    type: z.enum(['linear', 'radial']),
    angle: z.number().min(0).max(360).default(180),
    stops: z.array(z.object({
      color: builderColorValueSchema,
      position: z.number().min(0).max(100),
    })).min(2).max(5),
  }).strict(),
  z.object({
    kind: z.literal('image'),
    src: z.string().max(2000),
    size: z.enum(['cover', 'contain', 'auto']).default('cover'),
    position: backgroundImagePositionSchema.default('center'),
    repeat: z.enum(['no-repeat', 'repeat', 'repeat-x', 'repeat-y']).default('no-repeat'),
    overlayColor: builderColorValueSchema.optional(),
    overlayOpacity: z.number().min(0).max(100).optional(),
  }).strict(),
]);

export const hoverStyleSchema = z.object({
  backgroundColor: builderColorValueSchema.optional(),
  borderColor: builderColorValueSchema.optional(),
  scale: z.number().min(0.5).max(2).optional(),
  translateY: z.number().min(-100).max(100).optional(),
  shadowBlur: z.number().int().min(0).max(160).optional(),
  shadowSpread: z.number().int().min(-96).max(96).optional(),
  shadowColor: builderColorValueSchema.optional(),
  transitionMs: z.number().int().min(0).max(2000).default(200),
}).optional();

export type BuilderHoverStyle = z.infer<typeof hoverStyleSchema>;
export type { BuilderBackgroundValue };

export const animationConfigSchema = z.object({
  entrance: z.object({
    preset: z.enum(ENTRANCE_PRESET_KEYS).default('none'),
    duration: z.number().int().min(100).max(3000).default(600),
    delay: z.number().int().min(0).max(3000).default(0),
    easing: z.enum(ANIMATION_EASING_KEYS).default('ease-out'),
    triggerOnce: z.boolean().default(true),
  }).optional(),
  scroll: z.object({
    effect: z.enum(SCROLL_EFFECT_KEYS).default('none'),
    intensity: z.number().min(-100).max(100).default(20),
  }).optional(),
  hover: z.object({
    preset: z.enum(HOVER_ANIMATION_PRESET_KEYS).default('none'),
    transitionMs: z.number().int().min(0).max(2000).default(200),
  }).optional(),
}).optional();

export type BuilderAnimationConfig = z.infer<typeof animationConfigSchema>;

export const builderCanvasNodeStyleSchema = z.object({
  backgroundColor: backgroundValueSchema,
  borderColor: builderColorValueSchema,
  borderStyle: z.enum(['solid', 'dashed']),
  borderWidth: z.number().int().min(0).max(12),
  borderRadius: z.number().int().min(0).max(9999),
  shadowX: z.number().int().min(-96).max(96),
  shadowY: z.number().int().min(-96).max(96),
  shadowBlur: z.number().int().min(0).max(160),
  shadowSpread: z.number().int().min(-96).max(96),
  shadowColor: builderColorValueSchema,
  opacity: z.number().int().min(0).max(100),
});

export type BuilderCanvasNodeStyle = z.infer<typeof builderCanvasNodeStyleSchema>;

export const stickyConfigSchema = z.object({
  offset: z.number().int().min(0).max(500).default(0),
  from: z.enum(['top', 'bottom']).default('top'),
}).optional();

export type StickyConfig = z.infer<typeof stickyConfigSchema>;

/**
 * Responsive override schema.
 *
 * Per-viewport partial overrides for `rect`, visibility (`hidden`),
 * and `fontSize`. Only the fields the user explicitly changed at
 * tablet/mobile are stored; resolvers cascade desktop → tablet → mobile.
 *
 * M07 Phase 2 lock:
 * - font size override path is `responsive.<viewport>.fontSize`
 * - visibility override path is `responsive.<viewport>.hidden`
 * - no `hiddenOnViewports[]` compatibility field is persisted
 *
 * `rect` is partial — a node may override just `x` and inherit width.
 */
export const responsiveOverrideSchema = z.object({
  rect: canvasRectSchema.partial().optional(),
  hidden: z.boolean().optional(),
  fontSize: z.number().int().min(8).max(160).optional(),
}).optional();

export const responsiveConfigSchema = z.object({
  tablet: responsiveOverrideSchema,
  mobile: responsiveOverrideSchema,
}).optional();

export type ResponsiveOverride = z.infer<typeof responsiveOverrideSchema>;
export type ResponsiveConfig = z.infer<typeof responsiveConfigSchema>;

/**
 * Anchor name for in-page navigation. Used as `id` on published render
 * so links like `href="#contact"` can scroll-jump to this node.
 * Lowercase alphanumeric + hyphens, max 64 chars.
 */
export const anchorNameSchema = z
  .string()
  .trim()
  .max(64)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Anchor must be lowercase alphanumeric with hyphens')
  .optional();

const baseCanvasNodeSchema = z.object({
  id: z.string().trim().min(1).max(120),
  kind: canvasNodeKindSchema,
  parentId: z.string().max(120).optional(),
  rect: canvasRectSchema,
  style: builderCanvasNodeStyleSchema.default(canvasNodeStyleDefaults),
  zIndex: z.number().int().nonnegative(),
  rotation: z.number().min(0).max(360).default(0),
  locked: z.boolean().default(false),
  visible: z.boolean().default(true),
  sticky: stickyConfigSchema,
  anchorName: anchorNameSchema,
  hoverStyle: hoverStyleSchema,
  animation: animationConfigSchema,
  responsive: responsiveConfigSchema,
});

const textShadowSchema = z.object({
  x: z.number().min(-50).max(50),
  y: z.number().min(-50).max(50),
  blur: z.number().min(0).max(100),
  color: z.string().max(64),
}).optional();

const textRichTextSchema = createBuilderRichTextSchema({
  maxPlainTextLength: 1000,
  maxHtmlLength: 10_000,
}).optional();

const headingRichTextSchema = createBuilderRichTextSchema({
  maxPlainTextLength: 300,
  maxHtmlLength: 5_000,
}).optional();

const textCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('text'),
  content: z.object({
    text: z.string().max(1000),
    richText: textRichTextSchema,
    fontSize: z.number().int().min(12).max(160),
    color: builderColorValueSchema,
    fontWeight: z.enum(['regular', 'medium', 'bold']),
    align: z.enum(['left', 'center', 'right']),
    lineHeight: z.number().min(0.5).max(4).default(1.25),
    letterSpacing: z.number().min(-2).max(10).default(0),
    fontFamily: z.string().max(120).optional(),
    themePreset: themeTextPresetKeySchema.optional(),
    verticalAlign: z.enum(['top', 'center', 'bottom']).optional(),
    textShadow: textShadowSchema,
    backgroundColor: builderColorValueSchema.optional(),
    textTransform: z.enum(['none', 'uppercase', 'lowercase', 'capitalize']).optional(),
    columns: z.number().int().min(1).max(4).optional(),
    columnGap: z.number().int().min(0).max(96).optional(),
    quoteStyle: z.enum(['none', 'classic', 'pull']).optional(),
    marquee: z.object({
      enabled: z.boolean().default(true),
      speed: z.number().int().min(5).max(120).default(22),
      direction: z.enum(['left', 'right']).default('left'),
    }).optional(),
    textPath: z.object({
      enabled: z.boolean().default(true),
      curve: z.enum(['arc', 'wave']).default('arc'),
      baseline: z.number().int().min(20).max(90).default(62),
    }).optional(),
    link: linkValueSchema.nullish(),
    className: z.string().max(256).optional(),
    as: z.enum(['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'time', 'input']).optional(),
    inputType: z.enum(['text', 'search', 'email', 'url', 'tel']).optional(),
    name: z.string().max(120).optional(),
    placeholder: z.string().max(300).optional(),
    ariaLabel: z.string().max(200).optional(),
    rawInlineStyle: z.boolean().optional(),
  }).superRefine((content, ctx) => {
    if (content.richText && content.text !== content.richText.plainText) {
      ctx.addIssue({
        code: 'custom',
        path: ['richText', 'plainText'],
        message: 'richText.plainText must match text',
      });
    }
  }),
});

const imageCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('image'),
  content: z.object({
    src: z.string().max(2000),
    alt: z.string().max(300),
    fit: z.enum(['cover', 'contain']),
    cropAspect: z.string().max(20).optional(),
    clickAction: z.enum(['none', 'link', 'lightbox', 'popup']).default('none').optional(),
    hoverSrc: z.string().max(2000).optional(),
    hotspots: z
      .array(
        z.object({
          x: z.number().min(0).max(100),
          y: z.number().min(0).max(100),
          label: z.string().max(120),
          href: z.string().max(500).optional(),
        }),
      )
      .max(12)
      .optional(),
    compare: z
      .object({
        enabled: z.boolean().default(true),
        beforeSrc: z.string().max(2000),
        afterSrc: z.string().max(2000),
        position: z.number().int().min(5).max(95).default(50),
      })
      .optional(),
    svg: z
      .object({
        enabled: z.boolean().default(true),
        name: z.enum(['scales', 'shield', 'building', 'spark']).default('scales'),
        color: builderColorValueSchema,
      })
      .optional(),
    gif: z
      .object({
        provider: z.enum(['manual', 'giphy']).default('manual'),
        query: z.string().max(120).optional(),
      })
      .optional(),
    /**
     * Focal point for `object-position` when fit='cover'. 0~100 (% from
     * top-left). Default center (50,50). 예: portrait를 container ratio가
     * 자를 때 얼굴이 잘리지 않게 조정.
     */
    focalPoint: z
      .object({
        x: z.number().min(0).max(100),
        y: z.number().min(0).max(100),
      })
      .optional(),
    filters: imageFiltersSchema,
    link: linkValueSchema.nullish(),
  }),
});

const buttonCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('button'),
  content: z.object({
    label: z.string().max(120),
    href: z.string().max(2000),
    style: z.enum(BUTTON_STYLE_KEYS),
    className: z.string().max(256).optional(),
    as: z.enum(['a', 'button']).optional(),
    buttonType: z.enum(['button', 'submit']).optional(),
    rawInlineStyle: z.boolean().optional(),
    target: z.enum(['_self', '_blank', '_parent', '_top']).optional(),
    rel: z.string().max(120).optional(),
    title: z.string().max(200).optional(),
    ariaLabel: z.string().max(200).optional(),
    link: linkValueSchema.nullish(),
  }),
});

const headingCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('heading'),
  content: z.object({
    text: z.string().max(300),
    richText: headingRichTextSchema,
    level: z.number().int().min(1).max(6),
    color: builderColorValueSchema,
    align: z.enum(['left', 'center', 'right']),
    fontFamily: z.string().max(120).optional(),
    fontSize: z.number().int().min(12).max(160).optional(),
    fontWeight: z.enum(['regular', 'medium', 'bold']).optional(),
    lineHeight: z.number().min(0.5).max(4).optional(),
    letterSpacing: z.number().min(-2).max(10).optional(),
    themePreset: themeTextPresetKeySchema.optional(),
    className: z.string().max(256).optional(),
    rawInlineStyle: z.boolean().optional(),
  }).superRefine((content, ctx) => {
    if (content.richText && content.text !== content.richText.plainText) {
      ctx.addIssue({
        code: 'custom',
        path: ['richText', 'plainText'],
        message: 'richText.plainText must match text',
      });
    }
  }),
});

const flexConfigSchema = z.object({
  direction: z.enum(['row', 'column']).default('row'),
  wrap: z.boolean().default(true),
  justifyContent: z.enum(['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly']).default('flex-start'),
  alignItems: z.enum(['flex-start', 'center', 'flex-end', 'stretch']).default('flex-start'),
  gap: z.number().int().min(0).max(200).default(16),
});

const gridConfigSchema = z.object({
  columns: z.number().int().min(1).max(12).default(3),
  rows: z.number().int().min(1).max(12).default(2),
  columnGap: z.number().int().min(0).max(200).default(16),
  rowGap: z.number().int().min(0).max(200).default(16),
  templateColumns: z.string().max(200).optional(),
  templateRows: z.string().max(200).optional(),
});

const containerCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('container'),
  content: z.object({
    label: z.string().max(120),
    background: z.string().max(64),
    borderColor: z.string().max(64),
    borderStyle: z.enum(['solid', 'dashed']),
    borderWidth: z.number().int().min(0).max(12),
    borderRadius: z.number().int().min(0).max(48),
    padding: z.number().int().min(0).max(96),
    layoutMode: z.enum(['absolute', 'flex', 'grid', 'strip', 'box', 'columns', 'repeater', 'tabs', 'accordion', 'slideshow', 'hoverBox']).default('absolute'),
    flexConfig: flexConfigSchema.optional(),
    gridConfig: gridConfigSchema.optional(),
    layoutItems: z.array(z.object({
      title: z.string().max(120),
      description: z.string().max(500).optional(),
      image: z.string().max(2000).optional(),
    })).max(12).optional(),
    activeIndex: z.number().int().min(0).max(20).default(0).optional(),
    sticky: z.boolean().default(false).optional(),
    anchorTarget: z.string().max(120).optional(),
    className: z.string().max(256).optional(),
    as: z.enum(['div', 'section', 'article', 'aside', 'header', 'footer', 'main', 'nav', 'form']).optional(),
    htmlId: z.string().max(120).optional(),
    dataTone: z.string().max(32).optional(),
    action: z.string().max(500).optional(),
    method: z.enum(['get', 'post']).optional(),
    rawInlineStyle: z.boolean().optional(),
    cardStyle: z.string().max(64).optional(),
    variant: cardVariantKeySchema.optional(),
    link: linkValueSchema.nullish(),
  }),
});

const sectionCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('section'),
  content: z.object({
    label: z.string().max(120),
    maxWidth: z.number().int().min(320).max(1440),
    background: z.string().max(64),
    borderColor: z.string().max(64),
    borderWidth: z.number().int().min(0).max(12),
    borderRadius: z.number().int().min(0).max(48),
    padding: z.number().int().min(0).max(144),
  }),
});

const compositeCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('composite'),
  content: z.object({
    componentKey: z.enum(compositeComponentKeys),
    config: z.record(z.string(), z.unknown()).default({}),
  }),
});

const dividerCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('divider'),
  content: z.object({
    orientation: z.enum(['horizontal', 'vertical']).default('horizontal'),
    thickness: z.number().int().min(1).max(10).default(2),
    color: builderColorValueSchema,
    style: z.enum(['solid', 'dashed', 'dotted']).default('solid'),
  }),
});

const spacerCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('spacer'),
  content: z.object({
    size: z.number().int().min(8).max(400).default(32),
  }),
});

const iconCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('icon'),
  content: z.object({
    name: z.string().max(64).default('✦'),
    size: z.number().int().min(12).max(120).default(32),
    color: builderColorValueSchema,
    set: z.enum(['emoji', 'unicode', 'lucide', 'fontawesome']).default('emoji'),
  }),
});

const videoCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('video'),
  content: z.object({
    url: z.string().max(2000).default(''),
    autoplay: z.boolean().default(false),
    loop: z.boolean().default(false),
    muted: z.boolean().default(false),
    controls: z.boolean().default(true),
    thumbnail: z.string().max(2000).optional(),
    mode: z.enum(['box', 'background']).default('box'),
  }),
});

const videoEmbedCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('video-embed'),
  content: z.object({
    provider: z.enum(['youtube', 'vimeo', 'url']).default('youtube'),
    src: z.string().max(2000).default(''),
    autoplay: z.boolean().default(false),
    loop: z.boolean().default(false),
    muted: z.boolean().default(false),
    controls: z.boolean().default(true),
    posterImage: z.string().max(2000).optional(),
  }),
});

const audioCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('audio'),
  content: z.object({
    provider: z.enum(['file', 'spotify', 'soundcloud']).default('file'),
    src: z.string().max(2000).default(''),
    title: z.string().max(160).default('Audio track'),
    artist: z.string().max(160).default(''),
    autoplay: z.boolean().default(false),
    controls: z.boolean().default(true),
  }),
});

const lottieCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('lottie'),
  content: z.object({
    src: z.string().max(2000).default(''),
    label: z.string().max(160).default('Lottie animation'),
    autoplay: z.boolean().default(true),
    loop: z.boolean().default(true),
    speed: z.number().min(0.25).max(4).default(1),
  }),
});

const formCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('form'),
  content: z.object({
    name: z.string().min(1).max(80),
    submitTo: z.enum(['email', 'webhook', 'storage']).default('storage'),
    targetEmail: z.string().email().max(200).optional(),
    webhookUrl: z.string().url().max(2000).optional(),
    successMessage: z.string().max(500).default('감사합니다. 곧 연락드리겠습니다.'),
    redirectUrl: z.string().max(500).optional(),
    method: z.enum(['POST']).default('POST'),
    layoutMode: z.enum(['absolute', 'flex', 'grid']).default('absolute'),
    flexConfig: flexConfigSchema.optional(),
    gridConfig: gridConfigSchema.optional(),
    captcha: z.enum(['none', 'hcaptcha', 'turnstile']).default('none'),
    steps: z
      .array(
        z.object({
          id: z.string().min(1).max(80),
          title: z.string().max(120),
          fieldNodeIds: z.array(z.string().min(1).max(120)).max(100),
        }),
      )
      .max(20)
      .optional(),
    autoReplyEnabled: z.boolean().default(false),
    autoReplyTemplate: z.string().max(2000).optional(),
  }),
});

const formFieldConditionSchema = z.object({
  fieldName: z.string().min(1).max(80),
  operator: z.enum(['equals', 'notEquals', 'contains', 'isEmpty', 'isNotEmpty']),
  value: z.string().max(500).optional(),
});

const formOptionSchema = z.object({
  value: z.string().max(200),
  label: z.string().max(200),
});

const formInputCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('form-input'),
  content: z.object({
    name: z.string().min(1).max(80),
    label: z.string().max(120),
    placeholder: z.string().max(120).optional(),
    type: z.enum(['text', 'email', 'tel', 'number', 'url', 'password', 'date']).default('text'),
    required: z.boolean().default(false),
    minLength: z.number().int().min(0).max(1000).optional(),
    maxLength: z.number().int().min(1).max(5000).optional(),
    pattern: z.string().max(200).optional(),
    defaultValue: z.string().max(500).optional(),
    errorMessage: z.string().max(300).optional(),
    showIf: formFieldConditionSchema.optional(),
    variant: formInputVariantKeySchema.optional(),
    // Phase 21 — Number/decimal validation
    numericMin: z.number().optional(),
    numericMax: z.number().optional(),
    numericStep: z.number().min(0).optional(),
    allowDecimals: z.boolean().default(true),
  }),
});

const formTextareaCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('form-textarea'),
  content: z.object({
    name: z.string().min(1).max(80),
    label: z.string().max(120),
    placeholder: z.string().max(120).optional(),
    required: z.boolean().default(false),
    minLength: z.number().int().min(0).max(5000).optional(),
    maxLength: z.number().int().min(1).max(20000).optional(),
    rows: z.number().int().min(2).max(20).default(4),
    defaultValue: z.string().max(2000).optional(),
    errorMessage: z.string().max(300).optional(),
    showIf: formFieldConditionSchema.optional(),
    variant: formInputVariantKeySchema.optional(),
  }),
});

const formSubmitCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('form-submit'),
  content: z.object({
    label: z.string().max(120).default('제출'),
    style: z.enum(['primary', 'secondary', 'outline', 'ghost']).default('primary'),
    fullWidth: z.boolean().default(false),
    loadingLabel: z.string().max(120).default('전송 중...'),
  }),
});

const formSelectCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('form-select'),
  content: z.object({
    name: z.string().min(1).max(80),
    label: z.string().max(120),
    required: z.boolean().default(false),
    options: z.array(formOptionSchema).min(1).max(50),
    defaultValue: z.string().max(200).optional(),
    placeholder: z.string().max(120).optional(),
    multiple: z.boolean().default(false),
    errorMessage: z.string().max(300).optional(),
    showIf: formFieldConditionSchema.optional(),
    variant: formInputVariantKeySchema.optional(),
  }),
});

const formCheckboxCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('form-checkbox'),
  content: z.object({
    name: z.string().min(1).max(80),
    label: z.string().max(200),
    required: z.boolean().default(false),
    defaultChecked: z.boolean().default(false),
    options: z.array(formOptionSchema).max(50).optional(),
    errorMessage: z.string().max(300).optional(),
    showIf: formFieldConditionSchema.optional(),
  }),
});

const formRadioCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('form-radio'),
  content: z.object({
    name: z.string().min(1).max(80),
    label: z.string().max(200),
    required: z.boolean().default(false),
    options: z.array(formOptionSchema).min(2).max(20),
    defaultValue: z.string().max(200).optional(),
    layout: z.enum(['vertical', 'horizontal']).default('vertical'),
    errorMessage: z.string().max(300).optional(),
    showIf: formFieldConditionSchema.optional(),
  }),
});

const formFileCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('form-file'),
  content: z.object({
    name: z.string().min(1).max(80),
    label: z.string().max(120),
    required: z.boolean().default(false),
    accept: z.string().max(200).default('image/*,application/pdf'),
    maxSizeMb: z.number().int().min(1).max(50).default(10),
    multiple: z.boolean().default(false),
    errorMessage: z.string().max(300).optional(),
    showIf: formFieldConditionSchema.optional(),
    variant: formInputVariantKeySchema.optional(),
  }),
});

const formDateCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('form-date'),
  content: z.object({
    name: z.string().min(1).max(80),
    label: z.string().max(120),
    required: z.boolean().default(false),
    type: z.enum(['date', 'datetime-local', 'time', 'month']).default('date'),
    min: z.string().max(80).optional(),
    max: z.string().max(80).optional(),
    defaultValue: z.string().max(120).optional(),
    errorMessage: z.string().max(300).optional(),
    showIf: formFieldConditionSchema.optional(),
    variant: formInputVariantKeySchema.optional(),
  }),
});

// ─── Phase 21 — Forms 후반 ──────────────────────────────────────

const formSignatureCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('form-signature'),
  content: z.object({
    name: z.string().min(1).max(80).default('signature'),
    label: z.string().max(120).default('서명'),
    required: z.boolean().default(true),
    helpText: z.string().max(300).default('박스 안에 서명해 주세요'),
    strokeColor: z.string().max(60).default('#0f172a'),
    strokeWidth: z.number().int().min(1).max(8).default(2),
    showClearButton: z.boolean().default(true),
    errorMessage: z.string().max(300).optional(),
    showIf: formFieldConditionSchema.optional(),
  }),
});

const formPaymentCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('form-payment'),
  content: z.object({
    name: z.string().min(1).max(80).default('payment'),
    label: z.string().max(120).default('결제'),
    provider: z.enum(['stripe-checkout', 'stripe-payment-element', 'manual']).default('stripe-checkout'),
    amountCents: z.number().int().min(0).default(100000),
    currency: z.enum(['KRW', 'USD', 'TWD', 'JPY', 'EUR']).default('KRW'),
    description: z.string().max(400).default('상담 비용'),
    successUrl: z.string().max(2000).default(''),
    cancelUrl: z.string().max(2000).default(''),
    showSecurityNote: z.boolean().default(true),
    errorMessage: z.string().max(300).optional(),
    showIf: formFieldConditionSchema.optional(),
  }),
});

// ─── Phase 14 — Blog widgets ──────────────────────────────────────

const blogFeedCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('blog-feed'),
  content: z.object({
    layout: z.enum(['grid', 'list', 'masonry', 'featured-hero']).default('grid'),
    postsPerPage: z.number().int().min(1).max(50).default(9),
    showExcerpt: z.boolean().default(true),
    showAuthor: z.boolean().default(true),
    showDate: z.boolean().default(true),
    showReadingTime: z.boolean().default(true),
    showCategory: z.boolean().default(true),
    showTags: z.boolean().default(false),
    showFeaturedImage: z.boolean().default(true),
    filterByCategory: z.string().max(80).optional(),
    filterByTag: z.string().max(80).optional(),
    sortBy: z.enum(['newest', 'oldest', 'featured-first']).default('newest'),
    columns: z.number().int().min(1).max(4).default(3),
    gap: z.number().int().min(0).max(64).default(24),
  }),
});

const blogPostCardCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('blog-post-card'),
  content: z.object({
    postId: z.string().max(120).optional(),
    showFeaturedImage: z.boolean().default(true),
    showCategory: z.boolean().default(true),
    showAuthor: z.boolean().default(true),
    showExcerpt: z.boolean().default(true),
    showDate: z.boolean().default(true),
    showReadingTime: z.boolean().default(true),
    cardStyle: z.enum(['elevated', 'flat', 'outlined']).default('elevated'),
    variant: cardVariantKeySchema.optional(),
  }),
});

const blogCategoriesCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('blog-categories'),
  content: z.object({
    layout: z.enum(['horizontal', 'vertical', 'grid']).default('horizontal'),
    showAll: z.boolean().default(true),
    showPostCount: z.boolean().default(true),
    activeColor: builderColorValueSchema.optional(),
  }),
});

const blogArchiveCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('blog-archive'),
  content: z.object({
    groupBy: z.enum(['year', 'month']).default('month'),
    expandLatest: z.boolean().default(true),
    showCount: z.boolean().default(true),
  }),
});

const featuredPostsCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('featured-posts'),
  content: z.object({
    limit: z.number().int().min(1).max(10).default(3),
    layout: z.enum(['hero', 'side-by-side', 'stacked']).default('hero'),
  }),
});

// ─── Phase 7 — Media / Domain widgets ─────────────────────────────
//
// These schemas match each component's actual Element props and `defaultContent`
// keys (see src/lib/builder/components/<kind>/index.tsx). Schemas are kept
// intentionally minimal: they describe what the live Renderer reads. Adding
// fields beyond `defaultContent` would silently drop on Inspector updates
// because store.updateNodeContent filters by `existingNode.content` /
// `defaultContent`. Extending Element + defaultContent is a follow-up.

const galleryCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('gallery'),
  content: z.object({
    images: z
      .array(
        z.object({
          src: z.string().max(2000),
          alt: z.string().max(300).default(''),
          caption: z.string().max(300).optional(),
          tags: z.array(z.string().max(40)).max(8).optional(),
        }),
      )
      .max(50)
      .default([]),
    layout: z.enum(['grid', 'masonry', 'slider', 'slideshow', 'thumbnail', 'pro']).default('grid'),
    columns: z.number().int().min(1).max(6).default(3),
    gap: z.number().int().min(0).max(64).default(8),
    showCaptions: z.boolean().default(false),
    captionMode: z.enum(['below', 'overlay']).default('below'),
    activeFilter: z.string().max(40).default('all'),
    autoplay: z.boolean().default(false),
    interval: z.number().int().min(1200).max(12000).default(4000),
    thumbnailPosition: z.enum(['bottom', 'right']).default('bottom'),
    proStyle: z.enum(['clean', 'mosaic', 'editorial']).default('clean'),
  }),
});

const mapCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('map'),
  content: z.object({
    address: z.string().max(500).default(''),
    zoom: z.number().int().min(1).max(20).default(15),
  }),
});

const customEmbedCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('customEmbed'),
  content: z.object({
    // Sandboxed via srcdoc + sandbox attr in CustomEmbedRender.
    html: z.string().max(20000).default(''),
  }),
});

const columnCardCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('columnCard'),
  content: z.object({
    slug: z.string().max(200).default(''),
    locale: z.string().max(8).default('ko'),
    title: z.string().max(300).default('').optional(),
    date: z.string().max(40).default('').optional(),
    summary: z.string().max(1000).default('').optional(),
    cardStyle: z.string().max(64).optional(),
    variant: cardVariantKeySchema.optional(),
  }),
});

const columnListCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('columnList'),
  content: z.object({
    locale: z.string().max(8).default('ko'),
    limit: z.number().int().min(1).max(50).default(6),
    category: z.string().max(80).default('').optional(),
    items: z
      .array(
        z.object({
          slug: z.string().max(200),
          title: z.string().max(300),
          date: z.string().max(40),
          summary: z.string().max(1000),
        }),
      )
      .max(50)
      .default([])
      .optional(),
  }),
});

const attorneyCardCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('attorneyCard'),
  content: z.object({
    name: z.string().max(120).default(''),
    title: z.string().max(200).default(''),
    photo: z.string().max(2000).default(''),
    specialties: z.array(z.string().max(80)).max(20).default([]),
    cardStyle: z.string().max(64).optional(),
    variant: cardVariantKeySchema.optional(),
  }),
});

const faqListCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('faqList'),
  content: z.object({
    items: z
      .array(
        z.object({
          question: z.string().max(500),
          answer: z.string().max(5000),
        }),
      )
      .max(50)
      .default([]),
  }),
});

const contactFormCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('contactForm'),
  content: z.object({
    // Legacy contact form widget — distinct from Phase 4 Forms (form-input
    // etc.). Posts JSON to `action`. Field keys map to fixed labels in the
    // Renderer (name/email/phone/message).
    // Field keys map to fixed labels in the Renderer (name/email/phone/message).
    // Kept as a string array (not enum) to tolerate any legacy data on disk.
    fields: z
      .array(z.string().max(40))
      .min(1)
      .max(8)
      .default(['name', 'email', 'phone', 'message']),
    submitLabel: z.string().max(120).default('Submit'),
    action: z.string().max(2000).default('/api/consultation/submit'),
  }),
});

const ctaBannerCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('ctaBanner'),
  content: z.object({
    title: z.string().max(300).default(''),
    description: z.string().max(1000).default(''),
    buttonLabel: z.string().max(120).default(''),
    buttonHref: z.string().max(2000).default('#'),
    // Accepts hex/rgb/named colour strings, or `linear-gradient(...)`.
    backgroundColor: z.string().max(500).default('#0b3b2e'),
  }),
});

const bookingWidgetCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('booking-widget'),
  content: z.object({
    eyebrow: z.string().max(120).default(''),
    title: z.string().max(200).default(''),
    locale: sandboxLocaleSchema.default('ko'),
    serviceId: z.string().max(120).default(''),
    staffId: z.string().max(120).default(''),
    successMessage: z.string().max(500).default('예약이 완료되었습니다'),
    redirectAfterBooking: z.string().max(500).default(''),
  }),
});

// ─── Phase 15 — Interactive widgets ──────────────────────────────

const countdownCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('countdown'),
  content: z.object({
    targetAt: z.string().max(50).default(''),
    label: z.string().max(120).default('카운트다운'),
    expiredText: z.string().max(120).default('마감되었습니다'),
    showDays: z.boolean().default(true),
    showHours: z.boolean().default(true),
    showMinutes: z.boolean().default(true),
    showSeconds: z.boolean().default(true),
    variant: z.enum(['compact', 'card', 'inline']).default('card'),
  }),
});

const progressCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('progress'),
  content: z.object({
    label: z.string().max(120).default('진행률'),
    value: z.number().min(0).max(100).default(60),
    showPercent: z.boolean().default(true),
    variant: z.enum(['bar', 'ring', 'segments']).default('bar'),
    color: z.string().max(60).default('#1d4ed8'),
    trackColor: z.string().max(60).default('#e2e8f0'),
  }),
});

const ratingCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('rating'),
  content: z.object({
    label: z.string().max(120).default('별점'),
    value: z.number().min(0).max(5).default(4.5),
    max: z.number().int().min(3).max(10).default(5),
    showValue: z.boolean().default(true),
    color: z.string().max(60).default('#f59e0b'),
    variant: z.enum(['stars', 'hearts', 'dots']).default('stars'),
  }),
});

const notificationBarCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('notification-bar'),
  content: z.object({
    message: z.string().max(280).default('새 공지가 도착했습니다.'),
    ctaLabel: z.string().max(60).default('자세히 보기'),
    ctaHref: z.string().max(2000).default(''),
    dismissable: z.boolean().default(true),
    tone: z.enum(['info', 'warning', 'success', 'danger']).default('info'),
    position: z.enum(['top', 'bottom']).default('top'),
  }),
});

const backToTopCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('back-to-top'),
  content: z.object({
    label: z.string().max(40).default('맨 위로'),
    showAfterPx: z.number().int().min(0).max(4000).default(400),
    icon: z.enum(['arrow-up', 'chevron-up', 'rocket']).default('arrow-up'),
    placement: z.enum(['bottom-right', 'bottom-left', 'bottom-center']).default('bottom-right'),
    variant: z.enum(['circle', 'pill', 'square']).default('circle'),
  }),
});

// ─── Phase 16 — Navigation widgets ───────────────────────────────

const menuItemSchema = z.object({
  label: z.string().max(60),
  href: z.string().max(2000),
  children: z.array(z.object({
    label: z.string().max(60),
    href: z.string().max(2000),
    description: z.string().max(200).optional(),
  })).max(40).optional(),
});

const menuBarCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('menu-bar'),
  content: z.object({
    items: z.array(menuItemSchema).max(20).default([]),
    orientation: z.enum(['horizontal', 'vertical']).default('horizontal'),
    variant: z.enum(['plain', 'pill', 'dropdown', 'mega']).default('plain'),
    activeHref: z.string().max(2000).default(''),
    showMobileHamburger: z.boolean().default(true),
  }),
});

const anchorMenuCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('anchor-menu'),
  content: z.object({
    items: z.array(z.object({
      label: z.string().max(60),
      anchorId: z.string().max(120),
    })).max(20).default([]),
    sticky: z.boolean().default(true),
    offsetTopPx: z.number().int().min(0).max(400).default(0),
    activeColor: z.string().max(60).default('#0f172a'),
  }),
});

const breadcrumbsCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('breadcrumbs'),
  content: z.object({
    items: z.array(z.object({
      label: z.string().max(80),
      href: z.string().max(2000).optional(),
    })).max(10).default([]),
    separator: z.enum(['slash', 'chevron', 'dot']).default('chevron'),
    showHome: z.boolean().default(true),
    homeLabel: z.string().max(40).default('홈'),
    homeHref: z.string().max(2000).default('/'),
  }),
});

// ─── Phase 17 — Social widgets ───────────────────────────────────

const socialProviderSchema = z.enum([
  'instagram',
  'facebook',
  'twitter',
  'threads',
  'youtube',
  'linkedin',
  'tiktok',
  'whatsapp',
  'line',
  'kakao',
  'naver',
  'x',
]);

const socialBarCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('social-bar'),
  content: z.object({
    items: z.array(z.object({
      provider: socialProviderSchema,
      href: z.string().max(2000),
      label: z.string().max(60).optional(),
    })).max(20).default([]),
    layout: z.enum(['row', 'column']).default('row'),
    style: z.enum(['plain', 'solid', 'outline']).default('plain'),
    size: z.number().int().min(24).max(80).default(36),
    color: z.string().max(60).default('#0f172a'),
  }),
});

const shareButtonsCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('share-buttons'),
  content: z.object({
    providers: z.array(z.enum(['copy', 'facebook', 'twitter', 'kakao', 'line', 'whatsapp', 'email']))
      .max(10)
      .default(['copy', 'facebook', 'twitter', 'kakao']),
    title: z.string().max(120).default('공유하기'),
    layout: z.enum(['row', 'column']).default('row'),
    size: z.number().int().min(28).max(80).default(40),
  }),
});

const socialEmbedCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('social-embed'),
  content: z.object({
    provider: z.enum(['instagram-feed', 'youtube-subscribe', 'linkedin-follow', 'tiktok-feed']).default('instagram-feed'),
    handle: z.string().max(160).default(''),
    channelId: z.string().max(160).optional(),
    layout: z.enum(['grid', 'list']).default('grid'),
    count: z.number().int().min(1).max(20).default(6),
    showHeader: z.boolean().default(true),
  }),
});

const floatingChatCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('floating-chat'),
  content: z.object({
    provider: z.enum(['whatsapp', 'line', 'kakao', 'telegram', 'messenger', 'custom']).default('whatsapp'),
    href: z.string().max(2000).default(''),
    label: z.string().max(80).default('문의하기'),
    placement: z.enum(['bottom-right', 'bottom-left', 'bottom-center']).default('bottom-right'),
    showLabel: z.boolean().default(false),
    color: z.string().max(60).default('#25d366'),
  }),
});

// ─── Phase 18 — Maps & Location ──────────────────────────────────

const addressBlockCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('address-block'),
  content: z.object({
    label: z.string().max(80).default('주소'),
    line1: z.string().max(200).default(''),
    line2: z.string().max(200).default(''),
    cityRegion: z.string().max(160).default(''),
    postalCode: z.string().max(40).default(''),
    country: z.string().max(80).default(''),
    phone: z.string().max(80).default(''),
    showCopyButton: z.boolean().default(true),
    showDirectionsLink: z.boolean().default(true),
    directionsHref: z.string().max(2000).default(''),
  }),
});

const businessHoursCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('business-hours'),
  content: z.object({
    title: z.string().max(80).default('영업 시간'),
    timezone: z.string().max(80).default('Asia/Seoul'),
    rows: z.array(z.object({
      day: z.string().max(20),
      hours: z.string().max(60),
      closed: z.boolean().default(false),
    })).max(14).default([]),
    showCurrentStatus: z.boolean().default(true),
    note: z.string().max(240).default(''),
  }),
});

const multiLocationMapCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('multi-location-map'),
  content: z.object({
    title: z.string().max(80).default('지점 안내'),
    locations: z.array(z.object({
      name: z.string().max(80),
      address: z.string().max(200),
      lat: z.number().default(0),
      lng: z.number().default(0),
    })).max(20).default([]),
    activeIndex: z.number().int().min(0).max(20).default(0),
    showList: z.boolean().default(true),
  }),
});

// ─── Phase 19 — Decorative widgets ───────────────────────────────

const shapeCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('shape'),
  content: z.object({
    shape: z.enum(['circle', 'square', 'triangle', 'pentagon', 'hexagon', 'star', 'heart', 'arrow', 'blob']).default('circle'),
    fill: z.string().max(60).default('#1d4ed8'),
    stroke: z.string().max(60).default(''),
    strokeWidth: z.number().int().min(0).max(20).default(0),
  }),
});

const patternCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('pattern'),
  content: z.object({
    pattern: z.enum(['dots', 'grid', 'diagonal', 'waves', 'stripes', 'checkerboard']).default('dots'),
    color: z.string().max(60).default('#cbd5e1'),
    background: z.string().max(60).default('#f8fafc'),
    scale: z.number().int().min(4).max(120).default(24),
  }),
});

const parallaxBgCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('parallax-bg'),
  content: z.object({
    imageUrl: z.string().max(2000).default(''),
    overlayColor: z.string().max(60).default('rgba(15, 23, 42, 0.4)'),
    speed: z.number().min(0).max(2).default(0.4),
    contentTitle: z.string().max(160).default(''),
    contentSubtitle: z.string().max(280).default(''),
  }),
});

const frameCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('frame'),
  content: z.object({
    style: z.enum(['solid', 'double', 'corner', 'photo', 'tag']).default('solid'),
    color: z.string().max(60).default('#0f172a'),
    width: z.number().int().min(1).max(40).default(4),
    radius: z.number().int().min(0).max(120).default(12),
    label: z.string().max(80).default(''),
  }),
});

const stickerCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('sticker'),
  content: z.object({
    emoji: z.string().max(20).default('⭐'),
    label: z.string().max(80).default(''),
    background: z.string().max(60).default('#fde68a'),
    color: z.string().max(60).default('#92400e'),
    rotation: z.number().int().min(-45).max(45).default(-8),
    variant: z.enum(['badge', 'pill', 'banner']).default('badge'),
  }),
});

// ─── Phase 20 — Data Display widgets ─────────────────────────────

const chartDataPointSchema = z.object({
  label: z.string().max(40),
  value: z.number(),
});

const barChartCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('bar-chart'),
  content: z.object({
    title: z.string().max(120).default(''),
    points: z.array(chartDataPointSchema).max(40).default([]),
    color: z.string().max(60).default('#1d4ed8'),
    showValueLabel: z.boolean().default(true),
  }),
});

const lineChartCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('line-chart'),
  content: z.object({
    title: z.string().max(120).default(''),
    points: z.array(chartDataPointSchema).max(40).default([]),
    color: z.string().max(60).default('#0ea5e9'),
    smooth: z.boolean().default(true),
    showPoints: z.boolean().default(true),
  }),
});

const pieChartCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('pie-chart'),
  content: z.object({
    title: z.string().max(120).default(''),
    slices: z.array(z.object({
      label: z.string().max(40),
      value: z.number().min(0),
      color: z.string().max(60).optional(),
    })).max(12).default([]),
    showLegend: z.boolean().default(true),
    donut: z.boolean().default(false),
  }),
});

const counterCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('counter'),
  content: z.object({
    title: z.string().max(120).default(''),
    suffix: z.string().max(20).default(''),
    prefix: z.string().max(20).default(''),
    target: z.number().default(100),
    durationMs: z.number().int().min(200).max(20000).default(1500),
    decimals: z.number().int().min(0).max(4).default(0),
  }),
});

const testimonialCarouselCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('testimonial-carousel'),
  content: z.object({
    items: z.array(z.object({
      quote: z.string().max(800),
      name: z.string().max(80),
      role: z.string().max(160).optional(),
      avatar: z.string().max(2000).optional(),
    })).max(20).default([]),
    autoplayMs: z.number().int().min(0).max(60000).default(6000),
    showStars: z.boolean().default(true),
  }),
});

const pricingTableCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('pricing-table'),
  content: z.object({
    plans: z.array(z.object({
      name: z.string().max(60),
      price: z.string().max(60),
      period: z.string().max(40).optional(),
      featured: z.boolean().default(false),
      features: z.array(z.string().max(160)).max(20).default([]),
      ctaLabel: z.string().max(60).default('선택'),
      ctaHref: z.string().max(2000).default(''),
    })).max(6).default([]),
  }),
});

const comparisonTableCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('comparison-table'),
  content: z.object({
    columns: z.array(z.string().max(60)).max(8).default([]),
    rows: z.array(z.object({
      feature: z.string().max(120),
      values: z.array(z.string().max(60)).max(8),
    })).max(20).default([]),
  }),
});

const timelineCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('timeline'),
  content: z.object({
    items: z.array(z.object({
      year: z.string().max(20),
      title: z.string().max(120),
      description: z.string().max(400).optional(),
    })).max(40).default([]),
    orientation: z.enum(['vertical', 'horizontal']).default('vertical'),
    accentColor: z.string().max(60).default('#0f172a'),
  }),
});

const teamMemberCardCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('team-member-card'),
  content: z.object({
    name: z.string().max(80).default(''),
    role: z.string().max(160).default(''),
    bio: z.string().max(600).default(''),
    avatar: z.string().max(2000).default(''),
    socialLinks: z.array(z.object({
      label: z.string().max(40),
      href: z.string().max(2000),
    })).max(8).default([]),
  }),
});

const serviceFeatureCardCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('service-feature-card'),
  content: z.object({
    icon: z.string().max(20).default('★'),
    title: z.string().max(120).default(''),
    description: z.string().max(600).default(''),
    ctaLabel: z.string().max(60).default(''),
    ctaHref: z.string().max(2000).default(''),
    variant: z.enum(['minimal', 'card', 'gradient']).default('card'),
  }),
});

export const builderCanvasNodeSchema = z.discriminatedUnion('kind', [
  textCanvasNodeSchema,
  imageCanvasNodeSchema,
  buttonCanvasNodeSchema,
  headingCanvasNodeSchema,
  containerCanvasNodeSchema,
  sectionCanvasNodeSchema,
  compositeCanvasNodeSchema,
  dividerCanvasNodeSchema,
  spacerCanvasNodeSchema,
  iconCanvasNodeSchema,
  videoCanvasNodeSchema,
  videoEmbedCanvasNodeSchema,
  audioCanvasNodeSchema,
  lottieCanvasNodeSchema,
  formCanvasNodeSchema,
  formInputCanvasNodeSchema,
  formTextareaCanvasNodeSchema,
  formSubmitCanvasNodeSchema,
  formSelectCanvasNodeSchema,
  formCheckboxCanvasNodeSchema,
  formRadioCanvasNodeSchema,
  formFileCanvasNodeSchema,
  formDateCanvasNodeSchema,
  formSignatureCanvasNodeSchema,
  formPaymentCanvasNodeSchema,
  blogFeedCanvasNodeSchema,
  blogPostCardCanvasNodeSchema,
  blogCategoriesCanvasNodeSchema,
  blogArchiveCanvasNodeSchema,
  featuredPostsCanvasNodeSchema,
  galleryCanvasNodeSchema,
  mapCanvasNodeSchema,
  customEmbedCanvasNodeSchema,
  columnCardCanvasNodeSchema,
  columnListCanvasNodeSchema,
  attorneyCardCanvasNodeSchema,
  faqListCanvasNodeSchema,
  contactFormCanvasNodeSchema,
  ctaBannerCanvasNodeSchema,
  bookingWidgetCanvasNodeSchema,
  countdownCanvasNodeSchema,
  progressCanvasNodeSchema,
  ratingCanvasNodeSchema,
  notificationBarCanvasNodeSchema,
  backToTopCanvasNodeSchema,
  menuBarCanvasNodeSchema,
  anchorMenuCanvasNodeSchema,
  breadcrumbsCanvasNodeSchema,
  socialBarCanvasNodeSchema,
  shareButtonsCanvasNodeSchema,
  socialEmbedCanvasNodeSchema,
  floatingChatCanvasNodeSchema,
  addressBlockCanvasNodeSchema,
  businessHoursCanvasNodeSchema,
  multiLocationMapCanvasNodeSchema,
  shapeCanvasNodeSchema,
  patternCanvasNodeSchema,
  parallaxBgCanvasNodeSchema,
  frameCanvasNodeSchema,
  stickerCanvasNodeSchema,
  barChartCanvasNodeSchema,
  lineChartCanvasNodeSchema,
  pieChartCanvasNodeSchema,
  counterCanvasNodeSchema,
  testimonialCarouselCanvasNodeSchema,
  pricingTableCanvasNodeSchema,
  comparisonTableCanvasNodeSchema,
  timelineCanvasNodeSchema,
  teamMemberCardCanvasNodeSchema,
  serviceFeatureCardCanvasNodeSchema,
]);

export type BuilderTextCanvasNode = z.infer<typeof textCanvasNodeSchema>;
export type BuilderImageCanvasNode = z.infer<typeof imageCanvasNodeSchema>;
export type BuilderButtonCanvasNode = z.infer<typeof buttonCanvasNodeSchema>;
export type BuilderHeadingCanvasNode = z.infer<typeof headingCanvasNodeSchema>;
export type BuilderContainerCanvasNode = z.infer<typeof containerCanvasNodeSchema>;
export type BuilderSectionCanvasNode = z.infer<typeof sectionCanvasNodeSchema>;
export type BuilderCompositeCanvasNode = z.infer<typeof compositeCanvasNodeSchema>;
export type BuilderDividerCanvasNode = z.infer<typeof dividerCanvasNodeSchema>;
export type BuilderSpacerCanvasNode = z.infer<typeof spacerCanvasNodeSchema>;
export type BuilderIconCanvasNode = z.infer<typeof iconCanvasNodeSchema>;
export type BuilderVideoCanvasNode = z.infer<typeof videoCanvasNodeSchema>;
export type BuilderVideoEmbedCanvasNode = z.infer<typeof videoEmbedCanvasNodeSchema>;
export type BuilderAudioCanvasNode = z.infer<typeof audioCanvasNodeSchema>;
export type BuilderLottieCanvasNode = z.infer<typeof lottieCanvasNodeSchema>;
export type BuilderFormCanvasNode = z.infer<typeof formCanvasNodeSchema>;
export type BuilderFormInputCanvasNode = z.infer<typeof formInputCanvasNodeSchema>;
export type BuilderFormTextareaCanvasNode = z.infer<typeof formTextareaCanvasNodeSchema>;
export type BuilderFormSubmitCanvasNode = z.infer<typeof formSubmitCanvasNodeSchema>;
export type BuilderFormSelectCanvasNode = z.infer<typeof formSelectCanvasNodeSchema>;
export type BuilderFormCheckboxCanvasNode = z.infer<typeof formCheckboxCanvasNodeSchema>;
export type BuilderFormRadioCanvasNode = z.infer<typeof formRadioCanvasNodeSchema>;
export type BuilderFormFileCanvasNode = z.infer<typeof formFileCanvasNodeSchema>;
export type BuilderFormDateCanvasNode = z.infer<typeof formDateCanvasNodeSchema>;
export type BuilderFormSignatureCanvasNode = z.infer<typeof formSignatureCanvasNodeSchema>;
export type BuilderFormPaymentCanvasNode = z.infer<typeof formPaymentCanvasNodeSchema>;
export type BuilderBlogFeedCanvasNode = z.infer<typeof blogFeedCanvasNodeSchema>;
export type BuilderBlogPostCardCanvasNode = z.infer<typeof blogPostCardCanvasNodeSchema>;
export type BuilderBlogCategoriesCanvasNode = z.infer<typeof blogCategoriesCanvasNodeSchema>;
export type BuilderBlogArchiveCanvasNode = z.infer<typeof blogArchiveCanvasNodeSchema>;
export type BuilderFeaturedPostsCanvasNode = z.infer<typeof featuredPostsCanvasNodeSchema>;
export type BuilderGalleryCanvasNode = z.infer<typeof galleryCanvasNodeSchema>;
export type BuilderMapCanvasNode = z.infer<typeof mapCanvasNodeSchema>;
export type BuilderCustomEmbedCanvasNode = z.infer<typeof customEmbedCanvasNodeSchema>;
export type BuilderColumnCardCanvasNode = z.infer<typeof columnCardCanvasNodeSchema>;
export type BuilderColumnListCanvasNode = z.infer<typeof columnListCanvasNodeSchema>;
export type BuilderAttorneyCardCanvasNode = z.infer<typeof attorneyCardCanvasNodeSchema>;
export type BuilderFaqListCanvasNode = z.infer<typeof faqListCanvasNodeSchema>;
export type BuilderContactFormCanvasNode = z.infer<typeof contactFormCanvasNodeSchema>;
export type BuilderCtaBannerCanvasNode = z.infer<typeof ctaBannerCanvasNodeSchema>;
export type BuilderBookingWidgetCanvasNode = z.infer<typeof bookingWidgetCanvasNodeSchema>;
export type BuilderCountdownCanvasNode = z.infer<typeof countdownCanvasNodeSchema>;
export type BuilderProgressCanvasNode = z.infer<typeof progressCanvasNodeSchema>;
export type BuilderRatingCanvasNode = z.infer<typeof ratingCanvasNodeSchema>;
export type BuilderNotificationBarCanvasNode = z.infer<typeof notificationBarCanvasNodeSchema>;
export type BuilderBackToTopCanvasNode = z.infer<typeof backToTopCanvasNodeSchema>;
export type BuilderMenuBarCanvasNode = z.infer<typeof menuBarCanvasNodeSchema>;
export type BuilderAnchorMenuCanvasNode = z.infer<typeof anchorMenuCanvasNodeSchema>;
export type BuilderBreadcrumbsCanvasNode = z.infer<typeof breadcrumbsCanvasNodeSchema>;
export type BuilderSocialBarCanvasNode = z.infer<typeof socialBarCanvasNodeSchema>;
export type BuilderShareButtonsCanvasNode = z.infer<typeof shareButtonsCanvasNodeSchema>;
export type BuilderSocialEmbedCanvasNode = z.infer<typeof socialEmbedCanvasNodeSchema>;
export type BuilderFloatingChatCanvasNode = z.infer<typeof floatingChatCanvasNodeSchema>;
export type BuilderAddressBlockCanvasNode = z.infer<typeof addressBlockCanvasNodeSchema>;
export type BuilderBusinessHoursCanvasNode = z.infer<typeof businessHoursCanvasNodeSchema>;
export type BuilderMultiLocationMapCanvasNode = z.infer<typeof multiLocationMapCanvasNodeSchema>;
export type BuilderShapeCanvasNode = z.infer<typeof shapeCanvasNodeSchema>;
export type BuilderPatternCanvasNode = z.infer<typeof patternCanvasNodeSchema>;
export type BuilderParallaxBgCanvasNode = z.infer<typeof parallaxBgCanvasNodeSchema>;
export type BuilderFrameCanvasNode = z.infer<typeof frameCanvasNodeSchema>;
export type BuilderStickerCanvasNode = z.infer<typeof stickerCanvasNodeSchema>;
export type BuilderBarChartCanvasNode = z.infer<typeof barChartCanvasNodeSchema>;
export type BuilderLineChartCanvasNode = z.infer<typeof lineChartCanvasNodeSchema>;
export type BuilderPieChartCanvasNode = z.infer<typeof pieChartCanvasNodeSchema>;
export type BuilderCounterCanvasNode = z.infer<typeof counterCanvasNodeSchema>;
export type BuilderTestimonialCarouselCanvasNode = z.infer<typeof testimonialCarouselCanvasNodeSchema>;
export type BuilderPricingTableCanvasNode = z.infer<typeof pricingTableCanvasNodeSchema>;
export type BuilderComparisonTableCanvasNode = z.infer<typeof comparisonTableCanvasNodeSchema>;
export type BuilderTimelineCanvasNode = z.infer<typeof timelineCanvasNodeSchema>;
export type BuilderTeamMemberCardCanvasNode = z.infer<typeof teamMemberCardCanvasNodeSchema>;
export type BuilderServiceFeatureCardCanvasNode = z.infer<typeof serviceFeatureCardCanvasNodeSchema>;
export type BuilderCanvasNode = z.infer<typeof builderCanvasNodeSchema>;

export const builderCanvasDocumentSchema = z.object({
  version: z.literal(1),
  locale: sandboxLocaleSchema,
  updatedAt: z.string().datetime({ offset: true }),
  updatedBy: z.string().trim().min(1).max(120),
  stageWidth: z.number().int().min(320).max(4000).default(1280),
  stageHeight: z.number().int().min(64).max(20000).default(880),
  nodes: z.array(builderCanvasNodeSchema).max(1000),
});

export type BuilderCanvasDocument = z.infer<typeof builderCanvasDocumentSchema>;

export interface BuilderCanvasDraftEnvelope {
  backend: 'blob' | 'file';
  persisted: boolean;
  document: BuilderCanvasDocument;
}

export const CANVAS_SANDBOX_UPDATED_BY = 'sandbox-builder';

export function createDefaultCanvasNodeStyle(
  overrides: Partial<BuilderCanvasNodeStyle> = {},
): BuilderCanvasNodeStyle {
  return {
    ...canvasNodeStyleDefaults,
    ...overrides,
  };
}

function createNow(): string {
  return new Date().toISOString();
}

export function createDefaultCanvasDocument(locale: Locale): BuilderCanvasDocument {
  const updatedAt = createNow();
  return {
    version: 1,
    locale,
    updatedAt,
    updatedBy: CANVAS_SANDBOX_UPDATED_BY,
    stageWidth: 1280,
    stageHeight: 880,
    nodes: [
      {
        id: 'headline-1',
        kind: 'text',
        rect: { x: 72, y: 64, width: 360, height: 88 },
        style: createDefaultCanvasNodeStyle(),
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: locale === 'ko' ? '대만 법률 문제를 직접 구성하는 자유 캔버스' : 'Build legal landing pages on a free canvas',
          fontSize: 34,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.25,
          letterSpacing: 0,
          fontFamily: 'system-ui',
        },
      },
      {
        id: 'support-copy-1',
        kind: 'text',
        rect: { x: 72, y: 170, width: 420, height: 72 },
        style: createDefaultCanvasNodeStyle(),
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: locale === 'ko'
            ? '텍스트, 이미지, 버튼을 직접 배치하고 드래그/리사이즈 동작을 검증하는 Phase 1 sandbox 입니다.'
            : 'Phase 1 sandbox for direct placement, drag, and resize of text, image, and button nodes.',
          fontSize: 17,
          color: '#475569',
          fontWeight: 'regular',
          align: 'left',
          lineHeight: 1.25,
          letterSpacing: 0,
          fontFamily: 'system-ui',
        },
      },
      {
        id: 'cta-button-1',
        kind: 'button',
        rect: { x: 72, y: 280, width: 176, height: 52 },
        style: createDefaultCanvasNodeStyle({
          borderRadius: 999,
          shadowY: 14,
          shadowBlur: 30,
          shadowColor: 'rgba(11, 59, 46, 0.18)',
        }),
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: locale === 'ko' ? '상담 요청하기' : 'Request Consultation',
          href: '/ko/contact',
          style: 'primary',
        },
      },
      {
        id: 'cta-button-2',
        kind: 'button',
        rect: { x: 264, y: 280, width: 160, height: 52 },
        style: createDefaultCanvasNodeStyle({
          borderRadius: 999,
          shadowY: 8,
          shadowBlur: 18,
          shadowColor: 'rgba(15, 23, 42, 0.08)',
        }),
        zIndex: 3,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: locale === 'ko' ? '서비스 보기' : 'View Services',
          href: '/ko/services',
          style: 'secondary',
        },
      },
      {
        id: 'hero-image-1',
        kind: 'image',
        rect: { x: 520, y: 72, width: 360, height: 280 },
        style: createDefaultCanvasNodeStyle({
          borderRadius: 12,
        }),
        zIndex: 4,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          src: '/images/header-skyline-ratio.webp',
          alt: locale === 'ko' ? '타이베이 스카이라인' : 'Taipei skyline',
          fit: 'cover',
          cropAspect: '',
        },
      },
    ],
  };
}

export function createBlankCanvasDocument(locale: Locale): BuilderCanvasDocument {
  return {
    version: 1,
    locale,
    updatedAt: createNow(),
    updatedBy: CANVAS_SANDBOX_UPDATED_BY,
    stageWidth: 1280,
    stageHeight: 880,
    nodes: [],
  };
}

export function normalizeCanvasDocument(
  input: unknown,
  locale: Locale,
): BuilderCanvasDocument {
  const fallback = createDefaultCanvasDocument(locale);
  const parsed = builderCanvasDocumentSchema.safeParse(input);
  if (!parsed.success) {
    const issues = parsed.error.issues.slice(0, 3).map((i) => ({
      path: i.path.join('.'),
      code: i.code,
      message: i.message,
    }));
    // eslint-disable-next-line no-console
    console.warn(
      '[normalizeCanvasDocument] schema rejected — falling back to sandbox template',
      { totalIssues: parsed.error.issues.length, sample: issues },
    );
    return fallback;
  }

  const nodes = [...parsed.data.nodes]
    .sort((left, right) => left.zIndex - right.zIndex)
    .map((node, index) => ({
      ...node,
      parentId: node.parentId,
      zIndex: index,
      rotation: Math.max(0, Math.min(360, Math.round(node.rotation))),
      rect: {
        x: Math.max(0, Math.round(node.rect.x)),
        y: Math.max(0, Math.round(node.rect.y)),
        width: Math.max(40, Math.round(node.rect.width)),
        height: Math.max(32, Math.round(node.rect.height)),
      },
    }));

  return {
    ...parsed.data,
    locale,
    nodes,
  };
}
