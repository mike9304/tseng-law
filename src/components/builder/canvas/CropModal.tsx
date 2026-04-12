'use client';

import { useEffect, useState } from 'react';
import { ASPECT_RATIOS } from '@/lib/builder/canvas/crop';

const CROP_KEYFRAMES = `
@keyframes cropBackdropIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes cropModalIn {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}
`;

const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(15, 23, 42, 0.5)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  animation: 'cropBackdropIn 200ms ease',
};

const modalStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 25px 50px rgba(0,0,0,0.18)',
  width: '100%',
  maxWidth: 560,
  maxHeight: '85vh',
  overflow: 'auto',
  padding: '28px 28px 24px',
  animation: 'cropModalIn 250ms cubic-bezier(0.16, 1, 0.3, 1)',
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.1rem',
  fontWeight: 700,
  color: '#0f172a',
};

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

const buttonRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  justifyContent: 'flex-end',
  marginTop: 20,
};

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

  // ESC key handler
  useEffect(() => {
    if (!open) return undefined;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  // Compute aspect ratio for preview overlay
  const selectedRatio = ASPECT_RATIOS.find((r) => r.label === selectedAspect);
  const ratioValue = selectedRatio?.value ?? null;

  return (
    <>
      <style>{CROP_KEYFRAMES}</style>
      <div style={backdropStyle} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div style={modalStyle} role="dialog" aria-modal="true">
          <h2 style={titleStyle}>Crop Image</h2>

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

          <div style={buttonRowStyle}>
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
          </div>
        </div>
      </div>
    </>
  );
}
