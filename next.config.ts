/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Next.js 15 has better CSS handling by default, but we can still configure additional options
  experimental: {
    // Enable App Router features
    appDir: true,
    // Enable Server Actions
    serverActions: true,
  },
};

module.exports = nextConfig;
