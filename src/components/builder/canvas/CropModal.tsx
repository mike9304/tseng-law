'use client';

import { useEffect, useState } from 'react';
import { ASPECT_RATIOS } from '@/lib/builder/canvas/crop';
import ModalShell from './ModalShell';

const imageContainerStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  maxHeight: 340,
  borderRadius: 10,
  overflow: 'hidden',
  background: '#f1f5f9',
  marginTop: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const imageStyle: React.CSSProperties = {
  maxWidth: '100%',
  maxHeight: 320,
  objectFit: 'contain',
  display: 'block',
};

const ratioRowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
  marginTop: 16,
};

function ratioButtonStyle(active: boolean): React.CSSProperties {
  return {
    padding: '6px 14px',
    borderRadius: 8,
    border: active ? '2px solid #123b63' : '1px solid #cbd5e1',
    background: active ? '#eff6ff' : '#fff',
    color: active ? '#123b63' : '#334155',
    fontSize: '0.82rem',
    fontWeight: active ? 700 : 500,
    cursor: 'pointer',
    transition: 'all 150ms ease',
  };
}

const cancelButtonStyle: React.CSSProperties = {
  padding: '8px 18px',
  borderRadius: 8,
  border: '1px solid #cbd5e1',
  background: '#fff',
  color: '#334155',
  fontSize: '0.85rem',
  fontWeight: 600,
  cursor: 'pointer',
};

const confirmButtonStyle: React.CSSProperties = {
  padding: '8px 20px',
  borderRadius: 8,
  border: 'none',
  background: '#123b63',
  color: '#fff',
  fontSize: '0.85rem',
  fontWeight: 600,
  cursor: 'pointer',
};

export default function CropModal({
  open,
  imageSrc,
  currentAspect,
  onConfirm,
  onClose,
}: {
  open: boolean;
  imageSrc: string;
  currentAspect: string;
  onConfirm: (aspect: string) => void;
  onClose: () => void;
}) {
  const [selectedAspect, setSelectedAspect] = useState<string>(currentAspect || 'Free');

  useEffect(() => {
    if (open) {
      setSelectedAspect(currentAspect || 'Free');
    }
  }, [open, currentAspect]);

  if (!open) return null;

  // Compute aspect ratio for preview overlay
  const selectedRatio = ASPECT_RATIOS.find((r) => r.label === selectedAspect);
  const ratioValue = selectedRatio?.value ?? null;

  return (
    <ModalShell
      title="Crop Image"
      description="Choose a preview aspect ratio for this image."
      ariaLabel="Crop Image"
      size="sm"
      onClose={onClose}
      footer={(
        <>
          <button type="button" style={cancelButtonStyle} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            style={confirmButtonStyle}
            onClick={() => onConfirm(selectedAspect)}
          >
            Apply
          </button>
        </>
      )}
    >
          <div style={imageContainerStyle}>
            {imageSrc ? (
              <div style={{ position: 'relative' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageSrc} alt="Crop preview" style={imageStyle} />
                {ratioValue && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    <div
                      style={{
                        border: '2px dashed rgba(18, 59, 99, 0.6)',
                        background: 'rgba(18, 59, 99, 0.08)',
                        borderRadius: 4,
                        aspectRatio: `${ratioValue}`,
                        maxWidth: '90%',
                        maxHeight: '90%',
                        width: ratioValue >= 1 ? '90%' : 'auto',
                        height: ratioValue < 1 ? '90%' : 'auto',
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>No image</span>
            )}
          </div>

          <div style={{ marginTop: 14, fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Aspect Ratio
          </div>
          <div style={ratioRowStyle}>
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio.label}
                type="button"
                style={ratioButtonStyle(selectedAspect === ratio.label)}
                onClick={() => setSelectedAspect(ratio.label)}
              >
                {ratio.label}
              </button>
            ))}
          </div>
    </ModalShell>
  );
}
