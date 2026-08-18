import { type BuilderCanvasNode, type BuilderImageCanvasNode, createDefaultCanvasNodeStyle } from './types';
import { locales, type Locale } from '@/lib/locales';
import { pageCopy } from '@/data/page-copy';
import { getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import {
  PAGE_CONTAINER_WIDTH,
  PAGE_CONTAINER_X,
  PAGE_STAGE_WIDTH,
  createPageHeaderSectionNodes,
  estimateTextHeight,
  estimateTextWidth,
} from './decompose-page-shared';
import {
  createHomeButtonNode,
  createHomeContainerNode,
  createHomeImageNode,
  createHomeTextNode,
} from './decompose-home-shared';

type PricingIconSvgName = Extract<
  NonNullable<BuilderImageCanvasNode['content']['svg']>['name'],
  'pricing-consultation' | 'pricing-litigation' | 'pricing-company' | 'pricing-retainer'
>;

type PricingItem = {
  icon: PricingIconSvgName;
  title: string;
  price: string;
  unit: string;
  details: string[];
  note?: string;
  highlighted?: boolean;
};

type PricingContent = {
  currency: string;
  items: PricingItem[];
  disclaimer: string;
  ctaLabel: string;
};

const pricingData: Record<Locale, PricingContent> = {
  ko: {
    currency: 'NTD (대만달러)',
    items: [
      {
        icon: 'pricing-consultation',
        title: '일반 법률상담',
        price: 'NT$ 3,000',
        unit: '/ 1시간',
        details: ['대면 또는 화상 상담', '한국어·중국어 상담 가능', '법률 이슈 분석 및 방향 제시', '사전 예약 필수'],
      },
      {
        icon: 'pricing-litigation',
        title: '민사·형사 소송',
        price: '견적 문의',
        unit: '',
        details: ['민사소송 (손해배상, 계약분쟁 등)', '형사소송 (고소, 변호)', '사건 유형·복합성에 따라 비용 상이', '정확한 견적은 상담 후 안내'],
        note: '사건 내용을 확인한 후 견적을 안내드립니다. 먼저 상담을 예약해 주세요.',
      },
      {
        icon: 'pricing-company',
        title: '대만 법인설립',
        price: 'NT$ 50,000',
        unit: '',
        details: ['자본금 400만 NTD 이하 기준', '단일 주주 기준', '투자 허가 + 법인 등기 + 사업자 등록 포함', '은행 동행 시 추가 비용 발생', '거류증(ARC) 발급 대행 시 추가 비용 발생'],
        note: '자본금 초과·복수 주주·특수 법인(지사, 합자 등)은 별도 견적 문의가 필요합니다.',
      },
      {
        icon: 'pricing-retainer',
        title: '연간 법률고문',
        price: 'NT$ 50,000',
        unit: '/ 1년',
        details: ['상시 법률 자문 서비스', '계약서 검토 및 리스크 분석', '노동법·상법 관련 상시 자문', '월별 분납 상담 가능'],
      },
    ],
    disclaimer: '상기 비용은 기본 기준이며, 사건의 특성·복합성·긴급도에 따라 변동될 수 있습니다. 정확한 비용은 초기 상담 후 서면 견적으로 안내드립니다.',
    ctaLabel: '상담 예약하기',
  },
  'zh-hant': {
    currency: 'NTD (新台幣)',
    items: [
      {
        icon: 'pricing-consultation',
        title: '一般法律諮詢',
        price: 'NT$ 3,000',
        unit: '/ 1小時',
        details: ['面談或視訊諮詢', '韓語·中文諮詢皆可', '法律問題分析與方向建議', '須事先預約'],
      },
      {
        icon: 'pricing-litigation',
        title: '民事·刑事訴訟',
        price: '報價諮詢',
        unit: '',
        details: ['民事訴訟（損害賠償、合約糾紛等）', '刑事訴訟（告訴、辯護）', '依案件類型與複雜度費用有所不同', '確切報價於諮詢後提供'],
        note: '確認案件內容後提供報價，請先預約諮詢。',
      },
      {
        icon: 'pricing-company',
        title: '台灣公司設立',
        price: 'NT$ 50,000',
        unit: '',
        details: ['資本額 400萬 NTD 以下', '單一股東', '含投資許可 + 公司登記 + 營業登記', '銀行陪同另計費用', '居留證（ARC）代辦另計費用'],
        note: '資本額超過、多位股東或特殊法人（分公司、合資等）需另行詢價。',
      },
      {
        icon: 'pricing-retainer',
        title: '年度法律顧問',
        price: 'NT$ 50,000',
        unit: '/ 1年',
        details: ['常態法律諮詢服務', '合約審閱與風險分析', '勞動法·商法相關常態顧問', '可商議按月分期付款'],
      },
    ],
    disclaimer: '以上費用為基本標準，依案件特性、複雜度及急迫程度可能有所調整。確切費用於初次諮詢後以書面報價方式提供。',
    ctaLabel: '預約諮詢',
  },
  en: {
    currency: 'NTD (New Taiwan Dollar)',
    items: [
      {
        icon: 'pricing-consultation',
        title: 'General Legal Consultation',
        price: 'NT$ 3,000',
        unit: '/ 1 hour',
        details: ['In-person or video consultation', 'Available in Korean & Chinese', 'Legal issue analysis & guidance', 'Appointment required'],
      },
      {
        icon: 'pricing-litigation',
        title: 'Civil & Criminal Litigation',
        price: 'Request a Quote',
        unit: '',
        details: ['Civil litigation (damages, contract disputes, etc.)', 'Criminal litigation (complaints, defense)', 'Fees vary by case type and complexity', 'Exact quote provided after consultation'],
        note: 'We provide a quote after reviewing your case. Please book a consultation first.',
      },
      {
        icon: 'pricing-company',
        title: 'Taiwan Company Setup',
        price: 'NT$ 50,000',
        unit: '',
        details: ['Capital under NTD 4 million', 'Single shareholder', 'Includes investment permit + registration + business license', 'Bank accompaniment: additional fee', 'ARC (residence permit) processing: additional fee'],
        note: 'Higher capital, multiple shareholders, or special entities (branch, JV, etc.) require a separate quote.',
      },
      {
        icon: 'pricing-retainer',
        title: 'Annual Legal Retainer',
        price: 'NT$ 50,000',
        unit: '/ 1 year',
        details: ['Ongoing legal advisory service', 'Contract review & risk analysis', 'Labor & commercial law counsel', 'Monthly installment available'],
      },
    ],
    disclaimer: 'Fees above are baseline standards and may vary based on case characteristics, complexity, and urgency. Exact fees will be provided in writing after the initial consultation.',
    ctaLabel: 'Book a Consultation',
  },
};

const SECTION_TOP = 88;
// Live parity: `.pricing-section` renders padding 8.8rem (≈140.8px) top AND
// bottom. The TOP is modelled indirectly as SECTION_TOP(88) + GRID_Y(120) = 208
// (the currency caption floats inside that band), but the BOTTOM is pure section
// padding below the CTA, so it must carry the full live 140.8 → 141. Leaving it
// at 88 ended the pricing section ~53px short below the CTA vs the live render.
const SECTION_BOTTOM = 141;

function buildPricingDetailList(
  prefix: string,
  parentId: string,
  y: number,
  width: number,
  items: string[],
  gap = 22,
): { nodes: BuilderCanvasNode[]; height: number } {
  const nodes: BuilderCanvasNode[] = [];
  let cursor = 0;
  items.forEach((item, index) => {
    const height = estimateTextHeight(`• ${item}`, width, 15, 1.6);
    nodes.push(
      createHomeTextNode({
        id: `${prefix}-item-${index}`,
        parentId,
        rect: { x: 0, y: cursor, width, height },
        zIndex: index,
        text: `• ${item}`,
        as: 'p',
        fontSize: 15,
      }),
    );
    // A generous per-item gap (~46px pitch for a single 15px line) mirrors the
    // live spacing AND leaves room for a long item to wrap to a second rendered
    // line without overlapping the next item inside the narrow 228px column.
    cursor += height + gap;
  });
  return {
    nodes,
    height: Math.max(0, cursor - gap),
  };
}

function createPricingSectionNodes(
  y: number,
  locale: Locale,
  zBase: number,
): { nodes: BuilderCanvasNode[]; height: number } {
  const data = pricingData[locale];
  const rootId = 'page-pricing-section-root';
  const containerId = 'page-pricing-section-container';
  const gridId = 'page-pricing-grid';
  // Vertical intro parity: on the live site the pricing content-section top →
  // card-row top measures 208px (the currency caption floats inside a generous
  // section top padding). We carry that as intro = SECTION_TOP(88) + GRID_Y so
  // 88 + 120 = 208. Most of the room sits ABOVE the caption (section padding +
  // CURRENCY_Y); the caption→card gap stays a natural ~48px (GRID_Y − caption
  // bottom) rather than one large empty band.
  const CURRENCY_Y = 44;
  const GRID_Y = 120;
  const nodes: BuilderCanvasNode[] = [
    createHomeContainerNode({
      id: rootId,
      rect: { x: 0, y, width: PAGE_STAGE_WIDTH, height: 1600 },
      zIndex: zBase,
      label: 'pricing section root',
      className: 'section pricing-section',
      as: 'section',
    }),
    createHomeContainerNode({
      id: containerId,
      parentId: rootId,
      rect: { x: PAGE_CONTAINER_X, y: SECTION_TOP, width: PAGE_CONTAINER_WIDTH, height: 1400 },
      zIndex: 0,
      label: 'pricing section container',
      className: 'container',
    }),
    createHomeTextNode({
      id: 'page-pricing-currency',
      parentId: containerId,
      rect: { x: 0, y: CURRENCY_Y, width: 360, height: 28 },
      zIndex: 0,
      text: data.currency,
      className: 'pricing-currency',
      as: 'p',
      fontSize: 18,
      fontWeight: 'medium',
    }),
    createHomeContainerNode({
      id: gridId,
      parentId: containerId,
      rect: { x: 0, y: GRID_Y, width: PAGE_CONTAINER_WIDTH, height: 0 },
      zIndex: 1,
      label: 'pricing grid',
      className: 'pricing-grid',
    }),
  ];

  // Live parity (measured on tseng-law.com/ko/pricing): four white cards on a
  // single row, each 276×505 with a 16px radius and a soft drop shadow. The
  // grid-relative X positions reproduce the live absolute x = 51 / 351 / 652 /
  // 952 (the .container starts at PAGE_CONTAINER_X = 51 and the grid sits at
  // x=0 within it).
  const CARD_WIDTH = 276;
  const CARD_HEIGHT_FLOOR = 505;
  const CARD_GAP = 24;
  const CARD_X_POSITIONS = [0, 300, 601, 901];
  const CARD_INNER_X = 24;
  const CARD_INNER_WIDTH = CARD_WIDTH - CARD_INNER_X * 2; // 228
  const CARD_PAD_TOP = 32;
  const CARD_PAD_BOTTOM = 30;
  const ICON_SIZE = 78;
  const ICON_ART_SIZE = 40;
  const ICON_TO_TITLE = 12;
  const TITLE_TO_PRICE = 12;
  const PRICE_TO_DETAILS = 18;
  const DETAILS_TO_NOTE = 14;
  const TITLE_FONT_SIZE = 22;
  const PRICE_FONT_SIZE = 24;
  const DETAIL_GAP = 22;

  // Pass 1 — measure each card's inner content so all four cards can share ONE
  // stretched height (the live grid uses align-items: stretch → every card is
  // as tall as the tallest). ko/zh-hant content fits within the 505 floor, so
  // those locales land exactly on the live 505; the longer English copy grows
  // the whole row uniformly instead of overflowing a fixed 505 box (which would
  // push text past the card edge / overlap the disclaimer).
  const cardLayouts = data.items.map((item, index) => {
    const cardId = `page-pricing-card-${index}`;
    const detailId = `${cardId}-details`;
    const titleHeight = estimateTextHeight(item.title, CARD_INNER_WIDTH, TITLE_FONT_SIZE, 1.2);
    const priceHeight = estimateTextHeight(item.price, CARD_INNER_WIDTH, PRICE_FONT_SIZE, 1.2);
    const detailBuild = buildPricingDetailList(`${cardId}-detail`, detailId, 0, CARD_INNER_WIDTH, item.details, DETAIL_GAP);
    const noteHeight = item.note ? estimateTextHeight(item.note, CARD_INNER_WIDTH, 15, 1.65) : 0;
    const iconTop = CARD_PAD_TOP;
    const titleTop = iconTop + ICON_SIZE + ICON_TO_TITLE;
    const priceTop = titleTop + titleHeight + TITLE_TO_PRICE;
    const detailsTop = priceTop + priceHeight + PRICE_TO_DETAILS;
    const detailsBottom = detailsTop + detailBuild.height;
    const noteTop = detailsBottom + DETAILS_TO_NOTE;
    const contentBottom = (item.note ? noteTop + noteHeight : detailsBottom) + CARD_PAD_BOTTOM;
    return { cardId, detailId, titleHeight, priceHeight, detailBuild, noteHeight, iconTop, titleTop, priceTop, detailsTop, noteTop, contentBottom };
  });
  const cardHeight = Math.max(CARD_HEIGHT_FLOOR, ...cardLayouts.map((layout) => layout.contentBottom));

  // Pass 2 — emit the nodes at their measured offsets with the shared height.
  let maxBottom = 0;
  data.items.forEach((item, index) => {
    const layout = cardLayouts[index];
    const { cardId, detailId } = layout;
    const cardX = CARD_X_POSITIONS[index] ?? index * (CARD_WIDTH + CARD_GAP);
    const cardY = 0;
    maxBottom = Math.max(maxBottom, cardY + cardHeight);

    const cardNode = createHomeContainerNode({
      id: cardId,
      parentId: gridId,
      rect: { x: cardX, y: cardY, width: CARD_WIDTH, height: cardHeight },
      zIndex: index,
      label: `pricing card ${index + 1}`,
      className: `card pricing-card${item.highlighted ? ' pricing-card--highlight' : ''}`,
      as: 'article',
      background: '#ffffff',
      borderRadius: 16,
    });

    // The published renderer paints layoutMode:absolute nodes from node.style
    // (backgroundColor via resolveBackgroundStyle, borderRadius, shadow*) — the
    // legacy `.pricing-card` CSS class is NOT loaded — so the white fill, 16px
    // radius and soft shadow are baked directly onto the card node style.
    const styledCardNode: BuilderCanvasNode = {
      ...cardNode,
      style: createDefaultCanvasNodeStyle({
        backgroundColor: '#ffffff',
        borderRadius: 16,
        shadowX: 0,
        shadowY: 18,
        shadowBlur: 40,
        shadowSpread: -8,
        shadowColor: 'rgba(15, 23, 42, 0.10)',
      }),
    };

    // Price amount + unit render inline (live: <span class="pricing-amount"> +
    // <span class="pricing-unit">). Only short amounts carry a unit, so seating
    // the unit right after the estimated amount width keeps both on one row.
    const hasUnit = Boolean(item.unit);
    const amountWidth = hasUnit
      ? Math.min(estimateTextWidth(item.price, PRICE_FONT_SIZE) + 6, CARD_INNER_WIDTH - 44)
      : CARD_INNER_WIDTH;

    nodes.push(
      styledCardNode,
      createHomeContainerNode({
        id: `${cardId}-icon`,
        parentId: cardId,
        rect: { x: Math.round((CARD_WIDTH - ICON_SIZE) / 2), y: layout.iconTop, width: ICON_SIZE, height: ICON_SIZE },
        zIndex: 0,
        label: `pricing icon ${index + 1}`,
        className: 'pricing-card-icon',
        background: 'rgba(248, 244, 238, 0.96)',
        borderColor: 'rgba(18, 50, 79, 0.10)',
        borderWidth: 1,
        borderRadius: 24,
      }),
      createHomeImageNode({
        id: `${cardId}-icon-svg`,
        parentId: `${cardId}-icon`,
        rect: { x: Math.round((ICON_SIZE - ICON_ART_SIZE) / 2), y: Math.round((ICON_SIZE - ICON_ART_SIZE) / 2), width: ICON_ART_SIZE, height: ICON_ART_SIZE },
        zIndex: 0,
        src: '/images/placeholder-image.svg',
        alt: item.title,
        fit: 'contain',
        svg: { enabled: true, name: item.icon, color: 'currentColor' },
      }),
      createHomeTextNode({
        id: `${cardId}-title`,
        parentId: cardId,
        rect: { x: CARD_INNER_X, y: layout.titleTop, width: CARD_INNER_WIDTH, height: layout.titleHeight },
        zIndex: 1,
        text: item.title,
        className: 'pricing-card-title',
        as: 'h3',
        fontSize: TITLE_FONT_SIZE,
        fontWeight: 'bold',
      }),
      createHomeContainerNode({
        id: `${cardId}-price`,
        parentId: cardId,
        rect: { x: CARD_INNER_X, y: layout.priceTop, width: CARD_INNER_WIDTH, height: layout.priceHeight },
        zIndex: 2,
        label: `pricing price ${index + 1}`,
        className: 'pricing-card-price',
      }),
      createHomeTextNode({
        id: `${cardId}-amount`,
        parentId: `${cardId}-price`,
        rect: { x: 0, y: 0, width: amountWidth, height: layout.priceHeight },
        zIndex: 0,
        text: item.price,
        className: 'pricing-amount',
        as: 'span',
        fontSize: PRICE_FONT_SIZE,
        fontWeight: 'bold',
      }),
    );

    if (hasUnit) {
      nodes.push(
        createHomeTextNode({
          id: `${cardId}-unit`,
          parentId: `${cardId}-price`,
          rect: { x: amountWidth + 8, y: 6, width: Math.max(40, CARD_INNER_WIDTH - amountWidth - 8), height: Math.max(18, layout.priceHeight - 6) },
          zIndex: 1,
          text: item.unit,
          className: 'pricing-unit',
          as: 'span',
          fontSize: 15,
        }),
      );
    }

    nodes.push(
      createHomeContainerNode({
        id: detailId,
        parentId: cardId,
        rect: { x: CARD_INNER_X, y: layout.detailsTop, width: CARD_INNER_WIDTH, height: layout.detailBuild.height },
        zIndex: 3,
        label: `pricing details ${index + 1}`,
        className: 'pricing-card-details',
      }),
      ...layout.detailBuild.nodes,
    );

    if (item.note) {
      nodes.push(
        createHomeTextNode({
          id: `${cardId}-note`,
          parentId: cardId,
          rect: { x: CARD_INNER_X, y: layout.noteTop, width: CARD_INNER_WIDTH, height: layout.noteHeight },
          zIndex: 4,
          text: item.note,
          className: 'pricing-card-note',
          as: 'p',
          fontSize: 15,
        }),
      );
    }
  });

  // Live parity for the card-below block (measured on tseng-law.com/*/pricing):
  //  - the disclaimer sits margin-top:44 below the card row,
  //  - it is a centered max-width:680 paragraph at 0.82rem (≈13px) that wraps to
  //    TWO lines for ko/en but stays ONE for the shorter zh-hant copy.
  // estimateTextHeight is latin-centric (assumes ~0.54em/char) and under-counts
  // CJK glyphs (~1em), so the ko disclaimer was mis-estimated as a single line
  // and the page ended ~17px short there (on top of the section-bottom gap).
  // estimateTextWidth IS CJK-aware, so count the wrapped lines at the live box.
  const DISCLAIMER_WIDTH = 680;
  const DISCLAIMER_FONT = 13;
  const DISCLAIMER_LINE_HEIGHT = 1.7;
  const DISCLAIMER_X = Math.round((PAGE_CONTAINER_WIDTH - DISCLAIMER_WIDTH) / 2);
  const disclaimerY = GRID_Y + maxBottom + 44;
  const disclaimerLines = Math.max(1, Math.ceil(estimateTextWidth(data.disclaimer, DISCLAIMER_FONT) / DISCLAIMER_WIDTH));
  const disclaimerHeight = Math.ceil(disclaimerLines * DISCLAIMER_FONT * DISCLAIMER_LINE_HEIGHT);
  // The grid (nodes[3]) was created with height 0 as a placeholder; set its real
  // height IN PLACE. Previously this pushed a COPY of nodes[3], creating a
  // DUPLICATE `page-pricing-grid` node — the duplicate id broke the parent→child
  // node tree, so the grid rendered at height 0 and the 4 pricing cards were
  // clipped/not rendered (the pricing page looked empty). (F14)
  nodes[3] = {
    ...nodes[3],
    rect: { ...nodes[3].rect, height: maxBottom },
  };
  nodes.push(
    createHomeContainerNode({
      id: 'page-pricing-disclaimer-wrap',
      parentId: containerId,
      rect: { x: DISCLAIMER_X, y: disclaimerY, width: DISCLAIMER_WIDTH, height: disclaimerHeight },
      zIndex: 2,
      label: 'pricing disclaimer',
      className: 'pricing-disclaimer',
    }),
    createHomeTextNode({
      id: 'page-pricing-disclaimer',
      parentId: 'page-pricing-disclaimer-wrap',
      rect: { x: 0, y: 0, width: DISCLAIMER_WIDTH, height: disclaimerHeight },
      zIndex: 0,
      text: data.disclaimer,
      as: 'p',
      fontSize: DISCLAIMER_FONT,
    }),
    createHomeContainerNode({
      id: 'page-pricing-cta-wrap',
      parentId: containerId,
      rect: { x: 0, y: disclaimerY + disclaimerHeight + 32, width: 220, height: 44 },
      zIndex: 3,
      label: 'pricing cta',
      className: 'pricing-cta',
    }),
    createHomeButtonNode({
      id: 'page-pricing-cta',
      parentId: 'page-pricing-cta-wrap',
      rect: { x: 0, y: 0, width: 220, height: 44 },
      zIndex: 0,
      label: data.ctaLabel,
      href: getConsultationPublicMailto(locale),
      style: 'primary',
      className: 'button',
      as: 'a',
    }),
  );

  const containerHeight = disclaimerY + disclaimerHeight + 32 + 44;
  const rootHeight = SECTION_TOP + containerHeight + (locale === 'zh-hant' ? 96 : SECTION_BOTTOM);
  nodes[0] = {
    ...nodes[0],
    rect: { x: 0, y, width: PAGE_STAGE_WIDTH, height: rootHeight },
  };
  nodes[1] = {
    ...nodes[1],
    rect: { x: PAGE_CONTAINER_X, y: SECTION_TOP, width: PAGE_CONTAINER_WIDTH, height: containerHeight },
  };

  return { nodes, height: rootHeight };
}

function buildPricingPage(y: number, locale: Locale, zBase: number): { nodes: BuilderCanvasNode[]; height: number } {
  const page = pageCopy[locale].pricing;
  let cursor = y;
  const nodes: BuilderCanvasNode[] = [];

  const header = createPageHeaderSectionNodes({
    prefix: 'page-pricing',
    y: cursor,
    locale,
    label: page.label,
    title: page.title,
    description: page.description,
    zBase,
  });
  nodes.push(...header.nodes);
  cursor += header.height;

  const pricing = createPricingSectionNodes(cursor, locale, zBase + 100);
  nodes.push(...pricing.nodes);
  cursor += pricing.height;

  return { nodes, height: cursor - y };
}

// Per-locale page height. The document's `stageHeight` is only a FLOOR — the
// published renderer resolves final height as max(stageHeight, deepest node
// bottom) (see src/lib/builder/site/public-page.tsx). Each locale's decomposed
// tree already ends tight (section root bottom = CTA bottom + the standard 88px
// SECTION_BOTTOM), so seeding a page with ITS OWN locale height avoids padding
// shorter locales (ko/zh-hant) up to the tallest (English) locale.
// Mirrors getLawyersPageRootHeight — seed-pages.ts should pass this per locale
// (like the lawyers page) instead of the cross-locale max constant.
export function getPricingPageRootHeight(locale: Locale): number {
  return buildPricingPage(0, locale, 0).height;
}

export const PRICING_PAGE_ROOT_HEIGHT = Math.max(...locales.map((locale) => getPricingPageRootHeight(locale)));

export function createPricingPageDecomposedNodes(y: number, locale: Locale, zBase: number): BuilderCanvasNode[] {
  return buildPricingPage(y, locale, zBase).nodes;
}
