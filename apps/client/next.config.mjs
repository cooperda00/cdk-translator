/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "export",
  distDir: "dist",
  env: {
    USER_POOL_CLIENT_ID: "4t3kunvfu9cs3q16sjlmiq3ceh",
    USER_POOL_ID: "us-east-1_8QTPSGP3Q",
  },
  transpilePackages: ["@cdk-translator/types"],
};

export default nextConfig;
