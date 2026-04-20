import type { BuilderCanvasNode } from './types';
import type { Locale } from '@/lib/locales';
import { faqContent } from '@/data/faq-content';
import { firmIntroductionContent } from '@/data/firm-introduction';
import type { LegalPageContent } from '@/data/legal-pages';
import { siteContent } from '@/data/site-content';
import { getAttorneyProfilePath } from '@/data/attorney-profiles';
import { teamContent, type TeamMember } from '@/data/team-members';
import {
  HOME_STAGE_WIDTH,
  createHomeButtonNode,
  createHomeContainerNode,
  createHomeImageNode,
  createHomeTextNode,
} from './decompose-home-shared';

export type DecomposedSectionBuild = {
  nodes: BuilderCanvasNode[];
  height: number;
};

export const PAGE_STAGE_WIDTH = HOME_STAGE_WIDTH;
export const PAGE_CONTAINER_X = 72;
export const PAGE_CONTAINER_WIDTH = 1136;

const SECTION_TOP = 88;
const SECTION_BOTTOM = 88;

const attorneyLabels = {
  ko: {
    intro: '소개',
    education: '학력',
    experience: '경력',
    source: '원문 페이지',
    fullProfile: '상세 프로필',
    consult: '상담 문의',
    representative: '대표 변호사',
    teamTitle: '소속 변호사 · 직원',
    partnerTitle: '협력 회계사',
  },
  'zh-hant': {
    intro: '簡介',
    education: '學歷',
    experience: '經歷',
    source: '原始頁面',
    fullProfile: '完整簡介',
    consult: '聯絡諮詢',
    representative: '代表律師',
    teamTitle: '所屬律師 · 職員',
    partnerTitle: '合作會計師',
  },
  en: {
    intro: 'Introduction',
    education: 'Education',
    experience: 'Experience',
    source: 'Source page',
    fullProfile: 'Full profile',
    consult: 'Book consultation',
    representative: 'Managing Attorney',
    teamTitle: 'Lawyers & Staff',
    partnerTitle: 'Partner CPA',
  },
} as const;

const consultationGuideCopy = {
  ko: {
    label: 'GUIDE',
    title: '상담 전 확인 사항',
    description: '문의 채널과 준비 자료를 미리 확인하면 상담 연결과 답변 정리가 더 빨라집니다.',
    cards: [
      {
        title: '가능한 상담 채널',
        items: [
          '카카오톡, LINE, 이메일, 전화로 문의를 접수할 수 있습니다.',
          '타이베이 대면 상담과 Zoom 또는 Google Meet 화상 상담이 가능합니다.',
          '한국어, 중국어, 영어 기준으로 기본 상담 흐름을 안내합니다.',
        ],
      },
      {
        title: '미리 준비하면 좋은 자료',
        items: [
          '계약서, 견적서, 공문, 이메일, 메신저 대화 등 핵심 문서',
          '회사명 또는 당사자 정보, 사건 발생일, 현재 진행 상태',
          '사진, 영상, 판결문, 신고서 등 사실관계를 보여주는 자료',
        ],
      },
      {
        title: '상담 진행 흐름',
        items: [
          '문의 접수 후 사건 유형과 긴급도를 먼저 확인합니다.',
          '필요한 경우 추가 자료를 요청하고 상담 방식을 안내합니다.',
          '예약 확정 후 변호사 또는 실무팀과 상담을 진행합니다.',
        ],
      },
    ],
  },
  'zh-hant': {
    label: 'GUIDE',
    title: '諮詢前可先確認的事項',
    description: '先整理聯絡方式與案件資料，可讓諮詢安排與後續回覆更有效率。',
    cards: [
      {
        title: '可使用的聯絡方式',
        items: [
          '可透過 KakaoTalk、LINE、電子郵件與電話提出詢問。',
          '提供台北面談，以及 Zoom 或 Google Meet 視訊諮詢。',
          '以韓文、中文、英文為主進行基本諮詢安排。',
        ],
      },
      {
        title: '建議先準備的資料',
        items: [
          '契約、報價單、公文、電子郵件與訊息紀錄等核心文件',
          '公司名稱或當事人資訊、事件發生時間、目前進度',
          '照片、影片、判決、申報文件等可佐證事實的資料',
        ],
      },
      {
        title: '諮詢流程',
        items: [
          '收到詢問後，先確認案件類型與急迫程度。',
          '如有需要，會請您補充資料並安排適合的諮詢方式。',
          '預約確認後，再由律師或實務團隊進行正式諮詢。',
        ],
      },
    ],
  },
  en: {
    label: 'GUIDE',
    title: 'Before You Contact Us',
    description: 'Preparing the right materials in advance helps us route your inquiry and structure the consultation more efficiently.',
    cards: [
      {
        title: 'Available channels',
        items: [
          'You can reach us through KakaoTalk, LINE, email, or phone.',
          'We offer in-person meetings in Taipei and video consultations via Zoom or Google Meet.',
          'Initial consultation coordination is handled in Korean, Chinese, and English.',
        ],
      },
      {
        title: 'Useful materials to prepare',
        items: [
          'Key documents such as contracts, notices, emails, invoices, or chat records',
          'Party or company details, timeline of events, and current procedural status',
          'Photos, videos, judgments, or filings that help establish the facts',
        ],
      },
      {
        title: 'Consultation flow',
        items: [
          'We first review the inquiry type and urgency.',
          'If needed, we request additional materials and suggest the right consultation format.',
          'After scheduling is confirmed, the consultation proceeds with the lawyer or practice team.',
        ],
      },
    ],
  },
} as const;

export function estimateTextHeight(
  text: string,
  width: number,
  fontSize: number,
  lineHeight = 1.5,
): number {
  const paragraphs = text.split('\n');
  const charsPerLine = Math.max(12, Math.floor(width / Math.max(fontSize * 0.54, 8)));
  const lines = paragraphs.reduce((count, paragraph) => (
    count + Math.max(1, Math.ceil(Math.max(paragraph.length, 1) / charsPerLine))
  ), 0);
  return Math.max(Math.ceil(lines * fontSize * lineHeight), Math.ceil(fontSize * lineHeight));
}

function createOrnamentDividerNodes(
  prefix: string,
  parentId: string,
  y: number,
  zBase: number,
): BuilderCanvasNode[] {
  const dividerId = `${prefix}-divider`;
  return [
    createHomeContainerNode({
      id: dividerId,
      parentId,
      rect: { x: 0, y, width: PAGE_CONTAINER_WIDTH, height: 24 },
      zIndex: zBase,
      label: `${prefix} divider`,
      className: 'ornament-divider',
    }),
    createHomeContainerNode({
      id: `${dividerId}-ornament`,
      parentId: dividerId,
      rect: { x: 508, y: 6, width: 120, height: 12 },
      zIndex: zBase + 1,
      label: `${prefix} ornament`,
      className: 'ornament',
    }),
  ];
}

