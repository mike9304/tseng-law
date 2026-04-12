'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';

/* ── Starter template metadata (inlined to avoid server imports) ─ */

interface TemplateMeta {
  templateId: string;
  name: string;
  description: string;
  nodeCount: number;
}

const STARTER_TEMPLATES: TemplateMeta[] = [
  {
    templateId: 'starter-landing',
    name: '법률사무소 랜딩',
    description: '히어로 + 서비스 소개 + 변호사 + CTA + 연락처',
    nodeCount: 5,
  },
  {
    templateId: 'starter-contact',
    name: '연락처 페이지',
    description: '사무실 정보 + 상담 폼 + 지도',
    nodeCount: 3,
  },
  {
    templateId: 'starter-attorney',
    name: '변호사 소개',
    description: '프로필 사진 + 약력 + 전문 분야',
    nodeCount: 3,
  },
];

function buildStarterDocument(templateId: string): BuilderCanvasDocument | null {
  if (templateId === 'starter-landing') {
    return {
      version: 1,
      locale: 'ko',
      updatedAt: new Date().toISOString(),
      updatedBy: 'template-system',
      nodes: [
        { id: 'hero-title', kind: 'text', rect: { x: 80, y: 80, width: 500, height: 80 }, style: createDefaultCanvasNodeStyle(), zIndex: 0, rotation: 0, locked: false, visible: true, content: { text: '호정국제 법률사무소', fontSize: 42, color: '#0f172a', fontWeight: 'bold', align: 'left', lineHeight: 1.25, letterSpacing: 0 } },
        { id: 'hero-subtitle', kind: 'text', rect: { x: 80, y: 180, width: 450, height: 60 }, style: createDefaultCanvasNodeStyle(), zIndex: 1, rotation: 0, locked: false, visible: true, content: { text: '대만 법률 문제, 한국어로 상담받으세요', fontSize: 20, color: '#475569', fontWeight: 'regular', align: 'left', lineHeight: 1.25, letterSpacing: 0 } },
        { id: 'hero-cta', kind: 'button', rect: { x: 80, y: 270, width: 180, height: 52 }, style: createDefaultCanvasNodeStyle(), zIndex: 2, rotation: 0, locked: false, visible: true, content: { label: '상담 요청하기', href: '/ko/contact', style: 'primary' } },
        { id: 'hero-image', kind: 'image', rect: { x: 600, y: 60, width: 400, height: 300 }, style: createDefaultCanvasNodeStyle(), zIndex: 3, rotation: 0, locked: false, visible: true, content: { src: '/images/header-skyline-ratio.webp', alt: '타이베이 스카이라인', fit: 'cover' } },
        { id: 'services-title', kind: 'text', rect: { x: 80, y: 420, width: 300, height: 40 }, style: createDefaultCanvasNodeStyle(), zIndex: 4, rotation: 0, locked: false, visible: true, content: { text: '주요 업무 분야', fontSize: 28, color: '#0f172a', fontWeight: 'bold', align: 'left', lineHeight: 1.25, letterSpacing: 0 } },
      ],
    };
  }
  if (templateId === 'starter-contact') {
    return {
      version: 1,
      locale: 'ko',
      updatedAt: new Date().toISOString(),
      updatedBy: 'template-system',
      nodes: [
        { id: 'contact-title', kind: 'text', rect: { x: 80, y: 60, width: 400, height: 50 }, style: createDefaultCanvasNodeStyle(), zIndex: 0, rotation: 0, locked: false, visible: true, content: { text: '문의 및 연락처', fontSize: 32, color: '#0f172a', fontWeight: 'bold', align: 'left', lineHeight: 1.25, letterSpacing: 0 } },
        { id: 'contact-info', kind: 'text', rect: { x: 80, y: 140, width: 400, height: 100 }, style: createDefaultCanvasNodeStyle(), zIndex: 1, rotation: 0, locked: false, visible: true, content: { text: '이메일: wei@hoveringlaw.com.tw\n전화: +886-2-xxxx-xxxx\n주소: 台北市大安區...', fontSize: 16, color: '#374151', fontWeight: 'regular', align: 'left', lineHeight: 1.25, letterSpacing: 0 } },
        { id: 'contact-cta', kind: 'button', rect: { x: 80, y: 270, width: 200, height: 48 }, style: createDefaultCanvasNodeStyle(), zIndex: 2, rotation: 0, locked: false, visible: true, content: { label: '상담 신청하기', href: '/ko/contact', style: 'primary' } },
      ],
    };
  }
  if (templateId === 'starter-attorney') {
    return {
      version: 1,
      locale: 'ko',
      updatedAt: new Date().toISOString(),
      updatedBy: 'template-system',
      nodes: [
        { id: 'attorney-photo', kind: 'image', rect: { x: 80, y: 60, width: 280, height: 350 }, style: createDefaultCanvasNodeStyle(), zIndex: 0, rotation: 0, locked: false, visible: true, content: { src: '', alt: '변호사 프로필', fit: 'cover' } },
        { id: 'attorney-name', kind: 'text', rect: { x: 400, y: 80, width: 400, height: 50 }, style: createDefaultCanvasNodeStyle(), zIndex: 1, rotation: 0, locked: false, visible: true, content: { text: '대표 변호사', fontSize: 28, color: '#0f172a', fontWeight: 'bold', align: 'left', lineHeight: 1.25, letterSpacing: 0 } },
        { id: 'attorney-bio', kind: 'text', rect: { x: 400, y: 150, width: 400, height: 200 }, style: createDefaultCanvasNodeStyle(), zIndex: 2, rotation: 0, locked: false, visible: true, content: { text: '전문 분야, 학력, 경력 등을 여기에 작성합니다.', fontSize: 16, color: '#374151', fontWeight: 'regular', align: 'left', lineHeight: 1.25, letterSpacing: 0 } },
      ],
    };
  }
  return null;
}

