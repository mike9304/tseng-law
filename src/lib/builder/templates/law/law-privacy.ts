import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  createButtonNode,
  assignCanvasNodeZIndices,
} from '@/lib/builder/decompose/shared';
import type { PageTemplate } from '../types';

const W = 1280;
const MARGIN = 80;
const CONTENT_W = W - MARGIN * 2;

function heading(
  id: string,
  rect: BuilderCanvasNode['rect'],
  text: string,
  level: number,
  color: string,
  align: 'left' | 'center' | 'right' = 'left',
  parentId?: string,
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
    content: { text, level, color, align },
  };
}

interface PolicySection {
  key: string;
  title: string;
  body: string;
}

const sections: PolicySection[] = [
  {
    key: 'overview',
    title: '1. 개인정보 처리 방침 개요',
    body: '본 법률사무소는 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고, 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.',
  },
  {
    key: 'collection',
    title: '2. 수집하는 개인정보 항목',
    body: '당사는 상담 신청, 사건 의뢰, 서비스 이용 등을 위해 필요한 최소한의 개인정보를 수집합니다. 수집 항목: 성명, 연락처(전화번호, 이메일), 주소, 사건 관련 정보. 자동 수집 항목: IP 주소, 쿠키, 방문 기록, 서비스 이용 기록.',
  },
  {
    key: 'purpose',
    title: '3. 개인정보의 수집 및 이용 목적',
    body: '수집한 개인정보는 다음의 목적을 위해 이용됩니다: 법률 상담 및 사건 처리, 서비스 제공 및 계약 이행, 고객 문의 응대 및 불만 처리, 법적 의무 이행, 서비스 개선을 위한 통계 분석.',
  },
  {
    key: 'retention',
    title: '4. 개인정보의 보유 및 이용 기간',
    body: '개인정보는 수집 목적이 달성된 후 지체 없이 파기합니다. 단, 관련 법령에 의해 보존이 필요한 경우 해당 기간 동안 보관합니다. 계약 또는 청약 철회 관련 기록: 5년, 소비자 불만 처리 기록: 3년.',
  },
  {
    key: 'sharing',
    title: '5. 개인정보의 제3자 제공',
    body: '당사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 이용자가 사전에 동의한 경우, 법령의 규정에 의한 경우, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우에 한하여 제공합니다.',
  },
  {
    key: 'security',
    title: '6. 개인정보의 안전성 확보 조치',
    body: '당사는 개인정보의 안전성 확보를 위해 관리적, 기술적, 물리적 조치를 취하고 있습니다. 개인정보 취급 직원의 최소화 및 교육, 내부관리계획의 수립 및 시행, 개인정보에 대한 접근 제한 조치를 시행합니다.',
  },
  {
    key: 'rights',
    title: '7. 정보주체의 권리와 행사 방법',
    body: '이용자는 언제든지 자신의 개인정보에 대해 열람, 정정, 삭제, 처리 정지를 요구할 수 있습니다. 권리 행사는 서면, 이메일, 전화 등을 통해 가능하며, 당사는 지체 없이 조치하겠습니다.',
  },
  {
    key: 'cookies',
    title: '8. 쿠키의 설치, 운영 및 거부',
    body: '당사는 이용자에게 개별적인 맞춤 서비스를 제공하기 위해 쿠키를 사용합니다. 이용자는 웹 브라우저의 설정을 통해 쿠키의 설치를 허용하거나 거부할 수 있습니다. 쿠키 설치를 거부할 경우 일부 서비스 이용이 어려울 수 있습니다.',
  },
  {
    key: 'officer',
    title: '9. 개인정보 보호 책임자',
    body: '당사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 개인정보 보호 책임자를 지정하고 있습니다. 문의: contact@lawfirm.com.tw',
  },
  {
    key: 'changes',
    title: '10. 개인정보 처리방침 변경',
    body: '이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경 내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다. 시행일자: 2026년 4월 15일.',
  },
];

/* ── Build nodes ─────────────────────────────────────────────── */

let yOffset = 50;

const headerNodes: BuilderCanvasNode[] = [
  heading(
    'tpl-privacy-title',
    { x: MARGIN, y: yOffset, width: CONTENT_W, height: 56 },
    '개인정보 처리방침',
    1,
    '#123b63',
    'left',
  ),
];
yOffset += 56 + 24;

