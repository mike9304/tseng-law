import { describe, expect, it } from 'vitest';
import { STANDARD_PAGE_DECOMPOSERS } from '../seed-pages';
import { PAGE_CONTAINER_WIDTH, createAttorneyProfileSectionNodes } from '../decompose-page-shared';

describe('createAttorneyProfileSectionNodes', () => {
  // Card/inner heights include the ≥32px persisted-row clamp allowance on each
  // intro/education/experience list (decompose-page-shared phantomHeight) so
  // section labels clear the previous list's rows; the attorney ROOT reclaims
  // the same amount from its bottom padding, keeping root/stage pinned to the
  // live-measured totals (stage 2653, root 2207).
  it('regenerates the live-aligned lawyers page geometry from source', () => {
    const document = STANDARD_PAGE_DECOMPOSERS.lawyers('ko');
    const nodesById = new Map(document.nodes.map((node) => [node.id, node]));

    expect(document.stageHeight).toBe(2653);
    expect(document.nodes).toHaveLength(124);
    expect(nodesById.get('page-lawyers-attorney-root')?.rect).toMatchObject({
      y: 428,
      width: 1280,
      height: 2207,
    });
    expect(nodesById.get('page-lawyers-attorney-container')?.rect).toMatchObject({
      x: 51,
      y: 88,
      width: 1178,
      height: 2062,
    });
    expect(nodesById.get('page-lawyers-lead-wrap')?.rect).toMatchObject({
      y: 278,
      height: 643,
    });
    expect(nodesById.get('page-lawyers-lead-card')?.rect).toMatchObject({
      y: 48,
      width: 1178,
      height: 549,
    });
    expect(nodesById.get('page-lawyers-lead-card-info')?.rect).toMatchObject({
      x: 372,
      width: 806,
      height: 549,
    });
    expect(nodesById.get('page-lawyers-staff-wrap')?.rect).toMatchObject({
      y: 963,
      height: 515,
    });
    expect(nodesById.get('page-lawyers-staff-grid')?.rect).toMatchObject({
      y: 40,
      width: 1178,
      height: 503,
    });
    expect(nodesById.get('page-lawyers-staff-card-0')?.rect).toMatchObject({
      x: 0,
      width: 548,
      height: 458,
    });
    expect(nodesById.get('page-lawyers-staff-card-1')?.rect).toMatchObject({
      x: 588,
      width: 548,
      height: 426,
    });
    expect(nodesById.get('page-lawyers-partner-wrap')?.rect).toMatchObject({
      y: 1554,
      height: 503,
    });
    expect(nodesById.get('page-lawyers-partner-card')?.rect).toMatchObject({
      width: 1178,
      height: 398,
    });
    expect(nodesById.get('page-lawyers-partner-card-info')?.rect).toMatchObject({
      x: 200,
      width: 940,
      height: 398,
    });
  });

  it('builds the lead attorney card as a stretched left photo column', () => {
    const build = createAttorneyProfileSectionNodes('attorney-grid', 0, 'ko', 0);
    const nodesById = new Map(build.nodes.map((node) => [node.id, node]));

    const card = nodesById.get('attorney-grid-lead-card');
    const photo = nodesById.get('attorney-grid-lead-card-photo');
    const image = nodesById.get('attorney-grid-lead-card-photo-image');
    const info = nodesById.get('attorney-grid-lead-card-info');

    expect(card).toBeDefined();
    expect(photo).toBeDefined();
    expect(image).toBeDefined();
    expect(info).toBeDefined();
    if (!card || !photo || !image || !info) return;

    expect(photo.rect.x).toBe(0);
    expect(photo.rect.width).toBe(340);
    expect(photo.rect.height).toBe(card.rect.height);
    expect(image.rect.width).toBe(photo.rect.width);
    expect(image.rect.height).toBe(photo.rect.height);
    expect(info.rect.x).toBe(photo.rect.width + 32);
    expect(info.rect.y).toBe(0);
  });

  it('builds staff and partner cards as horizontal photo/info columns', () => {
    const build = createAttorneyProfileSectionNodes('attorney-grid', 0, 'ko', 0);
    const nodesById = new Map(build.nodes.map((node) => [node.id, node]));

    for (const cardId of ['attorney-grid-staff-card-0', 'attorney-grid-partner-card']) {
      const card = nodesById.get(cardId);
      const photo = nodesById.get(`${cardId}-photo`);
      const image = nodesById.get(`${cardId}-photo-image`);
      const info = nodesById.get(`${cardId}-info`);

      expect(card, cardId).toBeDefined();
      expect(photo, `${cardId}-photo`).toBeDefined();
      expect(image, `${cardId}-photo-image`).toBeDefined();
      expect(info, `${cardId}-info`).toBeDefined();
      if (!card || !photo || !image || !info) continue;

      expect(photo.rect.x).toBe(0);
      expect(photo.rect.y).toBe(0);
      expect(photo.rect.width).toBe(180);
      expect(photo.rect.height).toBe(card.rect.height);
      expect(image.rect.width).toBe(photo.rect.width);
      expect(image.rect.height).toBe(photo.rect.height);
      expect(info.rect.x).toBe(photo.rect.width + 20);
      expect(info.rect.y).toBe(0);
      if (cardId === 'attorney-grid-partner-card') {
        expect(info.rect.width).toBe(card.rect.width - info.rect.x - 38);
      } else {
        expect(info.rect.width).toBe(card.rect.width - info.rect.x);
      }
      expect(card.rect.height).toBeGreaterThanOrEqual(info.rect.height);
      expect(card.rect.height).toBeLessThan(650);
    }
  });

  it('keeps the partner accountant card full-width on desktop', () => {
    const build = createAttorneyProfileSectionNodes('attorney-grid', 0, 'ko', 0);
    const nodesById = new Map(build.nodes.map((node) => [node.id, node]));

    const partnerCard = nodesById.get('attorney-grid-partner-card');

    expect(partnerCard).toBeDefined();
    expect(partnerCard?.rect.width).toBe(PAGE_CONTAINER_WIDTH);
  });

  it('keeps right-column staff card descendants card-relative', () => {
    const build = createAttorneyProfileSectionNodes('attorney-grid', 0, 'ko', 0);
    const nodesById = new Map(build.nodes.map((node) => [node.id, node]));

    const grid = nodesById.get('attorney-grid-staff-grid');
    const leftCard = nodesById.get('attorney-grid-staff-card-0');
    const rightCard = nodesById.get('attorney-grid-staff-card-1');

    expect(grid).toBeDefined();
    expect(leftCard).toBeDefined();
    expect(rightCard).toBeDefined();
    if (!grid || !leftCard || !rightCard) return;

    expect(leftCard.parentId).toBe(grid.id);
    expect(rightCard.parentId).toBe(grid.id);
    expect(rightCard.rect.x).toBeGreaterThan(leftCard.rect.x);

    const gridLevelStaffCards = build.nodes.filter((node) => (
      node.parentId === grid.id && /^attorney-grid-staff-card-\d+$/.test(node.id)
    ));
    expect(gridLevelStaffCards).toHaveLength(2);

    const sharedDescendantSuffixes = ['photo', 'info', 'role', 'email', 'actions'] as const;
    for (const suffix of sharedDescendantSuffixes) {
      const leftDescendant = nodesById.get(`${leftCard.id}-${suffix}`);
      const rightDescendant = nodesById.get(`${rightCard.id}-${suffix}`);
      expect(leftDescendant, `${leftCard.id}-${suffix}`).toBeDefined();
      expect(rightDescendant, `${rightCard.id}-${suffix}`).toBeDefined();
      if (!leftDescendant || !rightDescendant) continue;

      expect(rightDescendant.parentId).not.toBe(grid.id);
      expect(rightDescendant.rect.x).toBe(leftDescendant.rect.x);
      expect(rightDescendant.rect.x).toBeLessThan(rightCard.rect.x);
    }
  });

  it('keeps generated mobile attorney cards stacked and compact', () => {
    const document = STANDARD_PAGE_DECOMPOSERS.lawyers('ko');
    const nodesById = new Map(document.nodes.map((node) => [node.id, node]));

    const leadCard = nodesById.get('page-lawyers-lead-card');
    const leadPhoto = nodesById.get('page-lawyers-lead-card-photo');
    const leadInfo = nodesById.get('page-lawyers-lead-card-info');
    const staffCard = nodesById.get('page-lawyers-staff-card-0');
    const staffPhoto = nodesById.get('page-lawyers-staff-card-0-photo');
    const staffInfo = nodesById.get('page-lawyers-staff-card-0-info');
    const secondStaffCard = nodesById.get('page-lawyers-staff-card-1');
    const attorneyRoot = nodesById.get('page-lawyers-attorney-root');

    expect(leadCard?.responsive?.mobile?.rect?.height).toBeGreaterThan(600);
    expect(leadPhoto?.responsive?.mobile?.rect).toMatchObject({
      x: 0,
      y: 0,
      width: leadCard?.responsive?.mobile?.rect?.width,
    });
    expect(leadPhoto?.responsive?.mobile?.rect?.height).toBeGreaterThan(360);
    expect(leadInfo?.responsive?.mobile?.rect?.y).toBe(leadPhoto?.responsive?.mobile?.rect?.height);

    expect(staffPhoto?.responsive?.mobile?.rect).toMatchObject({
      x: 0,
      y: 0,
      width: staffCard?.responsive?.mobile?.rect?.width,
    });
    expect(staffPhoto?.responsive?.mobile?.rect?.height).toBeGreaterThan(300);
    expect(staffInfo?.responsive?.mobile?.rect?.y).toBe(staffPhoto?.responsive?.mobile?.rect?.height);
    expect(secondStaffCard?.responsive?.mobile?.rect?.y).toBeGreaterThan(
      (staffCard?.responsive?.mobile?.rect?.height ?? 0) + 16,
    );
    expect(attorneyRoot?.responsive?.mobile?.rect?.height).toBeLessThan(4400);
  });

  it('keeps generated tablet attorney cards stacked with full-height photos', () => {
    const document = STANDARD_PAGE_DECOMPOSERS.lawyers('ko');
    const nodesById = new Map(document.nodes.map((node) => [node.id, node]));

    const leadCard = nodesById.get('page-lawyers-lead-card');
    const leadPhoto = nodesById.get('page-lawyers-lead-card-photo');
    const leadInfo = nodesById.get('page-lawyers-lead-card-info');
    const staffCard = nodesById.get('page-lawyers-staff-card-0');
    const staffPhoto = nodesById.get('page-lawyers-staff-card-0-photo');
    const staffInfo = nodesById.get('page-lawyers-staff-card-0-info');
    const secondStaffCard = nodesById.get('page-lawyers-staff-card-1');
    const partnerCard = nodesById.get('page-lawyers-partner-card');
    const partnerPhoto = nodesById.get('page-lawyers-partner-card-photo');
    const partnerInfo = nodesById.get('page-lawyers-partner-card-info');
    const attorneyRoot = nodesById.get('page-lawyers-attorney-root');

    expect(leadCard?.responsive?.tablet?.rect?.width).toBe(720);
    expect(leadPhoto?.responsive?.tablet?.rect).toMatchObject({
      x: 0,
      y: 0,
      width: leadCard?.responsive?.tablet?.rect?.width,
    });
    expect(leadPhoto?.responsive?.tablet?.rect?.height).toBeGreaterThan(400);
    expect(leadInfo?.responsive?.tablet?.rect?.y).toBe(leadPhoto?.responsive?.tablet?.rect?.height);

    expect(staffPhoto?.responsive?.tablet?.rect).toMatchObject({
      x: 0,
      y: 0,
      width: staffCard?.responsive?.tablet?.rect?.width,
    });
    expect(staffPhoto?.responsive?.tablet?.rect?.height).toBeGreaterThan(360);
    expect(staffInfo?.responsive?.tablet?.rect?.y).toBe(staffPhoto?.responsive?.tablet?.rect?.height);
    expect(secondStaffCard?.responsive?.tablet?.rect?.y).toBeGreaterThan(
      (staffCard?.responsive?.tablet?.rect?.height ?? 0) + 20,
    );

    expect(partnerPhoto?.responsive?.tablet?.rect).toMatchObject({
      x: 0,
      y: 0,
      width: partnerCard?.responsive?.tablet?.rect?.width,
    });
    expect(partnerPhoto?.responsive?.tablet?.rect?.height).toBeGreaterThan(360);
    expect(partnerInfo?.responsive?.tablet?.rect?.y).toBe(partnerPhoto?.responsive?.tablet?.rect?.height);
    expect(attorneyRoot?.responsive?.tablet?.rect?.height).toBeLessThan(5200);
  });
});
