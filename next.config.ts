// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["three"],
  experimental: {
    turbo: false, // turn off Turbopack
  },
};

module.exports = nextConfig;
