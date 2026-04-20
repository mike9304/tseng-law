import type { BuilderCanvasNode } from './types';
import { locales, type Locale } from '@/lib/locales';
import { pageCopy } from '@/data/page-copy';
import {
  PAGE_CONTAINER_WIDTH,
  PAGE_CONTAINER_X,
  PAGE_STAGE_WIDTH,
  createPageHeaderSectionNodes,
  estimateTextHeight,
} from './decompose-page-shared';
import {
  createHomeButtonNode,
  createHomeContainerNode,
  createHomeTextNode,
} from './decompose-home-shared';

type PricingItem = {
  icon: string;
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
  ctaHref: string;
};

const pricingData: Record<Locale, PricingContent> = {
  ko: {
    currency: 'NTD (대만달러)',
    items: [
      {
        icon: 'CONSULTATION',
        title: '일반 법률상담',
        price: 'NT$ 3,000',
        unit: '/ 1시간',
        details: ['대면 또는 화상 상담', '한국어·중국어 상담 가능', '법률 이슈 분석 및 방향 제시', '사전 예약 필수'],
      },
      {
        icon: 'LITIGATION',
        title: '민사·형사 소송',
        price: '견적 문의',
        unit: '',
        details: ['민사소송 (손해배상, 계약분쟁 등)', '형사소송 (고소, 변호)', '사건 유형·복합성에 따라 비용 상이', '정확한 견적은 상담 후 안내'],
        note: '사건 내용을 확인한 후 견적을 안내드립니다. 먼저 상담을 예약해 주세요.',
        highlighted: true,
      },
      {
        icon: 'COMPANY',
        title: '대만 법인설립',
        price: 'NT$ 50,000',
        unit: '',
        details: ['자본금 400만 NTD 이하 기준', '단일 주주 기준', '투자 허가 + 법인 등기 + 사업자 등록 포함', '은행 동행 시 추가 비용 발생', '거류증(ARC) 발급 대행 시 추가 비용 발생'],
        note: '자본금 초과·복수 주주·특수 법인(지사, 합자 등)은 별도 견적 문의가 필요합니다.',
      },
      {
        icon: 'RETAINER',
        title: '연간 법률고문',
        price: 'NT$ 50,000',
        unit: '/ 1년',
        details: ['상시 법률 자문 서비스', '계약서 검토 및 리스크 분석', '노동법·상법 관련 상시 자문', '월별 분납 상담 가능'],
      },
    ],
    disclaimer: '상기 비용은 기본 기준이며, 사건의 특성·복합성·긴급도에 따라 변동될 수 있습니다. 정확한 비용은 초기 상담 후 서면 견적으로 안내드립니다.',
    ctaLabel: '상담 예약하기',
    ctaHref: '/ko/contact',
  },
  'zh-hant': {
    currency: 'NTD (新台幣)',
    items: [
      {
        icon: 'CONSULTATION',
        title: '一般法律諮詢',
        price: 'NT$ 3,000',
        unit: '/ 1小時',
        details: ['面談或視訊諮詢', '韓語·中文諮詢皆可', '法律問題分析與方向建議', '須事先預約'],
      },
      {
        icon: 'LITIGATION',
        title: '民事·刑事訴訟',
        price: '報價諮詢',
        unit: '',
        details: ['民事訴訟（損害賠償、合約糾紛等）', '刑事訴訟（告訴、辯護）', '依案件類型與複雜度費用有所不同', '確切報價於諮詢後提供'],
        note: '確認案件內容後提供報價，請先預約諮詢。',
        highlighted: true,
      },
      {
        icon: 'COMPANY',
        title: '台灣公司設立',
        price: 'NT$ 50,000',
        unit: '',
        details: ['資本額 400萬 NTD 以下', '單一股東', '含投資許可 + 公司登記 + 營業登記', '銀行陪同另計費用', '居留證（ARC）代辦另計費用'],
        note: '資本額超過、多位股東或特殊法人（分公司、合資等）需另行詢價。',
      },
      {
        icon: 'RETAINER',
        title: '年度法律顧問',
        price: 'NT$ 50,000',
        unit: '/ 1年',
        details: ['常態法律諮詢服務', '合約審閱與風險分析', '勞動法·商法相關常態顧問', '可商議按月分期付款'],
      },
    ],
    disclaimer: '以上費用為基本標準，依案件特性、複雜度及急迫程度可能有所調整。確切費用於初次諮詢後以書面報價方式提供。',
    ctaLabel: '預約諮詢',
    ctaHref: '/zh-hant/contact',
  },
  en: {
    currency: 'NTD (New Taiwan Dollar)',
    items: [
      {
        icon: 'CONSULTATION',
        title: 'General Legal Consultation',
        price: 'NT$ 3,000',
        unit: '/ 1 hour',
        details: ['In-person or video consultation', 'Available in Korean & Chinese', 'Legal issue analysis & guidance', 'Appointment required'],
      },
      {
        icon: 'LITIGATION',
        title: 'Civil & Criminal Litigation',
        price: 'Request a Quote',
        unit: '',
        details: ['Civil litigation (damages, contract disputes, etc.)', 'Criminal litigation (complaints, defense)', 'Fees vary by case type and complexity', 'Exact quote provided after consultation'],
        note: 'We provide a quote after reviewing your case. Please book a consultation first.',
        highlighted: true,
      },
      {
        icon: 'COMPANY',
        title: 'Taiwan Company Setup',
        price: 'NT$ 50,000',
        unit: '',
        details: ['Capital under NTD 4 million', 'Single shareholder', 'Includes investment permit + registration + business license', 'Bank accompaniment: additional fee', 'ARC (residence permit) processing: additional fee'],
        note: 'Higher capital, multiple shareholders, or special entities (branch, JV, etc.) require a separate quote.',
      },
      {
        icon: 'RETAINER',
        title: 'Annual Legal Retainer',
        price: 'NT$ 50,000',
        unit: '/ 1 year',
        details: ['Ongoing legal advisory service', 'Contract review & risk analysis', 'Labor & commercial law counsel', 'Monthly installment available'],
      },
    ],
    disclaimer: 'Fees above are baseline standards and may vary based on case characteristics, complexity, and urgency. Exact fees will be provided in writing after the initial consultation.',
    ctaLabel: 'Book a Consultation',
    ctaHref: '/en/contact',
  },
};

