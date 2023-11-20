/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: { unoptimized: true },
  output: "export",
  trailingSlash: true,
};

module.exports = nextConfig;
