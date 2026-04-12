import { defineComponent } from '../define';

interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryContent {
  images: GalleryImage[];
  columns: number;
  gap: number;
}

function GalleryRender({ node }: { node: { content: GalleryContent } }) {
  const { images = [], columns = 3, gap = 8 } = node.content;

  if (!images.length) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap,
          width: '100%',
          height: '100%',
        }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            style={{
              background: '#f1f5f9',
              border: '2px dashed #cbd5e1',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              fontSize: 13,
              minHeight: 120,
            }}
          >
            Image
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
        width: '100%',
        height: '100%',
      }}
    >
      {images.map((img, i) => (
        <div
          key={i}
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 8,
            background: '#f1f5f9',
          }}
        >
          <img
            src={img.src}
            alt={img.alt || ''}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default defineComponent({
  kind: 'gallery',
  displayName: 'gallery',
  category: 'media',
  icon: '◻',
  defaultContent: {
    images: [] as GalleryImage[],
    columns: 3,
    gap: 8,
  },
  defaultStyle: {},
  defaultRect: { width: 300, height: 200 },
  Render: GalleryRender,
});
