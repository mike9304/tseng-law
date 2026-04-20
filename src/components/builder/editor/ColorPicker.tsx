'use client';

import { useEffect, useMemo, useState } from 'react';

function normalizeHex(value: string): string {
  if (/^#[0-9a-f]{6}$/i.test(value)) return value.toLowerCase();
  return '#0f172a';
}

function isHex(value: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(value.trim());
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const colorInputStyle: React.CSSProperties = {
  width: 42,
  height: 34,
  padding: 2,
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  background: '#fff',
  cursor: 'pointer',
};

const textInputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  padding: '7px 10px',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  fontSize: '0.82rem',
  color: '#0f172a',
  outline: 'none',
  boxSizing: 'border-box',
};

const sectionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: '#64748b',
};

const swatchRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
};

function swatchStyle(color: string, active: boolean): React.CSSProperties {
  return {
    width: 22,
    height: 22,
    borderRadius: '50%',
    border: active ? '2px solid #0f172a' : '1px solid rgba(15, 23, 42, 0.14)',
    background: color,
    cursor: 'pointer',
    boxShadow: active ? '0 0 0 2px rgba(15, 23, 42, 0.12)' : 'none',
  };
}

export default function ColorPicker({
  value,
  onChange,
  palette,
  disabled = false,
}: {
  value: string;
  onChange: (hex: string) => void;
  palette?: string[];
  disabled?: boolean;
}) {
  const normalizedValue = normalizeHex(value);
  const [textValue, setTextValue] = useState(normalizedValue);
  const [recentColors, setRecentColors] = useState<string[]>([]);

  useEffect(() => {
    setTextValue(normalizedValue);
  }, [normalizedValue]);

  const paletteColors = useMemo(
    () => [...new Set((palette ?? []).map(normalizeHex))],
    [palette],
  );

  const pushRecent = (nextColor: string) => {
    const normalized = normalizeHex(nextColor);
    setRecentColors((current) => [
      normalized,
      ...current.filter((color) => color !== normalized),
    ].slice(0, 4));
  };

  const commitColor = (nextValue: string) => {
    const normalized = normalizeHex(nextValue);
    setTextValue(normalized);
    pushRecent(normalized);
    onChange(normalized);
  };

  return (
    <div style={containerStyle}>
      {paletteColors.length > 0 ? (
        <div style={sectionStyle}>
          <span style={sectionLabelStyle}>브랜드 팔레트</span>
          <div style={swatchRowStyle}>
            {paletteColors.map((color) => (
              <button
                key={color}
                type="button"
                title={color}
                disabled={disabled}
                style={swatchStyle(color, color === normalizedValue)}
                onClick={() => commitColor(color)}
              />
            ))}
          </div>
        </div>
      ) : null}

      {recentColors.length > 0 ? (
        <div style={sectionStyle}>
          <span style={sectionLabelStyle}>최근 색상</span>
          <div style={swatchRowStyle}>
            {recentColors.map((color) => (
              <button
                key={color}
                type="button"
                title={color}
                disabled={disabled}
                style={swatchStyle(color, color === normalizedValue)}
                onClick={() => commitColor(color)}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div style={rowStyle}>
        <input
          type="color"
          value={normalizedValue}
          disabled={disabled}
          style={colorInputStyle}
          onChange={(event) => commitColor(event.target.value)}
        />
        <input
          type="text"
          value={textValue}
          disabled={disabled}
          placeholder="#123b63"
          style={textInputStyle}
          onChange={(event) => {
            const nextValue = event.target.value;
            setTextValue(nextValue);
            if (isHex(nextValue)) {
              onChange(normalizeHex(nextValue));
            }
          }}
          onBlur={() => {
            if (isHex(textValue)) {
              commitColor(textValue);
              return;
            }
            setTextValue(normalizedValue);
          }}
        />
      </div>
    </div>
  );
}
