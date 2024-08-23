import { createRequire } from "module";
const require = createRequire(import.meta.url);

const nextPWA = require("next-pwa");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // distDir: "oust",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      if (config.optimization && config.optimization.splitChunks) {
        config.optimization.splitChunks.maxInitialRequests = 25;
        config.optimization.splitChunks.maxAsyncRequests = 25;
      } else if (config.optimization) {
        config.optimization.splitChunks = {
          maxInitialRequests: 25,
          maxAsyncRequests: 25,
        };
      } else {
        config.optimization = {
          splitChunks: {
            maxInitialRequests: 25,
            maxAsyncRequests: 25,
          },
        };
      }
    }
    return config;
  },
};

const withPWA = nextPWA({
  dest: ".",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

export default withPWA(nextConfig);
