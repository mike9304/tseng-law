'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

type CopyLinkButtonProps = {
  className?: string;
  copiedLabel: string;
  href: string;
  label: string;
  style?: CSSProperties;
  dataCopyLink?: string;
};

export function CopyLinkButton({
  className,
  copiedLabel,
  href,
  label,
  style,
  dataCopyLink,
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  async function copyToClipboard(absoluteHref: string) {
    try {
      await navigator.clipboard.writeText(absoluteHref);
      return;
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = absoluteHref;
      textarea.setAttribute('readonly', 'true');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }

  function handleCopy() {
    const absoluteHref = new URL(href, window.location.origin).toString();
    setCopied(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 1800);
    void copyToClipboard(absoluteHref);
  }

  return (
    <button
      className={className}
      data-copy-link={dataCopyLink}
      onClick={handleCopy}
      style={style}
      type="button"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
