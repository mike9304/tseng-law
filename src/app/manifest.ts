import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '법무법인 호정',
    short_name: '법무법인 호정',
    description: '대만 회사설립, 소송, 투자 자문을 제공하는 법무법인 호정 공식 사이트',
    start_url: '/ko',
    display: 'standalone',
    background_color: '#fafbfd',
    theme_color: '#aa1d1d',
    icons: [
      {
        src: '/images/brand/hovering-seal-red-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/brand/hovering-seal-red-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