/* ── Styles ─────────────────────────────────────────────────────── */

const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(15, 23, 42, 0.45)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  zIndex: 10000,
  animation: 'fadeIn 180ms ease',
};

const modalStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 24px 64px rgba(0,0,0,.18)',
  padding: 32,
  maxWidth: 560,
  width: '90vw',
  maxHeight: '80vh',
  overflow: 'auto',
  animation: 'scaleIn 200ms ease',
};

const titleStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 700,
  color: '#0f172a',
  marginBottom: 6,
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: '#64748b',
  marginBottom: 20,
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
};

const cardBase: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  padding: '16px 18px',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  background: '#f8fafc',
  cursor: 'pointer',
  transition: 'border-color 120ms ease, box-shadow 120ms ease',
  textAlign: 'left',
};

const cardNameStyle: React.CSSProperties = {
  fontSize: '0.92rem',
  fontWeight: 700,
  color: '#0f172a',
};

const cardDescStyle: React.CSSProperties = {
  fontSize: '0.78rem',
  color: '#64748b',
  lineHeight: 1.4,
};

const cardMetaStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  color: '#94a3b8',
  marginTop: 4,
};

const emptyCardIcon: React.CSSProperties = {
  fontSize: '1.6rem',
  marginBottom: 4,
};

const closeBtnStyle: React.CSSProperties = {
  position: 'absolute',
  top: 16,
  right: 16,
  background: 'none',
  border: 'none',
  fontSize: '1.2rem',
  cursor: 'pointer',
  color: '#94a3b8',
  padding: 4,
  lineHeight: 1,
};

/* ── Global keyframes (injected once) ────────────────────────────── */

const keyframesId = 'template-gallery-keyframes';

function ensureKeyframes() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(keyframesId)) return;
  const style = document.createElement('style');
  style.id = keyframesId;
  style.textContent = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
  `;
  document.head.appendChild(style);
}

/* ── Component ──────────────────────────────────────────────────── */

export default function TemplateGalleryModal({
  onSelect,
  onClose,
}: {
  /** Called with null for blank page, or a document for a template */
  onSelect: (document: BuilderCanvasDocument | null) => void;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    ensureKeyframes();
  }, []);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  return (
    <div style={backdropStyle} onClick={handleBackdropClick}>
      <div ref={modalRef} style={{ ...modalStyle, position: 'relative' }}>
        <button type="button" style={closeBtnStyle} onClick={onClose} title="닫기">
          &times;
        </button>

        <div style={titleStyle}>새 페이지 만들기</div>
        <div style={subtitleStyle}>템플릿을 선택하거나 빈 페이지로 시작하세요.</div>

        <div style={gridStyle}>
          {/* Blank page card */}
          <button
            type="button"
            style={{
              ...cardBase,
              borderColor: hovered === 'blank' ? '#116dff' : '#e2e8f0',
              boxShadow: hovered === 'blank' ? '0 0 0 2px rgba(17,109,255,.15)' : 'none',
            }}
            onMouseEnter={() => setHovered('blank')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect(null)}
          >
            <div style={emptyCardIcon}>+</div>
            <div style={cardNameStyle}>빈 페이지</div>
            <div style={cardDescStyle}>빈 캔버스에서 자유롭게 시작</div>
          </button>

          {/* Starter templates */}
          {STARTER_TEMPLATES.map((tpl) => (
            <button
              key={tpl.templateId}
              type="button"
              style={{
                ...cardBase,
                borderColor: hovered === tpl.templateId ? '#116dff' : '#e2e8f0',
                boxShadow: hovered === tpl.templateId ? '0 0 0 2px rgba(17,109,255,.15)' : 'none',
              }}
              onMouseEnter={() => setHovered(tpl.templateId)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                const doc = buildStarterDocument(tpl.templateId);
                onSelect(doc);
              }}
            >
              <div style={cardNameStyle}>{tpl.name}</div>
              <div style={cardDescStyle}>{tpl.description}</div>
              <div style={cardMetaStyle}>노드 {tpl.nodeCount}개</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
