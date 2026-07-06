'use client';

import type { BuilderComponentInspectorProps } from '../define';
import LinkPicker from '@/components/builder/editor/LinkPicker';
import type { BuilderImageCanvasNode } from '@/lib/builder/canvas/types';
import type { LinkValue } from '@/lib/builder/links';
import { getImageEditCopy } from './image-edit-copy';
import styles from './ImageInspector.module.css';

function hotspotsToText(hotspots: BuilderImageCanvasNode['content']['hotspots']): string {
  return (hotspots ?? [])
    .map((hotspot) => `${hotspot.x}, ${hotspot.y}, ${hotspot.label}${hotspot.href ? `, ${hotspot.href}` : ''}`)
    .join('\n');
}

function parseHotspots(value: string): BuilderImageCanvasNode['content']['hotspots'] | undefined {
  type Hotspot = NonNullable<BuilderImageCanvasNode['content']['hotspots']>[number];
  const hotspots: Hotspot[] = [];
  for (const rawLine of value.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const [xValue, yValue, labelValue, hrefValue] = line.split(',').map((part) => part.trim());
    const x = Number(xValue);
    const y = Number(yValue);
    if (!Number.isFinite(x) || !Number.isFinite(y) || !labelValue) continue;
    hotspots.push({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
      label: labelValue.slice(0, 120),
      ...(hrefValue ? { href: hrefValue } : {}),
    });
  }
  return hotspots.length > 0 ? hotspots.slice(0, 12) : undefined;
}

