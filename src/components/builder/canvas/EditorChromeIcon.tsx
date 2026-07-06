import type { ReactNode, SVGProps } from 'react';

export type EditorChromeIconName =
  | 'chevronDown'
  | 'desktop'
  | 'tablet'
  | 'mobile'
  | 'settings'
  | 'keyboard'
  | 'history'
  | 'preview'
  | 'seo'
  | 'publish'
  | 'undo'
  | 'redo'
  | 'close'
  | 'link'
  | 'text'
  | 'image'
  | 'duplicate'
  | 'bringForward'
  | 'sendBackward'
  | 'trash'
  | 'moreHorizontal'
  | 'dragHandle'
  | 'themeLight'
  | 'themeDark'
  | 'themeAuto'
  | 'sparkles';

type EditorChromeIconProps = SVGProps<SVGSVGElement> & {
  name: EditorChromeIconName;
};

export default function EditorChromeIcon({ name, ...props }: EditorChromeIconProps) {
  let icon: ReactNode;

  switch (name) {
    case 'chevronDown':
      icon = <path d="m7 10 5 5 5-5" />;
      break;
    case 'desktop':
      icon = (
        <>
          <rect x="4" y="5" width="16" height="11" rx="1.8" />
          <path d="M9 20h6" />
          <path d="M12 16v4" />
        </>
      );
      break;
    case 'tablet':
      icon = (
        <>
          <rect x="6" y="3.5" width="12" height="17" rx="2.4" />
          <path d="M10.5 17.5h3" />
        </>
      );
      break;
    case 'mobile':
      icon = (
        <>
          <rect x="8" y="3" width="8" height="18" rx="2.2" />
          <path d="M11.2 17.5h1.6" />
        </>
      );
      break;
    case 'settings':
      icon = (
        <>
          <path d="M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Z" />
          <path d="m4.9 10.1 1.1-.6a7.4 7.4 0 0 1 .8-1.9l-.4-1.2 1.8-1.8 1.2.4c.6-.4 1.2-.7 1.9-.8L12 3h2.6l.6 1.1c.7.2 1.3.5 1.9.8l1.2-.4 1.8 1.8-.4 1.2c.4.6.7 1.2.8 1.9l1.1.6v2.6l-1.1.6a7.4 7.4 0 0 1-.8 1.9l.4 1.2-1.8 1.8-1.2-.4a7.4 7.4 0 0 1-1.9.8l-.6 1.1H12l-.6-1.1a7.4 7.4 0 0 1-1.9-.8l-1.2.4-1.8-1.8.4-1.2a7.4 7.4 0 0 1-.8-1.9l-1.1-.6v-2.6Z" />
        </>
      );
      break;
    case 'keyboard':
      icon = (
        <>
          <rect x="3.5" y="6.5" width="17" height="11" rx="2" />
          <path d="M7 10h.01" />
          <path d="M10.3 10h.01" />
          <path d="M13.6 10h.01" />
          <path d="M17 10h.01" />
          <path d="M7 13.8h10" />
        </>
      );
      break;
    case 'history':
      icon = (
        <>
          <path d="M7.2 7.4A7 7 0 1 1 5 12.5" />
          <path d="M7 4.5v3.2h3.2" />
          <path d="M12 8.5v4l3 1.8" />
        </>
      );
      break;
    case 'preview':
      icon = (
        <>
          <path d="M3.8 12s3-5.2 8.2-5.2S20.2 12 20.2 12s-3 5.2-8.2 5.2S3.8 12 3.8 12Z" />
          <circle cx="12" cy="12" r="2.5" />
        </>
      );
      break;
    case 'seo':
      icon = (
        <>
          <circle cx="10.5" cy="10.5" r="5.5" />
          <path d="m15 15 4 4" />
          <path d="M8.3 10.5h4.4" />
          <path d="M10.5 8.3v4.4" />
        </>
      );
      break;
    case 'publish':
      icon = (
        <>
          <path d="M12 19V5" />
          <path d="m6.5 10.5 5.5-5.5 5.5 5.5" />
          <path d="M5 19h14" />
        </>
      );
      break;
    case 'undo':
      icon = (
        <>
          <path d="M8 7H4v4" />
          <path d="M4.7 11a7 7 0 1 0 2-5" />
        </>
      );
      break;
    case 'redo':
      icon = (
        <>
          <path d="M16 7h4v4" />
          <path d="M19.3 11a7 7 0 1 1-2-5" />
        </>
      );
      break;
    case 'close':
      icon = (
        <>
          <path d="M6.5 6.5 17.5 17.5" />
          <path d="M17.5 6.5 6.5 17.5" />
        </>
      );
      break;
    case 'link':
      icon = (
        <>
          <path d="M9.5 14.5 14.5 9.5" />
          <path d="M10.5 7.5 12 6a4 4 0 0 1 5.7 5.7l-1.5 1.5" />
          <path d="M13.5 16.5 12 18a4 4 0 0 1-5.7-5.7l1.5-1.5" />
        </>
      );
      break;
    case 'text':
      icon = (
        <>
          <path d="M5 6h14" />
          <path d="M12 6v12" />
          <path d="M9 18h6" />
        </>
      );
      break;
    case 'image':
      icon = (
        <>
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <circle cx="9" cy="10" r="1.4" />
          <path d="m7 17 3.5-4 2.5 2.7 1.8-1.9L18 17" />
        </>
      );
      break;
    case 'duplicate':
      icon = (
        <>
          <rect x="8" y="8" width="10" height="10" rx="2" />
          <path d="M6 16H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
        </>
      );
      break;
    case 'bringForward':
      icon = (
        <>
          <path d="M12 19V6" />
          <path d="m7 11 5-5 5 5" />
          <path d="M5 19h14" />
        </>
      );
      break;
    case 'sendBackward':
      icon = (
        <>
          <path d="M12 5v13" />
          <path d="m7 13 5 5 5-5" />
          <path d="M5 5h14" />
        </>
      );
      break;
    case 'trash':
      icon = (
        <>
          <path d="M5 7h14" />
          <path d="M9 7V5h6v2" />
          <path d="m8 10 .6 8.5h6.8L16 10" />
          <path d="M10.5 11.5v5" />
          <path d="M13.5 11.5v5" />
        </>
      );
      break;
    case 'moreHorizontal':
      icon = (
        <>
          <circle cx="6.5" cy="12" r="1.2" />
          <circle cx="12" cy="12" r="1.2" />
          <circle cx="17.5" cy="12" r="1.2" />
        </>
      );
      break;
    case 'dragHandle':
      icon = (
        <>
          <path d="M9 5.5h.01" />
          <path d="M15 5.5h.01" />
          <path d="M9 12h.01" />
          <path d="M15 12h.01" />
          <path d="M9 18.5h.01" />
          <path d="M15 18.5h.01" />
        </>
      );
      break;
    case 'themeLight':
      icon = (
        <>
          <circle cx="12" cy="12" r="3.6" />
          <path d="M12 3.5v1.8" />
          <path d="M12 18.7v1.8" />
          <path d="m5.9 5.9 1.3 1.3" />
          <path d="m16.8 16.8 1.3 1.3" />
          <path d="M3.5 12h1.8" />
          <path d="M18.7 12h1.8" />
          <path d="m5.9 18.1 1.3-1.3" />
          <path d="m16.8 7.2 1.3-1.3" />
        </>
      );
      break;
    case 'themeDark':
      icon = <path d="M19 14.5A7.3 7.3 0 0 1 9.5 5a7.3 7.3 0 1 0 9.5 9.5Z" />;
      break;
    case 'themeAuto':
      icon = (
        <>
          <circle cx="12" cy="12" r="7.5" />
          <path d="M12 4.5v15" />
          <path d="M12 4.5a7.5 7.5 0 0 1 0 15" />
        </>
      );
      break;
    case 'sparkles':
      icon = (
        <>
          <path d="M12 3.8 13.2 8l4.2 1.2-4.2 1.2L12 14.6l-1.2-4.2-4.2-1.2L10.8 8 12 3.8Z" />
          <path d="M18.2 14.2 19 17l2.8.8-2.8.8-.8 2.8-.8-2.8-2.8-.8 2.8-.8.8-2.8Z" />
          <path d="M5.4 14.8 6 17l2.2.6-2.2.6-.6 2.2-.6-2.2-2.2-.6 2.2-.6.6-2.2Z" />
        </>
      );
      break;
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {icon}
    </svg>
  );
}
