import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createTextNode,
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
    stageHeight: STAGE_H,
    nodes,
  },
};
