/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "export",
  trailingSlash: true,
  transpilePackages: ["ui"],
};

module.exports = nextConfig;
