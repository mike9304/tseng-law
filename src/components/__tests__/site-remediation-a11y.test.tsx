import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/ko',
}));

import AiConsultationSection from '@/components/consultation/AiConsultationSection';
import FAQAccordion from '@/components/FAQAccordion';
import FloatingAiChat from '@/components/FloatingAiChat';
import YearEndEventPopup from '@/components/YearEndEventPopup';
import { getConsultationPublicMailto } from '@/lib/consultation/public-contact';

const root = process.cwd();
const css = readFileSync(path.join(root, 'src/app/globals.css'), 'utf8');
const headerSource = readFileSync(path.join(root, 'src/components/Header.tsx'), 'utf8');
const popupSource = readFileSync(path.join(root, 'src/components/YearEndEventPopup.tsx'), 'utf8');
const floatingChatSource = readFileSync(path.join(root, 'src/components/FloatingAiChat.tsx'), 'utf8');
const consultationSource = readFileSync(
  path.join(root, 'src/components/consultation/AiConsultationSection.tsx'),
  'utf8',
);

function channel(value: number): number {
  const normalized = value / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const rgb = [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
  return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
}

function contrastRatio(foreground: string, background: string): number {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

describe('WO-1 accessibility remediation contracts', () => {
  it('1-9 gives footer legal and locale links at least 4.5:1 contrast', () => {
    const color = css.match(/\.footer-legal-links a\s*\{[\s\S]*?color:\s*(#[0-9a-f]{6});/i)?.[1];
    const background = css.match(/\.site-footer\s*\{[\s\S]*?background:\s*(#[0-9a-f]{6});/i)?.[1];

    expect(color).toBeTruthy();
    expect(background).toBeTruthy();
    expect(contrastRatio(color!, background!)).toBeGreaterThanOrEqual(4.5);
  });

  it('1-10 renders a non-blocking event dialog with keyboard dismissal and email consultation', () => {
    const html = renderToStaticMarkup(
      createElement(YearEndEventPopup, { locale: 'ko', previewOpen: true }),
    );

    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="false"');
    expect(html).toContain('aria-labelledby="year-end-popup-title"');
    expect(html).toContain('>축소<');
    expect(html).toContain(getConsultationPublicMailto('ko').replace(/&/g, '&amp;'));
    expect(html).toContain('>7일간 보지 않기<');
    expect(popupSource).not.toContain("document.body.style.overflow = 'hidden'");
    expect(popupSource).not.toContain('sessionStorage');
    expect(popupSource).toContain("if (event.key === 'Escape')");
    expect(popupSource).toContain("document.addEventListener('keydown', onKeyDown)");
    expect(popupSource).toContain('year-end-popup-minimized');
  });

  it('1-11 exposes the floating chat dialog, message log, composer label, send name, and intake errors', () => {
    const html = renderToStaticMarkup(
      createElement(FloatingAiChat, { locale: 'en', open: true, onClose: () => undefined }),
    );

    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('role="log"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('aria-label="Type your question..."');
    expect(html).toContain('aria-label="Send message"');
    expect(floatingChatSource).toContain('floating-ai-chat-intake-error');
    expect(floatingChatSource).toContain('aria-live="assertive"');
    expect(floatingChatSource).toContain("document.body.style.overflow = 'hidden'");
  });

  it('1-12 labels the consultation composer and marks required controls, invalid email, and submit errors', () => {
    const html = renderToStaticMarkup(createElement(AiConsultationSection, { locale: 'en' }));

    expect(html).toContain('aria-label="Example: What is the basic process for setting up a company in Taiwan?"');
    expect((html.match(/ required=""/g) ?? []).length).toBeGreaterThanOrEqual(3);
    expect(consultationSource).toContain("aria-describedby={emailValue && !emailValid ? 'consultation-email-error' : undefined}");
    expect(consultationSource).toContain('aria-invalid={emailValue ? !emailValid : undefined}');
    expect(consultationSource).toContain('consultation-ai-submit-status--error');
    expect(consultationSource).toContain('aria-live="assertive"');
  });

  it('1-13 connects every mega-menu trigger to its controlled panel and expanded state', () => {
    expect(headerSource).toContain("aria-haspopup={hasMegaPanel(item.key) ? 'true' : undefined}");
    expect(headerSource).toContain('aria-expanded={hasMegaPanel(item.key) ? openMenu === item.key : undefined}');
    expect(headerSource).toContain('aria-controls={hasMegaPanel(item.key) ? `mega-panel-${item.key}` : undefined}');
    expect(headerSource).toContain('id={`mega-panel-${panel.key}`}');
  });

  it('1-14 removes collapsed FAQ answers from the accessibility tree', () => {
    const html = renderToStaticMarkup(createElement(FAQAccordion, {
      locale: 'en',
      items: [{ question: 'Question?', answer: 'Answer.' }],
    }));

    expect(html).toMatch(/id="en-faq-0-panel"[^>]* hidden=""/);
    expect(html).toContain('aria-expanded="false"');
  });

  it('1-15 applies sticky-header anchor margins and a safe mobile control stack', () => {
    expect(css).toContain('.site main :where([id])');
    expect(css).toContain('scroll-margin-top: calc(var(--header-offset-desktop) + 16px);');
    expect(css).toContain(".site:has(.scroll-top[data-visible='true']) main");
    expect(css).toContain('bottom: calc(4.75rem + env(safe-area-inset-bottom));');
    expect(css).toContain('bottom: calc(1rem + env(safe-area-inset-bottom));');
  });

  it('1-16 reveals scroll-animated content immediately for reduced motion', () => {
    const block = css.match(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.reveal \{[\s\S]*?\n  \}/)?.[0];
    expect(block).toContain('opacity: 1');
    expect(block).toContain('transform: none');
    expect(css).toContain('.reveal-stagger > *');
    expect(css).toContain('transition: none;');
  });
});
