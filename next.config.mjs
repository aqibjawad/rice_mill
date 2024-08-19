import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const nextPWA = require('next-pwa');

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    // distDir: "oust",
    trailingSlash: true,
    images: {
        unoptimized: true,
    },
};

const withPWA = nextPWA({
    dest: ".",
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
});

export default withPWA(nextConfig);