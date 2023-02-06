/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (prevConfig) => {
    console.log("webpack 执行");
    prevConfig.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });
    return prevConfig;
  },
  output: 'standalone',
};

module.exports = nextConfig;