headerNodes.push(
  createTextNode({
    id: 'tpl-privacy-updated',
    rect: { x: MARGIN, y: yOffset, width: 400, height: 28 },
    text: '최종 수정일: 2026년 4월 15일',
    fontSize: 14,
    color: '#9ca3af',
  }),
);
yOffset += 28 + 40;

const sectionNodes: BuilderCanvasNode[] = [];

for (const s of sections) {
  sectionNodes.push(
    heading(
      `tpl-privacy-h-${s.key}`,
      { x: MARGIN, y: yOffset, width: CONTENT_W, height: 40 },
      s.title,
      2,
      '#123b63',
    ),
  );
  yOffset += 40 + 12;
  sectionNodes.push(
    createTextNode({
      id: `tpl-privacy-p-${s.key}`,
      rect: { x: MARGIN, y: yOffset, width: CONTENT_W, height: 80 },
      text: s.body,
      fontSize: 15,
      color: '#374151',
      lineHeight: 1.7,
    }),
  );
  yOffset += 80 + 40;
}

const STAGE_H = yOffset + 60;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  ...headerNodes,
  ...sectionNodes,
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-lawprivacy-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-lawprivacy-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-lawprivacy-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-proof-label', parentId: 'tpl-lawprivacy-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-proof-title', parentId: 'tpl-lawprivacy-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'law privacy 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-proof-copy', parentId: 'tpl-lawprivacy-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-lawprivacy-wix-metric-1', parentId: 'tpl-lawprivacy-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-metric-1-value', parentId: 'tpl-lawprivacy-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-metric-1-label', parentId: 'tpl-lawprivacy-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawprivacy-wix-metric-2', parentId: 'tpl-lawprivacy-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-metric-2-value', parentId: 'tpl-lawprivacy-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-metric-2-label', parentId: 'tpl-lawprivacy-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawprivacy-wix-metric-3', parentId: 'tpl-lawprivacy-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-metric-3-value', parentId: 'tpl-lawprivacy-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-metric-3-label', parentId: 'tpl-lawprivacy-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawprivacy-wix-metric-4', parentId: 'tpl-lawprivacy-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-metric-4-value', parentId: 'tpl-lawprivacy-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-metric-4-label', parentId: 'tpl-lawprivacy-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-showcase-label', parentId: 'tpl-lawprivacy-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-showcase-title', parentId: 'tpl-lawprivacy-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-showcase-copy', parentId: 'tpl-lawprivacy-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-lawprivacy-wix-showcase-visual', parentId: 'tpl-lawprivacy-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-showcase-visual-title', parentId: 'tpl-lawprivacy-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-showcase-visual-copy', parentId: 'tpl-lawprivacy-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawprivacy-wix-showcase-card-1', parentId: 'tpl-lawprivacy-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-showcase-card-1-title', parentId: 'tpl-lawprivacy-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-showcase-card-1-copy', parentId: 'tpl-lawprivacy-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawprivacy-wix-showcase-card-2', parentId: 'tpl-lawprivacy-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-showcase-card-2-title', parentId: 'tpl-lawprivacy-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-showcase-card-2-copy', parentId: 'tpl-lawprivacy-wix-showcase-card-2', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '가격, 일정, 품질처럼 비교해야 하는 항목을 짧은 문장으로 설명합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawprivacy-wix-showcase-card-3', parentId: 'tpl-lawprivacy-wix-showcase', rect: { x: 776, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-showcase-card-3-title', parentId: 'tpl-lawprivacy-wix-showcase-card-3', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '다음 행동', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-showcase-card-3-copy', parentId: 'tpl-lawprivacy-wix-showcase-card-3', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '문의, 예약, 구독, 구매 같은 다음 행동을 명확히 연결합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawprivacy-wix-quote', parentId: 'tpl-lawprivacy-wix-proof', rect: { x: 650, y: 260, width: 444, height: 180 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-quote-mark', parentId: 'tpl-lawprivacy-wix-quote', rect: { x: 28, y: 22, width: 44, height: 44 }, text: '“', fontSize: 40, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-quote-body', parentId: 'tpl-lawprivacy-wix-quote', rect: { x: 78, y: 34, width: 300, height: 72 }, text: '정보가 충분히 분리되어 있어 페이지를 훑는 속도가 빨라졌습니다.', fontSize: 16, color: '#334155', lineHeight: 1.42, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-quote-role', parentId: 'tpl-lawprivacy-wix-quote', rect: { x: 78, y: 124, width: 240, height: 24 }, text: 'Template quality reviewer', fontSize: 13, color: '#64748b', fontWeight: 'medium', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-cta-label', parentId: 'tpl-lawprivacy-wix-cta', rect: { x: 64, y: 58, width: 260, height: 28 }, text: 'Conversion-ready section', fontSize: 13, color: '#e8a838', fontWeight: 'bold', textTransform: 'uppercase', className: 'hero-eyebrow',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-cta-title', parentId: 'tpl-lawprivacy-wix-cta', rect: { x: 64, y: 102, width: 560, height: 92 }, text: '방문자가 다음 단계로 이동할 수 있게 마지막 전환을 강화합니다', fontSize: 38, color: '#ffffff', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-cta-copy', parentId: 'tpl-lawprivacy-wix-cta', rect: { x: 64, y: 214, width: 560, height: 64 }, text: '짧은 설득 문구, 보조 안내, 두 개의 행동 버튼을 같은 영역에 묶어 전환 흐름을 분명하게 만듭니다.', fontSize: 17, color: 'rgba(255,255,255,0.82)', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createButtonNode({
    id: 'tpl-lawprivacy-wix-cta-primary', parentId: 'tpl-lawprivacy-wix-cta', rect: { x: 64, y: 318, width: 178, height: 52 }, label: '문의 시작', href: '#contact', variant: 'primary', className: 'hero-cta', style: { backgroundColor: '#e8a838', borderRadius: 8 },
  }),
  createButtonNode({
    id: 'tpl-lawprivacy-wix-cta-secondary', parentId: 'tpl-lawprivacy-wix-cta', rect: { x: 266, y: 318, width: 176, height: 52 }, label: '자세히 보기', href: '#contact', variant: 'outline', className: 'hero-cta', style: { backgroundColor: 'transparent', borderColor: '#ffffff', borderWidth: 1, borderRadius: 8 },
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-cta-note', parentId: 'tpl-lawprivacy-wix-cta', rect: { x: 64, y: 402, width: 420, height: 30 }, text: 'Global header와 footer는 그대로 두고 인페이지 전환만 보강합니다.', fontSize: 13, color: 'rgba(255,255,255,0.68)', className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawprivacy-wix-timeline', parentId: 'tpl-lawprivacy-wix-cta', rect: { x: 690, y: 70, width: 360, height: 390 }, background: 'rgba(255,255,255,0.10)', borderColor: 'rgba(255,255,255,0.22)', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-timeline-label', parentId: 'tpl-lawprivacy-wix-timeline', rect: { x: 28, y: 28, width: 240, height: 24 }, text: 'Decision path', fontSize: 13, color: '#e8a838', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-timeline-1-title', parentId: 'tpl-lawprivacy-wix-timeline', rect: { x: 28, y: 76, width: 260, height: 28 }, text: '1. 이해', fontSize: 20, color: '#ffffff', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-timeline-1-body', parentId: 'tpl-lawprivacy-wix-timeline', rect: { x: 28, y: 110, width: 270, height: 40 }, text: '문제, 대상, 제공 가치를 먼저 정렬합니다.', fontSize: 14, color: 'rgba(255,255,255,0.76)', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-lawprivacy-wix-timeline-2-title', parentId: 'tpl-lawprivacy-wix-timeline', rect: { x: 28, y: 174, width: 260, height: 28 }, text: '2. 비교', fontSize: 20, color: '#ffffff', fontWeight: 'bold', className: 'card-title',
  }),
]);

export const lawPrivacyTemplate: PageTemplate = {
  id: 'law-privacy',
  name: '개인정보 처리방침',
  category: 'law',
  subcategory: 'legal',
  description: '페이지 제목 + 10개 섹션(제목 + 본문) - 표준 개인정보 처리방침',
  document: {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-04-15T00:00:00+09:00',
    updatedBy: 'template-system',
    stageWidth: W,
    stageHeight: STAGE_H + 1960,
    nodes,
  },
};
