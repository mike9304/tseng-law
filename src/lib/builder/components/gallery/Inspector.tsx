import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderGalleryCanvasNode } from '@/lib/builder/canvas/types';
import { getContainerGalleryCopy } from '../container-gallery-copy';
import styles from './GalleryInspector.module.css';

function parseTags(value: string): string[] | undefined {
  const tags = value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 8);
  return tags.length ? tags : undefined;
}

function formatTags(tags: string[] | undefined): string {
  return (tags ?? []).join(', ');
}

export default function GalleryInspector({ node, locale, onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const galleryNode = node as BuilderGalleryCanvasNode;
  const images = galleryNode.content.images ?? [];
  const copy = getContainerGalleryCopy(locale ?? 'en');

  const updateImage = (
    index: number,
    patch: { src?: string; alt?: string; caption?: string; tags?: string[] },
  ) => {
    const next = [...images];
    next[index] = { ...next[index], ...patch };
    onUpdate({ images: next });
  };

  const addImage = () => onUpdate({ images: [...images, { src: '', alt: '', caption: '', tags: [] }] });
  const removeImage = (index: number) => onUpdate({ images: images.filter((_, i) => i !== index) });
  const availableTags = Array.from(new Set(images.flatMap((image) => image.tags ?? []))).filter(Boolean);

  return (
    <div className={styles.root} data-builder-gallery-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.gallery.layout}</span>
        <select
          className={styles.control}
          value={galleryNode.content.layout}
          disabled={disabled}
          onChange={(event) => onUpdate({ layout: event.target.value })}
        >
          <option value="grid">{copy.gallery.layoutOptions.grid}</option>
          <option value="masonry">{copy.gallery.layoutOptions.masonry}</option>
          <option value="slider">{copy.gallery.layoutOptions.slider}</option>
          <option value="slideshow">{copy.gallery.layoutOptions.slideshow}</option>
          <option value="thumbnail">{copy.gallery.layoutOptions.thumbnail}</option>
          <option value="pro">{copy.gallery.layoutOptions.pro}</option>
        </select>
      </label>
      <div className={styles.inlineFields}>
        <label className={styles.field}>
          <span className={styles.label}>{copy.gallery.columns} ({galleryNode.content.columns})</span>
          <input
            className={styles.range}
            type="range"
            min={1}
            max={6}
            step={1}
            value={galleryNode.content.columns}
            disabled={disabled}
            onChange={(e) => onUpdate({ columns: Number(e.target.value) })}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>{copy.gallery.gap} ({galleryNode.content.gap}px)</span>
          <input
            className={styles.range}
            type="range"
            min={0}
            max={64}
            step={2}
            value={galleryNode.content.gap}
            disabled={disabled}
            onChange={(e) => onUpdate({ gap: Number(e.target.value) })}
          />
        </label>
      </div>
      <div className={styles.inlineFields}>
        <label className={styles.field}>
          <span className={styles.label}>{copy.gallery.captionMode}</span>
          <select
            className={styles.control}
            value={galleryNode.content.captionMode}
            disabled={disabled || !galleryNode.content.showCaptions}
            onChange={(event) => onUpdate({ captionMode: event.target.value })}
          >
            <option value="below">{copy.gallery.below}</option>
            <option value="overlay">{copy.gallery.overlay}</option>
          </select>
        </label>
        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={galleryNode.content.showCaptions}
            disabled={disabled}
            onChange={(event) => onUpdate({ showCaptions: event.target.checked })}
          />
          <span>{copy.gallery.showCaptions}</span>
        </label>
      </div>
      <div className={styles.inlineFields}>
        <label className={styles.field}>
          <span className={styles.label}>{copy.gallery.filter}</span>
          <select
            className={styles.control}
            value={galleryNode.content.activeFilter}
            disabled={disabled}
            onChange={(event) => onUpdate({ activeFilter: event.target.value })}
          >
            <option value="all">{copy.gallery.all}</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>{copy.gallery.proStyle}</span>
          <select
            className={styles.control}
            value={galleryNode.content.proStyle}
            disabled={disabled || galleryNode.content.layout !== 'pro'}
            onChange={(event) => onUpdate({ proStyle: event.target.value })}
          >
            <option value="clean">{copy.gallery.proStyleOptions.clean}</option>
            <option value="mosaic">{copy.gallery.proStyleOptions.mosaic}</option>
            <option value="editorial">{copy.gallery.proStyleOptions.editorial}</option>
          </select>
        </label>
      </div>
      <div className={styles.inlineFields}>
        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={galleryNode.content.autoplay}
            disabled={disabled || (galleryNode.content.layout !== 'slider' && galleryNode.content.layout !== 'slideshow')}
            onChange={(event) => onUpdate({ autoplay: event.target.checked })}
          />
          <span>{copy.gallery.autoplay}</span>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>{copy.gallery.interval}</span>
          <input
            className={styles.control}
            type="number"
            min={1200}
            max={12000}
            step={200}
            value={galleryNode.content.interval}
            disabled={disabled || !galleryNode.content.autoplay}
            onChange={(event) => onUpdate({ interval: Number(event.target.value) })}
          />
        </label>
      </div>
      <label className={styles.field}>
        <span className={styles.label}>{copy.gallery.thumbnailPosition}</span>
        <select
          className={styles.control}
          value={galleryNode.content.thumbnailPosition}
          disabled={disabled || galleryNode.content.layout !== 'thumbnail'}
          onChange={(event) => onUpdate({ thumbnailPosition: event.target.value })}
        >
            <option value="bottom">{copy.gallery.thumbnailOptions.bottom}</option>
            <option value="right">{copy.gallery.thumbnailOptions.right}</option>
        </select>
      </label>
      <div className={styles.imageList}>
        <span className={styles.sectionLabel}>{copy.gallery.images} ({images.length})</span>
        {images.map((img, i) => (
          <div key={i} className={styles.imageCard}>
            <input
              className={styles.control}
              type="text"
              placeholder={copy.gallery.imageUrl}
              value={img.src}
              disabled={disabled}
              onChange={(e) => updateImage(i, { src: e.target.value })}
            />
            <input
              className={styles.control}
              type="text"
              placeholder={copy.gallery.altText}
              value={img.alt}
              disabled={disabled}
              onChange={(e) => updateImage(i, { alt: e.target.value })}
            />
            <input
              className={styles.control}
              type="text"
              placeholder={copy.gallery.caption}
              value={img.caption ?? ''}
              disabled={disabled}
              onChange={(e) => updateImage(i, { caption: e.target.value })}
            />
            <input
              className={styles.control}
              type="text"
              placeholder={copy.gallery.tags}
              value={formatTags(img.tags)}
              disabled={disabled}
              onChange={(e) => updateImage(i, { tags: parseTags(e.target.value) })}
            />
            <button className={styles.dangerButton} type="button" disabled={disabled} onClick={() => removeImage(i)}>
              {copy.gallery.removeImage}
            </button>
          </div>
        ))}
        <button className={styles.primaryButton} type="button" disabled={disabled} onClick={addImage}>
          + {copy.gallery.addImage}
        </button>
      </div>
    </div>
  );
}