function createParagraphStackNodes({
  prefix,
  parentId,
  x,
  y,
  width,
  items,
  zBase,
  fontSize = 17,
  lineHeight = 1.8,
  gap = 18,
  className,
}: {
  prefix: string;
  parentId: string;
  x: number;
  y: number;
  width: number;
  items: string[];
  zBase: number;
  fontSize?: number;
  lineHeight?: number;
  gap?: number;
  className?: string;
}): DecomposedSectionBuild {
  const nodes: BuilderCanvasNode[] = [];
  let cursor = y;
  items.forEach((item, index) => {
    const height = estimateTextHeight(item, width, fontSize, lineHeight);
    nodes.push(
      createHomeTextNode({
        id: `${prefix}-paragraph-${index}`,
        parentId,
        rect: { x, y: cursor, width, height },
        zIndex: zBase + index,
        text: item,
        ...(className ? { className } : {}),
        as: 'p',
        fontSize,
      }),
    );
    cursor += height + gap;
  });
  return { nodes, height: Math.max(0, cursor - y - (items.length > 0 ? gap : 0)) };
}

function createBulletListNodes({
  prefix,
  parentId,
  x,
  y,
  width,
  items,
  zBase,
  className,
  fontSize = 16,
  gap = 8,
}: {
  prefix: string;
  parentId: string;
  x: number;
  y: number;
  width: number;
  items: string[];
  zBase: number;
  className?: string;
  fontSize?: number;
  gap?: number;
}): DecomposedSectionBuild {
  const heights = items.map((item) => estimateTextHeight(`• ${item}`, width, fontSize, 1.65));
  const totalHeight = heights.reduce((sum, height) => sum + height, 0) + Math.max(0, items.length - 1) * gap;
  const listId = `${prefix}-list`;
  const nodes: BuilderCanvasNode[] = [
    createHomeContainerNode({
      id: listId,
      parentId,
      rect: { x, y, width, height: totalHeight },
      zIndex: zBase,
      label: `${prefix} list`,
      ...(className ? { className } : {}),
    }),
  ];
  let cursor = 0;
  items.forEach((item, index) => {
    const height = heights[index];
    nodes.push(
      createHomeTextNode({
        id: `${prefix}-item-${index}`,
        parentId: listId,
        rect: { x: 0, y: cursor, width, height },
        zIndex: index,
        text: `• ${item}`,
        as: 'p',
        fontSize,
      }),
    );
    cursor += height + gap;
  });
  return { nodes, height: totalHeight };
}

