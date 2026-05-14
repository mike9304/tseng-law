'use client';

import { useEffect } from 'react';

const SERVICE_EXPANDED_HEIGHT = 420;
const SERVICE_BODY_EXPANDED_HEIGHT = 330;
const FAQ_EXPANDED_HEIGHT = 190;
const FAQ_BODY_EXPANDED_HEIGHT = 122;

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

function ensureId(element: HTMLElement | null, fallback: string): string | null {
  if (!element) return null;
  if (!element.id) element.id = fallback;
  return element.id;
}

function readPixelValue(value: string | null | undefined): number | null {
  if (!value) return null;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function rememberBaseStackMetrics(elements: HTMLElement[]): void {
  for (const element of elements) {
    if (!element.dataset.builderBaseTop) {
      element.dataset.builderBaseTop = String(
        readPixelValue(element.style.top) ?? element.offsetTop,
      );
    }
    if (!element.dataset.builderBaseHeight) {
      element.dataset.builderBaseHeight = String(
        readPixelValue(element.style.height) ?? element.offsetHeight,
      );
    }
  }
}

function baseMetric(element: HTMLElement, key: 'builderBaseTop' | 'builderBaseHeight'): number {
  const parsed = Number.parseFloat(element.dataset[key] ?? '');
  return Number.isFinite(parsed) ? parsed : 0;
}

function logicalSiblingStack(elements: HTMLElement[]): HTMLElement[] {
  const reference = elements[0];
  const parentNodeId = reference?.dataset.parentNodeId;
  if (!parentNodeId) return elements;
  const siblings = Array.from(
    document.querySelectorAll<HTMLElement>(`[data-parent-node-id="${CSS.escape(parentNodeId)}"]`),
  );
  rememberBaseStackMetrics(siblings);
  return siblings.sort((a, b) => baseMetric(a, 'builderBaseTop') - baseMetric(b, 'builderBaseTop'));
}

function applyExpandedSiblingStack(elements: HTMLElement[]): void {
  if (elements.length === 0) return;
  const stack = logicalSiblingStack(elements);
  rememberBaseStackMetrics(elements);
  let offset = 0;

  stack.forEach((element) => {
    const baseTop = baseMetric(element, 'builderBaseTop');
    const baseHeight = baseMetric(element, 'builderBaseHeight');
    const expandedHeight = readPixelValue(element.dataset.builderExpandedHeight);
    const isExpanded = element.dataset.builderExpanded === 'true' && expandedHeight != null;
    element.style.top = `${baseTop + offset}px`;
    element.style.height = `${isExpanded ? expandedHeight : baseHeight}px`;
    element.style.overflow = isExpanded ? 'visible' : '';
    if (isExpanded) offset += Math.max(0, expandedHeight - baseHeight);
  });
}

function setServiceDecomposedBodyVisibility(card: HTMLElement, isOpen: boolean): void {
  const nodeId = card.dataset.nodeId;
  if (!nodeId) return;
  const escaped = CSS.escape(nodeId);
  const bodyNode = card.querySelector<HTMLElement>(`[data-node-id="${escaped}-body"]`);
  const details = card.querySelectorAll<HTMLElement>([
    `[data-node-id^="${escaped}-"][data-node-id*="-detail-"]`,
    `[data-node-id="${escaped}-checklist"]`,
    `[data-node-id="${escaped}-columns"]`,
    `[data-node-id="${escaped}-more"]`,
  ].join(','));

  if (bodyNode) {
    bodyNode.style.height = isOpen ? `${SERVICE_BODY_EXPANDED_HEIGHT}px` : '';
    bodyNode.style.overflow = isOpen ? 'visible' : '';
  }

  for (const detail of details) {
    detail.style.display = isOpen ? 'block' : 'none';
  }
}

function setFaqDecomposedBodyVisibility(item: HTMLElement, isOpen: boolean): void {
  const nodeId = item.dataset.nodeId;
  if (!nodeId) return;
  const escaped = CSS.escape(nodeId);
  const answerWrapNode = item.querySelector<HTMLElement>(`[data-node-id="${escaped}-answer-wrap"]`);
  const answerNode = item.querySelector<HTMLElement>(`[data-node-id="${escaped}-answer"]`);

  if (answerWrapNode) {
    answerWrapNode.style.height = isOpen ? `${FAQ_BODY_EXPANDED_HEIGHT}px` : '';
    answerWrapNode.style.overflow = isOpen ? 'visible' : '';
  }
  if (answerNode) {
    answerNode.style.display = isOpen ? 'block' : 'none';
  }
}

export default function PublishedInteractions() {
  useEffect(() => {
    const serviceCards = findByNodeIdPattern(/^home-services-card-\d+$/);
    const faqItems = findByNodeIdPattern(/^home-faq-item-\d+$/);

    const setOpenService = (activeCard: HTMLElement | null) => {
      for (const card of serviceCards) {
        const isOpen = card === activeCard;
        const body = card.querySelector<HTMLElement>('.services-detail-body');
        const toggle = card.querySelector<HTMLElement>('.services-detail-toggle');
        card.dataset.builderExpanded = isOpen ? 'true' : 'false';
        if (isOpen) {
          card.dataset.builderExpandedHeight = String(SERVICE_EXPANDED_HEIGHT);
        } else {
          delete card.dataset.builderExpandedHeight;
        }
        toggleClass(card.querySelector('.services-detail-card'), 'is-open', isOpen);
        toggleClass(body, 'is-open', isOpen);
        toggleClass(card.querySelector('.services-detail-chevron'), 'open', isOpen);
        setServiceDecomposedBodyVisibility(card, isOpen);
        if (body) body.style.overflow = isOpen ? 'visible' : '';
        body?.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        toggle?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
      applyExpandedSiblingStack(serviceCards);
    };

    const setOpenFaq = (activeItem: HTMLElement | null) => {
      for (const item of faqItems) {
        const isOpen = item === activeItem;
        const answer = item.querySelector<HTMLElement>('.faq-answer-wrap');
        const question = item.querySelector<HTMLElement>('.faq-question');
        item.dataset.builderExpanded = isOpen ? 'true' : 'false';
        if (isOpen) {
          item.dataset.builderExpandedHeight = String(FAQ_EXPANDED_HEIGHT);
        } else {
          delete item.dataset.builderExpandedHeight;
        }
        toggleClass(item.querySelector('.faq-item'), 'is-open', isOpen);
        toggleClass(answer, 'is-open', isOpen);
        setFaqDecomposedBodyVisibility(item, isOpen);
        if (answer) answer.style.overflow = isOpen ? 'visible' : '';
        answer?.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        question?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
      applyExpandedSiblingStack(faqItems);
    };

    for (const card of serviceCards) {
      const toggle = card.querySelector<HTMLElement>('.services-detail-toggle') ?? card;
      const bodyId = ensureId(
        card.querySelector<HTMLElement>('.services-detail-body'),
        `${card.dataset.nodeId ?? 'builder-service'}-body`,
      );
      toggle.setAttribute('role', 'button');
      toggle.setAttribute('tabindex', '0');
      toggle.setAttribute('aria-expanded', 'false');
      if (bodyId) toggle.setAttribute('aria-controls', bodyId);
    }

    for (const item of faqItems) {
      const question = item.querySelector<HTMLElement>('.faq-question') ?? item;
      const answerId = ensureId(
        item.querySelector<HTMLElement>('.faq-answer-wrap'),
        `${item.dataset.nodeId ?? 'builder-faq'}-answer`,
      );
      question.setAttribute('role', 'button');
      question.setAttribute('tabindex', '0');
      question.setAttribute('aria-expanded', 'false');
      if (answerId) question.setAttribute('aria-controls', answerId);
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
