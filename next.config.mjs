/** @type {import('next').NextConfig} */
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  }
});

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

export default withPWA(nextConfig);
  
// export default nextConfig;