export function createPageHeaderSectionNodes({
  prefix,
  y,
  locale,
  label,
  title,
  description,
  effectiveDateLabel,
  effectiveDate,
  zBase,
}: {
  prefix: string;
  y: number;
  locale: Locale;
  label: string;
  title: string;
  description?: string;
  effectiveDateLabel?: string;
  effectiveDate?: string;
  zBase: number;
}): DecomposedSectionBuild {
  const rootId = `${prefix}-page-header-root`;
  const containerId = `${prefix}-page-header-container`;
  const breadcrumbId = `${prefix}-breadcrumb`;
  const homeLabel = locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : 'Home';
  const titleHeight = estimateTextHeight(title, 960, 56, 1.05);
  const descriptionHeight = description ? estimateTextHeight(description, 760, 20, 1.7) : 0;
  let cursor = 0;
  const nodes: BuilderCanvasNode[] = [];

  nodes.push(
    createHomeContainerNode({
      id: rootId,
      rect: { x: 0, y, width: PAGE_STAGE_WIDTH, height: 320 },
      zIndex: zBase,
      label: `${prefix} page header root`,
      className: 'section page-header',
      as: 'section',
    }),
    createHomeContainerNode({
      id: containerId,
      parentId: rootId,
      rect: { x: PAGE_CONTAINER_X, y: SECTION_TOP, width: PAGE_CONTAINER_WIDTH, height: 200 },
      zIndex: 0,
      label: `${prefix} page header container`,
      className: 'container',
    }),
    createHomeContainerNode({
      id: breadcrumbId,
      parentId: containerId,
      rect: { x: 0, y: cursor, width: 520, height: 20 },
      zIndex: 0,
      label: `${prefix} breadcrumb`,
      className: 'breadcrumb',
      as: 'nav',
    }),
    createHomeButtonNode({
      id: `${breadcrumbId}-home`,
      parentId: breadcrumbId,
      rect: { x: 0, y: 0, width: 72, height: 20 },
      zIndex: 0,
      label: homeLabel,
      href: `/${locale}`,
      style: 'link',
      className: 'breadcrumb-link',
      as: 'a',
    }),
    createHomeTextNode({
      id: `${breadcrumbId}-slash`,
      parentId: breadcrumbId,
      rect: { x: 84, y: 0, width: 16, height: 20 },
      zIndex: 1,
      text: '/',
      as: 'span',
      fontSize: 14,
    }),
    createHomeTextNode({
      id: `${breadcrumbId}-current`,
      parentId: breadcrumbId,
      rect: { x: 108, y: 0, width: 380, height: 20 },
      zIndex: 2,
      text: title,
      className: 'breadcrumb-current',
      as: 'span',
      fontSize: 14,
    }),
  );
  cursor += 44;

  nodes.push(
    createHomeTextNode({
      id: `${prefix}-page-header-label`,
      parentId: containerId,
      rect: { x: 0, y: cursor, width: 220, height: 28 },
      zIndex: 3,
      text: label,
      className: 'section-label',
      as: 'div',
      fontWeight: 'medium',
    }),
  );
  cursor += 40;

  nodes.push(
    createHomeTextNode({
      id: `${prefix}-page-header-title`,
      parentId: containerId,
      rect: { x: 0, y: cursor, width: 960, height: titleHeight },
      zIndex: 4,
      text: title,
      className: 'hero-title page-header-title',
      as: 'h1',
      fontWeight: 'bold',
    }),
  );
  cursor += titleHeight + 20;

  if (description) {
    nodes.push(
      createHomeTextNode({
        id: `${prefix}-page-header-description`,
        parentId: containerId,
        rect: { x: 0, y: cursor, width: 760, height: descriptionHeight },
        zIndex: 5,
        text: description,
        className: 'section-lede',
        as: 'p',
        fontSize: 20,
      }),
    );
    cursor += descriptionHeight + 12;
  }

  if (effectiveDateLabel && effectiveDate) {
    nodes.push(
      createHomeTextNode({
        id: `${prefix}-page-header-effective`,
        parentId: containerId,
        rect: { x: 0, y: cursor, width: 420, height: 24 },
        zIndex: 6,
        text: `${effectiveDateLabel}: ${effectiveDate}`,
        className: 'legal-effective-date',
        as: 'p',
      }),
    );
    cursor += 36;
  }

  nodes.push(...createOrnamentDividerNodes(`${prefix}-page-header`, containerId, cursor, 7));
  cursor += 24;

  const containerHeight = cursor;
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

export function createFirmIntroductionSectionNodes(
  prefix: string,
  y: number,
  locale: Locale,
  zBase: number,
): DecomposedSectionBuild {
  const content = firmIntroductionContent[locale];
  const rootId = `${prefix}-firm-intro-root`;
  const containerId = `${prefix}-firm-intro-container`;
  const articleId = `${prefix}-firm-intro-card`;
  const bodyId = `${prefix}-firm-intro-body`;
  const paragraphBuild = createParagraphStackNodes({
    prefix: `${prefix}-firm-intro`,
    parentId: bodyId,
    x: 0,
    y: 0,
    width: 1032,
    items: content.paragraphs,
    zBase: 0,
    fontSize: 17,
    lineHeight: 1.85,
    gap: 18,
  });

  const titleHeight = estimateTextHeight(content.title, 980, 38, 1.15);
  const subtitleHeight = estimateTextHeight(content.subtitle, 980, 20, 1.6);
  const sourceHeight = 28;
  const articleHeight = 80 + 48 + titleHeight + 18 + subtitleHeight + 26 + paragraphBuild.height + 28 + sourceHeight + 36;
  const rootHeight = SECTION_TOP + 28 + articleHeight + SECTION_BOTTOM;

  const nodes: BuilderCanvasNode[] = [
    createHomeContainerNode({
      id: rootId,
      rect: { x: 0, y, width: PAGE_STAGE_WIDTH, height: rootHeight },
      zIndex: zBase,
      label: `${prefix} firm intro root`,
      className: 'section section--light firm-intro-section',
      as: 'section',
      dataTone: 'light',
    }),
    createHomeContainerNode({
      id: containerId,
      parentId: rootId,
      rect: { x: PAGE_CONTAINER_X, y: SECTION_TOP, width: PAGE_CONTAINER_WIDTH, height: rootHeight - SECTION_TOP - SECTION_BOTTOM },
      zIndex: 0,
      label: `${prefix} firm intro container`,
      className: 'container',
    }),
    createHomeTextNode({
      id: `${prefix}-firm-intro-label`,
      parentId: containerId,
      rect: { x: 0, y: 0, width: 220, height: 28 },
      zIndex: 0,
      text: content.sectionLabel,
      className: 'section-label',
      as: 'div',
      fontWeight: 'medium',
    }),
    createHomeContainerNode({
      id: articleId,
      parentId: containerId,
      rect: { x: 0, y: 44, width: PAGE_CONTAINER_WIDTH, height: articleHeight },
      zIndex: 1,
      label: `${prefix} firm intro card`,
      className: 'firm-intro-card',
      as: 'article',
    }),
    createHomeContainerNode({
      id: `${prefix}-firm-intro-logo-wrap`,
      parentId: articleId,
      rect: { x: 262, y: 0, width: 508, height: 80 },
      zIndex: 0,
      label: `${prefix} firm intro logo wrap`,
      className: 'firm-intro-logo-wrap',
    }),
    createHomeContainerNode({
      id: `${prefix}-firm-intro-logo-holder`,
      parentId: `${prefix}-firm-intro-logo-wrap`,
      rect: { x: 0, y: 0, width: 508, height: 80 },
      zIndex: 0,
      label: `${prefix} firm intro logo`,
      className: 'firm-intro-logo',
    }),
    createHomeImageNode({
      id: `${prefix}-firm-intro-logo-image`,
      parentId: `${prefix}-firm-intro-logo-holder`,
      rect: { x: 0, y: 0, width: 508, height: 80 },
      zIndex: 0,
      src: content.logo,
      alt: content.logoAlt,
      fit: 'contain',
    }),
    createHomeTextNode({
      id: `${prefix}-firm-intro-title`,
      parentId: articleId,
      rect: { x: 0, y: 120, width: 980, height: titleHeight },
      zIndex: 1,
      text: content.title,
      className: 'firm-intro-title',
      as: 'h2',
      fontWeight: 'bold',
    }),
    createHomeTextNode({
      id: `${prefix}-firm-intro-subtitle`,
      parentId: articleId,
      rect: { x: 0, y: 120 + titleHeight + 18, width: 980, height: subtitleHeight },
      zIndex: 2,
      text: content.subtitle,
      className: 'firm-intro-subtitle',
      as: 'p',
      fontSize: 20,
    }),
    createHomeContainerNode({
      id: bodyId,
      parentId: articleId,
      rect: { x: 0, y: 120 + titleHeight + 18 + subtitleHeight + 26, width: 1032, height: paragraphBuild.height },
      zIndex: 3,
      label: `${prefix} firm intro body`,
      className: 'firm-intro-body',
    }),
    ...paragraphBuild.nodes,
    createHomeContainerNode({
      id: `${prefix}-firm-intro-source`,
      parentId: articleId,
      rect: { x: 0, y: 120 + titleHeight + 18 + subtitleHeight + 26 + paragraphBuild.height + 28, width: 420, height: sourceHeight },
      zIndex: 4,
      label: `${prefix} firm intro source`,
      className: 'firm-intro-source',
    }),
    createHomeButtonNode({
      id: `${prefix}-firm-intro-source-link`,
      parentId: `${prefix}-firm-intro-source`,
      rect: { x: 0, y: 0, width: 320, height: sourceHeight },
      zIndex: 0,
      label: content.sourceLabel,
      href: content.sourceUrl,
      style: 'link',
      as: 'a',
      target: '_blank',
      rel: 'noopener noreferrer',
    }),
  ];

  return { nodes, height: rootHeight };
}

function buildMemberCardNodes({
  prefix,
  parentId,
  x,
  y,
  width,
  member,
  locale,
  size,
  zBase,
}: {
  prefix: string;
  parentId: string;
  x: number;
  y: number;
  width: number;
  member: TeamMember;
  locale: Locale;
  size: 'large' | 'small';
  zBase: number;
}): DecomposedSectionBuild {
  const copy = attorneyLabels[locale];
  const photoHeight = size === 'large' ? 420 : 220;
  const photoWidth = size === 'large' ? 332 : width;
  const infoX = size === 'large' ? 372 : 0;
  const infoY = size === 'large' ? 0 : photoHeight + 28;
  const infoWidth = size === 'large' ? width - infoX : width;
  const nameHeight = estimateTextHeight(member.name, infoWidth, size === 'large' ? 34 : 28, 1.15);
  const roleHeight = estimateTextHeight(member.role, infoWidth, 18, 1.4);
  const introList = createBulletListNodes({
    prefix: `${prefix}-intro`,
    parentId: `${prefix}-info`,
    x: 0,
    y: 0,
    width: infoWidth,
    items: member.intro,
    zBase: 0,
    className: 'attorney-list',
    fontSize: 16,
  });
  const educationList = createBulletListNodes({
    prefix: `${prefix}-education`,
    parentId: `${prefix}-info`,
    x: 0,
    y: 0,
    width: infoWidth,
    items: member.education,
    zBase: 0,
    className: 'attorney-list',
    fontSize: 16,
  });
  const experienceList = createBulletListNodes({
    prefix: `${prefix}-experience`,
    parentId: `${prefix}-info`,
    x: 0,
    y: 0,
    width: infoWidth,
    items: member.experience,
    zBase: 0,
    className: 'attorney-list',
    fontSize: 16,
  });

  let infoCursor = 0;
  const nodes: BuilderCanvasNode[] = [
    createHomeContainerNode({
      id: prefix,
      parentId,
      rect: { x, y, width, height: 520 },
      zIndex: zBase,
      label: `${prefix} card`,
      className: `attorney-card ${size === 'large' ? 'attorney-card--lead' : 'attorney-card--sub'}`,
      as: 'article',
      htmlId: member.id,
    }),
    createHomeContainerNode({
      id: `${prefix}-photo`,
      parentId: prefix,
      rect: { x: 0, y: 0, width: photoWidth, height: photoHeight },
      zIndex: 0,
      label: `${prefix} photo`,
      className: `attorney-card-photo ${size === 'large' ? 'attorney-card-photo--lead' : 'attorney-card-photo--sub'}`,
    }),
    createHomeImageNode({
      id: `${prefix}-photo-image`,
      parentId: `${prefix}-photo`,
      rect: { x: 0, y: 0, width: photoWidth, height: photoHeight },
      zIndex: 0,
      src: member.photo,
      alt: `${member.name} ${member.role}`,
      fit: 'cover',
    }),
    createHomeContainerNode({
      id: `${prefix}-info`,
      parentId: prefix,
      rect: { x: infoX, y: infoY, width: infoWidth, height: 420 },
      zIndex: 1,
      label: `${prefix} info`,
      className: 'attorney-card-info',
    }),
  ];

  const profileHref = member.profileSlug ? getAttorneyProfilePath(locale, member.profileSlug) : null;
  if (profileHref) {
    nodes.push(
      createHomeButtonNode({
        id: `${prefix}-name-link`,
        parentId: `${prefix}-info`,
        rect: { x: 0, y: infoCursor, width: infoWidth, height: nameHeight },
        zIndex: 0,
        label: member.name,
        href: profileHref,
        style: 'link',
        className: `attorney-card-name ${size === 'large' ? 'attorney-card-name--lead' : ''} attorney-card-name-link`,
        as: 'a',
      }),
    );
  } else {
    nodes.push(
      createHomeTextNode({
        id: `${prefix}-name`,
        parentId: `${prefix}-info`,
        rect: { x: 0, y: infoCursor, width: infoWidth, height: nameHeight },
        zIndex: 0,
        text: member.name,
        className: `attorney-card-name ${size === 'large' ? 'attorney-card-name--lead' : ''}`,
        as: 'h3',
        fontWeight: 'bold',
      }),
    );
  }
  infoCursor += nameHeight + 10;

  nodes.push(
    createHomeTextNode({
      id: `${prefix}-role`,
      parentId: `${prefix}-info`,
      rect: { x: 0, y: infoCursor, width: infoWidth, height: roleHeight },
      zIndex: 1,
      text: member.role,
      className: 'attorney-card-role',
      as: 'p',
      fontSize: 18,
    }),
    createHomeButtonNode({
      id: `${prefix}-email`,
      parentId: `${prefix}-info`,
      rect: { x: 0, y: infoCursor + roleHeight + 8, width: infoWidth, height: 22 },
      zIndex: 2,
      label: member.email,
      href: `mailto:${member.email}`,
      style: 'link',
      className: 'attorney-card-email',
      as: 'a',
    }),
  );
  infoCursor += roleHeight + 42;

  const sectionDefs = [
    { key: 'intro', title: copy.intro, list: introList },
    { key: 'education', title: copy.education, list: educationList },
    { key: 'experience', title: copy.experience, list: experienceList },
  ] as const;

  sectionDefs.forEach((section, index) => {
    const sectionId = `${prefix}-${section.key}-section`;
    const listRootId = section.list.nodes[0]?.id ?? `${prefix}-${section.key}-list`;
    nodes.push(
      createHomeContainerNode({
        id: sectionId,
        parentId: `${prefix}-info`,
        rect: { x: 0, y: infoCursor, width: infoWidth, height: section.list.height + 28 },
        zIndex: 3 + index * 3,
        label: `${prefix} ${section.key} section`,
        className: 'attorney-card-section',
      }),
      createHomeTextNode({
        id: `${prefix}-${section.key}-label`,
        parentId: sectionId,
        rect: { x: 0, y: 0, width: infoWidth, height: 20 },
        zIndex: 0,
        text: section.title,
        className: 'attorney-card-label',
        as: 'div',
        fontWeight: 'medium',
      }),
      {
        ...section.list.nodes[0],
        parentId: sectionId,
        rect: { x: 0, y: 28, width: infoWidth, height: section.list.height },
      },
      ...section.list.nodes.slice(1).map((node) => ({
        ...node,
        parentId: listRootId,
      })),
    );
    infoCursor += section.list.height + 48;
  });

  nodes.push(
    createHomeTextNode({
      id: `${prefix}-source`,
      parentId: `${prefix}-info`,
      rect: { x: 0, y: infoCursor, width: infoWidth, height: estimateTextHeight(`${copy.source}: ${member.sourceUrl}`, infoWidth, 14, 1.6) },
      zIndex: 20,
      text: `${copy.source}: ${member.sourceUrl}`,
      className: 'attorney-card-source',
      as: 'p',
      fontSize: 14,
    }),
  );
  infoCursor += estimateTextHeight(`${copy.source}: ${member.sourceUrl}`, infoWidth, 14, 1.6) + 20;

  nodes.push(
    createHomeContainerNode({
      id: `${prefix}-actions`,
      parentId: `${prefix}-info`,
      rect: { x: 0, y: infoCursor, width: infoWidth, height: 44 },
      zIndex: 21,
      label: `${prefix} actions`,
      className: 'attorney-card-actions',
    }),
  );
  let actionX = 0;
  if (profileHref) {
    nodes.push(
      createHomeButtonNode({
        id: `${prefix}-profile-button`,
        parentId: `${prefix}-actions`,
        rect: { x: actionX, y: 0, width: 150, height: 40 },
        zIndex: 0,
        label: copy.fullProfile,
        href: profileHref,
        style: 'outline',
        className: 'button button--outline attorney-card-cta',
        as: 'a',
      }),
    );
    actionX += 166;
  }
  nodes.push(
    createHomeButtonNode({
      id: `${prefix}-consult-button`,
      parentId: `${prefix}-actions`,
      rect: { x: actionX, y: 0, width: 150, height: 40 },
      zIndex: 1,
      label: copy.consult,
      href: `/${locale}/contact`,
      style: 'outline',
      className: 'button button--outline attorney-card-cta',
      as: 'a',
    }),
  );
  infoCursor += 56;

  const cardHeight = Math.max(photoHeight, infoY + infoCursor);
  nodes[0] = {
    ...nodes[0],
    rect: { x, y, width, height: cardHeight },
  };
  nodes[3] = {
    ...nodes[3],
    rect: { x: infoX, y: infoY, width: infoWidth, height: infoCursor },
  };

  return { nodes, height: cardHeight };
}

export function createAttorneyProfileSectionNodes(
  prefix: string,
  y: number,
  locale: Locale,
  zBase: number,
): DecomposedSectionBuild {
  const team = teamContent[locale];
  const copy = attorneyLabels[locale];
  const rootId = `${prefix}-attorney-root`;
  const containerId = `${prefix}-attorney-container`;
  const lead = team.members.find((member) => member.id === 'tseng-junwei') ?? null;
  const staff = team.members.filter((member) => member.id !== 'tseng-junwei' && member.id !== 'huang-shengping');
  const accountant = team.members.find((member) => member.id === 'huang-shengping') ?? null;
  const titleHeight = estimateTextHeight(team.title, 760, 40, 1.15);
  const descriptionHeight = estimateTextHeight(team.description, 760, 20, 1.7);
  const nodes: BuilderCanvasNode[] = [
    createHomeContainerNode({
      id: rootId,
      rect: { x: 0, y, width: PAGE_STAGE_WIDTH, height: 1200 },
      zIndex: zBase,
      label: `${prefix} attorney root`,
      className: 'section section--light',
      as: 'section',
      dataTone: 'light',
    }),
    createHomeContainerNode({
      id: containerId,
      parentId: rootId,
      rect: { x: PAGE_CONTAINER_X, y: SECTION_TOP, width: PAGE_CONTAINER_WIDTH, height: 1024 },
      zIndex: 0,
      label: `${prefix} attorney container`,
      className: 'container',
    }),
    createHomeTextNode({
      id: `${prefix}-attorney-label`,
      parentId: containerId,
      rect: { x: 0, y: 0, width: 260, height: 28 },
      zIndex: 0,
      text: team.label,
      className: 'section-label',
      as: 'div',
      fontWeight: 'medium',
    }),
    createHomeTextNode({
      id: `${prefix}-attorney-title`,
      parentId: containerId,
      rect: { x: 0, y: 42, width: 760, height: titleHeight },
      zIndex: 1,
      text: team.title,
      className: 'section-title',
      as: 'h2',
      fontWeight: 'bold',
    }),
    createHomeTextNode({
      id: `${prefix}-attorney-description`,
      parentId: containerId,
      rect: { x: 0, y: 42 + titleHeight + 18, width: 760, height: descriptionHeight },
      zIndex: 2,
      text: team.description,
      className: 'section-lede',
      as: 'p',
      fontSize: 20,
    }),
  ];

  let cursor = 42 + titleHeight + 18 + descriptionHeight + 42;

  if (lead) {
    const leadWrapId = `${prefix}-lead-wrap`;
    const leadBuild = buildMemberCardNodes({
      prefix: `${prefix}-lead-card`,
      parentId: leadWrapId,
      x: 0,
      y: 48,
      width: PAGE_CONTAINER_WIDTH,
      member: lead,
      locale,
      size: 'large',
      zBase: 0,
    });
    nodes.push(
      createHomeContainerNode({
        id: leadWrapId,
        parentId: containerId,
        rect: { x: 0, y: cursor, width: PAGE_CONTAINER_WIDTH, height: 48 + leadBuild.height },
        zIndex: 3,
        label: `${prefix} lead wrap`,
        className: 'attorney-lead-wrap',
      }),
      createHomeContainerNode({
        id: `${leadWrapId}-title`,
        parentId: leadWrapId,
        rect: { x: 0, y: 0, width: 220, height: 32 },
        zIndex: 0,
        label: `${prefix} lead title`,
        className: 'attorney-group-title',
      }),
      createHomeTextNode({
        id: `${leadWrapId}-badge`,
        parentId: `${leadWrapId}-title`,
        rect: { x: 0, y: 0, width: 160, height: 28 },
        zIndex: 0,
        text: copy.representative,
        className: 'attorney-group-badge',
        as: 'span',
        fontWeight: 'medium',
      }),
      ...leadBuild.nodes,
    );
    cursor += 48 + leadBuild.height + 56;
  }

  if (staff.length > 0) {
    const staffWrapId = `${prefix}-staff-wrap`;
    const gridId = `${prefix}-staff-grid`;
    const columnWidth = 548;
    const gap = 40;
    const rows: Array<Array<{ member: TeamMember; build: DecomposedSectionBuild }>> = [];
    for (let index = 0; index < staff.length; index += 2) {
      const chunk = staff.slice(index, index + 2).map((member, chunkIndex) => ({
        member,
        build: buildMemberCardNodes({
          prefix: `${prefix}-staff-card-${index + chunkIndex}`,
          parentId: gridId,
          x: 0,
          y: 0,
          width: columnWidth,
          member,
          locale,
          size: 'small',
          zBase: index + chunkIndex,
        }),
      }));
      rows.push(chunk);
    }
    let rowCursor = 0;
    const gridNodes: BuilderCanvasNode[] = [];
    rows.forEach((row, rowIndex) => {
      const rowHeight = Math.max(...row.map((entry) => entry.build.height));
      row.forEach((entry, columnIndex) => {
        entry.build.nodes.forEach((node, nodeIndex) => {
          gridNodes.push({
            ...node,
            rect: {
              ...node.rect,
              x: node.rect.x + columnIndex * (columnWidth + gap),
              y: node.rect.y + rowCursor,
            },
            zIndex: rowIndex * 20 + nodeIndex,
          });
        });
      });
      rowCursor += rowHeight + 32;
    });
    const gridHeight = Math.max(0, rowCursor - 32);
    nodes.push(
      createHomeContainerNode({
        id: staffWrapId,
        parentId: containerId,
        rect: { x: 0, y: cursor, width: PAGE_CONTAINER_WIDTH, height: 40 + gridHeight },
        zIndex: 10,
        label: `${prefix} staff wrap`,
        className: 'attorney-staff-wrap',
      }),
      createHomeTextNode({
        id: `${staffWrapId}-title`,
        parentId: staffWrapId,
        rect: { x: 0, y: 0, width: 320, height: 28 },
        zIndex: 0,
        text: copy.teamTitle,
        className: 'attorney-group-title',
        as: 'h3',
        fontWeight: 'medium',
      }),
      createHomeContainerNode({
        id: gridId,
        parentId: staffWrapId,
        rect: { x: 0, y: 40, width: PAGE_CONTAINER_WIDTH, height: gridHeight },
        zIndex: 1,
        label: `${prefix} staff grid`,
        className: 'attorney-staff-grid',
      }),
      ...gridNodes,
    );
    cursor += 40 + gridHeight + 56;
  }

  if (accountant) {
    const partnerWrapId = `${prefix}-partner-wrap`;
    const partnerBuild = buildMemberCardNodes({
      prefix: `${prefix}-partner-card`,
      parentId: partnerWrapId,
      x: 0,
      y: 40,
      width: 548,
      member: accountant,
      locale,
      size: 'small',
      zBase: 0,
    });
    nodes.push(
      createHomeContainerNode({
        id: partnerWrapId,
        parentId: containerId,
        rect: { x: 0, y: cursor, width: PAGE_CONTAINER_WIDTH, height: 40 + partnerBuild.height },
        zIndex: 20,
        label: `${prefix} partner wrap`,
        className: 'attorney-partner-wrap',
      }),
      createHomeTextNode({
        id: `${partnerWrapId}-title`,
        parentId: partnerWrapId,
        rect: { x: 0, y: 0, width: 320, height: 28 },
        zIndex: 0,
        text: copy.partnerTitle,
        className: 'attorney-group-title',
        as: 'h3',
        fontWeight: 'medium',
      }),
      ...partnerBuild.nodes,
    );
    cursor += 40 + partnerBuild.height;
  }

  const containerHeight = cursor;
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

function createInfoGridBlocks({
  prefix,
  parentId,
  y,
  blocks,
  zBase,
}: {
  prefix: string;
  parentId: string;
  y: number;
  blocks: Array<{ title: string; details: string[] }>;
  zBase: number;
}): DecomposedSectionBuild {
  const columns = blocks.length >= 3 ? 3 : Math.max(blocks.length, 1);
  const gap = 24;
  const cardWidth = Math.floor((PAGE_CONTAINER_WIDTH - gap * (columns - 1)) / columns);
  const cardBuilds = blocks.map((block, index) => {
    const list = createBulletListNodes({
      prefix: `${prefix}-block-${index}`,
      parentId: `${prefix}-card-${index}`,
      x: 0,
      y: 0,
      width: cardWidth - 48,
      items: block.details,
      zBase: 0,
      className: 'contact-list',
      fontSize: 15,
      gap: 10,
    });
    const titleHeight = estimateTextHeight(block.title, cardWidth - 48, 24, 1.2);
    const cardHeight = 32 + titleHeight + 18 + list.height + 32;
    const columnIndex = index % columns;
    const rowIndex = Math.floor(index / columns);
    return {
      block,
      list,
      cardWidth,
      cardHeight,
      x: columnIndex * (cardWidth + gap),
      rowIndex,
    };
  });

  const rowHeights = new Map<number, number>();
  cardBuilds.forEach((build) => {
    rowHeights.set(build.rowIndex, Math.max(rowHeights.get(build.rowIndex) ?? 0, build.cardHeight));
  });

  let rowCursor = 0;
  const rowOffsets = new Map<number, number>();
  [...rowHeights.entries()]
    .sort((left, right) => left[0] - right[0])
    .forEach(([rowIndex, height]) => {
      rowOffsets.set(rowIndex, rowCursor);
      rowCursor += height + 24;
    });

  const gridHeight = Math.max(0, rowCursor - 24);
  const gridId = `${prefix}-grid`;
  const nodes: BuilderCanvasNode[] = [
    createHomeContainerNode({
      id: gridId,
      parentId,
      rect: { x: 0, y, width: PAGE_CONTAINER_WIDTH, height: gridHeight },
      zIndex: zBase,
      label: `${prefix} grid`,
      className: 'grid-bento contact-grid reveal-stagger',
    }),
  ];

  cardBuilds.forEach((build, index) => {
    const cardId = `${prefix}-card-${index}`;
    const listId = `${prefix}-block-${index}-list`;
    const cardY = rowOffsets.get(build.rowIndex) ?? 0;
    nodes.push(
      createHomeContainerNode({
        id: cardId,
        parentId: gridId,
        rect: { x: build.x, y: cardY, width: build.cardWidth, height: build.cardHeight },
        zIndex: index,
        label: `${prefix} card ${index + 1}`,
        className: 'card',
      }),
      createHomeTextNode({
        id: `${cardId}-title`,
        parentId: cardId,
        rect: { x: 0, y: 0, width: build.cardWidth - 48, height: estimateTextHeight(build.block.title, build.cardWidth - 48, 24, 1.2) },
        zIndex: 0,
        text: build.block.title,
        className: 'card-title',
        as: 'h3',
        fontWeight: 'bold',
      }),
      {
        ...build.list.nodes[0],
        parentId: cardId,
        rect: { x: 0, y: 32 + estimateTextHeight(build.block.title, build.cardWidth - 48, 24, 1.2) + 18, width: build.cardWidth - 48, height: build.list.height },
        zIndex: 1,
      },
      ...build.list.nodes.slice(1).map((node) => ({
        ...node,
        parentId: listId,
      })),
    );
  });

  return { nodes, height: gridHeight };
}

export function createContactBlocksSectionNodes(
  prefix: string,
  y: number,
  locale: Locale,
  zBase: number,
  showMainHeader = true,
): DecomposedSectionBuild {
  const { contact } = siteContent[locale];
  const rootId = `${prefix}-contact-root`;
  const containerId = `${prefix}-contact-container`;
  const nodes: BuilderCanvasNode[] = [
    createHomeContainerNode({
      id: rootId,
      rect: { x: 0, y, width: PAGE_STAGE_WIDTH, height: 1200 },
      zIndex: zBase,
      label: `${prefix} contact root`,
      className: 'section',
      as: 'section',
    }),
    createHomeContainerNode({
      id: containerId,
      parentId: rootId,
      rect: { x: PAGE_CONTAINER_X, y: SECTION_TOP, width: PAGE_CONTAINER_WIDTH, height: 960 },
      zIndex: 0,
      label: `${prefix} contact container`,
      className: 'container',
    }),
  ];

  let cursor = 0;
  if (showMainHeader) {
    const titleHeight = estimateTextHeight(contact.title, 760, 40, 1.15);
    const descriptionHeight = estimateTextHeight(contact.description, 760, 20, 1.7);
    nodes.push(
      createHomeTextNode({
        id: `${prefix}-contact-label`,
        parentId: containerId,
        rect: { x: 0, y: cursor, width: 220, height: 28 },
        zIndex: 0,
        text: contact.label,
        className: 'section-label',
        as: 'div',
        fontWeight: 'medium',
      }),
      createHomeTextNode({
        id: `${prefix}-contact-title`,
        parentId: containerId,
        rect: { x: 0, y: cursor + 42, width: 760, height: titleHeight },
        zIndex: 1,
        text: contact.title,
        className: 'section-title',
        as: 'h2',
        fontWeight: 'bold',
      }),
      createHomeTextNode({
        id: `${prefix}-contact-description`,
        parentId: containerId,
        rect: { x: 0, y: cursor + 42 + titleHeight + 18, width: 760, height: descriptionHeight },
        zIndex: 2,
        text: contact.description,
        className: 'section-lede',
        as: 'p',
        fontSize: 20,
      }),
      ...createOrnamentDividerNodes(`${prefix}-contact`, containerId, cursor + 42 + titleHeight + 18 + descriptionHeight + 18, 3),
    );
    cursor += 42 + titleHeight + 18 + descriptionHeight + 18 + 24 + 32;
  }

  nodes.push(
    createHomeTextNode({
      id: `${prefix}-inquiries-label`,
      parentId: containerId,
      rect: { x: 0, y: cursor, width: 220, height: 28 },
      zIndex: 10,
      text: contact.inquiriesLabel,
      className: 'section-label',
      as: 'div',
      fontWeight: 'medium',
    }),
  );
  cursor += 44;

  const inquiriesGrid = createInfoGridBlocks({
    prefix: `${prefix}-inquiries`,
    parentId: containerId,
    y: cursor,
    blocks: contact.inquiries,
    zBase: 11,
  });
  nodes.push(...inquiriesGrid.nodes);
  cursor += inquiriesGrid.height + 44;

  nodes.push(
    createHomeTextNode({
      id: `${prefix}-locations-label`,
      parentId: containerId,
      rect: { x: 0, y: cursor, width: 260, height: 28 },
      zIndex: 20,
      text: contact.locationsLabel,
      className: 'section-label contact-label-spaced',
      as: 'div',
      fontWeight: 'medium',
    }),
  );
  cursor += 44;

  const locationsGrid = createInfoGridBlocks({
    prefix: `${prefix}-locations`,
    parentId: containerId,
    y: cursor,
    blocks: contact.locations,
    zBase: 21,
  });
  nodes.push(...locationsGrid.nodes);
  cursor += locationsGrid.height + 40;

  nodes.push(
    createHomeButtonNode({
      id: `${prefix}-contact-cta`,
      parentId: containerId,
      rect: { x: 0, y: cursor, width: 180, height: 44 },
      zIndex: 30,
      label: contact.cta.label,
      href: contact.cta.href,
      style: 'secondary',
      className: 'button secondary',
      as: 'a',
    }),
  );
  cursor += 44;

  const containerHeight = cursor;
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

export function createConsultationGuideSectionNodes(
  prefix: string,
  y: number,
  locale: Locale,
  zBase: number,
): DecomposedSectionBuild {
  const content = consultationGuideCopy[locale];
  const rootId = `${prefix}-guide-root`;
  const containerId = `${prefix}-guide-container`;
  const titleHeight = estimateTextHeight(content.title, 760, 40, 1.15);
  const descriptionHeight = estimateTextHeight(content.description, 760, 20, 1.7);
  const cardGap = 24;
  const cardWidth = Math.floor((PAGE_CONTAINER_WIDTH - cardGap * 2) / 3);
  const cardBuilds = content.cards.map((card, index) => {
    const list = createBulletListNodes({
      prefix: `${prefix}-card-${index}`,
      parentId: `${prefix}-guide-card-${index}`,
      x: 0,
      y: 0,
      width: cardWidth - 48,
      items: [...card.items],
      zBase: 0,
      className: 'contact-list legal-card-list',
      fontSize: 16,
      gap: 10,
    });
    const cardTitleHeight = estimateTextHeight(card.title, cardWidth - 48, 24, 1.2);
    return {
      card,
      list,
      cardHeight: 32 + cardTitleHeight + 18 + list.height + 32,
      cardTitleHeight,
    };
  });
  const cardHeight = Math.max(...cardBuilds.map((build) => build.cardHeight));
  const gridHeight = cardHeight;
  const nodes: BuilderCanvasNode[] = [
    createHomeContainerNode({
      id: rootId,
      rect: { x: 0, y, width: PAGE_STAGE_WIDTH, height: 1400 },
      zIndex: zBase,
      label: `${prefix} guide root`,
      className: 'section section--gray consultation-guide-section',
      as: 'section',
      dataTone: 'light',
    }),
    createHomeContainerNode({
      id: containerId,
      parentId: rootId,
      rect: { x: PAGE_CONTAINER_X, y: SECTION_TOP, width: PAGE_CONTAINER_WIDTH, height: 1160 },
      zIndex: 0,
      label: `${prefix} guide container`,
      className: 'container',
    }),
    createHomeTextNode({
      id: `${prefix}-guide-label`,
      parentId: containerId,
      rect: { x: 0, y: 0, width: 180, height: 28 },
      zIndex: 0,
      text: content.label,
      className: 'section-label',
      as: 'div',
      fontWeight: 'medium',
    }),
    createHomeTextNode({
      id: `${prefix}-guide-title`,
      parentId: containerId,
      rect: { x: 0, y: 42, width: 760, height: titleHeight },
      zIndex: 1,
      text: content.title,
      className: 'section-title',
      as: 'h2',
      fontWeight: 'bold',
    }),
    createHomeTextNode({
      id: `${prefix}-guide-description`,
      parentId: containerId,
      rect: { x: 0, y: 42 + titleHeight + 18, width: 760, height: descriptionHeight },
      zIndex: 2,
      text: content.description,
      className: 'section-lede',
      as: 'p',
      fontSize: 20,
    }),
    ...createOrnamentDividerNodes(`${prefix}-guide`, containerId, 42 + titleHeight + 18 + descriptionHeight + 18, 3),
    createHomeContainerNode({
      id: `${prefix}-guide-grid`,
      parentId: containerId,
      rect: { x: 0, y: 42 + titleHeight + 18 + descriptionHeight + 18 + 24 + 32, width: PAGE_CONTAINER_WIDTH, height: gridHeight },
      zIndex: 5,
      label: `${prefix} guide grid`,
      className: 'grid-bento contact-grid reveal-stagger',
    }),
  ];

  cardBuilds.forEach((build, index) => {
    const cardId = `${prefix}-guide-card-${index}`;
    const cardX = index * (cardWidth + cardGap);
    nodes.push(
      createHomeContainerNode({
        id: cardId,
        parentId: `${prefix}-guide-grid`,
        rect: { x: cardX, y: 0, width: cardWidth, height: build.cardHeight },
        zIndex: index,
        label: `${prefix} guide card ${index + 1}`,
        className: 'card legal-card',
        as: 'article',
      }),
      createHomeTextNode({
        id: `${cardId}-title`,
        parentId: cardId,
        rect: { x: 0, y: 0, width: cardWidth - 48, height: build.cardTitleHeight },
        zIndex: 0,
        text: build.card.title,
        className: 'card-title',
        as: 'h3',
        fontWeight: 'bold',
      }),
      {
        ...build.list.nodes[0],
        parentId: cardId,
        rect: { x: 0, y: 32 + build.cardTitleHeight + 18, width: cardWidth - 48, height: build.list.height },
        zIndex: 1,
      },
      ...build.list.nodes.slice(1).map((node) => ({
        ...node,
        parentId: `${prefix}-card-${index}-list`,
      })),
    );
  });

  const containerHeight = 42 + titleHeight + 18 + descriptionHeight + 18 + 24 + 32 + gridHeight;
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

export function createFaqPageSectionNodes(
  prefix: string,
  y: number,
  locale: Locale,
  zBase: number,
): DecomposedSectionBuild {
  const items = faqContent[locale];
  const sectionTitle =
    locale === 'ko' ? '자주 묻는 질문' : locale === 'zh-hant' ? '常見問題' : 'Frequently Asked Questions';
  const rootId = `${prefix}-faq-root`;
  const containerId = `${prefix}-faq-container`;
  const listId = `${prefix}-faq-list`;
  const nodes: BuilderCanvasNode[] = [
    createHomeContainerNode({
      id: rootId,
      rect: { x: 0, y, width: PAGE_STAGE_WIDTH, height: 1200 },
      zIndex: zBase,
      label: `${prefix} faq root`,
      className: 'section',
      as: 'section',
    }),
    createHomeContainerNode({
      id: containerId,
      parentId: rootId,
      rect: { x: PAGE_CONTAINER_X, y: SECTION_TOP, width: PAGE_CONTAINER_WIDTH, height: 980 },
      zIndex: 0,
      label: `${prefix} faq container`,
      className: 'container',
    }),
    createHomeTextNode({
      id: `${prefix}-faq-label`,
      parentId: containerId,
      rect: { x: 0, y: 0, width: 120, height: 28 },
      zIndex: 0,
      text: 'FAQ',
      className: 'section-label',
      as: 'div',
      fontWeight: 'medium',
    }),
    createHomeTextNode({
      id: `${prefix}-faq-title`,
      parentId: containerId,
      rect: { x: 0, y: 40, width: 560, height: estimateTextHeight(sectionTitle, 560, 38, 1.1) },
      zIndex: 1,
      text: sectionTitle,
      className: 'section-title',
      as: 'h2',
      fontWeight: 'bold',
    }),
    createHomeContainerNode({
      id: listId,
      parentId: containerId,
      rect: { x: 0, y: 114, width: PAGE_CONTAINER_WIDTH, height: 760 },
      zIndex: 2,
      label: `${prefix} faq list`,
      className: 'faq-list',
    }),
  ];

  let cursor = 0;
  items.forEach((item, index) => {
    const itemId = `${prefix}-faq-item-${index}`;
    const answerHeight = estimateTextHeight(item.answer, 1080, 16, 1.75);
    const itemHeight = 60 + answerHeight + 20;
    nodes.push(
      createHomeContainerNode({
        id: itemId,
        parentId: listId,
        rect: { x: 0, y: cursor, width: PAGE_CONTAINER_WIDTH, height: itemHeight },
        zIndex: index,
        label: `${prefix} faq item ${index + 1}`,
        className: 'faq-item is-open',
        as: 'article',
      }),
      createHomeContainerNode({
        id: `${itemId}-question`,
        parentId: itemId,
        rect: { x: 0, y: 0, width: PAGE_CONTAINER_WIDTH, height: 52 },
        zIndex: 0,
        label: `${prefix} faq question ${index + 1}`,
        className: 'faq-question',
      }),
      createHomeTextNode({
        id: `${itemId}-question-text`,
        parentId: `${itemId}-question`,
        rect: { x: 0, y: 14, width: 1048, height: estimateTextHeight(item.question, 1048, 18, 1.45) },
        zIndex: 0,
        text: item.question,
        as: 'p',
        fontSize: 18,
        fontWeight: 'medium',
      }),
      createHomeTextNode({
        id: `${itemId}-arrow`,
        parentId: `${itemId}-question`,
        rect: { x: 1092, y: 14, width: 20, height: 20 },
        zIndex: 1,
        text: '▸',
        className: 'faq-arrow',
        as: 'span',
      }),
      createHomeContainerNode({
        id: `${itemId}-answer-wrap`,
        parentId: itemId,
        rect: { x: 0, y: 60, width: PAGE_CONTAINER_WIDTH, height: answerHeight },
        zIndex: 1,
        label: `${prefix} faq answer ${index + 1}`,
        className: 'faq-answer-wrap is-open',
      }),
      createHomeTextNode({
        id: `${itemId}-answer`,
        parentId: `${itemId}-answer-wrap`,
        rect: { x: 0, y: 0, width: 1080, height: answerHeight },
        zIndex: 0,
        text: item.answer,
        className: 'faq-answer',
        as: 'p',
      }),
    );
    cursor += itemHeight + 14;
  });

  const listHeight = Math.max(0, cursor - 14);
  const containerHeight = 114 + listHeight;
  const rootHeight = SECTION_TOP + containerHeight + SECTION_BOTTOM;
  nodes[0] = {
    ...nodes[0],
    rect: { x: 0, y, width: PAGE_STAGE_WIDTH, height: rootHeight },
  };
  nodes[1] = {
    ...nodes[1],
    rect: { x: PAGE_CONTAINER_X, y: SECTION_TOP, width: PAGE_CONTAINER_WIDTH, height: containerHeight },
  };
  nodes[4] = {
    ...nodes[4],
    rect: { x: 0, y: 114, width: PAGE_CONTAINER_WIDTH, height: listHeight },
  };
  return { nodes, height: rootHeight };
}

export function createLegalCardsSectionNodes(
  prefix: string,
  y: number,
  content: LegalPageContent,
  zBase: number,
): DecomposedSectionBuild {
  const rootId = `${prefix}-legal-root`;
  const containerId = `${prefix}-legal-container`;
  const cardGap = 24;
  const columns = 2;
  const cardWidth = Math.floor((PAGE_CONTAINER_WIDTH - cardGap) / columns);
  const cardBuilds = content.sections.map((section, index) => {
    const paragraphs = createParagraphStackNodes({
      prefix: `${prefix}-section-${index}`,
      parentId: `${prefix}-card-${index}-copy`,
      x: 0,
      y: 0,
      width: cardWidth - 48,
      items: section.paragraphs,
      zBase: 0,
      fontSize: 16,
      lineHeight: 1.75,
      gap: 14,
    });
    const list = section.items && section.items.length > 0
      ? createBulletListNodes({
          prefix: `${prefix}-section-${index}-items`,
          parentId: `${prefix}-card-${index}`,
          x: 0,
          y: 0,
          width: cardWidth - 48,
          items: section.items,
          zBase: 0,
          className: 'contact-list legal-card-list',
          fontSize: 15,
          gap: 10,
        })
      : null;
    const titleHeight = estimateTextHeight(section.title, cardWidth - 48, 24, 1.2);
    const cardHeight = 32 + titleHeight + 18 + paragraphs.height + (list ? 20 + list.height : 0) + 32;
    return { section, paragraphs, list, titleHeight, cardHeight, index };
  });

  const rowHeights = new Map<number, number>();
  cardBuilds.forEach((build) => {
    const row = Math.floor(build.index / columns);
    rowHeights.set(row, Math.max(rowHeights.get(row) ?? 0, build.cardHeight));
  });
  let rowCursor = 0;
  const rowOffsets = new Map<number, number>();
  [...rowHeights.entries()].sort((a, b) => a[0] - b[0]).forEach(([row, height]) => {
    rowOffsets.set(row, rowCursor);
    rowCursor += height + 24;
  });
  const gridHeight = Math.max(0, rowCursor - 24);

  const nodes: BuilderCanvasNode[] = [
    createHomeContainerNode({
      id: rootId,
      rect: { x: 0, y, width: PAGE_STAGE_WIDTH, height: 1200 },
      zIndex: zBase,
      label: `${prefix} legal root`,
      className: 'section section--light legal-page-section',
      as: 'section',
      dataTone: 'light',
    }),
    createHomeContainerNode({
      id: containerId,
      parentId: rootId,
      rect: { x: PAGE_CONTAINER_X, y: SECTION_TOP, width: PAGE_CONTAINER_WIDTH, height: gridHeight },
      zIndex: 0,
      label: `${prefix} legal container`,
      className: 'container',
    }),
    createHomeContainerNode({
      id: `${prefix}-legal-grid`,
      parentId: containerId,
      rect: { x: 0, y: 0, width: PAGE_CONTAINER_WIDTH, height: gridHeight },
      zIndex: 1,
      label: `${prefix} legal grid`,
      className: 'grid-bento contact-grid reveal-stagger',
    }),
  ];

  cardBuilds.forEach((build) => {
    const cardId = `${prefix}-card-${build.index}`;
    const row = Math.floor(build.index / columns);
    const col = build.index % columns;
    const cardX = col * (cardWidth + cardGap);
    const cardY = rowOffsets.get(row) ?? 0;
    const copyId = `${cardId}-copy`;
    nodes.push(
      createHomeContainerNode({
        id: cardId,
        parentId: `${prefix}-legal-grid`,
        rect: { x: cardX, y: cardY, width: cardWidth, height: build.cardHeight },
        zIndex: build.index,
        label: `${prefix} legal card ${build.index + 1}`,
        className: 'card legal-card',
        as: 'article',
      }),
      createHomeTextNode({
        id: `${cardId}-title`,
        parentId: cardId,
        rect: { x: 0, y: 0, width: cardWidth - 48, height: build.titleHeight },
        zIndex: 0,
        text: build.section.title,
        className: 'card-title',
        as: 'h2',
        fontWeight: 'bold',
      }),
      createHomeContainerNode({
        id: copyId,
        parentId: cardId,
        rect: { x: 0, y: 32 + build.titleHeight + 18, width: cardWidth - 48, height: build.paragraphs.height },
        zIndex: 1,
        label: `${prefix} legal copy ${build.index + 1}`,
        className: 'legal-card-copy',
      }),
      ...build.paragraphs.nodes.map((node) => ({
        ...node,
        parentId: copyId,
      })),
    );

    if (build.list) {
      const listY = 32 + build.titleHeight + 18 + build.paragraphs.height + 20;
      nodes.push(
        {
          ...build.list.nodes[0],
          parentId: cardId,
          rect: { x: 0, y: listY, width: cardWidth - 48, height: build.list.height },
          zIndex: 2,
        },
        ...build.list.nodes.slice(1).map((node) => ({
          ...node,
          parentId: `${prefix}-section-${build.index}-items-list`,
        })),
      );
    }
  });

  const rootHeight = SECTION_TOP + gridHeight + SECTION_BOTTOM;
  nodes[0] = {
    ...nodes[0],
    rect: { x: 0, y, width: PAGE_STAGE_WIDTH, height: rootHeight },
  };
  nodes[1] = {
    ...nodes[1],
    rect: { x: PAGE_CONTAINER_X, y: SECTION_TOP, width: PAGE_CONTAINER_WIDTH, height: gridHeight },
  };
  return { nodes, height: rootHeight };
}