const SECTION_TOP = 88;
const SECTION_BOTTOM = 88;

function buildPricingDetailList(
  prefix: string,
  parentId: string,
  y: number,
  width: number,
  items: string[],
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
    cursor += height + 8;
  });
  return {
    nodes,
    height: Math.max(0, cursor - 8),
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
  const gap = 24;
  const cardWidth = 556;
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
      rect: { x: 0, y: 0, width: 360, height: 28 },
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
      rect: { x: 0, y: 56, width: PAGE_CONTAINER_WIDTH, height: 0 },
      zIndex: 1,
      label: 'pricing grid',
      className: 'pricing-grid',
    }),
  ];

  let maxBottom = 0;
  data.items.forEach((item, index) => {
    const cardId = `page-pricing-card-${index}`;
    const detailId = `${cardId}-details`;
    const column = index % 2;
    const row = Math.floor(index / 2);
    const cardX = column * (cardWidth + gap);
    const titleHeight = estimateTextHeight(item.title, cardWidth - 64, 26, 1.15);
    const priceHeight = estimateTextHeight(`${item.price} ${item.unit}`.trim(), cardWidth - 64, 28, 1.2);
    const detailBuild = buildPricingDetailList(`${cardId}-detail`, detailId, 0, cardWidth - 64, item.details);
    const noteHeight = item.note ? estimateTextHeight(item.note, cardWidth - 64, 15, 1.65) : 0;
    const cardHeight = 36 + 52 + 18 + titleHeight + 18 + priceHeight + 24 + detailBuild.height + (item.note ? 20 + noteHeight : 0) + 36;
    const cardY = row * 460;
    maxBottom = Math.max(maxBottom, cardY + cardHeight);

    nodes.push(
      createHomeContainerNode({
        id: cardId,
        parentId: gridId,
        rect: { x: cardX, y: cardY, width: cardWidth, height: cardHeight },
        zIndex: index,
        label: `pricing card ${index + 1}`,
        className: `card pricing-card${item.highlighted ? ' pricing-card--highlight' : ''}`,
        as: 'article',
      }),
      createHomeContainerNode({
        id: `${cardId}-icon`,
        parentId: cardId,
        rect: { x: 0, y: 0, width: 52, height: 52 },
        zIndex: 0,
        label: `pricing icon ${index + 1}`,
        className: 'pricing-card-icon',
      }),
      createHomeTextNode({
        id: `${cardId}-icon-text`,
        parentId: `${cardId}-icon`,
        rect: { x: 0, y: 12, width: 52, height: 20 },
        zIndex: 0,
        text: item.icon,
        as: 'span',
        fontSize: 11,
        fontWeight: 'medium',
      }),
      createHomeTextNode({
        id: `${cardId}-title`,
        parentId: cardId,
        rect: { x: 0, y: 70, width: cardWidth - 64, height: titleHeight },
        zIndex: 1,
        text: item.title,
        className: 'pricing-card-title',
        as: 'h3',
        fontWeight: 'bold',
      }),
      createHomeContainerNode({
        id: `${cardId}-price`,
        parentId: cardId,
        rect: { x: 0, y: 70 + titleHeight + 18, width: cardWidth - 64, height: priceHeight },
        zIndex: 2,
        label: `pricing price ${index + 1}`,
        className: 'pricing-card-price',
      }),
      createHomeTextNode({
        id: `${cardId}-amount`,
        parentId: `${cardId}-price`,
        rect: { x: 0, y: 0, width: 220, height: priceHeight },
        zIndex: 0,
        text: item.price,
        className: 'pricing-amount',
        as: 'span',
        fontSize: 28,
        fontWeight: 'bold',
      }),
      createHomeTextNode({
        id: `${cardId}-unit`,
        parentId: `${cardId}-price`,
        rect: { x: 236, y: 4, width: 160, height: Math.max(20, priceHeight - 4) },
        zIndex: 1,
        text: item.unit,
        className: 'pricing-unit',
        as: 'span',
        fontSize: 16,
      }),
      createHomeContainerNode({
        id: detailId,
        parentId: cardId,
        rect: { x: 0, y: 70 + titleHeight + 18 + priceHeight + 24, width: cardWidth - 64, height: detailBuild.height },
        zIndex: 3,
        label: `pricing details ${index + 1}`,
        className: 'pricing-card-details',
      }),
      ...detailBuild.nodes,
    );

    if (item.note) {
      nodes.push(
        createHomeTextNode({
          id: `${cardId}-note`,
          parentId: cardId,
          rect: { x: 0, y: 70 + titleHeight + 18 + priceHeight + 24 + detailBuild.height + 20, width: cardWidth - 64, height: noteHeight },
          zIndex: 4,
          text: item.note,
          className: 'pricing-card-note',
          as: 'p',
          fontSize: 15,
        }),
      );
    }
  });

  const disclaimerY = 56 + maxBottom + 32;
  const disclaimerHeight = estimateTextHeight(data.disclaimer, PAGE_CONTAINER_WIDTH, 16, 1.7);
  nodes.push(
    {
      ...nodes[3],
      rect: { x: 0, y: 56, width: PAGE_CONTAINER_WIDTH, height: maxBottom },
    },
    createHomeContainerNode({
      id: 'page-pricing-disclaimer-wrap',
      parentId: containerId,
      rect: { x: 0, y: disclaimerY, width: PAGE_CONTAINER_WIDTH, height: disclaimerHeight },
      zIndex: 2,
      label: 'pricing disclaimer',
      className: 'pricing-disclaimer',
    }),
    createHomeTextNode({
      id: 'page-pricing-disclaimer',
      parentId: 'page-pricing-disclaimer-wrap',
      rect: { x: 0, y: 0, width: PAGE_CONTAINER_WIDTH, height: disclaimerHeight },
      zIndex: 0,
      text: data.disclaimer,
      as: 'p',
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
      href: data.ctaHref,
      style: 'primary',
      className: 'button',
      as: 'a',
    }),
  );

  const containerHeight = disclaimerY + disclaimerHeight + 32 + 44;
  const rootHeight = SECTION_TOP + containerHeight + SECTION_BOTTOM;
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

export const PRICING_PAGE_ROOT_HEIGHT = Math.max(...locales.map((locale) => buildPricingPage(0, locale, 0).height));

export function createPricingPageDecomposedNodes(y: number, locale: Locale, zBase: number): BuilderCanvasNode[] {
  return buildPricingPage(y, locale, zBase).nodes;
}
