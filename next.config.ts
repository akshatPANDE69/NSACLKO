// next.config.ts
import { type NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  async headers() {
    return [{
      source: "/game",
      headers: [{ key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" }],
    }];
  },
};

export default nextConfig;
