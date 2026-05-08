'use client';

import { useEffect } from 'react';

function findByNodeIdPattern(pattern: RegExp): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-node-id]'))
    .filter((element) => pattern.test(element.dataset.nodeId ?? ''));
}

function toggleClass(element: Element | null, className: string, enabled: boolean): void {
  if (!element) return;
  element.classList.toggle(className, enabled);
}

function closestByNodeIdPattern(target: EventTarget | null, pattern: RegExp): HTMLElement | null {
  let cursor = target instanceof HTMLElement ? target : null;
  while (cursor) {
    const nodeId = cursor.dataset.nodeId;
    if (nodeId && pattern.test(nodeId)) return cursor;
    cursor = cursor.parentElement;
  }
  return null;
}

export default function PublishedInteractions() {
  useEffect(() => {
    const serviceCards = findByNodeIdPattern(/^home-services-card-\d+$/);
    const faqItems = findByNodeIdPattern(/^home-faq-item-\d+$/);

    const setOpenService = (activeCard: HTMLElement | null) => {
      for (const card of serviceCards) {
        const isOpen = card === activeCard;
        card.dataset.builderExpanded = isOpen ? 'true' : 'false';
        toggleClass(card.querySelector('.services-detail-card'), 'is-open', isOpen);
        toggleClass(card.querySelector('.services-detail-body'), 'is-open', isOpen);
        toggleClass(card.querySelector('.services-detail-chevron'), 'open', isOpen);
        card.querySelector('.services-detail-toggle')?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    };

    const setOpenFaq = (activeItem: HTMLElement | null) => {
      for (const item of faqItems) {
        const isOpen = item === activeItem;
        item.dataset.builderExpanded = isOpen ? 'true' : 'false';
        toggleClass(item.querySelector('.faq-item'), 'is-open', isOpen);
        toggleClass(item.querySelector('.faq-answer-wrap'), 'is-open', isOpen);
        item.querySelector('.faq-question')?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    };

    for (const card of serviceCards) {
      const toggle = card.querySelector<HTMLElement>('.services-detail-toggle') ?? card;
      toggle.setAttribute('role', 'button');
      toggle.setAttribute('tabindex', '0');
    }

    for (const item of faqItems) {
      const question = item.querySelector<HTMLElement>('.faq-question') ?? item;
      question.setAttribute('role', 'button');
      question.setAttribute('tabindex', '0');
    }

    const hash = window.location.hash ? window.location.hash.slice(1) : '';
    const initialServiceCard = hash
      ? serviceCards.find((card) => card.querySelector(`#${CSS.escape(hash)}`)) ?? null
      : null;
    setOpenService(initialServiceCard);
    setOpenFaq(null);

    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof HTMLElement)) return;

      if (event.target.closest('.services-detail-toggle')) {
        const card = closestByNodeIdPattern(event.target, /^home-services-card-\d+$/);
        if (card && serviceCards.includes(card)) {
          event.preventDefault();
          setOpenService(card.dataset.builderExpanded === 'true' ? null : card);
          return;
        }
      }

      if (event.target.closest('.faq-question')) {
        const item = closestByNodeIdPattern(event.target, /^home-faq-item-\d+$/);
        if (item && faqItems.includes(item)) {
          event.preventDefault();
          setOpenFaq(item.dataset.builderExpanded === 'true' ? null : item);
        }
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if (!(event.target instanceof HTMLElement)) return;

      if (event.target.closest('.services-detail-toggle')) {
        const card = closestByNodeIdPattern(event.target, /^home-services-card-\d+$/);
        if (card && serviceCards.includes(card)) {
          event.preventDefault();
          setOpenService(card.dataset.builderExpanded === 'true' ? null : card);
          return;
        }
      }

      if (event.target.closest('.faq-question')) {
        const item = closestByNodeIdPattern(event.target, /^home-faq-item-\d+$/);
        if (item && faqItems.includes(item)) {
          event.preventDefault();
          setOpenFaq(item.dataset.builderExpanded === 'true' ? null : item);
        }
      }
    };

    document.addEventListener('click', handleClick, true);
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  return null;
}
