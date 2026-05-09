'use client';

import type { Ref, RefObject } from 'react';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import {
  getOfficeLocationPresets,
  googleMapsSearchUrl,
  labelValueAfterColon,
  readNodeText,
  type OfficeLocationPreset,
} from '@/lib/builder/canvas/office-locations';
import {
  BLOG_FEED_LAYOUT_PRESETS,
  currentBuilderLocale,
  type BlogFeedLayoutPreset,
  type HeroSearchDestination,
} from './canvasNodeUtils';
import styles from './CanvasNodeQuickPanels.module.css';

type SectionTemplateTarget = {
  id: string;
  label: string;
};

type SectionTemplateVariantOption = {
  key: string;
  label: string;
  description: string;
};

type HeroSearchLayout = 'left' | 'center' | 'wide';

type CanvasNodeQuickPanelsProps = {
  nodeId: string;
  selected: boolean;
  showSectionTemplateActions: boolean;
  sectionTemplate: SectionTemplateTarget | null;
  sectionTemplateVariants: SectionTemplateVariantOption[];
  currentSectionTemplateVariant: string;
  onSectionTemplateVariantChange: (variantKey: string) => void;
  showBlogFeedQuickEdit: boolean;
  blogFeedLayout: BlogFeedLayoutPreset['key'];
  onBlogFeedLayoutChange: (preset: BlogFeedLayoutPreset) => void;
  showColumnQuickActions: boolean;
  showHeroSearchQuickEdit: boolean;
  heroSearchLayout: HeroSearchLayout;
  onHeroSearchLayoutChange: (layout: HeroSearchLayout) => void;
  heroSearchPlaceholder: string;
  onHeroSearchPlaceholderChange: (value: string) => void;
  heroSearchAction: string;
  onHeroSearchActionChange: (value: string) => void;
  heroSearchDestinationOptions: HeroSearchDestination[];
  showMapEditHint: boolean;
  showMapQuickEdit: boolean;
  officeQuickEdit: boolean;
  builderLocale: string;
  currentMapAddress: string;
  currentMapZoom: number;
  mapQuickAddressDraft: string;
  setMapQuickAddressDraft: (value: string) => void;
  mapQuickAddressRef: RefObject<HTMLTextAreaElement | null>;
  onSelect: (nodeId: string, additive: boolean) => void;
  applyMapPreset: (preset: OfficeLocationPreset) => void;
  updateMapAddress: (nextAddress: string, nextMapsUrl?: string) => void;
  updateMapZoom: (nextZoom: number) => void;
  officeTitleNode?: BuilderCanvasNode;
  officePhoneNode?: BuilderCanvasNode;
  officeFaxNode?: BuilderCanvasNode;
  officeMapLinkNode?: BuilderCanvasNode;
  officePhoneLabel: string;
  officeFaxLabel: string;
  officeMapUrl: string;
  updateOfficeTitle: (nextTitle: string) => void;
  updateOfficePhone: (nextPhone: string) => void;
  updateOfficeFax: (nextFax: string) => void;
  updateOfficeMapUrl: (nextUrl: string) => void;
};