export default function ImageInspector({
  node,
  locale,
  onUpdate,
  disabled = false,
  onRequestAssetLibrary,
  onRequestImageEditor,
  linkPickerContext,
}: BuilderComponentInspectorProps) {
  const imageNode = node as BuilderImageCanvasNode;
  const compare = imageNode.content.compare;
  const svg = imageNode.content.svg;
  const copy = getImageEditCopy(locale);

  return (
    <div className={styles.root} data-builder-image-inspector="true">
      <div className={styles.actionRow}>
        <button
          type="button"
          className={styles.actionButton}
          disabled={disabled || !onRequestAssetLibrary}
          onClick={() => onRequestAssetLibrary?.()}
        >
          {copy.inspector.openAssetLibrary}
        </button>
        <button
          type="button"
          className={styles.actionButton}
          disabled={disabled || !imageNode.content.src}
          onClick={() => onRequestImageEditor?.()}
        >
          {copy.inspector.openImageEditor}
        </button>
      </div>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.sourceUrl}</span>
        <input
          type="text"
          value={imageNode.content.src}
          disabled={disabled}
          placeholder={copy.inspector.sourceUrlPlaceholder}
          className={styles.control}
          onChange={(event) => onUpdate({ src: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.altText}</span>
        <input
          type="text"
          value={imageNode.content.alt}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ alt: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.fit}</span>
        <select
          value={imageNode.content.fit}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ fit: event.target.value })}
        >
          <option value="cover">{copy.inspector.fitCover}</option>
          <option value="contain">{copy.inspector.fitContain}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.clickAction}</span>
        <select
          value={imageNode.content.clickAction ?? 'none'}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ clickAction: event.target.value })}
        >
          <option value="none">{copy.inspector.none}</option>
          <option value="link">{copy.inspector.link}</option>
          <option value="lightbox">{copy.inspector.lightbox}</option>
          <option value="popup">{copy.inspector.popup}</option>
        </select>
      </label>
      <div className={styles.linkSection}>
        <span className={styles.sectionLabel}>{copy.inspector.link}</span>
        <LinkPicker
          value={(imageNode.content.link ?? null) as LinkValue | null}
          onChange={(link) => onUpdate({ link: link ?? undefined })}
          context={linkPickerContext}
          disabled={disabled}
          locale={locale}
        />
      </div>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>{copy.inspector.mediaInteractions}</legend>
        <label className={styles.field}>
          <span className={styles.label}>{copy.inspector.hoverSwapImage}</span>
          <input
            type="text"
            value={imageNode.content.hoverSrc ?? ''}
            disabled={disabled}
            placeholder={copy.inspector.hoverSwapImagePlaceholder}
            className={styles.control}
            onChange={(event) => onUpdate({ hoverSrc: event.target.value || undefined })}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>{copy.inspector.hotspots}</span>
          <textarea
            rows={3}
            value={hotspotsToText(imageNode.content.hotspots)}
            disabled={disabled}
            placeholder={copy.inspector.hotspotsPlaceholder}
            className={`${styles.control} ${styles.textarea}`}
            onChange={(event) => onUpdate({ hotspots: parseHotspots(event.target.value) })}
          />
        </label>
      </fieldset>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>{copy.inspector.beforeAfter}</legend>
        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={Boolean(compare?.enabled)}
            disabled={disabled}
            onChange={(event) =>
              onUpdate({
                compare: event.target.checked
                  ? {
                    enabled: true,
                    beforeSrc: compare?.beforeSrc || imageNode.content.src,
                    afterSrc: compare?.afterSrc || imageNode.content.hoverSrc || imageNode.content.src,
                    position: compare?.position ?? 50,
                  }
                  : undefined,
              })
            }
          />
          <span>{copy.inspector.enableCompareSlider}</span>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>{copy.inspector.beforeImage}</span>
          <input
            type="text"
            value={compare?.beforeSrc ?? ''}
            disabled={disabled || !compare?.enabled}
            className={styles.control}
            onChange={(event) =>
              onUpdate({ compare: { enabled: true, beforeSrc: event.target.value, afterSrc: compare?.afterSrc || imageNode.content.src, position: compare?.position ?? 50 } })
            }
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>{copy.inspector.afterImage}</span>
          <input
            type="text"
            value={compare?.afterSrc ?? ''}
            disabled={disabled || !compare?.enabled}
            className={styles.control}
            onChange={(event) =>
              onUpdate({ compare: { enabled: true, beforeSrc: compare?.beforeSrc || imageNode.content.src, afterSrc: event.target.value, position: compare?.position ?? 50 } })
            }
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>{copy.inspector.position} {compare?.position ?? 50}%</span>
          <input
            type="range"
            min={5}
            max={95}
            value={compare?.position ?? 50}
            disabled={disabled || !compare?.enabled}
            className={styles.range}
            onChange={(event) =>
              onUpdate({ compare: { enabled: true, beforeSrc: compare?.beforeSrc || imageNode.content.src, afterSrc: compare?.afterSrc || imageNode.content.src, position: Number(event.target.value) } })
            }
          />
        </label>
      </fieldset>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>{copy.inspector.svgGif}</legend>
        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={Boolean(svg?.enabled)}
            disabled={disabled}
            onChange={(event) =>
              onUpdate({
                svg: event.target.checked
                  ? { enabled: true, name: svg?.name ?? 'scales', color: svg?.color ?? { kind: 'token', token: 'primary' } }
                  : undefined,
              })
            }
          />
          <span>{copy.inspector.inlineSvgIcon}</span>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>{copy.inspector.svgShape}</span>
          <select
            value={svg?.name ?? 'scales'}
            disabled={disabled || !svg?.enabled}
            className={styles.control}
            onChange={(event) => onUpdate({ svg: { enabled: true, name: event.target.value, color: svg?.color ?? { kind: 'token', token: 'primary' } } })}
          >
            <option value="scales">{copy.inspector.svgShapes.scales}</option>
            <option value="shield">{copy.inspector.svgShapes.shield}</option>
            <option value="building">{copy.inspector.svgShapes.building}</option>
            <option value="spark">{copy.inspector.svgShapes.spark}</option>
            <option value="service-0">{copy.inspector.svgShapes['service-0']}</option>
            <option value="service-1">{copy.inspector.svgShapes['service-1']}</option>
            <option value="service-2">{copy.inspector.svgShapes['service-2']}</option>
            <option value="service-3">{copy.inspector.svgShapes['service-3']}</option>
            <option value="service-4">{copy.inspector.svgShapes['service-4']}</option>
            <option value="service-5">{copy.inspector.svgShapes['service-5']}</option>
            <option value="pricing-consultation">{copy.inspector.svgShapes['pricing-consultation']}</option>
            <option value="pricing-litigation">{copy.inspector.svgShapes['pricing-litigation']}</option>
            <option value="pricing-company">{copy.inspector.svgShapes['pricing-company']}</option>
            <option value="pricing-retainer">{copy.inspector.svgShapes['pricing-retainer']}</option>
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>{copy.inspector.svgColor}</span>
          <input
            type="text"
            value={typeof svg?.color === 'string' ? svg.color : ''}
            disabled={disabled || !svg?.enabled}
            placeholder={copy.inspector.svgColorPlaceholder}
            className={styles.control}
            onChange={(event) => onUpdate({ svg: { enabled: true, name: svg?.name ?? 'scales', color: event.target.value || { kind: 'token', token: 'primary' } } })}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>{copy.inspector.gifProvider}</span>
          <select
            value={imageNode.content.gif?.provider ?? 'manual'}
            disabled={disabled}
            className={styles.control}
            onChange={(event) => onUpdate({ gif: { provider: event.target.value, query: imageNode.content.gif?.query || undefined } })}
          >
            <option value="manual">{copy.inspector.manualGifUrl}</option>
            <option value="giphy">{copy.inspector.giphySearchNote}</option>
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>{copy.inspector.gifSearchQuery}</span>
          <input
            type="text"
            value={imageNode.content.gif?.query ?? ''}
            disabled={disabled}
            placeholder={copy.inspector.gifSearchQueryPlaceholder}
            className={styles.control}
            onChange={(event) => onUpdate({ gif: { provider: imageNode.content.gif?.provider ?? 'manual', query: event.target.value || undefined } })}
          />
        </label>
      </fieldset>
      {imageNode.content.cropAspect && imageNode.content.cropAspect !== 'Free' && (
        <div className={styles.cropNotice}>
          {copy.inspector.cropLabel} {imageNode.content.cropAspect}
        </div>
      )}
    </div>
  );
}
