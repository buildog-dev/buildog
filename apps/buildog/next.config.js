/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "export",
  trailingSlash: true,
  transpilePackages: ["ui", "web-sdk"],
};

module.exports = nextConfig;
