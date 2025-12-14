/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
        optimizePackageImports: ['lucide-react', 'framer-motion'],
    },
};

module.exports = nextConfig;
