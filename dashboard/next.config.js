/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // appDir já não é mais experimental no Next.js 15
  },
  images: {
    domains: ["localhost", "via.placeholder.com"],
  },
  // Enable WebSocket for real-time features
  webpack: (config, { dev, isServer }) => {
    // Allow WebSocket connections
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  // Redirect API calls to DeckEngine server
  async rewrites() {
    return [
      {
        source: "/api/deckengine/:path*",
        destination: "http://localhost:3000/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
