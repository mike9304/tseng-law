/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp']
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.tseng-law.com'
          }
        ],
        destination: 'https://tseng-law.com/:path*',
        permanent: true
      }
    ];
  }
};

export default nextConfig;