export function CanvasNodeQuickPanels({
  nodeId,
  selected,
  showSectionTemplateActions,
  sectionTemplate,
  sectionTemplateVariants,
  currentSectionTemplateVariant,
  onSectionTemplateVariantChange,
  showBlogFeedQuickEdit,
  blogFeedLayout,
  onBlogFeedLayoutChange,
  showColumnQuickActions,
  showHeroSearchQuickEdit,
  heroSearchLayout,
  onHeroSearchLayoutChange,
  heroSearchPlaceholder,
  onHeroSearchPlaceholderChange,
  heroSearchAction,
  onHeroSearchActionChange,
  heroSearchDestinationOptions,
  showMapEditHint,
  showMapQuickEdit,
  officeQuickEdit,
  builderLocale,
  currentMapAddress,
  currentMapZoom,
  mapQuickAddressDraft,
  setMapQuickAddressDraft,
  mapQuickAddressRef,
  onSelect,
  applyMapPreset,
  updateMapAddress,
  updateMapZoom,
  officeTitleNode,
  officePhoneNode,
  officeFaxNode,
  officeMapLinkNode,
  officePhoneLabel,
  officeFaxLabel,
  officeMapUrl,
  updateOfficeTitle,
  updateOfficePhone,
  updateOfficeFax,
  updateOfficeMapUrl,
}: CanvasNodeQuickPanelsProps) {
  return (
    <>
      {showSectionTemplateActions && sectionTemplate ? (
        <div
          className={styles.nodeSectionTemplates}
          data-builder-section-template-panel={sectionTemplate.id}
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <span className={styles.nodeSectionTemplateLabel}>{sectionTemplate.label} template</span>
          {sectionTemplateVariants.map((variant) => (
            <button
              key={variant.key}
              type="button"
              title={variant.description}
              className={`${styles.nodeSectionTemplateButton} ${
                currentSectionTemplateVariant === variant.key ? styles.nodeSectionTemplateButtonActive : ''
              }`}
              aria-pressed={currentSectionTemplateVariant === variant.key}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onSectionTemplateVariantChange(variant.key);
              }}
            >
              {variant.label}
            </button>
          ))}
        </div>
      ) : null}

      {showBlogFeedQuickEdit ? (
        <div
          className={styles.nodeBlogFeedQuickEdit}
          data-builder-blog-feed-quick-edit="true"
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <span className={styles.nodeBlogFeedQuickLabel}>Feed layout</span>
          {BLOG_FEED_LAYOUT_PRESETS.map((preset) => (
            <button
              key={preset.key}
              type="button"
              aria-pressed={blogFeedLayout === preset.key}
              className={blogFeedLayout === preset.key ? styles.nodeBlogFeedQuickActive : undefined}
              onClick={() => onBlogFeedLayoutChange(preset)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      ) : null}

      {showColumnQuickActions ? (
        <div
          className={styles.nodeQuickActions}
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <button
            type="button"
            className={styles.nodeQuickActionPrimary}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              window.location.href = `/${currentBuilderLocale()}/admin-builder/columns`;
            }}
          >
            글 추가/수정
          </button>
          <button
            type="button"
            className={styles.nodeQuickAction}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              window.location.href = `/${currentBuilderLocale()}/admin-builder/columns?new=1`;
            }}
          >
            새 글
          </button>
          <button
            type="button"
            className={styles.nodeQuickAction}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              window.open(`/${currentBuilderLocale()}/columns`, '_blank', 'noopener,noreferrer');
            }}
          >
            공개 보기
          </button>
        </div>
      ) : null}

      {showHeroSearchQuickEdit ? (
        <div
          className={styles.nodeHeroSearchQuickEdit}
          data-builder-hero-search-quick-edit="true"
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.stopPropagation();
          }}
          onKeyDown={(event) => {
            event.stopPropagation();
          }}
        >
          <div className={styles.nodeHeroSearchHeader}>
            <div>
              <span>Hero search</span>
              <strong>검색창 편집</strong>
            </div>
          </div>
          <div className={styles.nodeHeroSearchPresetRow}>
            {([
              ['left', 'Left'],
              ['center', 'Center'],
              ['wide', 'Wide'],
            ] as const).map(([layout, label]) => (
              <button
                key={layout}
                type="button"
                aria-pressed={heroSearchLayout === layout}
                className={heroSearchLayout === layout ? styles.nodeHeroSearchPresetActive : undefined}
                onClick={() => onHeroSearchLayoutChange(layout)}
              >
                {label}
              </button>
            ))}
          </div>
          <label className={styles.nodeHeroSearchField}>
            <span>Placeholder</span>
            <input
              type="text"
              aria-label="Hero search placeholder"
              value={heroSearchPlaceholder}
              onChange={(event) => onHeroSearchPlaceholderChange(event.currentTarget.value)}
            />
          </label>
          <label className={styles.nodeHeroSearchField}>
            <span>Search URL</span>
            <input
              type="text"
              aria-label="Hero search action"
              value={heroSearchAction}
              onChange={(event) => onHeroSearchActionChange(event.currentTarget.value)}
            />
          </label>
          <div className={styles.nodeHeroSearchDestinationRow} aria-label="Hero search destination presets">
            {heroSearchDestinationOptions.map((destination) => (
              <button
                key={destination.key}
                type="button"
                aria-pressed={heroSearchAction === destination.action}
                className={heroSearchAction === destination.action ? styles.nodeHeroSearchPresetActive : undefined}
                onClick={() => onHeroSearchActionChange(destination.action)}
              >
                {destination.label}
              </button>
            ))}
          </div>
          <div className={styles.nodeHeroSearchNote}>검색창, 버튼, 펼침 메뉴 폭을 함께 조정합니다.</div>
        </div>
      ) : null}

      {showMapEditHint ? (
        <div
          className={styles.nodeMapEditHint}
          data-builder-map-edit-hint="true"
          aria-hidden
        >
          <span>Google Map</span>
          <strong>위치 변경</strong>
        </div>
      ) : null}

      {showMapQuickEdit ? (
        <div
          className={`${styles.nodeMapQuickEdit} ${officeQuickEdit ? styles.nodeMapQuickEditSynced : ''}`}
          data-builder-map-quick-edit="true"
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.stopPropagation();
          }}
          onKeyDown={(event) => {
            event.stopPropagation();
          }}
        >
          <div className={styles.nodeMapQuickEditHeader}>
            <div>
              <span>Google Map</span>
              <strong>{officeQuickEdit ? '사무소 위치 편집' : '위치 편집'}</strong>
            </div>
            <button
              type="button"
              className={styles.nodeMapHeaderAction}
              aria-label="Focus quick location field"
              onClick={() => {
                mapQuickAddressRef.current?.focus();
                mapQuickAddressRef.current?.select();
              }}
            >
              위치 변경
            </button>
          </div>
          <div className={styles.nodeMapPresetGrid}>
            {getOfficeLocationPresets(builderLocale).map((preset) => (
              <button
                key={preset.title}
                type="button"
                className={`${styles.nodeMapPresetButton} ${
                  currentMapAddress === preset.address ? styles.nodeMapPresetButtonActive : ''
                }`}
                aria-pressed={currentMapAddress === preset.address}
                onClick={() => {
                  if (!selected) onSelect(nodeId, false);
                  setMapQuickAddressDraft(preset.address);
                  applyMapPreset(preset);
                  window.requestAnimationFrame(() => mapQuickAddressRef.current?.focus());
                }}
              >
                {preset.title}
              </button>
            ))}
          </div>
          {officeQuickEdit ? (
            <label className={styles.nodeMapAddressField}>
              <span>사무소명</span>
              <input
                type="text"
                aria-label="Map quick location title"
                value={readNodeText(officeTitleNode)}
                disabled={!officeTitleNode}
                onChange={(event) => updateOfficeTitle(event.currentTarget.value)}
              />
            </label>
          ) : null}
          <label className={styles.nodeMapAddressField}>
            <span>주소</span>
            <textarea
              ref={mapQuickAddressRef as Ref<HTMLTextAreaElement>}
              aria-label="Map quick address"
              rows={2}
              value={mapQuickAddressDraft}
              placeholder="주소 또는 지역명"
              onChange={(event) => {
                setMapQuickAddressDraft(event.currentTarget.value);
              }}
              onBlur={(event) => {
                const nextTarget = event.relatedTarget;
                const quickEditRoot = event.currentTarget.closest('[data-builder-map-quick-edit="true"]');
                if (nextTarget instanceof Node && quickEditRoot?.contains(nextTarget)) return;
                updateMapAddress(event.currentTarget.value);
              }}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' || event.shiftKey) return;
                event.preventDefault();
                updateMapAddress(event.currentTarget.value);
                event.currentTarget.blur();
              }}
            />
          </label>
          {officeQuickEdit ? (
            <>
              <label className={styles.nodeMapAddressField}>
                <span>전화</span>
                <input
                  type="text"
                  aria-label="Map quick office phone"
                  value={labelValueAfterColon(officePhoneLabel)}
                  disabled={!officePhoneNode}
                  onChange={(event) => updateOfficePhone(event.currentTarget.value)}
                />
              </label>
              {officeFaxNode ? (
                <label className={styles.nodeMapAddressField}>
                  <span>팩스</span>
                  <input
                    type="text"
                    aria-label="Map quick office fax"
                    value={labelValueAfterColon(officeFaxLabel)}
                    onChange={(event) => updateOfficeFax(event.currentTarget.value)}
                  />
                </label>
              ) : null}
              <label className={styles.nodeMapAddressField}>
                <span>Google 지도 링크</span>
                <input
                  type="url"
                  aria-label="Map quick Google Maps URL"
                  value={officeMapUrl}
                  disabled={!officeMapLinkNode}
                  onChange={(event) => updateOfficeMapUrl(event.currentTarget.value)}
                />
              </label>
            </>
          ) : null}
          <button
            type="button"
            className={styles.nodeMapApplyButton}
            onClick={() => {
              const nextAddress = mapQuickAddressRef.current?.value ?? mapQuickAddressDraft;
              setMapQuickAddressDraft(nextAddress);
              updateMapAddress(nextAddress);
              if (officeMapLinkNode) updateOfficeMapUrl(googleMapsSearchUrl(nextAddress));
            }}
          >
            {officeQuickEdit ? '주소로 지도 업데이트' : '위치 적용'}
          </button>
          <label className={styles.nodeMapZoomField}>
            <span>줌 {currentMapZoom}</span>
            <div className={styles.nodeMapZoomRow}>
              <button
                type="button"
                aria-label="Decrease quick map zoom"
                disabled={currentMapZoom <= 1}
                onClick={() => updateMapZoom(currentMapZoom - 1)}
              >
                -
              </button>
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                aria-label="Map quick zoom"
                value={currentMapZoom}
                onInput={(event) => updateMapZoom(Number(event.currentTarget.value))}
                onChange={(event) => updateMapZoom(Number(event.target.value))}
              />
              <button
                type="button"
                aria-label="Increase quick map zoom"
                disabled={currentMapZoom >= 20}
                onClick={() => updateMapZoom(currentMapZoom + 1)}
              >
                +
              </button>
            </div>
          </label>
          {officeQuickEdit ? (
            <div className={styles.nodeMapSyncNote}>지도, 주소 카드, 길찾기 링크 동시 변경</div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
